import os
import json

from google import genai

from app.schemas.resume_ai import ResumeAIResponse


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_resume_with_ai(resume_text: str) -> ResumeAIResponse:
    prompt = f"""
Analyze the following resume.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

The JSON must follow this exact structure:

{{
    "overall_score": 0,
    "summary": "",
    "strengths": [],
    "weaknesses": [],
    "skills_analysis": {{
        "technical_skills": [],
        "missing_skills": []
    }},
    "suggestions": []
}}

Rules:
- overall_score must be an integer from 0 to 100.
- strengths must be a list of strings.
- weaknesses must be a list of strings.
- technical_skills must contain skills found in the resume.
- missing_skills should contain relevant skills that could improve the candidate's profile.
- suggestions must contain practical resume improvement suggestions.

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