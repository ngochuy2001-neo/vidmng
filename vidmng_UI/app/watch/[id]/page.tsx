import { VideoPlayer } from "@/components/video-player"
import { VideoInfo } from "@/components/video-info"
import { CommentSection } from "@/components/comment-section"
import { RelatedVideos } from "@/components/related-videos"

interface WatchPageProps {
  params: {
    id: string
  }
}

export default function WatchPage({ params }: WatchPageProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer videoId={params.id} />
          <VideoInfo videoId={params.id} />
          <CommentSection videoId={params.id} />
        </div>
        <div className="lg:col-span-1">
          <RelatedVideos videoId={params.id} />
        </div>
      </div>
    </div>
  )
}
