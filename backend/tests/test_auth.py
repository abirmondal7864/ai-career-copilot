import os

os.environ["TESTING"] = "1"

from app.core.security import verify_password
from app.models.user import User


def test_register_user(client, db_session):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == "test@example.com"
    assert "id" in data

    user = db_session.query(User).filter(
        User.email == "test@example.com"
    ).first()

    assert user is not None
    assert verify_password("password123", user.password_hash)


def test_duplicate_registration_rejected(client):
    payload = {
        "name": "Test User",
        "email": "duplicate@example.com",
        "password": "password123",
    }

    first = client.post("/api/auth/register", json=payload)
    second = client.post("/api/auth/register", json=payload)

    assert first.status_code == 201
    assert second.status_code == 400
    assert second.json()["detail"] == "Email already registered"


def test_login_returns_access_token(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "login@example.com",
            "password": "password123",
        },
    )

    response = client.post(
        "/api/auth/login",
        data={
            "username": "login@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["token_type"] == "bearer"
    assert data["access_token"]
