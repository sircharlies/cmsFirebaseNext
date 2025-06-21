"use client"

import { useState, useEffect } from "react"
import { LayoutController } from "@/controllers/LayoutController"
import type { Layout } from "@/models/Layout"

export function useLayouts(pageId: string) {
  const [layouts, setLayouts] = useState<Layout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pageId) return

    const unsubscribe = LayoutController.subscribeTo(pageId, (layoutsData) => {
      setLayouts(layoutsData)
      setLoading(false)
    })

    return unsubscribe
  }, [pageId])

  const createLayout = async (layoutData: Omit<Layout, "id" | "pageId" | "createdAt" | "updatedAt">) => {
    await LayoutController.createLayout(pageId, layoutData)
  }

  const updateLayout = async (id: string, layoutData: Partial<Layout>) => {
    await LayoutController.updateLayout(pageId, id, layoutData)
  }

  const deleteLayout = async (id: string) => {
    await LayoutController.deleteLayout(pageId, id)
  }

  const reorderLayouts = async (reorderedLayouts: Layout[]) => {
    await LayoutController.reorderLayouts(pageId, reorderedLayouts)
  }

  return {
    layouts,
    loading,
    createLayout,
    updateLayout,
    deleteLayout,
    reorderLayouts,
  }
}
