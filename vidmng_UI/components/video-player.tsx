"use client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { videoAPI, type Video } from "@/lib/api"

interface VideoPlayerProps {
  videoId: string
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
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
      setError("Không thể tải video. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Đang tải video...</span>
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

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        controls
        className="w-full h-full"
        poster={video.thumbnail || "/placeholder.svg?height=400&width=700"}
      >
        <source src={video.video_file} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>
    </div>
  )
}
