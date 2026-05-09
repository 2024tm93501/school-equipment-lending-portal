# Demo Video Script — School Equipment Lending Portal

**Total target length:** 6–8 minutes  
**Recording tool:** OBS Studio, Loom, or Windows Game Bar (Win + G)  
**Before recording:** Start backend (`start-backend.bat`) and frontend (`start-frontend.bat`). Open browser to `http://localhost:5173`. Clear any previous session (log out). Have the app and this script side by side.

---

## Part 1 — Introduction (0:00 – 0:45)

**Show:** Browser with the login page open.

**Say:**
> "This is the School Equipment Lending Portal — a full-stack web application built for SE ZG503. The problem it solves is: schools manage shared equipment like cameras, lab instruments, and sports gear manually, which leads to double-bookings and missing records. This portal digitises the entire workflow — from students requesting equipment, to admin approving and tracking returns.
>
> The frontend is built with React 19 and Tailwind CSS. The backend is a FastAPI REST API with SQLAlchemy and SQLite. Authentication uses JWT tokens with role-based access for students, staff, and admins."

---

## Part 2 — Student Workflow (0:45 – 2:30)

### 2a. Register a new account (0:45 – 1:15)

**Action:** Click "Register here" on the login page.

**Say:**
> "Let me first register a new student account to show the sign-up flow."

**Action:** Fill in:
- Full Name: `Demo Student`
- Email: `demo@school.edu`
- Role: `Student`
- Password: `Demo@123`

Click "Create Account".

**Say:**
> "Registration is instant. The role dropdown only shows Student and Staff — admin accounts can only be created through the seed script to prevent privilege escalation."

### 2b. Browse equipment (1:15 – 1:45)

**Action:** After login, you are on the Dashboard. Point to the stat cards.

**Say:**
> "The dashboard shows real-time stats — total equipment, available items, and pending requests. For a student, it also shows their own active borrows."

**Action:** Click "Browse Equipment" or navigate to Equipment in the sidebar.

**Say:**
> "Here is the equipment catalog. I can search by name, filter by category, or show only available items."

**Action:** Type "camera" in the search box. Then clear it. Then click the Category dropdown and select "Lab Equipment".

### 2c. Submit a borrow request (1:45 – 2:30)

**Action:** Click "Borrow Now" on the DSLR Camera card.

**Say:**
> "Clicking Borrow Now opens a modal. I select the quantity — it caps at the available quantity — and set a return due date."

**Action:** Set quantity to 1, pick a date 10 days from today, add reason "Photography assignment", click Submit Request.

**Say:**
> "The request is submitted and status is immediately Pending. The available quantity on the equipment card has already decreased by 1 — the system reserves it on submission to prevent double-booking."

**Action:** Navigate to "My Requests" in the sidebar. Show the pending request.

**Say:**
> "In My Requests I can track all my submissions filtered by status — pending, approved, rejected, or returned."

---

## Part 3 — Admin Workflow (2:30 – 5:00)

### 3a. Log in as admin (2:30 – 2:50)

**Action:** Click Logout (top right). Log in with `admin@school.edu` / `Admin@123`.

**Say:**
> "Now I'll log in as an administrator. Notice the sidebar has additional admin sections: Manage Equipment, Manage Requests, and Manage Users."

**Action:** Point to the dashboard — highlight the "Total Users" stat card that's specific to admin.

### 3b. Approve the student's request (2:50 – 3:30)

**Action:** Click "Manage Requests" in the sidebar.

**Say:**
> "Here the admin sees all requests across all users. I can filter by status. The request from Demo Student for the DSLR Camera is showing as Pending."

**Action:** Click the Approve button (tick icon) on the pending request.

**Say:**
> "I can optionally add a note before approving. I'll add: 'Approved for this week'."

**Action:** Add the note and confirm. Show the request is now Approved.

**Say:**
> "Status is now Approved. If the item is returned later, the admin clicks Return here and the available quantity is restored."

### 3c. Manage equipment (3:30 – 4:15)

**Action:** Click "Manage Equipment".

**Say:**
> "The admin can add, edit, or deactivate equipment items. Let me add a new item."

**Action:** Click "+ Add Equipment". Fill in:
- Name: `Drone (DJI Mini 3)`
- Category: `Photography`
- Quantity: `2`
- Condition: `Excellent`

Click Save.

**Say:**
> "The new item appears in the table immediately. I can also edit existing items — for example, if a multimeter gets damaged I'd update its condition to 'Poor'."

**Action:** Click the edit icon on Digital Multimeter. Change condition to "Fair". Save.

### 3d. Manage users (4:15 – 5:00)

**Action:** Click "Manage Users".

**Say:**
> "The admin can view all registered users, search by name or email, filter by role, and update a user's role or active status. For example, if a student graduates, the admin can deactivate their account — a soft delete that preserves all their borrow history."

**Action:** Click the edit icon on any user. Show the role/status fields. Do not save — cancel.

---

## Part 4 — API Documentation Callout (5:00 – 5:30)

**Action:** Open a new tab. Navigate to `http://localhost:8000/docs`.

**Say:**
> "FastAPI automatically generates interactive Swagger documentation. Every endpoint is listed here — you can expand them, see the request/response schema, and even try calls directly from the browser. I've also documented all endpoints in markdown format in the docs/API.md file in the repository."

**Action:** Expand one endpoint (e.g. POST /api/requests) to show the schema.

---

## Part 5 — Architecture Callout (5:30 – 6:15)

**Action:** Open VS Code or a file explorer showing the project structure, or show the docs/ARCHITECTURE.md file.

**Say:**
> "The project follows a clean separation of concerns. The React frontend communicates with the FastAPI backend over REST. Pydantic validates all request and response data. SQLAlchemy maps Python classes to the SQLite database tables. JWT tokens are issued at login and validated on every protected request.
>
> Role-based access is enforced at both layers — the React router hides admin pages from the UI, and the FastAPI dependency system rejects admin-only requests from non-admin tokens at the API level."

---

## Part 6 — Closing (6:15 – 6:45)

**Action:** Navigate back to the equipment page. Show a quick search and filter.

**Say:**
> "To summarise: the portal covers the complete borrowing lifecycle — register, browse, request, approve, and return — with a clean responsive UI and a well-structured REST API. The full source code, API documentation, database schema, and architecture documentation are available in the GitHub repository linked in the submission."

---

## Recording Tips

- **Use browser zoom 110–125%** so UI elements are clearly visible.
- **Speak at a steady pace** — not too fast. Evaluators watch these in one sitting.
- **Pause briefly** after each action before narrating what happened.
- **Do not edit out small mistakes** — a natural demo is more credible than a heavily cut one.
- **Record at 1080p** if possible, or at least 720p.
- **Background:** Close other browser tabs. Use a clean desktop.
- **Length check:** Aim for 6–7 minutes. Under 5 is too brief; over 10 loses the evaluator.
- **Upload:** Upload to Google Drive and set sharing to "Anyone with BITS email ID can view" as per the assignment instructions.
