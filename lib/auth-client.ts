import { createAuthClient } from "better-auth/react"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const authClient = createAuthClient({
  baseURL: `${siteUrl}/api/auth`
})

export const { signIn, signUp, signOut, useSession } = authClient
