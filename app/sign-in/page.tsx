import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthCardShell } from "@/components/auth-card-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignInForm } from "./sign-in-form"
import { WeChatSignInButton } from "./wechat-sign-in-button"

type SignInPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = (await searchParams) ?? {}
  const redirectParam = typeof params.redirect === "string" ? params.redirect : undefined
  const redirectTo = redirectParam?.startsWith("/") ? redirectParam : "/dashboard"
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <AuthCardShell>
          <Card className="relative z-[1] rounded-[inherit] border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold">登录 / Login</CardTitle>
              <CardDescription>使用邮箱和密码登录，开始管理你的准星。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SignInForm redirectTo={redirectTo} />
              {process.env.WECHAT_LOGIN_ENABLED === undefined ||
              /^true$/i.test(process.env.WECHAT_LOGIN_ENABLED) ? (
                <div className="space-y-2 pt-2">
                  <p className="text-center text-xs uppercase text-muted-foreground tracking-[0.2em]">或</p>
                  <WeChatSignInButton redirectTo={redirectTo} />
                </div>
              ) : null}
              <p className="text-center text-sm text-muted-foreground">
                还没有账号？{" "}
                <Link
                  href={`/sign-up${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  立即注册
                </Link>
              </p>
            </CardContent>
          </Card>
        </AuthCardShell>
      </main>
      <Footer />
    </div>
  )
}
