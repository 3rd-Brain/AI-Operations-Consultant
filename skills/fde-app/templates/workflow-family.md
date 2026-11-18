---
ai_ops:
  id: family:<family-slug>
  type: workflow-family
family:
  members:
    - id: workflow:<workflow-slug>
      shared: <true | false | unresolved>
  coordination_workflow: null
  handoffs:
    - from: workflow:<workflow-slug>
      to: workflow:<workflow-slug>
---

# <Workflow Family Name>

**Requested capability:** <client's label>
**Last updated:** YYYY-MM-DD

## Outcome

<The broad business outcome this family accomplishes.>

## Member workflows

- [<Workflow Name>](../workflows/<workflow-slug>.md) — <one responsibility-distinct outcome>. <Shared workflow, when shared is true.>

## Coordination workflow

<Link the coordination workflow and explain its independent outcome/responsibility, or state that no coordination workflow exists because the members are peers.>

## Handoffs

- [<From Workflow>](../workflows/<from-slug>.md) → [<To Workflow>](../workflows/<to-slug>.md) — <business handoff condition>.

## Cross-workflow automation candidates

- <Candidate that coordinates member workflows; do not design the solution here.>

## Open questions

- <Unresolved responsibility, record, reuse, or handoff question; write `None` when settled.>
