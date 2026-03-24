"use client"

import {
  BarChart3,
  Bell,
  Flag,
  LayoutDashboard,
  Monitor,
  Settings,
  Shield,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { name: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { name: "Hosts", href: "/admin/hosts", icon: Users },
  { name: "Quizzes", href: "/admin/quizzes", icon: BarChart3 },
  { name: "Live Sessions", href: "/admin/sessions", icon: Monitor },
  { name: "Players", href: "/admin/players", icon: Shield },
  { name: "Moderation", href: "/admin/moderation", icon: Flag },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Announcements", href: "/admin/announcements", icon: Bell },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="mt-4 flex-1 space-y-2 px-4">
      {navLinks.map(({ name, href, icon: Icon }) => {
        const isActive = pathname?.startsWith(href)
        return (
          <Link
            key={name}
            href={href}
            className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-base font-black italic transition-colors ${
              isActive
                ? "bg-white text-black shadow-lg"
                : "text-amber-100 hover:bg-amber-900/30"
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${
                isActive ? "text-black" : "opacity-80"
              }`}
            />
            {name}
          </Link>
        )
      })}
    </nav>
  )
}
