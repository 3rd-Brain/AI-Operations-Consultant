# Installing DOI Method

DOI Method ships as both a Claude Code CLI plugin and a set of Cowork-compatible `.skill` packages. Pick the path that matches your environment.

## Claude Code CLI

### Option A — Install via plugin marketplace (recommended)

In Claude Code, run:

```
/plugin marketplace add 3rd-Brain/AI-Operations-Consultant
/plugin install doi-method@doi-method
```

Then start the engagement:

```
/doi-run
```

or with the explicit namespace:

```
/doi-method:doi-run
```

### Option B — Manual install from a local clone

```bash
git clone https://github.com/3rd-Brain/AI-Operations-Consultant.git doi-method
cd doi-method
./install-doi.sh
```

This symlinks (or copies, if not a git checkout) the repo into `~/.claude/plugins/doi-method/`. `git pull` from the clone to update.

For a flat, pre-plugin-era install:

```bash
./install-doi.sh --legacy
```

That one copies `skills/` → `~/.claude/skills/`, `agents/` → `~/.claude/agents/`, and `scripts/` → `~/.claude/scripts/doi/`.

## Cowork

Cowork uses a separate skill system and can't consume the plugin marketplace. Install DOI as individual skills instead.

1. Download the `.skill` files from `dist/cowork/` in this repo (either clone the repo or grab them from the GitHub release).
2. In Cowork, go to **Skills → Create skill → Import from `.skill` file** and upload each file.

All 12 skills are needed for the full engagement flow. At minimum, install `doi-run.skill` as the entry point.

**Why two formats?** Claude Code CLI requires `user-invocable: true` in each SKILL.md frontmatter so slash commands resolve. Cowork's skill validator rejects that property as unknown. `scripts/build-cowork-skills.py` strips it during packaging, so the `.skill` files are Cowork-clean while the source skills stay CLI-compatible.

## Rebuilding the Cowork packages

If you edit a skill and want to refresh `dist/cowork/`:

```bash
python scripts/build-cowork-skills.py
```

Or package a single skill:

```bash
python scripts/build-cowork-skills.py --skill doi-run
```

## Verify

Claude Code CLI: `/doi-run` should return the DOI intake intro.

Cowork: `/doi-method:doi-run` or `/doi-run` (if invocable without the namespace prefix) should do the same.

## Uninstall

**CLI plugin:** `/plugin uninstall doi-method@doi-method`

**CLI manual install:** `rm -rf ~/.claude/plugins/doi-method`

**CLI legacy install:** `rm -rf ~/.claude/skills/doi-* ~/.claude/agents/doi-review ~/.claude/scripts/doi/`

**Cowork:** remove each `doi-*` skill from Skills → Manage.
