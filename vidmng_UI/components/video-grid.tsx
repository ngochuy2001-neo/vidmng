import { VideoCard } from "@/components/video-card"

const mockVideos = [
  {
    id: "1",
    title: "Hướng dẫn lập trình React từ cơ bản đến nâng cao",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "15:30",
    views: "125K",
    uploadTime: "2 ngày trước",
    channel: "Tech Academy",
    channelAvatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    title: "Top 10 địa điểm du lịch đẹp nhất Việt Nam 2024",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "12:45",
    views: "89K",
    uploadTime: "1 tuần trước",
    channel: "Travel Vietnam",
    channelAvatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    title: "Cách nấu phở bò chuẩn vị Hà Nội",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "8:20",
    views: "234K",
    uploadTime: "3 ngày trước",
    channel: "Món Ngon Mỗi Ngày",
    channelAvatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    title: "Review iPhone 15 Pro Max - Có đáng để nâng cấp?",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "18:15",
    views: "456K",
    uploadTime: "5 ngày trước",
    channel: "Tech Review VN",
    channelAvatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    title: "Workout tại nhà 30 phút - Giảm cân hiệu quả",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "30:00",
    views: "67K",
    uploadTime: "1 ngày trước",
    channel: "Fitness Life",
    channelAvatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    title: "Tin tức công nghệ tuần này - AI và tương lai",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "22:30",
    views: "178K",
    uploadTime: "4 ngày trước",
    channel: "Tech News",
    channelAvatar: "/placeholder.svg?height=40&width=40",
  },
]

export function VideoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mockVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
