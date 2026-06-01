"use client"

import { motion } from "framer-motion"
import { Linkedin } from "lucide-react"

export function LinkedInCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="theme-card p-6 h-full flex flex-col"
    >
      {/* Icon */}
      <div className="mb-4">
        <Linkedin className="h-8 w-8" style={{ color: "var(--accent)" }} />
      </div>

      {/* Title */}
      <h3 className="font-display text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        LinkedIn
      </h3>

      {/* Name */}
      <p className="text-sm mb-1" style={{ color: "var(--text-primary)" }}>
        Arpanjeet Singh
      </p>

      {/* Subtitle */}
      <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
        SJSU CS Student
      </p>

      {/* Connect button */}
      <a
        href="#linkedin"
        className="theme-button mt-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium border transition-colors hover:opacity-80"
        style={{ 
          borderColor: "var(--accent)",
          color: "var(--accent)",
          backgroundColor: "transparent"
        }}
      >
        Connect
      </a>
    </motion.div>
  )
}
