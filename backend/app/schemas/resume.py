from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.schemas.resume_ai import ResumeAIResponse


class ResumeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    file_name: str
    analysis: Optional[ResumeAIResponse] = None