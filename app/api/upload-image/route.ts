import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { uploadCrosshairImage } from "@/lib/storage/s3"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ message: "请先登录后再上传截图" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("image")

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "缺少要上传的图片" }, { status: 400 })
    }

    const uploaded = await uploadCrosshairImage(file, session.user.id)

    return NextResponse.json(uploaded)
  } catch (error) {
    console.error("Crosshair image upload failed", error)
    const message = error instanceof Error ? error.message : "上传失败，请稍后重试"
    return NextResponse.json({ message }, { status: 500 })
  }
}
