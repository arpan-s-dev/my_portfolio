"use client"

import { motion } from "framer-motion"
import { ArchitectureList } from "@/components/architecture/architecture-list"
import { AnimatedWave } from "@/components/home/animated-wave"

export function ArchitectureSection() {
  return (
    <section id="architecture" className="relative overflow-hidden scroll-mt-28">
      <div
        className="absolute inset-x-0 top-0 h-44"
        style={{
          opacity: 0.18,
          maskImage: "linear-gradient(to bottom, transparent, black 35%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 35%, transparent)",
        }}
      >
        <AnimatedWave />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-16 pb-16">
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
