import json
from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from fastapi import HTTPException
from openai import RateLimitError
from pydantic import ValidationError

from app.models.career_profile import CareerProfile
from app.services import career_ai


@pytest.fixture
def profile():
    return CareerProfile(
        name="Abir",
        education="B.Tech CSE",
        skills="Java,Python,React",
        projects="AI Career Copilot",
        experience="Java Internship",
        target_role="Software Engineer",
        years_experience=0,
    )


def valid_ai_response():
    return {
        "readiness_score": 75,
        "summary": "Good foundation for software engineering.",
        "strengths": ["Java", "Python"],
        "skill_gaps": ["System Design"],
        "recommended_skills": ["AWS", "Docker"],
        "recommended_projects": ["Cloud Deployment Project"],
        "roadmap": ["Learn AWS", "Practice DSA"],
    }


def mock_gemini(monkeypatch, content):
    mock_create = Mock(
        return_value=SimpleNamespace(
            choices=[
                SimpleNamespace(
                    message=SimpleNamespace(content=content)
                )
            ]
        )
    )

    monkeypatch.setattr(
        career_ai.client.chat.completions,
        "create",
        mock_create,
    )

    return mock_create


def test_analyze_career_profile_success(profile, monkeypatch):
    expected = valid_ai_response()

    mock_create = mock_gemini(
        monkeypatch,
        json.dumps(expected),
    )

    result = career_ai.analyze_career_profile(profile)

    assert result.readiness_score == 75
    assert result.summary == expected["summary"]
    assert result.strengths == ["Java", "Python"]
    assert result.skill_gaps == ["System Design"]
    assert result.recommended_skills == ["AWS", "Docker"]
    assert result.recommended_projects == ["Cloud Deployment Project"]
    assert result.roadmap == ["Learn AWS", "Practice DSA"]

    mock_create.assert_called_once()


def test_analyze_career_profile_empty_response(profile, monkeypatch):
    mock_gemini(monkeypatch, None)

    with pytest.raises(HTTPException) as exc:
        career_ai.analyze_career_profile(profile)

    assert exc.value.status_code == 500
    assert exc.value.detail == "AI returned an empty response."


def test_analyze_career_profile_invalid_json(profile, monkeypatch):
    mock_gemini(monkeypatch, "This is not JSON")

    with pytest.raises(HTTPException) as exc:
        career_ai.analyze_career_profile(profile)

    assert exc.value.status_code == 500
    assert "AI returned invalid JSON" in exc.value.detail


def test_analyze_career_profile_markdown_json(profile, monkeypatch):
    expected = valid_ai_response()

    content = f"```json\n{json.dumps(expected)}\n```"

    mock_gemini(monkeypatch, content)

    result = career_ai.analyze_career_profile(profile)

    assert result.readiness_score == 75
    assert result.summary == expected["summary"]


def test_analyze_career_profile_rate_limit(profile, monkeypatch):
    mock_create = Mock(
        side_effect=RateLimitError(
            message="Rate limit exceeded",
            response=Mock(),
            body=None,
        )
    )

    monkeypatch.setattr(
        career_ai.client.chat.completions,
        "create",
        mock_create,
    )

    with pytest.raises(HTTPException) as exc:
        career_ai.analyze_career_profile(profile)

    assert exc.value.status_code == 429
    assert exc.value.detail == (
        "AI analysis quota exceeded. Please try again later."
    )


def test_analyze_career_profile_empty_fields(monkeypatch):
    empty_profile = CareerProfile(
        name="Abir",
        education="B.Tech CSE",
        skills=None,
        projects=None,
        experience=None,
        target_role="Software Engineer",
        years_experience=0,
    )

    expected = valid_ai_response()

    mock_create = mock_gemini(
        monkeypatch,
        json.dumps(expected),
    )

    result = career_ai.analyze_career_profile(empty_profile)

    assert result.readiness_score == 75

    prompt = mock_create.call_args.kwargs["messages"][1]["content"]

    assert "Skills: []" in prompt
    assert "Projects: []" in prompt
    assert "Experience: []" in prompt


def test_analyze_career_profile_invalid_schema(profile, monkeypatch):
    invalid = valid_ai_response()
    invalid["readiness_score"] = "invalid"

    mock_gemini(monkeypatch, json.dumps(invalid))

    with pytest.raises(ValidationError):
        career_ai.analyze_career_profile(profile)