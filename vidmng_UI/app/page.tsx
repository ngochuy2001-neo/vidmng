import { Suspense } from "react"
import { VideoGrid } from "@/components/video-grid"
import { HeroSection } from "@/components/hero-section"
import { CategoryTabs } from "@/components/category-tabs"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <CategoryTabs />
        <Suspense fallback={<div className="text-center py-8">Đang tải video...</div>}>
          <VideoGrid />
        </Suspense>
      </div>
    </div>
  )
}
