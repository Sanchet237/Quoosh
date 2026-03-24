"use client"

import { StatCard } from "@quoosh/web/components/admin/StatCard"
import { Activity, BarChart3, Monitor, Users } from "lucide-react"
import { useEffect, useState } from "react"

type OverviewData = {
  totalHosts: number
  totalQuizzes: number
  totalSessions: number
  activeSessions: number
  totalPlayers: number
  avgPlayersPerSession: string
  weeklyStats: { day: string; count: number }[]
  monthlyStats: { day: string; count: number }[]
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30_000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-amber-400" />
      </div>
    )
  }

  if (!data)
    return <p className="p-8 text-amber-400">Failed to load analytics.</p>

  const maxWeekly = Math.max(...data.weeklyStats.map((s) => s.count), 1)
  const maxMonthly = Math.max(...data.monthlyStats.map((s) => s.count), 1)

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-white italic">
          Platform Overview
        </h1>
        <p className="mt-1 text-sm text-amber-200/40">
          Live platform metrics and usage statistics
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <StatCard
          label="Total Hosts"
          value={data.totalHosts}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Total Quizzes"
          value={data.totalQuizzes}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          label="Total Sessions"
          value={data.totalSessions}
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          label="Active Sessions"
          value={data.activeSessions}
          sub="Currently running"
          icon={<Monitor className="h-5 w-5" />}
          accent="border-green-500/30"
        />
        <StatCard
          label="Total Players"
          value={data.totalPlayers}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Players / Session"
          value={data.avgPlayersPerSession}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Weekly */}
        <div className="rounded-2xl border border-[#f5a000]/20 bg-[#2a2500] p-6">
          <h2 className="mb-4 text-sm font-bold tracking-widest text-amber-200/60 uppercase">
            Sessions — Last 7 Days
          </h2>
          <div className="flex h-32 items-end gap-2">
            {data.weeklyStats.length === 0 && (
              <p className="self-center text-xs text-amber-200/30">
                No data yet
              </p>
            )}
            {data.weeklyStats.map((s) => (
              <div
                key={s.day}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t-md bg-amber-400 transition-all"
                  style={{
                    height: `${Math.round((s.count / maxWeekly) * 100)}%`,
                    minHeight: "4px",
                  }}
                />
                <span className="origin-left rotate-45 text-[9px] text-amber-200/40">
                  {new Date(s.day).toLocaleDateString(undefined, {
                    weekday: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly */}
        <div className="rounded-2xl border border-[#f5a000]/20 bg-[#2a2500] p-6">
          <h2 className="mb-4 text-sm font-bold tracking-widest text-amber-200/60 uppercase">
            Sessions — Last 30 Days
          </h2>
          <div className="flex h-32 items-end gap-1">
            {data.monthlyStats.length === 0 && (
              <p className="self-center text-xs text-amber-200/30">
                No data yet
              </p>
            )}
            {data.monthlyStats.map((s) => (
              <div
                key={s.day}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t-sm bg-amber-600"
                  style={{
                    height: `${Math.round((s.count / maxMonthly) * 100)}%`,
                    minHeight: "2px",
                  }}
                />
              </div>
            ))}
          </div>
          <p className="mt-1 text-right text-[10px] text-amber-200/30">
            30-day window
          </p>
        </div>
      </div>
    </div>
  )
}
