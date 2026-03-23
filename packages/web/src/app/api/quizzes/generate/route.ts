import { google } from "@ai-sdk/google"
import { requireHost } from "@quoosh/web/lib/adminGuard"
import { generateText } from "ai"
import { NextResponse } from "next/server"

// Allow up to 30 seconds for generation
export const maxDuration = 30

const systemPrompt = `
You are a quiz question generator for a Kahoot-style game called Quoosh.
The user will tell you a topic and how many questions they want.
You MUST respond with ONLY valid JSON in this exact format, no other text:

{
  "questions": [
    {
      "question": "Question text here?",
      "answers": ["Option A", "Option B", "Option C", "Option D"],
      "solution": 0,
      "time": 20,
      "cooldown": 5
    }
  ]
}

Rules:
- Always provide exactly 4 answer options.
- The 'solution' must be the 0-based index of the correct answer.
- Make distractors (wrong answers) plausible but clearly wrong.
- Keep questions clear and unambiguous.
- Difficulty should match what the user requests.
- Do not include any text, markdown backticks, or other formatting outside the raw JSON object. Use raw valid JSON only.
`

export async function POST(req: Request) {
  try {
    const { error } = await requireHost()
    if (error) return error

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("[QUIZ_GENERATE] GOOGLE_GENERATIVE_AI_API_KEY is not set!")
      return new NextResponse("API key not configured", { status: 500 })
    }

    const { messages } = await req.json()

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      messages,
      temperature: 0.7,
    })

    // Strip markdown code fences if model wraps in ```json ... ```
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()

    const parsed = JSON.parse(cleaned)
    return NextResponse.json(parsed)
  } catch (error) {
    console.error("[QUIZ_GENERATE] Full error:", error instanceof Error ? error.message : error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
