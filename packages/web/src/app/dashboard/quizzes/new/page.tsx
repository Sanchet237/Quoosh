"use client"

import bgImage from "@quoosh/web/assets/background.webp"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CreateQuizPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subject }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed: ${errorText}`)
      }

      const newQuiz = await res.json()
      // Directly redirect to the quiz builder for the newly created quiz ID
      router.push(`/dashboard/quizzes/${newQuiz.id}/edit`)
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the quiz.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex flex-1 flex-col items-center justify-center p-8"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay specifically for the Create Quiz page (slightly lighter) */}
      <div className="absolute inset-0 z-0 bg-[#1a1800]/70" />

      {/* Content wrapper */}
      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="mb-8 w-full px-2 text-center sm:mb-10 sm:px-0">
          <h2 className="mb-2 text-3xl font-black tracking-tighter text-white italic drop-shadow-lg sm:text-4xl md:text-5xl">
            Create New Quiz
          </h2>
          <p className="text-base text-amber-200/80 italic drop-shadow-md sm:text-lg">
            Set the stage for your next masterpiece.
          </p>
        </div>

        <div className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:p-10">
          {error && (
            <div className="mb-6 rounded-xl border border-red-500 bg-red-500/10 p-4 text-sm text-red-500 italic">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div>
              <label className="mb-2 block text-base font-black text-black italic sm:mb-3 sm:text-lg">
                Quiz Title <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 80s Movie Masterclass"
                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base font-bold text-black italic placeholder-gray-400 transition-colors outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:px-6 sm:py-4 sm:text-lg"
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-black text-black italic sm:mb-3 sm:text-lg">
                Subject <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Cinema, History, Pop Culture"
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 pr-12 text-base font-bold text-black italic placeholder-gray-400 transition-colors outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:px-6 sm:py-4 sm:text-lg"
                />
                <div className="pointer-events-none absolute top-1/2 right-4 flex -translate-y-1/2 gap-[2px] font-black text-black opacity-30">
                  <span className="text-[10px]">▲</span>
                  <span className="text-[10px]">■</span>
                  <span className="text-[10px]">●</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-400 italic">
                Choose a subject to help others discover your quiz.
              </p>
            </div>

            <div className="flex w-full flex-col items-center gap-2 pt-6 sm:flex-row sm:gap-4 sm:pt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-transparent bg-red-500 px-4 py-3 text-base font-black text-white italic shadow-xl drop-shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-red-600 sm:flex-1 sm:px-8 sm:py-4 sm:text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim() || !subject.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-transparent bg-green-500 px-4 py-3 text-base font-black text-white italic shadow-xl drop-shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 sm:flex-1 sm:px-8 sm:py-4 sm:text-lg"
              >
                {loading ? "Creating..." : "Continue to Builder"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
