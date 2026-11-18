# ICM — Interpretable Context Methodology

Folder structure IS the orchestration. Multi-step workflows need no framework code — numbered stage folders, markdown contracts, and plain-text handoffs do the job.

## Five-layer context hierarchy

| Layer | File | Answers | Budget |
|---|---|---|---|
| 0 | `CLAUDE.md` | "Where am I?" — workspace identity | ~800 tokens |
| 1 | `CONTEXT.md` | "Where do I go?" — routing + state | ~300 tokens |
| 2 | `stages/{NN}/CONTEXT.md` | "What do I do?" — stage contract (Inputs → Process → Outputs) | 200–500 tokens |
| 3 | `_config/`, `references/` | "What rules apply?" — stable reference | 500–2K tokens |
| 4 | `output/` | "What am I working with?" — per-run artifacts | varies |

## Folder template

```
workspace/
  CLAUDE.md                    ← Layer 0 (identity)
  CONTEXT.md                   ← Layer 1 (routing + state)
  _config/                     ← Layer 3 (shared reference: audience, voice, conventions)
  stages/
    01_name/
      CONTEXT.md               ← Layer 2 (stage contract)
      references/              ← Layer 3 (stage-specific reference)
      output/                  ← Layer 4 (working artifacts → next stage's input)
    02_name/
      ...
```

## Core rules

1. **One stage, one job.** Each stage reads a defined input, transforms it, writes a defined output.
2. **Plain text as interface.** Stages communicate through markdown files. Output of stage N becomes input to stage N+1.
3. **Layered context loading.** Each stage loads only the files its contract declares — no monolithic prompts.
4. **Every output is an edit surface.** A human can open, read, edit any stage's output before the next stage runs.
5. **Configure the factory, not the product.** `_config/` and `references/` are stable. `output/` changes each run.
6. **Layer 3 vs Layer 4.** Reference material (Layer 3) is internalized as constraints. Working artifacts (Layer 4) are processed as input. Keep them structurally separate.

## When to use ICM

Sequential, reviewable, repeatable workflows. Content pipelines, research, deliverable production, analysis. Not for real-time collaboration or concurrent execution.
