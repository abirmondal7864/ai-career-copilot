import os
import json

from dotenv import load_dotenv
from openai import OpenAI

from app.models.career_profile import CareerProfile
from app.schemas.career import CareerAnalysisResponse


load_dotenv()

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)


def analyze_career_profile(
    profile: CareerProfile,
) -> CareerAnalysisResponse:

    skills = profile.skills.split(",") if profile.skills else []
    projects = profile.projects.split(",") if profile.projects else []
    experience = (
        profile.experience.split(",")
        if profile.experience
        else []
    )

    prompt = f"""
You are an AI career advisor.

Analyze this candidate:

Name: {profile.name}
Education: {profile.education}
Skills: {skills}
Projects: {projects}
Experience: {experience}
Target Role: {profile.target_role}
Years of Experience: {profile.years_experience}

Provide practical advice for getting the target role.

Return ONLY valid JSON with this exact structure:

{{
  "summary": "short overall assessment",
  "strengths": ["strength 1", "strength 2"],
  "skill_gaps": ["gap 1", "gap 2"],
  "recommended_skills": ["skill 1", "skill 2"],
  "recommended_projects": ["project 1", "project 2"],
  "roadmap": ["step 1", "step 2", "step 3"]
}}
"""

    response = client.chat.completions.create(
        model="gemini-3.6-flash",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful AI career advisor.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    content = response.choices[0].message.content

    result = json.loads(content)

    return CareerAnalysisResponse(**result)