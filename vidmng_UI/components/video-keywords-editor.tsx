
"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Tag, Plus } from "lucide-react"

interface VideoKeywordsEditorProps {
  keywords: string[]
  onChange: (keywords: string[]) => void
  maxKeywords?: number
  placeholder?: string
}

export function VideoKeywordsEditor({
  keywords,
  onChange,
  maxKeywords = 10,
  placeholder = "Nhập keyword...",
}: VideoKeywordsEditorProps) {
  const [inputValue, setInputValue] = useState("")

  const addKeyword = () => {
    const trimmedValue = inputValue.trim().toLowerCase()
    if (trimmedValue && !keywords.includes(trimmedValue) && keywords.length < maxKeywords) {
      onChange([...keywords, trimmedValue])
      setInputValue("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    onChange(keywords.filter((keyword) => keyword !== keywordToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addKeyword()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="space-y-3">
      {/* Current Keywords */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
          {keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="flex items-center gap-1 px-2 py-1">
              <Tag className="h-3 w-3" />
              {keyword}
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

      {/* Add New Keyword */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={keywords.length >= maxKeywords}
          className="flex-1"
        />
        <Button
          onClick={addKeyword}
          disabled={
            !inputValue.trim() || keywords.includes(inputValue.trim().toLowerCase()) || keywords.length >= maxKeywords
          }
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Info */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {keywords.length === 0
            ? "Chưa có keyword nào"
            : `Đã thêm ${keywords.length} keyword${keywords.length > 1 ? "s" : ""}`}
        </span>
        <span className={keywords.length >= maxKeywords ? "text-destructive" : ""}>
          {keywords.length}/{maxKeywords}
        </span>
      </div>

      {/* Suggestions */}
      {keywords.length === 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Gợi ý keywords phổ biến:</p>
          <div className="flex flex-wrap gap-2">
            {["tutorial", "review", "hướng dẫn", "tips", "beginner", "advanced"].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="h-6 text-xs bg-transparent"
                onClick={() => {
                  if (!keywords.includes(suggestion) && keywords.length < maxKeywords) {
                    onChange([...keywords, suggestion])
                  }
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
