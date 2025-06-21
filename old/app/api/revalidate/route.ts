import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const { path, secret } = await request.json()

    // Verificar se o secret está correto (opcional, para segurança)
    if (secret && secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
    }

    // Revalidar a path específica ou todas as páginas
    if (path) {
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    } else {
      // Revalidar páginas principais
      revalidatePath("/")
      revalidatePath("/page/[slug]", "page")
      console.log("Revalidated all main pages")
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path: path || "all pages",
    })
  } catch (err) {
    console.error("Error revalidating:", err)
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Revalidate API endpoint",
    usage: 'POST with { "path": "/", "secret": "your-secret" }',
  })
}
