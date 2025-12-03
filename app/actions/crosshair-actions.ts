"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { z } from "zod"

import { db } from "@/lib/db"
import { crosshairs } from "@/lib/db/schema"
import { crosshairFormSchema } from "@/lib/validations/crosshair"
import { auth } from "@/lib/auth"
import { and, eq } from "drizzle-orm"
import {
  type CreateCrosshairState,
  type DeleteCrosshairState,
} from "@/app/actions/crosshair-state"
import { deleteCrosshairImage } from "@/lib/storage/s3"
import { resolveHeroIdentifier } from "@/lib/constants/heroes"

export async function createCrosshairAction(
  prevState: CreateCrosshairState,
  formData: FormData,
): Promise<CreateCrosshairState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return { status: "error", message: "请先登录后再创建准星" }
    }

    const parsed = crosshairFormSchema.parse({
      name: formData.get("name"),
      hero: formData.get("hero"),
      description: formData.get("description"),
      type: formData.get("type"),
      color: formData.get("color"),
      thickness: formData.get("thickness"),
      crosshairLength: formData.get("crosshairLength"),
      centerGap: formData.get("centerGap"),
      opacity: formData.get("opacity"),
      outlineOpacity: formData.get("outlineOpacity"),
      dotSize: formData.get("dotSize"),
      dotOpacity: formData.get("dotOpacity"),
    })

    const imageUrl = getString(formData.get("imageUrl"))
    const imageKey = getString(formData.get("imageKey"))

    if (!imageUrl || !imageKey) {
      return { status: "error", message: "请先上传准星截图" }
    }

    const heroIdentifier = resolveHeroIdentifier(parsed.hero)
    const trimmedHero = parsed.hero.trim()
    const normalizedHero = heroIdentifier.slug || trimmedHero || parsed.hero

    await db.insert(crosshairs).values({
      ...parsed,
      hero: normalizedHero,
      showAccuracy: false,
      scale: 1,
      author: session.user.name ?? session.user.email,
      userId: session.user.id,
      imageUrl,
      imageKey,
    })

    revalidatePath("/")
    revalidatePath("/create")

    return { status: "success", message: "准星已成功保存" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "error", message: error.issues[0]?.message ?? "请检查表单内容" }
    }

    if (error instanceof Error) {
      return { status: "error", message: error.message }
    }

    return { status: "error", message: "提交失败，请稍后重试" }
  }
}

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.length ? value : null
}

export async function deleteCrosshairAction(
  prevState: DeleteCrosshairState,
  formData: FormData,
): Promise<DeleteCrosshairState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return { status: "error", message: "请先登录" }
    }

    const crosshairId = Number(formData.get("crosshairId"))

    if (!Number.isInteger(crosshairId)) {
      return { status: "error", message: "无效的准星 ID" }
    }

    const [record] = await db
      .select({
        id: crosshairs.id,
        userId: crosshairs.userId,
        imageKey: crosshairs.imageKey,
      })
      .from(crosshairs)
      .where(and(eq(crosshairs.id, crosshairId), eq(crosshairs.userId, session.user.id)))
      .limit(1)

    if (!record) {
      return { status: "error", message: "未找到对应的准星" }
    }

    await db.delete(crosshairs).where(eq(crosshairs.id, record.id))

    if (record.imageKey) {
      try {
        await deleteCrosshairImage(record.imageKey)
      } catch (error) {
        console.error("Failed to delete crosshair image", error)
      }
    }

    revalidatePath("/")
    revalidatePath("/dashboard")

    return { status: "success", message: "准星已删除" }
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", message: error.message }
    }

    return { status: "error", message: "删除失败，请稍后重试" }
  }
}
