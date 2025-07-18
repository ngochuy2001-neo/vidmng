"use client"

import { useState } from "react"
import { VideoGrid } from "@/components/video-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Play, Users, Bell, Filter, ChevronDown, X } from "lucide-react"

interface CategoryVideoPageProps {
  slug: string
}

const categoryData: Record<string, any> = {
  music: {
    name: "Âm nhạc",
    description: "Khám phá thế giới âm nhạc đa dạng với các MV, cover, và nhạc cụ",
    color: "from-pink-500 to-rose-500",
    videoCount: "2.5M",
    subscriberCount: "125K",
    image: "/placeholder.svg?height=400&width=800",
    keywords: ["music", "nhạc", "cover", "karaoke", "mv", "ballad", "pop", "rock"],
  },
  gaming: {
    name: "Gaming",
    description: "Gameplay, review game, và cộng đồng game thủ sôi động",
    color: "from-purple-500 to-indigo-500",
    videoCount: "1.8M",
    subscriberCount: "89K",
    image: "/placeholder.svg?height=400&width=800",
    keywords: ["gaming", "gameplay", "review", "mobile game", "pc game", "esports", "stream"],
  },
  education: {
    name: "Giáo dục",
    description: "Học tập hiệu quả với các khóa học và tutorial chất lượng",
    color: "from-blue-500 to-cyan-500",
    videoCount: "987K",
    subscriberCount: "156K",
    image: "/placeholder.svg?height=400&width=800",
    keywords: ["tutorial", "học tập", "giáo dục", "kỹ năng", "kiến thức", "hướng dẫn"],
  },
  technology: {
    name: "Công nghệ",
    description: "Cập nhật xu hướng công nghệ và review sản phẩm mới nhất",
    color: "from-gray-500 to-slate-500",
    videoCount: "1.2M",
    subscriberCount: "234K",
    image: "/placeholder.svg?height=400&width=800",
    keywords: ["tech", "công nghệ", "ai", "programming", "review", "smartphone", "laptop"],
  },
  food: {
    name: "Ẩm thực",
    description: "Khám phá văn hóa ẩm thực và học nấu các món ngon",
    color: "from-orange-500 to-red-500",
    videoCount: "756K",
    subscriberCount: "67K",
    image: "/placeholder.svg?height=400&width=800",
    keywords: ["cooking", "ẩm thực", "món ngon", "nấu ăn", "recipe", "street food"],
  },
  travel: {
    name: "Du lịch",
    description: "Khám phá thế giới qua những hành trình đầy thú vị",
    color: "from-green-500 to-emerald-500",
    videoCount: "634K",
    subscriberCount: "78K",
    image: "/placeholder.svg?height=400&width=800",
    keywords: ["travel", "du lịch", "phượt", "review", "địa điểm", "khách sạn", "vlog"],
  },
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

export function CategoryVideoPage({ slug }: CategoryVideoPageProps) {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("latest")
  const [duration, setDuration] = useState("all")
  const [uploadTime, setUploadTime] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [keywordOpen, setKeywordOpen] = useState(true)

  const category = categoryData[slug] || {
    name: "Danh mục",
    description: "Khám phá nội dung trong danh mục này",
    color: "from-gray-500 to-slate-500",
    videoCount: "0",
    subscriberCount: "0",
    image: "/placeholder.svg?height=400&width=800",
    keywords: [],
  }

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => (prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]))
  }

  const clearAllFilters = () => {
    setSelectedKeywords([])
    setDuration("all")
    setUploadTime("all")
    setSortBy("latest")
  }

  const hasActiveFilters = selectedKeywords.length > 0 || duration !== "all" || uploadTime !== "all"

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <div className={`relative bg-gradient-to-r ${category.color} text-white`}>
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${category.image})` }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Danh mục
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">{category.description}</p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
              <div className="flex items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  <span>{category.videoCount} videos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{category.subscriberCount} người theo dõi</span>
                </div>
              </div>

              <Button variant="secondary" size="lg" className="bg-white text-gray-900 hover:bg-white/90">
                <Bell className="mr-2 h-4 w-4" />
                Theo dõi danh mục
              </Button>
            </div>

            {/* Category Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">2.5M</div>
                <div className="text-sm opacity-80">Tổng lượt xem</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">15K</div>
                <div className="text-sm opacity-80">Video mới/tháng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm opacity-80">Đánh giá trung bình</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">89%</div>
                <div className="text-sm opacity-80">Tỷ lệ hài lòng</div>
              </div>
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

                {/* Keywords */}
                <Collapsible open={keywordOpen} onOpenChange={setKeywordOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h4 className="font-medium">Keywords phổ biến</h4>
                    <ChevronDown className={`h-4 w-4 transition-transform ${keywordOpen ? "rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-3">
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {category.keywords.map((keyword: string) => (
                        <div key={keyword} className="flex items-center space-x-2">
                          <Checkbox
                            id={`keyword-${keyword}`}
                            checked={selectedKeywords.includes(keyword)}
                            onCheckedChange={() => toggleKeyword(keyword)}
                          />
                          <label
                            htmlFor={`keyword-${keyword}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {keyword}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Filter and Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Video trong danh mục {category.name}</h2>
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
                  {selectedKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <button onClick={() => toggleKeyword(keyword)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
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

            {/* Popular Keywords */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Từ khóa phổ biến</h3>
              <div className="flex flex-wrap gap-2">
                {category.keywords.slice(0, 8).map((keyword: string) => (
                  <Badge
                    key={keyword}
                    variant={selectedKeywords.includes(keyword) ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => toggleKeyword(keyword)}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

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
