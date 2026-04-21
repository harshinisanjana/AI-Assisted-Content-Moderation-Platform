from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class PostStatus(str, Enum):
    draft = "draft"
    flagged = "flagged"
    approved = "approved"
    published = "published"


class PostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)


class PostRead(BaseModel):
    id: int
    title: str
    content: str
    status: PostStatus
    flagged_reasons: list[str] = Field(default_factory=list)
    created_at: datetime

    model_config = {"from_attributes": True}


class ReviewResponse(BaseModel):
    id: int
    status: PostStatus
    flagged_reasons: list[str] = Field(default_factory=list)


# ── Analytics / Stats ────────────────────────────────────────────────


class StatusCount(BaseModel):
    status: str
    count: int


class TimelineEntry(BaseModel):
    date: str
    count: int


class ReasonCount(BaseModel):
    reason: str
    count: int


class StatsResponse(BaseModel):
    status_distribution: list[StatusCount]
    timeline: list[TimelineEntry]
    top_flagged_reasons: list[ReasonCount]
    total_posts: int
    approval_rate: float
    flag_rate: float
