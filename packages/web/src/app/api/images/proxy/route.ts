import { resolveImageUrl } from "@quoosh/web/utils/image"
import { NextResponse } from "next/server"

const MAX_BYTES = 8 * 1024 * 1024

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get("url")
  const target = resolveImageUrl(raw)

  if (!target || (!target.startsWith("http://") && !target.startsWith("https://"))) {
    return new NextResponse("Invalid image URL", { status: 400 })
  }

  try {
    const response = await fetch(target, {
      redirect: "follow",
      headers: {
        "User-Agent": "QuooshImageProxy/1.0",
        Accept: "image/*,*/*;q=0.8",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return new NextResponse("Could not fetch image", { status: 404 })
    }

    const contentType = response.headers.get("content-type") || ""
    if (!contentType.toLowerCase().startsWith("image/")) {
      return new NextResponse("URL did not return an image", { status: 415 })
    }

    const lengthHeader = response.headers.get("content-length")
    if (lengthHeader && Number(lengthHeader) > MAX_BYTES) {
      return new NextResponse("Image is too large", { status: 413 })
    }

    const bytes = await response.arrayBuffer()
    if (bytes.byteLength > MAX_BYTES) {
      return new NextResponse("Image is too large", { status: 413 })
    }

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch {
    return new NextResponse("Could not load image", { status: 502 })
  }
}
