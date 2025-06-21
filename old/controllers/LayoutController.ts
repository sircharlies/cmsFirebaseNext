import { LayoutModel, type Layout } from "@/models/Layout"

export class LayoutController {
  static async getLayoutsByPageId(pageId: string): Promise<Layout[]> {
    return await LayoutModel.getByPageId(pageId)
  }

  static async getAllLayoutsByPageId(pageId: string): Promise<Layout[]> {
    return await LayoutModel.getAllByPageId(pageId)
  }

  static async createLayout(
    pageId: string,
    layoutData: Omit<Layout, "id" | "pageId" | "createdAt" | "updatedAt">,
  ): Promise<void> {
    await LayoutModel.create(pageId, layoutData)
  }

  static async updateLayout(pageId: string, id: string, layoutData: Partial<Layout>): Promise<void> {
    await LayoutModel.update(pageId, id, layoutData)
  }

  static async deleteLayout(pageId: string, id: string): Promise<void> {
    await LayoutModel.delete(pageId, id)
  }

  static async reorderLayouts(pageId: string, layouts: Layout[]): Promise<void> {
    await LayoutModel.reorder(pageId, layouts)
  }

  static subscribeTo(pageId: string, callback: (layouts: Layout[]) => void): () => void {
    return LayoutModel.subscribe(pageId, callback)
  }
}
