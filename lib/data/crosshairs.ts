import { cache } from "react"
import { desc } from "drizzle-orm"

import { db } from "@/lib/db"
import { crosshairs } from "@/lib/db/schema"
import type { CrosshairListItem } from "@/lib/types/crosshair"

export const getLatestCrosshairs = cache(async (limit = 24): Promise<CrosshairListItem[]> => {
  const rows = await db
    .select({
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
      createdAt: crosshairs.createdAt,
    })
    .from(crosshairs)
    .orderBy(desc(crosshairs.createdAt))
    .limit(limit)

  return rows
})
