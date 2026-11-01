# 🚀 AI Career Copilot

> An AI-powered career assistant that analyzes resumes, evaluates career readiness, identifies skill gaps, and generates personalized career guidance.

[![Live App](https://img.shields.io/badge/Live%20App-Open-success)](https://ai-career-copilot-six-plum.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://ai-career-copilot-six-plum.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-purple)](https://ai-career-copilot-k4d0.onrender.com)
[![CI](https://github.com/abirmondal7864/ai-career-copilot/actions/workflows/ci.yml/badge.svg)](https://github.com/abirmondal7864/ai-career-copilot/actions/workflows/ci.yml)

## ✨ Features

- 🔐 JWT-based registration and login
- 👤 Persistent career profile management
- 📄 PDF resume upload and text extraction
- 🤖 Gemini-powered resume and career analysis
- 🎯 Career readiness scoring
- 🧠 Skill-gap detection and recommended skills
- 🗺️ Personalized roadmap and project recommendations
- 📊 Dashboard for career insights
- 🧪 Automated backend tests with coverage enforcement
- ⚙️ GitHub Actions CI for frontend and backend
- 🚀 Production deployment with Vercel + Render + PostgreSQL

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      React + Vite    │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │ HTTPS / REST
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │      REST API        │
                    ├──────────────────────┤
                    │ JWT Authentication   │
                    │ Career Profile APIs  │
                    │ Resume APIs          │
                    │ Gemini AI Services   │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │     PostgreSQL       │
                    │ SQLAlchemy + Alembic │
                    └──────────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | FastAPI, Python |
| Database | PostgreSQL |
| ORM / Migrations | SQLAlchemy, Alembic |
| Authentication | JWT |
| AI | Gemini API |
| Testing | Pytest, Coverage |
| CI/CD | GitHub Actions, Vercel, Render |

## 🔌 Core API

All protected endpoints require a valid JWT access token.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/career/profile` | Create career profile |
| GET | `/api/career/profile` | Read current user's profile |
| PUT | `/api/career/profile` | Update current user's profile |
| POST | `/api/career/analyze` | Generate career analysis |
| POST | `/api/resume/` | Upload PDF resume |
| GET | `/api/resume/` | List current user's resumes |
| POST | `/api/resume/analyze` | Analyze a selected resume |

Swagger/OpenAPI is available at:

**Production:** https://ai-career-copilot-k4d0.onrender.com/docs  
**Local:** http://localhost:8000/docs

## 📁 Project Structure

```text
ai-career-copilot/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── alembic/
│   ├── tests/
│   └── requirements.txt
└── frontend/
    ├── src/
    ├── package.json
    └── vercel.json
```

## 💻 Run Locally

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
.venv\\Scripts\\activate

# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Create `backend/.env`:

```env
DATABASE_URL=your_postgresql_url
SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:8000
- Swagger: http://localhost:8000/docs

## 🧪 Testing

Run backend tests:

```bash
cd backend
pytest -v
```

Run with coverage:

```bash
pytest --cov=app --cov-report=term-missing --cov-fail-under=90
```

Frontend CI runs:

```bash
npm ci
npm run lint
npm run build
```

GitHub Actions runs these checks automatically for pushes and pull requests targeting `main`.

## 🔄 CI/CD Flow

The workflow runs on pushes to `main` and pull requests targeting `main`.

```text
                   Push to main
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      GitHub Actions          Deployment platforms
             │                     │
       ┌─────┴─────┐         ┌─────┴─────┐
       ▼           ▼         ▼           ▼
   Frontend     Backend   Vercel      Render
   ESLint       Syntax    React       FastAPI
   Build        Pytest    deployment  deployment
                Coverage
                ≥ 90%
```

**Important deployment detail:** Vercel and Render are connected to the GitHub repository and configured to deploy from `main` automatically when commits are pushed. The current setup runs CI checks and platform deployments from the same push; it does **not** configure deployment as a job that waits for GitHub Actions to pass. Pull requests run CI checks, while production auto-deploy is configured for commits to `main`.

## 🚀 Production

- **Live App:** https://ai-career-copilot-six-plum.vercel.app
- **API:** https://ai-career-copilot-k4d0.onrender.com
- **Repository:** https://github.com/abirmondal7864/ai-career-copilot

Vercel and Render are both configured for automatic deployments from the repository's `main` branch. Check the platform dashboards for the latest deployment status.

## 🔐 Security

Never commit:

- API keys
- Database credentials
- JWT secrets
- Production environment files

Use environment variables and `.env.example` files for local configuration.

Protected resources are scoped to the authenticated user, so one user's career profile or resumes cannot be accessed through another user's JWT.

## 📋 Production Smoke Test

After deployment, verify the main user flow with a fresh test account:

1. Register
2. Login
3. Create career profile
4. GET profile and confirm the saved data
5. PUT profile and confirm the updated data
6. Run career analysis
7. Upload a PDF resume
8. GET resumes and confirm only the current user's resumes appear
9. Run resume analysis
10. Refresh the app and confirm authentication/profile state persists
11. Confirm invalid/expired authentication is rejected

## 📌 Project Status

The application is deployed on Vercel and Render. Automated CI checks have passed for the latest verified GitHub Actions run. The production smoke-test checklist above is provided for manual end-to-end verification; completing CI does not by itself prove every live user flow.

Built as a practical full-stack + AI application to demonstrate REST API design, authentication, database migrations, automated testing, CI/CD configuration, cloud deployment, and LLM-powered career features.
