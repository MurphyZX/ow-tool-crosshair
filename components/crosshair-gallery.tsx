"use client"

import { useMemo, useState } from "react"
import { CrosshairCard } from "./crosshair-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CrosshairListItem } from "@/lib/types/crosshair"

const heroes = ["全部", "通用", "源氏", "黑百合", "末日铁拳", "艾什", "猎空", "回声", "士兵76", "卡西迪"]
type SortOption = "popular" | "name"

const isSortOption = (value: string): value is SortOption => value === "popular" || value === "name"

interface CrosshairGalleryProps {
  crosshairs: CrosshairListItem[]
}

export function CrosshairGallery({ crosshairs }: CrosshairGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHero, setSelectedHero] = useState("全部")
  const [sortBy, setSortBy] = useState<SortOption>("popular")
  const handleSortChange = (value: string) => {
    if (isSortOption(value)) {
      setSortBy(value)
    }
  }

  const filteredCrosshairs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return [...crosshairs]
      .filter((c) => {
        const matchesSearch =
          !normalizedQuery ||
          c.name.toLowerCase().includes(normalizedQuery) ||
          c.author.toLowerCase().includes(normalizedQuery)
        const matchesHero = selectedHero === "全部" || c.hero === selectedHero
        return matchesSearch && matchesHero
      })
      .sort((a, b) => {
        if (sortBy === "popular") return Number(b.likes ?? 0) - Number(a.likes ?? 0)
        return a.name.localeCompare(b.name, "zh-CN")
      })
  }, [crosshairs, searchQuery, selectedHero, sortBy])

  return (
    <section id="gallery" className="border-b border-border py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            准星<span className="text-primary">库</span>
          </h2>
          <p className="text-muted-foreground">浏览社区和职业选手分享的准星配置，在游戏中手动应用</p>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索准星或作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-3">
            <Select value={selectedHero} onValueChange={setSelectedHero}>
              <SelectTrigger className="w-32">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {heroes.map((hero) => (
                  <SelectItem key={hero} value={hero}>
                    {hero}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">最热门</SelectItem>
                <SelectItem value="name">按名称</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredCrosshairs.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCrosshairs.map((crosshair) => (
                <CrosshairCard key={crosshair.id} crosshair={crosshair} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                加载更多
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-16 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-lg font-medium">暂时没有符合条件的准星</p>
            <p className="mt-2 text-sm text-muted-foreground">调整搜索条件，或前往“分享你的准星”来创建一个</p>
          </div>
        )}
      </div>
    </section>
  )
}
