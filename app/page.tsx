import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CrosshairGallery } from "@/components/crosshair-gallery"
import { Footer } from "@/components/footer"
import { getLatestCrosshairs } from "@/lib/data/crosshairs"

export default async function Home() {
  const latestCrosshairs = await getLatestCrosshairs()

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <CrosshairGallery crosshairs={latestCrosshairs} />
      <Footer />
    </main>
  )
}
