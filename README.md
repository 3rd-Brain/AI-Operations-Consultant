![version](https://img.shields.io/badge/version-3.0.0-blue) ![license](https://img.shields.io/badge/license-GPL--3.0-blue) ![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-orange) ![Cowork](https://img.shields.io/badge/Cowork-compatible-purple)

[Methodology](#methodology) · [Examples](#examples) · [Changelog](CHANGELOG.md) · [Issues](https://github.com/3rd-Brain/AI-Operations-Consultant/issues)

# AI Operations Consultant

A consultant that produces build specs your coding agent can ship from.

For founders and operators with an automation backlog they haven't shipped. The consultant runs a session and produces a build spec your coding agent can execute against. The conversation you'd otherwise pay a consultant $40K for.

## Quick Start

```bash
git clone https://github.com/3rd-Brain/AI-Operations-Consultant.git
cp -r AI-Operations-Consultant/skills/ai-ops ~/.claude/skills/
```

Then invoke `/ai-ops` in any Claude Code or Cowork session. Tell it what you're shipping, where to level up, or what needs documenting. Drop in meeting transcripts, recorded calls, walkthroughs, or any existing docs - the consultant pulls vocabulary and context from them directly, so you don't retype what you've already said. It builds out a living company library and produces specs your coding agents or developers can build from.

## What You Get

Every session writes to a per-company library you keep and grow over time.

- **Company profile** - what you do, who's on the team, what stack you run
- **Data architecture** - your records mapped across tools, with sources of truth and fragmentation flagged
- **Workflow SOPs** - step-by-step playbooks any teammate can run
- **Role docs** - responsibilities by cadence + KOODAR breakdown per seat
- **Roadmaps** - maturity-progression plan with priority projects and acceptance signals
- **Build scopes** - executable specs your coding agent can ship from in one sitting

Plus auto-captured `decisions/` (significant choices, dated) and `glossary.md` (your business's vocabulary).

## How It Works

You have a conversation. The consultant dispatches specialists when work benefits from a fresh context window. The deliverables come back as files in a per-company library you own.

```
   user
    │
    ▼
┌─────────────────────────┐
│  /ai-ops                │   conversational orchestrator
│  (one skill, one session) │
└──────────┬──────────────┘
           │  dispatches specialists in subagents
           ▼
┌──────────────────────────────────────────────────────────┐
│  Workflow chain   Company chain   Role   Roadmap   Build  │
│  (SOP / tools /   (profile /      Scope                   │
│   automation)      stack research /                       │
│                    data arch)                             │
└──────────┬───────────────────────────────────────────────┘
           │  writes files to the per-company library
           ▼
       <company>/
         profile.md · data-architecture.md · glossary.md
         workflows/ · roles/ · tools/
         decisions/ · roadmaps/ · scopes/
```

The library is plain markdown so you can read and edit any file directly.

## Methodology

Five frameworks the consultant applies. Source: the Digital Operations Playbook (bundled in the skill at `references/playbook/`).

- **5 Levels of Digital Operations** - where you sit on the maturity scale (Information Silos → Connectable Cloud → Unified Data Layer → Automated Workflows → AI Automation). Level 3 is the flywheel threshold.
- **Three Cs** - Consistency → Clarity → Capacity. The chain reaction you unlock as you level up. Each one is a prerequisite for the next.
- **5 Pillars** - Talent Strategy, Workflow Optimization, Digital Architecture, Knowledge Management, AI Automation. What you actually build to move the levels.
- **People → Process → Tools** - the implementation sequence within every pillar. Skip it and you ship shelfware.
- **KOODAR** - the AI capabilities vocabulary (Know / Observe / Orient / Decide / Act / Review). The language for designing and documenting AI tools and agents.

## What to ask for and what the consultant produces.

| What you say                                           | What you get                                                                                                                                         |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Map how our business runs"                            | The full picture: a company profile, cross-tool data architecture, and entries for every tool you operate on                                         |
| "Walk through our quoting workflow"                    | A step-by-step SOP a teammate can follow, plus research on every tool in the workflow and the automation opportunities buried in it                  |
| "Document the head of sales role"                      | A role doc with responsibilities by cadence, objectives and metrics, and a KOODAR capability breakdown                                               |
| "Give me a roadmap to get our marketing team AI ready" | A sequenced plan: priority projects, acceptance signals, scope-specific pitfalls, and the library work that needs to happen first                    |
| "Scope the carrier-quote extractor"                    | A build spec your coding agent can ship from: stack picks, input/output contracts, tool docs and APIs, examples, and test-driven acceptance criteria |

Anything mentioned but not yet in the library - a tool, a role, a workflow - gets a stub file created automatically. The library grows with every session.

## Compatibility

The skill ships as a folder (`skills/ai-ops/`) and a zipped bundle (`dist/cowork/ai-ops.skill`). All five supported runtimes have native skill systems that accept the same SKILL.md + subfolder structure.

| Agent | Skills directory | Install |
|---|---|---|
| **Claude Code** | `~/.claude/skills/` | `cp -r skills/ai-ops ~/.claude/skills/` |
| **Cowork** | (managed in-app) | Import `dist/cowork/ai-ops.skill` via **Skills → Create skill → Import** |
| **OpenClaw** | `~/.openclaw/skills/` | `cp -r skills/ai-ops ~/.openclaw/skills/` or `unzip dist/cowork/ai-ops.skill -d ~/.openclaw/skills/` |
| **Codex CLI** (OpenAI) | `~/.agents/skills/` | `cp -r skills/ai-ops ~/.agents/skills/` or `unzip dist/cowork/ai-ops.skill -d ~/.agents/skills/` |
| **Hermes** (NousResearch) | `~/.hermes/skills/` | `hermes skills install https://github.com/3rd-Brain/AI-Operations-Consultant/raw/main/dist/cowork/ai-ops.skill` |

All five read SKILL.md YAML frontmatter (`name`, `description`). The `license` key is Claude Code / Cowork only - silently ignored by the others.

For any other Claude or OpenAI-compatible runtime, point it at `skills/ai-ops/SKILL.md` as the system prompt.

## Examples

### Document an inquiry-to-quote workflow

> "Walk me through how new event inquiries become signed quotes. We use Good Shuffle, HoneyBook, and Gmail."

The consultant dispatches the workflow chain. Output:
- `workflows/inquiry-to-quote.md` - full SOP with steps, tools per step, escalation paths, and an Automation / Agent Potential section
- `.ai-ops/research/inquiry-to-quote-tools-2026-05-21.md` - API capabilities, native integrations, integration walls
- Stub files created for any tool / role / record mentioned but not yet in the library

### Plan a level-up roadmap for the proposal workflow

> "I want a roadmap for getting our proposal workflow team-shared so any teammate can produce a consistent output. We're at Level 2 today."

The consultant dispatches the Roadmap specialist. Output:
- `roadmaps/proposal-workflow-team-shared-<date>.md` - operator goal, three Priority projects, two Upcoming projects, acceptance signals, scope-specific pitfalls, next-action library work

### Scope a build for the highest-priority automation

After the workflow chain runs, ask:

> "Scope the carrier-quote PDF extractor. The one from our discussion in /Meetings from yesterday."

The consultant walks stack selection (Python + Pydantic? Make scenario? Existing Airtable? Each slot one question at a time), then dispatches Build Scope. Output:
- `scopes/carrier-quote-pdf-extractor-<date>.md` - what to build, the chosen stack, input/output contracts, tools and APIs, records read/written, implementation notes, test-driven acceptance criteria

Drop the scope into Claude Code, Cowork, or hand to a developer.

## Configuration

The consultant works out of the box. Per-session things you can tune in conversation:

- **Library location** - where your per-company files live (default: a folder you specify when the session opens)
- **Existing research** - if you've already gathered tool API docs or run prior research, drop the files in `<library>/.ai-ops/research/` and the consultant picks them up

No config file required. The library structure carries everything.

## Community & Support

- **Issues:** [github.com/3rd-Brain/AI-Operations-Consultant/issues](https://github.com/3rd-Brain/AI-Operations-Consultant/issues)
- **Methodology source:** [digitaloperationsinstitute.com](https://digitaloperationsinstitute.com)
- **Behind the methodology:** [3rdbrain.co](https://3rdbrain.co) - the consulting firm that built it across 50+ engagements

## License

GPL-3.0 - see [LICENSE](LICENSE).
