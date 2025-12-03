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

export const HERO_BY_SLUG = HEROES.reduce<Record<string, HeroInfo>>((acc, hero) => {
  acc[hero.slug] = hero
  return acc
}, {})

export const HERO_SLUG_BY_NAME = HEROES.reduce<Record<string, string>>((acc, hero) => {
  acc[hero.name] = hero.slug
  return acc
}, {})

export function resolveHeroIdentifier(value: string | null | undefined) {
  const normalized = (value ?? "").trim()
  if (!normalized) {
    return { slug: "", name: "" }
  }

  if (HERO_BY_SLUG[normalized]) {
    const hero = HERO_BY_SLUG[normalized]
    return { slug: normalized, name: hero.name }
  }

  const slug = HERO_SLUG_BY_NAME[normalized]
  if (slug) {
    const hero = HERO_BY_SLUG[slug]
    return { slug, name: hero?.name ?? normalized }
  }

  return { slug: "", name: normalized }
}

export function getHeroIdentifierVariants(value: string | null | undefined) {
  const variants: string[] = []
  const { slug, name } = resolveHeroIdentifier(value)

  if (slug) {
    variants.push(slug)
  }

  if (name && (!slug || name !== slug)) {
    variants.push(name)
  }

  if (!variants.length && name) {
    variants.push(name)
  }

  return variants
}
