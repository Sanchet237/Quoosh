"use client"

import { Search } from "lucide-react"
import { useEffect, useState } from "react"

type Player = {
  id: string
  nickname: string
  avatar: string | null
  score: number
  joinedAt: string
  session: { id: string; inviteCode: string; quiz: { title: string } }
  _count: { answers: number }
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchPlayers = () => {
    setLoading(true)
    const params = new URLSearchParams({ search, page: String(page) })
    fetch(`/api/admin/players?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setPlayers(d.players)
        setTotal(d.total)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchPlayers()
  }, [search, page]) // eslint-disable-line

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-white italic">
          Player Activity
        </h1>
        <p className="mt-1 text-sm text-amber-200/40">{total} player records</p>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-amber-400/50" />
        <input
          type="text"
          placeholder="Search by nickname…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full rounded-xl border border-[#f5a000]/20 bg-[#2a2500] py-2.5 pr-4 pl-9 text-sm text-white placeholder-amber-200/30 focus:border-amber-500/60 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#f5a000]/20">
        <div className="overflow-hidden rounded-2xl bg-[#2a2500]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f5a000]/20 text-xs text-amber-200/50">
                {[
                  "Nickname",
                  "Quiz",
                  "Session PIN",
                  "Score",
                  "Answers",
                  "Joined",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left font-bold tracking-wider uppercase"
                  >
                    {h}
                  </th>
                ))}
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
              {!loading && players.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-amber-200/30"
                  >
                    No players found.
                  </td>
                </tr>
              )}
              {players.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-[#f5a000]/10 transition-colors hover:bg-amber-900/10"
                >
                  <td className="px-5 py-3 font-bold text-white">
                    {p.nickname}
                  </td>
                  <td className="px-5 py-3 text-amber-200/60">
                    {p.session.quiz.title}
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-amber-300">
                    {p.session.inviteCode}
                  </td>
                  <td className="px-5 py-3 text-amber-200/60">{p.score}</td>
                  <td className="px-5 py-3 text-amber-200/60">
                    {p._count.answers}
                  </td>
                  <td className="px-5 py-3 text-xs text-amber-200/40">
                    {new Date(p.joinedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {total > 30 && (
        <div className="flex items-center gap-3 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg bg-amber-900/30 px-4 py-1.5 text-amber-200 transition hover:bg-amber-900/50 disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-amber-200/40">
            Page {page} of {Math.ceil(total / 30)}
          </span>
          <button
            disabled={page >= Math.ceil(total / 30)}
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
