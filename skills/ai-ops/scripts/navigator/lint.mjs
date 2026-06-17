#!/usr/bin/env node
// AI-Ops template-completeness lint — zero-dependency, Node built-ins only.
//
//   node lint.mjs <library-root>            # human report, exit 0 clean / 1 gaps
//   node lint.mjs <library-root> --json     # machine-readable report (always exit 0/1)
//   node lint.mjs <library-root> --files a.md,roles/b.md   # only lint these staged paths
//
// What it checks: STRUCTURE, not substance. For every library document that has a
// canonical template (profile / glossary / open-questions / roles / tools / workflows),
// it confirms the file carries every required SECTION HEADING and header FIELD the
// template declares. It does NOT judge whether a section is well-written or filled in —
// that is the library-assembly specialist's job. A deferred doc with all sections present
// and one-line bodies PASSES; a doc missing the "## Automation / Agent Potential" section
// FAILS.
//
// The required structure is DERIVED by parsing skills/ai-ops/templates/*.md at runtime.
// The templates are the single source of truth — there is no second hardcoded manifest
// to drift out of sync. Recomputed every call; nothing is cached.
//
// Why this exists: on 2026-06-10 a library shipped with workflows missing both flowchart
// sections and the whole Automation section, roles missing "Infinite Tasks", and a profile
// with 6 of 10 sections — and nothing flagged it because everything still rendered. Render
// is the wrong oracle for structure. This script is the right one.

import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Templates live two levels up from scripts/navigator/ (and ship in the same relative
// spot inside the packaged .skill), so this resolves in repo and install alike.
const TEMPLATES_DIR = path.resolve(__dirname, '..', '..', 'templates');

// --- document types -> their canonical template --------------------------------
// File-to-type mapping mirrors the navigator's categoryOf(): root files by filename,
// roles/ tools/ workflows/ by folder. Only types with a canonical template appear here.
// data-architecture.md has no standalone template (its structure lives in
// prompts/company-data-architecture.md), so it — and every other folder (research/,
// decisions/, scopes/, roadmaps/, .ai-ops/, context files) — is not linted.
const ROOT_FILE_TYPES = {
  'profile.md': { type: 'profile', template: 'profile.md' },
  'glossary.md': { type: 'glossary', template: 'glossary.md' },
  'open-questions.md': { type: 'open-questions', template: 'open-questions.md' },
};
const FOLDER_TYPES = {
  roles: { type: 'role', template: 'role.md' },
  tools: { type: 'tool', template: 'tool.md' },
  workflows: { type: 'workflow', template: 'workflow.md' },
};

// Map a workspace-relative path to its document type (or null if not linted).
function typeOf(rel) {
  const norm = rel.split(path.sep).join('/');
  const dir = path.posix.dirname(norm);
  if (dir === '.') return ROOT_FILE_TYPES[path.posix.basename(norm).toLowerCase()] || null;
  return FOLDER_TYPES[dir.split('/')[0]] || null;
}

// --- markdown structure parsing -------------------------------------------------

// Normalize a heading/field label for tolerant comparison: drop markdown comments,
// lowercase, fold every dash variant (— – ‒ ― −) to "-", collapse whitespace.
function normalize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[‒–—―−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, '');

// Walk markdown lines, skipping fenced code blocks (``` or ~~~), yielding [lineText].
function* contentLines(md) {
  let fence = null; // current fence marker char, or null
  for (const line of stripComments(md).split('\n')) {
    const f = line.match(/^\s*(```+|~~~+)/);
    if (f) {
      const marker = f[1][0];
      if (!fence) fence = marker;
      else if (marker === fence) fence = null;
      continue; // the fence line itself is never content
    }
    if (fence) continue; // inside a code block — ignore (mermaid/ASCII can contain '#')
    yield line;
  }
}

// Extract H2/H3 headings and the bold header fields (the **Label:** lines that sit
// before the first H2). H1 is the title; H4+ are optional sub-structure — neither is
// required. Placeholder-only headings like "## <Term>" are template example slots,
// not required sections, so they're dropped.
function parseStructure(md) {
  const headings = [];
  const fields = [];
  let seenH2 = false;
  const seenHeads = new Set();
  const seenFields = new Set();
  for (const line of contentLines(md)) {
    const h = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (h) {
      const level = h[1].length;
      const text = h[2].trim();
      if (level >= 2) seenH2 = true;
      if (/^<[^<>]*>$/.test(text)) continue; // placeholder slot, e.g. "## <Term>"
      const key = `${level}|${normalize(text)}`;
      if (!seenHeads.has(key)) { seenHeads.add(key); headings.push({ level, text }); }
      continue;
    }
    // Header fields only count before the first H2 (the metadata block under the H1).
    if (seenH2) continue;
    for (const m of line.matchAll(/\*\*([^*]+?):\*\*/g)) {
      const label = m[1].trim();
      const nk = normalize(label);
      if (!seenFields.has(nk)) { seenFields.add(nk); fields.push(label); }
    }
  }
  return { headings, fields };
}

// --- requirement derivation -----------------------------------------------------
// Read a template and turn its structure into the required set for that type.
async function requiredFor(template) {
  const md = await readFile(path.join(TEMPLATES_DIR, template), 'utf8');
  return parseStructure(md);
}

// A required heading is present if SOME produced heading's text starts with the
// required text (after normalization), regardless of H2-vs-H3 level — produced
// headings may carry suffixes (e.g. "Flowchart — ASCII (for humans)") and a section
// may be nested a level deeper than the template puts it.
function headingPresent(req, producedHeads) {
  const want = normalize(req.text);
  return producedHeads.some((p) => normalize(p.text).startsWith(want));
}
function fieldPresent(label, producedFields) {
  const want = normalize(label);
  return producedFields.some((p) => normalize(p) === want);
}

// --- per-file + whole-library lint ----------------------------------------------

// Lint one already-read file against its template's required structure.
function lintContent(rel, content, type, required) {
  const got = parseStructure(content);
  const missingSections = required.headings
    .filter((h) => !headingPresent(h, got.headings))
    .map((h) => ({ level: h.level, text: h.text, label: '#'.repeat(h.level) + ' ' + h.text }));
  const missingFields = required.fields.filter((f) => !fieldPresent(f, got.fields));
  return {
    path: rel,
    type,
    ok: missingSections.length === 0 && missingFields.length === 0,
    missingSections,
    missingFields,
  };
}

async function walk(dir, base = '') {
  const out = [];
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.git') || e.name === 'node_modules') continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await walk(path.join(dir, e.name), rel)));
    else if (e.name.endsWith('.md')) out.push(rel);
  }
  return out;
}

// Lint a whole library (or, with `only`, just the given workspace-relative paths).
// Returns a plain report object — no I/O beyond reading the files and templates.
export async function lintLibrary(root, only = null) {
  const abs = path.resolve(root);
  let rels;
  if (only) {
    rels = only.map((p) => p.split(path.sep).join('/'));
  } else {
    rels = (await walk(abs)).map((p) => p.split(path.sep).join('/'));
  }
  // Resolve each path to a type, skip the untyped ones, and cache template parsing.
  const reqCache = new Map();
  const files = [];
  const skipped = [];
  for (const rel of rels) {
    const t = typeOf(rel);
    if (!t) { skipped.push(rel); continue; }
    if (!reqCache.has(t.template)) reqCache.set(t.template, await requiredFor(t.template));
    const content = await readFile(path.join(abs, rel), 'utf8').catch(() => null);
    if (content === null) {
      // A staged path that no longer exists on disk — report as a gap, not a crash.
      files.push({ path: rel, type: t.type, ok: false, missingSections: [], missingFields: [], missing: 'file not found' });
      continue;
    }
    files.push(lintContent(rel, content, t.type, reqCache.get(t.template)));
  }
  files.sort((a, b) => a.path.localeCompare(b.path));
  const complete = files.filter((f) => f.ok).length;
  return {
    root: path.basename(abs),
    files,
    skipped,
    summary: { linted: files.length, complete, incomplete: files.length - complete },
    ok: files.every((f) => f.ok),
  };
}

// --- plain-language report (read by non-developers) -----------------------------
export function formatReport(report) {
  const { files, summary } = report;
  const lines = [];
  lines.push(`AI-Ops template completeness — ${report.root}`);
  lines.push('');
  if (files.length === 0) {
    lines.push('No library documents to check (nothing with a canonical template).');
    return lines.join('\n');
  }
  for (const f of files) {
    if (f.ok) { lines.push(`  ✓ ${f.path}`); continue; }
    lines.push(`  ✗ ${f.path}  (${f.type})`);
    if (f.missing === 'file not found') { lines.push(`      file not found`); continue; }
    if (f.missingSections.length) {
      lines.push(`      Missing sections: ${f.missingSections.map((s) => s.label).join('  ·  ')}`);
    }
    if (f.missingFields.length) {
      lines.push(`      Missing header fields: ${f.missingFields.join(', ')}`);
    }
  }
  lines.push('');
  if (summary.incomplete === 0) {
    lines.push(`${summary.complete} of ${summary.linted} documents match their template. All good.`);
  } else {
    const noun = summary.incomplete === 1 ? 'document needs' : 'documents need';
    lines.push(`${summary.complete} of ${summary.linted} documents match their template. ${summary.incomplete} ${noun} sections added.`);
  }
  return lines.join('\n');
}

// --- CLI ------------------------------------------------------------------------
function parseArgs(argv) {
  const opts = { root: null, json: false, only: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') opts.json = true;
    else if (a === '--files') opts.only = splitList(argv[++i]);
    else if (a.startsWith('--files=')) opts.only = splitList(a.slice('--files='.length));
    else if (a.startsWith('--')) { /* ignore unknown flags */ }
    else if (opts.root === null) opts.root = a;
  }
  return opts;
}
const splitList = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean);

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const root = opts.root || process.cwd();
  let report;
  try {
    report = await lintLibrary(root, opts.only);
  } catch (err) {
    console.error(`lint: ${err && err.message || err}`);
    process.exit(2); // operational error (bad root, missing templates) — distinct from gaps
  }
  if (opts.json) console.log(JSON.stringify(report, null, 2));
  else console.log(formatReport(report));
  process.exit(report.ok ? 0 : 1);
}

// Run as CLI only when invoked directly (not when imported by server.mjs).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
