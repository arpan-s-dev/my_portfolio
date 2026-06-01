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
  primaryTextColor: "#ffffff",
  primaryBorderColor: "#a855f7",
  secondaryColor: "#0a0a0a",
  secondaryTextColor: "#ffffff",
  secondaryBorderColor: "#262626",
  tertiaryColor: "#0a0a0a",
  tertiaryTextColor: "#ffffff",
  tertiaryBorderColor: "#262626",
  lineColor: "#06b6d4",
  textColor: "#ffffff",
  mainBkg: "#1a1a1a",
  nodeBorder: "#a855f7",
  clusterBkg: "#0a0a0a",
  clusterBorder: "#a855f7",
  edgeLabelBackground: "#141414",
  noteBkgColor: "#1a1a1a",
  noteTextColor: "#ffffff",
  noteBorderColor: "#a855f7",
  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace",
  fontSize: "14px",
}

interface MermaidDiagramProps {
  chart: string
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
          setSvg(rendered)
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
      className="w-full overflow-x-auto p-4 [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto [&_svg]:block"
      // Diagram is trusted, statically defined source — safe to inject as HTML.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
