from fastapi import FastAPI
from app.api.routes.career import router as career_router
from app.api.auth import router as auth_router


app = FastAPI(
    title="AI Career Copilot API",
    version="1.0.0",
)


app.include_router(auth_router,prefix="/api")

app.include_router(career_router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "AI Career Copilot API is running"
    }