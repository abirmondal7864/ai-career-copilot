
from unittest.mock import Mock

from app.schemas.resume_ai import ResumeAIResponse


def register_and_login(client, email="resume@example.com"):
    client.post(
        "/api/auth/register",
        json={
            "name": "Resume Tester",
            "email": email,
            "password": "password123",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": "password123",
        },
    )

    return response.json()["access_token"]


def upload_test_resume(client, token, monkeypatch):
    monkeypatch.setattr(
        "app.api.resume.extract_text_from_pdf",
        Mock(return_value="Python Java React. B.Tech CSE."),
    )

    response = client.post(
        "/api/resume/",
        headers={"Authorization": f"Bearer {token}"},
        files={
            "file": (
                "resume.pdf",
                b"fake pdf content",
                "application/pdf",
            )
        },
    )

    assert response.status_code == 200

    return response.json()["id"]


def test_analyze_resume_requires_authentication(client):
    response = client.post(
        "/api/resume/analyze",
        params={"resume_id": 1},
    )

    assert response.status_code == 401


def test_analyze_resume_not_found(client, monkeypatch):
    token = register_and_login(client)

    mock_ai = Mock()

    monkeypatch.setattr(
        "app.api.resume.analyze_resume_with_ai",
        mock_ai,
    )

    response = client.post(
        "/api/resume/analyze",
        params={"resume_id": 9999},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Resume not found"

    mock_ai.assert_not_called()


def test_analyze_resume_forbidden_for_another_user(client, monkeypatch):
    token1 = register_and_login(
        client,
        "user1@example.com",
    )

    token2 = register_and_login(
        client,
        "user2@example.com",
    )

    resume_id = upload_test_resume(
        client,
        token1,
        monkeypatch,
    )

    mock_ai = Mock()

    monkeypatch.setattr(
        "app.api.resume.analyze_resume_with_ai",
        mock_ai,
    )

    response = client.post(
        "/api/resume/analyze",
        params={"resume_id": resume_id},
        headers={"Authorization": f"Bearer {token2}"},
    )

    assert response.status_code == 404

    mock_ai.assert_not_called()


def test_analyze_resume_success(client, monkeypatch):
    token = register_and_login(client)

    resume_id = upload_test_resume(
        client,
        token,
        monkeypatch,
    )

    mock_response = {
        "readiness_score": 75,
        "summary": "Good foundation for software engineering.",
        "strengths": ["Java", "Python"],
        "skill_gaps": ["System Design"],
        "recommended_skills": ["AWS", "Docker"],
        "recommended_projects": ["Cloud Deployment Project"],
        "roadmap": ["Learn AWS", "Practice DSA"],
    }

    mock_ai = Mock(
        return_value=ResumeAIResponse.model_validate(mock_response)
    )

    monkeypatch.setattr(
        "app.api.resume.analyze_resume_with_ai",
        mock_ai,
    )

    response = client.post(
        "/api/resume/analyze",
        params={"resume_id": resume_id},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["resume_id"] == resume_id
    assert data["file_name"] == "resume.pdf"

    analysis = data["analysis"]

    assert analysis["readiness_score"] == 75
    assert analysis["summary"] == mock_response["summary"]
    assert analysis["strengths"] == ["Java", "Python"]
    assert analysis["skill_gaps"] == ["System Design"]
    assert analysis["recommended_skills"] == ["AWS", "Docker"]
    assert analysis["recommended_projects"] == [
        "Cloud Deployment Project"
    ]
    assert analysis["roadmap"] == ["Learn AWS", "Practice DSA"]

    mock_ai.assert_called_once_with(
        "Python Java React. B.Tech CSE."
    )
