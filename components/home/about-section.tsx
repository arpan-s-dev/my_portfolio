"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

export function AboutSection() {
  const { theme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="w-full"
    >
      {/* Section Label */}
      <p className="section-label mb-8">
        {theme === "arthur" ? "CHAPTER II — ABOUT" : "ABOUT"}
      </p>

      {/* Content */}
      <div className="max-w-[800px] mx-auto">
        {/* Bio paragraph */}
        <p 
          className="text-base leading-relaxed mb-10"
          style={{ color: "var(--text-muted)" }}
        >
          I&apos;m a Computer Science student at San Jose State University with a passion for building 
          scalable systems and exploring the frontiers of AI. My current focus is on developing 
          tooling for the trucking industry, combining practical software engineering with 
          machine learning pipelines. When I&apos;m not coding, I enjoy exploring new technologies 
          and contributing to open-source projects.
        </p>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Now Reading */}
          <div>
            <p className="section-label mb-4">NOW READING</p>
            <div className="space-y-3">
              <div>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  MIT Paper
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Neural network compression
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  Designing Data-Intensive Applications
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Martin Kleppmann
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  The Pragmatic Programmer
                </p>
              </div>
            </div>
          </div>

          {/* Now Building */}
          <div>
            <p className="section-label mb-4">NOW BUILDING</p>
            <div className="space-y-3">
              <div>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  FreightField AI
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Agentic load info system
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  RAG over freight domain corpus
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  LoRA fine-tuning experiments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
