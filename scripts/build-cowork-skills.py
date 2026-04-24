#!/usr/bin/env python3
"""
Build Cowork-compatible .skill packages from the DOI Method skills.

Cowork's skill validator (plugin:anthropic-skills:skill-creator) only allows
these SKILL.md frontmatter properties:
    name, description, license, allowed-tools, metadata, compatibility

Our skills have `user-invocable: true` (required by Claude Code CLI for slash
invocation) which Cowork rejects as an unexpected property. Cowork skill
imports also need the shared DOI shell scripts that the skills call at runtime.
This script copies each skill to a staging dir, strips the `user-invocable`
line, bundles `scripts/*.sh` under `scripts/doi/`, then zips the result as
`<skill>.skill` (Cowork's distributable format - it's just a zip).

Claude Code CLI users install via the marketplace or `./install-doi.sh` - this
script is only for Cowork distribution.

Usage:
    python scripts/build-cowork-skills.py
    python scripts/build-cowork-skills.py --output dist/cowork
    python scripts/build-cowork-skills.py --skill doi-run    # single skill

Output: dist/cowork/doi-*.skill (one per skill, each self-contained)
"""

import argparse
import re
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path

# Keep in sync with Cowork's quick_validate.py ALLOWED_PROPERTIES
COWORK_ALLOWED_FRONTMATTER = {
    'name', 'description', 'license', 'allowed-tools', 'metadata', 'compatibility'
}

# Files/dirs to exclude from the zip (matches skill-creator's package_skill.py)
EXCLUDE_DIRS = {'__pycache__', 'node_modules', '.git'}
EXCLUDE_GLOBS_SUFFIX = {'.pyc'}
EXCLUDE_FILES = {'.DS_Store'}


def should_exclude(rel_parts: tuple[str, ...], name: str) -> bool:
    if any(part in EXCLUDE_DIRS for part in rel_parts):
        return True
    if name in EXCLUDE_FILES:
        return True
    if any(name.endswith(suf) for suf in EXCLUDE_GLOBS_SUFFIX):
        return True
    return False


def strip_incompatible_frontmatter(skill_md_text: str) -> tuple[str, list[str]]:
    """
    Strip frontmatter keys not in COWORK_ALLOWED_FRONTMATTER. Returns (new_text, removed_keys).
    Only touches top-level keys (preserves nested structure under metadata/etc).
    """
    m = re.match(r'^(---\r?\n)(.*?)(\r?\n---\r?\n)(.*)$', skill_md_text, re.DOTALL)
    if not m:
        return skill_md_text, []

    opener, frontmatter, closer, body = m.groups()
    lines = frontmatter.split('\n')
    new_lines: list[str] = []
    removed: list[str] = []
    skip_nested = False

    for line in lines:
        # Top-level key match: no leading whitespace, `key:` or `key: value`
        top_level = re.match(r'^([a-zA-Z0-9_-]+):', line)
        if top_level:
            key = top_level.group(1)
            if key not in COWORK_ALLOWED_FRONTMATTER:
                removed.append(key)
                skip_nested = True
                continue
            skip_nested = False
            new_lines.append(line)
        else:
            # Indented / continuation line - keep only if we're not in a skipped block
            if not skip_nested:
                new_lines.append(line)

    new_frontmatter = '\n'.join(new_lines)
    return f"{opener}{new_frontmatter}{closer}{body}", removed


def bundle_shared_scripts(repo_root: Path, staging: Path) -> int:
    """Copy shared DOI shell scripts into the staged Cowork skill package."""
    scripts_root = repo_root / 'scripts'
    shared_scripts = sorted(scripts_root.glob('*.sh'))
    if not shared_scripts:
        return 0

    bundle_root = staging / 'scripts' / 'doi'
    bundle_root.mkdir(parents=True, exist_ok=True)

    for script_path in shared_scripts:
        shutil.copy2(script_path, bundle_root / script_path.name)

    return len(shared_scripts)


def build_skill_package(skill_dir: Path, output_dir: Path, repo_root: Path) -> Path | None:
    skill_name = skill_dir.name
    print(f"\n[{skill_name}]")

    if not (skill_dir / 'SKILL.md').exists():
        print(f"  ERROR: SKILL.md missing in {skill_dir}")
        return None

    with tempfile.TemporaryDirectory() as tmp:
        staging = Path(tmp) / skill_name
        shutil.copytree(skill_dir, staging)

        # Rewrite SKILL.md
        skill_md = staging / 'SKILL.md'
        original = skill_md.read_text(encoding='utf-8')
        patched, removed = strip_incompatible_frontmatter(original)
        if removed:
            print(f"  Stripped frontmatter keys: {', '.join(removed)}")
            skill_md.write_text(patched, encoding='utf-8')
        else:
            print('  No frontmatter changes needed')

        bundled_scripts = bundle_shared_scripts(repo_root, staging)
        if bundled_scripts:
            print(f"  Bundled {bundled_scripts} shared DOI script(s)")
        else:
            print('  WARNING: No shared DOI scripts found to bundle')

        # Zip it
        output_dir.mkdir(parents=True, exist_ok=True)
        out_path = output_dir / f"{skill_name}.skill"
        files_added = 0
        with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            for fp in staging.rglob('*'):
                if not fp.is_file():
                    continue
                rel = fp.relative_to(staging.parent)
                if should_exclude(rel.parts, fp.name):
                    continue
                zf.write(fp, rel)
                files_added += 1
        print(f"  Packaged {files_added} files -> {out_path}")
        return out_path


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--output', default='dist/cowork', help='Output directory (default: dist/cowork)')
    parser.add_argument('--skill', help='Only package this one skill (e.g. doi-run)')
    parser.add_argument('--skills-dir', default='skills', help='Source skills directory (default: skills)')
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    skills_root = repo_root / args.skills_dir
    output_dir = repo_root / args.output

    if not skills_root.exists():
        print(f"ERROR: skills dir not found: {skills_root}")
        sys.exit(1)

    if args.skill:
        targets = [skills_root / args.skill]
        if not targets[0].exists():
            print(f"ERROR: skill not found: {targets[0]}")
            sys.exit(1)
    else:
        targets = sorted(p for p in skills_root.iterdir() if p.is_dir() and p.name.startswith('doi-'))

    print(f"Building {len(targets)} Cowork skill package(s) to {output_dir}")
    results = [build_skill_package(t, output_dir, repo_root) for t in targets]
    failed = [t for t, r in zip(targets, results) if r is None]

    print("\n" + "=" * 60)
    if failed:
        print(f"FAILED: {len(failed)} skill(s): {', '.join(p.name for p in failed)}")
        sys.exit(1)
    print(f"SUCCESS: {len(results)} .skill file(s) in {output_dir}")


if __name__ == '__main__':
    main()
