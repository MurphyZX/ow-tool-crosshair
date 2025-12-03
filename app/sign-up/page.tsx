import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthCardShell } from "@/components/auth-card-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignUpForm } from "./sign-up-form"

type SignUpPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = (await searchParams) ?? {}
  const redirectParam = typeof params.redirect === "string" ? params.redirect : undefined
  const redirectTo = redirectParam?.startsWith("/") ? redirectParam : "/profile"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <AuthCardShell>
          <Card className="relative z-[1] rounded-[inherit] border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold">注册 / Sign Up</CardTitle>
              <CardDescription>创建一个账号，保存并管理你分享的准星配置。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SignUpForm redirectTo={redirectTo} />
              <p className="text-center text-sm text-muted-foreground">
                已有账号？{" "}
                <Link
                  href={`/sign-in${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  去登录
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
