"use client"

import { useEffect, useId, useState } from "react"
import { useTheme } from "@/components/theme-provider"

/**
 * Maps the project's Arthur/Atie palettes (defined in app/globals.css)
 * onto Mermaid's themeVariables. Keep these in sync with the CSS vars
 * --bg-base / --bg-card / --bg-elevated / --text-primary / --text-muted
 * / --accent / --border-faint for each theme.
 */
const arthurThemeVars = {
  background: "#221a14",
  primaryColor: "#2a2018",
  primaryTextColor: "#e8dcc4",
  primaryBorderColor: "#c9a961",
  secondaryColor: "#1a1410",
  secondaryTextColor: "#e8dcc4",
  secondaryBorderColor: "#3a2e22",
  tertiaryColor: "#1a1410",
  tertiaryTextColor: "#e8dcc4",
  tertiaryBorderColor: "#3a2e22",
  lineColor: "#c9a961",
  textColor: "#e8dcc4",
  mainBkg: "#2a2018",
  nodeBorder: "#c9a961",
  clusterBkg: "#1a1410",
  clusterBorder: "#c9a961",
  edgeLabelBackground: "#221a14",
  noteBkgColor: "#2a2018",
  noteTextColor: "#e8dcc4",
  noteBorderColor: "#c9a961",
  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
  fontSize: "14px",
}

const atieThemeVars = {
  background: "#141414",
  primaryColor: "#1a1a1a",
  primaryTextColor: "#f3edf8",
  primaryBorderColor: "#a855f7",
  secondaryColor: "#0a0a0a",
  secondaryTextColor: "#f3edf8",
  secondaryBorderColor: "#262626",
  tertiaryColor: "#0a0a0a",
  tertiaryTextColor: "#f3edf8",
  tertiaryBorderColor: "#262626",
  lineColor: "#06b6d4",
  textColor: "#f3edf8",
  mainBkg: "#1a1a1a",
  nodeBorder: "#a855f7",
  clusterBkg: "#0a0a0a",
  clusterBorder: "#a855f7",
  edgeLabelBackground: "#141414",
  noteBkgColor: "#1a1a1a",
  noteTextColor: "#f3edf8",
  noteBorderColor: "#a855f7",
  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace",
  fontSize: "14px",
}

interface MermaidDiagramProps {
  chart: string
}

function getMermaidAnimationStyles(svgId: string) {
  const root = `#${svgId}`

  return `
<style>
@keyframes mermaidFlow {
  to { stroke-dashoffset: -72; }
}
@keyframes mermaidArrowPulse {
  0%, 100% { opacity: 0.62; transform: scale(0.92); }
  50% { opacity: 1; transform: scale(1.08); }
}
@keyframes mermaidNodePulse {
  0%, 100% { opacity: 0.88; }
  50% { opacity: 1; }
}
@keyframes mermaidLabelGlow {
  0%, 100% { opacity: 0.86; }
  50% { opacity: 1; }
}
${root} {
  overflow: visible;
}
${root} foreignObject {
  overflow: visible;
}
${root} text,
${root} tspan,
${root} .nodeLabel,
${root} .edgeLabel,
${root} .messageText,
${root} .loopText,
${root} .label {
  font-size: 12px;
  max-width: 220px;
  overflow-wrap: anywhere;
  word-break: break-word;
  white-space: normal;
  line-height: 1.25;
}
${root} .classGroup text {
  font-size: 11px;
}
${root} .edgeLabel,
${root} .messageText,
${root} .loopText {
  font-size: 11px;
  max-width: 180px;
}
${root} .edgePath path,
${root} path.flowchart-link,
${root} .relation,
${root} .messageLine0,
${root} .messageLine1,
${root} .loopLine {
  stroke-dasharray: 7 8 !important;
  stroke-dashoffset: 0;
  stroke-linecap: round !important;
  animation: mermaidFlow 1.05s linear infinite !important;
}
${root} marker path,
${root} .arrowheadPath,
${root} .marker {
  transform-box: fill-box;
  transform-origin: center;
  animation: mermaidArrowPulse 0.95s ease-in-out infinite !important;
}
${root} .node rect,
${root} .node polygon,
${root} .node circle,
${root} .node ellipse,
${root} .classGroup rect,
${root} .actor,
${root} .cluster rect,
${root} .note,
${root} .labelBox {
  animation: mermaidNodePulse 3s ease-in-out infinite !important;
}
${root} .edgeLabel,
${root} .messageText,
${root} .loopText,
${root} .label,
${root} .nodeLabel {
  animation: mermaidLabelGlow 2.6s ease-in-out infinite !important;
}
</style>`
}

function withAnimatedMermaidStyles(svg: string, svgId: string) {
  return svg.replace(/<svg\b([^>]*)>/, `<svg$1>${getMermaidAnimationStyles(svgId)}`)
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const { theme } = useTheme()
  const reactId = useId()
  // Mermaid requires DOM-safe ids (no colons from useId).
  const renderId = `mermaid-${reactId.replace(/[^a-zA-Z0-9-_]/g, "")}`

  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default

        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: theme === "arthur" ? arthurThemeVars : atieThemeVars,
          flowchart: {
            htmlLabels: true,
            curve: "basis",
            padding: 16,
            useMaxWidth: true,
          },
          securityLevel: "loose",
        })

        const { svg: rendered } = await mermaid.render(renderId, chart)
        if (!cancelled) {
          setSvg(withAnimatedMermaidStyles(rendered, renderId))
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err))
          setSvg("")
        }
      }
    }

    render()

    return () => {
      cancelled = true
    }
  }, [chart, theme, renderId])

  if (error) {
    return (
      <div
        className="p-4 text-xs font-mono"
        style={{ color: "var(--text-muted)" }}
      >
        Diagram failed to render: {error}
      </div>
    )
  }

  if (!svg) {
    return (
      <div
        className="flex items-center justify-center p-8 text-sm uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        Rendering diagram…
      </div>
    )
  }

  return (
    <div
      className="animated-mermaid-diagram w-full overflow-x-auto p-4 [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto [&_svg]:block"
      // Diagram is trusted, statically defined source — safe to inject as HTML.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
