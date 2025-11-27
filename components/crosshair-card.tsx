"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye } from "lucide-react"
import { CrosshairPreview } from "./crosshair-preview"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

export function CrosshairCard({ crosshair }: { crosshair: CrosshairListItem }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(crosshair.likes ?? 0)

  const previewSettings = useMemo(
    () => ({
      type: mapTypeToPreview(crosshair.type),
      color: colorMap[crosshair.color] ?? crosshair.color ?? "#00FF00",
      size: Math.max(crosshair.crosshairLength, 2),
      gap: Math.max(crosshair.centerGap, 0),
      outline: (crosshair.outlineOpacity ?? 0) > 0,
      dot: (crosshair.dotSize ?? 0) > 0,
    }),
    [crosshair],
  )

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <Card className="group overflow-hidden transition-all hover:border-primary/50">
      <div className="relative aspect-video bg-secondary">
        <CrosshairPreview settings={previewSettings} />
        <div className="absolute right-2 top-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {crosshair.hero}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{crosshair.name}</h3>
            <p className="text-sm text-muted-foreground">by {crosshair.author}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={liked ? "text-red-500" : "text-muted-foreground"}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {likeCount.toLocaleString()}
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="h-auto p-0 text-primary">
                <Eye className="mr-1 h-3 w-3" />
                查看设置
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{crosshair.name} - 准星设置</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video rounded-lg bg-secondary">
                  <CrosshairPreview settings={previewSettings} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <SettingItem label="类型" value={crosshair.type} />
                  <SettingItem label="显示精准度" value={crosshair.showAccuracy ? "开" : "关"} />
                  <SettingItem label="颜色" value={crosshair.color} />
                  <SettingItem label="粗细" value={crosshair.thickness} />
                  <SettingItem label="准星长度" value={crosshair.crosshairLength} />
                  <SettingItem label="中心间隙" value={crosshair.centerGap} />
                  <SettingItem label="不透明度" value={crosshair.opacity} />
                  <SettingItem label="轮廓不透明度" value={crosshair.outlineOpacity} />
                  <SettingItem label="圆点大小" value={crosshair.dotSize} />
                  <SettingItem label="圆点不透明度" value={crosshair.dotOpacity} />
                  <SettingItem label="缩放" value={`${crosshair.scale}x`} />
                </div>
                <p className="text-xs text-muted-foreground">在游戏中进入 设置 → 控制 → 准星 来应用这些设置</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

function SettingItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between rounded bg-secondary/50 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function mapTypeToPreview(type?: string | null) {
  const value = type ?? ""
  if (value.includes("圆点")) return "dot"
  if (value.includes("圆形")) return "circle"
  return "crosshair"
}
