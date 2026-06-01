"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { Leaf, Link2, Flame } from "lucide-react"

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

export default function ProjectsPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <Navigation />
      
      <div className="mx-auto max-w-[1200px] px-6 pt-32 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <h1 
            className="font-display text-4xl md:text-5xl font-semibold mb-4 gradient-text"
          >
            Projects
          </h1>
          <p 
            className="text-lg"
            style={{ color: "var(--text-muted)" }}
          >
            {"Things I've shipped and things I'm building."}
          </p>
        </motion.div>

        {/* Tech Focus Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {techBadges.map((badge) => (
            <span
              key={badge.label}
              className="theme-badge inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wide"
              style={{ 
                backgroundColor: badge.bg,
                color: badge.text
              }}
            >
              {badge.icon && <badge.icon className="h-3 w-3" />}
              {badge.label}
            </span>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <ProjectsGrid />
      </div>

      <Footer />
    </main>
  )
}
