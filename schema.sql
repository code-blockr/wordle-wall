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

INSERT OR IGNORE INTO week_wins (name, week_start) VALUES ('Sb', '2026-04-27');
