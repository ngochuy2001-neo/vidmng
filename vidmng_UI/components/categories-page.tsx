import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Users } from "lucide-react"

const categories = [
  {
    id: "music",
    name: "Âm nhạc",
    description: "Khám phá thế giới âm nhạc đa dạng với các MV, cover, và nhạc cụ",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "2.5M",
    subscriberCount: "125K",
    color: "from-pink-500 to-rose-500",
    href: "/category/music",
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "Gameplay, review game, và cộng đồng game thủ sôi động",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "1.8M",
    subscriberCount: "89K",
    color: "from-purple-500 to-indigo-500",
    href: "/category/gaming",
  },
  {
    id: "education",
    name: "Giáo dục",
    description: "Học tập hiệu quả với các khóa học và tutorial chất lượng",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "987K",
    subscriberCount: "156K",
    color: "from-blue-500 to-cyan-500",
    href: "/category/education",
  },
  {
    id: "food",
    name: "Ẩm thực",
    description: "Khám phá văn hóa ẩm thực và học nấu các món ngon",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "756K",
    subscriberCount: "67K",
    color: "from-orange-500 to-red-500",
    href: "/category/food",
  },
  {
    id: "travel",
    name: "Du lịch",
    description: "Khám phá thế giới qua những hành trình đầy thú vị",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "634K",
    subscriberCount: "78K",
    color: "from-green-500 to-emerald-500",
    href: "/category/travel",
  },
  {
    id: "technology",
    name: "Công nghệ",
    description: "Cập nhật xu hướng công nghệ và review sản phẩm mới nhất",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "1.2M",
    subscriberCount: "234K",
    color: "from-gray-500 to-slate-500",
    href: "/category/technology",
  },
  {
    id: "sports",
    name: "Thể thao",
    description: "Tin tức thể thao, highlight trận đấu và kỹ thuật luyện tập",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "445K",
    subscriberCount: "92K",
    color: "from-yellow-500 to-orange-500",
    href: "/category/sports",
  },
  {
    id: "fashion",
    name: "Thời trang",
    description: "Xu hướng thời trang mới nhất và cách phối đồ sành điệu",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "523K",
    subscriberCount: "145K",
    color: "from-indigo-500 to-purple-500",
    href: "/category/fashion",
  },
  {
    id: "beauty",
    name: "Làm đẹp",
    description: "Tips làm đẹp, makeup tutorial và skincare routine",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "678K",
    subscriberCount: "189K",
    color: "from-rose-500 to-pink-500",
    href: "/category/beauty",
  },
  {
    id: "lifestyle",
    name: "Lối sống",
    description: "Chia sẻ về cuộc sống hàng ngày và những trải nghiệm thú vị",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "834K",
    subscriberCount: "112K",
    color: "from-teal-500 to-green-500",
    href: "/category/lifestyle",
  },
  {
    id: "news",
    name: "Tin tức",
    description: "Cập nhật tin tức nóng hổi và phân tích sự kiện thời sự",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "567K",
    subscriberCount: "203K",
    color: "from-red-500 to-rose-500",
    href: "/category/news",
  },
  {
    id: "entertainment",
    name: "Giải trí",
    description: "Nội dung giải trí đa dạng từ comedy đến variety show",
    image: "/placeholder.svg?height=200&width=300",
    videoCount: "1.5M",
    subscriberCount: "298K",
    color: "from-violet-500 to-purple-500",
    href: "/category/entertainment",
  },
]

export function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Khám phá theo danh mục</h1>
        <p className="text-xl text-muted-foreground">Tìm kiếm nội dung yêu thích của bạn qua các danh mục đa dạng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={category.href}>
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`} />

                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {category.name}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{category.description}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    <span>{category.videoCount} videos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{category.subscriberCount} người theo dõi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Popular Categories Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Danh mục phổ biến nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((category, index) => (
            <Link key={category.id} href={category.href}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-muted-foreground">#{index + 1}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.videoCount} videos • {category.subscriberCount} người theo dõi
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center`}
                    >
                      <Play className="h-5 w-5 text-white fill-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
