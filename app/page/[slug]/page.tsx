import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Page, Layout } from "@/types"
import { LayoutRenderer } from "@/components/layout-renderer"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// Força a página a ser dinâmica
export const dynamic = "force-dynamic"
export const revalidate = 0

async function getPageBySlug(slug: string): Promise<{ page: Page; layouts: Layout[] } | null> {
  try {
    const pageQuery = query(
      collection(db, "pages"),
      where("slug", "==", slug),
      where("active", "==", true),
      where("accessible", "==", true),
    )
    const pageSnapshot = await getDocs(pageQuery)

    if (pageSnapshot.empty) return null

    const pageDoc = pageSnapshot.docs[0]
    const page = {
      id: pageDoc.id,
      ...pageDoc.data(),
      createdAt: pageDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: pageDoc.data().updatedAt?.toDate() || new Date(),
    } as Page

    // Buscar layouts da página
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
    console.error("Error fetching page:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const pageData = await getPageBySlug(params.slug)

  if (!pageData) {
    return {
      title: "Página não encontrada",
      description: "A página solicitada não foi encontrada.",
    }
  }

  const { page } = pageData
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

export default async function PageBySlug({ params }: { params: { slug: string } }) {
  const timestamp = new Date().getTime()
  console.log(`[${timestamp}] Fetching page by slug: ${params.slug}`)

  const pageData = await getPageBySlug(params.slug)

  if (!pageData) {
    console.log(`[${timestamp}] Page not found: ${params.slug}`)
    notFound()
  }

  const { page, layouts } = pageData
  console.log(`[${timestamp}] Page found: ${page.name} with ${layouts.length} layouts`)

  return (
    <div className="min-h-screen bg-slate-900">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Debug info - remover em produção */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
            Debug: Page ID: {page.id} | Slug: {page.slug} | Layouts: {layouts.length} | Updated:{" "}
            {page.updatedAt.toString()}
          </div>
        )}

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
