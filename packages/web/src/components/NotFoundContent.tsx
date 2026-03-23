import Link from "next/link"

/** Shared 404 UI — used by `app/not-found.tsx` and `app/not-found/page.tsx` (middleware rewrite). */
export default function NotFoundContent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary text-white">
      <h1 className="text-8xl font-black text-amber-400">404</h1>
      <p className="mt-4 text-2xl font-bold text-white">Page not found</p>
      <p className="mt-2 text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl border-2 border-amber-600 bg-amber-400 px-6 py-3 text-base font-black text-black italic [box-shadow:4px_4px_rgb(217_119_6)] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:0px_0px_rgb(217_119_6)]"
      >
        Go Home
      </Link>
    </div>
  )
}
