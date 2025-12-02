"use client"

import { useRouter } from "next/navigation"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HEROES } from "@/lib/constants/heroes"

export function HeroSwitcher({ currentSlug }: { currentSlug: string }) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-background/60 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted-foreground">快速切换英雄，查看不同角色的专属准星。</p>
      <Select
        value={currentSlug}
        onValueChange={(value) => {
          if (value !== currentSlug) {
            router.push(`/heroes/${value}`)
          }
        }}
      >
        <SelectTrigger className="w-full md:w-64">
          <SelectValue placeholder="选择英雄" />
        </SelectTrigger>
        <SelectContent>
          {HEROES.map((hero) => (
            <SelectItem key={hero.slug} value={hero.slug}>
              {hero.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
