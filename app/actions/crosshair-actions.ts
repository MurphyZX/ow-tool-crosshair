"use server"

import { Buffer } from "node:buffer"

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
import { deleteCrosshairImage, uploadCrosshairImage } from "@/lib/storage/s3"

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

    const image = formData.get("image")
    const imageData = formData.get("imageData")
    const imageName = formData.get("imageName")
    const imageType = formData.get("imageType")
    let uploadedImage:
      | {
          key: string
          url: string
        }
      | undefined

    if (image instanceof File && image.size > 0) {
      uploadedImage = await uploadCrosshairImage(image, session.user.id)
    } else if (typeof imageData === "string" && imageData.startsWith("data:") && imageData.includes("base64,")) {
      const fallbackName =
        typeof imageName === "string" && imageName.length ? imageName : `crosshair-${Date.now()}.png`
      const fallbackType =
        typeof imageType === "string" && imageType.length ? imageType : undefined
      const reconstructed = createFileFromDataUrl(imageData, fallbackName, fallbackType)
      if (reconstructed) {
        uploadedImage = await uploadCrosshairImage(reconstructed, session.user.id)
      }
    }

    await db.insert(crosshairs).values({
      ...parsed,
      showAccuracy: false,
      scale: 1,
      author: session.user.name ?? session.user.email,
      userId: session.user.id,
      imageUrl: uploadedImage?.url ?? null,
      imageKey: uploadedImage?.key ?? null,
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

function createFileFromDataUrl(dataUrl: string, fileName: string, explicitType?: string) {
  const matches = dataUrl.match(/^data:(.*?);base64,(.*)$/)

  if (!matches) {
    return null
  }

  const [, mime, base64Content] = matches
  const buffer = Buffer.from(base64Content, "base64")
  const type = explicitType || mime || "application/octet-stream"

  return new File([buffer], fileName, { type })
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
