import { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: ReactNode
  accent?: string
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "border-[#f5a000]/20",
}: StatCardProps) {
  return (
    <div
      className={`border bg-[#2a2500] ${accent} flex flex-col gap-3 rounded-2xl p-5`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-amber-200/50 uppercase">
          {label}
        </span>
        <span className="text-amber-400 opacity-70">{icon}</span>
      </div>
      <p className="text-3xl font-black text-white italic">{value}</p>
      {sub && <p className="text-xs text-amber-200/40">{sub}</p>}
    </div>
  )
}
