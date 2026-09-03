from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.career_profile import CareerProfile

from app.schemas.user import UserCreate, UserResponse

from app.schemas.career import (
    CareerProfileRequest,
    CareerProfileResponse,
)


router = APIRouter(
    prefix="/career",
    tags=["Career"],
)


# =========================
# Career Profile APIs
# =========================

def profile_to_response(profile: CareerProfile) -> dict:
    return {
        "name": profile.name,
        "education": profile.education,
        "skills": profile.skills.split(",") if profile.skills else [],
        "projects": profile.projects.split(",") if profile.projects else [],
        "experience": (
            profile.experience.split(",")
            if profile.experience
            else []
        ),
        "target_role": profile.target_role,
        "years_experience": profile.years_experience,
        "message": "Career profile retrieved successfully.",
    }


@router.post(
    "/profile",
    response_model=CareerProfileResponse,
    status_code=201,
)
def create_profile(
    data: CareerProfileRequest,
    db: Session = Depends(get_db),
):
    profile = CareerProfile(
        name=data.name,
        education=data.education,
        skills=",".join(data.skills),
        projects=",".join(data.projects),
        experience=",".join(data.experience),
        target_role=data.target_role,
        years_experience=data.years_experience,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    response = profile_to_response(profile)
    response["message"] = "Career profile created successfully."

    return response


@router.get(
    "/profile",
    response_model=CareerProfileResponse,
)
def get_profile(
    db: Session = Depends(get_db),
):
    profile = db.query(CareerProfile).first()

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Career profile not found.",
        )

    return profile_to_response(profile)


@router.put(
    "/profile",
    response_model=CareerProfileResponse,
)
def update_profile(
    data: CareerProfileRequest,
    db: Session = Depends(get_db),
):
    profile = db.query(CareerProfile).first()

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Career profile not found.",
        )

    profile.name = data.name
    profile.education = data.education
    profile.skills = ",".join(data.skills)
    profile.projects = ",".join(data.projects)
    profile.experience = ",".join(data.experience)
    profile.target_role = data.target_role
    profile.years_experience = data.years_experience

    db.commit()
    db.refresh(profile)

    response = profile_to_response(profile)
    response["message"] = "Career profile updated successfully."

    return response

# =========================
# User APIs
# =========================

@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
):
    users = db.query(User).all()

    return {
        "count": len(users),
        "users": [
            {
                "id": user.id,
                "email": user.email,
                "name": user.name,
            }
            for user in users
        ],
    }


@router.post(
    "/users",
    response_model=UserResponse,
    status_code=201,
)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )

    user = User(
        name=user_data.name,
        email=user_data.email,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user