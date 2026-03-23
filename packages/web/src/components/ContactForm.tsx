"use client"

import { useState } from "react"

const BLUE = "#2563eb"

export default function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [type, setType] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!type) {
      setError("Please select a type")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to send message")
        return
      }

      setSuccess(true)
      setName("")
      setEmail("")
      setType("")
      setMessage("")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-lg border-2 border-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-900 transition-all duration-150 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-base font-black text-gray-800">Message sent!</p>
        <p className="text-sm text-gray-500">
          Thanks for reaching out. I'll get back to you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm font-bold text-blue-600 underline hover:text-blue-500"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-bold tracking-widest text-gray-500 uppercase">
          Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold tracking-widest text-gray-500 uppercase">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold tracking-widest text-gray-500 uppercase">
          Type
        </label>
        <select
          required
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>Select a type</option>
          <option>General Question</option>
          <option>Bug Report</option>
          <option>Feature Request</option>
          <option>Feedback</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold tracking-widest text-gray-500 uppercase">
          Message
        </label>
        <textarea
          rows={3}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your question, issue, or idea..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl px-4 py-2 text-sm font-bold text-white transition-all duration-150 hover:brightness-110 active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: `linear-gradient(135deg, ${BLUE}, #1d4ed8)`,
          boxShadow: loading
            ? "none"
            : "0 5px 0px #1e3a8a, 0 6px 16px rgba(37,99,235,0.35)",
        }}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}