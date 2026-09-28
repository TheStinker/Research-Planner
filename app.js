const { clone, validate, reconcileMilestones, removeProject, arrange } = PlannerModel;
const STORAGE_KEY = 'researchPlanner.v2';
const LEGACY_KEY = 'researchPlanner.v1';
const NIAMS_MIGRATION_KEY = 'researchPlanner.addedNiamsLiteratureReview.v1';
const TYPE_LABELS = { main: 'Main dissertation', piggyback: 'Piggyback', application: 'Application', future: 'Future project', independent: 'Independent project' };
const COLORS = { main: '#5b66d6', piggyback: '#2d9b73', application: '#c47f2a', future: '#9a6ac7', independent: '#27899d' };
const $ = id => document.getElementById(id);
let startupMessage = '', storageBlocked = false;
let state = loadState(), selectedProjectId = state.projects[0]?.id, editingId = null;
let timelineYear = Number(state.projects.map(p => p.start).sort()[0]?.slice(0, 4)) || new Date().getFullYear();
let history = [], drag = null;

function niamsReviewProject() {
  return { ...clone(NIAMS_REVIEW_PROJECT), milestones: NIAMS_REVIEW_PROJECT.milestones.map(text => ({ text, done: false })) };
}
function addNiamsReview(plan) {
  const next = clone(plan);
  const alreadyPresent = next.projects.some(p => p.id === NIAMS_REVIEW_PROJECT.id || /NIAMS.*literature review/i.test(p.title));
  if (!alreadyPresent) next.projects.push(niamsReviewProject());
  return validate(next);
}

function initialState(legacy = {}) {
  const date = index => { const d = new Date(2026, 8 + index, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
  const projects = Object.values(PROJECTS).map((p, index) => {
    const row = TIMELINE_ROWS.find(r => r.id === p.id);
    const dependencies = CONNECTIONS.filter(c => c.to === p.id).map(c => c.from);
    if (p.id.startsWith('stage-') && p.id !== 'stage-1') dependencies.unshift(`stage-${Number(p.id.split('-')[1]) - 1}`);
    const sidePositions = { storage: [28, 28], skin: [898, 28], process: [318, 488], polytrauma: [1188, 488] };
    const [x, y] = sidePositions[p.id] || [28 + index * 290, 258];
    return { ...p, status: STATUS_LABELS[legacy.status?.[p.id]] ? legacy.status[p.id] : p.defaultStatus,
      dependencies, position: { x, y }, start: date(row.start), end: date(row.end),
      phases: row.phases?.map(f => ({ ...f, start: date(f.start), end: date(f.end) })),
      milestones: p.milestones.map((text, i) => ({ text, done: Boolean(legacy.checks?.[p.id]?.[i]) })) };
  });
  projects.push(niamsReviewProject());
  return validate({ version: 2, projects });
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        let loaded = validate(JSON.parse(raw));
        if (!localStorage.getItem(NIAMS_MIGRATION_KEY)) {
          loaded = addNiamsReview(loaded);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
            localStorage.setItem(NIAMS_MIGRATION_KEY, '1');
            startupMessage = 'Added the NIAMS predictive bone-model literature review to your plan.';
          } catch { startupMessage = 'NIAMS literature review added for this session. Export the plan if browser saving remains unavailable.'; }
        }
        return loaded;
      }
      catch { storageBlocked = true; startupMessage = 'Saved plan could not be read. It has not been overwritten. Showing the starting plan. Import a valid backup to replace the unreadable data.'; return initialState(); }
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) { try { return initialState(JSON.parse(legacy) || {}); } catch { startupMessage = 'Previous progress could not be read; the original saved data is unchanged.'; } }
  } catch { startupMessage = 'Browser storage is unavailable. Use Export plan to keep your changes.'; }
  return initialState();
}
function notice(message, error = false) { $('saveStatus').textContent = message; $('saveStatus').classList.toggle('is-error', error); }
function saveState() {
  if (storageBlocked) { notice('Original saved data is protected. These changes are only in memory; use Export plan to keep them.', true); return; }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); localStorage.setItem(NIAMS_MIGRATION_KEY, '1'); notice('Saved in this browser · Export plan for a backup or another device.'); }
  catch { notice('Could not save to this browser. Use Export plan to keep your changes.', true); }
}
function commit(next, message) {
  validate(next); history.push(clone(state)); if (history.length > 40) history.shift();
  state = next; if (!state.projects.some(p => p.id === selectedProjectId)) selectedProjectId = state.projects[0]?.id;
  render(); saveState(); if (message && !storageBlocked && !$('saveStatus').classList.contains('is-error')) notice(`${message} Saved in this browser.`);
}
function project(id = selectedProjectId) { return state.projects.find(p => p.id === id); }
function el(tag, className, text) { const node = document.createElement(tag); node.className = className; if (text !== undefined) node.textContent = text; return node; }
function button(text, className = 'btn') { const node = el('button', className, text); node.type = 'button'; return node; }
function monthLabel(value) { return new Date(`${value}-01T12:00:00`).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }); }
function setView(name) {
  document.querySelectorAll('.tab').forEach(tab => { const active = tab.dataset.view === name; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', active); });
  document.querySelectorAll('[data-view-panel]').forEach(panel => panel.classList.toggle('is-active', panel.dataset.viewPanel === name));
  if (name === 'map') requestAnimationFrame(drawConnections);
}
function render() { renderMap(); buildTimeline(); renderFocus(); selectProject(selectedProjectId); $('undoBtn').disabled = !history.length; }
function renderMap() {
  $('projectNodes').replaceChildren();
  if (!state.projects.length) $('projectNodes').append(el('p', 'empty-map', 'Start your plan with + Add project.'));
  state.projects.forEach(p => {
    const card = el('article', 'project-card movable-card'); card.dataset.projectId = p.id;
    card.style.left = `${p.position.x}px`; card.style.top = `${p.position.y}px`; card.style.borderLeft = `4px solid ${COLORS[p.type]}`;
    const handle = button('⠿ Move', 'drag-handle'); handle.setAttribute('aria-label', `Move ${p.title}`); handle.setAttribute('aria-describedby', 'mapHelp'); handle.title = 'Drag to move; arrow keys move 20px, Shift + arrow keys move 100px';
    handle.addEventListener('pointerdown', event => startDrag(event, p.id, card, handle));
    handle.addEventListener('keydown', event => {
      const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
      if (!delta) return; event.preventDefault(); const next = clone(state), pos = next.projects.find(q => q.id === p.id).position, step = event.shiftKey ? 100 : 20;
      pos.x = Math.min(100000, Math.max(8, pos.x + delta[0] * step)); pos.y = Math.min(100000, Math.max(8, pos.y + delta[1] * step));
      commit(next); $('projectNodes').querySelector(`[data-project-id="${p.id}"] .drag-handle`).focus({ preventScroll: true });
    });
    const select = button('', 'card-select'); select.setAttribute('aria-label', `Select ${p.title}`);
    select.append(el('span', 'project-type', TYPE_LABELS[p.type]), el('h3', '', p.title), el('p', '', p.short || p.summary), el('span', `status-chip status-${p.status}`, STATUS_LABELS[p.status]));
    select.addEventListener('click', () => selectProject(p.id)); select.addEventListener('dblclick', () => openEditor(p.id));
    card.append(handle, select); $('projectNodes').append(card);
  });
  sizeCanvas(); requestAnimationFrame(drawConnections);
}
function sizeCanvas() {
  $('dependencyCanvas').style.width = `${Math.max(1100, ...state.projects.map(p => p.position.x + 280))}px`;
  $('dependencyCanvas').style.height = `${Math.max(720, ...state.projects.map(p => p.position.y + 250))}px`;
}
function startDrag(event, id, card, handle) {
  if (event.button !== 0 || drag) return;
  selectProject(id);
  const start = { ...project(id).position }, before = clone(state), scroll = $('mapScroll');
  drag = { id, pointerId: event.pointerId, before, cancel: () => finish(true) };
  const initial = { x: event.clientX, y: event.clientY, scrollX: scroll.scrollLeft, scrollY: scroll.scrollTop };
  let moved = false, last = event;
  handle.setPointerCapture(event.pointerId); card.classList.add('is-dragging');
  function position(e) {
    if (!moved && Math.hypot(e.clientX - initial.x, e.clientY - initial.y) < 4) return;
    moved = true;
    const p = project(id); p.position = {
      x: Math.min(100000, Math.max(8, start.x + e.clientX - initial.x + scroll.scrollLeft - initial.scrollX)),
      y: Math.min(100000, Math.max(8, start.y + e.clientY - initial.y + scroll.scrollTop - initial.scrollY))
    };
    card.style.left = `${p.position.x}px`; card.style.top = `${p.position.y}px`; sizeCanvas(); drawConnections();
  }
  function move(e) { if (e.pointerId !== event.pointerId) return; last = e; position(e); }
  function autoScroll() {
    if (!drag || drag.id !== id) return;
    const r = scroll.getBoundingClientRect();
    if (moved) { scroll.scrollLeft += last.clientX > r.right - 35 ? 12 : last.clientX < r.left + 35 ? -12 : 0; scroll.scrollTop += last.clientY > r.bottom - 35 ? 12 : last.clientY < r.top + 35 ? -12 : 0; position(last); }
    frame = requestAnimationFrame(autoScroll);
  }
  function finish(cancelled) {
    if (!drag) return;
    const after = clone(state); state = before; drag = null; cancelAnimationFrame(frame);
    handle.removeEventListener('pointermove', move); handle.removeEventListener('pointerup', up); handle.removeEventListener('pointercancel', cancel); handle.removeEventListener('lostpointercapture', cancel);
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    if (moved && !cancelled) commit(after); else { renderMap(); selectProject(id); }
  }
  function up(e) { if (e.pointerId === event.pointerId) finish(false); }
  function cancel() { finish(true); }
  let frame = requestAnimationFrame(autoScroll);
  handle.addEventListener('pointermove', move); handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', cancel); handle.addEventListener('lostpointercapture', cancel);
}
function drawConnections() {
  const canvas = $('dependencyCanvas'), svg = $('connectorLayer'); if (!canvas.offsetParent) return;
  const width = canvas.clientWidth, height = canvas.clientHeight;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.innerHTML = '<defs><marker id="dependencyArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="context-stroke"/></marker></defs>';
  const cards = new Map([...$('projectNodes').children].map(c => [c.dataset.projectId, c]));
  for (const p of state.projects) for (const dep of p.dependencies) {
    const a = cards.get(dep), b = cards.get(p.id); if (!a || !b) continue;
    const ax = a.offsetLeft, ay = a.offsetTop, bx = b.offsetLeft, by = b.offsetTop;
    let x1, y1, x2, y2, d;
    if (Math.abs(bx - ax) > Math.abs(by - ay)) {
      const dir = bx >= ax ? 1 : -1; x1 = ax + (dir > 0 ? a.offsetWidth : 0); y1 = ay + a.offsetHeight / 2; x2 = bx + (dir > 0 ? 0 : b.offsetWidth); y2 = by + b.offsetHeight / 2;
      const bend = Math.max(45, Math.abs(x2 - x1) / 2); d = `M${x1},${y1} C${x1 + dir * bend},${y1} ${x2 - dir * bend},${y2} ${x2},${y2}`;
    } else {
      const dir = by >= ay ? 1 : -1; x1 = ax + a.offsetWidth / 2; y1 = ay + (dir > 0 ? a.offsetHeight : 0); x2 = bx + b.offsetWidth / 2; y2 = by + (dir > 0 ? 0 : b.offsetHeight);
      const bend = Math.max(45, Math.abs(y2 - y1) / 2); d = `M${x1},${y1} C${x1},${y1 + dir * bend} ${x2},${y2 - dir * bend} ${x2},${y2}`;
    }
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', d); path.setAttribute('fill', 'none'); path.setAttribute('stroke', COLORS[p.type]); path.setAttribute('stroke-width', '2.5'); path.setAttribute('marker-end', 'url(#dependencyArrow)'); path.dataset.from = dep; path.dataset.to = p.id; svg.append(path);
  }
  highlightConnections();
}
function highlightConnections() { $('connectorLayer').querySelectorAll('path[data-from]').forEach(path => { path.style.opacity = [path.dataset.from, path.dataset.to].includes(selectedProjectId) ? 1 : 0.4; }); }
function selectProject(id) {
  const p = project(id); selectedProjectId = p?.id; $('detailPanel').hidden = !p;
  $('projectNodes').querySelectorAll('.project-card').forEach(c => { const selected = c.dataset.projectId === id; c.classList.toggle('is-selected', selected); c.querySelector('.card-select').setAttribute('aria-pressed', String(selected)); });
  if (!p) return;
  for (const [target, key] of [['detailTitle','title'], ['detailSummary','summary'], ['detailWhy','why'], ['detailGate','gate']]) $(target).textContent = p[key] || 'Not specified';
  $('detailWindow').textContent = `${monthLabel(p.start)} – ${monthLabel(p.end)}${p.window ? ` · ${p.window}` : ''}`;
  $('detailParent').replaceChildren();
  if (!p.dependencies.length) $('detailParent').textContent = 'None · independent starting point';
  p.dependencies.forEach(dep => { const parent = project(dep), link = button(`${parent.title} (${STATUS_LABELS[parent.status]})`, 'dependency-link'); link.addEventListener('click', () => selectProject(dep)); $('detailParent').append(link); });
  $('detailStatus').value = p.status; renderChecklist($('detailChecklist'), p); highlightConnections();
}
function renderChecklist(container, p) {
  container.replaceChildren();
  if (!p.milestones.length) { container.append(el('p', 'field-help', 'No milestones yet. Add them in Edit project.')); return; }
  p.milestones.forEach((m, index) => {
    const label = el('label', `check-item${m.done ? ' is-complete' : ''}`), input = document.createElement('input'); input.type = 'checkbox'; input.checked = m.done;
    input.addEventListener('change', () => { const next = clone(state); next.projects.find(q => q.id === p.id).milestones[index].done = input.checked; commit(next); });
    label.append(input, el('span', '', m.text)); container.append(label);
  });
}
function buildTimeline() {
  const container = $('timeline'); container.replaceChildren();
  container.style.gridTemplateColumns = '210px repeat(12, minmax(90px, 1fr))';
  container.append(el('div', 'timeline-cell timeline-head', `Project · ${timelineYear}`));
  const months = Array.from({ length: 12 }, (_, i) => `${timelineYear}-${String(i + 1).padStart(2, '0')}`);
  months.forEach(m => container.append(el('div', 'timeline-cell timeline-head', monthLabel(m))));
  state.projects.forEach(p => {
    const label = button('', 'timeline-cell timeline-row-label'); label.append(el('span', '', p.title), el('small', '', TYPE_LABELS[p.type]));
    label.addEventListener('click', () => { setView('map'); selectProject(p.id); $('detailPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }); container.append(label);
    months.forEach((m, i) => {
      const active = m >= p.start && m <= p.end, phase = p.phases?.find(f => m >= f.start && m <= f.end);
      const cell = el('div', `timeline-bar ${active ? p.type : 'timeline-empty'}`);
      if (active) { cell.title = `${p.title}: ${monthLabel(p.start)} – ${monthLabel(p.end)}`; if (m === phase?.start || (!p.phases && (m === p.start || i === 0)) || (i === 0 && phase)) cell.textContent = phase?.text || p.short || p.title; }
      container.append(cell);
    });
  });
}
function renderFocus() {
  $('focusGrid').replaceChildren();
  const focused = state.projects.filter(p => ['active', 'next', 'ready'].includes(p.status));
  if (!focused.length) $('focusGrid').append(el('p', '', 'No active or upcoming projects. Change a project status to Active now, Next, or Ready soon.'));
  focused.forEach(p => { const card = el('article', 'focus-card'); card.append(el('span', 'focus-label', `${TYPE_LABELS[p.type]} · ${STATUS_LABELS[p.status]}`)); const title = button(p.title, 'focus-title'); title.addEventListener('click', () => { setView('map'); selectProject(p.id); $('detailPanel').scrollIntoView({ block: 'nearest' }); }); card.append(title, el('p', '', p.summary)); const checklist = el('div', 'mini-checklist'); renderChecklist(checklist, p); card.append(checklist); $('focusGrid').append(card); });
}
function openEditor(id = null) {
  editingId = id;
  const today = new Date(), month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const p = project(id) || { title: '', type: 'independent', status: 'parked', short: '', summary: '', why: '', gate: '', window: '', start: month, end: month, milestones: [], dependencies: [] };
  $('editorTitle').textContent = id ? 'Edit project' : 'Add project'; $('formError').textContent = '';
  for (const key of ['title', 'type', 'status', 'short', 'summary', 'why', 'gate', 'window', 'start', 'end']) $(`project${key[0].toUpperCase()}${key.slice(1)}`).value = p[key];
  $('projectMilestones').value = p.milestones.map(m => m.text).join('\n'); $('dependencyOptions').replaceChildren();
  state.projects.filter(q => q.id !== id).forEach(q => { const label = el('label', 'check-item'), input = document.createElement('input'); input.type = 'checkbox'; input.value = q.id; input.checked = p.dependencies.includes(q.id); label.append(input, el('span', '', q.title)); $('dependencyOptions').append(label); });
  if (!state.projects.some(q => q.id !== id)) $('dependencyOptions').textContent = 'No other projects yet.';
  $('projectDialog').showModal(); $('projectTitle').focus();
}
function saveProject(event) {
  event.preventDefault();
  const old = project(editingId), next = clone(state), p = old ? clone(old) : { id: `project-${crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)}`, position: { x: 28, y: Math.min(100000, Math.max(28, ...state.projects.map(q => q.position.y + 230))) }, defaultStatus: 'parked' };
  for (const key of ['title', 'type', 'status', 'short', 'summary', 'why', 'gate', 'window', 'start', 'end']) p[key] = $(`project${key[0].toUpperCase()}${key.slice(1)}`).value.trim();
  p.dependencies = [...$('dependencyOptions').querySelectorAll('input:checked')].map(input => input.value);
  p.milestones = reconcileMilestones(old?.milestones || [], $('projectMilestones').value);
  if (!old || old.start !== p.start || old.end !== p.end) delete p.phases;
  if (old) next.projects[next.projects.findIndex(q => q.id === old.id)] = p; else next.projects.push(p);
  try { validate(next); selectedProjectId = p.id; commit(next); $('projectDialog').close(); setView('map'); requestAnimationFrame(() => $('projectNodes').querySelector(`[data-project-id="${p.id}"]`).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })); }
  catch (error) { $('formError').textContent = error.message; $('formError').scrollIntoView({ block: 'nearest' }); }
}
function deleteSelected() {
  const p = project(); if (!p) return;
  const affected = state.projects.filter(q => q.dependencies.includes(p.id));
  if (!confirm(`Delete “${p.title}”?${affected.length ? ` Its connections to ${affected.map(q => q.title).join(', ')} will also be removed.` : ''} You can undo this.`)) return;
  commit(removeProject(state, p.id), 'Project deleted.');
}
function exportPlan() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = `research-plan-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function importPlan(event) {
  const file = event.target.files[0]; if (!file) return;
  try {
    if (file.size > 5 * 1024 * 1024) throw new Error('Choose a plan smaller than 5 MB.');
    const next = validate(JSON.parse(await file.text()));
    if (!confirm(`Replace this browser's plan with ${next.projects.length} imported projects? Export first to keep a separate backup. You can undo this during this session.${storageBlocked ? ' This will replace unreadable saved data.' : ''}`)) return;
    storageBlocked = false; timelineYear = Number(next.projects.map(p => p.start).sort()[0]?.slice(0, 4)) || new Date().getFullYear(); $('calendarYear').value = timelineYear; commit(next, 'Plan imported.');
  } catch (error) { notice(`Import failed: ${error.message}`, true); }
  finally { event.target.value = ''; }
}
function initialize() {
  document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => setView(tab.dataset.view)));
  $('addProjectBtn').addEventListener('click', () => openEditor()); $('editProjectBtn').addEventListener('click', () => openEditor(selectedProjectId));
  $('deleteProjectBtn').addEventListener('click', deleteSelected); $('cancelEditorBtn').addEventListener('click', () => $('projectDialog').close()); $('projectForm').addEventListener('submit', saveProject);
  $('projectStatus').innerHTML = $('detailStatus').innerHTML;
  $('detailStatus').addEventListener('change', event => { const next = clone(state); next.projects.find(p => p.id === selectedProjectId).status = event.target.value; commit(next); });
  $('undoBtn').addEventListener('click', () => { if (!history.length) return; state = history.pop(); if (!project()) selectedProjectId = state.projects[0]?.id; render(); saveState(); });
  $('arrangeBtn').addEventListener('click', () => commit(arrange(state), 'Map arranged by dependencies.'));
  $('resetProgressBtn').addEventListener('click', () => { if (!confirm('Reset statuses and milestone checkboxes? Your projects, layout, dates, and dependencies will stay unchanged. You can undo this.')) return; const next = clone(state); next.projects.forEach(p => { p.status = STATUS_LABELS[p.defaultStatus] ? p.defaultStatus : 'parked'; p.milestones.forEach(m => { m.done = false; }); }); commit(next); });
  $('exportBtn').addEventListener('click', exportPlan); $('importBtn').addEventListener('click', () => $('importFile').click()); $('importFile').addEventListener('change', importPlan);
  const label = el('label', 'year-control', 'Calendar year '), select = el('select', ''); select.id = 'calendarYear'; select.setAttribute('aria-label', 'Calendar year');
  for (let year = 2000; year <= 2100; year++) { const option = el('option', '', year); option.value = year; select.append(option); }
  select.value = timelineYear; select.addEventListener('change', () => { timelineYear = Number(select.value); buildTimeline(); }); label.append(select); $('timelineView').insertBefore(label, $('timelineView').querySelector('.timeline-scroll'));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && drag) { event.preventDefault(); drag.cancel(); } });
  window.addEventListener('resize', () => requestAnimationFrame(drawConnections));
  render(); if (startupMessage) notice(startupMessage, true);
}
initialize();
