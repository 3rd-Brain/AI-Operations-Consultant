---
ai_ops:
  id: profile:company
  type: company-profile
profile:
  roles: []
  tools: []
  records: []
  workflows: []
---

# <Company Name>

<!--
Template for the company-level profile.md at the library root. Update it
in place when the company-level facts change. Saved versions preserve prior versions.

This is the user-facing summary. Sibling files in the library expand:
  - roles/<role-slug>.md
  - workflows/<workflow-slug>.md
  - tools/<tool-slug>.md
  - data-architecture.md (canonical record registry — records have no standalone files)
  - pains-and-bottlenecks.md (deduplicated goals and problems)

No duplication: profile.md holds CORE info; siblings hold expansion only.
-->

**Website:** <url>           **Industry:** <industry / sub-vertical>
**Size:** <revenue band> · <headcount band>           **Lifecycle:** <stage>
**Geography:** <single office / distributed / fully remote>
**Last updated:** <YYYY-MM-DD>

---

## What we do

<2–3 sentences. What the business sells, who buys it, what makes it distinct. User's own words preferred.>

## Org shape

<Departments + named roles. One line per role with one-line description. Pointer to roles/<role-slug>.md for the full role doc.>

- **<Role title>** — <one-line description> → [<role-slug>.md](roles/<role-slug>.md)
- **<Role title>** — <one-line description> → [<role-slug>.md](roles/<role-slug>.md)

## Stack

<Named tools by brand. One line per tool with one-line role. Pointer to tools/<tool-slug>.md for any tool that needs expansion (integrations, API state, on-prem vs cloud, license seats).>

- **<Tool name>** — <what it's used for> → [<tool-slug>.md](tools/<tool-slug>.md)
- **<Tool name>** — <what it's used for>

## Key records

<The record types this business operates on. One line per type. Records have no standalone files; their canonical entries live in data-architecture.md. Reference by name and point to the source-of-truth tool when useful.>

- **<Record type>** — <one-line description> · owned by [<tool-slug>.md](tools/<tool-slug>.md)
- **<Record type>** — <one-line description>

## Workflows

<Named jobs the business runs. One line per workflow with one-line description. Pointer to workflows/<workflow-slug>.md for the full SOP.>

- **<Workflow name>** — <one-line description> → [<workflow-slug>.md](workflows/<workflow-slug>.md)
- **<Workflow name>** — <one-line description>

## Primary goal

<Single forced choice. One sentence, cited. What the sponsor is trying to change in their business right now.>

<!-- expected
Who decides, written under the goal. Cite each line. A job title alone is not
evidence. When the evidence does not say, write Unresolved and return the question.

- **Sponsor:** <Person>, <role link>: whose priority this goal is, and who can tell the affected teams their work is changing. <citation> | Unresolved
- **Must agree:** <Person> on <area>: signs off on any change there. <citation> | No one else
-->

<!--
- **Delegated:** <Person> decides <area>, handed over by <person>. <citation>

Write one Delegated line per standing handover, or none. The people for one change
are in that Project's Stakeholders section, not here.
-->

## Top pains

- "<quoted or paraphrased from user>" — *stated*
- "<pain grounded in specific conversation evidence>" — *grounded*

## Recent timeline

<Last 6–12 months: what changed (new leadership, new product, acquisition, layoff, big contract, etc.). What's coming next (planned changes, upcoming deadlines, anticipated growth events).>

## Operating signal

<Describe the evidence-grounded current position, binding constraint, and most useful next move in plain language. When a maturity method was explicitly supplied, include only the applicable maturity, Consistency/Clarity/Capacity, or People/Process/Tools signal; otherwise do not force framework labels.>

<!--
CONDITIONAL maturity fields — include this block ONLY when a maturity assessment was
performed (the orchestrator supplied an effective value). An unassessed profile omits
the whole block and carries no framework labels. There is one effective value with a
recorded setter; do not create competing model-assessed and human-assessed values, and
do not add a YAML maturity status.

- Effective maturity: <Level 1 / Level 2 / Level 3 / Level 4 / Level 5 / unknown>
- Set by: <model-assessed | human-override — with the override reason>
- Evidence: <paths supporting the value>
- Confidence: <low / medium / high>
- Evidence gaps: <what is missing or would change the value>
- Binding constraint: <Consistency / Clarity / Capacity currently limiting progress>
- Primary lever: <People / Process / Tools move that would move the value>
-->

## Pointer

For the deduplicated list of goals and problems currently tracked for this company, see [pains-and-bottlenecks.md](pains-and-bottlenecks.md).
