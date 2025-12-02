import "server-only"

import type { BetterAuthPlugin } from "better-auth"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "@/lib/db"
import * as authSchema from "@/lib/db/auth-schema"
import { wechatOAuth } from "@/lib/plugins/wechat-oauth"

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const authBaseURL = `${siteUrl}/api/auth`

const wechatAppId = process.env.WECHAT_APP_ID
const wechatAppSecret = process.env.WECHAT_APP_SECRET
const authPlugins: BetterAuthPlugin[] = []

if (wechatAppId && wechatAppSecret) {
  authPlugins.push(
    wechatOAuth({
      appId: wechatAppId,
      appSecret: wechatAppSecret,
      lang: process.env.WECHAT_LANG === "en" ? "en" : "cn",
      syntheticEmailDomain: process.env.WECHAT_SYNTHETIC_EMAIL_DOMAIN,
      debug: /^true$/i.test(process.env.WECHAT_DEBUG ?? ""),
    }),
  )
} else if (process.env.NODE_ENV !== "production" && (wechatAppId || wechatAppSecret)) {
  console.warn("WECHAT_APP_ID/WECHAT_APP_SECRET 未全部配置，微信登录功能将被跳过。")
}

export const auth = betterAuth({
  baseURL: authBaseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  plugins: authPlugins,
})

export type Auth = typeof auth
