"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { AlertCircle, Loader2, QrCode } from "lucide-react"

type WeChatSignInButtonProps = {
  redirectTo: string
}

type WeChatSignInResponse = {
  url: string
  redirect?: boolean
}

export function WeChatSignInButton({ redirectTo }: WeChatSignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleWechatLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await authClient.$fetch<WeChatSignInResponse>("/sign-in/wechat", {
        method: "POST",
        body: {
          callbackURL: redirectTo,
          errorCallbackURL: "/sign-in",
          newUserCallbackURL: redirectTo,
          disableRedirect: true,
        },
      })

      if (response.error || !response.data?.url) {
        throw new Error(response.error?.message ?? "微信授权地址获取失败")
      }

      window.location.href = response.data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "跳转到微信失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" className="w-full" disabled={loading} onClick={handleWechatLogin}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            正在打开微信...
          </>
        ) : (
          <>
            <QrCode className="mr-2 h-4 w-4" />
            使用微信扫码登录
          </>
        )}
      </Button>
      {error ? (
        <p className="flex items-center justify-center gap-2 text-sm text-destructive" role="status">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}
