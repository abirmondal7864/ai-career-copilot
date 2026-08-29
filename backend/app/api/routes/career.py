from fastapi import APIRouter

from app.schemas.career import (
    CareerAnalyzeRequest,
    CareerAnalyzeResponse,
)
from app.services.career_service import analyze_career


router = APIRouter(
    prefix="/career",
    tags=["Career"],
)


@router.post(
    "/analyze",
    response_model=CareerAnalyzeResponse,
)
def analyze(data: CareerAnalyzeRequest):
    return analyze_career(data)