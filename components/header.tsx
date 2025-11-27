"use client"

import Link from "next/link"
import { Crosshair, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Crosshair className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            OW<span className="text-primary">准星</span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">你好，{session.user.name ?? session.user.email}</span>
              <Button variant="outline" asChild>
                <Link href="/dashboard">我的准星</Link>
              </Button>
              <Button asChild>
                <Link href="/create">分享准星</Link>
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                退出
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/sign-in">登录</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/sign-up">注册</Link>
              </Button>
              <Button asChild>
                <Link href="/create">分享准星</Link>
              </Button>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isOpen && (
        <nav className="flex flex-col gap-4 border-t border-border bg-background p-4 md:hidden">
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>
                我的准星
              </Link>
              <Button className="w-full" asChild>
                <Link href="/create">分享准星</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  setIsOpen(false)
                  await handleSignOut()
                }}
              >
                退出登录
              </Button>
            </>
          ) : (
            <>
              <Button className="w-full" asChild>
                <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                  登录
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                  注册
                </Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/create">分享准星</Link>
              </Button>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
