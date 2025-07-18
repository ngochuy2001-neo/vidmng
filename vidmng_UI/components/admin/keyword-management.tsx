"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Tag, TrendingUp, Hash } from "lucide-react"

const mockKeywords = [
  {
    id: "1",
    label: "React",
    category: "Công nghệ",
    usageCount: 1234,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    label: "JavaScript",
    category: "Công nghệ",
    usageCount: 2567,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    label: "Tutorial",
    category: "Giáo dục",
    usageCount: 987,
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    label: "Cooking",
    category: "Ẩm thực",
    usageCount: 456,
    createdAt: "2024-02-01",
  },
  {
    id: "5",
    label: "Travel",
    category: "Du lịch",
    usageCount: 789,
    createdAt: "2024-01-25",
  },
  {
    id: "6",
    label: "Gaming",
    category: "Giải trí",
    usageCount: 1567,
    createdAt: "2024-01-18",
  },
]

const KEYWORD_CATEGORIES = [
  "Công nghệ",
  "Giáo dục",
  "Giải trí",
  "Ẩm thực",
  "Du lịch",
  "Âm nhạc",
  "Thể thao",
  "Thời trang",
  "Làm đẹp",
  "Lối sống",
  "Tin tức",
  "Khác",
]

export function KeywordManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [keywords, setKeywords] = useState(mockKeywords)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all")
  const [newKeyword, setNewKeyword] = useState({
    label: "",
    category: "",
  })

  const [editingKeyword, setEditingKeyword] = useState<(typeof mockKeywords)[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const getPopularityBadge = (usageCount: number) => {
    if (usageCount > 1000) {
      return <Badge variant="default">Hot</Badge>
    } else if (usageCount > 500) {
      return <Badge variant="secondary">Phổ biến</Badge>
    } else if (usageCount > 100) {
      return <Badge variant="outline">Bình thường</Badge>
    } else {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Ít dùng
        </Badge>
      )
    }
  }

  const handleDelete = (keywordId: string) => {
    setKeywords(keywords.filter((keyword) => keyword.id !== keywordId))
  }

  const handleAddKeyword = () => {
    const keyword = {
      id: Date.now().toString(),
      ...newKeyword,
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setKeywords([...keywords, keyword])
    setNewKeyword({ label: "", category: "" })
    setIsAddDialogOpen(false)
  }

  const handleEdit = (keyword: (typeof mockKeywords)[0]) => {
    setEditingKeyword(keyword)
    setNewKeyword({
      label: keyword.label,
      category: keyword.category,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateKeyword = () => {
    if (!editingKeyword) return

    const updatedKeyword = {
      ...editingKeyword,
      ...newKeyword,
    }

    setKeywords(keywords.map((kw) => (kw.id === editingKeyword.id ? updatedKeyword : kw)))
    setNewKeyword({ label: "", category: "" })
    setEditingKeyword(null)
    setIsEditDialogOpen(false)
  }

  const filteredKeywords = keywords.filter((keyword) => {
    const matchesSearch =
      keyword.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      keyword.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === "all" || keyword.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const totalKeywords = keywords.length
  const totalUsage = keywords.reduce((sum, k) => sum + k.usageCount, 0)
  const topKeyword = keywords.sort((a, b) => b.usageCount - a.usageCount)[0]

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quản lý Keywords</h1>
              <p className="text-muted-foreground">Quản lý từ khóa cho video trên nền tảng</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Keyword
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Thêm Keyword Mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Tên keyword</Label>
                    <Input
                      id="label"
                      value={newKeyword.label}
                      onChange={(e) => setNewKeyword({ ...newKeyword, label: e.target.value })}
                      placeholder="React"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newKeyword.category}
                      onValueChange={(value) => setNewKeyword({ ...newKeyword, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn category" />
                      </SelectTrigger>
                      <SelectContent>
                        {KEYWORD_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleAddKeyword}>Thêm Keyword</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa Keyword</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-label">Tên keyword</Label>
                    <Input
                      id="edit-label"
                      value={newKeyword.label}
                      onChange={(e) => setNewKeyword({ ...newKeyword, label: e.target.value })}
                      placeholder="React"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      value={newKeyword.category}
                      onValueChange={(value) => setNewKeyword({ ...newKeyword, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn category" />
                      </SelectTrigger>
                      <SelectContent>
                        {KEYWORD_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditDialogOpen(false)
                        setNewKeyword({ label: "", category: "" })
                        setEditingKeyword(null)
                      }}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleUpdateKeyword}>Cập nhật Keyword</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Keywords</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalKeywords}</div>
                <p className="text-xs text-muted-foreground">Từ khóa có sẵn</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng lượt sử dụng</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Trên tất cả keywords</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Keyword Hot nhất</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topKeyword?.label}</div>
                <p className="text-xs text-muted-foreground">{topKeyword?.usageCount.toLocaleString()} lượt sử dụng</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{KEYWORD_CATEGORIES.length}</div>
                <p className="text-xs text-muted-foreground">Danh mục keywords</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả categories</SelectItem>
                {KEYWORD_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords Table */}
          <div className="bg-background rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Lượt sử dụng</TableHead>
                  <TableHead>Độ phổ biến</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeywords.map((keyword) => (
                  <TableRow key={keyword.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div className="font-medium">{keyword.label}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{keyword.category}</Badge>
                    </TableCell>
                    <TableCell>{keyword.usageCount.toLocaleString()}</TableCell>
                    <TableCell>{getPopularityBadge(keyword.usageCount)}</TableCell>
                    <TableCell>{new Date(keyword.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(keyword)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(keyword.id)} className="text-destructive">
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

          {filteredKeywords.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không tìm thấy keyword nào</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
