"use server"

import { NextRequest, NextResponse } from "next/server"
import { and, eq, sql } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { crosshairLikes, crosshairs } from "@/lib/db/schema"

type LikeAction = "like" | "unlike"

interface LikeResponse {
  liked: boolean
  likeCount: number
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
      return NextResponse.json({ message: "请先登录后再点赞" }, { status: 401 })
    }

    const payload = await parseLikePayload(request)

    if (!payload) {
      return NextResponse.json({ message: "无法解析操作指令" }, { status: 400 })
    }

    const result = await db.transaction<LikeResponse | null>(async (tx) => {
      const [crosshair] = await tx
        .select({ id: crosshairs.id })
        .from(crosshairs)
        .where(eq(crosshairs.id, crosshairId))
        .limit(1)

      if (!crosshair) {
        return null
      }

      if (payload.action === "like") {
        const [existing] = await tx
          .select({ id: crosshairLikes.id })
          .from(crosshairLikes)
          .where(and(eq(crosshairLikes.crosshairId, crosshairId), eq(crosshairLikes.userId, session.user.id)))
          .limit(1)

        if (existing) {
          const [current] = await tx
            .select({ likes: crosshairs.likes })
            .from(crosshairs)
            .where(eq(crosshairs.id, crosshairId))
            .limit(1)

          return { liked: true, likeCount: current?.likes ?? 0 }
        }

        await tx.insert(crosshairLikes).values({
          crosshairId,
          userId: session.user.id,
        })

        const [updated] = await tx
          .update(crosshairs)
          .set({ likes: sql`${crosshairs.likes} + 1` })
          .where(eq(crosshairs.id, crosshairId))
          .returning({ likes: crosshairs.likes })

        return { liked: true, likeCount: updated?.likes ?? 0 }
      }

      const [existing] = await tx
        .select({ id: crosshairLikes.id })
        .from(crosshairLikes)
        .where(and(eq(crosshairLikes.crosshairId, crosshairId), eq(crosshairLikes.userId, session.user.id)))
        .limit(1)

      if (!existing) {
        const [current] = await tx
          .select({ likes: crosshairs.likes })
          .from(crosshairs)
          .where(eq(crosshairs.id, crosshairId))
          .limit(1)

        return { liked: false, likeCount: current?.likes ?? 0 }
      }

      await tx.delete(crosshairLikes).where(eq(crosshairLikes.id, existing.id))

      const [updated] = await tx
        .update(crosshairs)
        .set({ likes: sql`GREATEST(${crosshairs.likes} - 1, 0)` })
        .where(eq(crosshairs.id, crosshairId))
        .returning({ likes: crosshairs.likes })

      return { liked: false, likeCount: updated?.likes ?? 0 }
    })

    if (!result) {
      return NextResponse.json({ message: "准星不存在" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[POST /api/crosshairs/[id]/like] failed", error)
    return NextResponse.json({ message: "点赞失败，请稍后再试" }, { status: 500 })
  }
}

async function parseLikePayload(request: NextRequest): Promise<{ action: LikeAction } | null> {
  try {
    const data = (await request.json()) as { action?: LikeAction }
    if (data.action === "like" || data.action === "unlike") {
      return { action: data.action }
    }
    return null
  } catch {
    return null
  }
}
