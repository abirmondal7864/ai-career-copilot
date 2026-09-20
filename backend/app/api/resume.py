from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeResponse
from app.api.dependencies import get_current_user

router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)

@router.post("/", response_model=ResumeResponse)
def create_resume(
    file_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),

):
    resume = Resume(
        user_id=current_user.id,
        file_name=file_name,
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume