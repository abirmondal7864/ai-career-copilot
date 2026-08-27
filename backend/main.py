from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "AI Career Copilot API is running"}


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "message": "Backend is connected successfully"
    }


@app.get("/api/profile")
def get_profile():
    return {
        "name": "Abir",
        "role": "B.Tech CSE Student",
        "target_year": 2027,
        "goal": "Get a good tech job"
    }