"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, Link, ImageIcon } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [content, setContent] = useState(value)

  useEffect(() => {
    setContent(value)
  }, [value])

  const handleChange = (newValue: string) => {
    setContent(newValue)
    onChange(newValue)
  }

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.querySelector('textarea[data-rich-editor="true"]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

    handleChange(newText)

    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  return (
    <div className="border rounded-md">
      <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("**", "**")} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("*", "*")} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("- ")} title="List">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("[", "](url)")} title="Link">
          <Link className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("![alt](", ")")} title="Image">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        data-rich-editor="true"
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 resize-none focus-visible:ring-0"
        rows={8}
      />
    </div>
  )
}
