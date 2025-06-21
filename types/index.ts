import { FieldValue } from "firebase/firestore"

export interface User {
  uid: string
  email: string
  displayName?: string
}

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
  createdAt: Date | FieldValue
  updatedAt: Date | FieldValue
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string) => Promise<void>
}
