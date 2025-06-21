"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePages } from "@/hooks/use-pages"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"
import { uploadPageImage } from "@/services/storage"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RichTextEditor } from "@/components/rich-text-editor"
import { SEOPreview } from "@/components/seo-preview"
import { generateSlug } from "@/lib/utils"

export default function NewPagePage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    featuredImage: "",
    active: false,
    accessible: true,
    isHome: false,
    showTitle: true,
    showDescription: true,
    order: 0,
  })
  const [loading, setLoading] = useState(false)

  const { createPage } = usePages()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createPage(formData)
      router.push("/dashboard/pages")
    } catch (error) {
      console.error("Failed to create page:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    const tempId = Date.now().toString()
    return await uploadPageImage(file, tempId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/pages">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Páginas
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Criar Nova Página</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Página</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Página</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digite o nome da página"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Digite a descrição da página com suporte a markdown..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Imagem Destacada</label>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                onUpload={handleImageUpload}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ordem</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                placeholder="Ordem da página (0 = primeira)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configurações de Visibilidade</h3>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <label className="text-sm font-medium">Página Ativa</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.accessible}
                    onCheckedChange={(checked) => setFormData({ ...formData, accessible: checked })}
                  />
                  <label className="text-sm font-medium">Publicamente Acessível</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isHome}
                    onCheckedChange={(checked) => setFormData({ ...formData, isHome: checked })}
                  />
                  <label className="text-sm font-medium">Definir como Página Inicial</label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configurações de Exibição</h3>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.showTitle}
                    onCheckedChange={(checked) => setFormData({ ...formData, showTitle: checked })}
                  />
                  <label className="text-sm font-medium">Mostrar Título da Página</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.showDescription}
                    onCheckedChange={(checked) => setFormData({ ...formData, showDescription: checked })}
                  />
                  <label className="text-sm font-medium">Mostrar Descrição da Página</label>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar Página"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/pages">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {formData.name && (
        <SEOPreview
          title={formData.name}
          description={formData.description}
          slug={generateSlug(formData.name)}
          featuredImage={formData.featuredImage}
        />
      )}
    </div>
  )
}
