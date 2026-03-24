import { auth } from "@quoosh/web/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  const isDashboard = pathname.startsWith("/dashboard")
  const isAdmin = pathname.startsWith("/admin")

  // Protect dashboard — redirect to login if not authenticated
  if (isDashboard && !req.auth) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin))
  }

  // Admin pages — return real 404 to everyone who is not a logged-in ADMIN
  if (isAdmin) {
    if (!req.auth) {
      return NextResponse.rewrite(new URL("/not-found", req.nextUrl.origin), { status: 404 })
    }
    const role = (req.auth.user as any)?.role
    if (role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/not-found", req.nextUrl.origin), { status: 404 })
    }
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}