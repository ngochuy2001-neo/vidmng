import { Button } from "@/components/ui/button"
import { Play, Upload } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Chia sẻ video của bạn với thế giới</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Nền tảng chia sẻ video hàng đầu với hàng triệu video chất lượng cao
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link href="/upload">
              <Upload className="mr-2 h-5 w-5" />
              Tải lên video
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#videos">
              <Play className="mr-2 h-5 w-5" />
              Khám phá video
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
