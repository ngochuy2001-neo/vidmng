"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, Share, Download, Flag } from "lucide-react"

interface VideoInfoProps {
  videoId: string
}

export function VideoInfo({ videoId }: VideoInfoProps) {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  // Mock data
  const videoData = {
    title: "Hướng dẫn lập trình React từ cơ bản đến nâng cao",
    views: "125,432",
    uploadDate: "15 thg 12, 2024",
    likes: "2.1K",
    dislikes: "23",
    channel: {
      name: "Tech Academy",
      avatar: "/placeholder.svg?height=40&width=40",
      subscribers: "125K",
    },
    description: `Trong video này, chúng ta sẽ học React từ những kiến thức cơ bản nhất đến nâng cao. Video bao gồm:

- Giới thiệu về React và JSX
- Components và Props
- State và Lifecycle
- Event Handling
- Hooks (useState, useEffect, useContext)
- Routing với React Router
- State Management với Redux
- Best Practices và Performance Optimization

Phù hợp cho người mới bắt đầu và những ai muốn nâng cao kỹ năng React.`,
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold mb-2">{videoData.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {videoData.views} lượt xem • {videoData.uploadDate}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted rounded-full">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-l-full ${liked ? "text-primary" : ""}`}
                onClick={() => {
                  setLiked(!liked)
                  if (disliked) setDisliked(false)
                }}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {videoData.likes}
              </Button>
              <div className="w-px h-6 bg-border" />
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-r-full ${disliked ? "text-destructive" : ""}`}
                onClick={() => {
                  setDisliked(!disliked)
                  if (liked) setLiked(false)
                }}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="secondary" size="sm">
              <Share className="h-4 w-4 mr-1" />
              Chia sẻ
            </Button>

            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Tải xuống
            </Button>

            <Button variant="ghost" size="sm">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={videoData.channel.avatar || "/placeholder.svg"} alt={videoData.channel.name} />
            <AvatarFallback>{videoData.channel.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{videoData.channel.name}</h3>
            <p className="text-sm text-muted-foreground">{videoData.channel.subscribers} người đăng ký</p>
          </div>
        </div>

        <Button variant={subscribed ? "secondary" : "default"} onClick={() => setSubscribed(!subscribed)}>
          {subscribed ? "Đã đăng ký" : "Đăng ký"}
        </Button>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium mb-2">Mô tả</h3>
        <p className="text-sm whitespace-pre-line text-muted-foreground">{videoData.description}</p>
      </div>
    </div>
  )
}
