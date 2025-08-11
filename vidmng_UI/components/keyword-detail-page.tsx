"use client"

import { useState, useEffect } from "react"
import { VideoGrid } from "@/components/video-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag, Bell, Filter, X, Loader2 } from "lucide-react"
import { tagAPI, type Tag as TagType } from "@/lib/api"

interface KeywordDetailPageProps {
  slug: string
}

const keywordData: Record<string, any> = {
  react: { name: "React" },
  javascript: { name: "JavaScript" },
  cooking: { name: "Cooking" },
  travel: { name: "Travel" },
  tutorial: { name: "Tutorial" },
  gaming: { name: "Gaming" },
  music: { name: "Music" },
  fitness: { name: "Fitness" },
  review: { name: "Review" },
  ai: { name: "AI" },
  vlog: { name: "Vlog" },
  beauty: { name: "Beauty" },
  nodejs: { name: "Node.js" },
  python: { name: "Python" },
  css: { name: "CSS" },
  html: { name: "HTML" },
  vue: { name: "Vue" },
  angular: { name: "Angular" },
  docker: { name: "Docker" },
  aws: { name: "AWS" },
}

const sortOptions = [
  { value: "latest", label: "Mới nhất" },
  { value: "popular", label: "Phổ biến nhất" },
  { value: "views", label: "Lượt xem cao nhất" },
  { value: "duration", label: "Thời lượng dài nhất" },
]

const durationOptions = [
  { value: "all", label: "Tất cả" },
  { value: "short", label: "Dưới 4 phút" },
  { value: "medium", label: "4-20 phút" },
  { value: "long", label: "Trên 20 phút" },
]

const uploadTimeOptions = [
  { value: "all", label: "Tất cả" },
  { value: "today", label: "Hôm nay" },
  { value: "week", label: "Tuần này" },
  { value: "month", label: "Tháng này" },
  { value: "year", label: "Năm này" },
]

export function KeywordDetailPage({ slug }: KeywordDetailPageProps) {
  const [sortBy, setSortBy] = useState("latest")
  const [duration, setDuration] = useState("all")
  const [uploadTime, setUploadTime] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [keyword, setKeyword] = useState<TagType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchKeyword()
  }, [slug])

  const fetchKeyword = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await tagAPI.getTagBySlug(slug, true) // include videos
      if (data) {
        setKeyword(data)
      } else {
        setError("Không tìm thấy keyword.")
      }
    } catch (err: any) {
      console.error('Error fetching keyword:', err)
      setError("Không thể tải thông tin keyword. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  // Fallback keyword nếu API lỗi
  const keywordName = keyword?.name || keywordData[slug]?.name || "Keyword"

  const clearAllFilters = () => {
    setDuration("all")
    setUploadTime("all")
    setSortBy("latest")
  }

  const hasActiveFilters = duration !== "all" || uploadTime !== "all"

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Đang tải thông tin keyword...</span>
        </div>
      </div>
    )
  }

  if (error || !keyword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-destructive">
          {error || "Không tìm thấy keyword."}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Keyword Header */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Keyword
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 flex items-center gap-4">
              <Tag className="h-12 w-12 md:h-16 md:w-16" />#{keyword.name}
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">Khám phá tất cả video về {keyword.name}</p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  <span>{keyword.video_count} videos</span>
                </div>
              </div>
              <Button variant="secondary" size="lg" className="bg-white text-gray-900 hover:bg-white/90">
                <Bell className="mr-2 h-4 w-4" />
                Theo dõi keyword
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block w-80 shrink-0`}>
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Bộ lọc
                  </span>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Xóa tất cả
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sort */}
                <div className="space-y-3">
                  <h4 className="font-medium">Sắp xếp theo</h4>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Upload Time */}
                <div className="space-y-3">
                  <h4 className="font-medium">Thời gian tải lên</h4>
                  <Select value={uploadTime} onValueChange={setUploadTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {uploadTimeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <h4 className="font-medium">Thời lượng</h4>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Filter and Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Videos về #{keyword.name}</h2>
                <p className="text-muted-foreground">Khám phá những video mới nhất và phổ biến nhất</p>
              </div>

              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <Filter className="mr-2 h-4 w-4" />
                Bộ lọc
              </Button>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">Bộ lọc đang áp dụng:</span>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Xóa tất cả
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {duration !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Thời lượng: {durationOptions.find((d) => d.value === duration)?.label}
                      <button onClick={() => setDuration("all")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {uploadTime !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Tải lên: {uploadTimeOptions.find((u) => u.value === uploadTime)?.label}
                      <button onClick={() => setUploadTime("all")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Video Grid */}
            <VideoGrid />

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Tải thêm video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
