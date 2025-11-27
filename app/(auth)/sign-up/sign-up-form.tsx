"use client"

import { FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { signUp } from "@/lib/auth-client"

type SignUpFormProps = {
  redirectTo: string
}

export function SignUpForm({ redirectTo }: SignUpFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectParam = searchParams?.get("redirect")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await signUp.email(
        {
          name,
          email,
          password,
          callbackURL: redirectTo,
        },
        {
          onError: (ctx) => {
            setError(ctx.error?.message ?? ctx.error ?? "注册失败，请重试")
          },
          onSuccess: () => {
            router.push(redirectTo || "/dashboard")
          },
        },
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败，请重试")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">昵称 / 游戏 ID</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="OWPlayer"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={2}
          maxLength={120}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">密码</Label>
        <div className="flex items-center gap-2">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="至少 8 位"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "隐藏密码" : "显示密码"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            注册中...
          </>
        ) : (
          "注册"
        )}
      </Button>

      {redirectParam ? (
        <p className="text-center text-xs text-muted-foreground">
          注册成功后将跳转到：<span className="font-medium">{redirectParam}</span>
        </p>
      ) : null}
    </form>
  )
}
