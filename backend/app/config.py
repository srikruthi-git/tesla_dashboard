from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Config:
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    DB_PATH: Path = BASE_DIR / 'instance' / 'tesla_energy.db'
    JSON_SORT_KEYS: bool = False
