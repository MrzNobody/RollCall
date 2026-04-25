# RollCall — Cross-Feature Consistency Rules

> Always-active. These rules exist because specific features are tightly coupled.
> Breaking one without updating the other is the most common source of bugs and PRD drift.

---

## How to Use This File

When you add, edit, or review any feature listed below, you **must also check every other feature in the same group**. These are not independent — they share data, UI state, or business logic.

---

## Group 1 — Trust Score & Moderation

**Features involved:** F22, F24, F55, F106, F108

The trust score is a composite of multiple inputs. Any feature that modifies it must update the full formula:

```
trust_score = base(100)
  + peer_rating_contribution     (from F55 group/organizer ratings)
  - warning_penalty              (−5 per active warning, max −15 from F22)
  - late_cancel_penalty          (−8 per late cancel from F106)
  + sessions_attended_bonus
  + email_verified_bonus
  + response_rate_bonus
```

**Consistency rules:**
- F22 graduated moderation penalties write to the same `trust_score` column that F55 ratings read from. Do not create separate score columns.
- F106 late cancellation writes `−8` to trust score AND sets `late_cancel_count_90d`. Both must happen in the same transaction.
- F108 fraud score (`+15` for payment pattern detection) is a **separate column** (`fraud_score`) from trust score — they are not the same field. Do not merge them.
- Conduct flag icon (F24) triggers at ≥ 2 active warnings within 90 days. The flag reads from `warnings` table, not directly from trust score.

---

## Group 2 — Notifications (F5, F38, F63, F84, F87, F102)

**The mandatory notification allowlist (F102):** Only these can never be disabled:
1. Password reset
2. Account suspension / ban
3. COPPA enforcement actions
4. Guardian consent request (F84)
5. Data export ready (F75)

**Everything else is opt-out.** When adding any new notification type, it must be opt-out by default. Add it to the F38 preferences table with `default_enabled = true` and a user-facing toggle.

**Real-time delivery (F63):** Notifications that require real-time delivery (mentions, chat messages, DM messages) use Socket.io personal notification rooms. The bell dropdown also receives a server-sent event. Non-real-time notifications (email digest, weekly summary) go through BullMQ.

**Guardian notifications (F84):** When a minor (13–17) RSVPs to an in-person event, an automatic notification goes to the registered guardian. This notification is mandatory and cannot be disabled by the minor or the group owner.

**Quiet Hours (F87):** When a user has Quiet Hours active, non-mandatory notifications are held and batch-delivered at the end of the Quiet Hours window — they are not dropped.

---

## Group 3 — Content Screening Pipeline (F18, F41, F92, F108)

All text content goes through one unified pipeline. Features that add new keyword detection must plug into this pipeline, not create separate passes:

```
F18  → bad-words filter (CRITICAL/HIGH/MEDIUM/CLEAN severity)
F41  → secret code word detection (bcrypt hash comparison — strips keyword, triggers alarm)
F92  → crisis keyword filter (parallel pass — never blocks delivery, only triggers support banner)
F108 → payment pattern screening (parallel pass — never blocks delivery, flags to admin queue)
```

**Critical rule:** F41 secret code word stripping and F92 crisis detection both run **parallel to delivery** — they never block or delay the message. F18 bad-words filter runs **before delivery** and can block. The order matters.

**Do not add new keyword lists outside this pipeline.** All keyword detection lives in `server/src/middleware/contentFilter.ts`.

---

## Group 4 — Geographic Gating (F48, F97, F3, F26)

The geographic gate for local groups has several moving parts:

- **`approved_regions` table** is the runtime source of truth for which ZIP codes are approved. The server caches this with a 5-minute TTL. Never hardcode ZIP lists.
- **F48 join flow:** Server returns 403 `pilot_geo_restricted` for non-PBC ZIP on local groups. Client shows a 📍 informational notice instead of a join button.
- **F3 Discover page:** Non-PBC users see local groups in results but with the 📍 notice. They are not hidden.
- **F26 Onboarding Step 5:** Auto-match excludes local groups from results for non-PBC users and adjusts headline to say "online groups only."
- **F97 waitlist:** When a non-PBC user hits the gate and clicks "join waitlist," they're added to `geo_waitlist` for their county (derived from ZIP via `zip_county_lookup`). Admin is alerted at 20 users per county.
- **Opening a new county:** Admin approves via the Expansion Demand tab → all county ZIPs added to `approved_regions` → waitlisted users emailed automatically via BullMQ.

**Creating a local group is unrestricted.** The gate is on joining/attending, not on creating.

---

## Group 5 — Socket.io Rooms Architecture (F10, F63, F67)

Three room types share the same Socket.io server:

| Room | Naming | Feature | Who joins |
|------|--------|---------|-----------|
| Group chat channel | `group:{groupId}:channel:{channelId}` | F10 | Confirmed group members |
| Personal notification | `user:{userId}:notifications` | F63 | Each user on login |
| DM thread | `dm:{threadId}` | F67 | Thread participants only |

**Consistency rules:**
- All rooms require a valid JWT on connection. Unauthenticated sockets are rejected immediately.
- Group chat rooms (F10) check group membership on join. A user removed from a group is immediately evicted from the room.
- Personal notification rooms (F63) are joined automatically on `socket.handshake` authentication. They do not require a separate join event.
- DM rooms (F67) are joined when the user opens the DM thread. They are not pre-joined on login.
- The Redis adapter (`@socket.io/redis-adapter`) is required in production so that horizontal scaling works. Do not use the default in-memory adapter in staging or production.

---

## Group 6 — Data Visibility Tiers (F98, F45, F71, F75)

Three tiers of data visibility govern what each caller can see:

| Tier | Who | Can see |
|------|-----|---------|
| Anonymous | Not logged in | Group name, category, city, 120-char description teaser, approximate member count |
| Logged-in non-member | Authenticated, not in group | All public group info, event titles and dates, group member count (not roster) |
| Confirmed member | Authenticated + group member | Full event details, exact location (F45 pin), member roster (display names only), forum, chat, resources |

**Email addresses appear in NONE of these tiers.** The `email` field must be excluded from every serializer that returns user or member data to external callers. Use explicit field allowlists on every serializer — never `SELECT *`.

**F71 SEO / JSON-LD:** Structured data is restricted to group name, category, city, and truncated description only. Event JSON-LD is removed (F98 v3.9). Do not re-add it.

**F75 data export:** The export ZIP includes only the requesting user's own data. Member rosters, other users' contact info, and any group-level data belonging to other users are explicitly excluded. A `README.txt` is included in the ZIP.

---

## Group 7 — Group Health & Organizer Wellbeing (F19, F51, F91, F106)

Group health is a score that drives group status badges (Active / Slowing / Dormant / Inactive):

- **F51 session cancellation:** Each cancellation subtracts from group health score (`−10 group health` per cancelled session).
- **F106 late cancellation:** Additionally subtracts `−10 group health` when the cancellation is within 24 hours of the session.
- **F91 organizer burnout signals:** The "Group Health & You" dashboard section reads from the group health score AND from: moderation volume, co-mod activity, time-since-last-session, member join trend. It does not modify the score — read-only.
- **F19 group health signals:** Drives the group status badge on cards. States: Active (session in last 14 days), Slowing (session 15–30 days ago), Dormant (31–60 days), Inactive (60+ days). Calculates at query time, not stored separately.

**Do not create multiple health score columns.** One `group_health_score INTEGER` column on the `groups` table. All features write to it and read from it.

---

## Group 8 — Forum, Voting & Real-Time (F61, F63, F64, F65)

- **F64 vote score** is stored as a denormalized `vote_score INTEGER` on `forum_posts` and `forum_replies` tables, maintained by a database trigger on `post_votes`. Do not calculate it at query time.
- **F64 collapsed threshold:** Posts with `vote_score ≤ −5` are collapsed in the UI. The server returns the post with an `is_collapsed: true` field. The client respects it.
- **F63 mentions** in forum posts trigger a real-time Socket.io notification to the mentioned user's personal notification room. The `@mention` detection runs server-side during post creation, before the forum post is saved.
- **F65 spoiler tags** use `||text||` syntax. The server stores the raw `||text||` string and sets `has_spoiler: true` on the post. The `SpoilerBlock` React component handles reveal on the client. Admin users always see spoiler content revealed.

---

## Group 9 — Scam Prevention Cross-Checks (F108, F14, F22, F53, F81)

F108 has seven parts that touch multiple existing systems:

| F108 Part | Touches | Rule |
|-----------|---------|------|
| Financial Solicitation zero-tolerance | F14 Community Standards | New violation tier above all others — immediate suspension on report receipt |
| New account cool-down | F2 Group Creation, F67 DMs | Server-side check on `users.created_at` against config constants |
| Payment pattern screening | F18 Content Pipeline | Runs parallel (never blocks); adds `+15` to `fraud_score` (F81) |
| New report categories | F15 Admin Panel | Two new `violation_type` ENUM values: `financial_solicitation`, `impersonation` |
| Payment prohibition ack | F2 Group Creation | `payment_prohibition_ack BOOLEAN` and `payment_prohibition_ack_at TIMESTAMP` on `groups` table |
| New-member safety notice | F48 Join Flow | `seen_new_owner_notice BOOLEAN` on `group_members` table |
| Verified Organizer badge | F15 Admin Panel, F24 Trust Signals | `verified_organizer BOOLEAN` on `users`; admin-grant endpoint logged to F82 audit log |

---

## Group 10 — Account Deletion & Data Purge (F75, F41, F47, F83)

When a user is deleted (right-to-erasure, F75):
- GPS coordinates from `alarm_events` are purged immediately (F41 also requires 24h auto-purge regardless)
- MFA backup codes are purged immediately (F47)
- Secret code word hash is purged immediately (F41)
- Follower/following relationships are deleted (F83)
- DM messages are soft-deleted with `deleted_by_user_id` set (F67)
- Forum posts are anonymized (display name replaced with "Deleted User") — not deleted
- Badge awards are retained for group/community record but unlinked from user profile
- `deletion_requests` table records the request with a 30-day grace period before permanent purge

**The 30-day grace period is not optional.** It protects against accidental deletion and active moderation cases. An admin can override and force-delete immediately only for COPPA compliance cases (user confirmed under 13).
