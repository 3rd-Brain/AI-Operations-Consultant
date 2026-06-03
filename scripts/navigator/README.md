# Navigator

A local **wiki + dashboard** over an AI-Ops engagement library — the visual companion
to the `ai-ops` skill. Read the library as rendered pages, edit any `.md` in place, see
the org chart and per-workflow step maps, and grade each page against the AI-Ops
frameworks. Zero npm dependencies — Node built-ins only (Mermaid + marked load from CDN,
so first paint needs internet).

The `ai-ops` skill launches this for the operator; it can also be run standalone.

## Run

The navigator serves whatever folder is `ROOT` (defaults to the current working
directory). Point it at the engagement library (the `{{output_root}}` the skill writes to):

```bash
ROOT="<company-library-dir>" node scripts/navigator/server.mjs --port 4173
# then open http://localhost:4173
```

Or from inside the library folder: `node /path/to/scripts/navigator/server.mjs`.

It binds to `127.0.0.1` only, reads/writes strictly inside `ROOT`, and only `.md` files
are writable. Stop with Ctrl-C.

## Views

| View | What it does |
|------|--------------|
| **🏠 Dashboard** | Maturity level, binding C, People→Process→Tools lever, 5-pillar readiness, workflows by P0/P1/P2, library completeness, and top pains — generated live from the files + grades. |
| **👥 Org & Roles** | Org chart from each role's `**Reports to:**`, with workflows owned per role (from each workflow's `**Owner role:**`) and a by-department roll-up. |
| **🔀 Workflow Maps** | Each workflow as a step flow, color-coded by role and tool, with decision branches and exception paths. |
| **📄 Pages** | Every `.md` as a rendered page (mermaid blocks render as live diagrams), with a Read/Edit toggle that saves to disk and a framework grade panel. |

## Conventions it reads

- **Org chart** — role pages carry `**Department:**` and `**Reports to:** <name>`.
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

Grades persist to `<ROOT>/.ai-ops/navigator-grades.json`. The form adapts to the page's
category: company profile (Maturity 1–5 · binding C · lever · 5-pillar readiness),
workflows (Priority · KOODAR target · 4-Stage AI · friction · status), roles/tools
(readiness · status). Changing a grade updates the chips, sidebar, dashboard, and maps live.
