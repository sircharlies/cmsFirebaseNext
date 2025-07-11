// Utilitário para revalidar páginas após mudanças no CMS
export async function revalidatePages(paths?: string[]) {
  if (typeof window !== "undefined") {
    // Não executar no cliente
    return
  }

  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const revalidatePaths = paths || ["/"]

    for (const path of revalidatePaths) {
      const body: any = { path }

      // Adicionar secret apenas se estiver configurado
      if (process.env.REVALIDATE_SECRET) {
        body.secret = process.env.REVALIDATE_SECRET
      }

      const response = await fetch(`${baseUrl}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        console.log(`✅ Revalidated: ${path}`)
      } else {
        const error = await response.text()
        console.error(`❌ Failed to revalidate ${path}:`, error)
      }
    }
  } catch (error) {
    console.error("Error revalidating pages:", error)
  }
}

// Hook para usar no dashboard quando houver mudanças
export function useRevalidate() {
  const revalidateHome = async () => {
    try {
      const body: any = { path: "/" }

      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Home page revalidated:", result.message)
        return true
      } else {
        const error = await response.text()
        console.error("❌ Failed to revalidate home:", error)
        return false
      }
    } catch (error) {
      console.error("Error revalidating home:", error)
      return false
    }
  }

  const revalidatePage = async (slug: string) => {
    try {
      const body: any = { path: `/page/${slug}` }

      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`✅ Page /${slug} revalidated:`, result.message)
        return true
      } else {
        const error = await response.text()
        console.error(`❌ Failed to revalidate page ${slug}:`, error)
        return false
      }
    } catch (error) {
      console.error(`Error revalidating page ${slug}:`, error)
      return false
    }
  }

  return { revalidateHome, revalidatePage }
}
