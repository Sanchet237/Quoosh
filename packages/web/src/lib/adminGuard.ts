import { auth } from "@quoosh/web/lib/auth"
import { NextResponse } from "next/server"

/** Returns the admin session or a 401/403 NextResponse. */
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      error: new NextResponse("Unauthorized", { status: 401 }),
      session: null,
    }
  }
  if ((session.user as any).role !== "ADMIN") {
    return {
      error: new NextResponse("Forbidden", { status: 403 }),
      session: null,
    }
  }
  return { error: null, session }
}

/** Returns the host session or a 401/403 NextResponse. */
export async function requireHost() {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      error: new NextResponse("Unauthorized", { status: 401 }),
      session: null,
    }
  }
  if ((session.user as any).role !== "HOST") {
    return {
      error: new NextResponse("Forbidden", { status: 403 }),
      session: null,
    }
  }
  return { error: null, session }
}
