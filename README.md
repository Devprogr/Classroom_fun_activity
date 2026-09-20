# Class Points

A classroom points tracker for a single teacher running a touchscreen at the
front of the room. It replaces ClassDojo for one grade 4/5 class: award and
subtract points for behaviours, run a small rewards store, and keep a log the
teacher can export.

There is no backend, no accounts, and no server. Everything lives in your
browser's `localStorage`. That's a deliberate trade-off — see **Data lives in
one browser** below before you rely on this for anything you can't lose.

## What it does

- **Classroom screen** — a big grid of student cards for a projector or
  touchscreen. Tap a card (or select several with "Select multiple") to open
  a slide-up panel of behaviours and award points instantly.
- **Store** — redeem individual rewards (costs come out of one student's
  points) or class rewards (checked against the whole class's total, but
  doesn't subtract from anyone — see the note on the Store screen).
- **Reports** — every student's points this week / this month / all time,
  a filterable activity log, and CSV export.
- **Settings** (PIN-gated) — edit behaviours and rewards, manage the class
  roster, export/import a full JSON backup, and reset all points to zero.

## The PIN is not security

On first run you set a 4-digit PIN. It gates Settings and delete actions so a
student can't casually tap into them on the touchscreen. Awarding or removing
points never needs it, because that has to be instant during a lesson.

That PIN is stored in plain text in `localStorage`. It is **not** encryption,
it is **not** a login, and it will not stop anyone who opens the browser's
dev tools. It exists purely to stop an accidental or curious tap — nothing
more. This is stated again on the Settings page itself.

## Stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- No backend, no database, no API routes, no environment variables

## Local setup

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To check the production build locally:

```bash
npm run build
npm run preview
```

## Deploying to Vercel

This is a static site with a standard Vite build, so Vercel needs zero
configuration and zero environment variables.

1. **Push this project to GitHub.**

   ```bash
   git init
   git add .
   git commit -m "Class Points"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. **Import it on Vercel.**
   - Go to [vercel.com/new](https://vercel.com/new).
   - Choose "Import Git Repository" and pick the repo you just pushed.
   - Vercel auto-detects the Vite framework preset (build command
     `npm run build`, output directory `dist`). Leave everything as
     detected — there is nothing to change and nothing to add under
     Environment Variables.
   - Click **Deploy**.

3. Every future `git push` to `main` redeploys automatically.

## How backups work

Every change (awarding, redeeming, manual adjustments, resets) is written to
a log in `localStorage`, and every student's total is kept in sync with that
log. From **Settings → Backup**:

- **Export backup** downloads the entire app state — class, students,
  behaviours, rewards, and the full log — as one `.json` file.
- **Import backup** lets you pick a previously exported `.json` file. It asks
  for confirmation first and makes clear that it will **overwrite** whatever
  is currently in this browser.

Reports also has separate CSV exports (the activity log, and current totals)
for opening in a spreadsheet — these are one-way exports, not backups you can
re-import.

## Data lives in one browser, only

There is no server and no sync. Everything is saved in `localStorage` on the
one browser, on the one device, where you set it up. That means:

- Clearing site data/cookies for this site, using a different browser, or
  using a different computer all start you from zero.
- Nothing here is shared between devices automatically.

**Export a backup from Settings every week** (or after anything you'd be sad
to lose) and keep the `.json` file somewhere safe. That file is the only way
to move your data to a new browser or recover it if this one's storage gets
cleared.
