"""WebSocket connection manager for real-time event broadcasting."""

from __future__ import annotations

import json
from typing import Any

from fastapi import WebSocket


class ConnectionManager:
    """Manages active WebSocket connections and broadcasts events."""

    def __init__(self) -> None:
        self._active: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self._active.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self._active:
            self._active.remove(websocket)

    async def broadcast(self, event: str, payload: dict[str, Any] | None = None) -> None:
        """Send a JSON event to every connected client.

        Message format: ``{"event": "<event_name>", "data": {...}}``
        """
        message = json.dumps({"event": event, "data": payload or {}})
        dead: list[WebSocket] = []
        for connection in self._active:
            try:
                await connection.send_text(message)
            except Exception: 
                dead.append(connection)
        for connection in dead:
            self.disconnect(connection)

    @property
    def active_count(self) -> int:
        return len(self._active)


manager = ConnectionManager()
