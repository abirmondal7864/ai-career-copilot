from pydantic import BaseModel


class ResumeResponse(BaseModel):
    id: int
    file_name: str
    content: str | None = None

    class Config:
        from_attributes = True