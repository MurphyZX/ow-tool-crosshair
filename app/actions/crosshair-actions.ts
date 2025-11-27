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

    await db.insert(crosshairs).values({
      ...parsed,
      showAccuracy: false,
      scale: 1,
      author: session.user.name ?? session.user.email,
      userId: session.user.id,
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

    const deleted = await db
      .delete(crosshairs)
      .where(and(eq(crosshairs.id, crosshairId), eq(crosshairs.userId, session.user.id)))
      .returning({ id: crosshairs.id })

    if (!deleted.length) {
      return { status: "error", message: "未找到对应的准星" }
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
