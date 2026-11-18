---
ai_ops:
  id: decision:<YYYY-MM-DD>-<model-qualified-decision-slug>
  type: decision
governance:
  status: proposed
  applicability:
    repository_ids: []
    targets: []
  effective_from: null
  review_after: null
  supersedes: []
  conflicts_with: []
reference:
  model: model:<model-slug>
  applicability:
    include_variants: []
    exclude_variants: []
  links:
    journeys: []
    capability_categories: []
    metrics: []
    automation_patterns: []
    cases: []
decision:
  date: YYYY-MM-DD
  decider: role:<model-qualified-role> | null
  affected: []
  evidence: []
---

# <Decision>

## Decision

<What was decided for the generalized model.>

## Context

<Why the decision was needed and where it applies.>

## Rationale

<Why this option was chosen.>

## Applicability and limitations

<Variant boundaries, evidence limits, and review triggers.>

<!-- Add an Exceptions section only when an approved deviation from this Decision exists, one bullet each: **<Exception name>:** Scope, Approved by (cited), Expires, Safeguards. -->
