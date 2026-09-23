from typing import Optional

from pydantic import BaseModel

from app.schemas.resume_ai import ResumeAIResponse


class ResumeResponse(BaseModel):
    id: int
    file_name: str
    analysis: Optional[ResumeAIResponse] = None

    class Config:
        from_attributes = True