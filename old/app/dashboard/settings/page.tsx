"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Settings, Globe } from "lucide-react"
import { SettingsModel, type Settings as SettingsType } from "@/models/Settings"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settingsData = await SettingsModel.get()
      setSettings(settingsData)
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      await SettingsModel.update({
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        autoGenerateMetaDescriptions: settings.autoGenerateMetaDescriptions,
        includeSiteNameInTitles: settings.includeSiteNameInTitles,
        generateXmlSitemap: settings.generateXmlSitemap,
      })

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      })
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof SettingsType, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <div className="text-center py-8">
          <p>Carregando configurações...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <div className="text-center py-8">
          <p>Erro ao carregar configurações</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título do Site</label>
              <Input value={settings.siteTitle} onChange={(e) => updateSetting("siteTitle", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição do Site</label>
              <Input
                value={settings.siteDescription}
                onChange={(e) => updateSetting("siteDescription", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email de Contato</label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSetting("contactEmail", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de SEO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configurações de SEO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Gerar meta descrições automaticamente</label>
                <p className="text-xs text-gray-600">Criar meta descrições automaticamente do conteúdo da página</p>
              </div>
              <Switch
                checked={settings.autoGenerateMetaDescriptions}
                onCheckedChange={(checked) => updateSetting("autoGenerateMetaDescriptions", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Incluir nome do site nos títulos</label>
                <p className="text-xs text-gray-600">Adicionar nome do site aos títulos das páginas</p>
              </div>
              <Switch
                checked={settings.includeSiteNameInTitles}
                onCheckedChange={(checked) => updateSetting("includeSiteNameInTitles", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Gerar sitemap XML</label>
                <p className="text-xs text-gray-600">Gerar e atualizar sitemap automaticamente</p>
              </div>
              <Switch
                checked={settings.generateXmlSitemap}
                onCheckedChange={(checked) => updateSetting("generateXmlSitemap", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  )
}
