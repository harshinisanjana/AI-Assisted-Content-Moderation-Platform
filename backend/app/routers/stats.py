"""Analytics endpoint returning aggregated post statistics for charts."""

from __future__ import annotations

import json
from collections import Counter
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app import models, schemas
from backend.app.database import get_db

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/stats", response_model=schemas.StatsResponse)
def get_post_stats(db: Session = Depends(get_db)) -> schemas.StatsResponse:
    """Return aggregated statistics for the analytics dashboard."""
    all_posts = db.query(models.Post).all()

    # ── Status distribution ───────────────────────
    status_counter: Counter[str] = Counter()
    for post in all_posts:
        status_counter[post.status] += 1

    status_distribution = [
        schemas.StatusCount(status=s, count=status_counter.get(s, 0))
        for s in ("draft", "flagged", "approved", "published")
    ]

    # ── Timeline (posts created per day, last 30 days) ───────────────
    today = datetime.now(UTC).date()
    start_date = today - timedelta(days=29)

    day_counter: Counter[str] = Counter()
    for post in all_posts:
        post_date = post.created_at.date() if post.created_at else None
        if post_date and post_date >= start_date:
            day_counter[post_date.isoformat()] += 1

    timeline: list[schemas.TimelineEntry] = []
    for offset in range(30):
        day = start_date + timedelta(days=offset)
        day_str = day.isoformat()
        timeline.append(schemas.TimelineEntry(date=day_str, count=day_counter.get(day_str, 0)))

    # ── Top flagged reasons ──────────────────────────────────────────
    reason_counter: Counter[str] = Counter()
    for post in all_posts:
        if post.flagged_reasons:
            try:
                reasons = json.loads(post.flagged_reasons)
                if isinstance(reasons, list):
                    for reason in reasons:
                        label = str(reason).split(".")[0].strip()
                        reason_counter[label] += 1
            except json.JSONDecodeError:
                pass

    top_reasons = [
        schemas.ReasonCount(reason=reason, count=count)
        for reason, count in reason_counter.most_common(8)
    ]

    # ── Summary metrics ──────────────────────────────────────────────
    total = len(all_posts)
    approved_count = status_counter.get("approved", 0) + status_counter.get("published", 0)
    flagged_count = status_counter.get("flagged", 0)
    reviewed = approved_count + flagged_count

    return schemas.StatsResponse(
        status_distribution=status_distribution,
        timeline=timeline,
        top_flagged_reasons=top_reasons,
        total_posts=total,
        approval_rate=round(approved_count / reviewed * 100, 1) if reviewed else 0.0,
        flag_rate=round(flagged_count / reviewed * 100, 1) if reviewed else 0.0,
    )
