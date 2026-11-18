---
ai_ops:
  id: workflow:<model-qualified-slug>
  type: workflow
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
workflow:
  primary_record: record:<record-slug>
  accountable_owner: role:<model-qualified-role>
  depends_on:
    records: []
    workflows: []
    decisions: []
---

# <Workflow>

## Outcome

**Primary record:** <record-slug> (<kind>)

**Accountable owner:** [<role>](../roles/<role>.md)

## Preconditions

## SOP

## Decisions and controls

## Failure and recovery

## Metrics

## Automation / Agent Potential

## Applicability and limitations

## Evidence statements
