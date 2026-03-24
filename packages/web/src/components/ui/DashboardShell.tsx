"use client"

import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"

interface DashboardShellProps {
  sidebar: ReactNode
  children: ReactNode
  mobileBrandText?: string
}

export function DashboardShell({
  sidebar,
  children,
  mobileBrandText = "QuoOsh!",
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Auto-close sidebar on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="relative flex min-h-screen bg-[#1c1a00] text-white">
      {/* Decorative background shapes */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#3d2e00] opacity-80 mix-blend-screen" />
        <div className="absolute -top-20 -right-20 h-[300px] w-[300px] rotate-12 bg-[#3d2e00] opacity-80 mix-blend-screen" />
        <div className="absolute -right-20 -bottom-40 h-[350px] w-[350px] rotate-45 bg-[#3d2e00] opacity-80 mix-blend-screen" />
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-20 bg-black/60 transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-[#f5a000]/20 bg-[#2a2500] pt-6 pb-4 shadow-2xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:w-64 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <button
          className="absolute top-3 right-3 rounded-lg p-1.5 text-amber-400/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        {sidebar}
      </aside>

      {/* Main content */}
      <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-transparent text-white">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 flex shrink-0 items-center gap-3 border-b border-[#f5a000]/20 bg-[#2a2500]/95 px-4 py-3 shadow-lg backdrop-blur-sm lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-ml-1 rounded-lg p-2 text-amber-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-xl font-black text-amber-400 italic">
            {mobileBrandText}
          </span>
        </div>

        {children}
      </main>
    </div>
  )
}
