import type { BetterAuthPlugin } from "better-auth"
import { createAuthEndpoint } from "better-auth/api"
import { generateState, parseState } from "better-auth"
import { setSessionCookie } from "better-auth/cookies"
import { z } from "zod"

type WeChatOAuthOptions = {
  appId: string
  appSecret: string
  lang?: "cn" | "en"
  syntheticEmailDomain?: string
  debug?: boolean
}

const AUTH_URL = "https://open.weixin.qq.com/connect/qrconnect"
const TOKEN_URL = "https://api.weixin.qq.com/sns/oauth2/access_token"
const USERINFO_URL = "https://api.weixin.qq.com/sns/userinfo"

const mask = (value?: string) => (value ? `${value.slice(0, 6)}...${value.slice(-4)}` : "none")

const fetchJson = async (target: string | URL) => {
  const response = await fetch(target.toString())
  if (!response.ok) {
    throw new Error(`request_failed_${response.status}`)
  }
  return (await response.json()) as Record<string, unknown>
}

export function wechatOAuth(options: WeChatOAuthOptions): BetterAuthPlugin {
  const lang = options.lang ?? "cn"
  const syntheticEmailDomain = options.syntheticEmailDomain ?? "wechat.local"
  const debug = Boolean(options.debug)

  return {
    id: "wechat-oauth",
    endpoints: {
      signInWeChat: createAuthEndpoint(
        "/sign-in/wechat",
        {
          method: "POST",
          body: z
            .object({
              callbackURL: z.string().optional(),
              errorCallbackURL: z.string().optional(),
              newUserCallbackURL: z.string().optional(),
              disableRedirect: z.boolean().optional(),
            })
            .optional() as any,
        },
        async (ctx) => {
          const { state } = await generateState(ctx)

          const redirectUri = `${ctx.context.baseURL}/oauth2/callback/wechat`
          const url = new URL(AUTH_URL)
          url.searchParams.set("appid", options.appId)
          url.searchParams.set("redirect_uri", redirectUri)
          url.searchParams.set("response_type", "code")
          url.searchParams.set("scope", "snsapi_login")
          url.searchParams.set("state", state)
          url.searchParams.set("lang", lang)
          const authorizeUrl = `${url.toString()}#wechat_redirect`

          if (debug) {
            ctx.context.logger?.debug("wechat.signInWeChat", {
              baseURL: ctx.context.baseURL,
              redirectUri,
              state,
              authorizeUrl,
            })
          }

          return ctx.json({
            url: authorizeUrl,
            redirect: !(ctx.body && ctx.body.disableRedirect),
          })
        },
      ),
      wechatCallback: createAuthEndpoint(
        "/oauth2/callback/wechat",
        {
          method: "GET",
          query: z
            .object({
              code: z.string().optional(),
              state: z.string().optional(),
              error: z.string().optional(),
            })
            .optional() as any,
        },
        async (ctx) => {
          if (ctx.query?.error || !ctx.query?.code) {
            const err = ctx.query?.error ?? "wechat_code_missing"
            throw ctx.redirect(`${ctx.context.baseURL}/error?error=${encodeURIComponent(err)}`)
          }

          const { callbackURL, errorURL, newUserURL } = await parseState(ctx)

          if (debug) {
            ctx.context.logger?.debug("wechat.callback.query", {
              hasCode: Boolean(ctx.query.code),
              codeLength: ctx.query.code?.length,
              state: ctx.query.state,
              callbackURL,
              errorURL,
              newUserURL,
            })
          }

          const tokenUrl = new URL(TOKEN_URL)
          tokenUrl.searchParams.set("appid", options.appId)
          tokenUrl.searchParams.set("secret", options.appSecret)
          tokenUrl.searchParams.set("code", ctx.query.code)
          tokenUrl.searchParams.set("grant_type", "authorization_code")

          const tokenResponse = (await fetchJson(tokenUrl)) as {
            errcode?: number
            errmsg?: string
            access_token?: string
            refresh_token?: string
            openid?: string
            scope?: string
            expires_in?: number
          }

          if (!tokenResponse || tokenResponse.errcode) {
            if (debug) {
              ctx.context.logger?.error("wechat.callback.token_error", tokenResponse)
            }
            throw ctx.redirect(
              `${errorURL || callbackURL || ctx.context.baseURL}/error?error=${encodeURIComponent(
                tokenResponse?.errmsg ?? "wechat_token_error",
              )}`,
            )
          }

          if (!tokenResponse.access_token || !tokenResponse.openid) {
            if (debug) {
              ctx.context.logger?.error("wechat.callback.token_missing_fields", {
                hasAccessToken: Boolean(tokenResponse.access_token),
                hasOpenId: Boolean(tokenResponse.openid),
              })
            }
            throw ctx.redirect(
              `${errorURL || callbackURL || ctx.context.baseURL}/error?error=wechat_token_missing_fields`,
            )
          }

          const userInfoUrl = new URL(USERINFO_URL)
          userInfoUrl.searchParams.set("access_token", tokenResponse.access_token)
          userInfoUrl.searchParams.set("openid", tokenResponse.openid)
          userInfoUrl.searchParams.set("lang", lang === "cn" ? "zh_CN" : "en")

          const profile = (await fetchJson(userInfoUrl)) as {
            errcode?: number
            errmsg?: string
            unionid?: string
            openid?: string
            nickname?: string
            headimgurl?: string
          }

          if (!profile || profile.errcode) {
            if (debug) {
              ctx.context.logger?.error("wechat.callback.userinfo_error", profile)
            }
            throw ctx.redirect(
              `${errorURL || callbackURL || ctx.context.baseURL}/error?error=${encodeURIComponent(
                profile?.errmsg ?? "wechat_userinfo_error",
              )}`,
            )
          }

          const accountId = profile.unionid || profile.openid || tokenResponse.openid
          const email = `${accountId}@${syntheticEmailDomain}`.toLowerCase()

          if (debug) {
            ctx.context.logger?.debug("wechat.callback.profile", {
              idMasked: mask(accountId),
              hasUnionId: Boolean(profile.unionid),
              hasOpenId: Boolean(profile.openid),
              nicknameLength: profile.nickname?.length,
              scope: tokenResponse.scope,
              accessTokenMasked: mask(tokenResponse.access_token),
              refreshTokenMasked: mask(tokenResponse.refresh_token),
              expiresIn: tokenResponse.expires_in,
            })
          }

          const existing = await ctx.context.internalAdapter
            .findOAuthUser(email, accountId, "wechat")
            .catch(() => null)

          let user = existing?.user
          let isRegister = false

          if (existing) {
            const linkedAccount = existing.accounts.find((acc: any) => acc.providerId === "wechat")
            const accessTokenExpiresAt = tokenResponse.expires_in
              ? new Date(Date.now() + tokenResponse.expires_in * 1000)
              : undefined
            if (!linkedAccount) {
              await ctx.context.internalAdapter.linkAccount({
                providerId: "wechat",
                accountId: accountId.toString(),
                userId: existing.user.id,
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token,
                accessTokenExpiresAt,
                scope: tokenResponse.scope,
              })
            } else {
              const values = Object.fromEntries(
                Object.entries({
                  accessToken: tokenResponse.access_token,
                  refreshToken: tokenResponse.refresh_token,
                  accessTokenExpiresAt,
                  scope: tokenResponse.scope,
                }).filter(([, value]) => value !== undefined),
              )
              if (Object.keys(values).length > 0) {
                await ctx.context.internalAdapter.updateAccount(linkedAccount.id, values as any)
              }
            }
          } else {
            const created = await ctx.context.internalAdapter
              .createOAuthUser(
                {
                  email,
                  emailVerified: true,
                  name: profile.nickname,
                  image: profile.headimgurl,
                },
                {
                  providerId: "wechat",
                  accountId: accountId.toString(),
                  accessToken: tokenResponse.access_token,
                  refreshToken: tokenResponse.refresh_token,
                  accessTokenExpiresAt: tokenResponse.expires_in
                    ? new Date(Date.now() + tokenResponse.expires_in * 1000)
                    : undefined,
                  scope: tokenResponse.scope,
                },
              )
              .then((result: any) => result?.user)
              .catch((err: unknown) => {
                if (debug) {
                  ctx.context.logger?.error("wechat.callback.create_user_failed", err)
                }
                return null
              })

            if (!created) {
              throw ctx.redirect(`${errorURL || callbackURL || ctx.context.baseURL}/error?error=unable_to_create_user`)
            }

            user = created
            isRegister = true
          }

          if (!user) {
            throw ctx.redirect(`${errorURL || callbackURL || ctx.context.baseURL}/error?error=user_not_found`)
          }

          const session = await ctx.context.internalAdapter.createSession(user.id, ctx)
          if (!session) {
            throw ctx.redirect(`${errorURL || callbackURL || ctx.context.baseURL}/error?error=unable_to_create_session`)
          }

          await setSessionCookie(ctx, { session, user })
          const target = isRegister ? newUserURL || callbackURL : callbackURL
          if (debug) {
            ctx.context.logger?.debug("wechat.callback.success", {
              userIdMasked: mask(user.id),
              target,
              isRegister,
            })
          }
          throw ctx.redirect(target || ctx.context.baseURL)
        },
      ),
    },
  }
}
