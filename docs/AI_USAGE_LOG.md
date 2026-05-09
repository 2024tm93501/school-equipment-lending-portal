# AI Usage Log — SE ZG503 Assignment

**Student:** ASHIS D  
**ID:** 2024TM93501  
**AI Tool Used:** Claude (Claude Code CLI)  
**Approach:** Option A — Build with AI assistance and reflect on usage

---

## Session 1 — Tech Stack Decision + Backend Scaffolding

**Date:** 2 May 2026  
**Goal:** Kick off the project and decide the tech stack, then build the initial backend structure

**Prompt given to AI:**
> "I want to build an end to end full stack web application with proper segregation of concerns. The requirements are in a text file — build it based on that."

**What AI produced:**
> Claude read the requirements and asked two clarifying questions before generating any code: (1) which frontend framework to use — React, Vue, or Angular, and (2) which backend language — Python, Node.js, Java, or .NET.

**My follow-up prompts:**
> "Use React for frontend and Python FastAPI for backend."  
> (Claude then asked about the database) "Keep the database simple, use SQLAlchemy."  
> (Claude then asked about UI styling — Tailwind CSS, plain CSS, or a component library like Material UI) "Use Tailwind CSS."

**What AI produced after the tech decisions:**
> Generated the full backend folder structure under `backend/app/`: `models.py` with SQLAlchemy models for User, Equipment, and BorrowRequest with all fields and relationships; `database.py` for engine and session setup; `auth.py` with JWT token creation using python-jose and bcrypt for password hashing; `dependencies.py` with `get_current_user` and `require_admin` FastAPI dependency functions; `schemas.py` with Pydantic v2 request and response schemas; `main.py` with the FastAPI app and CORS middleware; `requirements.txt` with all backend dependencies.

**Changes I made after:**
> Token expiry was set to 30 minutes which would log students out too quickly mid-session — changed `ACCESS_TOKEN_EXPIRE_MINUTES` in `.env` to 1440 (24 hours). Also added a `utcnow()` helper in `models.py` because `datetime.utcnow` was showing a deprecation warning in Python 3.12+.

**Issues encountered:**
> The generated Pydantic validators used the old v1 `@validator` decorator. Since the project was using Pydantic v2, I had to update all validators in `schemas.py` to use `@field_validator` with `@classmethod`.

---

## Session 2 — API Routers

**Date:** 3 May 2026  
**Goal:** Build all REST API endpoints with proper validation and role-based access

**Prompt given to AI:**
> "Now build all the API routers. Auth should have register, login, and get current user. Equipment needs full CRUD but only admins can add, edit, or delete. Borrow requests need submit, list my requests, list all requests for admin, approve, reject, and mark as returned. Also a dashboard stats endpoint."

**What AI produced:**
> Generated five router files in `backend/app/routers/`: `auth.py` (register, login with OAuth2PasswordRequestForm, /me), `equipment.py` (list with search and category filter, get by id, create, update, delete), `requests.py` (submit, get my requests, get all, approve, reject, return), `users.py` (list, get, update, deactivate — admin only), `dashboard.py` (stats endpoint returning different data based on caller role). All endpoints had proper HTTP status codes and used the Pydantic schemas from `schemas.py`.

**Changes I made after:**
> The borrow requests endpoint was returning raw SQLAlchemy model objects which failed serialisation because `equipment_name` and `user_name` are relationship fields, not direct columns. Asked Claude to add a `_build_request_out()` helper function that explicitly pulls those fields from the loaded relationships. Also asked to add pagination (`skip` and `limit`) on all list endpoints.

**Issues encountered:**
> The admin requests list endpoint initially had no search capability — you could only filter by status or equipment ID. Asked Claude to add a `search` parameter that does a joined query across Equipment name and User full name using SQLAlchemy `ilike`.

---

## Session 3 — Database Seeding and Testing the Backend

**Date:** 4 May 2026  
**Goal:** Pre-populate the database with realistic demo data and verify the API works

**Prompt given to AI:**
> "Create a seed script with one admin user, some students and staff, and around 10 equipment items across different categories. It should be safe to re-run without duplicating records. Also integrate it so it runs automatically when the server starts."

**What AI produced:**
> Generated `seed.py` with 4 demo users (1 admin, 1 staff, 2 students) and 10 equipment items. Used `db.query(...).filter(...).first()` checks before each insert to make it idempotent. Updated `run.py` to call `seed()` before starting Uvicorn so demo data is always ready on fresh runs.

**Changes I made after:**
> The initial equipment list only had lab and sports items. Asked Claude to add photography equipment and musical instruments to make the demo more interesting across different school departments. Also checked that the admin account email and password were sensible for a demo — kept `admin@school.edu` / `Admin@123` as it's easy to remember when showing the evaluator.

**Issues encountered:**
> Tested the backend manually via the Swagger UI at `http://localhost:8000/docs`. The login endpoint expects `application/x-www-form-urlencoded` (because it uses OAuth2PasswordRequestForm) but I initially tried sending JSON — got a 422 error. This is just how FastAPI's OAuth2 form works; the frontend handles it correctly via Axios `URLSearchParams`.

---

## Session 4 — React Frontend Setup

**Date:** 6 May 2026  
**Goal:** Set up the React project with routing, authentication state, and API client

**Prompt given to AI:**
> "Now let's build the frontend. Set up a Vite React project with Tailwind CSS already configured. Add React Router for client-side routing with protected routes that redirect to login if not authenticated. Set up an AuthContext to manage the JWT token and current user globally. And create an Axios instance that automatically attaches the Bearer token to every request."

**What AI produced:**
> Scaffolded the full frontend structure: `main.jsx`, `App.jsx` with BrowserRouter and a `ProtectedRoute` wrapper component, `AuthContext.jsx` with login/logout functions and token persistence in localStorage, `src/api/axios.js` with a request interceptor that adds the `Authorization: Bearer` header and a response interceptor that clears the token and redirects to `/login` on 401. Also generated `tailwind.config.js`, `postcss.config.js`, and updated `index.css` with Tailwind's base directives.

**Changes I made after:**
> On first load the app was briefly showing the login page even when a valid token existed in localStorage, because the AuthContext hadn't finished verifying the token yet. Asked Claude to add an `isLoading` state that shows a full-page spinner until the `/api/auth/me` check completes, which fixed the flicker.

**Issues encountered:**
> The Axios 401 interceptor was causing an infinite redirect loop — when the app loaded and called `/api/auth/me` to verify the stored token, if the token was expired the 401 triggered the interceptor which redirected to `/login`, which then called `/api/auth/me` again. Fixed by checking the request URL inside the interceptor and skipping the redirect for auth endpoints.

---

## Session 5 — Frontend Pages and Components

**Date:** 7 May 2026  
**Goal:** Build all application pages and a reusable component library

**Prompt given to AI:**
> "Build all the pages now. Login and Register pages. A dashboard with stat cards showing equipment counts and request stats. An equipment catalog page with search, category filter, availability filter, and a borrow modal. A My Requests page with status tabs. Admin pages for managing equipment, requests, and users — all with tables and modals for edit actions. Keep the components modular and reusable across pages."

**What AI produced:**
> Generated all 9 pages (`LoginPage`, `RegisterPage`, `DashboardPage`, `EquipmentPage`, `MyRequestsPage`, `AdminEquipmentPage`, `AdminRequestsPage`, `AdminUsersPage`, `NotFoundPage`) and a full reusable component library organised into `common/` (`Button`, `Modal`, `SearchBar`, `Spinner`, `EmptyState`, `Badge`, `StatCard`), `layout/` (`Layout`, `Navbar`, `Sidebar`), `equipment/` (`EquipmentCard`, `EquipmentTable`, `EquipmentForm`), `requests/` (`BorrowModal`, `RequestCard`, `RequestTable`), and `users/` (`UserTable`, `UserForm`). Also generated all 5 API client files in `src/api/`.

**Changes I made after:**
> The `BorrowModal` quantity input had no maximum — a user could type any number even if only 1 unit was available. Added `max={equipment.available_qty}` to cap it. Also the demo credentials were hidden in a tooltip on the login page which was not obvious — moved them to a visible info card so they're easy to find during the demo. Asked Claude to add role-aware navigation in the Sidebar so admin links only appear to admin users.

**Issues encountered:**
> The `AdminRequestsPage` initially showed all requests in a single flat table with no way to filter. This made it hard to see which requests needed action. Asked Claude to add status tabs (All / Pending / Approved / Rejected / Returned) with a highlighted badge on Pending so admins can immediately see what needs attention.

---

## Session 6 — Project Setup and Documentation

**Date:** 9 May 2026  
**Goal:** Add missing project setup files, startup scripts, and full documentation

**Prompt given to AI:**
> "analyse the directory some progress has been done to create a project. few steps are missing can you complete it"  
> (followed by) "complete entire setup"

**What AI produced:**
> Analysed the entire codebase and identified what was missing for a complete submittable project. Created: `README.md` with full setup instructions and demo credentials, root `.gitignore` covering Python/Node/IDE artifacts, `start-backend.bat` and `start-frontend.bat` Windows startup scripts, `docs/API.md` documenting all 15 endpoints, `docs/DATABASE.md` with ASCII ER diagram and column schemas, `docs/ARCHITECTURE.md` with system architecture diagram and component hierarchy.

**Changes I made after:**
> Accepted all files as generated. The `start-backend.bat` initially used a hardcoded Python path from the original script — Claude detected this and rewrote it to auto-detect Python via the `py` launcher.

**Issues encountered:**
> Running `start-backend.bat` failed with "Python was not found" because `python` was not in the system PATH. Claude updated the script to try `py`, `python3`, and the known local path in sequence.

---

## Session 7 — Fixing Python 3.14 Compatibility

**Date:** 9 May 2026  
**Goal:** Fix pip install failure when setting up the virtual environment

**Prompt given to AI:**
> (Pasted the full error output from the terminal showing pydantic-core failing to build a wheel for Python 3.14 due to missing MSVC linker)

**What AI produced:**
> Diagnosed that `pydantic-core==2.7.1` (released April 2024) had no pre-built wheel for Python 3.14 and required a C++ compiler to build from source. Updated `requirements.txt` to use minimum version constraints (`pydantic[email]>=2.10.0`, `fastapi>=0.115.0`, `uvicorn>=0.32.0`, etc.) that ship with Python 3.14 wheels. Deleted the broken venv so a clean one would be created on the next run.

**Changes I made after:**
> Accepted the fix as-is. After deleting the venv and re-running `start-backend.bat`, all dependencies installed successfully.

**Issues encountered:**
> The version upgrade from pydantic 2.7 to 2.10 was a concern — pydantic v2 has had some breaking changes between minor versions. Verified that all the existing `@field_validator` and `model_config` patterns in `schemas.py` were compatible with 2.10 before accepting.

---

## Session 8 — Submission Documents

**Date:** 9 May 2026  
**Goal:** Create all remaining assignment deliverables

**Prompt given to AI:**
> "can you help me with assignment submission documents and to present the app in demo video"

**What AI produced:**
> Created `docs/ASSUMPTIONS.md` (17 documented design decisions), `docs/WIREFRAMES.md` (ASCII wireframes for all 8 screens), template structure for `docs/AI_USAGE_LOG.md` and `docs/REFLECTION_REPORT.md`, and `docs/DEMO_SCRIPT.md` with a complete 6-part narrated storyboard, timing estimates, and recording tips.

**Changes I made after:**
> The AI correctly declined to auto-fill the reflection and log entries, explaining that doing so would violate the assignment's academic integrity policy. Filled in the log entries manually based on the actual session history.

**Issues encountered:**
> No technical issues in this session.

---

## Summary Table

| Session | Area | AI Contribution | What I Verified / Changed |
|---------|------|----------------|---------------------------|
| 1 | Backend scaffolding | Models, auth, JWT setup | Fixed deprecated `utcnow`, updated to pydantic v2 validators |
| 2 | API routers | All 5 routers with CRUD + role checks | Added `_build_request_out()`, added search filter |
| 3 | Database seeding | Seed script with idempotent inserts | Adjusted equipment categories |
| 4 | Frontend setup | Vite, AuthContext, Axios interceptors | Fixed 401 redirect loop |
| 5 | UI pages & components | All 9 pages, 20+ components | Fixed BorrowModal quantity cap, added status tabs |
| 6 | Setup & docs | README, .gitignore, scripts, API/DB/arch docs | Accepted; script auto-detect Python fix applied |
| 7 | Python 3.14 fix | requirements.txt version upgrade | Verified pydantic v2 API compatibility |
| 8 | Submission docs | Wireframes, assumptions, demo script | Filled in log/reflection manually |
