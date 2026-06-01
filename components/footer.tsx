import Link from "next/link"
import { Mail, Github, Linkedin } from "lucide-react"

const footerLinks = [
  { label: "EMAIL", href: "mailto:placeholder@example.com", icon: Mail },
  { label: "GITHUB", href: "#", icon: Github },
  { label: "LINKEDIN", href: "#", icon: Linkedin },
]

export function Footer() {
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
          {footerLinks.map((link) => (
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
        
        {/* Quote */}
        <p 
          className="mb-6 text-center font-display text-sm italic"
          style={{ color: "var(--text-muted)" }}
        >
          {'"Only a slave quantifies his existence with productivity." — Dostoevsky'}
        </p>
        
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
