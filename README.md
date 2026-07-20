# arpan.sdev — Portfolio

Personal portfolio of **Arpanjeet Singh** — a single-page Next.js site that showcases
shipped projects, their system-design architecture, and a live GitHub activity feed.
Built to feel like a piece of engineering, not a template: two switchable themes, animated
canvas visuals, per-project SVG previews, and architecture diagrams rendered live with Mermaid.

**Live:** deployed on Vercel · **Author:** [@arpan-s-dev](https://github.com/arpan-s-dev)

---

## Highlights

- **Two full themes** — *Arthur* (warm, serif, gold) and *Atie* (dark, mono, violet), toggled
  from the nav and persisted to `localStorage`. Every color flows through CSS variables
  (`--accent`, `--bg-*`, `--text-*`), so components and diagrams re-theme in one place.
- **Animated ring-reveal loader** — a drawing + spinning accent ring with the monogram fading
  up in the center, dissolving into the page in ~1.1s (and ~0.5s under reduced motion).
- **Projects tab** — cards for each shipped project, each with its own hand-built animated SVG
  preview (routing hub, doc scanner, compass, satellite segmentation grid, …).
- **Architecture tab** — per-project deep dives with **live Mermaid diagrams** (system design,
  UML class diagrams, and sequence diagrams), a tech-stack rationale table, implementation
  notes, and outcomes/roadmap — filterable by category.
- **Home dashboard** — profile card, GitHub contributions graph, a rotating "AI ecosystem"
  tech-stack graph, territory map, and achievement highlights.
- **Background canvas visuals** — ASCII sphere / tetrahedron / wave fields rendered to
  `<canvas>`, gated by `IntersectionObserver` + page-visibility and FPS-throttled so they only
  run when on-screen.
- **Accessibility** — honors `prefers-reduced-motion` throughout; animations degrade to
  static or opacity-only.

---

## Featured projects

| Project | What it is |
|---|---|
| **FloodLens** | Deep-learning flood-water segmentation from Sentinel-2 imagery; a ~0.5 MB Tiny U-Net runs in-browser via ONNX + WebAssembly (IoU 0.68, ~6× the NDWI heuristic). |
| **Lodestar** | Offline Android survival copilot (Qualcomm × Meta ExecuTorch Hackathon) with on-device Qwen inference on Snapdragon. |
| **Unified Load Board** | Adapter-pattern FastAPI backend that fans out to multiple freight load boards and normalizes to a unified schema. |
| **Freight Doc Matcher** | Fine-tuned DistilBERT cross-encoder + bi-encoder blocking, with a DuckDB analytics layer exporting to Tableau / Power BI. |
| **POD_RC_AUTO_OCR** | Python CLI matching Bills of Lading to Rate Confirmations via a hybrid Tesseract + Claude extraction pipeline. |

Each of these has a matching entry in the **Architecture** tab with rendered diagrams.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, RSC) + **React 19** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** + CSS variables; Radix UI / shadcn primitives |
| Animation | **Framer Motion** + hand-rolled `<canvas>` and SVG animations |
| Diagrams | **Mermaid** (rendered client-side, themed to match the active palette) |
| Icons | **lucide-react** |
| Fonts | Cormorant Garamond · Inter · JetBrains Mono (`next/font`) |
| Analytics | Vercel Analytics |
| Hosting | Vercel |

---

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

> The GitHub contributions graph fetches public contribution data for `arpan-s-dev`
> at build/request time (see `lib/github-contributions.ts`); no token is required for the
> public feed.

---

## Project structure

```
app/
  layout.tsx            root layout, fonts, metadata, theme provider
  page.tsx              single-page composition (home / projects / architecture)
  globals.css           theme variables, keyframes, Mermaid animation styles
components/
  home/                 profile, github activity, tech-stack graph, background canvas visuals
  projects/             projects grid + per-project animated SVG visuals
  architecture/         architecture cards, Mermaid renderer, diagram + content data
  navigation.tsx        top nav + theme toggle
  footer.tsx
  ui/                   shadcn/Radix primitives
lib/                    data helpers (e.g. GitHub contributions)
hooks/
```

To add a project: append a card to `components/projects/projects-grid.tsx` (with an optional
visual in `project-visuals.tsx`), and add a matching architecture entry with its Mermaid
diagrams in `components/architecture/architecture-list.tsx`.

---

## License

Personal project. Code is available for reference; please don't redistribute the content,
copy, or personal branding as your own.
