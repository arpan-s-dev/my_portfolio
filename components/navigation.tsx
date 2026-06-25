"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { useCopyEmail } from "@/lib/contact"

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Architecture", href: "#architecture" },
]

export function Navigation() {
  const { theme, toggleTheme } = useTheme()
  const { copied: mailCopied, copy: copyEmail } = useCopyEmail()
  const prefersReducedMotion = useReducedMotion()
  const [activeId, setActiveId] = useState<string>("home")
  const [scrolled, setScrolled] = useState(false)

  // Sticky-nav tint: cross the 32px threshold and the bar gets a blurred,
  // tinted background. One scroll listener handles both this and the
  // active-section default below.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Drive the active nav pill from whichever section is dominant in the
  // viewport. rootMargin pulls the trigger zone roughly to the middle so
  // a section lights up when it occupies the central band of the page,
  // not the moment its top crosses the navbar.
  useEffect(() => {
    const ids = navItems.map((i) => i.href.slice(1))
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })
    history.replaceState(null, "", href)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-[background-color,backdrop-filter,border-color] duration-300 ease-out"
      style={{
        backgroundColor: scrolled
          ? "color-mix(in srgb, var(--bg-base) 75%, transparent)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px) saturate(140%)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border-faint)"
          : "1px solid transparent",
      }}
    >
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="font-display text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          arpan.sdev
        </a>

        {/* Center Nav Pills */}
        <div
          className="nav-pill flex items-center gap-1 border px-1 py-1"
          style={{
            borderColor: "var(--border-faint)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          {navItems.map((item) => {
            const isActive = activeId === item.href.slice(1)

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="nav-pill relative px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
                }}
              >
                {item.label}
              </a>
            )
          })}

          {/* Mail: copies email to clipboard, flashes "Copied" for 2s */}
          <button
            type="button"
            onClick={copyEmail}
            aria-label={mailCopied ? "Email copied to clipboard" : "Copy email address"}
            className="nav-pill relative px-4 py-2 text-sm font-medium transition-colors min-w-[64px]"
            style={{
              color: mailCopied ? "var(--accent)" : "var(--text-muted)",
              backgroundColor: "transparent",
            }}
          >
            <span aria-live="polite">{mailCopied ? "Copied" : "Mail"}</span>
          </button>
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
          whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
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
