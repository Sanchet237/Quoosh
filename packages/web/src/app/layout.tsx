import QuooshChat from "@quoosh/web/components/QuooshChat"
import Toaster from "@quoosh/web/components/Toaster"
import { SocketProvider } from "@quoosh/web/contexts/socketProvider"
import type { Metadata } from "next"
import { Fredoka, Montserrat } from "next/font/google"
import { PropsWithChildren } from "react"
import "./globals.css"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
})

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Quoosh — Real-time Quiz Platform",
  description: "Host live quizzes for classrooms, teams, and live events. Free and open-source.",
  icons: "/icon.svg",
  openGraph: {
    title: "Quoosh — Real-time Quiz Platform",
    description: "Host live quizzes for classrooms, teams, and live events.",
    type: "website",
  },
}

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang="en" suppressHydrationWarning={true} data-lt-installed="true">
    <body
      className={`${montserrat.variable} ${fredoka.variable} bg-secondary antialiased`}
    >
      <SocketProvider>
        <main className="text-base-[8px] flex flex-col">{children}</main>
        <Toaster />
        <QuooshChat />
      </SocketProvider>
    </body>
  </html>
)

export default RootLayout