"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import type { ContributionData, ContributionLevel } from "@/lib/github-contributions"

interface GitHubActivityProps {
  contributions: ContributionData
  username: string
}

// Cell + gap geometry, kept in sync with the heatmap markup below.
const CELL = 12
const GAP = 3
const STRIDE = CELL + GAP // 15px center-to-center
const NUM_DAYS = 7
const SPRITE = 18
const OFFSET = (CELL - SPRITE) / 2 // center the sprite on a cell
// Constant travel speed in px/ms, so a far block takes proportionally
// longer to reach than a near one. ~120px/s keeps the builder readable.
const SPEED_PX_PER_MS = 0.12
const EAT_DWELL_MS = 0 // no pause — continuous glide reads smoother
const PAUSE_MS = 1900 // end-of-loop beat before the grid refills
const WRECKER_DELAY_MS = 2200
const BOOST_EVERY_MS = 8500
const BOOST_MS = 1400
const BOOST_MULTIPLIER = 1.65

// Gold-on-warm-brown (Arthur) / purple-on-near-black (Atie) cell stops.
// Same calm palette the snake reference used. Index 0 = empty cell.
const HEATMAP_COLORS = {
  arthur: [
    "rgba(201, 169, 97, 0.1)",
    "rgba(201, 169, 97, 0.3)",
    "rgba(201, 169, 97, 0.5)",
    "rgba(201, 169, 97, 0.7)",
    "rgba(201, 169, 97, 1)",
  ],
  atie: [
    "rgba(168, 85, 247, 0.15)",
    "rgba(168, 85, 247, 0.35)",
    "rgba(168, 85, 247, 0.55)",
    "rgba(168, 85, 247, 0.75)",
    "rgba(168, 85, 247, 1)",
  ],
} as const

function RepairmanSprite() {
  return (
    <div aria-hidden="true" className="repairman-sprite">
      <span className="repairman-hat" />
      <span className="repairman-face" />
      <span className="repairman-body" />
      <span className="repairman-hammer" />
      <span className="repairman-spark" />
    </div>
  )
}

function WreckerSprite() {
  return (
    <div aria-hidden="true" className="wrecker-sprite">
      <span className="wrecker-head" />
      <span className="wrecker-body" />
      <span className="wrecker-fist" />
    </div>
  )
}

interface PathCell {
  w: number
  d: number
  x: number
  y: number
}

// Build the repair route: only cells that actually have contributions
// (level ≥ 1 — empties are ignored), grouped by density ascending
// so the repairman builds the faintest cells first and saves the brightest for
// last. Within each density tier, he goes to the NEAREST remaining block
// next (greedy nearest-neighbour from his current spot), so travel reads
// as deliberate "head to that block, then the next one over" motion rather
// than random darting across the board.
function buildPath(weeks: ContributionData["weeks"]): PathCell[] {
  const byLevel: Record<number, PathCell[]> = { 1: [], 2: [], 3: [], 4: [] }
  weeks.forEach((week, w) => {
    week.forEach((day, d) => {
      if (day.level >= 1) {
        byLevel[day.level].push({ w, d, x: w * STRIDE, y: d * STRIDE })
      }
    })
  })

  const ordered: PathCell[] = []
  let cur = { x: 0, y: 0 }
  for (const level of [1, 2, 3, 4]) {
    const pool = byLevel[level]
    while (pool.length > 0) {
      let best = 0
      let bestD = Infinity
      for (let i = 0; i < pool.length; i++) {
        const dx = pool[i].x - cur.x
        const dy = pool[i].y - cur.y
        const dist = dx * dx + dy * dy
        if (dist < bestD) {
          bestD = dist
          best = i
        }
      }
      const next = pool.splice(best, 1)[0]
      ordered.push(next)
      cur = { x: next.x, y: next.y }
    }
  }
  return ordered
}

interface PathNode {
  x: number
  y: number
  // Index into the ordered block list when this node is a contribution to
  // build, or -1 when it's just an L-corner the sprites turn at en route.
  block: number
}

// Expand the block list into grid-aligned moves. Between two blocks that
// differ on both axes, insert a corner (horizontal-first, then vertical)
// so every segment is purely horizontal or vertical — sprites only ever
// moves up / down / left / right, never diagonally.
function buildNodes(blocks: PathCell[]): PathNode[] {
  if (blocks.length === 0) return []
  const nodes: PathNode[] = [{ x: blocks[0].x, y: blocks[0].y, block: 0 }]
  for (let i = 1; i < blocks.length; i++) {
    const prev = blocks[i - 1]
    const cur = blocks[i]
    if (cur.x !== prev.x && cur.y !== prev.y) {
      nodes.push({ x: cur.x, y: prev.y, block: -1 })
    }
    nodes.push({ x: cur.x, y: cur.y, block: i })
  }
  return nodes
}

interface Anim {
  legEnd: number[] // cumulative time the repairman finishes with node i
  loopMs: number // full cycle incl. the end pause
  // coverIndex[w][d] = order in which a sprite first passes over that
  // filled cell (-1 = never touched). passTimes[k] = the time that happens.
  // Both are monotonic in travel order, so the render only needs a single
  // "cells covered so far" count.
  coverIndex: number[][]
  passTimes: number[]
}

// Walk the grid-aligned route and record the timing of two things: when
// the repairman finishes each node (for positioning), and when a sprite first
// passes over each FILLED cell along the way. Because every
// segment runs along a grid line through cell centres, any contribution
// block under the lane is touched as the sprites cross it.
function buildAnim(
  nodes: PathNode[],
  weeks: ContributionData["weeks"],
  weekCount: number
): Anim {
  const legEnd: number[] = []
  const coverIndex: number[][] = Array.from({ length: weekCount }, () =>
    new Array(NUM_DAYS).fill(-1)
  )
  const passTimes: number[] = []
  let coverN = 0

  const mark = (w: number, d: number, time: number) => {
    if (w < 0 || w >= weekCount || d < 0 || d >= NUM_DAYS) return
    if ((weeks[w]?.[d]?.level ?? 0) < 1) return // empties aren't visibly touched
    if (coverIndex[w][d] !== -1) return // first crossing wins
    coverIndex[w][d] = coverN++
    passTimes.push(time)
  }

  let t = 0
  for (let i = 0; i < nodes.length; i++) {
    if (i === 0) {
      mark(nodes[0].x / STRIDE, nodes[0].y / STRIDE, 0)
    } else {
      const prev = nodes[i - 1]
      const cur = nodes[i]
      const dep = legEnd[i - 1] // departs prev once any dwell there is done
      const dist = Math.hypot(cur.x - prev.x, cur.y - prev.y)
      const steps = Math.round(dist / STRIDE)
      const ux = Math.sign(cur.x - prev.x)
      const uy = Math.sign(cur.y - prev.y)
      for (let s = 1; s <= steps; s++) {
        const w = (prev.x + ux * STRIDE * s) / STRIDE
        const d = (prev.y + uy * STRIDE * s) / STRIDE
        mark(w, d, dep + (STRIDE * s) / SPEED_PX_PER_MS)
      }
      t = dep + dist / SPEED_PX_PER_MS
    }
    if (nodes[i].block >= 0) t += EAT_DWELL_MS
    legEnd[i] = t
  }

  return { legEnd, loopMs: t + WRECKER_DELAY_MS + PAUSE_MS, coverIndex, passTimes }
}

export function GitHubActivity({ contributions, username }: GitHubActivityProps) {
  const { theme } = useTheme()

  const palette = HEATMAP_COLORS[theme]
  const getColor = (level: ContributionLevel) => palette[level]
  const profileUrl = `https://github.com/${username}`

  const weekCount = contributions.weeks.length || 52
  const path = useMemo(
    () => buildPath(contributions.weeks),
    [contributions.weeks]
  )
  const nodes = useMemo(() => buildNodes(path), [path])
  const anim = useMemo(
    () => buildAnim(nodes, contributions.weeks, weekCount),
    [nodes, contributions.weeks, weekCount]
  )

  const activityRef = useRef<HTMLDivElement>(null)
  const repairmanRef = useRef<HTMLDivElement>(null)
  const wreckerRef = useRef<HTMLDivElement>(null)
  const [built, setBuilt] = useState(0)
  const [broken, setBroken] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [boostMode, setBoostMode] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)

  useEffect(() => {
    const node = activityRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { rootMargin: "240px" },
    )
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden)
    handleVisibility()
    document.addEventListener("visibilitychange", handleVisibility)

    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  // Single rAF loop drives sprite position + facing + opacity straight on
  // the ref (no React churn per frame) and nudges React state only when the
  // build/break count or loop-complete flag actually flips — so the grid re-renders
  // ~once per cell, not per frame.
  useEffect(() => {
    const { legEnd, loopMs, passTimes } = anim
    const routeMs = legEnd[legEnd.length - 1] ?? 0

    const place = (
      ref: React.RefObject<HTMLDivElement | null>,
      x: number,
      y: number,
      rot: number,
      opacity: number,
    ) => {
      if (!ref.current) return
      ref.current.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`
      ref.current.style.opacity = String(opacity)
    }

    if (nodes.length === 0) {
      setBuilt(passTimes.length)
      setBroken(0)
      setGameOver(false)
      setBoostMode(false)
      place(repairmanRef, (nodes[0]?.x ?? 0) + OFFSET, (nodes[0]?.y ?? 0) + OFFSET, 0, 1)
      place(wreckerRef, (nodes[0]?.x ?? 0) + OFFSET, (nodes[0]?.y ?? 0) + OFFSET, 0, 0)
      return
    }

    if (!isActive || !pageVisible) return

    const total = nodes.length
    let raf = 0
    let start: number | undefined
    let repairRot = 0
    let wreckerRot = 0
    let repairSeg = 0
    let wreckerSeg = 0
    let repairedCount = 0
    let wreckedCount = 0
    let prevElapsed = 0
    let lastBuilt = -1
    let lastBroken = -1
    let lastOver = false
    let lastBoost = false

    setBuilt(0)
    setBroken(0)
    setGameOver(false)
    setBoostMode(false)

    const positionAt = (elapsed: number, currentSeg: number, lastRot: number) => {
      while (currentSeg < total - 1 && elapsed > legEnd[currentSeg]) currentSeg++

      const prevEnd = currentSeg === 0 ? 0 : legEnd[currentSeg - 1]
      const p0 = nodes[Math.max(0, currentSeg - 1)]
      const p1 = nodes[currentSeg]
      const dx = p1.x - p0.x
      const dy = p1.y - p0.y
      const travelLeg = Math.max(0, legEnd[currentSeg] - prevEnd)
      const frac =
        travelLeg <= 0 ? 1 : Math.min(1, Math.max(0, (elapsed - prevEnd) / travelLeg))

      if (frac < 1) {
        if (dx > 0) lastRot = 0
        else if (dx < 0) lastRot = 180
        else if (dy > 0) lastRot = 90
        else if (dy < 0) lastRot = 270
      }

      return {
        x: p0.x + dx * frac + OFFSET,
        y: p0.y + dy * frac + OFFSET,
        rot: lastRot,
        seg: currentSeg,
      }
    }

    const tick = (ts: number) => {
      if (start === undefined) start = ts
      const rawElapsed = (ts - start) % loopMs
      const boostSlot = rawElapsed % BOOST_EVERY_MS
      const inBoost = rawElapsed < routeMs && boostSlot < BOOST_MS
      const completedBoostWindows = Math.floor(rawElapsed / BOOST_EVERY_MS)
      const boostBonus =
        completedBoostWindows * BOOST_MS * (BOOST_MULTIPLIER - 1) +
        Math.min(boostSlot, BOOST_MS) * (BOOST_MULTIPLIER - 1)
      const repairElapsed = Math.min(rawElapsed + boostBonus, routeMs)
      const wreckerElapsed = Math.min(Math.max(0, rawElapsed - WRECKER_DELAY_MS), routeMs)

      // Modulo wrapped back to the start → grid refills, reset both pointers.
      if (rawElapsed < prevElapsed) {
        repairSeg = 0
        wreckerSeg = 0
        repairedCount = 0
        wreckedCount = 0
      }
      prevElapsed = rawElapsed

      while (repairedCount < passTimes.length && repairElapsed >= passTimes[repairedCount]) {
        repairedCount++
      }
      while (wreckedCount < passTimes.length && wreckerElapsed >= passTimes[wreckedCount]) {
        wreckedCount++
      }

      const repairPos = positionAt(repairElapsed, repairSeg, repairRot)
      repairSeg = repairPos.seg
      repairRot = repairPos.rot
      place(repairmanRef, repairPos.x, repairPos.y, repairPos.rot, 1)

      if (rawElapsed > WRECKER_DELAY_MS && wreckedCount < passTimes.length) {
        const wreckerPos = positionAt(wreckerElapsed, wreckerSeg, wreckerRot)
        wreckerSeg = wreckerPos.seg
        wreckerRot = wreckerPos.rot
        place(wreckerRef, wreckerPos.x, wreckerPos.y, wreckerPos.rot, 0.88)
      } else {
        place(wreckerRef, nodes[0].x + OFFSET, nodes[0].y + OFFSET, 0, 0)
      }

      const over = passTimes.length > 0 && repairedCount >= passTimes.length && wreckedCount >= passTimes.length

      if (lastBuilt !== repairedCount) {
        lastBuilt = repairedCount
        setBuilt(repairedCount)
      }
      if (lastBroken !== wreckedCount) {
        lastBroken = wreckedCount
        setBroken(wreckedCount)
      }
      if (lastOver !== over) {
        lastOver = over
        setGameOver(over)
      }
      if (lastBoost !== inBoost) {
        lastBoost = inBoost
        setBoostMode(inBoost)
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [nodes, anim, isActive, pageVisible])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
      className="theme-card p-6 h-full"
      ref={activityRef}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: "var(--text-primary)" }}
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span
            className="font-display text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            GitHub Activity
          </span>
          <span
            className="theme-badge px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor:
                theme === "arthur"
                  ? "rgba(201, 169, 97, 0.2)"
                  : "rgba(168, 85, 247, 0.2)",
              color: "var(--accent)",
            }}
          >
            ↗ {contributions.total}
          </span>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="theme-button flex items-center gap-2 px-3 py-1.5 text-sm font-medium border transition-colors hover:opacity-80"
          style={{
            borderColor: "var(--border-faint)",
            color: "var(--text-primary)",
          }}
        >
          View Profile
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Contribution count */}
      <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
        {contributions.total} contributions in the last year
      </p>

      {/*
        Arcade builder loop: an original repairman sprite follows the same
        grid-aligned route and builds each contribution cell. A small wrecker
        trails behind and breaks the path, then the board loops.
      */}
      <div className="overflow-x-auto">
        <div className="relative inline-block">
          {/* Grid */}
          <div className="flex gap-[3px] pb-2">
            {contributions.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => {
                  const ci = anim.coverIndex[weekIndex]?.[dayIndex] ?? -1
                  const isAnimatedCell = ci >= 0
                  const isBroken =
                    isAnimatedCell && ci < broken
                  const isBuilt =
                    isAnimatedCell && ci < built && !isBroken
                  const cellColor =
                    !isAnimatedCell || isBuilt ? getColor(day.level) : getColor(0)
                  return (
                    <div
                      key={dayIndex}
                      className={`github-contribution-cell h-[12px] w-[12px] rounded-[2px] ${
                        isBuilt ? "cell-build" : ""
                      } ${isBroken ? "cell-break" : ""}`}
                      style={{
                        backgroundColor: cellColor,
                        opacity: isBroken ? 0.56 : isAnimatedCell && !isBuilt ? 0.42 : 1,
                        transition: "background-color 140ms ease-out, opacity 140ms ease-out",
                      }}
                      title={
                        day.date
                          ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`
                          : undefined
                      }
                    />
                  )
                })}
              </div>
            ))}
          </div>

          <div
            ref={repairmanRef}
            className={`absolute top-0 left-0 pointer-events-none will-change-transform ${
              boostMode ? "repairman-boost" : ""
            }`}
            style={{ willChange: "transform, opacity", transition: "opacity 160ms ease-out" }}
          >
            <RepairmanSprite />
          </div>

          <div
            ref={wreckerRef}
            className="absolute top-0 left-0 pointer-events-none will-change-transform"
            style={{ willChange: "transform, opacity", transition: "opacity 160ms ease-out" }}
          >
            <WreckerSprite />
          </div>

          {boostMode && (
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center pointer-events-none">
              <span
                className="repairman-boost-label theme-badge px-3 py-1 text-xs font-bold uppercase"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  border: "1px solid var(--accent)",
                  color: "var(--accent)",
                }}
              >
                Turbo Repair
              </span>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="builder-loop-complete font-display text-2xl md:text-3xl font-semibold uppercase"
                style={{ color: "var(--accent)" }}
              >
                Rebuild Loop
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 mt-1">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Less
          </span>
          <div className="flex gap-1">
            {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
              <div
                key={level}
                className="h-[10px] w-[10px] rounded-sm"
                style={{ backgroundColor: getColor(level) }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            More
          </span>
        </div>
      </div>
    </motion.div>
  )
}
