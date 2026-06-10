# Installing the AI Operations Consultant

The skill ships as plain markdown. Three supported install paths: Claude Code (skill copy), Cowork (`.skill` import), and other coding agents (folder copy).

## Claude Code

```bash
git clone https://github.com/3rd-Brain/AI-Operations-Consultant.git
mkdir -p ~/.claude/skills
cp -r AI-Operations-Consultant/skills/ai-ops ~/.claude/skills/
```

Then invoke `/ai-ops` in any Claude Code session.

To update: `cd AI-Operations-Consultant && git pull && cp -r skills/ai-ops ~/.claude/skills/`.

## Cowork

1. Download `dist/cowork/ai-ops.skill` from this repo
2. In Cowork: **Skills → Create skill → Import from `.skill` file**
3. Upload `ai-ops.skill`
4. Invoke `/ai-ops`

## Other coding agents (OpenClaw, Codex, Hermes)

The skill is markdown. Copy `skills/ai-ops/` into the agent's skills directory, or point the agent at `skills/ai-ops/SKILL.md` as its system prompt.

## Rebuild the Cowork bundle

If you edit the skill and want a fresh `.skill` package:

```bash
python scripts/build-cowork-skills.py
```

Output: `dist/cowork/ai-ops.skill`

## Uninstall

**Claude Code:** `rm -rf ~/.claude/skills/ai-ops`

**Cowork:** remove `ai-ops` from Skills → Manage
