from fastapi import APIRouter, HTTPException

from app.schemas.career import (
    CareerProfileRequest,
    CareerProfileResponse,
)
from app.services.career_service import (
    create_career_profile,
    get_career_profile,
    update_career_profile,
)


router = APIRouter(
    prefix="/career",
    tags=["Career"],
)


@router.post(
    "/profile",
    response_model=CareerProfileResponse,
)
def create_profile(data: CareerProfileRequest):

    return create_career_profile(data)


@router.get(
    "/profile",
    response_model=CareerProfileResponse,
)
def get_profile():

    profile = get_career_profile()

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Career profile not found.",
        )

    return profile


@router.put(
    "/profile",
    response_model=CareerProfileResponse,
)
def update_profile(data: CareerProfileRequest):

    return update_career_profile(data)