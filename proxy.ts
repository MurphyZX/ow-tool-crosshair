import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const PROTECTED_PATHS = ["/create", "/dashboard", "/api/upload-image"]
const SESSION_COOKIE_KEYS = [
  "better-auth.session_token",
  "session_token",
  "better-auth.session_data",
]

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isProtected = PROTECTED_PATHS.some((path) =>
    path.endsWith("*") ? pathname.startsWith(path.slice(0, -1)) : pathname === path || pathname.startsWith(`${path}/`),
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  if (hasSessionCookie(request)) {
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

export const config = {
  matcher: ["/create/:path*", "/dashboard/:path*", "/api/upload-image"],
}
