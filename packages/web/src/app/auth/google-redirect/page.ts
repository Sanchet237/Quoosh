import { auth } from "@quoosh/web/lib/auth"
import { redirect } from "next/navigation"

export default async function GoogleRedirectPage() {
  const session = await auth()
  if (!session) redirect("/auth/login")
  const role = (session.user as any)?.role
  redirect(role === "ADMIN" ? "/admin" : "/dashboard")
}