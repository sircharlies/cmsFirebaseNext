import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Page, Layout } from "@/types"
import { LayoutRenderer } from "@/components/layout-renderer"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

// Força a página a ser dinâmica e não usar cache
export const dynamic = "force-dynamic"
export const revalidate = 0

async function getHomePage(): Promise<{ page: Page; layouts: Layout[] } | null> {
  try {
    // Buscar página marcada como home
    const homeQuery = query(collection(db, "pages"), where("isHome", "==", true), where("active", "==", true))
    const homeSnapshot = await getDocs(homeQuery)

    if (!homeSnapshot.empty) {
      const pageDoc = homeSnapshot.docs[0]
      const page = {
        id: pageDoc.id,
        ...pageDoc.data(),
        createdAt: pageDoc.data().createdAt?.toDate() || new Date(),
        updatedAt: pageDoc.data().updatedAt?.toDate() || new Date(),
      } as Page

      // Buscar layouts da página home
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
    }

    return null
  } catch (error) {
    console.error("Error fetching home page:", error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await getHomePage()

  if (homeData) {
    const { page } = homeData
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

  return {
    title: "CMS Facul",
    description: "Um sistema de gerenciamento de conteúdo poderoso e escalável construído com Next.js e Firebase.",
  }
}

export default async function HomePage() {
  // Adiciona timestamp para evitar cache
  const timestamp = new Date().getTime()
  console.log(`[${timestamp}] Fetching home page data...`)

  const homeData = await getHomePage()

  if (!homeData) {
    console.log(`[${timestamp}] No home page found, showing default page`)
    // Página padrão quando não há home customizada
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <PublicHeader />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CMS Facul
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Um sistema de gerenciamento de conteúdo poderoso e escalável construído com Next.js e Firebase. Crie,
              gerencie e publique seu conteúdo com facilidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                <Link href="/dashboard">Ir para Dashboard</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Link href="/auth/login">Fazer Login</Link>
              </Button>
            </div>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Gerenciamento Fácil</h3>
              <p className="text-slate-300 leading-relaxed">
                Crie e gerencie páginas com layouts flexíveis. Arraste e solte para reordenar blocos de conteúdo.
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">SEO Otimizado</h3>
              <p className="text-slate-300 leading-relaxed">
                Recursos de SEO integrados com metadados dinâmicos, URLs limpos e suporte ao Open Graph.
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Seguro & Escalável</h3>
              <p className="text-slate-300 leading-relaxed">
                Autenticação Firebase e banco de dados Firestore garantem segurança e escalabilidade.
              </p>
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    )
  }

  const { page, layouts } = homeData
  console.log(`[${timestamp}] Home page found: ${page.name} with ${layouts.length} layouts`)

  return (
    <div className="min-h-screen bg-slate-900">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Debug info - remover em produção */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
            Debug: Page ID: {page.id} | Layouts: {layouts.length} | Updated: {page.updatedAt.toString()}
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
