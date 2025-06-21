import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const { path, secret } = await request.json()

    // Verificar secret apenas se estiver configurado
    const requiredSecret = process.env.REVALIDATE_SECRET
    if (requiredSecret && secret !== requiredSecret) {
      return NextResponse.json(
        {
          message: "Invalid or missing secret",
        },
        { status: 401 },
      )
    }

    // Revalidar a path específica ou todas as páginas
    if (path) {
      revalidatePath(path)
      console.log(`✅ Revalidated path: ${path}`)
    } else {
      // Revalidar páginas principais
      revalidatePath("/")
      revalidatePath("/page/[slug]", "page")
      console.log("✅ Revalidated all main pages")
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path: path || "all pages",
      message: "Cache cleared successfully",
    })
  } catch (err) {
    console.error("❌ Error revalidating:", err)
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Revalidate API endpoint",
    usage: {
      method: "POST",
      body: {
        path: "/ (optional - defaults to all pages)",
        secret: "required only if REVALIDATE_SECRET is set",
      },
    },
    example: {
      path: "/",
      secret: "your-secret-if-configured",
    },
  })
}
