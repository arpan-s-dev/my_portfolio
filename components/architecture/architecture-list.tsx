"use client"

import { useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { BarChart3, Zap, TrendingUp, Activity, Github } from "lucide-react"
import { MermaidDiagram } from "@/components/architecture/mermaid-diagram"

interface TechStackRow {
  layer: string
  choice: string
  why: string
}

interface ImplementationSection {
  heading: string
  body: string[]
}

interface OutcomesData {
  status?: string
  roadmap?: string[]
}

interface SystemDesignDiagram {
  label: string
  chart: string
}

interface ArchitectureProject {
  id: string
  title: string
  tags: string[]
  description: string
  stats: { label: string; value: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[]
  category: string
  github?: string
  systemDesignDiagram?: string
  systemDesignDiagrams?: SystemDesignDiagram[]
  techStack?: TechStackRow[]
  implementation?: ImplementationSection[]
  outcomes?: OutcomesData
}

/* ---------- shared tab-content helpers ---------- */

const panelStyle = {
  borderColor: "var(--border-faint)",
  borderRadius: "var(--radius-theme)",
  backgroundColor: "var(--bg-elevated)",
} as const

function SectionLabel({
  children,
  className = "mb-4",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={`text-xs font-medium uppercase tracking-[0.2em] ${className}`}
      style={{ color: "var(--accent)" }}
    >
      {children}
    </p>
  )
}

// Renders inline `code` spans inside body strings.
function renderInline(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 text-[0.85em]"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--accent)",
            borderRadius: "var(--radius-theme)",
            fontFamily:
              "var(--font-jetbrains), ui-monospace, SFMono-Regular, monospace",
          }}
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function TechStackTable({ rows }: { rows: TechStackRow[] }) {
  return (
    <div>
      <SectionLabel>Stack</SectionLabel>
      <div className="overflow-x-auto">
        <div
          className="grid gap-px min-w-[640px]"
          style={{
            gridTemplateColumns:
              "minmax(140px, 1fr) minmax(170px, 1.2fr) minmax(0, 2fr)",
            backgroundColor: "var(--border-faint)",
            borderRadius: "var(--radius-theme)",
            overflow: "hidden",
          }}
        >
          {(["Layer", "Choice", "Rationale"] as const).map((h) => (
            <div
              key={h}
              className="px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em]"
              style={{
                color: "var(--text-muted)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              {h}
            </div>
          ))}
          {rows.flatMap((row) => [
            <div
              key={`${row.layer}-layer`}
              className="px-4 py-3 text-xs uppercase tracking-wider"
              style={{
                color: "var(--text-muted)",
                backgroundColor: "var(--bg-elevated)",
              }}
            >
              {row.layer}
            </div>,
            <div
              key={`${row.layer}-choice`}
              className="px-4 py-3 text-sm font-display font-semibold"
              style={{
                color: "var(--text-primary)",
                backgroundColor: "var(--bg-elevated)",
              }}
            >
              {row.choice}
            </div>,
            <div
              key={`${row.layer}-why`}
              className="px-4 py-3 text-sm"
              style={{
                color: "var(--text-muted)",
                backgroundColor: "var(--bg-elevated)",
                lineHeight: 1.55,
              }}
            >
              {renderInline(row.why)}
            </div>,
          ])}
        </div>
      </div>
    </div>
  )
}

function ImplementationSections({
  sections,
}: {
  sections: ImplementationSection[]
}) {
  return (
    <div>
      <SectionLabel>Implementation Notes</SectionLabel>
      <div className="space-y-6">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <h4
              className="font-display text-base font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {section.heading}
            </h4>
            <div className="space-y-2">
              {section.body.map((para, pIdx) => (
                <p
                  key={pIdx}
                  className="text-sm"
                  style={{ color: "var(--text-muted)", lineHeight: 1.6 }}
                >
                  {renderInline(para)}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OutcomesPanel({ data }: { data: OutcomesData }) {
  return (
    <div className="space-y-6">
      {data.status && (
        <div
          className="p-4 border-l-2"
          style={{
            borderColor: "var(--accent)",
            backgroundColor: "var(--bg-card)",
            borderRadius: "var(--radius-theme)",
          }}
        >
          <SectionLabel className="mb-2">Status</SectionLabel>
          <p
            className="text-sm"
            style={{ color: "var(--text-primary)", lineHeight: 1.6 }}
          >
            {renderInline(data.status)}
          </p>
        </div>
      )}
      {data.roadmap && data.roadmap.length > 0 && (
        <div>
          <SectionLabel>Roadmap</SectionLabel>
          <ul className="space-y-2.5">
            {data.roadmap.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-sm">
                <span
                  className="mt-[0.55rem] inline-block h-1 w-1 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                <span
                  style={{ color: "var(--text-muted)", lineHeight: 1.6 }}
                >
                  {renderInline(item)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const loadBoardDiagram = `flowchart LR
    subgraph Sources["Load Board Sources"]
        DAT["DAT Mock Adapter<br/>broker-posted"]
        TS["Truckstop Mock Adapter<br/>broker-posted"]
        AR["Amazon Relay Mock Adapter<br/>direct shipper"]
        FUT["Future: Real APIs<br/>auth sessions"]
    end

    subgraph Backend["FastAPI Backend"]
        REG["Adapter Registry"]
        AGG["Aggregator<br/>parallel fan-out"]
        NORM["Unified Load Schema<br/>normalization"]
        API["REST API<br/>filters and search"]
    end

    subgraph Frontend["Next.js Frontend"]
        TABLE["Load Table + Filters"]
        DETAIL["Load Detail View"]
        BROKER{"Broker<br/>present?"}
        BCARD["Broker Contact Card"]
        SCARD["Direct Shipper Card"]
    end

    DAT --> REG
    TS --> REG
    AR --> REG
    FUT -.planned.-> REG
    REG --> AGG
    AGG --> NORM
    NORM --> API
    API --> TABLE
    API --> DETAIL
    DETAIL --> BROKER
    BROKER -->|Yes| BCARD
    BROKER -->|No| SCARD`

const docMatcherDiagram = `flowchart LR
    IN["Input PDFs<br/>BOL + Rate Con"]

    subgraph Extract["Extraction"]
        direction TB
        CLS["classify_pdf<br/>native / scan / photo"]
        TXT["extract_text<br/>pdfplumber or<br/>PyMuPDF + Tesseract"]
        BR["detect_broker<br/>registry lookup"]
        RGX["extract_fields_regex<br/>general + broker-specific"]
        FCHK{"3+ critical<br/>fields?"}
        CLAUDE["extract_with_claude<br/>Haiku text / vision"]

        CLS --> TXT --> BR --> RGX --> FCHK
        FCHK -->|No| CLAUDE
    end

    subgraph Match["Matching"]
        direction TB
        SCORE["match_documents<br/>100-pt additive"]
        DEC{"Score?"}
        AUTO["Auto-match"]
        MAN["Manual review"]
        NM["No match"]

        SCORE --> DEC
        DEC -->|"70+"| AUTO
        DEC -->|"50-69"| MAN
        DEC -->|"<50"| NM
    end

    subgraph Out["Output"]
        direction TB
        ORG["organize_files<br/>output / BROKER /"]
        XLS["write_spreadsheet<br/>openpyxl + hyperlinks"]
        ORG --> XLS
    end

    IN --> CLS
    FCHK -->|Yes| SCORE
    CLAUDE --> SCORE
    AUTO --> ORG
    MAN --> ORG`

const freightMatcherPipeline = `flowchart LR
    IN["Input PDFs<br/>BOL + Rate Con"]

    subgraph Extract["Extraction (inherited from POD_RC_AUTO_OCR)"]
        direction TB
        CLS["classify_pdf"]
        TXT["extract_text<br/>pdfplumber / Tesseract"]
        FIELDS["extract_fields_regex<br/>+ Claude fallback"]
        CLS --> TXT --> FIELDS
    end

    subgraph Serialize["Serialization (Ditto)"]
        SER["[COL] load [VAL] LD100003<br/>[COL] pickup [VAL] Atlanta GA ..."]
    end

    subgraph Block["Hybrid Blocking"]
        direction TB
        STRUCT["Structural keys<br/>shared ZIP / PO"]
        BI["Bi-encoder<br/>all-MiniLM-L6-v2<br/>top-k semantic"]
        UNION["Union → candidates"]
        STRUCT --> UNION
        BI --> UNION
    end

    subgraph Rerank["Cross-Encoder Rerank"]
        CE["distilbert-base-uncased<br/>fine-tuned<br/>match probability"]
    end

    subgraph Decide["Decision"]
        direction TB
        SCORE{"p ≥ threshold?"}
        AUTO["Auto-match"]
        FB["Fallback to heuristic<br/>if model missing"]
        SCORE -->|Yes| AUTO
        SCORE -->|No| FB
    end

    subgraph Analytics["Analytics Layer"]
        direction TB
        DUCK["DuckDB loads table"]
        VIEWS["SQL views<br/>lane_summary · broker_scorecard<br/>match_quality · exception_queue"]
        EXP["Parquet / CSV exports"]
        DUCK --> VIEWS --> EXP
    end

    IN --> CLS
    FIELDS --> SER
    SER --> STRUCT
    SER --> BI
    UNION --> CE
    CE --> SCORE
    AUTO --> DUCK
    FB --> DUCK
    EXP --> BI2["Tableau / Power BI"]`

const freightMatcherClasses = `classDiagram
    class DocType {
        <<enumeration>>
        BOL
        RATE_CON
        UNKNOWN
    }
    class SourceType {
        <<enumeration>>
        NATIVE_PDF
        CLEAN_SCAN
        PHONE_PHOTO
    }
    class ExtractedDocument {
        +Path source_path
        +DocType doc_type
        +SourceType source_type
        +str broker
        +str load_number
        +str broker_po
        +date pickup_date
        +str pickup_zip
        +date delivery_date
        +str delivery_zip
        +float weight_lbs
        +float rate_amount
        +str extraction_method
        +float confidence
    }
    class Match {
        +ExtractedDocument bol
        +ExtractedDocument rate_con
        +float score
        +str match_type
        +List~str~ reasons
    }
    ExtractedDocument --> DocType
    ExtractedDocument --> SourceType
    Match --> ExtractedDocument : bol
    Match --> ExtractedDocument : rate_con

    class Pipeline {
        +process_document(path) ExtractedDocument
        +process_folder(dir) List~ExtractedDocument~
    }
    class HeuristicMatcher {
        +score_pair(bol, rc) tuple
        +match_documents(docs) tuple
    }
    class FellegiSunter {
        +fit(pairs) FellegiSunter
        +score(bol, rc) float
        +calibrate_threshold(val) FellegiSunter
        +predict(bol, rc) int
    }
    class BiEncoderBlocker {
        +candidate_fn(rcs, top_k) CandidateFn
    }
    class HybridBlocker {
        +candidate_fn(rcs, top_k) CandidateFn
    }
    class CrossEncoderMatcher {
        +score(bol, rc) float
        +scorer() Scorer
    }
    class MLMatcher {
        +build_ml_matcher(docs, model_path, blocking)
        +match_documents_ml(docs, scorer, candidate_fn) tuple
    }
    class AnalyticsWarehouse {
        +load_to_duckdb(matches, unmatched, db)
        +run_query(name, db) DataFrame
        +headline_kpis(db) dict
        +export_views(db, out, fmt) List~Path~
    }

    Pipeline ..> ExtractedDocument : produces
    HeuristicMatcher ..> Match : produces
    MLMatcher ..> Match : produces
    HybridBlocker --> BiEncoderBlocker : wraps
    MLMatcher --> HybridBlocker : blocks with
    MLMatcher --> CrossEncoderMatcher : reranks with
    FellegiSunter ..> Match : baseline
    AnalyticsWarehouse ..> Match : ingests`

const freightMatcherSequence = `sequenceDiagram
    actor User
    participant CLI as cli.run_matcher
    participant PL as pipeline
    participant HB as HybridBlocker
    participant CE as CrossEncoderMatcher
    participant ML as match_documents_ml
    participant WH as analytics (DuckDB)

    User->>CLI: matcher process samples/input --matcher ml
    CLI->>PL: process_folder(input_dir)
    PL-->>CLI: List~ExtractedDocument~
    CLI->>ML: build + match (ml strategy)
    loop per BOL
        ML->>HB: candidate_fn(bol, rcs)
        HB-->>ML: candidate Rate Cons (ZIP/PO ∪ top-k)
        ML->>CE: score(bol, candidate)
        CE-->>ML: match probability
    end
    ML-->>CLI: (matches, unmatched)
    CLI-->>User: Excel workbook + summary
    User->>WH: matcher analytics build / export
    WH-->>User: DuckDB views + Parquet for Tableau/Power BI`

const lodestarDiagram = `flowchart TB
    subgraph Device["Galaxy S25 Ultra<br/>airplane mode"]
        UI["Jetpack Compose<br/>SafeGuide shell"]
        VM["MainViewModel<br/>shared state"]
        DEMO["Demo scenarios<br/>judge-safe flows"]
    end

    subgraph Triage["Offline assistance"]
        SAFE["SafetyTree<br/>deterministic severity"]
        ORCH["TriageOrchestrator"]
        AI["Qwen3 on Snapdragon NPU<br/>ExecuTorch + QNN"]
    end

    subgraph Orient["Spoof-aware orientation"]
        POS["PositionStateMachine<br/>GPS trust state"]
        SOL["SolarCompass<br/>day heading"]
        STAR["StarNavigationPipeline<br/>night-sky solve"]
        SPOOF{"GPS spoofed?"}
    end

    subgraph Support["Offline data + actions"]
        HOSP["HospitalFinder<br/>bundled SF JSON"]
        MED["Medical help<br/>field kit + wound checks"]
        COMM["Translate + SOS helper"]
    end

    UI --> VM
    DEMO --> VM
    VM --> SAFE
    SAFE --> ORCH
    ORCH --> AI
    VM --> POS
    POS --> SPOOF
    SPOOF -->|No| SOL
    SPOOF -->|Yes| STAR
    VM --> HOSP
    VM --> MED
    VM --> COMM`

const floodLensArchitecture = `flowchart LR
    subgraph UI["Front Ends"]
        STATIC["demo_static/<br/>in-browser ONNX · WASM<br/>(live on HF Spaces)"]
        WEB["web/<br/>React + Vite"]
        GRADIO["demo/<br/>Gradio app"]
    end

    subgraph API["api/ — FastAPI"]
        H["GET /health"]
        S["GET /samples"]
        P["POST /predict"]
    end

    subgraph CORE["ml/space_mapper — ML core"]
        IOP["io.py<br/>GeoTIFF / mask I/O"]
        DS["datasets.py<br/>manifests + splits"]
        INF["inference.py<br/>heuristic + checkpoint"]
        UNET["models/<br/>Tiny U-Net"]
        LOSS["losses.py<br/>weighted BCE + Dice"]
        MET["metrics.py<br/>IoU · Dice · P · R"]
    end

    CKPT[("tiny_unet_diverse<br/>.pt / .onnx")]

    STATIC --> CKPT
    WEB -->|image / sample id| P
    P --> INF
    GRADIO --> INF
    INF --> UNET
    INF --> IOP
    UNET --> CKPT
    DS --> IOP
    LOSS -.training only.-> UNET
    MET -.evaluation.-> INF`

const floodLensClasses = `classDiagram
    class PredictionResult {
        +ndarray mask
        +str method
        +str details
    }
    class TinyUNet {
        +int in_channels
        +int out_channels
        +int base_channels
        +forward(x) Tensor
    }
    class SegmentationDataset {
        +Sequence~SegmentationRecord~ records
        +__getitem__(i) tuple
        +__len__() int
    }
    class SegmentationRecord {
        +Path image_path
        +Path mask_path
        +str split
    }
    class inference {
        <<module>>
        +heuristic_predict(image, disaster, threshold) PredictionResult
        +predict_with_checkpoint(image, ckpt, threshold) PredictionResult
        +predict_file(path, out, ckpt) PredictionResult
    }
    class losses {
        <<module>>
        +soft_dice_loss(logits, targets) Tensor
        +make_criterion(name, pos_weight) Criterion
        +compute_pos_weight(records) float
    }
    class metrics {
        <<module>>
        +binary_iou(y_true, y_pred) float
        +dice_f1(y_true, y_pred) float
        +precision(y_true, y_pred) float
        +recall(y_true, y_pred) float
    }

    SegmentationDataset --> SegmentationRecord : yields
    SegmentationDataset --> TinyUNet : feeds batches
    inference ..> TinyUNet : loads checkpoint
    inference ..> PredictionResult : produces
    TinyUNet ..> losses : trained with
    inference ..> metrics : scored by`

const floodLensSequence = `sequenceDiagram
    actor User
    participant Page as Browser demo
    participant API as FastAPI /predict
    participant AD as MLSpaceMapperAdapter
    participant FB as FallbackHeuristic
    participant UNet as Tiny U-Net (ONNX)

    User->>Page: Upload chip or pick a sample
    Page->>Page: Read bands, resize to 128
    alt In-browser live demo
        Page->>UNet: sigmoid(logits) in WASM
        UNet-->>Page: probability map
    else Server path
        Page->>API: POST image / sample id
        API->>AD: predict(image)
        alt ml.space_mapper available
            AD-->>API: PredictionResult
        else package missing
            AD->>FB: fallback
            FB-->>API: heuristic mask
        end
        API-->>Page: mask + water %
    end
    Page-->>User: Blue overlay + water %`

const architectureProjects: ArchitectureProject[] = [
  {
    id: "floodlens",
    title: "FloodLens — Satellite Flood Segmentation",
    tags: ["Deep Learning", "Edge AI", "Geospatial"],
    description: "Pixel-level flood-water segmentation from Sentinel-2 optical imagery. A Tiny U-Net trained with an imbalance-aware loss beats the classical NDWI heuristic ~6× (IoU 0.68), and the ~0.5 MB model is exported to ONNX to run entirely in-browser via WebAssembly — no GPU server at inference time.",
    github: "https://github.com/arpan-s-dev/floodlens",
    stats: [
      { label: "IoU (held-out)", value: "0.68", icon: TrendingUp },
      { label: "vs NDWI heuristic", value: "~6×", icon: Zap },
      { label: "In-browser model", value: "~0.5 MB", icon: BarChart3 },
      { label: "Chips / Countries", value: "102 / 10", icon: Activity }
    ],
    category: "AI Pipelines",
    systemDesignDiagrams: [
      { label: "System architecture (two front ends, one ML core)", chart: floodLensArchitecture },
      { label: "Domain model + components (UML)", chart: floodLensClasses },
      { label: "How a prediction flows (edge + server)", chart: floodLensSequence }
    ],
    techStack: [
      { layer: "Model", choice: "Tiny U-Net (encoder–decoder CNN)", why: "Skip-connection segmentation net kept deliberately small (~0.5 MB) so it exports to ONNX and runs in-browser via WebAssembly." },
      { layer: "Loss", choice: "Weighted BCE + soft Dice", why: "Water is ~1.8% of pixels; plain `BCE` collapses to \"predict no water everywhere\". `pos_weight ≈ 91` + Dice optimizes overlap directly and fixes the collapse." },
      { layer: "Training", choice: "PyTorch + AdamW", why: "`make_criterion` / `compute_pos_weight` wire the imbalance-aware loss; 30 epochs on a CPU/CUDA build reproduce the checkpoint." },
      { layer: "Edge Inference", choice: "ONNX Runtime Web (WASM)", why: "The exported `.onnx` runs client-side — zero GPU-backed servers, live on Hugging Face Spaces." },
      { layer: "Backend (optional)", choice: "FastAPI", why: "`/health` · `/samples` · `/predict`. A lazy `MLSpaceMapperAdapter` imports the ML package if present and falls back to a heuristic otherwise, so the API runs even without `ml/`." },
      { layer: "Data", choice: "Sen1Floods11 (Sentinel-2, 13-band)", why: "102-chip, 10-country subset with a 15-chip held-out test set; downloaded at runtime, never bundled." },
      { layer: "Baseline", choice: "NDWI-like `(green − NIR)/(green + NIR)`", why: "Fixed, learning-free water index — the floor the learned model has to beat (IoU 0.11 → 0.68)." },
      { layer: "Metrics", choice: "IoU · Dice/F1 · Precision · Recall", why: "Accuracy is intentionally *not* headlined — it is misleading when 98% of pixels are the majority class." }
    ],
    implementation: [
      {
        heading: "Beating Majority-Class Collapse (the real story)",
        body: [
          "v1 — 30 Ghana chips, plain `BCE`: IoU 0.000. With ~1.8% water pixels, cross-entropy is minimized by predicting \"no water\" everywhere. The model learned nothing.",
          "Fix the loss → `weighted BCE + soft Dice` (pos_weight ≈ 91) on the *same* data: IoU 0.000 → 0.193. The imbalance-aware loss stops the collapse.",
          "Fix the data → 102 chips across 10 countries (water 1.8% → 9.9%): IoU 0.193 → 0.678. Each change was verified by re-measuring, not assumed — the full gradient derivation is in `docs/ml_math_explained.md`."
        ]
      },
      {
        heading: "Edge-First Inference",
        body: [
          "The trained Tiny U-Net is exported to ONNX (`scripts/export_onnx.py`) and served from the static `demo_static/` app, which runs the model in the browser through ONNX Runtime Web + WebAssembly.",
          "That removes the GPU-server dependency entirely: the live Hugging Face Space downloads a ~0.5 MB model once and does inference client-side. Click a sample chip or upload your own — the same code path a real user walks."
        ]
      },
      {
        heading: "Adapter + Graceful Fallback (`api/`)",
        body: [
          "`MLSpaceMapperAdapter` imports `space_mapper` lazily and probes for a `predict_image` / `segment_image` / `predict` callable. If the package — or an expected callable — is missing, `FallbackHeuristicPredictor` (a grayscale threshold) keeps `POST /predict` returning a valid mask.",
          "This means the FastAPI backend boots and serves predictions even when the heavy ML package is not installed, which keeps the demo deployable on constrained hosts."
        ]
      },
      {
        heading: "Honest Evaluation",
        body: [
          "`metrics.py` reports IoU, Dice/F1, precision, and recall from explicit `ConfusionCounts` rather than headline accuracy. The held-out set is only 15 chips, so the README states the variance openly and treats the numbers as indicative.",
          "Precision sits at ~0.70 — the model still over-paints water in places — which is surfaced as a known limitation rather than hidden."
        ]
      }
    ],
    outcomes: {
      status: "Live and interactive on Hugging Face Spaces — the ~0.5 MB U-Net runs entirely in-browser via ONNX + WebAssembly with no signup. Trained on a 102-chip, 10-country Sen1Floods11 subset; the learned model reaches IoU 0.68 / Dice 0.81 on the held-out test set, ~6× the NDWI-like heuristic baseline.",
      roadmap: [
        "Scale up chip count and train on GPU (RTX 5050 / CUDA build)",
        "Add Sentinel-1 (radar) inputs — radar sees through cloud cover that hides water in optical scenes",
        "Threshold / probability calibration to raise precision (currently ~0.70)",
        "Reference comparison against the NASA/IBM Prithvi geospatial foundation model",
        "ImpactMesh-style multi-hazard extension (flood vs. wildfire)"
      ]
    }
  },
  {
    id: "load-board",
    title: "Distributed Load Board Architecture",
    tags: ["Microservices", "Trucking"],
    description: "Adapter-pattern backend that fans out to multiple load board sources in parallel and normalizes responses to a unified schema.",
    github: "https://github.com/arpan-s-dev/UniLoadBoard",
    stats: [
      { label: "Daily Requests", value: "500K", icon: BarChart3 },
      { label: "p99 Latency", value: "80ms", icon: Zap },
      { label: "Performance Gain", value: "20%", icon: TrendingUp },
      { label: "Uptime", value: "99.9%", icon: Activity }
    ],
    category: "Microservices",
    systemDesignDiagram: loadBoardDiagram,
    techStack: [
      { layer: "Backend Framework", choice: "FastAPI", why: "Async-native, Pydantic v2 integration, auto OpenAPI docs." },
      { layer: "Schema Validation", choice: "Pydantic v2", why: "Catches malformed seed data at load time, not at runtime." },
      { layer: "Frontend Framework", choice: "Next.js 14 (App Router)", why: "RSC for the detail page, client components for interactive filters." },
      { layer: "Styling", choice: "Tailwind CSS + shadcn/ui", why: "Utility-first with unstyled primitives — no design-system lock-in." },
      { layer: "Backend Package Manager", choice: "uv", why: "Fast dependency resolution, single lock file." },
      { layer: "Frontend Package Manager", choice: "pnpm", why: "Workspace-ready, faster than npm." }
    ],
    implementation: [
      {
        heading: "Adapter Pattern",
        body: [
          "Adding a new load board is a single file: implement the `LoadBoardAdapter` abstract class, authenticate against the upstream API, and map response fields into the unified `Load` schema.",
          "The aggregator fans out to `get_all_adapters()` — drop your adapter into `registry.py` and it appears in merged results with zero changes to the aggregator, routes, or frontend."
        ]
      },
      {
        heading: "Parallel Aggregation",
        body: [
          "On each request the aggregator dispatches all registered adapters concurrently and merges the responses through the normalizer before serving them via the REST API. Filters and search run server-side against the unified schema."
        ]
      },
      {
        heading: "Mock vs Real Adapters",
        body: [
          "DAT One, Truckstop, and Amazon Relay are credential-gated (paid OAuth2 partnership, enterprise subscription, vetted Relay onboarding). The repo ships mock adapters that return the same schema and field semantics as the live integrations so the architecture is demonstrable without credentials.",
          "Swapping in a real adapter does not touch the aggregator, routes, or frontend."
        ]
      },
      {
        heading: "Conditional Broker Display",
        body: [
          "The `broker` field is `null` by design for Amazon Relay loads — Amazon is the shipper, not a brokered transaction. The frontend branches on `load.broker !== null` to render either a broker contact card (MC #, click-to-call, mailto) or a direct-shipper card with facility notes."
        ]
      }
    ],
    outcomes: {
      status: "Actively used in production by trucking companies the author has dispatched for. The architecture and schema design reflect real operational workflows, not hypothetical ones.",
      roadmap: [
        "Real DAT One API integration (partnership + OAuth2 required)",
        "Live Amazon Relay API integration (formal Relay partnership approval)",
        "Postgres persistence via Supabase — adapters write to DB, aggregator reads from it",
        "Natural-language load search via Claude API (e.g. \"flatbeds from Texas over $2.50/mi\")",
        "User saved searches with email / SMS alerts",
        "Rate-per-mile historical trends per lane",
        "Deadhead-aware routing — factor empty miles to the next load",
        "Multi-user auth with saved broker contacts"
      ]
    }
  },
  {
    id: "doc-matcher",
    title: "POD_RC_AUTO_OCR",
    tags: ["Python CLI", "OCR", "Claude AI"],
    description: "Earlier heuristic predecessor of Freight Doc Matcher. Python CLI that auto-matches Bill of Lading PDFs to Rate Confirmations using a hybrid extraction pipeline (native text → Tesseract OCR → Claude vision) and a 100-point additive heuristic scorer. Outputs a clickable Excel spreadsheet. Superseded by the transformer-based Freight Doc Matcher.",
    github: "https://github.com/arpan-s-dev/POD_RC_AUTO_OCR",
    stats: [
      { label: "PDFs / Day", value: "20–50", icon: BarChart3 },
      { label: "Per Batch", value: "<2 min", icon: Zap },
      { label: "Match Scale", value: "100 pts", icon: TrendingUp },
      { label: "Brokers Supported", value: "13", icon: Activity }
    ],
    category: "AI Pipelines",
    systemDesignDiagram: docMatcherDiagram,
    techStack: [
      { layer: "Language", choice: "Python 3.11+", why: "Modern stdlib, mature PDF tooling, first-class async." },
      { layer: "Native Text Extraction", choice: "pdfplumber", why: "Primary path for digital PDFs — fast, no external dependencies." },
      { layer: "OCR Fallback", choice: "PyMuPDF + Tesseract", why: "Handles scanned BOLs and phone photos sent in by drivers." },
      { layer: "AI Fallback", choice: "Anthropic Claude Haiku 4.5", why: "Text and vision extraction when regex captures fewer than 3 critical fields." },
      { layer: "Output", choice: "openpyxl", why: "Clickable Excel spreadsheet with hyperlinks back to renamed source PDFs." },
      { layer: "Testing", choice: "pytest + pytest-cov", why: "Coverage focused on regex extractors and the 100-pt scoring math." }
    ],
    implementation: [
      {
        heading: "Hybrid Extraction Pipeline",
        body: [
          "`classify_pdf()` tags each input as native / scan / phone photo, then routes accordingly: digital docs through pdfplumber, scans through PyMuPDF + Tesseract.",
          "Broker is detected from the first 2k characters via a registry lookup, then `extract_fields_regex()` runs general patterns followed by broker-specific overrides.",
          "If fewer than 3 critical fields are captured, `extract_with_claude()` falls back to Claude Haiku — text-only first, vision second for image-heavy documents."
        ]
      },
      {
        heading: "100-Point Additive Matching",
        body: [
          "Each BOL is scored against every Rate Con on a 0–100 scale. An exact load number is an immediate 100; otherwise points accumulate from broker PO# (+40), pickup/delivery ZIP (+20 each), pickup/delivery dates within ±1 day (+15 each), weight within 5% (+10), fuzzy city match >85 (+5 each), and same broker (+5).",
          "Thresholds: ≥70 auto-match · 50–69 manual review · <50 no match."
        ]
      },
      {
        heading: "File Organization & Output",
        body: [
          "Matched pairs are copied (never moved) into `output/{BROKER}/` with a deterministic naming convention, then `write_spreadsheet()` produces `loads.xlsx` with hyperlinks pointing back to each renamed file."
        ]
      },
      {
        heading: "CLI Surface",
        body: [
          "`matcher process <input_dir> [--output <dir>] [--no-claude] [--dry-run]` runs the full pipeline.",
          "`matcher classify <file>` and `matcher extract <file>` are debug helpers that print source type / extracted JSON for a single document."
        ]
      }
    ],
    outcomes: {
      status: "Built for freight dispatchers and trucking back-office staff handling 20–50 mixed broker PDFs per day. Replaces the manual inbox-sorting workflow that currently eats 30+ minutes per shift — runs end-to-end in under two minutes per batch.",
      roadmap: [
        "Web UI — Next.js + FastAPI wrapper over the CLI-first architecture",
        "Google Drive / Sheets integration — poll a shared inbox automatically",
        "Auto-learning broker templates via few-shot fine-tuning from confirmed matches",
        "Handwritten annotation OCR for driver notes scribbled on BOLs",
        "Multi-leg loads — split shipments with multiple pickup / delivery stops",
        "TMS integration — McLeod, Tai, Trimble direct API push",
        "Email ingestion — parse attachments from broker email threads directly"
      ]
    }
  },
  {
    id: "freight-doc-matcher",
    title: "Freight Doc Matcher",
    tags: ["Transformers", "Fine-Tuning", "DuckDB", "BI"],
    description: "Portfolio-grade data-science project: a fine-tuned DistilBERT cross-encoder reranks bi-encoder candidates (retrieve-then-rerank, Ditto / VLDB 2020), and a DuckDB warehouse exposes analytical SQL views that export to Parquet for Tableau / Power BI. The original 100-pt heuristic and a Fellegi–Sunter linkage model are kept as benchmark baselines.",
    github: "https://github.com/arpan-s-dev/Freight-Doc-Matcher",
    stats: [
      { label: "F1 (noisy lanes)", value: "0.65 → 0.87", icon: TrendingUp },
      { label: "Comparisons", value: "5× fewer", icon: Zap },
      { label: "Brokers", value: "13", icon: BarChart3 },
      { label: "Per Batch", value: "<2 min", icon: Activity }
    ],
    category: "AI Pipelines",
    systemDesignDiagrams: [
      { label: "Pipeline (matcher process --matcher ml → analytics)", chart: freightMatcherPipeline },
      { label: "Domain model + components (UML)", chart: freightMatcherClasses },
      { label: "End-to-end sequence", chart: freightMatcherSequence }
    ],
    techStack: [
      { layer: "Serialization", choice: "Ditto-style tagged text", why: "Converts extracted fields into `[COL] field [VAL] value` strings a transformer can read — no hand-engineered features." },
      { layer: "Bi-encoder Blocker", choice: "sentence-transformers `all-MiniLM-L6-v2`", why: "Embeds every doc; for each BOL, retrieves top-k Rate Cons. Turns 400 × 400 = 160k comparisons into ~7k." },
      { layer: "Hybrid Blocker", choice: "Structural keys ∪ semantic top-k", why: "Combines shared ZIP / PO with bi-encoder candidates — fixes cases where semantic search alone missed the right document." },
      { layer: "Cross-encoder", choice: "`distilbert-base-uncased` (fine-tuned)", why: "Reads BOL + Rate Con jointly via HuggingFace, outputs match probability. Trained on RTX 5050 GPU." },
      { layer: "Baseline 1", choice: "100-pt heuristic (POD_RC_AUTO_OCR)", why: "Hand-tuned weights. Fast and accurate on clean data, collapses to F1 ≈ 0.65 under OCR noise on recurring lanes." },
      { layer: "Baseline 2", choice: "Fellegi–Sunter", why: "Classic probabilistic record-linkage model. Retained as an interpretable benchmark against the learned matcher." },
      { layer: "Analytics Warehouse", choice: "DuckDB", why: "Zero infrastructure — in-process, one file, no Postgres / Docker. Exports natively to Parquet for Tableau / Power BI." },
      { layer: "Exports", choice: "Parquet + CSV", why: "Parquet is Tableau / Power BI native; CSV is the universal fallback." },
      { layer: "Install Extras", choice: "`pip install -e \".[ml]\" \".[bi]\"`", why: "Optional extras keep the core CLI lean. If torch or a trained model is missing, `--matcher ml` falls back to the heuristic." }
    ],
    implementation: [
      {
        heading: "Layer 1 — Deep Entity Matching (`src/matcher/linkage/`)",
        body: [
          "Implements the retrieve-then-rerank architecture from Ditto (Li et al., VLDB 2020). Each document is serialized to a tagged `[COL] field [VAL] value` string before either model sees it.",
          "Block: a hybrid candidate generator combines structural keys (shared ZIP / PO) with a bi-encoder semantic top-k (`all-MiniLM-L6-v2`). On a 400-document batch this cuts 160,000 comparisons down to ~7,000.",
          "Decide: a fine-tuned `distilbert-base-uncased` cross-encoder reads a BOL and candidate Rate Con jointly and emits a match probability. On a labeled synthetic benchmark with OCR-style noise the model recovers F1 from 0.65 → 0.87 vs. the original heuristic; full methodology and numbers are in `docs/efficiency_writeup.md`."
        ]
      },
      {
        heading: "Layer 2 — SQL Analytics (`src/matcher/analytics/`)",
        body: [
          "Matched output is loaded into a DuckDB `loads` table. Four analytical SQL views are exposed: `lane_summary` (revenue per lane, avg weight), `broker_scorecard` (match rate, avg score, dollar volume per broker), `match_quality`, and `exception_queue` (unmatched documents flagged for review).",
          "`matcher analytics build` runs the pipeline + load; `matcher analytics query <name>` prints a view; `matcher analytics export --format parquet` writes Parquet (or CSV) files Tableau and Power BI can open directly. Every row derives from a real matched load — no fabricated data."
        ]
      },
      {
        heading: "Layer 3 — Reproducible Data & Training Tooling (`scripts/`)",
        body: [
          "A seeded synthetic generator (`build_training_set.py`) emits labeled pairs with OCR-style noise, hard negatives, and a recurring-lane hard mode that defeats the heuristic.",
          "`train_matcher.py` fine-tunes the cross-encoder on GPU (CUDA build required for Blackwell / RTX 5050); `benchmark_matching.py` runs the three-way comparison between the heuristic, Fellegi–Sunter, and the fine-tuned model under controlled noise."
        ]
      },
      {
        heading: "Backwards Compatibility",
        body: [
          "The ML pipeline does not change the default `matcher process` behavior — heuristic matching is still the default. The ML path is opt-in via `--matcher ml`, and if torch or a trained model is missing it falls back to the heuristic with a warning, so the core CLI always works on a stock Python install."
        ]
      }
    ],
    outcomes: {
      status: "Built on top of the POD_RC_AUTO_OCR heuristic baseline. Measured: F1 went from 0.65 → 0.87 on the recurring-lane / OCR-noise benchmark with 5× fewer comparisons. On a smaller clean held-out set the fine-tuned model scores F1 = 1.000 — full methodology in `docs/efficiency_writeup.md`.",
      roadmap: [
        "Larger labeled real-world training set — current numbers are on synthetic + held-out pairs",
        "Calibrated probability outputs — currently thresholded; calibration would let downstream UIs surface confidence",
        "Online learning loop — confirmed matches from the dispatcher UI feed back into fine-tuning",
        "Vector index for blocking at scale (FAISS / pgvector) once doc counts exceed ~10k",
        "Lane-level forecasting on the DuckDB warehouse — RPM trends, broker churn signals",
        "Power BI / Tableau template workbooks shipped alongside the Parquet exports"
      ]
    }
  },
  {
    id: "lodestar",
    title: "Lodestar",
    tags: ["Edge AI", "Android", "Hackathon Winner"],
    description: "Offline Android survival copilot built for the Qualcomm x Meta ExecuTorch Hackathon. It combines deterministic first-aid triage, spoof-aware orientation, offline hospital guidance, and an on-device Qwen path on Snapdragon hardware.",
    github: "https://github.com/arpan-s-dev/QCOM",
    stats: [
      { label: "Tracked Files", value: "112", icon: BarChart3 },
      { label: "Main Kotlin Files", value: "46", icon: Zap },
      { label: "Test Files", value: "8", icon: TrendingUp },
      { label: "Offline Demo Assets", value: "12", icon: Activity }
    ],
    category: "Edge AI",
    systemDesignDiagram: lodestarDiagram,
    techStack: [
      { layer: "App Platform", choice: "Kotlin + Jetpack Compose", why: "Native Android gave direct access to sensors, mic, and location while keeping the UI fast and field-ready." },
      { layer: "On-Device Inference", choice: "ExecuTorch `v1.0.0` + Qualcomm QNN", why: "Targets Snapdragon NPU execution locally instead of depending on a cloud model path." },
      { layer: "Model Runtime", choice: "Qwen3 hybrid `.pte` on SM8750", why: "Aligns the assistant pipeline with the Galaxy S25 Ultra demo hardware and the hackathon's edge-AI focus." },
      { layer: "Safety Logic", choice: "Deterministic `SafetyTree`", why: "Severity is computed before any generation so the highest-risk decision stays explainable and reproducible." },
      { layer: "Orientation", choice: "Solar compass + star solver + spoof detection", why: "Builds resilient heading recovery for cases where GPS is unavailable, untrusted, or intentionally spoofed." },
      { layer: "Offline Data", choice: "Bundled JSON assets", why: "Hospitals, field-kit references, and corpus data ship inside the app, matching the no-`INTERNET` constraint." }
    ],
    implementation: [
      {
        heading: "Offline-First By Constraint, Not Marketing",
        body: [
          "The app intentionally declares no `INTERNET` permission. That forces every user-facing flow to work with local assets, device sensors, and on-device logic rather than quietly falling back to cloud APIs.",
          "That constraint shapes the whole architecture: hospital lookup uses bundled JSON, triage runs through `SafetyTree`, and the assistant path only upgrades when the local Qwen runtime is available."
        ]
      },
      {
        heading: "Deterministic Triage Before Model Output",
        body: [
          "`MainViewModel` routes emergency prompts through `SafetyTree` first, then into `TriageOrchestrator`. This preserves a stable severity label even when the NPU model is warming up, missing, or replaced with a safe stub during demos.",
          "That separation is important for a safety-focused app because the system's highest-risk decision is never delegated entirely to free-form generation."
        ]
      },
      {
        heading: "Spoof-Aware Orientation Stack",
        body: [
          "The navigation path does more than read GPS. `PositionStateMachine` tracks trust state, `SolarCompass` recovers heading in daytime, and `StarNavigationPipeline` handles staged night-sky recovery with a bundled bright-star catalog.",
          "When spoofing is detected, the app can freeze to the last trusted position and surface that downgrade visibly instead of acting on bad coordinates."
        ]
      },
      {
        heading: "Hackathon Demo Reliability",
        body: [
          "Demo scenarios are built into the product so judges can see specific offline flows quickly: negation-aware triage, Powell Street hospital guidance, STAR_FIX night-sky recovery, and a wound-photo checklist.",
          "That makes the product presentation honest and repeatable under hackathon conditions where networking, lighting, and timing are unpredictable."
        ]
      }
    ],
    outcomes: {
      status: "Built for the Qualcomm x Meta ExecuTorch Hackathon and recognized with GitHub's `Copilot-Powered Build Award` for creative and effective use of GitHub Copilot. The repo already includes real device screenshots, demo scripts, and the on-device Android shell.",
      roadmap: [
        "Finish full end-to-end validation of the Qwen NPU path on the target Galaxy S25 Ultra device",
        "Expand the offline hospital dataset beyond the current San Francisco scope",
        "Replace the current wound-photo guided checklist with a true on-device vision assessment path",
        "Broaden the trust-state navigation system into more generalized field-routing and incident workflows"
      ]
    }
  }
]

const filterOptions = ["All", "Microservices", "AI Pipelines", "Full-Stack", "Edge AI"]

function ArchitectureCard({ project, index }: { project: ArchitectureProject; index: number }) {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState("System Design")
  const tabs = ["System Design", "Tech Stack", "Implementation", "Outcomes"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="theme-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: "var(--border-faint)" }}>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="theme-badge px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: theme === "arthur" ? "rgba(201, 169, 97, 0.2)" : "rgba(168, 85, 247, 0.2)",
                color: "var(--accent)"
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          className="font-display text-2xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {project.description}
        </p>

        {/* GitHub link */}
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} on GitHub`}
            className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium uppercase tracking-wider border transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--accent)",
              color: "var(--accent)",
              borderRadius: "var(--radius-theme)",
            }}
          >
            <Github className="h-3.5 w-3.5" />
            View on GitHub
          </a>
        ) : null}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b" style={{ borderColor: "var(--border-faint)" }}>
        {project.stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 text-center border-r last:border-r-0"
            style={{ borderColor: "var(--border-faint)" }}
          >
            <stat.icon className="h-5 w-5 mx-auto mb-2" style={{ color: "var(--accent)" }} />
            <p className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {stat.value}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: "var(--border-faint)" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 px-4 py-3 text-sm font-medium transition-colors"
            style={{
              backgroundColor: activeTab === tab ? "var(--bg-elevated)" : "transparent",
              color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "System Design" && (
          project.systemDesignDiagrams && project.systemDesignDiagrams.length > 0 ? (
            <div className="space-y-6">
              {project.systemDesignDiagrams.map((diagram, dIdx) => (
                <div key={dIdx}>
                  <SectionLabel className="mb-3">{diagram.label}</SectionLabel>
                  <div
                    className="border flex items-center justify-center"
                    style={{
                      borderColor: "var(--border-faint)",
                      borderRadius: "var(--radius-theme)",
                      backgroundColor: "var(--bg-elevated)",
                      minHeight: "300px",
                    }}
                  >
                    <MermaidDiagram chart={diagram.chart} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="min-h-[400px] border flex items-center justify-center"
              style={{
                borderColor: "var(--border-faint)",
                borderRadius: "var(--radius-theme)",
                backgroundColor: "var(--bg-elevated)"
              }}
            >
              {project.systemDesignDiagram ? (
                <MermaidDiagram chart={project.systemDesignDiagram} />
              ) : (
                <p
                  className="text-sm uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {"// Node diagram coming soon"}
                </p>
              )}
            </div>
          )
        )}
        {activeTab === "Tech Stack" && (
          project.techStack ? (
            <div className="min-h-[400px] border p-6 md:p-8" style={panelStyle}>
              <TechStackTable rows={project.techStack} />
            </div>
          ) : (
            <div
              className="min-h-[400px] border flex items-center justify-center"
              style={panelStyle}
            >
              <p
                className="text-sm uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {"// Tech stack details coming soon"}
              </p>
            </div>
          )
        )}
        {activeTab === "Implementation" && (
          project.implementation ? (
            <div className="min-h-[400px] border p-6 md:p-8" style={panelStyle}>
              <ImplementationSections sections={project.implementation} />
            </div>
          ) : (
            <div
              className="min-h-[400px] border flex items-center justify-center"
              style={panelStyle}
            >
              <p
                className="text-sm uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {"// Implementation details coming soon"}
              </p>
            </div>
          )
        )}
        {activeTab === "Outcomes" && (
          project.outcomes ? (
            <div className="min-h-[400px] border p-6 md:p-8" style={panelStyle}>
              <OutcomesPanel data={project.outcomes} />
            </div>
          ) : (
            <div
              className="min-h-[400px] border flex items-center justify-center"
              style={panelStyle}
            >
              <p
                className="text-sm uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {"// Outcomes coming soon"}
              </p>
            </div>
          )
        )}
      </div>
    </motion.div>
  )
}

export function ArchitectureList() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredProjects = activeFilter === "All"
    ? architectureProjects
    : architectureProjects.filter((p) => p.category === activeFilter)

  return (
    <div>
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className="nav-pill px-4 py-2 text-sm font-medium border transition-colors"
            style={{
              borderColor: activeFilter === filter ? "var(--accent)" : "var(--border-faint)",
              backgroundColor: activeFilter === filter ? "var(--bg-elevated)" : "transparent",
              color: activeFilter === filter ? "var(--text-primary)" : "var(--text-muted)"
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Architecture Cards */}
      <div className="space-y-8">
        {filteredProjects.map((project, index) => (
          <ArchitectureCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  )
}
