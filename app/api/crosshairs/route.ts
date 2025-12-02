"use server"

import { NextRequest, NextResponse } from "next/server"
import { and, asc, desc, eq, ilike, or, type SQL } from "drizzle-orm"

import { db } from "@/lib/db"
import { crosshairs } from "@/lib/db/schema"
import type { CrosshairListItem } from "@/lib/types/crosshair"
import { crosshairSelection } from "@/lib/data/crosshairs"

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 48

type SortOption = "latest" | "popular" | "name"

interface CrosshairApiResponse {
  items: CrosshairListItem[]
  page: number
  nextPage: number | null
  hasMore: boolean
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  try {
    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const limitParam = Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE
    const limit = Math.min(Math.max(1, limitParam), MAX_PAGE_SIZE)
    const offset = (page - 1) * limit

    const hero = normalizeQueryParam(searchParams.get("hero"))
    const author = normalizeQueryParam(searchParams.get("author"))
    const searchQuery = normalizeQueryParam(searchParams.get("search"))
    const sortBy = isSortOption(searchParams.get("sort")) ? (searchParams.get("sort") as SortOption) : "latest"

    const filters: SQL<unknown>[] = []

    if (hero) {
      filters.push(eq(crosshairs.hero, hero))
    }

    if (author) {
      filters.push(ilike(crosshairs.author, wrapLike(author)))
    }

    if (searchQuery) {
      const likeQuery = wrapLike(searchQuery)
      filters.push(or(ilike(crosshairs.name, likeQuery), ilike(crosshairs.author, likeQuery)))
    }

    const whereClause = filters.length ? and(...filters) : undefined

    let query = db.select(crosshairSelection).from(crosshairs)
    if (whereClause) {
      query = query.where(whereClause)
    }

    const rows = await query
      .orderBy(...getOrderBy(sortBy))
      .limit(limit + 1)
      .offset(offset)

    const hasMore = rows.length > limit
    const items = hasMore ? rows.slice(0, limit) : rows

    const response: CrosshairApiResponse = {
      items,
      page,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[GET /api/crosshairs] failed", error)
    return NextResponse.json({ message: "无法获取准星列表" }, { status: 500 })
  }
}

const normalizeQueryParam = (value: string | null) => {
  if (!value) return ""
  return value.trim()
}

const escapeForLike = (value: string) => value.replace(/[%_]/g, (match) => `\\${match}`)

const wrapLike = (value: string) => `%${escapeForLike(value)}%`

const isSortOption = (value: string | null): value is SortOption => value === "latest" || value === "popular" || value === "name"

const getOrderBy = (sortBy: SortOption) => {
  switch (sortBy) {
    case "popular":
      return [desc(crosshairs.likes), desc(crosshairs.createdAt)]
    case "name":
      return [asc(crosshairs.name)]
    default:
      return [desc(crosshairs.createdAt)]
  }
}
