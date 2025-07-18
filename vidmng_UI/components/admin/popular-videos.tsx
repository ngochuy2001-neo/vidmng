import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const popularVideos = [
  {
    id: "1",
    title: "Hướng dẫn React từ cơ bản",
    thumbnail: "/placeholder.svg?height=60&width=100",
    views: "125K",
    likes: "2.1K",
  },
  {
    id: "2",
    title: "Top 10 địa điểm du lịch",
    thumbnail: "/placeholder.svg?height=60&width=100",
    views: "89K",
    likes: "1.5K",
  },
  {
    id: "3",
    title: "Cách nấu phở bò chuẩn vị",
    thumbnail: "/placeholder.svg?height=60&width=100",
    views: "234K",
    likes: "3.2K",
  },
  {
    id: "4",
    title: "Review iPhone 15 Pro Max",
    thumbnail: "/placeholder.svg?height=60&width=100",
    views: "456K",
    likes: "5.1K",
  },
]

export function PopularVideos() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Video phổ biến</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularVideos.map((video) => (
            <div key={video.id} className="flex items-center gap-3">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                width={100}
                height={60}
                className="w-16 h-10 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1 mb-1">{video.title}</h4>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{video.views} lượt xem</span>
                  <span>{video.likes} lượt thích</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
