export type LogoName =
  | "next"
  | "react"
  | "typescript"
  | "tailwind"
  | "framer"
  | "expo"
  | "python"
  | "pytorch"
  | "huggingface"
  | "claude"
  | "langgraph"
  | "duckdb"
  | "fastapi"
  | "postgres"
  | "supabase"
  | "docker"
  | "aws"
  | "vercel"
  | "pydantic"
  | "distilbert"
  | "sentence"
  | "parquet"
  | "tesseract"
  | "openpyxl"
  | "pdfplumber"
  | "kotlin"
  | "compose"
  | "executorch"
  | "qnn"
  | "android"
  | "tensorflow"
  | "nasa"
  | "pgvector"
  | "lora"
  | "tableau"

function WordmarkLogo({
  label,
  color,
  textSize = 7,
}: {
  label: string
  color: string
  textSize?: number
}) {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke={color} strokeWidth="1.7" />
      <text x="12" y="14.5" textAnchor="middle" style={{ fill: color, fontSize: textSize, fontWeight: 800 }}>
        {label}
      </text>
    </svg>
  )
}

export function TechLogo({ logo, color }: { logo: LogoName; color: string }) {
  switch (logo) {
    case "react":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <g fill="none" stroke={color} strokeWidth="1.5">
            <ellipse cx="12" cy="12" rx="9" ry="3.4" />
            <ellipse cx="12" cy="12" rx="9" ry="3.4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="9" ry="3.4" transform="rotate(120 12 12)" />
          </g>
          <circle cx="12" cy="12" r="2" fill={color} />
        </svg>
      )
    case "typescript":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" fill={color} />
          <text x="12" y="15.5" textAnchor="middle" fill="#f3edf8" className="text-[7px] font-bold">
            TS
          </text>
        </svg>
      )
    case "tailwind":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path
            d="M4 12c2.2-4.4 5.2-5.7 9-3.8 1.4.7 2.4 1.9 4.1 1.5 1.1-.3 2-1 2.9-2.1-2.2 4.4-5.2 5.7-9 3.8-1.4-.7-2.4-1.9-4.1-1.5C5.8 10.2 4.9 10.9 4 12Zm0 5c2.2-4.4 5.2-5.7 9-3.8 1.4.7 2.4 1.9 4.1 1.5 1.1-.3 2-1 2.9-2.1-2.2 4.4-5.2 5.7-9 3.8-1.4-.7-2.4-1.9-4.1-1.5C5.8 15.2 4.9 15.9 4 17Z"
            fill={color}
          />
        </svg>
      )
    case "framer":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path d="M6 3h12v6H6V3Zm0 6h12l-6 6H6V9Zm0 6h6v6l-6-6Z" fill={color} />
        </svg>
      )
    case "expo":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path
            d="M6 18 10.7 6.8c.5-1.2 2.1-1.2 2.6 0L18 18"
            fill="none"
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "python":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path
            d="M12 3c-4 0-5 1.4-5 4v2h6v1H5c-1.5 0-2.6 1.5-2.6 3.5S3.5 17 5 17h2v-3c0-2 1.5-3.5 3.5-3.5H15c1.1 0 2-.9 2-2V7c0-2.6-1-4-5-4Z"
            fill={color}
          />
          <path
            d="M12 21c4 0 5-1.4 5-4v-2h-6v-1h8c1.5 0 2.6-1.5 2.6-3.5S20.5 7 19 7h-2v3c0 2-1.5 3.5-3.5 3.5H9c-1.1 0-2 .9-2 2V17c0 2.6 1 4 5 4Z"
            fill="#F7D54A"
          />
          <circle cx="10" cy="6" r="1" fill="var(--bg-base)" />
          <circle cx="14" cy="18" r="1" fill="var(--bg-base)" />
        </svg>
      )
    case "pytorch":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path d="M13 4 8.8 8.2a6 6 0 1 0 8.5.1" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="16.8" cy="5.8" r="1.8" fill={color} />
        </svg>
      )
    case "huggingface":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" fill={color} />
          <circle cx="9" cy="10" r="1.2" fill="var(--bg-base)" />
          <circle cx="15" cy="10" r="1.2" fill="var(--bg-base)" />
          <path d="M8.5 14.2c2 2 5 2 7 0" fill="none" stroke="var(--bg-base)" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M4.7 8.5 2.5 6.7m16.8 1.8 2.2-1.8" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case "claude":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path d="M12 3.5 14.1 10l6.4 2-6.4 2L12 20.5 9.9 14l-6.4-2 6.4-2L12 3.5Z" fill={color} />
          <circle cx="12" cy="12" r="2.3" fill="var(--bg-base)" opacity="0.85" />
        </svg>
      )
    case "langgraph":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <g fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round">
            <path d="M7 7h10M7 7v10M17 7v10M7 17h10M7 7l10 10" />
            <circle cx="7" cy="7" r="2.3" fill="var(--bg-base)" />
            <circle cx="17" cy="7" r="2.3" fill="var(--bg-base)" />
            <circle cx="7" cy="17" r="2.3" fill="var(--bg-base)" />
            <circle cx="17" cy="17" r="2.3" fill="var(--bg-base)" />
          </g>
        </svg>
      )
    case "duckdb":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <ellipse cx="12" cy="6" rx="6.5" ry="3" fill="none" stroke={color} strokeWidth="1.8" />
          <path d="M5.5 6v10c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3V6" fill="none" stroke={color} strokeWidth="1.8" />
          <path d="M5.5 11c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3" fill="none" stroke={color} strokeWidth="1.8" />
        </svg>
      )
    case "fastapi":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill={color} />
          <path d="M13.2 4.8 7.8 13h3.4l-1 6.2 6-8.5h-3.5l.5-5.9Z" fill="var(--bg-base)" />
        </svg>
      )
    case "postgres":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <ellipse cx="12" cy="6" rx="6.8" ry="3" fill="none" stroke={color} strokeWidth="1.8" />
          <path
            d="M5.2 6v10c0 1.7 3 3.1 6.8 3.1s6.8-1.4 6.8-3.1V6M5.2 11c0 1.7 3 3.1 6.8 3.1s6.8-1.4 6.8-3.1"
            fill="none"
            stroke={color}
            strokeWidth="1.8"
          />
        </svg>
      )
    case "supabase":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path d="M13 3 5 13h6l-1 8 9-11h-6l0-7Z" fill={color} />
        </svg>
      )
    case "docker":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <g fill={color}>
            <rect x="4" y="10" width="3" height="3" rx=".4" />
            <rect x="8" y="10" width="3" height="3" rx=".4" />
            <rect x="12" y="10" width="3" height="3" rx=".4" />
            <rect x="8" y="6" width="3" height="3" rx=".4" />
            <rect x="12" y="6" width="3" height="3" rx=".4" />
            <path d="M3 14h15.5c-.7 3-3.4 5-7.6 5C7.2 19 4.5 17.5 3 14Z" />
            <path d="M18 10.5c1.3 0 2.2.7 2.9 1.8-1 .5-2.1.6-3.2.3.1-.8.2-1.5.3-2.1Z" />
          </g>
        </svg>
      )
    case "aws":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <text x="12" y="11.5" textAnchor="middle" style={{ fill: color }} className="text-[7px] font-black">
            AWS
          </text>
          <path d="M7 15c3 2 7 2 10 0" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M16.4 14.5 18 15l-.7 1.5" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case "vercel":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path d="M12 4 22 20H2L12 4Z" fill={color} />
        </svg>
      )
    case "tableau":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <g stroke={color} strokeWidth="1.6" strokeLinecap="round">
            <path d="M12 3v5M9.5 5.5h5M12 16v5M9.5 18.5h5M3 12h5M5.5 9.5v5M16 12h5M18.5 9.5v5M6.2 6.2l3.5 3.5M8.7 4.7l-3.5 3.5M14.3 14.3l3.5 3.5M15.3 19.3l3.5-3.5" />
          </g>
        </svg>
      )
    case "android":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path d="M7 10h10v7.2c0 1-.8 1.8-1.8 1.8H8.8C7.8 19 7 18.2 7 17.2V10Z" fill={color} />
          <path d="M8 9a4 4 0 0 1 8 0M9 5.3 7.5 3.6M15 5.3l1.5-1.7" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="10" cy="13" r=".8" fill="var(--bg-base)" />
          <circle cx="14" cy="13" r=".8" fill="var(--bg-base)" />
        </svg>
      )
    case "tensorflow":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path d="M12 3 4.5 7.2v8.6L12 20l7.5-4.2V7.2L12 3Z" fill="none" stroke={color} strokeWidth="1.7" />
          <path d="M12 3v17M4.5 7.2 12 11.5l7.5-4.3M8.2 9.4v8.4" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    case "kotlin":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path d="M4 4h16L12 12l8 8H4V4Z" fill={color} />
          <path d="M4 20 20 4" stroke="var(--bg-base)" strokeWidth="1.5" opacity="0.7" />
        </svg>
      )
    case "compose":
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <path d="M12 3 19.5 7.5v9L12 21l-7.5-4.5v-9L12 3Z" fill="none" stroke={color} strokeWidth="1.8" />
          <path d="M12 3v18M4.5 7.5 12 12l7.5-4.5M4.5 16.5 12 12l7.5 4.5" stroke={color} strokeWidth="1.4" />
        </svg>
      )
    case "pydantic":
      return <WordmarkLogo label="PYD" color={color} textSize={6.4} />
    case "distilbert":
      return <WordmarkLogo label="BERT" color={color} textSize={5.6} />
    case "sentence":
      return <WordmarkLogo label="ST" color={color} />
    case "parquet":
      return <WordmarkLogo label="PQ" color={color} />
    case "tesseract":
      return <WordmarkLogo label="OCR" color={color} textSize={6.5} />
    case "openpyxl":
      return <WordmarkLogo label="XL" color={color} />
    case "pdfplumber":
      return <WordmarkLogo label="PDF" color={color} textSize={6.2} />
    case "executorch":
      return <WordmarkLogo label="ET" color={color} />
    case "qnn":
      return <WordmarkLogo label="QNN" color={color} textSize={6.5} />
    case "nasa":
      return <WordmarkLogo label="NASA" color={color} textSize={5.6} />
    case "pgvector":
      return <WordmarkLogo label="VEC" color={color} textSize={6.3} />
    case "lora":
      return <WordmarkLogo label="LoRA" color={color} textSize={5.4} />
    case "next":
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.7" opacity="0.9" />
          <path d="M8 17V7l8 10V7" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}
