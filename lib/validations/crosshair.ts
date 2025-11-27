import { z } from "zod"

const numberField = (min: number, max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value === "string" && value.trim().length > 0) {
        return Number(value)
      }
      if (typeof value === "number") return value
      return undefined
    },
    z
      .number({
        required_error: "数值不能为空",
        invalid_type_error: "请输入合法的数值",
      })
      .int()
      .min(min)
      .max(max),
  )

export const crosshairFormSchema = z.object({
  name: z.string().min(2).max(120),
  author: z.string().min(2).max(120),
  hero: z.string().min(1).max(60),
  description: z
    .string()
    .transform((value) => (value.trim().length ? value : null))
    .nullable()
    .optional(),
  type: z.string().min(1).max(32),
  color: z.string().min(1).max(32),
  thickness: numberField(0, 10),
  crosshairLength: numberField(0, 40),
  centerGap: numberField(0, 40),
  opacity: numberField(0, 100),
  outlineOpacity: numberField(0, 100),
  dotSize: numberField(0, 25),
  dotOpacity: numberField(0, 100),
})

export type CrosshairFormValues = z.infer<typeof crosshairFormSchema>
