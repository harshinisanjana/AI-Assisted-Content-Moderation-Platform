# AI-Assisted Content Moderation & Publishing Platform

A full-stack content publishing platform where users create short blog posts, submit them for AI moderation review, and publish approved content. Features real-time WebSocket updates, multi-page routing, and advanced analytics.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, SQLAlchemy, Alembic, SQLite |
| Frontend | React (Vite, React Router), Axios, Chart.js, TailwindCSS |
| Real-time | WebSockets |
| Tests | pytest, FastAPI TestClient |
| CI/Automation | GitHub Actions, OpenAPI Generator CLI (Python SDK) |

## Project Structure

```
.
├── app/
│   ├── __init__.py
│   ├── crud.py              # Database queries & transactions
│   ├── database.py          # SQLAlchemy engine & session maker
│   ├── moderation.py        # Configurable AI moderation rules
│   ├── models.py            # SQLite ORM definitions
│   ├── schemas.py           # Pydantic payloads
│   ├── websocket_manager.py # Real-time event broker
│   └── routers/
│       ├── posts.py         # Posts API endpoints
│       └── stats.py         # Analytics endpoints
├── alembic/                 # Database migrations (timestamps & schema)
├── frontend/
│   └── src/
│       ├── api.js           # Fetch/Axios integrations
│       ├── App.jsx          # React state & Router logic
│       ├── hooks/
│       │   └── useWebSocket.js
│       └── components/      # UI pieces (Dashboard, Forms, Feed)
├── tests/
│   └── test_posts_api.py    # Pytest endpoints logic
├── moderation_sdk/          # Auto-generated API Client
├── .github/workflows/       # CI pipelines
├── main.py                  # FastAPI Application wrapper
├── dump_openapi.py          # Utility script for syncing schema outputs
└── requirements.txt         # Backend Python packages
```

## Setup

1. **Initialize the workspace:**
   ```bat
   setupdev.bat
   ```
   *Creates a virtual environment, installs Python dependencies, runs Alembic migrations, and installs npm packages.*

2. **Run the Application:**
   ```bat
   runapplication.bat
   ```
   *Boots the FastAPI backend (`http://localhost:8000`) and the Vite React frontend (`http://localhost:5173`).*

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/posts/` | Create a new draft post |
| `POST` | `/posts/{id}/submit/` | Submit a draft (or flagged post) for AI moderation review |
| `GET` | `/posts/` | List posts. Supports `skip`, `limit`, and `status_filter` |
| `GET` | `/posts/{id}` | Get a specific post |
| `PATCH`| `/posts/{id}/publish/` | Publish an approved post |
| `GET` | `/posts/stats` | Analytics data metrics |
| `WS` | `/ws` | Real-time event stream for platform statuses |
| `GET` | `/health` | Health check |

## Moderation Rules (Configurable)

Moderation limits are completely driven by Environment Variables (with fallback defaults).

| Environment Variable | Default Value | Description |
|----------------------|---------------|-------------|
| `MIN_CONTENT_LENGTH` | `50` | Minimum post length |
| `MAX_CONTENT_LENGTH` | `2000` | Maximum post length |
| `BANNED_WORDS` | `damn, dumb, idiot, moron, stupid, shit` | Triggers a flagged state |
| `AGGRESSIVE_KEYWORDS`| `hate, kill, destroy, loser, pathetic` | Triggers aggressive tone flag |

*Note: ALL-CAPS text and excessive punctuation (`!!!`) also autonomously trigger tone moderation.*

## Testing & CI

**Local Testing:**
```powershell
env\Scripts\activate
python -m pytest tests/
```

**Continuous Integration:**
The `.github/workflows/ci.yml` matrix automatically tests Python packages, executes `pytest`, bundles the React frontend, and ensures the repo's `openapi.json` has not suffered any uncommitted schema drift.

## SDK Generation

The `openapi.json` is exported via `dump_openapi.py` so the backend does not actively need to be running to mutate its shape. To generate the Python SDK:

```bat
generate_sdk.bat
```

**Usage:**
```python
from moderation_sdk.api.posts_api import PostsApi
from moderation_sdk import ApiClient

client = ApiClient()
api = PostsApi(client)
```