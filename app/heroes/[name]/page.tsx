import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CrosshairGallery } from "@/components/crosshair-gallery"
import { HeroSwitcher } from "@/components/hero-switcher"
import { HEROES, HERO_BY_SLUG } from "@/lib/constants/heroes"

interface HeroPageProps {
  params: { name: string }
}

export async function generateStaticParams() {
  return HEROES.map((hero) => ({ name: hero.slug }))
}

export function generateMetadata({ params }: HeroPageProps): Metadata {
  const { name } = params
  const hero = HERO_BY_SLUG[name]

  if (!hero) {
    return {
      title: "未知英雄 - OW Crosshair",
    }
  }

  const baseTitle = `${hero.name} 准星 - OW Crosshair`

  return {
    title: baseTitle,
    description: `浏览适用于${hero.name}的精选准星配置，结合社区与职业玩家推荐，构建更稳定的发挥。`,
  }
}

export default function HeroPage({ params }: HeroPageProps) {
  const { name } = params
  const hero = HERO_BY_SLUG[name]

  if (!hero) {
    notFound()
  }

  const heroHeader = (
    <div className="space-y-4">
      <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-primary">
          首页
        </Link>
        <span>/</span>
        <Link href="/heroes/general" className="transition-colors hover:text-primary">
          英雄准星
        </Link>
        <span>/</span>
        <span className="text-foreground">{hero.name}</span>
      </nav>

      <div className="rounded-3xl border border-border bg-background/70 p-6 shadow-sm backdrop-blur lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 text-center lg:text-left">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">英雄 · {hero.role}</p>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">{hero.name} 准星推荐</h1>
            <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">{hero.description}</p>
          </div>
          <div className="w-full lg:w-80">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">快速切换</p>
            <HeroSwitcher currentSlug={hero.slug} />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CrosshairGallery
        key={hero.slug}
        titlePrefix={`${hero.name} `}
        titleAccent="准星库"
        description={`精选适用于 ${hero.name} 的准星配置，结合社区评分与职业选手经验，支持滚动加载与搜索筛选。`}
        defaultHero={hero.slug}
        heroLocked
        headerSlot={heroHeader}
      />

      <Footer />
    </main>
  )
}
