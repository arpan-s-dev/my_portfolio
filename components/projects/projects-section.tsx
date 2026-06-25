"use client"

import { motion } from "framer-motion"
import { Leaf, Link2, Flame } from "lucide-react"
import { ProjectsGrid } from "@/components/projects/projects-grid"

const techBadges = [
  { label: "MULTI-AGENT SYSTEMS", bg: "#a855f7", text: "#ffffff" },
  { label: "LANGGRAPH", bg: "#1f2937", text: "#ffffff", icon: Leaf },
  { label: "LANGCHAIN", bg: "#1f2937", text: "#ffffff", icon: Link2 },
  { label: "RAG", bg: "#ec4899", text: "#ffffff" },
  { label: "LLM ENGINEERING", bg: "#10b981", text: "#ffffff" },
  { label: "PYTORCH", bg: "#ee4c2c", text: "#ffffff", icon: Flame },
  { label: "TENSORFLOW", bg: "#ff6f00", text: "#ffffff" },
  { label: "SCIKIT-LEARN", bg: "#f7931e", text: "#ffffff" },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-28">
      <div className="mx-auto max-w-[1200px] px-6 pt-16 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 gradient-text">
            Projects
          </h2>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            {"Things I've shipped and things I'm building."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {techBadges.map((badge) => (
            <span
              key={badge.label}
              className="theme-badge inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-transform duration-200 ease-out hover:-translate-y-0.5"
              style={{
                backgroundColor: badge.bg,
                color: badge.text,
              }}
            >
              {badge.icon && <badge.icon className="h-3 w-3" />}
              {badge.label}
            </span>
          ))}
        </motion.div>

        <ProjectsGrid />
      </div>
    </section>
  )
}
