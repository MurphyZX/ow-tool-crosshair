import type { CrosshairListItem } from "@/lib/types/crosshair"

const colorMap: Record<string, string> = {
  白色: "#FFFFFF",
  绿色: "#7CFC00",
  黄色: "#FFD700",
  青色: "#00FFFF",
  粉色: "#FF69B4",
  红色: "#FF4500",
  蓝色: "#1E90FF",
  橙色: "#FF8C00",
}

export function getPreviewSettings(crosshair: Pick<CrosshairListItem, "type" | "color" | "crosshairLength" | "centerGap" | "outlineOpacity" | "dotSize">) {
  return {
    type: mapTypeToPreview(crosshair.type),
    color: colorMap[crosshair.color] ?? crosshair.color ?? "#00FF00",
    size: Math.max(crosshair.crosshairLength, 2),
    gap: Math.max(crosshair.centerGap, 0),
    outline: (crosshair.outlineOpacity ?? 0) > 0,
    dot: (crosshair.dotSize ?? 0) > 0,
  }
}

function mapTypeToPreview(type?: string | null) {
  const value = type ?? ""
  if (value.includes("圆点")) return "dot"
  if (value.includes("圆形")) return "circle"
  return "crosshair"
}
