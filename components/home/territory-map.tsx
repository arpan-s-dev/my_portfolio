"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

export function TerritoryMap() {
  const { theme } = useTheme()

  const mapFilter =
    theme === "arthur"
      ? "sepia(0.2) saturate(0.85) brightness(0.85)"
      : "grayscale(1) brightness(0.7)"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="theme-card p-6 h-full flex flex-col"
    >
      {/* Section Label */}
      <p
        className="text-xs font-medium uppercase tracking-[0.2em] mb-4"
        style={{ color: "var(--accent)" }}
      >
        TERRITORY
      </p>

      {/* Animated territory video */}
      <div
        className="relative w-full overflow-hidden border"
        style={{
          borderColor: "var(--border-faint)",
          borderRadius: "var(--radius-theme)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        <video
          src="/territory-map.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-h-[280px] object-cover"
          style={{ filter: mapFilter }}
        />
      </div>

      {/* Caption */}
      <p
        className="mt-3 text-center text-xs uppercase tracking-[0.2em]"
        style={{ color: "var(--text-muted)" }}
      >
        SJSU · BAY AREA · CENTRAL VALLEY
      </p>
    </motion.div>
  )
}
