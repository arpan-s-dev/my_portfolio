"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import {
  LoadBoardVisual,
  FreightDocMatcherVisual,
  OCRVisual,
  LodestarVisual,
  FreightFieldVisual,
  SpaceProjectVisual,
  RAGVisual,
  FineTuningVisual,
} from "@/components/projects/project-visuals"

interface Project {
  title: string
  description: string
  stack: string[]
  github: string
  demo?: string
  planned?: boolean
  badges?: string[]
}

const projectVisualMap: Record<string, React.ComponentType> = {
  "Unified Load Board": LoadBoardVisual,
  "Freight Doc Matcher": FreightDocMatcherVisual,
  "POD_RC_AUTO_OCR": OCRVisual,
  "Lodestar": LodestarVisual,
  "FreightField AI": FreightFieldVisual,
  "Space Project": SpaceProjectVisual,
  "RAG System": RAGVisual,
  "Fine-Tuning Experiments": FineTuningVisual,
}

const shippedProjects: Project[] = [
  {
    title: "Unified Load Board",
    description: "One interface for loads across DAT, Truckstop, and Amazon Relay. FastAPI backend, adapter-pattern architecture, Next.js frontend.",
    stack: ["FastAPI", "Next.js", "Python", "TypeScript", "Pydantic"],
    github: "https://github.com/arpan-s-dev/UniLoadBoard"
  },
  {
    title: "Freight Doc Matcher",
    description: "Fine-tuned DistilBERT cross-encoder with bi-encoder blocking matches Bills of Lading to Rate Confirmations across 13 brokers, plus a DuckDB analytics layer with Parquet/CSV exports for Tableau and Power BI. F1 0.65 → 0.87 on noisy recurring lanes.",
    stack: ["PyTorch", "HuggingFace", "DistilBERT", "sentence-transformers", "DuckDB", "Parquet"],
    github: "https://github.com/arpan-s-dev/Freight-Doc-Matcher"
  },
  {
    title: "POD_RC_AUTO_OCR",
    description: "Earlier heuristic predecessor of Freight Doc Matcher. Python CLI that matches Bills of Lading to Rate Confirmations across 13 brokers via a hybrid Tesseract + Claude extraction pipeline and a 100-point additive scorer. Outputs hyperlinked Excel.",
    stack: ["Python", "Claude API", "Tesseract", "openpyxl", "pdfplumber"],
    github: "https://github.com/arpan-s-dev/POD_RC_AUTO_OCR"
  },
  {
    title: "Lodestar",
    description: "Offline Android survival copilot for the Qualcomm x Meta ExecuTorch Hackathon. Jetpack Compose UI over deterministic triage, spoof-aware navigation, hospital guidance, and on-device Qwen inference on Snapdragon.",
    stack: ["Kotlin", "Jetpack Compose", "ExecuTorch", "QNN", "Android"],
    github: "https://github.com/arpan-s-dev/QCOM",
    badges: ["🏆 Copilot-Powered Build Award", "🚀 Qualcomm x Meta Hackathon", "📱 100% Offline"]
  }
]

const plannedProjects: Project[] = [
  {
    title: "FreightField AI",
    description: "Agentic AI that fetches load information and answers dispatcher questions in natural language.",
    stack: ["Claude API", "LangGraph", "FastAPI", "Postgres"],
    github: "#",
    planned: true
  },
  {
    title: "Space Project",
    description: "Personal project at the intersection of space data and ML. Scope TBD.",
    stack: ["Python", "TensorFlow", "NASA APIs"],
    github: "#",
    planned: true
  },
  {
    title: "RAG System",
    description: "Retrieval-augmented generation over a custom domain corpus. Exploring chunking strategies and reranking.",
    stack: ["Python", "pgvector", "Claude API"],
    github: "#",
    planned: true
  },
  {
    title: "Fine-Tuning Experiments",
    description: "Exploring parameter-efficient fine-tuning techniques on small models.",
    stack: ["PyTorch", "HuggingFace", "LoRA"],
    github: "#",
    planned: true
  }
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { theme } = useTheme()
  const hasRepo = Boolean(project.github && project.github !== "#")
  const Visual = projectVisualMap[project.title] ?? null

  // The whole card is a link when a real GitHub URL is wired up — clicking
  // anywhere on a shipped card opens the repo in a new tab. Planned cards
  // (github === "#") fall back to a plain div with a "Coming soon" hint.
  const Wrapper: typeof motion.a = hasRepo ? motion.a : (motion.div as typeof motion.a)
  const wrapperProps = hasRepo
    ? {
        href: project.github,
        target: "_blank" as const,
        rel: "noopener noreferrer",
        "aria-label": `${project.title} on GitHub`,
      }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
      className={`theme-card relative overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)] ${hasRepo ? "cursor-pointer block no-underline" : ""}`}
      style={{ borderColor: "var(--border-faint)" }}
      whileHover={{ borderColor: "var(--accent)" }}
    >
      {/* Animated visual preview area */}
      {Visual && <Visual />}

      {/* Card content */}
      <div className="relative p-6">
        {/* Planned badge */}
        {project.planned && (
          <span
            className="theme-badge absolute top-0 right-4 px-2 py-1 text-xs font-medium"
            style={{
              backgroundColor: theme === "arthur" ? "rgba(201, 169, 97, 0.2)" : "rgba(168, 85, 247, 0.2)",
              color: "var(--accent)"
            }}
          >
            PLANNED
          </span>
        )}

        {/* Title */}
        <h3
          className="font-display text-xl font-semibold mb-2 pr-20"
          style={{ color: "var(--text-primary)" }}
        >
          {project.title}
        </h3>

        {project.badges && project.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.badges.map((badge) => (
              <span
                key={badge}
                className="theme-badge px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--accent)",
                  border: "1px solid var(--border-faint)",
                  borderRadius: "var(--radius-theme)"
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          {project.description}
        </p>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-medium uppercase tracking-wider border transition-transform duration-150 ease-out hover:-translate-y-0.5"
              style={{
                borderColor: "var(--border-faint)",
                color: "var(--text-muted)",
                borderRadius: "var(--radius-theme)"
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer hint — visual cue only; the whole card is the link. */}
        <div className="flex items-center gap-4">
          {hasRepo ? (
            <span
              className="text-sm font-medium underline underline-offset-4"
              style={{ color: "var(--accent)" }}
            >
              View on GitHub →
            </span>
          ) : null}
          {project.planned ? (
            <span
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Coming soon
            </span>
          ) : null}
        </div>
      </div>
    </Wrapper>
  )
}

export function ProjectsGrid() {
  const { theme } = useTheme()

  return (
    <div className="space-y-16">
      {/* Shipped Section */}
      <section>
        <p className="section-label mb-8">
          {theme === "arthur" ? "CHAPTER I — SHIPPED" : "SHIPPED"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shippedProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </section>

      {/* Building Next Section */}
      <section>
        <p className="section-label mb-8">
          {theme === "arthur" ? "CHAPTER II — BUILDING NEXT" : "BUILDING NEXT"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plannedProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
