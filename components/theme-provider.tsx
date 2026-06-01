"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "arthur" | "atie"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const defaultContext: ThemeContextType = {
  theme: "arthur",
  toggleTheme: () => {},
}

const ThemeContext = createContext<ThemeContextType>(defaultContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("arthur")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("portfolio-theme") as Theme | null
    if (stored && (stored === "arthur" || stored === "atie")) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("portfolio-theme", theme)
      const html = document.documentElement
      if (theme === "atie") {
        html.classList.add("theme-atie")
      } else {
        html.classList.remove("theme-atie")
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "arthur" ? "atie" : "arthur"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
