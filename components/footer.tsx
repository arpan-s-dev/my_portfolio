"use client"

import Link from "next/link"
import { Mail, Github, Linkedin } from "lucide-react"
import { useCopyEmail } from "@/lib/contact"

const externalLinks = [
  { label: "GITHUB", href: "#", icon: Github },
  { label: "LINKEDIN", href: "#", icon: Linkedin },
]

export function Footer() {
  const { copied: mailCopied, copy: copyEmail } = useCopyEmail()

  return (
    <footer className="px-6 py-16">
      <div className="mx-auto max-w-[1200px]">
        {/* Divider */}
        <div
          className="mb-12 h-px w-full"
          style={{ backgroundColor: "var(--accent)" }}
        />

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
          {/* Email: copies to clipboard, flashes "COPIED" for 2s */}
          <button
            type="button"
            onClick={copyEmail}
            aria-label={mailCopied ? "Email copied to clipboard" : "Copy email address"}
            className="flex items-center gap-2 text-xs font-medium tracking-widest transition-colors hover:opacity-80 min-w-[88px]"
            style={{
              color: mailCopied ? "var(--accent)" : "var(--text-muted)",
            }}
          >
            <Mail className="h-4 w-4" />
            <span aria-live="polite">{mailCopied ? "COPIED" : "EMAIL"}</span>
          </button>

          {externalLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 text-xs font-medium tracking-widest transition-colors hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p
          className="text-center text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          © 2026 arpan.sdev
        </p>
      </div>
    </footer>
  )
}
