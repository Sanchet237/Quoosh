const DATA_IMAGE_PREFIX = "data:image/"

function decodeRepeated(value: string): string {
  let decoded = value

  for (let i = 0; i < 2; i += 1) {
    try {
      const next = decodeURIComponent(decoded)
      if (next === decoded) break
      decoded = next
    } catch {
      break
    }
  }

  return decoded
}

function normalizeHttpUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const tryParse = (value: string): string | null => {
    let parsed: URL
    try {
      parsed = new URL(value)
    } catch {
      return null
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null
    }

    return parsed.toString()
  }

  // Parse first without decoding to avoid breaking encoded nested query params
  // (common in wrapped Google image links).
  const direct = tryParse(trimmed)
  if (direct) return direct

  const decoded = decodeRepeated(trimmed)
  if (decoded === trimmed) return null

  return tryParse(decoded)
}

function resolveWrappedUrl(url: URL): string | null {
  const path = url.pathname.toLowerCase()

  const candidates = [
    url.searchParams.get("imgurl"),
    path === "/imgres" ? url.searchParams.get("imgurl") : null,
    url.searchParams.get("mediaurl"),
    path === "/url" ? url.searchParams.get("q") : null,
  ]

  for (const candidate of candidates) {
    if (!candidate) continue

    const normalized = normalizeHttpUrl(candidate)
    if (normalized) return normalized

    const decoded = decodeRepeated(candidate)
    if (decoded.startsWith(DATA_IMAGE_PREFIX)) return decoded
  }

  return null
}

export function resolveImageUrl(input?: string | null): string {
  if (!input) return ""

  const trimmed = input.trim()
  if (!trimmed) return ""
  if (trimmed.startsWith(DATA_IMAGE_PREFIX)) return trimmed

  const normalized = normalizeHttpUrl(trimmed)
  if (!normalized) return trimmed

  const url = new URL(normalized)
  const unwrapped = resolveWrappedUrl(url)
  if (unwrapped) return unwrapped

  return normalized
}

export function normalizeImageForStorage(input?: string | null): string | null {
  const resolved = resolveImageUrl(input)
  return resolved ? resolved : null
}

export function getRenderableImageSrc(input?: string | null): string {
  const resolved = resolveImageUrl(input)
  if (!resolved) return ""
  if (resolved.startsWith(DATA_IMAGE_PREFIX)) return resolved

  const normalized = normalizeHttpUrl(resolved)
  if (!normalized) return resolved

  return `/api/images/proxy?url=${encodeURIComponent(normalized)}`
}
