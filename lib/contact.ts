"use client"

import { useEffect, useRef, useState } from "react"

export const EMAIL = "arpan.s.dev@gmail.com"

/**
 * Copies EMAIL to the clipboard and exposes a transient `copied` flag that
 * flips back to false after `resetMs`. Falls back to opening the default mail
 * client if the Clipboard API is unavailable (insecure context / blocked
 * permission).
 */
export function useCopyEmail(resetMs = 2000) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), resetMs)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return { copied, copy }
}
