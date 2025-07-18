import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Eye, Upload, Play } from "lucide-react"

const stats = [
  {
    title: "Tổng Video",
    value: "1,234",
    change: "+12 video hôm nay",
    icon: Video,
    color: "text-blue-600",
  },
  {
    title: "Lượt xem hôm nay",
    value: "45,678",
    change: "+8% so với hôm qua",
    icon: Eye,
    color: "text-green-600",
  },
  {
    title: "Video mới hôm nay",
    value: "12",
    change: "+2 so với hôm qua",
    icon: Upload,
    color: "text-purple-600",
  },
  {
    title: "Tổng lượt thích",
    value: "89K",
    change: "+15% tuần này",
    icon: Play,
    color: "text-orange-600",
  },
]

export function VideoStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground font-medium">{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
