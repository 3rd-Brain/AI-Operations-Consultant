// Tests for the template-completeness lint. Zero dependencies — built-in node:test.
//   node --test skills/ai-ops/scripts/navigator/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintLibrary, formatReport } from '../lint.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => path.join(__dirname, 'fixtures', name);
const sectionsOf = (f) => f.missingSections.map((s) => s.label);
const byPath = (report, p) => report.files.find((f) => f.path === p);

test('complete fixture passes — all six typed documents match their template', async () => {
  const r = await lintLibrary(fixture('complete'));
  assert.equal(r.ok, true);
  assert.deepEqual(r.summary, { linted: 6, complete: 6, incomplete: 0 });
  for (const f of r.files) assert.equal(f.ok, true, `${f.path} should be complete`);
});

test('untyped files (data-architecture.md, no template) are skipped, not linted', async () => {
  const r = await lintLibrary(fixture('complete'));
  assert.ok(!r.files.some((f) => f.path === 'data-architecture.md'), 'data-architecture.md must not be linted');
  assert.ok(r.skipped.includes('data-architecture.md'), 'data-architecture.md must appear in skipped');
});

test('gappy fixture fails with exactly the expected missing sections/fields', async () => {
  const r = await lintLibrary(fixture('gappy'));
  assert.equal(r.ok, false);
  assert.deepEqual(r.summary, { linted: 6, complete: 2, incomplete: 4 });

  // Passing docs.
  assert.equal(byPath(r, 'glossary.md').ok, true);
  assert.equal(byPath(r, 'open-questions.md').ok, true);

  // profile: 6 of 10 sections present -> 4 missing (reproduces the 2026-06-10 incident).
  assert.deepEqual(sectionsOf(byPath(r, 'profile.md')), [
    '## Top pains', '## Recent timeline', '## Maturity signal', '## Pointer',
  ]);

  // role: missing Infinite Tasks (the incident's role gap).
  assert.deepEqual(sectionsOf(byPath(r, 'roles/buyer.md')), ['### Infinite Tasks']);

  // tool: a missing header field, no missing sections.
  assert.deepEqual(byPath(r, 'tools/shopify.md').missingSections, []);
  assert.deepEqual(byPath(r, 'tools/shopify.md').missingFields, ['Plan / tier']);

  // workflow: both flowcharts + the whole Automation section (the incident's workflow gap).
  assert.deepEqual(sectionsOf(byPath(r, 'workflows/order-intake.md')), [
    '### Flowchart — ASCII (for humans)',
    '### Flowchart — Mermaid (for machines)',
    '## Automation / Agent Potential',
  ]);
});

test('--files restricts the lint to the given staged paths', async () => {
  const r = await lintLibrary(fixture('gappy'), ['workflows/order-intake.md']);
  assert.equal(r.summary.linted, 1);
  assert.equal(r.ok, false);
});

test('--files with only untyped staged paths lints nothing and passes', async () => {
  const r = await lintLibrary(fixture('gappy'), ['data-architecture.md']);
  assert.equal(r.summary.linted, 0);
  assert.equal(r.ok, true);
});

test('formatReport is plain text with checks, gaps, and a summary line', async () => {
  const r = await lintLibrary(fixture('gappy'));
  const out = formatReport(r);
  assert.match(out, /✓ glossary\.md/);
  assert.match(out, /✗ workflows\/order-intake\.md/);
  assert.match(out, /Automation \/ Agent Potential/);
  assert.match(out, /2 of 6 documents match their template/);
});
