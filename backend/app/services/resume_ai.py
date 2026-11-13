import os
import json

from google import genai

from app.models.career_profile import CareerProfile
from app.schemas.resume_ai import ResumeAIResponse


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_resume_with_ai(
    resume_text: str,
    career_profile: CareerProfile | None = None,
) -> ResumeAIResponse:
    if career_profile:
        profile_context = f"""
Saved Career Profile (user-provided context, not independently verified):
- Name: {career_profile.name}
- Education: {career_profile.education}
- Skills: {career_profile.skills}
- Projects: {career_profile.projects}
- Experience: {career_profile.experience}
- Target role: {career_profile.target_role}
- Career goal: {career_profile.career_goal}
- Years of experience: {career_profile.years_experience}
"""
    else:
        profile_context = """
No saved Career Profile is available. Base the analysis on the resume
and make recommendations using reasonable software engineering career goals.
"""

    prompt = f"""
You are an expert career advisor analyzing a software engineering candidate.

Use BOTH the uploaded resume and the saved Career Profile below.
The resume is the primary evidence for claims about the candidate's actual
education, skills, projects, and work experience. The Career Profile provides
the candidate's declared background, preferences, target role, and goals.

Career Profile:
{profile_context}

Uploaded Resume:
{resume_text}

Important rules:
- Use the Career Profile's target role and career goal to personalize skill gaps,
  recommended skills, projects, and the roadmap.
- Consider the profile's declared skills, projects, education, and experience
  when tailoring recommendations, but do not present unsupported claims as
  verified resume facts.
- Compare the name and education in the profile with the resume when those
  details are available. If they conflict, explicitly flag the discrepancy
  in the summary instead of silently choosing one identity.
- Do not assume that profile information is correct when it contradicts the
  resume. Clearly distinguish user-provided profile context from resume evidence.
- Do not ignore the Career Profile. Its target role and career goal must
  materially influence the recommendations.
- Do not invent experience, projects, education, or skills.
- readiness_score must be an integer from 0 to 100 and should reflect readiness
  for the target role when one is provided.
- summary must briefly describe the candidate's current profile and career
  readiness, including any important profile/resume mismatch.
- strengths must contain specific strengths supported by the available information.
- skill_gaps must contain important skills the candidate is missing or should improve.
- recommended_skills must contain specific technical skills to learn next.
- recommended_projects must contain practical projects that support the target role.
- roadmap must contain clear, ordered steps for improving career readiness.
- All lists must contain useful, specific strings.

Return ONLY valid JSON. Do not use markdown or add explanations outside the JSON.
Use this exact structure:
{{
    "readiness_score": 0,
    "summary": "",
    "strengths": [],
    "skill_gaps": [],
    "recommended_skills": [],
    "recommended_projects": [],
    "roadmap": []
}}
"""

    response = client.models.generate_content(
        model="gemini-flash-lite-latest",
        contents=prompt,
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response")

    result = json.loads(response.text)

    return ResumeAIResponse.model_validate(result)