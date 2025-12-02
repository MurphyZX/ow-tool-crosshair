import Image from "next/image"
import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image src="/ow.svg" alt="OW logo" width={40} height={40} className="h-10 w-10" />
              <span className="text-xl font-bold">
                OW<span className="text-primary">准星</span>
              </span>
            </Link>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              守望先锋准星分享平台，帮助玩家找到最适合自己的准星配置，提升游戏体验。
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">快速链接</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#gallery" className="hover:text-foreground">
                  准星库
                </Link>
              </li>
              <li>
                <Link href="#create" className="hover:text-foreground">
                  创建准星
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  职业选手设置
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  使用指南
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">英雄分类</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  输出英雄
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  重装英雄
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  支援英雄
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 OW准星. 本站与暴雪娱乐无关联。</p>
        </div>
      </div>
    </footer>
  )
}
