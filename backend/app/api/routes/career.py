from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.career_profile import CareerProfile
from app.api.dependencies import get_current_user

from app.schemas.career import (
    CareerProfileRequest,
    CareerProfileResponse,
)


router = APIRouter(
    prefix="/career",
    tags=["Career"],
)


# =========================
# Helper
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


# =========================
# Career Profile APIs
# =========================

@router.post(
    "/profile",
    response_model=CareerProfileResponse,
    status_code=201,
)
def create_profile(
    data: CareerProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_profile = (
        db.query(CareerProfile)
        .filter(CareerProfile.user_id == current_user.id)
        .first()
    )

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Career profile already exists.",
        )

    profile = CareerProfile(
        user_id=current_user.id,
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
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(CareerProfile)
        .filter(CareerProfile.user_id == current_user.id)
        .first()
    )

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
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(CareerProfile)
        .filter(CareerProfile.user_id == current_user.id)
        .first()
    )

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