from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class CareerProfile(Base):
    __tablename__ = "career_profiles"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    education: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    skills: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )

    projects: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )

    experience: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )

    target_role: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    years_experience: Mapped[float] = mapped_column(
        nullable=False,
        default=0,
    )

    user: Mapped["User | None"] = relationship(
        back_populates="career_profile",
    )