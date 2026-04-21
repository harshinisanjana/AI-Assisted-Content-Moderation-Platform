"""add published_at to posts table

Revision ID: 20260421_0002
Revises: 20260420_0001
Create Date: 2026-04-21 00:00:02

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20260421_0002"
down_revision: Union[str, None] = "20260420_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("posts", sa.Column("published_at", sa.DateTime(), nullable=True))

    # Backfill already-published rows so existing blog posts show a timestamp.
    op.execute(
        sa.text(
            """
            UPDATE posts
            SET published_at = created_at
            WHERE status = 'published' AND published_at IS NULL
            """
        )
    )


def downgrade() -> None:
    op.drop_column("posts", "published_at")
