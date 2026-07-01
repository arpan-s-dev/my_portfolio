"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"

const glyphs = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯"

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

export function AnimatedTetrahedron() {
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
    const accent = styles.getPropertyValue("--accent").trim()
    const primary = styles.getPropertyValue("--text-primary").trim()
    const muted = styles.getPropertyValue("--text-muted").trim()

    const vertices = [
      { x: 0, y: 1, z: 0 },
      { x: -0.943, y: -0.333, z: -0.5 },
      { x: 0.943, y: -0.333, z: -0.5 },
      { x: 0, y: -0.333, z: 1 },
    ]

    const edges = [
      [0, 1], [0, 2], [0, 3],
      [1, 2], [2, 3], [3, 1],
    ]

    const faces = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 1],
      [1, 3, 2],
    ]

    const rotateY = (point: { x: number; y: number; z: number }, angle: number) => ({
      x: point.x * Math.cos(angle) - point.z * Math.sin(angle),
      y: point.y,
      z: point.x * Math.sin(angle) + point.z * Math.cos(angle),
    })

    const rotateX = (point: { x: number; y: number; z: number }, angle: number) => ({
      x: point.x,
      y: point.y * Math.cos(angle) - point.z * Math.sin(angle),
      z: point.y * Math.sin(angle) + point.z * Math.cos(angle),
    })

    const rotateZ = (point: { x: number; y: number; z: number }, angle: number) => ({
      x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
      y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
      z: point.z,
    })

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

      const centerX = width / 2
      const centerY = height / 2
      const scale = Math.min(width, height) * 0.58

      const points: Array<{ x: number; y: number; z: number; char: string }> = []

      edges.forEach(([i, j]) => {
        const v1 = vertices[i]
        const v2 = vertices[j]

        for (let t = 0; t <= 1; t += 0.05) {
          let point = {
            x: v1.x + (v2.x - v1.x) * t,
            y: v1.y + (v2.y - v1.y) * t,
            z: v1.z + (v2.z - v1.z) * t,
          }

          point = rotateY(point, time * 0.4)
          point = rotateX(point, time * 0.3)
          point = rotateZ(point, time * 0.2)

          const depth = (point.z + 1.5) / 3
          const glyphIndex = Math.floor(depth * (glyphs.length - 1))

          points.push({
            x: centerX + point.x * scale,
            y: centerY - point.y * scale,
            z: point.z,
            char: glyphs[Math.min(glyphIndex, glyphs.length - 1)],
          })
        }
      })

      faces.forEach(([i, j, k]) => {
        const v1 = vertices[i]
        const v2 = vertices[j]
        const v3 = vertices[k]

        for (let u = 0; u <= 1; u += 0.12) {
          for (let v = 0; v <= 1 - u; v += 0.12) {
            const w = 1 - u - v
            let point = {
              x: v1.x * u + v2.x * v + v3.x * w,
              y: v1.y * u + v2.y * v + v3.y * w,
              z: v1.z * u + v2.z * v + v3.z * w,
            }

            point = rotateY(point, time * 0.4)
            point = rotateX(point, time * 0.3)
            point = rotateZ(point, time * 0.2)

            const depth = (point.z + 1.5) / 3
            const glyphIndex = Math.floor(depth * (glyphs.length - 1))

            points.push({
              x: centerX + point.x * scale,
              y: centerY - point.y * scale,
              z: point.z,
              char: glyphs[Math.min(glyphIndex, glyphs.length - 1)],
            })
          }
        }
      })

      points.sort((a, b) => a.z - b.z)
      ctx.font = `${Math.max(12, Math.round(scale * 0.09))}px "JetBrains Mono", monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      points.forEach((point) => {
        const alpha = 0.12 + (point.z + 1.5) * 0.23
        ctx.fillStyle =
          point.z > 0 ? rgbaFromCss(primary, Math.min(alpha, 0.88)) : rgbaFromCss(muted, alpha * 0.78)
        ctx.fillText(point.char, point.x, point.y)
      })

      ctx.strokeStyle = rgbaFromCss(accent, theme === "arthur" ? 0.22 : 0.28)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, scale * 1.2, 0, Math.PI * 2)
      ctx.stroke()

      time += 0.015
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
      { rootMargin: "260px" },
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
