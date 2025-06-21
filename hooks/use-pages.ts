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
  getDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Page } from "@/types"
import { generateSlug } from "@/lib/utils"
import { useRevalidate } from "@/lib/revalidate"

export function usePages() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const { revalidateHome, revalidatePage } = useRevalidate()

  useEffect(() => {
    const q = query(collection(db, "pages"), orderBy("order", "asc"))

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

    // Revalidar páginas após criação
    if (pageData.isHome) {
      await revalidateHome()
    } else {
      await revalidatePage(slug)
    }
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

    // Revalidar páginas após atualização
    if (pageData.isHome || updateData.slug) {
      await revalidateHome()
      if (updateData.slug) {
        await revalidatePage(updateData.slug as string)
      }
    }
  }

  const deletePage = async (id: string) => {
    // Buscar a página antes de deletar para saber se era home
    const pageDoc = await getDoc(doc(db, "pages", id))
    const pageData = pageDoc.data()

    await deleteDoc(doc(db, "pages", id))

    // Revalidar se era página home
    if (pageData?.isHome) {
      await revalidateHome()
    }
    if (pageData?.slug) {
      await revalidatePage(pageData.slug)
    }
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
