from pydantic import BaseModel
from typing import List


class SkillsAnalysis(BaseModel):
    technical_skills: List[str]
    missing_skills: List[str]


class ResumeAIResponse(BaseModel):
    overall_score: int
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    skills_analysis: SkillsAnalysis
    suggestions: List[str]

class ResumeAnalysisResponse(BaseModel):
    resume_id: int
    file_name: str
    analysis: ResumeAIResponse