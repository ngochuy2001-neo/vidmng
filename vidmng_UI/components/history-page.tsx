"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Video, Trash2, Calendar, Eye, Play, MoreHorizontal, Edit, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const mockMyVideos = [
  {
    id: "1",
    title: "Hướng dẫn lập trình React từ cơ bản đến nâng cao",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "15:30",
    views: "125K",
    likes: "2.1K",
    category: "Công nghệ",
    uploadedAt: "2024-12-15T14:30:00Z",
    description: "Video hướng dẫn chi tiết về React từ cơ bản đến nâng cao...",
  },
  {
    id: "2",
    title: "Cách tối ưu hiệu suất React App",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "12:45",
    views: "89K",
    likes: "1.5K",
    category: "Công nghệ",
    uploadedAt: "2024-12-10T10:15:00Z",
    description: "Các kỹ thuật tối ưu hiệu suất cho ứng dụng React...",
  },
  {
    id: "3",
    title: "Review setup workspace cho developer",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "8:20",
    views: "45K",
    likes: "890",
    category: "Công nghệ",
    uploadedAt: "2024-12-08T16:45:00Z",
    description: "Chia sẻ setup workspace hiệu quả cho developer...",
  },
  {
    id: "4",
    title: "Học JavaScript ES6+ từ cơ bản",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "22:30",
    views: "178K",
    likes: "2.8K",
    category: "Công nghệ",
    uploadedAt: "2024-12-18T09:00:00Z",
    description: "Video về JavaScript ES6+ với các ví dụ thực tế...",
  },
  {
    id: "5",
    title: "Kinh nghiệm làm việc remote",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "18:15",
    views: "12K",
    likes: "456",
    category: "Lối sống",
    uploadedAt: "2024-12-05T11:20:00Z",
    description: "Chia sẻ kinh nghiệm làm việc remote hiệu quả...",
  },
]

const categories = ["Tất cả", "Công nghệ", "Lối sống", "Giải trí", "Giáo dục"]

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "most-viewed", label: "Nhiều lượt xem nhất" },
  { value: "most-liked", label: "Nhiều lượt thích nhất" },
]

export function HistoryPage() {
  const [myVideos, setMyVideos] = useState(mockMyVideos)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [sortBy, setSortBy] = useState("newest")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const filteredVideos = myVideos
    .filter((video) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory === "Tất cả" || video.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        case "oldest":
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
        case "most-viewed":
          return Number.parseInt(b.views.replace("K", "000")) - Number.parseInt(a.views.replace("K", "000"))
        case "most-liked":
          return Number.parseInt(b.likes.replace("K", "000")) - Number.parseInt(a.likes.replace("K", "000"))
        default:
          return 0
      }
    })

  const handleDeleteVideo = (id: string) => {
    setMyVideos((prev) => prev.filter((video) => video.id !== id))
  }

  const totalViews = myVideos.reduce((total, video) => {
    return total + Number.parseInt(video.views.replace("K", "000") || "0")
  }, 0)
  const totalLikes = myVideos.reduce((total, video) => {
    return total + Number.parseInt(video.likes.replace("K", "000") || "0")
  }, 0)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Video className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Video của tôi</h1>
          </div>
          <Link href="/upload">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Tải lên video mới
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground">Quản lý tất cả video bạn đã tải lên</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng video</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myVideos.length}</div>
            <p className="text-xs text-muted-foreground">Video đã tải lên</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalViews / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Trên tất cả video</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt thích</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalLikes / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Lượt thích nhận được</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video gần đây</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                myVideos.filter((v) => {
                  const uploadDate = new Date(v.uploadedAt)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return uploadDate > weekAgo
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Tuần này</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm video của bạn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
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
      </div>

      {/* Videos List */}
      {filteredVideos.length > 0 ? (
        <div className="space-y-4">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="relative shrink-0">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-40 h-24 object-cover rounded"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg line-clamp-2 mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{video.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                      <Badge variant="outline">{video.category}</Badge>
                      <span>Tải lên: {formatDate(video.uploadedAt)}</span>
                      <span>{video.views} lượt xem</span>
                      <span>{video.likes} lượt thích</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem video
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteVideo(video.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa video
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {myVideos.length === 0 ? "Chưa có video nào" : "Không tìm thấy video"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {myVideos.length === 0
              ? "Bắt đầu tải lên video đầu tiên của bạn"
              : "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"}
          </p>
          {myVideos.length === 0 ? (
            <Link href="/upload">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Tải lên video đầu tiên
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("Tất cả")
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
