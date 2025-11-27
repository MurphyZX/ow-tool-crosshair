import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignUpForm } from "./sign-up-form"

type SignUpPageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  const redirectParam = typeof searchParams?.redirect === "string" ? searchParams?.redirect : undefined
  const redirectTo = redirectParam?.startsWith("/") ? redirectParam : "/dashboard"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-border bg-card/60">
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
        </div>
      </main>
      <Footer />
    </div>
  )
}
