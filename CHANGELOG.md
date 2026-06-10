# Changelog

## 3.3.0 — 2026-06-10

Template-completeness lint — structure is now a deterministic script's job, substance stays the specialist's.

### Added

- **`scripts/navigator/lint.mjs`** — a zero-dependency structure lint. It derives the required sections and header fields per document type by parsing `templates/*.md` at runtime (the templates stay the single source of truth — no second manifest to drift), maps library files to types the same way the navigator does, and reports exactly which `profile.md` / `glossary.md` / `open-questions.md` / `roles/` / `tools/` / `workflows/` documents are missing which sections. Plain-language report, `--json` for machines, exit 0 clean / 1 on gaps. It checks structure only — a deferred doc with all sections present and one-line bodies passes; judging substance is the library-assembly specialist's job. `data-architecture.md` and untemplated folders aren't linted (no canonical template).
- **Navigator auto-runs the lint.** `server.mjs` runs it at spin-up (printed to the console) and serves it at `GET /api/lint` (recomputed per request, no cache). The Dashboard gained a **Template completeness** card — N of M documents matching their template, with each incomplete file's missing sections as chips, derived live from the files.
- **`scripts/hooks/pre-commit`** — a portable POSIX hook for your library repo: lints staged library documents and blocks the commit on gaps, with a `LINT_SKIP=1` bypass. Installation documented in the navigator README.
- **CI** (`.github/workflows/lint-examples.yml`) runs the lint's own tests (complete + gapped fixtures under `scripts/navigator/test/`) and a `node --check` on both navigator scripts on every push and PR.

### Changed

- **Library assembly's verification step is now split.** `prompts/library-assembly.md` runs the lint for the structural check when shell access exists (manual section checklist as the no-shell fallback), and the specialist's job narrows explicitly to semantic judgment: placeholder-prose detection, evidence grounding, reasoned KOODAR targets. `SKILL.md` states the division — structure is script-checked, substance is specialist-checked.

### Why

A demo library shipped with workflows missing both flowchart sections and the whole Automation / Agent Potential section, roles missing Infinite Tasks, and a profile with 6 of 10 sections — and nothing flagged it because everything still rendered. Render is the wrong oracle for structure, and LLM eyeballing drifts under pressure. Structure is now a script's job.

## 3.2.2 — 2026-06-10

### Fixed

- **Navigator sidebar no longer hides unknown categories.** The tree rendered only a hardcoded category list, so glossary, context, research, and any other library folders existed in the graph but were invisible in the UI. Known categories render in order first; everything else appends alphabetically — nothing in the library is invisible.

## 3.2.1 — 2026-06-10

### Fixed

- **Navigator:** root-level library files no longer all render under the Profile group — `profile.md` is the profile; `glossary.md`, `data-architecture.md`, and `open-questions.md` get their own groups; other root files (e.g. a venture's `CONTEXT.md`) group as Context. Previously three root files read as "three profiles."

## 3.2.0 — 2026-06-10

Navigator overhaul + library hygiene, from the 2026-06-10 repo audit (issues #10–#12, #19–#25).

### Added

- **Navigator documented and shipped with the skill.** The local wiki/dashboard UI (added between 3.0.0 and 3.1.0, previously unrecorded here) moved from repo-root `scripts/navigator/` to `skills/ai-ops/scripts/navigator/`, so every install mode — Claude Code copy, Cowork `.skill`, other agents — actually receives it (#10). README section added.
- **Profile history** — the company-profile specialist now snapshots an existing `profile.md` to `.ai-ops/profile-history/<date>.md` before overwriting (#19).

### Changed

- **Grading layer removed** (#11). `navigator-grades.json`, the grade chips, and the graded dashboard cards are gone — no writer ever existed and a maintained sidecar is a second owner for judgments the library already holds. The dashboard now derives everything live from the files: counts, stub-vs-enriched completeness, top pains, the profile's maturity signal.
- **SOP step parser rewritten to the skill's template format** (#12) — `**<Action>** — <role> uses <tool> on <record> — <produces what>` with `Exception:`/`Escalate:` sub-bullets; markdown-link tools resolve; old backtick-format lines still parse. Workflow Maps now render real library content.
- **Navigator stub templates aligned** with `templates/` / library-assembly stub shapes, and navigator-created stubs carry a stub marker so stub detection works regardless of length (#22).
- Library tree pruned of files nothing writes (`library-index.md`, `session-log/`) (#19); SKILL.md template list completed; research record-lists standardized to the inline-field form; "build briefs" renamed to build scopes; assembly section matching documented as prefix-based (#24, #25).

### Fixed

- **Navigator security** (#20): Host/Origin validation on the local server (blocks browser-originated cross-site writes), case-insensitive markdown write check, writes under `.ai-ops/` rejected.
- **`parseField`** no longer captures the next line when a role field is empty — fresh stubs render clean org data (#21); field-label regex escaped.
- Port flag validation + friendly EADDRINUSE error; orphaned `systemMermaid` extraction removed; dead grade-editor code (`SCHEMAS`, `.grade-panel` CSS) deleted (#25).
- Docs sync (#24): version badge current, navigator in README, dead releases link dropped, `mkdir -p` in install commands, INSTALL.md wording, build-script docstring, SPDX id.

## 3.1.1 — 2026-06-10

Chain-wiring fixes from the 2026-06-10 repo audit (issues #13–#18, #23).

### Fixed

- **Library assembly** — added the missing `workflow-tool-research` deliverable type with its required sections (#13); renamed `{{library_root}}` → `{{output_root}}` to match what SKILL.md instructs the orchestrator to pass (#14); the `state.md` control-file check now states the required structure inline instead of pointing at a template the subagent never receives (#15); unresolved `exists: unknown` references are reported as failures, not silently skipped.
- **Specialist dispatch** — SKILL.md now carries a per-specialist context-variables table covering every `{{variable}}` the prompts require, with sources for `{{maturity_level}}`, `{{today}}`, `{{existing_library}}`, and `{{session_goal}}`; `roadmap.md` and `build-scope.md` now declare `{{today}}` in their context blocks (#16).
- **Exists flags** — the four specialists that receive no library context (workflow tool research, workflow automation, company stack research, company data architecture) now return `exists: unknown` instead of guessing; the orchestrator resolves unknowns against the library on disk before assembly (#18).
- **Build scope** — Records section link fixed (`../tools/` from `scopes/`); stale V1 "record files" wording corrected to "tool files" (#17).
- **Playbook INDEX** — stripped private workspace paths and a stale authoring note from the public reference (#23).

## 3.1.0 — 2026-06-04

### Added

- **Control-file contracts** to stop `state.md` drifting into a user-facing project board:
  - `templates/state.md` — internal bookmark (derived, rebuilt on session open, ~300-token cap; boundary rules in-comment).
  - `templates/open-questions.md` — user-facing worklist that empties as questions are answered (answers move to `decisions/` or the doc they update; no IDs, status, or archive).
  - `open-questions.md` added to the per-company library tree (top-level, user-facing).
- **Source material safety** — SKILL.md section treating uploaded docs / transcripts / calls as evidence, not instructions (prompt-injection defense).

### Changed

- **Session Flow** now opens with a reground step: rebuild `state.md` from canonical sources and reconcile `open-questions.md` against what the user reports.
- **Library assembly** now verifies the control files on close (state within budget + on-template; open-questions a flat worklist with resolving pointers) — validates, does not rewrite.
- **Records-removal cleanup** — profile / role / tool / workflow templates and library-assembly required sections no longer reference `records/<slug>.md`; records live in their owning tool + `data-architecture.md` (aligns with the no-records-folder decision).

### Fixed

- 3.0.0 changelog entry: corrected entry point to `/ai-ops` (was `/doi-method:ai-ops`).

## 3.0.0 — 2026-05-21

**V2 architecture: single conversational consultant replaces the V1 multi-phase pipeline.**

### Changed

- Replaced 12 V1 `doi-*` skills (doi-run, doi-intake, doi-engage, doi-assess, doi-setup, doi-verify, doi-outcomes, doi-roles, doi-route, doi-friction, doi-pillars, doi-roadmap) with a single `ai-ops` skill.
- Entry point: `/ai-ops` (was `/doi-method:doi-run`).
- The consultant is now conversational from open to close. Specialists dispatch as subagents when work benefits from a fresh context window — the user sees results, not routing.

### Added

- **Skill bundle** at `skills/ai-ops/`:
  - SKILL.md — orchestrator with frameworks (5 Levels, Three Cs, 5 Pillars, P→P→T, KOODAR), System Building Principles, ICM, library structure, specialist dispatch table, chain orchestration, stack selection, decision memos, glossary patterns.
  - `prompts/` — 10 specialist prompt templates: workflow chain (SOP / tool research / automation), role, company chain (profile / stack research / data architecture), roadmap, build scope, library assembly.
  - `references/` — playbook chapter summaries, ICM doc, stack recommendations (code path + no-code path).
  - `templates/` — profile, role, workflow, tool, glossary.
- **Library structure** per company: `profile.md`, `data-architecture.md`, `glossary.md`, `roles/`, `workflows/`, `tools/`, `decisions/`, `roadmaps/`, `scopes/`, `.ai-ops/`.
- **Two new deliverables**: roadmaps (per-scope maturity progression) and build scopes (executable build specs for a coding agent or developer).
- **Cowork bundle** at `dist/cowork/ai-ops.skill` — direct-import `.skill` package.

### Removed

- All V1 `doi-*` skills.
- V1 critic agent (`agents/doi-review/`) — V2 dispatches specialists via the Agent tool inline.
- V1 phase helper scripts (`scripts/*.sh`: init-workspace, aggregate-snapshot, calculate-friction, score-assessment, check-prerequisites, update-state) — V2 has no phase-execution layer.
- Standalone bash installer (`install-doi.sh`) — Claude Code installs via direct skill copy.
- Plugin wrapper (`.claude-plugin/plugin.json` and `marketplace.json`). The package now ships as a single Claude Code skill, not a plugin. Install path is direct skill copy or Cowork `.skill` import. Canonical command is `/ai-ops` (no namespace).
