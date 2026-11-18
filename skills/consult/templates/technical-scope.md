---
ai_ops:
  id: technical-scope:<scope-slug>
  type: technical-scope
technical_scope:
  project: project:<project-slug>
  depends_on: []
  affected:
    tools: []
    records: []
    policies: []
  decisions: []
  evidence: []
---

# <Scope title>

## Build brief

<Exact technical deliverable and one link line naming the parent Project.
Do not restate the Project's business outcome, owner, or done-when — the
business surface (roles, workflows, journeys) is reached through the
project relationship, never repeated here.>

- **In:** <Included technical work>
- **Out:** <Explicit exclusions>
- **Scope type:** <automation, agent, internal tool, or other>

## Technical specification

- **Stack:** <Approved tools, platforms, and frameworks>
- **Trigger and inputs:** <What starts the system and what it receives>
- **Outputs:** <What it produces and where it goes>
- **Systems and interfaces:** <APIs, files, services, and integrations>
- **Records and data:** <Fields, ownership, sources of truth, and handling rules>
- **Controls:** <Permissions, security, privacy, and human review; name the Policies the build must enforce and any approved exceptions>
- **Failure behavior:** <What happens when something fails>

<!--
Add Running cost when the build costs money to run: model usage, tool and API calls,
platform or seat fees. Price each part from the stack's published prices at the
Project's case volume, labelled estimate, with the price page and its date. A price
that cannot be found is a question, never a guess. prompts/value.md subtracts the
total from the Project's value.

## Running cost

| Part | Charged per | Use per month | Cost per month | Source |
|---|---|---|---|---|
| <Model usage | a tool or API | a platform or seat fee> | <token, call, run, seat, or flat> | <From the Project's case volume> | <$, estimate> | <Price page and its date> |

**Total:** <$ per month, estimate> · **Per case:** <$>
-->

<!--
Add the one section that matches the Scope type. An "other" Scope adds none.

## Automation build

- **Platform:** <n8n, Make, or Zapier; all three are first-class. Say why this one.>
- **Trigger:** <The event, schedule, or webhook that starts it>
- **Systems and steps:** <Each system it touches, in step order>
- **Connections:** <Required. Each account or API key it connects with, including the platform account it runs in: what it may read and write, who creates it, and where it is kept; never the value>
- **Tests:** <The test runs the builder performs, the test records or test account each uses, and the results that pass>
- **Run log:** <Required. Where the automation writes one row per step per case: the record ID, the SOP's step name, start and finish times, the outcome (done, handed to a role and why, or failed), and the model and tokens used when it calls one>
- **Rollback:** <How to switch it off and return to the prior process>

The deliverable is the working automation on that platform, built by a person or an agent with access to it; FDE App never builds it. The builder builds it switched off, runs the Tests on test records, and switches it on for real work only when the Project owner says so.

## Agent build

- **Role:** <The job the agent owns; link the role document when one exists>
- **Tools and access:** <Each tool, what it may read, and what it may write>
- **Handoffs and escalation:** <When it hands work to a person or another system>
- **Credential exposure:** <Required. Scoped credentials or inboxes, draft-first human approval gates, and what the agent can never send or change without a person>
- **Runtime target:** <Harness-native skill, Hermes Agent, OpenClaw, or another runtime, plus the model tier it needs. The runtime is a reversible deployment detail.>
- **Evaluation:** <See the Eval plan section>
- **Run log:** <Required. Where the agent writes one row per step per case: the record ID, the SOP's step name, start and finish times, the outcome (done, handed to a role and why, or failed), and the model and tokens used>

The deliverable is a portable skill package. Deploying it is out of scope; a partner deployment guide covers that.

## Internal tool build

- **Users and roles:** <Who uses it and what each can do>
- **First usable screen:** <The smallest frontend slice that is useful on its own; build this first>
- **State owner:** <The single component that owns the data>
- **Failure visibility:** <How errors show up to users and to the owner>
- **User acceptance:** <What a user does to confirm it works>
-->

<!--
Add an Eval plan when an AI model makes a judgment in this Scope.
prompts/eval-plan.md writes it, and the test cases live in evals/<scope-slug>.md.
FDE App designs the plan; the builder runs it.

## Eval plan

- **Decides what counts as correct:** <Person, role link>
- **Approved:** <The Project owner's words, and each must-agree person's, with their location, or a Decision link | not yet: proposal>
- **Test cases:** <Link to evals/<scope-slug>.md>
- **Status:** <designed | run | passed | failed: the cases that failed>

| Criterion | Measured as | Graded by | Pass bar | Why this bar |
|---|---|---|---|---|
| <Quality aspect, traced to Done when or a target> | <How it is counted> | <A rule check, the expert, or an AI grader that agrees with the expert's labels> | <The bar, the runs that must all pass, and the comparison with people today> | <The business reason> |

| Failure | Severity |
|---|---|
| <A named kind of failure> | <Never allowed, serious, or minor> |
-->

## Delivery and rollback

<Implementation sequence, dependencies, migration, release approach, monitoring, support, and reversal plan.>

## Acceptance criteria

- <Observable and testable technical criterion; when the Project has a Release gate, the must it delivers>
- <Observable and testable technical criterion>

When the build ships, the builder hands back a completion report: for each acceptance criterion, the test run or result that shows it; when the Scope has an Eval plan, the result of each acceptance case on each run; what was built and where it runs (platform and the workflow, scenario, or agent name or ID; say where credentials are kept, never the credentials); which workflow steps it now does on real work and which stay with a person; for an automation or agent, where to read cycle time, exception rate, and automation coverage, and where its run log is kept; how to switch it off; and anything not delivered. Delivery is complete only when the client accepts it.

## Risks and open questions

- <Only unresolved issues material to building or approving the Scope>
