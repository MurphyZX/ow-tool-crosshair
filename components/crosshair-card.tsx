"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Eye, Heart } from "lucide-react"
import { CrosshairPreview } from "./crosshair-preview"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { CrosshairListItem } from "@/lib/types/crosshair"
import { getPreviewSettings } from "@/lib/crosshair-preview-settings"
import { HERO_BY_SLUG } from "@/lib/constants/heroes"
import { useCrosshairEngagement } from "@/hooks/use-crosshair-engagement"

export function CrosshairCard({ crosshair }: { crosshair: CrosshairListItem }) {
  const heroName = HERO_BY_SLUG[crosshair.hero]?.name ?? crosshair.hero

  const previewSettings = useMemo(() => getPreviewSettings(crosshair), [crosshair])
  const { favorited, favoritePending, liked, likeCount, likePending, toggleFavorite, toggleLike } = useCrosshairEngagement(crosshair.id, {
    initialLiked: crosshair.isLikedByViewer,
    initialFavorited: crosshair.isFavoritedByViewer,
    initialLikeCount: crosshair.likes ?? 0,
  })

  const hasImage = Boolean(crosshair.imageUrl)

  return (
    <Card className="group overflow-hidden transition-all hover:border-primary/50">
      <Link
        href={`/crosshair/${crosshair.id}`}
        className="relative block aspect-video overflow-hidden bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {hasImage ? (
          <Image
            src={crosshair.imageUrl ?? "/placeholder.svg"}
            alt={`${crosshair.name} 截图`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <CrosshairPreview settings={previewSettings} />
        )}
        <div className="absolute right-2 top-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {heroName}
          </Badge>
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <Link
              href={`/crosshair/${crosshair.id}`}
              className="font-semibold transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {crosshair.name}
            </Link>
            <p className="text-sm text-muted-foreground">by {crosshair.author}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className={liked ? "text-red-500" : "text-muted-foreground"}
              onClick={toggleLike}
              disabled={likePending}
              aria-pressed={liked}
              aria-label={liked ? "取消点赞" : "点赞"}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={favorited ? "text-amber-500" : "text-muted-foreground"}
              onClick={toggleFavorite}
              disabled={favoritePending}
              aria-pressed={favorited}
              aria-label={favorited ? "取消收藏" : "收藏准星"}
            >
              <Bookmark className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {likeCount.toLocaleString()}
          </span>
          <div className="flex items-center gap-3">
            <Button variant="link" className="h-auto p-0 text-primary" asChild>
              <Link href={`/crosshair/${crosshair.id}`}>查看详情</Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="h-auto p-0 text-primary">
                  <Eye className="mr-1 h-3 w-3" />
                  查看设置
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{crosshair.name} - 准星设置</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-secondary">
                    {hasImage ? (
                      <Image
                        src={crosshair.imageUrl ?? "/placeholder.svg"}
                        alt={`${crosshair.name} 截图`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <CrosshairPreview settings={previewSettings} />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <SettingItem label="类型" value={crosshair.type} />
                    <SettingItem label="显示精准度" value={crosshair.showAccuracy ? "开" : "关"} />
                    <SettingItem label="颜色" value={crosshair.color} />
                    <SettingItem label="粗细" value={crosshair.thickness} />
                    <SettingItem label="准星长度" value={crosshair.crosshairLength} />
                    <SettingItem label="中心间隙" value={crosshair.centerGap} />
                    <SettingItem label="不透明度" value={crosshair.opacity} />
                    <SettingItem label="轮廓不透明度" value={crosshair.outlineOpacity} />
                    <SettingItem label="圆点大小" value={crosshair.dotSize} />
                    <SettingItem label="圆点不透明度" value={crosshair.dotOpacity} />
                    <SettingItem label="缩放" value={`${crosshair.scale}x`} />
                  </div>
                  <p className="text-xs text-muted-foreground">在游戏中进入 设置 → 控制 → 准星 来应用这些设置</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SettingItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between rounded bg-secondary/50 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
