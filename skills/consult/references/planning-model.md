# Roadmap, Project, and Technical Scope Planning

Use this reference when accepted library context is translated into reviewable proposed work.

## Hierarchy

Specific business goal → Roadmap → individually approved Project → Technical Scope when needed.

A Roadmap explains the operating route to one goal and proposes Project candidates in Markdown. A candidate has no artifact ID, graph node, YAML relationship, or standalone file before individual approval.

When the user approves one candidate, materialize one Project under projects/approved/, assign project:<slug>, add the direct relationship to the Roadmap, and replace the candidate heading with a readable Project link. Roadmap approval never approves every candidate.

When the client arrives with the build already decided, there is no route to plan. Record the choice as an accepted Decision (who decided, the outcome, and why no Roadmap is needed) that lists the Project in `decision.affected`, then create the Project with `roadmap: null` and the Decision in `project.decisions`. Validation requires one of the two origins. If the goal could have other routes, ask whether a Roadmap is wanted: finding the second and third candidates is what a Roadmap is for.

A Project owns one measurable business outcome under one business owner. It is not a technical specification. A Technical Scope owns one builder-ready technical delivery contract contributing to the Project. A nontechnical Project may have no Scope; one Project may have several independently approved Scopes.

## Relationship ownership

Project and Technical Scope `affected` surfaces are disjoint by schema. The Project owns the business-change surface: roles, workflows, workflow families, and journeys. The Scope owns the build surface: tools, records, and the Policies the build must enforce. No key appears on both types, so the same fact is never canonical in two places; cross-context is derived through the Scope's `project` relationship (and a nontechnical Project reaches tools through its workflows). In prose the same rule applies: a Project names likely technical work without stack or mechanics, and a Scope links to its Project without restating the business outcome.

## Approval boundaries

Keep Roadmap approval, Project approval, release-gate agreement, Scope approval, execution authorization, Scope completion, Project completion, and Roadmap completion distinct. Approval at one level never silently grants the next decision.

Folder location is canonical lifecycle state for Roadmaps, Projects, and Technical Scopes. Do not repeat lifecycle status in YAML.

## Who confirms

A proposal stays a proposal until the person who holds the step confirms it in their own words, said in the conversation or quoted with its location (see Approvals in `SKILL.md`). The sponsor and any standing Delegated or Must agree lines are under Primary goal in `profile.md`; the people for one change are in its Project's Stakeholders section.

| Step | Who confirms |
|---|---|
| Pain ranking | The sponsor |
| Roadmap | The sponsor |
| Approving a Project | The sponsor |
| Future state and its targets, Release gate, and acceptance of a Scope's delivery | The Project owner, once each person who must agree has agreed |
| Value | The Project owner; finance confirmation comes from whoever keeps the books |
| Proof check after go-live, and what happens next (keep, change, scale, or stop) | The Project owner |
| A follow-up's date and owner | The Project owner, or the person the follow-up names |
| Rollout | The Project owner, once each person who must agree has agreed |
| Eval plan | The Project owner, once each person who must agree has agreed; the expert it names decides what counts as correct |
| Technical Scope | The Project owner |

- People who must agree sign off where the process changes: the Release gate and accepting what was built. Their list is written after the Project is approved, so it does not hold up the approval.
- Agreement from someone who must agree is recorded the same way: their words with the location, or a Decision. Until it lands, the step reads as a proposal and names who has not agreed.
- Whoever holds a step can hand it to someone else. The handover counts when they say so, cited. A standing handover is a Delegated line in the profile; for one Project, make that person its owner.
- When the sponsor or owner is Unresolved, the step stays a proposal and who decides is a question.
- When a Scope is approved, each metric its Project links that has no Baseline is flagged, and so is a Scope with AI in it that has no approved Eval plan. The flags do not block the approval.
- In an owner-run business, the owner usually holds every row.

## Lifecycle states and transitions

Roadmap states are `draft`, `approved`, `active`, `completed`, and `archive`. Technical Scope states use the same set. A Project has no `draft` file — before approval it lives only as a candidate inside Roadmap Markdown — and its states are `approved`, `active`, `paused`, `completed`, and `archive`. `approved` never authorizes implementation; `active` means work explicitly started and is not inferred from approval.

A transition is a deliberate orchestrator action, never automated from child state, elapsed time, test results, or inferred progress:

1. Require an approval for the target state that meets the Approvals rules in `SKILL.md`: the holder's own words, or their words quoted with location from a saved source.
2. Confirm the move does not imply an adjacent approval or execution authorization.
3. Move the artifact between lifecycle folders in one `save_documents` call with `moves`, together with the link updates.
4. Update relative Markdown links affected by the move.
5. Preserve stable artifact IDs and direct YAML relationships.
6. Record consequential approval rationale as a Decision artifact when warranted.
7. Check the findings the save returned; `list_versions` shows the change.
8. The saved batch is the transition record.

## Planning, not execution

Planning files do not authorize implementation, invoke a builder, operate a client system, claim deployment, or prove benefits. Timeline, budget, priority, and vendor choices appear only when explicitly decided. A Release gate may propose an order; it reads as a proposal until the owner, and each person who must agree, agrees it. Significant choices use progressive Decision artifacts and saved versions.

There is no execution Portfolio. Cross-Roadmap views are derived from Roadmaps, Projects, Scopes, and their direct relationships.
