"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, LinkIcon, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onChange(imageUrl.trim())
      setImageUrl("")
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Aqui você pode implementar o upload para Firebase Storage
      // Por enquanto, vamos simular um erro para mostrar que não está funcionando
      throw new Error("Upload não configurado - use URL da imagem")
    } catch (error) {
      console.error("Erro no upload:", error)
      alert("Erro no upload. Por favor, use a opção de URL da imagem.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative">
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <Image src={value || "/placeholder.svg"} alt="Imagem selecionada" fill className="object-cover" />
          </div>
          <Button type="button" onClick={onRemove} variant="destructive" size="sm" className="absolute top-2 right-2">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL da Imagem</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">URL da Imagem</Label>
              <div className="flex space-x-2">
                <Input
                  id="image-url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button type="button" onClick={handleUrlSubmit} disabled={!imageUrl.trim()}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Cole o link de uma imagem hospedada online (ex: Unsplash, Imgur, etc.)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-file">Arquivo de Imagem</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Clique para selecionar ou arraste uma imagem</p>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => document.getElementById("image-file")?.click()}
                >
                  {isUploading ? "Enviando..." : "Selecionar Arquivo"}
                </Button>
              </div>
              <p className="text-sm text-orange-600">
                ⚠️ Upload temporariamente indisponível. Use a opção "URL da Imagem".
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
