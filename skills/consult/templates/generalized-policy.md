---
ai_ops:
  id: policy:<model-qualified-slug>
  type: policy
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
policy:
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

# <Policy name>

## Rule

<The reusable standing rule, in plain language.>

## Applicability and conditions

<Variant boundaries and conditions.>

## Rationale and evidence

<Why the rule exists, who accepted it, and the evidence behind it, using the shared fidelity contract.>

## Review

<Owner and review trigger.>

<!--
Add these sections only when they apply:

## How it's checked

Only when the rule can be tested: how someone confirms it is being followed.

## What enforces it

Only when something enforces the rule: what runs, when, who owns it, what record it leaves, and what happens when it fails.

## Exceptions

Only when an approved deviation exists. One bullet per exception:
- **<Exception name>:** Scope: <what it covers>. Approved by: <who, cited to their words or a Decision>. Expires: <date or trigger>. Safeguards: <compensating measures, or none>.

## Conflicts

Only when this Policy conflicts with another Policy or Decision: name it, and how the conflict is settled or the open question.
-->
