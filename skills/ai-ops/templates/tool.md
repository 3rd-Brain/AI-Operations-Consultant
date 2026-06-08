# <Tool Name>

<!--
Template for a tool document inside the per-company library.
Created by the AI Ops Consultant V2 when a tool needs expansion beyond
its one-line entry in profile.md → Stack.
Lives at tools/<tool-slug>.md in the company library.

Records owned/touched by this tool are documented inline in the
"## Records in this tool" section below. The cross-tool registry lives at
data-architecture.md. There is no data-sources/ folder in V2.
-->

**Website:** <url>
**API docs:** <url or "none">
**Plan / tier:** <what the user is currently paying for — e.g. "Pro ($49/mo)", "Free", "Enterprise">
**Cloud or local:** <cloud SaaS | on-prem | desktop app | self-hosted>
**Last updated:** YYYY-MM-DD

## Purpose

<1–2 sentences. What this tool does for the business and why it exists in the stack.>

## Records in this tool

- **<record-slug>** — <one-line description; inline notes on format / access when known>
- **<record-slug>** (Synced from <tool-slug>) — <description>
- **<record-slug>** (Exported to <tool-slug>) — <description>
- **<record-slug>** (Bidirectional sync with <tool-slug>) — <description>

A record without a flow tag is owned by this tool. With a flow tag, the parenthetical says where the source of truth is or where copies land. For the full cross-tool registry and fragmentation analysis, see [data-architecture.md](../data-architecture.md).

## Integrations

- **<Automation platform>** — <what's connected and how> (e.g. "Zapier — new row trigger sends to Slack #orders")
- **<Native integration>** — <what it connects to natively> (e.g. "Shopify — syncs product catalog")
- **<MCP / plugin>** — <if relevant> (e.g. "official MCP server available")
