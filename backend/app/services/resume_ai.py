import os
import json

from google import genai

from app.schemas.resume_ai import ResumeAIResponse


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_resume_with_ai(resume_text: str) -> ResumeAIResponse:
    prompt = f"""
Analyze the following resume for a software engineering candidate.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

The JSON must follow this exact structure:

{{
    "readiness_score": 0,
    "summary": "",
    "strengths": [],
    "skill_gaps": [],
    "recommended_skills": [],
    "recommended_projects": [],
    "roadmap": []
}}

Rules:
- readiness_score must be an integer from 0 to 100.
- summary must briefly describe the candidate's current profile and career readiness.
- strengths must contain specific strengths demonstrated by the resume.
- skill_gaps must contain important skills the candidate is missing or should improve for software engineering jobs.
- recommended_skills must contain specific technical skills the candidate should learn next.
- recommended_projects must contain practical projects that would strengthen the candidate's profile.
- roadmap must contain clear, ordered steps for improving career readiness.
- All lists must contain useful, specific strings.
- Base the analysis primarily on the information present in the resume.
- Do not invent experience, projects, education, or skills that are not supported by the resume.

Resume:
{resume_text}
"""

    response = client.models.generate_content(
        model="gemini-flash-lite-latest",
        contents=prompt,
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response")

    result = json.loads(response.text)

    return ResumeAIResponse.model_validate(result)