---
name: <skill-name>
description: <What the agent does and when to use it, in one or two sentences a host can route on>
---

# <Agent name>

<!-- The SKILL.md of one client agent, drafted by prompts/agent-skill.md from an
agent-type Technical Scope. Lives at agents/<skill-name>/SKILL.md in the client
library and installs unchanged on any runtime that loads Agent Skills. Keep
runtime wiring (channels, schedules, model tiers, hosting, where credentials are
stored) out of it: that goes in the deployment guide. No code. -->

## Job

<The work this agent owns, in one paragraph: the outcome, who it works for, and the role it fills.>

## Boundaries

- **Alone:** <What it may do without a person>
- **With a person:** <What it drafts for a person to send, approve, or change, and how it asks>
- **Never:** <What it must never do>
- **Credentials:** <Each credential or inbox it uses, by name, and what each may reach; never a value>

Anything not listed under Alone needs a person.

## Know

<The knowledge it reads: client library paths, relative to the library root, read-only; and any other source. Point at documents; do not copy them here.>

## Work folder

<Where it keeps its own working state and outputs: the work folder the deployment guide sets up, and, when the work is staged, one folder per run with what each stage reads and writes. Never inside this package or the client library.>

<!--
Add only the sections the agent's role needs, in this order:

## Observe
<What it watches, and when: on request, on a schedule, or on an event.>

## Orient
<How it reads what it observes against history, baselines, and goals.>

## Decide
<The calls it may make, and the limit on each.>

## Act
<Each tool and action: what it may read, what it may write, and what it produces.>

## Review
<How it checks its own work before and after it acts, and what it changes when a check fails.>

## Specialists
Only when a separate job needs its own bounded context: one row per prompt under
prompts/, with its inputs (at most six), exact write paths, and short return.
-->

## Hand to a person

<When it stops and passes work to a person, who, and what it tells them.>

## Done

<What finished looks like for one piece of its work.>
