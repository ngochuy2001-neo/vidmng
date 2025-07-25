"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, Share, Download, Flag, Loader2 } from "lucide-react"
import { videoAPI, type Video } from "@/lib/api"

interface VideoInfoProps {
  videoId: string
}

export function VideoInfo({ videoId }: VideoInfoProps) {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVideo()
    // eslint-disable-next-line
  }, [videoId])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await videoAPI.getVideo(Number(videoId))
      setVideo(data)
    } catch (err: any) {
      setError("Không thể tải thông tin video. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Đang tải thông tin video...</span>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="text-center text-destructive py-8">
        {error || "Không tìm thấy video."}
      </div>
    )
  }

  // Format dữ liệu
  const views = video.view_count?.toLocaleString("vi-VN") || "0"
  const uploadDate = video.created_at ? new Date(video.created_at).toLocaleDateString("vi-VN") : ""
  const likes = video.is_favorite ? "Yêu thích" : ""
  const category = video.category_name || "Danh mục"
  const description = video.description || "Không có mô tả."
  const thumbnail = video.thumbnail || "/placeholder.svg?height=40&width=40"

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold mb-2">{video.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {views} lượt xem • {uploadDate}
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
                {likes || "Thích"}
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
            <AvatarImage src={thumbnail} alt={category} />
            <AvatarFallback>{category[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{category}</h3>
            {/* Có thể bổ sung thêm thông tin khác nếu backend trả về */}
          </div>
        </div>

        <Button variant={subscribed ? "secondary" : "default"} onClick={() => setSubscribed(!subscribed)}>
          {subscribed ? "Đã đăng ký" : "Đăng ký"}
        </Button>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium mb-2">Mô tả</h3>
        <p className="text-sm whitespace-pre-line text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
