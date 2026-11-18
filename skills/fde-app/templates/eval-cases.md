---
ai_ops:
  id: eval-cases:<scope-slug>
  type: eval-cases
---

# Eval cases — <Scope title>

<!--
Lives at evals/<scope-slug>.md, linked from the Scope's Eval plan. prompts/eval-plan.md
writes it; the person who decides what counts as correct labels each case. The builder
runs these cases and reports each result; FDE App never runs them. Copy no more
personal data than a case needs; point to records by ID where you can.
-->

**Scope:** <Link to the Scope>
**Labeled by:** <The person who decides what counts as correct>

## Labeling guide

<What counts as correct, in the expert's words where possible. Two or three examples of a pass and of a fail. An unclear case is marked unclear, and the expert decides.>

## Tuning cases

| # | Input, or where to find it | Act or hand off | Correct answer, or pass/fail | Why | Label |
|---|---|---|---|---|---|
| T-1 | <Record ID, message, or document> | <Act, or hand off to a person> | <The correct answer, or pass/fail> | <One line> | <Proposed, or the expert's> |

## Acceptance cases

Held back: the builder never tunes on these.

| # | Input, or where to find it | Act or hand off | Correct answer, or pass/fail | Why | Label |
|---|---|---|---|---|---|
| A-1 | <Record ID, message, or document> | <Act, or hand off to a person> | <The correct answer, or pass/fail> | <One line> | <Proposed, or the expert's> |

<!--
For an agent that acts inside a system, add click-through scenarios. Pass or fail is
read from the system's records, not from a screenshot.

## Click-through scenarios

| # | Starting state in the test account | Steps | Expected end state in the system |
|---|---|---|---|
| C-1 | <Records and their values before> | <What the agent does> | <Records and field values after> |
-->
