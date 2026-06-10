# Stack Recommendations

Default stack recommendations for the AI Ops Consultant when producing build scopes. Two paths — code and no-code — picked based on who's building and what the build needs.

**Code path** is the default when:
- The build has a developer or AI agent (Claude Code, Cowork, Codex) doing the work
- The build needs custom logic the no-code path can't handle
- The user already lives in a code-fluent environment

**No-code path** is the default when:
- The user self-builds with no dev support
- The build is simple enough — a linear automation, a form, a basic CRUD surface
- The user already lives in a no-code tool (Make, Airtable, Notion, ClickUp, etc.)

When the user's tool research shows they already run something that cleanly fits the build, prefer what they have and surface the choice in the scope. These recommendations are for fresh builds — they are not impositions over existing infrastructure.

---

## Code path

## Language

**Python (with `uv` for env / dependency management)** is the default for most builds — scripts, automations, integrations, AI agents, API services.

**TypeScript / Node** is the alternate. Use it when there's an existing Node ecosystem, browser-side code, or a Vercel hosting target in the picture.

## Validation / data models

**Pydantic.** Every record the build reads or writes, every API response, every config value goes through a Pydantic model. The type discipline is what makes the build legible to humans, AI agents, and future maintainers.

For TypeScript builds, use **Zod** as the equivalent.

## AI agents

Pick the agent runtime based on where the user already lives:

- **User is in the Anthropic stack** (Claude Teams, Claude API in use) → **Claude Agent SDK**
- **User is in the OpenAI stack** (ChatGPT for Business, OpenAI API in use) → **OpenAI Agents SDK**
- **User has no existing AI stack** → **Pydantic AI** — vendor-agnostic; user picks the model at config time, no lock-in
- **Trivial one-shot LLM call** (no tools, no loop, no structured output across multiple turns) → the provider's direct SDK is lighter than an agent framework

## HTTP / API services

**FastAPI** for any service that exposes endpoints or receives webhooks. Pydantic-native, async-friendly, well-documented.

For TypeScript: **Hono** as the equivalent.

## Storage

- **Embedded / single-user** → **SQLite** (file-based, zero ops, included with Python)
- **Tiny structured state** (a list of settings, a dozen rows, a config) → **flat JSON file** or **Google Sheets** (if the user already has Google Workspace)
- **Hosted paid DB beyond their tools or Google Sheets** → **Supabase** (Postgres + auth + storage + realtime; easy setup, generous free tier)
- **ORM when SQL matters** → **SQLModel** (Pydantic + SQLAlchemy combined)

## Config

**Pydantic Settings.** Env vars and config files load into a typed model with validation.

## HTTP client

**`httpx`.** Modern Python HTTP client, sync and async, Pydantic-friendly via `response.json()` → Pydantic model.

## Scheduling

- **Python script + cron** (systemd timer on Linux, Task Scheduler on Windows) for local
- **GitHub Actions cron** for hosted scheduled jobs

No SaaS orchestration as a default. Pick a scheduling tool only when the user already runs one.

## Hosting

- **Long-running services / APIs** → **Fly.io**
- **Scheduled jobs** → **GitHub Actions**
- **Prototypes / single-user** → **local**

## Auth

Skip auth entirely for single-user builds.

When multi-user auth is required → **Clerk.** Easier setup than alternatives, generous free tier.

## CMS

When a content-management surface is required → **Payload CMS.** Code-first, TypeScript-native, self-hostable.

## Integration patterns

**Direct REST API calls via `httpx` or the vendor's official SDK.** Response payloads parse into Pydantic models. This is most integrations — there's no need to reach for an orchestration framework.

**MCP** when the user already has the connector wired up — don't propose adding MCP infrastructure as part of the build.

## Observability

**Logfire** (Pydantic's own) when observability matters — structured logs, tracing, dashboards.

Skip observability tooling for simple scripts. Print statements and exit codes are fine.

## TypeScript alternate stack

When the build is in TypeScript instead of Python:

- **Validation:** Zod
- **HTTP:** Hono
- **AI:** Vercel AI SDK or the provider's direct SDK
- **Storage:** SQLite (`better-sqlite3`), Supabase, or flat JSON
- **Hosting:** Vercel (frontends), Fly.io (long-running)
- **Auth:** Clerk

---

## No-code path

### Automation / integration

- **Make** — default. More capable than Zapier for ops work, lower cost at scale, visual scenario builder fits how users think.
- **n8n** — when the user wants open source and self-hosting.
- **Pipedream** — hybrid path: code-friendly (write Node / Python steps in a workflow) without standing up a full runtime. Good when the build is *mostly* no-code with a few custom steps.

### Data storage

Most users already have a place for data. Use what they have before adding anything new:

- **Existing PM / DB tool** — Notion, Monday, ClickUp, Airtable. 99% of the time one of these is already in play; route data there.
- **Google Sheets / Google Drive** — when there's no existing tool and the build is simple. Sheets for tabular data, Drive for files. Goes a long way before needing anything more.
- **Supabase** — when the build needs real DB scale (concurrent writes, joins across thousands of rows, real-time subscriptions). Same recommendation as the code path.

### Forms / intake

- **Tally** — default for forms, surveys, intake. Lightweight, integrates with Make and the existing tool stack.

### AI inside no-code

- **Make's AI modules** — call Claude / OpenAI / Anthropic from inside a scenario; pair with structured-output prompts.
- **Airtable AI fields** — when the data lives in Airtable and the AI step is per-row.
- **Pipedream + provider SDK** — when the no-code path needs an AI step that's more than Make's modules can handle cleanly.
