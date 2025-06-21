import { notFound } from "next/navigation"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Page, Layout } from "@/types"
import { LayoutRenderer } from "@/components/layout-renderer"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import type { Metadata } from "next"
import Image from "next/image"
import { cookies } from "next/headers"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPageBySlug(slug: string, isUserLoggedIn: boolean): Promise<{ page: Page; layouts: Layout[] } | null> {
  try {
    // Get page by slug - se usuário não estiver logado, só busca páginas ativas
    const pagesQuery = isUserLoggedIn
      ? query(collection(db, "pages"), where("slug", "==", slug))
      : query(collection(db, "pages"), where("slug", "==", slug), where("active", "==", true))

    const pagesSnapshot = await getDocs(pagesQuery)

    if (pagesSnapshot.empty) {
      return null
    }

    const pageDoc = pagesSnapshot.docs[0]
    const page = {
      id: pageDoc.id,
      ...pageDoc.data(),
      createdAt: pageDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: pageDoc.data().updatedAt?.toDate() || new Date(),
    } as Page

    // Se a página não está ativa e o usuário não está logado, retorna null
    if (!page.active && !isUserLoggedIn) {
      return null
    }

    // Get layouts for the page - buscar todos os layouts ativos, sem filtro adicional
    const layoutsQuery = query(
      collection(db, "pages", page.id, "layouts"),
      where("active", "==", true),
      orderBy("order", "asc"),
    )
    const layoutsSnapshot = await getDocs(layoutsQuery)

    const layouts = layoutsSnapshot.docs.map((doc) => ({
      id: doc.id,
      pageId: page.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Layout[]

    return { page, layouts }
  } catch (error) {
    console.error("Erro ao buscar página:", error)
    return null
  }
}

async function checkUserAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    // Aqui você pode implementar uma lógica mais robusta para verificar se o usuário está logado
    // Por exemplo, verificar um token JWT ou session cookie
    // Por simplicidade, vamos assumir que existe um cookie de sessão
    const authCookie = cookieStore.get("firebase-auth-token")
    return !!authCookie
  } catch {
    return false
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const isUserLoggedIn = await checkUserAuth()
  const data = await getPageBySlug(resolvedParams.slug, isUserLoggedIn)

  if (!data) {
    return {
      title: "Página não encontrada!",
    }
  }

  const { page } = data

  return {
    title: page.name,
    description: page.description,
    openGraph: {
      title: page.name,
      description: page.description,
      images: page.featuredImage ? [page.featuredImage] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.name,
      description: page.description,
      images: page.featuredImage ? [page.featuredImage] : [],
    },
  }
}

export default async function PublicPage({ params }: PageProps) {
  const resolvedParams = await params
  const isUserLoggedIn = await checkUserAuth()
  const data = await getPageBySlug(resolvedParams.slug, isUserLoggedIn)

  if (!data) {
    notFound()
  }

  const { page, layouts } = data

  return (
    <div className="min-h-screen bg-slate-900">
      <PublicHeader />

      {/* Aviso para páginas inativas (só aparece para usuários logados) */}
      {!page.active && isUserLoggedIn && (
        <div className="bg-yellow-600 text-white px-4 py-2 text-center">
          <p className="text-sm">⚠️ Esta página está inativa e só é visível para administradores</p>
        </div>
      )}

      {/* Page Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        {(page.showTitle || page.showDescription) && (
          <div className="mb-12 text-center">
            {page.showTitle && (
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                {page.name}
              </h1>
            )}
            {page.showDescription && (
              <p className="text-xl text-slate-300 mb-6 max-w-3xl mx-auto leading-relaxed">{page.description}</p>
            )}

            {page.featuredImage && (
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-8 max-w-6xl mx-auto border border-slate-700/50">
                <Image
                  src={page.featuredImage || "/placeholder.svg"}
                  alt={page.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        )}

        {/* Page Layouts */}
        <div className="space-y-0">
          {layouts.map((layout) => (
            <LayoutRenderer key={layout.id} layout={layout} />
          ))}
        </div>

        {layouts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Esta página ainda não possui conteúdo.</p>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
