import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users, Eye, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Tổng Video",
    value: "1,234",
    change: "+12%",
    icon: Video,
    color: "text-blue-600",
  },
  {
    title: "Người dùng",
    value: "45,678",
    change: "+8%",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Lượt xem",
    value: "2.3M",
    change: "+23%",
    icon: Eye,
    color: "text-purple-600",
  },
  {
    title: "Tăng trưởng",
    value: "15.2%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "text-orange-600",
  },
]

export function StatsCards() {
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
              <p className="text-xs text-green-600 font-medium">{stat.change} so với tháng trước</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
