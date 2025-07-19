"use client"
import { useEffect, useState } from "react"
import { VideoCard } from "@/components/video-card"
import { videoAPI, type Video } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { usePathname } from "next/navigation"

function formatDateVN(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN")
}

export function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    fetchVideos()
  }, [pathname])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Lấy category slug từ URL path
      const pathSegments = pathname.split('/')
      const categorySlug = pathSegments[pathSegments.length - 1]
      
      let data
      if (pathname.startsWith('/category/') && categorySlug && categorySlug !== 'categories') {
        // Nếu đang ở trang category, lấy video từ API categories với include_videos=true
        console.log('Fetching category with videos from /api/categories/?slug=' + categorySlug + '&include_videos=true')
        const response = await fetch(`http://192.168.10.83/api/categories/?slug=${categorySlug}&include_videos=true`)
        const categoryData = await response.json()
        console.log('Category with videos API response:', categoryData)
        
        if (categoryData && categoryData.length > 0) {
          const category = categoryData[0]
          console.log('Category object:', category)
          console.log('Category videos:', category.videos)
          // Sử dụng video từ category response
          data = { results: category.videos || [] }
          console.log('Final data for videos:', data)
        } else {
          console.log('No category found or empty response')
          data = { results: [] }
        }
      } else if (pathname.startsWith('/keyword/') && categorySlug && categorySlug !== 'keywords') {
        // Nếu đang ở trang keyword, lấy video từ API tags với include_videos=true
        console.log('Fetching tag with videos from /api/tags/?slug=' + categorySlug + '&include_videos=true')
        const response = await fetch(`http://192.168.10.83/api/tags/?slug=${categorySlug}&include_videos=true`)
        const tagData = await response.json()
        console.log('Tag with videos API response:', tagData)
        
        if (tagData && tagData.length > 0) {
          const tag = tagData[0]
          console.log('Tag object:', tag)
          console.log('Tag videos:', tag.videos)
          // Sử dụng video từ tag response
          data = { results: tag.videos || [] }
          console.log('Final data for videos:', data)
        } else {
          console.log('No tag found or empty response')
          data = { results: [] }
        }
      } else {
        // Nếu không phải trang category hoặc keyword, lấy tất cả video
        console.log('Fetching all videos from /videos/ API')
        data = await videoAPI.getVideos({ status: 'published' })
        console.log('All videos API response:', data)
      }
      
      // Lấy video list từ response
      const videoList = data.results || data || []
      console.log('Final video list:', videoList)
      console.log('Video count:', videoList.length)
      
      setVideos(videoList)
    } catch (err: any) {
      console.error('Error fetching videos:', err)
      setError("Không thể tải danh sách video. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Đang tải video...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-destructive py-8">
        {error}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Không có video nào.
      </div>
    )
  }

  return (
    <div>
      {/* Debug info */}

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={{
              id: String(video.id),
              title: video.title,
              thumbnail: video.thumbnail || "/placeholder.svg?height=200&width=300",
              views: video.view_count?.toLocaleString("vi-VN") || "0",
              uploadTime: video.created_at ? formatDateVN(video.created_at) : "",
              duration: "", // Nếu backend có duration thì truyền vào, còn không thì để rỗng
              channel: video.category_name || "",
              channelAvatar: "/placeholder.svg?height=40&width=40",
            }}
          />
        ))}
      </div>
    </div>
  )
}
