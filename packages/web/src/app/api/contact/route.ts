import env from "@quoosh/web/env"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

const DEFAULT_CONTACT_EMAIL = "Sanchetkolekar.07@gmail.com"

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  type: z.enum(["General Question", "Bug Report", "Feature Request", "Feedback"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
})

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }
    const { name, email, type, message } = parsed.data
    const to = env.CONTACT_EMAIL ?? DEFAULT_CONTACT_EMAIL
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeType = escapeHtml(type)
    const safeMessage = escapeHtml(message)
    await resend.emails.send({
      from: "Quoosh Contact <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `[Quoosh] ${type} from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#f59e0b;border-bottom:2px solid #f59e0b;padding-bottom:8px;margin-bottom:20px;">
            New ${safeType} — Quoosh
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr>
              <td style="padding:10px 8px;font-weight:bold;color:#374151;width:80px;border-bottom:1px solid #f3f4f6;">Name</td>
              <td style="padding:10px 8px;color:#111827;border-bottom:1px solid #f3f4f6;">${safeName}</td>
            </tr>
            <tr style="background:#f9fafb;">
              <td style="padding:10px 8px;font-weight:bold;color:#374151;border-bottom:1px solid #f3f4f6;">Email</td>
              <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;">
                <a href="mailto:${encodeURIComponent(email)}" style="color:#f59e0b;text-decoration:none;">${safeEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 8px;font-weight:bold;color:#374151;">Type</td>
              <td style="padding:10px 8px;color:#111827;">${safeType}</td>
            </tr>
          </table>
          <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:16px;border-radius:4px;">
            <p style="margin:0 0 8px;font-weight:bold;color:#374151;">Message</p>
            <p style="margin:0;color:#111827;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
          </div>
          <p style="margin-top:20px;color:#9ca3af;font-size:12px;">
            Sent via Quoosh contact form · Reply to respond to ${safeName}
          </p>
        </div>
      `,
    })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error("[CONTACT]", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    )
  }
}
