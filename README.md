# Research Planner

[Open the planner](https://thestinker.github.io/Research-Planner/)

A lightweight, editable research portfolio with a dependency map, calendar, current-focus view, and **Undergrad weekly goals** for Ashley and Jocelyn. The original NC-EV dissertation and side projects remain the starting plan.

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

## Weekly goals for Ashley and Jocelyn

Choose **Undergrad weekly goals** to view two side-by-side researcher columns, with previous/next-week navigation and weekly counts. Select **+ Assign a goal** or **+ Add goal** for either researcher. Each assignment supports a title, week, optional due date, status (Not started, In progress, Blocked, Done), linked research project, notes/expected deliverable, and checkable smaller steps. You can edit or delete goals later, and retain the history of earlier weeks. Renaming steps resets only the renamed step's completion status.

Assignments are stored **inside the existing research-plan JSON**, so Undo, Export plan, and Import plan include them. Previously saved research plans without an `assignments` field are fully compatible. Deleted projects clear only the optional project links on assignments. Browser-local storage does not sync with Ashley or Jocelyn: changes made on their devices are not visible on yours unless you explicitly exchange exported plans. Avoid treating these assignments as a shared portal.

The goal tracker is intentionally empty until you assign work; it does not assume an undergraduate has accepted any particular task.


## Email Ashley and Jocelyn their weekly goals

In **Undergrad weekly goals**, enter the students' email addresses and save them. You can click **Review in Gmail** next to either student to open a prefilled Gmail compose page for that person's goals in the selected week. Check your sending account, recipient and content before clicking Gmail's Send button. This is the immediately usable route, and it does not automatically send until you click Send in Gmail.

Optional **Send directly**: In Google Cloud Console, enable the Gmail API, configure the Google Auth Platform consent screen, and create an OAuth 2.0 Web application client whose authorized JavaScript origin is https://thestinker.github.io. Add your Gmail account as an authorized test user if the consent screen is in testing. Paste the Web client ID (not a client secret) under Optional: send directly using your Google account. Then choose **Send directly** for a student, confirm their email address and the number of goals, and authorize the intended Google account when Google prompts you. The site sends through Gmail API using the minimal gmail.send permission. Direct sends show success only after Gmail returns a message ID. Google may restrict sending from unverified applications.

The site does not store access tokens or Gmail passwords. The client ID is stored in browser localStorage separate from exported plans. Recipients and assignments are stored as part of the browser-local plan and included in JSON exports, so treat the backups as personal data. No email is sent when you edit goals or save an address. Every send is initiated manually for one person and one week. Gmail compose links may not accommodate unusually long notes.
