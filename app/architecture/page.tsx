"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArchitectureList } from "@/components/architecture/architecture-list"

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <Navigation />
      
      <div className="mx-auto max-w-[1200px] px-6 pt-32 pb-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <h1 
            className="font-display text-4xl md:text-5xl font-semibold mb-4 gradient-text"
          >
            Technical System Designs
          </h1>
          <p 
            className="text-lg max-w-2xl"
            style={{ color: "var(--text-muted)" }}
          >
            Interactive system architecture diagrams from real projects, showcasing 
            distributed systems, ML pipelines, and full-stack applications.
          </p>
        </motion.div>

        {/* Architecture List */}
        <ArchitectureList />
      </div>

      <Footer />
    </main>
  )
}
