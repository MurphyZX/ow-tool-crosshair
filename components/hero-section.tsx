import Link from "next/link"

import { Crosshair, Copy, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { Highlighter } from "@/components/ui/highlighter"
import { SparklesText } from "@/components/ui/sparkles-text"

export function HeroSection() {
  const highlightPropsUnderline = {
    action: "underline" as const,
    color: "#FF9800",
    strokeWidth: 2,
    padding: 6,
  }

  const highlightPropsHighlight = {
    action: "highlight" as const,
    color: "#87CEFA",
    strokeWidth: 2,
    padding: 6,
  }

  return (
    <section className="relative overflow-hidden border-b border-border py-20 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
        <FlickeringGrid
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-70"
          squareSize={3}
          gridGap={5}
          flickerChance={0.18}
          color="#6B7280"
          maxOpacity={0.3}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center text-center">

          <h1 className="sr-only">找到你的完美准星</h1>
          <SparklesText
            aria-hidden
            className="mb-6 max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            找到你的{" "}
            <span className="text-primary">
              完美准星
            </span>
          </SparklesText>

          <p className="mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            浏览
            <Highlighter {...highlightPropsUnderline}>职业选手</Highlighter>
            和
            <Highlighter {...highlightPropsUnderline}>社区分享</Highlighter>
            的准星设置，
            {/* 一键复制准星代码功能暂不可用，待官方支持后恢复展示 */}
            <Highlighter {...highlightPropsHighlight}>创建</Highlighter>
            属于你自己的
            <Highlighter {...highlightPropsHighlight}>准星配置</Highlighter>
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="#gallery">
                <Copy className="h-4 w-4" />
                浏览准星
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              职业选手设置
            </Button>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link href="/heroes/general">
                <Crosshair className="h-4 w-4" />
                英雄分类
              </Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">2,500+</div>
              <div className="text-sm text-muted-foreground">准星配置</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">150+</div>
              <div className="text-sm text-muted-foreground">职业选手</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">50K+</div>
              <div className="text-sm text-muted-foreground">活跃用户</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
