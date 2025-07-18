import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const recentVideos = [
  {
    id: "1",
    title: "Hướng dẫn React từ cơ bản",
    thumbnail: "/placeholder.svg?height=60&width=100",
    views: "125K",
    duration: "15:30",
    uploadedAt: "2 giờ trước",
    author: "Tech Academy",
  },
  {
    id: "2",
    title: "Top 10 địa điểm du lịch",
    thumbnail: "/placeholder.svg?height=60&width=100",
    views: "89K",
    duration: "12:45",
    uploadedAt: "4 giờ trước",
    author: "Travel Vietnam",
  },
  {
    id: "3",
    title: "Cách nấu phở bò chuẩn vị",
    thumbnail: "/placeholder.svg?height=60&width=100",
    views: "234K",
    duration: "8:20",
    uploadedAt: "6 giờ trước",
    author: "Món Ngon Mỗi Ngày",
  },
  {
    id: "4",
    title: "Review iPhone 15 Pro Max",
    thumbnail: "/placeholder.svg?height=60&width=100",
    views: "456K",
    duration: "18:15",
    uploadedAt: "1 giờ trước",
    author: "Tech Review VN",
  },
  {
    id: "5",
    title: "Workout tại nhà hiệu quả",
    thumbnail: "/placeholder.svg?height=60&width=100",
    views: "67K",
    duration: "30:00",
    uploadedAt: "8 giờ trước",
    author: "Fitness Life",
  },
]

export function RecentVideos() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Video gần đây</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/videos">Xem tất cả</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentVideos.map((video) => (
            <div key={video.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="relative">
                <Image
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  width={100}
                  height={60}
                  className="w-20 h-12 object-cover rounded"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1 mb-1">{video.title}</h4>
                <p className="text-xs text-muted-foreground mb-1">Bởi {video.author}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{video.views} lượt xem</span>
                  <span>{video.uploadedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
