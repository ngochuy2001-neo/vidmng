"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"

interface CommentSectionProps {
  videoId: string
}

const mockComments = [
  {
    id: "1",
    author: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "Video rất hay và dễ hiểu! Cảm ơn bạn đã chia sẻ.",
    likes: 12,
    dislikes: 0,
    timeAgo: "2 giờ trước",
    replies: [],
  },
  {
    id: "2",
    author: "Trần Thị B",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "Mình đã theo dõi từ đầu đến cuối, rất chi tiết và bổ ích. Chờ video tiếp theo!",
    likes: 8,
    dislikes: 1,
    timeAgo: "5 giờ trước",
    replies: [
      {
        id: "2-1",
        author: "Tech Academy",
        avatar: "/placeholder.svg?height=32&width=32",
        content: "Cảm ơn bạn! Video tiếp theo sẽ về Redux nhé.",
        likes: 3,
        dislikes: 0,
        timeAgo: "3 giờ trước",
      },
    ],
  },
]

export function CommentSection({ videoId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [showCommentForm, setShowCommentForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-medium">156 bình luận</h3>
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
                >
                  Hủy
                </Button>
                <Button size="sm" disabled={!newComment.trim()}>
                  Bình luận
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {mockComments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                <AvatarFallback>{comment.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-muted-foreground ml-2">{comment.timeAgo}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {comment.likes}
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

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="ml-11 space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={reply.avatar || "/placeholder.svg"} alt={reply.author} />
                      <AvatarFallback>{reply.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div>
                        <span className="font-medium text-sm">{reply.author}</span>
                        <span className="text-xs text-muted-foreground ml-2">{reply.timeAgo}</span>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {reply.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Trả lời
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
