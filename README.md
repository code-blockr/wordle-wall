# Digital Wordle Wall

A lightweight internal tool for current and former OBEB people to continue logging and comparing our daily Wordle scores. Pretty simple little mini project I got an idea for when Graham tried to share his wordle scores with us in a teams chat and I thought that there's gotta be a better way to do this. 

This was good practice with using Cloudflare for me since I haven't really properly built a website from zero-prod in a long time. Built on Cloudflare's free tier: `Pages` for the frontend, `Workers` for the API, and `D1` as the database. No frameworks, the only dependency is `Chart.js`, and I ripped the Ontario Design System using Claude Design (absolutely insane tool by the way). Javascript is great and the haters need to chill.

---

## Stack

| Layer | Tech |
|---|---|
| Hosting | Cloudflare Pages |
| API | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| Styling | Ontario Design System through CDN |
| Charts | `Chart.js` through CDN |

---

## Features

### Welcome screen (`welcome.html`)
First time you open it, you get a name entry screen. If there are already users in the DB (which now there are), it shows a dropdown of existing names, pick yours and go. If it's your first time to the site, you can hit "I'm new" and type your name in. Name gets title-cased on save, so it'll match your history no matter what device you're on if you come back, don't use the dropdown and for some reason try to enter your name again and are lazy or inconsistent. That last part might have been some overcorrection on my part.

There's also basic HTML santization now; converting `<>`, `&` and `''` into their harmless counterparts before submitting. 

Also added a general password for people as a bit of a speedbump for anyone who might stumble upon the site. It's client-side though, so anyone who knows how to inspect a site will be able to find it pretty quickly. 


### Score submission (`index.html`)
Six buttons: `1` through `6` and `FAILURE`. Color-coded (bad scores are red). One score per person per day, restricted at the DB level. You can reset your score for the day if you fat-fingered it or whatever.

There's also a "Paste Wordle Share Card" button that opens a modal where you can paste in the share text straight from the NYT app. It parses the score automatically, validates that the Wordle number matches the selected date (using the June 20, 2021 epoch), and submits with one click. Escape can close, and Enter to submit once a valid result is detected.

You can also click any day in the current week's grid to enter or update a score for that day retroactively — useful if you forgot to log Tuesday's score. The score card title updates to reflect whichever day you've got selected.

Score entry is blocked on Saturdays and Sundays - the buttons are disabled in the UI and the API will reject submissions outright (thanks simon for finding this and being honest about it lol).

If you haven't logged a score yet for the day, there's a direct link to the NYT Wordle below the buttons so you don't have to go hunting for it.

### Current week grid
Shows the Mon–Fri grid for the current week, one row per team member who has any score this week. Empty cells for days not yet submitted. Clicking a column header or your own cell selects that day for score entry.

### Weekly Leaderboard
Always visible below the week grid. Ranked by current week average score. FAILURE counts as 7 for the math. Updates whenever scores are refreshed.

### View Stats
An accordion below the leaderboard. Has:
- Bar chart: all-time average score per person
- Line chart: score trend over time, daily or weekly toggle
- All-Time Leaderboard: records all-time averages, games played, and weekly wins
- Historical Data: all previous Mon–Fri grids, read-only, nested inside the accordion

---

## Project Structure

```
/
├── public/
│   ├── welcome.html       # Name entry / user selection
│   └── index.html         # Main app
├── functions/
│   └── api/
│       ├── score.js       # POST/DELETE /api/score
│       ├── users.js       # GET /api/users
│       ├── week-win.js    # POST /api/week-win
│       ├── week-wins.js   # GET /api/week-wins
│       └── scores/
│           ├── all.js     # GET /api/scores/all
│           └── week.js    # GET /api/scores/week
├── schema.sql             # D1 database schema
└── wrangler.toml          # Cloudflare config
```

---

## API Routes

All handled by the `functions/api/` directory. Names are normalized to title case on every write.

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/users` | All unique names ever recorded |
| `POST` | `/api/score` | Submit or overwrite a score (today by default, or a specific date). Blocked on weekends. |
| `DELETE` | `/api/score` | Delete a score (today by default, or a specific date) |
| `GET` | `/api/scores/week` | All scores for the current Mon–Fri week |
| `GET` | `/api/scores/all` | All scores, all time |
| `GET` | `/api/week-wins` | Win count per player, all time |
| `POST` | `/api/week-win` | Record a winner for a given week (idempotent) |

**POST `/api/score` body:**
```json
{
  "name": "Mance",
  "score": "3",
  "date": "2026-04-28"
}
```
Valid scores: `"1"`, `"2"`, `"3"`, `"4"`, `"5"`, `"6"`, `"FAILURE"`. `date` is optional — defaults to today. Must be within the current Mon–today range if provided.

---

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS scores (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT    NOT NULL,
  score TEXT    NOT NULL,
  date  TEXT    NOT NULL,
  UNIQUE(name, date)
);

CREATE TABLE IF NOT EXISTS week_wins (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  week_start TEXT NOT NULL,
  UNIQUE(name, week_start)
);
```

The `UNIQUE(name, date)` constraint is what enforces one score per person per day — the Worker uses `INSERT OR REPLACE` so a same-day resubmit just overwrites cleanly. `week_wins` uses `UNIQUE(name, week_start)` so wins are idempotent; recording the same winner twice for the same week won't happen.

---

## Deployment

This runs on Cloudflare Pages + Workers + D1. You'll need a Cloudflare account and `wrangler` set up.

**1. Create the D1 database**
```bash
wrangler d1 create ops-wordle-db
```
Drop the database ID it gives you into `wrangler.toml`.

**2. Run the schema**
```bash
wrangler d1 execute ops-wordle-db --file=schema.sql
```

**3. Deploy**
```bash
wrangler pages deploy public
```

**3. Update**
```bash
wrangler pages deploy public --project-name "whatever-your-project-name"
```

The Worker deploys automatically as part of the Pages project via the `functions/` directory.

---

## Notes

- No auth. It's an internal team thing, everyone knows who submitted what. If someone logs a 1 and they definitely got a 4, that's on them. Might put a simple password for all users using this if we want to restrict this.
- Week boundaries are Mon–Fri. Weekends are for spending time with your family and training for the days ahead.
- The `welcome.html` redirect logic runs on page load via `localStorage` — if your name's saved, you skip straight to the main view.

---

## #TODO
