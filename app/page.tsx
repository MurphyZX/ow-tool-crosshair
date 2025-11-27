import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CrosshairGallery } from "@/components/crosshair-gallery"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <CrosshairGallery />
      <Footer />
    </main>
  )
}
