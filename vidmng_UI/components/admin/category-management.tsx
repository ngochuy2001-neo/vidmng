"use client"

import type React from "react"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, FolderOpen, Video, Upload, ImageIcon } from "lucide-react"
import Image from "next/image"

const mockCategories = [
  {
    id: "1",
    name: "Công nghệ",
    description: "Video về công nghệ, lập trình, AI, và các xu hướng tech mới nhất",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: 1234,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Giải trí",
    description: "Video giải trí, comedy, gaming, và các nội dung vui nhộn",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: 2567,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Giáo dục",
    description: "Video học tập, tutorial, hướng dẫn và kiến thức bổ ích",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: 987,
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Ẩm thực",
    description: "Video nấu ăn, review món ăn, và văn hóa ẩm thực",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: 456,
    createdAt: "2024-02-01",
  },
  {
    id: "5",
    name: "Du lịch",
    description: "Video du lịch, khám phá địa điểm và trải nghiệm",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: 789,
    createdAt: "2024-01-25",
  },
  {
    id: "6",
    name: "Thể thao",
    description: "Video thể thao, tin tức và highlight các trận đấu",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: 234,
    createdAt: "2024-02-10",
  },
]

export function CategoryManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState(mockCategories)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: "",
  })

  const [editingCategory, setEditingCategory] = useState<(typeof mockCategories)[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleDelete = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddCategory = () => {
    const category = {
      id: Date.now().toString(),
      ...newCategory,
      image: imagePreview || "/placeholder.svg?height=200&width=300",
      videoCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setCategories([...categories, category])
    setNewCategory({ name: "", description: "", image: "" })
    setSelectedImage(null)
    setImagePreview("")
    setIsAddDialogOpen(false)
  }

  const handleEdit = (category: (typeof mockCategories)[0]) => {
    setEditingCategory(category)
    setNewCategory({
      name: category.name,
      description: category.description,
      image: category.image,
    })
    setImagePreview(category.image)
    setIsEditDialogOpen(true)
  }

  const handleUpdateCategory = () => {
    if (!editingCategory) return

    const updatedCategory = {
      ...editingCategory,
      ...newCategory,
      image: imagePreview || editingCategory.image,
    }

    setCategories(categories.map((cat) => (cat.id === editingCategory.id ? updatedCategory : cat)))
    setNewCategory({ name: "", description: "", image: "" })
    setSelectedImage(null)
    setImagePreview("")
    setEditingCategory(null)
    setIsEditDialogOpen(false)
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalVideos = categories.reduce((sum, cat) => sum + cat.videoCount, 0)

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quản lý Category</h1>
              <p className="text-muted-foreground">Quản lý danh mục video trên nền tảng</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Thêm Category Mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên Category *</Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Nhập tên category..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả *</Label>
                    <Textarea
                      id="description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Mô tả về category này..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Hình ảnh *</Label>
                    <div className="space-y-4">
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                          <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                        </div>
                      )}

                      {/* Upload Button */}
                      <div className="flex items-center gap-4">
                        <Button asChild variant="outline" className="flex-1 bg-transparent">
                          <label htmlFor="image-upload" className="cursor-pointer flex items-center justify-center">
                            <Upload className="mr-2 h-4 w-4" />
                            {selectedImage ? "Thay đổi hình ảnh" : "Chọn hình ảnh"}
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageSelect}
                            />
                          </label>
                        </Button>
                        {selectedImage && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                            <span>{selectedImage.name}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false)
                        setNewCategory({ name: "", description: "", image: "" })
                        setSelectedImage(null)
                        setImagePreview("")
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleAddCategory}
                      disabled={!newCategory.name || !newCategory.description || !imagePreview}
                    >
                      Thêm Category
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Tên Category *</Label>
                    <Input
                      id="edit-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Nhập tên category..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Mô tả *</Label>
                    <Textarea
                      id="edit-description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Mô tả về category này..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-image">Hình ảnh *</Label>
                    <div className="space-y-4">
                      {imagePreview && (
                        <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                          <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <Button asChild variant="outline" className="flex-1 bg-transparent">
                          <label
                            htmlFor="edit-image-upload"
                            className="cursor-pointer flex items-center justify-center"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {selectedImage ? "Thay đổi hình ảnh" : "Chọn hình ảnh"}
                            <input
                              id="edit-image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageSelect}
                            />
                          </label>
                        </Button>
                        {selectedImage && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                            <span>{selectedImage.name}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditDialogOpen(false)
                        setNewCategory({ name: "", description: "", image: "" })
                        setSelectedImage(null)
                        setImagePreview("")
                        setEditingCategory(null)
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleUpdateCategory}
                      disabled={!newCategory.name || !newCategory.description || !imagePreview}
                    >
                      Cập nhật Category
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Categories</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground">Danh mục có sẵn</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Videos</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVideos.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Trên tất cả categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Category Phổ biến</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {categories.sort((a, b) => b.videoCount - a.videoCount)[0]?.name}
                </div>
                <p className="text-xs text-muted-foreground">
                  {categories.sort((a, b) => b.videoCount - a.videoCount)[0]?.videoCount} videos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-background rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Số Video</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{category.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{category.videoCount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-destructive">
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

          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không tìm thấy category nào</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
