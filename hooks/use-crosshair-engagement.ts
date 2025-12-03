"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useSession } from "@/lib/auth-client"

interface UseCrosshairEngagementOptions {
  initialLiked?: boolean
  initialFavorited?: boolean
  initialLikeCount?: number
}

interface LikeResponse {
  liked: boolean
  likeCount: number
}

interface FavoriteResponse {
  favorited: boolean
}

export function useCrosshairEngagement(crosshairId: number, options: UseCrosshairEngagementOptions = {}) {
  const { initialFavorited = false, initialLiked = false, initialLikeCount = 0 } = options
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [liked, setLiked] = useState(initialLiked)
  const [favorited, setFavorited] = useState(initialFavorited)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [likePending, setLikePending] = useState(false)
  const [favoritePending, setFavoritePending] = useState(false)

  useEffect(() => {
    setLiked(initialLiked)
  }, [initialLiked, crosshairId])

  useEffect(() => {
    setFavorited(initialFavorited)
  }, [initialFavorited, crosshairId])

  useEffect(() => {
    setLikeCount(initialLikeCount)
  }, [initialLikeCount, crosshairId])

  const redirectTarget = useMemo(() => {
    const base = pathname ?? "/"
    const query = searchParams?.toString()
    return query ? `${base}?${query}` : base
  }, [pathname, searchParams])

  const ensureAuthenticated = useCallback(() => {
    if (session) {
      return true
    }

    router.push(`/sign-in?redirect=${encodeURIComponent(redirectTarget)}`)
    return false
  }, [session, router, redirectTarget])

  const toggleLike = useCallback(async () => {
    if (likePending || !ensureAuthenticated()) {
      return
    }

    setLikePending(true)

    try {
      const response = await fetch(`/api/crosshairs/${crosshairId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: liked ? "unlike" : "like" }),
      })

      if (!response.ok) {
        throw new Error("点赞失败")
      }

      const data = (await response.json()) as LikeResponse
      setLiked(data.liked)
      setLikeCount(data.likeCount)
    } catch (error) {
      console.error("Failed to toggle like", error)
    } finally {
      setLikePending(false)
    }
  }, [crosshairId, liked, ensureAuthenticated, likePending])

  const toggleFavorite = useCallback(async () => {
    if (favoritePending || !ensureAuthenticated()) {
      return
    }

    setFavoritePending(true)

    try {
      const response = await fetch(`/api/crosshairs/${crosshairId}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: favorited ? "unfavorite" : "favorite" }),
      })

      if (!response.ok) {
        throw new Error("收藏失败")
      }

      const data = (await response.json()) as FavoriteResponse
      setFavorited(data.favorited)
    } catch (error) {
      console.error("Failed to toggle favorite", error)
    } finally {
      setFavoritePending(false)
    }
  }, [crosshairId, favorited, ensureAuthenticated, favoritePending])

  return {
    favorited,
    favoritePending,
    liked,
    likeCount,
    likePending,
    toggleFavorite,
    toggleLike,
  }
}
