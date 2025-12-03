"use client"

import { Bookmark, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCrosshairEngagement } from "@/hooks/use-crosshair-engagement"

interface CrosshairEngagementBarProps {
  crosshairId: number
  initialLikeCount: number
  initialFavorited?: boolean
  initialLiked?: boolean
}

export function CrosshairEngagementBar({
  crosshairId,
  initialFavorited,
  initialLiked,
  initialLikeCount,
}: CrosshairEngagementBarProps) {
  const { favorited, favoritePending, liked, likeCount, likePending, toggleFavorite, toggleLike } = useCrosshairEngagement(
    crosshairId,
    { initialFavorited, initialLiked, initialLikeCount },
  )

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Button
        variant="secondary"
        size="sm"
        className={liked ? "border border-red-200/70 bg-red-50 text-red-600 hover:bg-red-100" : ""}
        onClick={toggleLike}
        disabled={likePending}
        aria-pressed={liked}
      >
        <Heart className={`mr-1.5 h-4 w-4 ${liked ? "fill-current" : ""}`} />
        {liked ? "已点赞" : "点赞"}
      </Button>
      <span className="flex items-center gap-1 text-muted-foreground">
        <Heart className="h-4 w-4" />
        {likeCount.toLocaleString()} 次点赞
      </span>
      <Button
        variant="ghost"
        size="sm"
        className={favorited ? "text-amber-600" : "text-muted-foreground"}
        onClick={toggleFavorite}
        disabled={favoritePending}
        aria-pressed={favorited}
      >
        <Bookmark className={`mr-1.5 h-4 w-4 ${favorited ? "fill-current" : ""}`} />
        {favorited ? "已收藏" : "收藏"}
      </Button>
      {favorited ? <span className="text-xs text-amber-600">已加入个人收藏</span> : null}
    </div>
  )
}
