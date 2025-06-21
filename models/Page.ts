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
  FieldValue,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateSlug } from "@/lib/utils"

export interface Page {
  id: string
  name: string
  active: boolean
  accessible: boolean
  description: string
  featuredImage: string
  order: number
  slug: string
  isHome: boolean
  showTitle: boolean
  showDescription: boolean
  createdAt: Date | FieldValue
  updatedAt: Date | FieldValue
}

export class PageModel {
  static async getAll(): Promise<Page[]> {
    const q = query(
      collection(db, "pages"), 
      orderBy("order", "asc")
      )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Page[]
  }

  static async getPublic(): Promise<Page[]> {
    const q = query(
      collection(db, "pages"), 
      where("active", "==", true), 
      orderBy("order", "asc")
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Page[]
  }

  static async getBySlug(slug: string): Promise<Page | null> {
    const q = query(collection(db, "pages"), where("slug", "==", slug), where("active", "==", true))
    const snapshot = await getDocs(q)

    if (snapshot.empty) return null

    const pageDoc = snapshot.docs[0]
    return {
      id: pageDoc.id,
      ...pageDoc.data(),
      createdAt: pageDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: pageDoc.data().updatedAt?.toDate() || new Date(),
    } as Page
  }

  static async getById(id: string): Promise<Page | null> {
    const pageDoc = await getDoc(doc(db, "pages", id))
    if (!pageDoc.exists()) return null

    return {
      id: pageDoc.id,
      ...pageDoc.data(),
      createdAt: pageDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: pageDoc.data().updatedAt?.toDate() || new Date(),
    } as Page
  }

  static async getHomePage(): Promise<Page | null> {
    const q = query(collection(db, "pages"), where("isHome", "==", true), where("active", "==", true))
    const snapshot = await getDocs(q)

    if (snapshot.empty) return null

    const pageDoc = snapshot.docs[0]
    return {
      id: pageDoc.id,
      ...pageDoc.data(),
      createdAt: pageDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: pageDoc.data().updatedAt?.toDate() || new Date(),
    } as Page
  }

  static async create(pageData: Omit<Page, "id" | "createdAt" | "updatedAt" | "slug">): Promise<void> {
    const slug = generateSlug(pageData.name)

    // Se esta página for marcada como home, remover a flag de outras páginas
    if (pageData.isHome) {
      await this.removeHomeFlag()
    }

    await addDoc(collection(db, "pages"), {
      ...pageData,
      slug,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  static async update(id: string, pageData: Partial<Page>): Promise<void> {
    const updateData = { ...pageData }

    if (pageData.name) {
      updateData.slug = generateSlug(pageData.name)
    }

    // Se esta página for marcada como home, remover a flag de outras páginas
    if (pageData.isHome) {
      await this.removeHomeFlag()
    }

    updateData.updatedAt = serverTimestamp()
    await updateDoc(doc(db, "pages", id), updateData)
  }

  static async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "pages", id))
  }

  static async reorder(reorderedPages: Page[]): Promise<void> {
    const batch = reorderedPages.map((page, index) => updateDoc(doc(db, "pages", page.id), { order: index }))
    await Promise.all(batch)
  }

  private static async removeHomeFlag(): Promise<void> {
    const q = query(collection(db, "pages"), where("isHome", "==", true))
    const snapshot = await getDocs(q)

    const batch = snapshot.docs.map((doc) => updateDoc(doc.ref, { isHome: false }))
    await Promise.all(batch)
  }

  static subscribe(callback: (pages: Page[]) => void): () => void {
    const q = query(
      collection(db, "pages"), 
      orderBy("order", "asc")
    )

    return onSnapshot(q, (snapshot) => {
      const pages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Page[]

      callback(pages)
    })
  }
}
