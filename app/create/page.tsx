"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, ImageIcon, Check } from "lucide-react"

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
  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

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

          <form onSubmit={handleSubmit}>
            <Card className="mb-6 border-border bg-card/50">
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>为你的准星起个名字，让大家更容易找到</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">准星名称</Label>
                    <Input id="name" placeholder="例：精准狙击" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">作者名</Label>
                    <Input id="author" placeholder="你的游戏ID" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero">适用英雄</Label>
                  <Select defaultValue="通用">
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
                    placeholder="简单描述这个准星的特点和适用场景..."
                    className="min-h-20 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 border-border bg-card/50">
              <CardHeader>
                <CardTitle>准星截图</CardTitle>
                <CardDescription>上传一张游戏内准星的截图，帮助其他玩家预览效果</CardDescription>
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
                    <p className="mt-1 text-xs text-muted-foreground">支持 PNG, JPG 格式</p>
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

            <Card className="mb-6 border-border bg-card/50">
              <CardHeader>
                <CardTitle>准星设置</CardTitle>
                <CardDescription>填写游戏内的准星参数，方便其他玩家在游戏中设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>准星类型</Label>
                    <Select defaultValue="十字线">
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
                    <Label>准星颜色</Label>
                    <Select defaultValue="绿色">
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
                    <Input id="thickness" type="number" min="1" max="10" defaultValue="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">准星长度</Label>
                    <Input id="length" type="number" min="0" max="40" defaultValue="6" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gap">中心间隙</Label>
                    <Input id="gap" type="number" min="0" max="40" defaultValue="4" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="opacity">不透明度</Label>
                    <Input id="opacity" type="number" min="0" max="100" defaultValue="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outline">轮廓不透明度</Label>
                    <Input id="outline" type="number" min="0" max="100" defaultValue="100" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dotSize">圆点大小</Label>
                    <Input id="dotSize" type="number" min="0" max="25" defaultValue="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dotOpacity">圆点不透明度</Label>
                    <Input id="dotOpacity" type="number" min="0" max="100" defaultValue="0" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={submitted}>
              {submitted ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  提交成功！
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  提交准星
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
