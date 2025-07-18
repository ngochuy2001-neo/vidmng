"use client"

interface VideoPlayerProps {
  videoId: string
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video controls className="w-full h-full" poster="/placeholder.svg?height=400&width=700">
        <source src={`/api/video/${videoId}`} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>
    </div>
  )
}
