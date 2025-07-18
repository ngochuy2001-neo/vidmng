import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface VideoCardProps {
  video: {
    id: string
    title: string
    thumbnail: string
    duration: string
    views: string
    uploadTime: string
    channel: string
    channelAvatar: string
  }
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
      <Link href={`/watch/${video.id}`}>
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={video.thumbnail || "/placeholder.svg"}
              alt={video.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>
          <div className="p-4">
            <div className="flex gap-3">
              <Avatar className="w-9 h-9 shrink-0">
                <AvatarImage src={video.channelAvatar || "/placeholder.svg"} alt={video.channel} />
                <AvatarFallback>{video.channel[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{video.channel}</p>
                <p className="text-sm text-muted-foreground">
                  {video.views} lượt xem • {video.uploadTime}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
