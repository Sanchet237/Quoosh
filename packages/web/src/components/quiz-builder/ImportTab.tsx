"use client"

import { useState } from "react"
import { QuestionFormValues } from "./ManualTab"

type ImportTabProps = {
  onImport: (questions: QuestionFormValues[]) => void
}

export default function ImportTab({ onImport }: ImportTabProps) {
  const [jsonText, setJsonText] = useState("")
  const [error, setError] = useState("")
  const [previewData, setPreviewData] = useState<QuestionFormValues[]>([])

  const parseAndValidate = (rawContent: string) => {
    setError("")
    setPreviewData([])
    
    if (!rawContent.trim()) {
      return
    }

    try {
      const parsed = JSON.parse(rawContent)
      
      // Handle both Format A (Quoosh native { questions: [...] }) and Format B
      const incomingQuestions = Array.isArray(parsed) 
        ? parsed 
        : (parsed.questions || [])

      if (!Array.isArray(incomingQuestions)) {
        throw new Error("JSON must contain an array of questions.")
      }

      const validQuestions: QuestionFormValues[] = []
      let skipCount = 0

      for (const q of incomingQuestions) {
        try {
          // Map simplified format B or direct format A to our schema structure
          const text = q.question || q.text
          const answers = q.answers || q.options
          const solution = q.solution !== undefined ? q.solution : q.correct
          const time = q.time || 20
          const cooldown = q.cooldown || 5
          const image = q.image || ""

          if (!text || !Array.isArray(answers) || answers.length < 2 || solution === undefined) {
            skipCount++
            continue
          }

          validQuestions.push({
            text: String(text).substring(0, 500),
            image: String(image),
            answers: answers.map(String).slice(0, 4),
            solution: Number(solution),
            time: Number(time),
            cooldown: Number(cooldown),
          })
        } catch (e) {
          skipCount++
        }
      }

      setPreviewData(validQuestions)
      
      if (validQuestions.length === 0) {
        setError("Could not find any valid questions in the provided JSON.")
      } else if (skipCount > 0) {
        setError(`Found ${validQuestions.length} valid questions (Skipped ${skipCount} malformed entries).`)
      }
      
    } catch (e: any) {
      setError("Invalid JSON format. Please check your syntax.")
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setJsonText(val)
    parseAndValidate(val)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setJsonText(content)
      parseAndValidate(content)
    }
    reader.readAsText(file)
  }

  const handleImportSubmit = () => {
    if (previewData.length > 0) {
      onImport(previewData)
      setJsonText("")
      setPreviewData([])
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-black text-black tracking-tight mb-2">Import from JSON</h2>
        <p className="text-gray-500 font-medium">
          Paste your JSON payload or upload a `.json` file. We accept native Quoosh formats or simplified question arrays.
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#263381] bg-[#f6f7ff] rounded-xl p-8 mb-6 hover:bg-[#ebedff] transition-colors cursor-pointer group">
          <input
            type="file"
            accept="application/json"
            onChange={handleFileUpload}
            className="hidden"
            id="json-upload"
          />
          <label
            htmlFor="json-upload"
            className="cursor-pointer flex flex-col items-center w-full h-full"
          >
            <div className="bg-white p-3 rounded-full border-2 border-[#263381] [box-shadow:2px_2px_rgb(38_51_129)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:[box-shadow:0px_0px_rgb(38_51_129)] transition-all mb-4">
               <svg className="w-6 h-6 text-[#263381]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
               </svg>
            </div>
            <span className="text-[#263381] font-black tracking-wide">CLICK TO UPLOAD .JSON</span>
          </label>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t-2 border-gray-100"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-xs text-gray-400 font-black tracking-widest uppercase">or paste below</span>
          </div>
        </div>

        <textarea
          value={jsonText}
          onChange={handleTextChange}
          placeholder='{ "questions": [ { "question": "...", "answers": ["A", "B"], "solution": 0 } ] }'
          className="w-full mt-2 bg-white border-2 border-gray-300 rounded-xl text-black font-mono text-sm p-5 outline-none focus:border-[#263381] focus:ring-0 focus:[box-shadow:4px_4px_rgb(38_51_129)] transition-all min-h-[220px] resize-y"
        />

        {error && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${previewData.length > 0 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/50' : 'bg-red-500/10 text-red-500 border border-red-500/50'}`}>
            {error}
          </div>
        )}

        {previewData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-black text-black mb-2 pb-2 border-b border-gray-200">
              Preview ({previewData.length} valid questions)
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto mb-4 pr-2">
              {previewData.map((q, idx) => (
                <li key={idx} className="text-sm text-gray-700 truncate decoration-gray-300 font-medium">
                  <span className="text-gray-400 mr-2 font-black">{idx + 1}.</span> {q.text}
                </li>
              ))}
            </ul>
            
            <button
              onClick={handleImportSubmit}
              className="w-full mt-4 h-12 flex items-center justify-center rounded-xl bg-[#f6f7ff] text-[#263381] font-black tracking-wide border-2 border-[#263381] transition-all duration-100 [box-shadow:4px_4px_rgb(38_51_129)] hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:0px_0px_rgb(38_51_129)] text-lg"
            >
              Parse {previewData.length} Questions
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
