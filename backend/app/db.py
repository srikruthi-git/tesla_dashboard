import sqlite3
from pathlib import Path
from typing import Any

from flask import Flask, g


def get_db() -> sqlite3.Connection:
    if 'db' not in g:
        db_path = current_db_path()
        g.db = sqlite3.connect(db_path)
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(_: Exception | None = None) -> None:
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db(app: Flask) -> None:
    db_path = Path(app.config['DB_PATH'])
    needs_init = not db_path.exists()

    db_path.parent.mkdir(parents=True, exist_ok=True)

    if needs_init:
        connection = sqlite3.connect(db_path)
        try:
            run_schema(connection, app)
            seed_data(connection, app)
        finally:
            connection.close()

    app.teardown_appcontext(close_db)


def run_schema(connection: sqlite3.Connection, app: Flask) -> None:
    schema_path = Path(app.root_path) / 'schemas' / 'schema.sql'
    connection.executescript(schema_path.read_text(encoding='utf-8'))
    connection.commit()


def seed_data(connection: sqlite3.Connection, app: Flask) -> None:
    seed_path = Path(app.root_path) / 'schemas' / 'seed.sql'
    connection.executescript(seed_path.read_text(encoding='utf-8'))
    connection.commit()


def current_db_path() -> str:
    from flask import current_app

    return str(current_app.config['DB_PATH'])


def fetch_all(query: str, params: tuple[Any, ...] = ()) -> list[sqlite3.Row]:
    db = get_db()
    return db.execute(query, params).fetchall()


def fetch_one(query: str, params: tuple[Any, ...]) -> sqlite3.Row | None:
    db = get_db()
    return db.execute(query, params).fetchone()


def execute(query: str, params: tuple[Any, ...]) -> int:
    db = get_db()
    cursor = db.execute(query, params)
    db.commit()
    return cursor.lastrowid
