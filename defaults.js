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

const NIAMS_REVIEW_PROJECT = {
  id: "niams-literature-review",
  title: "NIAMS predictive bone-model literature review",
  short: "Define the minimum useful human bone-healing model",
  type: "independent",
  defaultStatus: "next",
  status: "next",
  summary: "Review human 3D bone and osteoinduction models to determine which biological and mechanical components are needed for a useful predictive model.",
  why: "The immediate goal is to learn what has already been modeled, how closely those systems resemble human healing, and whether any have actually predicted later tissue or mechanical outcomes.",
  gate: "Keep this as literature and model-definition work. Do not begin wet-lab experiments until the prediction target, minimum model, success criteria, and available resources are agreed with Botchwey and Hollister.",
  window: "Literature review and decision memo only; no wet-lab work",
  start: "2026-09",
  end: "2026-12",
  dependencies: [],
  position: { x: 28, y: 718 },
  milestones: [
    "Define the review question and inclusion criteria",
    "Search for human 3D bone-injury, callus, and osteoinduction models",
    "Extract cell sources, donor counts, materials, geometry, immune components, and mechanical conditions",
    "Record early and late biological, mineralization, and mechanical outcomes",
    "Separate tissue-production studies from studies that test predictive performance",
    "Compare models with relevant human tissue or clinical evidence where available",
    "Identify the minimum required components and the additions that remain optional",
    "Create an evidence table and focused bibliography",
    "Draft a short model recommendation and unresolved questions for Botchwey and Hollister"
  ]
};
