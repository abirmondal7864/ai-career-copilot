from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.db.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=True)
    content = Column(Text, nullable=True)

    analysis = Column(JSON, nullable=True)

    user = relationship("User", back_populates="resumes")