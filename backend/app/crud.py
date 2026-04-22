import json
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from backend.app.moderation import moderate_content
from backend.app.models import Post


def _serialize_reasons(reasons: list[str]) -> str | None:
    if not reasons:
        return None
    return json.dumps(reasons)


def deserialize_reasons(payload: str | None) -> list[str]:
    if not payload:
        return []
    try:
        parsed = json.loads(payload)
        if isinstance(parsed, list):
            return [str(item) for item in parsed]
        return []
    except json.JSONDecodeError:
        return []


def create_post(db: Session, title: str, content: str) -> Post:
    post = Post(
        title=title,
        content=content,
        status="draft",
        flagged_reasons=None,
        published_at=None,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def get_post_by_id(db: Session, post_id: int) -> Post | None:
    return db.query(Post).filter(Post.id == post_id).first()


def list_posts(db: Session, skip: int = 0, limit: int = 100, status_filter: str | None = None) -> list[Post]:
    query = db.query(Post)
    if status_filter:
        query = query.filter(Post.status == status_filter)
    return query.order_by(Post.created_at.desc(), Post.id.desc()).offset(skip).limit(limit).all()


def submit_post_for_review(db: Session, post: Post) -> tuple[Post, list[str]]:
    reasons = moderate_content(post.content)
    post.status = "flagged" if reasons else "approved"
    post.flagged_reasons = _serialize_reasons(reasons)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post, reasons


def publish_post(db: Session, post: Post) -> Post:
    post.status = "published"
    post.published_at = datetime.now(timezone.utc)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post
