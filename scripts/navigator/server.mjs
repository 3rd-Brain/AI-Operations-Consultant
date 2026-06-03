#!/usr/bin/env node
// AI-Ops Navigator — zero-dependency local server for browsing, editing, mapping,
// and grading an AI-Ops engagement workspace. Localhost only, single user, no auth.
//
//   node server.mjs                      # serves the current working directory
//   ROOT=/path/to/engagement node server.mjs --port 4173
//
// Point ROOT at the folder the AI-Ops Consultant writes into (the engagement
// workspace: profile/roles/tools/workflows + an .ai-ops/ state folder).
import { createServer } from 'node:http';
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- config ----------------------------------------------------------------
const argPort = (() => { const i = process.argv.indexOf('--port'); return i > -1 ? Number(process.argv[i + 1]) : null; })();
const PORT = argPort || Number(process.env.PORT) || 4173;
// Workspace root = the engagement folder this navigator documents.
// Defaults to the current working directory; override with ROOT=...
const ROOT = path.resolve(process.env.ROOT || process.cwd());
const PUBLIC = path.join(__dirname, 'public');
const GRADES_PATH = path.join(ROOT, '.ai-ops', 'navigator-grades.json');

// Folder -> graph node-group label.
const CATEGORIES = {
  '.': 'profile', roles: 'roles', tools: 'tools', workflows: 'workflows',
  scopes: 'scopes', roadmaps: 'roadmaps', decisions: 'decisions', meetings: 'meetings', '.ai-ops': 'ops',
};

// --- helpers ---------------------------------------------------------------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };
function send(res, code, body, type = 'application/json; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}
function safeResolve(rel) {
  const abs = path.resolve(ROOT, rel || '.');
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) return null;
  return abs;
}
async function walk(dir, base = '') {
  const out = []; let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.git') || e.name === 'node_modules') continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await walk(path.join(dir, e.name), rel)));
    else if (e.name.endsWith('.md')) out.push(rel);
  }
  return out;
}
function categoryOf(rel) {
  const dir = path.posix.dirname(rel.split(path.sep).join('/'));
  const top = dir === '.' ? '.' : dir.split('/')[0];
  return CATEGORIES[top] || top || 'other';
}
function titleFromContent(content, rel) { const m = content.match(/^#\s+(.+)$/m); return m ? m[1].trim() : path.basename(rel, '.md'); }

function extractLinks(content, fromRel) {
  const fromDir = path.posix.dirname(fromRel.split(path.sep).join('/'));
  const edges = new Set(); const re = /\]\(([^)]+\.md)(?:#[^)]*)?\)/g; let m;
  while ((m = re.exec(content))) {
    let t = m[1].trim(); if (/^https?:/i.test(t)) continue;
    t = decodeURIComponent(t);
    edges.add(path.posix.normalize(path.posix.join(fromDir, t)).replace(/^\.\//, ''));
  }
  return [...edges];
}
function resolveLink(content, fromRel, regex) {
  const fromDir = path.posix.dirname(fromRel.split(path.sep).join('/'));
  const m = content.match(regex); if (!m) return null;
  return path.posix.normalize(path.posix.join(fromDir, decodeURIComponent(m[1]))).replace(/^\.\//, '');
}
// Parse the SOP section into a tree of role/tool-tagged steps.
// Convention: - [ ] **Action** — `Role` uses `Tool` — note
//   (indent 2 spaces + a leading (condition) to branch; ⚠ / [exception] = exception path)
function parseSteps(content) {
  const sec = content.match(/##\s*SOP\s*\n([\s\S]*?)(\n##\s|$)/); if (!sec) return [];
  const roots = []; const stack = [{ level: -1, children: roots }];
  for (const raw of sec[1].split('\n')) {
    const m = raw.match(/^(\s*)[-*]\s+(.*)$/); if (!m) continue;
    const indent = m[1].replace(/\t/g, '  ').length;
    let text = m[2].replace(/^\[[ xX]\]\s*/, '').trim();
    const codes = [...text.matchAll(/`([^`]+)`/g)].map((c) => c[1].trim());
    if (codes.length === 0) continue;
    const exception = /⚠|\(exception\)|\[exception\]/i.test(text);
    text = text.replace(/⚠|\(exception\)|\[exception\]/gi, '').trim();
    const bolds = [...text.matchAll(/\*\*(.+?)\*\*/g)].map((b) => b[1].trim());
    let branch = null, action;
    if (bolds[0] && /^[([].*[)\]]$/.test(bolds[0])) { branch = bolds[0].replace(/^[([]|[)\]]$/g, '').trim(); action = bolds[1] || ''; }
    else { action = bolds[0] || text.replace(/`[^`]*`/g, '').replace(/[—–-].*$/, '').trim(); }
    if (!branch) { const pm = text.match(/^\(([^)]+)\)/); if (pm) branch = pm[1].trim(); }
    const lastTick = text.lastIndexOf('`');
    const note = text.slice(lastTick + 1).replace(/^[\s—–-]*(uses|on)?\s*/i, '').replace(/^[\s—–-]+/, '').trim();
    const step = { action, role: codes[0] || null, tool: codes[1] || null, note, branch, exception, children: [] };
    while (stack.length > 1 && indent <= stack[stack.length - 1].level) stack.pop();
    stack[stack.length - 1].children.push(step);
    stack.push({ level: indent, children: step.children });
  }
  return roots;
}
function parseField(content, label) {
  const m = content.match(new RegExp('\\*\\*' + label + ':\\*\\*\\s*(.+)'));
  return m ? m[1].replace(/[→\[\]]/g, '').trim().split('(')[0].trim() : null;
}
async function loadGrades() { try { return JSON.parse(await readFile(GRADES_PATH, 'utf8')); } catch { return {}; } }
async function saveGrades(o) { await mkdir(path.dirname(GRADES_PATH), { recursive: true }); await writeFile(GRADES_PATH, JSON.stringify(o, null, 2) + '\n', 'utf8'); }
function readBody(req) { return new Promise((res, rej) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => res(d)); req.on('error', rej); }); }

async function buildGraph() {
  const files = await walk(ROOT); const grades = await loadGrades();
  const nodes = [], edges = []; const known = new Set(files.map((f) => f.split(path.sep).join('/')));
  for (const relRaw of files) {
    const rel = relRaw.split(path.sep).join('/');
    const content = await readFile(path.join(ROOT, relRaw), 'utf8').catch(() => '');
    const isStub = /Stub generated by library assembly/i.test(content) || content.trim().length < 200;
    const cat = categoryOf(relRaw);
    const node = { id: rel, label: titleFromContent(content, rel), category: cat, stub: isStub, grade: grades[rel] || null };
    if (cat === 'roles') { node.department = parseField(content, 'Department'); node.reportsToName = parseField(content, 'Reports to'); }
    if (cat === 'workflows') { node.ownerRole = resolveLink(content, rel, /Owner role:\*\*\s*(?:→\s*)?\[[^\]]*\]\(([^)]+\.md)\)/); node.steps = parseSteps(content); }
    nodes.push(node);
    for (const t of extractLinks(content, rel)) if (known.has(t) && t !== rel) edges.push({ from: rel, to: t });
  }
  const roleByLabel = {}; nodes.filter((n) => n.category === 'roles').forEach((n) => (roleByLabel[n.label.toLowerCase()] = n.id));
  for (const n of nodes) { if (n.category === 'roles' && n.reportsToName) n.reportsToId = roleByLabel[n.reportsToName.toLowerCase()] || null; }
  let systemMermaid = null;
  const da = files.find((f) => /data-architecture\.md$/.test(f));
  if (da) { const c = await readFile(path.join(ROOT, da), 'utf8').catch(() => ''); const m = c.match(/```mermaid\s*([\s\S]*?)```/); if (m) systemMermaid = m[1].trim(); }
  return { root: path.basename(ROOT), nodes, edges, systemMermaid };
}

// --- routes -----------------------------------------------------------------
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`); const p = url.pathname;
  try {
    if (p === '/api/graph') return send(res, 200, await buildGraph());
    if (p === '/api/file' && req.method === 'GET') {
      const abs = safeResolve(url.searchParams.get('path') || '');
      if (!abs || !existsSync(abs)) return send(res, 404, { error: 'not found' });
      return send(res, 200, { path: url.searchParams.get('path'), content: await readFile(abs, 'utf8') });
    }
    if (p === '/api/file' && req.method === 'POST') {
      const { path: rel, content } = JSON.parse(await readBody(req));
      const abs = safeResolve(rel);
      if (!abs || !abs.endsWith('.md')) return send(res, 400, { error: 'only .md writes allowed' });
      await mkdir(path.dirname(abs), { recursive: true }); await writeFile(abs, content, 'utf8');
      return send(res, 200, { ok: true, path: rel });
    }
    if (p === '/api/grades' && req.method === 'GET') return send(res, 200, await loadGrades());
    if (p === '/api/grades' && req.method === 'POST') {
      const { path: rel, grade } = JSON.parse(await readBody(req)); const grades = await loadGrades();
      if (grade === null) delete grades[rel]; else grades[rel] = { ...grade, updated: new Date().toISOString().slice(0, 10) };
      await saveGrades(grades); return send(res, 200, { ok: true });
    }
    let file = p === '/' ? '/index.html' : p; const abs = path.join(PUBLIC, file);
    if (!abs.startsWith(PUBLIC) || !existsSync(abs)) return send(res, 404, 'Not found', 'text/plain');
    return send(res, 200, await readFile(abs), MIME[path.extname(abs)] || 'application/octet-stream');
  } catch (err) { return send(res, 500, { error: String((err && err.message) || err) }); }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  AI-Ops Navigator`);
  console.log(`  workspace : ${ROOT}`);
  console.log(`  open      : http://localhost:${PORT}\n`);
});
