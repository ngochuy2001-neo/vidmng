"use client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { VideoStats } from "@/components/admin/video-stats"
import { RecentVideos } from "@/components/admin/recent-videos"

export function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Quản lý Video</h1>
            <p className="text-muted-foreground">Tổng quan về video trên nền tảng</p>
          </div>

          <VideoStats />

          <RecentVideos />
        </div>
      </main>
    </div>
  )
}
