"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { AnimatedWave } from "@/components/home/animated-wave"
import { ScrambleTextOnHover } from "@/components/animations/scramble-text"
import { TechLogo, type LogoName } from "@/components/home/tech-logos"

/* --------------------------------- data ---------------------------------- */

interface OrbitTool {
  name: string
  logo: LogoName
  color: string
}

interface OrbitGroup {
  title: string
  code: string
  subtitle: string
  tools: OrbitTool[]
}

const orbitGroups: OrbitGroup[] = [
  {
    title: "AI / Agents",
    code: "AGT",
    subtitle: "Model pipelines and agent tooling",
    tools: [
      { name: "Python", logo: "python", color: "#3776AB" },
      { name: "PyTorch", logo: "pytorch", color: "#EE4C2C" },
      { name: "HuggingFace", logo: "huggingface", color: "#F59E0B" },
      { name: "Claude API", logo: "claude", color: "#D97706" },
      { name: "LangGraph", logo: "langgraph", color: "#10B981" },
      { name: "DuckDB", logo: "duckdb", color: "#F97316" },
    ],
  },
  {
    title: "Data / OCR",
    code: "OCR",
    subtitle: "Document parsing and analytics exports",
    tools: [
      { name: "Tesseract", logo: "tesseract", color: "#A3E635" },
      { name: "pdfplumber", logo: "pdfplumber", color: "#F43F5E" },
      { name: "openpyxl", logo: "openpyxl", color: "#22C55E" },
      { name: "Parquet", logo: "parquet", color: "#06B6D4" },
      { name: "Tableau", logo: "tableau", color: "#F59E0B" },
      { name: "Pydantic", logo: "pydantic", color: "#E92063" },
    ],
  },
  {
    title: "ML / Retrieval",
    code: "ML",
    subtitle: "Matching, embeddings, and fine-tuning",
    tools: [
      { name: "DistilBERT", logo: "distilbert", color: "#F59E0B" },
      { name: "sentence-transformers", logo: "sentence", color: "#14B8A6" },
      { name: "TensorFlow", logo: "tensorflow", color: "#FF6F00" },
      { name: "pgvector", logo: "pgvector", color: "#4169E1" },
      { name: "LoRA", logo: "lora", color: "#C084FC" },
      { name: "NASA APIs", logo: "nasa", color: "#38BDF8" },
    ],
  },
  {
    title: "Mobile / Edge",
    code: "EDGE",
    subtitle: "Offline Android and on-device inference",
    tools: [
      { name: "Kotlin", logo: "kotlin", color: "#A855F7" },
      { name: "Jetpack Compose", logo: "compose", color: "#3DDC84" },
      { name: "ExecuTorch", logo: "executorch", color: "#EE4C2C" },
      { name: "QNN", logo: "qnn", color: "#22D3EE" },
      { name: "Android", logo: "android", color: "#3DDC84" },
      { name: "Expo", logo: "expo", color: "#8B5CF6" },
    ],
  },
  {
    title: "Frontend",
    code: "UI",
    subtitle: "Interfaces, motion, and product polish",
    tools: [
      { name: "Next.js", logo: "next", color: "#f3edf8" },
      { name: "React", logo: "react", color: "#61DAFB" },
      { name: "TypeScript", logo: "typescript", color: "#3178C6" },
      { name: "Tailwind", logo: "tailwind", color: "#38BDF8" },
      { name: "Framer Motion", logo: "framer", color: "#EC4899" },
      { name: "Expo", logo: "expo", color: "#8B5CF6" },
    ],
  },
  {
    title: "Backend / Infra",
    code: "SYS",
    subtitle: "Systems that ship and stay up",
    tools: [
      { name: "FastAPI", logo: "fastapi", color: "#10B981" },
      { name: "Postgres", logo: "postgres", color: "#4169E1" },
      { name: "Supabase", logo: "supabase", color: "#3ECF8E" },
      { name: "Docker", logo: "docker", color: "#2496ED" },
      { name: "AWS", logo: "aws", color: "#FF9900" },
      { name: "Vercel", logo: "vercel", color: "#A1A1AA" },
    ],
  },
]

/* -------------------------------- geometry ------------------------------- */

const SIZE = 900
const VB_PAD = 36
const VB_SIZE = SIZE + VB_PAD * 2
const C = SIZE / 2
const R_CAT = 268
const TOOL_ORBIT = 88
const GRAPH_SPIN_DURATION = 60 // seconds per full orbit (disabled when reduced motion)

const GraphSpinContext = createContext<MotionValue<number> | null>(null)

function RotatingGraphLayer({
  active,
  children,
}: {
  active: boolean
  children: React.ReactNode
}) {
  const spin = useMotionValue(0)

  useEffect(() => {
    if (!active) {
      spin.set(0)
      return
    }
    const controls = animate(spin, 360, {
      duration: GRAPH_SPIN_DURATION,
      repeat: Infinity,
      ease: "linear",
    })
    return () => controls.stop()
  }, [active, spin])

  return (
    <GraphSpinContext.Provider value={spin}>
      <motion.div
        className="absolute inset-0"
        style={{ rotate: spin, transformOrigin: "center center" }}
      >
        {children}
      </motion.div>
    </GraphSpinContext.Provider>
  )
}

function useUprightRotate(active: boolean) {
  const spin = useContext(GraphSpinContext)!
  return useTransform(spin, (r) => (active ? -r : 0))
}

function r3(v: number) {
  return Math.round(v * 1000) / 1000
}

function polar(radius: number, degrees: number) {
  const rad = (degrees * Math.PI) / 180
  return { x: r3(C + Math.cos(rad) * radius), y: r3(C + Math.sin(rad) * radius) }
}

/**
 * Full mini-orbit per category — same formula as original OrbitDiagram,
 * rotated so index 0 sits on the outward pole (away from AI core).
 */
function toolPosition(catAngleDeg: number, ti: number, n: number) {
  const catRad = (catAngleDeg * Math.PI) / 180
  const hub = polar(R_CAT, catAngleDeg)
  const localDeg = (360 / n) * ti - 90
  const localRad = (localDeg * Math.PI) / 180
  const rot = catRad + Math.PI / 2

  const lx = TOOL_ORBIT * Math.cos(localRad)
  const ly = TOOL_ORBIT * Math.sin(localRad)
  return {
    x: r3(hub.x + lx * Math.cos(rot) - ly * Math.sin(rot)),
    y: r3(hub.y + lx * Math.sin(rot) + ly * Math.cos(rot)),
  }
}

function useGraphScale(ref: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      // Must match SVG viewBox width so HTML nodes sit on SVG line endpoints
      setScale(el.getBoundingClientRect().width / VB_SIZE)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [ref])

  return scale
}

function nodeOffset(x: number, y: number, scale: number) {
  return { x: (x - C) * scale, y: (y - C) * scale }
}

interface TechNode extends OrbitTool {
  ci: number
  ti: number
  x: number
  y: number
  order: number
}

interface CatNode {
  ci: number
  code: string
  title: string
  subtitle: string
  angle: number
  x: number
  y: number
  order: number
  tools: TechNode[]
}

function useGraph() {
  return useMemo(() => {
    const numCats = orbitGroups.length
    let order = 1

    const cats: CatNode[] = orbitGroups.map((group, ci) => {
      const angle = -90 + ci * (360 / numCats)
      const cp = polar(R_CAT, angle)
      const n = group.tools.length
      const tools: TechNode[] = group.tools.map((tool, ti) => {
        const tp = toolPosition(angle, ti, n)
        return { ...tool, ci, ti, x: tp.x, y: tp.y, order: 0 }
      })
      return {
        ci,
        code: group.code,
        title: group.title,
        subtitle: group.subtitle,
        angle,
        x: cp.x,
        y: cp.y,
        order: 0,
        tools,
      }
    })

    // Build order: reveal all six categories first, then grow each branch's tools
    for (const cat of cats) {
      cat.order = order++
    }
    for (const cat of cats) {
      for (const tool of cat.tools) {
        tool.order = order++
      }
    }

    return { cats, total: order }
  }, [])
}

/* ------------------------------- animation ------------------------------- */

const STEP = 110
const TRAVEL = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }

/**
 * Builds the graph once: count climbs from 0 to total, then stays.
 * Returns the count plus a replay() that restarts the sequence.
 */
function useBuildSequence(total: number, reducedMotion: boolean) {
  const [count, setCount] = useState(reducedMotion ? total : 0)
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (reducedMotion) {
      setCount(total)
      return
    }
    setCount(0)
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      setCount((prev) => {
        if (prev >= total) return prev
        timer = setTimeout(tick, STEP)
        return prev + 1
      })
    }

    timer = setTimeout(tick, 400)
    return () => clearTimeout(timer)
  }, [total, reducedMotion, runId])

  const replay = () => setRunId((id) => id + 1)
  const complete = count >= total

  return { count, complete, replay }
}

/* -------------------------------- SVG layer ------------------------------ */

function EdgePath({
  x1, y1, x2, y2, stroke, strokeWidth, shown, active,
}: {
  x1: number; y1: number; x2: number; y2: number
  stroke: string; strokeWidth: number
  shown: boolean; active: boolean
}) {
  return (
    <motion.path
      d={`M ${x1},${y1} L ${x2},${y2}`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      pointerEvents="none"
      initial={false}
      animate={{
        pathLength: shown ? 1 : 0,
        opacity: shown ? (active ? 0.28 : 0.05) : 0,
      }}
      transition={TRAVEL}
    />
  )
}

/** Animated dashed radiance layered on top of settled edges (from original orbit cards). */
function RadiatingEdge({
  x1, y1, x2, y2, color, index, visible, reducedMotion,
}: {
  x1: number; y1: number; x2: number; y2: number
  color: string; index: number; visible: boolean; reducedMotion: boolean
}) {
  if (!visible) return null
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color}
      strokeWidth={1.2}
      strokeDasharray="4 7"
      opacity={0.36}
      pointerEvents="none"
    >
      {!reducedMotion && (
        <>
          <animate
            attributeName="stroke-dashoffset"
            values="0;-44"
            dur={`${2.6 + index * 0.18}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.18;0.58;0.18"
            dur="2.4s"
            begin={`${index * 0.18}s`}
            repeatCount="indefinite"
          />
        </>
      )}
    </line>
  )
}

/** Pulsing halo ring around category nodes. */
function CategoryNodeHalo({
  x, y, color, index, visible, reducedMotion,
}: {
  x: number; y: number; color: string; index: number
  visible: boolean; reducedMotion: boolean
}) {
  if (!visible) return null
  return (
    <circle
      cx={x} cy={y} r={30}
      fill="none"
      stroke={color}
      strokeWidth={1}
      opacity={0.3}
      pointerEvents="none"
    >
      {!reducedMotion && (
        <>
          <animate
            attributeName="r"
            values="27;33;27"
            dur="2.8s"
            begin={`${index * 0.22}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.18;0.45;0.18"
            dur="2.8s"
            begin={`${index * 0.22}s`}
            repeatCount="indefinite"
          />
        </>
      )}
    </circle>
  )
}

/** Pulsing halo ring around each tech node (from original orbit cards). */
function TechNodeHalo({
  x, y, color, index, visible, reducedMotion,
}: {
  x: number; y: number; color: string; index: number
  visible: boolean; reducedMotion: boolean
}) {
  if (!visible) return null
  return (
    <circle
      cx={x} cy={y} r={21}
      fill="none"
      stroke={color}
      strokeWidth={1}
      opacity={0.36}
      pointerEvents="none"
    >
      {!reducedMotion && (
        <>
          <animate
            attributeName="r"
            values="19;25;19"
            dur="2.6s"
            begin={`${index * 0.16}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.22;0.5;0.22"
            dur="2.6s"
            begin={`${index * 0.16}s`}
            repeatCount="indefinite"
          />
        </>
      )}
    </circle>
  )
}

function FlowParticle({
  x1, y1, x2, y2, color, delay,
}: {
  x1: number; y1: number; x2: number; y2: number
  color: string; delay: number
}) {
  return (
    <circle r={2.4} fill={color} pointerEvents="none">
      <animateMotion
        dur="2.2s"
        repeatCount="indefinite"
        begin={`${delay}s`}
        path={`M ${x1},${y1} L ${x2},${y2}`}
      />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        dur="2.2s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  )
}

function CoreHub({ accent, reducedMotion }: { accent: string; reducedMotion: boolean }) {
  return (
    <g transform={`translate(${C},${C})`} pointerEvents="none">
      {!reducedMotion && (
        <>
          <circle r={40} fill="none" stroke={accent} strokeWidth={1} strokeDasharray="3 8" opacity={0.5}>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="24s" repeatCount="indefinite" />
          </circle>
          <circle r={30} fill="none" stroke="var(--text-primary)" strokeWidth={0.8} strokeDasharray="2 10" opacity={0.35}>
            <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="18s" repeatCount="indefinite" />
          </circle>
          {/* dual expanding pulse rings — from original orbit cards */}
          <circle r={34} fill="none" stroke={accent} strokeWidth={1} opacity={0}>
            <animate attributeName="r" values="34;96" dur="3.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.34;0" dur="3.4s" repeatCount="indefinite" />
          </circle>
          <circle r={26} fill="none" stroke="var(--text-primary)" strokeWidth={1} opacity={0}>
            <animate attributeName="r" values="26;80" dur="3.4s" begin="1.25s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0" dur="3.4s" begin="1.25s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      <circle
        r={52}
        fill="var(--bg-elevated)"
        stroke={accent}
        strokeWidth={1.6}
        style={{ filter: `drop-shadow(0 0 26px ${accent}55)` }}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        y={-4}
        style={{ fill: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, letterSpacing: "0.06em" }}
      >
        AI
      </text>
      <text
        textAnchor="middle"
        dominantBaseline="central"
        y={16}
        style={{ fill: "var(--text-muted)", fontFamily: "var(--font-mono-theme)", fontSize: 7.5, letterSpacing: "0.28em" }}
      >
        CORE
      </text>
    </g>
  )
}

/* ------------------------------ HTML nodes ------------------------------- */

function TechNodeButton({
  node, shown, opacity, hovered, scale, keepUpright, onEnter, onLeave,
}: {
  node: TechNode; shown: boolean; opacity: number
  hovered: boolean; scale: number; keepUpright: boolean
  onEnter: () => void; onLeave: () => void
}) {
  const pos = nodeOffset(node.x, node.y, scale)
  const upright = useUprightRotate(keepUpright)

  return (
    <motion.button
      type="button"
      aria-label={node.name}
      title={node.name}
      className="absolute left-1/2 top-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        translateX: "-50%",
        translateY: "-50%",
        rotate: upright,
        borderColor: node.color,
        backgroundColor: "color-mix(in srgb, var(--bg-elevated) 86%, transparent)",
        boxShadow: hovered
          ? `0 0 0 1px ${node.color}, 0 0 20px ${node.color}66`
          : `0 0 0 1px ${node.color}24, 0 0 16px ${node.color}18`,
        pointerEvents: shown ? "auto" : "none",
      }}
      initial={false}
      animate={{
        x: shown ? pos.x : 0,
        y: shown ? pos.y : 0,
        scale: shown ? (hovered ? 1.18 : 1) : 0,
        opacity: shown ? opacity : 0,
      }}
      transition={TRAVEL}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <span className="flex h-6 w-6 items-center justify-center">
        <TechLogo logo={node.logo} color={node.color} />
      </span>
      {hovered && (
        <span
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em]"
          style={{
            borderColor: node.color,
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono-theme)",
          }}
        >
          {node.name}
        </span>
      )}
    </motion.button>
  )
}

function CategoryNodeButton({
  node, shown, opacity, hovered, accent, scale, keepUpright, onEnter, onLeave,
}: {
  node: CatNode; shown: boolean; opacity: number
  hovered: boolean; accent: string; scale: number; keepUpright: boolean
  onEnter: () => void; onLeave: () => void
}) {
  const pos = nodeOffset(node.x, node.y, scale)
  const upright = useUprightRotate(keepUpright)

  return (
    <motion.button
      type="button"
      aria-label={node.title}
      title={node.title}
      className="absolute left-1/2 top-1/2 z-20 flex h-[54px] w-[54px] items-center justify-center rounded-full border text-xs font-bold uppercase tracking-[0.08em] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        translateX: "-50%",
        translateY: "-50%",
        rotate: upright,
        borderColor: accent,
        backgroundColor: "var(--bg-elevated)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-mono-theme)",
        boxShadow: hovered ? `0 0 20px ${accent}66` : `0 0 12px ${accent}22`,
        pointerEvents: shown ? "auto" : "none",
      }}
      initial={false}
      animate={{
        x: shown ? pos.x : 0,
        y: shown ? pos.y : 0,
        scale: shown ? (hovered ? 1.1 : 1) : 0,
        opacity: shown ? opacity : 0,
      }}
      transition={TRAVEL}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      {node.code}
    </motion.button>
  )
}

/* ------------------------------- accent hook ----------------------------- */

const ACCENT_DEFAULTS: Record<"arthur" | "atie", string> = {
  arthur: "#c9a961",
  atie: "#a855f7",
}

function useAccentColor(theme: "arthur" | "atie"): string {
  const [accent, setAccent] = useState(ACCENT_DEFAULTS[theme])

  useEffect(() => {
    setAccent(ACCENT_DEFAULTS[theme])
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()
    if (raw && !raw.startsWith("oklch")) setAccent(raw)
  }, [theme])

  return accent
}

/* ------------------------------ main export ------------------------------ */

export function TechStack() {
  const { theme } = useTheme()
  const reducedMotion = Boolean(useReducedMotion())
  const { cats, total } = useGraph()
  const { count, complete, replay } = useBuildSequence(total, reducedMotion)
  const accent = useAccentColor(theme)
  const [hover, setHovered] = useState<{ ci: number; ti: number | null } | null>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const graphScale = useGraphScale(graphRef)

  const DIM = 0.14
  const keepUpright = !reducedMotion
  const catActive = (ci: number) => hover === null || hover.ci === ci
  const techActive = (ci: number, ti: number) =>
    hover === null || (hover.ci === ci && (hover.ti === null || hover.ti === ti))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="theme-card relative h-full overflow-hidden p-6 md:p-8"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          opacity: 0.16,
          maskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
        }}
      >
        <AnimatedWave />
      </div>

      <div className="relative z-10 mb-6">
        <p className="section-label mb-2">{theme === "arthur" ? "CHAPTER 0 — TOOLING" : "STACK MAP"}</p>
        <h3 className="font-display text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          <ScrambleTextOnHover text="Tech Stack" as="span" durationMs={190} />
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          One living AI ecosystem. The core grows branches into six domains, and each domain inserts its tools
          one node at a time — hover any node to trace its branch.
        </p>
      </div>

      <div
        ref={graphRef}
        className="relative z-10 mx-auto aspect-square w-full max-w-[880px]"
        onMouseLeave={() => setHovered(null)}
      >
        <RotatingGraphLayer active={keepUpright}>
          <svg
            viewBox={`${-VB_PAD} ${-VB_PAD} ${VB_SIZE} ${VB_SIZE}`}
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <circle cx={C} cy={C} r={R_CAT} fill="none" stroke="var(--border-faint)" strokeWidth={1} opacity={0.45} />
            <circle cx={C} cy={C} r={R_CAT + TOOL_ORBIT} fill="none" stroke="var(--border-faint)" strokeWidth={1} opacity={0.28} />
            <circle cx={C} cy={C} r={R_CAT + TOOL_ORBIT + 24} fill="none" stroke="var(--border-faint)" strokeWidth={1} opacity={0.14} />

            {cats.map((cat) => (
              <circle
                key={`orbit-${cat.ci}`}
                cx={cat.x}
                cy={cat.y}
                r={TOOL_ORBIT}
                fill="none"
                stroke="var(--border-faint)"
                strokeWidth={1}
                opacity={cat.order < count ? 0.22 : 0}
                pointerEvents="none"
              />
            ))}

            {cats.map((cat) => (
              <EdgePath
                key={`edge-cat-${cat.ci}`}
                x1={C} y1={C} x2={cat.x} y2={cat.y}
                stroke={accent}
                strokeWidth={1.4}
                shown={cat.order < count}
                active={catActive(cat.ci)}
              />
            ))}

            {cats.map((cat) =>
              cat.tools.map((tool) => (
                <EdgePath
                  key={`edge-tech-${cat.ci}-${tool.ti}`}
                  x1={cat.x} y1={cat.y} x2={tool.x} y2={tool.y}
                  stroke={tool.color}
                  strokeWidth={1.2}
                  shown={tool.order < count}
                  active={techActive(tool.ci, tool.ti)}
                />
              )),
            )}

            {cats.map((cat) => (
              <RadiatingEdge
                key={`rad-cat-${cat.ci}`}
                x1={C} y1={C} x2={cat.x} y2={cat.y}
                color={accent}
                index={cat.ci}
                visible={cat.order < count && catActive(cat.ci)}
                reducedMotion={reducedMotion}
              />
            ))}

            {cats.map((cat) =>
              cat.tools.map((tool) => (
                <RadiatingEdge
                  key={`rad-tech-${cat.ci}-${tool.ti}`}
                  x1={cat.x} y1={cat.y} x2={tool.x} y2={tool.y}
                  color={tool.color}
                  index={tool.ti + cat.ci * 2}
                  visible={tool.order < count && techActive(tool.ci, tool.ti)}
                  reducedMotion={reducedMotion}
                />
              )),
            )}

            {cats.map((cat) => (
              <CategoryNodeHalo
                key={`halo-cat-${cat.ci}`}
                x={cat.x} y={cat.y}
                color={accent}
                index={cat.ci}
                visible={cat.order < count && catActive(cat.ci)}
                reducedMotion={reducedMotion}
              />
            ))}

            {cats.map((cat) =>
              cat.tools.map((tool) => (
                <TechNodeHalo
                  key={`halo-${cat.ci}-${tool.ti}`}
                  x={tool.x} y={tool.y}
                  color={tool.color}
                  index={tool.ti + cat.ci * 3}
                  visible={tool.order < count && techActive(tool.ci, tool.ti)}
                  reducedMotion={reducedMotion}
                />
              )),
            )}

            {!reducedMotion &&
              cats.map((cat) => {
                if (cat.order >= count || !catActive(cat.ci)) return null
                return (
                  <FlowParticle
                    key={`flow-${cat.ci}`}
                    x1={C} y1={C} x2={cat.x} y2={cat.y}
                    color={accent}
                    delay={cat.ci * 0.28}
                  />
                )
              })}
          </svg>

          {cats.map((cat) => (
            <CategoryNodeButton
              key={`cat-${cat.ci}`}
              node={cat}
              accent={accent}
              scale={graphScale}
              keepUpright={keepUpright}
              shown={cat.order < count}
              opacity={catActive(cat.ci) ? 1 : DIM}
              hovered={hover?.ci === cat.ci && hover?.ti === null}
              onEnter={() => setHovered({ ci: cat.ci, ti: null })}
              onLeave={() => setHovered(null)}
            />
          ))}

          {cats.map((cat) =>
            cat.tools.map((tool) => (
              <TechNodeButton
                key={`tech-${cat.ci}-${tool.ti}`}
                node={tool}
                scale={graphScale}
                keepUpright={keepUpright}
                shown={tool.order < count}
                opacity={techActive(tool.ci, tool.ti) ? 1 : DIM}
                hovered={hover?.ci === tool.ci && hover?.ti === tool.ti}
                onEnter={() => setHovered({ ci: tool.ci, ti: tool.ti })}
                onLeave={() => setHovered(null)}
              />
            )),
          )}
        </RotatingGraphLayer>

        {/* AI core stays fixed while the ecosystem orbits */}
        <svg
          viewBox={`${-VB_PAD} ${-VB_PAD} ${VB_SIZE} ${VB_SIZE}`}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          role="img"
          aria-label="Technology ecosystem connections"
        >
          <CoreHub accent={accent} reducedMotion={reducedMotion} />
        </svg>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-2">
        {cats.map((cat) => {
          const active = catActive(cat.ci)
          return (
            <button
              key={`legend-${cat.ci}`}
              type="button"
              onMouseEnter={() => setHovered({ ci: cat.ci, ti: null })}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered({ ci: cat.ci, ti: null })}
              onBlur={() => setHovered(null)}
              className="theme-badge border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] transition-opacity"
              style={{
                borderColor: active ? "var(--accent)" : "var(--border-faint)",
                backgroundColor: "var(--bg-elevated)",
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                opacity: hover === null || active ? 1 : 0.4,
              }}
            >
              {cat.title}
            </button>
          )
        })}
        {!reducedMotion && (
          <button
            type="button"
            onClick={replay}
            disabled={!complete}
            className="theme-badge border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] transition-opacity disabled:opacity-40"
            style={{
              borderColor: "var(--accent)",
              backgroundColor: "var(--accent-soft)",
              color: "var(--text-primary)",
            }}
            aria-label="Replay build animation"
          >
            ↻ Replay
          </button>
        )}
      </div>
    </motion.div>
  )
}
