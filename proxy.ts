import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

const PROTECTED_PATHS = ["/create", "/dashboard", "/api/upload-image"]
const AUTH_PAGES = ["/sign-in", "/sign-up"]
const SESSION_COOKIE_KEYS = [
  "better-auth.session_token",
  "session_token",
  "better-auth.session_data",
]

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isProtected = matchesPath(pathname, PROTECTED_PATHS)
  const isAuthPage = matchesPath(pathname, AUTH_PAGES)

  if (!isProtected && !isAuthPage) {
    return NextResponse.next()
  }

  const session = hasSessionCookie(request) ? await getSession(request) : null

  if (isAuthPage) {
    if (session) {
      const redirectTarget = getRedirectParam(request) ?? "/dashboard"
      return NextResponse.redirect(new URL(redirectTarget, request.url))
    }
    return NextResponse.next()
  }

  if (session) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "请先登录" }, { status: 401 })
  }

  const redirectUrl = new URL("/sign-in", request.url)
  redirectUrl.searchParams.set("redirect", pathname)

  return NextResponse.redirect(redirectUrl)
}

function hasSessionCookie(request: NextRequest) {
  return SESSION_COOKIE_KEYS.some((key) => {
    const cookie = request.cookies.get(key)
    return cookie?.value?.length
  })
}

function matchesPath(pathname: string, candidates: string[]) {
  return candidates.some((path) =>
    path.endsWith("*") ? pathname.startsWith(path.slice(0, -1)) : pathname === path || pathname.startsWith(`${path}/`),
  )
}

function getRedirectParam(request: NextRequest) {
  const param = request.nextUrl.searchParams.get("redirect")
  if (typeof param === "string" && param.startsWith("/")) {
    return param
  }
  return null
}

async function getSession(request: NextRequest) {
  try {
    return await auth.api.getSession({
      headers: request.headers,
    })
  } catch (error) {
    console.error("Failed to verify session in proxy", error)
    return null
  }
}

export const config = {
  matcher: ["/create/:path*", "/dashboard/:path*", "/api/upload-image", "/sign-in", "/sign-up"],
}
