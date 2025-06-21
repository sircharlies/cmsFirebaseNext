"use client"

import type React from "react"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { usePages } from "@/hooks/use-pages"
import { useLayouts } from "@/hooks/use-layouts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"
import { uploadPageImage, uploadLayoutImage } from "@/services/storage"
import { ArrowLeft, Plus, Edit, Trash2, GripVertical } from "lucide-react"
import Link from "next/link"
import type { Page, Layout } from "@/types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PageEditProps {
  params: { id: string }
}

export default function PageEditPage({ params }: PageEditProps) {
  const resolvedParams = use(params)
  const [page, setPage] = useState<Page | null>(null)
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingLayout, setEditingLayout] = useState<string | null>(null)
  const [newLayout, setNewLayout] = useState({
    name: "",
    type: "text-image" as Layout["type"],
    text: "",
    image: "",
    active: true,
    order: 0,
    marginTop: 2,
    marginBottom: 2,
  })

  const { updatePage } = usePages()
  const { layouts, createLayout, updateLayout, deleteLayout, reorderLayouts } = useLayouts(resolvedParams.id)
  const router = useRouter()

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const pageDoc = await getDoc(doc(db, "pages", resolvedParams.id))
        if (pageDoc.exists()) {
          const pageData = {
            id: pageDoc.id,
            ...pageDoc.data(),
            createdAt: pageDoc.data().createdAt?.toDate() || new Date(),
            updatedAt: pageDoc.data().updatedAt?.toDate() || new Date(),
          } as Page

          setPage(pageData)
          setFormData({
            name: pageData.name,
            description: pageData.description,
            featuredImage: pageData.featuredImage,
            active: pageData.active,
            accessible: pageData.accessible,
            isHome: pageData.isHome || false,
            showTitle: pageData.showTitle ?? true,
            showDescription: pageData.showDescription ?? true,
            order: pageData.order,
          })
        }
      } catch (error) {
        console.error("Failed to fetch page:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [resolvedParams.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updatePage(resolvedParams.id, formData)
      router.push("/dashboard/pages")
    } catch (error) {
      console.error("Failed to update page:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    return await uploadPageImage(file, resolvedParams.id)
  }

  const handleLayoutImageUpload = async (file: File, layoutId: string) => {
    return await uploadLayoutImage(file, resolvedParams.id, layoutId)
  }

  const handleCreateLayout = async () => {
    try {
      await createLayout({
        ...newLayout,
        order: layouts.length,
      })
      setNewLayout({
        name: "",
        type: "text-image",
        text: "",
        image: "",
        active: true,
        order: 0,
        marginTop: 2,
        marginBottom: 2,
      })
    } catch (error) {
      console.error("Failed to create layout:", error)
    }
  }

  const handleUpdateLayout = async (layoutId: string, data: Partial<Layout>) => {
    try {
      await updateLayout(layoutId, data)
      setEditingLayout(null)
    } catch (error) {
      console.error("Failed to update layout:", error)
    }
  }

  const handleDeleteLayout = async (layoutId: string) => {
    if (confirm("Tem certeza que deseja deletar este layout?")) {
      try {
        await deleteLayout(layoutId)
      } catch (error) {
        console.error("Failed to delete layout:", error)
      }
    }
  }

  const handleLayoutDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(layouts)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    await reorderLayouts(items)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Página não encontrada</h2>
        <Button asChild className="mt-4">
          <Link href="/dashboard/pages">Voltar para Páginas</Link>
        </Button>
      </div>
    )
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
        <h1 className="text-3xl font-bold">Editar Página: {page.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações da Página</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome da Página</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
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
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <label className="text-sm font-medium">Ativa</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.accessible}
                    onCheckedChange={(checked) => setFormData({ ...formData, accessible: checked })}
                  />
                  <label className="text-sm font-medium">Pública</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isHome}
                    onCheckedChange={(checked) => setFormData({ ...formData, isHome: checked })}
                  />
                  <label className="text-sm font-medium">Página Inicial</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.showTitle}
                    onCheckedChange={(checked) => setFormData({ ...formData, showTitle: checked })}
                  />
                  <label className="text-sm font-medium">Mostrar Título</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.showDescription}
                    onCheckedChange={(checked) => setFormData({ ...formData, showDescription: checked })}
                  />
                  <label className="text-sm font-medium">Mostrar Descrição</label>
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Add New Layout */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Layout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Layout</label>
              <Input
                value={newLayout.name}
                onChange={(e) => setNewLayout({ ...newLayout, name: e.target.value })}
                placeholder="Digite o nome do layout"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo do Layout</label>
              <Select
                value={newLayout.type}
                onValueChange={(value: Layout["type"]) => setNewLayout({ ...newLayout, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-image">Texto & Imagem</SelectItem>
                  <SelectItem value="large-image">Imagem Grande</SelectItem>
                  <SelectItem value="carousel">Carrossel</SelectItem>
                  <SelectItem value="featured">Destaque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Conteúdo de Texto</label>
              <Textarea
                value={newLayout.text}
                onChange={(e) => setNewLayout({ ...newLayout, text: e.target.value })}
                placeholder="Digite o conteúdo de texto"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Imagem</label>
              <ImageUpload
                value={newLayout.image}
                onChange={(url) => setNewLayout({ ...newLayout, image: url })}
                onUpload={(file) => handleLayoutImageUpload(file, "temp")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Margem Superior (rem)</label>
                <Input
                  type="number"
                  value={newLayout.marginTop}
                  onChange={(e) => setNewLayout({ ...newLayout, marginTop: Number(e.target.value) || 0 })}
                  min="0"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Margem Inferior (rem)</label>
                <Input
                  type="number"
                  value={newLayout.marginBottom}
                  onChange={(e) => setNewLayout({ ...newLayout, marginBottom: Number(e.target.value) || 0 })}
                  min="0"
                  step="0.5"
                />
              </div>
            </div>

            <Button onClick={handleCreateLayout} disabled={!newLayout.name}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Layout
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Layouts List */}
      <Card>
        <CardHeader>
          <CardTitle>Layouts da Página</CardTitle>
        </CardHeader>
        <CardContent>
          {layouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhum layout ainda. Adicione seu primeiro layout acima.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleLayoutDragEnd}>
              <Droppable droppableId="layouts">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {layouts.map((layout, index) => (
                      <Draggable key={layout.id} draggableId={layout.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border rounded-lg p-4 ${snapshot.isDragging ? "shadow-lg" : ""}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{layout.name}</h3>
                                  <p className="text-sm text-gray-600 capitalize">
                                    {layout.type.replace("-", " ")} • Margem: {layout.marginTop || 0}rem -{" "}
                                    {layout.marginBottom || 0}rem
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={layout.active}
                                  onCheckedChange={(checked) => handleUpdateLayout(layout.id, { active: checked })}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingLayout(editingLayout === layout.id ? null : layout.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteLayout(layout.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {editingLayout === layout.id && (
                              <div className="mt-4 pt-4 border-t space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Nome</label>
                                  <Input
                                    defaultValue={layout.name}
                                    onBlur={(e) => handleUpdateLayout(layout.id, { name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Conteúdo de Texto</label>
                                  <Textarea
                                    defaultValue={layout.text}
                                    onBlur={(e) => handleUpdateLayout(layout.id, { text: e.target.value })}
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Imagem</label>
                                  <ImageUpload
                                    value={layout.image}
                                    onChange={(url) => handleUpdateLayout(layout.id, { image: url })}
                                    onUpload={(file) => handleLayoutImageUpload(file, layout.id)}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Margem Superior (rem)</label>
                                    <Input
                                      type="number"
                                      defaultValue={layout.marginTop || 0}
                                      onBlur={(e) =>
                                        handleUpdateLayout(layout.id, { marginTop: Number(e.target.value) || 0 })
                                      }
                                      min="0"
                                      step="0.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Margem Inferior (rem)</label>
                                    <Input
                                      type="number"
                                      defaultValue={layout.marginBottom || 0}
                                      onBlur={(e) =>
                                        handleUpdateLayout(layout.id, { marginBottom: Number(e.target.value) || 0 })
                                      }
                                      min="0"
                                      step="0.5"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
