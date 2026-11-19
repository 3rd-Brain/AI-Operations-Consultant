![version](https://img.shields.io/badge/version-4.9.1-blue) ![license](https://img.shields.io/badge/license-FDE%20App%20License-lightgrey) ![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-orange) ![Codex](https://img.shields.io/badge/Codex-compatible-green) ![Cowork](https://img.shields.io/badge/Cowork-compatible-purple)

[Install](#install) · [Who it's for](#who-its-for) · [How it works](#how-it-works) · [Methodology](#methodology) · [Support](#support)

# Forward Deployed Engineer App Skills and Plugin (Formerly AI Ops)

**Find where your team's time goes. Fix the costliest work first.**

FDE App maps how a company really runs, shows what each fix is worth, then builds it, all inside your Claude Code or Codex.

FDE App turns Claude or Codex into your company's Forward Deployed Engineer (FDE). It documents how a company really runs, finds where work waits, loops, or depends on one person, and plans, values, and rolls out the changes that matter, in your own Claude or Codex. This plugin carries the FDE App skill and connects it to FDE App, where each company's library is kept, checked on every save, and readable in the web app.

## Quick start

In Claude Code:

```bash
claude plugin marketplace add 3rd-Brain/AI-Operations-Consultant
claude plugin install fde-app@fde-app --scope user
```

Start Claude Code, run `/mcp`, choose `fde-app`, and sign in with the email you use for FDE App. Then say:

> I'm new to FDE App. Help me get started with my company.

Codex, Cowork, claude.ai and the desktop app are under [Install](#install).

## Who it's for

- **For in-house operators:** Know which work to change first and what it's worth. Then build it, roll it out and show the result.
- **For owners, COOs and operations leads** who want to see the whole company before they automate any of it.

## What you get

- **The work, mapped:** built from calls, documents, system data and recordings.
- **The bottleneck, measured:** where work waits, loops or hangs on one person.
- **Every step sorted:** cut it, automate it, hand it to AI, or keep it with a person.
- **Each fix valued:** in hours at the company's own rate, before anyone builds.

Everything it writes is a plain document you can read, correct, and share with your team.

## How it works

1. **Learn the work:** the company's profile and a map of how it really runs.
2. **Measure it:** how long the work takes, where it waits and where it loops.
3. **Choose the fix:** the one constraint, then the rest ranked.
4. **Make the case:** a project with its value and its running cost.
5. **Ship it:** builds, rollout and training, checked as they go.
6. **Prove it:** the same measures re-run after go-live.

## What to share first

- A few sentences about the business and the one result you want from this work. This becomes the company profile.
- A transcript of a conversation with the owner or with the person who runs a workflow, for example from Fireflies, Zoom, or Google Meet. This is the fastest way to map how the work really happens.
- Documents you already have: SOPs, checklists, training or onboarding guides.

## Before you start

- FDE App writes drafts. Check what it produces before you rely on it or hand it to someone else.
- You own your company data. We don't sell it or use it to train AI models, and you can delete a company or your account at any time. We may use de-identified patterns across many companies to improve FDE App; they never identify you or your company.
- Only share data you are allowed to share.

## Methodology

Five frameworks FDE App applies, from the *Digital Operations Playbook* (bundled in the skill at `references/playbook/`).

- **5 Levels of Digital Operations:** where you sit on the maturity scale (Information Silos → Connectable Cloud → Unified Data Layer → Automated Workflows → AI Automation). Level 3 is the flywheel threshold.
- **Three Cs:** Consistency → Clarity → Capacity. The chain reaction you unlock as you level up. Each one is a prerequisite for the next.
- **5 Pillars:** Talent Strategy, Workflow Optimization, Digital Architecture, Knowledge Management, AI Automation. What you actually build to move the levels.
- **People → Process → Tools:** the implementation sequence within every pillar. Skip it and you ship shelfware.
- **KOODAR:** the AI capabilities vocabulary (Know / Observe / Orient / Decide / Act / Review). The language for designing and documenting AI tools and agents.

## Who's behind it

I'm Michael Greenberg (@gentoftech). For almost four years, 3rd Brain has worked with 50+ client companies on their operations. FDE App follows the method in my book, the Digital Operations Playbook, at [digitaloperationsinstitute.com/book](https://digitaloperationsinstitute.com/book).

## Install

**Claude Code, from GitHub.**

```bash
claude plugin marketplace add 3rd-Brain/AI-Operations-Consultant
claude plugin install fde-app@fde-app --scope user
```

Start Claude Code, run `/mcp`, choose `fde-app`, and sign in with the email you use for FDE App.

**Claude Code, from a download.** Unzip the download, then run, with the path to the unzipped `fde-app` folder:

```bash
claude plugin marketplace add ./fde-app
claude plugin install fde-app@fde-app --scope user
```

Start Claude Code, run `/mcp`, choose `fde-app`, and sign in with the email you use for FDE App.

**Codex** (the Codex CLI or the Codex app; the IDE extension has no plugins). FDE App needs Codex 0.169 or later: check with `codex --version`, and update with `npm install -g @openai/codex`. Unzip the download, then run, with the path to the unzipped `fde-app` folder:

```bash
codex plugin marketplace add ./fde-app
codex plugin add fde-app@fde-app
codex mcp login fde-app
```

Sign in with the email you use for FDE App. On Windows, if PowerShell refuses to run `codex`, type `codex.cmd` instead. Then add these lines to `~/.codex/config.toml` (evidence intake runs six subagents at once, and Codex allows four by default):

```toml
[agents]
max_concurrent_threads_per_session = 24
```

On Windows, also add these, so Codex can read the plugin's files:

```toml
[windows]
sandbox = "unelevated"
```

Start a new Codex session.

**Cowork, claude.ai, and the desktop app.** Customize, then Plugins, then Add, then Upload plugin, and choose the zip. Open the plugin's Connectors tab and connect FDE App, signing in with the email you use for FDE App.

## Updating

Download the new version from https://fdeapp.digitaloperationsinstitute.com/welcome. In Claude Code, unzip it over the same folder and run `/reload-plugins`. In Codex, unzip it over the same folder, run `codex plugin remove fde-app@fde-app` and `codex plugin add fde-app@fde-app`, and start a new session. In Cowork and claude.ai, upload the new zip.

## Support

Ask "help" or "what's next?" at any time. Questions or feedback: michael@3rdbrain.co, or https://fdeapp.digitaloperationsinstitute.com/support.

## License

You may use FDE App for your own company's operations under the FDE App License (see `LICENSE`). Using it to serve clients needs a separate agreement with Digital Operations Institute.
