"use client"

import { useEffect, useState } from "react"

const WELCOME_DONE_EVENT = "portfolio:welcome-done"

declare global {
  interface Window {
    __portfolioWelcomeDone?: boolean
  }
}

export function markWelcomeDone() {
  if (typeof window === "undefined") return
  window.__portfolioWelcomeDone = true
  window.dispatchEvent(new Event(WELCOME_DONE_EVENT))
}

export function useWelcomeReady() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (window.__portfolioWelcomeDone) {
      setReady(true)
      return
    }

    const onDone = () => setReady(true)
    window.addEventListener(WELCOME_DONE_EVENT, onDone)
    return () => window.removeEventListener(WELCOME_DONE_EVENT, onDone)
  }, [])

  return ready
}

