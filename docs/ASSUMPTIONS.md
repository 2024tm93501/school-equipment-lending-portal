# Assumptions & Design Decisions

## Problem Statement Assumptions

1. **Single institution scope** — The portal is designed for one school. There is no multi-tenant support; all users and equipment belong to the same institution.

2. **Borrowing, not reserving** — Requests take effect immediately upon approval. There is no future reservation system (e.g., "borrow from next Tuesday"). Due dates indicate expected return, not borrow start date.

3. **Admin-only creation of admins** — Admin accounts cannot be self-registered to prevent privilege escalation. The initial admin is seeded into the database on first run. Additional admins must be promoted by an existing admin via the Users management screen.

4. **Staff and students have equal borrowing rights** — Both roles can submit borrow requests. The distinction exists for future extensibility (e.g., priority queues or higher quantity limits for staff), but is not enforced differently in this version.

5. **No email verification** — User registration is immediate without email confirmation, which is acceptable for a closed school intranet environment where accounts are institution-managed.

6. **Quantity is the primary availability constraint** — The system prevents over-booking by tracking `available_qty`. It does not track individual unit identifiers (e.g., serial numbers), so any available unit of an item can be lent.

7. **No overlapping date check** — The system prevents simultaneous over-booking by quantity but does not prevent a user from holding the same item multiple times across different date ranges. This is acceptable for the current scope.

## Technical Assumptions

8. **SQLite is sufficient for a school portal** — Concurrent write load is low (a single school, not a high-traffic service). SQLite provides zero-configuration deployment. The ORM (SQLAlchemy) makes migration to PostgreSQL trivial by changing `DATABASE_URL` only.

9. **JWT stored in localStorage** — Simpler to implement and debug for a coursework project. In a production deployment, `httpOnly` cookies would be preferred to mitigate XSS risk.

10. **Token expiry is 24 hours** — Long enough that students are not prompted to re-login mid-session, but short enough to limit exposure if a token is leaked.

11. **Soft deletes throughout** — Neither users nor equipment are hard-deleted. Setting `is_active = false` preserves referential integrity for existing borrow request history and audit trails.

12. **Image URLs, not uploads** — Equipment images are stored as URLs (pointing to external or CDN-hosted images) rather than uploaded files. This avoids the need for a file storage service in a coursework context.

13. **CORS restricted to localhost:5173** — Intentionally scoped to the local Vite dev server. A production deployment would update `allow_origins` to the actual hosted frontend domain.

14. **No rate limiting or CSRF protection** — Omitted for simplicity in a coursework demo context. Both would be required before any public deployment.

## UI/UX Assumptions

15. **Responsive but desktop-primary** — The UI uses Tailwind CSS responsive utilities and is usable on mobile, but the primary use case is a desktop browser in a school computer lab or office.

16. **Role-based navigation** — The sidebar and navbar show only routes accessible to the current user's role. Admin-only pages are not reachable by students or staff even if the URL is known (protected both at route level in React and at API level in FastAPI).

17. **Pagination defaults to 20 items** — Sufficient for a school inventory that typically has tens to low hundreds of items.
