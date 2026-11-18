# Record and Workflow Boundaries

Use this reference when mapping records, decomposing a requested capability into a Workflow Family, or writing one workflow.

## Core rule

> A workflow owns one business outcome for one primary record.

Responsibility defines the workflow boundary. Records test and constrain it.

When accomplishing the outcome requires producing another durable record with its own independent lifecycle, accountable ownership, or automation potential, that work normally becomes another workflow in the family.

Record existence alone is not a workflow boundary. The evidence must also establish work with an outcome and accountable responsibility around that record. A confirmed record with no confirmed work remains in `data-architecture.md` and becomes a boundary question, not a mechanical workflow.

## Primary record

The primary record is the durable business record whose state or evidence best represents the workflow's outcome.

A workflow need not create its primary record. Reply triage may operate on an inbound `reply`; proposal approval may operate on an existing `proposal`.

Several workflows may share a primary record when they own different outcomes or responsibilities. Proposal Production and Proposal Approval may both center on `proposal`.

## Responsibility-boundary questions

1. What business outcome does this unit own?
2. Who is accountable for that outcome?
3. Which record best represents the work and its state?
4. Does the work create or hand off another durable record?
5. Does that record have an independent lifecycle, owner, control path, or automation potential?
6. Can the work be reused independently elsewhere?
7. Would keeping it inline hide a meaningful handoff or responsibility boundary?

## Normally remains a step

- field, note, tag, score, classification, owner, or status updates;
- technical logs, receipts, timestamps, and temporary exports;
- channel/format variants of the same responsibility and record type;
- supporting artifacts with no independent lifecycle or accountable owner;
- work that cannot be meaningfully operated or automated independently.

## Normally becomes another workflow

- a distinct business outcome with accountable ownership;
- creation or handling of a durable record with an independent lifecycle;
- a meaningful approval, control, or handoff boundary;
- a reusable unit shared across several families;
- work with independent automation, monitoring, failure, or recovery behavior.

## Record kinds

Every accepted business record has one canonical kind in `data-architecture.md`:

| Kind | Meaning |
|---|---|
| `spine` | Lifecycle record coordinating other records through state and references |
| `signal` | Business-semantic event the company reacts to |
| `communication` | Distinct business message sent or received |
| `work-product` | Durable artifact that is neither a message nor signal |
| `config` | Stable information that parameterizes repeated work |

## Record or field

Evidence that something is a record:

- independent identity;
- independent lifecycle/status;
- several instances can relate to one parent;
- its own provenance;
- it can trigger work;
- flattening it would lose history, multiplicity, or auditability.

Business-semantic communications and signals receive a presumption in favor of being records. Generic email, calendar, or infrastructure events are not automatically business records.

## Over-unified records

An over-unified record combines lifecycle coordination with the contents or histories of communications, signals, or other durable artifacts.

Common symptoms:

- a spine “holds every pitch, reply, or follow-up”;
- alerts or bookings are embedded inside a deal/account/file;
- one lifecycle record stores message bodies or event payloads;
- the architecture contains no communications or signals despite obvious messaging/event work.

Correct by keeping state and references on the spine and splitting communications, signals, and durable work-products into first-class records that reference it.

## Workflow Family

A Workflow Family is the discovered set of workflows required to accomplish the broad outcome the client requested. Its permanent file at `workflow-families/<family-slug>.md` owns:

- member workflows;
- ordering and handoffs;
- shared workflows;
- optional real coordination workflow;
- cross-workflow automation candidates;
- open boundary questions.

Do not manufacture a parent workflow just to hold links. A coordination workflow exists only when coordination has its own outcome, accountable responsibility, primary record, and meaningful work.

## Current versus reference

Current-state workflows are written from client evidence and accepted current repository context.

Generalized-reference material may identify questions or differences, but it does not become current-state SOP content.

Record relationships and expected controls constrain the artifact but do not prove that a person currently performs a corresponding step. Do not convert a parent reference, required field, validation rule, or plausible safeguard into SOP work without current-state evidence.

## Canonicality

- YAML is canonical for identity and structural relationships.
- Markdown is canonical for outcomes, SOP meaning, rationale, exceptions, findings, and interpretation.
- `data-architecture.md` owns record kind and source of truth.
- A Workflow Family's YAML owns member, shared-workflow, coordination-workflow, and handoff relationships.
- A Workflow Family's Markdown owns family outcome, coordination rationale, cross-workflow automation candidates, and open questions.
- Workflow YAML references its primary record; it does not reclassify it.
- Structural display fields in Markdown are derived and must agree with YAML.
