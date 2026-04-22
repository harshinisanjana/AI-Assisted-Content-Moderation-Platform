import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from backend.app.main import app

OPENAPI_PATH = ROOT / "openapi.json"

OPENAPI_PATH.write_text(json.dumps(app.openapi(), indent=2), encoding="utf-8")

print(f"OpenAPI schema dumped to {OPENAPI_PATH.name}")