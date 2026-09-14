const PROJECTS = {
  "stage-1": {
    id: "stage-1",
    title: "NC-EV baseline",
    short: "Learn → produce → reproduce",
    type: "main",
    defaultStatus: "active",
    summary: "Establish a reproducible nitrogen-cavitation EV workflow before trying to optimize everything at once.",
    why: "This is the foundation for every downstream study. If production is not reproducible, storage, hydrogel, printing, and biological comparisons become difficult to interpret.",
    gate: "None. This is the current starting point.",
    window: "Sep–Oct 2026",
    parent: "Starting point",
    milestones: [
      "Complete NC training and capture the lab-specific SOP",
      "Produce the first NC-MSC batch",
      "Complete baseline particle characterization",
      "Repeat the baseline batch under the same conditions",
      "Define the minimum QC data recorded for every future batch"
    ]
  },
  "stage-2": {
    id: "stage-2",
    title: "Process + potency",
    short: "Characterize and optimize",
    type: "main",
    defaultStatus: "next",
    summary: "Connect processing conditions to NC-EV yield, particle properties, morphology, and biological potency.",
    why: "This is the process–structure–potency backbone of the dissertation and provides the evidence needed to choose production conditions intentionally.",
    gate: "At least two interpretable baseline batches with a repeatable workflow.",
    window: "Oct–Dec 2026",
    parent: "NC-EV baseline",
    milestones: [
      "Select the first controlled process variable",
      "Record input cell number, volumes, pressure, timing, recovery, and yield",
      "Compare size distribution and morphology across conditions",
      "Establish a baseline potency readout",
      "Choose the production condition that moves into hydrogel studies"
    ]
  },
  "stage-3": {
    id: "stage-3",
    title: "Hydrogel delivery",
    short: "Loading, retention, release",
    type: "main",
    defaultStatus: "waiting",
    summary: "Load optimized NC-EVs into a reproducible PEG or PEG-adjacent hydrogel and determine whether the material retains and releases functional vesicles.",
    why: "This converts NC-EV production into a controllable delivery platform rather than a free-vesicle study.",
    gate: "A selected NC-EV production condition with defined baseline QC and potency.",
    window: "Jan–Feb 2027",
    parent: "Process + potency",
    milestones: [
      "Select the first lab-established hydrogel formulation",
      "Quantify loading efficiency and recovery",
      "Run release kinetics",
      "Compare free versus hydrogel-released NC-EVs",
      "Confirm retained potency after encapsulation and release"
    ]
  },
  "stage-4": {
    id: "stage-4",
    title: "Extrusion + printing",
    short: "Does printing alter NC-EVs?",
    type: "main",
    defaultStatus: "waiting",
    summary: "Determine whether injection and extrusion-based printing alter NC-EV recovery, physical properties, release, or potency.",
    why: "This is the point where the work becomes specifically relevant to biofabrication rather than only EV-in-hydrogel delivery.",
    gate: "A hydrogel formulation that reproducibly carries and releases potent NC-EVs.",
    window: "Mar–Apr 2027",
    parent: "Hydrogel delivery",
    milestones: [
      "Define unextruded, injected, and printed comparison groups",
      "Record nozzle and process conditions",
      "Measure post-processing particle recovery and size",
      "Compare release profiles after processing",
      "Compare potency after extrusion and printing"
    ]
  },
  "stage-5": {
    id: "stage-5",
    title: "Scaffold integration",
    short: "Architecture + delivery",
    type: "main",
    defaultStatus: "waiting",
    summary: "Integrate the validated NC-EV hydrogel with architectural scaffolds and study how geometry and placement affect delivery.",
    why: "This merges the Botchwey-style biological delivery question with the Hollister-style scaffold architecture question.",
    gate: "Printing/extrusion conditions that preserve an acceptable NC-EV product and release profile.",
    window: "Apr–May 2027",
    parent: "Extrusion + printing",
    milestones: [
      "Choose a first scaffold architecture",
      "Define how hydrogel is retained or placed within the scaffold",
      "Confirm manufacturability and handling",
      "Measure spatial release or retention",
      "Select the first application-specific scaffold configuration"
    ]
  },
  "stage-6": {
    id: "stage-6",
    title: "Translation",
    short: "Application-specific studies",
    type: "main",
    defaultStatus: "parked",
    summary: "Use the established platform to answer clinically motivated application questions without simultaneously reinventing the delivery system.",
    why: "Application studies are much stronger once the manufacturing and delivery platform is already controlled.",
    gate: "A validated NC-EV + hydrogel + scaffold workflow with known processing effects.",
    window: "Jun 2027 onward",
    parent: "Scaffold integration",
    milestones: [
      "Select the first translational indication",
      "Define clinically meaningful endpoints",
      "Run an application-specific pilot",
      "Use pilot data to prioritize the next dissertation aim"
    ]
  },
  storage: {
    id: "storage",
    title: "Storage + handling stability",
    short: "Freeze-thaw, storage duration, aliquoting",
    type: "piggyback",
    defaultStatus: "ready",
    summary: "A low-overhead side project that uses standardized aliquots from NC-EV batches you were already producing.",
    why: "Storage stability directly matters for a hospital-ready workflow and can generate a useful translational dataset without requiring a second independent production pipeline.",
    gate: "At least one reproducible NC-EV batch and enough material to reserve standardized aliquots without compromising the main experiment.",
    window: "Oct 2026–Feb 2027",
    parent: "NC-EV baseline batches",
    milestones: [
      "Define aliquot size and storage conditions",
      "Measure fresh baseline",
      "Run controlled freeze-thaw comparisons",
      "Collect short-term storage endpoints",
      "Collect longer-term storage endpoints",
      "Compare recovery, size distribution, and potency"
    ]
  },
  process: {
    id: "process",
    title: "NC-EV process-quality dataset",
    short: "Every batch becomes structured data",
    type: "piggyback",
    defaultStatus: "active",
    summary: "A passive longitudinal dataset built from every NC-EV production batch rather than a separate experiment.",
    why: "Consistent metadata can later reveal process–quality relationships that would be impossible to reconstruct if parameters are not recorded from day one.",
    gate: "None beyond disciplined recording. Start with the first batch.",
    window: "Sep 2026 onward",
    parent: "Every NC-EV production batch",
    milestones: [
      "Create the master batch record",
      "Record cell input and source information",
      "Record cavitation and processing parameters",
      "Record yield, size, PDI, morphology, and recovery",
      "Link potency outputs to the same batch identifier",
      "Review the dataset monthly for trends or missing fields"
    ]
  },
  skin: {
    id: "skin",
    title: "Skin dehiscence + scar repair",
    short: "Application project",
    type: "application",
    defaultStatus: "waiting",
    summary: "A distinct clinical application project that should reuse, not reinvent, the NC-EV hydrogel/scaffold platform.",
    why: "Dehiscence and scar formation give you a clinically clear use case for combining a mechanically useful scaffold with regenerative signaling.",
    gate: "Hydrogel delivery must be sufficiently established to justify a separate application pilot. Literature review and requirements work can happen earlier.",
    window: "Design now; bench work Jan 2027 onward",
    parent: "Hydrogel delivery and later scaffold integration",
    milestones: [
      "Define the clinical problem and use scenario",
      "List mechanical and biological design requirements",
      "Select wound-healing and scar-related endpoints",
      "Sketch candidate scaffold attachment/placement concepts",
      "Choose a pilot configuration once the delivery platform is ready"
    ]
  },
  polytrauma: {
    id: "polytrauma",
    title: "Polytrauma + spatial delivery",
    short: "Gradients and region-specific therapy",
    type: "future",
    defaultStatus: "parked",
    summary: "A later application branch that asks whether architectural control can create spatially distinct therapeutic delivery within complex traumatic defects.",
    why: "It is potentially high-value, but it only becomes experimentally meaningful once printing and scaffold integration are under control.",
    gate: "Reliable extrusion/printing and scaffold integration with known NC-EV processing effects.",
    window: "Mar 2027 onward for design; pilot later",
    parent: "Extrusion/printing and scaffold integration",
    milestones: [
      "Define the spatial-delivery question",
      "Select a tractable injury model or surrogate geometry",
      "Choose a gradient or region-specific loading strategy",
      "Verify manufacturability",
      "Run a feasibility pilot only after the platform gate is met"
    ]
  }
};

const CONNECTIONS = [
  { from: "stage-1", to: "storage", color: "#2d9b73", direction: "up" },
  { from: "stage-2", to: "process", color: "#2d9b73", direction: "down" },
  { from: "stage-3", to: "skin", color: "#c47f2a", direction: "up" },
  { from: "stage-5", to: "polytrauma", color: "#9a6ac7", direction: "down" }
];

const TIMELINE_MONTHS = ["Sep '26", "Oct", "Nov", "Dec", "Jan '27", "Feb", "Mar", "Apr", "May", "Jun"];
const TIMELINE_ROWS = [
  { id: "stage-1", label: "Main: NC-EV baseline", note: "Core dissertation", start: 0, end: 1, cls: "main", text: "Baseline + reproducibility" },
  { id: "stage-2", label: "Main: Process + potency", note: "Core dissertation", start: 1, end: 3, cls: "main", text: "Optimization + potency" },
  { id: "stage-3", label: "Main: Hydrogel delivery", note: "Core dissertation", start: 4, end: 5, cls: "main", text: "Loading + release" },
  { id: "stage-4", label: "Main: Extrusion + printing", note: "Core dissertation", start: 6, end: 7, cls: "main", text: "Injection vs extrusion vs printing" },
  { id: "stage-5", label: "Main: Scaffold integration", note: "Core dissertation", start: 7, end: 8, cls: "main", text: "Architecture + delivery" },
  { id: "stage-6", label: "Main: Translation", note: "Core dissertation", start: 9, end: 9, cls: "main", text: "Applications begin" },
  { id: "storage", label: "Storage + handling", note: "Piggyback study", start: 1, end: 5, cls: "piggyback", text: "Fresh → freeze/thaw → storage endpoints" },
  { id: "process", label: "Process-quality dataset", note: "Piggyback dataset", start: 0, end: 9, cls: "piggyback", text: "Every batch contributes" },
  { id: "skin", label: "Skin dehiscence + scar", note: "Application", start: 0, end: 9, cls: "application", phases: [
      { start: 0, end: 3, text: "Literature + requirements" },
      { start: 4, end: 5, text: "Prototype planning" },
      { start: 6, end: 9, text: "Pilot when platform allows" }
    ]
  },
  { id: "polytrauma", label: "Polytrauma + spatial", note: "Future application", start: 2, end: 9, cls: "future", phases: [
      { start: 2, end: 5, text: "Literature + model definition" },
      { start: 6, end: 7, text: "Design" },
      { start: 8, end: 9, text: "Feasibility only if ready" }
    ]
  }
];

const STATUS_LABELS = {
  active: "Active now",
  next: "Next",
  ready: "Ready soon",
  waiting: "Waiting on dependency",
  parked: "Parked",
  done: "Done"
};

const STORAGE_KEY = "researchPlanner.v1";
let selectedProjectId = "stage-1";
let appState = loadState();

function defaultState() {
  const status = {};
  const checks = {};
  Object.values(PROJECTS).forEach((project) => {
    status[project.id] = project.defaultStatus;
    checks[project.id] = project.milestones.map(() => false);
  });
  return { status, checks };
}

function loadState() {
  const fallback = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    Object.keys(fallback.status).forEach((id) => {
      if (!parsed.status || !STATUS_LABELS[parsed.status[id]]) fallback.status = fallback.status || {};
      if (!parsed.status?.[id]) parsed.status[id] = fallback.status[id];
      if (!Array.isArray(parsed.checks?.[id])) {
        parsed.checks = parsed.checks || {};
        parsed.checks[id] = fallback.checks[id];
      }
      parsed.checks[id] = PROJECTS[id].milestones.map((_, index) => Boolean(parsed.checks[id][index]));
    });
    return parsed;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function setView(viewName) {
  document.querySelectorAll(".tab").forEach((tab) => {
    const active = tab.dataset.view === viewName;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.viewPanel === viewName);
  });
  if (viewName === "map") requestAnimationFrame(drawConnections);
}

function statusClass(status) {
  return `status-${status}`;
}

function refreshStatusChips() {
  document.querySelectorAll("[data-status-for]").forEach((chip) => {
    const id = chip.dataset.statusFor;
    const status = appState.status[id] || PROJECTS[id].defaultStatus;
    chip.className = `status-chip ${statusClass(status)}`;
    chip.textContent = STATUS_LABELS[status];
  });
}

function selectProject(id) {
  const project = PROJECTS[id];
  if (!project) return;
  selectedProjectId = id;

  document.querySelectorAll("[data-project-id]").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.projectId === id);
  });

  document.getElementById("detailTitle").textContent = project.title;
  document.getElementById("detailSummary").textContent = project.summary;
  document.getElementById("detailWhy").textContent = project.why;
  document.getElementById("detailGate").textContent = project.gate;
  document.getElementById("detailWindow").textContent = project.window;
  document.getElementById("detailParent").textContent = project.parent;
  document.getElementById("detailStatus").value = appState.status[id];
  renderChecklist("detailChecklist", id, true);
  highlightConnection(id);
}

function renderChecklist(containerId, projectId, interactive) {
  const container = document.getElementById(containerId);
  if (!container || !PROJECTS[projectId]) return;
  container.innerHTML = "";
  PROJECTS[projectId].milestones.forEach((item, index) => {
    const label = document.createElement("label");
    label.className = `check-item${appState.checks[projectId][index] ? " is-complete" : ""}`;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = appState.checks[projectId][index];
    input.disabled = !interactive;
    input.addEventListener("change", () => {
      appState.checks[projectId][index] = input.checked;
      saveState();
      renderChecklist(containerId, projectId, interactive);
      renderFocusChecklists();
    });

    const text = document.createElement("span");
    text.textContent = item;
    label.append(input, text);
    container.appendChild(label);
  });
}

function renderFocusChecklists() {
  renderChecklist("mainFocusMilestones", "stage-1", true);
  renderChecklist("sideFocusMilestones", "storage", true);
  renderChecklist("dataFocusMilestones", "process", true);
}

function buildTimeline() {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";
  timeline.appendChild(makeCell("timeline-cell timeline-head", "Project"));
  TIMELINE_MONTHS.forEach((month) => timeline.appendChild(makeCell("timeline-cell timeline-head", month)));

  TIMELINE_ROWS.forEach((row) => {
    const label = document.createElement("button");
    label.type = "button";
    label.className = "timeline-cell timeline-row-label";
    label.innerHTML = `<span>${row.label}</span><small>${row.note}</small>`;
    label.addEventListener("click", () => {
      setView("map");
      selectProject(row.id);
      document.getElementById("detailPanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    timeline.appendChild(label);

    if (row.phases) {
      TIMELINE_MONTHS.forEach((_, monthIndex) => {
        const phase = row.phases.find((p) => monthIndex >= p.start && monthIndex <= p.end);
        const cell = makeCell(`timeline-bar ${phase ? row.cls : "timeline-empty"}`, "");
        if (phase && monthIndex === phase.start) cell.textContent = phase.text;
        timeline.appendChild(cell);
      });
    } else {
      TIMELINE_MONTHS.forEach((_, monthIndex) => {
        const active = monthIndex >= row.start && monthIndex <= row.end;
        const cell = makeCell(`timeline-bar ${active ? row.cls : "timeline-empty"}`, "");
        if (active && monthIndex === row.start) cell.textContent = row.text;
        timeline.appendChild(cell);
      });
    }
  });
}

function makeCell(className, text) {
  const div = document.createElement("div");
  div.className = className;
  div.textContent = text;
  return div;
}

function drawConnections() {
  const canvas = document.getElementById("dependencyCanvas");
  const svg = document.getElementById("connectorLayer");
  if (!canvas || !svg || !canvas.offsetParent) return;

  const canvasRect = canvas.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${canvasRect.width} ${canvasRect.height}`);
  svg.innerHTML = `
    <defs>
      ${CONNECTIONS.map((c, i) => `<marker id="arrow-${i}" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${c.color}"></path></marker>`).join("")}
    </defs>`;

  CONNECTIONS.forEach((connection, index) => {
    const from = document.querySelector(`[data-stage-id="${connection.from}"]`);
    const to = document.querySelector(`[data-project-id="${connection.to}"]`);
    if (!from || !to) return;
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();

    const x1 = a.left + a.width / 2 - canvasRect.left;
    const y1 = connection.direction === "up" ? a.top - canvasRect.top : a.bottom - canvasRect.top;
    const x2 = b.left + b.width / 2 - canvasRect.left;
    const y2 = connection.direction === "up" ? b.bottom - canvasRect.top : b.top - canvasRect.top;
    const bend = Math.max(42, Math.abs(y2 - y1) * 0.52);
    const c1y = connection.direction === "up" ? y1 - bend : y1 + bend;
    const c2y = connection.direction === "up" ? y2 + bend * 0.35 : y2 - bend * 0.35;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${x1} ${y1} C ${x1} ${c1y}, ${x2} ${c2y}, ${x2} ${y2}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", connection.color);
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("marker-end", `url(#arrow-${index})`);
    path.dataset.connectionTo = connection.to;
    path.style.opacity = "0.84";
    svg.appendChild(path);
  });
  highlightConnection(selectedProjectId);
}

function highlightConnection(projectId) {
  document.querySelectorAll("#connectorLayer path[data-connection-to]").forEach((path) => {
    const isRelated = path.dataset.connectionTo === projectId || CONNECTIONS.some((c) => c.to === path.dataset.connectionTo && c.from === projectId);
    path.style.opacity = isRelated ? "1" : "0.42";
    path.style.strokeWidth = isRelated ? "3.4" : "2.5";
  });
}

function resetProgress() {
  const okay = window.confirm("Reset all saved statuses and milestone checkboxes to the original planner defaults?");
  if (!okay) return;
  appState = defaultState();
  saveState();
  refreshStatusChips();
  renderFocusChecklists();
  selectProject("stage-1");
}

function initialize() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setView(tab.dataset.view));
  });

  document.querySelectorAll("[data-project-id]").forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.addEventListener("click", () => selectProject(card.dataset.projectId));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectProject(card.dataset.projectId);
      }
    });
  });

  document.getElementById("detailStatus").addEventListener("change", (event) => {
    appState.status[selectedProjectId] = event.target.value;
    saveState();
    refreshStatusChips();
  });

  document.getElementById("resetProgressBtn").addEventListener("click", resetProgress);

  window.addEventListener("resize", () => requestAnimationFrame(drawConnections));
  document.getElementById("mapScroll").addEventListener("scroll", () => requestAnimationFrame(drawConnections), { passive: true });

  buildTimeline();
  refreshStatusChips();
  renderFocusChecklists();
  selectProject("stage-1");
  requestAnimationFrame(drawConnections);
}

initialize();
