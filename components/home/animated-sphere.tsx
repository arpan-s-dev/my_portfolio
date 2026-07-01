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

export function AnimatedSphere() {
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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const rotateY = (x: number, z: number, angle: number) => ({
      x: x * Math.cos(angle) - z * Math.sin(angle),
      z: x * Math.sin(angle) + z * Math.cos(angle),
    })

    const rotateX = (y: number, z: number, angle: number) => ({
      y: y * Math.cos(angle) - z * Math.sin(angle),
      z: y * Math.sin(angle) + z * Math.cos(angle),
    })

    const render = (timestamp = 0) => {
      frame = requestAnimationFrame(render)
      if (lastPaint !== 0 && timestamp - lastPaint < 33) return
      lastPaint = timestamp

      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) * 0.48
      const rotationY = time * 0.3
      const rotationX = time * 0.2

      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 1.15,
      )
      glow.addColorStop(0, rgbaFromCss(accent, theme === "arthur" ? 0.05 : 0.1))
      glow.addColorStop(0.65, rgbaFromCss(accent, theme === "arthur" ? 0.08 : 0.16))
      glow.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2)
      ctx.fill()

      const points: Array<{ x: number; y: number; z: number; char: string }> = []

      for (let phi = 0; phi < Math.PI * 2; phi += 0.2) {
        for (let theta = 0; theta < Math.PI; theta += 0.2) {
          const x = Math.sin(theta) * Math.cos(phi + time * 0.5)
          const y = Math.sin(theta) * Math.sin(phi + time * 0.5)
          const z = Math.cos(theta)

          const rotatedY = rotateY(x, z, rotationY)
          const rotatedX = rotateX(y, rotatedY.z, rotationX)
          const depth = (rotatedX.z + 1) / 2
          const glyphIndex = Math.floor(depth * (glyphs.length - 1))

          points.push({
            x: centerX + rotatedY.x * radius,
            y: centerY + rotatedX.y * radius,
            z: rotatedX.z,
            char: glyphs[Math.min(glyphIndex, glyphs.length - 1)],
          })
        }
      }

      points.sort((a, b) => a.z - b.z)
      ctx.font = `${Math.max(10, Math.round(radius * 0.035))}px "JetBrains Mono", monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      points.forEach((point) => {
        const normalizedDepth = (point.z + 1) / 2
        const color = normalizedDepth > 0.58 ? primary : muted
        const alpha = 0.12 + normalizedDepth * (theme === "arthur" ? 0.46 : 0.6)
        ctx.fillStyle = rgbaFromCss(color, alpha)
        ctx.fillText(point.char, point.x, point.y)
      })

      ctx.strokeStyle = rgbaFromCss(accent, theme === "arthur" ? 0.14 : 0.24)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, radius * 0.9, radius * 0.36, time * 0.18, 0, Math.PI * 2)
      ctx.stroke()

      time += 0.02
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
