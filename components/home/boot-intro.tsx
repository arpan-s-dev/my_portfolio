"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

const bootLines = [
  "System_Boot_Sequence",
  "//Initializing_Modules...",
  "Loading_Portfolio_Shell_ [OK]",
  "Mounting_AI_Workflows_ [OK]",
  "Rendering_Arpanjeet.dev_ [READY]",
]

export function BootIntro() {
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => {
    if (reducedMotion) {
      setProgress(100)
      setLineCount(bootLines.length)
      const done = window.setTimeout(() => setVisible(false), 700)
      return () => window.clearTimeout(done)
    }

    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(100, current + 4))
    }, 70)

    const lineTimer = window.setInterval(() => {
      setLineCount((current) => Math.min(bootLines.length, current + 1))
    }, 360)

    const done = window.setTimeout(() => setVisible(false), 2600)

    return () => {
      window.clearInterval(progressTimer)
      window.clearInterval(lineTimer)
      window.clearTimeout(done)
    }
  }, [reducedMotion])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center px-6 boot-intro-shell"
      style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}
      role="status"
      aria-live="polite"
      aria-label="Portfolio boot sequence"
    >
      <div
        className="w-full max-w-[620px] border p-5 md:p-7"
        style={{
          borderColor: "var(--accent)",
          backgroundColor: "color-mix(in srgb, var(--bg-card) 92%, transparent)",
          boxShadow: "0 0 40px color-mix(in srgb, var(--accent) 22%, transparent)",
        }}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--text-muted)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--border-faint)" }} />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
            WELCOME_RENDER
          </span>
        </div>

        <div className="space-y-2 font-mono text-sm md:text-base">
          {bootLines.slice(0, lineCount).map((line, index) => (
            <p key={line} className="terminal-line-reveal" style={{ animationDelay: `${index * 90}ms` }}>
              <span style={{ color: "var(--accent)" }}>&gt;</span> {line}
              {index === lineCount - 1 && progress < 100 ? <span className="terminal-cursor" /> : null}
            </p>
          ))}
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em]">
            <span style={{ color: "var(--text-muted)" }}>Rendering</span>
            <span style={{ color: "var(--accent)" }}>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden border" style={{ borderColor: "var(--border-faint)" }}>
            <div
              className="h-full transition-[width] duration-100 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, var(--accent), var(--accent-secondary))",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
