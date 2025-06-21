"use client"

import Link from "next/link"
import { usePublicPages } from "@/hooks/use-pages"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function PublicHeader() {
  const { pages } = usePublicPages()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo com link para home */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-300"
          >
            Modern CMS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/page/${page.slug}`}
                className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {page.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-blue-400 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-slate-700/50 bg-slate-800/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-3">
              {pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/page/${page.slug}`}
                  className="text-slate-300 hover:text-white transition-colors duration-200 py-2 px-2 rounded-md hover:bg-slate-700/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
