import { ReactNode } from "react"

// Minimal root admin layout -- login lives here (no sidebar)
// Dashboard pages live in admin/(dashboard)/layout.tsx which adds the sidebar
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
