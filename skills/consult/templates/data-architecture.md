---
ai_ops:
  id: data-architecture:company
  type: data-architecture
records:
  - id: record:<record-slug>
    kind: <spine | signal | communication | work-product | config>
    source_of_truth: tool:<tool-slug> | unresolved
    replicas:
      - system: tool:<tool-slug>
        sync: <native | automation | manual | none | unresolved>
    parent_record: record:<record-slug> | null
---

# Data Architecture — <Company Name>

**Last updated:** YYYY-MM-DD

## Architecture

```mermaid
%%{init: {"flowchart": {"curve": "step"}}}%%
<tools, records, relationships, and connections; keep the init line so edges render as right angles. Mark manual bridges between systems with a dashed edge labeled [MANUAL] and records duplicated or split across systems with no sync with [FRAGMENTED] on the node.
Color nodes by business domain with classDefs — one per domain (dark fill + saturated stroke + color:#e8edf3), e.g.:
  classDef core fill:#3a2f14,stroke:#d4a23a,color:#e8edf3;
  classDef crm fill:#14283c,stroke:#5a9bd4,color:#e8edf3;
  classDef exiting fill:#33161a,stroke:#e05d5d,color:#e8edf3,stroke-width:2px,stroke-dasharray:4 3;
  classDef retiring fill:#382312,stroke:#c60,color:#e8edf3,stroke-width:2px,stroke-dasharray:6 3;
then assign with `class NODE1,NODE2 domain;` — exiting/retiring systems keep their dashed strokes>
```

## Sources of truth

| Record | Kind | Source of truth | Also lives in | Sync |
|---|---|---|---|---|
| <record-slug> | <kind> | <tool or unresolved> | <tools or none> | <methods or unresolved> |

## Manual bridges

| From | To | What moves | Frequency |
|---|---|---|---|
| <system> | <system> | <record/data moved manually> | <frequency> |

## Fragmentation points

- **<Record>:** <where it is fragmented, operational impact, and current sync state>.
