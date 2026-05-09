# School Equipment Lending Portal

A full-stack web application for managing school equipment borrowing, approvals, and returns. Built with React (frontend) and FastAPI (backend) as part of SE ZG503 Full Stack Application Development assignment.

## Features

- **User Authentication** — JWT-based login/signup with roles: student, staff, admin
- **Equipment Catalog** — Browse, search, and filter equipment by category and availability
- **Borrow Requests** — Submit requests with quantity and due date; track status
- **Admin Dashboard** — Approve/reject/return requests, manage equipment and users
- **Role-Based Access** — Students and staff can request; admins manage everything
- **Real-Time Stats** — Dashboard with live counts of equipment and requests

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.10 or higher |
| Node.js | 18 or higher |
| npm | 9 or higher |

## Quick Start (Windows)

Open **two separate terminal windows** and run:

**Terminal 1 — Backend:**
```
start-backend.bat
```

**Terminal 2 — Frontend:**
```
start-frontend.bat
```

Then open `http://localhost:5173` in your browser.

## Manual Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
python run.py
```

Backend starts at `http://localhost:8000`.  
Swagger API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.edu | Admin@123 |
| Staff | staff1@school.edu | Staff@123 |
| Student | student1@school.edu | Student@123 |
| Student | student2@school.edu | Student@123 |

The database is seeded automatically on first run with demo users and 10 equipment items.

## Project Structure

```
FSD/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py           # App setup and CORS
│   │   ├── models.py         # SQLAlchemy models
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   ├── auth.py           # JWT and password utilities
│   │   ├── dependencies.py   # Auth middleware
│   │   ├── database.py       # DB session management
│   │   ├── seed.py           # Demo data seeder
│   │   └── routers/
│   │       ├── auth.py       # /api/auth
│   │       ├── equipment.py  # /api/equipment
│   │       ├── requests.py   # /api/requests
│   │       ├── users.py      # /api/users
│   │       └── dashboard.py  # /api/dashboard
│   ├── requirements.txt
│   └── run.py                # Entry point (seeds + starts server)
│
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── App.jsx           # Routes and protected route logic
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── api/              # Axios API client wrappers
│   │   ├── pages/            # Route-level page components
│   │   ├── components/       # Reusable UI components
│   │   └── utils/            # Constants and formatters
│   └── package.json
│
├── docs/
│   ├── API.md                # REST API reference
│   ├── DATABASE.md           # DB schema and ER diagram
│   └── ARCHITECTURE.md      # System architecture and component hierarchy
│
├── start-backend.bat         # One-click backend startup (Windows)
├── start-frontend.bat        # One-click frontend startup (Windows)
└── README.md
```

## Docker Setup (Backend only)

A `Dockerfile` and `docker-compose.yml` are provided for containerised backend deployment:

```bash
docker-compose up --build
```

Backend starts at `http://localhost:8000`. The SQLite database is persisted in `backend/db/` via a named volume.

> The frontend is not containerised — run it with `npm run dev` as above.

---

## Demo Video

[Watch the demonstration video on Google Drive](https://drive.google.com/file/d/1dijtDvNjFq9NnntfICPodJIdVYKN-AoH/view?usp=sharing)

---

## Documentation

| File | Contents |
|------|----------|
| [docs/API.md](docs/API.md) | All REST endpoints with request/response examples |
| [docs/DATABASE.md](docs/DATABASE.md) | ER diagram and table schema |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, component hierarchy, auth flow, RBAC |
| [docs/WIREFRAMES.md](docs/WIREFRAMES.md) | ASCII wireframes for all 8 screens |
| [docs/ASSUMPTIONS.md](docs/ASSUMPTIONS.md) | Design decisions and technical assumptions |
| [docs/AI_USAGE_LOG.md](docs/AI_USAGE_LOG.md) | AI interaction log (fill in before submission) |
| [docs/REFLECTION_REPORT.md](docs/REFLECTION_REPORT.md) | AI reflection report (fill in before submission) |
| [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) | Step-by-step demo video script |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Tailwind CSS 3, Axios |
| Build Tool | Vite 8 |
| Backend | FastAPI 0.111, Uvicorn |
| ORM | SQLAlchemy 2.0 |
| Database | SQLite (via SQLAlchemy) |
| Auth | JWT (python-jose), bcrypt |
| Validation | Pydantic v2 |
