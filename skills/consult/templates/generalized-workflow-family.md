---
ai_ops:
  id: family:<model-qualified-slug>
  type: workflow-family
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
family:
  members:
    - id: workflow:<model-qualified-slug>
      shared: <true | false | unresolved>
  coordination_workflow: null
  handoffs:
    - from: workflow:<model-qualified-slug>
      to: workflow:<model-qualified-slug>
---

# <Workflow Family>

## Family outcome

## Member workflows

## Handoffs

## Coordination workflow

None.

## Cross-workflow automation candidates

## Applicability and limitations

## Evidence statements
