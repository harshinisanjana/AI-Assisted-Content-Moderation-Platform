from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app import crud, models, schemas
from backend.app.database import get_db
from backend.app.websocket_manager import manager

router = APIRouter(prefix="/posts", tags=["posts"])


def _to_post_read(post: models.Post) -> schemas.PostRead:
    return schemas.PostRead(
        id=post.id,
        title=post.title,
        content=post.content,
        status=post.status,
        flagged_reasons=crud.deserialize_reasons(post.flagged_reasons),
        created_at=post.created_at,
        published_at=post.published_at,
    )


@router.post("/", response_model=schemas.PostRead, status_code=status.HTTP_201_CREATED)
async def create_post(payload: schemas.PostCreate, db: Session = Depends(get_db)) -> schemas.PostRead:
    post = crud.create_post(db, title=payload.title, content=payload.content)
    result = _to_post_read(post)
    await manager.broadcast(
        "post_created",
        {
            "id": post.id,
            "title": post.title,
            "status": post.status,
        },
    )
    return result


@router.post("/{post_id}/submit/", response_model=schemas.ReviewResponse)
async def submit_post_for_review(post_id: int, db: Session = Depends(get_db)) -> schemas.ReviewResponse:
    post = crud.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    if post.status == schemas.PostStatus.published.value:
        raise HTTPException(
            status_code=409,
            detail="Published posts are immutable and cannot be submitted again.",
        )

    updated_post, reasons = crud.submit_post_for_review(db, post)
    await manager.broadcast("post_submitted", {
        "id": updated_post.id,
        "title": updated_post.title,
        "status": updated_post.status,
        "flagged_reasons": reasons,
    })
    return schemas.ReviewResponse(
        id=updated_post.id,
        status=updated_post.status,
        flagged_reasons=reasons,
    )


@router.get("/", response_model=list[schemas.PostRead])
def list_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    status_filter: schemas.PostStatus | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
) -> list[schemas.PostRead]:
    posts = crud.list_posts(
        db,
        skip=skip,
        limit=limit,
        status_filter=status_filter.value if status_filter else None,
    )
    return [_to_post_read(post) for post in posts]


@router.patch("/{post_id}/publish/", response_model=schemas.PostRead)
async def publish_post(post_id: int, db: Session = Depends(get_db)) -> schemas.PostRead:
    post = crud.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    if post.status != schemas.PostStatus.approved.value:
        raise HTTPException(
            status_code=400,
            detail="Only approved posts can be published.",
        )

    published_post = crud.publish_post(db, post)
    result = _to_post_read(published_post)
    await manager.broadcast("post_published", {"id": published_post.id, "title": published_post.title})
    return result


@router.get("/{post_id}", response_model=schemas.PostRead)
def get_post(post_id: int, db: Session = Depends(get_db)) -> schemas.PostRead:
    post = crud.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    return _to_post_read(post)
