import Image from "next/image"
import type { Layout } from "@/types"
import { cn } from "@/lib/utils"

interface LayoutRendererProps {
  layout: Layout
  className?: string
}

export function LayoutRenderer({ layout, className }: LayoutRendererProps) {
  if (!layout.active) return null

  const marginStyles = {
    marginTop: `${layout.marginTop || 0}rem`,
    marginBottom: `${layout.marginBottom || 0}rem`,
  }

  const baseClasses = "w-full"

  switch (layout.type) {
    case "text-image":
      return (
        <div
          className={cn(baseClasses, "grid lg:grid-cols-2 gap-8 xl:gap-12 items-center", className)}
          style={marginStyles}
        >
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">{layout.name}</h2>
            <div
              className="prose prose-slate prose-invert max-w-none text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: layout.text }}
            />
          </div>
          {layout.image && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
              <Image
                src={layout.image || "/placeholder.svg"}
                alt={layout.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>
      )

    case "large-image":
      return (
        <div className={cn(baseClasses, "space-y-8", className)} style={marginStyles}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {layout.name}
          </h2>
          {layout.image && (
            <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
              <Image
                src={layout.image || "/placeholder.svg"}
                alt={layout.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div
            className="prose prose-slate prose-invert prose-lg max-w-none mx-auto text-center text-slate-300"
            dangerouslySetInnerHTML={{ __html: layout.text }}
          />
        </div>
      )

    case "featured":
      return (
        <div
          className={cn(
            baseClasses,
            "bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-slate-700/50",
            className,
          )}
          style={marginStyles}
        >
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {layout.name}
            </h2>
            <div
              className="prose prose-slate prose-invert prose-lg max-w-3xl mx-auto text-slate-300"
              dangerouslySetInnerHTML={{ __html: layout.text }}
            />
            {layout.image && (
              <div className="relative aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden border border-slate-600/50 shadow-2xl">
                <Image
                  src={layout.image || "/placeholder.svg"}
                  alt={layout.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
          </div>
        </div>
      )

    case "carousel":
      return (
        <div className={cn(baseClasses, "space-y-8", className)} style={marginStyles}>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white">{layout.name}</h2>
          {layout.image && (
            <div className="relative aspect-video max-w-5xl mx-auto rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
              <Image
                src={layout.image || "/placeholder.svg"}
                alt={layout.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div
            className="prose prose-slate prose-invert max-w-none text-center text-slate-300"
            dangerouslySetInnerHTML={{ __html: layout.text }}
          />
        </div>
      )

    default:
      return null
  }
}
