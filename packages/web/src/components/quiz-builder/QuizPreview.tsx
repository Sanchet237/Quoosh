"use client"

import bgImage from "@quoosh/web/assets/background.webp"
import { resolveImageUrl } from "@quoosh/web/utils/image"

type QuestionPreviewProps = {
  text: string
  image?: string
  answers: string[]
  time: number
}

const ANSWER_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-green-500",
]

export default function QuizPreview({
  text,
  image,
  answers,
  time,
}: QuestionPreviewProps) {
  // Ensure we always have exactly 4 blocks in the preview grid for styling consistency
  const gridAnswers = [...answers, ...Array(Math.max(0, 4 - answers.length)).fill("")]
  const resolvedImage = resolveImageUrl(image)

  return (
    <div className="bg-transparent rounded-xl p-0 sticky top-6">
      <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider pl-1">
        Live Preview
      </h3>

      {/* The "Game Screen" representation */}
      <div 
        className="rounded-xl aspect-video relative overflow-hidden flex flex-col border border-gray-400 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1a1800]/75 z-0" />
        
        {/* Header / Question Text */}
        <div className="bg-white text-black p-3 text-center min-h-[60px] flex items-center justify-center font-black italic text-sm shadow-md z-10 mx-4 mt-4 rounded-xl border border-gray-200">
          {text || "Start typing your question..."}
        </div>

        {/* Center / Image & Time */}
        <div className="flex-1 flex items-center justify-center p-4 relative">
          {resolvedImage ? (
            <img 
              src={resolvedImage} 
              alt="Question media" 
              className="max-h-full max-w-full object-contain rounded drop-shadow-lg"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white shadow-sm">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Time indicator pill */}
          <div className="absolute left-4 bottom-4 bg-white/90 backdrop-blur-sm border border-gray-200 text-black text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-purple-600">{time}s</span>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-2 p-3 h-1/3 min-h-[80px]">
          {gridAnswers.map((ans, idx) => (
            <div
              key={idx}
              className={`${ANSWER_COLORS[idx]} rounded-lg flex items-center justify-center p-2 text-white font-black italic text-xs text-center shadow-md relative overflow-hidden ${!ans && 'opacity-30'}`}
            >
              {/* Optional UI shapes reflecting native game look */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30">
                {idx === 0 && <span className="text-lg">▲</span>}
                {idx === 1 && <span className="text-lg">◆</span>}
                {idx === 2 && <span className="text-lg">●</span>}
                {idx === 3 && <span className="text-lg">■</span>}
              </div>
              <span className="z-10 pl-6 shadow-sm drop-shadow-sm">{ans || `Answer ${idx + 1}`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
