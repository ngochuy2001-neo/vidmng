"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Tag, Hash, Loader2 } from "lucide-react"
import { tagAPI, type Tag as TagType } from "@/lib/api"

// Fallback keywords nếu API không hoạt động
const fallbackKeywords = [
  { id: "react", name: "React", slug: "react" },
  { id: "javascript", name: "JavaScript", slug: "javascript" },
  { id: "cooking", name: "Cooking", slug: "cooking" },
  { id: "travel", name: "Travel", slug: "travel" },
  { id: "tutorial", name: "Tutorial", slug: "tutorial" },
  { id: "gaming", name: "Gaming", slug: "gaming" },
  { id: "music", name: "Music", slug: "music" },
  { id: "fitness", name: "Fitness", slug: "fitness" },
  { id: "review", name: "Review", slug: "review" },
  { id: "ai", name: "AI", slug: "ai" },
  { id: "vlog", name: "Vlog", slug: "vlog" },
  { id: "beauty", name: "Beauty", slug: "beauty" },
]

const sortOptions = [
  { value: "alphabetical", label: "Theo bảng chữ cái" },
  { value: "popular", label: "Phổ biến nhất" },
]

export function KeywordsListPage() {
  const [keywords, setKeywords] = useState<TagType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("alphabetical")

  useEffect(() => {
    fetchKeywords()
  }, [])

  const fetchKeywords = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await tagAPI.getTags()
      setKeywords(data.results || data || [])
    } catch (err: any) {
      console.error('Error fetching keywords:', err)
      setError("Không thể tải danh sách keywords. Vui lòng thử lại sau.")
      // Sử dụng fallback keywords nếu API lỗi
      setKeywords(fallbackKeywords.map(k => ({
        id: parseInt(k.id),
        name: k.name,
        slug: k.slug,
        video_count: 0
      })))
    } finally {
      setLoading(false)
    }
  }

  // Filter và sort keywords
  const filteredKeywords = keywords
    .filter(keyword => 
      keyword.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keyword.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "popular") {
        return b.video_count - a.video_count
      }
      return 0
    })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Khám phá Keywords</h1>
        <p className="text-xl text-muted-foreground">Tìm kiếm nội dung yêu thích qua các từ khóa phổ biến</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Hash className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? "..." : keywords.length}</p>
                <p className="text-sm text-muted-foreground">Tổng keywords</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Tag className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? "..." : filteredKeywords.length}</p>
                <p className="text-sm text-muted-foreground">Keywords hiển thị</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm keywords..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sắp xếp theo" />
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Đang tải keywords...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center text-destructive py-8">
          {error}
        </div>
      )}

      {/* Keywords Grid */}
      {!loading && !error && (
        <>
          {filteredKeywords.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Không tìm thấy keywords nào.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredKeywords.map((keyword) => (
                <Link key={keyword.id} href={`/keyword/${keyword.slug}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[100px]">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-3">
                        <Tag className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors text-sm">#{keyword.name}</h3>
                      {keyword.video_count > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">{keyword.video_count} videos</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Tải thêm keywords
        </button>
      </div>
    </div>
  )
}
