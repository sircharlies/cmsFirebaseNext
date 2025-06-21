"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Share } from "lucide-react"
import Image from "next/image"

interface SEOPreviewProps {
  title: string
  description: string
  slug: string
  featuredImage?: string
}

export function SEOPreview({ title, description, slug, featuredImage }: SEOPreviewProps) {
  const url = `${typeof window !== "undefined" ? window.location.origin : "https://yoursite.com"}/page/${slug}`

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          SEO Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Search Preview */}
        <div>
          <h4 className="text-sm font-medium mb-2">Google Search Result</h4>
          <div className="border rounded-lg p-4 bg-white">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer">{title || "Page Title"}</div>
            <div className="text-green-700 text-sm">{url}</div>
            <div className="text-gray-600 text-sm mt-1">{description || "Page description will appear here..."}</div>
          </div>
        </div>

        {/* Social Media Preview */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Share className="h-4 w-4" />
            Social Media Preview
          </h4>
          <div className="border rounded-lg overflow-hidden bg-white">
            {featuredImage && (
              <div className="relative aspect-[1.91/1] bg-gray-100">
                <Image src={featuredImage || "/placeholder.svg"} alt={title} fill className="object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="font-medium text-gray-900 mb-1">{title || "Page Title"}</div>
              <div className="text-gray-600 text-sm mb-2">{description || "Page description will appear here..."}</div>
              <div className="text-gray-500 text-xs">{url}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
