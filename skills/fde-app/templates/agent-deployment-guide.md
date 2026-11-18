---
deployment_guide:
  scope: technical-scope:<scope-slug>
  package: agents/<skill-name>/
---

# Deploying <Agent name>

<!-- For whoever stands the agent up: a partner or the client's own technical
person. prompts/agent-skill.md fills it from the agent Scope. FDE App never
deploys anything. Lives at agents/<skill-name>-deployment-guide.md, beside the
package, so the package folder is exactly what gets installed. -->

Built from [<Scope title>](<relative link to the Scope>). The package is [`agents/<skill-name>/`](<skill-name>/).

## Runtime

- **Runtime:** <The runtime the Scope names, with version>
- **Hosting:** <The machine class and where it runs, as the Scope says; or the open question>
- **Model tiers:** <Which model does judgment work and which does bulk work, and the settings to wire, by name>

## Install

<Download the package folder from the company's library in the FDE App web app and copy it, unchanged, to where the runtime loads skills; set up the work folder the skill names; connect each channel and connection the Scope lists; and confirm the runtime loads the skill.>

## Knowledge

<How the agent reads the client library, read-only: a copy downloaded from the FDE App web app at the path the skill expects, and how often it is downloaded again to stay current; or the FDE App connector's `read_document`, with its sign-in listed under Credential exposure.>

## Credential exposure

<!-- Required. Never leave this section out. -->

| Credential or inbox | Access it gets | Where it is kept | How to prove the limit holds |
|---|---|---|---|
| <Name, never a value> | <Only what the Scope allows> | <The runtime's secret store> | <Try one thing the agent must not do alone; it stops for a person> |

- **Needs a person:** <What the agent drafts and a person sends or approves, and how this runtime holds it until they do>

## Acceptance checks

Run every check before handover. Each is one of the Scope's acceptance criteria.

| # | Criterion (must it delivers) | How to run it here | Passes when |
|---|---|---|---|
| 1 | <Criterion as the Scope words it> | <Steps on this runtime> | <The result that passes> |

## Switch off

<How to stop the agent and return the work to people, from the Scope's Delivery and rollback.>

## Changes and problems

Do not edit the installed copy. Send changes and problems to <the consultant or owner and how to reach them>; the copy in the client library is the one that changes.

## Hand back

When the checks pass, send the completion report described under the Scope's [Acceptance criteria](<relative link to the Scope>#acceptance-criteria). Delivery is complete only when the client accepts it.
