"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Tag as TagIcon, ChevronDown, Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { tagAPI, type Tag } from "@/lib/api"

interface KeywordsInputProps {
  keywords: string[]
  onChange: (keywords: string[]) => void
  maxKeywords?: number
  error?: string
}

export function KeywordsInput({ keywords, onChange, maxKeywords = 10, error }: KeywordsInputProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch tags from API
  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const tagsData = await tagAPI.getTags()
      setTags(tagsData.results || tagsData)
    } catch (err) {
      console.error('Lỗi khi tải tags:', err)
    } finally {
      setLoading(false)
    }
  }

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
    const tag = tags.find((t) => t.slug === value || t.name === value)
    return tag ? tag.name : value
  }

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchValue.toLowerCase()),
  )

  return (
    <div className="space-y-3">
      {/* Selected Keywords Display */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
          {keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="flex items-center gap-1 px-2 py-1">
              <TagIcon className="h-3 w-3" />
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
            disabled={keywords.length >= maxKeywords || loading}
          >
            <div className="flex items-center gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading
                ? "Đang tải tags..."
                : keywords.length === 0
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
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Đang tải tags...</span>
                </div>
              ) : filteredTags.length === 0 ? (
                <CommandEmpty>Không tìm thấy keyword nào.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredTags.map((tag) => {
                    const isSelected = keywords.includes(tag.slug)
                    const isDisabled = !isSelected && keywords.length >= maxKeywords

                    return (
                      <CommandItem
                        key={tag.id}
                        value={tag.slug}
                        onSelect={() => !isDisabled && toggleKeyword(tag.slug)}
                        className={cn(
                          "flex items-center space-x-2 cursor-pointer",
                          isDisabled && "opacity-50 cursor-not-allowed",
                        )}
                        disabled={isDisabled}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => !isDisabled && toggleKeyword(tag.slug)}
                          disabled={isDisabled}
                        />
                        <div className="flex-1">
                          <span className="font-medium">{tag.name}</span>
                          {tag.video_count > 0 && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({tag.video_count} video)
                            </span>
                          )}
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
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Quick Select Popular Keywords */}
      {!loading && tags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Tags phổ biến:</p>
          <div className="flex flex-wrap gap-2">
            {tags
              .sort((a, b) => b.video_count - a.video_count)
              .slice(0, 8)
              .map((tag) => {
                const isSelected = keywords.includes(tag.slug)
                const isDisabled = !isSelected && keywords.length >= maxKeywords

                return (
                  <Button
                    key={tag.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => !isDisabled && toggleKeyword(tag.slug)}
                    disabled={isDisabled}
                  >
                    {isSelected && <X className="h-3 w-3 mr-1" />}
                    {tag.name}
                  </Button>
                )
              })}
          </div>
        </div>
      )}

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
