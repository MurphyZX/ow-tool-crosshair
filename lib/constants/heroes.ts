import heroConfigsJson from "@/lib/data/heroConfigs.json"

interface HeroConfig {
  id: string
  name: string
  typeName: string
  desc: string
}

interface HeroConfigsFile {
  heroConfigs: HeroConfig[]
}

export interface HeroInfo {
  slug: string
  name: string
  role: string
  description: string
}

const heroConfigs = (heroConfigsJson as HeroConfigsFile).heroConfigs

const GENERAL_HERO: HeroInfo = {
  slug: "general",
  name: "通用",
  role: "全角色",
  description: "适用于绝大多数英雄或训练场景的通用准星，专注基础稳定性。",
}

const OFFICIAL_HEROES: HeroInfo[] = heroConfigs.map((hero) => ({
  slug: hero.id,
  name: hero.name,
  role: hero.typeName,
  description: hero.desc,
}))

export const HEROES: HeroInfo[] = [GENERAL_HERO, ...OFFICIAL_HEROES]

export const HERO_NAME_LIST = HEROES.map((hero) => hero.name)

export const HERO_BY_SLUG = HEROES.reduce<Record<string, HeroInfo>>((acc, hero) => {
  acc[hero.slug] = hero
  return acc
}, {})

export const HERO_SLUG_BY_NAME = HEROES.reduce<Record<string, string>>((acc, hero) => {
  acc[hero.name] = hero.slug
  return acc
}, {})
