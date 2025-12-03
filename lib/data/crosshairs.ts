import { cache } from "react"
import { and, desc, eq, ne, or, type SQL } from "drizzle-orm"

import { db } from "@/lib/db"
import { crosshairs } from "@/lib/db/schema"
import type { CrosshairListItem } from "@/lib/types/crosshair"
import { getHeroIdentifierVariants } from "@/lib/constants/heroes"

export const crosshairSelection = {
  id: crosshairs.id,
  name: crosshairs.name,
  author: crosshairs.author,
  hero: crosshairs.hero,
  description: crosshairs.description,
  type: crosshairs.type,
  color: crosshairs.color,
  thickness: crosshairs.thickness,
  crosshairLength: crosshairs.crosshairLength,
  centerGap: crosshairs.centerGap,
  opacity: crosshairs.opacity,
  outlineOpacity: crosshairs.outlineOpacity,
  dotSize: crosshairs.dotSize,
  dotOpacity: crosshairs.dotOpacity,
  scale: crosshairs.scale,
  showAccuracy: crosshairs.showAccuracy,
  likes: crosshairs.likes,
  imageUrl: crosshairs.imageUrl,
  userId: crosshairs.userId,
  createdAt: crosshairs.createdAt,
} as const

export const getLatestCrosshairs = cache(async (limit = 24): Promise<CrosshairListItem[]> => {
  const rows = await db
    .select(crosshairSelection)
    .from(crosshairs)
    .orderBy(desc(crosshairs.createdAt))
    .limit(limit)

  return rows
})

export const getCrosshairsByUser = cache(async (userId: string): Promise<CrosshairListItem[]> => {
  const rows = await db
    .select(crosshairSelection)
    .from(crosshairs)
    .where(eq(crosshairs.userId, userId))
    .orderBy(desc(crosshairs.createdAt))

  return rows
})

export const getCrosshairById = cache(async (id: number): Promise<CrosshairListItem | null> => {
  const rows = await db.select(crosshairSelection).from(crosshairs).where(eq(crosshairs.id, id)).limit(1)

  return rows[0] ?? null
})

export const getRelatedCrosshairs = cache(
  async ({ hero, excludeId, limit = 3 }: { hero: string; excludeId: number; limit?: number }): Promise<CrosshairListItem[]> => {
    const heroVariants = getHeroIdentifierVariants(hero)
    const heroConditions = heroVariants.length
      ? heroVariants.map((variant) => eq(crosshairs.hero, variant))
      : [eq(crosshairs.hero, hero)]
    const heroWhere: SQL<unknown> = heroConditions.length === 1 ? heroConditions[0]! : or(...heroConditions)

    const rows = await db
      .select(crosshairSelection)
      .from(crosshairs)
      .where(and(heroWhere, ne(crosshairs.id, excludeId)))
      .orderBy(desc(crosshairs.createdAt))
      .limit(limit)

    return rows
  },
)
