"""create base career schema and update career profile model

Revision ID: a8fd0cefc901
Revises:
Create Date: 2026-09-04 01:59:01.861548

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a8fd0cefc901"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create the base schema and apply the original career-profile changes."""
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=True),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    op.create_table(
        "career_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("education", sa.Text(), nullable=True),
        sa.Column("skills", sa.Text(), nullable=True),
        sa.Column("experience", sa.Text(), nullable=True),
        sa.Column("target_role", sa.String(length=100), nullable=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("projects", sa.Text(), nullable=False),
        sa.Column("years_experience", sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
    )
    op.create_index(op.f("ix_career_profiles_id"), "career_profiles", ["id"], unique=False)
    op.create_index(
        op.f("ix_career_profiles_user_id"),
        "career_profiles",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    """Drop the base career schema."""
    op.drop_index(op.f("ix_career_profiles_user_id"), table_name="career_profiles")
    op.drop_index(op.f("ix_career_profiles_id"), table_name="career_profiles")
    op.drop_table("career_profiles")

    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")
