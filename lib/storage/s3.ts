import "server-only"

import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Buffer } from "node:buffer"
import { randomUUID } from "node:crypto"

const accessKeyId = process.env.S3_ACCESS_KEY_ID
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
const region = process.env.S3_REGION
const bucket = process.env.S3_BUCKET_NAME

if (!accessKeyId || !secretAccessKey) {
  throw new Error("S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be configured")
}

if (!bucket) {
  throw new Error("S3_BUCKET_NAME must be configured")
}

const s3 = new S3Client({
  region: region ?? "us-east-1",
  endpoint: process.env.S3_ENDPOINT || undefined,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

const MB = 1024 * 1024
const MAX_FILE_SIZE_BYTES = 5 * MB
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"])

export async function uploadCrosshairImage(file: File, userId: string) {
  if (file.size <= 0) {
    throw new Error("请选择要上传的图片")
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("图片大小不能超过 5MB")
  }

  if (file.type && !ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("仅支持 PNG / JPG / WEBP 图片")
  }

  const arrayBuffer = await file.arrayBuffer()
  const extension = getExtension(file)
  const key = `crosshairs/${userId}/${Date.now()}-${randomUUID()}${extension}`

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type || "application/octet-stream",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  )

  return {
    key,
    url: buildPublicUrl(key),
  }
}

export async function deleteCrosshairImage(key: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  )
}

function getExtension(file: File) {
  const fromName = file.name?.includes(".") ? `.${file.name.split(".").pop()?.toLowerCase()}` : ""
  if (fromName) return fromName

  if (file.type) {
    const subtype = file.type.split("/")[1]
    if (subtype) return `.${subtype}`
  }

  return ""
}

function buildPublicUrl(key: string) {
  const baseFromEnv = process.env.S3_PUBLIC_URL?.replace(/\/$/, "")

  if (baseFromEnv) {
    return `${baseFromEnv}/${key}`
  }

  if (!region) {
    throw new Error("S3_PUBLIC_URL 或 S3_REGION 必须配置一个用于生成图片地址")
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}
