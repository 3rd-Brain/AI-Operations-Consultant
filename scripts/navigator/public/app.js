/* AI-Ops Navigator — wiki / dashboard / org / workflow-maps. Vanilla JS, no build. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---- colors ----------------------------------------------------------------
const CAT_COLOR = {
  profile: '#d4a23a', roles: '#5a9bd4', tools: '#9b7fd4', workflows: '#3fb950',
  scopes: '#e08c4a', roadmaps: '#4ac9c9', decisions: '#c96a8c', ops: '#6b7785', meetings: '#7d8a4a', other: '#6b7785',
};
const PRI_COLOR = { P0: '#e5534b', P1: '#d4a23a', P2: '#5a6b7d' };
const READY_COLOR = { Strong: '#3fb950', Medium: '#d4a23a', Weak: '#e5534b' };
const FRICTION_COLOR = { Low: '#3fb950', Med: '#d4a23a', High: '#e5534b' };
const CAT_ORDER = ['profile', 'workflows', 'roles', 'tools', 'scopes', 'roadmaps', 'decisions', 'ops', 'meetings', 'other'];
const _cc = {};
function colorFor(name, light = 60) {
  if (!name) return '#6b7785';
  const key = name + light; if (_cc[key]) return _cc[key];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return (_cc[key] = `hsl(${h % 360} 60% ${light}%)`);
}

// ---- grading schemas -------------------------------------------------------
const SCHEMAS = {
  profile: [
    { key: 'maturityLevel', label: 'Maturity (5 Levels)', opts: ['1', '2', '3', '4', '5'] },
    { key: 'bindingC', label: 'Binding C', opts: ['Consistency', 'Clarity', 'Capacity'] },
    { key: 'lever', label: 'Lever (P→P→T)', opts: ['People', 'Process', 'Tools'] },
    { key: 'pillarPeople', label: 'People', opts: ['Strong', 'Medium', 'Weak'] },
    { key: 'pillarProcess', label: 'Process', opts: ['Strong', 'Medium', 'Weak'] },
    { key: 'pillarTools', label: 'Tools', opts: ['Strong', 'Medium', 'Weak'] },
  ],
  workflows: [
    { key: 'priority', label: 'Priority', opts: ['P0', 'P1', 'P2'] },
    { key: 'koodar', label: 'KOODAR target', opts: ['K', 'KA', 'KDA', 'KDAR', 'KODAR', 'KOODAR'] },
    { key: 'aiStage', label: '4-Stage AI', opts: ['1', '2', '3', '4'] },
    { key: 'friction', label: 'Friction', opts: ['Low', 'Med', 'High'] },
    { key: 'status', label: 'Status', opts: ['stub', 'enriched', 'scoped', 'built'] },
  ],
  roles: [{ key: 'readiness', label: 'Readiness', opts: ['Strong', 'Medium', 'Weak'] }, { key: 'status', label: 'Status', opts: ['stub', 'complete'] }],
  tools: [{ key: 'readiness', label: 'Integration readiness', opts: ['Strong', 'Medium', 'Weak'] }, { key: 'status', label: 'Status', opts: ['stub', 'complete'] }],
  _default: [{ key: 'status', label: 'Status', opts: ['stub', 'complete'] }],
};
function nodeColor(n) {
  const g = n.grade;
  if (g) {
    if (n.category === 'workflows' && g.priority) return PRI_COLOR[g.priority];
    if (g.readiness) return READY_COLOR[g.readiness];
    if (g.friction) return FRICTION_COLOR[g.friction];
  }
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
  const cats = CAT_ORDER.filter((c) => groups[c] || CREATABLE.includes(c)); // show creatable cats even when empty
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
      item.innerHTML = `<span class="dot" style="background:${nodeColor(n)}"></span><span class="nm">${esc(n.label)}</span>` +
        (n.grade?.priority ? `<span class="pri" style="background:${PRI_COLOR[n.grade.priority]}">${n.grade.priority}</span>` : '');
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
async function renderDashboard() {
  const root = $('#view-dashboard');
  const profile = S.graph.nodes.find((n) => /(^|\/)profile\.md$/.test(n.id));
  const pg = profile?.grade || {};
  const wf = S.graph.nodes.filter((n) => n.category === 'workflows');
  const pri = { P0: [], P1: [], P2: [], _: [] }; wf.forEach((n) => (pri[n.grade?.priority] || pri._).push(n));
  const counts = {}; S.graph.nodes.forEach((n) => { counts[n.category] ||= { t: 0, d: 0 }; counts[n.category].t++; if (!n.stub) counts[n.category].d++; });
  const libT = S.graph.nodes.length, libD = S.graph.nodes.filter((n) => !n.stub).length;
  const pillar = (l, v) => `<div class="kv"><span class="k">${l}</span><span class="tag" style="background:${READY_COLOR[v] || '#444'}">${v || '—'}</span></div>`;
  root.innerHTML = `
    <div class="dash-hero">
      <h1>${esc(S.graph.root)} <span style="color:var(--muted);font-weight:400;font-size:18px">· AI-Ops workspace</span></h1>
      <div class="sub">Read, edit, and grade the company library against the AI-Ops frameworks.</div>
      <p class="dash-lead" id="dashLead"></p>
    </div>
    <div class="cards">
      <div class="card"><h3>Digital Maturity</h3><div class="metric">L${pg.maturityLevel || '—'}<small> / 5</small></div>
        <div class="kv"><span class="k">Binding C</span><b>${pg.bindingC || '—'}</b></div>
        <div class="kv"><span class="k">Lever (P→P→T)</span><b>${pg.lever || '—'}</b></div></div>
      <div class="card"><h3>Pillar Readiness</h3>${pillar('People', pg.pillarPeople)}${pillar('Process', pg.pillarProcess)}${pillar('Tools', pg.pillarTools)}</div>
      <div class="card"><h3>Workflows by Priority</h3>
        <div class="kv"><span class="k">P0 — Binding</span><b style="color:${PRI_COLOR.P0}">${pri.P0.length}</b></div>
        <div class="kv"><span class="k">P1 — Adoption</span><b style="color:${PRI_COLOR.P1}">${pri.P1.length}</b></div>
        <div class="kv"><span class="k">P2 — Deferred</span><b style="color:${PRI_COLOR.P2}">${pri.P2.length}</b></div></div>
      <div class="card"><h3>Library Completeness</h3><div class="metric">${libD}<small> / ${libT} pages</small></div>
        <div class="bar"><span style="width:${Math.round((libD / libT) * 100)}%"></span></div>
        <div style="margin-top:10px">${CAT_ORDER.filter((c) => counts[c]).map((c) => `<div class="kv"><span class="k">${c}</span><span>${counts[c].d}/${counts[c].t}</span></div>`).join('')}</div></div>
    </div>
    <div class="section-title">Workflow board</div>
    <div class="board">${['P0', 'P1', 'P2'].map((p) => `
      <div class="board-col"><h4><span class="badge" style="background:${PRI_COLOR[p]}">${p}</span> ${{ P0: 'Binding', P1: 'Adoption', P2: 'Deferred' }[p]}</h4>
      ${(pri[p].concat(p === 'P2' ? pri._ : [])).map(wfCard).join('') || '<div style="color:var(--muted);font-size:12px">—</div>'}</div>`).join('')}</div>
    <div class="section-title">Top pains (P0)</div>
    <div class="dash-pains markdown" id="dashPains">Loading…</div>`;
  $$('#view-dashboard .wf-card').forEach((c) => c.addEventListener('click', () => openPage(c.dataset.id)));
  const prof = await api('/api/file?path=' + encodeURIComponent(profile?.id || 'profile.md')).catch(() => null);
  if (prof) { const m = prof.content.match(/##\s*What we do\s*\n+([\s\S]*?)(\n##\s|\n$)/); $('#dashLead').textContent = m ? m[1].trim().replace(/\s+/g, ' ').slice(0, 360) + (m[1].length > 360 ? '…' : '') : ''; }
  const pains = S.graph.nodes.find((n) => /pains-and-bottlenecks\.md$/.test(n.id));
  if (pains) { const c = await api('/api/file?path=' + encodeURIComponent(pains.id)).catch(() => null); const b = c && c.content.match(/(##\s*P0[\s\S]*?)(\n##\s|$)/); $('#dashPains').innerHTML = b ? marked.parse(b[1]) : '<span style="color:var(--muted)">No P0 section.</span>'; }
}
function wfCard(n) {
  const g = n.grade || {};
  const m = [g.friction && `<span class="mini">friction: ${g.friction}</span>`, g.koodar && `<span class="mini">${g.koodar}</span>`, `<span class="mini">${g.status || (n.stub ? 'stub' : 'page')}</span>`].filter(Boolean).join('');
  return `<div class="wf-card" data-id="${n.id}"><div class="wf-name">${esc(n.label)}</div><div class="wf-meta">${m}</div></div>`;
}

// ---- org & roles -----------------------------------------------------------
function workflowsOwnedBy(roleId) { return S.graph.nodes.filter((n) => n.category === 'workflows' && n.ownerRole === roleId); }
function roleCard(role, isLead) {
  const av = (role.label.match(/\b\w/g) || ['?']).slice(0, 2).join('').toUpperCase();
  const wfs = workflowsOwnedBy(role.id);
  const chips = wfs.length
    ? wfs.map((w) => `<span class="wf-chip" data-id="${w.id}"><span class="pdot" style="background:${PRI_COLOR[w.grade?.priority] || '#5a6b7d'}"></span>${esc(w.label)}</span>`).join('')
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
      <div>${[...v.wf].map((id) => { const w = S.byId[id]; return `<span class="wf-chip" data-id="${id}"><span class="pdot" style="background:${PRI_COLOR[w.grade?.priority] || '#5a6b7d'}"></span>${esc(w.label)}</span>`; }).join('') || '<span class="wf-chip none">none</span>'}</div>
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
  const wfs = S.graph.nodes.filter((n) => n.category === 'workflows').sort((a, b) => (a.grade?.priority || 'Z').localeCompare(b.grade?.priority || 'Z'));
  if (!S.flow || !S.byId[S.flow]) S.flow = (wfs.find((w) => (w.steps || []).length) || wfs[0])?.id;
  $('#flowPicker').innerHTML = wfs.map((w) => {
    const dot = PRI_COLOR[w.grade?.priority] || '#5a6b7d';
    const n = (w.steps || []).length;
    return `<button class="flow-tab${w.id === S.flow ? ' active' : ''}" data-id="${w.id}"><span class="pdot" style="background:${dot}"></span>${esc(w.label)} <span style="opacity:.6">· ${n} step${n === 1 ? '' : 's'}</span></button>`;
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
  ].join('');
  const numTxt = isDecision ? '⎇' : (num != null ? num : '•');
  return `<div class="flow-step${s.exception ? ' exception' : ''}${isDecision ? ' decision' : ''}" style="border-left-color:${rc}">
      <div class="fs-top"><span class="fs-num">${numTxt}</span><span class="fs-action">${esc(s.action)}</span>
        ${s.exception ? '<span class="fs-exc">⚠ exception</span>' : ''}<span class="fs-tags">${tags}</span></div>
      ${s.note ? `<div class="fs-note">${esc(s.note)}</div>` : ''}</div>`;
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
      <code>- [ ] **Action** — \`Role\` uses \`Tool\` — note</code><br>
      <code>&nbsp;&nbsp;- [ ] **(if X)** **Action** — \`Role\` uses \`Tool\` — ⚠ note</code> &nbsp;(indent to branch; ⚠ = exception)<br><br>
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
  $('#phCrumbs').innerHTML = `<b>${node.category}</b>`; $('#phChips').innerHTML = gradeChips(node);
  setMode('read');
  $('#pageEdit').value = data.content; $('#pageRender').innerHTML = marked.parse(data.content);
  wikifyLinks($('#pageRender'), id); renderMermaidBlocks($('#pageRender'));
  $('#saveState').textContent = ''; $('#saveState').className = 'save-state'; $('#main').scrollTop = 0;
}
function gradeChips(node) {
  const g = node.grade; if (!g) return '<span class="chip">ungraded</span>';
  const o = [];
  if (g.priority) o.push(`<span class="chip pill" style="background:${PRI_COLOR[g.priority]}">${g.priority}</span>`);
  if (g.maturityLevel) o.push(`<span class="chip">Maturity <b>L${g.maturityLevel}</b></span>`);
  if (g.lever) o.push(`<span class="chip">Lever <b>${g.lever}</b></span>`);
  if (g.bindingC) o.push(`<span class="chip">C <b>${g.bindingC}</b></span>`);
  if (g.koodar) o.push(`<span class="chip">KOODAR <b>${g.koodar}</b></span>`);
  if (g.aiStage) o.push(`<span class="chip">AI stage <b>${g.aiStage}</b></span>`);
  if (g.friction) o.push(`<span class="chip pill" style="background:${FRICTION_COLOR[g.friction]}">friction: ${g.friction}</span>`);
  if (g.readiness) o.push(`<span class="chip pill" style="background:${READY_COLOR[g.readiness]}">${g.readiness}</span>`);
  if (g.status) o.push(`<span class="chip">${g.status}</span>`);
  return o.join('');
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
// Grades are display-only here (chips on the page header + dashboard/map colors).
// They are written by the ai-ops consultant to .ai-ops/navigator-grades.json.

// ---- save file -------------------------------------------------------------
async function saveFile() {
  const id = S.current; if (!id) return;
  const content = $('#pageEdit').value;
  $('#saveState').textContent = 'Saving…'; $('#saveState').className = 'save-state';
  await api('/api/file', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: id, content }) });
  S.dirty = false; $('#btnSave').disabled = true;
  await refreshGraph();
  const node = S.byId[id];
  $('#phTitle').textContent = node.label; $('#phChips').innerHTML = gradeChips(node);
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
