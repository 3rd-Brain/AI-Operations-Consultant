---
ai_ops:
  id: project:<project-slug>
  type: project
project:
  roadmap: roadmap:<roadmap-slug> | null
  owner: role:<role-slug> | unresolved
  depends_on: []
  affected:
    roles: []
    workflows: []
    workflow_families: []
    journeys: []
  scopes: []
  decisions: []
  evidence: []
  metrics: []
---

# <Project title>

<!-- A Project comes from a Roadmap candidate, or, when the client already decided
the build, from an accepted Decision: then set roadmap: null, link the Decision in
decisions, and list this Project in that Decision's decision.affected. Link the
metrics this Project should move in metrics; each should have a Baseline before a
Scope is approved, and a missing one is flagged then. -->

## Project brief

<One or two short paragraphs covering the business objective, the problem being addressed, and the proposed business change.>

## Done when

- <Observable business completion criterion>
- <Observable business completion criterion>

<!-- expected
The people this change needs or affects, one row per person. The Project owner in
YAML decides; who confirms each step is in the skill's references/planning-model.md
("Who confirms"). Quote what each person has said about this change, cited, with a
one-word read that follows from their words: supports, has concerns, opposes, or not
yet known. Write nothing about a person you would not show them: no labels such as
"blocker", and no judgments of character.

## Stakeholders

| Person | Role | Stake in this change | What they've said about it |
|---|---|---|---|
| <Person> | <role link> | <Decides (Project owner); Must agree, on what; Decides what counts as correct (eval plan); or Daily work changes, and how> | "<Their words>" <citation> (<supports, has concerns, opposes, or not yet known>) |

When no row says Must agree, write a Must agree line under the table: No one else,
or Unresolved (and return the question).
-->

## Scoping notes

<!-- Prose covering: what is in and out of the business boundary, likely
technical work (areas that may need Technical Scopes), known constraints,
and only the open questions material to scoping.
Name likely technical work as a business boundary only — no stack, tool
names, or build mechanics. The build surface (tools, records, enforced policies)
belongs to Technical Scopes; a Project never carries it, in YAML or prose. -->

<Scoping prose>

<!--
Add a Future state when this Project changes how a workflow runs.
prompts/future-state.md writes it: one block per workflow the Project changes. Today
is the workflow's SOP, linked and not redrawn. The diagram is the whole proposed
workflow, exception paths included, with every step given one class from the
workflow's Step sort: unchanged, removed, code, model, llm, agent, or person.
Connect the steps with arrows; the example below shows only the classes.

## Future state

**Confirmed:** <The Project owner's words, and each must-agree person's, with their location, or a Decision link | not yet: proposal>

### <Workflow name>

- **Today:** <Link to the workflow's SOP>
- **State:** <next state | end state>
- **Targets:** <Links to the workflow's straight-through and exception-loop metrics>

```mermaid
%%{init: {"flowchart": {"curve": "step"}}}%%
flowchart TD
  A[<Step>]
  B[<Step>]
  class A unchanged
  class B code
  classDef unchanged fill:#2b313a,stroke:#9aa4b2,stroke-width:2px,color:#e8edf3
  classDef removed fill:#4c1d29,stroke:#f06a86,stroke-width:2px,color:#ffd3dc
  classDef code fill:#0f3d35,stroke:#34c3a3,stroke-width:2px,color:#c9f5eb
  classDef model fill:#22371a,stroke:#8fd15a,stroke-width:2px,color:#e2f6d3
  classDef llm fill:#2d2860,stroke:#9b92ff,stroke-width:2px,color:#e4e0ff
  classDef agent fill:#3d1d47,stroke:#d77be6,stroke-width:2px,color:#f7dbff
  classDef person fill:#14354d,stroke:#5fb2f0,stroke-width:2px,color:#d6eeff
```

**Against the documented process:** (only when the workflow has a Documented vs actual section)

```mermaid
%%{init: {"flowchart": {"curve": "step"}}}%%
flowchart TD
  A["<Step as documented>"]
  B["<New step> · new · code"]
  C["<Documented step the proposal drops> · dropped"]
  class A documented
  class B added
  class C dropped
  classDef documented fill:#2b313a,stroke:#9aa4b2,stroke-width:2px,color:#e8edf3
  classDef added fill:#4a3812,stroke:#f0b43c,stroke-width:2px,color:#ffe7b0
  classDef dropped fill:#4c1d29,stroke:#f06a86,stroke-width:2px,color:#ffd3dc
```

| Step | Outcome | Test and bar | Oversight or hand-over | Why, and the evidence | System and record |
|---|---|---|---|---|---|
| <Step> | <Removed, code, decision model, LLM, agent, or stays with a person; split: its parts and shares> | <From the workflow's Step sort> | <Acts alone, tells someone, or asks for approval; for a person, what is handed over> | <Why, cited> | <Where it runs and the record it updates> |

**Count:** Remove <n> · Code <n> · Decision model <n> · LLM <n> · Agent <n> · Person <n>
-->

<!--
Add a Value section once the Future state is confirmed. prompts/value.md writes it
from the targets, baselines, Step sort, and the hourly rates the client gave, and
updates it when a Scope sets its running cost. Hours come first; dollars only at a
rate the client gave. Hours times a rate is capacity value until the owner says what
the freed time goes to. Staff checking time is shown, not subtracted.

## Value

**Confirmed:** <The Project owner's words, with their location, or a Decision link | not yet: proposal>

| Per month | Conservative | Expected | Optimistic |
|---|---|---|---|
| Gross hours saved | <n h> | <n h> | <n h> |
| Capacity value at the client's rate | <$ | hours only> | <$> | <$> |
| Less running cost | <$ | not yet known> | <$> | <$> |
| Net value | <$> | <$> | <$> |
| Cost per case, before and after | <$ before, $ after> | <$, $> | <$, $> |
| Staff checking and fixing time, not subtracted | <n h, $> | <n h, $> | <n h, $> |

| Change | Arithmetic | Where it comes from | Rate | What the time goes to | Status | Evidence |
|---|---|---|---|---|---|---|
| <Metric: baseline to target> | <(12 − 3) min × 800 cases ÷ 60 = 120 h> | <Remove n h · Code n h · Decision model n h · LLM n h · Agent n h> | <$ per hour for the role, wage or loaded, who gave it | none: hours only> | <cut a cost | avoid a hire | move to <work> | absorb growth | nothing | not decided> | <estimate | measured | owner confirmed | finance confirmed> | <Citations> |

- **Revenue and risk:** <Revenue only in the client's own numbers, each link cited; risk in plain words and counts | none>
- **One-time cost and payback:** <As the client or builder gave it | not given>
-->

<!--
Add a Rollout when this Project changes anyone's daily work. prompts/rollout-plan.md
writes it once the Future state is confirmed. FDE App writes the plan; the client and
the builder carry it out.

## Rollout

**Confirmed:** <The Project owner's words, and each must-agree person's, with their location, or a Decision link | not yet: proposal>

| Person | What changes for them | Training |
|---|---|---|
| <Person, role link> | <In plain words> | <Format, and who makes it> |

- **Encouraging use:** <The few tactics that fit this team, and why>
- **Going live:** <As few steps as the risk allows, what must be true for each, and who says go>
- **Early support:** <Who people go to first, and how a problem reaches the builder>
- **Is it used?** <The share of work done by hand, with help, or fully automated, and where that is read; monitoring only when the client agrees>
- **Old way stops:** <When, who says so, and the fallback if the new way fails>
-->

<!--
Add a Proof section once the new way is live. prompts/value.md writes one block per
check, three and six months after go-live by default (the owner may add or move
them; the dates are kept as follow-ups): each measure re-run the same way as its Baseline, against the Baseline and the
projected scenarios, with signal or noise, quality, the whole process, use, running
cost from the bills, and checking time. Each check ends with the owner's words and
their decision.

## Proof

**Live since:** <YYYY-MM-DD, in the Project owner's words, with their location>
**Run log:** <Where each build's run log is kept and who can export it, from its completion report, cited>
**Checks:** <The follow-ups that hold the check dates: 3 and 6 months after go-live by default, and any the owner added>

### <3-month check> · <YYYY-MM-DD>

| Measure | Baseline | Projected (conservative / expected / optimistic) | Actual | Signal or noise | Verdict |
|---|---|---|---|---|---|
| <Metric, linked> | <Value> | <Value / value / value> | <Value; window; cases> | <A real change from <week> | normal variation | not measurable: why> | <below conservative | between conservative and expected | between expected and optimistic | above optimistic | not comparable: why> |

- **Quality:** <Accuracy on <n> cases graded by <expert>; rework and reopened cases, from the client's records>
- **Whole process:** <End-to-end time, and any step downstream that now waits longer>
- **Use:** <By hand n% · with help n% · fully automated n%, from <source>>
- **Running cost:** <Scope estimate $ to actual $, from <bill or usage report, month>; $ per case>
- **Checking time:** <n h a month, $; from <source>; not subtracted>
- **Owner:** <Their words, with their location | not yet> · **Decision:** <keep | change | scale | stop | not yet>
-->

<!--
Add a Release gate only when this Project replaces a tool or process the client
uses today. prompts/release-gate.md writes it. A Project that replaces nothing
has no gate. The Project owner decides, once each person who must agree has agreed;
until then, the gate is a proposal.

## Release gate

- **Replaces:** <The tool or process the client uses today, linked, and for what>
- **Agreed:** <The owner's words, and each must-agree person's, with their location, or a Decision link | not yet: proposal>

### Must ship before the switch

| # | Must | What the current tool does today | Impact | Confidence | Ease | Days | Score | Done |
|---|---|---|---|---|---|---|---|---|
| M-1 | <Business capability> | <Cited tool document, SOP, or evidence line, or the Policy or Decision that requires it> | <1-5> | <1-5> | <1-5> | <estimate> | <I x C x E> | <no; built, not yet accepted (the completion report); or yes (the acceptance of the owner and each person who must agree)> |

### After the switch, in order

| # | Item | Why it can wait | Impact | Confidence | Ease | Days | Score |
|---|---|---|---|---|---|---|---|
| A-1 | <Item> | <Reason> | <1-5> | <1-5> | <1-5> | <estimate> | <I x C x E> |

### Not doing

| # | Item | Why not |
|---|---|---|
| N-1 | <Item> | <Reason, so it stops coming back> |
-->
