# RollCall — API Design Rules

> Always-active. Every agent writing or reviewing API code must follow these conventions.

---

## Global Conventions

### Request Format
- All authenticated requests: `Authorization: Bearer <jwt_token>` header
- Content-Type: `application/json` for all POST/PUT/PATCH requests
- File uploads: `multipart/form-data` only via Cloudinary signed upload — not raw binary to the API

### Response Format
```typescript
// Success
{ data: T, meta?: { page: number, limit: number, total: number } }

// Error
{ error: string, code: string }
```

### Error Codes (use these exact strings)
```
unauthorized          → 401: No valid JWT
forbidden             → 403: Valid JWT but insufficient permissions
not_found             → 404: Resource doesn't exist
validation_error      → 400: Invalid input
duplicate             → 409: Unique constraint violated
rate_limited          → 429: Too many requests
pilot_geo_restricted  → 403: Non-PBC ZIP trying to join a local group (F48)
skill_gate_blocked    → 403: Experience level gate on group join (F95)
content_blocked       → 400: CRITICAL content filter rejection (F18)
account_cool_down     → 403: New account cool-down (F108)
```

### Rate Limits (F80, F98)
| Endpoint type | Limit |
|--------------|-------|
| Unauthenticated `/api/*` | 20 req/min per IP |
| General authenticated | 120 req/min per user |
| `GET /api/groups/:id/members` | 10 req/hour per user |
| `GET /api/users/:id` (profile lookups) | 30 req/min per user |
| `POST /api/auth/*` | 10 req/15min per IP |
| `POST /api/media/upload` | 20 req/hour per user |
| `GET /api/users/data-export` | 1 req/24h per user |
| `POST /api/safety/alarm/trigger` | 3 req/min per user |

### Data Serialization Rules (F98)
- **Never use `SELECT *`** — explicit field allowlists on every serializer
- **Never return `email`** in any public or member-facing response
- **Never return `password_hash`, `zip_code`, `date_of_birth`, `phone_number`** in any response
- **Never return `fraud_score`, `is_admin`** to non-admin callers
- Member roster endpoints return `display_name` and `avatar_url` only — never email or contact info

---

## Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register with email+password |
| POST | `/api/auth/login` | None | Login, returns JWT |
| POST | `/api/auth/logout` | JWT | Invalidate session |
| POST | `/api/auth/refresh` | JWT | Refresh token |
| POST | `/api/auth/forgot-password` | None | Send reset email |
| POST | `/api/auth/reset-password` | None | Consume reset token |
| GET | `/api/auth/google` | None | OAuth redirect |
| GET | `/api/auth/google/callback` | None | OAuth callback |
| POST | `/api/auth/recovery/email` | None | F58: MFA bypass via email |
| POST | `/api/auth/recovery/sms` | None | F58: Email update via SMS OTP |
| POST | `/api/auth/recovery/manual` | None | F58: Manual identity verification |

---

## User Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | JWT | Current user profile |
| PUT | `/api/users/me` | JWT | Update profile |
| DELETE | `/api/users/me` | JWT | Request deletion (F75 — 30-day grace) |
| GET | `/api/users/me/backup-codes` | JWT | F58: Backup code status |
| POST | `/api/users/me/backup-codes/regenerate` | JWT | F58: Regenerate backup codes |
| GET | `/api/users/me/notifications` | JWT | F5: Notification list |
| PUT | `/api/users/me/notification-preferences` | JWT | F38: Update preferences |
| GET | `/api/users/me/data-export` | JWT | F75: Request data export ZIP |
| GET | `/api/users/:id` | JWT | Public profile (filtered by visibility) |
| GET | `/api/users/:id/followers` | JWT | F83: Follower list |
| GET | `/api/users/:id/following` | JWT | F83: Following list |
| POST | `/api/users/:id/follow` | JWT | F83: Follow user |
| DELETE | `/api/users/:id/follow` | JWT | F83: Unfollow user |

---

## Group Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/groups` | Optional | Discover groups (filtered) |
| POST | `/api/groups` | JWT | Create group |
| GET | `/api/groups/:id` | Optional | Group detail (visibility tiered per F98) |
| GET | `/api/groups/:id/public-teaser` | None | F98: Anonymous-safe group summary |
| PUT | `/api/groups/:id` | JWT (owner) | Update group |
| DELETE | `/api/groups/:id` | JWT (owner) | Archive group |
| GET | `/api/groups/:id/members` | JWT (member) | Member list (display_name + avatar only) |
| POST | `/api/groups/:id/join` | JWT | F48: Join or request to join |
| DELETE | `/api/groups/:id/leave` | JWT | F48: Leave group |
| PUT | `/api/groups/:id/members/:userId` | JWT (mod) | Update member role / remove |
| GET | `/api/groups/:id/join-requests` | JWT (mod) | Pending join requests |
| PUT | `/api/groups/:id/join-requests/:userId` | JWT (mod) | Approve or deny request |

---

## Events Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/groups/:id/events` | JWT (member) | Group event list |
| POST | `/api/groups/:id/events` | JWT (mod) | Create event |
| PUT | `/api/groups/:id/events/:eventId` | JWT (mod) | Update event |
| DELETE | `/api/groups/:id/events/:eventId` | JWT (mod) | Cancel event (F51) |
| POST | `/api/events/:id/rsvp` | JWT | RSVP to event |
| PUT | `/api/events/:id/rsvp` | JWT | Update RSVP |
| GET | `/api/events/:id/rsvps` | JWT (member) | RSVP list |
| POST | `/api/events/:id/exceptions` | JWT (mod) | F57: Skip or reschedule single occurrence |

---

## Chat Endpoints (F10)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/groups/:id/channels` | JWT (member) | List channels |
| POST | `/api/groups/:id/channels` | JWT (owner) | Create channel (max 5 per group) |
| GET | `/api/channels/:id/messages` | JWT (member) | Message history (paginated) |
| DELETE | `/api/messages/:id` | JWT (mod) | Delete message |
| POST | `/api/messages/:id/pin` | JWT (mod) | Pin message |

Socket.io events (not REST):
- `message:send` → screened server-side → `message:new` broadcast to room
- `message:edit` (15-min window) → re-screened → `message:edited` broadcast
- `typing:start` / `typing:stop` → broadcast to room (no DB write)
- `reaction:add` / `reaction:remove` → `reaction:update` broadcast

---

## Home Feed Endpoint (F111)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/home/feed` | JWT | Returns all 5 dashboard sections in single response |
| PUT | `/api/home/preferences` | JWT | Update section visibility prefs |

The `/api/home/feed` response shape:
```typescript
{
  data: {
    my_week: Event[],            // TTL: 1 min
    recommended: GroupCard[],    // TTL: 10 min
    group_activity: FeedItem[], // TTL: 2 min
    forum_threads: ThreadItem[], // TTL: 5 min
    trending: TrendingItem[]     // TTL: 30 min
  }
}
```

---

## Safety Endpoints (F41, F92)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/safety/contacts` | JWT | List trusted contacts |
| POST | `/api/safety/contacts` | JWT | Add trusted contact |
| DELETE | `/api/safety/contacts/:id` | JWT | Remove trusted contact |
| PUT | `/api/safety/preferences` | JWT | Update alarm preferences |
| POST | `/api/safety/alarm/trigger` | JWT | Trigger silent alarm |
| POST | `/api/safety/alarm/dismiss` | JWT | Dismiss active alarm |
| POST | `/api/safety/alarm/test` | JWT | Test alarm (notifies contacts with "[TEST]" prefix) |

---

## Admin Endpoints (F15, F82, F97)

All admin endpoints require `is_admin: true` on the JWT. Platform-owner endpoints additionally check a `is_platform_owner` flag.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | Search users |
| POST | `/api/admin/ban/:userId` | Admin | Ban user |
| POST | `/api/admin/suspend/:userId` | Admin | Suspend user |
| GET | `/api/admin/reports` | Admin | Reports queue |
| PUT | `/api/admin/reports/:id` | Admin | Action report |
| GET | `/api/admin/reports/sensitive` | Owner | Tab 6 sensitive reports |
| GET | `/api/admin/recovery-requests` | Admin | F58: Manual recovery queue |
| PUT | `/api/admin/recovery-requests/:id/approve` | Admin | Approve manual recovery |
| PUT | `/api/admin/recovery-requests/:id/deny` | Admin | Deny manual recovery |
| GET | `/api/admin/expansion-demand` | Admin | F97: County demand table |
| POST | `/api/admin/expansion-demand/:county/approve` | Admin | F97: Activate county |
| POST | `/api/admin/users/:id/grant-verified-organizer` | Admin | F108: Grant ✅ badge |
| POST | `/api/admin/users/:id/revoke-verified-organizer` | Admin | F108: Revoke ✅ badge |
| GET | `/api/admin/audit-log` | Owner | F82: Audit log (filtered) |

---

## Public Endpoints (No Auth Required)

Only these 6 endpoints are unauthenticated per F98:

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `GET /api/auth/google`
4. `GET /api/auth/google/callback`
5. `GET /api/groups/:id/public-teaser` — returns only: name, category, city, 120-char description, approximate member count
6. `GET /api/system/status` — F76 status page polling

Everything else requires a valid JWT. Unauthenticated requests to any other endpoint return `401 unauthorized`.
