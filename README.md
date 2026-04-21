# AI-Assisted Content Moderation & Publishing Platform

A full-stack content publishing platform where users create short blog posts that are automatically reviewed by an AI moderation service before publishing.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, SQLAlchemy, Alembic, SQLite |
| Frontend | React (Vite), Axios, Chart.js, TailwindCSS (CDN) |
| Real-time | WebSockets |
| Tests | pytest, FastAPI TestClient |
| SDK | OpenAPI Generator CLI (Python) |

## Project Structure

```
.
├── app/
│   ├── __init__.py
│   ├── crud.py              # Database operations
│   ├── database.py          # SQLAlchemy engine + session
│   ├── moderation.py        # AI moderation rules
│   ├── models.py            # SQLAlchemy ORM model
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── websocket_manager.py # WebSocket connection manager
│   └── routers/
│       ├── __init__.py
│       ├── posts.py         # CRUD + review + publish endpoints
│       └── stats.py         # Analytics endpoint
├── alembic/                 # Database migrations
├── frontend/
│   └── src/
│       ├── api.js           # Axios API client
│       ├── App.jsx          # Main layout + state management
│       ├── App.css          # Animations (toast, fade)
│       ├── index.css        # Scrollbar styling
│       ├── main.jsx         # React entry point
│       ├── hooks/
│       │   └── useWebSocket.js
│       └── components/
│           ├── Dashboard.jsx    # Metric cards + 3 charts
│           ├── PostForm.jsx     # Draft creation form
│           ├── PostList.jsx     # Posts list with filters
│           ├── PostDetail.jsx   # Post detail + moderation feedback
│           └── PublishedFeed.jsx # Read-only published feed
├── tests/
│   ├── conftest.py          # Test fixtures
│   └── test_posts_api.py    # 8 unit tests
├── main.py                  # FastAPI app entry point
├── requirements.txt
├── seed_data.sql
├── setupdev.bat
├── runapplication.bat
└── generate_sdk.bat
```

## Setup

```bat
setupdev.bat
```

Creates virtual environment, installs dependencies, runs Alembic migration, installs frontend packages.

## Run

```bat
runapplication.bat
```

Opens two terminal windows:
- **Backend**: http://localhost:8000 (Swagger UI: http://localhost:8000/docs)
- **Frontend**: http://localhost:5173

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/posts/` | Create a new draft post |
| `POST` | `/posts/{id}/submit/` | Submit for AI moderation review |
| `GET` | `/posts/` | List posts (optional `?status=` filter) |
| `GET` | `/posts/{id}` | Get a specific post |
| `PATCH` | `/posts/{id}/publish/` | Publish an approved post |
| `GET` | `/posts/stats` | Analytics data for dashboard |
| `WS` | `/ws` | Real-time event stream |
| `GET` | `/health` | Health check |

## Post Lifecycle

```
draft → submit → approved → publish → published
                → flagged (resubmit allowed)
```

## Moderation Rules

| Rule | Detail |
|------|--------|
| Banned words | `damn`, `dumb`, `idiot`, `moron`, `stupid`, `shit` |
| Content length | 50–2000 characters |
| ALL-CAPS | Flagged as aggressive tone |
| Excessive punctuation | `!!!` or 4+ exclamation marks |
| Aggressive keywords | `hate`, `kill`, `destroy`, `loser`, `pathetic` |

**Business rules:**
- Only `approved` posts can be published
- Published posts are immutable (read-only)
- Flagged posts show clear reasons and can be resubmitted

## Tests

```powershell
env\Scripts\activate
pytest -v
```

```
test_create_and_get_post           PASSED
test_submit_polite_post_is_approved PASSED
test_short_all_caps_post_is_flagged PASSED
test_profanity_is_flagged          PASSED
test_publish_requires_approved     PASSED
test_publish_after_approval_lock   PASSED
test_list_posts_with_status_filter PASSED
test_stats_endpoint                PASSED
```

## Generate SDK

With the backend running:

```bat
generate_sdk.bat
```

Usage after generation:

```python
from moderation_sdk.api.posts_api import PostsApi
from moderation_sdk import ApiClient

client = ApiClient()
api = PostsApi(client)
```

## Bonus Features

- **Real-time updates**: WebSocket pushes events on create/submit/publish; frontend shows toast notifications and auto-refreshes
- **Analytics dashboard**: Doughnut chart (status distribution), line chart (30-day timeline), horizontal bar chart (top moderation flags), metric cards (total posts, approval rate, flag rate)
- **Obsidian Analytics UI**: Dark theme with Material Design 3 color tokens, Plus Jakarta Sans + Inter typography, glassmorphic panels