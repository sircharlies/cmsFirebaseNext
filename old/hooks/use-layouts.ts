"use client"

import { useState, useEffect } from "react"
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  where,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Layout } from "@/types"

export function useLayouts(pageId: string) {
  const [layouts, setLayouts] = useState<Layout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pageId) return
     
    const q = query(collection(db, "pages", pageId, "layouts"), where("active", "==", true), orderBy("order", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const layoutsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        pageId,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Layout[]

      setLayouts(layoutsData)
      setLoading(false)
    })

    return unsubscribe
  }, [pageId])

  const createLayout = async (layoutData: Omit<Layout, "id" | "pageId" | "createdAt" | "updatedAt">) => {
    await addDoc(collection(db, "pages", pageId, "layouts"), {
      ...layoutData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  const updateLayout = async (layoutId: string, layoutData: Partial<Layout>) => {
    await updateDoc(doc(db, "pages", pageId, "layouts", layoutId), {
      ...layoutData,
      updatedAt: serverTimestamp(),
    })
  }

  const deleteLayout = async (layoutId: string) => {
    await deleteDoc(doc(db, "pages", pageId, "layouts", layoutId))
  }

  const reorderLayouts = async (reorderedLayouts: Layout[]) => {
    const batch = reorderedLayouts.map((layout, index) =>
      updateDoc(doc(db, "pages", pageId, "layouts", layout.id), { order: index }),
    )
    await Promise.all(batch)
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
