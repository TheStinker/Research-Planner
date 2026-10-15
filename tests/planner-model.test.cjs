const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const model = require('../planner-model.js');
const project = (id, dependencies = []) => ({ id, title: id, type: 'independent', status: 'parked', short: '', summary: '', why: '', gate: '', window: '', start: '2026-09', end: '2027-01', position: { x: 28, y: 28 }, dependencies, milestones: [] });
const plan = projects => ({ version: 2, projects });

test('accepts multiple prerequisites and rejects cycles, self-links, missing and duplicate links', () => {
  const valid = plan([project('a'), project('b'), project('c', ['a', 'b'])]);
  assert.equal(model.validate(valid), valid);
  for (const projects of [[project('a', ['a'])], [project('a', ['b']), project('b', ['a'])], [project('a', ['missing'])], [project('a'), project('b', ['a', 'a'])]]) assert.throws(() => model.validate(plan(projects)));
});
test('invalid imports cannot pass validation', () => {
  for (const value of [null, {version: 1}, plan([project('a'), project('a')]), plan([{...project('a'), end: '2026-08'}]), plan([{...project('a'), start: '2026-13'}]), plan([{...project('a'), position: { x: Infinity, y: 0 }}]), plan([{...project('a'), milestones: [{text:'x', done:'yes'}]}])]) assert.throws(() => model.validate(value));
});
test('reordering and adding milestones preserves only matching completion states', () => {
  assert.deepEqual(model.reconcileMilestones([{text:'A', done:true}, {text:'B', done:false}], 'B\nA\nNew\nA\n'), [{text:'B', done:false}, {text:'A', done:true}, {text:'New', done:false}, {text:'A', done:false}]);
});
test('deletion cleans up references without mutating the prior plan used by Undo', () => {
  const before = plan([project('a'), project('b', ['a']), project('c', ['a', 'b'])]);
  const after = model.removeProject(before, 'a');
  assert.deepEqual(after.projects.map(p => p.dependencies), [[], ['b']]);
  assert.equal(before.projects.length, 3); assert.deepEqual(before.projects[2].dependencies, ['a', 'b']);
  assert.deepEqual(model.removeProject(plan([project('a')]), 'a'), plan([]));
});
test('automatic layout supports all 200 projects without overlap or invalid positions', () => {
  for (const linked of [true, false]) {
    const before = plan(Array.from({ length: 200 }, (_, i) => project(`p${i}`, linked && i ? [`p${i-1}`] : [])));
    const after = model.validate(model.arrange(before));
    assert.equal(new Set(after.projects.map(p => JSON.stringify(p.position))).size, 200);
    assert.deepEqual(before.projects[0].position, {x:28,y:28});
  }
});
function loadApp(saved = {}) {
  const storage = new Map(Object.entries(saved));
  const context = vm.createContext({ PlannerModel: model, Date, localStorage: {getItem:key => storage.get(key) || null, setItem:(key,value) => storage.set(key,value)}});
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../defaults.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/initialize\(\);\s*$/, ''), context);
  return { context, storage, read: expression => JSON.parse(vm.runInContext(`JSON.stringify(${expression})`, context)) };
}
test('migrates existing status and checklist progress, preserving all scientific defaults', () => {
  const legacy = { status: { 'stage-1':'done' }, checks: { 'stage-1':[true,false,true] } };
  const app = loadApp({'researchPlanner.v1':JSON.stringify(legacy)});
  const state = app.read('state'); assert.equal(state.projects.length, 11);
  const first = state.projects.find(p => p.id === 'stage-1');
  assert.equal(first.status, 'done'); assert.equal(first.milestones[0].done, true); assert.equal(first.milestones[1].done, false);
  assert.deepEqual(state.projects.find(p => p.id === 'stage-2').dependencies, ['stage-1']);
  assert.deepEqual(JSON.parse(app.storage.get('researchPlanner.v1')), legacy);
  model.validate(state);
});
test('adds the NIAMS literature review once to an existing plan and respects later deletion', () => {
  const prior = plan([project('existing')]);
  const upgraded = loadApp({'researchPlanner.v2':JSON.stringify(prior)});
  const state = upgraded.read('state');
  assert.equal(state.projects.length, 2);
  const niams = state.projects.find(p => p.id === 'niams-literature-review');
  assert.equal(niams.status, 'next'); assert.deepEqual(niams.dependencies, []);
  assert.match(niams.gate, /Do not begin wet-lab experiments/);
  assert.equal(upgraded.storage.get('researchPlanner.addedNiamsLiteratureReview.v1'), '1');
  const afterDeletion = plan([project('existing')]);
  const reloaded = loadApp({'researchPlanner.v2':JSON.stringify(afterDeletion), 'researchPlanner.addedNiamsLiteratureReview.v1':'1'});
  assert.deepEqual(reloaded.read('state'), afterDeletion);
});
test('reload retains complete edited plan and protects unreadable saved data', () => {
  const edited = plan([project('new')]); edited.projects[0].position = {x:555,y:777};
  assert.deepEqual(loadApp({'researchPlanner.v2':JSON.stringify(edited), 'researchPlanner.addedNiamsLiteratureReview.v1':'1'}).read('state'), edited);
  const broken = loadApp({'researchPlanner.v2':'broken json'});
  assert.equal(broken.read('storageBlocked'), true);
  assert.equal(broken.storage.get('researchPlanner.v2'), 'broken json');
  assert.match(broken.read('startupMessage'), /not been overwritten/);
});


test('weekly undergraduate assignments validate, export as JSON, and survive reload', () => {
  const assigned = {
    id:'goal-jocelyn-1', owner:'Jocelyn', week:'2026-10-12', due:'2026-10-16',
    title:'Draft PEGDA hydrogel SOP', status:'in-progress', projectId:'stage-3',
    notes:'Literature-supported protocol', goals:[{text:'List reagents',done:true},{text:'Add QC steps',done:false}]
  };
  const app = loadApp();
  const initial = app.read('state');
  initial.assignments = [assigned];
  model.validate(initial);
  const reloaded = loadApp({
    'researchPlanner.v2':JSON.stringify(initial),
    'researchPlanner.addedNiamsLiteratureReview.v1':'1'
  });
  assert.deepEqual(reloaded.read('state').assignments, [assigned]);
  assert.deepEqual(JSON.parse(JSON.stringify(initial)).assignments, [assigned]);
});
test('weekly goal validation rejects malformed entries while preserving legacy imports', () => {
  const p = project('hydrogel');
  const task = {id:'goal-1', owner:'Ashley', week:'2026-10-12', due:'', title:'Plan scaffold fit study',
    status:'todo', projectId:'hydrogel', notes:'', goals:[{text:'Sketch fixture',done:false}]};
  assert.equal(model.validate(plan([p])).projects.length, 1);
  assert.equal(model.validate({...plan([p]),assignments:[task]}).assignments.length, 1);
  const broken = [
    {...task,owner:'Other'},
    {...task,week:'2026-10-13'},
    {...task,due:'2026-02-30'},
    {...task,status:'unknown'},
    {...task,projectId:'missing'},
    {...task,goals:[{text:'bad',done:'yes'}]}
  ];
  for (const invalid of broken) assert.throws(() => model.validate({...plan([p]),assignments:[invalid]}));
  assert.throws(() => model.validate({...plan([p]),assignments:[task,task]}));
});
test('deleting a research project retains weekly goals but clears their optional link', () => {
  const before = {...plan([project('a')]),assignments:[{
    id:'goal-1', owner:'Ashley', week:'2026-10-12', due:'',
    title:'Design loading plan', status:'todo',projectId:'a',notes:'',goals:[]
  }]};
  const after = model.removeProject(before,'a');
  assert.equal(after.assignments.length,1);
  assert.equal(after.assignments[0].projectId,'');
  assert.equal(before.assignments[0].projectId,'a');
});
