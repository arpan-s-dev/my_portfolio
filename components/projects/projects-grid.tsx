"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

interface Project {
  title: string
  description: string
  stack: string[]
  github: string
  demo?: string
  planned?: boolean
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="theme-card relative p-6 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        borderColor: "var(--border-faint)",
      }}
      whileHover={{
        borderColor: "var(--accent)",
      }}
    >
      {/* Planned badge */}
      {project.planned && (
        <span 
          className="theme-badge absolute top-4 right-4 px-2 py-1 text-xs font-medium"
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
            className="px-2 py-1 text-xs font-medium uppercase tracking-wider border"
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

      {/* Links */}
      <div className="flex items-center gap-4">
        {/*
          GitHub link only renders when a real URL is wired up. Planned
          projects without a repo yet skip it entirely and show "Coming soon".
        */}
        {project.github && project.github !== "#" ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            GitHub
          </a>
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
    </motion.div>
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
