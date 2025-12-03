# OW Crosshair · 守望先锋准星分享平台

> 创建、管理与浏览高质量的守望先锋准星配置，面向职业选手和社区创作者。

## 项目简介

OW Crosshair 是一个基于 Next.js App Router 的准星分享站点，覆盖准星列表、详情、创建、以及个人控制台。数据通过 Supabase + Drizzle ORM 持久化，鉴权由 Better Auth（含定制微信扫码插件）负责，截图存储在任意兼容 S3 的对象存储中。React Query 和自定义无限滚动体验支撑了准星库的实时浏览。

## 功能亮点

- **准星库与筛选**：`components/crosshair-gallery.tsx` 通过 `/api/crosshairs` 提供搜索、作者过滤、英雄过滤、排序以及 IntersectionObserver 无限滚动。
- **准星详情页**：`app/crosshair/[id]/page.tsx` 展示截图、参数、作者信息，并推荐同英雄的其他配置。
- **个人控制台**：`app/dashboard/page.tsx` 允许已登录用户查看并删除自己的准星。
- **准星创建器**：`app/create/page.tsx` 支持拖拽上传截图、表单校验（Zod）和 `createCrosshairAction` Server Action 原子写入。
- **多渠道登录**：Better Auth + 邮箱密码 + 可选微信扫码（`lib/plugins/wechat-oauth.ts`），`proxy.ts` 中间件统一保护 `/create`、`/dashboard`、`/api/upload-image` 等路由。
- **S3 图片上传**：`app/api/upload-image` 调用 `lib/storage/s3.ts` 进行大小/格式校验、对象存储和回显 URL，删除准星时同步删除对象。
- **点赞、收藏与个人主页**：`hooks/use-crosshair-engagement.ts` 驱动 `CrosshairCard` 与准星详情中的点赞/收藏即时反馈，`/profile` 页面集中展示我创建/点赞/收藏的准星，并通过 `/api/crosshairs/[id]/(like|favorite)` 与 `crosshair_likes`、`crosshair_favorites` 表落盘。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | Next.js 16 (App Router)、React 19、TypeScript、Tailwind CSS + Shadcn UI + magicui、Lucide Icons |
| 状态 | TanStack Query、React Hook Form、Zod、自定义 `useDebouncedValue` |
| 鉴权 | Better Auth + Drizzle Adapter + 自研微信插件 (`lib/plugins/wechat-oauth.ts`) |
| 数据 | Supabase Postgres、Drizzle ORM (`lib/db` + `drizzle.config.ts`) |
| 存储 | 任意兼容 S3 的对象存储（AWS S3、R2、MinIO…） |
| 其他 | Vercel Analytics、Node 20+、ESLint 9、pnpm |

## 快速开始

1. **准备运行环境**
   - Node.js ≥ 20（Next.js 16 官方要求）
   - 推荐包管理器：pnpm 9（亦可使用 npm/yarn/bun）
2. **安装依赖**

   ```bash
   pnpm install
   ```

3. **配置环境变量**
   - 复制 `env.example` 为 `.env.local` 并填写所有标注为必填的键（见下文表格）
4. **初始化数据库**

   ```bash
    pnpm db:push    # 将 crosshairs 与 Better Auth 表结构推送到 Supabase
    pnpm db:studio  # 可选：打开 Drizzle Studio 检查数据
   ```

5. **启动开发服务器**

   ```bash
   pnpm dev
   ```

   访问 `http://localhost:3000` 即可体验。生产构建请运行 `pnpm build && pnpm start`。

## 环境变量

### 基础配置

| 键 | 是否必填 | 说明 |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Supabase Postgres 连接串，`drizzle-orm` 与 Better Auth 共享 |
| `BETTER_AUTH_SECRET` | ✅ | 用于签发/验证会话的随机长字符串 |
| `NEXT_PUBLIC_SITE_URL` | ✅ | 站点公网地址，影响鉴权回调、邮件链接等 |

### 微信登录

| 键 | 是否必填 | 说明 |
| --- | --- | --- |
| `WECHAT_APP_ID` / `WECHAT_APP_SECRET` | 当启用微信登录时必填 | 来自微信开放平台 |
| `WECHAT_LANG` | 可选 | `cn` / `en`，决定界面文案 |
| `WECHAT_SYNTHETIC_EMAIL_DOMAIN` | 可选 | 给无邮箱账号生成临时邮箱的域名 |
| `WECHAT_LOGIN_ENABLED` | 可选 | `true/false`，禁用后界面与插件都会被剔除 |
| `WECHAT_DEBUG` | 可选 | `true` 时输出更多日志 |

### 对象存储

| 键 | 是否必填 | 说明 |
| --- | --- | --- |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | ✅ | 对象存储凭证 |
| `S3_BUCKET_NAME` | ✅ | 用于保存准星截图的桶 |
| `S3_REGION` | 推荐 | 用于拼装默认公共 URL |
| `S3_ENDPOINT` | 可选 | 兼容 R2、MinIO 时需要 |
| `S3_FORCE_PATH_STYLE` | 可选 | MinIO 等需要开启路径样式时设为 `true` |
| `S3_PUBLIC_URL` | 可选 | 指定公共访问前缀（优先级高于 `S3_REGION`） |

> `.env.local` 默认不会被提交。所有配置均遵循 KISS：仅提供当前已实现能力所需的键，YAGNI 地保留未来扩展。

## 常用脚本

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动 Next.js 开发服务器 |
| `pnpm build` / `pnpm start` | 生产构建与启动 |
| `pnpm lint` | 运行 ESLint 9 |
| `pnpm db:push` | 根据 `lib/db/schema.ts` 更新数据库 |
| `pnpm db:studio` | 打开 Drizzle Studio |

## 数据流与核心模块

### 鉴权与路由保护
- Better Auth（`lib/auth.ts`）使用 Drizzle Adapter 将用户、会话信息写入 Supabase，并通过 `authClient` 暴露 `signIn/signUp/signOut/useSession`。
- `proxy.ts` 作为 Next Middleware 拦截敏感路由，依据 cookie 粗筛 session 并决定是否重定向、403 或继续。

### 准星 CRUD
- `createCrosshairAction` 和 `deleteCrosshairAction` 为 Server Action，复用 `crosshairFormSchema` (Zod) 保证服务端校验，并触发 `revalidatePath` 让首页/创建页/控制台实时刷新。
- `lib/data/crosshairs.ts` 中的缓存查询负责列表、详情、关联推荐。

### API 与前端状态
- `/api/crosshairs` 负责分页、过滤、排序，`components/crosshair-gallery.tsx` 搭配 React Query 实现客户端无限滚动与去抖搜索。
- `/api/upload-image` 先验证 session，再调用 `uploadCrosshairImage` (S3) 保存文件并返回 URL/Key；`deleteCrosshairAction` 在删除记录后回收对象。

### UI 与交互
- Tailwind + Shadcn UI 构建 UI，`QueryProvider` 统一注入 React Query。
- `crosshair-preview.tsx` 提供基于 SVG 的本地预览，`getPreviewSettings` 根据颜色/类型映射生成预览参数。
- `app/sign-in` / `app/sign-up` 中的 React Hook Form + Zod 提供即时校验；`WeChatSignInButton` 调用自研插件 endpoint。

## 目录速览

```
app/                    # App Router 页面、Server Actions、API Routes
├─actions/              # 准星 CRUD Server Actions
├─api/                  # REST 风格的 Next Route Handlers
├─create|crosshair|...  # 业务页面
components/             # 站点级 UI、模块组件、providers
doc/                    # TODO、技术选型等补充文档
hooks/                  # 自定义 hooks（如 use-debounced-value）
lib/
├─auth*.ts              # Better Auth 配置 & 客户端
├─constants/            # 英雄列表等常量
├─data/                 # 数据访问封装（Drizzle 查询）
├─db/                   # Schema 与类型
├─plugins/              # 微信 OAuth 插件
├─storage/              # S3 封装
├─validations/          # 表单验证
public/                 # 静态资源（OW Logo 等）
proxy.ts                # Next Middleware 路由保护
```

## 开发约定

- **KISS**：前端组件拆分保持单一职责，如 `CrosshairGallery` 专注列表逻辑、`CrosshairCard` 专注展示。
- **DRY**：Form 校验逻辑集中在 `lib/validations`，Server Action 和客户端共享。
- **YAGNI**：仅实现当前所需（如点赞数仅做前端乐观展示，未连接后端 API）。
- **SOLID**：跨层依赖通过 `lib` 抽象，如 `lib/storage/s3.ts` 提供统一接口，防止页面直接引用 AWS SDK。

## Roadmap

`doc/TODO.md` 列出下一步工作，部分重点如下：

- `/heroes/[name]` 英雄维度页面
- 职业选手专区与排行榜
- 点赞、收藏、评论系统
- 主题切换与中英双语

## 相关文档

- `doc/技术选型.md`：全栈选型一览
- `doc/TODO.md`：里程碑与待办

欢迎基于以上文档继续扩展功能，提交变更前请自查 `pnpm lint` 并确保 `.env.local` 中的敏感信息未被提交。
