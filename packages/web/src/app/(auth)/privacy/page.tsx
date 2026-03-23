"use client"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-50 to-gray-100">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="fixed top-6 right-6 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:scale-105 hover:text-gray-900 hover:shadow-lg sm:top-8 sm:right-8"
        aria-label="Go back"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Back</span>
      </button>

      {/* Main Content */}
      <main className="px-6 py-12 sm:px-8 sm:py-16">
        <article className="mx-auto max-w-2xl space-y-8 rounded-xl bg-white p-8 shadow-sm sm:p-10 sm:shadow-md">
          {/* Page Title */}
          <div className="space-y-2 text-center">
            <h1 className="text-4xl leading-tight font-bold text-gray-900 sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-600">Last updated: March 2026</p>
          </div>

          {/* 1. Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              1. Introduction
            </h2>
            <p className="leading-relaxed text-gray-700">
              At Quoosh, we respect your privacy and are committed to protecting
              your personal data. This Privacy Policy explains how we collect,
              use, disclose, and protect your information when you use our
              platform.
            </p>
            <p className="leading-relaxed text-gray-700">
              Our platform is designed to be privacy-first. We minimize data
              collection and give you control over your information.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              2. Information We Collect
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Account Information
                </h3>
                <p className="text-gray-700">
                  When you create an account to host quizzes, we collect your
                  name, email address, and password.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Player Information
                </h3>
                <p className="text-gray-700">
                  Players can join using only a display name and game PIN. No
                  account or personal data is required.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Usage Data</h3>
                <p className="text-gray-700">
                  We collect quiz answers, scores, and timing data only for the
                  purpose of gameplay and leaderboard display.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Device & Browser Information
                </h3>
                <p className="text-gray-700">
                  We automatically collect IP address, browser type, device
                  information, and page interactions for security and service
                  improvement.
                </p>
              </div>
            </div>
          </section>

          {/* 3. How We Use Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              3. How We Use Information
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>To provide and maintain the Quoosh platform</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>To authenticate users and secure your account</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>
                  To facilitate real-time quiz gameplay and leaderboards
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>To improve platform features and user experience</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>To prevent fraud and ensure security</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>To send important account and service updates</span>
              </li>
            </ul>
          </section>

          {/* 4. Data Storage and Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              4. Data Storage and Security
            </h2>
            <p className="leading-relaxed text-gray-700">
              We use industry-standard encryption and secure protocols to
              protect your data. Your account is protected by password
              authentication and your data is encrypted in transit.
            </p>
            <p className="leading-relaxed text-gray-700">
              Player gameplay data is stored temporarily for the game session.
              Quiz creators' data is stored securely for as long as their
              account is active.
            </p>
            <p className="leading-relaxed text-gray-700">
              While we implement strong security measures, no system is
              completely secure. We cannot guarantee absolute security of your
              data.
            </p>
          </section>

          {/* 5. Cookies and Tracking */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              5. Cookies and Tracking
            </h2>
            <p className="leading-relaxed text-gray-700">
              We use cookies to maintain your session and remember your
              preferences. These are essential for the platform to function.
            </p>
            <p className="leading-relaxed text-gray-700">
              We do not use tracking cookies for advertising or analytics beyond
              what is necessary to understand platform usage and improve our
              service.
            </p>
          </section>

          {/* 6. Third-Party Services */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              6. Third-Party Services
            </h2>
            <p className="leading-relaxed text-gray-700">
              Quoosh is fully open-source and designed to be self-hostable. We
              do not sell your data to third parties. If you use third-party
              services that integrate with Quoosh, those services have their own
              privacy policies.
            </p>
            <p className="leading-relaxed text-gray-700">
              We use minimal third-party services. Any services we do use (like
              hosting providers) are bound by strict data protection agreements.
            </p>
          </section>

          {/* 7. Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              7. Your Rights
            </h2>
            <p className="text-gray-700">You have the right to:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Access your personal data</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Request correction of inaccurate data</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>
                  Request deletion of your account and associated data
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Export your quiz data</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Opt out of non-essential communications</span>
              </li>
            </ul>
            <p className="pt-2 leading-relaxed text-gray-700">
              To exercise these rights, please contact us at{" "}
              <span className="font-medium">SanchetKolekar.07@gmail.com</span>.
            </p>
          </section>

          {/* 8. Contact Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              8. Contact Information
            </h2>
            <p className="leading-relaxed text-gray-700">
              If you have questions about this Privacy Policy or our privacy
              practices, please contact us:
            </p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
              <p className="mb-2">
                <span className="font-medium">Email:</span>{" "}
                SanchetKolekar.07@gmail.com
              </p>
              <p>
                <span className="font-medium">GitHub:</span>{" "}
                <a
                  href="https://github.com/Sanchet237"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/Sanchet237
                </a>
              </p>
            </div>
          </section>

          {/* Bottom Spacing */}
          <div className="pt-8" />
        </article>
      </main>
    </div>
  )
}
