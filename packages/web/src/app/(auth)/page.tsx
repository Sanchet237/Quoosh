"use client"

import background from "@quoosh/web/assets/background.webp"
import leader from "@quoosh/web/assets/Leader.png"
import logo from "@quoosh/web/assets/logo.svg"
import mockup from "@quoosh/web/assets/Mockup.svg"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

/* ────────────────────────────────────────────────
   Brand palette
──────────────────────────────────────────────── */
const RED = "#dc2626"
const BLUE = "#2563eb"
const GREEN = "#16a34a"

/* ────────────────────────────────────────────────
   Data
──────────────────────────────────────────────── */
const actionCards = [
  {
    icon: "🎤",
    title: "Host Unforgettable Events",
    description:
      "Bring people together with live quizzes that energize classrooms, workshops, and team events.",
    cta: "Start Hosting",
    href: "/auth/register",
    accent: RED,
  },
  {
    icon: "📚",
    title: "Power Up Your Sessions",
    description:
      "Create interactive review games, training challenges, or study competitions in minutes.",
    cta: "Create a Quiz",
    href: "/auth/register",
    accent: BLUE,
  },
  {
    icon: "👥",
    title: "Engage Every Audience",
    description:
      "From classrooms to corporate teams, make learning interactive and exciting for everyone.",
    cta: "Explore Features",
    href: "#features",
    accent: GREEN,
  },
  {
    icon: "🌍",
    title: "Connect and Compete",
    description:
      "Join from anywhere, compete in real time, and climb the leaderboard together.",
    cta: "Join a Game",
    href: "/play",
    accent: RED,
  },
]

const features = [
  {
    icon: "⚡",
    title: "Join Instantly",
    description:
      "Players enter a simple PIN and start playing. No accounts, no downloads — works on any device, any browser.",
    delay: "0ms",
    accent: RED,
  },
  {
    icon: "🧠",
    title: "AI Quiz Builder",
    description:
      "Generate complete quizzes from any topic in seconds. Edit, refine, and launch directly from your dashboard.",
    delay: "100ms",
    accent: BLUE,
  },
  {
    icon: "📂",
    title: "Import from JSON",
    description:
      "Upload structured quiz files and launch instantly. Perfect for developers, bulk uploads, and integrations.",
    delay: "200ms",
    accent: GREEN,
  },
  {
    icon: "☁️",
    title: "Fully Hosted & Free to Use",
    description:
      "No servers to manage. No setup required. Just create, host, and play.",
    delay: "300ms",
    accent: BLUE,
  },
]

const steps = [
  {
    num: "01",
    icon: "✏️",
    title: "Create a Quiz",
    description:
      "Build your quiz manually, import a JSON file, or let AI generate one for you in seconds.",
    accent: RED,
  },
  {
    num: "02",
    icon: "📢",
    title: "Share the PIN",
    description:
      "Start a game and share the room PIN with your audience. No sign-up required for players.",
    accent: BLUE,
  },
  {
    num: "03",
    icon: "🏆",
    title: "Play & Win",
    description:
      "Players answer on their phones. A live leaderboard tracks scores in real time.",
    accent: GREEN,
  },
]

const mockAnswers = [
  { label: "Vikram Sarabhai", color: "bg-red-600", correct: false },
  { label: "Homi Bhabha", color: "bg-blue-600", correct: false },
  { label: "C.V. Raman", color: "bg-yellow-500", correct: false },
  { label: "APJ Abdul Kalam ✓", color: "bg-green-600", correct: true },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactType, setContactType] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [contactLoading, setContactLoading] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)
  const [contactError, setContactError] = useState("")
  const featureRefs = useRef<HTMLDivElement[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const contactFormRef = useRef<HTMLFormElement>(null)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactError("")
    if (!contactType) {
      setContactError("Please select a type")
      return
    }
    setContactLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          type: contactType,
          message: contactMessage,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setContactError(data.error || "Failed to send message")
        return
      }
      setContactSuccess(true)
      setContactName("")
      setContactEmail("")
      setContactType("")
      setContactMessage("")
    } catch {
      setContactError("Something went wrong. Please try again.")
    } finally {
      setContactLoading(false)
    }
  }
  const faqs = [
    {
      q: "What is Quoosh?",
      a: "Quoosh is a real-time quiz platform built for classrooms, teams, and live events. Hosts create quizzes and players join via a game PIN — no account required to play.",
    },
    {
      q: "How do players join a game?",
      a: "Players simply enter the game PIN shown on the host's screen from any device with a browser. That's it — they're in within seconds.",
    },
    {
      q: "Do players need an account?",
      a: "No! Players join instantly without signing up. Only quiz creators need an account to build and host quizzes.",
    },
    {
      q: "How can I create a quiz?",
      a: "You can create quizzes manually question by question, use the AI Quiz Builder to generate questions automatically, or import from a JSON file.",
    },
    {
      q: "What devices are supported?",
      a: "Quoosh works on any device with a modern web browser — phones, tablets, laptops, and desktops. No app download needed.",
    },
    {
      q: "Is Quoosh open-source?",
      a: "Yes! Quoosh is fully open-source. You can explore the code, contribute, or self-host on GitHub.",
    },
    {
      q: "How does scoring work?",
      a: "Players earn points for correct answers, with bonus points for speed. A live leaderboard updates after every question so everyone stays engaged.",
    },
    {
      q: "How do I report issues or suggest features?",
      a: "Use the Support & Feedback form on this page, or open an issue directly on our GitHub repository. We read everything!",
    },
  ]

  /* Navbar scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* Scroll-reveal for feature cards */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.15 },
    )
    featureRefs.current.forEach((el: HTMLDivElement) => {
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="min-h-dvh font-(family-name:--font-montserrat)"
      style={{ color: "#111827" }}
    >
      {/* Background — matches manager/game page */}
      <div className="fixed top-0 left-0 -z-10 h-full w-full bg-orange-600 opacity-70">
        <Image
          className="pointer-events-none h-full w-full object-cover opacity-60"
          src={background}
          alt="background"
          fill
          priority
        />
      </div>
      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "#1c1a00" : "rgba(20,18,0,0.75)",
          backdropFilter: scrolled ? "none" : "blur(10px)",
          borderBottom: `1px solid ${scrolled ? "rgba(245,160,0,0.25)" : "rgba(245,160,0,0.12)"}`,
          boxShadow: scrolled ? "0 4px 28px rgba(0,0,0,0.55)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image src={logo} alt="Quoosh" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { label: "Features", href: "#features" },
              { label: "How it Works", href: "#how-it-works" },
              { label: "Contact", href: "#contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                style={{ color: "rgba(255,255,255,0.7)" }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = "#fbbf24"
                  ;(e.currentTarget as HTMLElement).style.background =
                    "rgba(251,191,36,0.10)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color =
                    "rgba(255,255,255,0.7)"
                  ;(e.currentTarget as HTMLElement).style.background =
                    "transparent"
                }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://github.com/Sanchet237/Quoosh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
              style={{ color: "rgba(255,255,255,0.7)" }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.color = "#fbbf24"
                ;(e.currentTarget as HTMLElement).style.background =
                  "rgba(251,191,36,0.10)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.7)"
                ;(e.currentTarget as HTMLElement).style.background =
                  "transparent"
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
          </nav>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/play"
              className="rounded-xl px-4 py-2 text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{ color: "#fbbf24", border: "2px solid #fbbf24" }}
            >
              Join Game
            </Link>
            <Link
              href="/auth/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
              style={{
                color: "rgba(255,255,255,0.7)",
                border: "2px solid rgba(255,255,255,0.15)",
              }}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: RED, boxShadow: "0 3px 0 #991b1b" }}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl transition md:hidden"
            style={{ color: "rgba(255,255,255,0.8)" }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div
            className="border-t px-6 pt-3 pb-5 md:hidden"
            style={{
              background: "#1c1a00",
              borderColor: "rgba(245,160,0,0.2)",
            }}
          >
            <nav className="mb-4 flex flex-col gap-1">
              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-amber-400/10"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-amber-400/10"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                How it Works
              </a>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-amber-400/10"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Contact
              </a>
              <a
                href="https://github.com/Sanchet237/Quoosh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-amber-400/10"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </a>
            </nav>
            <div className="flex flex-col gap-2">
              <Link
                href="/play"
                onClick={() => setMenuOpen(false)}
                className="w-full rounded-xl px-4 py-3 text-center text-sm font-bold transition hover:opacity-90"
                style={{ color: "#fbbf24", border: "2px solid #fbbf24" }}
              >
                Join a Game
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition hover:bg-white/5"
                style={{
                  color: "rgba(255,255,255,0.75)",
                  border: "2px solid rgba(255,255,255,0.15)",
                }}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="w-full rounded-xl px-4 py-3 text-center text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: RED, boxShadow: "0 3px 0 #991b1b" }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 pt-12 pb-0 sm:px-6 sm:pt-16">
        {/* Classroom background image + orange tint overlay */}
        <div className="absolute inset-0 -z-0 bg-orange-600">
          <Image
            src={background}
            alt=""
            className="pointer-events-none h-full w-full object-cover opacity-50"
            fill
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(15,23,42,0.55)" }}
          />
        </div>

        {/* Floating shapes — hero sides */}
        <div
          className="shape-float pointer-events-none absolute top-[12%] left-[2%] hidden lg:block"
          style={{ animationDelay: "0s" }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              background: RED,
              borderRadius: "14px",
              boxShadow: "0 6px 0 #991b1b",
              transform: "rotate(-11deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <polygon points="12,3 22,21 2,21" />
            </svg>
          </div>
        </div>
        <div
          className="shape-float pointer-events-none absolute top-[35%] left-[4%] hidden lg:block"
          style={{ animationDelay: "1.2s" }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: GREEN,
              borderRadius: "12px",
              boxShadow: "0 5px 0 #166534",
              transform: "rotate(9deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </div>
        </div>
        <div
          className="shape-float pointer-events-none absolute top-[10%] right-[2%] hidden lg:block"
          style={{ animationDelay: "0.6s" }}
        >
          <div
            style={{
              width: "54px",
              height: "54px",
              background: BLUE,
              borderRadius: "13px",
              boxShadow: "0 6px 0 #1e40af",
              transform: "rotate(13deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <polygon points="12,2 22,12 12,22 2,12" />
            </svg>
          </div>
        </div>
        <div
          className="shape-float pointer-events-none absolute top-[38%] right-[3%] hidden lg:block"
          style={{ animationDelay: "1.8s" }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              background: "#d97706",
              borderRadius: "11px",
              boxShadow: "0 5px 0 #92400e",
              transform: "rotate(-8deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-6 pb-12 sm:gap-8 sm:pb-20 lg:grid-cols-2 lg:gap-16 lg:pb-36">
            {/* ── LEFT: Text + CTAs ── */}
            <div className="text-center lg:text-left">
              {/* Eyebrow */}
              <span
                className="mb-4 inline-block rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase sm:mb-6 sm:px-4 sm:py-1.5"
                style={{
                  borderColor: "rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Engage. Compete. Repeat.
              </span>

              {/* Headline */}
              <h1
                className="mb-4 max-w-lg leading-tight"
                style={{ fontFamily: "var(--font-fredoka)", fontWeight: 700 }}
              >
                <span
                  className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                  style={{ color: "#ffffff", letterSpacing: "-0.5px" }}
                >
                  Max out on fun
                </span>
                <span
                  className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                  style={{ color: "#ffffff", letterSpacing: "-0.5px" }}
                >
                  learning with{" "}
                  <span
                    style={{
                      color: "#fbbf24",
                      textShadow: "3px 3px 0px rgba(0,0,0,0.3)",
                    }}
                  >
                    QuoOsh!
                  </span>
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className="mb-8 px-2 text-xs font-semibold sm:px-0 sm:text-sm md:text-base"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                A powerful, subscription-free real-time quiz platform
                <br />
                for educators, teams and event organizers.
              </p>

              {/* CTAs */}
              <div className="flex flex-col items-center gap-3 px-2 sm:flex-row sm:gap-4 sm:px-0 lg:items-start">
                <Link
                  href="/play"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-bold text-white transition-all duration-150 hover:opacity-90 active:translate-y-0.5 active:scale-95 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                  style={{ background: RED, boxShadow: "4px 4px 0px #991b1b" }}
                >
                  Join a Game
                </Link>
                <Link
                  href="/auth/register"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-bold text-gray-900 transition-all duration-150 hover:opacity-90 active:translate-y-0.5 active:scale-95 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                  style={{
                    background: "#ffffff",
                    boxShadow: "4px 4px 0px #9ca3af",
                  }}
                >
                  Host Quiz
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Live Quiz Card ── */}
            <div className="flex justify-center pt-6 sm:pt-8 lg:justify-end lg:pt-0">
              <div
                className="card-float w-full max-w-xs overflow-hidden rounded-2xl bg-white text-left sm:max-w-sm md:max-w-md"
                style={{
                  boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
                }}
              >
                {/* Timer bar */}
                <div
                  className="h-2 overflow-hidden"
                  style={{ background: "#f3f4f6" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: GREEN,
                      animation: "timerShrink 8s linear infinite",
                    }}
                  />
                </div>

                <div className="p-6">
                  {/* Header row */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                      Question 3 / 8
                    </span>
                    <span
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-green-700"
                      style={{
                        background: "#dcfce7",
                        border: "1px solid #86efac",
                      }}
                    >
                      247 players online
                    </span>
                  </div>

                  {/* Question */}
                  <p className="mb-6 text-center text-xl font-bold text-gray-900 md:text-2xl">
                    Who is known as the &quot;Missile Man of India&quot;?
                  </p>

                  {/* Answer tiles */}
                  <div className="grid grid-cols-2 gap-3">
                    {mockAnswers.map((ans) => (
                      <div
                        key={ans.label}
                        className={`${ans.color} flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white`}
                        style={
                          ans.correct ? { boxShadow: "0 0 0 3px #86efac" } : {}
                        }
                      >
                        {ans.label}
                      </div>
                    ))}
                  </div>

                  {/* Score row */}
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span>Your score: 8,400</span>
                    <span>⏱ 12s left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Wavy bottom edge into the features section ── */}
        <div
          className="absolute right-0 bottom-0 left-0 leading-none"
          style={{ height: "160px" }}
        >
          {/* Dark shadow wave — sits on top of the image */}
          <svg
            viewBox="0 0 1440 160"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="absolute inset-0 block h-full w-full"
            style={{ zIndex: 1 }}
          >
            <path
              d="M0,60 C180,140 420,0 660,80 C900,160 1200,20 1440,75 L1440,160 L0,160 Z"
              fill="rgba(0,0,0,0.35)"
            />
          </svg>
          {/* Lighter dark wave slightly offset for depth */}
          <svg
            viewBox="0 0 1440 160"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="absolute inset-0 block h-full w-full"
            style={{ zIndex: 2 }}
          >
            <path
              d="M0,90 C240,30 500,140 720,90 C940,40 1200,130 1440,85 L1440,160 L0,160 Z"
              fill="rgba(0,0,0,0.18)"
            />
          </svg>
          {/* White wave — transitions into features bg */}
          <svg
            viewBox="0 0 1440 160"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 block h-full w-full"
            style={{ zIndex: 3 }}
          >
            <path
              d="M0,110 C200,55 420,145 660,100 C900,55 1150,135 1440,90 L1440,160 L0,160 Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section
        id="features"
        className="relative overflow-hidden px-6 py-24"
        style={{ background: "#f9fafb" }}
      >
        {/* Floating shapes — features bg */}
        <div
          className="shape-float pointer-events-none absolute top-8 left-4 opacity-40"
          style={{ animationDelay: "0.3s" }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              background: RED,
              borderRadius: "13px",
              boxShadow: "0 5px 0 #991b1b",
              transform: "rotate(-14deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <polygon points="12,3 22,21 2,21" />
            </svg>
          </div>
        </div>
        <div
          className="shape-float pointer-events-none absolute top-12 right-6 opacity-35"
          style={{ animationDelay: "1s" }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: BLUE,
              borderRadius: "12px",
              boxShadow: "0 5px 0 #1e40af",
              transform: "rotate(10deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <polygon points="12,2 22,12 12,22 2,12" />
            </svg>
          </div>
        </div>
        <div
          className="shape-float pointer-events-none absolute bottom-10 left-[8%] opacity-30"
          style={{ animationDelay: "1.5s" }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              background: GREEN,
              borderRadius: "11px",
              boxShadow: "0 4px 0 #166534",
              transform: "rotate(8deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
        </div>
        <div
          className="shape-float pointer-events-none absolute right-[6%] bottom-8 opacity-30"
          style={{ animationDelay: "0.7s" }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              background: "#d97706",
              borderRadius: "11px",
              boxShadow: "0 5px 0 #92400e",
              transform: "rotate(-10deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </div>
        </div>
        <div
          className="shape-float pointer-events-none absolute top-[45%] left-2 opacity-25"
          style={{ animationDelay: "2s" }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: BLUE,
              borderRadius: "10px",
              boxShadow: "0 4px 0 #1e40af",
              transform: "rotate(15deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="12,3 22,21 2,21" />
            </svg>
          </div>
        </div>
        <div
          className="shape-float pointer-events-none absolute top-[48%] right-2 opacity-25"
          style={{ animationDelay: "2.4s" }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: RED,
              borderRadius: "10px",
              boxShadow: "0 4px 0 #991b1b",
              transform: "rotate(-12deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="12,2 22,12 12,22 2,12" />
            </svg>
          </div>
        </div>

        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mb-16 text-center">
            <p className="mb-2 text-3xl font-semibold tracking-widest text-gray-400 uppercase italic">
              Ignite Fun Learning
            </p>
            <h2
              className="text-5xl md:text-6xl"
              style={{
                fontFamily: "var(--font-fredoka)",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Anytime.{" "}
              <span
                style={{
                  color: RED,
                  textShadow: "3px 3px 0px rgba(0,0,0,0.08)",
                }}
              >
                Anywhere.
              </span>
            </h2>
          </div>

          {/* Action cards */}
          <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {actionCards.map((card) => (
              <div key={card.title} className="retro-card">
                <div className="retro-icon">{card.icon}</div>
                <h3 className="retro-title">{card.title}</h3>
                <p className="retro-desc">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Feature highlight cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                ref={(el) => {
                  if (el) featureRefs.current[i] = el
                }}
                className="retro-card reveal-card"
                style={{ transitionDelay: f.delay }}
              >
                <div className="retro-icon">{f.icon}</div>
                <h3 className="retro-title">{f.title}</h3>
                <p className="retro-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="relative overflow-hidden bg-white px-6 py-24"
      >
        {/* Floating shapes — how it works bg */}
        <div
          className="shape-float pointer-events-none absolute top-10 left-3 opacity-30"
          style={{ animationDelay: "0.4s" }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              background: GREEN,
              borderRadius: "12px",
              boxShadow: "0 5px 0 #166534",
              transform: "rotate(11deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </div>
        </div>
        <div
          className="shape-float pointer-events-none absolute top-14 right-4 opacity-30"
          style={{ animationDelay: "1.3s" }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              background: RED,
              borderRadius: "11px",
              boxShadow: "0 5px 0 #991b1b",
              transform: "rotate(-9deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
        </div>
        <div
          className="shape-float pointer-events-none absolute bottom-12 left-[5%] opacity-25"
          style={{ animationDelay: "0.9s" }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              background: "#d97706",
              borderRadius: "11px",
              boxShadow: "0 4px 0 #92400e",
              transform: "rotate(13deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <polygon points="12,2 22,12 12,22 2,12" />
            </svg>
          </div>
        </div>
        <div
          className="shape-float pointer-events-none absolute right-[4%] bottom-10 opacity-25"
          style={{ animationDelay: "1.7s" }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: BLUE,
              borderRadius: "12px",
              boxShadow: "0 5px 0 #1e40af",
              transform: "rotate(-14deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <polygon points="12,3 22,21 2,21" />
            </svg>
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Leader image */}
          <div className="mb-10 flex justify-center">
            <Image
              src={leader}
              alt="Leaderboard"
              className="h-auto w-full max-w-xs drop-shadow-xl md:max-w-sm"
            />
          </div>

          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-fredoka)",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Launch Your Quiz in{" "}
              <span
                style={{
                  color: GREEN,
                  textShadow: "3px 3px 0px rgba(0,0,0,0.08)",
                }}
              >
                3 Simple Steps
              </span>
            </h2>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase italic">
              From zero to live quiz in under two minutes.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-6">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="group relative flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2"
              >
                {/* Dashed connector */}
                {i < steps.length - 1 && (
                  <svg
                    className="absolute top-10 hidden md:block"
                    style={{
                      left: "calc(50% + 52px)",
                      width: "calc(100% - 104px)",
                    }}
                    height="2"
                    overflow="visible"
                  >
                    <line
                      x1="0"
                      y1="1"
                      x2="100%"
                      y2="1"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      className="step-dash"
                    />
                  </svg>
                )}

                {/* Number circle + icon */}
                <div className="relative mb-4 flex h-20 w-20 items-center justify-center">
                  <span
                    className="absolute text-7xl font-black select-none"
                    style={{ color: `${step.accent}14` }}
                  >
                    {step.num}
                  </span>
                  <div
                    className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                    style={{
                      background: `${step.accent}14`,
                      border: `2px solid ${step.accent}40`,
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                <span
                  className="mb-1 text-xs font-black tracking-widest uppercase"
                  style={{ color: step.accent }}
                >
                  Step {step.num}
                </span>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mockup ── */}
      <section className="bg-white py-16 text-center">
        <Image
          src={mockup}
          alt="App Mockup"
          width={900}
          height={500}
          unoptimized
          className="mx-auto inline-block h-auto w-full max-w-[900px]"
        />
      </section>

      {/* ══════════════════════════════════════════
          SUPPORT & FEEDBACK
      ══════════════════════════════════════════ */}
      <section id="contact" className="relative overflow-hidden bg-white">
        {/* ── White area: title + top of form ── */}
        <div className="relative z-10 px-6 pt-12 pb-8 text-center">
          <h2 className="mb-2 text-2xl font-extrabold text-gray-900 md:text-3xl">
            Support &amp; Feedback
          </h2>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase italic">
            Have a question, found a bug, or want to suggest a feature? Send us
            a message — we&apos;re listening.
          </p>
        </div>

        {/* ── Main body: green hills + shapes + form ── */}
        <div className="relative" style={{ minHeight: "520px" }}>
          {/* ── Multi-layer wavy green background ── */}
          <div className="absolute inset-0">
            {/* Layer 1 — lightest, highest wave */}
            <svg
              viewBox="0 0 1440 520"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d="M0,160 C200,80 400,240 600,150 C800,60 1000,200 1200,130 C1320,90 1400,160 1440,145 L1440,520 L0,520 Z"
                fill="#86efac"
              />
            </svg>
            {/* Layer 2 */}
            <svg
              viewBox="0 0 1440 520"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d="M0,220 C180,150 380,290 600,210 C820,130 1020,260 1240,190 C1360,155 1420,210 1440,200 L1440,520 L0,520 Z"
                fill="#4ade80"
              />
            </svg>
            {/* Layer 3 */}
            <svg
              viewBox="0 0 1440 520"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d="M0,290 C220,225 440,350 660,275 C880,200 1060,320 1280,260 C1380,230 1430,275 1440,265 L1440,520 L0,520 Z"
                fill="#22c55e"
              />
            </svg>
            {/* Layer 4 — darkest, base */}
            <svg
              viewBox="0 0 1440 520"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d="M0,360 C240,305 460,410 700,345 C920,280 1100,380 1340,330 L1440,315 L1440,520 L0,520 Z"
                fill="#16a34a"
              />
            </svg>
          </div>

          {/* ── Shapes — pinned to far edges only ── */}

          {/* Far left top — Red / Triangle */}
          <div
            className="shape-float absolute z-20 hidden xl:block"
            style={{ left: "1%", top: "15%", animationDelay: "0s" }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                background: "#ef4444",
                borderRadius: "12px",
                boxShadow: "0 6px 0 #b91c1c",
                transform: "rotate(-12deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                <polygon points="12,3 22,21 2,21" />
              </svg>
            </div>
          </div>

          {/* Far left bottom — Yellow / Circle */}
          <div
            className="shape-float absolute z-20 hidden xl:block"
            style={{ left: "1.5%", top: "62%", animationDelay: "0.7s" }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#eab308",
                borderRadius: "11px",
                boxShadow: "0 5px 0 #a16207",
                transform: "rotate(10deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
          </div>

          {/* Far right top — Blue / Diamond */}
          <div
            className="shape-float absolute z-20 hidden xl:block"
            style={{ right: "1%", top: "15%", animationDelay: "0.4s" }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                background: "#2563eb",
                borderRadius: "12px",
                boxShadow: "0 6px 0 #1d4ed8",
                transform: "rotate(14deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                <polygon points="12,2 22,12 12,22 2,12" />
              </svg>
            </div>
          </div>

          {/* Far right bottom — Green / Square */}
          <div
            className="shape-float absolute z-20 hidden xl:block"
            style={{ right: "1.5%", top: "62%", animationDelay: "1.1s" }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#15803d",
                borderRadius: "11px",
                boxShadow: "0 5px 0 #14532d",
                transform: "rotate(-8deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </div>
          </div>

          {/* ── Two-column: Form (left) + FAQ (right) ── */}
          <div className="relative z-10 mx-auto grid max-w-4xl items-start gap-6 px-8 pt-10 pb-14 lg:grid-cols-2">
            {/* ── LEFT: Contact Form ── */}
            <div
              className="w-full rounded-2xl bg-white px-5 py-6"
              style={{
                boxShadow:
                  "0 8px 0px rgba(0,0,0,0.15), 0 12px 36px rgba(0,0,0,0.18)",
              }}
            >
              <h3
                className="mb-3 text-center font-extrabold text-gray-900"
                style={{
                  fontFamily: "var(--font-fredoka)",
                  fontSize: "1.2rem",
                }}
              >
                Get in Touch
              </h3>
              {contactSuccess ? (
  <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
      <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <p className="text-base font-black text-gray-800">Message sent!</p>
    <p className="text-sm text-gray-500">Thanks for reaching out. I&apos;ll get back to you soon.</p>
    <button
      onClick={() => setContactSuccess(false)}
      className="mt-2 text-sm font-bold text-blue-600 underline hover:text-blue-500"
    >
      Send another message
    </button>
  </div>
) : (
  <form onSubmit={handleContactSubmit} className="space-y-2">
    {contactError && (
      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-600">
        {contactError}
      </div>
    )}
    <div>
      <label className="mb-1 block text-xs font-bold tracking-widest text-gray-500 uppercase">Name</label>
      <input
        type="text"
        required
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-lg border-2 border-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-900 transition-all duration-150 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </div>
    <div>
      <label className="mb-1 block text-xs font-bold tracking-widest text-gray-500 uppercase">Email</label>
      <input
        type="email"
        required
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-lg border-2 border-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-900 transition-all duration-150 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </div>
    <div>
      <label className="mb-1 block text-xs font-bold tracking-widest text-gray-500 uppercase">Type</label>
      <select
        required
        value={contactType}
        onChange={(e) => setContactType(e.target.value)}
        className="w-full rounded-lg border-2 border-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-900 transition-all duration-150 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      >
        <option value="" disabled>Select a type</option>
        <option>General Question</option>
        <option>Bug Report</option>
        <option>Feature Request</option>
        <option>Feedback</option>
      </select>
    </div>
    <div>
      <label className="mb-1 block text-xs font-bold tracking-widest text-gray-500 uppercase">Message</label>
      <textarea
        rows={3}
        required
        value={contactMessage}
        onChange={(e) => setContactMessage(e.target.value)}
        placeholder="Describe your question, issue, or idea..."
        className="w-full resize-none rounded-lg border-2 border-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-900 transition-all duration-150 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </div>
    <button
      type="submit"
      disabled={contactLoading}
      className="w-full rounded-xl px-4 py-2 text-sm font-bold text-white transition-all duration-150 hover:brightness-110 active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        background: `linear-gradient(135deg, ${BLUE}, #1d4ed8)`,
        boxShadow: contactLoading ? "none" : "0 5px 0px #1e3a8a, 0 6px 16px rgba(37,99,235,0.35)",
      }}
    >
      {contactLoading ? "Sending..." : "Send Message"}
    </button>
  </form>
)}

              {/* ── GitHub fallback ── */}
              <div className="mt-3 flex items-center justify-center gap-2 rounded-lg border-2 border-gray-100 bg-gray-50 px-3 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="shrink-0 text-gray-600"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <p className="text-xs text-gray-500">
                  Prefer GitHub?{" "}
                  <a
                    href="https://github.com/Sanchet237/Quoosh/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-gray-800 underline underline-offset-2 hover:text-black"
                  >
                    Open an issue
                  </a>{" "}
                  — we&apos;re always listening.
                </p>
              </div>
            </div>

            {/* ── RIGHT: FAQ Accordion ── */}
            <div
              className="w-full rounded-2xl bg-white px-5 py-6"
              style={{
                boxShadow:
                  "0 8px 0px rgba(0,0,0,0.15), 0 12px 36px rgba(0,0,0,0.18)",
              }}
            >
              <h3
                className="mb-3 text-center font-extrabold text-gray-900"
                style={{
                  fontFamily: "var(--font-fredoka)",
                  fontSize: "1.2rem",
                }}
              >
                Frequently Asked Questions
              </h3>
              <div className="space-y-1.5">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-lg border-2 border-gray-100 transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-gray-50"
                    >
                      <span className="text-xs font-bold text-gray-800">
                        {faq.q}
                      </span>
                      <span
                        className="shrink-0 text-base font-bold transition-transform duration-200"
                        style={{
                          color: GREEN,
                          transform:
                            openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                          display: "inline-block",
                        }}
                      >
                        +
                      </span>
                    </button>
                    {openFaq === i && (
                      <div className="border-t-2 border-gray-100 bg-gray-50 px-3 py-2">
                        <p className="text-xs leading-relaxed text-gray-600">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-black px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {/* 4-column grid */}
          <div className="grid gap-12 md:grid-cols-4">
            {/* Col 1 — Brand */}
            <div className="md:col-span-1">
              <Image src={logo} alt="Quoosh" className="mb-4 h-9 w-auto" />
              <p className="mb-6 max-w-xs text-sm leading-relaxed text-gray-400">
                A real-time quiz platform built for classrooms, teams, and live
                events. Open-source and free to use.
              </p>
              {/* Social icons */}
              <div className="flex gap-4">
                {/* GitHub */}
                <a
                  href="https://github.com/Sanchet237"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors duration-200 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a
                    href="https://x.com/Sanchet_237"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 transition-colors duration-200 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/sanchet-kolekar-613916331/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors duration-200 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/sanchetkolekar/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors duration-200 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                  </svg>
                </a>
                {/* Email */}
                <a
                  href="mailto:SanchetKolekar.07@gmail.com"
                  className="text-gray-500 transition-colors duration-200 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 — Platform */}
            <div>
              <p className="mb-5 text-xs font-semibold tracking-widest text-gray-500 uppercase">
                Platform
              </p>
              <ul className="space-y-3">
                {[
                  { label: "Join a Game", href: "/play" },
                  { label: "Host a Quiz", href: "/dashboard" },
                  { label: "Creator Login", href: "/auth/login" },
                  { label: "Register", href: "/auth/register" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Resources */}
            <div>
              <p className="mb-5 text-xs font-semibold tracking-widest text-gray-500 uppercase">
                Resources
              </p>
              <ul className="space-y-3">
                {[
                  {
                    label: "GitHub",
                    href: "https://github.com/Sanchet237/Quoosh",
                  },
                  {
                    label: "Documentation",
                    href: "https://github.com/Sanchet237/Quoosh#readme",
                  },
                  {
                    label: "Report a Bug",
                    href: "https://github.com/Sanchet237/Quoosh/issues",
                  },
                  {
                    label: "Contribute",
                    href: "https://github.com/Sanchet237/Quoosh/pulls",
                  },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Legal */}
            <div>
              <p className="mb-5 text-xs font-semibold tracking-widest text-gray-500 uppercase">
                Legal
              </p>
              <ul className="space-y-3">
                {[
                  {
                    label: "MIT License",
                    href: "https://github.com/Sanchet237/Quoosh/blob/main/LICENSE",
                  },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider + copyright */}
          <div className="mt-16 border-t border-gray-800 pt-8 text-center text-xs text-gray-600">
            © {new Date().getFullYear()} Quoosh. Open-source under the MIT
            License.
          </div>
        </div>
      </footer>
    </div>
  )
}
