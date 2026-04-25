# RollCall PRD Reference — v3.17

> Always-active. Condensed feature index for all agents.
> Full spec lives in `docs/RollCall_PRD.md`. When in doubt, read the full spec.

---

## Feature Index (F1–F111)

### Core Platform (Phase 1)
| Feature | Name | Priority | Key Constraint |
|---------|------|----------|---------------|
| F1 | User Authentication & Profiles | Must Have | 13+ age, COPPA, Google OAuth, optional DOB |
| F2 | Group Creation | Must Have | Community Standards ack checkbox required |
| F3 | Group Discovery (Discover page) | Must Have | Category + location type filters |
| F4 | Membership Roles | Must Have | Owner, Co-Moderator, Member |
| F5 | Notification System | Must Have | In-app bell; F38 governs preferences |
| F6 | Session / Event Creation | Must Have | RSVP: Going/Maybe/Can't Make It |
| F7 | Group Updates Feed | Must Have | Pinned announcements + member activity |
| F8 | User Dashboard | Must Have | My groups + upcoming events |
| F12 | PWA (Progressive Web App) | Must Have | Manifest + Workbox service worker |
| F13 | Dark/Light Mode Toggle | Must Have | ThemeContext + Tailwind `darkMode: 'class'` + localStorage |
| F14 | Community Standards / Zero-Tolerance Policy | Must Have | Financial solicitation = zero-tolerance (F108) |
| F26 | Onboarding Flow | Must Have | 6 steps; Step 5 = live group auto-match (score ≥ 35) |
| F27 | Saved Searches & Group Alerts | Must Have | Max 5 saved alerts per user |
| F32 | Legal & Compliance | Must Have | ToS, Privacy Policy, COPPA, GDPR, CCPA, CAN-SPAM |
| F36 | Social Sharing & Public Preview | Must Have | Open Graph meta tags + QR code |
| F37 | Fuzzy Search & Smart Defaults | Must Have | Fuse.js + synonym map (LOL→League of Legends, WoW→World of Warcraft) |
| F48 | Streamlined Join/Leave UX | Must Have | PBC ZIP gate for local groups; one-tap for open, request for invite-only |
| F58 | Account Recovery | Must Have | 4 tiers; 8 MFA backup codes; manual identity verification |

### Safety & Moderation (Phase 2)
| Feature | Name | Priority | Key Constraint |
|---------|------|----------|---------------|
| F15 | Admin Control Panel | Must Have | Tab 6 (sensitive reports) = platform-owner only |
| F17 | Group-Level Moderation | Must Have | Co-Mod role, strike system, Mod Log |
| F18 | Automated Content Pre-Screening | Must Have | Server-side before Socket.io broadcast |
| F22 | Graduated Moderation | Must Have | Warn → Mute → Suspend → Ban |
| F24 | Profile Trust Signals | Must Have | Trust score ring, verified badge, conduct flag ≥2 warnings |
| F25 | In-Person Safety Features | Must Have | Safe meeting guidelines, check-in, venue type warning |
| F41 | Silent Safety Alarm | Must Have | Triple-tap or shake; GPS purged in 24h; Twilio SMS |
| F42 | Profile Avatar Upload | Should Have | Cloudinary + AI moderation pipeline |
| F43 | Personal Information Protection | Should Have | Soft warning on phone/address patterns |
| F44 | Inappropriate Profile Reporting | Should Have | 3 reports in 7 days = auto-flag |
| F50 | Group Waitlist / Queue | Must Have | Ordered queue; 48h auto-invite |
| F51 | Session Cancellation Flow | Must Have | Group health integration; event_exceptions table |
| F52 | Moderation Appeal Process | Must Have | 7-day window; warnings and suspensions only |
| F53 | Spam & Bot Detection | Must Have | Velocity checks + FingerprintJS + hCaptcha |
| F55 | Group & Organizer Rating | Should Have | Anonymous; separate group/host scores |
| F56 | User Connections / Saved Players | Should Have | Private bookmark + LFG alert |
| F57 | Recurring Event Exception Handling | Should Have | Skip / reschedule single occurrence |
| F96 | User Experience Feedback & NPS | Must Have | NPS at D14 and D60; persistent feedback widget |
| F108 | Scam & Social Engineering Prevention | Must Have | 7-part spec; zero-tolerance financial solicitation |

### Engagement & Community (Phase 3)
| Feature | Name | Priority | Key Constraint |
|---------|------|----------|---------------|
| F10 | Real-Time Group Chat | Must Have | Socket.io; up to 5 channels; screened before broadcast |
| F28 | Group Ownership Transfer | Must Have | Manual + inactivity auto-transfer |
| F29 | Calendar Export | Should Have | .ics + Google Calendar link |
| F30 | Post-Session Recap & Attendance | Should Have | Confirmation flow |
| F31 | Email Invitation System | Should Have | Invite analytics |
| F33 | Group Resource Hub | Should Have | Pinned links, files, prompts |
| F34 | In-Group Polls | Should Have | Create, vote, live results |
| F35 | Progressive Web App Push | Should Have | Opt-in per notification type |
| F38 | Notification Preferences Center | Must Have | Mandatory list is short — everything else opt-out |
| F39 | Help Center & FAQ | Must Have | Admin-editable articles; 9 seeded categories |
| F40 | Achievement & Badge System | Must Have | 17 badge definitions across 5 categories |
| F61 | Group Forum with Tips & POI | Must Have | Tiptap editor; post types: Discussion/Tip/POI/Announcement |
| F62 | External Link Warning System | Must Have | One-time intercept per domain; trusted domain bypass list |
| F63 | Mentions & Real-Time Activity Alerts | Must Have | @mention pipeline; Socket.io personal notification rooms |
| F64 | Post Voting | Should Have | Upvote/downvote; collapsed at −5 net score |
| F65 | Spoiler Tags | Should Have | `||text||` syntax; click-to-reveal |
| F84 | Parental/Guardian Access | Must Have | Guardian consent flow; read-only Guardian Portal |
| F88 | Group Owner First-Run Wizard | Should Have | 4-step wizard post-creation |
| F89 | Contextual Help & Tooltips | Should Have | ⓘ on trust score, badge progress, warning count |
| F90 | Skeleton Loaders & Loading States | Should Have | Per-view skeleton patterns |
| F92 | Mental Health Crisis Resource Surfacing | Must Have | Crisis keyword filter (parallel, never blocks); /support footer |
| F93 | Community Champion & Peer Recognition | Should Have | Monthly shoutout; Champion badge after 5 |
| F94 | Community Calendar & Gap Finder | Must Have | Per-group + unified /calendar; gap finder at /discover/gaps |
| F99 | Mental Health & Crisis Resource Hub | Must Have | /support/mental-health; admin-editable |
| F109 | Group Activity Icons & Game Cover Art | Should Have | IGDB / BGG / SVG library / Cloudinary custom |
| F110 | Roll20 & Virtual Tabletop Integration | Should Have | Group-level VTT link; Roll20 badge; F62 integration |
| F111 | Personalized Home Dashboard | Must Have | 5 sections; single API call; per-section TTLs |

### Growth & Personalization (Phase 4)
| Feature | Name | Key Constraint |
|---------|------|---------------|
| F45 | Google Maps Location Tagging | Two-tier privacy: public city / full pin for confirmed members only |
| F46 | Proximity Search & Map View | Mapbox GL JS; PostGIS ST_DWithin; Geolocation API |
| F47 | Optional 3FA via SMS | Opt-in only; Twilio; backup codes required |
| F49 | Interest & Activity History Tracker | Privacy toggles; never auto-shared |
| F60 | Dynamic Interest-Based Group Discovery | Rule-based weighted scoring (not ML); 10-min server cache |
| F67 | Private 1:1 Direct Messaging | All users, no limits, no tier gate; read receipts opt-in |
| F68 | Product Analytics (PostHog) | Self-hosted; analytics opt-out in Settings → Privacy |
| F69 | Email Marketing Automation | BullMQ; welcome series + re-engagement; honors F38 prefs |
| F70 | Organizer Analytics Dashboard | All group owners; no tier gate; CSV export |
| F71 | SEO & Structured Data | schema.org JSON-LD; Event JSON-LD restricted (F98) |
| F72 | Referral Program | `rollcall.gg/join?ref=USERNAME`; badge reward; IP/email fraud check |
| F73 | Secret Groups | Invite-link-only; no search/discover/profile visibility |
| F74 | Group Creation Templates | 8 templates; Step 0 card grid |
| F83 | User Follow System | Asymmetric; approval-required mode; following activity tab |
| F85 | Cognitive Accessibility Mode | Distraction-free chat; 3 density presets |
| F86 | Per-Session Accessibility Accommodations | Free-text RSVP note; visible to owner/mods only; purged 24h post-event |
| F87 | Notification Fatigue Prevention | Essential Only preset; Quiet Hours with batch delivery |
| F91 | Organizer Burnout Signals | "Group Health & You" dashboard section |
| F95 | Outdoor Activity Safety Prerequisites | 4-tier experience scale; join flow gate; server-side enforcement |
| F97 | Geographic Expansion Waitlist | County waitlist; admin alert at 20 users; one config change to activate |
| F100 | Partner Discount Program | /discounts page; affiliate commissions; no feature gate |

### Hardening & Compliance (Phase 5)
| Feature | Name | Key Constraint |
|---------|------|---------------|
| F59 | Enhanced Accessibility Options | Font size, high contrast, reduced motion, screen reader mode |
| F75 | Data Retention & Purge Policy | Right-to-erasure; 30-day grace; GDPR/CCPA/CAN-SPAM |
| F76 | Public Status Page | /status; in-app degradation banner; email/RSS subscription |
| F77 | Support Ticket System | SLA: Safety 4h / Compliance 48h / Standard 5 days |
| F78 | Cross-Account Abuse Tracking | 5-signal account-linking; flag → review → auto-ban |
| F79 | Backup Verification & DR Runbook | RPO ≤24h; RTO ≤4h; monthly restore drill |
| F80 | DoS Protection & Circuit Breakers | opossum circuit breakers for all third-party APIs |
| F81 | Fraud Scoring & Graduated Lockout | 8 signals; 5-tier lockout (0–100); time-decay |
| F82 | Immutable Admin Audit Log | Append-only; 3-year retention; WORM secondary |
| F98 | Data Protection & Anti-Scraping | 3-tier visibility; JWT on all /api/*; honeypot fields |
| F101 | Browser Compatibility Policy | Evergreen Chrome/Firefox/Safari/Edge; Playwright matrix |
| F102 | Fully Optional Notifications | Mandatory list only: password reset, suspension, COPPA, guardian, export |
| F103 | Optional Display Phone & Email | Visible to confirmed group members only |
| F104 | In-Editor Spell Check | spellcheck="true" + Typo.js; no autocorrect |
| F105 | Forum Attachments PDF Only | 10 MB max; 3 per post; signed-URL download |
| F106 | Last-Minute Cancellation Penalty | −8 trust score; ⚠️🕐 badge after 3 in 90 days |
| F107 | Unified Behavioural Analytics | PostHog extended; opt-out in Settings → Privacy |

---

## User Story Count by Phase

| Phase | User Stories | Story Numbers |
|-------|-------------|---------------|
| Foundation (v1.x) | #1–80 | Core platform stories |
| MVP Expansion (v2.x) | #81–156 | Safety, moderation, operations |
| Community (v2.x cont.) | #157–255 | DMs, analytics, forum, calendar |
| Growth (v3.x) | #256–346 | Personalization, wellbeing, advanced features |
| **Total** | **346** | |

---

## Success Metrics (Phase 1 pilot targets — 3 months post-launch)

| Metric | Target |
|--------|--------|
| Registered Users | 250+ (PBC residents) |
| Groups Created | 50+ |
| Groups with 3+ Members | 70% |
| Weekly Return Rate | 40%+ |
| Average Group Lifespan | 30+ days |
| Cities with ≥ 3 active groups | 5+ |
| Organizer-recruited member rate | ≥ 60% |
