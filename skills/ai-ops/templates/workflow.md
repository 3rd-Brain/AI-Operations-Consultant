# <Workflow Name>

<!--
Template for a workflow / process / job document inside the per-company library.
Created by the AI Ops Consultant V2 when the user scopes a workflow.
Lives at workflows/<workflow-slug>.md in the company library.

Two top-level deliverable sections:
  - SOP: the work itself, in user-readable checklist form
  - Automation / Agent Potential: how to automate it using the user's tools

Tools, data, and roles are named INLINE inside SOP steps (no separate sections).
Workflow-level pains live in .ai-ops/pains-and-bottlenecks.md (aggregated and
prioritized across the company's workflows).

Sibling files referenced inline:
  - roles/<role-slug>.md
  - tools/<tool-slug>.md
  - records/<record-slug>.md
-->

**Owner role:** → [<role-slug>.md](../roles/<role-slug>.md)
**Last updated:** YYYY-MM-DD

## Jobs-to-be-done

When <trigger / situation>, <role> wants to <motivation>, so <outcome>.

## SOP

- [ ] **<Action verb>** — <role> uses <tool> on <data / record> — <produces what>
  - Exception: <known edge case + where the answer lives>
  - Escalate: <when + to whom> (only if relevant)
- [ ] **<Action verb>** — <role> uses <tool> on <data> — <produces what>
- [ ] **<Action verb>** — …

### Flowchart — ASCII (for humans)

```
< plain-text box-and-arrow diagram of the SOP >
```

### Flowchart — Mermaid (for machines)

```mermaid
< mermaid code, same flow as the ASCII version >
```

## Automation / Agent Potential

**Target KOODAR level:** <K | KA | KDA | KDAR | KODAR | KOODAR>
**Lives in:** <which of the user's AI tools — e.g. Cowork, Claude Code, ChatGPT, n8n, Zapier>
**Approach:** <Use existing integration: <name + link> | Install / configure a skill | Custom workflow | Other>

<Narrative — what gets built or installed, why it fits the user's existing tools and capacity, human-in-the-loop points, scope cuts (now / next / later).>

**Constraints:**
- Prior attempts / prior approach: <what was tried or used before, what broke, why>
- Integration walls: <locked APIs, on-prem tools, vendor limits>
