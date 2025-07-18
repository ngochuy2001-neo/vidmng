import { VideoUpload } from "@/components/video-upload"

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tải lên video</h1>
      <VideoUpload />
    </div>
  )
}
