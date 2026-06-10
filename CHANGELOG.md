# Changelog

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
