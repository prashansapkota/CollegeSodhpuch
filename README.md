# CollegeSodhpuch

Initial full-stack starter for international university and visa guidance.

## Stack
- Frontend: Next.js (App Router, TypeScript)
- Backend: FastAPI (async), SQLAlchemy ORM, JWT auth
- Database: PostgreSQL
- AI Layer: CrewAI-ready stubs
- Containerization: Docker Compose

## Quick Start (Docker)
1. Copy environment file:
   ```bash
   cp .env.example .env
   ```
2. Start services:
   ```bash
   docker compose up --build
   ```
3. Open:
   - Frontend: http://localhost:3000
   - Backend docs: http://localhost:8000/docs

## Create First User
Use API docs to create an account:
- `POST /api/auth/register`

Example payload:
```json
{
  "email": "student@example.com",
  "full_name": "Student User",
  "password": "StrongPassword123"
}
```

Then login from frontend `/login` and access `/dashboard`.

## Local Development (without Docker)
### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
# update POSTGRES_HOST=localhost in .env
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure
- `backend/`: FastAPI app and auth
- `frontend/`: Next.js app router UI
- `ai/`: Multi-agent placeholder modules
