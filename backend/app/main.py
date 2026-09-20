from fastapi import FastAPI
from app.api.routes.career import router as career_router
from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="AI Career Copilot API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router,prefix="/api")
app.include_router(career_router, prefix="/api")
app.include_router(resume_router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "AI Career Copilot API is running"
    }