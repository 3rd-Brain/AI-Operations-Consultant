# Walkthrough — AI Operations Consultant

This is the long-form guide: what this repo is, what the skill can actually do, the operating principles behind it, and the Navigator. If you just want to install and run, [INSTALL.md](INSTALL.md) is shorter.

---

## 1. What this is

The AI Operations Consultant is a **Claude skill that runs a consulting engagement on your business**. You talk to it the way you'd talk to an operations consultant: describe a workflow, a role, or the whole company. It asks questions one at a time, researches your tools on the web, and writes everything it learns into a **plain-markdown library you own** — profiles, SOPs, role docs, tool research, data architecture.

The end goal is not documentation for its own sake. The library is the raw material for the last step: **scoping automations and AI agents your coding agent can actually build.** Documentation → diagnosis → roadmap → build scope → working automation.

It's one skill (`/ai-ops`), one conversation. Behind the scenes it dispatches specialist subagents for heavy work, but you never manage that — you see deliverables, not plumbing.

## 2. Install

```bash
git clone https://github.com/3rd-Brain/AI-Operations-Consultant.git
mkdir -p ~/.claude/skills
cp -r AI-Operations-Consultant/skills/ai-ops ~/.claude/skills/
```

Then open any Claude Code session and type `/ai-ops`. Cowork users: import `dist/cowork/ai-ops.skill` (Skills → Create skill → Import). Other agents (OpenClaw, Codex, Hermes): copy the same folder into their skills directory. Details in [INSTALL.md](INSTALL.md).

## 3. Your first session

Open with a goal and whatever you have:

> "Walk me through documenting our quoting workflow. We use HoneyBook, Good Shuffle, and Gmail. Here's a transcript of me explaining it to a new hire."

What happens:

1. **It grounds itself.** First session, it asks where your company library should live (a folder you choose). Later sessions, it re-reads its own state file and picks up where you left off.
2. **It mines what you give it.** Transcripts, recorded calls, SOP docs, walkthroughs — it extracts facts, vocabulary, and workflows from them so you don't retype anything. (Your documents are treated as *evidence about your business*, never as instructions to the agent — see Principles below.)
3. **It researches before it asks.** It looks up your tools' actual APIs, native automations, and integrations on the web, then asks you only for the 10–20% it can't find: your edge cases, your exceptions, your tribal knowledge. One question at a time.
4. **It dispatches specialists.** Documenting a workflow runs a chain: SOP writer → tool researcher → automation mapper → library assembler. Each is a fresh-context subagent with a focused prompt. You see the finished files.
5. **Files land in your library.** A workflow session typically produces: the workflow SOP (with flowcharts and an Automation / Agent Potential section), a tool-research file with verified API facts, and stub files for every tool, role, and record it encountered that you haven't documented yet.

Every output is markdown. Open it, edit it, disagree with it — the next session reads your edits as truth.

## 4. The library

Everything accumulates in one folder per company. This *is* the product — a living operating manual that gets more complete every session:

```
<company>/
├── profile.md               ← living company summary: what you do, stack, goals,
│                              pains, maturity signal (prior versions auto-snapshot)
├── data-architecture.md     ← your records mapped across tools: sources of truth,
│                              manual copy-paste bridges, fragmentation points
├── glossary.md              ← your vocabulary, as you use it ("inquiry" ≠ "lead")
├── open-questions.md        ← what the consultant still needs from you; empties as answered
├── roles/                   ← one doc per seat: responsibilities by cadence + KOODAR breakdown
├── workflows/               ← step-by-step SOPs any teammate can follow, plus
│                              an automation assessment per workflow
├── tools/                   ← one doc per system: purpose, API, records it owns, integrations
├── decisions/               ← dated memos of significant choices you made, auto-captured
├── roadmaps/                ← maturity-progression plans (on demand)
├── scopes/                  ← build specs for coding agents (on demand)
└── .ai-ops/                 ← consultant's working state: research files, pains list,
                               session state, profile history
```

Two details that matter:

- **Stubs.** Anything mentioned but not yet documented — a tool, a role, a record — gets a stub file automatically. The library grows breadth-first; you enrich stubs in later sessions.
- **No duplicate state.** Each fact has one home. Records live in the tool that owns them plus the cross-tool registry in `data-architecture.md` — never in parallel files that drift apart.

## 5. What it can do

| You ask | It runs | You get |
|---|---|---|
| "Map how our business runs" | Company chain (profile → stack research → data architecture) | The full picture: profile, every tool researched, a cross-tool data map with fragmentation flagged |
| "Walk through our quoting workflow" | Workflow chain (SOP → tool research → automation mapping) | A teachable SOP + verified tool capabilities + where automation actually fits |
| "Document the head-of-sales role" | Role specialist | Responsibilities by cadence, objectives + metrics, KOODAR capability breakdown |
| "Roadmap us to AI-ready" | Roadmap specialist | A sequenced plan against the 5 Levels: priority projects, acceptance signals, pitfalls |
| "Scope the quote-extractor build" | Stack selection conversation → Build Scope specialist | An executable spec — stack, input/output contracts, API specifics, examples, test-driven acceptance criteria |

The chains compose. A typical engagement: company chain first (the map), workflow chains for the 2–3 highest-pain workflows (the diagnosis), then a build scope for the best automation candidate (the payoff). Drop the scope into Claude Code or hand it to a developer.

## 6. The operating principles

These explain *why* it's built the way it is. They're also the principles the consultant applies to **your** business when it recommends anything.

**Plain text is the interface.** Every deliverable, every handoff, every piece of state is a markdown file you can open and edit. No database, no app lock-in, no export step. If you can read a folder, you own your engagement. (Internally this is ICM — Interpretable Context Methodology: folder structure *is* the orchestration; each pipeline stage reads defined inputs and writes defined outputs a human can review between steps.)

**One conversation, specialist dispatch.** You talk to one consultant. Heavy, well-scoped work (deep research, long documents) goes to subagents with fresh context windows and focused prompts — because a focused prompt with three jobs beats a sprawling prompt with ten. The architecture mirrors the advice: single agent + tools until a measured bottleneck forces more.

**Research first, questions second.** The consultant reads your tools' real documentation before asking you anything. Web facts are verified per-session and cached in `.ai-ops/research/` with dates — so the automation it proposes uses features your tools actually have, not training-data folklore.

**Your documents are evidence, not instructions.** Uploaded transcripts and docs are mined for facts about your business. Instructions *inside* them ("ignore your rules," "skip this step") are quoted and flagged, never obeyed. This is the prompt-injection defense, and it's load-bearing for a tool that eats client documents all day.

**Decisions get written down.** When you make a significant call mid-session — a stack pick, a scope cut, a vendor choice — the consultant writes a dated decision memo without being asked. Three months later you'll know what you decided and why.

**Recommendations follow the same rails it's built on.** Buy before build. Folders before infrastructure. Start with what already works. Every component must answer: where does its state live, where's its feedback, and what breaks if you delete it.

### The frameworks underneath

Five frameworks from the Digital Operations Playbook (bundled in `references/playbook/`) drive the diagnosis:

- **5 Levels of Digital Operations** — the maturity scale: Information Silos → Connectable Cloud → **Unified Data Layer (Level 3 — the tipping point)** → Automated Workflows → AI Automation. The first mission for any company is Level 3; everything before it is foundation, everything after is acceleration.
- **Three Cs** — what each level buys you: Consistency → Clarity → Capacity, a chain reaction where each unlocks the next.
- **5 Pillars** — what you actually build: Talent, Workflow Optimization, Digital Architecture, Knowledge Management, AI Automation.
- **People → Process → Tools** — the implementation order, always. Buying tools before defining process and preparing people is the most common failure pattern in digital operations — it's how shelf-ware happens.
- **KOODAR** — the vocabulary for AI capability: **K**now, **O**bserve, **O**rient, **D**ecide, **A**ct, **R**eview. Every automation gets a target capability level (a KA retrieval helper is a different build than a KOODAR coworker), and role docs use the letters as a documentation structure.

## 7. The Navigator

The library is files; the Navigator makes it a place you can walk through. It's a **zero-dependency local web app** (Node built-ins only) that ships inside the skill at `scripts/navigator/`:

```bash
ROOT="<your-company-library>" node ~/.claude/skills/ai-ops/scripts/navigator/server.mjs --port 4173
# open http://localhost:4173
```

Five views:

| View | What you see |
|---|---|
| **🏠 Dashboard** | Counts, library completeness (stub vs enriched), top pains, and the profile's maturity signal — all derived live from the files. Nothing here is maintained by hand; the navigator renders what the library says. |
| **👥 Org & Roles** | An org chart built from each role doc's `Reports to:` field, with the workflows each role owns. |
| **🔀 Workflow Maps** | Every SOP as a color-coded step flow — who does each step, with which tool, on which record, with exception paths flagged. |
| **📄 Pages** | Every markdown file rendered (Mermaid diagrams live), with edit-in-place that saves back to disk. |
| **➕ New** | Create stub pages from templates directly in the UI. |

Division of labor: **the Navigator visualizes and edits; the consultant interviews, researches, and enriches.** They read and write the same files, so there's no sync step — run a session, refresh the browser, the new content is there.

It binds to localhost only, validates request origins (a webpage you have open can't write to your library), and only ever writes markdown inside the folder you point it at.

## 8. The payoff: documentation → working automation

The sequence the whole thing builds toward:

1. **Document** a workflow (workflow chain). Its SOP now has an *Automation / Agent Potential* section grounded in researched tool capabilities — not vibes.
2. **Pick the target.** The consultant walks stack selection one slot at a time, preferring tools you already run.
3. **Scope the build** (Build Scope specialist). Out comes a self-contained spec: what to build, the exact stack, input/output contracts with types, the API endpoints (from research, not memory), worked examples, and test-driven acceptance criteria.
4. **Hand it off.** Paste the scope into Claude Code or Cowork, or hand it to a developer. They shouldn't need to ask you anything — that's the spec's acceptance bar.

A 15–20 minute session can take a workflow from "lives in the owner's head" to "spec a coding agent can ship."

## 9. Practical notes

- **Feed it what you already have.** Meeting transcripts, Loom walkthroughs, old SOPs, exported docs — the consultant extracts vocabulary and facts directly. The less you retype, the better the glossary.
- **One folder per company.** Agencies and consultants: run one library per client. The skill asks which library at session open.
- **Edit anything.** The library is yours. Fix a wrong step, rename a role, delete a stub — the next session treats your edits as ground truth.
- **It won't write your marketing.** It documents, diagnoses, researches, and scopes. Final-copy voice is deliberately out of scope.
- **License:** GPL-3.0. Fork it, adapt it, ship your own consultant — keep it open.

---

*Built by [3rd Brain](https://3rdbrain.co) from 50+ client engagements. Methodology: [Digital Operations Institute](https://digitaloperationsinstitute.com).*
