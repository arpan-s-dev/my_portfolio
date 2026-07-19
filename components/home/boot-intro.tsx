"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

export function BootIntro() {
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const done = window.setTimeout(() => setVisible(false), reducedMotion ? 500 : 1100)
    return () => window.clearTimeout(done)
  }, [reducedMotion])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ backgroundColor: "var(--bg-base)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          <div className="relative flex h-[180px] w-[180px] items-center justify-center">
            {/* Drawing + spinning accent ring */}
            <motion.svg
              viewBox="0 0 180 180"
              className="absolute inset-0 h-full w-full"
              animate={reducedMotion ? undefined : { rotate: 360 }}
              transition={reducedMotion ? undefined : { duration: 5, ease: "linear", repeat: Infinity }}
            >
              <circle
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke="var(--border-faint)"
                strokeWidth="1.25"
                opacity="0.4"
              />
              <motion.circle
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.6 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.85, ease: "easeInOut" }}
              />
              {/* Orbiting node that rides the ring as it spins */}
              <circle cx="90" cy="20" r="3.5" fill="var(--accent)" />
            </motion.svg>

            {/* Monogram fades up in the center */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reducedMotion ? 0 : 0.28, ease: "easeOut" }}
            >
              <span
                className="font-display text-2xl font-semibold tracking-[0.18em]"
                style={{ color: "var(--text-primary)" }}
              >
                ARPAN<span style={{ color: "var(--accent)" }}>.</span>SDEV
              </span>
              <span
                className="mt-2 font-mono text-[10px] uppercase tracking-[0.38em]"
                style={{ color: "var(--text-muted)" }}
              >
                Loading
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
