export type CreateCrosshairState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }

export const createCrosshairInitialState: CreateCrosshairState = { status: "idle" }

export type DeleteCrosshairState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }

export const deleteCrosshairInitialState: DeleteCrosshairState = { status: "idle" }
