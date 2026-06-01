"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Architecture", href: "/architecture" },
  { label: "Mail", href: "mailto:placeholder@example.com" },
]

export function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="font-display text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          arpan.sdev
        </Link>

        {/* Center Nav Pills */}
        <div 
          className="nav-pill flex items-center gap-1 border px-1 py-1"
          style={{ 
            borderColor: "var(--border-faint)",
            backgroundColor: "var(--bg-card)"
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const isExternal = item.href.startsWith("mailto:") || item.href.startsWith("#")
            
            return (
              <Link
                key={item.href}
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                className="nav-pill relative px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className="theme-button flex h-10 w-10 items-center justify-center border transition-colors"
          style={{
            borderColor: "var(--border-faint)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text-muted)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Switch theme"
        >
          {theme === "arthur" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </motion.button>
      </nav>
      
      {/* Divider line */}
      <div 
        className="mx-auto mt-4 max-w-[1200px] h-px"
        style={{ backgroundColor: "var(--accent)" }}
      />
    </header>
  )
}
