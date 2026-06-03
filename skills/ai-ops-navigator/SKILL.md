---
name: ai-ops-navigator
description: "Use when an operator wants to browse, edit, visualize, or grade an existing AI-Ops engagement workspace in a local web UI. Launches a zero-dependency local server that renders the company library (profile / roles / tools / workflows) as a wiki + dashboard, draws an org chart and color-coded workflow step-maps, and lets the operator grade each page against the AI-Ops frameworks (5 Maturity Levels, the Three Cs, People→Process→Tools, KOODAR, the 4-Stage AI scale). Reads and writes the workspace markdown directly. Not an assessment phase — it visualizes and edits what the other skills produce."
user-invocable: true
license: GPL-3.0
metadata:
  version: 1.0.0
  author: 3rd Brain DigiOps
  category: operations
  domain: digital-operations-intelligence
  updated: 2026-06-03
---

# AI-Ops Navigator

A local **wiki + dashboard** over an AI-Ops engagement workspace. Read the library as
rendered pages, edit any `.md` in place, see the org chart and per-workflow step maps,
and grade each page against the AI-Ops frameworks. Zero npm dependencies — Node
built-ins only (Mermaid + marked load from CDN, so first paint needs internet).

## When to use

The engagement has already produced a workspace — a folder with `profile.md`,
`roles/`, `tools/`, `workflows/`, optionally `scopes/` / `roadmaps/` / `decisions/`,
and an `.ai-ops/` state folder. The operator wants to *see and manage* it, not run a
new assessment phase. Pair it with the assessment skills (`doi-assess`, `doi-engage`,
etc.), which write the files this tool reads.

## Launch

The navigator serves whatever folder is `ROOT` (defaults to the current working
directory). Start it pointed at the engagement workspace and hand the operator the URL:

```bash
ROOT="<engagement-workspace-dir>" node "${CLAUDE_PLUGIN_ROOT:-.}/skills/ai-ops-navigator/server.mjs" --port 4173
# then open http://localhost:4173
```

Or, from inside the engagement workspace:

```bash
cd <engagement-workspace-dir>
node "${CLAUDE_PLUGIN_ROOT:-.}/skills/ai-ops-navigator/server.mjs"
```

It binds to `127.0.0.1` only, reads/writes strictly inside `ROOT`, and only `.md`
files are writable. Stop it with Ctrl-C.

## What the operator gets

| View | What it does |
|------|--------------|
| **🏠 Dashboard** | Maturity level, the binding C, the People→Process→Tools lever, 5-pillar readiness, workflows split by P0/P1/P2, library completeness, and the engagement's top pains — generated live from the files + grades. |
| **👥 Org & Roles** | Org chart built from each role's `**Reports to:**`, with the workflows each role owns (from each workflow's `**Owner role:**`) and a by-department roll-up. |
| **🔀 Workflow Maps** | Each workflow as a step-by-step flow, color-coded by role and tool, with decision branches and exception paths. |
| **📄 Pages** | Every `.md` as a rendered page (mermaid blocks render as live diagrams), with a Read/Edit toggle that saves to disk and a framework grade panel. |

## Conventions it reads

- **Org chart** — role pages carry `**Department:**` and `**Reports to:** <name>` lines.
- **Workflow ownership** — workflow pages carry `**Owner role:** [name](../roles/x.md)`.
- **Workflow steps** — the `## SOP` section, one step per line:
  ```
  - [ ] **Action** — `Role` uses `Tool` — note
    - [ ] **(if condition)** **Branch action** — `Role` uses `Tool` — ⚠ exception note
  ```
  Indent two spaces to branch a step; a `(condition)` label names the branch; `⚠`
  (or `[exception]`) marks an exception path.
- **System map** — a ` ```mermaid ` block in `data-architecture.md` renders as the diagram.

## Grading

Grades persist to `<ROOT>/.ai-ops/navigator-grades.json`. The grade form adapts to the
page's category:

- **Company profile** — Maturity Level (1–5) · Binding C (Consistency / Clarity /
  Capacity) · Lever (People → Process → Tools) · 5-pillar readiness.
- **Workflows** — Priority (P0/P1/P2) · KOODAR automation target (K … KOODAR) ·
  4-Stage AI scale · Friction · Build status.
- **Roles / Tools** — Readiness · Status.

Changing a grade updates the page chips, the sidebar, the dashboard, and the maps instantly.
