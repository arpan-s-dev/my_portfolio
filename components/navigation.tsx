"use client"

import { useEffect, useState } from "react"
import { Menu, Moon, Sun, X } from "lucide-react"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const ids = navItems.map((item) => item.href.slice(1))
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
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
    setMobileMenuOpen(false)
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
      className={`fixed z-50 transition-all duration-500 ${
        scrolled || mobileMenuOpen
          ? "top-4 left-4 right-4"
          : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? "max-w-[1200px] border"
            : "max-w-[1360px] border border-transparent"
        }`}
        style={{
          borderColor: scrolled || mobileMenuOpen ? "var(--border-faint)" : "transparent",
          borderRadius:
            scrolled || mobileMenuOpen ? "calc(var(--radius-theme) + 12px)" : "0px",
          backgroundColor:
            scrolled || mobileMenuOpen
              ? "color-mix(in srgb, var(--bg-base) 82%, transparent)"
              : "transparent",
          backdropFilter:
            scrolled || mobileMenuOpen ? "blur(16px) saturate(150%)" : "none",
          WebkitBackdropFilter:
            scrolled || mobileMenuOpen ? "blur(16px) saturate(150%)" : "none",
          boxShadow:
            scrolled || mobileMenuOpen
              ? "0 18px 60px -28px rgba(0, 0, 0, 0.55)"
              : "none",
        }}
      >
        <div
          className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className={`font-display font-semibold tracking-tight transition-all duration-500 ${
              scrolled ? "text-xl" : "text-2xl"
            }`}
            style={{ color: "var(--text-primary)" }}
          >
            arpan.sdev
          </a>

          <div
            className="nav-pill hidden items-center gap-1 border px-1 py-1 md:flex"
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

            <button
              type="button"
              onClick={copyEmail}
              aria-label={mailCopied ? "Email copied to clipboard" : "Copy email address"}
              className="nav-pill relative min-w-[68px] px-4 py-2 text-sm font-medium transition-colors"
              style={{
                color: mailCopied ? "var(--accent)" : "var(--text-muted)",
                backgroundColor: "transparent",
              }}
            >
              <span aria-live="polite">{mailCopied ? "Copied" : "Mail"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
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

            <button
              type="button"
              className="theme-button flex h-10 w-10 items-center justify-center border md:hidden"
              style={{
                borderColor: "var(--border-faint)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`mx-auto mt-3 max-w-[1200px] transition-all duration-300 md:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-2"
        }`}
      >
        <div
          className="theme-card p-3"
          style={{
            backgroundColor: "color-mix(in srgb, var(--bg-base) 88%, transparent)",
            backdropFilter: "blur(18px) saturate(150%)",
            WebkitBackdropFilter: "blur(18px) saturate(150%)",
            boxShadow: "0 18px 60px -28px rgba(0, 0, 0, 0.55)",
          }}
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeId === item.href.slice(1)

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="nav-pill px-4 py-3 text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                    backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
                  }}
                >
                  {item.label}
                </a>
              )
            })}

            <button
              type="button"
              onClick={() => {
                copyEmail()
                setMobileMenuOpen(false)
              }}
              className="nav-pill px-4 py-3 text-left text-sm font-medium transition-colors"
              style={{
                color: mailCopied ? "var(--accent)" : "var(--text-muted)",
                backgroundColor: "transparent",
              }}
            >
              {mailCopied ? "Email copied" : "Copy email"}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
