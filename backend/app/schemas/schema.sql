CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT NOT NULL,
    installation_type TEXT NOT NULL,
    status TEXT NOT NULL,
    assigned_engineer TEXT NOT NULL,
    scheduled_date TEXT NOT NULL
);
