"use client"

import { usePathname } from "next/navigation"
import { type FormEvent, useEffect, useRef, useState } from "react"

interface Message {
  role: "user" | "assistant"
  text: string
}

const ALLOWED_ROUTES = ["/", "/auth/login", "/auth/register"]
const ALLOWED_PREFIXES = ["/play", "/join"]

const SUGGESTIONS = [
  "How do I join a game?",
  "How do I create a quiz?",
  "Is Quoosh free?",
  "How does scoring work?",
]

const FAQ: { keywords: string[]; answer: string }[] = [
  // Greetings
  {
    keywords: ["hi", "hello", "hey", "hii", "helo", "howdy", "sup", "greetings", "good morning", "good evening"],
    answer: "Hey there! 👋 I'm the Quoosh Assistant. Ask me anything about joining games, creating quizzes, scoring, or how Quoosh works!",
  },
  // Thank you
  {
    keywords: ["thanks", "thank you", "thankyou", "thx", "ty", "great", "awesome", "perfect", "nice", "cool", "helpful"],
    answer: "You're welcome! 😊 Feel free to ask anything else. I'm always here to help!",
  },
  // Goodbye
  {
    keywords: ["bye", "goodbye", "see you", "cya", "later", "farewell", "good night"],
    answer: "Bye! 👋 Have fun with Quoosh! Come back anytime if you need help. 🎯",
  },
  // Join game
  {
    keywords: ["join", "game", "play", "pin", "code", "enter", "room"],
    answer: "To join a game 🎮 go to the Play page, enter the PIN code your host gives you, pick a username and avatar — you're in! No account needed.",
  },
  // Create quiz
  {
    keywords: ["create", "make", "build", "new", "quiz", "add"],
    answer: "To create a quiz ✏️ register for a free account, go to your Dashboard, and click Create Quiz. You can add questions manually, use the AI generator, or import a JSON file!",
  },
  // Host game
  {
    keywords: ["host", "start", "launch", "run", "begin"],
    answer: "To host a game 🎤 login to your dashboard, open a quiz, and click Host. Share the PIN with your players and start when everyone's ready!",
  },
  // Free / pricing
  {
    keywords: ["free", "cost", "price", "pay", "subscription", "money", "billing", "charge", "plan"],
    answer: "Yes, Quoosh is completely free! 🎉 No subscription, no hidden fees, no credit card needed. It's also open-source!",
  },
  // Scoring
  {
    keywords: ["score", "points", "scoring", "leaderboard", "rank", "ranking", "position", "standing"],
    answer: "Scoring works like this 🏆 you earn points for correct answers, and faster answers earn bonus points. A live leaderboard updates after every question!",
  },
  // Account / register
  {
    keywords: ["account", "register", "sign up", "signup", "registration"],
    answer: "Only quiz hosts need an account 👤 Players can join games without signing up. Register at /auth/register — it's free and takes 30 seconds!",
  },
  // AI quiz generator
  {
    keywords: ["ai", "generate", "automatic", "generator", "artificial"],
    answer: "Yes! Quoosh has an AI Quiz Builder 🧠 that generates complete quizzes from any topic in seconds. Just enter a topic and let AI do the work!",
  },
  // Import JSON
  {
    keywords: ["import", "json", "upload", "file", "bulk"],
    answer: "You can import quizzes from JSON files 📂 Just structure your questions in the correct format and upload directly from your dashboard!",
  },
  // Device / browser
  {
    keywords: ["device", "phone", "mobile", "tablet", "browser", "app", "download", "install", "android", "iphone", "ios"],
    answer: "Quoosh works on any device 📱💻 with a modern browser — phones, tablets, laptops. No app download or installation needed!",
  },
  // Open source / GitHub
  {
    keywords: ["open source", "opensource", "github", "code", "contribute", "repository", "repo"],
    answer: "Yes, Quoosh is fully open-source! 👨‍💻 Find the code on GitHub at github.com/Sanchet237/Quoosh. Contributions, stars, and feedback are always welcome!",
  },
  // Bug report
  {
    keywords: ["bug", "issue", "problem", "error", "broken", "report", "not working", "crash", "fail"],
    answer: "Sorry to hear that! 🙏 Please report bugs using the Contact form on this page, or open an issue on our GitHub at github.com/Sanchet237/Quoosh/issues. We'll fix it ASAP!",
  },
  // Feature request
  {
    keywords: ["feature", "suggest", "request", "idea", "wish", "improvement"],
    answer: "Love hearing ideas! 💡 Use the Contact form on this page or open a GitHub issue to suggest features. We read and consider everything!",
  },
  // Login
  {
    keywords: ["login", "signin", "sign in", "log in", "password", "forgot", "reset"],
    answer: "You can login at /auth/login with your email and password, or use Google Sign-in for instant access 🔐 Forgot your password? Use the reset option on the login page.",
  },
  // Max players
  {
    keywords: ["max", "maximum", "players", "how many", "limit", "capacity", "people", "participants"],
    answer: "Quoosh supports many players joining the same game at once 👥 The more the merrier! There's no strict player cap for live games.",
  },
  // Time limit
  {
    keywords: ["time", "timer", "limit", "duration", "seconds", "long", "question time"],
    answer: "Each question has a customizable timer ⏱️ You can set anywhere from 5 to 120 seconds per question when creating your quiz. Default is 20 seconds.",
  },
  // Languages
  {
    keywords: ["language", "languages", "english", "hindi", "translation", "multilingual", "localization"],
    answer: "Quoosh currently runs in English 🌍 but since it's open-source, you can contribute translations! Quiz content can be in any language you write it in.",
  },
  // Social media
  {
    keywords: ["twitter", "x", "instagram", "linkedin", "social", "follow", "contact"],
    answer: "You can find us on social media! 📱 Follow on X (Twitter): @Sanchet_237, Instagram: @sanchetkolekar, and LinkedIn: Sanchet Kolekar. Links are in the footer!",
  },
  // Who made this
  {
    keywords: ["who made", "who built", "creator", "developer", "author", "owner", "made by", "built by"],
    answer: "Quoosh was built by Sanchet Kolekar 👨‍💻 a passionate developer who wanted to make live quizzes fun, free, and accessible for everyone!",
  },
  // Self host
  {
    keywords: ["self host", "selfhost", "self-host", "own server", "my server", "deploy", "hosting"],
    answer: "Yes! Since Quoosh is open-source you can self-host it 🖥️ Clone the repo from GitHub, set up your environment variables, and deploy. Check the README for detailed instructions!",
  },
  // Quiz length
  {
    keywords: ["how many questions", "quiz length", "questions limit", "max questions", "number of questions"],
    answer: "You can add as many questions as you want to a quiz 📝 There's no hard limit! Though we recommend 10-20 questions for the best player experience.",
  },
  // Avatar
  {
    keywords: ["avatar", "profile picture", "icon", "image", "character"],
    answer: "Players can choose a fun avatar when joining a game 🎭 No account needed — just pick your favorite character and start playing!",
  },
  // Results
  {
    keywords: ["results", "winner", "podium", "end", "finish", "final", "outcome"],
    answer: "At the end of each game 🏅 a podium shows the top 3 players with their scores. All players can see their final ranking and points!",
  },
  // Reconnect
  {
    keywords: ["reconnect", "disconnect", "connection", "lost connection", "dropped"],
    answer: "If you get disconnected during a game 🔄 just refresh the page — Quoosh will try to reconnect you automatically to your active game!",
  },
  // Admin
  {
    keywords: ["admin", "administrator", "panel", "manage platform"],
    answer: "The admin panel is for platform administrators only 🔒 Admins can manage hosts, quizzes, and live sessions. Regular hosts use the Dashboard at /dashboard.",
  },
  // Contact / support
  {
    keywords: ["contact", "support", "help", "assist", "talk", "reach"],
    answer: "Need help? 💬 Use the Contact form in the Support section on this page, or open a GitHub issue. We typically respond within 24 hours!",
  },
  // What is Quoosh
  {
    keywords: ["what is", "what's", "about", "explain", "tell me", "describe", "quoosh"],
    answer: "Quoosh is a free real-time quiz platform 🎯 Hosts create quizzes and players join with a PIN. Questions appear live, players answer on their phones, and a leaderboard tracks scores instantly — no downloads needed!",
  },
  // How it works
  {
    keywords: ["how", "work", "does it", "how does"],
    answer: "Quoosh works in 3 simple steps 🚀 1️⃣ Host creates a quiz 2️⃣ Players join with a PIN 3️⃣ Everyone plays live with real-time scores. That's it!",
  },
]

function getAnswer(input: string): string {
  const lower = input.toLowerCase()
  for (const faq of FAQ) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return faq.answer
    }
  }
  return "Hmm, I'm not sure about that 🤔 Try the Contact form on this page or check our GitHub for more help!"
}

export default function QuooshChat() {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hey! 👋 I'm the Quoosh Assistant. Ask me anything about joining games, creating quizzes, or how Quoosh works!",
    },
  ])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Route guard: only show on allowed pages ──────────────────────────────
  const isAllowed =
    ALLOWED_ROUTES.includes(pathname) ||
    ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      inputRef.current?.focus()
    }
  }, [open, messages])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMessage: Message = { role: "user", text }
    const answer = getAnswer(text)
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", text: answer },
    ])
    setInput("")
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  if (!isAllowed) {
    return null
  }

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden rounded-2xl bg-white sm:right-6"
          style={{
            width: "min(360px, calc(100vw - 32px))",
            height: "min(520px, calc(100vh - 120px))",
            boxShadow: "0 24px 80px rgba(0,0,0,0.2), 0 8px 0px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-base">
                🎯
              </div>
              <div>
                <p className="text-sm font-black text-white">Quoosh Assistant</p>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-300" />
                  <p className="text-xs text-amber-100">Always online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs">
                    🎯
                  </div>
                )}
                <div
                  className="max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", borderBottomRightRadius: "4px" }
                      : { background: "#f3f4f6", color: "#111827", borderBottomLeftRadius: "4px" }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Suggestion chips */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border-2 border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 px-3 py-2">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-xl border-2 border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-amber-400 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
            <p className="mt-1 text-center text-xs text-gray-400">
              Quoosh FAQ Bot
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95 sm:right-6"
        style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          boxShadow: "0 8px 0px #92400e, 0 12px 32px rgba(245,158,11,0.4)",
        }}
        aria-label="Open chat"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!open && (
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
        )}
      </button>
    </>
  )
}