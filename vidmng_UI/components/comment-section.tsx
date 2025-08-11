"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, MessageCircle, Edit, Trash2, X, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

interface Comment {
  id: number
  content: string
  author_name: string
  created_at: string
}

interface CommentSectionProps {
  videoId: string
}

// Tạo tên ngẫu nhiên dựa trên thời gian
function generateRandomName(): string {
  const adjectives = ['Vui', 'Thông', 'Minh', 'Hạnh', 'Phúc', 'An', 'Bình', 'Dũng', 'Hùng', 'Nam']
  const nouns = ['Người', 'Bạn', 'Anh', 'Chị', 'Em', 'Cậu', 'Bạn', 'Người', 'Khách', 'Viewer']
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  const randomNumber = Math.floor(Math.random() * 999) + 1
  
  return `${randomAdjective}${randomNoun}${randomNumber}`
}

// Format thời gian
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Vừa xong'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`
  return `${Math.floor(diffInSeconds / 2592000)} tháng trước`
}

export function CommentSection({ videoId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load comments
  useEffect(() => {
    loadComments()
  }, [videoId])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/comments/by_video/?video_id=${videoId}`)
      setComments(response.data.results || response.data)
    } catch (error) {
      console.error('Lỗi khi tải comments:', error)
      toast({
        title: "Lỗi",
        description: "Không thể tải bình luận",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    try {
      setIsSubmitting(true)
      const authorName = generateRandomName()
      
      const response = await api.post('/comments/', {
        video: parseInt(videoId),
        content: newComment.trim(),
        author_name: authorName
      })

      setComments(prev => [response.data, ...prev])
      setNewComment("")
      setShowCommentForm(false)
      
      toast({
        title: "Thành công",
        description: "Đã thêm bình luận",
      })
    } catch (error) {
      console.error('Lỗi khi thêm comment:', error)
      toast({
        title: "Lỗi",
        description: "Không thể thêm bình luận",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: number) => {
    if (!editContent.trim()) return

    try {
      const response = await api.put(`/comments/${commentId}/`, {
        content: editContent.trim()
      })

      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: response.data.content }
            : comment
        )
      )
      
      setEditingComment(null)
      setEditContent("")
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật bình luận",
      })
    } catch (error) {
      console.error('Lỗi khi cập nhật comment:', error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật bình luận",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return

    try {
      await api.delete(`/comments/${commentId}/`)
      
      setComments(prev => prev.filter(comment => comment.id !== commentId))
      
      toast({
        title: "Thành công",
        description: "Đã xóa bình luận",
      })
    } catch (error) {
      console.error('Lỗi khi xóa comment:', error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa bình luận",
        variant: "destructive",
      })
    }
  }

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const cancelEditing = () => {
    setEditingComment(null)
    setEditContent("")
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium">Bình luận</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Đang tải bình luận...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-medium">{comments.length} bình luận</h3>
      </div>

      {/* Add Comment */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setShowCommentForm(true)}
              className="min-h-[80px] resize-none"
              disabled={isSubmitting}
            />
            {showCommentForm && (
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCommentForm(false)
                    setNewComment("")
                  }}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button 
                  size="sm" 
                  disabled={!newComment.trim() || isSubmitting}
                  onClick={handleSubmitComment}
                >
                  {isSubmitting ? "Đang gửi..." : "Bình luận"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={comment.author_name} />
                  <AvatarFallback>{comment.author_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sm">{comment.author_name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {formatTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => startEditing(comment)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[60px] resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Hủy
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEditComment(comment.id)}
                          disabled={!editContent.trim()}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Lưu
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">{comment.content}</p>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      0
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Trả lời
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
