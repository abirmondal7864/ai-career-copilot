import pytest

from app.schemas.career import CareerProfileRequest
from app.services import career_service


@pytest.fixture(autouse=True)
def reset_career_profile(monkeypatch):
    """Reset global storage before every test."""
    monkeypatch.setattr(career_service, "career_profile", None)


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


def test_create_career_profile():
    data = CareerProfileRequest(**career_payload())

    response = career_service.create_career_profile(data)

    assert response.name == "Abir"
    assert response.target_role == "Software Engineer"
    assert response.career_goal == "Get a backend/cloud job"
    assert response.message == "Career profile created successfully."


def test_get_career_profile_when_none():
    response = career_service.get_career_profile()

    assert response is None


def test_get_career_profile_when_exists():
    data = CareerProfileRequest(**career_payload())

    career_service.create_career_profile(data)

    response = career_service.get_career_profile()

    assert response is not None
    assert response.name == "Abir"
    assert response.message == "Career profile retrieved successfully."


def test_update_career_profile():
    data = CareerProfileRequest(**career_payload())

    career_service.create_career_profile(data)

    updated_payload = career_payload()
    updated_payload["career_goal"] = "Become a Cloud Engineer"
    updated_payload["target_role"] = "Cloud Engineer"

    updated_data = CareerProfileRequest(**updated_payload)

    response = career_service.update_career_profile(updated_data)

    assert response.target_role == "Cloud Engineer"
    assert response.career_goal == "Become a Cloud Engineer"
    assert response.message == "Career profile updated successfully."

    # Verify updated data is actually stored
    stored_profile = career_service.get_career_profile()

    assert stored_profile.target_role == "Cloud Engineer"