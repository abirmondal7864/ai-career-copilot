from dotenv import load_dotenv

load_dotenv()

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from app.api.routes.career import router as career_router


app = FastAPI(
    title="AI Career Copilot API",
    version="1.0.0",
)

frontend_urls = [
    url.strip()
    for url in os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")
    if url.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_origin_regex=r"^https://ai-career-copilot.*\\.vercel\\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/api")
app.include_router(career_router, prefix="/api")
app.include_router(resume_router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "AI Career Copilot API is running"
    }
