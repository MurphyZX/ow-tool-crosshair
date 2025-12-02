"use client"

import { type PropsWithChildren } from "react"

import { BorderBeam } from "@/components/ui/border-beam"
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
      <BorderBeam
        size={360}
        duration={8}
        initialOffset={32}
        borderWidth={2}
        className="opacity-80 blur-[1px]"
        colorFrom="rgba(56,189,248,0.9)"
        colorTo="rgba(244,114,182,0.85)"
      />
    </div>
  )
}
