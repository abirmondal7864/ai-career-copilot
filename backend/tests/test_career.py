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
        json={
            "email": "career@example.com",
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