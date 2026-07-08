"use client"

import { useTheme } from "@/components/theme-provider"

function GridBg({ c }: { c: string }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(${c}0b 1px, transparent 1px), linear-gradient(90deg, ${c}0b 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    />
  )
}

function FadeEdge() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-8 pointer-events-none"
      style={{ background: "linear-gradient(to bottom, transparent, var(--bg-card))" }}
    />
  )
}

// ── 1. Unified Load Board — routing hub ────────────────────────────────
export function LoadBoardVisual() {
  const { theme } = useTheme()
  const c = theme === "arthur" ? "#c9a961" : "#a855f7"
  const nodes = [
    { label: "DAT", x: 52, y: 44 },
    { label: "Truckstop", x: 52, y: 100 },
    { label: "Relay", x: 228, y: 44 },
    { label: "Next.js", x: 228, y: 100 },
  ]
  const durs = ["1.2s", "1.7s", "1.4s", "1.9s"]
  return (
    <div className="relative w-full h-36 overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
      <GridBg c={c} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 144" aria-hidden="true">
        {nodes.map((n, i) => (
          <line key={i} x1={n.x} y1={n.y} x2="140" y2="72"
            stroke={c} strokeWidth="0.75" opacity="0.22" strokeDasharray="3 4" />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} r="2.5" fill={c}>
            <animate attributeName="cx" values={`${n.x};140;${n.x}`} dur={durs[i]} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${n.y};72;${n.y}`} dur={durs[i]} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.9;0" dur={durs[i]} repeatCount="indefinite" />
          </circle>
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <rect x={n.x - 26} y={n.y - 12} width="52" height="22" rx="3"
              fill={`${c}14`} stroke={c} strokeWidth="0.75" opacity="0.8" />
            <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
              fill={c} fontSize="7.5" fontFamily="monospace">{n.label}</text>
          </g>
        ))}
        <rect x="109" y="58" width="62" height="28" rx="5" fill={`${c}20`} stroke={c} strokeWidth="1.5" />
        <text x="140" y="74" textAnchor="middle" dominantBaseline="middle"
          fill={c} fontSize="11" fontFamily="monospace" fontWeight="bold">ULB</text>
        <circle cx="140" cy="72" r="26" fill="none" stroke={c} strokeWidth="0.75">
          <animate attributeName="r" values="26;40;26" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="2.6s" repeatCount="indefinite" />
        </circle>
      </svg>
      <FadeEdge />
    </div>
  )
}

// ── 2. Freight Doc Matcher — cross-encoder matching ────────────────────
export function FreightDocMatcherVisual() {
  const { theme } = useTheme()
  const c = theme === "arthur" ? "#c9a961" : "#a855f7"
  const lines = [28, 40, 52, 64, 76, 88, 100]
  return (
    <div className="relative w-full h-36 overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
      <GridBg c={c} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 144" aria-hidden="true">
        {/* BOL document */}
        <rect x="18" y="18" width="72" height="100" rx="4" fill={`${c}10`} stroke={c} strokeWidth="0.9" opacity="0.8" />
        <text x="54" y="33" textAnchor="middle" fill={c} fontSize="8.5" fontFamily="monospace">BOL</text>
        {lines.map((y, i) => (
          <rect key={i} x="26" y={y + 14} width={i % 3 === 0 ? 48 : 36} height="4" rx="1" fill={c} opacity="0.2" />
        ))}
        {/* RC document */}
        <rect x="190" y="18" width="72" height="100" rx="4" fill={`${c}10`} stroke={c} strokeWidth="0.9" opacity="0.8" />
        <text x="226" y="33" textAnchor="middle" fill={c} fontSize="8.5" fontFamily="monospace">RC</text>
        {lines.map((y, i) => (
          <rect key={i} x="198" y={y + 14} width={i % 2 === 0 ? 50 : 38} height="4" rx="1" fill={c} opacity="0.2" />
        ))}
        {/* Match connection */}
        <line x1="90" y1="72" x2="190" y2="72" stroke={c} strokeWidth="1" strokeDasharray="5 3">
          <animate attributeName="opacity" values="0.15;0.65;0.15" dur="2s" repeatCount="indefinite" />
        </line>
        {/* Score badge */}
        <rect x="112" y="58" width="56" height="28" rx="5" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
        <text x="140" y="69" textAnchor="middle" fill={c} fontSize="7" fontFamily="monospace">F1 Score</text>
        <text x="140" y="81" textAnchor="middle" fill={c} fontSize="12" fontFamily="monospace" fontWeight="bold">0.87</text>
        {/* Pulse dot on match line */}
        <circle r="3" fill={c}>
          <animate attributeName="cx" values="90;190;90" dur="2s" repeatCount="indefinite" />
          <animate attributeName="cy" values="72;72;72" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.85;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="140" y="135" textAnchor="middle" fill={c} fontSize="6.5" fontFamily="monospace" opacity="0.5">
          DistilBERT · Cross-Encoder
        </text>
      </svg>
      <FadeEdge />
    </div>
  )
}

// ── 3. POD_RC_AUTO_OCR — document scanner ──────────────────────────────
export function OCRVisual() {
  const { theme } = useTheme()
  const c = theme === "arthur" ? "#c9a961" : "#a855f7"
  const textLines = [26, 38, 50, 62, 74, 86, 98, 110]
  return (
    <div className="relative w-full h-36 overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
      <GridBg c={c} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 144" aria-hidden="true">
        {/* Document */}
        <rect x="68" y="8" width="144" height="118" rx="4" fill={`${c}0e`} stroke={c} strokeWidth="0.75" opacity="0.7" />
        {/* Corner fold */}
        <polyline points="192,8 212,8 212,28" fill="none" stroke={c} strokeWidth="0.75" opacity="0.4" />
        {/* Text lines */}
        {textLines.map((y, i) => (
          <rect key={i} x="78" y={y} width={i % 3 === 0 ? 110 : i % 2 === 0 ? 88 : 70} height="5" rx="2" fill={c} opacity="0.17" />
        ))}
        {/* Scanning beam (sweeps from top to bottom of doc) */}
        <rect x="68" y="8" width="144" height="9" rx="2" fill={c} opacity="0.18">
          <animateTransform attributeName="transform" type="translate" values="0,0;0,109;0,0" dur="2.3s" repeatCount="indefinite" />
        </rect>
        <line x1="68" y1="12.5" x2="212" y2="12.5" stroke={c} strokeWidth="1.5" opacity="0.7">
          <animateTransform attributeName="transform" type="translate" values="0,0;0,109;0,0" dur="2.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.3s" repeatCount="indefinite" />
        </line>
        {/* Side labels */}
        <text x="36" y="60" textAnchor="middle" fill={c} fontSize="7" fontFamily="monospace" opacity="0.55">TESS</text>
        <text x="36" y="72" textAnchor="middle" fill={c} fontSize="7" fontFamily="monospace" opacity="0.55">OCR</text>
        <text x="244" y="60" textAnchor="middle" fill={c} fontSize="7" fontFamily="monospace" opacity="0.55">Claude</text>
        <text x="244" y="72" textAnchor="middle" fill={c} fontSize="7" fontFamily="monospace" opacity="0.55">API</text>
        <text x="140" y="136" textAnchor="middle" fill={c} fontSize="6.5" fontFamily="monospace" opacity="0.5">
          Tesseract + Claude · Excel Output
        </text>
      </svg>
      <FadeEdge />
    </div>
  )
}

// ── 4. Lodestar — offline navigation ──────────────────────────────────
export function LodestarVisual() {
  const { theme } = useTheme()
  const c = theme === "arthur" ? "#c9a961" : "#a855f7"
  const stars = [[28,18],[72,30],[220,14],[248,42],[55,118],[202,108],[258,78],[22,82],[160,20]]
  return (
    <div className="relative w-full h-36 overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
      <GridBg c={c} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 144" aria-hidden="true">
        {/* Stars */}
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 1.5 : 1} fill={c} opacity="0.45">
            <animate attributeName="opacity" values="0.2;0.75;0.2" dur={`${1.4 + i * 0.28}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* Outer drift rings */}
        <circle cx="140" cy="72" r="56" fill="none" stroke={c} strokeWidth="0.4" opacity="0.15" strokeDasharray="3 6" />
        <circle cx="140" cy="72" r="42" fill="none" stroke={c} strokeWidth="0.4" opacity="0.2" strokeDasharray="2 5" />
        {/* Compass face */}
        <circle cx="140" cy="72" r="30" fill={`${c}0e`} stroke={c} strokeWidth="1.2" opacity="0.9" />
        <text x="140" y="44" textAnchor="middle" fill={c} fontSize="8" fontFamily="monospace" opacity="0.85">N</text>
        <text x="140" y="104" textAnchor="middle" fill={c} fontSize="8" fontFamily="monospace" opacity="0.85">S</text>
        <text x="110" y="75" textAnchor="middle" fill={c} fontSize="8" fontFamily="monospace" opacity="0.85">W</text>
        <text x="170" y="75" textAnchor="middle" fill={c} fontSize="8" fontFamily="monospace" opacity="0.85">E</text>
        {/* Tick marks */}
        {[0,45,90,135,180,225,270,315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180
          const x1 = 140 + 28 * Math.cos(rad - Math.PI/2)
          const y1 = 72 + 28 * Math.sin(rad - Math.PI/2)
          const x2 = 140 + 23 * Math.cos(rad - Math.PI/2)
          const y2 = 72 + 23 * Math.sin(rad - Math.PI/2)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth="0.75" opacity="0.4" />
        })}
        {/* Rotating needle */}
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 140 72;360 140 72" dur="9s" repeatCount="indefinite" />
          <line x1="140" y1="72" x2="140" y2="48" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.95" />
          <line x1="140" y1="72" x2="140" y2="90" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        </g>
        <circle cx="140" cy="72" r="3.5" fill={c} />
        {/* OFFLINE badge */}
        <rect x="8" y="8" width="56" height="17" rx="3" fill={`${c}1e`} stroke={c} strokeWidth="0.75" />
        <text x="36" y="19.5" textAnchor="middle" fill={c} fontSize="7.5" fontFamily="monospace">OFFLINE</text>
        {/* Snapdragon chip badge */}
        <rect x="216" y="8" width="56" height="17" rx="3" fill={`${c}1e`} stroke={c} strokeWidth="0.75" />
        <text x="244" y="19.5" textAnchor="middle" fill={c} fontSize="7.5" fontFamily="monospace">Snapdragon</text>
      </svg>
      <FadeEdge />
    </div>
  )
}

// ── 5. FreightField AI — agentic pipeline ─────────────────────────────
export function FreightFieldVisual() {
  const { theme } = useTheme()
  const c = theme === "arthur" ? "#c9a961" : "#a855f7"
  const boxes = [
    { label: "User", x: 14, w: 52 },
    { label: "Agent", x: 88, w: 52 },
    { label: "Tools", x: 162, w: 52 },
    { label: "Answer", x: 236, w: 54 },
  ]
  const arrows = [[66, 88], [140, 162], [214, 236]]
  const durs = ["1.0s", "1.0s", "1.0s"]
  const delays = ["0s", "0.33s", "0.66s"]
  return (
    <div className="relative w-full h-36 overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
      <GridBg c={c} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 304 144" aria-hidden="true">
        {boxes.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y="56" width={b.w} height="32" rx="4" fill={`${c}18`} stroke={c} strokeWidth="1" opacity="0.85" />
            <text x={b.x + b.w / 2} y="74" textAnchor="middle" dominantBaseline="middle" fill={c} fontSize="8.5" fontFamily="monospace">{b.label}</text>
          </g>
        ))}
        {arrows.map(([x1, x2], i) => (
          <g key={i}>
            <line x1={x1} y1="72" x2={x2} y2="72" stroke={c} strokeWidth="0.75" opacity="0.25" />
            <polygon points={`${x2},69 ${x2 + 6},72 ${x2},75`} fill={c} opacity="0.55" />
            <circle r="2.5" fill={c}>
              <animate attributeName="cx" values={`${x1};${x2};${x2}`} dur={durs[i]} begin={delays[i]} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.9;0" dur={durs[i]} begin={delays[i]} repeatCount="indefinite" />
              <animate attributeName="cy" values="72;72;72" dur={durs[i]} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        {/* Return loop arc */}
        <path d="M 263 88 Q 152 120 40 88" fill="none" stroke={c} strokeWidth="0.6" opacity="0.18" strokeDasharray="4 4" />
        <circle r="2" fill={c} opacity="0.5">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 263 88 Q 152 120 40 88" />
        </circle>
        <text x="152" y="136" textAnchor="middle" fill={c} fontSize="6.5" fontFamily="monospace" opacity="0.5">
          LangGraph · Claude API · FastAPI
        </text>
      </svg>
      <FadeEdge />
    </div>
  )
}

// ── 6. Space Project — satellite + ML ─────────────────────────────────
export function SpaceProjectVisual() {
  const { theme } = useTheme()
  const c = theme === "arthur" ? "#c9a961" : "#a855f7"
  const stars = [[18,15],[55,28],[82,9],[225,18],[252,40],[265,100],[26,108],[198,128],[108,124],[240,75]]
  return (
    <div className="relative w-full h-36 overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
      <GridBg c={c} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 144" aria-hidden="true">
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill={c} opacity="0.4">
            <animate attributeName="opacity" values="0.15;0.7;0.15" dur={`${1.6 + i * 0.22}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* Planet */}
        <circle cx="140" cy="72" r="24" fill={`${c}18`} stroke={c} strokeWidth="1.5" opacity="0.9" />
        {/* Planet ring */}
        <ellipse cx="140" cy="72" rx="38" ry="9" fill="none" stroke={c} strokeWidth="0.9" opacity="0.35" />
        {/* Orbit path */}
        <ellipse cx="140" cy="72" rx="62" ry="30" fill="none" stroke={c} strokeWidth="0.5" opacity="0.18" strokeDasharray="4 5" />
        {/* Orbiting satellite */}
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 140 72;360 140 72" dur="5s" repeatCount="indefinite" />
          {/* Satellite body */}
          <rect x="196" y="69" width="11" height="7" rx="1.5" fill={`${c}30`} stroke={c} strokeWidth="1" />
          {/* Solar panels */}
          <rect x="188" y="71" width="8" height="3" rx="0.5" fill="none" stroke={c} strokeWidth="0.75" opacity="0.8" />
          <rect x="207" y="71" width="8" height="3" rx="0.5" fill="none" stroke={c} strokeWidth="0.75" opacity="0.8" />
        </g>
        {/* U-Net label */}
        <text x="30" y="128" fill={c} fontSize="6.5" fontFamily="monospace" opacity="0.55">U-Net · Prithvi</text>
        <text x="170" y="128" fill={c} fontSize="6.5" fontFamily="monospace" opacity="0.55">Sen1Floods11</text>
      </svg>
      <FadeEdge />
    </div>
  )
}

// ── 7. RAG System — vector embedding search ────────────────────────────
export function RAGVisual() {
  const { theme } = useTheme()
  const c = theme === "arthur" ? "#c9a961" : "#a855f7"
  const dots = [
    { x: 82, y: 52, sz: 4, near: true },
    { x: 102, y: 82, sz: 3, near: true },
    { x: 68, y: 94, sz: 3.5, near: true },
    { x: 120, y: 66, sz: 2.5, near: false },
    { x: 92, y: 106, sz: 2.5, near: false },
    { x: 162, y: 48, sz: 3.5, near: false },
    { x: 178, y: 78, sz: 3, near: false },
    { x: 196, y: 54, sz: 2.5, near: false },
    { x: 212, y: 92, sz: 4, near: false },
    { x: 150, y: 98, sz: 3, near: false },
    { x: 220, y: 44, sz: 2.5, near: false },
    { x: 188, y: 112, sz: 2, near: false },
    { x: 56, y: 60, sz: 2, near: false },
  ]
  const qx = 92, qy = 76
  return (
    <div className="relative w-full h-36 overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
      <GridBg c={c} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 144" aria-hidden="true">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.sz} fill={c} opacity={d.near ? "0.85" : "0.22"} />
        ))}
        {dots.filter(d => d.near).map((d, i) => (
          <line key={i} x1={qx} y1={qy} x2={d.x} y2={d.y}
            stroke={c} strokeWidth="0.85" strokeDasharray="3 3">
            <animate attributeName="opacity" values="0.15;0.6;0.15" dur={`${1.4 + i * 0.35}s`} repeatCount="indefinite" />
          </line>
        ))}
        {/* Search pulse ring */}
        <circle cx={qx} cy={qy} r="28" fill="none" stroke={c} strokeWidth="0.75">
          <animate attributeName="r" values="18;32;18" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.05;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Query point */}
        <circle cx={qx} cy={qy} r="6" fill={`${c}28`} stroke={c} strokeWidth="1.5" />
        <text x={qx} y={qy + 0.5} textAnchor="middle" dominantBaseline="middle" fill={c} fontSize="6" fontFamily="monospace" fontWeight="bold">Q</text>
        {/* k=3 badge */}
        <rect x="186" y="8" width="36" height="18" rx="3" fill={`${c}20`} stroke={c} strokeWidth="0.75" />
        <text x="204" y="20" textAnchor="middle" fill={c} fontSize="8" fontFamily="monospace">k = 3</text>
        {/* Retrieval label */}
        <text x="140" y="136" textAnchor="middle" fill={c} fontSize="6.5" fontFamily="monospace" opacity="0.5">
          pgvector · Reranking · RAG
        </text>
      </svg>
      <FadeEdge />
    </div>
  )
}

// ── 8. Fine-Tuning Experiments — LoRA layers ───────────────────────────
export function FineTuningVisual() {
  const { theme } = useTheme()
  const c = theme === "arthur" ? "#c9a961" : "#a855f7"
  const cols = [44, 110, 170, 236]
  const rows = [32, 54, 76, 98, 118]
  return (
    <div className="relative w-full h-36 overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
      <GridBg c={c} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 144" aria-hidden="true">
        {/* Connections between all layers */}
        {cols.slice(0, -1).map((x, li) =>
          rows.map((y1) =>
            rows.map((y2) => (
              <line key={`${li}-${y1}-${y2}`} x1={x + 7} y1={y1} x2={cols[li + 1] - 7} y2={y2}
                stroke={c} strokeWidth="0.25" opacity="0.07" />
            ))
          )
        )}
        {/* Layer nodes */}
        {cols.map((x, li) =>
          rows.map((y, ri) => (
            <circle key={`${li}-${ri}`} cx={x} cy={y} r="6.5"
              fill={`${c}15`}
              stroke={c}
              strokeWidth={li === 1 || li === 2 ? "1.4" : "0.7"}
              opacity={li === 1 || li === 2 ? "0.9" : "0.45"} />
          ))
        )}
        {/* LoRA adapter box */}
        <rect x="118" y="52" width="44" height="40" rx="5"
          fill={`${c}22`} stroke={c} strokeWidth="1.8" />
        <text x="140" y="67" textAnchor="middle" fill={c} fontSize="7.5" fontFamily="monospace" fontWeight="bold">LoRA</text>
        <text x="140" y="79" textAnchor="middle" fill={c} fontSize="7" fontFamily="monospace">r = 8</text>
        <text x="140" y="89" textAnchor="middle" fill={c} fontSize="6.5" fontFamily="monospace" opacity="0.7">rank</text>
        {/* Particle flowing through LoRA */}
        <circle r="3" fill={c} opacity="0.85">
          <animate attributeName="cx" values="44;110;140;170;236" dur="2.2s" repeatCount="indefinite" calcMode="linear" />
          <animate attributeName="cy" values="76;76;76;76;76" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.9;1;0.9;0" dur="2.2s" repeatCount="indefinite" />
        </circle>
        {/* Labels */}
        <text x="44" y="134" textAnchor="middle" fill={c} fontSize="6" fontFamily="monospace" opacity="0.45">Input</text>
        <text x="236" y="134" textAnchor="middle" fill={c} fontSize="6" fontFamily="monospace" opacity="0.45">Output</text>
        <text x="140" y="136" textAnchor="middle" fill={c} fontSize="6.5" fontFamily="monospace" opacity="0.5">PyTorch · HuggingFace · LoRA</text>
      </svg>
      <FadeEdge />
    </div>
  )
}
