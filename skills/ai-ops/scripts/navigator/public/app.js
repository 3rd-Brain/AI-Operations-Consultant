/* AI-Ops Navigator — wiki / dashboard / org / workflow-maps. Vanilla JS, no build. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---- colors ----------------------------------------------------------------
const CAT_COLOR = {
  profile: '#d4a23a', roles: '#5a9bd4', tools: '#9b7fd4', workflows: '#3fb950',
  scopes: '#e08c4a', roadmaps: '#4ac9c9', decisions: '#c96a8c', ops: '#6b7785', meetings: '#7d8a4a', other: '#6b7785',
};
const CAT_ORDER = ['profile', 'context', 'glossary', 'data architecture', 'open questions', 'workflows', 'roles', 'tools', 'scopes', 'roadmaps', 'decisions', 'ops', 'meetings', 'other'];
const _cc = {};
function colorFor(name, light = 60) {
  if (!name) return '#6b7785';
  const key = name + light; if (_cc[key]) return _cc[key];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return (_cc[key] = `hsl(${h % 360} 60% ${light}%)`);
}

function nodeColor(n) {
  return CAT_COLOR[n.category] || CAT_COLOR.other;
}

// ---- state -----------------------------------------------------------------
const S = { graph: null, byId: {}, current: null, dirty: false, route: 'dashboard', flow: null };
async function api(path, opts) {
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText);
  return r.json();
}
const posixNorm = (p) => { const o = []; for (const s of p.split('/')) { if (s === '..') o.pop(); else if (s !== '.' && s !== '') o.push(s); } return o.join('/'); };
function resolveEntity(name) {
  if (!name) return null; const low = name.toLowerCase();
  for (const n of S.graph.nodes) if (n.label.toLowerCase() === low) return n.id;
  const slug = low.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  for (const n of S.graph.nodes) if (n.id.split('/').pop().replace(/\.md$/, '') === slug) return n.id;
  return null;
}

// ---- boot ------------------------------------------------------------------
init();
async function init() {
  S.graph = await api('/api/graph');
  S.graph.nodes.forEach((n) => (S.byId[n.id] = n));
  $('#rootName').textContent = S.graph.root;
  renderTree(); wireUI(); go('dashboard');
}
async function refreshGraph() {
  S.graph = await api('/api/graph'); S.byId = {}; S.graph.nodes.forEach((n) => (S.byId[n.id] = n)); renderTree();
}

// ---- routing ---------------------------------------------------------------
function go(route) {
  if (S.dirty && S.route === 'page' && route !== 'page') { if (!confirm('Discard unsaved changes?')) return; S.dirty = false; }
  S.route = route;
  $$('.route').forEach((r) => (r.hidden = r.id !== 'view-' + route));
  $$('.nav-link').forEach((l) => l.classList.toggle('active', l.dataset.route === route));
  if (route !== 'page') $$('.tree-item').forEach((t) => t.classList.remove('active'));
  if (route === 'dashboard') renderDashboard();
  if (route === 'org') renderOrg();
  if (route === 'flows') renderFlows();
}

// ---- sidebar tree ----------------------------------------------------------
const CREATABLE = ['roles', 'tools', 'workflows', 'decisions', 'scopes', 'roadmaps'];
function renderTree() {
  const tree = $('#tree'); tree.innerHTML = '';
  const groups = {}; S.graph.nodes.forEach((n) => (groups[n.category] ||= []).push(n));
  const extra = Object.keys(groups).filter((c) => !CAT_ORDER.includes(c)).sort();
  const cats = [...CAT_ORDER.filter((c) => groups[c] || CREATABLE.includes(c)), ...extra]; // known order first, then any other library folders — nothing invisible
  for (const cat of cats) {
    const g = document.createElement('div'); g.className = 'tree-group'; g.dataset.cat = cat;
    const label = document.createElement('div'); label.className = 'grp-label';
    label.innerHTML = `<span>${cat}</span>`;
    if (CREATABLE.includes(cat)) {
      const add = document.createElement('button');
      add.className = 'grp-add'; add.type = 'button'; add.textContent = '+';
      add.title = `New ${cat.replace(/s$/, '')}`;
      add.addEventListener('click', (e) => { e.stopPropagation(); startInlineCreate(cat, g); });
      label.append(add);
    }
    g.append(label);
    (groups[cat] || []).sort((a, b) => a.label.localeCompare(b.label)).forEach((n) => {
      const item = document.createElement('div');
      item.className = 'tree-item' + (n.stub ? ' stub' : ''); item.dataset.id = n.id;
      item.innerHTML = `<span class="dot" style="background:${nodeColor(n)}"></span><span class="nm">${esc(n.label)}</span>`;
      item.addEventListener('click', () => openPage(n.id));
      g.append(item);
    });
    tree.append(g);
  }
}
// inline "new page" row under a section heading (no modal)
function startInlineCreate(cat, groupEl) {
  const existing = groupEl.querySelector('.tree-create-row input');
  if (existing) { existing.focus(); return; }
  const row = document.createElement('div'); row.className = 'tree-create-row';
  const inp = document.createElement('input');
  inp.type = 'text'; inp.autocomplete = 'off'; inp.placeholder = `New ${cat.replace(/s$/, '')} title…`;
  row.append(inp);
  groupEl.insertBefore(row, groupEl.children[1] || null);
  inp.focus();
  let done = false;
  const cancel = () => { if (done) return; done = true; row.remove(); };
  inp.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const title = inp.value.trim(); if (!title) { cancel(); return; }
      done = true; inp.disabled = true;
      try {
        const r = await api('/api/new', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category: cat, title }) });
        await refreshGraph(); toast(`Created ${r.path}`); openPage(r.path);
      } catch (err) { toast(err.message || 'Create failed'); renderTree(); }
    } else if (e.key === 'Escape') { cancel(); }
  });
  inp.addEventListener('blur', () => setTimeout(cancel, 120));
}

// ---- dashboard -------------------------------------------------------------
// Everything here is DERIVED from the library files — counts, stub detection,
// the profile's own Maturity signal prose, and the consultant's pains file.
// The navigator carries no assessment state of its own.
async function renderDashboard() {
  const root = $('#view-dashboard');
  const profile = S.graph.nodes.find((n) => /(^|\/)profile\.md$/.test(n.id));
  const counts = {}; S.graph.nodes.forEach((n) => { counts[n.category] ||= { t: 0, d: 0 }; counts[n.category].t++; if (!n.stub) counts[n.category].d++; });
  const libT = S.graph.nodes.length, libD = S.graph.nodes.filter((n) => !n.stub).length;
  const cnt = (c) => counts[c] || { t: 0, d: 0 };
  root.innerHTML = `
    <div class="dash-hero">
      <h1>${esc(S.graph.root)} <span style="color:var(--muted);font-weight:400;font-size:18px">· AI-Ops workspace</span></h1>
      <div class="sub">Read and edit the company library. Everything below is derived live from the files.</div>
      <p class="dash-lead" id="dashLead"></p>
    </div>
    <div class="cards">
      <div class="card"><h3>Library</h3>
        <div class="kv"><span class="k">Roles</span><b>${cnt('roles').t}</b></div>
        <div class="kv"><span class="k">Workflows</span><b>${cnt('workflows').t}</b></div>
        <div class="kv"><span class="k">Tools</span><b>${cnt('tools').t}</b></div></div>
      <div class="card"><h3>Library Completeness</h3><div class="metric">${libD}<small> / ${libT} pages enriched</small></div>
        <div class="bar"><span style="width:${libT ? Math.round((libD / libT) * 100) : 0}%"></span></div>
        <div style="margin-top:10px">${CAT_ORDER.filter((c) => counts[c]).map((c) => `<div class="kv"><span class="k">${c}</span><span>${counts[c].d}/${counts[c].t}</span></div>`).join('')}</div></div>
      <div class="card"><h3>Maturity Signal</h3><div class="card-prose" id="dashMaturity"><span style="color:var(--muted)">No Maturity signal section in profile.md yet.</span></div></div>
      <div class="card card-wide" id="cardLint"><h3>Template completeness</h3>
        <div id="lintBody"><span style="color:var(--muted)">Checking documents against their templates…</span></div></div>
    </div>
    <div class="section-title">Top pains</div>
    <div class="dash-pains markdown" id="dashPains"><span style="color:var(--muted)">No .ai-ops/pains-and-bottlenecks.md yet.</span></div>`;
  const prof = await api('/api/file?path=' + encodeURIComponent(profile?.id || 'profile.md')).catch(() => null);
  if (prof) {
    const m = prof.content.match(/##\s*What we do\s*\n+([\s\S]*?)(\n##\s|\n$)/);
    $('#dashLead').textContent = m ? m[1].trim().replace(/\s+/g, ' ').slice(0, 360) + (m[1].length > 360 ? '…' : '') : '';
    // Maturity signal = the section's first paragraph, rendered as plain prose.
    const ms = prof.content.match(/##\s*Maturity signal\s*\n+([\s\S]*?)(\n##\s|$)/);
    if (ms) {
      const para = ms[1].split(/\n\s*\n/).map((s) => s.trim()).find((s) => s && !/^[-*]\s/.test(s));
      if (para) $('#dashMaturity').textContent = para.replace(/\s+/g, ' ');
    }
  }
  // Top pains = the first bullet lines of the consultant's pains file, verbatim.
  const pains = S.graph.nodes.find((n) => /pains-and-bottlenecks\.md$/.test(n.id));
  if (pains) {
    const c = await api('/api/file?path=' + encodeURIComponent(pains.id)).catch(() => null);
    if (c) {
      const bullets = c.content.split('\n').filter((l) => /^\s*[-*]\s+\S/.test(l)).slice(0, 5);
      $('#dashPains').innerHTML = bullets.length ? marked.parse(bullets.join('\n')) : '<span style="color:var(--muted)">No bullet items in pains-and-bottlenecks.md yet.</span>';
    }
  }
  // Template completeness = structure check, derived live from /api/lint. The script
  // owns "are the required sections present?"; the consultant owns "are they substantive?".
  const lint = await api('/api/lint').catch(() => null);
  const lb = $('#lintBody');
  if (lint && lb) {
    const { complete, linted, incomplete } = lint.summary;
    if (!linted) {
      lb.innerHTML = '<span style="color:var(--muted)">No documents with a canonical template in this library yet.</span>';
    } else {
      const pct = Math.round((complete / linted) * 100);
      const head = `<div class="metric">${complete}<small> / ${linted} match their template</small></div>
        <div class="bar"><span style="width:${pct}%${incomplete ? ';background:var(--weak)' : ''}"></span></div>`;
      let detail;
      if (!incomplete) {
        detail = '<div class="lint-allgood">✓ Every document has all its required sections.</div>';
      } else {
        detail = '<div class="lint-detail">' + lint.files.filter((f) => !f.ok).map((f) => {
          const chips = [
            ...f.missingSections.map((s) => `<span class="chip lint-miss">${esc(s.text)}</span>`),
            ...f.missingFields.map((x) => `<span class="chip lint-miss">${esc(x)} field</span>`),
          ].join('');
          return `<div class="lint-file"><span class="lint-file-name" data-id="${esc(f.path)}">${esc(f.path)}</span><span class="lint-chips">${chips}</span></div>`;
        }).join('') + '</div>';
      }
      lb.innerHTML = head + detail;
      $$('#lintBody .lint-file-name').forEach((e) => {
        if (S.byId[e.dataset.id]) { e.classList.add('lintlink'); e.addEventListener('click', () => openPage(e.dataset.id)); }
      });
    }
  }
}

// ---- org & roles -----------------------------------------------------------
function workflowsOwnedBy(roleId) { return S.graph.nodes.filter((n) => n.category === 'workflows' && n.ownerRole === roleId); }
function roleCard(role, isLead) {
  const av = (role.label.match(/\b\w/g) || ['?']).slice(0, 2).join('').toUpperCase();
  const wfs = workflowsOwnedBy(role.id);
  const chips = wfs.length
    ? wfs.map((w) => `<span class="wf-chip" data-id="${w.id}"><span class="pdot" style="background:${CAT_COLOR.workflows}"></span>${esc(w.label)}</span>`).join('')
    : '<span class="wf-chip none">no owned workflows</span>';
  return `<div class="role-card${isLead ? ' lead' : ''}">
    <div class="rc-name" data-id="${role.id}"><span class="av" style="background:${colorFor(role.label)}">${av}</span>${esc(role.label)}</div>
    <div class="rc-dept">${esc(role.department || '—')}</div>
    <div class="rc-wf-label">Workflows</div><div>${chips}</div></div>`;
}
function renderOrg() {
  const root = $('#view-org');
  const roles = S.graph.nodes.filter((n) => n.category === 'roles');
  const tops = roles.filter((r) => !r.reportsToId);
  const reportsOf = (id) => roles.filter((r) => r.reportsToId === id);
  // recursive nested <ul>/<li> tree (CSS draws the connector lines)
  const node = (role) => {
    const reps = reportsOf(role.id);
    return `<li>${roleCard(role, reps.length > 0)}${reps.length ? `<ul>${reps.map(node).join('')}</ul>` : ''}</li>`;
  };
  // departments aggregation
  const depts = {};
  roles.forEach((r) => { const d = (r.department || 'Unassigned').split('/')[0].trim(); (depts[d] ||= { roles: [], wf: new Set() }); depts[d].roles.push(r); workflowsOwnedBy(r.id).forEach((w) => depts[d].wf.add(w.id)); });
  const deptCards = Object.entries(depts).map(([d, v]) => `
    <div class="dept-card"><h4>${esc(d)}</h4>
      <div class="roles-line">${v.roles.map((r) => esc(r.label)).join(' · ')}</div>
      <div>${[...v.wf].map((id) => { const w = S.byId[id]; return `<span class="wf-chip" data-id="${id}"><span class="pdot" style="background:${CAT_COLOR.workflows}"></span>${esc(w.label)}</span>`; }).join('') || '<span class="wf-chip none">none</span>'}</div>
    </div>`).join('');
  root.innerHTML = `
    <div class="org-hero"><h1>Org &amp; Roles</h1><div class="sub">Reporting lines from each role's “Reports to”, with the workflows each role owns. Click a name to open its page.</div></div>
    <div class="org-row">${tops.map((t) => `<div class="orgchart"><ul>${node(t)}</ul></div>`).join('')}</div>
    <div class="dept-summary"><div class="section-title">Workflows by department</div><div class="dept-grid">${deptCards}</div></div>`;
  $$('#view-org .rc-name').forEach((e) => e.addEventListener('click', () => openPage(e.dataset.id)));
  $$('#view-org .wf-chip[data-id]').forEach((e) => e.addEventListener('click', () => openPage(e.dataset.id)));
}

// ---- workflow maps ---------------------------------------------------------
function renderFlows() {
  const wfs = S.graph.nodes.filter((n) => n.category === 'workflows').sort((a, b) => a.label.localeCompare(b.label));
  if (!S.flow || !S.byId[S.flow]) S.flow = (wfs.find((w) => (w.steps || []).length) || wfs[0])?.id;
  $('#flowPicker').innerHTML = wfs.map((w) => {
    const n = (w.steps || []).length;
    return `<button class="flow-tab${w.id === S.flow ? ' active' : ''}" data-id="${w.id}">${esc(w.label)} <span style="opacity:.6">· ${n} step${n === 1 ? '' : 's'}</span></button>`;
  }).join('');
  $$('#flowPicker .flow-tab').forEach((b) => b.addEventListener('click', () => { S.flow = b.dataset.id; renderFlows(); }));
  drawFlow(S.byId[S.flow]);
}
function collectEntities(steps, roles, tools) {
  for (const s of steps) { if (s.role) roles.add(s.role); if (s.tool) tools.add(s.tool); if (s.children?.length) collectEntities(s.children, roles, tools); }
}
function stepCard(s, num) {
  const rc = colorFor(s.role), tc = colorFor(s.tool, 52);
  const roleId = resolveEntity(s.role), toolId = resolveEntity(s.tool);
  const isDecision = (s.children || []).length > 0;
  const tags = [
    s.role ? `<span class="fs-tag role" ${roleId ? `data-id="${roleId}"` : ''} style="border-color:${rc}"><span class="sw" style="background:${rc}"></span>${esc(s.role)}</span>` : '',
    s.tool ? `<span class="fs-tag" ${toolId ? `data-id="${toolId}"` : ''} style="background:${tc}"><span class="sw" style="background:#0b0e12"></span>${esc(s.tool)}</span>` : '',
    s.record ? `<span class="fs-tag record">${esc(s.record)}</span>` : '',
  ].join('');
  const numTxt = isDecision ? '⎇' : (num != null ? num : '•');
  const excLines = (s.exceptions || []).map((e) => `<div class="fs-note fs-exc-note">⚠ <b>${esc(e.kind)}:</b> ${esc(e.text)}</div>`).join('');
  return `<div class="flow-step${s.exception ? ' exception' : ''}${isDecision ? ' decision' : ''}" style="border-left-color:${rc}">
      <div class="fs-top"><span class="fs-num">${numTxt}</span><span class="fs-action">${esc(s.action)}</span>
        ${s.exception ? '<span class="fs-exc">⚠ exception</span>' : ''}<span class="fs-tags">${tags}</span></div>
      ${s.note ? `<div class="fs-note">${esc(s.note)}</div>` : ''}${excLines}</div>`;
}
function renderStepTree(steps) {
  // children with a branch label = parallel branches; unlabeled children = sequential continuation
  let html = ''; let seq = 0;
  steps.forEach((s, i) => {
    seq += 1; html += stepCard(s, seq);
    const kids = s.children || [];
    const branches = kids.filter((k) => k.branch);
    const cont = kids.filter((k) => !k.branch);
    if (branches.length) {
      html += `<div class="branches">${branches.map((b) => `
        <div class="branch"><div class="branch-label">${esc(b.branch)}</div>
          <div class="branch-body">${renderStepTree([{ ...b, branch: null }])}</div></div>`).join('')}</div>`;
    }
    if (cont.length) { html += `<div class="flow-arrow">↓</div>` + renderStepTree(cont); }
    if (i < steps.length - 1 && !branches.length && !cont.length) html += `<div class="flow-arrow">↓</div>`;
  });
  return html;
}
function drawFlow(wf) {
  const legend = $('#flowLegend'), body = $('#flowBody');
  if (!wf) { legend.innerHTML = ''; body.innerHTML = '<div class="flow-empty">No workflows found.</div>'; return; }
  const steps = wf.steps || [];
  if (!steps.length) {
    legend.innerHTML = '';
    body.innerHTML = `<div class="flow-empty"><b>${esc(wf.label)}</b> has no mapped steps yet.<br><br>
      Add them to the page's <b>## SOP</b> section, then reload:<br><br>
      <code>- [ ] **&lt;Action verb&gt;** — &lt;role&gt; uses &lt;tool&gt; on &lt;record&gt; — &lt;produces what&gt;</code><br>
      <code>&nbsp;&nbsp;- Exception: &lt;what can go wrong&gt; → &lt;how it's handled&gt;</code><br>
      <code>&nbsp;&nbsp;- Escalate: &lt;condition&gt; → &lt;who/where&gt;</code><br><br>
      The tool may be a plain name or a markdown link like <code>[tool-slug](../tools/tool-slug.md)</code>;
      Exception / Escalate sub-bullets attach to the step above them.<br><br>
      <button class="seg" id="flowOpen">Open ${esc(wf.label)} to edit</button></div>`;
    $('#flowOpen')?.addEventListener('click', () => openPage(wf.id));
    return;
  }
  const rSet = new Set(), tSet = new Set(); collectEntities(steps, rSet, tSet);
  const lgChip = (name, color, round) => { const id = resolveEntity(name); return `<span class="lg-chip" ${id ? `data-id="${id}"` : ''}><span class="sw" style="background:${color};${round ? 'border-radius:50%' : ''}"></span>${esc(name)}</span>`; };
  legend.innerHTML = `
    <div class="lg-group"><div class="lg-title">Roles</div><div class="lg-items">${[...rSet].map((r) => lgChip(r, colorFor(r), true)).join('') || '—'}</div></div>
    <div class="lg-group"><div class="lg-title">Tools</div><div class="lg-items">${[...tSet].map((t) => lgChip(t, colorFor(t, 52))).join('') || '—'}</div></div>`;
  body.innerHTML = renderStepTree(steps);
  $$('#flowBody .fs-tag[data-id], #flowLegend .lg-chip[data-id]').forEach((e) => e.addEventListener('click', () => openPage(e.dataset.id)));
}

// ---- page (rendered wiki) --------------------------------------------------
async function openPage(id) {
  const node = S.byId[id]; if (!node) return;
  if (S.dirty && !confirm('Discard unsaved changes?')) return;
  S.current = id; S.dirty = false; S.route = 'page';
  $$('.route').forEach((r) => (r.hidden = r.id !== 'view-page'));
  $$('.nav-link').forEach((l) => l.classList.remove('active'));
  $$('.tree-item').forEach((t) => t.classList.toggle('active', t.dataset.id === id));
  const data = await api('/api/file?path=' + encodeURIComponent(id));
  $('#phTitle').textContent = node.label; $('#phPath').textContent = id;
  $('#phCrumbs').innerHTML = `<b>${node.category}</b>`; $('#phChips').innerHTML = pageChips(node);
  setMode('read');
  $('#pageEdit').value = data.content; $('#pageRender').innerHTML = marked.parse(data.content);
  wikifyLinks($('#pageRender'), id); renderMermaidBlocks($('#pageRender'));
  $('#saveState').textContent = ''; $('#saveState').className = 'save-state'; $('#main').scrollTop = 0;
}
// Derived page chips — currently just the stub flag (detected from content).
function pageChips(node) {
  return node.stub ? '<span class="chip">stub</span>' : '';
}
function setMode(mode) {
  const read = mode === 'read';
  $('#pageRender').hidden = !read; $('#pageEdit').hidden = read;
  $('#btnRead').classList.toggle('active', read); $('#btnEdit').classList.toggle('active', !read); $('#btnSave').hidden = read;
}
function wikifyLinks(container, fromId) {
  const fromDir = fromId.includes('/') ? fromId.slice(0, fromId.lastIndexOf('/')) : '';
  $$('a', container).forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (/^https?:/i.test(href)) { a.target = '_blank'; a.rel = 'noopener'; return; }
    const m = href.match(/^([^#]+\.md)(#.*)?$/); if (!m) return;
    const target = posixNorm((fromDir ? fromDir + '/' : '') + decodeURIComponent(m[1]));
    if (S.byId[target]) { a.classList.add('wikilink'); a.addEventListener('click', (e) => { e.preventDefault(); openPage(target); }); }
  });
}
// render fenced ```mermaid blocks as diagrams (e.g. the data-architecture map)
let _mid = 0;
async function renderMermaidBlocks(container) {
  if (!window.__mermaid) return;
  for (const code of $$('code.language-mermaid', container)) {
    const src = code.textContent; const div = document.createElement('div'); div.className = 'mermaid-diagram';
    try { const { svg } = await window.__mermaid.render('m' + (++_mid), src); div.innerHTML = svg; }
    catch (e) { div.textContent = 'Mermaid error: ' + e.message; }
    code.closest('pre').replaceWith(div);
  }
}
// ---- save file -------------------------------------------------------------
async function saveFile() {
  const id = S.current; if (!id) return;
  const content = $('#pageEdit').value;
  $('#saveState').textContent = 'Saving…'; $('#saveState').className = 'save-state';
  await api('/api/file', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: id, content }) });
  S.dirty = false; $('#btnSave').disabled = true;
  await refreshGraph();
  const node = S.byId[id];
  $('#phTitle').textContent = node.label; $('#phChips').innerHTML = pageChips(node);
  $('#pageRender').innerHTML = marked.parse(content); wikifyLinks($('#pageRender'), id); renderMermaidBlocks($('#pageRender'));
  $$('.tree-item').forEach((t) => t.classList.toggle('active', t.dataset.id === id));
  $('#saveState').textContent = 'Saved'; $('#saveState').className = 'save-state saved';
}
// ---- toast -----------------------------------------------------------------
let _toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(_toastT);
  _toastT = setTimeout(() => { t.classList.remove('show'); setTimeout(() => (t.hidden = true), 300); }, 4600);
}

// ---- UI wiring -------------------------------------------------------------
function wireUI() {
  $$('.nav-link').forEach((l) => { if (l.dataset.route) l.addEventListener('click', () => go(l.dataset.route)); });
  $('#btnRead').addEventListener('click', () => setMode('read'));
  $('#btnEdit').addEventListener('click', () => setMode('edit'));
  $('#btnSave').addEventListener('click', saveFile);
  $('#pageEdit').addEventListener('input', () => { S.dirty = true; $('#btnSave').disabled = false; $('#saveState').textContent = 'Unsaved changes'; $('#saveState').className = 'save-state dirty'; });
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (S.route === 'page' && !$('#btnSave').disabled) saveFile(); }
  });
  window.addEventListener('beforeunload', (e) => { if (S.dirty) { e.preventDefault(); e.returnValue = ''; } });
}
