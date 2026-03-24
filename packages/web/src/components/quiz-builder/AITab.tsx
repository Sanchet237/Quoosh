"use client"

import { useEffect, useRef, useState } from "react"
import botImg from "../../assets/chatbot.jpg"
import { QuestionFormValues } from "./ManualTab"

type AITabProps = {
  onAdd: (questions: QuestionFormValues[]) => void
}

// Detect if user input looks like an actual quiz request
const isQuizRequest = (text: string): boolean => {
  const cleaned = text.toLowerCase().trim()

  // Too short to be a real request
  if (cleaned.length < 4) return false

  // Common quiz-request keywords
  const quizKeywords = [
    "question", "questions", "quiz", "topic", "about", "on ",
    "generate", "make", "create", "give", "easy", "medium", "hard",
    "difficulty", "history", "science", "math", "geography", "sport",
    "football", "cricket", "programming", "javascript", "python",
    "biology", "chemistry", "physics", "english", "hindi", "general",
    "knowledge", "gk", "current", "affairs",
  ]

  return quizKeywords.some((kw) => cleaned.includes(kw))
}

const FALLBACK_MESSAGE = `Hmm, I didn't quite get that. 🤔

You can ask me to create a quiz like:

• "10 questions on Geography"
• "5 questions on JavaScript (easy)"
• "15 questions on Football"

What topic should we quiz on?`

export default function AITab({ onAdd }: AITabProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{id: string, role: string, content: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [parsedQuestions, setParsedQuestions] = useState<QuestionFormValues[]>([])
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { id: Date.now().toString(), role: "user", content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)
    setParsedQuestions([])

    // --- Fallback for random/unclear inputs ---
    if (!isQuizRequest(input)) {
      setTimeout(() => {
        setIsLoading(false)
        setMessages([
          ...newMessages,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: FALLBACK_MESSAGE,
          },
        ])
      }, 600)
      return
    }

    // --- Real API call ---
    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))

      const res = await fetch("/api/quizzes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      const parsed: { questions: any[] } = await res.json()

      if (!parsed?.questions?.length) {
        throw new Error("No questions in response")
      }

      const questions: QuestionFormValues[] = parsed.questions.map((q: any) => ({
        text: q.question ?? q.text ?? "",
        answers: q.answers ?? [],
        solution: typeof q.solution === "number" ? q.solution : 0,
        time: q.time ?? 20,
        cooldown: q.cooldown ?? 5,
      }))

      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `__QUESTIONS__:${JSON.stringify(questions)}`,
        },
      ])
      setParsedQuestions(questions)
      setSelectedIndices(new Set(questions.map((_, i) => i)))
    } catch (err) {
      console.error("[AITab] Error:", err)
      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, something went wrong generating questions. Please try again! 😅",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([])
    setParsedQuestions([])
    setSelectedIndices(new Set())
  }

  const toggleSelection = (idx: number) => {
    const next = new Set(selectedIndices)
    if (next.has(idx)) {
      next.delete(idx)
    } else {
      next.add(idx)
    }
    setSelectedIndices(next)
  }

  const handleAddSelected = () => {
    const toAdd = parsedQuestions.filter((_, i) => selectedIndices.has(i))
    if (toAdd.length > 0) {
      onAdd(toAdd)
      setParsedQuestions([])
      setSelectedIndices(new Set())
    }
  }

  const renderMessageContent = (m: { id: string; role: string; content: string }, isLast: boolean) => {
    // Render questions card for last assistant message
    if (
      m.role === "assistant" &&
      isLast &&
      parsedQuestions.length > 0 &&
      m.content.startsWith("__QUESTIONS__:")
    ) {
      return (
        <div>
          <p className="mb-3 text-emerald-600 font-bold">
            Done! I generated {parsedQuestions.length} question{parsedQuestions.length !== 1 ? "s" : ""}:
          </p>
          <div className="space-y-2">
            {parsedQuestions.map((q, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedIndices.has(idx)
                    ? "bg-emerald-50 border-emerald-500"
                    : "bg-white border-gray-200 opacity-60 hover:opacity-100"
                }`}
                onClick={() => toggleSelection(idx)}
              >
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer bg-white"
                  checked={selectedIndices.has(idx)}
                  readOnly
                />
                <div>
                  <p className="font-bold text-black text-xs">{q.text}</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">
                    Answers: {q.answers.join(", ")} | Solution: Option {q.solution + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              onClick={handleAddSelected}
              disabled={selectedIndices.size === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black py-2.5 px-4 rounded-lg transition-colors"
            >
              Add {selectedIndices.size} selected to Quiz ✓
            </button>
          </div>
        </div>
      )
    }

    // Plain text / fallback message — preserve newlines
    return (
      <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
        {m.content.startsWith("__QUESTIONS__:") ? "✅ Questions generated above." : m.content}
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mx-2 my-2 sm:m-6 sm:mt-0">

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">

        {/* Welcome message */}
        <div className="flex gap-3 text-gray-800 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mr-12 text-sm">
          <img src={botImg.src} alt="AI Bot" className="w-7 h-7 rounded-full object-cover shadow-sm shrink-0" />
          <div>
            <p className="font-bold text-black mb-1">Quoosh AI</p>
            <p className="font-semibold text-gray-800 mb-1">Welcome to Quoosh AI Quiz Generator! 🎯</p>
            <p className="text-gray-600">Just tell me the topic, number of questions, and difficulty level to get started.</p>
          </div>
        </div>

        {messages.map((m, idx) => (
          <div
            key={m.id}
            className={`flex gap-3 text-sm p-4 rounded-xl border shadow-sm transition-all ${
              m.role === "user"
                ? "bg-gray-50 border-gray-200 ml-12 text-gray-800"
                : "bg-white border-gray-100 text-gray-800 mr-12"
            }`}
          >
            {m.role === "user"
              ? <span className="text-xl shrink-0">👤</span>
              : <img src={botImg.src} alt="AI Bot" className="w-7 h-7 rounded-full object-cover shadow-sm shrink-0" />
            }
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold mb-1 opacity-70">
                {m.role === "user" ? "You" : "Quoosh AI"}
              </p>
              {renderMessageContent(m, idx === messages.length - 1 && !isLoading)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 text-gray-800 bg-white p-4 rounded-xl border border-gray-100 shadow-sm border-dashed animate-pulse mr-12 text-sm">
            <img src={botImg.src} alt="AI Bot" className="w-7 h-7 rounded-full object-cover shadow-sm shrink-0" />
            <div>
              <p className="font-bold text-black mb-1">Quoosh AI</p>
              <p>Generating questions... ████████░░░</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-200 shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="min-w-0 flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-black placeholder-gray-400 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
            value={input}
            placeholder='Ask me to make a quiz...'
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 sm:px-5 font-bold rounded-lg transition-colors text-sm"
          >
            <span className="hidden sm:inline">Send ↵</span>
            <span className="sm:hidden">↵</span>
          </button>
        </form>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-gray-500 font-bold hover:text-red-500 mt-3 transition-colors text-center w-full"
          >
            Clear chat history
          </button>
        )}
      </div>
    </div>
  )
}
