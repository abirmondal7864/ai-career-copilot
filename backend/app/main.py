from fastapi import FastAPI

from app.api.routes.career import router as career_router


app = FastAPI(
    title="AI Career Copilot API",
    version="1.0.0",
)


app.include_router(
    career_router,
    prefix="/api/v1",
)


@app.get("/")
def root():
    return {
        "message": "AI Career Copilot API is running"
    }