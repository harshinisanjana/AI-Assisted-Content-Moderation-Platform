# AI-Assisted Content Moderation & Publishing Platform

Full-stack app for drafting short posts, submitting them to moderation, and publishing approved content.

## Stack

- Backend: FastAPI, SQLAlchemy, Alembic, SQLite
- Frontend: React + Vite, React Router, Axios, Chart.js, Tailwind utilities
- Real-time: WebSockets
- Tests: pytest + FastAPI TestClient
- SDK: OpenAPI Generator (Python client)

## Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- Windows PowerShell or Command Prompt (for `.bat` scripts)

## Project Layout

```
.
├── app/                    # Backend modules (routers, schemas, CRUD, moderation)
├── alembic/                # Database migrations
├── frontend/               # React app
├── tests/                  # Backend tests
├── main.py                 # FastAPI entry point
├── setupdev.bat            # One-time local setup
├── runapplication.bat      # Starts backend + frontend
├── dump_openapi.py         # Dumps OpenAPI schema to openapi.json
└── generate_sdk.bat        # Regenerates Python SDK
```

## Quick Start (Windows)

### 1) Set up dependencies

```bat
setupdev.bat
```

What it does:
- Creates virtual environment folder `env` (if missing)
- Installs Python dependencies from `requirements.txt`
- Runs `alembic upgrade head`
- Installs frontend dependencies in `frontend/`

### 2) Run the app

```bat
runapplication.bat
```

This launches two terminals:
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Frontend UI: http://localhost:5173

## Manual Setup (Any OS)

### Backend

```bash
python -m venv env
```

Activate venv:

```powershell
env\Scripts\activate
```

```bash
source env/bin/activate
```

Install and migrate:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
alembic upgrade head
```

Run backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Core API Endpoints

- `POST /posts/` create draft
- `POST /posts/{id}/submit/` run moderation (approved or flagged)
- `PATCH /posts/{id}/publish/` publish approved post
- `GET /posts/` list posts (`status`, `skip`, `limit`)
- `GET /posts/{id}` get one post
- `GET /posts/stats` dashboard metrics
- `WS /ws` real-time events
- `GET /health` health check

## Run Tests

With venv active:

```bash
pytest -q tests
```

Or directly via the venv Python executable on Windows:

```powershell
env\Scripts\python.exe -m pytest -q tests
```

## Generate Python SDK

### One-command path

```bat
generate_sdk.bat
```

This script:
1. Regenerates `openapi.json` from the FastAPI app via `dump_openapi.py`
2. Runs OpenAPI Generator to output `moderation_sdk/`

Equivalent manual command used by the project:

```bash
openapi-generator-cli generate -i openapi.json -g python -o moderation_sdk --additional-properties=packageName=moderation_sdk
```

## Environment-Based Moderation Rules

The moderation engine reads these environment variables (with defaults):

- `MIN_CONTENT_LENGTH` (default `50`)
- `MAX_CONTENT_LENGTH` (default `2000`)
- `BANNED_WORDS` (comma-separated)
- `AGGRESSIVE_KEYWORDS` (comma-separated)

Extra checks also flag ALL-CAPS and excessive punctuation.

## Troubleshooting

- Browser warning: `WebSocket is closed before the connection is established`
  - In development, React StrictMode can cause an extra mount/unmount cycle, which may show this warning once. If the backend log shows `/ws [accepted]`, the socket is working.

- Browser warning about `cdn.tailwindcss.com should not be used in production`
  - Expected for this dev setup because Tailwind CDN is loaded in `frontend/index.html`.

- `Backend virtual environment not found` when running `runapplication.bat`
  - Run `setupdev.bat` first.