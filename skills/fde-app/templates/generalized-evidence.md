---
ai_ops:
  id: evidence:<model-qualified-slug>
  type: evidence
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
evidence:
  source:
    type: web
    locator: https://example.com/source
    publisher: null
    language: null
    captured_at: "<YYYY-MM-DDTHH:MM:SSZ>"
    capture_engine: null
    published_at: null
    quality: unknown
  review_after: null
  references:
    roles: []
    tools: []
    workflows: []
    workflow_families: []
    records: []
    decisions: []
    policies: []
    roadmaps: []
    scopes: []
    research: []
    evidence: []
---

# <Evidence source>

<!--
One Evidence artifact per material source, saved before synthesis. Record: the canonical
safe locator, publisher or author, publication date when known, capture date and capture
engine (native search discovers; Firecrawl captures pages; TranscriptAPI captures YouTube
transcripts), source type and language, and quality/applicability/freshness/conflicts/
limitations. Native-search snippets are leads, not evidence. Keep the unchanged capture
separate from the excerpts. Do not store credentials in the locator, capture, or notes.
-->

## Source summary

## Captured source (unchanged)

<The raw captured page text or transcript, unedited. Empty only when a capability was
unavailable — then name the missing capability and the coverage it affects.>

## Relevant excerpts or observations

<Excerpts and observations kept separate from the raw capture above.>

## Applicability and limitations

## Review notes
