"use client"

import Link from "next/link"
import { Crosshair, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

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

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#gallery" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            准星库
          </Link>
          <Link href="/create" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            分享准星
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link href="/create">分享准星</Link>
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isOpen && (
        <nav className="flex flex-col gap-4 border-t border-border bg-background p-4 md:hidden">
          <Link href="/#gallery" className="text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>
            准星库
          </Link>
          <Link href="/create" className="text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>
            分享准星
          </Link>
          <Button className="w-full" asChild>
            <Link href="/create">分享准星</Link>
          </Button>
        </nav>
      )}
    </header>
  )
}
