"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const categories = [
  "Tất cả",
  "Âm nhạc",
  "Giải trí",
  "Thể thao",
  "Tin tức",
  "Giáo dục",
  "Công nghệ",
  "Du lịch",
  "Ẩm thực",
  "Thời trang",
]

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState("Tất cả")

  return (
    <div className="mb-8" id="videos">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "secondary"}
              onClick={() => setActiveCategory(category)}
              className="shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
