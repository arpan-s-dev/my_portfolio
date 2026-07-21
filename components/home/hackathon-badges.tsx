"use client"

import { motion } from "framer-motion"
import { Award, Medal, Trophy, type LucideIcon } from "lucide-react"

interface Win {
  icon: LucideIcon
  emoji: string
  label: string
}

const WINS: Win[] = [
  {
    icon: Trophy,
    emoji: "🏆",
    label: "Qualcomm ExecuTorch Hackathon Winner",
  },
  {
    icon: Medal,
    emoji: "🥇",
    label: "LinkedIn Spartan Hackathon Winner",
  },
]

// Ember offsets/timing so each spark drifts on its own path.
const EMBERS = [
  { dx: "-5px", delay: "0s" },
  { dx: "4px", delay: "0.9s" },
  { dx: "-1px", delay: "1.7s" },
]

function BadgePill({ win, index }: { win: Win; index: number }) {
  const Icon = win.icon
  return (
    <div
      className="hackathon-badge flex items-center gap-3 rounded-2xl border px-3 py-2.5"
      style={{
        borderColor: "var(--border-faint)",
        backgroundColor: "var(--bg-elevated)",
      }}
    >
      {/* Shine sweep, clipped to the badge */}
      <span className="hackathon-shine-wrap" aria-hidden="true">
        <span
          className="hackathon-shine"
          style={{ animationDelay: `${index * 2.4}s` }}
        />
      </span>

      {/* Medallion with radiating rings + rising embers */}
      <span
        className="hackathon-medallion relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ color: "var(--accent)" }}
        aria-hidden="true"
      >
        <span className="hackathon-ring" />
        <span className="hackathon-ring ring-2" />
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="hackathon-ember"
            style={{ ["--ember-dx" as string]: e.dx, animationDelay: e.delay }}
          />
        ))}
        <Icon className="hackathon-medal-icon relative z-10 h-4 w-4" />
      </span>

      {/* Label */}
      <span
        className="relative z-10 text-xs font-semibold leading-snug"
        style={{ color: "var(--text-primary)" }}
      >
        <span aria-hidden="true">{win.emoji} </span>
        {win.label}
      </span>
    </div>
  )
}

export function HackathonBadges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
      className="theme-card p-5"
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <Award
          className="hackathon-medal-icon h-4 w-4"
          style={{ color: "var(--accent)" }}
        />
        <h3
          className="font-display text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Hackathon Winnings
        </h3>
        <span
          className="theme-badge ml-auto px-2 py-0.5 text-[11px] font-medium"
          style={{ color: "var(--accent)" }}
        >
          {WINS.length} wins
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-col gap-2.5">
        {WINS.map((win, i) => (
          <BadgePill key={win.label} win={win} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
