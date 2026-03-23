"use client"

import { Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Host = {
  id: string
  name: string
  email: string
  suspended: boolean
  createdAt: string
  _count: { quizzes: number; sessions: number }
}

export default function AdminHostsPage() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchHosts = async () => {
    setLoading(true)
    const params = new URLSearchParams({ search, page: String(page) })
    const res = await fetch(`/api/admin/hosts?${params}`)
    if (res.ok) {
      const data = await res.json()
      setHosts(data.hosts)
      setTotal(data.total)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchHosts()
  }, [search, page]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSuspend = async (id: string, suspended: boolean) => {
    await fetch(`/api/admin/hosts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspended: !suspended }),
    })
    fetchHosts()
  }

  const deleteHost = async (id: string, name: string) => {
    if (
      !confirm(
        `Permanently delete "${name}" and all their quizzes and sessions?`,
      )
    )
      return
    const res = await fetch(`/api/admin/hosts/${id}`, { method: "DELETE" })
    if (res.ok) fetchHosts()
  }

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-white italic">
          Host Management
        </h1>
        <p className="mt-1 text-sm text-amber-200/40">
          {total} registered host{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-amber-400/50" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full rounded-xl border border-[#f5a000]/20 bg-[#2a2500] py-2.5 pr-4 pl-9 text-sm text-white placeholder-amber-200/30 focus:border-amber-500/60 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#f5a000]/20">
        <div className="overflow-hidden rounded-2xl bg-[#2a2500]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f5a000]/20 text-xs text-amber-200/50">
                <th className="px-5 py-3 text-left font-bold tracking-wider uppercase">
                  Host
                </th>
                <th className="px-5 py-3 text-left font-bold tracking-wider uppercase">
                  Quizzes
                </th>
                <th className="px-5 py-3 text-left font-bold tracking-wider uppercase">
                  Sessions
                </th>
                <th className="px-5 py-3 text-left font-bold tracking-wider uppercase">
                  Status
                </th>
                <th className="px-5 py-3 text-left font-bold tracking-wider uppercase">
                  Joined
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-amber-200/30"
                  >
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && hosts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-amber-200/30"
                  >
                    No hosts found.
                  </td>
                </tr>
              )}
              {hosts.map((host) => (
                <tr
                  key={host.id}
                  className="border-b border-[#f5a000]/10 transition-colors hover:bg-amber-900/10"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/hosts/${host.id}`}
                      className="transition-colors hover:text-amber-400"
                    >
                      <p className="font-bold text-white">{host.name}</p>
                      <p className="text-xs text-amber-200/40">{host.email}</p>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-amber-200/70">
                    {host._count.quizzes}
                  </td>
                  <td className="px-5 py-3 text-amber-200/70">
                    {host._count.sessions}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                        host.suspended
                          ? "bg-red-900/40 text-red-400"
                          : "bg-green-900/30 text-green-400"
                      }`}
                    >
                      {host.suspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-amber-200/40">
                    {new Date(host.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/hosts/${host.id}`}
                        className="text-xs font-bold text-amber-400/70 transition-colors hover:text-white"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => toggleSuspend(host.id, host.suspended)}
                        className={`text-xs font-bold transition-colors ${
                          host.suspended
                            ? "text-green-400/70 hover:text-green-300"
                            : "text-yellow-400/70 hover:text-yellow-300"
                        }`}
                      >
                        {host.suspended ? "Restore" : "Suspend"}
                      </button>
                      <button
                        onClick={() => deleteHost(host.id, host.name)}
                        className="text-xs font-bold text-red-400/60 transition-colors hover:text-red-400"
                        title="Delete host"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center gap-3 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg bg-amber-900/30 px-4 py-1.5 text-amber-200 transition hover:bg-amber-900/50 disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-amber-200/40">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg bg-amber-900/30 px-4 py-1.5 text-amber-200 transition hover:bg-amber-900/50 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
