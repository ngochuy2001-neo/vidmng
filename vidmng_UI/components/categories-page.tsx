"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Loader2 } from "lucide-react"
import { categoryAPI, type Category } from "@/lib/api"

// Màu gradient cho các category
const gradientColors = [
  "from-pink-500 to-rose-500",
  "from-purple-500 to-indigo-500", 
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-emerald-500",
  "from-gray-500 to-slate-500",
  "from-yellow-500 to-orange-500",
  "from-indigo-500 to-purple-500",
  "from-rose-500 to-pink-500",
  "from-teal-500 to-green-500",
  "from-red-500 to-rose-500",
  "from-violet-500 to-purple-500",
]

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, []) // eslint-disable-next-line react-hooks/exhaustive-deps

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryAPI.getCategories()
      setCategories(data)
    } catch (err: any) {
      setError("Không thể tải danh sách danh mục. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Khám phá theo danh mục</h1>
          <p className="text-xl text-muted-foreground">Tìm kiếm nội dung yêu thích của bạn qua các danh mục đa dạng</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Đang tải danh mục...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Khám phá theo danh mục</h1>
          <p className="text-xl text-muted-foreground">Tìm kiếm nội dung yêu thích của bạn qua các danh mục đa dạng</p>
        </div>
        <div className="text-center text-destructive py-12">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Khám phá theo danh mục</h1>
        <p className="text-xl text-muted-foreground">Tìm kiếm nội dung yêu thích của bạn qua các danh mục đa dạng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => {
          const colorIndex = index % gradientColors.length
          const gradientColor = gradientColors[colorIndex]
          const videoCount = category.video_count?.toLocaleString("vi-VN") || "0"
          
          return (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  {/* Background Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      {category.name}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{category.description || "Không có mô tả"}</p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      <span>{videoCount} videos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Danh mục</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Popular Categories Section */}
      {categories.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Danh mục phổ biến nhất</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((category, index) => {
              const colorIndex = index % gradientColors.length
              const gradientColor = gradientColors[colorIndex]
              const videoCount = category.video_count?.toLocaleString("vi-VN") || "0"
              
              return (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-muted-foreground">#{index + 1}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {videoCount} videos • Danh mục
                          </p>
                        </div>
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center`}
                        >
                          <Play className="h-5 w-5 text-white fill-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
