from unittest.mock import Mock

def register_and_login(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Career Tester",
            "email": "career@example.com",
            "password": "password123",
        },
    )

    response = client.post(
        "/api/auth/login",
        data={
            "username": "career@example.com",
            "password": "password123",
        },
    )

    return response.json()["access_token"]


def career_payload():
    return {
        "name": "Abir",
        "education": "B.Tech CSE",
        "skills": ["Java", "Python", "React"],
        "projects": ["AI Career Copilot"],
        "experience": [],
        "target_role": "Software Engineer",
        "career_goal": "Get a backend/cloud job",
        "years_experience": 0,
    }


def test_profile_requires_authentication(client):
    response = client.get("/api/career/profile")

    assert response.status_code == 401


def test_create_and_get_profile(client):
    token = register_and_login(client)

    headers = {
        "Authorization": f"Bearer {token}"
    }

    create_response = client.post(
        "/api/career/profile",
        json=career_payload(),
        headers=headers,
    )

    assert create_response.status_code == 201

    data = create_response.json()

    assert data["name"] == "Abir"
    assert data["target_role"] == "Software Engineer"
    assert data["career_goal"] == "Get a backend/cloud job"
    assert data["skills"] == ["Java", "Python", "React"]

    get_response = client.get(
        "/api/career/profile",
        headers=headers,
    )

    assert get_response.status_code == 200

    data = get_response.json()

    assert data["career_goal"] == "Get a backend/cloud job"


def test_duplicate_profile_rejected(client):
    token = register_and_login(client)

    headers = {
        "Authorization": f"Bearer {token}"
    }

    first = client.post(
        "/api/career/profile",
        json=career_payload(),
        headers=headers,
    )

    second = client.post(
        "/api/career/profile",
        json=career_payload(),
        headers=headers,
    )

    assert first.status_code == 201
    assert second.status_code == 400


def test_update_profile(client):
    token = register_and_login(client)

    headers = {
        "Authorization": f"Bearer {token}"
    }

    client.post(
        "/api/career/profile",
        json=career_payload(),
        headers=headers,
    )

    updated = career_payload()
    updated["career_goal"] = "Become a Cloud Engineer"
    updated["target_role"] = "Cloud Engineer"

    response = client.put(
        "/api/career/profile",
        json=updated,
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["career_goal"] == "Become a Cloud Engineer"
    assert data["target_role"] == "Cloud Engineer"


def test_analyze_profile_requires_authentication(client):
    response = client.post("/api/career/analyze")

    assert response.status_code == 401


def test_analyze_profile_without_profile(client, monkeypatch):
    token = register_and_login(client)

    headers = {
        "Authorization": f"Bearer {token}"
    }

    mock_ai = Mock()

    monkeypatch.setattr(
        "app.api.routes.career.analyze_career_profile",
        mock_ai,
    )

    response = client.post(
        "/api/career/analyze",
        headers=headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Career profile not found."

    mock_ai.assert_not_called()


def test_analyze_profile_success(client, monkeypatch):
    token = register_and_login(client)

    headers = {
        "Authorization": f"Bearer {token}"
    }

    mock_response = {
        "readiness_score": 75,
        "summary": "Good foundation for a software engineering role.",
        "strengths": ["Java", "Python"],
        "skill_gaps": ["System Design"],
        "recommended_skills": ["AWS", "Docker"],
        "recommended_projects": ["Cloud Deployment Project"],
        "roadmap": ["Learn AWS", "Practice DSA"],
    }

    mock_ai = Mock(return_value=mock_response)

    monkeypatch.setattr(
        "app.api.routes.career.analyze_career_profile",
        mock_ai,
    )

    create_response = client.post(
        "/api/career/profile",
        json=career_payload(),
        headers=headers,
    )

    assert create_response.status_code == 201

    response = client.post(
        "/api/career/analyze",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["readiness_score"] == 75
    assert data["summary"] == mock_response["summary"]
    assert data["strengths"] == ["Java", "Python"]
    assert data["skill_gaps"] == ["System Design"]
    assert data["recommended_skills"] == ["AWS", "Docker"]
    assert data["recommended_projects"] == ["Cloud Deployment Project"]
    assert data["roadmap"] == ["Learn AWS", "Practice DSA"]

    mock_ai.assert_called_once()
