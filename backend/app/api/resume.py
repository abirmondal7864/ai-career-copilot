import os
import tempfile

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeResponse
from app.api.dependencies import get_current_user
from app.services.pdf_parser import extract_text_from_pdf


router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)


@router.post("/", response_model=ResumeResponse)
async def create_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed",
        )

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_file_path = temp_file.name

    try:
        extracted_text = extract_text_from_pdf(temp_file_path)

        resume = Resume(
            user_id=current_user.id,
            file_name=file.filename or "resume.pdf",
            content=extracted_text,
        )

        db.add(resume)
        db.commit()
        db.refresh(resume)

        return resume

    finally:
        os.remove(temp_file_path)