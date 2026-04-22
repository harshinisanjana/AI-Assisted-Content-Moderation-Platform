from sqlalchemy import CheckConstraint, Column, DateTime, Integer, Text, func

from backend.app.database import Base


class Post(Base):
    __tablename__ = "posts"
    __table_args__ = (
        CheckConstraint(
            "status IN ('draft','flagged','approved','published')",
            name="ck_posts_status_valid",
        ),
    )

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    title = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    status = Column(Text, nullable=False, server_default="draft", default="draft")
    flagged_reasons = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    published_at = Column(DateTime(timezone=True), nullable=True)
