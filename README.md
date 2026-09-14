# Research Planner

A lightweight research-portfolio planner for organizing one main PhD project plus side projects that depend on, reuse, or piggyback on the main experimental pipeline.

## What the app shows

- **Dependency map**: the main dissertation project is the central spine. Side projects branch from the exact stage that makes them possible.
- **Project calendar**: a month-by-month sequencing view so every idea does not become a simultaneous wet-lab project.
- **Current focus**: a simplified view of the work that should be consuming attention now.
- **Persistent progress**: project statuses and milestone checkboxes are saved in browser `localStorage`.

## Current project model

Main dissertation spine:

1. NC-EV baseline
2. Process + potency
3. Hydrogel delivery
4. Extrusion + printing
5. Scaffold integration
6. Translation

Side branches:

- Storage + handling stability
- NC-EV process-quality dataset
- Skin dehiscence + scar repair
- Polytrauma + spatial delivery

## Run locally

No dependencies or build tools are required. Open `index.html` directly in a browser, or serve the directory with any static HTTP server.

For example, with Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy with GitHub Pages

Because the app is completely static, GitHub Pages can serve the repository directly. In the repository settings, enable Pages and publish from the `main` branch root.

## Editing the research plan

The scientific project definitions, dependencies, milestone checklists, and timeline ranges live in `app.js` near the top of the file. The UI shell is in `index.html`, and visual styling is in `styles.css`.

The initial dates are planning windows, not experimental promises. Change them as training, cell availability, instrument access, and data dictate.
