# Installing the AI Operations Consultant

Two supported install paths: Claude Code (via marketplace) and Cowork (via direct `.skill` import or custom plugin upload).

## Claude Code — marketplace plugin

```text
/plugin marketplace add 3rd-Brain/AI-Operations-Consultant
/plugin install doi-method@doi-method
```

Then run:

```text
/doi-method:ai-ops
```

## Cowork — direct .skill import

1. Download `dist/cowork/ai-ops.skill` from this repo
2. In Cowork, go to **Skills → Create skill → Import from `.skill` file**
3. Upload `ai-ops.skill`
4. Run:

```text
/ai-ops
```

## Cowork — custom plugin upload

For teams that prefer the namespaced plugin model in Cowork:

1. Download or zip the repo
2. Upload it in Cowork as a custom plugin
3. Run:

```text
/doi-method:ai-ops
```

## Rebuild the Cowork bundle

If you edit the skill and want a fresh `.skill` package:

```bash
python scripts/build-cowork-skills.py
```

Output: `dist/cowork/ai-ops.skill`

## Uninstall

**Claude Code plugin:** `/plugin uninstall doi-method@doi-method`

**Cowork plugin:** remove from Customize → Plugins

**Cowork skill:** remove `ai-ops` from Skills → Manage
