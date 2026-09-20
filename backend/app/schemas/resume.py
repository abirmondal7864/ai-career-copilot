from pydantic import BaseModel


class ResumeResponse(BaseModel):
    id: int
    file_name: str

    class Config:
        from_attributes = True