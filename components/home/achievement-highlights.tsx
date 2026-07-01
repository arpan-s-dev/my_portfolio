"use client"

import { motion } from "framer-motion"
import { Cpu, Github, Lightbulb, Linkedin, Trophy, Users, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

function DetailCard({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: ReactNode
}) {
  return (
    <div
      className="rounded-[var(--radius-theme)] border p-4"
      style={{ borderColor: "var(--border-faint)", backgroundColor: "var(--bg-elevated)" }}
    >
      <div className="flex items-center gap-2 mb-2" style={{ color: "var(--accent)" }}>
        <Icon className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="text-sm font-medium" style={{ color: "var(--text-primary)", lineHeight: 1.6 }}>
        {children}
      </p>
    </div>
  )
}

export function AchievementHighlights() {
  return (
    <div className="grid gap-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
        className="theme-card overflow-hidden border"
        style={{ borderColor: "var(--border-faint)" }}
      >
        <div
          className="h-full p-6 md:p-7"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, transparent), transparent 55%)",
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

          <p className="text-sm md:text-base mb-5" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
            Lodestar was built as part of the Qualcomm x Meta ExecuTorch Hackathon and earned GitHub&apos;s
            <span style={{ color: "var(--text-primary)" }}> Copilot-Powered Build Award</span> for creative and effective use of GitHub Copilot during development.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <DetailCard icon={Trophy} label="Recognition">
              Creative and effective use of GitHub Copilot.
            </DetailCard>
            <DetailCard icon={Github} label="Award Context">
              Part of the Qualcomm x Meta hackathon build track, with Lodestar shipped as an offline-first Android experience.
            </DetailCard>
            <DetailCard icon={Cpu} label="Prize Received">
              Received a 2-year GitHub Max subscription, estimated at around $2,400 USD.
            </DetailCard>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
        className="theme-card overflow-hidden border"
        style={{ borderColor: "var(--border-faint)" }}
      >
        <div
          className="h-full p-6 md:p-7"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--accent-secondary) 16%, transparent), transparent 58%)",
          }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="theme-badge px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
              Strategy Highlight
            </span>
            <span className="theme-badge px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
              LinkedIn Campus Ambassador
            </span>
            <span className="theme-badge px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
              SJSU · Apr 2026
            </span>
          </div>

          <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            🥇 LinkedIn&apos;s Spartan Strategy Showcase
          </h3>

          <p className="text-sm md:text-base mb-5" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
            Awarded <span style={{ color: "var(--text-primary)" }}>first place</span> in a competitive case-study
            style event focused on creativity, rapid problem-solving, and strategy communication.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <DetailCard icon={Trophy} label="Recognition">
              1st place winner in LinkedIn&apos;s Spartan Strategy Showcase.
            </DetailCard>
            <DetailCard icon={Linkedin} label="Program Context">
              LinkedIn Campus Ambassador Program and San José State University Career Center.
            </DetailCard>
            <DetailCard icon={Lightbulb} label="What It Shows">
              Strategy, team analysis, creative positioning, and fast presentation under constraints.
            </DetailCard>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
            <Users className="h-3.5 w-3.5" />
            Team competition · case study · rapid problem solving
          </div>
        </div>
      </motion.div>
    </div>
  )
}
