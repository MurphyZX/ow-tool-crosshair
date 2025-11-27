"use client"

import { useState } from "react"
import { CrosshairCard } from "./crosshair-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const crosshairs = [
  {
    id: 1,
    name: "Carpe 经典",
    author: "Carpe",
    hero: "源氏",
    likes: 1234,
    settings: {
      type: "十字线",
      showAccuracy: false,
      color: "绿色",
      thickness: 1,
      crosshairLength: 6,
      centerGap: 4,
      opacity: 100,
      outlineOpacity: 100,
      dotSize: 4,
      dotOpacity: 100,
      scale: 1,
    },
  },
  {
    id: 2,
    name: "精准猎手",
    author: "Ans",
    hero: "黑百合",
    likes: 987,
    settings: {
      type: "十字线",
      showAccuracy: false,
      color: "粉色",
      thickness: 1,
      crosshairLength: 10,
      centerGap: 6,
      opacity: 100,
      outlineOpacity: 80,
      dotSize: 0,
      dotOpacity: 0,
      scale: 1,
    },
  },
  {
    id: 3,
    name: "近战之王",
    author: "Sp9rk1e",
    hero: "末日铁拳",
    likes: 756,
    settings: {
      type: "圆点",
      showAccuracy: false,
      color: "黄色",
      thickness: 0,
      crosshairLength: 0,
      centerGap: 0,
      opacity: 100,
      outlineOpacity: 0,
      dotSize: 6,
      dotOpacity: 100,
      scale: 1,
    },
  },
  {
    id: 4,
    name: "狙击之眼",
    author: "Profit",
    hero: "艾什",
    likes: 654,
    settings: {
      type: "十字线",
      showAccuracy: false,
      color: "青色",
      thickness: 2,
      crosshairLength: 8,
      centerGap: 5,
      opacity: 100,
      outlineOpacity: 100,
      dotSize: 3,
      dotOpacity: 100,
      scale: 1,
    },
  },
  {
    id: 5,
    name: "追踪专用",
    author: "Decay",
    hero: "猎空",
    likes: 543,
    settings: {
      type: "圆形",
      showAccuracy: true,
      color: "红色",
      thickness: 1,
      crosshairLength: 0,
      centerGap: 8,
      opacity: 80,
      outlineOpacity: 0,
      dotSize: 4,
      dotOpacity: 100,
      scale: 1,
    },
  },
  {
    id: 6,
    name: "弹道大师",
    author: "Fleta",
    hero: "回声",
    likes: 432,
    settings: {
      type: "十字线",
      showAccuracy: false,
      color: "白色",
      thickness: 1,
      crosshairLength: 5,
      centerGap: 3,
      opacity: 100,
      outlineOpacity: 100,
      dotSize: 0,
      dotOpacity: 0,
      scale: 1,
    },
  },
]

const heroes = ["全部", "源氏", "黑百合", "末日铁拳", "艾什", "猎空", "回声", "士兵76", "麦克雷"]

export function CrosshairGallery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHero, setSelectedHero] = useState("全部")
  const [sortBy, setSortBy] = useState("popular")

  const filteredCrosshairs = crosshairs
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesHero = selectedHero === "全部" || c.hero === selectedHero
      return matchesSearch && matchesHero
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.likes - a.likes
      return a.name.localeCompare(b.name)
    })

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

            <Select value={sortBy} onValueChange={setSortBy}>
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
      </div>
    </section>
  )
}
