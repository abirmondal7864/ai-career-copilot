from pydantic import BaseModel
from typing import List


class ResumeAIResponse(BaseModel):
    readiness_score: int = 0
    summary: str = ""
    strengths: List[str] = []
    skill_gaps: List[str] = []
    recommended_skills: List[str] = []
    recommended_projects: List[str] = []
    roadmap: List[str] = []


class ResumeAnalysisResponse(BaseModel):
    resume_id: int
    file_name: str
    analysis: ResumeAIResponse