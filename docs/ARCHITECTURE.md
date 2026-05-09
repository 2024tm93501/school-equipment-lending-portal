# Architecture — School Equipment Lending Portal

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser                                │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │               React Application (Vite)                   │  │
│   │                  localhost:5173                          │  │
│   │                                                          │  │
│   │  ┌──────────────┐    ┌────────────────────────────────┐  │  │
│   │  │  AuthContext │    │  React Router (client-side)    │  │  │
│   │  │  (JWT state) │    │  Protected & public routes     │  │  │
│   │  └──────────────┘    └────────────────────────────────┘  │  │
│   │                                                          │  │
│   │  ┌────────────────────────────────────────────────────┐  │  │
│   │  │          Axios API Clients (src/api/)              │  │  │
│   │  │  authApi  equipmentApi  requestsApi  usersApi      │  │  │
│   │  └──────────────────────┬─────────────────────────────┘  │  │
│   └─────────────────────────┼────────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTP/JSON  (Authorization: Bearer <token>)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI  localhost:8000                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   CORS Middleware  (allow: localhost:5173)               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────┐ ┌───────────┐ ┌──────────┐ ┌───────┐ ┌──────┐  │
│  │ /api/auth  │ │/api/equip │ │/api/reqs │ │/users │ │/dash │  │
│  └────────────┘ └───────────┘ └──────────┘ └───────┘ └──────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Pydantic v2 Validation  │  JWT Auth  │  bcrypt hashing  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           SQLAlchemy 2.0 ORM                             │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
                   ┌──────────────────┐
                   │  SQLite Database │
                   │  school_equip.db │
                   └──────────────────┘
```

---

## Frontend Component Hierarchy

```
main.jsx
└── App.jsx  (BrowserRouter)
    ├── AuthContext.jsx  (global auth state + token management)
    │
    ├── /login  → LoginPage.jsx
    │
    ├── /register  → RegisterPage.jsx
    │
    └── ProtectedRoute  (redirects to /login if not authenticated)
        └── Layout.jsx  (Navbar + Sidebar + main content)
            ├── Navbar.jsx  (top bar with user menu, logout)
            ├── Sidebar.jsx  (role-aware navigation links)
            │
            ├── /  → DashboardPage.jsx
            │       └── StatCard (×4)
            │
            ├── /equipment  → EquipmentPage.jsx
            │       ├── SearchBar
            │       ├── EquipmentCard (×N)
            │       └── BorrowModal  (submit request form)
            │
            ├── /my-requests  → MyRequestsPage.jsx
            │       └── RequestCard (×N)
            │
            ├── /admin/equipment  → AdminEquipmentPage.jsx  [admin]
            │       ├── EquipmentTable
            │       └── EquipmentForm (in Modal — add/edit)
            │
            ├── /admin/requests  → AdminRequestsPage.jsx  [admin]
            │       └── RequestTable (approve/reject/return actions)
            │
            ├── /admin/users  → AdminUsersPage.jsx  [admin]
            │       ├── UserTable
            │       └── UserForm (in Modal — edit role/status)
            │
            └── *  → NotFoundPage.jsx
```

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend framework | React | 19.2 | Component-based UI |
| Frontend routing | React Router DOM | 7.15 | Client-side navigation |
| UI styling | Tailwind CSS | 3.4 | Utility-first CSS |
| Build tool | Vite | 8.0 | Dev server + bundler |
| HTTP client | Axios | 1.16 | REST API calls |
| Backend framework | FastAPI | 0.111 | Async REST API |
| ASGI server | Uvicorn | 0.29 | Production HTTP server |
| ORM | SQLAlchemy | 2.0 | Database abstraction |
| Data validation | Pydantic v2 | 2.7 | Request/response schemas |
| Database | SQLite | — | File-based SQL storage |
| Auth tokens | python-jose | 3.3 | JWT encode/decode |
| Password hashing | bcrypt | 4.1 | Secure password storage |

---

## Authentication Flow

```
1. User submits email + password on LoginPage

2. POST /api/auth/login (form-urlencoded)
   → FastAPI verifies password with bcrypt
   → Creates JWT signed with SECRET_KEY (HS256)
   → Token expires after 1440 minutes (24 hours)

3. Token stored in localStorage via AuthContext

4. Every subsequent API request:
   axios.js adds header: Authorization: Bearer <token>

5. FastAPI dependency (get_current_user):
   → Decodes token → extracts user_id → loads User from DB
   → If token invalid/expired → 401 Unauthorized

6. Axios interceptor:
   → On 401 response → clears token → redirects to /login

7. Logout:
   → Clears token from localStorage
   → React state cleared → redirected to /login
```

---

## Role-Based Access Control

| Feature | Student | Staff | Admin |
|---------|---------|-------|-------|
| Browse equipment | Yes | Yes | Yes |
| Submit borrow request | Yes | Yes | Yes |
| View own requests | Yes | Yes | Yes |
| Approve/reject requests | No | No | Yes |
| Mark equipment returned | No | No | Yes |
| Add/edit/delete equipment | No | No | Yes |
| View all users | No | No | Yes |
| Edit user roles | No | No | Yes |
| View admin dashboard | No | No | Yes |

---

## Data Flow: Submit Borrow Request

```
EquipmentPage
  └── BorrowModal
        └── requestsApi.submitRequest(payload)
              └── POST /api/requests
                    ├── get_current_user dependency → verify JWT
                    ├── Query equipment → check available_qty
                    ├── equipment.available_qty -= quantity_requested
                    ├── INSERT borrow_requests row (status=pending)
                    ├── db.commit()
                    └── Return RequestOut JSON
```

---

## Key Design Decisions

1. **SQLite for storage** — Chosen for zero-config portability in a school assignment context. The same SQLAlchemy code works with PostgreSQL/MySQL by changing `DATABASE_URL` in `.env`.

2. **Soft deletes** — Equipment and users are never hard-deleted; `is_active = false` hides them from listings while preserving FK integrity in existing requests.

3. **Quantity tracking on request events** — `available_qty` is decremented on submit and restored on reject/return. This prevents double-booking without a reservation system.

4. **Admin-only seeding** — Admins can only be created via `seed.py` (not via the registration endpoint). The `UserCreate` schema restricts public registration to `student` and `staff` roles.

5. **JWT in localStorage** — Simpler to implement for a demo project. For production, `httpOnly` cookies would be more secure against XSS.

6. **Monorepo layout** — `backend/` and `frontend/` coexist under a single root for ease of development. In production, these would be deployed independently (e.g., Render + Vercel).
