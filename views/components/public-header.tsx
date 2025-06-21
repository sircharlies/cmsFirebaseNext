"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePublicPages } from "@/views/hooks/usePages"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function PublicHeader() {
  const { pages } = usePublicPages()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            Modern CMS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/page/${page.slug}`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {page.name}
              </Link>
            ))}
            <Button asChild variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-slate-700">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-slate-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/page/${page.slug}`}
                  className="text-slate-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {page.name}
                </Link>
              ))}
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
