"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, ImageIcon, Check, AlertCircle } from "lucide-react"
import {
  createCrosshairAction,
  createCrosshairInitialState,
  type CreateCrosshairState,
} from "@/app/actions/crosshair-actions"
import { cn } from "@/lib/utils"

const heroes = [
  "通用",
  "源氏",
  "黑百合",
  "末日铁拳",
  "艾什",
  "猎空",
  "回声",
  "士兵76",
  "卡西迪",
  "法老之鹰",
  "半藏",
  "索杰恩",
  "狂鼠",
  "托比昂",
  "死神",
  "秩序之光",
]

const crosshairTypes = ["十字线", "圆点", "圆形", "十字线 + 圆点"]
const crosshairColors = ["白色", "绿色", "黄色", "青色", "粉色", "红色", "蓝色", "橙色"]

export default function CreatePage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedHero, setSelectedHero] = useState(heroes[0])
  const [selectedType, setSelectedType] = useState(crosshairTypes[0])
  const [selectedColor, setSelectedColor] = useState(crosshairColors[0])
  const [state, formAction] = useFormState(createCrosshairAction, createCrosshairInitialState)
  const formRef = useRef<HTMLFormElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset()
      setPreviewImage(null)
      setSelectedHero(heroes[0])
      setSelectedType(crosshairTypes[0])
      setSelectedColor(crosshairColors[0])
    }
  }, [state.status])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">
              分享你的<span className="text-primary">准星</span>
            </h1>
            <p className="text-muted-foreground">填写你的准星配置，上传截图，让其他玩家也能使用你的设置</p>
          </div>

          <form ref={formRef} action={formAction} className="space-y-6">
            <input type="hidden" name="hero" value={selectedHero} />
            <input type="hidden" name="type" value={selectedType} />
            <input type="hidden" name="color" value={selectedColor} />

            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>为你的准星起个名字，让大家更容易找到</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">准星名称</Label>
                    <Input id="name" name="name" placeholder="例：精准狙击" required maxLength={120} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">作者名</Label>
                    <Input id="author" name="author" placeholder="你的游戏ID" required maxLength={120} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero">适用英雄</Label>
                  <Select value={selectedHero} onValueChange={setSelectedHero}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择英雄" />
                    </SelectTrigger>
                    <SelectContent>
                      {heroes.map((hero) => (
                        <SelectItem key={hero} value={hero}>
                          {hero}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">描述（可选）</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="简单描述这个准星的特点和适用场景..."
                    className="min-h-20 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>准星截图</CardTitle>
                <CardDescription>上传一张游戏内准星的截图，帮助其他玩家预览效果（即将支持持久化存储）</CardDescription>
              </CardHeader>
              <CardContent>
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="准星预览"
                      className="w-full rounded-lg border border-border object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => setPreviewImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 py-12 transition-colors hover:border-primary hover:bg-muted/50"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <ImageIcon className="h-7 w-7 text-primary" />
                    </div>
                    <p className="mt-4 text-sm font-medium">点击或拖拽上传截图</p>
                    <p className="mt-1 text-xs text-muted-foreground">此版本暂不保存图片，仅供预览</p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>准星设置</CardTitle>
                <CardDescription>填写游戏内的准星参数，方便其他玩家在游戏中设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">准星类型</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {crosshairTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">准星颜色</Label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {crosshairColors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="thickness">粗细</Label>
                    <Input id="thickness" name="thickness" type="number" min="0" max="10" defaultValue="1" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crosshairLength">准星长度</Label>
                    <Input
                      id="crosshairLength"
                      name="crosshairLength"
                      type="number"
                      min="0"
                      max="40"
                      defaultValue="6"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="centerGap">中心间隙</Label>
                    <Input
                      id="centerGap"
                      name="centerGap"
                      type="number"
                      min="0"
                      max="40"
                      defaultValue="4"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="opacity">不透明度</Label>
                    <Input id="opacity" name="opacity" type="number" min="0" max="100" defaultValue="100" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outlineOpacity">轮廓不透明度</Label>
                    <Input
                      id="outlineOpacity"
                      name="outlineOpacity"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue="100"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dotSize">圆点大小</Label>
                    <Input id="dotSize" name="dotSize" type="number" min="0" max="25" defaultValue="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dotOpacity">圆点不透明度</Label>
                    <Input
                      id="dotOpacity"
                      name="dotOpacity"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue="0"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <SubmitButton />
              <FormMessage state={state} />
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Upload className="mr-2 h-5 w-5 animate-spin" />
          提交中...
        </>
      ) : (
        <>
          <Check className="mr-2 h-5 w-5" />
          提交准星
        </>
      )}
    </Button>
  )
}

function FormMessage({ state }: { state: CreateCrosshairState }) {
  if (state.status === "idle") return null

  const isSuccess = state.status === "success"

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-4 py-2 text-sm",
        isSuccess ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border-destructive/30 bg-destructive/5 text-destructive",
      )}
    >
      {isSuccess ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      <span>{state.message}</span>
    </div>
  )
}
