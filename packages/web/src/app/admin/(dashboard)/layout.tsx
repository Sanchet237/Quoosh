import logo from "@quoosh/web/assets/logo.svg"
import { AdminSidebar } from "@quoosh/web/components/admin/AdminSidebar"
import { DashboardShell } from "@quoosh/web/components/ui/DashboardShell"
import { auth, signOut } from "@quoosh/web/lib/auth"
import { LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  const sidebar = (
    <>
      <div className="mb-6 px-6 pr-10 lg:pr-6">
        <Link href="/admin/overview">
          <Image src={logo} alt="Quoosh" className="h-10 w-auto" />
        </Link>
        <p className="mt-2 text-xs font-semibold tracking-wider text-amber-200/40 uppercase">
          Admin Panel
        </p>
      </div>

      <AdminSidebar />

      <div className="mt-auto px-6">
        <div className="flex items-center gap-3 border-t border-amber-900/50 pt-6 pb-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-lg font-black text-black shadow-inner">
            {session?.user?.name?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-black text-white italic">
              {session?.user?.name}
            </p>
            <p className="truncate text-xs text-amber-200/50">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/auth/login" })
          }}
        >
          <button
            type="submit"
            className="mt-4 flex w-full items-center gap-2 px-2 py-2 text-sm font-bold text-amber-400/80 italic transition-colors hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </>
  )

  return (
    <DashboardShell sidebar={sidebar} mobileBrandText="Admin Panel">
      {children}
    </DashboardShell>
  )
}
