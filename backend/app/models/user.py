from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Student profile fields — all optional, filled in on the profile page
    gpa: Mapped[float | None] = mapped_column(Float, nullable=True)
    sat_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    intended_major: Mapped[str | None] = mapped_column(String(255), nullable=True)
    target_schools: Mapped[str | None] = mapped_column(Text, nullable=True)
    country_of_origin: Mapped[str | None] = mapped_column(String(255), nullable=True)
