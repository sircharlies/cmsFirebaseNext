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
  getDocs,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Page } from "@/types"
import { generateSlug } from "@/lib/utils"

export function usePages() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, "pages"), 
      orderBy("order", "asc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Page[]

      setPages(pagesData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const createPage = async (pageData: Omit<Page, "id" | "createdAt" | "updatedAt" | "slug">) => {
    const slug = generateSlug(pageData.name)

    // Se esta página for marcada como home, remover a flag de outras páginas
    if (pageData.isHome) {
      await removeHomeFlag()
    }

    await addDoc(collection(db, "pages"), {
      ...pageData,
      slug,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  const updatePage = async (id: string, pageData: Partial<Page>) => {
    const updateData = { ...pageData }

    if (pageData.name) {
      updateData.slug = generateSlug(pageData.name)
    }

    // Se esta página for marcada como home, remover a flag de outras páginas
    if (pageData.isHome) {
      await removeHomeFlag()
    }

    updateData.updatedAt = serverTimestamp()
    await updateDoc(doc(db, "pages", id), updateData)
  }

  const deletePage = async (id: string) => {
    await deleteDoc(doc(db, "pages", id))
  }

  const reorderPages = async (reorderedPages: Page[]) => {
    const batch = reorderedPages.map((page, index) => updateDoc(doc(db, "pages", page.id), { order: index }))
    await Promise.all(batch)
  }

  const removeHomeFlag = async () => {
    const q = query(collection(db, "pages"), where("isHome", "==", true))
    const snapshot = await getDocs(q)

    const batch = snapshot.docs.map((doc) => updateDoc(doc.ref, { isHome: false }))
    await Promise.all(batch)
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
    const q = query(
      collection(db, "pages"),
      where("active", "==", true),
      where("accessible", "==", true),
      where("isHome", "==", false), 
      orderBy("order", "asc"),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Page[]

      setPages(pagesData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { pages, loading }
}
