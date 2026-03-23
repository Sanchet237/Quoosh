"use client"

import { Bell, Send } from "lucide-react"
import { useEffect, useState } from "react"

type Announcement = {
  id: string
  title: string
  body: string
  createdAt: string
  admin: { name: string }
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const fetchAnnouncements = () => {
    fetch("/api/admin/announcements")
      .then((r) => r.json())
      .then((d) => {
        setAnnouncements(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.")
      return
    }
    setSending(true)
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    })
    setSending(false)
    if (res.ok) {
      setTitle("")
      setBody("")
      fetchAnnouncements()
    } else {
      setError("Failed to send announcement.")
    }
  }

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-white italic">
          Announcements
        </h1>
        <p className="mt-1 text-sm text-amber-200/40">
          Broadcast messages to all platform hosts
        </p>
      </div>

      {/* Compose */}
      <form
        onSubmit={send}
        className="space-y-4 rounded-2xl border border-[#f5a000]/20 bg-[#2a2500] p-6"
      >
        <h2 className="text-sm font-bold tracking-widest text-amber-200/60 uppercase">
          New Announcement
        </h2>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-wider text-amber-200/50 uppercase">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scheduled Maintenance on Friday"
            className="w-full rounded-xl border border-[#f5a000]/20 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-amber-200/20 focus:border-amber-500/60 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-wider text-amber-200/50 uppercase">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Write your announcement here…"
            className="w-full resize-none rounded-xl border border-[#f5a000]/20 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-amber-200/20 focus:border-amber-500/60 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="flex items-center gap-2 rounded-xl border-2 border-amber-600 bg-amber-400 px-5 py-2.5 text-sm font-black text-black italic [box-shadow:4px_4px_rgb(217_119_6)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:0px_0px_rgb(217_119_6)] disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {sending ? "Sending…" : "Send Announcement"}
        </button>
      </form>

      {/* History */}
      <div>
        <h2 className="mb-3 text-lg font-black text-white italic">History</h2>
        {loading && <p className="text-sm text-amber-200/30">Loading…</p>}
        {!loading && announcements.length === 0 && (
          <div className="rounded-2xl border border-[#f5a000]/20 bg-[#2a2500] p-10 text-center text-sm text-amber-200/30">
            No announcements sent yet.
          </div>
        )}
        <div className="space-y-3">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-[#f5a000]/20 bg-[#2a2500] p-5"
            >
              <div className="flex items-start gap-3">
                <Bell className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/60" />
                <div className="flex-1">
                  <p className="font-bold text-white">{a.title}</p>
                  <p className="mt-1 text-sm whitespace-pre-wrap text-amber-200/60">
                    {a.body}
                  </p>
                  <p className="mt-2 text-xs text-amber-200/30">
                    Sent by {a.admin.name} ·{" "}
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
