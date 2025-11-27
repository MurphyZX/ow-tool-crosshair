import { Crosshair, Copy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border py-20 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Crosshair className="h-4 w-4" />
            守望先锋准星分享平台
          </div>

          <h1 className="mb-6 max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            找到你的
            <span className="text-primary">完美准星</span>
          </h1>

          <p className="mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            浏览职业选手和社区分享的准星设置，一键复制游戏代码，或创建属于你自己的准星配置
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              <Copy className="h-4 w-4" />
              浏览准星
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              职业选手设置
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
