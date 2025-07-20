"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Edit, Trash2, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { videoAPI, categoryAPI, tagAPI, type Video, type Category, type Tag } from "@/lib/api"

export function VideoManagement() {
  const [videos, setVideos] = useState<Video[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    category: "",
    status: "draft" as "draft" | "published" | "archived",
    tag_ids: [] as number[],
  })
  const { toast } = useToast()

  // Fetch videos và categories
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [videosData, categoriesData, tagsData] = await Promise.all([
        videoAPI.getVideos(),
        categoryAPI.getCategories(),
        tagAPI.getTags()
      ])
      
      setVideos(videosData.results || videosData)
      setCategories(categoriesData.results || categoriesData)
      setTags(tagsData.results || tagsData)
    } catch (err: any) {
      console.error('Lỗi khi tải dữ liệu:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Search videos
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await fetchData()
      return
    }

    try {
      setLoading(true)
      const data = await videoAPI.getVideos({ search: searchQuery })
      setVideos(data.results || data)
    } catch (err: any) {
      console.error('Lỗi khi tìm kiếm:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Không thể tìm kiếm video. Vui lòng thử lại.'
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("")
    fetchData()
  }

  // Delete video
  const handleDelete = async (videoId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa video này?')) return

    try {
      setIsDeleting(videoId)
      await videoAPI.deleteVideo(videoId)
      
      setVideos(videos.filter((video) => video.id !== videoId))
      toast({
        title: "Thành công",
        description: "Đã xóa video thành công.",
      })
    } catch (err: any) {
      console.error('Lỗi khi xóa video:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Không thể xóa video. Vui lòng thử lại.'
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  // Edit video
  const handleEdit = (video: Video) => {
    setEditingVideo(video)
    // Lấy tag IDs từ tag names (cần map từ tag names sang tag IDs)
    const tagIds = video.tag_names && Array.isArray(video.tag_names) ? 
      tags.filter(tag => video.tag_names?.includes(tag.name)).map(tag => tag.id) : []
    
    const formData = {
      title: video.title || "",
      description: video.description || "",
      category: video.category_name || "none",
      status: video.status || "draft",
      tag_ids: tagIds,
    }
    
    setEditFormData(formData)
    setIsEditDialogOpen(true)
  }

  // Update video
  const handleUpdateVideo = async () => {
    if (!editingVideo) return

    try {
      setIsUpdating(true)
      const categoryId = editFormData.category === "none" ? null : categories.find(cat => cat.name === editFormData.category)?.id
      
      const updateData = {
        title: editFormData.title,
        description: editFormData.description,
        category: categoryId,
        status: editFormData.status,
        tag_ids: editFormData.tag_ids,
      }

      const updatedVideo = await videoAPI.updateVideo(editingVideo.id, updateData)
      
      setVideos(videos.map((vid) => (vid.id === editingVideo.id ? updatedVideo : vid)))
      setEditFormData({ title: "", description: "", category: "", status: "draft", tag_ids: [] })
      setEditingVideo(null)
      setIsEditDialogOpen(false)
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật video thành công.",
      })
    } catch (err: any) {
      console.error('Lỗi khi cập nhật video:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Không thể cập nhật video. Vui lòng thử lại.'
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Toggle favorite
  const handleToggleFavorite = async (video: Video) => {
    try {
      await videoAPI.toggleFavorite(video.id)
      setVideos(videos.map((vid) => 
        vid.id === video.id ? { ...vid, is_favorite: !vid.is_favorite } : vid
      ))
      toast({
        title: "Thành công",
        description: video.is_favorite ? "Đã bỏ khỏi yêu thích" : "Đã thêm vào yêu thích",
      })
    } catch (err: any) {
      console.error('Lỗi khi toggle favorite:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Không thể cập nhật trạng thái yêu thích.'
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // Format view count
  const formatViewCount = (count: number | undefined) => {
    if (!count || count === 0) return "0"
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("vi-VN")
    } catch (error) {
      return "N/A"
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Bản nháp", variant: "secondary" as const },
      published: { label: "Đã xuất bản", variant: "default" as const },
      archived: { label: "Đã lưu trữ", variant: "destructive" as const },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading && videos.length === 0) {
    return (
      <div className="flex min-h-screen bg-muted/10">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải dữ liệu...</span>
          </div>
        </main>
      </div>
    )
  }

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
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tìm kiếm"}
              </Button>
              {searchQuery && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Xóa
                </Button>
              )}
              <Button variant="outline" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={fetchData}>
                  Thử lại
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-background rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Lượt xem</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
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
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title || "Không có tiêu đề"}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{video.description || "Không có mô tả"}</p>
                          {video.tag_names && Array.isArray(video.tag_names) && video.tag_names.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {video.tag_names.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {video.tag_names.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{video.tag_names.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{video.category_name || "Không có"}</TableCell>
                    <TableCell>{getStatusBadge(video.status)}</TableCell>
                    <TableCell>{formatDate(video.created_at)}</TableCell>
                    <TableCell>{formatViewCount(video.view_count)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleFavorite(video)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {video.is_favorite ? "Bỏ yêu thích" : "Yêu thích"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(video)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(video.id)} 
                            className="text-destructive"
                            disabled={isDeleting === video.id}
                          >
                            {isDeleting === video.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
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

          {videos.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không tìm thấy video nào</p>
            </div>
          )}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) {
          // Reset form khi đóng dialog
          setEditFormData({ title: "", description: "", category: "", status: "draft", tag_ids: [] })
          setEditingVideo(null)
        }
      }}>
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
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder="Nhập mô tả video..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Danh mục</Label>
              <Select
                value={editFormData.category}
                onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value: "draft" | "published" | "archived") => 
                  setEditFormData({ ...editFormData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                  <SelectItem value="archived">Đã lưu trữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={editFormData.tag_ids.includes(tag.id)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          setEditFormData({
                            ...editFormData,
                            tag_ids: [...editFormData.tag_ids, tag.id]
                          })
                        } else {
                          setEditFormData({
                            ...editFormData,
                            tag_ids: editFormData.tag_ids.filter(id => id !== tag.id)
                          })
                        }
                      }}
                    />
                    <label
                      htmlFor={`tag-${tag.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
                              <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    // Không reset form ngay, chỉ đóng dialog
                  }}
                  disabled={isUpdating}
                >
                Hủy
              </Button>
              <Button onClick={handleUpdateVideo} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Cập nhật Video
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
