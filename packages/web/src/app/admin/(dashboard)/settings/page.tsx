"use client"

import { Save } from "lucide-react"
import { useEffect, useState } from "react"

type Settings = Record<string, string>

const SETTING_LABELS: Record<
  string,
  { label: string; description: string; type: "text" | "number" | "boolean" }
> = {
  maxPlayersPerSession: {
    label: "Max Players Per Session",
    description: "Maximum number of players allowed in a single game session.",
    type: "number",
  },
  defaultQuestionTime: {
    label: "Default Question Time (seconds)",
    description: "Default time limit for each question.",
    type: "number",
  },
  defaultCooldown: {
    label: "Default Cooldown (seconds)",
    description: "Default cooldown period between questions.",
    type: "number",
  },
  nicknameMinLength: {
    label: "Nickname Min Length",
    description: "Minimum character length for player nicknames.",
    type: "number",
  },
  nicknameMaxLength: {
    label: "Nickname Max Length",
    description: "Maximum character length for player nicknames.",
    type: "number",
  },
  scoringMultiplier: {
    label: "Scoring Multiplier",
    description: "Base multiplier used in score calculations.",
    type: "number",
  },
  leaderboardSize: {
    label: "Leaderboard Size",
    description: "Number of players shown on the leaderboard.",
    type: "number",
  },
  maintenanceMode: {
    label: "Maintenance Mode",
    description: "When enabled, shows a maintenance message to all users.",
    type: "boolean",
  },
  maintenanceMessage: {
    label: "Maintenance Message",
    description: "Message shown to users during maintenance.",
    type: "text",
  },
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        setSettings(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading)
    return <div className="p-8 text-amber-200/40">Loading settings…</div>

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white italic">
            Platform Settings
          </h1>
          <p className="mt-1 text-sm text-amber-200/40">
            Global configuration for the quiz platform
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl border-2 border-amber-600 bg-amber-400 px-5 py-2.5 text-sm font-black text-black italic [box-shadow:4px_4px_rgb(217_119_6)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:0px_0px_rgb(217_119_6)] disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(SETTING_LABELS).map(
          ([key, { label, description, type }]) => (
            <div
              key={key}
              className="flex items-center gap-6 rounded-2xl border border-[#f5a000]/20 bg-[#2a2500] p-5"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="mt-0.5 text-xs text-amber-200/40">
                  {description}
                </p>
              </div>
              {type === "boolean" ? (
                <button
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      [key]: s[key] === "true" ? "false" : "true",
                    }))
                  }
                  className={`relative h-6 w-12 rounded-full transition-colors ${
                    settings[key] === "true"
                      ? "bg-amber-400"
                      : "bg-amber-900/40"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      settings[key] === "true" ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              ) : (
                <input
                  type={type === "number" ? "number" : "text"}
                  value={settings[key] ?? ""}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, [key]: e.target.value }))
                  }
                  className="w-48 rounded-xl border border-[#f5a000]/20 bg-black/30 px-4 py-2 text-sm text-white focus:border-amber-500/60 focus:outline-none"
                />
              )}
            </div>
          ),
        )}
      </div>
    </div>
  )
}
