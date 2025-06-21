import Image from "next/image"
import type { Layout } from "@/models/Layout"
import { cn } from "@/lib/utils"

interface LayoutRendererProps {
  layout: Layout
  className?: string
}

export function LayoutRenderer({ layout, className }: LayoutRendererProps) {
  if (!layout.active) return null

  const baseClasses = "w-full"
  const marginClasses = `mt-${layout.marginTop || 0} mb-${layout.marginBottom || 0}`

  const containerStyle = {
    marginTop: `${layout.marginTop || 0}rem`,
    marginBottom: `${layout.marginBottom || 0}rem`,
  }

  switch (layout.type) {
    case "text-image":
      return (
        <div className={cn(baseClasses, className)} style={containerStyle}>
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{layout.name}</h2>
              <div
                className="prose prose-slate prose-invert max-w-none text-slate-300"
                dangerouslySetInnerHTML={{ __html: layout.text }}
              />
            </div>
            {layout.image && (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src={layout.image || "/placeholder.svg"} alt={layout.name} fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      )

    case "large-image":
      return (
        <div className={cn(baseClasses, "text-center", className)} style={containerStyle}>
          <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">{layout.name}</h2>
            {layout.image && (
              <div className="relative aspect-[21/9] rounded-lg overflow-hidden">
                <Image src={layout.image || "/placeholder.svg"} alt={layout.name} fill className="object-cover" />
              </div>
            )}
            <div
              className="prose prose-slate prose-invert max-w-4xl mx-auto text-slate-300"
              dangerouslySetInnerHTML={{ __html: layout.text }}
            />
          </div>
        </div>
      )

    case "featured":
      return (
        <div className={cn(baseClasses, className)} style={containerStyle}>
          <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700 max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">{layout.name}</h2>
              <div
                className="prose prose-slate prose-invert max-w-3xl mx-auto text-slate-300"
                dangerouslySetInnerHTML={{ __html: layout.text }}
              />
              {layout.image && (
                <div className="relative aspect-video max-w-3xl mx-auto rounded-lg overflow-hidden">
                  <Image src={layout.image || "/placeholder.svg"} alt={layout.name} fill className="object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      )

    case "carousel":
      return (
        <div className={cn(baseClasses, "text-center", className)} style={containerStyle}>
          <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">{layout.name}</h2>
            {layout.image && (
              <div className="relative aspect-video max-w-5xl mx-auto rounded-lg overflow-hidden">
                <Image src={layout.image || "/placeholder.svg"} alt={layout.name} fill className="object-cover" />
              </div>
            )}
            <div
              className="prose prose-slate prose-invert max-w-none text-center text-slate-300"
              dangerouslySetInnerHTML={{ __html: layout.text }}
            />
          </div>
        </div>
      )

    default:
      return null
  }
}
