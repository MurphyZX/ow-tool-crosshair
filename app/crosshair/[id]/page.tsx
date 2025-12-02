import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarDays, Heart, MessageSquareMore } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CrosshairPreview } from "@/components/crosshair-preview"
import { CrosshairCard } from "@/components/crosshair-card"
import { getCrosshairById, getRelatedCrosshairs } from "@/lib/data/crosshairs"
import { getPreviewSettings } from "@/lib/crosshair-preview-settings"

export const revalidate = 0

export default async function CrosshairDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const crosshairId = Number(id)

  if (!Number.isInteger(crosshairId) || crosshairId <= 0) {
    notFound()
  }

  const crosshair = await getCrosshairById(crosshairId)

  if (!crosshair) {
    notFound()
  }

  const related = await getRelatedCrosshairs({
    hero: crosshair.hero,
    excludeId: crosshair.id,
    limit: 3,
  })

  const previewSettings = getPreviewSettings(crosshair)
  const createdAt = new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(crosshair.createdAt)

  const settings = [
    { label: "类型", value: crosshair.type },
    { label: "显示精准度", value: crosshair.showAccuracy ? "开" : "关" },
    { label: "颜色", value: crosshair.color },
    { label: "粗细", value: crosshair.thickness },
    { label: "准星长度", value: crosshair.crosshairLength },
    { label: "中心间隙", value: crosshair.centerGap },
    { label: "不透明度", value: `${crosshair.opacity}%` },
    { label: "轮廓不透明度", value: `${crosshair.outlineOpacity}%` },
    { label: "圆点大小", value: crosshair.dotSize },
    { label: "圆点不透明度", value: `${crosshair.dotOpacity}%` },
    { label: "缩放", value: `${crosshair.scale}x` },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-10 md:py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <Button variant="ghost" size="sm" asChild className="mb-8 w-fit px-0 text-muted-foreground hover:text-primary">
            <Link href="/#gallery">← 返回准星库</Link>
          </Button>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
                {crosshair.imageUrl ? (
                  <Image
                    src={crosshair.imageUrl}
                    alt={`${crosshair.name} 截图`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <CrosshairPreview settings={previewSettings} />
                )}
              </div>

              <section className="rounded-2xl border border-border bg-card/60 p-6">
                <h2 className="mb-3 text-lg font-semibold">准星描述</h2>
                <p className="text-sm text-muted-foreground">{crosshair.description ?? "作者暂未提供更多描述。"}</p>
              </section>

              <section className="rounded-2xl border border-dashed border-border bg-card/30 p-6">
                <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                  <MessageSquareMore className="h-4 w-4" />
                  <h2 className="text-base font-semibold">评论区</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  评论与讨论功能正在开发中。欢迎先点赞收藏，或分享到社区与好友。
                </p>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-2xl border border-border bg-card/60 p-6">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <Badge variant="secondary">{crosshair.hero}</Badge>
                  <span className="text-sm text-muted-foreground">#{crosshair.id}</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{crosshair.name}</h1>
                <p className="mt-2 text-sm text-muted-foreground">by {crosshair.author}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {Number(crosshair.likes ?? 0).toLocaleString()} 次点赞
                  </span>
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card/60 p-6">
                <h2 className="mb-4 text-lg font-semibold">准星参数</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {settings.map((item) => (
                    <SettingItem key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card/60 p-6">
                <h2 className="mb-4 text-lg font-semibold">打算尝试？</h2>
                <p className="text-sm text-muted-foreground">
                  打开守望先锋 → 设置 → 控制 → 准星，将上述参数逐项输入即可完成配置。稍后会提供一键复制准星代码功能。
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/create">分享我的准星</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">管理我的准星</Link>
                  </Button>
                </div>
              </section>
            </div>
          </div>

          {related.length > 0 ? (
            <section className="mt-16">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold">更多 {crosshair.hero} 准星</h2>
                  <p className="text-sm text-muted-foreground">继续浏览其他玩家分享的配置，寻找灵感</p>
                </div>
                <Button variant="ghost" asChild>
                  <Link href="/#gallery">查看全部</Link>
                </Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <CrosshairCard key={item.id} crosshair={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function SettingItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}
