# Changelog

## 3.0.0 — 2026-05-21

**V2 architecture: single conversational consultant replaces the V1 multi-phase pipeline.**

### Changed

- Replaced 12 V1 `doi-*` skills (doi-run, doi-intake, doi-engage, doi-assess, doi-setup, doi-verify, doi-outcomes, doi-roles, doi-route, doi-friction, doi-pillars, doi-roadmap) with a single `ai-ops` skill.
- Entry point: `/doi-method:ai-ops` (was `/doi-method:doi-run`).
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
