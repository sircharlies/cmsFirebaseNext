"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { usePages } from "@/hooks/use-pages"
import { FileText, Plus, Edit, Trash2, Eye, EyeOff, Search, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function PagesPage() {
  const { pages, loading, deletePage } = usePages()
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredPages = pages.filter(
    (page) =>
      page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string, name: string) => {
    try {
      await deletePage(id)
      toast({
        title: "Sucesso",
        description: `Página "${name}" foi excluída com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a página.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Páginas</h1>
        <div className="text-center py-8">
          <p>Carregando páginas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Páginas</h1>
        <Button asChild>
          <Link href="/dashboard/pages/new">
            <Plus className="h-4 w-4 mr-2" />
            Nova Página
          </Link>
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Pesquisar páginas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Páginas */}
      {filteredPages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Nenhuma página encontrada" : "Nenhuma página criada"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Tente ajustar os termos de pesquisa" : "Comece criando sua primeira página"}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/dashboard/pages/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Página
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {page.name}
                      {page.isHome && <Badge variant="secondary">Página Inicial</Badge>}
                      <Badge variant={page.active ? "default" : "secondary"}>
                        {page.active ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Ativa
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Inativa
                          </>
                        )}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{page.description}</p>
                    <p className="text-xs text-gray-500">Slug: /{page.slug}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/page/${page.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/pages/${page.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a página "{page.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(page.id, page.name)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
