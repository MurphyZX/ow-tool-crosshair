"use server"

import { NextRequest, NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { crosshairFavorites, crosshairs } from "@/lib/db/schema"

type FavoriteAction = "favorite" | "unfavorite"

interface FavoriteResponse {
  favorited: boolean
}

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const crosshairId = Number(id)

    if (!Number.isInteger(crosshairId) || crosshairId <= 0) {
      return NextResponse.json({ message: "无效的准星 ID" }, { status: 400 })
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ message: "请先登录后再收藏" }, { status: 401 })
    }

    const payload = await parseFavoritePayload(request)

    if (!payload) {
      return NextResponse.json({ message: "无法解析操作指令" }, { status: 400 })
    }

    const result = await db.transaction<FavoriteResponse | null>(async (tx) => {
      const [crosshair] = await tx.select({ id: crosshairs.id }).from(crosshairs).where(eq(crosshairs.id, crosshairId)).limit(1)

      if (!crosshair) {
        return null
      }

      if (payload.action === "favorite") {
        const [existing] = await tx
          .select({ id: crosshairFavorites.id })
          .from(crosshairFavorites)
          .where(and(eq(crosshairFavorites.crosshairId, crosshairId), eq(crosshairFavorites.userId, session.user.id)))
          .limit(1)

        if (existing) {
          return { favorited: true }
        }

        await tx.insert(crosshairFavorites).values({ crosshairId, userId: session.user.id })
        return { favorited: true }
      }

      await tx
        .delete(crosshairFavorites)
        .where(and(eq(crosshairFavorites.crosshairId, crosshairId), eq(crosshairFavorites.userId, session.user.id)))

      return { favorited: false }
    })

    if (!result) {
      return NextResponse.json({ message: "准星不存在" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[POST /api/crosshairs/[id]/favorite] failed", error)
    return NextResponse.json({ message: "收藏失败，请稍后再试" }, { status: 500 })
  }
}

async function parseFavoritePayload(request: NextRequest): Promise<{ action: FavoriteAction } | null> {
  try {
    const data = (await request.json()) as { action?: FavoriteAction }
    if (data.action === "favorite" || data.action === "unfavorite") {
      return { action: data.action }
    }
    return null
  } catch {
    return null
  }
}
