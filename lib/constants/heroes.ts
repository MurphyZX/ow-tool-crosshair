export interface HeroInfo {
  slug: string
  name: string
  role: string
  description: string
}

export const HEROES: HeroInfo[] = [
  {
    slug: "general",
    name: "通用",
    role: "全角色",
    description: "适用于绝大多数英雄或训练场景的通用准星，专注基础稳定性。",
  },
  { slug: "genji", name: "源氏", role: "输出", description: "高机动近身刺客，需要在突进时保持清晰视野。" },
  { slug: "widowmaker", name: "黑百合", role: "输出", description: "远程狙击手，讲究精确对点与最小遮挡。" },
  { slug: "doomfist", name: "末日铁拳", role: "重装", description: "依靠技能连招突进，需要广阔视野定位目标。" },
{ slug: "ashe", name: "艾什", role: "输出", description: "中远距离精英射手，兼顾高爆发与持续压制。" },
  { slug: "tracer", name: "猎空", role: "输出", description: "超高机动骚扰英雄，偏好小巧不遮挡的准星。" },
  { slug: "echo", name: "回声", role: "输出", description: "空中多形态伤害，需要兼顾空战与地面交战。" },
  { slug: "soldier-76", name: "士兵76", role: "输出", description: "全能型突击手，适合标准十字准星追踪。" },
  { slug: "cassidy", name: "卡西迪", role: "输出", description: "手炮爆发输出，需要稳定跟枪与点射切换。" },
  { slug: "pharah", name: "法老之鹰", role: "输出", description: "火箭空投型英雄，关注爆炸范围与落点。" },
  { slug: "hanzo", name: "半藏", role: "输出", description: "弓箭爆发英雄，准星辅助判断抛物线与引导箭。" },
  { slug: "sojourn", name: "索杰恩", role: "输出", description: "轨道炮射手，追求线性跟踪与充能狙击反馈。" },
  { slug: "junkrat", name: "狂鼠", role: "输出", description: "区域封锁爆破专家，便于估算弹道落点。" },
  { slug: "torbjorn", name: "托比昂", role: "输出", description: "炮台工程师，兼顾主武器散射与副武器抛射。" },
  { slug: "reaper", name: "死神", role: "输出", description: "近身霰弹爆发，需要掌握散射覆盖范围。" },
  { slug: "symmetra", name: "秩序之光", role: "输出", description: "光束/光球双模式，需要能量积累与远程抛射指引。" },
] as const

export const HERO_NAME_LIST = HEROES.map((hero) => hero.name)

export const HERO_BY_SLUG = HEROES.reduce<Record<string, HeroInfo>>((acc, hero) => {
  acc[hero.slug] = hero
  return acc
}, {})

export const HERO_SLUG_BY_NAME = HEROES.reduce<Record<string, string>>((acc, hero) => {
  acc[hero.name] = hero.slug
  return acc
}, {})
