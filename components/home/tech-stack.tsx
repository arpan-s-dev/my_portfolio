"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

interface TechItem {
  name: string
  icon: string
  color: string
  orbit: number
  angle: number
}

const techStack: TechItem[] = [
  // Inner orbit
  { name: "React", icon: "⚛️", color: "#61DAFB", orbit: 1, angle: 0 },
  { name: "TypeScript", icon: "📘", color: "#3178C6", orbit: 1, angle: 90 },
  { name: "Next.js", icon: "▲", color: "#ffffff", orbit: 1, angle: 180 },
  { name: "Node.js", icon: "🟢", color: "#339933", orbit: 1, angle: 270 },
  
  // Middle orbit
  { name: "PostgreSQL", icon: "🐘", color: "#4169E1", orbit: 2, angle: 30 },
  { name: "Redis", icon: "🔴", color: "#DC382D", orbit: 2, angle: 100 },
  { name: "MongoDB", icon: "🍃", color: "#47A248", orbit: 2, angle: 170 },
  { name: "Kafka", icon: "📊", color: "#231F20", orbit: 2, angle: 240 },
  { name: "GraphQL", icon: "◈", color: "#E10098", orbit: 2, angle: 310 },
  
  // Outer orbit
  { name: "Docker", icon: "🐳", color: "#2496ED", orbit: 3, angle: 15 },
  { name: "Kubernetes", icon: "☸️", color: "#326CE5", orbit: 3, angle: 75 },
  { name: "AWS", icon: "☁️", color: "#FF9900", orbit: 3, angle: 135 },
  { name: "Terraform", icon: "🔷", color: "#7B42BC", orbit: 3, angle: 195 },
  { name: "Grafana", icon: "📈", color: "#F46800", orbit: 3, angle: 255 },
  { name: "Python", icon: "🐍", color: "#3776AB", orbit: 3, angle: 315 },
]

const orbitRadii = [60, 100, 140]
const orbitDurations = [20, 30, 40]

export function TechStack() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  // Gate the rotating tech-icon layer behind a mount flag. framer-motion's
  // <motion.div> with `animate` / `whileHover` / `onHoverStart` rewrites the
  // inline `style` attribute differently on the server vs the client (the
  // server emits a simplified `calc(50% - 66px)` form while the client emits
  // the raw template-literal `calc(50% + ${x}px - 16px)` form), which trips
  // React's hydration check. Rendering the rotating layer only after mount
  // guarantees the SSR HTML and the first client render agree — the static
  // orbit rings and the center "laptop" badge stay rendered on the server
  // so there's no visual gap before mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const { theme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="theme-card p-6 h-full"
    >
      <div className="text-center mb-4">
        <h3 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Tech Stack
        </h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Hover to explore
        </p>
      </div>

      <div className="relative mx-auto flex h-[320px] w-full max-w-[320px] items-center justify-center">
        {/* Orbit circles */}
        {orbitRadii.map((radius, idx) => (
          <div
            key={idx}
            className="absolute rounded-full border"
            style={{
              width: radius * 2,
              height: radius * 2,
              borderColor: "var(--border-faint)",
              opacity: 0.3
            }}
          />
        ))}

        {/* Center icon - Laptop */}
        <motion.div
          className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2"
          style={{
            borderColor: theme === "arthur" ? "rgba(201, 169, 97, 0.5)" : "rgba(168, 85, 247, 0.5)",
            backgroundColor: "var(--bg-elevated)",
            boxShadow: hoveredTech 
              ? theme === "arthur" 
                ? "0 0 30px rgba(201, 169, 97, 0.3)" 
                : "0 0 30px rgba(168, 85, 247, 0.3)"
              : theme === "arthur"
                ? "0 0 20px rgba(201, 169, 97, 0.2)"
                : "0 0 20px rgba(168, 85, 247, 0.2)"
          }}
        >
          <span className="text-2xl">💻</span>
        </motion.div>

        {/* Rotating orbit containers with tech icons — client-only to avoid
            framer-motion SSR style mismatches (see comment at top of file). */}
        {mounted && [1, 2, 3].map((orbitNum) => {
          const radius = orbitRadii[orbitNum - 1]
          const duration = orbitDurations[orbitNum - 1]
          const techsInOrbit = techStack.filter((t) => t.orbit === orbitNum)

          return (
            <motion.div
              key={orbitNum}
              className="absolute"
              style={{
                width: radius * 2,
                height: radius * 2,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {techsInOrbit.map((tech) => {
                const angleRad = (tech.angle * Math.PI) / 180
                const x = Math.cos(angleRad) * radius
                const y = Math.sin(angleRad) * radius

                return (
                  <motion.div
                    key={tech.name}
                    className="absolute z-20"
                    style={{
                      left: `calc(50% + ${x}px - 16px)`,
                      top: `calc(50% + ${y}px - 16px)`,
                    }}
                    animate={{ rotate: -360 }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    whileHover={{ scale: 1.2 }}
                    onHoverStart={() => setHoveredTech(tech.name)}
                    onHoverEnd={() => setHoveredTech(null)}
                  >
                    <div
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-all duration-300"
                      style={{
                        backgroundColor: hoveredTech === tech.name ? `${tech.color}20` : "var(--bg-card)",
                        borderColor: hoveredTech === tech.name ? tech.color : "var(--border-faint)",
                        boxShadow: hoveredTech === tech.name ? `0 0 15px ${tech.color}40` : "none",
                      }}
                    >
                      <span className="text-sm">{tech.icon}</span>
                    </div>
                    
                    {/* Tooltip */}
                    {hoveredTech === tech.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded border px-2 py-1 text-xs"
                        style={{
                          backgroundColor: "var(--bg-elevated)",
                          borderColor: "var(--border-faint)",
                          color: "var(--text-primary)"
                        }}
                      >
                        {tech.name}
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
