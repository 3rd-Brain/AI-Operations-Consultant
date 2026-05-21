# Installing DOI Method

DOI is now **plugin-first**.

The official install and usage story is:
- Install DOI as a plugin
- Run `/doi-method:ai-ops`

If you uploaded DOI as a plugin and saw `Unknown command: /ai-ops`, that is expected for a plugin install. Plugin commands are namespaced, so the correct command is:

```text
/doi-method:ai-ops
```

## Official Install Paths

### Claude Code: marketplace plugin

```text
/plugin marketplace add 3rd-Brain/AI-Operations-Consultant
/plugin install doi-method@doi-method
```

Then run:

```text
/doi-method:ai-ops
```

### Claude Code: local clone plugin install

```bash
git clone https://github.com/3rd-Brain/AI-Operations-Consultant.git
cd AI-Operations-Consultant
./install-doi.sh
```

`./install-doi.sh` defaults to plugin mode.

Then run:

```text
/doi-method:ai-ops
```

### Cowork: custom plugin upload

1. Download or zip the repo
2. Upload it in Cowork as a custom plugin
3. Run:

```text
/doi-method:ai-ops
```

This is the recommended Cowork install because it includes:
- the shared DOI shell scripts
- the bundled `doi-review` agent
- the same namespaced command model as Claude Code plugin installs

## Verify

For the official install paths above, the command should always be:

```text
/doi-method:ai-ops
```

## Advanced And Legacy Paths

These still work, but they are not the primary install story.

### Standalone Claude Code skills

Use this only if you explicitly want bare `/ai-ops` instead of the plugin namespace.

```bash
./install-doi.sh --standalone
```

Then run:

```text
/ai-ops
```

This copies:
- `skills/` -> `~/.claude/skills/`
- `agents/` -> `~/.claude/agents/`
- `scripts/` -> `~/.claude/scripts/doi/`

### Cowork direct `.skill` imports

Use this only if you explicitly want direct skill imports instead of a plugin upload.

1. Download the `.skill` files from `dist/cowork/`
2. In Cowork, go to **Skills -> Create skill -> Import from `.skill` file**
3. Upload each DOI skill
4. Run:

```text
/ai-ops
```

Notes:
- `doi-run.skill` is only the entry point. Install the downstream DOI skills too for the full flow.
- The `.skill` bundles now include the shared DOI shell scripts they call.
- This path does **not** include the bundled reviewer agent, so the plugin install remains the better Cowork experience.

## Rebuild Cowork `.skill` packages

If you edit a DOI skill and want fresh Cowork bundles:

```bash
python scripts/build-cowork-skills.py
```

Or package a single skill:

```bash
python scripts/build-cowork-skills.py --skill doi-run
```

## Uninstall

**Claude Code plugin:** `/plugin uninstall doi-method@doi-method`

**Claude Code standalone:** `rm -rf ~/.claude/skills/doi-* ~/.claude/agents/doi-review ~/.claude/scripts/doi/`

**Cowork plugin:** remove DOI from Customize -> Plugins

**Cowork skills:** remove each `doi-*` skill from Skills -> Manage
