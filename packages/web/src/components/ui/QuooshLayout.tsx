import background from "@quoosh/web/assets/background.webp"
import logo from "@quoosh/web/assets/logo.svg"
import Image from "next/image"
import React from "react"

interface QuooshLayoutProps {
  children: React.ReactNode
  showLogo?: boolean
}

export default function QuooshLayout({
  children,
  showLogo = true,
}: QuooshLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-y-auto">
      {/* Background */}
      <div className="fixed top-0 left-0 -z-10 h-full w-full bg-orange-600">
        <Image
          className="pointer-events-none h-full w-full object-cover opacity-50"
          src={background}
          alt="background"
          fill
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(15,23,42,0.55)" }}
        />
      </div>

      {/* Scrollable content */}
      <div className="flex min-h-screen flex-col items-center justify-start px-4 py-6 sm:justify-center sm:py-8">
        <div className="relative z-10 flex w-full max-w-[360px] flex-col items-center gap-4">
          {showLogo && (
            <Image src={logo} alt="Quoosh" className="h-10 w-auto sm:h-12" />
          )}
          <div
            className="w-full rounded-2xl bg-white p-5"
            style={{
              boxShadow: "5px 5px 0px #d97706, 0 16px 40px rgba(0,0,0,0.2)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}