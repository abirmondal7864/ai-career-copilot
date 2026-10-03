# 🚀 AI Career Copilot

AI Career Copilot is a full-stack career assistant that helps candidates understand their career readiness, analyze resumes, identify skill gaps, and generate personalized career guidance.

## ✨ Features

- 🔐 User authentication with JWT
- 📄 Resume upload and AI-powered resume analysis
- 🎯 Career readiness analysis
- 🧠 Skill-gap identification and recommendations
- 📊 Career dashboard and profile persistence
- 🤖 Gemini-powered AI features
- 🗄️ PostgreSQL database with SQLAlchemy and Alembic
- ⚛️ React + Vite frontend
- ⚡ FastAPI backend

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- React Router

**Backend**
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- JWT authentication
- Gemini API

## 📁 Project Structure

```text
ai-career-copilot/
├── backend/
│   ├── app/
│   ├── alembic/
│   └── requirements.txt
└── frontend/
    ├── src/
    ├── package.json
    └── vercel.json
```

## 💻 Local Setup

### 1. Clone

```bash
git clone https://github.com/abirmondal7864/ai-career-copilot.git
cd ai-career-copilot
```

### 2. Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
```

Create `.env` from `.env.example` and set:

- `DATABASE_URL`
- `SECRET_KEY`
- `GEMINI_API_KEY`
- `FRONTEND_URL`

Run migrations:

```bash
alembic upgrade head
```

Start the API:

```bash
uvicorn app.main:app --reload
```

### 3. Frontend

```bash
cd ../frontend
npm install
```

Create `.env` from `.env.example`.

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:8000`

API docs: `http://localhost:8000/docs`

## 🚀 Deployment

### Backend — Render

The repository includes a root-level `render.yaml` Blueprint.

Create a Render PostgreSQL database, then deploy the backend service from this repository using the blueprint. Set these environment variables:

- `DATABASE_URL`
- `SECRET_KEY`
- `GEMINI_API_KEY`
- `FRONTEND_URL`

After deployment, run:

```bash
alembic upgrade head
```

Use the deployed backend URL as the frontend's `VITE_API_URL`.

### Frontend — Vercel

Create a Vercel project from this GitHub repository with:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Set:

```text
VITE_API_URL=https://YOUR-BACKEND-URL
```

The included `frontend/vercel.json` keeps React Router routes working on direct refreshes.

## 🔐 Environment Variables

Never commit real API keys, database passwords, JWT secrets, or production environment files.

Example files are provided as:

- `backend/.env.example`
- `frontend/.env.example`

## 📌 Status

Project is structured for production deployment. Complete the Vercel frontend and Render backend setup, then verify authentication, resume upload, AI analysis, and dashboard flows end-to-end.
