"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { resolveImageUrl } from "@quoosh/web/utils/image"
import { Plus, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

// Ensure this matches the schema described in the prompt
const questionSchema = z.object({
  text: z.string().min(1, "Question cannot be empty"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  answers: z.array(z.string().min(1, "Answer cannot be empty")).min(2).max(4),
  solution: z.number().min(0).max(3),
  time: z.number().min(5).max(120),
  cooldown: z.number().min(3).max(10),
})

export type QuestionFormValues = z.infer<typeof questionSchema>

type ManualTabProps = {
  initialData?: Partial<QuestionFormValues> & { id?: string }
  onSave: (data: QuestionFormValues) => void
  isSaving: boolean
}

const ANSWER_COLORS = [
  "bg-red-500 border-red-600 text-white",
  "bg-blue-500 border-blue-600 text-white",
  "bg-yellow-500 border-yellow-600 text-white",
  "bg-green-500 border-green-600 text-white",
]

const UNSELECTED_COLORS = [
  "bg-red-50 border-red-200 text-red-900",
  "bg-blue-50 border-blue-200 text-blue-900",
  "bg-yellow-50 border-yellow-200 text-yellow-900",
  "bg-green-50 border-green-200 text-green-900",
]

export default function ManualTab({ initialData, onSave, isSaving }: ManualTabProps) {
  const [imageMode, setImageMode] = useState<"url" | "upload">("url")
  const [previewLoadFailed, setPreviewLoadFailed] = useState(false)
  
  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: initialData?.text || "",
      image: resolveImageUrl(initialData?.image || ""),
      answers: initialData?.answers || ["", ""],
      solution: initialData?.solution ?? 0,
      time: initialData?.time || 20,
      cooldown: initialData?.cooldown || 5,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers" as never,
  })

  // CORRECT — only resets when switching to a different question ID
  useEffect(() => {
    if (initialData) {
      reset({
        text: initialData.text || "",
        image: resolveImageUrl(initialData.image || ""),
        answers: initialData.answers || ["", ""],
        solution: initialData.solution ?? 0,
        time: initialData.time || 20,
        cooldown: initialData.cooldown || 5,
      })
    }
  }, [initialData?.id, reset])

  // Watch values for auto-save debouncing
  const formValues = watch()
  const previewImageUrl = resolveImageUrl(formValues.image)
  const imageField = register("image", {
    setValueAs: (value) => resolveImageUrl(value),
  })

  useEffect(() => {
    setPreviewLoadFailed(false)
  }, [previewImageUrl])

  // Keep a stable ref to onSave so it doesn't re-trigger the effect when the
  // parent re-renders and creates a new function reference.
  const onSaveRef = useRef(onSave)
  useEffect(() => { onSaveRef.current = onSave }, [onSave])

  // Track the last serialized form values so we only fire when data actually changes.
  const prevSerializedRef = useRef<string>("")

  useEffect(() => {
    const serialized = JSON.stringify(formValues)
    // Skip if nothing changed (prevents firing on every parent re-render)
    if (serialized === prevSerializedRef.current) return
    prevSerializedRef.current = serialized

    const result = questionSchema.safeParse(formValues)
    if (result.success) {
      const handler = setTimeout(() => {
        onSaveRef.current(result.data)
      }, 1500)
      return () => clearTimeout(handler)
    }
  }, [formValues])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-100">
        <h2 className="text-2xl font-black italic text-black tracking-tight">Question Details</h2>
        <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm transition-colors ${isSaving ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
          {isSaving ? "Saving..." : "Saved ✓"}
        </span>
      </div>

      <div className="space-y-6">
        {/* Question Text Card */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Question Text
          </label>
          <textarea
            {...register("text")}
            placeholder="Type your question..."
            className="w-full bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-3 outline-none transition-colors resize-none min-h-[100px]"
          />
          {errors.text && <p className="text-red-500 font-bold text-xs mt-1">Required</p>}
        </div>

        {/* Optional Media Card */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-gray-700">
              Reference Media <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`text-xs px-3 py-1.5 rounded-md font-bold transition-colors ${imageMode === "url" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                URL Link
              </button>
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`text-xs px-3 py-1.5 rounded-md font-bold transition-colors ${imageMode === "upload" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Upload File
              </button>
            </div>
          </div>
            
          {imageMode === "url" ? (
            <input
              {...imageField}
              type="text"
              placeholder="https://example.com/image.png"
              className="w-full bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-2.5 outline-none transition-colors"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    const base64 = event.target?.result as string
                    setValue("image", base64, { shouldValidate: true }) 
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="w-full bg-white border border-gray-300 rounded-lg text-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer focus:outline-none transition-colors"
            />
          )}
          {errors.image && <p className="text-red-500 font-bold text-xs mt-1">Invalid URL</p>}
          
          {/* Thumbnail Preview */}
          {previewImageUrl && (
            <div className="mt-3">
              <img
                src={previewImageUrl}
                alt="Preview"
                className="h-24 object-contain rounded border border-gray-200 bg-gray-50"
                onLoad={() => setPreviewLoadFailed(false)}
                onError={() => setPreviewLoadFailed(true)}
              />
              {previewLoadFailed && (
                <p className="text-xs font-bold text-amber-600 mt-2">
                  Could not load this link. Use a direct image URL (jpg/png/webp) instead of a webpage URL.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Timing Config */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
              Time limit <span>{formValues.time}s</span>
            </label>
            <input
              type="range"
              {...register("time", { valueAsNumber: true })}
              min="5" max="120" step="5"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
              Cooldown <span>{formValues.cooldown}s</span>
            </label>
            <input
              type="range"
              {...register("cooldown", { valueAsNumber: true })}
              min="3" max="10" step="1"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Answers Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Multiple Choice Answers</label>
              <p className="text-xs text-gray-500 mt-1">Check the radio button of the correct answer</p>
            </div>
            {fields.length < 4 && (
              <button
                type="button"
                onClick={() => append({} as never)}
                className="text-sm flex items-center gap-1.5 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors font-bold shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Answer
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={`flex flex-col rounded-xl border-2 p-2 transition-all shadow-sm ${
                  formValues.solution === index 
                    ? ANSWER_COLORS[index % 4] 
                    : UNSELECTED_COLORS[index % 4]
                }`}
              >
                <div className="flex items-center gap-2 mb-2 px-2">
                  <input
                    type="radio"
                    name="solution-radio"
                    checked={formValues.solution === index}
                    onChange={() => setValue("solution", index)}
                    className="w-5 h-5 text-gray-900 bg-white border-gray-300 focus:ring-gray-900 focus:ring-2 cursor-pointer"
                  />
                  <span className={`text-xs font-black uppercase ${formValues.solution === index ? 'text-white' : 'opacity-70'}`}>
                    Answer {index + 1}
                  </span>
                  
                  {fields.length > 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        remove(index)
                        if (formValues.solution === index) setValue("solution", 0)
                        else if (formValues.solution > index) setValue("solution", formValues.solution - 1)
                      }}
                      className={`ml-auto p-1 rounded-md transition-colors ${formValues.solution === index ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <input
                  {...register(`answers.${index}` as const)}
                  type="text"
                  placeholder={`Add option ${index + 1}...`}
                  className={`w-full border-0 rounded-lg focus:ring-0 px-4 py-3 font-bold text-lg outline-none transition-colors shadow-inner ${
                    formValues.solution === index
                      ? "bg-black/20 text-white placeholder-white/50"
                      : "bg-white text-gray-900 placeholder-gray-400"
                  }`}
                />
                {errors.answers?.[index] && (
                  <p className="text-white bg-red-500 px-2 py-1 rounded text-[10px] font-bold mt-2 inline-block self-start">REQUIRED</p>
                )}
              </div>
            ))}
          </div>
          {errors.answers?.root && (
             <p className="text-red-500 text-xs mt-2">{errors.answers.root.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
