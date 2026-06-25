"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { FolderOpen } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ProfileCard() {
  const { theme } = useTheme()
  const prefersReducedMotion = useReducedMotion()

  const handleProjectsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.getElementById("projects")
    if (!el) return
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })
    history.replaceState(null, "", "#projects")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="theme-card p-6 md:p-8 h-full flex flex-col justify-between gap-8"
    >
      {/* Top: headshot + identity */}
      <div className="flex flex-col items-center text-center">
        {/* Headshot */}
        <div
          className="relative h-[160px] w-[160px] rounded-full p-1 mb-5"
          style={{
            background:
              theme === "arthur"
                ? "linear-gradient(135deg, var(--accent), var(--accent))"
                : "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
          }}
        >
          <div
            className="relative h-full w-full rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <Image
              src="/headshot.jpg"
              alt="Arpanjeet Singh"
              fill
              sizes="160px"
              priority
              className="object-cover"
            />
          </div>
          {/* Online indicator */}
          <div
            className="absolute bottom-3 right-3 h-4 w-4 rounded-full border-4"
            style={{
              backgroundColor: "#22c55e",
              borderColor: "var(--bg-card)",
            }}
          />
        </div>

        {/* Name */}
        <h2
          className="text-2xl md:text-3xl font-semibold mb-2"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-cormorant)",
          }}
        >
          Arpanjeet Singh
        </h2>

        {/* Tagline - serif italic */}
        <p
          className="text-sm italic mb-4"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-cormorant)",
          }}
        >
          Catching up. Outrunning. Iterating again.
        </p>

        {/* Focus areas */}
        <p
          className="text-sm mb-2"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-inter)",
          }}
        >
          AI Engineering <span style={{ color: "var(--accent)" }}>·</span>{" "}
          Multi-Agent <span style={{ color: "var(--accent)" }}>·</span>{" "}
          Low-Level Systems
        </p>

        {/* Location */}
        <p
          className="text-xs"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-inter)",
          }}
        >
          SJSU CS Student · SF Bay Area
        </p>
      </div>

      {/* Middle: bio */}
      <p
        className="text-sm text-center"
        style={{
          color: "var(--text-muted)",
          fontFamily: "var(--font-inter)",
          lineHeight: 1.6,
        }}
      >
        Building scalable systems and AI solutions. Experience with
        microservices, ML pipelines, and full-stack development. Currently
        focused on tooling for the trucking industry.
      </p>

      {/* Bottom: primary CTA */}
      <div className="flex flex-col">
        <a
          href="#projects"
          onClick={handleProjectsClick}
          className="theme-button inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium border transition-all duration-200 ease-out hover:opacity-80 hover:-translate-y-0.5"
          style={{
            borderColor: "var(--accent)",
            backgroundColor: "var(--accent)",
            color: "var(--bg-base)",
          }}
        >
          <FolderOpen className="h-4 w-4" />
          View Projects
        </a>
      </div>
    </motion.div>
  )
}
