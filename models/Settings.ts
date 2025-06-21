import { doc, getDoc, setDoc, serverTimestamp, type FieldValue } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Settings {
  id: string
  siteTitle: string
  siteDescription: string
  contactEmail: string
  autoGenerateMetaDescriptions: boolean
  includeSiteNameInTitles: boolean
  generateXmlSitemap: boolean
  createdAt: Date | FieldValue
  updatedAt: Date | FieldValue
}

export class SettingsModel {
  private static readonly SETTINGS_DOC_ID = "site-settings"

  static async get(): Promise<Settings | null> {
    try {
      const settingsDoc = await getDoc(doc(db, "settings", this.SETTINGS_DOC_ID))

      if (!settingsDoc.exists()) {
        // Criar configurações padrão se não existirem
        const defaultSettings: Omit<Settings, "id"> = {
          siteTitle: "Modern CMS",
          siteDescription: "Um sistema de gerenciamento de conteúdo moderno",
          contactEmail: "admin@example.com",
          autoGenerateMetaDescriptions: true,
          includeSiteNameInTitles: true,
          generateXmlSitemap: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }

        await this.update(defaultSettings)
        return {
          id: this.SETTINGS_DOC_ID,
          ...defaultSettings,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Settings
      }

      return {
        id: settingsDoc.id,
        ...settingsDoc.data(),
        createdAt: settingsDoc.data().createdAt?.toDate() || new Date(),
        updatedAt: settingsDoc.data().updatedAt?.toDate() || new Date(),
      } as Settings
    } catch (error) {
      console.error("Erro ao buscar configurações:", error)
      return null
    }
  }

  static async update(settingsData: Partial<Omit<Settings, "id">>): Promise<void> {
    try {
      await setDoc(
        doc(db, "settings", this.SETTINGS_DOC_ID),
        {
          ...settingsData,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error)
      throw error
    }
  }
}
