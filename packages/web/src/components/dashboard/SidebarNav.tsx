"use client"

import { LayoutGrid, PlusCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SidebarNav() {
  const pathname = usePathname()

  const navLinks = [
    {
      name: "My Quizzes",
      href: "/dashboard",
      icon: LayoutGrid,
    },
    {
      name: "Create New",
      href: "/dashboard/quizzes/new",
      icon: PlusCircle,
    },
  ]

  return (
    <nav className="flex-1 px-4 space-y-3 mt-4">
      {navLinks.map((link) => {
        // Simple exact match since dashboard routes don't nest deep under these exact paths usually,
        // or we could check if pathname starts with href (except for the root /dashboard)
        const isActive = 
          link.href === "/dashboard" 
            ? pathname === "/dashboard" 
            : pathname?.startsWith(link.href)
        
        const Icon = link.icon

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-4 px-5 py-3 rounded-2xl transition-colors font-black italic text-lg ${
              isActive
                ? "bg-white text-black shadow-lg"
                : "text-amber-100 hover:bg-amber-900/30"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                isActive ? "fill-black text-white" : "opacity-80"
              }`}
            />
            {link.name}
          </Link>
        )
      })}
    </nav>
  )
}
