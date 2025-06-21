"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePages } from "@/hooks/use-pages"
import { FileText, Eye, EyeOff, Plus, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { pages, loading } = usePages()

  const activePages = pages.filter((page) => page.active)
  const inactivePages = pages.filter((page) => !page.active)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao painel de controle do seu CMS</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Site
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/pages/new">
              <Plus className="h-4 w-4 mr-2" />
              Nova Página
            </Link>
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Páginas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : pages.length}</div>
            <p className="text-xs text-muted-foreground">Páginas criadas no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Páginas Ativas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{loading ? "..." : activePages.length}</div>
            <p className="text-xs text-muted-foreground">Visíveis no site público</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Páginas Inativas</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{loading ? "..." : inactivePages.length}</div>
            <p className="text-xs text-muted-foreground">Ocultas do público</p>
          </CardContent>
        </Card>
      </div>

      {/* Páginas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Páginas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando páginas...</p>
          ) : pages.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma página encontrada</h3>
              <p className="text-gray-600 mb-4">Comece criando sua primeira página</p>
              <Button asChild>
                <Link href="/dashboard/pages/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Página
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {pages.slice(0, 5).map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${page.active ? "bg-green-500" : "bg-orange-500"}`} />
                    <div>
                      <h4 className="font-medium">{page.name}</h4>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/page/${page.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/pages/${page.id}`}>Editar</Link>
                    </Button>
                  </div>
                </div>
              ))}
              {pages.length > 5 && (
                <div className="text-center pt-4">
                  <Button asChild variant="outline">
                    <Link href="/dashboard/pages">Ver Todas as Páginas</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
