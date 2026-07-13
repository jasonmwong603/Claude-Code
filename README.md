# My Money

A simple, friendly, private budgeting app. Log what you earn and spend, watch a
donut chart show where your money goes, set monthly budgets per category, and
step through your finances month by month. **All data stays in your browser** —
there is no server, no account, and nothing leaves your device.

## Open it online

**Live app: https://jasonmwong603.github.io/Claude-Code/budgeting/**

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

## Also in this repo: Easy Invoice

A friendly, fill-in-the-blanks invoicing app for business owners. Download
[`invoice.html`](invoice.html) and **double-click it** — like the budgeting
app it's a single self-contained file with no Node, npm, or build step, and
**all data stays in your browser** (no server, no account).

- **My Business** — set your business name, contact details, address, default
  currency and tax rate once, and **upload your own logo**. It's saved locally
  and appears on every invoice.
- **Create** — fill in the invoice number, dates, who it's billed to, and line
  items (description, qty, price). Subtotal, discount (% or flat), and tax are
  calculated automatically, with a **live preview** of the finished invoice next
  to the form.
- **Print / PDF** — one click opens your browser's print dialog; choose "Save
  as PDF" to send a clean, logo-branded invoice to your client.
- **Saved** — save invoices to reopen, duplicate for the next client, or mark as
  draft / sent / paid / overdue. Export and import a JSON backup to move between
  devices.

Everything is stored locally under the `easy-invoice-invoices-v1` and
`easy-invoice-business-v1` keys — use **Saved → Export backup** to keep a copy.
(An internet connection is only used to load nicer fonts; everything else works
fully offline.)

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
