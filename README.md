# 🚀 AI Career Copilot

> An AI-powered career assistant that analyzes resumes, evaluates career readiness, identifies skill gaps, and generates personalized career guidance.

[![Live App](https://img.shields.io/badge/Live%20App-Open-success)](https://ai-career-copilot-six-plum.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://ai-career-copilot-six-plum.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-purple)](https://ai-career-copilot-k4d0.onrender.com)

## ✨ What It Does

- 🔐 JWT-based authentication
- 📄 Resume upload and AI-powered analysis
- 🎯 Career readiness scoring
- 🧠 Skill-gap detection and recommended skills
- 🗺️ Personalized career roadmap and project recommendations
- 👤 Persistent career profile and dashboard
- 🤖 Gemini-powered AI features

## 🧩 Architecture

```text
React + Vite
     │
     ▼
FastAPI REST API
     │
     ├── JWT Authentication
     ├── Career & Resume APIs
     └── Gemini AI integration
     │
     ▼
PostgreSQL
     │
SQLAlchemy + Alembic
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
| Deployment | Vercel, Render |

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

## 💻 Run Locally

### Backend

```bash
git clone https://github.com/abirmondal7864/ai-career-copilot.git
cd ai-career-copilot/backend

python -m venv .venv

# Windows
.venv\\Scripts\\activate

# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Create `backend/.env` with:

```env
DATABASE_URL=your_postgresql_url
SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:5173
```

### Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
API: `http://localhost:8000`  
Swagger: `http://localhost:8000/docs`

## 🔐 Security

Never commit real API keys, database credentials, JWT secrets, or production environment files.

Use the provided `.env.example` files for local configuration.

## 🚀 Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** PostgreSQL

Production deployment has been tested across authentication, API routing, database migrations, and frontend/backend integration.

## 📌 Status

**Production-ready portfolio project.**

Built as a practical full-stack + AI application to explore how LLM-powered features can be integrated into a real web product.
