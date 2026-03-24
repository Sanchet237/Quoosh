"use client"

import { Edit3, FileJson } from "lucide-react"
import { useState } from "react"
import botImg from "../../assets/chatbot.jpg"
import AITab from "./AITab"
import ImportTab from "./ImportTab"
import ManualTab, { QuestionFormValues } from "./ManualTab"

type QuestionEditorProps = {
  activeQuestion: (QuestionFormValues & { id?: string }) | null
  onSaveManual: (data: QuestionFormValues) => void
  onAddBulk: (questions: QuestionFormValues[]) => void
  isSaving: boolean
}

type TabType = "manual" | "import" | "ai"

export default function QuestionEditor({
  activeQuestion,
  onSaveManual,
  onAddBulk,
  isSaving,
}: QuestionEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("manual")

  const tabs = [
    { id: "manual", label: "Manual", icon: <Edit3 className="h-4 w-4" /> },
    {
      id: "import",
      label: "Import JSON",
      icon: <FileJson className="h-4 w-4" />,
    },
    {
      id: "ai",
      label: "AI Generator",
      icon: (
        <img
          src={botImg.src}
          alt="AI Bot"
          className="mr-1 h-5 w-5 rounded-full object-cover"
        />
      ),
    },
  ] as const

  return (
    <div className="flex h-full flex-col bg-transparent">
      {/* Tabs Header */}
      <div className="flex items-center justify-center border-b border-gray-200 bg-gray-50/50 px-3 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6">
        <nav
          className="flex space-x-1.5 rounded-2xl border-2 border-gray-200 bg-white p-1.5 shadow-inner sm:space-x-3 sm:p-2"
          aria-label="Tabs"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black whitespace-nowrap transition-all duration-200 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm ${
                  isActive
                    ? "-translate-y-0.5 border-2 border-amber-600 bg-amber-400 text-black [box-shadow:3px_3px_rgb(180_83_9)]"
                    : "border-2 border-transparent bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                } `}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.icon}
                <span className="mb-0.5">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Form Content Container */}
      <div className="flex flex-1 justify-center overflow-y-auto p-6">
        {activeTab === "manual" && (
          <div className="max-w-3xl">
            {activeQuestion ? (
              <ManualTab
                key={
                  activeQuestion.id ??
                  `draft-${activeQuestion.text}-${activeQuestion.solution}-${activeQuestion.time}`
                }
                initialData={activeQuestion}
                onSave={onSaveManual}
                isSaving={isSaving}
              />
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20 text-center">
                <p className="font-medium text-gray-400">
                  Select a question from the sidebar to edit it.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "import" && (
          <div className="max-w-3xl">
            <ImportTab onImport={onAddBulk} />
          </div>
        )}

        {activeTab === "ai" && (
          <div className="relative h-full w-full max-w-3xl">
            <AITab onAdd={onAddBulk} />
          </div>
        )}
      </div>
    </div>
  )
}
