"use client"

import { AnimatedSphere } from "@/components/home/animated-sphere"
import { AnimatedTetrahedron } from "@/components/home/animated-tetrahedron"
import { AnimatedWave } from "@/components/home/animated-wave"

const backgroundVisuals = [
  {
    kind: "sphere",
    className: "right-[-20rem] top-[-12rem] h-[46rem] w-[46rem] md:block",
    opacity: 0.62,
    filter: "blur(0.12px) brightness(2.05)",
    mask: "radial-gradient(circle at center, black 46%, transparent 82%)",
  },
  {
    kind: "tetrahedron",
    className: "left-[-12rem] top-[42rem] h-[30rem] w-[30rem] lg:block",
    opacity: 0.34,
    filter: "blur(0.18px) brightness(2.15)",
    mask: "radial-gradient(circle at center, black 44%, transparent 80%)",
  },
  {
    kind: "sphere",
    className: "right-[7%] top-[86rem] h-[32rem] w-[32rem] lg:block",
    opacity: 0.42,
    filter: "blur(0.14px) brightness(2.05)",
    mask: "radial-gradient(circle at center, black 44%, transparent 82%)",
  },
  {
    kind: "tetrahedron",
    className: "left-[9%] top-[128rem] h-[28rem] w-[28rem] xl:block",
    opacity: 0.32,
    filter: "blur(0.18px) brightness(2.15)",
    mask: "radial-gradient(circle at center, black 42%, transparent 80%)",
  },
  {
    kind: "tetrahedron",
    className: "right-[-10rem] top-[174rem] h-[34rem] w-[34rem] xl:block",
    opacity: 0.36,
    filter: "blur(0.2px) brightness(2.2)",
    mask: "radial-gradient(circle at center, black 42%, transparent 82%)",
  },
  {
    kind: "sphere",
    className: "left-[-11rem] top-[218rem] h-[38rem] w-[38rem] xl:block",
    opacity: 0.4,
    filter: "blur(0.14px) brightness(2.1)",
    mask: "radial-gradient(circle at center, black 44%, transparent 82%)",
  },
  {
    kind: "tetrahedron",
    className: "right-[13%] top-[266rem] h-[30rem] w-[30rem] xl:block",
    opacity: 0.32,
    filter: "blur(0.2px) brightness(2.25)",
    mask: "radial-gradient(circle at center, black 42%, transparent 80%)",
  },
  {
    kind: "sphere",
    className: "right-[-13rem] top-[318rem] h-[40rem] w-[40rem] xl:block",
    opacity: 0.38,
    filter: "blur(0.14px) brightness(2.1)",
    mask: "radial-gradient(circle at center, black 44%, transparent 82%)",
  },
  {
    kind: "tetrahedron",
    className: "left-[5%] top-[372rem] h-[31rem] w-[31rem] xl:block",
    opacity: 0.32,
    filter: "blur(0.18px) brightness(2.25)",
    mask: "radial-gradient(circle at center, black 42%, transparent 80%)",
  },
  {
    kind: "sphere",
    className: "left-[-14rem] top-[430rem] h-[36rem] w-[36rem] xl:block",
    opacity: 0.36,
    filter: "blur(0.14px) brightness(2.1)",
    mask: "radial-gradient(circle at center, black 44%, transparent 82%)",
  },
  {
    kind: "tetrahedron",
    className: "right-[8%] top-[486rem] h-[33rem] w-[33rem] xl:block",
    opacity: 0.32,
    filter: "blur(0.18px) brightness(2.25)",
    mask: "radial-gradient(circle at center, black 42%, transparent 80%)",
  },
] as const

const glowFields = [
  { className: "right-[10%] top-[12rem] h-80 w-80", color: "var(--accent)", mix: 34, opacity: 0.42 },
  { className: "left-[6%] top-[28rem] h-64 w-64", color: "var(--text-primary)", mix: 18, opacity: 0.3 },
  { className: "right-[14%] top-[80rem] h-72 w-72", color: "var(--text-primary)", mix: 18, opacity: 0.25 },
  { className: "left-[12%] top-[138rem] h-80 w-80", color: "var(--accent)", mix: 26, opacity: 0.25 },
  { className: "right-[18%] top-[212rem] h-80 w-80", color: "var(--text-primary)", mix: 16, opacity: 0.24 },
  { className: "left-[16%] top-[286rem] h-80 w-80", color: "var(--accent)", mix: 24, opacity: 0.22 },
] as const

const waveFields = [
  { className: "top-[10rem] h-40", opacity: 0.2, mask: "linear-gradient(to bottom, transparent, black 35%, transparent)" },
  { className: "top-[56rem] h-44", opacity: 0.18, mask: "linear-gradient(to bottom, transparent, black 30%, transparent)" },
  { className: "top-[112rem] h-48", opacity: 0.16, mask: "linear-gradient(to bottom, transparent, black 30%, transparent)" },
  { className: "top-[176rem] h-44", opacity: 0.16, mask: "linear-gradient(to bottom, transparent, black 30%, transparent)" },
  { className: "top-[244rem] h-44", opacity: 0.14, mask: "linear-gradient(to bottom, transparent, black 30%, transparent)" },
] as const

export function BackgroundGlobe() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.14]">
        {[...Array(8)].map((_, index) => (
          <div
            key={`bg-h-${index}`}
            className="absolute h-px w-full"
            style={{
              top: `${12.5 * (index + 1)}%`,
              backgroundColor: "var(--border-faint)",
            }}
          />
        ))}
        {[...Array(12)].map((_, index) => (
          <div
            key={`bg-v-${index}`}
            className="absolute h-full w-px"
            style={{
              left: `${8.33 * (index + 1)}%`,
              backgroundColor: "var(--border-faint)",
            }}
          />
        ))}
      </div>

      {backgroundVisuals.map((visual, index) => (
        <div
          key={`${visual.kind}-${index}`}
          className={`absolute hidden ${visual.className}`}
          style={{
            opacity: visual.opacity,
            filter: visual.filter,
            maskImage: visual.mask,
            WebkitMaskImage: visual.mask,
          }}
        >
          {visual.kind === "sphere" ? <AnimatedSphere /> : <AnimatedTetrahedron />}
        </div>
      ))}

      {glowFields.map((field, index) => (
        <div
          key={`glow-${index}`}
          className={`absolute rounded-full blur-3xl ${field.className}`}
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, ${field.color} ${field.mix}%, transparent) 0%, transparent 72%)`,
            opacity: field.opacity,
          }}
        />
      ))}

      {waveFields.map((field, index) => (
        <div
          key={`wave-${index}`}
          className={`absolute inset-x-0 hidden md:block ${field.className}`}
          style={{
            opacity: field.opacity,
            maskImage: field.mask,
            WebkitMaskImage: field.mask,
          }}
        >
          <AnimatedWave />
        </div>
      ))}
    </div>
  )
}
