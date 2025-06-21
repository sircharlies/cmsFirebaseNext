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
      const response = await fetch(`${baseUrl}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path,
          secret: process.env.REVALIDATE_SECRET,
        }),
      })

      if (response.ok) {
        console.log(`✅ Revalidated: ${path}`)
      } else {
        console.error(`❌ Failed to revalidate: ${path}`)
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
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: "/",
        }),
      })

      if (response.ok) {
        console.log("✅ Home page revalidated")
      }
    } catch (error) {
      console.error("Error revalidating home:", error)
    }
  }

  const revalidatePage = async (slug: string) => {
    try {
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: `/page/${slug}`,
        }),
      })

      if (response.ok) {
        console.log(`✅ Page /${slug} revalidated`)
      }
    } catch (error) {
      console.error(`Error revalidating page ${slug}:`, error)
    }
  }

  return { revalidateHome, revalidatePage }
}
