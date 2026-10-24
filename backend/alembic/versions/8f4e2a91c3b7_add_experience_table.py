"""add experience table

Revision ID: 8f4e2a91c3b7
Revises: <REPLACE_WITH_YOUR_LATEST_REVISION_ID_OR_NONE>
Create Date: 2026-10-24 20:57:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "8f4e2a91c3b7"
# NOTE: Replace None below with the `revision` string of your previous migration file
# in `backend/alembic/versions/` (run `alembic heads` to check your current head).
down_revision: Union[str, None] = "d34d33b31b66"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


TABLE_NAME = "experiences"


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table(TABLE_NAME):
        op.create_table(
            TABLE_NAME,
            sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
            # Role & Organization Info
            sa.Column("role", sa.String(length=150), nullable=False),
            sa.Column("company", sa.String(length=150), nullable=False),
            sa.Column("company_url", sa.String(length=500), nullable=True),
            sa.Column("company_logo_url", sa.String(length=500), nullable=True),
            sa.Column("location", sa.String(length=150), nullable=True),
            sa.Column(
                "employment_type",
                sa.String(length=80),
                nullable=True,
                comment="e.g. Internship, Full-time, Contract, Part-time, Freelance, Organization",
            ),
            # Dates & Current Status (String format matches Certificate.date & TimelineItem.year)
            sa.Column("start_date", sa.String(length=50), nullable=False),
            sa.Column("end_date", sa.String(length=50), nullable=True),
            sa.Column(
                "is_current",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            ),
            # Content & Tech Stack Tags (comma-separated, works with splitTags() in api.ts)
            sa.Column("summary", sa.Text(), nullable=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("tags", sa.String(length=500), nullable=True),
            # Admin Reordering & Public Visibility (matches skills & projects tables)
            sa.Column(
                "order",
                sa.Integer(),
                nullable=False,
                server_default=sa.text("0"),
            ),
            sa.Column(
                "visible",
                sa.Boolean(),
                nullable=False,
                server_default=sa.true(),
            ),
            # Audit Timestamps
            sa.Column(
                "created_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
                onupdate=sa.func.now(),
            ),
        )

        # Indexes for fast public & admin queries (filtering by visible + ordering by priority)
        op.create_index(
            op.f("ix_experiences_id"),
            TABLE_NAME,
            ["id"],
            unique=False,
        )
        op.create_index(
            "ix_experiences_visible_order",
            TABLE_NAME,
            ["visible", "order"],
            unique=False,
        )

    # Register the "experience" section toggle in `sections` if the table exists
    if inspector.has_table("sections"):
        sections_table = sa.table(
            "sections",
            sa.column("key", sa.String),
            sa.column("visible", sa.Boolean),
        )
        existing = bind.execute(
            sa.select(sections_table.c.key).where(
                sections_table.c.key == "experience"
            )
        ).first()
        if not existing:
            bind.execute(
                sections_table.insert().values(key="experience", visible=True)
            )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # Remove the "experience" section key from `sections`
    if inspector.has_table("sections"):
        sections_table = sa.table("sections", sa.column("key", sa.String))
        bind.execute(
            sections_table.delete().where(sections_table.c.key == "experience")
        )

    if inspector.has_table(TABLE_NAME):
        existing_indexes = {
            idx["name"] for idx in inspector.get_indexes(TABLE_NAME)
        }
        if "ix_experiences_visible_order" in existing_indexes:
            op.drop_index("ix_experiences_visible_order", table_name=TABLE_NAME)
        if op.f("ix_experiences_id") in existing_indexes:
            op.drop_index(op.f("ix_experiences_id"), table_name=TABLE_NAME)

        op.drop_table(TABLE_NAME)


# ---------------------------------------------------------------------------
# Reference: Matching SQLAlchemy Model for `backend/models.py`
# ---------------------------------------------------------------------------
# class Experience(Base):
#     __tablename__ = "experiences"
#     id = Column(Integer, primary_key=True, index=True)
#     role = Column(String(150), nullable=False)
#     company = Column(String(150), nullable=False)
#     company_url = Column(String(500))
#     company_logo_url = Column(String(500))
#     location = Column(String(150))
#     employment_type = Column(String(80))
#     start_date = Column(String(50), nullable=False)
#     end_date = Column(String(50))
#     is_current = Column(Boolean, default=False, server_default="0", nullable=False)
#     summary = Column(Text)
#     description = Column(Text)
#     tags = Column(String(500))
#     order = Column(Integer, default=0, server_default="0", nullable=False)
#     visible = Column(Boolean, default=True, server_default="1", nullable=False)
#     created_at = Column(DateTime, server_default=func.now(), nullable=False)
#     updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)