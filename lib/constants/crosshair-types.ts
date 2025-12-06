export interface CrosshairTypeOption {
  value: string
  label: string
  description: string
}

export const CROSSHAIR_TYPES: CrosshairTypeOption[] = [
  {
    value: "十字型",
    label: "十字型",
    description: "标准四向准星，适用于大多数英雄和距离判断。",
  },
  {
    value: "默认",
    label: "默认",
    description: "游戏默认的圆圈 + 中心点组合，兼顾可视化与遮挡。",
  },
  {
    value: "点型",
    label: "点型",
    description: "只有单个中心瞄点，方便微调但对抖动敏感。",
  },
  {
    value: "圆型",
    label: "圆型",
    description: "仅展示一个可调大小的圆环，适合跟踪式武器。",
  },
  {
    value: "圆形和十字形",
    label: "圆形和十字形",
    description: "外圈与十字线组合，兼顾距离与方向识别。",
  },
  {
    value: "线型",
    label: "线型",
    description: "极简的水平线段，便于横向压枪或百发百中练习。",
  },
  {
    value: "三叉型",
    label: "三叉型",
    description: "呈 Y 形的三向指示线，可减少射击时的遮挡面。",
  },
  {
    value: "下垂型",
    label: "下垂型",
    description: "倒 T 式准星，上部留出视野，适合喜欢顶点对齐的玩家。",
  },
  {
    value: "方型",
    label: "方型",
    description: "实心方块型准星，便于对齐直角或边缘目标。",
  },
  {
    value: "框型",
    label: "框型",
    description: "四角式框线，提供清晰的外围参照用于追踪。",
  },
]

export const DEFAULT_CROSSHAIR_TYPE = CROSSHAIR_TYPES[0]?.value ?? "十字型"
