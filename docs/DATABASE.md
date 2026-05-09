# Database Schema — School Equipment Lending Portal

**Database:** SQLite (file: `backend/school_equipment.db`)  
**ORM:** SQLAlchemy 2.0

---

## ER Diagram

```
┌──────────────────────────────┐
│           users              │
├──────────────────────────────┤
│ PK  id           INTEGER     │
│     full_name    VARCHAR(100)│
│     email        VARCHAR(150)│◄─────────────────────────┐
│     hashed_pass  VARCHAR(255)│                          │
│     role         VARCHAR(20) │                          │
│     is_active    BOOLEAN     │                          │
│     created_at   DATETIME    │                          │
└──────────┬───────────────────┘                          │
           │ 1                                            │
           │                                              │
           │ *                                            │
┌──────────▼───────────────────┐   * ┌───────────────────┴──────────┐
│       borrow_requests        │─────►         equipment            │
├──────────────────────────────┤     ├──────────────────────────────┤
│ PK  id              INTEGER  │     │ PK  id           INTEGER     │
│ FK  equipment_id    INTEGER  │     │     name         VARCHAR(150)│
│ FK  user_id         INTEGER  │     │     description  TEXT        │
│     quantity_req    INTEGER  │     │     category     VARCHAR(80) │
│     status          VARCHAR  │     │     total_qty    INTEGER     │
│     reason          TEXT     │     │     available_qty INTEGER    │
│     requested_at    DATETIME │     │     condition    VARCHAR(30) │
│     due_date        DATE     │     │     image_url    VARCHAR(300)│
│     approved_at     DATETIME │     │     is_active    BOOLEAN     │
│     returned_at     DATETIME │     │     created_at   DATETIME    │
│     admin_note      VARCHAR  │     │     updated_at   DATETIME    │
│ FK  approved_by     INTEGER  │     └──────────────────────────────┘
└──────────────────────────────┘
         │ approved_by
         │ (FK → users.id, nullable)
         └────────────────────────────► users
```

### Relationships

| Relationship | Type | Description |
|-------------|------|-------------|
| `users` → `borrow_requests` (user_id) | One-to-Many | A user can have many borrow requests |
| `equipment` → `borrow_requests` | One-to-Many | An equipment item can appear in many requests |
| `users` → `borrow_requests` (approved_by) | One-to-Many | An admin user can approve many requests |

---

## Table: `users`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | INTEGER | No | autoincrement | Primary key |
| `full_name` | VARCHAR(100) | No | — | Display name |
| `email` | VARCHAR(150) | No | — | Unique, indexed |
| `hashed_password` | VARCHAR(255) | No | — | bcrypt hash |
| `role` | VARCHAR(20) | No | `"student"` | `student`, `staff`, or `admin` |
| `is_active` | BOOLEAN | No | `true` | Soft-delete flag |
| `created_at` | DATETIME | No | utcnow | Account creation timestamp |

---

## Table: `equipment`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | INTEGER | No | autoincrement | Primary key |
| `name` | VARCHAR(150) | No | — | Item name |
| `description` | TEXT | Yes | `null` | Optional description |
| `category` | VARCHAR(80) | No | — | E.g. `Photography`, `Sports` |
| `total_quantity` | INTEGER | No | `1` | Total units owned |
| `available_qty` | INTEGER | No | `1` | Units not currently borrowed |
| `condition` | VARCHAR(30) | No | `"good"` | `excellent`, `good`, `fair`, `poor` |
| `image_url` | VARCHAR(300) | Yes | `null` | Optional image URL |
| `is_active` | BOOLEAN | No | `true` | Soft-delete flag |
| `created_at` | DATETIME | No | utcnow | — |
| `updated_at` | DATETIME | No | utcnow | Auto-updated on change |

---

## Table: `borrow_requests`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | INTEGER | No | autoincrement | Primary key |
| `equipment_id` | INTEGER | No | — | FK → `equipment.id` |
| `user_id` | INTEGER | No | — | FK → `users.id` (requester) |
| `quantity_requested` | INTEGER | No | `1` | Units requested |
| `status` | VARCHAR(20) | No | `"pending"` | `pending`, `approved`, `rejected`, `returned` |
| `reason` | TEXT | Yes | `null` | Borrower's reason |
| `requested_at` | DATETIME | No | utcnow | When request was submitted |
| `due_date` | DATE | No | — | Expected return date |
| `approved_at` | DATETIME | Yes | `null` | When admin approved/rejected |
| `returned_at` | DATETIME | Yes | `null` | When item was returned |
| `admin_note` | VARCHAR(300) | Yes | `null` | Admin's note on decision |
| `approved_by` | INTEGER | Yes | `null` | FK → `users.id` (admin who acted) |

---

## Status State Machine

```
                submit
[New Request] ──────────► pending
                              │
               approve ───────┤──────── reject
                              │                │
                              ▼                ▼
                          approved          rejected
                              │
                    return ───┘
                              │
                              ▼
                           returned
```

- On **approve**: status → `approved`, `approved_at` set, `approved_by` set
- On **reject**: status → `rejected`, `available_qty` restored on equipment
- On **return**: status → `returned`, `returned_at` set, `available_qty` restored on equipment

---

## Quantity Tracking

`available_qty` on `equipment` is adjusted at request lifecycle events:

| Event | Effect on `available_qty` |
|-------|--------------------------|
| Request submitted | `- quantity_requested` |
| Request rejected | `+ quantity_requested` |
| Request returned | `+ quantity_requested` |

This ensures the portal prevents over-booking.

---

## Seed Data

The database is seeded on first run by `backend/app/seed.py`:

**Users:**
| Name | Email | Password | Role |
|------|-------|----------|------|
| System Administrator | admin@school.edu | Admin@123 | admin |
| Mr. Ramesh Kumar | staff1@school.edu | Staff@123 | staff |
| Priya Sharma | student1@school.edu | Student@123 | student |
| Arjun Mehta | student2@school.edu | Student@123 | student |

**Equipment (10 items across 5 categories):**
Photography, Lab Equipment, Sports, Musical Instruments, Project Materials
