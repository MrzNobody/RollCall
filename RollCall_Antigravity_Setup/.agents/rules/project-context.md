# RollCall — Project Context

> Always-active. Every agent reads this on every task.

---

## Repository Structure

```
rollcall/
├── client/                    # React 18 frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level page components
│   │   ├── context/           # React context providers (Auth, Theme, Socket)
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Pure utility functions
│   │   ├── api/               # TanStack Query hooks + axios calls
│   │   └── styles/            # Global CSS, Tailwind config
│   ├── public/
│   └── vite.config.ts
├── server/                    # Express.js API
│   ├── src/
│   │   ├── routes/            # Express routers (one file per feature area)
│   │   ├── middleware/        # Auth, rate-limit, content-filter, error-handler
│   │   ├── services/          # Business logic (one file per domain)
│   │   ├── jobs/              # BullMQ job definitions
│   │   ├── socket/            # Socket.io event handlers
│   │   └── utils/             # Shared server utilities
│   └── index.ts
├── prisma/
│   ├── schema.prisma          # Single source of truth for DB schema
│   └── migrations/            # Never hand-edit — always use prisma migrate dev
├── docs/
│   ├── RollCall_PRD.md        # v3.17 — 111 features, 346 user stories
│   └── RollCall_Implementation_Plan.md
├── tests/
│   ├── unit/                  # Vitest unit tests
│   ├── integration/           # Supertest API tests
│   └── e2e/                   # Playwright end-to-end tests
├── .agents/
│   ├── rules/                 # Always-active agent context (this folder)
│   └── skills/                # Progressive-disclosure specialized agents
├── AGENTS.md                  # Master cross-tool rules
└── .env.example               # All required environment variables (no values)
```

---

## Environment Variables

Every agent must know these exist. Never hardcode any value that belongs here.

```bash
# Database
DATABASE_URL=                     # PostgreSQL connection string
TEST_DATABASE_URL=                # Separate _test database for integration tests

# Auth
JWT_SECRET=                       # Min 64 chars, random
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

# Google Maps (event location tagging - F45)
GOOGLE_MAPS_API_KEY=

# Mapbox (Discover map - F46)
MAPBOX_ACCESS_TOKEN=

# Cloudinary (file uploads - F42, F109)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (choose one)
SENDGRID_API_KEY=
RESEND_API_KEY=
EMAIL_FROM=noreply@rollcall.gg

# SMS / Safety Alarm + 3FA (F41, F47)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# Redis (Socket.io adapter + BullMQ)
REDIS_URL=redis://localhost:6379

# PostHog Analytics (F68)
POSTHOG_API_KEY=
POSTHOG_HOST=

# IGDB API for game cover art (F109) - register at dev.twitch.tv
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=

# hCaptcha (F53)
HCAPTCHA_SECRET_KEY=
VITE_HCAPTCHA_SITE_KEY=          # Public key, safe for frontend

# FingerprintJS (F53, F78)
FINGERPRINTJS_API_KEY=

# App
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001

# Feature flags / pilot config
GEO_WAITLIST_THRESHOLD=20         # F97 — alerts admin when county hits this count
NEW_ACCOUNT_GROUP_CREATE_DAYS=7   # F108 — cool-down before new account can create groups
NEW_ACCOUNT_OWNER_DM_DAYS=14      # F108 — cool-down before new account can DM members
```

---

## Key Pages & Routes

| Path | Description | PRD Feature |
|------|-------------|-------------|
| `/` | Landing page (logged-out) | — |
| `/home` | Personalized dashboard (logged-in) | F111 |
| `/onboarding` | 6-step onboarding flow | F26 |
| `/discover` | Group discovery with search + filters | F3, F46, F60 |
| `/discover/gaps` | "What's Missing Near You" gap finder | F94 Part 5 |
| `/groups/:slug` | Group detail page | F2, F4 |
| `/groups/:slug/calendar` | Per-group calendar | F94 |
| `/groups/:slug/forum` | Group forum | F61 |
| `/groups/:slug/chat` | Real-time group chat | F10 |
| `/groups/:slug/analytics` | Organizer analytics dashboard | F70 |
| `/calendar` | Unified personal calendar | F94 Part 3 |
| `/activity` | Unified activity feed + mentions | F63 |
| `/messages` | 1:1 DM inbox | F67 |
| `/profile/:id` | Public user profile | F1 |
| `/profile/:id/badges` | Badge shelf | F40 |
| `/settings/*` | Account settings | F1, F38, F47, F75 |
| `/settings/safety` | Safety alarm settings | F41 |
| `/settings/referrals` | Referral dashboard | F72 |
| `/help` | Help center | F39 |
| `/help/contact` | Support ticket form | F77 |
| `/status` | Platform status page | F76 |
| `/support` | Mental health crisis resources | F92, F99 |
| `/discounts` | Partner discount program | F100 |
| `/account/recovery` | Account recovery flow | F58 |
| `/terms` | Terms of Service | F32 |
| `/privacy` | Privacy Policy | F32 |

---

## Deployment Targets

| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend (React/Vite) |
| **Railway** | Express API server + managed PostgreSQL |
| **Railway** | Redis instance |
| **Cloudflare** | DNS + DDoS + Bot Fight Mode |
| **Cloudinary** | File/image CDN |

---

## Content Screening Pipeline (F18)

Every text input that goes to the database runs through this middleware pipeline in order. No exceptions:

```
Request → rate-limit → bad-words filter → URL intercept → F41 keyword check → image moderation (if file) → store
```

For Socket.io messages specifically: screening happens **server-side before broadcast**. A message is never emitted to other clients until it has passed all checks.

Severity tiers: `CRITICAL` (reject + log) → `HIGH` (warn user + log) → `MEDIUM` (log only) → `CLEAN` (pass)

---

## Testing Requirements

Every new feature requires tests at the appropriate level before it can be merged:

- **Unit tests (Vitest):** Pure functions, utilities, React components in isolation. Coverage target ≥ 80% on `src/utils/` and `src/context/`.
- **Integration tests (Supertest):** Express routes with a real test database. Each test suite wraps in a transaction that rolls back.
- **E2E tests (Playwright):** Critical user paths — signup, onboarding, join group, RSVP, send message.

Never merge a feature without at least one test at the appropriate level.
