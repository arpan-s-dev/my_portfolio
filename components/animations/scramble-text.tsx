"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { useWelcomeReady } from "@/components/animations/use-welcome-ready"

const GLYPHS = "!@#$%^&*()_+-=<>?/\\[]{}Xx"

interface ScrambleTextOnHoverProps {
  text: string
  className?: string
  durationMs?: number
  as?: "span" | "button" | "div"
  onClick?: () => void
}

interface ScrambleTextAutoProps {
  text: string
  className?: string
  durationMs?: number
  delayMs?: number
  as?: "span" | "button" | "div"
}

function useScrambleText(text: string, durationMs: number) {
  const prefersReducedMotion = useReducedMotion()
  const [displayText, setDisplayText] = useState(text)
  const frameRef = useRef<number | null>(null)
  const runningRef = useRef(false)

  const stopAnimation = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    runningRef.current = false
    setDisplayText(text)
  }, [text])

  const runAnimation = useCallback(
    (onComplete?: () => void) => {
      if (runningRef.current || prefersReducedMotion) {
        onComplete?.()
        return
      }
      runningRef.current = true

      const chars = text.split("")
      const start = performance.now()

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs)
        const lockCount = Math.floor(Math.min(1, progress * 1.4) * chars.length)

        const nextText = chars
          .map((char, index) => {
            if (char === " ") return " "
            if (index < lockCount) return char
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join("")

        setDisplayText(nextText)

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick)
          return
        }

        frameRef.current = null
        runningRef.current = false
        setDisplayText(text)
        onComplete?.()
      }

      frameRef.current = requestAnimationFrame(tick)
    },
    [durationMs, prefersReducedMotion, text],
  )

  useEffect(() => stopAnimation, [stopAnimation])
  useEffect(() => setDisplayText(text), [text])

  return { displayText, runAnimation, prefersReducedMotion }
}

export function ScrambleTextOnHover({
  text,
  className,
  durationMs = 220,
  as: Component = "span",
  onClick,
}: ScrambleTextOnHoverProps) {
  const ready = useWelcomeReady()
  const [hoverEnabled, setHoverEnabled] = useState(false)
  const [autoplayDone, setAutoplayDone] = useState(false)
  const { displayText, runAnimation, prefersReducedMotion } = useScrambleText(text, durationMs)

  useEffect(() => {
    if (!ready || autoplayDone) return
    if (prefersReducedMotion) {
      setAutoplayDone(true)
      setHoverEnabled(true)
      return
    }
    runAnimation(() => {
      setAutoplayDone(true)
      setHoverEnabled(true)
    })
  }, [autoplayDone, prefersReducedMotion, ready, runAnimation])

  const handleMouseEnter = useCallback(() => {
    if (!hoverEnabled) return
    runAnimation()
  }, [hoverEnabled, runAnimation])

  return (
    <Component className={className} onMouseEnter={handleMouseEnter} onClick={onClick}>
      {displayText}
    </Component>
  )
}

export function ScrambleTextAuto({
  text,
  className,
  durationMs = 180,
  delayMs = 0,
  as: Component = "span",
}: ScrambleTextAutoProps) {
  const { displayText, runAnimation, prefersReducedMotion } = useScrambleText(text, durationMs)

  useEffect(() => {
    if (prefersReducedMotion) return
    const timer = window.setTimeout(() => runAnimation(), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs, prefersReducedMotion, runAnimation])

  return <Component className={className}>{displayText}</Component>
}
