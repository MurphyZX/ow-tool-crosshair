"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { signUp } from "@/lib/auth-client"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

type SignUpFormProps = {
  redirectTo: string
}

const signUpSchema = z.object({
  name: z.string().min(2, "昵称至少 2 个字符").max(120, "昵称过长"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少 8 位"),
})

type SignUpValues = z.infer<typeof signUpSchema>

export function SignUpForm({ redirectTo }: SignUpFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const redirectParam = searchParams?.get("redirect")

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signUp.email(
        {
          ...values,
          callbackURL: redirectTo,
        },
        {
          onError: (ctx) => {
            setError("root", { message: ctx.error?.message ?? ctx.error ?? "注册失败，请重试" })
          },
          onSuccess: () => {
            reset()
            router.push(redirectTo || "/dashboard")
          },
        },
      )
    } catch (error) {
      setError("root", { message: error instanceof Error ? error.message : "注册失败，请重试" })
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">昵称 / 游戏 ID</Label>
        <Input
          id="name"
          type="text"
          placeholder="OWPlayer"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">密码</Label>
        <div className="flex items-center gap-2">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="至少 8 位"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
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
        {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
      </div>

      {errors.root?.message ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{errors.root.message}</span>
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
