"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockVideos = [
  {
    id: "1",
    title: "Hướng dẫn lập trình React từ cơ bản đến nâng cao",
    thumbnail: "/placeholder.svg?height=60&width=100",
    author: "Tech Academy",
    uploadDate: "2024-12-15",
    views: "125K",
    duration: "15:30",
    category: "Công nghệ",
  },
  {
    id: "2",
    title: "Top 10 địa điểm du lịch đẹp nhất Việt Nam 2024",
    thumbnail: "/placeholder.svg?height=60&width=100",
    author: "Travel Vietnam",
    uploadDate: "2024-12-10",
    views: "89K",
    duration: "12:45",
    category: "Du lịch",
  },
  {
    id: "3",
    title: "Cách nấu phở bò chuẩn vị Hà Nội",
    thumbnail: "/placeholder.svg?height=60&width=100",
    author: "Món Ngon Mỗi Ngày",
    uploadDate: "2024-12-12",
    views: "234K",
    duration: "8:20",
    category: "Ẩm thực",
  },
  {
    id: "4",
    title: "Review iPhone 15 Pro Max - Có đáng để nâng cấp?",
    thumbnail: "/placeholder.svg?height=60&width=100",
    author: "Tech Review VN",
    uploadDate: "2024-12-08",
    views: "456K",
    duration: "18:15",
    category: "Công nghệ",
  },
]

export function VideoManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState(mockVideos)
  const [editingVideo, setEditingVideo] = useState<(typeof mockVideos)[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
  })

  const handleDelete = (videoId: string) => {
    setVideos(videos.filter((video) => video.id !== videoId))
  }

  const handleEdit = (video: (typeof mockVideos)[0]) => {
    setEditingVideo(video)
    setEditFormData({
      title: video.title,
      category: video.category,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateVideo = () => {
    if (!editingVideo) return

    const updatedVideo = {
      ...editingVideo,
      ...editFormData,
    }

    setVideos(videos.map((vid) => (vid.id === editingVideo.id ? updatedVideo : vid)))
    setEditFormData({ title: "", category: "" })
    setEditingVideo(null)
    setIsEditDialogOpen(false)
  }

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.author.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quản lý Video</h1>
              <p className="text-muted-foreground">Quản lý tất cả video trên nền tảng</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm video..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Ngày tải</TableHead>
                  <TableHead>Lượt xem</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            width={100}
                            height={60}
                            className="w-20 h-12 object-cover rounded"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h3>
                          <p className="text-xs text-muted-foreground">{video.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{video.author}</TableCell>
                    <TableCell>{new Date(video.uploadDate).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>{video.views}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(video)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(video.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không tìm thấy video nào</p>
            </div>
          )}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Tiêu đề</Label>
              <Input
                id="edit-title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                placeholder="Nhập tiêu đề video..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editFormData.category}
                onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Công nghệ">Công nghệ</SelectItem>
                  <SelectItem value="Du lịch">Du lịch</SelectItem>
                  <SelectItem value="Ẩm thực">Ẩm thực</SelectItem>
                  <SelectItem value="Giải trí">Giải trí</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditFormData({ title: "", category: "" })
                  setEditingVideo(null)
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleUpdateVideo}>Cập nhật Video</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
