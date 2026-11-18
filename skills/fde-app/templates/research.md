---
ai_ops:
  id: research:<research-slug>
  type: research
research:
  performed_at: YYYY-MM-DD
  review_after: null
  references:
    roles: []
    tools: []
    workflows: []
    workflow_families: []
    records: []
    decisions: []
    policies: []
    roadmaps: []
    scopes: []
    research: []
    evidence: []
---

# <Research topic>

## Findings

<Findings as prose, each material statement cited in place. Cite internal library files directly with a path relative to this file and a heading anchor — [2026-07-01 ops meeting](../meetings/2026-07-01-ops.md#pricing-decision) — and external sources through their saved evidence wrapper — [evidence:<evidence-slug>](../evidence/<evidence-slug>.md), the wrapper file itself with no heading anchor. Keep observed, reported, inferred, recommended, and assumed statements distinct.>

## Sources

- [<internal source>](<path-relative-to-this-file.md>#<heading-anchor>) — <what it supports>
- [`evidence:<evidence-slug>`](../evidence/<evidence-slug>.md) — <external source and quality note>

## Freshness and conflicts

<What was reverified, what changed, stale or low-quality support, and conflicts with client governance.>
