"use client"

import { useState, useEffect } from "react"
import { VideoCard } from "@/components/video-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, SlidersHorizontal, ChevronDown, X, Filter } from "lucide-react"

interface SearchResultsProps {
  query: string
}

const mockSearchResults = [
  {
    id: "1",
    title: "Hướng dẫn lập trình React từ cơ bản đến nâng cao",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "15:30",
    views: "125K",
    uploadTime: "2 ngày trước",
    channel: "Tech Academy",
    channelAvatar: "/placeholder.svg?height=40&width=40",
    category: "Công nghệ",
    keywords: ["react", "javascript", "tutorial", "programming"],
  },
  {
    id: "2",
    title: "React Hooks - useState và useEffect chi tiết",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "12:30",
    views: "89K",
    uploadTime: "1 tuần trước",
    channel: "Code Master",
    channelAvatar: "/placeholder.svg?height=40&width=40",
    category: "Công nghệ",
    keywords: ["react", "hooks", "javascript", "frontend"],
  },
  {
    id: "3",
    title: "Cách nấu phở bò chuẩn vị Hà Nội",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "8:20",
    views: "234K",
    uploadTime: "3 ngày trước",
    channel: "Món Ngon Mỗi Ngày",
    channelAvatar: "/placeholder.svg?height=40&width=40",
    category: "Ẩm thực",
    keywords: ["cooking", "phở", "ẩm thực", "việt nam"],
  },
  {
    id: "4",
    title: "Top 10 địa điểm du lịch đẹp nhất Việt Nam 2024",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "18:15",
    views: "456K",
    uploadTime: "5 ngày trước",
    channel: "Travel Vietnam",
    channelAvatar: "/placeholder.svg?height=40&width=40",
    category: "Du lịch",
    keywords: ["travel", "du lịch", "việt nam", "top 10"],
  },
  {
    id: "5",
    title: "Học JavaScript ES6+ từ cơ bản",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "22:45",
    views: "178K",
    uploadTime: "1 tuần trước",
    channel: "Web Dev Pro",
    channelAvatar: "/placeholder.svg?height=40&width=40",
    category: "Công nghệ",
    keywords: ["javascript", "es6", "programming", "tutorial"],
  },
  {
    id: "6",
    title: "Món ăn đường phố Sài Gòn",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "14:20",
    views: "312K",
    uploadTime: "4 ngày trước",
    channel: "Food Explorer",
    channelAvatar: "/placeholder.svg?height=40&width=40",
    category: "Ẩm thực",
    keywords: ["street food", "sài gòn", "ẩm thực", "review"],
  },
]

const categories = [
  "Công nghệ",
  "Ẩm thực",
  "Du lịch",
  "Giải trí",
  "Giáo dục",
  "Âm nhạc",
  "Thể thao",
  "Thời trang",
  "Làm đẹp",
  "Lối sống",
]

const availableKeywords = [
  "react",
  "javascript",
  "tutorial",
  "programming",
  "hooks",
  "frontend",
  "cooking",
  "phở",
  "ẩm thực",
  "việt nam",
  "travel",
  "du lịch",
  "top 10",
  "es6",
  "street food",
  "sài gòn",
  "review",
]

const sortOptions = [
  { value: "relevance", label: "Liên quan nhất" },
  { value: "date", label: "Mới nhất" },
  { value: "views", label: "Lượt xem cao nhất" },
  { value: "duration", label: "Thời lượng" },
]

const durationOptions = [
  { value: "all", label: "Tất cả" },
  { value: "short", label: "Dưới 4 phút" },
  { value: "medium", label: "4-20 phút" },
  { value: "long", label: "Trên 20 phút" },
]

const uploadTimeOptions = [
  { value: "all", label: "Tất cả" },
  { value: "hour", label: "1 giờ qua" },
  { value: "today", label: "Hôm nay" },
  { value: "week", label: "Tuần này" },
  { value: "month", label: "Tháng này" },
  { value: "year", label: "Năm này" },
]

export function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState(mockSearchResults)
  const [filteredResults, setFilteredResults] = useState(mockSearchResults)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevance")
  const [duration, setDuration] = useState("all")
  const [uploadTime, setUploadTime] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [keywordOpen, setKeywordOpen] = useState(true)

  useEffect(() => {
    // Filter results based on all criteria
    let filtered = results.filter((video) => {
      // Query match
      const matchesQuery =
        query === "" ||
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.channel.toLowerCase().includes(query.toLowerCase()) ||
        video.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase()))

      // Category match
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(video.category)

      // Keywords match
      const matchesKeywords =
        selectedKeywords.length === 0 || selectedKeywords.some((keyword) => video.keywords.includes(keyword))

      // Duration match
      const matchesDuration = (() => {
        if (duration === "all") return true
        const [minutes, seconds] = video.duration.split(":").map(Number)
        const totalMinutes = minutes + seconds / 60

        switch (duration) {
          case "short":
            return totalMinutes < 4
          case "medium":
            return totalMinutes >= 4 && totalMinutes <= 20
          case "long":
            return totalMinutes > 20
          default:
            return true
        }
      })()

      // Upload time match (simplified for demo)
      const matchesUploadTime = uploadTime === "all" || true // Simplified logic

      return matchesQuery && matchesCategory && matchesKeywords && matchesDuration && matchesUploadTime
    })

    // Sort results
    switch (sortBy) {
      case "date":
        filtered = filtered.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())
        break
      case "views":
        filtered = filtered.sort((a, b) => {
          const aViews = Number.parseInt(a.views.replace("K", "000").replace("M", "000000"))
          const bViews = Number.parseInt(b.views.replace("K", "000").replace("M", "000000"))
          return bViews - aViews
        })
        break
      case "duration":
        filtered = filtered.sort((a, b) => {
          const aDuration = a.duration.split(":").reduce((acc, time) => 60 * acc + +time, 0)
          const bDuration = b.duration.split(":").reduce((acc, time) => 60 * acc + +time, 0)
          return bDuration - aDuration
        })
        break
      default:
        // Keep relevance order
        break
    }

    setFilteredResults(filtered)
  }, [query, selectedCategories, selectedKeywords, sortBy, duration, uploadTime, results])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => (prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]))
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedKeywords([])
    setDuration("all")
    setUploadTime("all")
    setSortBy("relevance")
  }

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedKeywords.length > 0 || duration !== "all" || uploadTime !== "all"

  return (
    <div className="container mx-auto px-4 py-6">
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

              {/* Categories */}
              <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h4 className="font-medium">Danh mục</h4>
                  <ChevronDown className={`h-4 w-4 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Keywords */}
              <Collapsible open={keywordOpen} onOpenChange={setKeywordOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h4 className="font-medium">Keywords</h4>
                  <ChevronDown className={`h-4 w-4 transition-transform ${keywordOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-3">
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {availableKeywords.map((keyword) => (
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
          {/* Search Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-bold">{query ? `Kết quả tìm kiếm cho "${query}"` : "Tất cả video"}</h1>
              </div>

              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </div>
            <p className="text-muted-foreground">Tìm thấy {filteredResults.length.toLocaleString()} kết quả</p>
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
                {query && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Từ khóa: "{query}"
                  </Badge>
                )}
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    Danh mục: {category}
                    <button onClick={() => toggleCategory(category)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedKeywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                    Keyword: {keyword}
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

          {/* Results */}
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResults.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Không tìm thấy kết quả</h3>
              <p className="text-muted-foreground mb-4">Thử tìm kiếm với từ khóa khác hoặc bỏ bớt bộ lọc</p>
              <Button variant="outline" onClick={clearAllFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredResults.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Tải thêm video
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
