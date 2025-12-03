**英雄分类完成情况**

- /heroes/[name] 动态路由已存在，generateStaticParams 基于 HEROES 枚举英雄 slug 并注入 HeroSwitcher，完成了按英雄分类浏览（app/heroes/[name]/page.tsx (lines 15-90)）。该页面利用 CrosshairGallery 复用无限滚动、排序、筛选体验，基础功能已落地。

**P0｜立即需要优化/补齐**

- 统一“英雄”字段以 slug 为主键：创建表单和筛选逻辑目前全都传输中文名称（app/create/page.tsx (lines 21-178)、components/crosshair-gallery.tsx (lines 51-84)），而 hero 页面又依赖 slug（HeroSwitcher 传递 currentSlug）。建议在表单层面写入 slug，在 API 层转换为展示名，保证 i18n 与数据一致性（DRY + KISS），同时更新 crosshairs.hero 字段与查询（app/api/crosshairs/route.ts (lines 38-83)）。
- 首屏渲染与 SEO：HeroPage 仍然渲染一个完全客户端的 CrosshairGallery（app/heroes/[name]/page.tsx (lines 75-89)），导致首屏为空白并重复请求。优先让页面在服务器预取首批列表、通过 React Query initialData 或 server component 直出，以减少 CLS 并符合 KISS。
- 类型契约修正：HeroPageProps 被定义成 params: Promise<{ name: string }> 并在 generateMetadata/HeroPage 中 await（app/heroes/[name]/page.tsx (lines 11-40)），与 Next.js 规范不符，潜在破坏 IDE 类型提示。把 params 改回普通对象可避免隐式 Promise，顺带让 doc/TODO.md (lines 11-13) 标记“英雄分类页”已完成。

**P1｜下一轮迭代重点**

- 职业选手专区：doc/TODO.md (line 13) 仍未开始，实现时需在 crosshairs 表扩展职业标签或新表，并提供 /pro 列表及筛选，复用现有 gallery（符合 YAGNI——只做展示 +筛选，不提前实现战队 CMS）。
- 点赞/收藏与个人主页：已上线 `/api/crosshairs/[id]/like|favorite`、`hooks/use-crosshair-engagement.ts` 与 `/profile` 聚合页，点赞/收藏状态在 `CrosshairCard` 与准星详情可即时反馈。后续可考虑增加收藏夹分组或批量管理能力，以及在列表页展示“已收藏”标签强化状态感知。
- 评论系统：可在 /crosshair/[id] 下方添加评论区，同时封装 Server Action + React Query mutation，沿用 lib/validations 中央校验，避免重复（DRY）。

**P2｜体验增强（不阻塞发布）**

- 排行榜与精选内容：在 doc/TODO.md (line 23) 已列出，可复用现有排序字段生成一周榜、总榜，或缓存于 lib/data/crosshairs.ts，属于“读多写少”场景。
- 主题/国际化：doc/TODO.md (lines 24-25)、doc/技术选型.md (lines 8-9) 已选定 next-themes 与 next-intl，但代码尚未集成。待数据与核心互动稳定后再做，以免引入额外复杂度（YAGNI）。
