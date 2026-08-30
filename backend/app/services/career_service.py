from app.schemas.career import (
    CareerProfileRequest,
    CareerProfileResponse,
)


# Temporary storage.
# We will replace this with a database later.
career_profile = None


def create_career_profile(
    data: CareerProfileRequest,
) -> CareerProfileResponse:

    global career_profile

    career_profile = data

    return CareerProfileResponse(
        **data.model_dump(),
        message="Career profile created successfully.",
    )


def get_career_profile() -> CareerProfileResponse | None:

    if career_profile is None:
        return None

    return CareerProfileResponse(
        **career_profile.model_dump(),
        message="Career profile retrieved successfully.",
    )


def update_career_profile(
    data: CareerProfileRequest,
) -> CareerProfileResponse:

    global career_profile

    career_profile = data

    return CareerProfileResponse(
        **data.model_dump(),
        message="Career profile updated successfully.",
    )