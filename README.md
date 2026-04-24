# Turn Claude Into A Top 1% AI Operations Consultant

**The Digital Operations Institute Method**

Most AI readiness tools give you a questionnaire and a score. The DOI Method gives you a consultant — conversational intake, role verification, outcome mapping, task classification, friction analysis, and a sequenced implementation roadmap. The same methodology behind 50+ client engagements at [3rd Brain](https://3rdbrain.co), packaged as a Claude plugin.

Install it. Type `/doi-run`. The consultant starts asking questions — then routes you to the path that fits.

---

## What You Walk Away With

| Deliverable | What It Is |
|---|---|
| **Maturity Score** | Level 1-5 readiness rating with hard cap gate logic — no inflated scores |
| **Role Reality Check** | Verified gap between documented roles and actual day-to-day work |
| **Outcome Map** | Solution-agnostic results per role, tagged to every task |
| **Task Classification** | Every task rated on a 4-stage AI automation scale |
| **Friction Tax** | % of capacity lost to friction — by task, role, and department |
| **Bottleneck Routing** | People / Process / Tools classification for every high-friction task |
| **Pillar Assessment** | Evidence-backed foundational + advanced readiness scores |
| **Implementation Roadmap** | Tiered, sequenced plan with projected friction reduction |

This is not a report someone reads and shelves. Every output feeds the next phase, and the final roadmap is sequenced by impact — what to fix first, what to automate, and what to leave alone.

You do not have to run the whole thing. `/doi-run` is a consultant — after intake it asks what you want out of the engagement. Just a maturity score? A deep dive on one broken role? A pillars snapshot? Full 10-phase engagement? It routes accordingly.

---

## Installation

### Claude Code CLI (recommended)

In Claude Code, run:

```
/plugin marketplace add 3rd-Brain/AI-Operations-Consultant
/plugin install doi-method@doi-method
```

Or install from a local clone:

```bash
git clone https://github.com/3rd-Brain/AI-Operations-Consultant.git
cd AI-Operations-Consultant
./install-doi.sh
```

### Cowork

Cowork uses a separate skill system. Download the `.skill` files from `dist/cowork/` in this repo and upload each one via **Skills → Create skill → Import from `.skill` file**. Start with `doi-run.skill` at minimum; install all 12 for the full engagement flow.

Full install notes, including the legacy flat-copy mode, are in [INSTALL.md](INSTALL.md).

---

## Quick Start

```bash
git clone https://github.com/3rd-Brain/AI-Operations-Consultant.git
cd AI-Operations-Consultant
./install-doi.sh
```

Open Claude Code and type:

```
/doi-run
```

The consultant interviews you (7-section consulting-style intake), then asks what you're trying to get out of the engagement and routes you to the right path. Pause or stop any time — state is saved.

---

## How to Use It

**Start a new engagement:** Type `/doi-run`. The consultant walks you through a consulting-style intake — organization, current state, history with automation, tech stack, goals, constraints, stakeholders. Then it asks what you want:

1. **Full engagement** — all 10 phases across every department and role (heaviest lift, most complete picture)
2. **Maturity score only** — 30-question assessment → Level 1-5 reading in ~20 minutes
3. **Single-role deep dive** — pick one role, run verification, outcome mapping, task classification, and friction scoring
4. **Pillars snapshot** — evidence-backed scoring against foundational + advanced readiness pillars
5. **"You tell me"** — describe your situation, the consultant picks the path

Whatever you pick, the intake you did up front populates the context folder that every downstream phase reads from — so you only do the interview once.

**Resume an engagement:** Type `/doi-run` again. The consultant finds the existing engagement, shows you where you left off, and asks what you want to do next.

**Skip the consultant (power-user shortcut):** Type `/doi-engage` to run the full 10-phase pipeline end-to-end without the routing interview. Or invoke any single phase directly (`/doi-assess`, `/doi-pillars`, etc.) if you already know what you want.

**Pause or stop:** Say "pause" or "stop" at any point. State is saved. Come back tomorrow, next week — the engagement holds.

**Human gates:** After key phases, Claude presents its work and waits for your approval before moving on. You review, edit, or push back. Nothing advances without your sign-off.

---

## How It Works

DOI Method is a consultant-first skill system. `/doi-run` is the consultant — it interviews you, then routes to the appropriate execution path. The execution paths are separate skills that do the actual work.

```
/doi-run (consultant)
    |
    +--> /doi-intake (consulting-style interview)
    |        |
    |        v
    |    context/ folder + company-profile.md
    |        |
    |        v
    +--> Routing Interview: "What do you want?"
             |
     +-------+---------+------------+---------------+
     |                 |            |               |
     v                 v            v               v
 /doi-engage      /doi-assess   role loop     /doi-pillars
 (full pipeline)  (score only)  (one role)    (pillars only)
     |
     v
 Phase 1: doi-assess   --> [Critic] --> Gate
 Phase 2: doi-setup (per department)
    |
    +---- Per Role Loop ----+
    |  Phase 3: doi-verify   --> [Critic] --> Gate
    |  Phase 4: doi-outcomes --> [Critic] --> Gate
    |  Phase 5: doi-roles    --> [Critic] --> Gate
    |  Phase 6: doi-friction --> [Critic] --> Gate
    +-----------------------+
    |
 Phase 7: doi-route    --> [Critic] --> Gate
 Phase 8: doi-pillars  --> [Critic] --> Gate
 Phase 9: doi-roadmap  --> [Critic] --> Gate --> Done
```

### Meta Commands

| Command | What It Does |
|---|---|
| `/doi-run` | **Consultant front-door.** Runs intake, then interviews you and routes to the right path. This is the default entry point. |
| `/doi-engage` | Runs the full 10-phase pipeline end-to-end without the routing interview. Assumes intake is already complete. |

### Phase Commands

| Phase | Command | What Happens |
|---|---|---|
| 0 | `/doi-intake` | 7-section consulting-style interview — builds the `context/` folder every downstream phase reads from |
| 1 | `/doi-assess` | 30-question maturity checklist — determines Level 1-5 |
| 2 | `/doi-setup` | Define departments, roles, and department-level outcomes |
| 3 | `/doi-verify` | Probe actual day-to-day work vs. what is documented |
| 4 | `/doi-outcomes` | Map what each role is supposed to produce, tag every task |
| 5 | `/doi-roles` | Classify every task on a 4-stage AI automation scale |
| 6 | `/doi-friction` | Score friction across the Three Cs — calculate Friction Tax |
| 7 | `/doi-route` | Classify bottlenecks: People, Process, or Tools |
| 8 | `/doi-pillars` | Score foundational + advanced operational readiness |
| 9 | `/doi-roadmap` | Build the tiered, sequenced implementation plan |

After each critical phase, an independent **critic agent** reviews the output in isolation — no access to the conversation, just the raw work. It flags methodology violations, scoring inconsistencies, and missing data before the next phase begins.

---

## Why This Is Different

**It is a consultant, not a questionnaire.** Most AI readiness tools ask you 20 questions and hand you a score. The DOI Method starts with a consulting-style intake, asks what you're trying to learn, and routes you to the path that actually answers the question. If you need a quick maturity score, you get that. If you need a full engagement, you get that. No forced commitment to a 10-phase pipeline you don't need.

**It assesses from the inside out.** No surface-level scans. The method works with your people, department by department, role by role. It catches the gap between how work is documented and how it actually happens.

**It has a critic.** After every critical phase, an independent reviewer tears the work apart in isolation — no conversation context, just the raw output. Methodology violations, scoring inconsistencies, and blind spots get flagged before anything moves forward.

**The intake is real.** Phase 0 is not a 5-field form — it is a seven-section consulting interview that populates a `context/` folder every downstream phase reads from. Organization basics, current state, history with automation, tech stack, goals, constraints, stakeholders. Thin intake produces thin analysis; this intake is built to ground every phase that follows.

**Built from 50+ client engagements.** This is not a framework designed in a vacuum. It is the methodology behind the [3rd Brain](https://3rdbrain.co) consulting practice, refined across real organizations over nearly four years.

---

## The Framework

**5 Maturity Levels** — from Information Silos (Level 1) to AI-Driven Automation (Level 5). Hard cap gate logic prevents inflated scoring — you cannot test into Level 3 if you are missing Level 2 fundamentals.

**4-Stage AI Automation Scale** — every task in the assessment gets classified: Stage 1 (Rule-Based Workflows) through Stage 4 (AI Coworkers with autonomous responsibility). This is how the roadmap knows what to recommend.

**The Three Cs** — Consistency, Clarity, Capacity. They arrive in sequence. You cannot unlock Capacity gains until Consistency and Clarity are in place. Friction is measured against all three.

**People > Process > Tools** — the sequencing principle behind every recommendation. Fix people gaps first, then process, then tools. The roadmap tiers follow this order because the reverse never works.

**Outcome Mapping** — Phase 4 surfaces what each role is actually supposed to produce, solution-agnostic. Tasks get tagged as aligned, indirectly aligned, or unaligned. Unaligned tasks are flagged before any automation is recommended — because automating the wrong work faster is not a win.

### Go Deeper

The full methodology, frameworks, and case thinking behind the DOI Method are documented in the [**Digital Operations Playbook**](https://digitalopsplaybook.com). If you want to understand the why behind every phase, start there.

---

## Made by 3rd Brain

DOI Method is designed, built, and maintained by [**3rd Brain**](https://3rdbrain.co) — a digital operations consultancy that builds AI-native operating systems for growing businesses.

## Uninstall

**Claude Code CLI plugin:** `/plugin uninstall doi-method@doi-method` (or `rm -rf ~/.claude/plugins/doi-method` for manual installs)

**Claude Code CLI legacy install:** `rm -rf ~/.claude/skills/doi-* ~/.claude/agents/doi-review ~/.claude/scripts/doi/`

**Cowork:** remove each `doi-*` skill from Skills → Manage.

---

*Licensed under GPL-3.0. Copyright 2026 3rd Brain DigiOps. All rights reserved.*
