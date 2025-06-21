import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected (dashboard routes)
  if (pathname.startsWith("/dashboard")) {
    // In a real app, you'd verify the JWT token here
    // For now, we'll rely on client-side auth checks
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
