"use client"

import { useState, useEffect } from "react"
import { PageController } from "@/controllers/PageController"
import type { Page } from "@/models/Page"

export function usePages() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = PageController.subscribeTo((pagesData) => {
      setPages(pagesData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const createPage = async (pageData: Omit<Page, "id" | "createdAt" | "updatedAt" | "slug">) => {
    await PageController.createPage(pageData)
  }

  const updatePage = async (id: string, pageData: Partial<Page>) => {
    await PageController.updatePage(id, pageData)
  }

  const deletePage = async (id: string) => {
    await PageController.deletePage(id)
  }

  const reorderPages = async (reorderedPages: Page[]) => {
    await PageController.reorderPages(reorderedPages)
  }

  return {
    pages,
    loading,
    createPage,
    updatePage,
    deletePage,
    reorderPages,
  }
}

export function usePublicPages() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pagesData = await PageController.getPublicPages()
        setPages(pagesData)
      } catch (error) {
        console.error("Error fetching public pages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [])

  return { pages, loading }
}
