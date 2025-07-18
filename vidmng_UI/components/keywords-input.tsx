"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Tag, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface KeywordsInputProps {
  keywords: string[]
  onChange: (keywords: string[]) => void
  maxKeywords?: number
  error?: string
}

const AVAILABLE_KEYWORDS = [
  { value: "react", label: "React", category: "Công nghệ" },
  { value: "javascript", label: "JavaScript", category: "Công nghệ" },
  { value: "nodejs", label: "Node.js", category: "Công nghệ" },
  { value: "python", label: "Python", category: "Công nghệ" },
  { value: "tutorial", label: "Tutorial", category: "Giáo dục" },
  { value: "huong-dan", label: "Hướng dẫn", category: "Giáo dục" },
  { value: "giao-duc", label: "Giáo dục", category: "Giáo dục" },
  { value: "hoc-tap", label: "Học tập", category: "Giáo dục" },
  { value: "review", label: "Review", category: "Giải trí" },
  { value: "unboxing", label: "Unboxing", category: "Giải trí" },
  { value: "gaming", label: "Gaming", category: "Giải trí" },
  { value: "comedy", label: "Comedy", category: "Giải trí" },
  { value: "cooking", label: "Cooking", category: "Ẩm thực" },
  { value: "am-thuc", label: "Ẩm thực", category: "Ẩm thực" },
  { value: "mon-ngon", label: "Món ngon", category: "Ẩm thực" },
  { value: "cong-thuc", label: "Công thức", category: "Ẩm thực" },
  { value: "travel", label: "Travel", category: "Du lịch" },
  { value: "du-lich", label: "Du lịch", category: "Du lịch" },
  { value: "phuot", label: "Phượt", category: "Du lịch" },
  { value: "dia-diem", label: "Địa điểm", category: "Du lịch" },
  { value: "music", label: "Music", category: "Âm nhạc" },
  { value: "nhac", label: "Nhạc", category: "Âm nhạc" },
  { value: "cover", label: "Cover", category: "Âm nhạc" },
  { value: "karaoke", label: "Karaoke", category: "Âm nhạc" },
  { value: "tech", label: "Tech", category: "Công nghệ" },
  { value: "ai", label: "AI", category: "Công nghệ" },
  { value: "mobile", label: "Mobile", category: "Công nghệ" },
  { value: "web", label: "Web", category: "Công nghệ" },
  { value: "lifestyle", label: "Lifestyle", category: "Lối sống" },
  { value: "loi-song", label: "Lối sống", category: "Lối sống" },
  { value: "suc-khoe", label: "Sức khỏe", category: "Lối sống" },
  { value: "fitness", label: "Fitness", category: "Lối sống" },
  { value: "vlog", label: "Vlog", category: "Giải trí" },
  { value: "daily", label: "Daily", category: "Lối sống" },
  { value: "news", label: "News", category: "Tin tức" },
  { value: "tin-tuc", label: "Tin tức", category: "Tin tức" },
  { value: "sports", label: "Sports", category: "Thể thao" },
  { value: "the-thao", label: "Thể thao", category: "Thể thao" },
  { value: "fashion", label: "Fashion", category: "Thời trang" },
  { value: "thoi-trang", label: "Thời trang", category: "Thời trang" },
  { value: "beauty", label: "Beauty", category: "Làm đẹp" },
  { value: "lam-dep", label: "Làm đẹp", category: "Làm đẹp" },
  { value: "makeup", label: "Makeup", category: "Làm đẹp" },
  { value: "skincare", label: "Skincare", category: "Làm đẹp" },
]

const CATEGORIES = Array.from(new Set(AVAILABLE_KEYWORDS.map((k) => k.category)))

export function KeywordsInput({ keywords, onChange, maxKeywords = 10, error }: KeywordsInputProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const removeKeyword = (keywordToRemove: string) => {
    onChange(keywords.filter((keyword) => keyword !== keywordToRemove))
  }

  const toggleKeyword = (keywordValue: string) => {
    if (keywords.includes(keywordValue)) {
      removeKeyword(keywordValue)
    } else if (keywords.length < maxKeywords) {
      onChange([...keywords, keywordValue])
    }
  }

  const getKeywordLabel = (value: string) => {
    return AVAILABLE_KEYWORDS.find((k) => k.value === value)?.label || value
  }

  const filteredKeywords = AVAILABLE_KEYWORDS.filter(
    (keyword) =>
      keyword.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      keyword.category.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const groupedKeywords = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = filteredKeywords.filter((k) => k.category === category)
      return acc
    },
    {} as Record<string, typeof AVAILABLE_KEYWORDS>,
  )

  return (
    <div className="space-y-3">
      {/* Selected Keywords Display */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
          {keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="flex items-center gap-1 px-2 py-1">
              <Tag className="h-3 w-3" />
              {getKeywordLabel(keyword)}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeKeyword(keyword)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Keywords Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", error && "border-destructive")}
            disabled={keywords.length >= maxKeywords}
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {keywords.length === 0
                ? "Chọn keywords cho video..."
                : `Đã chọn ${keywords.length} keyword${keywords.length > 1 ? "s" : ""}`}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Tìm kiếm keywords..." value={searchValue} onValueChange={setSearchValue} />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>Không tìm thấy keyword nào.</CommandEmpty>

              {Object.entries(groupedKeywords).map(
                ([category, categoryKeywords]) =>
                  categoryKeywords.length > 0 && (
                    <CommandGroup key={category} heading={category}>
                      {categoryKeywords.map((keyword) => {
                        const isSelected = keywords.includes(keyword.value)
                        const isDisabled = !isSelected && keywords.length >= maxKeywords

                        return (
                          <CommandItem
                            key={keyword.value}
                            value={keyword.value}
                            onSelect={() => !isDisabled && toggleKeyword(keyword.value)}
                            className={cn(
                              "flex items-center space-x-2 cursor-pointer",
                              isDisabled && "opacity-50 cursor-not-allowed",
                            )}
                            disabled={isDisabled}
                          >
                            <Checkbox
                              checked={isSelected}
                              onChange={() => !isDisabled && toggleKeyword(keyword.value)}
                              disabled={isDisabled}
                            />
                            <div className="flex-1">
                              <span className="font-medium">{keyword.label}</span>
                            </div>
                            {isSelected && (
                              <Badge variant="secondary" className="text-xs">
                                Đã chọn
                              </Badge>
                            )}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  ),
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Quick Select Popular Keywords */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Keywords phổ biến:</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_KEYWORDS.slice(0, 8).map((keyword) => {
            const isSelected = keywords.includes(keyword.value)
            const isDisabled = !isSelected && keywords.length >= maxKeywords

            return (
              <Button
                key={keyword.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => !isDisabled && toggleKeyword(keyword.value)}
                disabled={isDisabled}
              >
                {isSelected && <X className="h-3 w-3 mr-1" />}
                {keyword.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Counter and Info */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Chọn keywords phù hợp để video được tìm thấy dễ dàng hơn</span>
        <span className={keywords.length >= maxKeywords ? "text-destructive" : ""}>
          {keywords.length}/{maxKeywords}
        </span>
      </div>
    </div>
  )
}
