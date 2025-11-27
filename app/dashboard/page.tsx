import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"
import { getCrosshairsByUser } from "@/lib/data/crosshairs"
import { DeleteCrosshairForm } from "./_components/delete-crosshair-form"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in?redirect=/dashboard")
  }

  const crosshairs = await getCrosshairsByUser(session.user.id)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
          <div className="flex flex-col gap-3 border-b border-border pb-6">
            <div>
              <p className="text-sm text-muted-foreground">已登录账号</p>
              <p className="text-lg font-semibold">{session.user.name ?? session.user.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/create">创建新准星</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">返回首页</Link>
              </Button>
              <Badge variant="secondary">共 {crosshairs.length} 个准星</Badge>
            </div>
          </div>

          {crosshairs.length === 0 ? (
            <Card className="border-dashed border-border bg-card/50 text-center">
              <CardHeader>
                <CardTitle>还没有发布任何准星</CardTitle>
                <CardDescription>创建你的第一个准星配置，方便其他守望先锋玩家使用。</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/create">立即创建</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {crosshairs.map((crosshair) => (
                <Card key={crosshair.id} className="border-border bg-card/60">
                  <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-lg">{crosshair.name}</CardTitle>
                      <Badge variant="outline">{crosshair.hero}</Badge>
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-2 text-xs">
                      <span>{crosshair.type}</span>
                      <span className="text-muted-foreground">|</span>
                      <span>{crosshair.color}</span>
                      <span className="text-muted-foreground">|</span>
                      <span>{new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(crosshair.createdAt)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {crosshair.description ? (
                      <p className="text-muted-foreground">{crosshair.description}</p>
                    ) : (
                      <p className="text-muted-foreground/70">暂无描述</p>
                    )}
                    <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs">
                      <div>
                        <p className="text-muted-foreground">粗细</p>
                        <p className="font-semibold">{crosshair.thickness}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">准星长度</p>
                        <p className="font-semibold">{crosshair.crosshairLength}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">中心间隙</p>
                        <p className="font-semibold">{crosshair.centerGap}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">不透明度</p>
                        <p className="font-semibold">{crosshair.opacity}</p>
                      </div>
                    </div>
                    <DeleteCrosshairForm crosshairId={crosshair.id} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
