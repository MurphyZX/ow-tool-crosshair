"use client"

import { type PropsWithChildren } from "react"

import { cn } from "@/lib/utils"

type AuthCardShellProps = PropsWithChildren<{
  className?: string
}>

export function AuthCardShell({ children, className }: AuthCardShellProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-3xl border border-border/50 bg-background/40 shadow-[0_25px_120px_-60px_rgba(56,189,248,0.8)]",
        className
      )}
    >
      {children}
    </div>
  )
}
