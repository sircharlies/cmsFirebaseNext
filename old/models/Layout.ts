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
  getDocs,
  where,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Layout {
  id: string
  pageId: string
  name: string
  active: boolean
  type: "text-image" | "large-image" | "carousel" | "featured"
  text: string
  image: string
  order: number
  marginTop: number
  marginBottom: number
  extras?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export class LayoutModel {
  static async getByPageId(pageId: string): Promise<Layout[]> {
    const q = query(collection(db, "pages", pageId, "layouts"), where("active", "==", true), orderBy("order", "asc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      pageId,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Layout[]
  }

  static async getAllByPageId(pageId: string): Promise<Layout[]> {
    const q = query(collection(db, "pages", pageId, "layouts"), orderBy("order", "asc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      pageId,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Layout[]
  }

  static async create(
    pageId: string,
    layoutData: Omit<Layout, "id" | "pageId" | "createdAt" | "updatedAt">,
  ): Promise<void> {
    await addDoc(collection(db, "pages", pageId, "layouts"), {
      ...layoutData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  static async update(pageId: string, id: string, layoutData: Partial<Layout>): Promise<void> {
    const updateData = { ...layoutData, updatedAt: serverTimestamp() }
    await updateDoc(doc(db, "pages", pageId, "layouts", id), updateData)
  }

  static async delete(pageId: string, id: string): Promise<void> {
    await deleteDoc(doc(db, "pages", pageId, "layouts", id))
  }

  static async reorder(pageId: string, reorderedLayouts: Layout[]): Promise<void> {
    const batch = reorderedLayouts.map((layout, index) =>
      updateDoc(doc(db, "pages", pageId, "layouts", layout.id), { order: index }),
    )
    await Promise.all(batch)
  }

  static subscribe(pageId: string, callback: (layouts: Layout[]) => void): () => void {
    const q = query(collection(db, "pages", pageId, "layouts"), orderBy("order", "asc"))

    return onSnapshot(q, (snapshot) => {
      const layouts = snapshot.docs.map((doc) => ({
        id: doc.id,
        pageId,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Layout[]

      callback(layouts)
    })
  }
}
