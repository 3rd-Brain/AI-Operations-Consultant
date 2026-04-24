# Installing DOI Method

DOI Method ships in three install surfaces, and the slash command depends on which one you choose:

- **Claude Code standalone skills** -> `/doi-run`
- **Claude Code or Cowork plugin installs** -> `/doi-method:doi-run`
- **Cowork direct `.skill` imports** -> `/doi-run`

If you saw `Unknown command: /doi-run` after uploading DOI as a plugin, that is expected behavior for a plugin install. Use the plugin namespace: `/doi-method:doi-run`.

## Claude Code: standalone skills

Use this if you want the command to be exactly `/doi-run`.

```bash
git clone https://github.com/3rd-Brain/AI-Operations-Consultant.git
cd AI-Operations-Consultant
./install-doi.sh
```

This is the default installer mode. It copies:
- `skills/` -> `~/.claude/skills/`
- `agents/` -> `~/.claude/agents/`
- `scripts/` -> `~/.claude/scripts/doi/`

Then run:

```
/doi-run
```

## Claude Code: plugin install

Use this if you want DOI installed as a Claude plugin with its bundled skills and reviewer agent.

```text
/plugin marketplace add 3rd-Brain/AI-Operations-Consultant
/plugin install doi-method@doi-method
```

Then run:

```
/doi-method:doi-run
```

If you are installing from a local clone instead of the marketplace:

```bash
./install-doi.sh --plugin
```

That installs the repo into `~/.claude/plugins/doi-method/` and uses the same namespaced command.

## Cowork: full plugin upload

This is the recommended Cowork path for the full DOI flow.

1. Download or zip the repo.
2. In Cowork, upload it as a custom plugin.
3. Invoke DOI with:

```
/doi-method:doi-run
```

Why this is the recommended Cowork install:
- It keeps the shared shell scripts bundled with the plugin
- It includes the `doi-review` agent used in the full pipeline
- It matches Claude's plugin command model instead of relying on bare skill imports

## Cowork: direct `.skill` imports

Use this if you want bare `/doi-run` inside Cowork's skill menu.

1. Download the `.skill` files from `dist/cowork/`
2. In Cowork, go to **Skills -> Create skill -> Import from `.skill` file**
3. Upload each DOI skill

Then run:

```
/doi-run
```

Notes:
- `doi-run.skill` is only the entry point. Install the downstream DOI skills too if you want the full engagement flow.
- The packaged Cowork `.skill` bundles are meant to be self-contained, including the shared DOI shell scripts they call.
- The direct `.skill` path does **not** include the bundled reviewer agent, so the full plugin upload remains the better Cowork install for the full end-to-end experience.

## Rebuild Cowork `.skill` packages

If you change any DOI skill and need fresh Cowork bundles:

```bash
python scripts/build-cowork-skills.py
```

Or package a single skill:

```bash
python scripts/build-cowork-skills.py --skill doi-run
```

The build script strips Claude Code-only frontmatter that Cowork rejects and bundles the shared DOI shell scripts into each `.skill` package.

## Verify

Expected commands by install type:
- Standalone Claude Code skills: `/doi-run`
- Claude Code plugin: `/doi-method:doi-run`
- Cowork plugin upload: `/doi-method:doi-run`
- Cowork direct `.skill` imports: `/doi-run`

## Uninstall

**Claude Code plugin:** `/plugin uninstall doi-method@doi-method`

**Claude Code standalone:** `rm -rf ~/.claude/skills/doi-* ~/.claude/agents/doi-review ~/.claude/scripts/doi/`

**Cowork plugin:** remove the DOI plugin from Customize -> Plugins

**Cowork skills:** remove each `doi-*` skill from Skills -> Manage
