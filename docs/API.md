# API Reference — School Equipment Lending Portal

Base URL: `http://localhost:8000/api`

All protected endpoints require the header:
```
Authorization: Bearer <access_token>
```

---

## Authentication (`/api/auth`)

### POST /api/auth/register
Register a new student or staff account.

**Request body:**
```json
{
  "full_name": "Priya Sharma",
  "email": "priya@school.edu",
  "password": "Secret@123",
  "role": "student"
}
```
- `role`: `"student"` or `"staff"` (admin accounts are seeded only)
- `password`: minimum 6 characters

**Response `201`:**
```json
{
  "id": 5,
  "full_name": "Priya Sharma",
  "email": "priya@school.edu",
  "role": "student",
  "is_active": true,
  "created_at": "2026-05-09T10:00:00"
}
```

**Errors:** `400` email already registered

---

### POST /api/auth/login
Login and receive a JWT access token.

**Request body** (`application/x-www-form-urlencoded`):
```
username=admin@school.edu&password=Admin@123
```

**Response `200`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "full_name": "System Administrator",
    "email": "admin@school.edu",
    "role": "admin",
    "is_active": true,
    "created_at": "2026-05-09T08:00:00"
  }
}
```

**Errors:** `401` invalid credentials, `403` account inactive

---

### GET /api/auth/me
Get the currently authenticated user's profile.

**Auth:** Required

**Response `200`:** Same as `UserOut` schema above.

---

## Equipment (`/api/equipment`)

### GET /api/equipment
List equipment with optional filters and pagination.

**Auth:** Required

**Query parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Filter by name or description (case-insensitive) |
| `category` | string | Filter by exact category |
| `available_only` | boolean | If `true`, only return items with `available_qty > 0` |
| `skip` | int | Pagination offset (default `0`) |
| `limit` | int | Items per page, max 100 (default `20`) |

**Response `200`:**
```json
{
  "total": 10,
  "equipment": [
    {
      "id": 1,
      "name": "DSLR Camera (Canon EOS 1500D)",
      "description": "Canon EOS 1500D with 18-55mm kit lens",
      "category": "Photography",
      "total_quantity": 3,
      "available_qty": 2,
      "condition": "good",
      "image_url": null,
      "is_active": true,
      "created_at": "2026-05-09T08:00:00",
      "updated_at": "2026-05-09T08:00:00"
    }
  ]
}
```

---

### GET /api/equipment/{equipment_id}
Get a single equipment item by ID.

**Auth:** Required

**Response `200`:** Single `EquipmentOut` object.

**Errors:** `404` not found

---

### POST /api/equipment
Create a new equipment item.

**Auth:** Admin only

**Request body:**
```json
{
  "name": "Projector - Epson EB-X51",
  "description": "3LCD projector, 3800 lumens",
  "category": "Presentation",
  "total_quantity": 4,
  "condition": "excellent",
  "image_url": null
}
```
- `condition`: `"excellent"` | `"good"` | `"fair"` | `"poor"`

**Response `201`:** Created `EquipmentOut` object.

---

### PUT /api/equipment/{equipment_id}
Update an equipment item (partial update).

**Auth:** Admin only

**Request body** (all fields optional):
```json
{
  "name": "Updated Name",
  "condition": "fair",
  "is_active": false
}
```

**Response `200`:** Updated `EquipmentOut` object.

**Errors:** `404` not found

---

### DELETE /api/equipment/{equipment_id}
Deactivate an equipment item (soft delete — sets `is_active = false`).

**Auth:** Admin only

**Response `200`:** Deactivated `EquipmentOut` object.

**Errors:** `404` not found

---

## Borrow Requests (`/api/requests`)

### POST /api/requests
Submit a new borrow request.

**Auth:** Required (any role)

**Request body:**
```json
{
  "equipment_id": 1,
  "quantity_requested": 1,
  "due_date": "2026-05-20",
  "reason": "Photography project"
}
```
- `due_date`: ISO date string (must be a future date)
- `quantity_requested`: must not exceed `available_qty`

**Response `201`:**
```json
{
  "id": 12,
  "equipment_id": 1,
  "equipment_name": "DSLR Camera (Canon EOS 1500D)",
  "user_id": 3,
  "user_name": "Priya Sharma",
  "quantity_requested": 1,
  "status": "pending",
  "reason": "Photography project",
  "requested_at": "2026-05-09T10:30:00",
  "due_date": "2026-05-20",
  "approved_at": null,
  "returned_at": null,
  "admin_note": null,
  "approved_by": null
}
```

**Errors:** `404` equipment not found, `400` insufficient availability

---

### GET /api/requests/my
Get the current user's own borrow requests.

**Auth:** Required

**Query parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter: `pending`, `approved`, `rejected`, `returned` |
| `skip` | int | Pagination offset |
| `limit` | int | Max 100 (default 20) |

**Response `200`:**
```json
{
  "total": 3,
  "requests": [ ...RequestOut objects... ]
}
```

---

### GET /api/requests
Get all borrow requests (admin view).

**Auth:** Admin only

**Query parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status |
| `equipment_id` | int | Filter by equipment |
| `user_id` | int | Filter by user |
| `search` | string | Search equipment name or user name |
| `skip` | int | Pagination offset |
| `limit` | int | Max 100 (default 20) |

**Response `200`:** Same structure as `/my`.

---

### GET /api/requests/{request_id}
Get a single request by ID.

**Auth:** Owner of the request or admin.

**Response `200`:** Single `RequestOut` object.

**Errors:** `404` not found, `403` access denied

---

### PATCH /api/requests/{request_id}/approve
Approve a pending request.

**Auth:** Admin only

**Request body** (optional):
```json
{ "admin_note": "Approved for lab session." }
```

**Response `200`:** Updated `RequestOut` with `status: "approved"`.

**Errors:** `400` request is not pending

---

### PATCH /api/requests/{request_id}/reject
Reject a pending request and restore available quantity.

**Auth:** Admin only

**Request body** (optional):
```json
{ "admin_note": "Equipment not available this week." }
```

**Response `200`:** Updated `RequestOut` with `status: "rejected"`.

**Errors:** `400` request is not pending

---

### PATCH /api/requests/{request_id}/return
Mark an approved request as returned and restore available quantity.

**Auth:** Admin only

**Request body:** None required.

**Response `200`:** Updated `RequestOut` with `status: "returned"`.

**Errors:** `400` request is not approved

---

## Users (`/api/users`)

### GET /api/users
List all users.

**Auth:** Admin only

**Query parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Filter by name or email |
| `role` | string | Filter: `student`, `staff`, `admin` |
| `skip` | int | Offset |
| `limit` | int | Max 100 (default 20) |

**Response `200`:**
```json
{
  "total": 4,
  "users": [ ...UserOut objects... ]
}
```

---

### GET /api/users/{user_id}
Get a single user by ID.

**Auth:** Admin only

**Response `200`:** Single `UserOut` object.

**Errors:** `404` not found

---

### PUT /api/users/{user_id}
Update a user's details or role.

**Auth:** Admin only

**Request body** (all fields optional):
```json
{
  "full_name": "Updated Name",
  "role": "staff",
  "is_active": false
}
```

**Response `200`:** Updated `UserOut` object.

**Errors:** `404` not found

---

### DELETE /api/users/{user_id}
Deactivate a user account (soft delete).

**Auth:** Admin only

**Response `200`:** Deactivated `UserOut` object.

**Errors:** `404` not found, `400` cannot deactivate own account

---

## Dashboard (`/api/dashboard`)

### GET /api/dashboard/stats
Get dashboard statistics. Response shape depends on the caller's role.

**Auth:** Required

**Response `200` (admin):**
```json
{
  "total_equipment": 10,
  "available_equipment": 7,
  "pending_requests": 3,
  "active_borrows": 2,
  "total_users": 4
}
```

**Response `200` (student/staff):**
```json
{
  "total_equipment": 10,
  "available_equipment": 7,
  "pending_requests": 3,
  "active_borrows": 2,
  "my_pending": 1,
  "my_active_borrows": 1
}
```

---

## Common Response Schemas

### UserOut
```json
{
  "id": 1,
  "full_name": "string",
  "email": "string",
  "role": "student | staff | admin",
  "is_active": true,
  "created_at": "datetime"
}
```

### EquipmentOut
```json
{
  "id": 1,
  "name": "string",
  "description": "string | null",
  "category": "string",
  "total_quantity": 1,
  "available_qty": 1,
  "condition": "excellent | good | fair | poor",
  "image_url": "string | null",
  "is_active": true,
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### RequestOut
```json
{
  "id": 1,
  "equipment_id": 1,
  "equipment_name": "string",
  "user_id": 1,
  "user_name": "string",
  "quantity_requested": 1,
  "status": "pending | approved | rejected | returned",
  "reason": "string | null",
  "requested_at": "datetime",
  "due_date": "date",
  "approved_at": "datetime | null",
  "returned_at": "datetime | null",
  "admin_note": "string | null",
  "approved_by": "int | null"
}
```

---

## Interactive Docs
FastAPI generates interactive Swagger UI automatically:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
