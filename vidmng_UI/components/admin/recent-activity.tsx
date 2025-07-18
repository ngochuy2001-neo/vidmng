import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: "1",
    user: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=32&width=32",
    action: "đã tải lên video mới",
    target: "Hướng dẫn React Hooks",
    time: "5 phút trước",
    type: "upload",
  },
  {
    id: "2",
    user: "Trần Thị B",
    avatar: "/placeholder.svg?height=32&width=32",
    action: "đã báo cáo video",
    target: "Video vi phạm quy định",
    time: "15 phút trước",
    type: "report",
  },
  {
    id: "3",
    user: "Lê Văn C",
    avatar: "/placeholder.svg?height=32&width=32",
    action: "đã đăng ký tài khoản",
    target: "",
    time: "1 giờ trước",
    type: "register",
  },
  {
    id: "4",
    user: "Phạm Thị D",
    avatar: "/placeholder.svg?height=32&width=32",
    action: "đã xóa video",
    target: "Video cũ không còn phù hợp",
    time: "2 giờ trước",
    type: "delete",
  },
]

const getTypeBadge = (type: string) => {
  switch (type) {
    case "upload":
      return <Badge variant="secondary">Tải lên</Badge>
    case "report":
      return <Badge variant="destructive">Báo cáo</Badge>
    case "register":
      return <Badge variant="default">Đăng ký</Badge>
    case "delete":
      return <Badge variant="outline">Xóa</Badge>
    default:
      return <Badge variant="secondary">Khác</Badge>
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                <AvatarFallback>{activity.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{activity.user}</span>
                  {getTypeBadge(activity.type)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.action} {activity.target && `"${activity.target}"`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
