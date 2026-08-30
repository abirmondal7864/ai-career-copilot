from pydantic import BaseModel, Field


class CareerProfileRequest(BaseModel):
    name: str = Field(min_length=1)
    education: str = Field(min_length=1)
    skills: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    experience: list[str] = Field(default_factory=list)
    target_role: str = Field(min_length=1)
    years_experience: float = Field(default=0, ge=0)


class CareerProfileResponse(BaseModel):
    name: str
    education: str
    skills: list[str]
    projects: list[str]
    experience: list[str]
    target_role: str
    years_experience: float
    message: str