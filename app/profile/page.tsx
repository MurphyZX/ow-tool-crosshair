import Image from "next/image"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CrosshairCard } from "@/components/crosshair-card"
import { DeleteCrosshairForm } from "@/components/delete-crosshair-form"
import type { CrosshairListItem } from "@/lib/types/crosshair"
import {
  getCrosshairsByUser,
  getUserFavoritedCrosshairs,
  getUserLikedCrosshairs,
} from "@/lib/data/crosshairs"
import { auth } from "@/lib/auth"
import { HERO_BY_SLUG } from "@/lib/constants/heroes"

export const revalidate = 0

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in?redirect=/profile")
  }

  const [myCrosshairs, likedCrosshairs, favoriteCrosshairs] = await Promise.all([
    getCrosshairsByUser(session.user.id),
    getUserLikedCrosshairs(session.user.id),
    getUserFavoritedCrosshairs(session.user.id),
  ])

  const likedItems = likedCrosshairs.map((item) => ({ ...item, isLikedByViewer: true }))
  const favoriteItems = favoriteCrosshairs.map((item) => ({ ...item, isFavoritedByViewer: true }))

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
          <section className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground">个人主页</p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {session.user.name ?? session.user.email}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              在这里统一管理你发布、点赞与收藏的守望先锋准星，随时回顾灵感并继续分享。
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/create">分享新的准星</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">返回首页</Link>
              </Button>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard label="我创建的准星" value={myCrosshairs.length} description="可直接在此页面管理与删除" />
            <StatCard label="我点赞的准星" value={likedItems.length} description="首页可继续点赞/取消点赞" />
            <StatCard label="我收藏的准星" value={favoriteItems.length} description="收藏仅自己可见" />
          </section>

          <CrosshairSection
            title="我创建的准星"
            description="集中展示所有由你分享的准星配置，可继续管理或删除。"
            items={myCrosshairs}
            emptyHint="你还没有发布任何准星，点击上方按钮快速创建。"
            ctaLabel="去创建"
            ctaHref="/create"
            variant="owned"
          />

          <CrosshairSection
            title="我点赞的准星"
            description="保留你认可的优质准星，方便随时回看。"
            items={likedItems}
            emptyHint="点赞列表为空，去首页看看社区最新分享吧。"
            ctaLabel="浏览准星库"
            ctaHref="/#gallery"
          />

          <CrosshairSection
            title="我收藏的准星"
            description="收藏用于长期保存，便于在不同英雄或模式中快速切换。"
            items={favoriteItems}
            emptyHint="收藏列表为空，收藏后才会出现在这里。"
            ctaLabel="开始收藏"
            ctaHref="/#gallery"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

function CrosshairSection({
  title,
  description,
  items,
  emptyHint,
  ctaHref,
  ctaLabel,
  variant = "default",
}: {
  title: string
  description: string
  items: CrosshairListItem[]
  emptyHint: string
  ctaLabel: string
  ctaHref: string
  variant?: "default" | "owned"
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="link" asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
      {items.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) =>
            variant === "owned" ? (
              <OwnedCrosshairCard key={item.id} crosshair={item} />
            ) : (
              <CrosshairCard key={item.id} crosshair={item} />
            ),
          )}
        </div>
      ) : (
        <Card className="border-dashed border-border/70 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">{title}为空</CardTitle>
            <CardDescription>{emptyHint}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

function StatCard({ label, value, description }: { label: string; value: number; description: string }) {
  return (
    <Card className="border-border/70 bg-card/70">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function OwnedCrosshairCard({ crosshair }: { crosshair: CrosshairListItem }) {
  const heroName = HERO_BY_SLUG[crosshair.hero]?.name ?? crosshair.hero
  const createdAt = new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(crosshair.createdAt)

  return (
    <Card className="border-border bg-card/60">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">{crosshair.name}</CardTitle>
          <CardDescription className="text-xs font-semibold">{heroName}</CardDescription>
        </div>
        <CardDescription className="flex flex-wrap items-center gap-2 text-xs">
          <span>{crosshair.type}</span>
          <span className="text-muted-foreground">|</span>
          <span>{crosshair.color}</span>
          <span className="text-muted-foreground">|</span>
          <span>{createdAt}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {crosshair.imageUrl ? (
          <div className="relative h-40 w-full overflow-hidden rounded-lg">
            <Image
              src={crosshair.imageUrl}
              alt={`${crosshair.name} 截图`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : null}
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
        <DeleteCrosshairForm crosshairId={crosshair.id} dense />
      </CardContent>
    </Card>
  )
}
