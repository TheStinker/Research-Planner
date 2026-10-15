/* Weekly mentor assignments live in the same version 2 plan as projects.
   Older saved plans have no assignments; they remain valid and are not overwritten until edited. */
const UndergradTasks = (() => {
  const PEOPLE = ['Ashley', 'Jocelyn'];
  const STATUS = { todo: 'Not started', 'in-progress': 'In progress', blocked: 'Blocked', done: 'Done' };
  let selectedWeek = monday(new Date());
  let editingId = null;

  function localDate(value) { return new Date(value + 'T12:00:00'); }
  function iso(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }
  function monday(value) {
    const d = typeof value === 'string' ? localDate(value) : new Date(value);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return iso(d);
  }
  function changeWeek(days) {
    const d = localDate(selectedWeek);
    d.setDate(d.getDate() + days);
    selectedWeek = iso(d);
    render();
  }
  function assignments() { return Array.isArray(state.assignments) ? state.assignments : []; }
  function newId() { return 'goal-' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2)); }
  function elem(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function action(text, onClick, className = 'btn') {
    const node = elem('button', className, text);
    node.type = 'button';
    node.addEventListener('click', onClick);
    return node;
  }
  function withUpdatedTask(id, mutate) {
    const next = clone(state);
    const task = next.assignments.find(a => a.id === id);
    if (!task) return;
    mutate(task);
    commit(next);
  }
  function labelDate(value) {
    return localDate(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  function taskCard(task) {
    const card = elem('article', 'weekly-task');
    const top = elem('div', 'weekly-task-top');
    top.append(elem('div', 'weekly-task-title', task.title), action('Edit', () => openEditor(task.id)));
    card.append(top);
    const meta = elem('div', 'weekly-task-meta');
    if (task.projectId) {
      const related = state.projects.find(p => p.id === task.projectId);
      if (related) meta.append(elem('span', 'weekly-tag', related.title));
    }
    if (task.due) {
      const dateTag = elem('span', 'weekly-tag', 'Due ' + labelDate(task.due));
      if (task.status !== 'done' && task.due < iso(new Date())) {
        dateTag.classList.add('weekly-late');
        dateTag.textContent += ' · Overdue';
      }
      meta.append(dateTag);
    }
    if (meta.childElementCount) card.append(meta);
    if (task.notes) card.append(elem('p', 'weekly-task-note', task.notes));
    const steps = elem('div', 'weekly-task-goals');
    task.goals.forEach((goal, index) => {
      const wrap = elem('label', 'check-item' + (goal.done ? ' is-complete' : ''));
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = goal.done;
      check.addEventListener('change', () => withUpdatedTask(task.id, t => { t.goals[index].done = check.checked; }));
      wrap.append(check, elem('span', '', goal.text));
      steps.append(wrap);
    });
    if (task.goals.length) {
      card.append(steps);
      card.append(elem('p', 'weekly-goal-progress', task.goals.filter(g => g.done).length + ' of ' + task.goals.length + ' small steps completed'));
    }
    const actions = elem('div', 'weekly-task-actions');
    const status = elem('select', 'weekly-status');
    status.setAttribute('aria-label', 'Status for ' + task.title);
    Object.entries(STATUS).forEach(([value, title]) => {
      const option = elem('option', '', title);
      option.value = value;
      status.append(option);
    });
    status.value = task.status;
    status.addEventListener('change', () => withUpdatedTask(task.id, t => { t.status = status.value; }));
    actions.append(status);
    card.append(actions);
    return card;
  }
  function render() {
    const title = document.getElementById('undergradWeekTitle');
    if (!title) return;
    const end = localDate(selectedWeek);
    end.setDate(end.getDate() + 6);
    title.textContent = labelDate(selectedWeek) + ' – ' + labelDate(iso(end)) + ', ' + end.getFullYear();
    const list = assignments().filter(a => a.week === selectedWeek);
    const stats = document.getElementById('undergradStats');
    stats.replaceChildren();
    for (const [number, title] of [
      [list.length, 'weekly goals'],
      [list.filter(t => t.status === 'done').length, 'completed'],
      [list.filter(t => t.status === 'blocked').length, 'blocked']
    ]) {
      const item = elem('div', 'weekly-stat');
      item.append(elem('strong', '', number), document.createTextNode(title));
      stats.append(item);
    }
    const columns = document.getElementById('undergradColumns');
    columns.replaceChildren();
    PEOPLE.forEach(person => {
      const tasks = list.filter(t => t.owner === person);
      const column = elem('section', 'undergrad-column');
      const heading = elem('div', 'undergrad-column-heading');
      heading.append(elem('h3', '', person + ' · ' + tasks.length + (tasks.length === 1 ? ' goal' : ' goals')),
        action('+ Add goal', () => openEditor(null, person)));
      column.append(heading);
      const mailActions = elem('div', 'undergrad-mail-actions');
      const draftButton = action('Review in Gmail', () => UndergradMail.compose(person, selectedWeek));
      const sendButton = action('Send directly', () => UndergradMail.send(person, selectedWeek), 'btn btn-primary');
      draftButton.disabled = !tasks.length;
      sendButton.disabled = !tasks.length || !UndergradMail.canSend(person);
      sendButton.title = UndergradMail.canSend(person) ? 'Authorize and send with Gmail' : 'Save the student email and your Google OAuth client ID to enable';
      mailActions.append(draftButton, sendButton);
      column.append(mailActions);
      if (!tasks.length) column.append(elem('p', 'weekly-empty', 'No goals assigned for this week. Add one small, concrete deliverable.'));
      else {
        const taskList = elem('div', 'weekly-task-list');
        tasks.forEach(task => taskList.append(taskCard(task)));
        column.append(taskList);
      }
      columns.append(column);
    });
    UndergradMail.render();
  }
  function openEditor(id = null, person = 'Ashley') {
    editingId = id;
    const task = assignments().find(a => a.id === id) || {
      title: '', owner: person, week: selectedWeek, due: '', status: 'todo', projectId: '', notes: '', goals: []
    };
    document.getElementById('weeklyGoalHeading').textContent = id ? 'Edit weekly goal' : 'Assign weekly goal';
    document.getElementById('weeklyGoalError').textContent = '';
    for (const [field, key] of [
      ['Title', 'title'], ['Owner', 'owner'], ['Week', 'week'],
      ['Due', 'due'], ['Status', 'status'], ['Notes', 'notes']
    ]) document.getElementById('weeklyGoal' + field).value = task[key];
    const projectSelect = document.getElementById('weeklyGoalProject');
    projectSelect.replaceChildren();
    const noProject = elem('option', '', 'No linked project');
    noProject.value = '';
    projectSelect.append(noProject);
    state.projects.forEach(p => {
      const option = elem('option', '', p.title);
      option.value = p.id;
      projectSelect.append(option);
    });
    projectSelect.value = task.projectId;
    document.getElementById('weeklyGoalSteps').value = task.goals.map(g => g.text).join('\n');
    document.getElementById('deleteWeeklyGoalBtn').hidden = !id;
    document.getElementById('weeklyGoalDialog').showModal();
    document.getElementById('weeklyGoalTitle').focus();
  }
  function save(event) {
    event.preventDefault();
    const id = editingId;
    const prior = assignments().find(t => t.id === id);
    const task = prior ? clone(prior) : { id: newId() };
    for (const [key, field] of [
      ['title', 'Title'], ['owner', 'Owner'], ['due', 'Due'],
      ['status', 'Status'], ['projectId', 'Project'], ['notes', 'Notes']
    ]) task[key] = document.getElementById('weeklyGoal' + field).value.trim();
    task.week = monday(document.getElementById('weeklyGoalWeek').value);
    task.goals = reconcileMilestones(prior ? prior.goals : [], document.getElementById('weeklyGoalSteps').value);
    const next = clone(state);
    if (!Array.isArray(next.assignments)) next.assignments = [];
    if (prior) next.assignments[next.assignments.findIndex(t => t.id === id)] = task;
    else next.assignments.push(task);
    try {
      validate(next);
      selectedWeek = task.week;
      commit(next);
      document.getElementById('weeklyGoalDialog').close();
      setView('undergrads');
    } catch (e) {
      document.getElementById('weeklyGoalError').textContent = e.message;
    }
  }
  function deleteGoal() {
    const existing = assignments().find(t => t.id === editingId);
    if (!existing || !confirm('Delete the weekly goal "' + existing.title + '"? You can undo this.')) return;
    const next = clone(state);
    next.assignments = next.assignments.filter(t => t.id !== editingId);
    commit(next);
    document.getElementById('weeklyGoalDialog').close();
  }
  function initialize() {
    document.getElementById('previousWeekBtn').addEventListener('click', () => changeWeek(-7));
    document.getElementById('nextWeekBtn').addEventListener('click', () => changeWeek(7));
    document.getElementById('currentWeekBtn').addEventListener('click', () => { selectedWeek = monday(new Date()); render(); });
    document.getElementById('addWeeklyGoalBtn').addEventListener('click', () => openEditor());
    document.getElementById('cancelWeeklyGoalBtn').addEventListener('click', () => document.getElementById('weeklyGoalDialog').close());
    document.getElementById('weeklyGoalForm').addEventListener('submit', save);
    document.getElementById('deleteWeeklyGoalBtn').addEventListener('click', deleteGoal);
  }
  return { render, initialize };
})();
