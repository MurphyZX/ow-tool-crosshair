"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Filter, Loader2, Search, User } from "lucide-react"

import { CrosshairCard } from "./crosshair-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CrosshairListItem } from "@/lib/types/crosshair"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

type SortOption = "latest" | "popular" | "name"

const HERO_OPTIONS = ["通用", "源氏", "黑百合", "末日铁拳", "艾什", "猎空", "回声", "士兵76", "卡西迪"].map((hero) => ({
  label: hero,
  value: hero,
}))

const SORT_OPTIONS: Record<SortOption, string> = {
  latest: "最新发布",
  popular: "最热门",
  name: "按名称",
}

const PAGE_SIZE = 12

interface CrosshairApiResponse {
  items: CrosshairListItem[]
  nextPage: number | null
  hasMore: boolean
}

export function CrosshairGallery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [authorQuery, setAuthorQuery] = useState("")
  const [selectedHero, setSelectedHero] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("latest")

  const debouncedSearch = useDebouncedValue(searchQuery, 400)
  const debouncedAuthor = useDebouncedValue(authorQuery, 400)

  const intersectionRef = useRef<HTMLDivElement | null>(null)

  const queryKey = useMemo(
    () => ["crosshairs", { hero: selectedHero, search: debouncedSearch, author: debouncedAuthor, sortBy }],
    [selectedHero, debouncedSearch, debouncedAuthor, sortBy],
  )

  const fetchCrosshairs = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      limit: PAGE_SIZE.toString(),
      sort: sortBy,
    })

    if (debouncedSearch) {
      params.set("search", debouncedSearch)
    }

    if (debouncedAuthor) {
      params.set("author", debouncedAuthor)
    }

    if (selectedHero !== "all") {
      params.set("hero", selectedHero)
    }

    const response = await fetch(`/api/crosshairs?${params.toString()}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("加载准星列表失败")
    }

    return (await response.json()) as CrosshairApiResponse
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    status,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn: fetchCrosshairs,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    refetchOnWindowFocus: false,
  })

  const items = data?.pages.flatMap((page) => page.items) ?? []
  const showEmpty = !isPending && items.length === 0 && status === "success"

  useEffect(() => {
    const target = intersectionRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: "320px" },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, queryKey])

  return (
    <section id="gallery" className="border-b border-border py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            准星<span className="text-primary">库</span>
          </h2>
          <p className="text-muted-foreground">浏览社区和职业选手分享的准星配置，在游戏中手动应用</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="按名称搜索准星..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative flex-1">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="按作者过滤..."
                value={authorQuery}
                onChange={(event) => setAuthorQuery(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <Select value={selectedHero} onValueChange={setSelectedHero}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="选择英雄" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部英雄</SelectItem>
                  {HERO_OPTIONS.map((hero) => (
                    <SelectItem key={hero.value} value={hero.value}>
                      {hero.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="排序" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SORT_OPTIONS) as SortOption[]).map((option) => (
                    <SelectItem key={option} value={option}>
                      {SORT_OPTIONS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isFetching && !isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                列表更新中
              </div>
            )}
          </div>
        </div>

        {status === "error" ? (
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-10 text-center text-destructive">
            {(error as Error)?.message ?? "获取准星数据失败"}
          </div>
        ) : showEmpty ? (
          <div className="mt-16 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-lg font-medium">暂时没有符合条件的准星</p>
            <p className="mt-2 text-sm text-muted-foreground">修改筛选条件，或分享你的准星配置</p>
          </div>
        ) : (
          <>
            {isPending ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-72 rounded-2xl border border-border/50 bg-muted/40 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((crosshair) => (
                  <CrosshairCard key={crosshair.id} crosshair={crosshair} />
                ))}
              </div>
            )}

            <div ref={intersectionRef} className="h-1" />

            {isFetchingNextPage && (
              <div className="mt-10 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                加载更多准星...
              </div>
            )}

            {!hasNextPage && !isPending && items.length > 0 && (
              <div className="mt-10 text-center text-sm text-muted-foreground">已经滑到底啦</div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
