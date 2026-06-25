"use client"

import { motion } from "framer-motion"
import { ArchitectureList } from "@/components/architecture/architecture-list"

export function ArchitectureSection() {
  return (
    <section id="architecture" className="scroll-mt-28">
      <div className="mx-auto max-w-[1200px] px-6 pt-16 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 gradient-text">
            Technical System Designs
          </h2>
          <p className="text-lg max-w-2xl" style={{ color: "var(--text-muted)" }}>
            Interactive system architecture diagrams from real projects, showcasing
            distributed systems, ML pipelines, and full-stack applications.
          </p>
        </motion.div>

        <ArchitectureList />
      </div>
    </section>
  )
}
