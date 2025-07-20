"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Home, Clock, FolderOpen, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

const mainNavItems = [
  {
    title: "Trang chủ",
    href: "/",
    icon: Home,
  },
]


const categoryItems = [
  {
    title: "Danh mục",
    href: "/categories",
    icon: FolderOpen,
    color: "text-blue-500",
  },
  {
    title: "Keywords",
    href: "/keywords",
    icon: Tag,
    color: "text-purple-500",
  },
]

interface ClientSidebarProps {
  className?: string
}

export function ClientSidebar({ className }: ClientSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>


        <Separator />

        <div className="px-3 py-2">
          <div className="space-y-1">
            {categoryItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href={item.href}>
                    <Icon className={cn("mr-2 h-4 w-4", item.color)} />
                    {item.title}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
