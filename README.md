# Research Planner

[Open the planner](https://thestinker.github.io/Research-Planner/)

A lightweight, editable research portfolio with a dependency map, calendar, and current-focus view. The original NC-EV dissertation and side projects remain the starting plan.

The starting plan also includes a separate **NIAMS predictive bone-model literature review**. It is limited to evidence review and model definition, with no dependency on the NC-EV work and no wet-lab experiments in its current scope.

## Edit your plan

- **Add project** creates a project with a title, type, status, descriptions, dates, and milestones.
- Select a card and choose **Edit project & dependencies**, or double-click its contents. Check or uncheck prerequisites to add or remove connections. Multiple prerequisites are supported; loops and self-dependencies are rejected.
- **Drag the Move handle** to reposition a card. The map scrolls near its edges. With the handle focused, use arrow keys for 20-pixel moves or Shift + arrow keys for 100-pixel moves. Escape cancels an ongoing drag.
- **Arrange map** lays out projects by dependency order. **Undo** reverses up to 40 edits in the current session, including moves, imports, deletions, and progress resets.
- **Delete project** also removes its dependency connections after confirmation.
- Edit start/end months and choose a year in **Project calendar**. Moving a card changes only its map position. Dates and statuses are manually controlled; dependencies do not automatically reschedule work or advance statuses.
- Enter milestones one per line. Reordering unchanged milestone text preserves its completion status. A renamed milestone starts unchecked.
- **Current focus** shows projects marked Active now, Next, or Ready soon.

## Saving and backups

The full plan saves automatically in this browser's `localStorage`, including projects, positions, dependencies, dates, and progress. Existing version 1 status/checklist progress is carried over automatically when no version 2 plan exists.

Edits do **not** sync to GitHub, another browser, or another device. Clearing browser data can erase them. Use **Export plan** to download a JSON backup; **Import plan** restores a backup after validation and confirmation. Import replaces the plan in that browser, and can be undone until the page reloads. Invalid imports leave the current plan unchanged.

**Reset saved progress** resets statuses and checkboxes, preserving projects, dates, layout, and dependencies. Undo history itself does not survive reloading. If browser storage fails, an on-screen message explains that changes need to be exported.

The editor supports up to 200 projects, 200 milestones per project, and dates from 2000 to 2100. Initial dates are planning windows, not experimental promises.

## Run locally

No build step or runtime dependencies are required. Serve this directory with any static HTTP server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. GitHub Pages serves the `main` branch root.

## Files and verification

- `defaults.js`: original scientific projects, timelines, and statuses.
- `planner-model.js`: plan validation, cycle detection, milestone reconciliation, deletion, and layout.
- `app.js`: editor, rendering, drag interactions, persistence, migration, and backup flows.
- `index.html` and `styles.css`: interface and responsive styles.

Run the data-integrity regression tests with Node.js:

```bash
node --test tests/planner-model.test.cjs
```
