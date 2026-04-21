
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.routers.posts import router as posts_router
from app.routers.stats import router as stats_router
from app.websocket_manager import manager

app = FastAPI(
    title="AI-Assisted Content Moderation & Publishing API",
    version="1.0.0",
    description="Backend service for drafting, reviewing, and publishing blog posts.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stats_router)   # /posts/stats must register before /posts/{id}
app.include_router(posts_router)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """Keep a WebSocket connection open for real-time event broadcasting."""
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except (WebSocketDisconnect, Exception):  # noqa: BLE001
        pass
    finally:
        manager.disconnect(websocket)


@app.exception_handler(SQLAlchemyError)
def handle_sqlalchemy_error(_: Request, __: SQLAlchemyError) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"detail": "A database error occurred. Please retry later."},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
