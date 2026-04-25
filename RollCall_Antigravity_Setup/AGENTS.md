# RollCall — Agent Rules (AGENTS.md)

> This file is read by Google Antigravity, Cursor, and Claude Code.
> It is the single source of truth for all AI agents working on this project.
> **Never override these rules without explicit approval from the project owner (Carlo Raineri).**

---

## Project Identity

- **Name:** RollCall
- **PRD Version:** 3.17 (April 21, 2026)
- **Author:** Carlo Raineri
- **Purpose:** Full-stack web platform connecting people around shared hobbies and activities — gaming, tabletop RPGs, sports, and more. Groups have a clear purpose, schedule, and capacity.
- **Pilot Market:** Palm Beach County, Florida (PBC) — geographically constrained launch before expansion
- **Tagline:** "Find your people. Roll with them."
- **Primary PRD file:** `docs/RollCall_PRD.md` (v3.17 — 111 features, 346 user stories)
- **Implementation Plan:** `docs/RollCall_Implementation_Plan.md`

---

## The Golden Rule

> **The PRD is the source of truth. Always.**

Before writing, editing, or reviewing any feature:
1. Check whether it is already specified in the PRD (F1–F111)
2. If it is, implement it exactly as specified — do not invent variations
3. If it conflicts with another feature, flag the conflict instead of resolving it silently
4. If it is not in the PRD, say so and ask before building

---

## Tech Stack (Non-Negotiable)

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), TailwindCSS, React Router v6, TanStack Query |
| Backend | Node.js + Express.js |
| Database | PostgreSQL 15+ with Prisma ORM + PostGIS extension |
| Real-Time | Socket.io + Redis adapter (`@socket.io/redis-adapter`) |
| Job Queue | BullMQ + ioredis |
| File Storage | Cloudinary (images, avatars, PDF attachments) |
| Maps — Discovery | Mapbox GL JS |
| Maps — Event Location | Google Maps JavaScript API + Places Autocomplete |
| Email | SendGrid or Resend + BullMQ |
| SMS | Twilio (safety alarm F41, 3FA F47) |
| Analytics | PostHog (self-hosted) |
| Auth | JWT + bcrypt + Google OAuth |
| Search | Fuse.js (fuzzy) + PostgreSQL full-text |
| Rich Text | Tiptap (forum editor, F61) |
| Game Cover Art | IGDB API (Twitch credentials) |
| Board Game Art | BoardGameGeek XML API v2 |
| VTT Integration | Roll20 URL validation (extensible to Foundry VTT) |
| Security | Cloudflare + FingerprintJS + hCaptcha |
| Monitoring | Sentry (errors) + k6 (load tests) |
| Testing | Vitest + React Testing Library + Supertest + Playwright |
| CI/CD | GitHub Actions → Railway (API + DB) + Vercel (frontend) |

**Do not introduce new dependencies without approval. Every library addition must be justified against an existing PRD requirement.**

---

## Phased Rollout — Know What Phase You Are In

Features are delivered in phases. Do not build Phase 4 features during Phase 1.

| Phase | Focus | Key Features |
|-------|-------|-------------|
| 0 | Pre-launch seeding | No code — organizer recruitment |
| 1 | Functional MVP | F1, F2, F3, F4, F5, F6, F7, F8, F12, F13, F14, F26, F32, F37, F48, F58 |
| 2 | Safety & moderation | F15, F17, F18, F22, F24, F25, F41, F42, F43, F44, F50–F53, F55–F57, F96, F108 |
| 3 | Engagement & community | F10, F28–F31, F33–F35, F38–F40, F61–F65, F84, F88–F90, F92–F94, F99, F109–F111 |
| 4 | Growth & personalization | F45–F47, F49, F60, F67–F74, F83, F85–F87, F91, F95, F97, F100 |
| 5 | Hardening & compliance | F59, F75–F82, F98, F101–F107 |
| 6 | Expansion & monetization | Geographic expansion, Premium tier, Native mobile |

---

## Critical Constraints — Every Agent Must Know These

### Age & COPPA
- Minimum age is **13**, not 18. COPPA compliance required for 13–17 users.
- Age confirmation is a **checkbox** at registration, not a date-of-birth field (DOB is optional).
- Users 13–17 require parental/guardian consent (F84).
- Never gate features at 18+ unless specifically stated for that feature.

### Geography
- Signing up is open to everyone globally — no signup gate.
- **Joining a local/in-person group** requires a PBC ZIP code (enforced server-side, F48).
- Online groups have no geographic restriction.
- Non-PBC users see a 📍 notice on local group cards — they can still view all content.

### Monetization
- Platform is **fully free** through Phases 0–2.
- F100 affiliate commissions activate at Phase 4 launch (no feature gate required).
- Premium Organizer tier and promoted placement are **Phase 6 only** — do not build these earlier.
- There is no subscription model, no Stripe integration, and no tier-gating on any feature.

### Direct Messages (F67)
- DMs are available to **all registered users** with **no thread limits**.
- Read receipts are opt-in for all users.
- Do not add limits, paywalls, or tier gates to DMs.

### Real-Time Chat (F10)
- Groups can have **up to 5 channels** — no more, no less.
- All messages are screened server-side before Socket.io broadcast — nothing unscreened leaves the server.
- Chat must be in-platform. Do not suggest Discord/WhatsApp integrations as replacements.

### Trust Score (F24)
- Conduct flag icon (⚠️) appears when user has ≥ 2 active warnings in 90 days.
- Trust score penalty: −5 per warning, max −15 total.
- Verified Organizer badge (✅) is admin-granted, distinct from Trust Score.

### Scam Prevention (F108)
- New accounts (< 7 days) cannot create groups.
- New accounts (< 14 days) cannot DM their own group members.
- Payment pattern screening runs on all outgoing messages — it never blocks delivery, only flags.

### Notifications (F38, F102)
- Mandatory notifications (cannot be turned off): password reset, suspension, COPPA alerts, guardian consent, data export.
- Everything else is **opt-out**, not opt-in.

### Data & Privacy (F98)
- Email addresses are **never** returned by any public or member-facing API endpoint.
- Member rosters are display-name-only — no bulk export.
- Anonymous visitors see: group name, category, city, 120-char description teaser, approximate member count only.

---

## Naming Conventions

### Database
- Tables: `snake_case` plural (e.g., `group_members`, `forum_posts`, `alarm_events`)
- Primary keys: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- Timestamps: `created_at TIMESTAMP NOT NULL DEFAULT NOW()`, `updated_at TIMESTAMP`
- Foreign keys: `<table_singular>_id UUID REFERENCES <table>(id)`
- Boolean flags: `is_<adjective>` prefix (e.g., `is_sensitive`, `is_harmful_group`)
- ENUM types: `snake_case` (e.g., `violation_type`, `location_type`)

### API
- Routes: `kebab-case` (e.g., `/api/groups/:id/join-requests`)
- HTTP methods: GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE
- Auth: JWT in `Authorization: Bearer <token>` header
- Error responses: `{ error: string, code: string }` format
- Success responses: `{ data: T, meta?: PaginationMeta }` format

### React Components
- Components: `PascalCase` (e.g., `GroupCard`, `TrustScoreRing`)
- Hooks: `use` prefix (e.g., `useGroupMembers`, `useSocketRoom`)
- Context: `<Name>Context` + `use<Name>` hook pair
- Files: match component name exactly

---

## What Agents Must Never Do

1. **Never add a feature not in the PRD without flagging it first**
2. **Never add Stripe, subscription tiers, or payment processing**
3. **Never add an 18+ age gate** — the minimum is 13
4. **Never add thread limits or tier gates to DMs (F67)**
5. **Never use `SELECT *` in any query** — use explicit field allowlists
6. **Never store coordinates permanently** — GPS data from F41 is purged within 24 hours
7. **Never return email addresses in public or member-facing API responses**
8. **Never allow messages to broadcast via Socket.io before server-side content screening**
9. **Never hardcode the PBC ZIP allowlist** — it lives in the `approved_regions` table
10. **Never bypass the content pre-screening middleware on any text input**

---

## References

- Full PRD: `docs/RollCall_PRD.md`
- Implementation Plan: `docs/RollCall_Implementation_Plan.md`
- Always-active rules: `.agents/rules/`
- Specialized skills: `.agents/skills/`
