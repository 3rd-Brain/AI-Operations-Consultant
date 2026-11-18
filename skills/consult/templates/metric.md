---
ai_ops:
  id: metric:<metric-slug>
  type: metric
metric:
  unit: <unit>
  owner: role:<role-slug> | null
  source_records: []
  workflows: []
  workflow_families: []
  journeys: []
  projects: []
  policies: []
  evidence: []
---

# <Metric>

## Definition

<What is measured and the exact calculation.>

## Observation method

<Source, collection method, cadence, owner, and quality limits.>

<!--
Add a Baseline when a Project is meant to move this metric, before its Scope is
approved; a missing one is flagged at that approval, not blocked. Label the value
reported, estimated, or unknown. Keep the source, the calculation, the time window,
and the number of cases, so it can be re-run the same way after the build. With no
logs to measure from, estimate it as low, likely, and high, from people timing one
unit of work ("how long does one invoice take?", not "what share of your day?"), or
counts started during discovery. When speed is the goal,
record work time and waiting time separately when the data shows them. Measure again
if the workflow changes before the build.

## Baseline

- **Value:** <Value> (<reported | estimated: low, likely, high | unknown>)
- **Source:** <The export, query, or session, linked to its evidence index row>
- **How:** <The calculation, the time window, and the number of cases>
- **Measured:** <YYYY-MM-DD>
-->

<!--
Add a Target when a redesign is meant to move this metric; the future-state
specialist proposes it with the Project's Future state, and it is agreed there.
Targets are estimates: write conservative, expected, and optimistic. Write the
definition once: where a case starts and ends, and what counts as a person stepping
in. A planned sign-off, such as approving a refund, is not an exception. Failed cases
count against the target. A straight-through target always carries a minimum
accuracy: a case that went through wrong counts as an exception.

## Target

- **Definition:** <Where a case starts and ends, and what counts as stepping in>
- **Target:** <Conservative / expected / optimistic>, from the Baseline
- **Minimum accuracy:** <For a straight-through target>
- **Based on:** <Beating today's manual process, a named benchmark, or the client's own number>, covering <which cases>
- **Project:** <Link to the Project whose Future state proposes it>
-->

<!--
Add Results once a Project that moves this metric is live. prompts/value.md writes one
row per check, re-run the same way as the Baseline: the same source, calculation, and
case definition, over a window of the same length. A measure taken another way is not
comparable, and says so.

## Results

| Check | Value | Window and cases | Taken the same way as the Baseline | Against the target |
|---|---|---|---|---|
| <3-month check, YYYY-MM-DD> | <Value> | <From, to; n cases> | <yes | no: what changed> | <below conservative | between conservative and expected | between expected and optimistic | above optimistic> |
-->

## Interpretation

<What a change can and cannot establish. Do not claim causality without evidence.>

## Decisions and open questions

<Accepted targets or thresholds only when explicitly decided; otherwise unresolved questions.>
