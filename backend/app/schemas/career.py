from pydantic import BaseModel


class CareerAnalyzeRequest(BaseModel):
    skills: list[str]
    target_role: str


class CareerAnalyzeResponse(BaseModel):
    target_role: str
    skill_count: int
    message: str