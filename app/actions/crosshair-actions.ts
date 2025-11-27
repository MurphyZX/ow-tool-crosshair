"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { db } from "@/lib/db"
import { crosshairs } from "@/lib/db/schema"
import { crosshairFormSchema } from "@/lib/validations/crosshair"

export type CreateCrosshairState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }

export const createCrosshairInitialState: CreateCrosshairState = { status: "idle" }

export async function createCrosshairAction(
  prevState: CreateCrosshairState,
  formData: FormData,
): Promise<CreateCrosshairState> {
  try {
    const parsed = crosshairFormSchema.parse({
      name: formData.get("name"),
      author: formData.get("author"),
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
