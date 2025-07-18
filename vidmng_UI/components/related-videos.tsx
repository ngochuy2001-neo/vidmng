import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RelatedVideosProps {
  videoId: string
}

const relatedVideos = [
  {
    id: "2",
    title: "React Hooks - useState và useEffect chi tiết",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "12:30",
    channel: "Tech Academy",
    channelAvatar: "/placeholder.svg?height=24&width=24",
    views: "89K",
    uploadTime: "1 tuần trước",
  },
  {
    id: "3",
    title: "Redux Toolkit - Quản lý state hiện đại",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "18:45",
    channel: "Code Master",
    channelAvatar: "/placeholder.svg?height=24&width=24",
    views: "156K",
    uploadTime: "3 ngày trước",
  },
  {
    id: "4",
    title: "Next.js 14 - App Router và Server Components",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "25:10",
    channel: "Web Dev Pro",
    channelAvatar: "/placeholder.svg?height=24&width=24",
    views: "234K",
    uploadTime: "5 ngày trước",
  },
]

export function RelatedVideos({ videoId }: RelatedVideosProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Video liên quan</h3>
      <div className="space-y-3">
        {relatedVideos.map((video) => (
          <Link
            key={video.id}
            href={`/watch/${video.id}`}
            className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="relative shrink-0">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                width={200}
                height={120}
                className="w-40 h-24 object-cover rounded"
              />
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                {video.duration}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h4>
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={video.channelAvatar || "/placeholder.svg"} alt={video.channel} />
                  <AvatarFallback>{video.channel[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{video.channel}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {video.views} lượt xem • {video.uploadTime}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
