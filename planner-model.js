/* Shared state rules, also used by the local regression tests. */
(function (root) {
  const TYPES = ['main', 'piggyback', 'application', 'future', 'independent'];
  const STATUSES = ['active', 'next', 'ready', 'waiting', 'parked', 'done'];
  const clone = value => JSON.parse(JSON.stringify(value));
  function validate(state) {
    if (!state || state.version !== 2 || !Array.isArray(state.projects) || state.projects.length > 200) throw new Error('Choose a Research Planner version 2 export (up to 200 projects).');
    const ids = new Set();
    const month = value => typeof value === 'string' && /^(20\d{2}|2100)-(0[1-9]|1[0-2])$/.test(value);
    for (const p of state.projects) {
      if (!p || typeof p.id !== 'string' || !/^[\w-]{1,100}$/.test(p.id) || ids.has(p.id)) throw new Error('Project IDs must be unique.');
      ids.add(p.id);
      if (typeof p.title !== 'string' || !p.title.trim() || p.title.length > 160) throw new Error('Each project needs a title of 1-160 characters.');
      for (const key of ['short', 'summary', 'why', 'gate', 'window']) if (typeof p[key] !== 'string' || p[key].length > 10000) throw new Error('Project descriptions must be text (up to 10,000 characters).');
      if (!TYPES.includes(p.type) || !STATUSES.includes(p.status)) throw new Error('Invalid project type or status.');
      if (!month(p.start) || !month(p.end) || p.start > p.end) throw new Error('The end month must be on or after the start month, between 2000 and 2100.');
      if (!p.position || ![p.position.x, p.position.y].every(n => Number.isFinite(n) && n >= 0 && n <= 100000)) throw new Error('Invalid card position.');
      if (!Array.isArray(p.dependencies) || p.dependencies.length > 200 || new Set(p.dependencies).size !== p.dependencies.length) throw new Error('Invalid dependencies.');
      if (!Array.isArray(p.milestones) || p.milestones.length > 200 || p.milestones.some(m => !m || typeof m.text !== 'string' || !m.text.trim() || m.text.length > 1000 || typeof m.done !== 'boolean')) throw new Error('Milestones need text (up to 1,000 characters per line, 200 lines).');
      if (p.phases && (!Array.isArray(p.phases) || p.phases.some(f => !f || !month(f.start) || !month(f.end) || f.end < f.start || f.start < p.start || f.end > p.end || typeof f.text !== 'string'))) throw new Error('Invalid timeline phases.');
    }
    const byId = new Map(state.projects.map(p => [p.id, p]));
    const visiting = new Set(), visited = new Set();
    function visit(id) {
      if (visiting.has(id)) throw new Error('That creates a circular dependency. A project cannot depend on itself or on work that already depends on it.');
      if (visited.has(id)) return;
      visiting.add(id);
      for (const dep of byId.get(id).dependencies) {
        if (!ids.has(dep)) throw new Error('A dependency points to a missing project.');
        visit(dep);
      }
      visiting.delete(id); visited.add(id);
    }
    state.projects.forEach(p => visit(p.id));
    return state;
  }
  function reconcileMilestones(previous, lines) {
    const available = previous.map(m => ({ ...m }));
    return lines.split('\n').map(s => s.trim()).filter(Boolean).map(text => {
      const index = available.findIndex(m => m.text === text);
      return index < 0 ? { text, done: false } : available.splice(index, 1)[0];
    });
  }
  function removeProject(state, id) {
    const next = clone(state);
    next.projects = next.projects.filter(p => p.id !== id).map(p => ({ ...p, dependencies: p.dependencies.filter(dep => dep !== id) }));
    return validate(next);
  }
  function arrange(state) {
    const next = clone(state), levels = new Map(), byId = new Map(next.projects.map(p => [p.id, p]));
    function level(id) {
      if (!levels.has(id)) levels.set(id, Math.max(-1, ...byId.get(id).dependencies.map(level)) + 1);
      return levels.get(id);
    }
    const rows = new Map();
    next.projects.forEach(p => { const col = level(p.id), row = rows.get(col) || 0; p.position = { x: 28 + col * 290, y: 28 + row * 230 }; rows.set(col, row + 1); });
    return next;
  }
  const api = { clone, validate, reconcileMilestones, removeProject, arrange };
  root.PlannerModel = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
