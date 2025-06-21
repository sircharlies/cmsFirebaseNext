import { PageModel, type Page } from "@/models/Page"
import { LayoutModel } from "@/models/Layout"

export class PageController {
  static async getAllPages(): Promise<Page[]> {
    return await PageModel.getAll()
  }

  static async getPublicPages(): Promise<Page[]> {
    return await PageModel.getPublic()
  }

  static async getPageBySlug(slug: string): Promise<{ page: Page; layouts: any[] } | null> {
    const page = await PageModel.getBySlug(slug)
    if (!page) return null

    const layouts = await LayoutModel.getByPageId(page.id)
    return { page, layouts }
  }

  static async getPageById(id: string): Promise<Page | null> {
    return await PageModel.getById(id)
  }

  static async getHomePage(): Promise<{ page: Page; layouts: any[] } | null> {
    const page = await PageModel.getHomePage()
    if (!page) return null

    const layouts = await LayoutModel.getByPageId(page.id)
    return { page, layouts }
  }

  static async createPage(pageData: Omit<Page, "id" | "createdAt" | "updatedAt" | "slug">): Promise<void> {
    await PageModel.create(pageData)
  }

  static async updatePage(id: string, pageData: Partial<Page>): Promise<void> {
    await PageModel.update(id, pageData)
  }

  static async deletePage(id: string): Promise<void> {
    await PageModel.delete(id)
  }

  static async reorderPages(pages: Page[]): Promise<void> {
    await PageModel.reorder(pages)
  }

  static subscribeTo(callback: (pages: Page[]) => void): () => void {
    return PageModel.subscribe(callback)
  }
}
