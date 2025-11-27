"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { deleteCrosshairAction } from "@/app/actions/crosshair-actions"
import { deleteCrosshairInitialState, type DeleteCrosshairState } from "@/app/actions/crosshair-state"
import { cn } from "@/lib/utils"

type DeleteCrosshairFormProps = {
  crosshairId: number
}

export function DeleteCrosshairForm({ crosshairId }: DeleteCrosshairFormProps) {
  const [state, formAction] = useActionState(deleteCrosshairAction, deleteCrosshairInitialState)

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="crosshairId" value={crosshairId} />
      <DeleteButton />
      <DeleteMessage state={state} />
    </form>
  )
}

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant="destructive" size="sm" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          删除中...
        </>
      ) : (
        <>
          <Trash2 className="mr-2 h-4 w-4" />
          删除
        </>
      )}
    </Button>
  )
}

function DeleteMessage({ state }: { state: DeleteCrosshairState }) {
  if (state.status === "idle") return null

  const isSuccess = state.status === "success"

  return (
    <p
      className={cn(
        "rounded-md px-3 py-1 text-center text-xs",
        isSuccess ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive",
      )}
    >
      {state.message}
    </p>
  )
}
