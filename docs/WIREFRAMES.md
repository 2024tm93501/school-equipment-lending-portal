# UI Wireframes — School Equipment Lending Portal

These wireframes document the actual screens implemented in the application.

---

## 1. Login Page (`/login`)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│          🏫  School Equipment Lending Portal        │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │              Sign In                        │   │
│   │                                             │   │
│   │  Email address                              │   │
│   │  ┌───────────────────────────────────────┐  │   │
│   │  │  admin@school.edu                     │  │   │
│   │  └───────────────────────────────────────┘  │   │
│   │                                             │   │
│   │  Password                                   │   │
│   │  ┌───────────────────────────────────────┐  │   │
│   │  │  ••••••••••                           │  │   │
│   │  └───────────────────────────────────────┘  │   │
│   │                                             │   │
│   │  [        Sign In        ]  ← primary btn   │   │
│   │                                             │   │
│   │  Don't have an account? Register here       │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│   Demo credentials (shown on page):                 │
│   Admin: admin@school.edu / Admin@123               │
│   Student: student1@school.edu / Student@123        │
│   Staff: staff1@school.edu / Staff@123              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 2. Register Page (`/register`)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │           Create Account                    │   │
│   │                                             │   │
│   │  Full Name                                  │   │
│   │  ┌───────────────────────────────────────┐  │   │
│   │  │                                       │  │   │
│   │  └───────────────────────────────────────┘  │   │
│   │                                             │   │
│   │  Email address                              │   │
│   │  ┌───────────────────────────────────────┐  │   │
│   │  │                                       │  │   │
│   │  └───────────────────────────────────────┘  │   │
│   │                                             │   │
│   │  Role         ┌──────────────────────────┐  │   │
│   │               │  Student        ▼        │  │   │
│   │               └──────────────────────────┘  │   │
│   │                                             │   │
│   │  Password                                   │   │
│   │  ┌───────────────────────────────────────┐  │   │
│   │  │                                       │  │   │
│   │  └───────────────────────────────────────┘  │   │
│   │                                             │   │
│   │  [       Create Account       ]             │   │
│   │                                             │   │
│   │  Already have an account? Sign in           │   │
│   └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 3. Dashboard (`/`) — Student/Staff view

```
┌──────────────────────────────────────────────────────────────────┐
│  [≡] School Equipment Portal          Welcome, Priya   [Logout]  │
├────────────────┬─────────────────────────────────────────────────┤
│                │                                                  │
│  Navigation    │  Dashboard                                       │
│  ──────────    │                                                  │
│  Dashboard  ◄  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  Equipment     │  │ Total    │ │Available │ │ Pending  │        │
│  My Requests   │  │ Equip.   │ │Equipment │ │ Requests │        │
│                │  │   10     │ │    8     │ │    3     │        │
│                │  └──────────┘ └──────────┘ └──────────┘        │
│                │                                                  │
│                │  ┌──────────┐                                   │
│                │  │ My Active│                                   │
│                │  │ Borrows  │                                   │
│                │  │    1     │                                   │
│                │  └──────────┘                                   │
│                │                                                  │
│                │  Quick Actions                                   │
│                │  [Browse Equipment]  [My Requests]              │
│                │                                                  │
└────────────────┴─────────────────────────────────────────────────┘
```

**Admin dashboard** replaces "My Active Borrows" with "Total Users" stat card and adds admin nav links (Manage Equipment, Manage Requests, Manage Users).

---

## 4. Equipment Page (`/equipment`)

```
┌──────────────────────────────────────────────────────────────────┐
│  Navbar                                                          │
├────────────────┬─────────────────────────────────────────────────┤
│  Sidebar       │  Equipment Catalog                              │
│                │                                                  │
│                │  ┌─────────────────────────────┐  [Category ▼] │
│                │  │  🔍 Search equipment...      │               │
│                │  └─────────────────────────────┘               │
│                │  [ ] Available only                             │
│                │                                                  │
│                │  ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│                │  │ [img]      │ │ [img]      │ │ [img]      │  │
│                │  │ DSLR Camera│ │ Multimeter │ │ Basketball │  │
│                │  │Photography │ │Lab Equip.  │ │Sports      │  │
│                │  │ 2 avail.   │ │ 8 avail.   │ │ 10 avail.  │  │
│                │  │ Condition: │ │ Condition: │ │ Condition: │  │
│                │  │ Good       │ │ Excellent  │ │ Excellent  │  │
│                │  │[Borrow Now]│ │[Borrow Now]│ │[Borrow Now]│  │
│                │  └────────────┘ └────────────┘ └────────────┘  │
│                │  ... more cards                                 │
└────────────────┴─────────────────────────────────────────────────┘

  On "Borrow Now" → Modal opens:
  ┌─────────────────────────────────────┐
  │  Borrow: DSLR Camera                │
  │                                     │
  │  Quantity (max 2)                   │
  │  ┌──────┐                           │
  │  │  1   │                           │
  │  └──────┘                           │
  │                                     │
  │  Return By (due date)               │
  │  ┌──────────────────────────────┐   │
  │  │  2026-05-20                  │   │
  │  └──────────────────────────────┘   │
  │                                     │
  │  Reason (optional)                  │
  │  ┌──────────────────────────────┐   │
  │  │                              │   │
  │  └──────────────────────────────┘   │
  │                                     │
  │  [Cancel]        [Submit Request]   │
  └─────────────────────────────────────┘
```

---

## 5. My Requests Page (`/my-requests`)

```
┌──────────────────────────────────────────────────────────────────┐
│  Navbar                                                          │
├────────────────┬─────────────────────────────────────────────────┤
│  Sidebar       │  My Requests                                    │
│                │                                                  │
│                │  [All] [Pending] [Approved] [Rejected][Returned]│
│                │                                                  │
│                │  ┌──────────────────────────────────────────┐   │
│                │  │ DSLR Camera         ● Pending            │   │
│                │  │ Qty: 1 · Due: 20 May 2026               │   │
│                │  │ Reason: Photography project              │   │
│                │  │ Requested: 9 May 2026                   │   │
│                │  └──────────────────────────────────────────┘   │
│                │                                                  │
│                │  ┌──────────────────────────────────────────┐   │
│                │  │ Basketball          ● Approved           │   │
│                │  │ Qty: 2 · Due: 15 May 2026               │   │
│                │  │ Admin note: Approved for sports day      │   │
│                │  └──────────────────────────────────────────┘   │
└────────────────┴─────────────────────────────────────────────────┘
```

---

## 6. Admin — Manage Equipment (`/admin/equipment`)

```
┌──────────────────────────────────────────────────────────────────┐
│  Navbar (Admin)                                                  │
├────────────────┬─────────────────────────────────────────────────┤
│  Sidebar       │  Manage Equipment          [+ Add Equipment]    │
│  (admin links) │                                                  │
│                │  ┌────────┬──────────────┬──────┬──────┬──────┐ │
│                │  │ ID     │ Name         │ Cat. │ Avail│ Acts │ │
│                │  ├────────┼──────────────┼──────┼──────┼──────┤ │
│                │  │ 1      │ DSLR Camera  │Photo │ 2/3  │ ✏ 🗑 │ │
│                │  │ 2      │ Multimeter   │Lab   │ 8/8  │ ✏ 🗑 │ │
│                │  │ 3      │ Basketball   │Sport │ 8/10 │ ✏ 🗑 │ │
│                │  │ ...    │ ...          │ ...  │ ...  │ ✏ 🗑 │ │
│                │  └────────┴──────────────┴──────┴──────┴──────┘ │
└────────────────┴─────────────────────────────────────────────────┘

  Add/Edit modal:
  ┌─────────────────────────────────────┐
  │  Add Equipment                      │
  │  Name        [                   ]  │
  │  Description [                   ]  │
  │  Category    [                   ]  │
  │  Quantity    [  ]                   │
  │  Condition   [Good           ▼  ]   │
  │  Image URL   [                   ]  │
  │  [Cancel]          [Save]           │
  └─────────────────────────────────────┘
```

---

## 7. Admin — Manage Requests (`/admin/requests`)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Navbar (Admin)                                                      │
├────────────────┬─────────────────────────────────────────────────────┤
│  Sidebar       │  Manage Requests                                    │
│                │  [All] [Pending] [Approved] [Rejected] [Returned]   │
│                │                                                      │
│                │  ┌───┬──────────────┬──────────┬────────┬────────┐  │
│                │  │ID │ Equipment    │ User     │Status  │Actions │  │
│                │  ├───┼──────────────┼──────────┼────────┼────────┤  │
│                │  │12 │ DSLR Camera  │ P.Sharma │Pending │✓  ✗    │  │
│                │  │11 │ Basketball   │ A.Mehta  │Approved│ Return │  │
│                │  │10 │ Guitar       │ P.Sharma │Returned│  —     │  │
│                │  └───┴──────────────┴──────────┴────────┴────────┘  │
└────────────────┴─────────────────────────────────────────────────────┘
  ✓ = Approve   ✗ = Reject   Return = Mark as Returned
```

---

## 8. Admin — Manage Users (`/admin/users`)

```
┌──────────────────────────────────────────────────────────────────┐
│  Navbar (Admin)                                                  │
├────────────────┬─────────────────────────────────────────────────┤
│  Sidebar       │  Manage Users                                   │
│                │  🔍 Search...   [Role ▼]                        │
│                │                                                  │
│                │  ┌───┬─────────────────┬─────────┬──────┬────┐  │
│                │  │ID │ Name            │ Email   │Role  │Act │  │
│                │  ├───┼─────────────────┼─────────┼──────┼────┤  │
│                │  │ 1 │ Sys Admin       │admin@…  │admin │ ✏  │  │
│                │  │ 2 │ Ramesh Kumar    │staff1@… │staff │ ✏  │  │
│                │  │ 3 │ Priya Sharma    │student1 │stud. │ ✏  │  │
│                │  └───┴─────────────────┴─────────┴──────┴────┘  │
└────────────────┴─────────────────────────────────────────────────┘
```
