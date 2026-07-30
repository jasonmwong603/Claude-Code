# My Money

A simple, friendly, private budgeting app. Log what you earn and spend, watch a
donut chart show where your money goes, set monthly budgets per category, and
step through your finances month by month. **All data stays in your browser** —
there is no server, no account, and nothing leaves your device.

## Two apps

- **Monthly budget** (`budget.html`) — the classic month-to-month budgeting tool
  described below.
- **Steady** (`steady.html`) — a different tool for people who **earn daily and
  unevenly** (gig/day/tip work). Instead of money-in/money-out, it logs each
  day's gross, hours, and job costs to show **net and $/hour**, auto-splits
  every dollar into set-aside **jars** (taxes, rent, savings) so you see your
  real **take-home** and a **safe-to-spend-today** number, and turns volatile
  income into a steady paycheck with a **buffer + runway** ("days of pay
  banked"). Live at `…/steady/`.

## Open it online

**Live apps:**
- Monthly budget: **https://jasonmwong603.github.io/Claude-Code/budgeting/**
- Steady (daily earnings): **https://jasonmwong603.github.io/Claude-Code/steady/**
- Chooser: **https://jasonmwong603.github.io/Claude-Code/**

Open that on your phone, tablet, or any computer — no install needed. Every
push to the app auto-deploys there via GitHub Actions (see
`.github/workflows/deploy-pages.yml`). Your data is saved per-device in the
browser, so use Manage → Export/Import backup to move entries between devices.

## Or run it as a local file

Download [`budget.html`](budget.html) and **double-click it**. It opens in your
browser and runs as a single self-contained file — no Node, no npm, no build
step. (An internet connection is only used the first time you *import a bank
statement PDF*, to fetch the PDF reader, and to load nicer fonts; everything
else works fully offline.)

The app has two tabs:

### Overview
- **Month navigator** — step through any month with the arrows; every number,
  the activity list, and the donut chart recompute for the selected month.
- **At-a-glance summary** — "left to spend this month" (income − expenses) with
  a progress bar and a friendly status message.
- **Fast entry** — big "I got paid" / "I spent money" buttons open a sheet with
  ~50 emoji categories across income and expense groups.
- **Bank statement import** — drop in a PDF statement; it parses transactions,
  guesses categories, and lets you review before adding them to the month.
- **Activity list** — everything logged for the month, deletable inline.
- **Donut chart** — a "where it's going" breakdown of expenses by category with
  a percentage legend.

### Manage
- **Monthly budgets** — set a spending target for any expense category and track
  actual-vs-budget with a progress bar (green under, amber close, red over),
  scoped to the selected month.
- **Currency** — choose the symbol used throughout ($, £, €, ¥, ₹).
- **Backup & restore** — export all your data to a JSON file and import it later
  or on another device.
- **Reset** — clear everything and start fresh.

## Privacy

There is no backend. Everything you enter is stored locally in your browser
under the `my-money-state-v4` key (older data saved under the previous key is
migrated automatically). Clearing your browser data — or using **Reset all
data** — removes it. Use **Export backup** to keep a copy or move it between
devices.

---

## Also in this repo: a React version

An earlier React + TypeScript + Vite implementation of a budgeting app lives in
`src/`. `budget.html` above is the current, standalone app and does not depend
on it. To run the React version:

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```
