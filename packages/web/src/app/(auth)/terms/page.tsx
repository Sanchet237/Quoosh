"use client"

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="text-sm text-gray-600">Last updated: March 2026</p>
          </div>
          {/* 1. Acceptance of Terms */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed text-gray-700">
              By accessing and using the Quoosh platform, you agree to be bound
              by these Terms of Service. If you do not agree to these terms, you
              may not use the service.
            </p>
            <p className="leading-relaxed text-gray-700">
              We reserve the right to modify these terms at any time. Your
              continued use of Quoosh following the posting of revised terms
              constitutes your acceptance of the changes.
            </p>
          </section>

          {/* 2. User Responsibilities */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              2. User Responsibilities
            </h2>
            <p className="text-gray-700">
              As a user of Quoosh, you are responsible for:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>
                  Maintaining the confidentiality of your account credentials
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Not sharing your password with others</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Providing accurate and lawful information</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>
                  Using the platform in compliance with all applicable laws
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>
                  Notifying us immediately of any unauthorized access to your
                  account
                </span>
              </li>
            </ul>
          </section>

          {/* 3. Account Usage */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              3. Account Usage
            </h2>
            <p className="leading-relaxed text-gray-700">
              <span className="font-medium">For Quiz Creators:</span> You may
              create and host quizzes for educational, entertainment, or
              professional purposes. You retain full ownership and
              responsibility for your quiz content.
            </p>
            <p className="leading-relaxed text-gray-700">
              <span className="font-medium">For Players:</span> You can join
              quizzes using a display name and game PIN. Your gameplay data is
              used solely for the current game session and leaderboard display.
            </p>
            <p className="leading-relaxed text-gray-700">
              You may not create multiple accounts to circumvent restrictions or
              manipulate game results.
            </p>
          </section>

          {/* 4. Prohibited Activities */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              4. Prohibited Activities
            </h2>
            <p className="text-gray-700">You may not:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Violate any applicable laws or regulations</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Engage in harassment, abuse, or hateful speech</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>
                  Create offensive, explicit, or discriminatory quiz content
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Attempt to hack, exploit, or disrupt the platform</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Spam, spam advertising, or misleading content</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Cheat or manipulate game mechanics</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Violate the intellectual property rights of others</span>
              </li>
            </ul>
          </section>

          {/* 5. Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              5. Intellectual Property
            </h2>
            <p className="leading-relaxed text-gray-700">
              <span className="font-medium">Your Content:</span> You own all
              quiz content you create. By using Quoosh, you grant us a limited
              license to display and process your content for platform operation
              and improvement.
            </p>
            <p className="leading-relaxed text-gray-700">
              <span className="font-medium">Quoosh Platform:</span> The Quoosh
              platform, code, design, and trademarks are open-source under the
              MIT License. You may use, modify, and distribute the code
              according to the license terms.
            </p>
            <p className="leading-relaxed text-gray-700">
              You may not use our name, logo, or trademarks without explicit
              permission.
            </p>
          </section>

          {/* 6. Termination */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              6. Termination
            </h2>
            <p className="leading-relaxed text-gray-700">
              We may suspend or terminate your account immediately if you
              violate these terms or engage in prohibited activities. You may
              also delete your account at any time from your account settings.
            </p>
            <p className="leading-relaxed text-gray-700">
              Upon termination, your right to use Quoosh ceases immediately. You
              may request deletion of your data in accordance with our Privacy
              Policy.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              7. Limitation of Liability
            </h2>
            <p className="leading-relaxed text-gray-700">
              <span className="font-medium">Disclaimer:</span> Quoosh is
              provided "as-is" without warranties of any kind, expressed or
              implied.
            </p>
            <p className="leading-relaxed text-gray-700">
              We are not liable for any indirect, incidental, or consequential
              damages resulting from your use or inability to use the service,
              including loss of data, business interruption, or lost profits.
            </p>
            <p className="leading-relaxed text-gray-700">
              Your sole remedy for dissatisfaction with the service is to stop
              using it.
            </p>
          </section>

          {/* 8. Changes to Terms */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              8. Changes to Terms
            </h2>
            <p className="leading-relaxed text-gray-700">
              We may update these Terms of Service periodically. When we make
              material changes, we will notify users via email or a prominent
              notice on the platform.
            </p>
            <p className="leading-relaxed text-gray-700">
              Your continued use of Quoosh after such modifications constitutes
              your acceptance of the updated terms.
            </p>
          </section>

          {/* 9. Contact Us */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              9. Contact Us
            </h2>
            <p className="leading-relaxed text-gray-700">
              If you have questions about these Terms of Service, please contact
              us:
            </p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
              <p className="mb-2">
                <span className="font-medium">Email:</span>{" "}
                SanchetKolekar.07@gmail.com
              </p>
              <p>
                <span className="font-medium">GitHub Issues:</span>{" "}
                <a
                  href="https://github.com/Sanchet237/Quoosh/issues"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/Sanchet237/Quoosh/issues
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
