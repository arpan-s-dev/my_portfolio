"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"

const glyphs = "·∘○◯◌●◉"

function rgbaFromCss(value: string, alpha: number) {
  const hex = value.replace("#", "").trim()
  if (hex.length !== 3 && hex.length !== 6) return `rgba(255,255,255,${alpha})`
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex
  const int = Number.parseInt(normalized, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function AnimatedWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let frame = 0
    let time = 0
    let visible = true
    let pageVisible = !document.hidden
    let lastPaint = 0

    const styles = getComputedStyle(document.documentElement)
    const primary = styles.getPropertyValue("--text-primary").trim()
    const accent = styles.getPropertyValue("--accent").trim()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const render = (timestamp = 0) => {
      frame = requestAnimationFrame(render)
      if (lastPaint !== 0 && timestamp - lastPaint < 33) return
      lastPaint = timestamp

      ctx.clearRect(0, 0, width, height)
      ctx.font = `13px "JetBrains Mono", monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const cols = Math.max(1, Math.floor(width / 24))
      const rows = Math.max(1, Math.floor(height / 24))

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = (x + 0.5) * (width / cols)
          const py = (y + 0.5) * (height / rows)

          const wave1 = Math.sin(x * 0.2 + time * 2) * Math.cos(y * 0.15 + time)
          const wave2 = Math.sin((x + y) * 0.1 + time * 1.5)
          const wave3 = Math.cos(x * 0.1 - y * 0.1 + time * 0.8)
          const combined = (wave1 + wave2 + wave3) / 3
          const normalized = (combined + 1) / 2

          const glyphIndex = Math.floor(normalized * (glyphs.length - 1))
          const alpha = 0.08 + normalized * (theme === "arthur" ? 0.34 : 0.42)
          const color = normalized > 0.72 ? accent : primary

          ctx.fillStyle = rgbaFromCss(color, alpha)
          ctx.fillText(glyphs[glyphIndex], px, py)
        }
      }

      time += 0.03
    }

    const stop = () => {
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
        frameRef.current = 0
      }
    }

    const start = () => {
      if (frame || !visible || !pageVisible) return
      lastPaint = 0
      frame = requestAnimationFrame(render)
      frameRef.current = frame
    }

    const handleVisibility = () => {
      pageVisible = !document.hidden
      if (pageVisible) start()
      else stop()
    }

    resize()
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { rootMargin: "240px" },
    )
    observer.observe(canvas)
    start()
    window.addEventListener("resize", resize, { passive: true })
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", handleVisibility)
      stop()
    }
  }, [theme])

  return <canvas ref={canvasRef} className="h-full w-full" style={{ display: "block" }} />
}
