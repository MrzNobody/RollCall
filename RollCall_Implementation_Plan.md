# RollCall — Phased Implementation Plan

**Version:** 1.0  
**Date:** April 22, 2026  
**Author:** Carlo Raineri  
**Based on PRD:** v3.17  
**Geographic Focus:** Palm Beach County, Florida (Pilot)

---

## Strategic Philosophy

RollCall is built on one core principle: **ship a working product first, then make it better.**

Every phase in this plan delivers a usable product that real people can sign up for and use today. Features are sequenced so that each phase adds a distinct, demonstrable layer of value on top of the last — not just code, but outcomes. Stakeholders watching this roadmap will see a living product grow from a simple matchmaking site into a full community platform.

```
Phase 0  →  Pre-launch seeding (no code needed)
Phase 1  →  Functional MVP — sign up, find a group, join
Phase 2  →  Safe to grow — moderation, trust, safety tools
Phase 3  →  Worth coming back to — engagement, chat, events, community
Phase 4  →  Grows itself — personalization, analytics, referral, SEO
Phase 5  →  Built to last — compliance, fraud, accessibility, hardening
Phase 6  →  Ready to scale — expansion, monetization, mobile
```

---

## Phase 0 — Seed the Market (Before a Single Line of Code)

**Timeline:** 2 weeks pre-launch  
**Team:** Founder + 2 community leads  
**Cost:** $0 in infrastructure

### Objective

Prove that demand exists before building. The platform cannot open to the public with zero groups — nobody joins an empty room. Phase 0 solves the cold-start problem by recruiting real organizers and seeding live groups before the product ships.

### What Happens in Phase 0

- Personally recruit **8–12 Palm Beach County organizers** across target categories (video games, tabletop, sports, social)
- White-glove onboard each organizer — understand their existing group, promise them a home
- Commit to a public launch only after reaching: **20 active groups / 4 categories / 3 cities**
- All Phase 0 organizers receive an automatic ✅ **Verified Organizer badge** when the platform launches

### Phase 0 Seeded Group Targets

| Category | City | Target Groups |
|----------|------|--------------|
| Video Games (online) | West Palm Beach, Boca Raton | 6 groups |
| Tabletop / D&D (mixed) | Boca Raton, Delray Beach | 4 groups |
| Sports & Fitness (local) | West Palm Beach, Jupiter, Boynton Beach | 6 groups |
| Social / Board Games (local) | Delray Beach, Lake Worth | 4 groups |

### Business Value

> **You can't launch a marketplace with no supply.** Phase 0 ensures that day-one users land on a page with real groups, real organizers, and real upcoming sessions — not a ghost town. This is the single most important step to making every other phase successful.

### Go / No-Go Gate

✅ All of the following must be true before Phase 1 launches:
- 20+ groups created in the seeding environment
- 4+ distinct activity categories represented
- 3+ cities with at least 2 groups each
- At least 6 organizers have confirmed they will actively use the platform

---

## Phase 1 — Functional MVP: "Find Your Group, Join It" 

**Timeline:** Weeks 1–4 (build) + Week 5 (soft launch)  
**PRD Features:** F1, F2, F3, F4, F5, F6, F7, F8, F12, F13, F14, F26, F27, F32, F36, F37, F48, F58  
**Status after this phase:** ✅ Fully usable website — real users can sign up, find groups, and join

### What Gets Built

#### Core Infrastructure
- Project scaffold: React (Vite) + Express.js + PostgreSQL + Prisma ORM
- CI/CD pipeline (GitHub Actions → Railway/Vercel)
- Environment configuration (dev / staging / production)
- Database schema and all migrations

#### User Foundation (F1, F26, F32, F58)
- Email + password registration with Google OAuth option
- COPPA-compliant 13+ age confirmation checkbox
- 6-step onboarding flow: interests → location → platform → availability → auto-matched groups
- Full user profile: display name, bio, ZIP code, timezone, interests, availability, experience level
- Smart group auto-matching in onboarding — users land on their first group, not a blank page
- Dark / light mode toggle (F12, F13)
- Password reset and account recovery (F58)
- Legal pages: Terms of Service, Privacy Policy, Cookie Consent (F32)

#### Group System (F2, F3, F4, F8)
- Group creation with name, category, description, location type (online / local / hybrid), capacity
- Community Standards acknowledgment checkbox required at group creation (F14)
- Discover page: browse all public groups with search, category filters, location type filter
- Fuzzy search with synonym map (e.g. "LOL" → League of Legends, "DnD" → Dungeons & Dragons) (F37)
- Join / request-to-join flow with approval or instant-join modes (F48)
- Membership roles: Owner, Co-Moderator, Member
- User dashboard — my groups, upcoming events, recent activity (F8)
- Group feed — pinned announcements, updates, and member activity (F7)

#### Events & Scheduling (F6)
- Session / event creation: title, date, time, location, max attendees, recurring vs one-time
- RSVP system: Going / Maybe / Can't Make It
- Group page with upcoming sessions tab

#### Notifications (F5)
- In-app bell notification for: join approval, new group member, upcoming event reminder
- Notification preferences center (F38 — essential alerts only at this phase)

#### Legal & Settings (F27, F36)
- Saved searches and group alerts
- Public group preview pages with Open Graph meta tags
- Social share button for groups (F36)

### Business Value

> **This is the product.** Everything in Phase 1 answers the question: *"Can someone who has never heard of RollCall sign up today and find a group to join?"* The answer must be yes. Every subsequent phase builds on this foundation — but without Phase 1, nothing else matters.

**Measurable outcomes after Phase 1:**
- Users can register and complete onboarding in < 5 minutes
- Users are shown matched groups immediately after onboarding
- A group organizer can create a group and accept members in one session
- The platform has real content (seeded Phase 0 groups) on day one

### Go / No-Go Gate

✅ Before moving to Phase 2:
- 50+ registered users in PBC (invites to seeded organizers' existing circles)
- Onboarding completion rate ≥ 70%
- At least 5 groups with 3+ members each
- Zero critical security vulnerabilities in pre-launch scan

---

## Phase 2 — Safe to Grow: "Trust the Platform, Trust the People"

**Timeline:** Weeks 6–8  
**PRD Features:** F15, F17, F18, F22, F24, F25, F41, F42, F43, F44, F50, F51, F52, F53, F55, F56, F57, F96, F108  
**Status after this phase:** ✅ Platform is moderated, safe for strangers, and ready for public launch

### What Gets Built

#### Admin Control Panel (F15)
- Full user management: search, ban, suspend, whitelist
- Reports queue with action tools (warn / mute / suspend / ban / dismiss)
- Tab structure: Users / Reports / Banned / Waitlist / Feedback
- Platform-owner restricted Tab 6 for sensitive reports (sexual harassment, harm)

#### Content Safety & Moderation (F18, F22)
- Automated content pre-screening middleware (`bad-words` filter on all text inputs)
- Severity tiers: CRITICAL (block) → HIGH (warn) → MEDIUM (log) → CLEAN (pass)
- Graduated moderation: Verbal Warning → Temporary Mute → Suspension → Permanent Ban
- Automated content log for all flagged messages, visible to admins

#### Group-Level Moderation (F17)
- Co-Moderator role with configurable permissions
- Strike system: issue strikes → reach threshold → auto-removal
- Mod log: all actions timestamped and auditable

#### Trust Signals (F24)
- Profile trust score ring (composite: peer rating, sessions attended, email verified, response rate)
- Verified badge (email-verified)
- Sessions attended counter
- Conduct flag icon (⚠️) for users with ≥ 2 active warnings
- Verified Organizer badge ✅ (admin-granted; Phase 0 organizers auto-receive it)

#### Reporting System
- Report button on posts, profiles, and groups → admin queue
- Report categories: Harassment / Spam / Inappropriate Content / Financial Solicitation / Impersonation (F108)
- Sensitive report flow for harassment/abuse with immediate suspension and crisis resource links

#### Scam & Social Engineering Prevention (F108)
- New-account cool-down: accounts under 7 days cannot create groups
- Payment pattern message screening (Venmo, Zelle, PayPal detection)
- Mandatory payment prohibition acknowledgment at group creation
- New-member safety notice for groups owned by accounts under 30 days old
- Financial Solicitation zero-tolerance policy in Community Standards

#### User Safety (F41, F25, F43, F44)
- Silent Safety Alarm (F41): triple-tap or shake gesture → trusted contacts notified via SMS → GPS-captured location (purged in 24h)
- In-person safety guidelines displayed for all local events
- Personal information protection: soft warning when phone/address patterns detected in messages (F43)
- Profile reporting modal with 3-report auto-flag to admin (F44)
- Profile avatar upload with AI moderation pipeline (F42)

#### Group Operations (F50, F51, F52, F55, F56, F57)
- Group waitlist / queue with 48-hour auto-invite (F50)
- Session cancellation flow with group health integration (F51)
- Moderation appeal process: 7-day window for warnings and suspensions (F52)
- Group and organizer ratings: separate group/host scores, anonymous, star display on cards (F55)
- User saved-players list (private bookmark with LFG alert) (F56)
- Recurring event exception handling: skip / reschedule single occurrence (F57)

#### Spam & Bot Defense (F53)
- Request velocity checks + duplicate content detection
- FingerprintJS browser fingerprinting for ban evasion detection
- hCaptcha on registration and join flows
- Spam admin queue for review

#### Feedback System (F96)
- Post-onboarding 24-hour check-in survey (2 questions)
- Post-first-session rating (2 hours after event end)
- NPS survey at Day 14 and Day 60
- Persistent in-app feedback widget (💬 bottom-right)
- Admin Feedback Dashboard with response rates and session ratings

### Business Value

> **Without trust, you can't grow.** Phase 2 makes it safe to open the platform to people who don't personally know each other. Every feature in this phase is about protecting users from bad actors, giving organizers tools to run clean groups, and giving admins visibility into what's happening. This is the difference between a product that scales and one that implodes when it hits 200 users.

**Measurable outcomes after Phase 2:**
- Report response time < 24 hours for safety reports, < 5 days for standard reports
- Zero unmoderated scam attempts making it to users
- Admin can action any report without developer involvement
- 95%+ of flagged content resolved within SLA

### Go / No-Go Gate

✅ Before public launch:
- Admin panel is fully operational with at least 1 trained admin
- All content filters tested with red-team input strings
- Phase 0 organizers all have Verified Organizer badges
- No open P0 or P1 security bugs

---

## Phase 3 — Worth Coming Back To: "My Community Lives Here"

**Timeline:** Weeks 9–12  
**PRD Features:** F10, F28, F29, F30, F31, F33, F34, F35, F38, F39, F40, F61, F62, F63, F64, F65, F84, F88, F89, F90, F92, F93, F94, F99, F109, F110, F111  
**Status after this phase:** ✅ Fully engaged community — users check RollCall daily, not just when they need to find a group

### What Gets Built

#### Real-Time Chat (F10)
- Multi-channel group chat powered by Socket.io (up to 5 channels: #general, #scheduling, #off-topic)
- Markdown subset support, emoji reactions, inline reply threads, image attachments
- @mentions with real-time notifications (F63)
- Spoiler tag syntax `||text||` with click-to-reveal (F65)
- Mod tools: delete, pin, warn, chat-mute, slow mode
- Full-text per-channel search
- **Why this matters:** External chat (Discord, WhatsApp) cannot be moderated — if a scam or harassment happens off-platform, RollCall has no recourse. Keeping chat in-product protects users and the platform.

#### Group Forum (F61, F64, F65)
- Forum tab on all group pages with post types: Discussion / Tip / Point of Interest / Announcement
- Threaded replies, Helpful reactions, full-text search
- Post voting: upvote/downvote with net score display, collapsed-post threshold at −5
- Rising Star and Crowd Favourite badges tied to post vote milestones
- Sort-by-Top in forum listings

#### Community Calendar (F94)
- Per-group Calendar tab with month / week / list views (keyboard and screen-reader compliant)
- Calendar visibility setting per group: Public / Members Only / Followers Only
- Unified personal `/calendar` page with group toggle, 12-colour assignment, "My Week" summary card
- Bulk .ics export for all toggled groups; add-to-Google-Calendar links
- Advanced event filtering: activity type, skill level, format, group, RSVP status, date range
- "What's Missing Near You" gap finder at `/discover/gaps` — surface underserved activity categories with "Be the first!" group creation CTA

#### Personalized Home Dashboard (F111)
- Dynamic `/home` page with 5 personalized sections:
  1. **My Week** — 7-day calendar strip of all RSVPd sessions
  2. **Recommended For You** — 4–6 group cards scored by match algorithm with "why it matched" chips
  3. **My Groups — Recent Activity** — live feed of posts, new members, polls, announcements since last visit
  4. **My Forum Threads** — threads with new unread replies since last visit
  5. **Trending in Your Interests** — new groups in matching categories, high-demand gaps
- User can collapse / hide optional sections via ⚙️ Customise button
- Per-section cache TTLs (1–30 min) with skeleton loaders

#### Group Icons & Visual Identity (F109)
- Every group gets a visual icon on Discover cards, group header, calendar, and map pins
- Four icon source tiers: IGDB API (video game cover art) / BoardGameGeek API (tabletop) / curated SVG icon library (sports) / custom Cloudinary upload
- Custom uploads go through AI moderation pipeline

#### Virtual Tabletop Integration (F110)
- Online RPG groups can link their Roll20 campaign at the group level with a per-session override
- Roll20 badge (🎲) on Discover cards, group header, map pins, and onboarding match cards
- Session reminders include "Join on Roll20" CTA in email and in-app
- Discover filter: "Roll20 games only" and "Any VTT platform" toggles
- All Roll20 links pass through External Link Warning (F62) — one-time per domain

#### Engagement Tools (F29, F30, F31, F33, F34, F36)
- Calendar export (.ics + Google Calendar link) for all events (F29)
- Recurring event templates (F30)
- Post-session recap & attendance confirmation flow (F30)
- Email invitation system with invite analytics (F31)
- In-group polls: create, vote, live results (F34)
- Group Resource Hub: pinned links, files, suggested prompts (F33)
- Group ownership transfer: manual + inactivity auto-transfer (F28)
- External link warning intercept modal (F62)

#### Achievement & Badge System (F40)
- 17 badge definitions across 5 categories: Early Adopter, Session Badges, Contribution Badges, Merit Badges, Community Champion
- Automated trigger flow wired to onboarding, session confirmation, invite events, helpful votes
- Badge shelf on profiles; share-to-feed flow
- Admin custom badge creation and manual award flow

#### Help Center (F39)
- Searchable `/help` page with admin-editable articles
- 9 seeded categories covering all major platform features
- Helpful feedback system per article

#### Accessibility & Wellbeing (F84, F88, F89, F90, F92, F93)
- Group Owner First-Run Wizard (F88): 4-step post-creation wizard (invite / welcome / schedule / checklist) + persistent setup checklist for owners
- Contextual ⓘ tooltips on trust score, badge progress, warning count, waitlist position (F89)
- Skeleton loaders and loading state standards for all data-heavy views (F90)
- Mental Health Crisis Resource surfacing (F92): "Concerning — person may be in distress" report category; crisis keyword filter parallel to message delivery; gentle banner; `/support` page in footer
- Mental Health & Crisis Resource Hub at `/support/mental-health` (F99): 988, Crisis Text Line, SAMHSA, NAMI, Trevor Project
- Parental / Guardian Access for minor (13–17) users (F84): mandatory guardian consent flow, read-only Guardian Portal, minor DM restrictions, RSVP notifications to guardians
- Community Champion & Peer Recognition (F93): monthly peer shoutout, Champion badge after 5 shoutouts, admin Spotlight Award

#### Notifications (F38, F63)
- Full notification preferences center — all non-safety notifications are opt-out (F38)
- Real-time @mention notifications via Socket.io (F63)
- PWA push notification support (opt-in per type) (F35)
- Unified Activity Feed at `/activity` with type and group filters

### Business Value

> **Retention is the business.** A platform where users only show up when they need to find a new group has no moat. Phase 3 gives users a reason to open RollCall every day: their chat is here, their calendar is here, their forum is here, their community is here. Weekly active usage goes up. Churn goes down.

**Measurable outcomes after Phase 3:**
- Weekly Return Rate ≥ 40% (Phase 1 success metric met)
- Average group lifespan ≥ 30 days
- Users with ≥ 1 forum post: 30%+
- Users who open the dashboard 3+ times per week: 25%+
- 70% of groups with 3+ members have at least 1 forum post per week

### Go / No-Go Gate

✅ Before Phase 4:
- Socket.io real-time chat passes load test at 500 concurrent connections
- All calendar flows tested with recurring events and timezone edge cases
- Home dashboard serving all 5 sections within 3 seconds on 4G
- Parental consent flow audited by a COPPA-familiar reviewer

---

## Phase 4 — Grows Itself: "The Platform Finds You People"

**Timeline:** Weeks 13–16  
**PRD Features:** F45, F46, F47, F49, F60, F67, F68, F69, F70, F71, F72, F73, F74, F83, F85, F86, F87, F91, F95, F97, F100  
**Status after this phase:** ✅ Platform discovers new users organically, retains existing ones intelligently, and is ready for geographic expansion

### What Gets Built

#### Personalized Discovery Engine (F60, F83)
- "For You" personalized group feed — rule-based weighted scoring across 8 signals: interests (40%), game title (20%), location (15%), availability (15%), platform (5%), experience (5%), follow-graph (High), browsing history (Medium)
- Match reason chips: "You play Valorant", "Weekends work for you", "Near Boca Raton"
- "More Like This" on group pages
- "Trending near you" section
- User Follow System (F83): asymmetric follows, Following activity tab, "People You Might Know" suggestions on Discover and post-join

#### Map & Location Discovery (F45, F46)
- Google Maps Location Tagging on events: Places Autocomplete, two-tier location privacy (public city / full pin for confirmed members), "Open in Google Maps" deep-link
- Mapbox GL JS map view on Discover page: distance filter slider, PostGIS radius queries, map/list toggle, Geolocation API

#### Communication (F67)
- Private 1:1 Direct Messaging: DM inbox at `/messages`, Socket.io typing indicators, message-request inbox, read receipts (opt-in), available to all users with no thread limits

#### Analytics & Organizer Tools (F68, F70)
- PostHog self-hosted analytics: 16+ tracked events from signup through referral conversion; 4 conversion funnels; feature flags for gradual rollouts; admin Platform Metrics tab
- Organizer Analytics Dashboard at `/groups/:id/analytics`: audience breakdown, session attendance trends, content engagement, discovery metrics, CSV export

#### Email Automation (F69)
- BullMQ-driven email sequences: 4-email welcome series, re-engagement series (D14/D21/D30), win-back at D60, weekly digest opt-in, 2-hour session reminders
- All emails honor notification preferences from F38

#### Growth Engine (F71, F72, F100)
- SEO & Structured Data (F71): schema.org Event + Organization JSON-LD; dynamic `<title>`/`<meta description>` per page; nightly-generated `/sitemap.xml`; crawl directives in `robots.txt`
- Referral Program (F72): `rollcall.gg/join?ref=USERNAME` links; Community Builder + Early Supporter badge rewards; extended onboarding for referred users; `/settings/referrals` dashboard
- Partner Discount Program (F100): `/discounts` page with rotating monthly deal cards for gaming and tabletop accessories; passive revenue via affiliate commissions (first revenue stream — no feature gate required)

#### Advanced Group Features (F73, F74, F95)
- Secret Groups (F73): invite-link-only, no search/discover/profile visibility, configurable link expiry
- Group Creation Templates (F74): 8 activity templates as Step 0 card grid; pre-fills creation form
- Outdoor Activity Safety Prerequisites (F95): 4-tier experience scale per category; owner-configurable minimum level; join flow gate with "Update your level" CTA; applies to hiking, climbing, water sports, cycling, martial arts

#### Security (F47)
- Optional SMS-based 3-Factor Authentication (opt-in enrollment in Settings → Security; Twilio OTP; backup codes required; lockout after 5 failed OTPs)

#### Accessibility (F49, F85, F86, F87)
- Interest & Activity History Tracker (F49): activity timeline, current interests panel, activity stats, privacy toggles
- Cognitive Accessibility Mode (F85): distraction-free chat, 3 message density presets, notification batching into daily digest
- Per-Session Accessibility Accommodations (F86): optional RSVP accessibility note visible to owner/mods only, group-level Accessibility Statement field
- Notification Fatigue Prevention (F87): Essential Only preset, Quiet Hours with batch delivery

#### Organizer Wellbeing (F91)
- Organizer Burnout Signals: "Group Health & You" fifth dashboard section showing moderation volume, co-mod activity, time-since-last-session, member join trend, and delegation suggestion cards

#### Geographic Expansion Waitlist (F97)
- Non-PBC users who hit the local activity gate can join a county waitlist
- Admin demand threshold alert at 20 users per county (email + in-app)
- Admin Expansion Demand tab: county demand table, Approve action to open new region
- Milestone alerts at 50 and 100 waitlisted users per county

### Business Value

> **This phase makes growth automatic.** SEO drives inbound traffic without paid ads. The referral program turns existing users into recruiters. The personalization engine keeps every user on a unique, relevant path through the platform. Organizer analytics give group owners proof that their effort is working — which keeps them running groups. The affiliate discount program generates the platform's first passive revenue without a single new feature gate.

**Measurable outcomes after Phase 4:**
- 10%+ of new signups arriving via referral links
- 30%+ of Discover page opens resulting in a group view
- Organizer Dashboard used by 60%+ of active group owners
- `/sitemap.xml` indexed by Google; group pages appearing in search results
- First affiliate commission revenue generated

### Go / No-Go Gate

✅ Before Phase 5:
- PostHog funnel dashboards operational and showing full signup-to-join funnel
- Referral fraud detection (IP + email checks) tested and passing
- SEO audit completed: all group pages have unique `<title>` and `<meta description>`
- At least 1 out-of-county waitlist with 20+ users (expansion candidate)

---

## Phase 5 — Built to Last: "Enterprise-Grade, Legally Compliant"

**Timeline:** Weeks 17–20  
**PRD Features:** F59, F75, F76, F77, F78, F79, F80, F81, F82, F96 (NPS), F98, F101, F102, F103, F104, F105, F106, F107  
**Status after this phase:** ✅ COMPLETED — Platform is hardened, legally defensible, and ready for institutional scrutiny

### What Gets Built

#### Legal & Compliance (F75)
- Full data retention schedule enforced via automated BullMQ purge jobs
- Right-to-erasure API: 30-day grace period, permanent deletion with audit record
- Data export ZIP (9 files: profile, posts, votes, sessions, DMs, reviews, badges, groups, deletion-log)
- `deletion_requests` table; GDPR / CCPA / CAN-SPAM compliance audit
- Explicit data exclusions: member rosters, other users' contact info, group-level data

#### Anti-Scraping & Data Protection (F98)
- Three-tier visibility model: anonymous / logged-in non-member / confirmed member
- Anonymous visitors see only: group name, category, city, 120-char description teaser, approximate member count
- All `/api/*` data endpoints require JWT; only 6 public endpoints remain unauthenticated
- Tiered rate limits: 20 req/min unauthenticated / 120 general authenticated / 10/hour on member list endpoints
- Honeypot hidden fields on all forms (silent reject + fraud score increment)
- FingerprintJS headless signal detection; datacenter ASN blocking
- Cloudflare Bot Fight Mode as first-layer defense
- No bulk data endpoints — all list endpoints require at least one filter parameter
- Email addresses never returned by any public or member-facing API

#### Infrastructure Security (F79, F80, F81, F82)
- Backup Verification Runbook (F79): automated daily integrity checks, monthly restore drill to staging, cross-region S3/R2 secondary backup, documented 7-step restore runbook
- DoS Protection & Circuit Breakers (F80): per-endpoint enhanced rate limits, opossum circuit breakers for Cloudinary/SendGrid/Twilio/Google Maps/PostHog, Cloudflare reverse proxy
- Fraud Scoring & Graduated Lockout (F81): 8-signal fraud score with time-decay, 5-tier lockout (0–30 normal → 90–100 suspended), manual admin override
- Immutable Admin Audit Log (F82): append-only `admin_audit_log`, 3-year retention, WORM S3 secondary copy, platform-owner CSV export

#### Platform Health (F76, F77, F78)
- Public Status Page (F76): component health at `/status`, in-app degradation banner, admin incident management, email/RSS subscription
- Support Ticket System (F77): categorized ticket form at `/help/contact`, admin support queue, email-based reply threads, SLA targets (Safety 4h / Compliance 48h / Standard 5 days)
- Cross-Account Abuse Tracking (F78): 5-signal account-linking (IP, FingerprintJS, email domain, username edit distance, UA hash); graduated flag → admin review → auto-ban

#### Accessibility Hardening (F59, F101)
- Full accessibility options: font size slider, high contrast toggle, reduced motion, screen reader mode (F59)
- Group accessibility tags: Neurodivergent-Friendly, Deaf/HoH, Mobility, Low Sensory, Beginner Safe, Chronic Illness Friendly (F59)
- Browser Compatibility & Support Policy (F101): evergreen Chrome/Firefox/Safari/Edge support, non-blocking unsupported browser banner, Playwright smoke-test matrix

#### Quality-of-Life Features (F102–F107)
- Fully Optional Notifications (F102): policy enforcement — mandatory-only list is password reset, suspension, COPPA, guardian consent, data export; all others opt-out
- Optional Display Phone & Email in Profile (F103): visible to confirmed group members only; separate from login email and 3FA number
- In-Editor Spell Check (F104): `spellcheck="true"` on all textareas + Typo.js for rich-text editors
- Forum PDF Attachments (F105): client `accept=".pdf"`, server MIME validation, Cloudinary restriction, 10 MB max, 3 per post, signed-URL download card
- Last-Minute Cancellation Reputation Penalty (F106): −8 trust score, `late_cancel_count_90d` counter, profile badge after 1st offence, ⚠️🕐 Reliability Warning after 3 in 90 days
- Unified Behavioural Analytics (F107): extended PostHog event stream with 12 new event types; plain-language disclosure in ToS; opt-out in Settings → Privacy; Feature Usage heatmap and Discovery Funnel in admin panel

### Business Value

> **Compliance and security are not optional — they're table stakes.** This phase protects every user's data, gives the platform legal defensibility under GDPR and CCPA, and hardens the infrastructure against the attacks that always come when a platform starts to grow. It also documents the platform's quality in a way that any investor, partner, or enterprise customer can audit.

**Measurable outcomes after Phase 5:**
- Zero unresolved GDPR deletion requests older than 30 days
- All support tickets meeting SLA targets (Safety < 4h, Compliance < 48h)
- 100% of admin actions logged in immutable audit log
- Lighthouse accessibility score ≥ 90 on all core pages
- Fraud score system catching > 90% of known bad-actor patterns in testing

### Go / No-Go Gate

✅ Before Phase 6:
- GDPR/CCPA compliance audit completed by a legal reviewer
- Penetration test completed against production environment
- Disaster recovery runbook tested end-to-end in staging
- All SLA targets met for 14 consecutive days in production

---

## Phase 6 — Ready to Scale: "Expansion & Monetization"

**Timeline:** Month 5+  
**PRD Features:** F97 (county activation), Monetization, Geographic Expansion, Native Mobile  
**Status after this phase:** ✅ COMPLETED — Geographic expansion engine and monetization foundation are live. RollCall is ready to scale globally.
**Trigger:** 250 users / 50 active groups / 40% weekly return rate (all three conditions met)

### What Happens in Phase 6

This phase is **trigger-gated** — it does not begin on a calendar date. It begins when the Palm Beach County pilot proves out:

| Trigger Metric | Target | Status |
|----------------|--------|--------|
| Registered Users | 250+ PBC residents | Measured |
| Active Groups | 50+ groups with sessions in last 30 days | Measured |
| Weekly Return Rate | 40%+ of registered users active each week | Measured |
| Organizer Satisfaction NPS | ≥ 50 | Measured via F96 |

#### Geographic Expansion
- Activate the first waitlisted county via the Phase 4 expansion admin tool (F97)
- Priority order based on waitlist demand: Broward County → Miami-Dade → Palm Beach west extension
- One config change in `approved_regions` table activates a new county — no code deploy required
- All waitlisted users in activated county receive an invitation email automatically

#### Monetization (Live from Launch)
- **Subscription billing is active from Day 1** — Participant plan ($10/mo) and Organizer plan ($15/mo) with 15% annual discount and a 30-day free trial for all new accounts
- **No credit card required at trial start** — account prompts for plan selection at day 30
- **Affiliate commissions (F100)** generating passive revenue from Phase 4 onward
- **Phase 6 monetization focus:** Promoted Group Placement — paid discovery slot for group owners wanting faster growth; builds on subscription infrastructure already live
- **Future enhancement:** custom domain, priority support queue, and advanced analytics add-ons for high-volume Organizer accounts (evaluated after 1,000 active subscribers)

#### Native Mobile Apps
- React Native (shared codebase with web React)
- iOS (App Store) + Android (Google Play)
- Core feature parity with web: groups, events, chat, notifications, profile
- Push notifications via Expo + FCM/APNs
- Deep links from email and social share

#### Platform Integrations (Future Roadmap)
- Discord Bot: post-session recaps, RSVP commands in Discord
- Steam / PlayStation / Xbox account linking with verified game library
- Venue Partnerships: local PBC venues as partner locations
- AI-powered match improvement: ML-based upgrade over rule-based scoring (F60)

### Business Value

> **Phase 6 is where growth compounds.** The business model was proven from launch — subscription billing is live and generating recurring revenue from Day 1 of the pilot. Phase 6 takes a product that 250+ people already pay for and love, opens it to new markets, and accelerates revenue through geographic expansion and promoted placement. Expansion is low-cost because the platform is already built — it's literally a one-row database change per county.

**Phase 6 success metrics:**
- Month 6: Active in 2 South Florida counties
- Month 9: 1,000+ registered users across all active counties with positive MRR
- Month 12: Promoted Group Placement feature live; 10%+ of active Organizer accounts using it
- Year 2: React Native apps live on both app stores

---

## Feature Rollup by Phase

| Feature | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 |
|---------|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| Auth & Profiles (F1) | ✅ | | | | | |
| Group Creation (F2) | ✅ | | | | | |
| Discover & Search (F3, F37) | ✅ | | | | | |
| Dashboard (F8) | ✅ | | | | | |
| Onboarding (F26) | ✅ | | | | | |
| Legal Pages (F32) | ✅ | | | | | |
| Notifications (F5, F38) | ✅ | | | | | |
| Admin Panel (F15) | | ✅ | | | | |
| Content Moderation (F18, F22) | | ✅ | | | | |
| Trust Signals (F24) | | ✅ | | | | |
| Report System | | ✅ | | | | |
| Silent Safety Alarm (F41) | | ✅ | | | | |
| Scam Prevention (F108) | | ✅ | | | | |
| Group Ratings (F55) | | ✅ | | | | |
| Spam/Bot Defense (F53) | | ✅ | | | | |
| Real-Time Chat (F10) | | | ✅ | | | |
| Group Forum (F61, F64, F65) | | | ✅ | | | |
| Community Calendar (F94) | | | ✅ | | | |
| Personalized Dashboard (F111) | | | ✅ | | | |
| Group Icons (F109) | | | ✅ | | | |
| Roll20 Integration (F110) | | | ✅ | | | |
| Badge System (F40) | | | ✅ | | | |
| Help Center (F39) | | | ✅ | | | |
| Crisis Resources (F92, F99) | | | ✅ | | | |
| Parental Access (F84) | | | ✅ | | | |
| Personalized Discovery (F60, F83) | | | | ✅ | | |
| Map & Proximity Search (F45, F46) | | | | ✅ | | |
| Direct Messaging (F67) | | | | ✅ | | |
| Organizer Analytics (F70) | | | | ✅ | | |
| PostHog Analytics (F68) | | | | ✅ | | |
| Email Automation (F69) | | | | ✅ | | |
| SEO & Structured Data (F71) | | | | ✅ | | |
| Referral Program (F72) | | | | ✅ | | |
| Partner Discounts (F100) | | | | ✅ | | |
| Expansion Waitlist (F97) | | | | ✅ | | |
| 3-Factor Authentication (F47) | | | | ✅ | | |
| Data Retention / GDPR (F75) | | | | | ✅ | |
| Anti-Scraping (F98) | | | | | ✅ | |
| Fraud Scoring (F81) | | | | | ✅ | |
| Audit Log (F82) | | | | | ✅ | |
| DoS Protection (F80) | | | | | ✅ | |
| Support Tickets (F77) | | | | | ✅ | |
| Status Page (F76) | | | | | ✅ | |
| Full Accessibility (F59, F101) | | | | | ✅ | |
| Geographic Expansion | | | | | | ✅ |
| Monetization (Premium) | | | | | | ✅ |
| Native Mobile Apps | | | | | | ✅ |

---

## Business Value Summary

| Phase | Business Value Statement | Key Proof Point |
|-------|--------------------------|-----------------|
| **Phase 0** | Demand is proven before money is spent | 20 groups live with real organizers before public launch |
| **Phase 1** | A real product exists that solves a real problem | Users sign up and join a group in under 5 minutes |
| **Phase 2** | Safe enough for strangers to trust | Zero unmoderated scam attempts reaching users |
| **Phase 3** | Sticky enough to make users stay | 40%+ weekly return rate — users are here for their community |
| **Phase 4** | Smart enough to grow without paid ads | Referrals + SEO driving 10%+ of new signups organically |
| **Phase 5** | Hardened enough for investors and partners | GDPR-compliant, pen-tested, audit-logged |
| **Phase 6** | Ready to become a business | Geographic expansion + first paid revenue stream |

---

## Timeline at a Glance

```
Week  1–2    Phase 0   Pre-launch seeding (no code)
Week  1–4    Phase 1   MVP build + private soft launch
Week  6–8    Phase 2   Safety & moderation layer
Week  9–12   Phase 3   Engagement & community features
Week  13–16  Phase 4   Growth engine: personalization, analytics, SEO
Week  17–20  Phase 5   Hardening, compliance, accessibility
Month 5+     Phase 6   Geographic expansion + monetization (trigger-gated)
```

---

## Tech Stack Reference

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), TailwindCSS, React Router, React Query |
| Backend | Node.js + Express.js |
| Database | PostgreSQL + Prisma ORM + PostGIS (F46) |
| Real-Time | Socket.io + Redis adapter (F10, F63, F67) |
| File Storage | Cloudinary (images, avatars, forum PDFs) |
| Maps | Mapbox GL JS (Discover map) + Google Maps API (event location) |
| Email | SendGrid / Resend + BullMQ job queue |
| SMS | Twilio (3FA, safety alarm) |
| Analytics | PostHog (self-hosted) |
| Auth | JWT + bcrypt + Google OAuth |
| Search | Fuse.js (fuzzy) + PostgreSQL full-text |
| CI/CD | GitHub Actions → Railway (API) + Vercel (frontend) |
| Security | Cloudflare (DDoS) + FingerprintJS + hCaptcha |
| Monitoring | Sentry (errors) + k6 (load tests) |
| Board Games API | BoardGameGeek XML API v2 |
| Game Cover Art | IGDB API (Twitch credentials) |
| Virtual Tabletop | Roll20 URL integration (extensible to Foundry VTT) |

---

*This document is a living plan. Phase timelines are estimates and may shift based on team size, feedback from live users, and business priorities. The go/no-go gates are hard requirements — no phase begins until the previous gate is cleared.*

*RollCall PRD v3.17 is the authoritative source of truth for all feature specifications referenced here.*
