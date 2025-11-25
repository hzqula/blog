import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { LatestPosts } from "@/components/latest-posts"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <LatestPosts />
      </main>
      <Footer />
    </div>
  )
}
