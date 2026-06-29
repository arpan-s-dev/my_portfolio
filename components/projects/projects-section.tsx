"use client"

import { motion } from "framer-motion"
import { Leaf, Link2, Flame, Github, Trophy, Cpu } from "lucide-react"
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

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          className="theme-card mb-10 overflow-hidden border"
          style={{ borderColor: "var(--border-faint)" }}
        >
          <div
            className="p-6 md:p-7"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, transparent), transparent 55%)"
            }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="theme-badge px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                Hackathon Highlights
              </span>
              <span className="theme-badge px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                Qualcomm x Meta ExecuTorch
              </span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              🏆 Copilot-Powered Build Award
            </h3>

            <p className="text-sm md:text-base max-w-3xl mb-5" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
              Lodestar was built as part of the Qualcomm x Meta ExecuTorch Hackathon and earned GitHub&apos;s
              <span style={{ color: "var(--text-primary)" }}> Copilot-Powered Build Award</span> for creative and effective use of GitHub Copilot during development.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <div
                className="rounded-[var(--radius-theme)] border p-4"
                style={{ borderColor: "var(--border-faint)", backgroundColor: "var(--bg-elevated)" }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: "var(--accent)" }}>
                  <Trophy className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">Recognition</p>
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)", lineHeight: 1.6 }}>
                  Creative and effective use of GitHub Copilot.
                </p>
              </div>

              <div
                className="rounded-[var(--radius-theme)] border p-4"
                style={{ borderColor: "var(--border-faint)", backgroundColor: "var(--bg-elevated)" }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: "var(--accent)" }}>
                  <Github className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">Award Context</p>
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)", lineHeight: 1.6 }}>
                  Part of the Qualcomm x Meta hackathon build track, with Lodestar shipped as an offline-first Android experience.
                </p>
              </div>

              <div
                className="rounded-[var(--radius-theme)] border p-4"
                style={{ borderColor: "var(--border-faint)", backgroundColor: "var(--bg-elevated)" }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: "var(--accent)" }}>
                  <Cpu className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">Potential Rewards</p>
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)", lineHeight: 1.6 }}>
                  Copilot Pro+ access and GitHub for Startups credits, subject to eligibility.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <ProjectsGrid />
      </div>
    </section>
  )
}
