"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-8 text-center shadow-xl">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-500/30 bg-amber-500/10">
              <svg
                className="h-10 w-10 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-2 text-2xl font-bold text-white">Access Denied</h1>
          <p className="mb-8 leading-relaxed text-zinc-400">
            You don&apos;t have permission to access this page. Please sign in
            with an account that has the required role.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.back()}
              className="w-full rounded-xl bg-zinc-700 px-4 py-2.5 font-medium text-white transition-colors hover:bg-zinc-600"
            >
              Go Back
            </button>
            <Link
              href="/dashboard"
              className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-center font-semibold text-black transition-colors hover:bg-amber-400"
            >
              Host Dashboard
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-zinc-500 transition-colors hover:text-amber-400"
            >
              Sign in as Administrator
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-600">
          Quoosh &mdash; Role-based access control
        </p>
      </div>
    </div>
  )
}
