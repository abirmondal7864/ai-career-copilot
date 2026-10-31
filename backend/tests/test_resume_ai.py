import json
from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from pydantic import ValidationError

from app.services import resume_ai


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


def mock_gemini(monkeypatch, response_text):
    mock_generate = Mock(
        return_value=SimpleNamespace(text=response_text)
    )

    monkeypatch.setattr(
        resume_ai.client.models,
        "generate_content",
        mock_generate,
    )

    return mock_generate


def test_analyze_resume_success(monkeypatch):
    expected = valid_ai_response()

    mock_generate = mock_gemini(
        monkeypatch,
        json.dumps(expected),
    )

    result = resume_ai.analyze_resume_with_ai(
        "Abir - B.Tech CSE - Java Developer"
    )

    assert result.readiness_score == 75
    assert result.summary == expected["summary"]
    assert result.strengths == ["Java", "Python"]
    assert result.skill_gaps == ["System Design"]
    assert result.recommended_skills == ["AWS", "Docker"]
    assert result.recommended_projects == ["Cloud Deployment Project"]
    assert result.roadmap == ["Learn AWS", "Practice DSA"]

    mock_generate.assert_called_once()

    call_args = mock_generate.call_args

    assert call_args.kwargs["model"] == "gemini-flash-lite-latest"
    assert "Abir - B.Tech CSE" in call_args.kwargs["contents"]


def test_analyze_resume_empty_response(monkeypatch):
    mock_generate = mock_gemini(monkeypatch, None)

    with pytest.raises(
        ValueError,
        match="Gemini returned an empty response",
    ):
        resume_ai.analyze_resume_with_ai("Sample resume")

    mock_generate.assert_called_once()


def test_analyze_resume_invalid_json(monkeypatch):
    mock_generate = mock_gemini(
        monkeypatch,
        "This is not valid JSON",
    )

    with pytest.raises(json.JSONDecodeError):
        resume_ai.analyze_resume_with_ai("Sample resume")

    mock_generate.assert_called_once()


def test_analyze_resume_invalid_schema(monkeypatch):
    invalid_response = valid_ai_response()

    invalid_response["readiness_score"] = "not-a-number"

    mock_generate = mock_gemini(
        monkeypatch,
        json.dumps(invalid_response),
    )

    with pytest.raises(ValidationError):
        resume_ai.analyze_resume_with_ai("Sample resume")

    mock_generate.assert_called_once()


def test_analyze_resume_gemini_api_failure(monkeypatch):
    mock_generate = Mock(
        side_effect=RuntimeError("Gemini API unavailable")
    )

    monkeypatch.setattr(
        resume_ai.client.models,
        "generate_content",
        mock_generate,
    )

    with pytest.raises(
        RuntimeError,
        match="Gemini API unavailable",
    ):
        resume_ai.analyze_resume_with_ai("Sample resume")

    mock_generate.assert_called_once()


def test_analyze_resume_empty_string_response(monkeypatch):
    mock_generate = mock_gemini(monkeypatch, "")

    with pytest.raises(
        ValueError,
        match="Gemini returned an empty response",
    ):
        resume_ai.analyze_resume_with_ai("Sample resume")

    mock_generate.assert_called_once()