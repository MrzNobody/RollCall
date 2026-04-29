# RollCall — Product Requirements Document

**Version:** 3.18  
**Date:** April 29, 2026  
**Status:** Draft  
**Author:** Carlo Raineri  
**Changelog:**
- v3.18 — **Subscription Billing Model Adopted**: RollCall is no longer free; all references to the platform being permanently free have been removed. Pricing: Participant plan $10/mo, Organizer plan $15/mo, 15% annual discount on both plans; all new accounts receive a 30-day free trial with no credit card required. Updated Launch Strategy Monetization subsection to reflect live subscription billing (replacing the deferred pilot-stage approach). Updated F108 Community Standards scam-prevention language to clarify that RollCall does not facilitate direct payments between users (removed prior "free platform" framing). Updated F70 Organizer Analytics availability from "at no cost" to "included in all Organizer plan subscriptions." Updated organizer recruiting pitch to "Your first 30 days are free." Updated Out of Scope section to remove "platform is fully free" framing. Companion document `RollCall_Pricing_Plans.md` created with full plan details, feature comparison, billing cycles, and competitive positioning.
- v3.17 — **F111 — Personalized Home Dashboard**: every logged-in user lands on a unique dynamic `/home` page assembling five personalised sections — (1) My Week: 7-day calendar strip of all upcoming RSVPd/member sessions with group icon, RSVP status badge, and Roll20 badge; links to full `/calendar` page; (2) Recommended For You: 4–6 group cards scored by F60 match algorithm (min score 35) with "why it matched" chips and one-tap join; warm zero-match empty state if insufficient groups; (3) My Groups — Recent Activity: live feed of new forum posts, new members, polls, resources, announcements, and unRSVPd sessions across all joined groups since last visit; up to 15 items ordered by recency; read-state tracked via `home_feed_last_seen_at`; (4) My Forum Threads: threads the user has posted or reacted to with new unread replies since last visit; reply count badge and last-reply preview; (5) Trending in Your Interests: new groups in matching categories, high-demand activity gaps from F94 Part 5, and large upcoming events (≥10 RSVPs); suppressed for users with ≥10 groups; section customisation: users can collapse or hide optional sections (Recommended, Forum Threads, Trending) via ⚙️ Customise button; prefs stored in `home_dashboard_prefs` JSONB on users table; all five sections returned in single `GET /api/home/feed` response to avoid waterfall; per-section cache TTLs (1–30 min) with targeted invalidation; skeleton loaders (F90) per section; greeting rotates by time of day; personalisation draws on interests (F26), memberships, RSVP history, forum activity, F60 scoring, F107 analytics, F83 follow graph, and F94 gap votes; `home_feed_last_seen_at` and `home_dashboard_prefs` columns added to users table; 8 new API endpoints; 7 new user stories #340–#346
- v3.16 — **F110 — Roll20 & Virtual Tabletop Integration**: online RPG groups can link their Roll20 campaign (or any VTT platform) once at the group level, with a per-session override for one-shots or side campaigns; Roll20 URL validated against `app.roll20.net` pattern at group creation/edit; campaign link visible to confirmed group members only — locked state shown to non-members; VTT panel rendered in group page right sidebar with Roll20 logo and "Open Roll20 Campaign" CTA; session reminders (24h + 2h) include "Join on Roll20" CTA in email and in-app notification; Discover filter panel extended with "Roll20 games only" and "Any VTT platform" toggles; Roll20 badge (🎲 SVG logo, 16×16) displayed on Discover group card, map pin popover, group header, and F26 onboarding match cards; all Roll20 links pass through F62 External Link Warning (one-time per domain, stored in `external_link_confirmations`); data model designed for VTT extensibility — Foundry VTT, Fantasy Grounds, Alchemy RPG can be added without schema changes; `vtt_platform` and `vtt_url` columns added to both `groups` and `events` tables; 4 new API endpoints; 6 new user stories #334–#339
- v3.15 — **F109 — Group Activity Icons & Game Cover Art**: every group displays a visual identity icon on Discover cards, group header, calendar, map pins, and chat thread lists; four icon source tiers — (1) IGDB API for video game cover art (Arc Raiders, Valorant, Elden Ring, etc.) with server-side proxy using Twitch developer credentials; (2) BoardGameGeek XML API v2 for tabletop, board game, and RPG cover art (D&D, Pathfinder, Gloomhaven, Wingspan, etc.); (3) curated SVG icon library for sports and activities (basketball, soccer, yoga, book club, etc.) shown as a visual picker grid at group creation; (4) custom Cloudinary upload (1:1 crop enforced, 5 MB max, MIME validation) available as override for any group at any time; F2 group creation flow updated with Icon step after category selection; all external cover art fetched once and cached via Cloudinary CDN at each required render size; IGDB and BGG cover art bypasses moderation as trusted sources; custom uploads go through F42 AI moderation pipeline; admin can remove icons from F15 Tab 1; `icon_source`, `icon_url`, `icon_igdb_id`, `icon_bgg_id`, `icon_lib_key` columns added to groups table; 5 new API endpoints; 2 new environment variables (IGDB_CLIENT_ID, IGDB_CLIENT_SECRET); 5 new user stories #329–#333
- v3.14 — Added **Pilot Stage Monetization** subsection to Launch Strategy: at the time of this version, the platform was planned to stay free through Phase 0–2, with active monetization deferred to Phase 3; this approach was superseded in v3.18 by the adoption of live subscription billing from launch (Participant $10/mo, Organizer $15/mo, 30-day free trial); F100 affiliate commissions activated at launch as passive revenue requiring no additional features
- v3.13 — **F108 — Scam & Social Engineering Prevention**: seven-part spec targeting the primary attack surface (human organizer soliciting off-platform payments) and secondary vectors (impersonation, account takeover): (1) F14 Community Standards extended with standalone Financial Solicitation prohibition at zero-tolerance tier — immediate suspension on report receipt, permanent ban on first substantiated offence, routes to Tab 6 fast-track; (2) New account organizer cool-down — accounts under 7 days cannot create groups; accounts under 14 days cannot DM their own members — both enforced server-side with config constants; (3) Payment pattern message screening — parallel server-side pass on all outgoing messages (never blocks delivery) detecting payment app names, solicitation verbs, and combined payment-app + dollar-amount signals; flags to admin queue + +15 fraud score on sender; (4) Two new report categories — "Financial solicitation / scam" (fast-track suspension for group owner reports) and "Impersonation" (standard-priority); both added to `violation_type` ENUM; (5) Mandatory payment prohibition acknowledgment checkbox at group creation — logged server-side as `payment_prohibition_ack` + timestamp on groups table; (6) New-member safety notice when group owner account is under 30 days old — one-time dismissible banner with Report CTA; dismissed state tracked in `group_members.seen_new_owner_notice`; (7) Verified Organizer badge (✅) — manually admin-granted, distinct from Trust Score, appears on profile/group cards/member lists; Phase 0 seeded organizers receive it automatically; admin grant/revoke endpoints logged in F82 audit log; database changes: 2 columns on `groups`, 3 columns on `users`, 1 column on `group_members`, 2 ENUM values on `violation_type`; 3 new admin API endpoints; 4 server config constants; 9 new user stories #320–#328
- v3.12 — **Converted Feature Backlog B1–B9 into full feature specifications F99–F107**: F99 Mental Health & Crisis Resource Hub (proactive `/support/mental-health` page with 988, Crisis Text Line, SAMHSA, NAMI, Trevor Project, IASP; persistent footer link; admin-editable via F39 Help Center editor); F100 Partner Discount Program (`/discounts` page with rotating monthly deal cards, promo code copy, 5 categories, `partner_deals` table, 5 API endpoints, admin management tab); F101 Browser Compatibility & Support Policy (evergreen Chrome/Firefox/Safari/Edge support, non-blocking unsupported browser banner with sessionStorage dismiss state, Playwright smoke-test matrix); F102 Fully Optional Notifications (policy enforcement pass — mandatory-only list is password reset, suspension, COPPA, guardian consent, data export; all others are opt-out; surfaced in F26 Step 4 onboarding); F103 Optional Display Phone & Email in Profile (`display_email` and `display_phone` columns on users table; visible to confirmed group members only; separate from account login email and 3FA number); F104 In-Editor Spell Check (`spellcheck="true"` on all textareas + Typo.js for rich-text editors; suggestions only, no autocorrect; language follows browser locale); F105 Forum Attachments Restricted to PDF Only (three enforcement layers: client `accept=".pdf"` attribute, server MIME validation, Cloudinary upload preset; download card with signed URL; no in-browser preview; 10 MB max, 3 attachments per post); F106 Last-Minute Cancellation Reputation Penalty (24-hour threshold; −8 trust score; −10 group health; `late_cancel_count_90d` counter; profile badge after 1st offence; ⚠️🕐 Reliability Warning badge after 3 in 90 days; emergency exception with admin review; `cancellation_events` table with generated `hours_before_session` column); F107 Unified Behavioural Analytics & Intelligent Tracking (extended PostHog event stream with 12 new event types; plain-language disclosure in ToS and first-login acceptance agreement; opt-out in Settings → Privacy; Feature Usage heatmap and Discovery Funnel in admin panel); Feature Backlog section header updated to reflect all items promoted; 22 new user stories #298–#319
- v3.11 — Removed B3 (Live Video & Voice Session Rooms) and B11 (AI Community Monitor & Moderation Assistant) from Feature Backlog — both assessed as high complexity and deferred back to Future Roadmap consideration; remaining backlog renumbered B1–B9
- v3.10 — Added **Feature Backlog (Pending Implementation)** section with 11 items approved in principle and awaiting full spec: B1 Mental Health & Crisis Resource Hub (proactive `/support/mental-health` page with 988, Crisis Text Line, SAMHSA, NAMI, Trevor Project, IASP — extends F92); B2 Partner Discount Program (monthly rotating promo codes for Xbox, PS Store, Steam, D&D, Hasbro, accessories, apparel, misc — placeholder/fictitious data in pilot); B3 Live Video & Voice Session Rooms (promoted from Future Roadmap — embedded LiveKit/Jitsi rooms linked to scheduled events); B4 Browser Compatibility & Support Policy (evergreen Chrome/Firefox/Safari/Edge support, unsupported browser warning — formalises Non-Functional Requirements); B5 Fully Optional Notifications (policy clarification that all notifications except security-critical are opt-out; F38 Essential Only preset surfaced in onboarding); B6 Optional Phone & Email Display in Profile (separate from registration email and 3FA number; visible to group members only; never auto-populated); B7 In-Editor Spell Check (browser `spellcheck="true"` + Typo.js/native API on all composition fields — no autocorrect); B8 Forum Attachments PDF Only (client-side `accept=".pdf"` + server MIME validation + Cloudinary restriction; no executable files; download link only, no in-browser preview); B9 Last-Minute Cancellation Reputation Penalty (−8 trust score + late cancellation counter on profile after 1st; ⚠️ 🕐 Reliability Warning badge after 3 in 90 days; −10 group health score; emergency exception with admin review; 90-day rolling reset); B10 Unified Behavioural Analytics & Intelligent Tracking (extends F68 PostHog to full in-session event stream — page views, group browsing, filter usage, search queries, feature area visits; disclosed in ToS/acceptance agreement at first login; analytics opt-out in Settings → Privacy); B11 AI Community Monitor & Moderation Assistant (real-time AI review of posts/messages parallel to F18 keyword filter; three functions: safety monitoring with confidence-scored admin queue flags, user-facing contextual recommendations, soft sender intervention before posting; AI never takes autonomous punitive action; all decisions logged with model version and confidence score; powered by moderation-tuned LLM API)
- v3.9 — **F98 — Data Protection, Anti-Scraping & Access Control**: three-tier visibility model (anonymous / logged-in non-member / member) with explicit table of what each tier can see; anonymous visitors see only group name, category, city, 120-char description teaser, and approximate member count — all other content requires login; email addresses never returned by any public or member-facing API endpoint at any tier; member rosters are display-name-only and non-exportable in bulk — no group owner can download a contact list; anti-scraping layer: all `/api/*` data endpoints require JWT (only 6 public endpoints remain unauthenticated); tiered rate limits (20 req/min unauthenticated; 120 general authenticated; 10/hour on member list endpoints; 30/min on profile lookups); scraping-specific fraud score signals extending F53 (request cadence, missing browser headers, FingerprintJS headless signal, datacenter ASN, repeated member-list access); honeypot hidden fields on all forms (silent reject + +30 fraud score); no bulk data endpoints — all list endpoints require at least one filter param; Cloudflare Bot Fight Mode (F80) as first layer; API response scrubbing via explicit field allowlists on every serialiser (no `SELECT *` leakage); F71 SEO update — JSON-LD structured data restricted to group name, category, city, and truncated description only (Event JSON-LD removed); `robots.txt` expanded to disallow `/api/`, `/groups/*/members`, `/groups/*/calendar`, `/groups/*/chat`, `/profile/*/followers`, `/profile/*/following`, `/calendar`; new `GET /api/groups/:id/public-teaser` endpoint replaces full group response for unauthenticated callers; F75 data export updated with explicit exclusions section and README.txt in ZIP (member rosters, other users' contact info, and any data belonging to other users excluded); 6 new user stories #292–297
- v3.8 — **F97 Geographic Expansion Waitlist & Admin Demand Alerts**: non-PBC users who hit the local activity gate can join a county waitlist with one tap; county derived from ZIP via static `zip_county_lookup` seed table (no geocoding API); `geo_waitlist` table (unique per user/county) + `geo_waitlist_counts` denormalised counter (trigger-maintained); `approved_regions` table as the runtime source of truth for the effective ZIP allowlist (replaces hardcoded config constant — server caches with 5-min TTL); threshold alert fires at exactly 20 users per county: in-app admin notification + email to platform owner; milestone alerts at 50 and 100 if county unapproved; admin Expansion Demand tab in F15 (county demand table sorted by count, amber highlight at threshold, Approve action with confirmation modal); Approve action: adds all county ZIPs to `approved_regions`, sends notification email to all waitlisted users via BullMQ, marks county approved in `geo_waitlist_counts`, logs to `admin_audit_log`; notification email links to Discover with county-proximity pre-applied; F48 gate notice updated with two states (pre-waitlist CTA / post-waitlist confirmation with county count); `GEO_WAITLIST_THRESHOLD` server config constant (default 20, adjustable); 5 new API endpoints; 6 new user stories #286–291
- v3.7 — **PBC Local Activity Gate**: signup remains open to all with no restrictions; joining or requesting to join any local/in-person group (`location_type = 'local'`) is restricted to users whose registered ZIP code is within Palm Beach County; online groups (`location_type = 'online'`) have no geographic restriction; gate is enforced server-side in F48 join flow (403 `pilot_geo_restricted` response for non-PBC ZIP on local groups); `PILOT_ZIP_ALLOWLIST` config constant repurposed from signup gate (removed in v3.6) to local join gate — single config change to lift when expanding; non-PBC users see a 📍 informational notice on local group cards in Discover and on group detail pages instead of a join button, with link to online groups; group detail pages, calendars, and all public content remain fully visible to non-PBC users; creating a local group is unrestricted (gate is on joining/attending, not hosting); F26 onboarding Step 5 auto-match excludes local groups from results for non-PBC users and adjusts headline to clarify online-only scope; hybrid groups follow local rules (gate based on `location_type`, not individual event format); 3 new user stories #283–285; 2 new Risks & Mitigations rows (false ZIP self-report assessed as Low/Low)
- v3.6 — Three changes: (1) **Removed all signup geographic restrictions** — platform is open to all users at launch with no ZIP allowlist, no waitlist, and no blocked signup flows; PBC is a marketing/seeding focus only, not a technical gate; updated Phase 2 Launch Strategy accordingly; removed geographic waitlist risk rows; added "Outside-PBC users have thin local results" as Low/Low risk with empty-state mitigation; (2) **Enhanced F26 Onboarding with smart auto-matching** — Step 3 expanded with inline category-specific follow-up questions (platforms, game titles, competitive vs casual) that feed directly into Step 5 scoring; Step 5 fully respecced as "Your Groups Are Ready" — real-time match algorithm runs against all active groups, results ranked by weighted score (interest 40%, game title 20%, location 15%, availability 15%, platform 5%, experience level 5%); minimum match score of 35 required to show a card; per-card "why it matched" chip row; one-tap Join / "Not for me" / "Save for later" actions; online group fallback when local results are thin; warm zero-match empty state with automatic F27 alert creation and "start your own" CTA; "I'm flexible" escape hatch on availability step; `onboarding_progress` table extended with 5 match analytics columns; (3) **F96 — User Experience Feedback & NPS System** — 4 feedback touchpoints: post-onboarding check-in (24h, in-app + email, 2-question micro-survey), post-first-session rating (2h after end, in-app + email, 3-question with conditional follow-up), NPS survey at Day 14 and Day 60 (email only, standard 0–10 + open follow-up, NPS opt-out supported), persistent in-app feedback widget (💬, bottom-right, always accessible, category + free text + optional screenshot); Admin Feedback Dashboard as new F15 tab (overview cards: response rates / "nothing matched" rate / avg session rating / NPS D14 and D60; chronological response feed with status New/Reviewed/Actioned; admin notes; CSV export); `feedback_submissions` table; `feedback_nps_opt_outs` table; 6 API endpoints; 12 new user stories #271–282
- v3.5 — Geographic launch scope narrowed to **Palm Beach County, Florida pilot**: added full Launch Strategy section (Phase 0 seeding playbook with 20-group / 4-category / 3-city threshold before public signup; Phase 1 soft launch invite-only to seeded organizers' existing members; Phase 2 public launch PBC-only with geographic waitlist for out-of-county registrants; Phase 3 expansion trigger at 250 users / 50 active groups / 40% weekly return rate); added `PILOT_ZIP_ALLOWLIST` server-side config constant with full PBC ZIP code list (single config change to remove when expanding); updated Success Metrics for PBC scale (250 users, 50 groups, 5 cities with ≥ 3 active groups); added "Launch Market" subsection to goals; all 4 User Personas updated with Palm Beach County–specific locations and context (Marcus → PBSC student in Boynton Beach; Priya → Boca Raton tech worker; James → Chicago transplant in Delray Beach; Destiny → Jupiter streamer); 3 new Risks & Mitigations rows (cold-start updated for PBC playbook; geographic expansion too early; out-of-county waitlist friction); seeded group target table added by category and city
- v3.4 — Added 11 new feature specifications and 15 new user stories (#256–270): (1) **Crossplay** — `crossplay_enabled` boolean on groups table; 🔀 badge on group cards; crossplay filter in F3 Discover panel; updated F2 group creation fields; (2) **Nintendo Switch** — added Nintendo Switch to platform options in F2; `linked_nintendo VARCHAR` (friend code) in users table; Nintendo Switch option in F3 platform filter; (3) **Conduct Flag** — `conduct_flag_count INTEGER` on users table; amber ⚠️ icon on profile/member list/join request panel visible to all logged-in users when ≥ 2 active warnings in 90 days; auto-clears on expiry; private banner in user's own Settings → Account; Trust Score penalty −5 per warning, max −15; updated Trust Score formula in F24; (4) **Print-optimized calendar** — 🖨 Print button on per-group Calendar tab (F94 Part 1) and unified `/calendar` page (F94 Part 3); auto-switches to List view before `window.print()`; returns to prior view after; full `@media print` CSS spec in new F94 Part 6 (hide nav/sidebar/buttons; list-view only; reset backgrounds; group-colour left border; typography; page-break-inside: avoid; `@page` A4 margins); print header injected by JS (page title, print date, date range, group name for per-group prints); group name label on unified calendar print rows; (5) **Optional Discord and YouTube profile fields** — `linked_discord VARCHAR` and `linked_youtube VARCHAR` in users table; added to F1 profile linked accounts; (6) **Mandatory ZIP code** — `zip_code VARCHAR(10)` in users table; required at registration; never returned in public API responses; auto-populates city/region field; stored server-side only; included in F75 data export; updated F1 profile fields and F46 proximity search; (7) **ZIP code search** — three-method location input in F46: registered ZIP (default), session-only ZIP override (geocoded via Google Maps Geocoding API), browser Geolocation; ZIP never persisted as coordinates; updated F3 Discover filter panel; (8) **Online group keyword search** — F37 extended with Online Activity Keyword Search subsection: keyword matching against group name/description/subcategory tags/open roles for online groups; synonym map extended (LOL→League of Legends, WoW→World of Warcraft, MTGA→Magic: The Gathering Arena); online filter prioritizes keyword/tag matching over location signals; (9) **F95 Outdoor Activity Safety Prerequisites** — new full feature spec: four-tier experience scale (Beginner/Intermediate/Advanced/Expert) per category on user profiles; owner-configurable minimum level and gate message; join flow gate (check → blocked modal with "Update experience level" CTA, or softer "set your level" prompt if unset); server-side enforcement on all join/request endpoints (403 with `skill_gate_blocked` body); owner override with audit log; Discover card muted join button with tooltip; gated waitlist integration with F50; `skill_gate_enabled/level/message/override` columns on groups; `user_experience_levels` table; `skill_gate_overrides` table; 8 API endpoints; applies to hiking, climbing, water sports, cycling, martial arts, winter sports, aerial, equestrian categories; (10) **Political and religious group prohibition** — new "Prohibited Group Types" section in F14: political and religious groups explicitly prohibited (not merely out of scope); keyword screening at group creation; category taxonomy excludes Politics/Religion; group-level "Prohibited group type" report option; added to Out of Scope with clarifying notes; (11) **Harmful group reporting and LE referral** — new F14 prohibition section for groups planning harm; new F15 Tab 7 (Harmful Group Reports, platform owner only): auto-suspend on report receipt; confirm-remove / confirm-prohibited / dismiss actions; owner-discretion LE referral note (matches F14 sensitive report model, no auto-contact); `group_suspension` data model; `is_harmful_group` flag on reports; violation_type ENUM extended; 9 new admin API endpoints; 2 new Risks & Mitigations entries; Out of Scope updated
- v3.3 — Consistency & gap audit pass: fixed 13 issues — (1) wrong feature cross-reference in F94 gap finder (`F7` → `F2` for group creation flow); (2) wrong feature cross-reference in F94 calendar visibility table (`F8` → `F48` for join flow); (3) wrong feature cross-reference in F10 chat rules pinned message (`F7` → `F17` for group moderation rules); (4) API Design section "under 18" corrected to "under 13" and updated to reflect checkbox-based age confirmation (not date_of_birth field); (5) `group_messages` table name in F64 and F65 corrected to `messages` to match core schema definition; (6) duplicate `POST /api/safety/alarm/test` endpoint removed from Silent Alarm API table; (7) "Free groups can have up to 5 channels" updated to remove stale monetization tier language after F66 removal; (8) Phase 6 F67 description "read receipts (Premium); thread limit enforcement for free users" corrected to reflect post-F66 DM spec (all users, no limits); (9) F7 "A group you favorited" corrected to "A group you saved" for terminology consistency; (10) Out of Scope "manual reporting pipeline only" clarified — Cloudinary AI IS used for image uploads (F42); standalone text moderation AI is out of scope; (11) F38 notification types table extended with 6 new notification rows for features added since v2.2: DMs (F67), follow requests (F83), shoutouts (F93), guardian consent (F84), activity gap match (F94), minor RSVP guardian alert (F84); (12) F4 role list clarified — "Co-owner" unified with "Co-Moderator" with a note referencing the canonical definition in F17; (13) F46 Discover map corrected from "interactive Google Map" to "Mapbox GL JS map" to match tech stack, with a clarifying note distinguishing Mapbox (discovery) from Google Maps (event location, F45)
- v3.2 — Added F94 Community Calendar, Unified View & Activity Gap Finder (12 new user stories #244–255): Part 1 — Per-group Calendar tab with month/week/list views, keyboard/screen-reader-compliant ARIA grid, inline event popover with RSVP counts and Add to Calendar; Part 2 — Calendar Visibility setting per group (Public/Members Only/Followers Only), public calendar join-from-event flow with context-aware CTA (Join/Request/Learn More), shareable SEO-indexed `/groups/:slug/calendar` URL, logged-out visitor support; Part 3 — Unified personal `/calendar` page with group toggle sidebar, 12-colour auto-assignment, "My Week" summary card, bulk .ics export for all toggled groups, persisted toggle state; Part 4 — Advanced event filtering (activity type, skill level, format, group, date range, RSVP status, availability-conflict hide); Part 5 — "What's Missing Near You" gap finder at `/discover/gaps` — per-interest-tag gap detection (< 3 open groups or no sessions in 30 days = gap), gap cards with "Be the first!" CTA pre-filling group creation with category and F74 template, "I'd join this" anonymous demand vote with social-proof count and new-group notification trigger, sorted by user interest rank + trending demand; `calendar_visibility` column on groups, `calendar_preferences` table, `activity_gap_votes` table, 7 new API endpoints
- v3.1 — Added F84–F93 (10 new features, 17 new user stories #227–243) focused on accessibility, special needs, and community wellbeing: F84 Parental/Guardian Access — mandatory guardian consent flow for 13–17 users, read-only Guardian Portal (no account required) showing group memberships/events/activity, guardian revoke control, automatic in-person RSVP notifications to guardians, minor DM restrictions, `guardian_consents` table; F85 Cognitive Accessibility Mode — distraction-free chat (hides avatars/timestamps/reactions/animations), 3 message density presets (Comfortable/Compact/Spacious), Focus Mode for activity feeds, notification batching into daily digest; F86 Per-Session Accessibility Accommodations — optional free-text note on each RSVP (visible to owner/co-mods only, purged 24h post-event), organizer accommodation summary tab, group-level Accessibility Statement field; F87 Notification Fatigue Prevention — Essential Only preset protecting safety/ban/recovery/guardian notifications, smart 14-day re-engagement prompt, Quiet Hours with end-of-window batch delivery; F88 Group Owner First-Run Wizard — 4-step post-creation wizard (invite/welcome/schedule/checklist), persistent setup checklist card for owner/mods only; F89 Contextual Help & Inline Tooltips — ⓘ tooltips on trust score, badge progress, warning count, waitlist position, accommodation note, safety contacts; ban/warning messages enriched with rule links, appeal link, and crisis resource link; F90 Skeleton Loaders & Loading State Standards — per-view skeleton patterns documented for all data-heavy views; error states with plain-language messaging and retry; reduced-motion compliance; F91 Organizer Burnout & Delegation Signals — "Group Health & You" fifth dashboard section with moderation volume, co-mod activity, time-since-last-session, member join trend, and opt-out delegation suggestion cards; F92 Mental Health Crisis Resource Surfacing — "Concerning — person may be in distress" report category, supplementary crisis keyword filter (parallel to message delivery, never blocks), gentle banner to responding user, crisis resource panel (Crisis Text Line/988/SAMHSA/IASP/trusted contacts), elevated admin queue flag, permanent `/support` page in footer, crisis detection disclosed in Privacy Policy; F93 Community Champion & Peer Recognition — monthly peer shoutout nomination (visible in group feed), Community Champion badge after 5 shoutouts in 3-month window, admin Spotlight Award for uncapturable contributions, full opt-out
- v3.0 — Expanded F10 Real-Time Group Chat from a 4-bullet stub to a full production spec (11 new user stories #216–226): elevated priority to Must Have with explicit rationale that external chat tools (Discord, WhatsApp) cannot be monitored or moderated; multi-channel system (up to 5 channels per group; Standard/Announcement/Archived types; default #general/#scheduling/#off-topic); full Socket.io event spec (message:new/edited/deleted, reaction:update, typing:start/stop, member:muted, channel:updated); complete message feature set (Markdown subset, @mentions F63, spoiler tags F65, emoji reactions, inline reply threads, image attachments via Cloudinary, link previews with F62 external warning, 15-min edit window F54); synchronous server-side content safety pipeline (rate limit → bad-words filter → URL intercept → F41 keyword check → image moderation) before any Socket.io broadcast — no message leaves the server unscreened; mod tools (delete, pin, warn, chat-mute with duration, slow mode per channel); "Unsafe contact sharing" report category explicitly targeting off-platform migration attempts; admin message history access for investigations disclosed in Privacy Policy; Mod Log for all chat mod actions; full-text per-channel search; `channels`, `chat_messages`, `chat_reactions`, `chat_member_mutes` database tables; 14 API endpoints
- v2.9 — Added F83 User Follow System and extended F60 Dynamic Discovery with follow-graph and browsing-history signals (8 new user stories #208–215): F83 — asymmetric public follow system (follow/unfollow, approval-required mode, follower/following counts with privacy toggles, public following list with visibility controls, "Following" activity tab on `/activity` feed showing joined groups/new groups/badges/forum posts/RSVPs from followed users, follow requests panel, "People You Might Know" suggestions on Discover/onboarding/post-group-join, `user_follows` table, 14 `users` table columns, 9 API endpoints, `/profile/:id/followers` and `/profile/:id/following` pages); F60 extended — recommendation signal table expanded from 6 to 8 signals with follow-graph (High weight) and browsing-history (Medium weight) added; "Following" section added to Discover page; match reason chips updated with follow/browsing chip variants; stacking chips (up to 2) on card with expand-to-see-all; score formula documented; browsing-history privacy opt-out wired to F68 analytics opt-out; recency bonus/penalty added to scoring
- v2.8 — Enhanced F41 Silent Safety Alarm with full user configurability and keyword trigger (9 new user stories #199–207): Method 1 (logo tap) now configurable — tap count (2/3/4) and tap window (1.0s/1.5s/2.0s) set per user; Method 2 (shake) configurable — sensitivity (Low/Medium/High) and shake count (2/3/4); new Method 3 (secret code word) — user-defined phrase stored as bcrypt hash, never in plaintext, silently strips phrase from message and fires alarm without any visible change to conversation, skip-countdown option, context restriction (All/DMs/Groups), immediate purge on account deletion; countdown duration now configurable (0s/3s/5s/10s); optional "I'm Safe" confirmation PIN to prevent coerced dismissal; per-contact notify_via preference (SMS/email/both) and custom alarm message templates; Settings → Safety page restructured into 4 sections (Contacts, Trigger Methods, Alarm Behaviour, History & Testing); test alarm endpoint added; database extended — `trusted_contacts` gains `notify_via`, `receive_escalation`, `custom_message`; `users` table gains 14 new alarm-preference columns; `alarm_events` gains `triggered_via='keyword'` enum value and `trigger_context` column; 6 new API endpoints under `/api/safety/preferences`
- v2.7 — Consistency pass: removed 4 orphaned monetization analytics events (`upgrade_prompt_shown/clicked/completed`, `subscription_canceled`) from F68 tracked-event table — replaced with `dm_thread_started` and `support_ticket_submitted`; replaced `billing.json` in F75 data-export ZIP spec with `referrals.json`; replaced billing-records retention row in F75 retention schedule with audit-log retention (3 years, per F82); updated Out of Scope section (removed stale "Direct/private messaging" item since F67 ships DMs; removed "Payment processing/premium subscriptions"; added clarity notes); refreshed Future Roadmap (removed duplicate Mobile App entry, replaced monetization row with Native Mobile App item, added Discord Bot, Venue Partnerships, Steam/console linking, AI matching, video rooms, group merch store)
- v2.6 — Added F76–F82 (7 new features, 14 new user stories #185–198): F76 Public Status Page & Incident Communication — `/status` page with component health tracking, in-app degradation banner, incident threads, email/RSS subscriptions, admin incident management, `/api/system/status` polling endpoint; F77 Support Ticket System — categorised submission form at `/help/contact`, support queue in Admin Panel, email-based reply thread, reference numbers, SLA targets (Safety 4h / Compliance 48h / Standard 5 days), `support_tickets`/`support_ticket_messages` tables; F78 Cross-Account Abuse Tracking (F53 extension) — 5-signal account-linking (IP, FingerprintJS, email domain, username edit distance, UA hash), graduated flag → admin review → auto-ban flow, `account_link_matches` table, `abuse_flag_score` on users; F79 Backup Verification & Disaster Recovery Runbook — daily/weekly/monthly verification schedule, RPO ≤24h / RTO ≤4h targets, cross-region S3/R2 secondary copy, documented 7-step restore runbook in `docs/disaster-recovery.md`; F80 DoS Protection & Third-Party Circuit Breakers — enhanced per-endpoint rate limits (uploads, export, geo-search, Socket.io), opossum circuit breakers for Cloudinary/SendGrid/Twilio/Google Maps/PostHog, Cloudflare reverse proxy with Bot Fight Mode; F81 Fraud Scoring & Graduated Account Lockout — 8 weighted fraud signals with time-decay, 5-tier lockout (0–30 normal → 90–100 suspended), manual admin score adjustment, `fraud_score_events` table; F82 Immutable Admin Audit Log & Compliance Export — append-only `admin_audit_log` table (no UPDATE/DELETE grants), 3-year retention, WORM S3 secondary copy, platform-owner CSV export, compliance-ready filtered API, not included in user data exports
- v2.5 — Removed F66 Monetization & Subscription Tiers; removed Stripe integration, subscription tiers, `/pricing` and `/settings/billing` pages, `billing_events` table, and all tier-gating from F67/F70/F72; updated F67 DMs to be fully available to all registered users (no thread limit, read receipts opt-in for all); updated F70 Organizer Dashboard to be available to all group owners (no tier gate); updated F72 referral reward from Premium subscription to Community Builder and Early Supporter badges; user stories renumbered (#157–184)
- v2.4 — Added F67–F75 (9 new features, 29 new user stories #157–185): F67 Private 1:1 Direct Messaging, F68 Product Analytics (PostHog), F69 Email Marketing Automation (BullMQ + welcome/re-engagement series), F70 Organizer Analytics Dashboard, F71 SEO & Structured Data (schema.org JSON-LD, sitemap), F72 Referral Program (`rollcall.gg/join?ref=USERNAME`, Early Supporter badge reward), F73 Secret Groups (invite-link-only, `group_invite_links` table), F74 Group Creation Templates (8 templates, Step 0 card grid), F75 Data Retention & Purge Policy (right-to-erasure, data export ZIP, `deletion_requests` table)
- v2.3 — Added F64 Post Voting and F65 Spoiler Tags (12 new user stories #145–156): F64 upvote/downvote on forum posts, replies, message board posts, and session recaps — one vote per user, net score display with colour coding, collapsed-post threshold at −5, sort-by-Top in forum, real-time score sync via Socket.io, two new Community badges (Rising Star +10, Crowd Favourite +25), `post_votes` table with denormalised `vote_score` trigger columns, five API endpoints; F65 spoiler tag system using `||text||` syntax — toolbar button, optional category label, independent per-block reveal, hover-peek (blur 8px→4px), keyboard accessibility, re-hide control, `has_spoiler` flag on content tables, feed preview suppression, admin always-visible override, `SpoilerBlock` React component
- v2.2 — Added F63 Mentions & Real-Time Activity Alerts (10 new user stories #135–144): @mention detection pipeline with live suggestion dropdown and highlighted token rendering; real-time Socket.io delivery to personal notification rooms with toast alerts, stack management, and missed-notification catch-up on reconnect; unified Activity Feed at `/activity` covering all group-level events with type filter, group filter, and unread dot; bell dropdown extended with "All / Mentions" tabs and secondary mention badge; `activity_feed_events` table; two new `notifications` columns (`mention_context`, `source_user_id`); six new API endpoints; F38 notification type table updated with `@mention` row (on by default across all three channels); logo finalised as community-network mark (6-node hexagonal ring with spoke connections and glowing centre hub)
- v2.1 — Added F42–F49, F59–F62 (13 new features, 34 new user stories #101–134): F42 Profile Avatar Upload with Content Moderation, F43 Personal Information Protection, F44 Inappropriate Profile Reporting, F45 Google Maps Location Tagging, F46 Proximity Search & Map View, F47 Optional 3FA via SMS (opt-in only), F48 Streamlined Group Join/Leave UX, F49 Interest & Activity History Tracker, F59 Enhanced Accessibility Options, F60 Dynamic Interest-Based Group Discovery, F61 Group Forum with Tips & POI, F62 External Link Warning System; merged changes: verbal abuse added as warning-tier violation (F14/F22), Helpful Player & Guide merit badges added (F40), anonymous ratings option added to F9 & F55, 13+ COPPA age requirement restored (replaced 18+ age gate across F1, F14, F26, F32), 3FA made optional (F47), logo updated with new tagline; tech stack additions: Google Maps JavaScript API, Google Maps Static API, PostGIS extension on PostgreSQL; GOOGLE_MAPS_API_KEY added to environment variables
- v1.1 — Added F13 Dark/Light Mode Toggle
- v1.2 — Added F14 Zero-Tolerance Community Policy, F15 Admin Control Panel (ban/whitelist/blacklist); React application scaffold specified
- v1.3 — Added F16–F25: Block/Mute, Group-Level Moderation, Automated Content Pre-Screening, Role/Position Matching, Group Health & Activity Signals, New Member Icebreaker Prompts, Graduated Moderation System, Multilingual & Accessibility Support, Profile Trust Signals, In-Person Safety Features
- v1.4 — Added F26–F37: Onboarding Flow, Saved Searches & Group Alerts, Group Ownership Transfer, Calendar Export & Recurring Event Templates, Post-Session Recap & Attendance Confirmation, Email Invitation System, Legal & Compliance Pages, Group Resource Hub, In-Group Polls, Progressive Web App (PWA), Social Sharing & Public Group Preview, Fuzzy Search & Smart Defaults
- v1.5 — Added F38 Notification Preferences Center (65 total user stories); added Non-Functional Requirements section (performance, security, accessibility, browser support, scalability); added Testing Strategy section (Vitest unit tests, Supertest integration tests, Playwright E2E tests, accessibility audit, pre-release QA checklist); added Deployment & DevOps section (CI/CD pipeline, environment variables, monitoring & alerting, database backup & recovery, branch strategy)
- v2.0 — Added F50–F58 (9 features, 100 total user stories): F50 Group Waitlist/Queue (ordered queue, 48h auto-invite, owner skip/invite controls), F51 Session Cancellation Flow (single cancel, recurring skip/reschedule, group health integration, event_exceptions table), F52 Moderation Appeal Process (7-day window, warnings and suspensions only, separation of reviewers, admin appeals queue), F53 Spam & Bot Detection (velocity checks, ban evasion via FingerprintJS, hCaptcha, spam admin queue), F54 Message Editing & Edit History (15-min window, content re-screening, edit indicator, history modal, message_edit_history table), F55 Group & Organizer Rating (separate group/host scores, anonymous, star display on cards and profiles, session_ratings table), F56 User Connections/Saved Players (private bookmark list, LFG status alert, shared group suggestions, saved_players table), F57 Recurring Event Exception Handling (skip/reschedule/modify single occurrence, extends event_exceptions from F51), F58 Account Recovery (four recovery tiers, MFA backup codes, manual identity verification, recovery request admin queue, mfa_backup_codes table); 20 new user stories #81–100
- v1.9 — Added F41 Silent Safety Alarm (41 features, 80 user stories): discreet triple-tap and shake-gesture activation, 5-second cancellable countdown, trusted contact setup with SMS verification, auto-escalation timer, GPS capture at trigger time with 24h purge, discreet UI spec, Settings → Safety page, local RSVP safety nudge, `/api/safety/contacts` and `/api/safety/alarm/*` endpoints, `trusted_contacts` and `alarm_events` DB tables, 6 user stories #75–80, 5 new risk entries; updated F25 to reference F41; added `Twilio` to tech stack for SMS delivery
- v1.8 — Added F39 Help Center & FAQ (searchable `/help` page, admin-editable articles, 9 seeded categories, helpful feedback system, 4 new user stories #66–69) and F40 Achievement & Badge System (17 badge definitions across 5 categories, automated trigger flow, share-to-feed, admin custom badge award, 5 new user stories #70–74); updated Phase 5 and Phase 6 timelines; added `/help`, `/settings/notifications`, and `/profile/:id/badges` to Key Pages
- v1.7 — Added sexual harassment & abuse reporting: explicit prohibition in F14 zero-tolerance policy, dedicated Sensitive Report Flow with immediate account suspension + 24-hour resolution target + crisis resource links (RAINN, Crisis Text Line, NDVH), restricted platform-owner-only Tab 6 in Admin Panel (F15), `sexual_harassment` and `sexual_abuse` violation types added to reports and banned_users enums, `is_sensitive` flag in reports table, three new platform-owner-only API endpoints
- v1.6 — Added 18+ age restriction platform-wide: age gate screen (F26), DOB field + server-side age validation (F1), 18+ statement in Community Standards (F14), updated Legal & Compliance with COPPA clarification and compliance matrix (F32), `date_of_birth` + `age_verified` columns in users table, registration API 403 response for underage users, new underage bypass risk entry

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Goals & Success Metrics](#goals--success-metrics)
4. [User Personas](#user-personas)
5. [Feature Requirements](#feature-requirements)
6. [User Stories](#user-stories)
7. [Technical Architecture](#technical-architecture)
8. [Database Schema](#database-schema)
9. [API Design](#api-design)
10. [UI/UX Requirements](#uiux-requirements)
11. [Non-Functional Requirements](#non-functional-requirements)
12. [MVP Scope & Timeline](#mvp-scope--timeline)
13. [Testing Strategy](#testing-strategy)
14. [Deployment & DevOps](#deployment--devops)
15. [Future Roadmap](#future-roadmap)
16. [Out of Scope (v1.0)](#out-of-scope-v10)
17. [Risks & Mitigations](#risks--mitigations)

---

## Executive Summary

**RollCall** is a full-stack web platform that connects people who share common interests, hobbies, and activities — whether online or in-person. Users can discover and join existing groups or create their own for anything from tabletop RPG campaigns and board game nights to local sports leagues, online gaming squads, and book clubs.

Unlike general social platforms, RollCall is purpose-built for group formation around *activities*. Every group has a clear purpose, schedule, and capacity — making it easy to find your people and get playing.

> **Age Requirement:** RollCall requires users to be **13 years of age or older** to register, in compliance with COPPA (Children's Online Privacy Protection Act). Users aged 13–17 may use the platform with parental or guardian consent as stated in the Terms of Service. The minimum age requirement is displayed in the Community Standards and enforced at registration.

---

## Problem Statement

### The Gap in the Market

Finding consistent, compatible people to play games or participate in hobbies with is surprisingly hard:

- **Meetup** is expensive for organizers and skews toward professional networking
- **Discord** is chaotic for strangers — no structured discovery, no trust/reputation layer
- **Reddit LFG threads** go stale, have no scheduling tools, and offer no profiles
- **Gaming platform LFG features** (Xbox, PlayStation, Steam) are siloed to one platform and game
- **Facebook Groups** lack activity-specific structure and feel outdated for younger audiences

### The Core Problem

> There is no unified, free, structured platform where a person can find or create a group for *any* hobby or activity — online or local — with built-in scheduling, profiles, and a trust system.

---

## Goals & Success Metrics

### Product Goals

| Goal | Description |
|------|-------------|
| Connection | Help users find groups that match their interests, schedule, and skill level |
| Retention | Give groups tools to stay organized so they keep meeting over time |
| Inclusivity | Support all activity types — gaming, sports, tabletop, social, and more |
| Trust | Build a reputation system so users feel safe joining groups of strangers |

### Launch Market

RollCall's initial launch is **geographically constrained to Palm Beach County, Florida**. This is a deliberate cold-start strategy: building real density in one county before expanding, rather than launching thinly across a broad area where no single neighborhood ever has enough activity to feel alive.

Palm Beach County is the exclusive focus for seeding, marketing, organizer outreach, and community support during the pilot period. Expansion to additional counties or regions will be evaluated after the pilot success metrics are met.

See **Launch Strategy** section for the full pilot playbook.

### Success Metrics (MVP — Palm Beach County Pilot)

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Registered Users | 250+ (Palm Beach County residents) |
| Groups Created | 50+ |
| Groups with 3+ Members | 70% |
| User Return Rate (weekly) | 40%+ |
| Average Group Lifespan | 30+ days |
| Cities with ≥ 3 active groups | 5+ (e.g. West Palm Beach, Boca Raton, Delray Beach, Boynton Beach, Jupiter) |
| Organizer-recruited member rate | ≥ 60% of members come in via an organizer's existing network |

---

## User Personas

### Persona 1 — The Casual Gamer
**Name:** Marcus, 22, student at Palm Beach State College  
**Situation:** Grew up in Boynton Beach, stays local after graduation. Plays Valorant and D&D but his friend group scattered after high school.  
**Needs:** Find a consistent online gaming squad and a local tabletop group within driving distance.  
**Pain Points:** Discord servers are overwhelming and nobody responds to Reddit LFG posts. Meetup.com feels like it's for people twice his age.  
**Quote:** *"I just want to find 4 people who show up every week."*

---

### Persona 2 — The Organizer
**Name:** Priya, 31, works in tech in Boca Raton  
**Situation:** Runs a monthly board game night out of her West Boca home but manages it over iMessage — it's a mess. She's been doing this for two years and wants to grow beyond her immediate friend circle.  
**Needs:** A home for her group with scheduling, RSVPs, and easy onboarding for new members she doesn't personally know.  
**Pain Points:** No single tool does group management + discovery in one place. Meetup charges her to list the group.  
**Quote:** *"I spend more time coordinating than actually playing."*

---

### Persona 3 — The Newcomer
**Name:** James, 40, recently relocated from Chicago to Delray Beach  
**Situation:** New to the area, doesn't know anyone locally yet. Wants to get into hiking and trail running along the Loxahatchee corridor but feels awkward showing up to a group where everyone already knows each other.  
**Needs:** Low-pressure way to find beginner-friendly local groups with clear expectations.  
**Pain Points:** Facebook Groups for local hiking are disorganized; no way to know what skill level is expected or whether anyone will actually show up.  
**Quote:** *"I just need a reason to leave the house."*

---

### Persona 4 — The Competitive Player
**Name:** Destiny, 19, Jupiter resident, part-time streamer  
**Situation:** Looking for a serious ranked team for League of Legends. Plays from home but wants teammates who are local enough to potentially meet up for LAN sessions.  
**Needs:** Filter by rank, availability, role, crossplay, and platform. No casuals.  
**Pain Points:** Existing LFG tools don't let her set skill-level or location filters together.  
**Quote:** *"I don't want to babysit. I want to win."*

---

## Feature Requirements

### Category System

Groups are organized into top-level categories, each with subcategories:

| Category | Subcategories |
|----------|---------------|
| 🎮 Video Games | FPS, MOBA, RPG, Battle Royale, MMO, Casual, Fighting, Strategy |
| 🎲 Tabletop | D&D, Pathfinder, Board Games, Card Games, Wargames, TTRPG |
| 📚 Social | Book Club, Movie Night, Language Exchange, Trivia, Debate |
| ⚽ Sports & Fitness | Soccer, Basketball, Running, Hiking, Cycling, Yoga, Gym |
| 🎨 Hobbies | Art, Music, Cooking, Photography, Crafts, Writing |
| 🕹️ Other | Watch Parties, Podcast Groups, Hackathons, Study Groups |

---

### F1 — User Authentication & Profiles

**Priority: Must Have (MVP)**

- Sign up / log in via email+password or OAuth (Google, Discord)

**Minimum Age Requirement (13+)**

RollCall is open to users aged **13 and older**, in compliance with COPPA. Age confirmation is collected at registration:

1. During sign-up, the user confirms they meet the minimum age via a required checkbox: *"I confirm that I am 13 years of age or older, or have parental/guardian consent to use this platform."*
2. Users aged 13–17 are considered minors. The platform applies additional content protections for minor accounts (see F32 — Legal & Compliance for COPPA details).
3. If an account is found to belong to a user under 13 — reported by another user or identified by admin — the account is immediately suspended and all personal data deleted within 72 hours per COPPA requirements.
4. Date of birth is **optional** on the profile (used for the age-confirmation checkbox flow and for COPPA compliance only); it is never displayed publicly and is never returned via any public-facing API endpoint.

- User profile fields:
  - Display name, avatar, bio
  - Date of birth (required at registration; not publicly visible)
  - ZIP code (required at registration; **never publicly displayed**; used only for local group discovery and proximity search — see F46; stored securely server-side; included in data export F75)
  - Location (city or "Online Only" — auto-populated from ZIP code; editable)
  - Timezone
  - Interests / activity tags
  - Experience level (Beginner / Casual / Intermediate / Competitive)
  - Availability (days/times checkboxes)
  - Linked accounts (optional): Steam, Xbox Gamertag, PlayStation Network ID, Battle.net, **Nintendo Switch Friend Code**, **Discord Username**, **YouTube Channel URL**
  - Current "LFG Status" toggle: Active / Not Looking
- Reputation score (calculated from group reviews)
- Activity history (groups joined/created)
- See **F58** for account recovery when access to email and/or phone is lost

---

### F58 — Account Recovery

**Priority: Must Have (MVP)**

Standard password reset assumes the user still has access to their registered email. Once F47 (3-Factor Authentication via SMS) is added, a user who loses *both* their email and their phone number has no recovery path at all. Without a defined recovery process, these users are permanently locked out — a poor experience that also generates support burden.

**Recovery Tiers**

| Scenario | Recovery Method |
|----------|----------------|
| Forgot password, have email | Standard reset link to registered email (already in F1) |
| Lost phone, have email | Disable MFA via email verification link; re-enroll new phone number |
| Lost email access, have phone | SMS one-time code to registered phone; prompted to update email after login |
| Lost both email and phone | Manual identity verification via Support (see below) |

**Lost Phone (email available)**

User visits `/account/recovery` and selects "I no longer have access to my phone number." An email is sent to their registered address with a single-use link. Clicking it:
1. Temporarily bypasses MFA for one login session
2. Prompts the user to enroll a new phone number before continuing
3. Logs the MFA bypass in the admin audit log

**Lost Email (phone available)**

User visits `/account/recovery` and selects "I no longer have access to my email." An SMS OTP is sent to their registered phone. After verifying:
1. User is prompted to enter a new email address
2. A confirmation link is sent to the new email; account email updates on click
3. Admin audit log records the email change with timestamp and IP

**Lost Both — Manual Identity Verification**

When both email and phone are unavailable, the user submits a recovery request form at `/account/recovery/manual`:
- Display name and approximate join date
- The email address they believe is registered
- A brief description of how they lost access
- Optional: screenshot of a previous login or badge notification (to establish account ownership)

An admin reviews within **5 business days**. If the identity can be reasonably verified, they manually update the email address and send a reset link. If identity cannot be verified, the request is denied with a clear explanation.

Recovery requests are rate-limited to 3 per IP per 24 hours to prevent abuse.

**Recovery Code (Backup)**

When a user enrolls MFA (F47), they are shown a set of **8 single-use backup recovery codes** (alphanumeric, similar to Google Authenticator). They are instructed to save these somewhere safe. Any one code can be used in place of an SMS OTP for a single login. Used codes are invalidated. Users can regenerate codes in Settings → Security at any time (which invalidates the previous set).

**Database**

```sql
account_recovery_requests
  id           UUID PRIMARY KEY
  user_id      UUID REFERENCES users(id)  -- null if account cannot be identified
  email_claim  VARCHAR NOT NULL           -- email the user believes is registered
  description  TEXT
  status       ENUM('pending','approved','denied') DEFAULT 'pending'
  reviewed_by  UUID REFERENCES users(id)
  review_notes TEXT
  submitted_at TIMESTAMP NOT NULL
  resolved_at  TIMESTAMP

mfa_backup_codes
  id          UUID PRIMARY KEY
  user_id     UUID REFERENCES users(id)
  code_hash   VARCHAR NOT NULL   -- bcrypt hash of the backup code
  used        BOOLEAN DEFAULT false
  used_at     TIMESTAMP
  created_at  TIMESTAMP NOT NULL
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/recovery/email` | Request MFA bypass via email (lost phone) |
| POST | `/api/auth/recovery/sms` | Request email update via SMS OTP (lost email) |
| POST | `/api/auth/recovery/manual` | Submit manual identity verification request |
| GET | `/api/admin/recovery-requests` | List pending manual recovery requests (admin only) |
| PUT | `/api/admin/recovery-requests/:id/approve` | Approve + trigger email reset (admin only) |
| PUT | `/api/admin/recovery-requests/:id/deny` | Deny with reason (admin only) |
| GET | `/api/users/me/backup-codes` | Get status of backup codes (count remaining, not the codes) |
| POST | `/api/users/me/backup-codes/regenerate` | Regenerate backup codes (invalidates previous set) |

---

### F2 — Group Creation

**Priority: Must Have (MVP)**

- Group fields:
  - Name, description, banner image
  - Category + subcategory tag(s)
  - Location type: Local (city-based) or Online
  - Platform (for gaming groups): PC, Xbox, PlayStation, Nintendo Switch, Mobile, Any
  - **Crossplay Enabled toggle** (gaming groups only): when On, the group card displays a 🔀 Crossplay badge and the group appears in crossplay-filtered discovery results — meaning players on different platforms can join and play together
  - Schedule: Recurring (weekly, biweekly, monthly) or One-time
  - Date/time + timezone
  - Member capacity (min 2, max configurable)
  - Skill/experience level requirement (minimum level; enforced as a join gate for outdoor/physical activity groups — see F95)
  - Privacy: Public (open join) / Private (request to join) / Invite Only
  - Age range preference (optional)
  - Language(s) spoken

---

### F3 — Group Discovery & Search

**Priority: Must Have (MVP)**

- Homepage feed showing:
  - Recommended groups (based on user profile/tags)
  - Recently created groups
  - Groups with open spots near the user
- Search bar with full-text search across group names, descriptions, and activity tags — works for both local and online groups; see **F37** for fuzzy search, synonym mapping, and keyword search for online groups
- Filter panel:
  - Category / subcategory
  - Local vs. online
  - Platform (including Nintendo Switch)
  - **Crossplay Enabled** toggle — filter to groups that support cross-platform play (gaming groups only)
  - Schedule/availability
  - Skill level
  - Group size
  - Language
- **Location search:** enter a US ZIP code to search for local groups near any location (not just the user's registered ZIP) — see **F46** for proximity and distance filtering
- Group cards showing: name, category, member count/capacity, next session, skill level badge, 🔀 crossplay badge (if enabled), ⚠️ conduct flag (if owner has active warnings — see **F24**)
- For users whose ZIP is outside Palm Beach County: local group cards display normally but the join button is replaced with a 📍 pilot restriction notice (see **F48 — PBC Local Activity Gate**); online group cards are fully interactive with no restriction

---

### F4 — Group Membership & Management

**Priority: Must Have (MVP)**

- Join (public groups) or Request to Join (private groups)
- Group owner can: approve/deny requests, remove members, edit group details, delete group
- Member roles: Owner, Co-Moderator, Member (stored as `co_owner` in DB; referred to as "Co-Moderator" throughout for their moderation function — see F17)
- Member list with profiles visible to group members
- Leave group option for members

---

### F5 — Group Activity Feed & Message Board

**Priority: Must Have (MVP)**

- Per-group message board / activity feed
- Members can post text updates, announcements, session recaps
- Owner can pin important posts
- Basic reactions (👍 🎲 🔥 etc.)
- See **F54** for message editing, edit history, and edit-triggered content re-screening

---

### F54 — Message Editing & Edit History

**Priority: Should Have**

Users make typos. They also sometimes regret what they've posted. Without an edit feature, the only option is to delete and repost — which loses context and reactions. However, editable messages require careful handling: edits must be re-screened for content violations, and a visible edit indicator prevents bad-faith "edit after the fact" manipulation of conversations.

**Edit Rules**

- Any user can edit their own messages within **15 minutes** of posting. After 15 minutes, the message is locked and can only be deleted, not edited
- Group owners and co-mods can delete (but not edit) any message at any time
- Pinned messages cannot be edited — the owner must unpin first
- Editing a message triggers the same content filter (F18) as posting. If the edited content is flagged at CRITICAL or HIGH severity, the edit is rejected and the original remains

**Edit Indicator**

All edited messages display a subtle `(edited)` label with a timestamp tooltip showing when the last edit was made. This is visible to all group members. A click/tap on `(edited)` opens an **Edit History** modal showing:

```
Original message (posted [time])
  "[original text]"

Edit 1 (edited [time])
  "[edited text]"

Current version
  "[current text]"
```

Edit history is read-only and visible to all group members. Admins can see edit history on any message regardless of age.

**Database**

```sql
-- Add to messages table:
ALTER TABLE messages ADD COLUMN edited_at     TIMESTAMP;
ALTER TABLE messages ADD COLUMN edit_count    INTEGER DEFAULT 0;
ALTER TABLE messages ADD COLUMN is_locked     BOOLEAN DEFAULT false;

message_edit_history
  id           UUID PRIMARY KEY
  message_id   UUID REFERENCES messages(id)
  content      TEXT NOT NULL        -- the content at this point in history
  edited_by    UUID REFERENCES users(id)
  created_at   TIMESTAMP NOT NULL   -- when this version was saved
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/messages/:id` | Edit a message (body: `{ content }`) — re-runs content filter |
| GET | `/api/messages/:id/history` | Get full edit history for a message |

---

### F6 — Session Scheduling & RSVP

**Priority: Must Have (MVP)**

- Group owners can create events/sessions with date, time, duration, and notes
- Members RSVP: Going / Maybe / Can't Make It
- Event details visible on group page and in member notifications
- Upcoming events shown in user dashboard
- See **F51** for session cancellation, skip, and rescheduling flows

---

### F51 — Session Cancellation Flow

**Priority: Must Have (MVP)**

Events get cancelled. Life happens. Without a defined cancellation flow, group owners have no clean way to communicate a cancellation — they post in the feed, some members see it, others don't, and people show up to an empty meeting. This feature handles single-session cancellations, recurring event skips, and reschedules as first-class operations.

**Cancelling a One-Time Session**

From the event detail page, the owner (or co-mod) selects "Cancel Session." They are prompted for an optional reason (shown to members in the notification). On confirmation:

1. Event status updates to `cancelled`
2. All members who RSVP'd "Going" or "Maybe" receive an immediate push + in-app notification: *"[Session name] on [date] has been cancelled by [Owner]. Reason: [optional reason]"*
3. The cancelled event remains visible on the group page with a `CANCELLED` badge rather than being deleted — so members who check the app late can still see what happened
4. Any safe check-ins associated with the event are automatically voided

**Recurring Event Options**

When an owner cancels a recurring session, they choose from three options:

```
Cancel options for recurring event:
  ○ Cancel just this session     → skips one occurrence; template continues
  ○ Cancel this and all future   → deactivates the recurrence template entirely
  ○ Reschedule this session      → opens date/time picker for the new one-time date
```

For "cancel just this session," the system creates an `event_exceptions` record marking that occurrence as skipped. The next occurrence generates as normal. For "reschedule," the exception record stores the new date and the rescheduled event appears on the calendar in place of the original.

**Rescheduling**

The reschedule flow lets owners move a session to a new date/time without cancelling it. Members who already RSVP'd "Going" receive: *"[Session] has been rescheduled from [old date] to [new date]. Please update your RSVP if needed."* Their RSVP status resets to "pending" so they must reconfirm.

**Group Health Impact**

A cancellation does not count against the group's session streak. A cancellation with no rescheduled replacement within 14 days does trigger the dormancy nudge system (F20), since the group has effectively gone inactive regardless of the reason.

**Database**

```sql
-- Add to events table:
ALTER TABLE events ADD COLUMN status ENUM('scheduled','cancelled','completed') DEFAULT 'scheduled';
ALTER TABLE events ADD COLUMN cancelled_at  TIMESTAMP;
ALTER TABLE events ADD COLUMN cancel_reason TEXT;
ALTER TABLE events ADD COLUMN rescheduled_from UUID REFERENCES events(id);

-- Recurring exception records:
event_exceptions
  id              UUID PRIMARY KEY
  recurrence_id   UUID REFERENCES event_recurrence(id)
  exception_date  DATE NOT NULL       -- the occurrence date being overridden
  exception_type  ENUM('skipped','rescheduled')
  new_event_id    UUID REFERENCES events(id)  -- populated for rescheduled type
  created_at      TIMESTAMP NOT NULL
  UNIQUE(recurrence_id, exception_date)
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/events/:id/cancel` | Cancel a session (body: `{ reason, scope: 'single' \| 'all_future' }`) |
| PUT | `/api/events/:id/reschedule` | Reschedule a session to a new date/time |
| GET | `/api/groups/:id/recurrence/:rid/exceptions` | List all skip/reschedule exceptions for a recurrence |

---

### F7 — Notifications

**Priority: Must Have (MVP)**

- In-app notifications for:
  - Join request received (for owners)
  - Join request approved/denied (for members)
  - New message in a group you're in
  - New event/session posted
  - A group you saved has an open spot
- Email notifications (optional, user-controlled)

---

### F8 — User Dashboard

**Priority: Must Have (MVP)**

- "My Groups" list with quick access to each group page
- Upcoming sessions/events across all joined groups
- Pending join requests (sent & received)
- Suggested groups based on profile
- LFG status toggle at the top

---

### F9 — Reputation & Reviews

**Priority: Should Have**

- After a session, members can rate each other (1–5 stars + optional note)
- **Anonymous option:** raters can choose to submit anonymously — their name is hidden from the rated user but remains visible to admins for abuse investigation
- Ratings are aggregated into a public "Reliability Score" on each profile
- Helps group owners vet new members
- Flagging/reporting system for bad actors
- See **F55** for group-level and organizer quality ratings (separate from peer-to-peer ratings)

---

### F55 — Group & Organizer Rating

**Priority: Should Have**

Peer-to-peer ratings (F9) tell you whether individual members are reliable and pleasant to play with — but they say nothing about whether the *group itself* is well-run or whether the owner is a good host. A prospective member browsing groups has no signal for quality beyond the description text and member count. Group and organizer ratings give that signal.

**What gets rated**

Two separate ratings are collected after each confirmed session:

- **Group Rating** — how good was this particular session? (1–5 stars, optional comment). Reflects session quality, not individual conduct.
- **Organizer Rating** — how well did the group owner/host manage the session? (1–5 stars, optional comment). Separate from the owner's personal peer rating.

Both ratings are anonymous to other members. The owner can see aggregate scores and comment themes, but never which member left which rating.

**Where ratings appear**

- **Group page** — aggregate group rating shown as a star score with review count: "⭐ 4.6 (23 sessions rated)"
- **Group cards in Discover** — star score shown alongside member count and health badge
- **Organizer profile** — a separate "Organizer Score" badge alongside their personal trust score, showing their average host rating across all groups they've run

**Rating Prompt**

24 hours after a session ends, members who confirmed attendance receive a push + in-app notification: *"How was [Group]'s session on [date]? Take 30 seconds to rate it."* The rating prompt presents both sliders on a single screen. Members who didn't attend (RSVP'd "Can't Make It" or didn't RSVP) do not receive the prompt.

**Protection against manipulation**

- Members cannot rate a session they did not confirm attendance for
- Ratings below 2 stars with no comment are held for 24 hours before being counted, giving the system time to check if a report was also filed against the same group around the same time (coordinated low-rating attacks are flagged for admin review)
- Owners cannot rate their own group or their own organizer score

**Database**

```sql
session_ratings
  id               UUID PRIMARY KEY
  event_id         UUID REFERENCES events(id)
  rater_id         UUID REFERENCES users(id)
  group_rating     INTEGER CHECK(group_rating BETWEEN 1 AND 5)
  organizer_rating INTEGER CHECK(organizer_rating BETWEEN 1 AND 5)
  comment          TEXT
  is_anonymous     BOOLEAN DEFAULT false  -- if true, rater_id hidden from rated parties; visible to admins only
  created_at       TIMESTAMP NOT NULL
  UNIQUE(event_id, rater_id)

-- Cached aggregates on groups table:
ALTER TABLE groups ADD COLUMN avg_group_rating     DECIMAL(3,2);
ALTER TABLE groups ADD COLUMN total_group_ratings  INTEGER DEFAULT 0;
ALTER TABLE groups ADD COLUMN avg_organizer_rating DECIMAL(3,2);
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events/:id/rating` | Submit group + organizer rating for a session |
| GET | `/api/groups/:id/ratings` | Get aggregate group and organizer ratings + recent comments |
| GET | `/api/users/:id/organizer-rating` | Get a user's aggregate organizer score |

---

### F56 — User Connections / Saved Players

**Priority: Should Have**

After a great session, users have no way to stay loosely connected with specific people they enjoyed playing with — short of both of them happening to be in the same group again. A lightweight "Saved Players" list lets users bookmark people they'd like to play with again, without the social weight of a full friend request system.

**How it works**

From any user's profile or group member card, users can tap "Save Player" (bookmark icon). The saved user is added to a private list visible only to the saver. Saving someone does not notify them and creates no visible connection on their profile — it's a personal reference list, not a social graph.

**Saved Players List (`/profile/saved`)**

- Shows avatar, display name, trust tier, primary activity tags, and current LFG status
- Sortable by: recently saved, recently active, alphabetical
- One-tap access to their profile or to see which groups you share
- "Suggest a group" button: surfaces groups both users are eligible for and not currently in together
- If a saved player turns on LFG status, the saver receives an optional notification: *"[Player] is looking for a group — check their profile"*

**Privacy**

- Saving is entirely private — the saved user never knows and their profile shows no indication
- Users can see and manage who they have saved; they cannot see who has saved them
- If a saved player blocks the saver, they are automatically removed from the saved list

**Database**

```sql
saved_players
  id          UUID PRIMARY KEY
  saver_id    UUID REFERENCES users(id)
  saved_id    UUID REFERENCES users(id)
  created_at  TIMESTAMP NOT NULL
  UNIQUE(saver_id, saved_id)
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me/saved-players` | List current user's saved players |
| POST | `/api/users/me/saved-players/:userId` | Save a player |
| DELETE | `/api/users/me/saved-players/:userId` | Remove a saved player |
| GET | `/api/users/me/saved-players/:userId/shared-groups` | Groups both users are in or eligible for |

---

### F10 — Real-Time Group Chat

**Priority: Must Have**

Every RollCall group needs a real-time, in-platform chat space. Without it, communities inevitably migrate to external tools — Discord, WhatsApp, Telegram — where RollCall has zero visibility, zero moderation authority, and no way to protect members from harassment, grooming, or unsafe contact-sharing. Keeping all community communication inside RollCall means every message passes through content screening, every bad actor can be acted on by mods and admins, and every member's safety protections travel with them. External chat is not a safe substitute.

---

#### Channels

Every group automatically gets **three default channels** on creation. Group owners and co-moderators can add, rename, reorder, and archive channels.

| Channel | Default Name | Purpose |
|---|---|---|
| General | `#general` | Open discussion — anything group-related |
| Scheduling | `#scheduling` | Session planning, availability, date polls |
| Off-Topic | `#off-topic` | Casual chat, memes, off-topic banter |

**Channel limits:** Groups can have up to **5 channels**; owners can archive old channels to free up slots. Archived channels are read-only but searchable.

**Channel types:**

| Type | Who can post | Who can read |
|---|---|---|
| Standard | All members | All members |
| Announcement | Owner & co-mods only | All members |
| Read-only (archived) | No one | All members |

---

#### Real-Time Messaging (Socket.io)

- Messages are delivered via Socket.io to all members currently connected to the channel room (`group:{id}:channel:{channelId}`).
- Members not currently connected receive the message on next load via HTTP catch-up (`GET /api/groups/:id/channels/:channelId/messages`).
- **Typing indicators** — *"[User] is typing…"* shown when a member is actively composing. Indicator clears after 3 seconds of inactivity. Maximum of 3 names shown simultaneously; beyond that, *"Several people are typing…"*
- **Online presence dots** — a green dot on member avatars in the sidebar indicates members currently connected to any channel in the group. This is opt-out per user (Settings → Privacy).
- **Message delivery receipts** — a ✓ (sent to server) appears on the sender's own message immediately; this does not indicate that other members have read it (no group-wide read receipts — too noisy in multi-member chats).

---

#### Message Features

| Feature | Detail |
|---|---|
| Text | Plain text up to 2,000 characters per message |
| Formatting | Markdown subset: **bold**, *italic*, `code`, ~~strikethrough~~, > blockquote |
| @mentions | Full F63 @mention pipeline — live suggestion dropdown, highlighted tokens, notification to mentioned user |
| Spoiler tags | `\|\|text\|\|` syntax (F65) — works identically to forum spoilers |
| Reactions | Emoji reactions on any message (up to 20 distinct reactions per message); reaction counts shown |
| Replies | Inline reply threads — quote a specific message and reply in-line; replies are collapsed by default and expandable |
| Image attachments | Up to 3 images per message; Cloudinary pipeline (F42 moderation rules apply — AI screen before display); max 10 MB per image |
| Link previews | Open Graph preview card auto-generated for URLs; suppressed for domains on the blocked-domain list (F62); **External Link Warning modal** (F62) fires on click |
| Edit | 15-minute edit window (F54 rules apply — re-screened on edit, `(edited)` label shown, history accessible) |
| Delete (own) | Users can delete their own messages at any time; content replaced with `[deleted]` — timestamp and "deleted" label remain |
| Pin | Owner/co-mods can pin up to 5 messages per channel; pinned messages shown in a collapsible banner at channel top |

---

#### Content Safety & Moderation

**Every message is screened before broadcast.** The content pipeline runs synchronously server-side before the Socket.io `message:new` event is emitted to the room:

```
User sends message
      │
      ▼
1. Rate limit check (see Slow Mode below)
2. bad-words filter (F18) — CRITICAL/HIGH → message blocked, sender warned
                           MEDIUM → message held, sender warned, mod notified
                           LOW → message posted with auto-flag in mod log
3. External URL detection — intercept for F62 modal on client
4. Secret code word check (F41) — silently strip phrase and trigger alarm if matched
5. Image moderation (Cloudinary AI) if attachment present
      │
      ▼
Message stored in database → emitted via Socket.io to room
```

**No message leaves the server unscreened.**

---

#### Mod Tools (per-channel and per-member)

Group owners and co-moderators have a **Mod Actions** menu (three-dot icon) on every message and member:

| Action | Who | Effect |
|---|---|---|
| Delete message | Owner, Co-mod | Replaces content with `[deleted]`; logged in mod log |
| Pin / Unpin message | Owner, Co-mod | Appears/disappears from channel pin banner |
| Warn member | Owner, Co-mod | Issues group-level warning (F17 graduated system) |
| Mute member in chat | Owner, Co-mod | Member can read but cannot post in any channel for a set duration (1h / 24h / 7 days / permanent) |
| Remove member | Owner | Kicks member from the group; optionally bans from rejoining |
| Slow Mode | Owner, Co-mod | Enforces a per-member message cooldown (15s / 30s / 60s / 5 min) for the channel |

**Slow Mode** is especially useful for large groups or heated topics — it limits each member to one message per interval without blocking mods.

**Mod Log:** Every mod action in chat is appended to the group's moderation log (visible to owner and co-mods), recording the action, the moderator who took it, the target message or member, and the timestamp.

---

#### Member Reporting

Any member can report a chat message via the three-dot menu:

- Report reason categories: Hate speech, Harassment, Spam, Inappropriate image, Unsafe contact sharing, Spoilers without tag, Other
- Report is sent to the group mod queue AND (for CRITICAL violations — hate speech, harassment, unsafe contact) simultaneously escalated to the platform admin queue (F15)
- The reporter is never identified to the reported user
- Reported messages are flagged in the mod view with a ⚠️ indicator

**"Unsafe contact sharing" category** specifically targets members attempting to move conversations off-platform by sharing phone numbers, external chat links, or personal addresses in a group context. This gives mods a fast, unambiguous way to address exactly the behaviour the platform is designed to prevent.

---

#### Message Search & History

- **Full-text search** within a channel via a search bar (🔍) at the channel top
- Search is scoped to the current channel; results show message + timestamp + author with a "Jump to" link
- **Message history** is paginated (50 messages per page, infinite scroll upward)
- History is available to all current group members from the beginning of the channel — there is no expiry for message history by default
- Admins can view message history for any group from the Admin Panel (F15) as part of an investigation — this capability is disclosed in the platform Privacy Policy and Community Standards

---

#### Channel & Chat Settings (per-group, owner/co-mod only)

Accessible from the group Settings → Channels tab:

- Add / rename / reorder / archive channels
- Set channel type (Standard / Announcement)
- Enable/disable slow mode globally per channel and set the interval
- Set a channel topic/description (shown as a subtitle under the channel name)
- Set a welcome message that new members see when they first open a channel
- **Chat rules pinned message** — a special system-pinned message at the top of #general populated from the group's rules (F17) — always visible, cannot be unpinned by mods

---

#### Database

```sql
channels
  id           UUID PRIMARY KEY
  group_id     UUID REFERENCES groups(id)
  name         VARCHAR NOT NULL        -- e.g. "general", "scheduling"
  type         ENUM('standard','announcement','archived') DEFAULT 'standard'
  position     INTEGER NOT NULL        -- display order
  topic        VARCHAR                 -- optional subtitle
  welcome_msg  TEXT                    -- shown to new members on first open
  slow_mode_seconds INTEGER DEFAULT 0  -- 0 = disabled
  created_at   TIMESTAMP NOT NULL

chat_messages
  id              UUID PRIMARY KEY
  channel_id      UUID REFERENCES channels(id)
  author_id       UUID REFERENCES users(id)
  body            TEXT                 -- max 2000 chars; replaced with '[deleted]' on deletion
  reply_to_id     UUID REFERENCES chat_messages(id)  -- null = top-level message
  has_attachment  BOOLEAN DEFAULT false
  has_spoiler     BOOLEAN DEFAULT false
  is_pinned       BOOLEAN DEFAULT false
  is_deleted      BOOLEAN DEFAULT false
  edited_at       TIMESTAMP
  moderation_flag VARCHAR              -- 'low'|'medium'|null — auto-set by content filter
  created_at      TIMESTAMP NOT NULL

chat_reactions
  id           UUID PRIMARY KEY
  message_id   UUID REFERENCES chat_messages(id)
  user_id      UUID REFERENCES users(id)
  emoji        VARCHAR NOT NULL
  created_at   TIMESTAMP NOT NULL
  UNIQUE(message_id, user_id, emoji)

chat_member_mutes
  id           UUID PRIMARY KEY
  group_id     UUID REFERENCES groups(id)
  user_id      UUID REFERENCES users(id)
  muted_by     UUID REFERENCES users(id)
  muted_until  TIMESTAMP              -- null = permanent
  reason       TEXT
  created_at   TIMESTAMP NOT NULL
```

---

#### Socket.io Events

| Direction | Event | Payload |
|---|---|---|
| Server → client | `message:new` | Full message object |
| Server → client | `message:edited` | `{ id, body, editedAt }` |
| Server → client | `message:deleted` | `{ id }` |
| Server → client | `reaction:update` | `{ messageId, emoji, count, userReacted }` |
| Server → client | `typing:start` | `{ userId, displayName }` |
| Server → client | `typing:stop` | `{ userId }` |
| Server → client | `member:muted` | `{ userId, mutedUntil }` — sent to muted member only |
| Server → client | `channel:updated` | Channel object (name/topic/slowMode changed) |
| Client → server | `typing` | `{ channelId }` — debounced, emitted every 2s while composing |

---

#### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/groups/:id/channels` | List all channels for a group |
| POST | `/api/groups/:id/channels` | Create a new channel (owner/co-mod only) |
| PUT | `/api/groups/:id/channels/:channelId` | Update channel name, type, topic, slow mode |
| DELETE | `/api/groups/:id/channels/:channelId` | Archive a channel |
| GET | `/api/groups/:id/channels/:channelId/messages` | Paginated message history (50 per page) |
| POST | `/api/groups/:id/channels/:channelId/messages` | Post a message (screened before broadcast) |
| PUT | `/api/groups/:id/channels/:channelId/messages/:msgId` | Edit own message (15-min window) |
| DELETE | `/api/groups/:id/channels/:channelId/messages/:msgId` | Delete own message or mod-delete |
| POST | `/api/groups/:id/channels/:channelId/messages/:msgId/pin` | Pin a message (owner/co-mod) |
| DELETE | `/api/groups/:id/channels/:channelId/messages/:msgId/pin` | Unpin a message |
| POST | `/api/groups/:id/channels/:channelId/messages/:msgId/react` | Add/toggle reaction |
| POST | `/api/groups/:id/channels/:channelId/messages/:msgId/report` | Report a message |
| POST | `/api/groups/:id/members/:userId/chat-mute` | Mute a member in chat (owner/co-mod) |
| DELETE | `/api/groups/:id/members/:userId/chat-mute` | Unmute a member in chat |

---

### F11 — Maps Integration (Local Groups)

**Priority: Should Have**

- Local groups can optionally set a general meeting area (neighborhood/city, not exact address)
- Map view on discovery page showing local groups near user
- Distance filter ("within 10 miles")

---

### F12 — "Find Me a Group" Quiz

**Priority: Nice to Have**

- Short onboarding quiz for new users
- Questions: What are you into? When are you free? Online or local? Skill level?
- Returns 3–5 curated group recommendations
- Also prompts: "Nothing matches? Create a group instead!"

---

### F13 — Dark / Light Mode Toggle


**Priority: Must Have (MVP)**

RollCall ships with a dark theme by default but must provide a seamless one-click toggle so users can switch to a light theme at any time. The preference is saved to the user's account (for logged-in users) and to `localStorage` (for guests) so it persists across sessions and devices.

**Toggle Behavior**

- A sun/moon icon button (`🌙` / `☀️`) is always visible in the top navigation bar, accessible from every page
- Clicking the button instantly switches the active theme with a smooth CSS transition (150 ms ease)
- No page reload required — the theme change is applied purely via CSS custom properties / Tailwind dark-mode classes
- The active theme is reflected in the `<html>` element class: `class="dark"` or `class="light"`

**Implementation Approach**

The recommended approach uses **Tailwind CSS `darkMode: 'class'`** strategy combined with a React context provider:

```
ThemeContext
  ├── state: 'dark' | 'light'
  ├── toggleTheme() — flips state, writes to localStorage + DB
  └── ThemeProvider wraps entire <App />
```

On app load, theme is resolved in this priority order:
1. Saved user preference (DB) — for authenticated users
2. `localStorage` value — for guests or on first load
3. System preference via `prefers-color-scheme` media query — fallback default

**Dark Mode Design Tokens**

| Token | Dark Value | Light Value |
|-------|-----------|-------------|
| `--bg-primary` | `#0E0E22` | `#F8F9FC` |
| `--bg-surface` | `#14142A` | `#FFFFFF` |
| `--bg-card` | `#1A1A35` | `#FFFFFF` |
| `--border` | `#2A2A4A` | `#E2E6EF` |
| `--text-primary` | `#FFFFFF` | `#0F0F1E` |
| `--text-secondary` | `#9090B0` | `#5A6070` |
| `--accent-blue` | `#00D4FF` | `#007AFF` |
| `--accent-purple` | `#7B2FFF` | `#6B21F0` |

**Toggle Component Spec**

```jsx
// Placement: top-right of navbar, left of user avatar
<ThemeToggle />

// Renders as:
// Dark mode active → shows ☀️ sun icon (clicking switches to light)
// Light mode active → shows 🌙 moon icon (clicking switches to dark)

// Accessibility:
//   aria-label="Switch to light mode" / "Switch to dark mode"
//   role="button"
//   Keyboard accessible (Enter / Space to activate)
```

**API — Save Preference (Authenticated Users)**

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| PUT | `/api/users/:id/preferences` | `{ "theme": "light" \| "dark" }` | Save theme preference to user account |

**Database — User Preferences**

A new `theme_preference` column is added to the `users` table (see updated schema in Database Schema section).

---

### F14 — Community Standards & Zero-Tolerance Policy

**Priority: Must Have (MVP)**

RollCall enforces a strict zero-tolerance policy against all forms of hateful, derogatory, and discriminatory conduct. This policy is non-negotiable, applies to every user on the platform regardless of context, and is enforced by the administration team with permanent banning as the default consequence.

#### Policy Statement (displayed site-wide)

> **RollCall is open to users aged 13 and older.** By creating an account, you confirm that you meet the minimum age requirement or have parental/guardian consent.
>
> **RollCall has a zero-tolerance policy for hate speech, racial slurs, derogatory language, harassment, and discriminatory behavior of any kind.** Violations result in immediate, permanent removal from the platform with no opportunity to rejoin. There are no warnings for hate speech or targeted harassment.

#### Prohibited Conduct

The following are grounds for immediate permanent ban:

- Racial slurs or racially derogatory language of any kind, in any context
- Hate speech targeting any person or group based on race, ethnicity, religion, gender identity, sexual orientation, disability, or national origin
- Targeted harassment, threats, or intimidation directed at another user
- **Sexual harassment** — any unwanted sexual comments, advances, propositions, or explicit messages directed at another user
- **Sexual abuse** — sharing, requesting, or threatening to share non-consensual intimate imagery (NCII) or any sexually explicit content involving another user without their consent
- Sharing or promoting content that sexualizes, demeans, or dehumanizes any individual or group
- Impersonating another user with intent to harm their reputation
- **Verbal abuse and condescension** — talking down to users about their skill level, experience, or knowledge; belittling contributions, demeaning questions, or mocking someone for being new. First offense triggers a formal warning; repeated offenses escalate through the graduated moderation ladder.
- Repeated violations of community guidelines after prior warning (for lesser offenses)

> **Note:** Verbal abuse and condescension are **warning-tier violations**, not zero-tolerance bans. They follow the graduated moderation ladder (F22): formal warning → temporary suspension → permanent ban on repeat offense. Zero-tolerance violations (hate speech, slurs, sexual abuse) remain direct permanent bans regardless of history.

> Sexual harassment and sexual abuse reports are treated as **priority zero** — they bypass the standard report queue and are escalated immediately to the platform owner. The accused user's account is suspended pending review, not merely flagged. See the Sensitive Report Flow below.

---

#### Prohibited Group Types

RollCall is an activity and hobby platform. Certain group categories are explicitly prohibited regardless of how they are framed or described. These prohibitions apply at **group creation** (the system blocks the group from being published) and on an **ongoing basis** (existing groups found to violate these rules are immediately suspended, pending admin review under F15).

**1. Political Groups**

Groups whose primary purpose is political advocacy, campaigning, partisan discussion, electoral organizing, or the promotion of any political party, candidate, or ideology are prohibited. RollCall is not a platform for political discourse.

- Examples of prohibited groups: "Voters for [Candidate]", "Local Conservative Club", "Progressive Action Network", "Election Canvassers"
- What is **not** prohibited: groups that incidentally discuss current events, news, or social topics as part of a broader hobby or activity (e.g., a book club reading political biographies, or a debate club covering any topic).
- The determining factor is whether **political advocacy is the group's primary stated purpose**.

**2. Religious Groups**

Groups whose primary purpose is religious worship, proselytizing, faith formation, or the promotion of any religion or faith tradition are prohibited. Faith-based social identity is not an activity category.

- Examples of prohibited groups: "Sunday Bible Study", "Quran Reading Circle", "Interfaith Prayer Group", "Church Fellowship"
- What is **not** prohibited: groups organized around activities that happen to occur in a faith community setting (e.g., a chess club that meets at a community centre that is also a church), provided the group's activity is secular and the religious affiliation is incidental.
- The determining factor is whether **religious practice or promotion is the group's primary stated purpose**.

**3. Groups Intending or Planning to Cause Harm**

Groups whose purpose, content, activities, or communications indicate planning, coordinating, recruiting for, or glorifying any activity intended to cause harm to people, animals, property, or public safety are prohibited. This includes but is not limited to:

- Groups coordinating violence against individuals or groups
- Groups celebrating, recruiting for, or organizing around criminal activity
- Groups whose content constitutes a credible threat of harm to identifiable individuals

These groups are treated as **Priority Zero** and are subject to the escalated Harmful Group Report flow described below. See also **F15 — Admin Control Panel** for the suspension and law enforcement referral process.

**Enforcement at Group Creation**

At group creation (F2), the system applies:
1. **Keyword screening**: The group name, description, and category tags are scanned against a blocklist of political party names, religious institution keywords, and threat-pattern phrases (server-side, before the group is published). A match surfaces a rejection notice: *"This group type is not permitted on RollCall. See our Community Standards for more information."*
2. **Category blocking**: The activity category taxonomy does not include "Politics", "Religion", or equivalent top-level categories — they are absent from the selection list, making accidental selection impossible.
3. **Post-publish reports**: Any user can report an existing group as violating these prohibitions using the group-level Report function (Report button in group header → "Prohibited group type"). This submits a Group Report to the admin panel (F15 Tab 5).

> **Note**: The keyword blocklist is not exhaustive and is not the sole enforcement mechanism. Admin review of reports is the primary backstop. The blocklist reduces obvious violations at creation time; edge cases are handled by the report → review → suspend flow.

#### Enforcement Flow

```
User posts/acts in violation
        │
        ▼
Another user submits a Report (reason + screenshot optional)
        │
        ▼
Report queued in Admin Dashboard (flagged for review)
        │
        ▼
Admin reviews report
        │
   ┌────┴────┐
   │         │
Dismiss    Confirm Violation
   │         │
   ▼         ▼
No action  Immediate Ban → user added to Blacklist
                │
                ▼
        User receives ban notification email
        Login attempts show ban message + reason
                │
                ▼
        Admin may optionally Whitelist user
        (appeals process — admin discretion only)
```

#### Sensitive Report Flow — Sexual Harassment & Abuse

Sexual harassment and sexual abuse reports are handled through a separate, elevated process that prioritizes speed, confidentiality, and reporter safety.

**What makes it different from a standard report:**

| Aspect | Standard Report | Sensitive Report |
|--------|----------------|-----------------|
| Queue | General admin queue | Restricted — platform owner only |
| Accused account | Active while pending review | **Suspended immediately** pending review |
| Reporter identity | Visible to all admins | Visible to platform owner only; hidden from standard admins |
| Resolution target | 72 hours | **24 hours** |
| Outcome if confirmed | Permanent ban | Permanent ban + optional law enforcement referral note |
| Reporter notification | Basic status update | Step-by-step updates + resource links |

**Sensitive Report UI Flow:**

```
User clicks "Report" on a message, profile, or post
        │
        ▼
Report modal opens — user selects violation type:
  ○ Hate Speech / Slurs
  ○ Harassment or Threats
  ● Sexual Harassment or Abuse  ← triggers sensitive flow
  ○ Spam
  ○ Other
        │
        ▼
Sensitive Report screen:
  • Reassurance message: "You are safe to report this. Your identity
    will only be visible to the platform owner, not other admins."
  • Description field (required, min 20 chars)
  • Optional: upload screenshot or evidence (image, max 10 MB)
  • Optional: "I would like to be contacted for follow-up" checkbox
    └─ If checked: email field (pre-filled with account email, editable)
  • Crisis resources displayed at bottom of form (always visible)
  • "Submit Report" button
        │
        ▼
Server actions (immediate, automated):
  1. Report logged with type = 'sexual_harassment' or 'sexual_abuse'
  2. Accused user account status → 'suspended_pending_review'
  3. Push notification + email sent to platform owner only
  4. Reporter receives confirmation: "Your report has been received.
     The reported user's account has been suspended while we review."
        │
        ▼
Platform owner reviews within 24 hours:
  • Confirmed → Permanent ban + reporter notified + resources re-sent
  • Not confirmed → Unsuspend accused + reporter notified with explanation
```

**Crisis & Support Resources (always displayed on sensitive report screens):**

| Resource | Contact |
|----------|---------|
| RAINN National Sexual Assault Hotline | 1-800-656-4673 · rainn.org |
| Crisis Text Line | Text HOME to 741741 |
| National Domestic Violence Hotline | 1-800-799-7233 · thehotline.org |
| Local law enforcement | 911 (emergencies) |

> These resources are displayed on the report form, in the confirmation email, and in the resolution notification — not just on a static page.

**Reporter Protections:**

- The user who files a sensitive report cannot be messaged, viewed, or joined in a group by the accused user while the suspension is in effect
- Filing a sensitive report cannot result in a counter-report penalty against the reporter
- Reporter anonymity from standard admins is enforced at the API level — sensitive reports are only returned via admin endpoints that verify `platform_owner` sub-role

#### User-Facing Policy Touchpoints

| Location | Implementation |
|----------|---------------|
| **First-visit modal** | Community Standards agreement modal appears on first login/signup. User must click "I Agree" before using the platform. Acceptance stored in `localStorage` + DB. |
| **Sign-up flow** | Checkbox: "I have read and agree to RollCall's Community Standards and Zero-Tolerance Policy" — required to complete registration. |
| **Navbar footer link** | "Community Standards" link in site footer, always accessible. |
| **Group pages** | Reminder banner at top of group message boards: *"This community follows RollCall's zero-tolerance policy."* |
| **Report button** | Visible on every message, post, and user profile card. |
| **Ban screen** | When a banned user tries to log in, they see a clear explanation of the ban with a policy reference. |

---

### F15 — Admin Control Panel

**Priority: Must Have (MVP)**

Administrators have access to a protected `/admin` dashboard with full user management capabilities, including the ability to ban users (add to blacklist) and whitelist previously banned users (restore access after appeal).

#### Access Control

- Admin role is set at the database level (`role = 'admin'`)
- The `/admin` route is a protected React route — non-admin users are redirected to `/`
- Admin sessions require re-authentication after 2 hours of inactivity
- All admin actions are logged to an immutable audit trail

#### Admin Dashboard Tabs

**1. Overview**
- Active users count, new signups (24h / 7d / 30d)
- Open reports count (unreviewed)
- Recent bans
- Platform health stats

**2. User Management**
- Searchable/filterable table of all registered users
- Columns: Display Name, Email, Join Date, Role, Status, Groups Count, Reports Against
- Actions per user: View Profile, Warn, Ban (opens reason modal), Promote to Moderator
- Bulk actions: select multiple users, apply action

**3. Blacklist (Banned Users)**
- List of all currently banned users
- Columns: Name, Email, Ban Reason, Banned Date, Banned By, Violation Type
- Actions: View Details, Whitelist (restore access), Export Ban Record
- Ban reason is stored and shown to the banned user at login

**4. Whitelist (Cleared Users)**
- Users who were banned and subsequently cleared by admin review
- Columns: Name, Email, Original Ban Reason, Cleared Date, Cleared By, Notes
- Actions: Re-ban, Remove from Whitelist, View History
- Whitelisted users regain full platform access

**5. Reports Queue**
- All user-submitted reports sorted by date (newest first)
- Columns: Reporter, Reported User / Group, Violation Type, Description, Status (Pending/Reviewed/Dismissed)
- Actions: View Full Report, Ban Reported User, Suspend Reported Group, Dismiss Report, Mark as Reviewed
- Filter by: Violation Type, Status, Date Range, Target Type (User / Group)
- **Sensitive reports (`is_sensitive = true`) are NOT visible in this tab** — they appear only in Tab 6
- **Harmful group reports (`is_harmful_group = true`) are NOT visible in this tab** — they appear only in Tab 7

**6. Sensitive Reports (Platform Owner Only)**

This tab is restricted to accounts with the `platform_owner` sub-role (a single designated account, separate from general admin). It is not visible to standard admin accounts at all — it does not appear in their navigation.

- Lists all reports where `is_sensitive = true` (violation type: `sexual_harassment` or `sexual_abuse`)
- Columns: Date, Reported User, Description, Evidence (thumbnail), Reporter (visible here only), Accused Status
- The accused user is shown as `Suspended — Pending Review` until the owner takes action
- Actions per report:
  - **Confirm & Permanently Ban** — bans user, notifies reporter with confirmation + resource links
  - **Dismiss & Restore** — unsuspends accused, sends reporter a respectful explanation email
  - **Escalate Note** — adds a private note flagging potential law enforcement referral (does not auto-contact LE — that remains the platform owner's discretion)
- All actions in this tab are logged to the `admin_audit_log` with `admin_id` = platform owner

**7. Harmful Group Reports (Platform Owner Only)**

This tab is restricted to the `platform_owner` sub-role and is not visible to standard admin accounts. It handles reports of groups that appear to be planning, coordinating, or glorifying activities intended to cause harm to people, animals, or property.

**What triggers a Harmful Group Report:**
Any user can file a Harmful Group Report from the group's public or member page by clicking Report → "This group is planning or promoting harmful activity." Internally this sets `is_harmful_group = true` on the report record.

**Automated action on submission:**
Upon receiving a Harmful Group Report, the system immediately and automatically:
1. Sets the reported group's status to `suspended_pending_review` — the group page becomes inaccessible to all members (a neutral notice is shown: *"This group is temporarily unavailable."*). Group content, membership, and messages are preserved in full.
2. Sends a push notification + email to the platform owner.
3. Sends the reporter a confirmation: *"Your report has been received. The group has been temporarily suspended while we review."*
4. Logs the event in `admin_audit_log`.

**Tab columns:** Date, Group Name, Group Owner, Report Description, Evidence (attachments), Reporter (visible to platform owner only), Accused Group Status

**Actions per report:**

| Action | What it does |
|---|---|
| **Confirm Violation — Remove Group** | Permanently deletes the group; bans the group owner; notifies all members that the group was removed for violating Community Standards; reporter notified of outcome |
| **Confirm — Prohibited Type Only** | Group is permanently removed for being a prohibited type (political/religious) without an owner ban; owner notified of the specific rule violated |
| **Dismiss & Restore** | Group is unsuspended; reporter notified that no violation was found |
| **Escalate Note** | Adds a private platform-owner-only note flagging the report for potential law enforcement referral. Does not auto-contact any authority — law enforcement referral is entirely at the platform owner's discretion, consistent with the F14 sensitive report flow. |

**Law Enforcement Referral — Owner Discretion**

RollCall does not automatically report any content to law enforcement. The platform owner may choose to refer a Harmful Group Report to the relevant authorities based on their assessment of the report content. This decision:
- Is made solely by the platform owner
- Is logged in `admin_audit_log` with action type `le_referral_noted`
- Does not trigger any automated system action — it is a manual decision and manual process

> This approach mirrors the escalation model already used in the F14 Sensitive Report Flow (sexual harassment/abuse), where "Escalate Note" flags a report for potential LE referral without creating any automatic obligation.

All actions in this tab are logged to `admin_audit_log` with `admin_id` = platform owner.

#### Ban / Whitelist Data Model

```
Blacklist entry:
  - user_id (FK → users)
  - ban_reason (TEXT)
  - violation_type (ENUM: hate_speech | harassment | slurs | sexual_harassment |
                          sexual_abuse | harmful_group | prohibited_group_type | other)
  - banned_by (FK → users — admin who issued ban)
  - banned_at (TIMESTAMP)
  - is_permanent (BOOLEAN DEFAULT true)
  - whitelist_override (BOOLEAN DEFAULT false)

Whitelist entry (override on banned user):
  - user_id (FK → users)
  - cleared_by (FK → users — admin)
  - cleared_at (TIMESTAMP)
  - appeal_notes (TEXT)
  - reinstated_with_conditions (BOOLEAN)

Group suspension entry:
  - group_id (FK → groups)
  - suspended_at (TIMESTAMP)
  - suspended_by (FK → users — system or admin)
  - suspension_reason (TEXT)
  - is_permanent (BOOLEAN DEFAULT false)
  - report_id (FK → reports — the triggering report)
  - restored_at (TIMESTAMP — null while suspended)
  - restored_by (FK → users — platform owner who dismissed the report)
```

#### Admin API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users with status and report counts |
| GET | `/api/admin/reports` | Get all non-sensitive reports (filterable by status) |
| POST | `/api/admin/ban/:userId` | Ban a user (body: `{ reason, violationType }`) |
| DELETE | `/api/admin/ban/:userId` | Lift a ban (unban) |
| POST | `/api/admin/whitelist/:userId` | Add user to whitelist (clear ban with notes) |
| DELETE | `/api/admin/whitelist/:userId` | Remove from whitelist |
| GET | `/api/admin/audit-log` | Retrieve full admin action audit log |
| PUT | `/api/admin/reports/:id` | Update report status (reviewed/dismissed) |
| GET | `/api/admin/sensitive-reports` | **Platform owner only** — list all sensitive reports |
| PUT | `/api/admin/sensitive-reports/:id/confirm` | **Platform owner only** — confirm violation, ban user, notify reporter |
| PUT | `/api/admin/sensitive-reports/:id/dismiss` | **Platform owner only** — dismiss report, restore accused, notify reporter |
| GET | `/api/admin/harmful-group-reports` | **Platform owner only** — list all harmful group reports |
| PUT | `/api/admin/harmful-group-reports/:id/confirm-remove` | **Platform owner only** — permanently remove group, ban owner, notify members |
| PUT | `/api/admin/harmful-group-reports/:id/confirm-prohibited` | **Platform owner only** — remove group for prohibited type, notify owner |
| PUT | `/api/admin/harmful-group-reports/:id/dismiss` | **Platform owner only** — dismiss report, restore group, notify reporter |
| POST | `/api/admin/groups/:id/suspend` | **Admin** — immediately suspend a group pending review; body: `{ reason }` |
| POST | `/api/admin/groups/:id/restore` | **Platform owner** — restore a suspended group |

---

### F26 — Guided Onboarding Flow

**Priority: Must Have (MVP)**

The single highest-impact feature for user retention is what happens in the first five minutes after registration. Without a guided onboarding flow, new users land on an empty dashboard with no direction and churn immediately. Every step should reduce friction and create an early win — a group joined, or a group created.

**Age Confirmation (pre-registration)**

Before creating an account, users confirm they meet the minimum age requirement. This is the first screen a new visitor sees after clicking "Sign Up":

```
Age Confirmation Screen
  • Headline: "Welcome to RollCall"
  • Checkbox (required): "I am 13 years of age or older, or I have parental/guardian
    consent to use this platform."
  • "Continue" button — disabled until checkbox is ticked
  • Note: "RollCall is open to users 13+. Users under 13 are not permitted.
    See our Terms of Service and Privacy Policy."
```

**Onboarding Sequence (post-registration)**

```
Step 1 — Verify Email
  User receives confirmation email → clicks link → account activated
  [Skip not permitted — verification gates all platform features]

Step 2 — Build Your Profile (2 min)
  • Display name + avatar upload (or auto-generated initials)
  • ZIP code (required — used for proximity matching; never shown publicly)
  • Timezone (auto-detected from ZIP, user confirms or changes)
  • Online / Local / Both preference toggle
  • Spoken languages

Step 3 — Pick Your Interests (1 min)
  • Multi-select activity category tiles with icons (large, tap-friendly)
  • After selecting a category, 1–3 quick follow-up prompts appear inline:
      Gaming → "Which platforms do you play on?" (multi-select: PC / Xbox /
               PlayStation / Nintendo Switch / Mobile)
               "Any specific games?" (free-text with autocomplete + synonym map)
      Hiking  → "What's your experience level?" (Beginner / Intermediate / Advanced)
      Any     → "Do you prefer competitive or casual?" (Competitive / Casual / Either)
  • Up to 5 category selections; at least 1 required to proceed
  • These inline answers feed directly into Step 5 match scoring

Step 4 — Set Availability (1 min)
  • Checkbox grid: days of week × morning/afternoon/evening blocks
  • "I'm flexible — show me everything" escape hatch if user doesn't want to fill this in
    (flexibility flag stored; all time slots treated as available for matching)

Step 5 — Your Groups Are Ready
  [This step runs the matching algorithm against all active groups in real time
   and presents personalised results — not a generic Discover page.]

  Headline: "We found [N] groups that match you"
  Sub-headline: "Based on your interests, location, and availability"

  Display up to 5 group cards ranked by match score. Each card shows:
    • Group name + category badge
    • Why it matched: chip row — e.g. "🎮 Matches Valorant"  "📍 4 miles away"
                                     "📅 Meets Saturdays"  "⚡ Intermediate level"
    • Next session date + time
    • Member count / capacity
    • "Join" or "Request to Join" button — one tap, no additional screen

  Actions a user can take on each card:
    • Join / Request to Join → immediately processes; card turns green with ✓
    • "Not for me" → dismisses that card; next best match slides in
    • "Save for later" → bookmarks to Dashboard without joining

  If fewer than 5 matches exist:
    • Show available matches (even 1 is fine)
    • Fill remaining slots with "Online groups near your interests" — online groups
      are global and always available regardless of location
    • If zero matches: show a warm empty state (see below) — never show a blank screen

  Geographic note: if the user's ZIP is outside Palm Beach County, local group
  cards are excluded from Step 5 results entirely (they cannot join them). The
  match pool is automatically scoped to online groups only for non-PBC users.
  The step headline adjusts: "We found [N] online groups that match you" with
  a sub-note: "Local in-person groups are currently available in Palm Beach County.
  Online groups are open to everyone."

  "None of these fit? Create your own group →" persistent link at bottom of step

Step 6 — Confirmation
  • If 1+ group was joined or requested: confetti micro-animation
    "You're in! [Group Name] meets next on [Date]. We'll remind you."
  • If groups were saved but not joined: "Saved! Check them out on your Dashboard."
  • If everything was skipped: "No worries — your matches are waiting on Discover."
  [In all cases, the user lands on their Dashboard, not a blank state]
```

**Zero-Match Empty State (Step 5 fallback)**

If the matching algorithm finds no groups at all for a new user (possible in early platform life), the screen shows:

```
┌──────────────────────────────────────────────────────────────────┐
│  🔍  No groups match your area yet                               │
│                                                                  │
│  RollCall is new in your area — but that's actually exciting.    │
│  You could be the first.                                         │
│                                                                  │
│  Here's what we'll do:                                           │
│  ✅ We'll notify you the moment a matching group is created      │
│  ✅ Your interests are saved — matches improve as groups grow    │
│                                                                  │
│  In the meantime:                                                │
│  [ Browse online groups → ]   [ Start a group yourself → ]      │
└──────────────────────────────────────────────────────────────────┘
```

The "notify me" promise is backed by F27 Saved Search Alerts — the system automatically creates a saved alert for each of the user's selected interest tags at onboarding, so they receive an email the moment a matching group is created. No manual alert setup required.

**Match Scoring Algorithm (Step 5)**

Groups are scored against the user's onboarding answers using weighted signals:

| Signal | Weight | Notes |
|---|---|---|
| Interest tag match | 40 | Exact category + subcategory match; partial (category only) scores 20 |
| Game / activity title match | 20 | Free-text game name from Step 3 matched against group name/tags; synonym map applied |
| Location proximity | 15 | Within 10 miles scores 15; 10–25 miles scores 8; online group scores 10 regardless of distance |
| Availability overlap | 15 | User's available blocks × group's session schedule; ≥ 1 overlap scores 15; no data = 8 (flexible flag) |
| Platform match | 5 | Gaming platform (PC/Xbox etc.) matches group's listed platforms |
| Experience level match | 5 | User's level meets or exceeds group minimum (F95); exact match scores 5; over-qualified scores 3 |

Minimum score to appear in Step 5 results: **35 points**. Groups below this threshold are not shown, even if they are the only groups available — the fallback empty state is shown instead. This prevents surfacing irrelevant groups just to fill slots.

Results are sorted descending by score. Ties broken by group health score (F20) then recency of last session.

**Database — Onboarding Extensions**

```sql
onboarding_progress
  user_id              UUID PRIMARY KEY REFERENCES users(id)
  step_completed       INTEGER DEFAULT 0   -- 0 = not started, 6 = fully complete
  completed_at         TIMESTAMP
  skipped              BOOLEAN DEFAULT false
  match_shown_count    INTEGER DEFAULT 0   -- how many group cards were shown at Step 5
  match_joined_count   INTEGER DEFAULT 0   -- how many groups joined at Step 5
  match_saved_count    INTEGER DEFAULT 0   -- how many groups saved at Step 5
  match_dismissed_count INTEGER DEFAULT 0 -- how many cards were "Not for me"
  zero_match           BOOLEAN DEFAULT false -- true if Step 5 showed empty state
```

`match_shown_count`, `match_joined_count`, `match_saved_count`, `match_dismissed_count`, and `zero_match` feed directly into the admin Onboarding Analytics panel so the platform owner can see match quality over time and identify when categories need more seeded groups.

**Empty State Design — Required for Every Key Page**

| Page | Empty State Message |
|------|---------------------|
| Discover (no results) | "No groups match yet — be the first to create one!" + CTA |
| Dashboard (no groups) | "You haven't joined any groups yet. Let's fix that →" |
| Notifications | "You're all caught up! Nothing new yet." |
| Group message board | "No posts yet — break the ice and say hello 👋" |
| Admin reports | "✅ No pending reports. The community is behaving." |

**Database**

```sql
onboarding_progress
  user_id         UUID PRIMARY KEY REFERENCES users(id)
  step_completed  INTEGER DEFAULT 0  -- 0 = not started, 6 = fully complete
  completed_at    TIMESTAMP
  skipped         BOOLEAN DEFAULT false
```

---

### F27 — Saved Searches & Group Alerts

**Priority: Should Have**

Discovery is passive — users must return and search manually. Saved search alerts flip this: the platform comes to the user when a matching group is created, turning casual browsers into active members and solving the cold-start problem for new groups seeking members.

**How It Works**

1. Any active discovery filter combination can be saved as a named alert (e.g., "D&D beginner groups in Austin")
2. User sets notification frequency: **Instant**, **Daily Digest**, or **Weekly Digest**
3. When a new group is created matching the criteria, the user receives an in-app notification and/or email
4. Alerts are managed from the dashboard under "My Alerts"

**Criteria Stored Per Alert**

- Category / subcategory
- Location type + city (if local)
- Skill level · Platform · Language
- Role/position needed (from F19)

**Limits:** Up to 5 saved alerts per user in MVP.

**Database**

```sql
saved_searches
  id                UUID PRIMARY KEY
  user_id           UUID REFERENCES users(id)
  name              VARCHAR NOT NULL
  criteria          JSONB NOT NULL
  notify_frequency  ENUM('instant','daily','weekly') DEFAULT 'daily'
  last_notified_at  TIMESTAMP
  created_at        TIMESTAMP NOT NULL
```

---

### F28 — Group Ownership Transfer

**Priority: Must Have (MVP)**

Without ownership transfer, a group becomes permanently leaderless if the owner disappears — unable to approve members, post sessions, or moderate. This silently kills active communities.

**Manual Transfer**

The owner can promote any member to Owner at any time from group settings. The original owner is automatically demoted to Co-Owner. Only one user holds Owner at a time.

**Automatic Transfer (Owner Inactivity)**

If the owner has not logged in for **30 consecutive days** and at least one Co-Owner exists:

1. The longest-tenured Co-Owner receives a notification: *"[Group]'s owner has been inactive 30 days. You are now the group owner."*
2. Ownership transfers automatically; the previous owner receives an email and can reclaim within 14 days via admin request

**No Co-Owner Edge Case**

Group is flagged "Owner Inactive." Any member can submit a "Claim Ownership" request, queued for admin review. Admin can manually assign a new owner.

**Database**

```sql
ownership_transfers
  id              UUID PRIMARY KEY
  group_id        UUID REFERENCES groups(id)
  previous_owner  UUID REFERENCES users(id)
  new_owner       UUID REFERENCES users(id)
  transfer_reason ENUM('manual','inactivity','admin')
  transferred_at  TIMESTAMP NOT NULL
```

---

### F29 — Calendar Export & Recurring Event Templates

**Priority: Must Have (MVP)**

Users manage their lives in Google Calendar, Apple Calendar, or Outlook — not in another app. Without export, session reminders compete with every platform notification. Export to standard formats removes that friction entirely.

**Calendar Export**

Every event has an **"Add to Calendar"** button generating a standard `.ics` file containing:
- Event title, date, time, duration, timezone
- Description (session notes from owner)
- Location: "Online" or neighborhood-level area (never exact address)
- A direct **Google Calendar link** is also provided for one-click add.

**Print / Save as PDF**

A **🖨 Print** button appears on both the per-group Calendar tab and the unified `/calendar` page. Clicking it switches the calendar to List view (if not already in it) and triggers `window.print()`. A dedicated `@media print` stylesheet renders a clean, ink-friendly layout — see **F94 Part 6** for the full print CSS specification.

**Recurring Event Templates**

Owners create a recurring session template once; individual events auto-generate:

| Type | Options |
|------|---------|
| Weekly | Every [day] at [time] |
| Biweekly | Every other [day] at [time] |
| Monthly | First/Second/Third/Fourth [day] of month |
| Custom | Every N weeks on [day] |

Each generated event is individually editable. Templates can be paused or ended at any time. See **F57** for skipping, rescheduling, or modifying individual occurrences without affecting the full template.

**Database**

```sql
event_recurrence
  id                 UUID PRIMARY KEY
  group_id           UUID REFERENCES groups(id)
  created_by         UUID REFERENCES users(id)
  title              VARCHAR
  description        TEXT
  start_time         TIME NOT NULL
  duration           INTEGER   -- minutes
  recurrence_type    ENUM('weekly','biweekly','monthly','custom')
  recurrence_day     VARCHAR   -- e.g. 'saturday'
  recurrence_interval INTEGER DEFAULT 1
  starts_on          DATE
  ends_on            DATE      -- null = indefinite
  is_active          BOOLEAN DEFAULT true
  created_at         TIMESTAMP
```

---

### F57 — Recurring Event Exception Handling

**Priority: Should Have**

F29 covers creating and pausing recurring templates but has no spec for the most common real-world scenario: "everything stays the same except *this* week." Deleting and recreating the template just to skip one session, or changing the whole template to move one date, breaks the pattern unnecessarily. Exceptions let owners handle one-off changes surgically.

**Three exception types**

| Type | What it does |
|------|-------------|
| Skip | This occurrence is cancelled; next one generates as normal |
| Reschedule | This occurrence moves to a new date/time; template is unaffected |
| Modify | This occurrence gets a different title, description, or duration; template is unaffected |

**Owner UI (from the event detail page of a recurring session)**

A "⋯ More options" menu on any recurring event exposes:
- "Skip this session" — with optional reason shown to members
- "Reschedule this session" — date/time picker, generates a one-off replacement event
- "Edit just this session" — opens the event editor pre-populated with current values; changes apply only to this occurrence

**Member Experience**

- A skipped session shows a `SKIPPED` badge on the group calendar rather than disappearing; the next session generates normally
- A rescheduled session shows the new date with a `RESCHEDULED` label and the original date struck through
- All members who RSVP'd for the original occurrence receive a notification for skips and reschedules; their RSVP resets to pending on reschedule so they must reconfirm

**Database**

The `event_exceptions` table was already defined under F51 (Session Cancellation). F57 extends its usage to cover modify-type exceptions:

```sql
-- event_exceptions (extended from F51):
-- exception_type now includes 'modified' in addition to 'skipped' and 'rescheduled'
ALTER TYPE event_exceptions_exception_type ADD VALUE 'modified';

-- For 'modified' exceptions, new_event_id points to a one-off event
-- with the modified fields, linked back to the recurrence via its recurrence_id
```

No additional tables are required — the `event_exceptions` table introduced in F51 handles all three exception types.

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/groups/:id/recurrence/:rid/exceptions` | Create an exception (skip, reschedule, or modify a single occurrence) |
| PUT | `/api/groups/:id/recurrence/:rid/exceptions/:eid` | Update an exception before it takes effect |
| DELETE | `/api/groups/:id/recurrence/:rid/exceptions/:eid` | Remove an exception (restore the original occurrence) |

---

### F30 — Post-Session Recap & Attendance Confirmation

**Priority: Must Have (MVP)**

There is currently no touchpoint after a session ends — a missed opportunity for reputation data, trust score accuracy, and community engagement.

**Post-Session Prompt**

2 hours after event end time, all "Going" / "Maybe" RSVPs receive a notification:
> *"How was [Group Name]'s session? 30 seconds to recap."*

**Prompt fields:**
- Did you attend? ✅ Yes / ❌ No / 🤷 Something came up
- Session rating: 1–5 stars (session experience, separate from peer review)
- Optional recap note (max 500 chars) — auto-pinned to group feed for 24h
- Optional photo attachment

**Data Uses**

- Confirmed attendance → feeds "Sessions Attended" trust signal (F24)
- Attendance rate → feeds group health metrics (F20)
- Confirmed attendees → only eligible to write peer reviews (F9)
- Session ratings → visible on group profile as "Average session rating: ⭐ 4.6"

**Database**

```sql
session_recaps
  id          UUID PRIMARY KEY
  event_id    UUID REFERENCES events(id)
  user_id     UUID REFERENCES users(id)
  attended    BOOLEAN
  rating      INTEGER CHECK(rating BETWEEN 1 AND 5)
  recap_note  TEXT
  created_at  TIMESTAMP NOT NULL
  UNIQUE(event_id, user_id)
```

---

### F31 — Email Invitation System

**Priority: Should Have**

There is no mechanism to invite someone outside the platform to a specific group — a significant gap for local groups that recruit at venues, subreddits, or Discord servers.

**Shareable Invite Link**

Each group has a unique invite URL (`rollcall.gg/invite/[token]`) that:
- Shows a public group preview card (no login required)
- Presents "Join RollCall to join this group" CTA for unregistered visitors
- Auto-queues the visitor to join the group after registration completes
- Expires after 30 days or 50 uses (owner can regenerate)

**Email Invite**

Owners can invite up to 10 people per day by email from the group page. Recipients get a branded email with group preview and one-click join link.

**QR Code**

Every local group generates a downloadable QR code pointing to its invite link. Downloadable as PNG or SVG — ideal for physical flyers at game stores, libraries, or sports venues.

**Invite Analytics (for owners)**

- Total invites sent · Link clicks · Registrations · Joins
- Top referral source (direct link / email / QR)

**Database**

```sql
group_invites
  id          UUID PRIMARY KEY
  group_id    UUID REFERENCES groups(id)
  created_by  UUID REFERENCES users(id)
  token       VARCHAR UNIQUE NOT NULL
  max_uses    INTEGER DEFAULT 50
  use_count   INTEGER DEFAULT 0
  expires_at  TIMESTAMP
  created_at  TIMESTAMP NOT NULL
```

---

### F32 — Legal & Compliance Pages

**Priority: Must Have (MVP — Required Before Any Public Launch)**

These are non-negotiable before real users touch the platform.

**Required Pages**

| Page | URL | Purpose |
|------|-----|---------|
| Terms of Service | `/terms` | User rights, platform rules, DMCA, dispute resolution |
| Privacy Policy | `/privacy` | Data collected, use, retention, third parties |
| Community Standards | `/community-standards` | Zero-tolerance policy (F14) |
| Cookie Policy | `/cookies` | What cookies are set and why |
| Safety Guidelines | `/safety` | In-person safety guidance (F25) |

**GDPR Compliance**

- Cookie consent banner on first visit (Accept All / Manage Preferences / Reject Non-Essential)
- "Download My Data" — ZIP export of all user data, delivered within 30 days
- "Delete My Account" — permanent deletion within 72 hours; admin logs anonymized but retained
- Explicit age confirmation at registration (see Age Requirement below)
- Privacy Policy linked at every data-collection touchpoint

**Minimum Age & COPPA Compliance**

RollCall is open to users aged **13 and older**. The platform complies with COPPA (Children's Online Privacy Protection Act) for users under 13:

- The Terms of Service must explicitly state the 13+ minimum age requirement
- The registration flow requires an age confirmation checkbox before account creation (see F1)
- The Community Standards modal includes the minimum age statement (see F14)
- Users under 13 are not permitted. If an account is found to belong to a user under 13 — whether reported by another user or identified by admin — the account is immediately suspended and all personal data deleted within 72 hours per COPPA
- Date of birth is optional on profiles; it is stored securely and never returned in any public-facing API response; visible to admins only for COPPA compliance review
- No personal data is knowingly collected from users under 13. If a user self-identifies as under 13 at any point, their account is suspended pending data deletion
- Users aged 13–17 (minors) are not shown adult-flagged content where applicable; their data is handled with additional care per applicable minor privacy laws

**Minimum Age & Compliance Summary**

| Regulation | Applicability | Mitigation |
|------------|--------------|------------|
| COPPA (under 13) | Applicable — platform must not knowingly collect data from under-13 users | Age confirmation checkbox; immediate suspension + data deletion if under-13 discovered |
| GDPR (EU users) | Applicable if EU users register | Consent banner, data export, deletion flow; minors may require parental consent per local law |
| CAN-SPAM | Applicable for all email | Unsubscribe link on all marketing/digest emails |
| CCPA (California) | Applicable if CA users register | Privacy Policy discloses data sale (none in MVP) |

**Cookie Categories**

| Category | Examples | Default |
|----------|---------|---------|
| Strictly Necessary | Auth session, CSRF token | Always on |
| Functional | Theme preference, language | On |
| Analytics | Page views, session duration | Off (opt-in) |
| Marketing | None in MVP | N/A |

---

### F33 — Group Resource Hub

**Priority: Should Have**

Groups have no place to store permanent resources — the recurring Zoom link, D&D house rules, a Spotify playlist, the rulebook PDF, or the Discord invite. Without this, every session triggers the same "where's the link?" messages in the feed.

**Resource Hub**

A dedicated **"Resources"** tab on every group page. Owners and Co-Mods can add, edit, and remove resources. All members can view and open them.

**Resource Fields**

- Title (required)
- URL or file upload (PDF / image, max 10 MB)
- Description (optional, max 200 chars)
- Category tag: Link / Document / Rules / Media / Other
- Pinned toggle (pinned items always display first)

**Suggested Prompts by Group Category**

| Category | Auto-Suggested Prompt |
|----------|-----------------------|
| Video Games | "Add your voice chat link (Discord/TeamSpeak)" |
| Tabletop | "Add your rulebook or campaign notes" |
| Sports | "Add your team roster or field map" |
| Book Club | "Add this month's reading list" |
| Social | "Add your recurring meeting link (Zoom/Meet)" |

**Database**

```sql
group_resources
  id           UUID PRIMARY KEY
  group_id     UUID REFERENCES groups(id)
  created_by   UUID REFERENCES users(id)
  title        VARCHAR NOT NULL
  url          VARCHAR
  file_url     VARCHAR
  description  TEXT
  category_tag VARCHAR
  is_pinned    BOOLEAN DEFAULT false
  created_at   TIMESTAMP NOT NULL
```

---

### F34 — In-Group Polls

**Priority: Should Have**

Without in-platform polling, scheduling and decision-making happen in side channels — killing engagement. A poll feature solves the most common group conversation: *"What night works for everyone?"*

**Poll Creation**

Any member can create a poll (owner can restrict to mods-only in settings).

**Poll Fields**

- Question (max 200 chars) · 2–8 options
- Allow multiple selections toggle
- Anonymous voting toggle
- Voting deadline (poll auto-closes)
- "Hide results until closed" option (prevents bandwagon effect)
- Notify all members on creation toggle

**Display**

Polls appear as a special card type in the group message board with a live horizontal bar chart. Owner/creator can close or delete at any time.

**Common Use Cases**

Scheduling night · Game/book selection · Event planning · Group governance decisions

**Database**

```sql
polls
  id               UUID PRIMARY KEY
  group_id         UUID REFERENCES groups(id)
  created_by       UUID REFERENCES users(id)
  question         VARCHAR NOT NULL
  allow_multi      BOOLEAN DEFAULT false
  anonymous        BOOLEAN DEFAULT false
  hide_until_close BOOLEAN DEFAULT false
  closes_at        TIMESTAMP
  is_closed        BOOLEAN DEFAULT false
  created_at       TIMESTAMP NOT NULL

poll_options
  id       UUID PRIMARY KEY
  poll_id  UUID REFERENCES polls(id)
  text     VARCHAR NOT NULL
  position INTEGER

poll_votes
  id         UUID PRIMARY KEY
  poll_id    UUID REFERENCES polls(id)
  option_id  UUID REFERENCES poll_options(id)
  user_id    UUID REFERENCES users(id)
  created_at TIMESTAMP NOT NULL
  UNIQUE(poll_id, option_id, user_id)
```

---

### F35 — Progressive Web App (PWA)

**Priority: Should Have**

A mobile-responsive web app is not the same as a mobile-friendly experience. A PWA gives users native-feeling app launch, push notifications, and offline access — all without App Store overhead.

**PWA Requirements**

| Feature | Implementation |
|---------|---------------|
| Installable | `manifest.json` with name, icons (192px + 512px), theme color, `display: standalone` |
| Offline support | Workbox service worker: caches app shell + last 5 visited group pages + dashboard |
| Push notifications | Web Push API — opt-in per notification type |
| Background sync | Queues outgoing messages/RSVPs offline; syncs on reconnect |
| Install prompt | Custom "Add to Home Screen" banner after 2nd visit with 60s+ engagement |

**Push Notification Types (opt-in per type)**

- New session posted in a joined group
- Join request approved/denied
- New group message (max 1 digest per group per hour)
- Saved search alert match (F27)
- Safe check-in reminder (F25)
- Ownership transfer notice (F28)

**Caching Strategy**

| Content Type | Strategy |
|---|---|
| App shell (HTML/CSS/JS) | Cache First |
| API responses | Network First (5s timeout, fallback to cache) |
| Images (avatars, banners) | Stale While Revalidate |

---

### F36 — Social Sharing & Public Group Preview Pages

**Priority: Must Have (MVP)**

All group pages currently require login. This blocks organic growth — members can't share their group on Reddit or Discord without forcing strangers to register first, killing conversion.

**Public Group Preview Page**

Every group has a public URL (`rollcall.gg/groups/[id]`) showing without login:
- Name, avatar, banner, category, skill level, type
- Full description · Member count/capacity · Next session
- Health status badge · Open roles · Accessibility tags
- **"Join Group on RollCall"** CTA → registration → auto-queues join

**Open Graph & Twitter Card Meta Tags**

```html
<meta property="og:title"       content="Sunday D&D Campaign — RollCall" />
<meta property="og:description" content="Beginner-friendly homebrew campaign. 3/6 spots · Sundays 2pm" />
<meta property="og:image"       content="[group banner or generated OG image]" />
<meta property="og:url"         content="https://rollcall.gg/groups/g2" />
<meta name="twitter:card"       content="summary_large_image" />
```

Links unfurl properly in Discord, iMessage, Twitter, Slack, and Reddit.

**Share Button**

Every group page includes a Share button that:
- Copies link to clipboard (with a "Copied!" toast)
- Triggers native OS share sheet on mobile (Web Share API)
- Offers QR code download for local groups

---

### F37 — Fuzzy Search & Smart Defaults

**Priority: Must Have (MVP)**

Basic keyword matching fails users who typo, use synonyms, or don't know exactly what to search for. First-time users need the platform to make smart assumptions rather than showing overwhelming or irrelevant results.

**Fuzzy Search (Typo Tolerance)**

Implemented via **Fuse.js** (client-side) with server-side fallback. Searches across group names, descriptions, tags, and subcategories:
- "Vaorant" → Valorant ✓
- "dungeon" → surfaces D&D groups ✓
- "book" → surfaces Book Club groups ✓

**Synonym Map (server-maintained)**

| Input Terms | Canonical Match |
|-------------|----------------|
| football, futbol | soccer |
| dnd, d and d, dungeons | D&D |
| fps, shooter | FPS |
| chill, relaxed | casual |
| ranked, serious | competitive |

**Smart Defaults on First Load (logged-in users)**

1. Timezone auto-detected → filters groups in compatible hours
2. Location → surfaces local groups in user's city
3. Profile interests → pre-filters category sidebar
4. Default sort: "Best Match" (profile relevance), not "Newest"

**Online Activity Keyword Search**

Online groups don't have a physical location to filter by, so keyword search is the primary discovery path. The search bar handles this explicitly:

- Searching any game title, activity name, or interest keyword against online groups returns matching results even without category filters pre-selected (e.g., searching "Elden Ring" surfaces the Elden Ring online gaming group without needing to navigate to Video Games → RPG first)
- Activity-specific terms are matched against group names, descriptions, subcategory tags, and open roles — giving online groups full keyword discoverability
- The synonym map extends to game titles and common abbreviations: *"LOL" → League of Legends*, *"WoW" → World of Warcraft*, *"MTGA" → Magic: The Gathering Arena*
- When "Online" is selected in the Local/Online filter, the search scope automatically prioritizes keyword and tag matching over location signals

**Search UX Enhancements**

- Autocomplete suggestions as user types (debounced 300ms)
- "Did you mean [X]?" when zero results found
- Recent searches in localStorage (last 5, shown on input focus)
- Live result count updates as filters change — no "Apply" button needed
- Matched search terms highlighted in results

---

### F38 — Notification Preferences Center

**Priority: Must Have (MVP)**

RollCall sends notifications through three channels — in-app (notification bell), email, and push (PWA). Without a preferences center, users receive every alert through every channel, leading to fatigue and disabled notifications entirely. Users need granular control over what they receive and how.

**Notification Types & Default Settings**

| Notification Type | In-App Default | Email Default | Push Default |
|-------------------|---------------|---------------|-------------|
| Join request received (owner) | ✅ On | ✅ On | ✅ On |
| Join request approved/denied (member) | ✅ On | ✅ On | ❌ Off |
| `@mention` in forum, message board, or chat | ✅ On | ✅ On | ✅ On |
| New group message | ✅ On | ❌ Off | ❌ Off |
| New direct message (DM) received (F67) | ✅ On | ❌ Off | ✅ On |
| New session/event posted | ✅ On | ✅ On | ✅ On |
| Session reminder (24 h before) | ✅ On | ✅ On | ✅ On |
| RSVP deadline reminder | ✅ On | ❌ Off | ❌ Off |
| New member joined your group | ✅ On | ❌ Off | ❌ Off |
| New member intro (icebreaker) | ✅ On | ❌ Off | ❌ Off |
| Saved search alert — new group match | ✅ On | ✅ On | ❌ Off |
| Session recap posted | ✅ On | ❌ Off | ❌ Off |
| Poll created in group | ✅ On | ❌ Off | ❌ Off |
| Poll closing soon | ✅ On | ❌ Off | ❌ Off |
| Safe check-in reminder | ✅ On | ✅ On | ✅ On |
| Group health nudge (owner) | ✅ On | ✅ On | ❌ Off |
| Ownership transfer received | ✅ On | ✅ On | ✅ On |
| Admin warning or suspension | ✅ On | ✅ On | ✅ On |
| Follow request received (F83) | ✅ On | ❌ Off | ❌ Off |
| New follower (approval-mode off) (F83) | ✅ On | ❌ Off | ❌ Off |
| Peer shoutout received (F93) | ✅ On | ❌ Off | ❌ Off |
| Guardian consent request (F84) | ✅ On | ✅ On | ✅ On |
| Activity gap matched — new group created (F94) | ✅ On | ✅ On | ❌ Off |
| Minor RSVP to in-person event — guardian alert (F84) | N/A (guardian email) | ✅ On | N/A |

**Preferences Page (`/settings/notifications`)**

- Toggle each notification type independently per channel
- Global "Pause all notifications" toggle with optional duration (1 day / 1 week / indefinitely) — acts as a do-not-disturb mode
- Email frequency override: choose "Instant", "Daily Digest", or "Weekly Digest" for all email notifications as a batch
- Push notifications section only shown if user has granted browser push permission; includes a re-enable prompt if permission was previously denied
- "Unsubscribe from all emails" one-click option at the bottom (required for CAN-SPAM / GDPR compliance)

**Email Digest Format**

When a user chooses "Daily Digest", all qualifying in-app notifications from the past 24 hours are bundled into a single email sent at a user-chosen time (default: 9:00 AM in their timezone). The digest shows:
- Groups with recent activity
- Upcoming sessions in the next 48 hours
- Any pending join requests (for owners)
- Saved search matches

**Do-Not-Disturb Hours**

Users can optionally set quiet hours (e.g., 10 PM – 8 AM in their timezone). Push and email notifications are held and delivered at the end of the quiet window. In-app notifications still accumulate and are shown when the user logs in.

**Notification Bell (In-App)**

- Red badge counter on the bell icon showing unread count (max display: 99+)
- Dropdown panel showing the last 20 notifications with timestamp and group context
- Mark individual or all notifications as read
- "View all" link to a full `/notifications` page with infinite scroll and read/unread filter
- Each notification is actionable (e.g., approve/deny join request inline without navigating away)

**Database**

```sql
notification_preferences
  user_id           UUID PRIMARY KEY REFERENCES users(id)
  preferences       JSONB NOT NULL  -- keyed by notification_type + channel
  pause_until       TIMESTAMP       -- null = not paused
  email_frequency   ENUM('instant','daily','weekly') DEFAULT 'instant'
  quiet_start       TIME            -- null = no quiet hours
  quiet_end         TIME
  updated_at        TIMESTAMP

notifications
  id                UUID PRIMARY KEY
  user_id           UUID REFERENCES users(id)
  type              VARCHAR NOT NULL  -- e.g. 'join_request_received'
  title             VARCHAR NOT NULL
  body              TEXT
  action_url        VARCHAR          -- deep link
  related_group_id  UUID REFERENCES groups(id)
  is_read           BOOLEAN DEFAULT false
  created_at        TIMESTAMP NOT NULL
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List notifications (paginated, filter: unread/all) |
| PUT | `/api/notifications/read` | Mark all notifications as read |
| PUT | `/api/notifications/:id/read` | Mark single notification as read |
| DELETE | `/api/notifications/:id` | Dismiss a notification |
| GET | `/api/notifications/preferences` | Get user's notification preferences |
| PUT | `/api/notifications/preferences` | Update preferences (full JSONB replace) |
| POST | `/api/notifications/pause` | Pause all notifications for specified duration |
| DELETE | `/api/notifications/pause` | Resume notifications immediately |

**User Stories (additions)**

| # | As a... | I want to... | So that... |
|---|---------|--------------|-----------|
| 62 | User | Turn off email notifications for group messages while keeping in-app | I'm not flooded with emails but still see everything when I log in |
| 63 | User | Set quiet hours from 11 PM to 8 AM | I'm not woken up by push alerts when I'm asleep |
| 64 | User | Pause all notifications for a week | I can take a break without missing permanent settings |
| 65 | Group Owner | Receive a daily digest email instead of instant alerts | I can review everything in one morning read without constant interruptions |

---

### F39 — Help Center & FAQ

**Priority: Should Have**

New users frequently abandon platforms when they hit a wall and can't find answers quickly. Without an in-app Help Center, users flood admin inboxes, post in the wrong group, or leave entirely. An admin-editable FAQ means answers can be updated without a code deploy.

**Help Center Page (`/help`)**

- Full-page searchable FAQ at `/help`, linked from the site footer, the Community Standards modal, the ban screen, and the onboarding flow
- Search bar with live filtering across all questions and answers (client-side, Fuse.js)
- Questions organized into collapsible category sections
- Each article expands inline — no separate page navigation needed
- "Was this helpful?" thumbs up/down per article (anonymous; used by admins to prioritize rewrites)
- "Contact Support" fallback link at the bottom of every category for questions not covered

**FAQ Categories & Seed Questions**

| Category | Example Questions |
|----------|------------------|
| Getting Started | How do I create an account? How does the onboarding quiz work? |
| My Profile | How is my Trust Score calculated? What are positions/roles on a profile? |
| Finding Groups | How do saved search alerts work? What do the group health badges mean? |
| Joining & Leaving | How do I request to join a private group? How do I leave a group? |
| Group Owners | How do I transfer ownership? What happens if my group goes dormant? |
| Safety & Reporting | How do I report harassment? What is the sensitive report flow? What happens after I report someone? |
| Moderation & Bans | What is the zero-tolerance policy? Can a ban be appealed? |
| Privacy & Data | How do I download my data? How do I delete my account? |
| Technical | Why isn't the push notification working? How do I install RollCall on my phone? |

**Admin FAQ Management (in Admin Panel — new "Help Center" tab)**

- Admins can create, edit, reorder, and unpublish FAQ articles without a code deploy
- Each article has: Category, Question, Answer (rich text), Published toggle, Order index
- Unpublished articles are hidden from users but visible in the admin editor
- "Thumbs down" feedback is surfaced in the admin view as a signal to rewrite low-rated articles
- Seed content (default FAQ) is loaded via a database migration at Phase 1

**Database**

```sql
faq_articles
  id           UUID PRIMARY KEY
  category     VARCHAR NOT NULL
  question     VARCHAR NOT NULL
  answer       TEXT NOT NULL
  order_index  INTEGER DEFAULT 0
  helpful_yes  INTEGER DEFAULT 0
  helpful_no   INTEGER DEFAULT 0
  is_published BOOLEAN DEFAULT true
  created_by   UUID REFERENCES users(id)
  updated_by   UUID REFERENCES users(id)
  created_at   TIMESTAMP
  updated_at   TIMESTAMP
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/help/articles` | List all published articles (filterable by category, searchable) |
| GET | `/api/help/articles/:id` | Get single FAQ article |
| POST | `/api/help/articles/:id/feedback` | Submit helpful yes/no (anonymous) |
| GET | `/api/admin/help/articles` | List all articles including unpublished (admin only) |
| POST | `/api/admin/help/articles` | Create FAQ article (admin only) |
| PUT | `/api/admin/help/articles/:id` | Update article content, order, or publish status (admin only) |
| DELETE | `/api/admin/help/articles/:id` | Delete FAQ article (admin only) |

---

### F40 — Achievement & Badge System

**Priority: Should Have**

Profiles that display only a name and bio give users no sense of history or credibility. A badge system creates visible social proof, rewards consistent participation, and gives users a reason to keep showing up — turning occasional users into regulars.

**Badge Display on Profile**

- A "Badges" shelf appears on every user profile, visible to all platform users
- Badges display as icon tiles with a tooltip showing the badge name and how it was earned
- Earned badges are ordered: most recently earned first
- Unearned badges are hidden from profile (no "locked" grey-out visible to others — only the user sees their progress in Settings → Badges)

**Badge Categories & Definitions**

| Category | Badge | Trigger |
|----------|-------|---------|
| Participation | First Session | Attend and confirm your first session |
| Participation | Regular | Attend 10 confirmed sessions |
| Participation | Veteran | Attend 50 confirmed sessions |
| Participation | On A Roll | 3-session attendance streak |
| Participation | Hot Streak | 7-session attendance streak |
| Participation | Unstoppable | 30-session attendance streak |
| Community | Welcome Aboard | Complete the full onboarding flow |
| Community | Group Founder | Create your first group |
| Community | Connector | Invite 5 or more members who join |
| Community | Welcome Wagon | Post icebreaker intros in 10 different groups |
| Community | Storyteller | Post 10 session recaps |
| Community | Helpful Player | Receive 5 "Helpful" reactions on replies posted in group forums or the Help Center FAQ |
| Community | Guide | Receive 20 "Helpful" reactions — recognized as a go-to resource for new members |
| Trust | Verified Member | Complete email verification |
| Trust | Top Rated | Maintain a 4.5+ star avg over 10 or more reviews |
| Trust | Trusted Organizer | Run a group with 5+ members for 3+ months |
| Milestone | Early Adopter | Register in the platform's first 30 days |
| Milestone | One Year Strong | Account active for 365 days |
| Milestone | 5 Groups | Be an active member of 5 groups simultaneously |

**Badge Earning Flow**

```
User action triggers a server-side event
        │
        ▼
Badge eligibility check runs against badge_definitions trigger rules
        │
   ┌────┴────┐
   │         │
Not met    Threshold met for first time
   │         │
   ▼         ▼
No action  badge inserted into user_badges
               │
               ▼
           In-app notification: "🏅 You earned the [Badge Name] badge!"
               │
               ▼
           Badge appears on profile shelf immediately
               │
               ▼
           Optional: "Share to group feed" prompt (one-time per badge)
```

**Sharing Badges**

- Users can share any earned badge to any of their group feeds via a "Share" button on the badge detail view
- The share creates a feed post: *"[User] just earned the 🏅 Trusted Organizer badge!"* with a link to their profile
- Sharing is entirely optional and can only be done once per badge per group
- The share post can be deleted by the user at any time

**Admin — Custom Badges**

Admins can create one-off custom badges (e.g., "Beta Tester", "Community Champion") and manually award them to specific users. Custom badges have no automated trigger — they are admin-assigned only.

**Database**

```sql
badge_definitions
  id                UUID PRIMARY KEY
  name              VARCHAR NOT NULL
  description       TEXT NOT NULL
  icon_url          VARCHAR NOT NULL
  category          ENUM('participation','community','trust','milestone','custom')
  trigger_event     VARCHAR    -- e.g. 'sessions_confirmed', 'groups_created'
  trigger_threshold INTEGER    -- e.g. 10 for 'sessions_confirmed' = 10
  is_active         BOOLEAN DEFAULT true
  is_custom         BOOLEAN DEFAULT false  -- admin-assigned only
  created_at        TIMESTAMP

user_badges
  id              UUID PRIMARY KEY
  user_id         UUID REFERENCES users(id)
  badge_id        UUID REFERENCES badge_definitions(id)
  earned_at       TIMESTAMP NOT NULL
  shared_to_feed  BOOLEAN DEFAULT false
  UNIQUE(user_id, badge_id)
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id/badges` | List all badges earned by a user |
| GET | `/api/badges` | List all active badge definitions |
| POST | `/api/badges/:id/share` | Share a badge to a group feed (`{ groupId }`) |
| GET | `/api/users/me/badge-progress` | Get current user's progress toward unearned badges |
| POST | `/api/admin/badges` | Create a custom badge definition (admin only) |
| PUT | `/api/admin/badges/:id` | Update badge definition (admin only) |
| POST | `/api/admin/badges/:id/award/:userId` | Manually award a custom badge to a user (admin only) |

---

### F41 — Silent Safety Alarm

**Priority: Must Have (MVP — for any platform supporting local in-person meetups)**

When meeting strangers in person, users need a fast, discreet way to signal distress without alerting anyone nearby. A standard "call for help" button is useless if it's obvious — it could escalate a dangerous situation. The silent alarm must be activatable in under 3 seconds, look innocuous on screen, and reach pre-configured trusted contacts automatically, even if the user cannot interact with their phone again after triggering it.

---

#### Trusted Contact Setup (Pre-Requisite)

Before the alarm is usable, users configure up to **3 trusted contacts** in **Settings → Safety**. Trusted contacts do not need to be RollCall users.

**Trusted Contact Fields:**
- Full name
- Mobile phone number (SMS notifications)
- Email address (backup notification)
- Relationship label (e.g., "Partner", "Roommate", "Best Friend") — optional, shown in alarm message

**Verification:** When a contact is added, RollCall sends them a one-time confirmation SMS:
> *"[User] has added you as a trusted safety contact on RollCall. If you agree to receive emergency alerts on their behalf, reply YES."*

A contact is only active after they reply YES. Unverified contacts are shown as "Pending" in Settings → Safety and cannot receive alarms until verified. Users are nudged to complete contact verification during onboarding (Step 4, after setting availability) and again before their first local event RSVP.

---

#### Alarm Activation Methods

The alarm can be triggered through **three complementary methods**. Users configure which methods are active in Settings → Safety. Every method is designed to be indistinguishable from normal phone use to a bystander.

---

**Method 1 — Logo Tap (Configurable)**

The RollCall logo in the top-left navbar corner acts as a hidden trigger. By default, **three rapid taps within 1.5 seconds** activates the alarm flow. Nothing on screen changes during the taps — no highlight, no animation.

*User-configurable options (Settings → Safety → Tap Trigger):*

| Setting | Options | Default |
|---|---|---|
| Number of taps required | 2 / 3 / 4 | 3 |
| Tap window | 1.0 s / 1.5 s / 2.0 s | 1.5 s |
| Enable/Disable | Toggle | On |

> Reducing to 2 taps makes activation faster in high-stress moments. Increasing to 4 reduces accidental triggers for users who interact with the logo area often.

---

**Method 2 — Shake Gesture (Configurable)**

Three sharp shakes within 2 seconds triggers the alarm flow. Implemented via the [DeviceMotionEvent Web API](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent) — requires one-time permission grant. Works even when RollCall is a background browser tab.

*User-configurable options (Settings → Safety → Shake Trigger):*

| Setting | Options | Default |
|---|---|---|
| Shake sensitivity | Low / Medium / High | Medium |
| Shakes required | 2 / 3 / 4 | 3 |
| Enable/Disable | Toggle | On |

> Users who carry their phone in a bag or tend to gesture when talking should set sensitivity to Low to avoid accidental triggers.

---

**Method 3 — Secret Code Word (Keyword Trigger)**

The most discreet option: the user sets a **personal secret phrase** in Settings → Safety. When this exact phrase is sent in any RollCall text field — group chat, DM, message board, or forum reply — the alarm fires silently and instantly, with no visible change to the conversation.

**How it works:**

```
User types secret phrase in any text field and sends it
        │
        ▼
Server-side middleware intercepts the message BEFORE broadcast:
  1. Strips the secret phrase from the message body
  2. If the message body is now empty → message is swallowed entirely (not posted)
  3. If the message had other content alongside the phrase →
       other content is posted normally; phrase is silently removed
  4. Alarm trigger is queued immediately (bypasses the 5-second countdown)
        │
        ▼
Alarm fires (same flow as Methods 1 & 2, but countdown is skipped)
```

> **Design principle:** The person monitoring the user sees the conversation continue normally. There is no "message failed to send" indicator, no delay, no visual difference. The phrase is designed to look innocent — the user might choose something like *"heading home"* or *"all good here"* that they would never naturally type in a chat.

*Code word rules enforced at setup:*
- Minimum 2 words; maximum 6 words
- Cannot be a single common word (e.g., "yes", "ok", "fine")
- Case-insensitive matching; leading/trailing whitespace ignored
- Cannot match any existing RollCall slash command
- The phrase is stored **hashed** (bcrypt) server-side — not stored in plaintext; comparison is done at check-in time

*User-configurable options (Settings → Safety → Code Word Trigger):*

| Setting | Options | Default |
|---|---|---|
| Enable/Disable | Toggle | Off (must be explicitly set up) |
| Secret phrase | User-defined text | None |
| Skip countdown | Always skip / Still show 5-second countdown | Always skip |
| Active in | All contexts / DMs only / Group chats only | All contexts |

> **Privacy note:** The secret phrase is never logged, never included in message edit history (F54), never visible to admins, and never returned in a data export. If a user requests account deletion (F75), the hashed phrase is purged immediately rather than in the 30-day grace period.

---

> All three methods intentionally avoid a visible red "emergency" button. The goal is zero visual signal to a bystander.

---

#### Alarm Activation Flow

```
User triggers alarm (triple-tap logo OR shake gesture)
        │
        ▼
5-second undo window appears:
  Discreet overlay — small text at bottom of screen only:
  "SOS sending in 5... 4... 3... [Cancel]"
  If user taps Cancel → alarm aborted, no record kept
        │
        ▼ (if not cancelled)
Server receives alarm trigger:
  1. Logs alarm event with timestamp, user ID, event ID (if active RSVP)
  2. Captures last known GPS coordinates (if location permission granted)
  3. Marks user status as 'alarm_active'
        │
        ▼
Simultaneous outbound alerts sent to ALL verified trusted contacts:

  SMS (SendGrid/Twilio):
  ─────────────────────────────────────────────────────
  🚨 SAFETY ALERT from RollCall
  [User display name] may need help.

  They are attending: [Event name] with [Group name]
  Last known location: [GPS coords as Google Maps link, or "unavailable"]
  Time: [timestamp in contact's timezone]

  Reply SAFE if you have reached them and they are OK.
  If you cannot reach them, please call 911.
  ─────────────────────────────────────────────────────

  Email (same content, HTML formatted with RollCall branding)
        │
        ▼
User's phone screen shows a single discreet status bar:
  "🛡 SOS sent — [Contact names] notified"
  (low-profile — not a full-screen alert)
        │
        ▼
Auto check-in timer starts (default: 30 minutes, user-configurable):
  If user does NOT tap "I'm Safe" within the timer window →
  Second escalation SMS sent to all contacts:
  "⚠️ Follow-up: [User] has not confirmed they are safe.
   Please try to reach them immediately or contact emergency services."
        │
        ▼
User taps "I'm Safe" on the app:
  Alarm cleared, contacts notified:
  "✅ Update: [User] has confirmed they are safe. No further action needed."
```

---

#### Discreet UI Principles

| Principle | Implementation |
|-----------|---------------|
| No visible panic button | Alarm triggered only via hidden gestures — no dedicated button on any screen |
| Undo window is subtle | Small bottom-of-screen text, not a modal or full-screen overlay |
| Status indicator is minimal | A small shield icon (🛡) in the navbar replaces the logo after alarm fires — no color change, no sound |
| "I'm Safe" is accessible | Tapping the shield icon opens the "I'm Safe / Still Need Help" toggle |
| Screen stays usable | The alarm does not lock or obscure the screen in any way after firing |

---

#### Alarm States

| State | Description | User Action |
|-------|-------------|-------------|
| `idle` | No alarm active | — |
| `countdown` | 5-second undo window | Tap Cancel to abort |
| `active` | Alarm sent, timer running | Tap shield → "I'm Safe" |
| `escalated` | Timer expired, second alert sent | Tap shield → "I'm Safe" |
| `resolved` | User confirmed safe | — |
| `cancelled` | Aborted during countdown | — |

---

#### Settings — Safety Page (`/settings/safety`)

The Settings → Safety page is organized into four sections:

---

**Section 1 — Trusted Contacts**
- Add/edit/remove up to 3 trusted contacts; verification status (Verified / Pending / Failed) shown per contact
- Per-contact notification preference: **SMS only**, **Email only**, or **Both**
- Per-contact escalation opt-in: choose whether each contact receives only the initial alert, the escalation follow-up, or both
- Custom alarm message template per contact — optionally override the default message body (e.g., add a home address, code instructions, or a personal note visible only to that contact)

---

**Section 2 — Trigger Methods**

| Trigger | Controls |
|---|---|
| Logo tap | Enable/disable; number of taps (2/3/4); tap window (1.0s/1.5s/2.0s) |
| Shake gesture | Enable/disable; sensitivity (Low/Medium/High); shakes required (2/3/4) |
| Secret code word | Enable/disable; set/change phrase; skip countdown toggle; active-in context (All/DMs/Groups) |

A live preview shows: *"With your current settings, you need [X taps in Y seconds] to activate the tap trigger."*

---

**Section 3 — Alarm Behaviour**
- **Countdown duration** — 0 s (skip entirely) / 3 s / 5 s / 10 s; default 5 s (code-word trigger always skips countdown regardless of this setting)
- **Auto-escalation timer** — how long after alarm fires before second alert is sent (10 / 30 / 60 minutes; default 30)
- **Location sharing** — grant/revoke GPS permission; shown as "Recommended for best protection"; permission can be set to Always / Only when alarm fires / Never
- **"I'm Safe" method** — choose whether tapping the shield icon clears the alarm immediately, or requires typing a numeric PIN the user sets here (prevents a coerced "I'm Safe" tap)

---

**Section 4 — History & Testing**
- **Test Alarm** — sends a clearly labeled test message to all verified contacts: *"This is a TEST alarm from RollCall — no action needed. [User] is testing their safety settings."* The test does NOT capture GPS or log a real alarm event.
- **Alarm History** — log of past alarm events (timestamp, method used, trigger type, resolved/escalated/cancelled) — visible only to the user; never returned in data exports or visible to admins

---

#### Local Event RSVP — Safety Nudge

When a user RSVPs "Going" to a local (in-person) event for the first time:

```
Safety reminder modal:
  "Heading out to meet in person?
   Make sure your trusted contacts are set up so someone
   always knows you're safe. →  Set up Safety Contacts"

  [Set Up Now]  [Remind Me Later]  [I'm All Set]
```

This modal appears only if the user has fewer than 1 verified trusted contact. It does not block the RSVP.

---

#### Platform & Legal Notes

- GPS coordinates are only captured at the moment the alarm fires — RollCall does not track user location continuously or at any other time
- Location data included in alarm messages is deleted from RollCall servers within 24 hours of the alarm being resolved or cancelled
- The alarm system does not contact emergency services (911) directly — this is intentional. Automatic 911 calls from an app without user confirmation carry significant legal liability and false-alarm risk. Trusted contacts are instructed to call 911 at their own discretion.
- A clear disclaimer is shown in Settings → Safety: *"RollCall's silent alarm notifies your trusted contacts. It does not contact emergency services directly. In an emergency, call 911."*

---

### F42 — Profile Avatar Upload with Content Moderation

**Priority: Must Have (MVP)**

Users should be able to express their identity through a real profile photo, not just auto-generated initials. However, uploaded images must be screened before going live to prevent inappropriate, explicit, or offensive content from appearing on profiles.

**Upload Rules**

- Accepted formats: JPEG, PNG, WebP (no GIFs to prevent animated content abuse)
- Maximum file size: 5 MB
- Minimum dimensions: 100×100 px; displayed as a square crop (centered)
- Users can reposition the crop before confirming the upload

**Moderation Pipeline**

All uploaded avatars pass through a two-stage pipeline before becoming visible to others:

```
User uploads image
        │
        ▼
Stage 1 — Automated screening (Cloudinary AI moderation):
  • Explicit/adult content detection
  • Violence/gore detection
  • Hate symbol detection
  Result: APPROVED → goes live immediately
          FLAGGED  → held for admin review (user sees current avatar in the meantime)
          REJECTED → blocked with explanation message
        │
        ▼ (APPROVED path)
Image live on profile within 2 seconds via Cloudinary CDN
        │
        ▼ (FLAGGED path)
Admin reviews in the Content Moderation queue within 24 hours:
  Approve → image goes live
  Reject  → image removed; user notified with reason
```

**User Feedback**

- On rejection: *"Your profile photo was not approved. Please upload an image that follows our community guidelines — no explicit content, hate symbols, or graphic imagery."*
- While held for review: the previous avatar (or initials fallback) remains visible; user sees a banner: *"Your new photo is under review. It will go live once approved."*

**Default Avatar**

If no photo is uploaded, RollCall generates a colored initials avatar using the user's display name initials and a consistent hue derived from their user ID — consistent across sessions, visually distinguishable, never inappropriate.

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/me/avatar` | Upload a new avatar (multipart/form-data) |
| DELETE | `/api/users/me/avatar` | Remove avatar (reverts to initials) |
| PUT | `/api/admin/avatars/:id/approve` | Admin approves a held avatar |
| PUT | `/api/admin/avatars/:id/reject` | Admin rejects a held avatar with reason |

---

### F43 — Personal Information Protection

**Priority: Must Have (MVP)**

Sharing personal contact details (phone numbers, physical addresses, email addresses) in public profiles or group messages creates real safety risks — especially for minors and users meeting strangers through local groups. RollCall discourages and, in some cases, actively blocks the sharing of personal contact information.

**Profile-Level Restrictions**

The following fields are **not available** on user profiles and cannot be added:

- Phone number (use the platform's built-in notification system)
- Physical home or work address (local groups use city-level location only)
- Personal email address (all platform communication goes through RollCall)

Bio and display name fields are screened by the content filter (F18) with an additional pattern for phone number formats and email addresses — a soft warning is shown if detected, and the user is asked to remove the information before saving.

**In-Message & Forum Warning**

When a user types a pattern that looks like a phone number, email address, or street address in a message or forum post, a **non-blocking inline warning** appears before they send:

```
⚠️ Heads up: Your message appears to contain personal contact information.
Sharing phone numbers, addresses, or personal emails in group chats can put you at risk.
Are you sure you want to send this?

  [Send Anyway]   [Edit Message]
```

The message is not blocked — users can still send it by choosing "Send Anyway." However, if a message containing personal info is subsequently reported, admins see it flagged as a potential safety concern.

**At-Risk User Nudge**

If a new user (account < 30 days old) sends a message that triggers the personal info warning and clicks "Send Anyway," a one-time in-app education card appears on their next login: *"Protect yourself online — learn why sharing personal contact info in group chats can be risky."* This links to the Help Center (F39) safety article.

---

### F44 — Inappropriate Profile Reporting

**Priority: Must Have (MVP)**

The existing report system (F14) focuses on messages and in-session behavior. There is no dedicated path for reporting inappropriate profile photos, offensive display names, or abusive bios. This is a separate concern from content moderation — a photo might pass automated screening yet still be offensive in context, and display names and bios are not currently screened beyond the content filter.

**What can be reported**

- Profile photo (inappropriate, offensive, or impersonating another person)
- Display name (slurs, offensive language, impersonation)
- Bio text (harassment, prohibited content, personal info oversharing)

**Report Flow**

A "Report Profile" option appears in the `⋯` overflow menu on every user profile card. Selecting it opens a targeted modal:

```
Report Profile
  What's the issue?
  ○ Inappropriate profile photo
  ○ Offensive or abusive display name
  ○ Inappropriate or harmful bio content
  ○ Impersonating another person
  ○ Other

  [Optional description field, max 200 chars]
  [Submit Report]
```

Profile reports route to the **Admin Panel → Reports queue** with type `profile_content`, separate from message-level reports. If the same profile receives 3 or more reports within 7 days, it is automatically surfaced at the top of the admin queue with a `🔴 Multiple reports` flag.

**Database**

```sql
-- Add to reports table:
-- violation_type enum gains: 'profile_photo', 'display_name', 'bio_content', 'impersonation'
-- reported_profile_field VARCHAR -- 'photo' | 'name' | 'bio' | null
```

---

### F45 — Google Maps Location Tagging for Local Meetups

**Priority: Should Have**

Local group events currently store only a city-level location, which is sufficient for privacy but useless for actually finding where to show up. Group owners need the ability to share a specific meeting location with confirmed members — while still protecting privacy from the general public.

**Two-tier location sharing**

| Audience | Location detail shown |
|----------|-----------------------|
| Public (non-members, Discover page) | City / neighborhood only (e.g., "Downtown Seattle") |
| Confirmed members (RSVP'd Going) | Full Google Maps pin — venue name + address |

**Owner Flow (Event Creation / Edit)**

An optional "Add Meeting Location" field on the event form opens a Google Maps search input (Google Places Autocomplete API). The owner searches for and selects a venue (coffee shop, library, park, game store). The selected place ID and coordinates are stored; the formatted address is only surfaced to confirmed members.

**Member View**

On the event detail page, confirmed members see:
- An embedded mini Google Map with the pin
- Venue name and formatted address
- "Open in Google Maps" button (deep-links to the native Maps app on mobile)
- "Get Directions" button

**Private Residence Warning**

If the owner selects a location that appears to be a residential address (detected via Google Places `types` array — `premise`, `street_address`), a warning is shown: *"This looks like a private address. Are you sure you want to share this? Consider meeting at a public location first — especially for a first session."* The owner can proceed but the "Meet in Public First" banner (F25) is automatically activated for the event.

**Database**

```sql
-- Add to events table:
ALTER TABLE events ADD COLUMN place_id       VARCHAR;   -- Google Places ID
ALTER TABLE events ADD COLUMN place_name     VARCHAR;   -- Venue display name
ALTER TABLE events ADD COLUMN place_address  VARCHAR;   -- Full formatted address (members only)
ALTER TABLE events ADD COLUMN lat            DECIMAL(9,6);
ALTER TABLE events ADD COLUMN lng            DECIMAL(9,6);
ALTER TABLE events ADD COLUMN location_public VARCHAR;  -- City/neighborhood (public)
```

**Tech Stack Addition:** Google Maps JavaScript API (Places Autocomplete + embedded map); Google Maps Static API for server-rendered map thumbnails in email notifications.

---

### F46 — Proximity Search & Map View

**Priority: Should Have**

Users looking for local groups have no way to search by distance. The current location filter only lets users filter by city name — which misses groups just across a city boundary and doesn't help users who think in terms of "how far am I willing to travel."

**Proximity Search**

A "Distance" filter is added to the Discover sidebar:

```
📍 Distance from me
  ○ 5 miles
  ○ 10 miles
  ● 25 miles  (default when location is enabled)
  ○ 50 miles
  ○ Any distance
```

**Location input — three methods (in priority order):**

1. **Registered ZIP code (default):** On first load, proximity search defaults to the user's registered ZIP code (stored at registration in F1) — no browser permission needed. Distance is calculated from the centroid of that ZIP.
2. **Search by any ZIP code:** A "📍 Search near a ZIP code" text field lets users type any valid 5-digit US ZIP to search from a different location (e.g., searching for groups near a vacation destination or a friend's area). The entered ZIP is geocoded server-side via Google Maps Geocoding API to a lat/lng centroid, then used for `ST_DWithin` queries. The entered ZIP is **never saved** — it is session-only.
3. **Browser Geolocation (most precise):** User can grant one-time GPS permission for the most accurate distance calculation; overrides ZIP-based origin for that session.

Search results are sorted by distance when the proximity filter is active.

**Map View Toggle**

A "Map View" toggle on the Discover page switches from card grid to an interactive Mapbox GL JS map showing pins for all local groups matching the current filters. Each pin is color-coded by category (gaming, sports, tabletop, etc.). Clicking a pin shows a group preview card. The map auto-zooms to contain all results. (Note: Mapbox GL JS is used for the Discover map; Google Maps is used separately for event location tagging and navigation in F45.)

**Distance on Group Cards**

When proximity search is active, group cards show a distance indicator: *"📍 3.2 miles away"*

**Privacy**

- User's precise location is never stored server-side — it is used only to compute the search query distance at request time
- Groups display only neighborhood-level location publicly; the map pin on the Discover map is offset by ±0.5 miles for groups meeting at private residences

**Database**

No new tables required. The `lat`/`lng` columns added to `events` in F45 power proximity queries. Groups table uses `city` + Mapbox/Google geocoding for city-level search; proximity search uses PostGIS `ST_DWithin` for radius queries.

**Tech Stack Addition:** PostGIS extension on PostgreSQL for geospatial radius queries.

---

### F47 — Optional 3-Factor Authentication (SMS)

**Priority: Should Have**

Multi-factor authentication adds significant account security but should never be mandatory — forcing users to provide a phone number creates friction, excludes users without mobile phones, and raises privacy concerns. 3FA (email + password + SMS code) is available as an **opt-in** security upgrade in account settings.

**Enrollment (Settings → Security)**

```
Enable Two-Step Verification (Optional)
  ─────────────────────────────────────────────
  Adding a second verification step makes it much harder for someone
  to access your account, even if they know your password.

  [Enable Two-Step Verification]
```

On clicking Enable:
1. User enters their phone number (E.164 format)
2. A 6-digit OTP is sent via SMS (Twilio); expires in 10 minutes
3. User enters the code to confirm enrollment
4. User is shown 8 backup recovery codes (see F58) — must acknowledge before proceeding
5. `mfa_enabled = true` set on the users table

**Login Flow (when MFA is enabled)**

1. Email + password submitted → verified
2. SMS OTP sent to registered phone
3. User enters OTP on a second screen
4. Access granted on success; account locked for 15 minutes after 5 failed OTP attempts

**Opting Out**

Users can disable MFA at any time from Settings → Security by re-verifying with their current OTP (or a backup code). No admin approval required.

**Backup Codes**

See F58 for the full backup code spec. MFA enrollment always generates backup codes — users are blocked from completing enrollment until they acknowledge the codes have been saved.

**Database**

```sql
-- Add to users table:
ALTER TABLE users ADD COLUMN mfa_enabled   BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN mfa_phone     VARCHAR;   -- E.164 format; separate from trusted contacts
ALTER TABLE users ADD COLUMN mfa_locked_until TIMESTAMP;
```

---

### F48 — Streamlined Group Join / Leave UX

**Priority: Must Have (MVP)**

Joining and leaving groups should feel effortless. Current friction points — buried menu items, ambiguous confirmation steps, no clear feedback — create unnecessary hesitation and make the platform feel clunky.

**Joining a Public Group**

- One-tap "Join Group" button on the group card (Discover) and group page
- On success: button changes to "✓ Joined" with a green ring; a welcome toast appears: *"You joined [Group]! Check out the message board to introduce yourself."*
- If the group has a waitlist (full capacity): button shows "Join Waitlist" — see F50

**Requesting to Join a Private Group**

- "Request to Join" button on group card and page
- Optional message field (max 200 chars): *"Tell the owner why you'd be a good fit (optional)"*
- On submit: button changes to "⏳ Request Pending"
- User receives a notification when approved or declined

**Leaving a Group**

- Accessible from the group page via "⋯ More" → "Leave Group"
- Confirmation modal: *"Leave [Group]? You'll lose access to the message board and future session notifications."*
- [Leave Group] [Cancel]
- If the leaving user is the **Owner**: prompted to transfer ownership first (see F28) — cannot leave without transferring or deleting the group
- On leave: removed from member list immediately; group disappears from their Dashboard

**PBC Local Activity Gate (Pilot)**

During the Palm Beach County pilot, joining or requesting to join any group with `location_type = 'local'` is restricted to users whose registered ZIP code falls within Palm Beach County. Online groups (`location_type = 'online'`) have no geographic restriction.

**Gate check order (server-side, runs before any join or request-to-join action):**

```
1. Is the group local (location_type = 'local')?
   └─ No → proceed normally (online group, no gate)
   └─ Yes →
      2. Is the user's zip_code in PILOT_ZIP_ALLOWLIST?
         └─ Yes → proceed normally (PBC resident, gate passes)
         └─ No  → return 403 { "error": "pilot_geo_restricted",
                                "message": "Local groups are currently only
                                 available to Palm Beach County residents." }
```

The `PILOT_ZIP_ALLOWLIST` is a server-side configuration constant (not stored in the database — no schema migration required to lift the restriction when the pilot ends). Removing the gate for a new region is a single config change.

**What a non-PBC user sees (UI)**

On a local group card (Discover) and the group detail page, the join button is replaced with a geo-gate notice. The notice varies depending on whether the user has already joined the waitlist for their area:

**Before joining the waitlist:**
```
┌──────────────────────────────────────────────────────────────────┐
│  📍  Local groups are currently Palm Beach County only           │
│                                                                  │
│  RollCall is piloting in Palm Beach County. In-person groups     │
│  aren't open to your area yet — but you can help change that.   │
│                                                                  │
│  Join the waitlist for [County name] and we'll notify you        │
│  the moment local groups open near you.                          │
│                                                                  │
│  [ Join the waitlist for [County] ]   [ Browse online groups → ] │
└──────────────────────────────────────────────────────────────────┘
```

**After joining the waitlist (same session or return visit):**
```
┌──────────────────────────────────────────────────────────────────┐
│  ✅  You're on the waitlist for [County]                         │
│                                                                  │
│  We'll email you as soon as local groups open in your area.      │
│  [N] others in [County] are waiting too.                         │
│                                                                  │
│  [ Browse online groups → ]                                      │
└──────────────────────────────────────────────────────────────────┘
```

The group's full detail page, public calendar, member count, and all public content remain visible. Only the join / request-to-join action is blocked.

**Waitlist join action**: Clicking "Join the waitlist for [County]" submits a single API call that creates a `geo_waitlist` record for the user and their detected county (derived from their registered ZIP code via a static ZIP→county lookup table — no geocoding API call required). A success toast confirms: *"You're on the list! We'll email you when [County] opens up."* The button state persists across sessions — users who rejoin the waitlist from a different local group page see the "already on waitlist" variant.

See **F97 — Geographic Expansion Waitlist & Admin Demand Alerts** for the full admin-side spec.

**Hybrid groups** — groups that meet both online and in-person (e.g., a gaming group with occasional local LAN events) follow the same rule: if `location_type = 'local'`, the gate applies. Group owners who run a genuinely mixed format should use `location_type = 'online'` and include location details in the group description; the gate is based on the group's declared type, not on whether a single event happens to be in-person.

**Gate does not affect:**
- Viewing group pages, calendars, or public content
- Following a group owner (F83)
- Saving a group to Dashboard
- Receiving Saved Search Alerts (F27) when a matching local group is created
- Creating a local group (any user may create a local group anywhere — the gate is on joining/attending, not on hosting)

**No Hidden Navigation**

All join/leave actions are reachable within 2 taps from either the Discover page or the group page. No settings menu or profile page required.

---

### F49 — Interest & Activity History Tracker

**Priority: Should Have**

Users have no way to look back at their activity — which groups they've been part of, which sessions they attended, how their interests have evolved. An activity history gives users a sense of progress, helps them discover new groups based on past behavior, and makes their profile feel like a genuine record of who they are as a community member.

**Activity Timeline (Profile → Activity tab)**

A chronological feed visible on the user's own profile (and optionally public to other members):

- Groups joined and left (with dates)
- Sessions confirmed attended
- Badges earned
- Groups created
- Session recaps posted
- Ratings received (aggregate, not individual entries)

Privacy toggle per section: each category can be set to "Visible to all" / "Members only" / "Only me."

**Current Interests Panel**

A "What I'm into right now" section on the user's profile, separate from the static interest tags set at onboarding. The panel auto-populates based on:
- Categories of groups the user is currently active in (weighted by recency)
- Activity tags of groups recently joined

Users can also manually pin up to 5 interest tags to this panel. It updates dynamically as group memberships change — so if a user leaves all their gaming groups and joins three book clubs, the panel reflects that shift.

**Activity Stats (visible on profile)**

| Stat | Display |
|------|---------|
| Total sessions attended | "42 sessions" |
| Groups joined (lifetime) | "8 groups" |
| Longest session streak | "12 weeks" |
| Member since | "Joined March 2025" |
| Badges earned | Count with link to badge shelf |

**Database**

```sql
-- Most activity history is derived from existing tables (memberships, events, rsvps, user_badges)
-- No new tables required for the timeline view — queries aggregate existing data

-- Add to users table for caching:
ALTER TABLE users ADD COLUMN longest_streak     INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN total_sessions      INTEGER DEFAULT 0;   -- already exists, confirm
ALTER TABLE users ADD COLUMN activity_privacy    JSONB DEFAULT '{"sessions":"members","groups":"all","badges":"all"}';
```

---

### F59 — Enhanced Accessibility Options for Special Needs

**Priority: Should Have**

F23 covers foundational accessibility (WCAG AA, keyboard navigation, dyslexia font). F59 expands this with dedicated settings for users with specific needs — motor, cognitive, sensory, and visual — making RollCall genuinely usable for a broader audience and allowing groups to self-identify as disability-friendly spaces.

**Accessibility Settings (`/settings/accessibility`)**

| Setting | Description |
|---------|-------------|
| Font size | Small / Default / Large / Extra Large (scales all text) |
| OpenDyslexic font | Toggle dyslexia-friendly typeface (already in F23) |
| High contrast mode | Increases contrast beyond WCAG AA to WCAG AAA levels |
| Reduced motion | Disables all animations and transitions (also respects OS `prefers-reduced-motion`) |
| Focus indicators | Always visible / Enhanced (larger, higher contrast focus rings) |
| Screen reader mode | Optimizes component structure for screen readers; hides decorative elements |
| Keyboard shortcuts | Enable/disable global keyboard shortcuts (useful for motor-impaired users using switch access) |
| Session timeout | Extend inactivity timeout from default 2 hours to 8 hours (for users who need more time) |
| Captions / transcripts | Opt-in to text descriptions on any embedded media (future-proofing for video content) |

**Group Accessibility Tags (extended from F23)**

Group owners can tag their groups and meeting venues with accessibility attributes:

| Tag | Meaning |
|-----|---------|
| Neurodivergent-Friendly | Patience, clear communication, no pressure to socialize |
| Deaf / Hard of Hearing | Text-first communication; captioning used |
| Mobility Accessible Venue | Wheelchair accessible meeting location |
| Low Sensory | Reduced noise/stimulation; suitable for sensory sensitivities |
| Beginner Safe | Explicitly welcoming to new players; no gatekeeping |
| Chronic Illness Friendly | Flexible attendance; understanding of cancellations |

Tags appear on group cards as small pill badges and are filterable in Discover.

**Profile Accessibility Preferences**

Users can add accessibility needs to their profile (optional, private by default):

- Screen reader user
- Motor impairment
- Cognitive/processing differences
- Hearing impairment
- Vision impairment

These preferences are used to: (1) automatically apply relevant UI settings, and (2) optionally display an accessibility needs badge on profile if the user chooses to make it visible, so group owners can ensure accommodations.

**Database**

```sql
-- Add to users table:
ALTER TABLE users ADD COLUMN accessibility_settings JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN accessibility_needs    TEXT[];   -- optional, user-controlled visibility
```

---

### F60 — Dynamic Interest-Based Group Discovery

**Priority: Should Have**

Static search and filter assumes users know exactly what they're looking for. New users especially don't — they have interests but don't know what groups exist or what to search for. Dynamic discovery surfaces groups proactively based on who the user is, not just what they typed.

**"For You" Feed (Dashboard & Discover)**

A personalized group recommendation feed generated from eight weighted signals:

| # | Signal | Weight | Source |
|---|--------|--------|--------|
| 1 | **Interest tags** | High | Groups whose category/tags overlap with the user's profile interests |
| 2 | **Activity history** | High | Categories of groups the user has been most active in recently (F49) |
| 3 | **Follow graph** | High | Groups that users the current user follows (F83) are currently members of — the more follows active in a group, the stronger the signal |
| 4 | **Browsing history** | Medium | Groups the user has visited, hovered on, or applied to without joining in the last 30 days — stored as `group_views` events in PostHog (F68) and cross-referenced server-side |
| 5 | **Saved players** | Medium | Groups that private saved players (F56) are members of |
| 6 | **Location** | Medium | Local groups within the user's proximity preference |
| 7 | **Schedule match** | Medium | Groups whose session times overlap with the user's availability |
| 8 | **Open roles** | Low | Groups actively seeking a role that matches the user's listed positions (F19) |

Each card in the "For You" feed shows a **match reason chip** drawn from the highest-weighted signal:
- *"Because you play D&D"*
- *"4 people you follow are in this group"*
- *"You browsed this group recently"*
- *"Matches your Tuesday evening availability"*
- *"3 of your saved players are in this group"*

If multiple strong signals fire on the same group, chips stack (up to 2 shown on the card; the rest visible on expand).

---

**"Following Activity" Section**

A dedicated **"Following"** section appears on the Discover page (below "For You") when the user follows at least one other user (F83). It shows:

- Groups that followed users **recently joined** (within the last 7 days)
- Groups that followed users **just posted in** or **are attending sessions in**
- Grouped by activity type: *"Groups your network is joining"* / *"Active sessions this week"*

This section only shows public or open groups — secret groups (F73) and private group membership are never surfaced here, even if a followed user is in them.

---

**"More Like This" on Group Pages**

At the bottom of every group page: a "Similar Groups" row showing 3–5 groups with overlapping category, skill level, and location type. Helps users who found a good group but need a backup or want more options.

---

**Interest Trending**

A "Trending near you" section on the Discover page shows activity categories that are growing in the user's city or timezone (based on new group creation and join velocity in the past 7 days). Helps users discover activities they hadn't considered.

---

**Algorithm Note**

The recommendation logic is rule-based (not ML) for the MVP — a weighted scoring function across the eight signals above, computed at query time with a **10-minute server-side cache per user** (increased from 5 minutes to accommodate the richer signal set). Groups the user is already a member of are excluded. Blocked users' group memberships are excluded from the follow-graph signal. The score is computed as:

```
score = Σ(signal_weight × signal_value) + recency_bonus(created_at)
```

`recency_bonus` decays exponentially: a group created in the last 7 days gets a +15% boost; older than 90 days gets −10%.

**Browsing history privacy:** Group view events used for recommendations are stored per-user in PostHog with a 30-day rolling window. Users who opt out of analytics (F68) also opt out of browsing-history-based recommendations; their "For You" feed falls back to signals 1, 3, 5, 6, 7, and 8 only.

---

### F61 — Group Forum with Tips & Points of Interest

**Priority: Should Have**

The current group message board (F5) is a flat activity feed — useful for announcements and session recaps but not for persistent knowledge sharing. Groups need a structured space where members can post tips, share points of interest, ask questions, and have threaded discussions that don't get buried in the daily activity stream.

**Forum Tab on Group Pages**

A dedicated "Forum" tab appears on every group page alongside the existing "Feed," "Events," "Members," and "Resources" tabs. The Forum is distinct from the Feed — posts here are intended to be persistent and searchable, not ephemeral.

**Post Types**

| Type | Icon | Description |
|------|------|-------------|
| Discussion | 💬 | Open question or topic for group discussion |
| Tip | 💡 | Advice, strategy, or best practice relevant to the group's activity |
| Point of Interest | 📍 | A location, venue, event, or resource worth knowing about |
| Announcement | 📢 | Owner/mod-only; pinned at top of forum |

**Threading**

Forum posts support **one level of threaded replies** — a reply can have its own reply thread but nesting stops there to keep discussions readable. Posts can be upvoted (👍) by members; upvote count is shown and used to sort by "Top" view.

**Helpful Reaction**

Forum replies have a dedicated "Helpful" reaction (distinct from 👍) — marking a reply as Helpful contributes toward the Helpful Player and Guide badges (F40). This is the primary trigger for those badges.

**Search Within Forum**

A search bar within the Forum tab lets members search posts and replies within the group. Full-text search against post titles and body.

**Content Moderation**

Forum posts and replies pass through the same content filter (F18) as messages. The external link warning (F62) applies here too.

**Database**

```sql
forum_posts
  id          UUID PRIMARY KEY
  group_id    UUID REFERENCES groups(id)
  author_id   UUID REFERENCES users(id)
  post_type   ENUM('discussion','tip','poi','announcement')
  title       VARCHAR NOT NULL
  body        TEXT NOT NULL
  is_pinned   BOOLEAN DEFAULT false
  upvotes     INTEGER DEFAULT 0
  created_at  TIMESTAMP NOT NULL
  updated_at  TIMESTAMP

forum_replies
  id          UUID PRIMARY KEY
  post_id     UUID REFERENCES forum_posts(id)
  parent_id   UUID REFERENCES forum_replies(id)  -- null = top-level reply
  author_id   UUID REFERENCES users(id)
  body        TEXT NOT NULL
  helpful_count INTEGER DEFAULT 0
  created_at  TIMESTAMP NOT NULL
  updated_at  TIMESTAMP

forum_helpful_votes
  id         UUID PRIMARY KEY
  reply_id   UUID REFERENCES forum_replies(id)
  user_id    UUID REFERENCES users(id)
  created_at TIMESTAMP NOT NULL
  UNIQUE(reply_id, user_id)
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groups/:id/forum` | List forum posts (sort: recent, top, pinned-first) |
| POST | `/api/groups/:id/forum` | Create a forum post |
| GET | `/api/forum/:postId` | Get a single post with replies |
| PUT | `/api/forum/:postId` | Edit post (author only, within 30 min) |
| DELETE | `/api/forum/:postId` | Delete post (author or mod) |
| POST | `/api/forum/:postId/replies` | Reply to a post or reply |
| POST | `/api/forum/:postId/upvote` | Upvote a post |
| POST | `/api/forum/replies/:replyId/helpful` | Mark a reply as Helpful (triggers badge check) |

---

### F62 — External Link Warning System

**Priority: Must Have (MVP)**

Links shared in group feeds, forum posts, and chat are a common vector for phishing, malware, and scams — especially for younger users and those less experienced online. Clicking a link should never silently navigate a user to an unknown external site.

**How it works**

All hyperlinks in user-generated content (messages, forum posts, resource links) that point to an external domain are intercepted client-side before navigation. Clicking an external link opens a modal instead of navigating immediately:

```
┌─────────────────────────────────────────────────┐
│  ⚠️  You're leaving RollCall                     │
│                                                   │
│  This link goes to an external website:           │
│  🔗 https://example.com/some-page                 │
│                                                   │
│  RollCall cannot verify the safety of external    │
│  sites. Only continue if you trust this link.    │
│                                                   │
│  [Continue to Site]        [Go Back]              │
│                                                   │
│  □ Don't warn me again for links to example.com  │
└─────────────────────────────────────────────────┘
```

**Trusted Domain Bypass**

Links to a curated list of trusted domains (YouTube, Twitch, Google Maps, Google Calendar, major gaming platforms like Steam, Battle.net, Xbox.com, etc.) skip the warning modal. The trusted domain list is admin-configurable via the Admin Panel.

**"Don't warn me again" per domain**

Users can dismiss the warning permanently for a specific domain. This preference is stored in localStorage and not synced to the server — it resets if the user clears their browser data.

**Implementation**

A React `<ExternalLink>` component replaces all standard anchor tags for user-generated content. It checks the href against the trusted domain list and, if not trusted, intercepts the click and renders the warning modal.

**Database**

```sql
trusted_external_domains
  id         UUID PRIMARY KEY
  domain     VARCHAR NOT NULL UNIQUE
  added_by   UUID REFERENCES users(id)
  added_at   TIMESTAMP NOT NULL
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/safety/trusted-domains` | Get list of trusted external domains |
| POST | `/api/admin/trusted-domains` | Add a trusted domain (admin only) |
| DELETE | `/api/admin/trusted-domains/:id` | Remove a trusted domain (admin only) |

---

### F63 — Mentions & Real-Time Activity Alerts

**Priority: Must Have (v2.2)**

F7 introduced in-app notifications and F38 gave users fine-grained delivery preferences. What both features lack is **@mention detection** (notifying a specific person when someone calls them out in a post, reply, or message) and **real-time push delivery** of all notification types through the existing Socket.io connection. F63 adds both, along with a unified Activity Feed that surfaces everything happening across a user's groups in one scannable view.

---

#### @Mention System

**How mentions work**

Any text field that supports rich input — group forum posts and replies (F61), group message board posts, and direct group chat (F10) — accepts the `@username` syntax. As the user types `@`, a live-search dropdown appears showing members of the current group (filtered as the user continues typing). Selecting a name inserts an `@mention` token that is stored separately from the plain text.

**Detection pipeline**

```
User types post/message
        │
        ▼
Client renders @mention suggestion dropdown
        │  (filtered to current group members)
        ▼
User selects a name → token stored as { type: 'mention', userId, displayName }
        │
        ▼
POST /api/[groups|messages|forum] — body includes mentions[] array
        │
        ▼
Server-side mention processor:
  • Deduplicates mention list
  • Filters out self-mentions (no notification sent to author)
  • Checks notification preferences for each mentioned user (F38)
  • Inserts rows into notifications table (type = 'mention')
  • Emits Socket.io event to each mentioned user's personal room
  • Queues email/push per individual delivery prefs
```

**Mention display**

- `@username` tokens render as a highlighted, tappable chip (e.g. `@Priya` in vivid accent color)
- Tapping the chip opens a mini-profile card (trust score, badges, mutual groups)
- Mentioned users see their name highlighted in the original post when they arrive via the notification deep link

**Notification content for mentions**

| Mention context | Notification title | Deep link |
|---|---|---|
| Forum post | `Marcus mentioned you in #tips` | `/groups/:id/forum/:postId` |
| Forum reply | `Marcus replied and mentioned you` | `/groups/:id/forum/:postId#reply-:replyId` |
| Group message board | `Marcus mentioned you in a post` | `/groups/:id/feed#post-:postId` |
| Group chat (F10) | `Marcus mentioned you in chat` | `/groups/:id/chat#msg-:msgId` |

**Notification preferences for mentions**

Mentions are added to the F38 Notification Preferences table as a new row:

| Notification Type | In-App Default | Email Default | Push Default |
|---|---|---|---|
| `@mention` in any context | ✅ On | ✅ On | ✅ On |

Mentions cannot be disabled per context (forum vs. chat); the toggle controls the entire mention notification type. Admins cannot turn off mention notifications for users — it is a user-controlled preference.

---

#### Real-Time Notification Delivery (Socket.io)

F38 specifies that notifications are stored in the database and displayed in the bell dropdown. Prior to F63, **delivery to the bell is only visible after a page refresh or a manual poll**. F63 upgrades delivery to be fully real-time using the existing Socket.io infrastructure introduced in Phase 6 (F10 chat).

**Personal notification room**

When a user authenticates, the Socket.io server joins them to a personal room keyed by their user ID:

```js
// server — on socket connect after JWT verification
socket.join(`user:${userId}:notifications`);
```

**Emission on server**

Whenever the server creates a notification row (for any type — mention, join request, session alert, etc.), it simultaneously emits to the user's personal room:

```js
io.to(`user:${targetUserId}:notifications`).emit('notification:new', {
  id, type, title, body, actionUrl, relatedGroupId, createdAt
});
```

**Client-side handler**

```js
// NotificationContext.jsx
socket.on('notification:new', (notification) => {
  setNotifications(prev => [notification, ...prev]);
  setUnreadCount(prev => prev + 1);
  // Show toast if user is actively on a different page
  if (!isOnNotificationsPage) showToast(notification);
});
```

**Toast alert**

A non-blocking toast appears in the top-right corner for every real-time notification received while the user is active. Toasts:
- Display the notification title and a one-line excerpt of the body
- Include a thumbnail of the source group's avatar (if available)
- Auto-dismiss after 5 seconds; user can click to navigate or click ✕ to dismiss early
- Stack vertically if multiple arrive in quick succession (max 3 visible at once; extras queue)
- Respect Do-Not-Disturb / quiet hours — no toasts during quiet window even if the user is online

**Connection resilience**

If the Socket.io connection drops (network interruption, server restart), the client:
1. Reconnects automatically with exponential back-off (1 s → 2 s → 4 s → … → 30 s max)
2. On reconnect, calls `GET /api/notifications?since=<lastSeenTimestamp>` to fetch any notifications missed during the disconnection window
3. Merges missed notifications into state without duplicates

---

#### Unified Activity Feed (`/activity`)

A dedicated `/activity` page gives users a single chronological stream of everything happening across **all their groups** — not just notifications addressed to them, but all group-level events they care about.

**Feed item types**

| Event | Feed entry example |
|---|---|
| New forum post | `Priya posted a Tip in Board Game Nights` |
| New session posted | `D&D Tuesdays added a session — Sat 7 PM` |
| Session cancelled | `D&D Tuesdays cancelled Saturday's session` |
| New member joined | `James joined Board Game Nights` |
| Poll created | `Volleyball Squad created a poll: Best practice night?` |
| Session recap posted | `Valorant 5-Stack posted a recap from last night` |
| Group milestone | `Board Game Nights just hit 20 members 🎉` |
| `@mention` directed at user | Highlighted with accent border — you were mentioned |

**Feed controls**

- **All Groups** (default) or filter by a specific group from a dropdown
- **Filter by type**: All / Sessions / Posts / Members / Polls / Mentions
- **Mark all read** clears the unread dot on the `/activity` nav link
- Feed items are paginated (20 per load), oldest-loaded indicator with "Load more" button
- Each item links directly to the source content

**Unread indicator**

A persistent dot on the Activity nav link shows when new feed items have arrived since the user last visited `/activity`. The dot is cleared when the user opens the page (optimistic clear on navigation).

---

#### Database Additions

```sql
-- Extend notifications table (already in F38) with mention-specific columns
ALTER TABLE notifications
  ADD COLUMN mention_context  VARCHAR,      -- 'forum_post' | 'forum_reply' | 'message_board' | 'chat'
  ADD COLUMN source_user_id   UUID REFERENCES users(id);  -- who triggered the notification

-- Activity feed events (separate from personal notifications — these are group-wide)
activity_feed_events
  id               UUID PRIMARY KEY
  group_id         UUID REFERENCES groups(id)
  event_type       VARCHAR NOT NULL   -- see Feed item types above
  actor_user_id    UUID REFERENCES users(id)
  target_user_id   UUID REFERENCES users(id)  -- null if not user-directed
  payload          JSONB              -- event-specific data (post title, session time, etc.)
  created_at       TIMESTAMP NOT NULL

-- Index for fast feed queries per user's groups
CREATE INDEX idx_activity_feed_group ON activity_feed_events(group_id, created_at DESC);
```

---

#### API Additions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activity` | Paginated activity feed for all the user's groups (auth required) |
| GET | `/api/activity?groupId=:id` | Activity feed scoped to one group |
| GET | `/api/activity?type=mention` | Mentions-only feed |
| GET | `/api/activity/unread-count` | Count of unseen feed items since last visit |
| PUT | `/api/activity/mark-seen` | Mark all feed items as seen (clears nav dot) |
| GET | `/api/notifications/mentions` | List only mention-type notifications (paginated) |

The `notifications` endpoints from F38 are unchanged; F63 extends them with new `type` values and the two new columns above.

---

#### Notification Bell Additions (extends F38)

The existing bell dropdown (F38) is extended with two new UI improvements:

1. **Tabs inside the dropdown**: "All" (default) and "Mentions" — tapping Mentions filters the dropdown to show only `@mention` type notifications at a glance without visiting the full page.

2. **Mention count badge**: In addition to the total unread badge, a secondary small badge in a vivid accent color shows the count of unread mentions specifically. This visual distinction signals higher-priority notifications to the user.

---

#### Tech Stack Note

Real-time notification delivery reuses the Socket.io server already introduced in Phase 6 (F10 real-time chat) — no new infrastructure is required. The personal notification room is a lightweight addition to the existing room architecture. The `activity_feed_events` table is populated by existing server-side event hooks (session created, member joined, etc.) rather than a separate service.

---

### F67 — Private 1:1 Direct Messaging

**Priority: Should Have**

Group chat (F10) and message boards (F5) are public to the group. Users who form a connection in a group currently have no way to have a private conversation without exchanging contact information outside the platform. Direct messaging keeps users on RollCall and deepens interpersonal connections — a key driver of long-term retention.

---

#### Access Rules

- A user can only initiate a DM to someone they share **at least one group** with. This prevents cold-contact spam.
- If the recipient has never interacted with the sender, the message lands in a **Message Request** inbox rather than the main inbox. The recipient can accept, decline, or block without the sender knowing which action was taken.
- Blocked users (F16) cannot send DMs.

#### Features

- **Inbox at `/messages`** — unread count badge on nav; threads sorted by most recent message; unlimited threads for all users.
- **Message requests tab** — separate from main inbox; badge shows pending count.
- **Typing indicator** — "Carlo is typing…" via Socket.io (same infrastructure as group chat).
- **Read receipts** — opt-in per thread via thread settings (available to all users).
- **Spoiler tags (F65)** — `||text||` syntax works in DMs.
- **Content filtering** — server-side `bad-words` filter applies; reported DMs go to admin queue with `dm` context flag.
- **Report DM** — three-dot menu on any message; creates a report with full thread context visible to admins only.
- **Mute thread** — suppresses notifications for that thread without archiving.
- **Media** — image attachments (Cloudinary pipeline, same as F42) allowed in DMs; max 10 MB per image.

---

#### Database

```sql
dm_threads
  id           UUID PRIMARY KEY
  created_at   TIMESTAMP NOT NULL

dm_participants
  thread_id    UUID REFERENCES dm_threads(id)
  user_id      UUID REFERENCES users(id)
  joined_at    TIMESTAMP
  is_request   BOOLEAN DEFAULT false   -- true until recipient accepts
  request_status ENUM('pending','accepted','declined') DEFAULT 'pending'
  PRIMARY KEY (thread_id, user_id)

dm_messages
  id           UUID PRIMARY KEY
  thread_id    UUID REFERENCES dm_threads(id)
  sender_id    UUID REFERENCES users(id)
  content      TEXT NOT NULL
  has_spoiler  BOOLEAN DEFAULT false
  edited_at    TIMESTAMP
  created_at   TIMESTAMP NOT NULL
```

---

#### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/messages` | List all DM threads for the current user |
| POST | `/api/messages` | Start a new DM thread `{ recipientId }` |
| GET | `/api/messages/:threadId` | Get messages in a thread (paginated) |
| POST | `/api/messages/:threadId` | Send a message |
| PUT | `/api/messages/:threadId/accept` | Accept a message request |
| DELETE | `/api/messages/:threadId/decline` | Decline / block a message request |
| PUT | `/api/messages/:threadId/mute` | Mute thread notifications |
| POST | `/api/messages/:threadId/report` | Report a thread to admin |

---

### F68 — Product Analytics & Instrumentation

**Priority: Must Have (Commercial Launch)**

Without measuring user behaviour, there is no way to improve conversion from free to paid, reduce churn, or identify which features drive retention. RollCall uses **PostHog** (self-hosted) for product analytics, keeping all user data on infrastructure the platform controls rather than sending it to third-party servers — consistent with the privacy commitments in F32.

---

#### Tracked Events (core set)

| Event | Key properties |
|---|---|
| `user_signed_up` | method (google/email), referral_code |
| `onboarding_completed` | steps_skipped, time_to_complete |
| `group_created` | category, privacy, used_template |
| `group_joined` | join_type (open/request/waitlist), discovery_source |
| `session_rsvp` | rsvp_status, hours_before_session |
| `session_attended` | confirmed_via (check_in/recap) |
| `message_sent` | context (board/chat/dm/forum) |
| `forum_post_created` | post_type, has_spoiler |
| `vote_cast` | value (up/down), target_type |
| `dm_sent` | is_first_message, thread_age_days |
| `referral_link_shared` | share_method (copy/sms/email/native) |
| `referral_converted` | referrer_user_id |
| `dm_thread_started` | is_first_ever_dm |
| `support_ticket_submitted` | category |

---

#### Key Funnels

1. **Activation:** Signup → Onboarding complete → First group joined → First session RSVP'd
2. **Retention:** Week 1 active → Week 2 active → Week 4 active (D7/D14/D30 cohorts)
3. **Referral:** Referral link shared → Friend clicked → Friend signed up → Friend joined first group
4. **Organiser:** Group created → First session posted → First member joined → First session completed

---

#### Feature Flags (A/B Testing)

PostHog feature flags are used to test UI and copy changes without code deploys. Examples: onboarding flow step order, forum sort default, referral CTA placement. Flag evaluation happens server-side for gating decisions and client-side for UI variants.

---

#### Admin Analytics Dashboard (Platform-Level)

A new **Platform Metrics** tab in the Admin Control Panel (F15) shows:

- Daily / Weekly / Monthly Active Users (DAU/WAU/MAU)
- New signups over time (chart)
- Group creation rate
- Session completion rate
- Free → paid conversion rate
- Monthly Recurring Revenue (MRR) and churn rate
- Top categories by group count and active sessions

All metrics are read from a read replica of the database or a pre-aggregated `analytics_snapshots` table updated nightly by a cron job. No user-identifiable data is displayed in the admin dashboard — all metrics are aggregated.

---

#### Privacy

PostHog is self-hosted on the same infrastructure as the RollCall backend. No user data leaves RollCall servers. Users who opt out of analytics (privacy setting in `/settings/privacy`) are excluded from all PostHog event capture. The opt-out preference is stored in `users.analytics_opt_out BOOLEAN DEFAULT false`.

---

### F69 — Email Marketing & Retention Campaigns

**Priority: Should Have**

Transactional emails (notifications, invites, alerts) are already specced in F38. This feature covers the lifecycle email sequences that bring users back when they go quiet and guide new users toward finding value quickly. All sequences are sent through the same SendGrid/Resend integration as transactional emails, managed by a server-side job queue (BullMQ).

---

#### Welcome Series (triggered by `user_signed_up`)

| Delay | Subject | Content |
|---|---|---|
| Immediate | Welcome to RollCall 👋 | Account confirmed; 3 steps to find your first group; link to Discover |
| Day 3 (if no group joined) | Found anything interesting? | Highlight 3 groups matching their interests; link to Discover with pre-filled filters |
| Day 7 (if no group joined) | Groups near you this week | Dynamic content: active local groups in their city; "Find Me a Group" quiz CTA |
| Day 14 (if still no group joined) | Not sure where to start? | Link to Help Center; invite them to create their own group instead |

Sequence stops as soon as the user joins a group. All emails include one-click unsubscribe.

---

#### Re-engagement Series (triggered after 14 days of inactivity)

| Delay | Subject | Content |
|---|---|---|
| Day 14 | Here's what's happening in your groups | Summary of recent activity across their groups — new posts, upcoming sessions, new members |
| Day 21 (still inactive) | You have an upcoming session | If they have an RSVP'd session in the next 7 days, surface it with a CTA to confirm attendance |
| Day 30 (still inactive) | We miss you — 3 groups you might like | Dynamic group recommendations based on their interest tags; one-click deep link |

---

#### Win-Back Campaign (triggered after 60 days of inactivity)

A single email highlighting what's new on the platform (new features, active groups in their area) with a "Come back and see what's new" CTA. Sent once; no further automated emails after this point to avoid spam classification.

---

#### Weekly Activity Digest (opt-in, default off)

Users can enable a weekly digest in `/settings/notifications` (extends F38). Sent every Monday at 9 AM in the user's timezone, it covers: upcoming sessions this week across all their groups, recent forum posts with high vote scores, new members who joined their groups, and any pending actions (join requests, polls closing). Digest emails respect the "Unsubscribe from all emails" preference.

---

#### Session Reminder Emails

Automatically sent 24 hours and 2 hours before any session the user has RSVP'd "Going." These are transactional (already in F38) but the 2-hour reminder is new here. Content includes: session name, time (in user's timezone), location (or online link from Resource Hub), and a one-tap "I can't make it" link that updates their RSVP without requiring login.

---

#### Compliance

All emails include: sender name (RollCall), reply-to address, physical mailing address (required by CAN-SPAM), and one-click unsubscribe that executes immediately without requiring login. Unsubscribe events sync back to `notification_preferences` within 60 seconds via BullMQ job. Bounces and spam complaints from SendGrid/Resend webhooks suppress the user's email address automatically.

---

#### Database

```sql
email_sequences
  id            UUID PRIMARY KEY
  user_id       UUID REFERENCES users(id)
  sequence_type VARCHAR NOT NULL   -- 'welcome' | 'reengagement' | 'winback'
  step          INTEGER DEFAULT 0
  started_at    TIMESTAMP
  completed_at  TIMESTAMP          -- null until sequence finishes or user converts
  stopped_at    TIMESTAMP          -- set when stop condition is met (e.g. group joined)

email_sends
  id            UUID PRIMARY KEY
  user_id       UUID REFERENCES users(id)
  sequence_id   UUID REFERENCES email_sequences(id)
  template_id   VARCHAR NOT NULL
  sent_at       TIMESTAMP
  opened_at     TIMESTAMP
  clicked_at    TIMESTAMP
  bounced       BOOLEAN DEFAULT false
  spam_reported BOOLEAN DEFAULT false
```

---

### F70 — Organizer Analytics Dashboard

**Priority: Should Have**

Group organizers need data to understand how their group is performing and to make informed decisions about their community. The dashboard is accessible at `/groups/:id/analytics` and is included in all Organizer plan subscriptions.

---

#### Metrics Available

**Audience**
- Total members — current count with 30-day change
- Member growth chart — new members per week over the past 12 weeks
- Member retention — % of members still active (logged in + visited group page) at 30 / 60 / 90 days after joining
- Geographic spread — city-level breakdown of member locations (no individual addresses)

**Sessions**
- Sessions held (last 90 days) vs. sessions cancelled
- Average RSVP rate — RSVPs "Going" ÷ group capacity
- Average attendance rate — confirmed attendees ÷ RSVPs "Going"
- Most popular session day and time (based on historical RSVPs)
- Session rating trend — average group/host rating (F55) over time

**Content**
- Top-voted forum posts (F64) — top 5 by net score in the last 30 days
- Most-used Helpful reactions (F61) — posts with most Helpful marks
- Poll participation rate — average % of members who vote in polls (F34)

**Discovery**
- Group page views (last 30 days) — how many unique visitors viewed the group's public page
- Join conversion rate — visitors who viewed the page and then joined
- Top discovery source — direct link / search / invite / QR code / recommendation feed

---

#### Export

A **Download CSV** button exports the full member list (display name, join date, sessions attended, last active date) and the full session attendance log. The export is scoped to data the organizer already has access to — no personal contact information is included.

---

#### Database

```sql
-- Group page view tracking (aggregated daily, not per-user for privacy)
group_page_views
  group_id     UUID REFERENCES groups(id)
  view_date    DATE NOT NULL
  view_count   INTEGER DEFAULT 0
  PRIMARY KEY (group_id, view_date)

-- Join source tracking (set on group membership creation)
ALTER TABLE group_memberships
  ADD COLUMN join_source VARCHAR;  -- 'search' | 'direct_link' | 'invite_email' | 'qr' | 'recommendation'
```

---

### F71 — SEO & Structured Data

**Priority: Should Have**

Organic search is the lowest-cost user acquisition channel. A player searching for "D&D group Austin Texas" or "beginner volleyball league Chicago" should be able to find a RollCall group in search results. This requires proper structured data, a dynamic sitemap, and well-formed meta tags on all public pages.

---

#### Structured Data (schema.org)

Every public group page emits a `SportsClub` or `Organization` JSON-LD block (depending on category). Every public session emits an `Event` JSON-LD block. These are rendered server-side (SSR or via React Helmet on the SPA) and are visible to Googlebot.

```json
// Example: session Event schema
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "D&D Tuesday Night — Session 42",
  "startDate": "2026-05-06T19:00:00-05:00",
  "endDate": "2026-05-06T22:00:00-05:00",
  "location": { "@type": "Place", "name": "The Wandering Dragon Game Shop", "address": "..." },
  "organizer": { "@type": "Organization", "name": "Austin Tuesday D&D" },
  "url": "https://rollcall.gg/groups/austin-tuesday-dnd/sessions/42"
}
```

---

#### Dynamic Meta Tags

Every public group page has a unique `<title>` (e.g. "Austin Tuesday D&D — RollCall"), a `<meta name="description">` pulled from the group description (truncated to 155 characters), and canonical `<link>` tags. Private and invite-only groups emit `<meta name="robots" content="noindex">`.

---

#### Sitemap

`/sitemap.xml` is auto-generated nightly and submitted to Google Search Console. It includes all public group pages and their most recent session pages. Private groups, secret groups (F73), and user profiles are excluded. The sitemap is chunked (max 50,000 URLs per file) with a sitemap index.

---

#### robots.txt

```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /settings
Disallow: /messages
Disallow: /admin
Disallow: /groups/*/members  # member lists not indexed
Sitemap: https://rollcall.gg/sitemap.xml
```

---

### F72 — Referral Program

**Priority: Should Have**

Word-of-mouth is the highest-quality acquisition channel for community platforms. A structured referral program turns existing users into a growth engine with a small, predictable incentive cost.

---

#### How It Works

Every user has a unique referral link: `https://rollcall.gg/join?ref=USERNAME`. Sharing this link is exposed via a **Share & Earn** card on the `/settings/referrals` page and as a copyable link in the group invite flow.

**Reward on conversion:** When a referred user signs up via the referral link *and* joins their first group within 14 days, the referrer earns the **"Community Builder"** badge (visible on their profile) and a **+5 trust score** bonus. After 5 successful referrals, the referrer earns the **"Early Supporter"** badge. The referred new user receives an **extended 14-day onboarding window** with guided tips instead of the standard 7-day window.

**Tracking:** The `ref` query parameter is stored in a first-party cookie (30-day expiry) at landing. It survives signup page navigation. Attribution is last-touch (most recent referral link wins if a user clicks multiple).

---

#### Fraud Prevention

- Same email address: one referral reward per unique verified email. Disposable email domains (known list) are blocked.
- Same device/IP: if a new account is created from the same IP as the referrer within 5 minutes, the referral is flagged for manual review rather than auto-awarded.
- Self-referral: a user cannot use their own referral link.

---

#### Referral Dashboard (`/settings/referrals`)

- Unique referral link with one-click copy and share buttons (SMS, email, native share API on mobile)
- Count of successful referrals (signed up) and converted referrals (joined a group)
- Rewards earned and applied history
- Pending referrals (signed up but not yet joined a group)

---

#### Database

```sql
referrals
  id                UUID PRIMARY KEY
  referrer_id       UUID REFERENCES users(id)
  referred_user_id  UUID REFERENCES users(id)
  signed_up_at      TIMESTAMP
  converted_at      TIMESTAMP        -- set when referred user joins first group
  reward_applied_at TIMESTAMP        -- set when referrer's reward is credited
  flagged_for_review BOOLEAN DEFAULT false
```

---

### F73 — Secret / Hidden Groups

**Priority: Should Have**

The current group privacy model (`public`, `private`, `invite_only`) is discoverable — all group types appear in search results and on member profiles. Some communities need to be completely invisible: closed support groups, private competitive teams, invitation-only social circles. Secret groups solve this without requiring a workaround.

---

#### Secret Group Rules

| Rule | Behaviour |
|---|---|
| Search visibility | Never appears in Discover, search results, or the "For You" feed (F60) |
| Public profile | No public preview page (returns 404 for non-members) |
| Member profile | Group does not appear on members' public profile pages |
| Join method | Invite link or direct owner invitation only — no join requests |
| Invite link | Time-limited (7-day expiry by default, configurable by owner up to 30 days); one-use or multi-use options |
| Activity feed (F63) | Secret group events do not appear in the platform-wide activity feed of non-members |
| Sitemap / SEO (F71) | Excluded from sitemap; `noindex` served even if URL is known |

---

#### Database

```sql
-- Add 'secret' to groups privacy enum
ALTER TABLE groups
  ALTER COLUMN privacy TYPE VARCHAR;  -- migration step
-- New constraint:
ALTER TABLE groups
  ADD CONSTRAINT groups_privacy_valid
  CHECK (privacy IN ('public', 'private', 'invite_only', 'secret'));

-- Secret group invite links
group_invite_links
  id          UUID PRIMARY KEY
  group_id    UUID REFERENCES groups(id)
  created_by  UUID REFERENCES users(id)
  token       VARCHAR UNIQUE NOT NULL
  max_uses    INTEGER               -- null = unlimited
  use_count   INTEGER DEFAULT 0
  expires_at  TIMESTAMP NOT NULL
  created_at  TIMESTAMP NOT NULL
```

---

### F74 — Group Creation Templates

**Priority: Should Have**

The group creation form is currently a blank slate. New organizers — especially those unfamiliar with what makes a good group listing — benefit from pre-filled defaults that model best practices for their activity type. Templates reduce time-to-first-session and result in better-quality group pages from day one.

---

#### Available Templates

| Template | Category | Default capacity | Schedule default | Pre-filled house rules |
|---|---|---|---|---|
| TTRPG Campaign | Tabletop | 5 | Weekly, 3–4 hours | Session zero required; consistent attendance expected; safety tools in use |
| Board Game Night | Tabletop | 8 | Bi-weekly, 2–3 hours | All skill levels welcome; host rotates; bring a game to share |
| Online Gaming Squad | Gaming | 5 | Weekly, 2 hours | Discord required; leave notice expected; no rage-quitting |
| Book Club | Social | 10 | Monthly, 90 min | Finish the book before attending; one book per meeting voted by poll |
| Sports Team | Sports | 12 | Weekly, 90 min | Bring your own equipment; RSVP 48 h in advance; fair play only |
| Creative Workshop | Arts & Crafts | 8 | Bi-weekly, 2 hours | Bring your own supplies; constructive feedback culture |
| Study Group | Learning | 6 | Weekly, 2 hours | Come prepared; no distractions; shared notes document provided |
| Social Hangout | Social | 20 | Monthly | Casual, no commitment, drop in / drop out welcome |

---

#### Template UX

Template selection is **Step 0** of the group creation flow — a visual card grid shown before the blank form. Users can select a template or click "Start from scratch." Selecting a template pre-populates relevant fields; the organizer can edit any of them before saving. The selected template name is stored in `groups.created_from_template VARCHAR` for analytics (to measure which templates produce the most active groups).

---

### F75 — Data Retention & Purge Policy

**Priority: Must Have (Legal Compliance)**

A defined data retention policy is required for GDPR Article 5(1)(e) (storage limitation), CCPA, and general legal defensibility. Without it, there is no consistent answer to "how long do you keep my data?" — which is a liability in any privacy audit or user dispute. This feature specifies exact retention periods, purge schedules, and the technical implementation of the right to erasure (GDPR Article 17).

---

#### Retention Schedule

| Data type | Retention period | Action at end of period |
|---|---|---|
| Active user account data | While account is active + 3 years after last login | Anonymised (name → "Deleted User", email hashed, avatar removed) |
| Account deleted by user | Up to 30 days | Hard-purged (personal fields nulled; posts marked "[deleted]") |
| Posts / messages (soft-deleted) | 30 days after soft-delete | Content field replaced with `[deleted]`; row retained for referential integrity |
| Banned user records | 2 years after ban date | Anonymised but ban record retained for ban-evasion detection |
| Under-13 COPPA deletion (F32) | Immediate | Hard-purged within 72 hours of detection |
| GPS / location data (F41 alarm) | 24 hours after alarm event | Auto-purged by scheduled job |
| Session logs / server logs | 90 days | Rolling delete |
| Analytics events (F68, PostHog) | 24 months | Aggregated; raw events purged |
| Database backups | 7 days rolling | Backup purged automatically by Railway/Render |
| Deletion-request data in backups | Within 90 days of deletion request | Backups containing deleted user data are superseded within the 7-day backup cycle; user is informed that backups may hold data for up to 90 days per GDPR Recital 65 |
| Audit log entries (F82) | 3 years | Append-only; never purged as part of user deletion; personal fields anonymised after account deletion |

---

#### Right to Erasure (GDPR Article 17) — Implementation

When a user submits an account deletion request (`DELETE /api/account`) or an admin triggers a deletion:

1. User is immediately logged out and cannot log back in.
2. A `deletion_requests` row is created with `scheduled_purge_at = now() + 30 days` (grace period allows reversal within 14 days via emailed link).
3. After 30 days, a BullMQ job runs the purge:
   - Personal fields on `users` table (name, email, avatar, bio, location, date_of_birth) → `NULL`
   - Email replaced with an irreversible SHA-256 hash (retained for ban-evasion comparison)
   - All `dm_messages` authored by the user → content replaced with `[deleted]`
   - All `forum_posts` and `forum_replies` → content replaced with `[deleted]` (posts are retained as structural nodes; replies may reference them)
   - Avatar deleted from Cloudinary
   - PostHog person record deleted via PostHog API
4. Confirmation email sent to the address on file before it is deleted.

---

#### Data Export (GDPR Article 20 — Portability)

The existing data export feature (F32) produces a ZIP file. F75 specifies its exact contents:

```
rollcall-export-{userId}.zip
├── profile.json          (display_name, bio, location, interests, join_date)
├── groups.json           (groups joined, role, join_date)
├── sessions.json         (sessions attended, RSVP history)
├── forum_posts.json      (all forum posts and replies authored)
├── messages.json         (all group board posts)
├── dm_threads.json       (all DM threads and messages sent)
├── ratings_given.json    (ratings the user submitted)
├── ratings_received.json (ratings received; anonymous entries show as "Anonymous")
├── badges.json           (badges earned and dates)
└── referrals.json        (referral links shared, successful conversions, badges earned)
```

The export is generated asynchronously, stored temporarily for 7 days, and the download link is emailed to the user. After 7 days the ZIP is purged from storage.

---

```sql
deletion_requests
  id                UUID PRIMARY KEY
  user_id           UUID REFERENCES users(id)
  requested_at      TIMESTAMP NOT NULL
  scheduled_purge_at TIMESTAMP NOT NULL
  reversal_token    VARCHAR UNIQUE     -- emailed to user; used to cancel within grace period
  reversed_at       TIMESTAMP
  purged_at         TIMESTAMP
  requested_by      ENUM('user','admin') DEFAULT 'user'
```

---

### F76 — Public Status Page & Incident Communication

**Priority: Should Have**

When RollCall experiences an outage, degraded performance, or planned maintenance, users and group organizers need a transparent, always-accessible way to check what is happening. Without this, users incorrectly assume bugs are on their side, group sessions are disrupted without warning, and trust erodes. A public status page is especially important for a platform built around scheduled in-person meetups.

---

#### Status Page

A lightweight public page at `/status` (or hosted at `status.rollcall.gg` via Statuspage.io or Instatus free tier) displays:

| Component | Tracked |
|---|---|
| Web application (Vercel) | ✅ |
| API server (Railway) | ✅ |
| Database (PostgreSQL) | ✅ |
| Real-time chat (Socket.io) | ✅ |
| File uploads (Cloudinary) | ✅ |
| Email delivery (SendGrid/Resend) | ✅ |
| SMS/Safety alarms (Twilio) | ✅ |

Each component shows one of four states: **Operational**, **Degraded Performance**, **Partial Outage**, **Major Outage**.

---

#### Incident Communication

- Incidents are created manually by admins (or auto-triggered by Uptime Robot alert → webhook).
- Each incident has a title, impact level, affected components, and timestamped update thread.
- Users can **subscribe** to status updates via email or RSS — no RollCall account required.
- Planned maintenance windows are posted at least **24 hours in advance** with start/end times and affected components.

---

#### In-App Banner

When an active incident is detected via a lightweight `/api/system/status` health endpoint, the client shows a dismissible banner at the top of every page:

```
⚠️  RollCall is experiencing degraded performance with group chat. We're working on it. [View Status →]
```

The banner is suppressed once the user dismisses it for the active incident ID. A new incident resets the dismissal.

---

#### API Endpoint

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/system/status` | Returns `{ status: 'operational' \| 'degraded' \| 'incident', message, incidentUrl }` — polled by the client every 60 seconds |

---

### F77 — Support Ticket System

**Priority: Must Have**

The Help Center (F39) provides self-service FAQs but offers no structured escalation path. Users facing account-recovery edge cases (F58), GDPR deletion disputes (F75), COPPA reports, or complex moderation appeals (F52) have no formal channel to reach the platform team. A lightweight ticket system closes this gap without requiring expensive third-party tooling.

---

#### Ticket Submission

- Accessible at `/help/contact` with a **pre-categorised form**:

| Category | Routed To |
|---|---|
| Account access / recovery | Standard admin queue |
| Report a safety concern | Sensitive queue (elevated priority) |
| Data request / deletion | Compliance queue |
| Bug report | Engineering queue |
| Group dispute / appeal | Moderation queue |
| General question | Standard admin queue |

- Required fields: email address (pre-filled if logged in), subject, description (min 30 chars), category.
- Optional: screenshot attachment (Cloudinary pipeline, 5 MB max).
- On submission: a ticket reference number is emailed to the user with an expected response SLA.

---

#### Admin Ticket Queue

A **Support** tab in the Admin Control Panel (F15) shows:

- Open tickets sorted by priority (Safety → Compliance → Standard).
- Ticket detail view: full message thread, user account info, associated report IDs.
- Status transitions: Open → In Progress → Resolved / Closed.
- Internal notes visible only to admins (not shown to the user).
- **Reply by email**: admin response is sent to the user's email and appended to the ticket thread.

---

#### SLA Targets

| Priority | Target First Response |
|---|---|
| Safety | 4 hours |
| Compliance (data requests) | 48 hours |
| Standard | 5 business days |

---

#### Database

```sql
support_tickets
  id               UUID PRIMARY KEY
  reference        VARCHAR UNIQUE       -- e.g., "RC-2026-0042"
  user_id          UUID REFERENCES users(id) ON DELETE SET NULL
  email            VARCHAR NOT NULL     -- capture in case account is deleted
  category         VARCHAR NOT NULL
  subject          VARCHAR NOT NULL
  status           ENUM('open','in_progress','resolved','closed') DEFAULT 'open'
  priority         ENUM('safety','compliance','standard') DEFAULT 'standard'
  created_at       TIMESTAMP NOT NULL
  updated_at       TIMESTAMP NOT NULL

support_ticket_messages
  id               UUID PRIMARY KEY
  ticket_id        UUID REFERENCES support_tickets(id)
  author           ENUM('user','admin')
  body             TEXT NOT NULL
  is_internal_note BOOLEAN DEFAULT false
  created_at       TIMESTAMP NOT NULL
```

---

#### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/support/tickets` | Submit a new support ticket |
| GET | `/api/support/tickets/:ref` | Get ticket status + messages (user must provide email match) |
| GET | `/api/admin/support` | List all tickets (admin only) |
| GET | `/api/admin/support/:id` | Get full ticket detail (admin only) |
| POST | `/api/admin/support/:id/reply` | Send reply to user + append to thread (admin only) |
| PUT | `/api/admin/support/:id/status` | Update ticket status (admin only) |

---

### F78 — Cross-Account Abuse Tracking (F53 Extension)

**Priority: Must Have**

F53 covers velocity checks and single-session bot detection. However, a determined bad actor can bypass these controls by creating multiple accounts across different sessions or devices. Given that RollCall hosts in-person group meetups, allowing a bad actor to create fake groups or evade bans poses a real safety risk. This feature extends F53 with persistent cross-account linking and escalation.

---

#### Account Linking Signals

The system links accounts to the same actor when two or more of the following match a known-banned or flagged account:

| Signal | Matching Logic |
|---|---|
| IP address | Exact match within 7 days of ban |
| FingerprintJS visitor ID | Exact match at any time |
| Email domain pattern | Same domain as a previously banned disposable email |
| Username pattern | Edit distance ≤ 2 from a banned username |
| Device user-agent hash | Same hashed UA + screen resolution combination |

When ≥ 2 signals match a banned account, the new registration is **auto-flagged** (not auto-banned) and placed in an admin review queue with the matched signals listed.

---

#### Escalation Flow

1. **Flag** — account created, features available but restricted (cannot create groups, cannot message strangers).
2. **Admin Review** — admin sees flagged account with match reason; can: clear the flag (legitimate new user), issue a warning, or ban immediately.
3. **Auto-Ban** — if a flagged account matches ≥ 3 signals and the linked account was banned for a safety or sexual-abuse violation, auto-ban is applied without manual review.

---

#### Database Extension (extends F53)

```sql
-- Extend banned_users / users tables
ALTER TABLE users ADD COLUMN abuse_flag_score INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN abuse_flagged_at TIMESTAMP;
ALTER TABLE users ADD COLUMN abuse_flag_reason VARCHAR;

account_link_matches
  id               UUID PRIMARY KEY
  new_user_id      UUID REFERENCES users(id)
  matched_user_id  UUID REFERENCES users(id)
  signals          JSONB NOT NULL       -- array of matched signal types + values
  reviewed_by      UUID REFERENCES users(id)
  reviewed_at      TIMESTAMP
  outcome          ENUM('cleared','warned','banned')
  created_at       TIMESTAMP NOT NULL
```

---

### F79 — Backup Verification & Disaster Recovery Runbook

**Priority: Should Have**

The Deployment & DevOps section specifies daily automated backups via Railway with a 7-day retention window. However, an unverified backup is not a backup — it's a hope. This feature defines the verification schedule, a documented restoration procedure, and a secondary off-site backup for critical data.

---

#### Verification Schedule

| Check | Frequency | Method |
|---|---|---|
| Backup created successfully | Daily | Railway webhook → Slack/email alert if backup job fails |
| Backup file integrity | Weekly | Automated restore into a staging PostgreSQL instance; run `SELECT COUNT(*)` on key tables |
| Full restoration drill | Monthly | Full point-in-time restore to staging; verify app boots and sample queries return expected data |
| Cross-region copy | Daily | pg_dump piped to an S3-compatible bucket (e.g., Cloudflare R2) as a secondary copy |

---

#### Disaster Recovery Targets

| Metric | Target |
|---|---|
| Recovery Point Objective (RPO) | ≤ 24 hours (daily backup cadence) |
| Recovery Time Objective (RTO) | ≤ 4 hours (restore + DNS failover) |

---

#### Runbook (Summary)

1. **Detect** — Uptime Robot alert or admin observes database unavailability.
2. **Assess** — Determine whether it is a connectivity issue (restart Railway service) or data loss event (proceed to restore).
3. **Isolate** — Put app in maintenance mode (502 page via Vercel edge config) to prevent writes during restore.
4. **Restore** — Select most recent verified backup; restore to Railway PostgreSQL instance; confirm row counts match last known state.
5. **Verify** — Run smoke test suite against restored database (registration, group join, message post).
6. **Lift maintenance** — Remove 502 page; monitor for 30 minutes post-restore.
7. **Post-mortem** — File incident report within 24 hours; update runbook if gaps found.

The runbook is stored in the project repository at `docs/disaster-recovery.md` and linked from the Admin Control Panel.

---

### F80 — DoS Protection & Third-Party Circuit Breakers

**Priority: Should Have**

The existing rate limiting (F1 / Non-Functional Requirements) covers per-IP request throttling on standard routes. A free, public-facing platform is a target for distributed denial-of-service attacks and resource-exhaustion attacks targeting expensive endpoints. Additionally, RollCall depends on multiple third-party services (Cloudinary, SendGrid, Twilio, Google Maps, PostHog); a single failed service should not cascade into a full platform outage.

---

#### Enhanced Rate Limiting

| Endpoint Group | Existing Limit | Additional Protection |
|---|---|---|
| Auth routes | 20 req/min/IP | Progressive backoff: 5-minute cooldown after 5 consecutive failures |
| File uploads | — | 10 uploads/hour/user; 50 MB/hour aggregate per IP |
| Data export (F75) | — | 1 export/24 hours/user; generation queued via BullMQ (no synchronous blocking) |
| Group search with PostGIS | — | 30 requests/min/IP; results cached for 60 seconds in Redis |
| Email sending (F69) | — | 100 emails/hour/user type across all queues; SendGrid rate limits respected |
| Socket.io connections | — | Max 3 concurrent connections per authenticated user; 10 per IP |

---

#### Third-Party Circuit Breakers

Implemented using a lightweight circuit-breaker pattern (e.g., `opossum` npm library):

| Service | Failure Threshold | Fallback Behaviour |
|---|---|---|
| Cloudinary (image upload) | 3 failures in 30 s | Queue upload for retry; show "Image upload temporarily unavailable" |
| SendGrid / Resend (email) | 5 failures in 60 s | Queue email in `email_sends` table; retry on next BullMQ run |
| Twilio (SMS) | 3 failures in 30 s | Log alarm event; notify admin via in-app alert; suppress SMS silently |
| Google Maps API | 3 failures in 30 s | Hide map components; fall back to text-only location display |
| PostHog analytics | 5 failures in 60 s | Silently drop events; never block user-facing requests |

---

#### DDoS Layer

- Vercel provides automatic DDoS protection at the CDN edge for the frontend.
- The API server on Railway is protected by Railway's ingress; additionally, all API routes run behind Cloudflare (free tier) as a reverse proxy — providing bot mitigation, IP reputation checks, and volumetric attack absorption.
- Cloudflare's free-tier "Bot Fight Mode" is enabled.

---

### F81 — Fraud Scoring & Graduated Account Lockout

**Priority: Should Have**

F53 detects bots and F47 locks out after 5 failed OTPs. However, there is no unified fraud scoring model or graduated lockout policy for suspicious authentication patterns across the platform. Without this, brute-force attacks on non-MFA accounts, credential stuffing attempts, and token-theft patterns go undetected.

---

#### Fraud Score System

Each user account accrues a real-time **fraud score** (0–100) based on signals:

| Signal | Score Added | Decays After |
|---|---|---|
| Failed login attempt | +5 | 1 hour |
| Login from new device/location | +3 | 24 hours |
| Password reset requested | +10 | 24 hours |
| Email change requested | +15 | 48 hours |
| Multiple accounts from same IP | +20 | 7 days |
| FingerprintJS matches flagged account | +30 | Never (manual clear only) |
| Report received on account | +10 | 7 days |
| Velocity: 5+ group joins in 1 hour | +15 | 24 hours |

---

#### Graduated Lockout Policy

| Score Range | Action |
|---|---|
| 0–30 | No action — normal access |
| 31–50 | Require re-authentication on sensitive actions (email change, data export, account deletion) |
| 51–70 | Force password reset + send security alert email |
| 71–89 | Temporary 24-hour account lock; require email verification to unlock |
| 90–100 | Account suspended pending admin review; user notified by email |

Scores decay passively over time (half-life: 48 hours for most signals). Admins can manually adjust scores up or down from the Admin Panel with a reason note stored in the audit log (F82).

---

#### Database Extension

```sql
ALTER TABLE users ADD COLUMN fraud_score INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN fraud_score_updated_at TIMESTAMP;
ALTER TABLE users ADD COLUMN lockout_until TIMESTAMP;

fraud_score_events
  id             UUID PRIMARY KEY
  user_id        UUID REFERENCES users(id)
  signal         VARCHAR NOT NULL
  score_delta    INTEGER NOT NULL
  decays_at      TIMESTAMP
  metadata       JSONB
  created_at     TIMESTAMP NOT NULL
```

---

### F82 — Immutable Admin Audit Log & Compliance Export

**Priority: Should Have**

Multiple features reference an "audit log" (F15, F17, F52, F53, F58, F75, F81) but none specify where the log lives, how it is protected from tampering, how long it is retained, or how it can be exported for compliance purposes. GDPR Article 5(2) requires demonstrable accountability — an immutable audit trail is the primary mechanism for proving that admin actions, data access, and user rights requests were handled correctly.

---

#### What Is Logged

Every admin action and sensitive system event is appended to the audit log. Examples:

| Event Category | Logged Fields |
|---|---|
| Admin user management | admin_id, target_user_id, action, reason, timestamp |
| Ban / suspension / warning | admin_id, target_user_id, violation_type, duration, timestamp |
| Appeal review (F52) | admin_id, appeal_id, outcome, reviewer_note, timestamp |
| Data export request (F75) | user_id, requested_at, download_ip, timestamp |
| Account deletion / purge (F75) | admin_id or 'system', user_id, purge_scope, timestamp |
| Fraud score manual adjustment (F81) | admin_id, user_id, old_score, new_score, reason, timestamp |
| Support ticket reply (F77) | admin_id, ticket_id, action, timestamp |
| Sensitive report viewed (F15) | admin_id, report_id, timestamp |
| Platform config change | admin_id, setting_key, old_value, new_value, timestamp |

---

#### Immutability

The `admin_audit_log` table uses append-only semantics:

- **No UPDATE or DELETE** permissions granted to the application database user on this table. The role used by Express can only `INSERT` and `SELECT`.
- Deletions are never logical or hard-deleted from this table.
- An optional secondary write to a Cloudflare R2 / S3 WORM bucket once per hour via a BullMQ job provides off-site tamper-proof storage.

---

#### Retention & Access

| Aspect | Policy |
|---|---|
| Retention period | 3 years (exceeds GDPR + typical regulatory requirements) |
| Access | Platform owner and super-admin roles only (not standard admin) |
| User data export (F75) | Admin audit log entries are **not** included in user data exports |
| Compliance export | CSV export of a date-range filtered audit log available to platform owner from Admin Panel |

---

#### Database

```sql
admin_audit_log
  id             UUID PRIMARY KEY
  admin_id       UUID REFERENCES users(id) ON DELETE SET NULL  -- NULL if system-initiated
  event_type     VARCHAR NOT NULL
  target_type    VARCHAR      -- 'user' | 'group' | 'ticket' | 'report' | 'config' etc.
  target_id      VARCHAR      -- ID of the affected record
  payload        JSONB        -- event-specific fields (before/after values, reason, etc.)
  ip_address     INET
  created_at     TIMESTAMP NOT NULL
  -- No updated_at — this table is append-only
```

---

#### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/audit-log` | Paginated audit log with filters (date range, event type, admin ID) — platform owner only |
| GET | `/api/admin/audit-log/export` | Stream CSV export of filtered audit log — platform owner only |

---

### F83 — User Follow System

**Priority: Should Have**

F56 (Saved Players) lets users privately bookmark people they enjoyed playing with. This is useful but invisible — it creates no social signal and generates no ongoing connection. A lightweight **follow system** lets users publicly express interest in another person's activity, see when followed users join or start new groups, and provide a stronger social signal for group recommendations (F60). Unlike a mutual friend-request model, following is asymmetric — one user can follow another without a reciprocal action — keeping it low-friction and harassment-resistant.

> **Relationship to F56:** Saved Players remains a private, one-way bookmark with no social visibility. Following is a separate, public-facing social graph. Both can coexist — a user might save someone privately for LFG alerts while also following them publicly to see their group activity.

---

#### Following Mechanics

**Follow / Unfollow**

- Any user can follow any other user from their profile page or member card, unless:
  - The target user has set their profile to **Followers: Off** (no one can follow them)
  - The target user has set **Approval Required** (follow request must be accepted)
  - The follower has been **blocked** by the target (F16)
- Following is confirmed instantly in the default (open) mode; under Approval Required a pending request is shown until accepted or declined.
- Unfollowing is silent — the unfollowed user receives no notification.

**Follower / Following Counts**

- Displayed on every user's public profile: *"42 Following · 118 Followers"*
- Users can **hide their follower/following counts** in Settings → Privacy without disabling the follow system itself.
- Users can **hide their following list** (who they follow) from other users while keeping the count visible, or hide both entirely.

**Blocking interaction:** Blocking a user (F16) automatically removes any existing follow relationship in both directions and prevents future follows.

---

#### Privacy Controls (`Settings → Privacy → Follows`)

| Setting | Options | Default |
|---|---|---|
| Who can follow me | Everyone / Followers I approve / No one | Everyone |
| Show follower count on profile | Yes / No | Yes |
| Show following count on profile | Yes / No | Yes |
| Show my following list publicly | Yes / No | Yes |
| Show my followers list publicly | Yes / No | Yes |
| Notify me when someone follows me | Yes / No | Yes |

---

#### Following Activity Feed

A **"Following"** tab appears on the `/activity` feed page (F63) alongside "All" and "Mentions". It shows a chronological stream of public activity from users the current user follows:

| Event Type | Shown As |
|---|---|
| Followed user joins a group | *"[User] joined [Group Name]"* |
| Followed user creates a new group | *"[User] started a new group: [Group Name]"* |
| Followed user earns a badge | *"[User] earned the [Badge Name] badge"* |
| Followed user posts in a public forum | *"[User] posted in [Group Name] forum"* |
| Followed user RSVPs to a public session | *"[User] is attending [Event Name] in [Group Name]"* |

**Privacy filters:** Activity from secret groups (F73) is never surfaced. Forum posts and RSVPs from private groups are suppressed unless the viewing user is also a member. Users who have hidden their activity (F49 privacy toggle) are excluded from the feed.

---

#### Follow Requests (Approval Required mode)

When a user has Approval Required enabled:

- The "Follow" button on their profile shows "Request to Follow"
- The target receives a notification with the requester's name and profile preview
- Pending requests appear in a **Follow Requests** panel in `Settings → Privacy → Follows`
- The target can: **Accept**, **Decline**, or **Block** from the same panel
- If declined, the requester sees the Follow button return to its default state — they are not told the request was declined (same UX as if they'd been blocked)

---

#### Suggested Users to Follow

A **"People You Might Know"** section appears:
- On the `/discover` page sidebar (logged-in view)
- On the onboarding Step 3 (after interests, before availability) — *"Follow people who share your interests"*
- After joining a group — *"Other members of [Group] you might want to follow"*

Suggestion logic (rule-based, same approach as F60):
1. Members of groups the user is already in
2. Users with strongly overlapping interest tags
3. Users followed by people the user already follows (2nd-degree)
4. Users who recently joined a group in the same category

---

#### Database

```sql
user_follows
  id              UUID PRIMARY KEY
  follower_id     UUID REFERENCES users(id)
  following_id    UUID REFERENCES users(id)
  status          ENUM('active','pending','declined') DEFAULT 'active'
  created_at      TIMESTAMP NOT NULL
  accepted_at     TIMESTAMP          -- set when pending request is approved
  UNIQUE(follower_id, following_id)

-- Extend users table
ALTER TABLE users
  ADD COLUMN follower_count   INTEGER DEFAULT 0,   -- denormalised; updated by trigger
  ADD COLUMN following_count  INTEGER DEFAULT 0,   -- denormalised; updated by trigger
  ADD COLUMN follows_open     BOOLEAN DEFAULT true, -- false = approval required
  ADD COLUMN follows_enabled  BOOLEAN DEFAULT true, -- false = no one can follow
  ADD COLUMN show_follower_count  BOOLEAN DEFAULT true,
  ADD COLUMN show_following_count BOOLEAN DEFAULT true,
  ADD COLUMN show_following_list  BOOLEAN DEFAULT true,
  ADD COLUMN show_followers_list  BOOLEAN DEFAULT true;
```

---

#### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/:id/follow` | Follow a user (or submit a follow request if approval required) |
| DELETE | `/api/users/:id/follow` | Unfollow a user |
| GET | `/api/users/:id/followers` | List followers of a user (respects privacy settings) |
| GET | `/api/users/:id/following` | List users a user follows (respects privacy settings) |
| GET | `/api/users/me/follow-requests` | List pending incoming follow requests |
| PUT | `/api/users/me/follow-requests/:id/accept` | Accept a follow request |
| DELETE | `/api/users/me/follow-requests/:id/decline` | Decline a follow request |
| GET | `/api/users/me/suggested-follows` | Get personalised suggested users to follow |
| GET | `/api/activity/following` | Paginated activity feed for followed users |

---

### F84 — Parental & Guardian Access for Minor Accounts

**Priority: Must Have**

RollCall permits users aged 13–17 with parental or guardian consent (F1, F26, COPPA). However, consent at registration is a one-time acknowledgment — parents have no ongoing visibility into where their child is meeting people, which groups they belong to, or what events they are attending in person. Without a guardian access model, the platform cannot meaningfully fulfill its COPPA obligations and gives parents no safety reassurance beyond the initial sign-up tick-box.

---

#### How It Works

During registration for any user born within the 13–17 age range, a mandatory **Guardian Consent** step (F26 Step 1) prompts:

> *"Because you are under 18, a parent or guardian must approve your account. Enter their email address — they will receive a consent link."*

The guardian receives an email with a **Guardian Portal link** — a lightweight read-only view tied to the minor's account. The minor's account is not activated until the guardian clicks **"I consent and approve this account"**.

Once approved, the guardian receives a permanent link to their Guardian Portal. A guardian does **not** need a RollCall account.

---

#### Guardian Portal (read-only, no RollCall account required)

Accessible via a unique token URL (`/guardian/:token`), the portal shows:

| Section | What the Guardian Sees |
|---|---|
| Group Memberships | Names of all groups the minor belongs to, with group type (Online / Local), member count, and owner display name |
| Upcoming Events | All RSVPs for in-person events — event name, group, date/time, and location (city-level only unless minor has shared exact location) |
| Recent Activity | Last 7 days — groups joined/left, sessions attended, badges earned |
| Account Status | Whether account is active, warned, or suspended; date of last login |

The portal **does not** show chat messages, DM contents, forum posts, or vote history — only structural activity. This preserves the minor's dignity and privacy while keeping the guardian appropriately informed about physical meetups.

---

#### Guardian Controls

| Control | Action |
|---|---|
| Revoke consent | Permanently deactivates the minor's account; minor is notified |
| Flag a group | Submits a support ticket (F77) flagging a specific group for admin review |
| Update guardian email | Sends re-verification to new address |
| Re-consent after inactivity | If a guardian's portal is inactive for 12 months, a re-consent email is sent |

---

#### Minor Account Restrictions (additional to standard rules)

- In-person event RSVPs trigger a **guardian notification email** automatically: *"[Minor name] just RSVPed to an in-person event: [Event Name] on [Date] in [City]."* The minor is told this notification is sent.
- Direct messages (F67) to users outside the minor's current groups are disabled — minors can only DM members of groups they belong to.
- Guardian notification emails cannot be disabled by the minor; they can be disabled only by the guardian themselves in the portal.

---

#### Database

```sql
guardian_consents
  id                  UUID PRIMARY KEY
  minor_user_id       UUID REFERENCES users(id) UNIQUE
  guardian_email      VARCHAR NOT NULL
  guardian_token      VARCHAR UNIQUE NOT NULL   -- used for portal access; rotatable
  consented_at        TIMESTAMP
  last_portal_access  TIMESTAMP
  revoked_at          TIMESTAMP
  created_at          TIMESTAMP NOT NULL
```

---

#### API Endpoints

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/guardian/:token` | Token (no account required) — returns portal data |
| POST | `/api/guardian/:token/flag-group` | Token — submit group flag as support ticket |
| PUT | `/api/guardian/:token/email` | Token — update guardian email (triggers re-verification) |
| DELETE | `/api/guardian/:token/consent` | Token — revoke consent and deactivate minor's account |
| POST | `/api/auth/register/guardian-consent` | Public — used during minor registration to send consent email |

---

### F85 — Cognitive Accessibility Mode

**Priority: Should Have**

F59 covers font size, high contrast, reduced motion, and screen reader mode. What it does not address is **cognitive load** — the overwhelming, over-stimulating experience that group chat and activity feeds can create for users with ADHD, autism, anxiety, or sensory processing differences. A platform that serves everyone must provide tools that make information easier to absorb, not just easier to see.

---

#### Features

**Distraction-Free Chat Mode** *(extends F10)*

Toggled per-channel from a ⚙️ icon in the channel header:

| Element | Default | Distraction-Free |
|---|---|---|
| User avatars in chat | Shown | Hidden (replaced with coloured dot) |
| Timestamps on every message | Shown | Hidden (shown only on hover) |
| Reaction counts | Shown | Hidden |
| Animated emoji reactions | Animated | Frozen / static |
| Typing indicators | Live banner | Hidden |
| Online presence dots | Visible | Hidden |
| Reply thread previews | Expanded | Collapsed (click to expand) |
| Image auto-preview | Loaded inline | Click-to-load placeholder |

**Message Density Control** *(extends F10, F5)*

Three density options in Settings → Accessibility:

| Mode | Description |
|---|---|
| Comfortable (default) | Standard padding, full avatars, full timestamps |
| Compact | Smaller padding, no avatars, relative timestamps ("2 min ago") |
| Spacious | Large padding, larger text, generous line height — easier to track each message |

**Focus Mode for Feeds** *(extends F63, F83)*

A "Focus" toggle on the Activity Feed and Following Feed collapses all cards to a single-line summary. Users expand only what they choose. Reduces the visual noise of avatar-heavy card grids.

**Notification Batching** *(extends F38)*

An option to batch all notifications into a single **daily digest notification** instead of individual real-time pings — one notification per day at a user-chosen time, summarising what happened. Useful for users who experience notification anxiety or interruption sensitivity.

---

#### Settings Location

All cognitive accessibility options are grouped under **Settings → Accessibility → Cognitive Preferences**, clearly separated from the visual accessibility settings already in F59.

---

### F86 — Per-Session Accessibility Accommodations

**Priority: Should Have**

F59 lets users tag themselves and groups with accessibility attributes (Neurodivergent-Friendly, Deaf/HoH, etc.). F25 covers in-person safety. Neither addresses the reality that **accommodation needs are often session-specific and fluctuating** — a user with chronic illness may be fine on some days and need extra support on others. Session-by-session accommodation communication removes the pressure to either hide needs or over-disclose on a permanent profile.

---

#### For Members — Per-RSVP Accommodation Request

When a user RSVPs "Going" to any session, an optional **"Let the organizer know"** field appears below the RSVP button:

```
Anything the organizer should know for this session? (optional — only visible to owner/co-mods)
  [ Free-text field, max 300 chars ]

  Suggestions: ○ May need extra time  ○ Prefer written communication
               ○ Sensitive to loud sounds  ○ May need to step away
               ○ Other
```

The field is **entirely optional**, visible only to the group owner and co-mods, never to other members, and not stored beyond the event date (purged 24 hours after the session ends — consistent with F75 data retention principles).

---

#### For Organizers — Accommodation Summary View

On the event management page, a **"Accommodations"** tab (visible to owner/co-mods only) shows a de-identified list of submitted notes:

- Each note is shown as: *"1 attendee: May need extra time"*
- Names are not shown in the list — only individual note detail is shown when the organizer clicks the RSVP for a specific person
- Organizers can **acknowledge** an accommodation note (sends the member a discreet confirmation: *"The organizer has noted your request"*)

---

#### Group-Level Accommodation Statements

Group owners can add an **Accessibility Statement** to their group profile (free text, max 500 chars) describing how they accommodate different needs. This appears on the group page under the About section with an ♿ icon. Helps users decide whether to join before committing.

---

#### Database Extension

```sql
ALTER TABLE event_rsvps
  ADD COLUMN accommodation_note TEXT,          -- max 300 chars; purged 24h after event
  ADD COLUMN accommodation_acknowledged BOOLEAN DEFAULT false;

ALTER TABLE groups
  ADD COLUMN accessibility_statement TEXT;     -- max 500 chars; displayed on group page
```

---

### F87 — Notification Fatigue Prevention

**Priority: Should Have**

F38 gives granular per-type notification controls. The problem it does not solve is **all-or-nothing behaviour** — users overwhelmed by notifications tend to disable everything, then silently miss critical alerts (safety alarms, bans, account recovery). This feature adds a safety net that prevents complete notification blackout while respecting the user's desire for quiet.

---

#### "Essential Only" Notification Preset

A one-tap preset in **Settings → Notifications** that switches all non-critical notifications off while keeping a protected set always-on:

| Type | Essential Only | Rationale |
|---|---|---|
| Safety alarm follow-ups (F41) | ✅ Always on | Cannot be silenced |
| Account ban / suspension | ✅ Always on | User must be informed |
| Account recovery codes (F58) | ✅ Always on | Security critical |
| Guardian notifications (F84) | ✅ Always on | Legal requirement |
| Session reminders | ❌ Off | Can be re-enabled individually |
| Mentions & follows | ❌ Off | Can be re-enabled individually |
| New group activity | ❌ Off | Can be re-enabled individually |

Users can switch from Essential Only back to their previous custom configuration with one tap (settings are stored, not overwritten).

---

#### Smart Re-Engagement Prompt

When a user has had **all discretionary notifications off for 14+ days**, the next time they open Settings → Notifications, a soft prompt appears:

> *"You've had most notifications off for 2 weeks. Want to turn on session reminders so you don't miss upcoming games?"*

Single-tap to re-enable session reminders only. Dismissible. Shown at most once per 30-day window.

---

#### Quiet Hours

Users can set a **Quiet Hours** window (e.g., 10 PM – 8 AM) during which push and in-app notifications are suppressed — except for the Essential Only set above. Notifications received during Quiet Hours are batched and delivered as a single "Here's what you missed" summary at the end of the quiet window.

---

### F88 — Group Owner First-Run Wizard

**Priority: Should Have**

F26 (Onboarding Flow) guides new users toward joining existing groups. However, when a user creates their first group, they arrive at an empty group page with no guidance on what to do next. This moment — the group founder's first 10 minutes — is the highest-leverage point for preventing dormant groups. A brief, skippable wizard turns that confusion into confident action.

---

#### Wizard Flow (triggered only on first group creation)

```
Step 1 of 4 — Invite your first members
  "Share your group link or invite by email to get your first 3 members."
  [ Copy invite link ]  [ Send email invites ]  [ Skip for now ]

Step 2 of 4 — Post a welcome message
  "Say hello! A short welcome message tells members what to expect."
  Pre-filled suggestion: "Welcome to [Group Name]! Here's what we're about..."
  [ Post message ]  [ Skip ]

Step 3 of 4 — Schedule your first session
  "Groups with a scheduled session get 3× more join requests."
  [ Create first event ]  [ Skip ]

Step 4 of 4 — You're ready!
  Checklist summary: ✅ Group created  ✓/✗ Members invited  ✓/✗ Welcome posted  ✓/✗ Session scheduled
  "Come back to this checklist anytime from your group settings."
```

- The wizard is skippable at any step
- Incomplete checklist items are accessible from a **"Setup Checklist"** card pinned to the group page until all four are completed or the owner dismisses it
- The checklist card is visible only to the owner and co-mods — not to members

---

### F89 — Contextual Help & Inline Tooltips

**Priority: Could Have**

The Help Center (F39) is comprehensive but passive — users must know to look for it. Contextual help surfaces the right article at the moment of confusion, reducing support tickets and frustration.

---

#### Tooltip Triggers

A small ⓘ icon appears next to elements that are commonly misunderstood:

| Element | Tooltip / Link |
|---|---|
| Trust Score ring on profiles | *"What is the Trust Score?"* → `/help/trust-score` |
| Badge progress indicators (F40) | *"How do I earn this?"* → badge-specific F39 article |
| Warning count display (F17) | *"What happens at 3 warnings?"* → `/help/moderation` |
| "Pending" contact in F41 Safety | *"Your contact hasn't responded yet — here's why"* → `/help/safety-contacts` |
| Group Health signal (F20) | *"What does 'Low Activity' mean?"* → `/help/group-health` |
| Waitlist position (F50) | *"How does the waitlist work?"* → `/help/waitlist` |
| Accommodation note field (F86) | *"Who can see this?"* → inline tooltip only, no external link |

---

#### Ban & Warning Messages

When a user receives a ban or suspension notification, the message includes:
- A plain-language explanation of what rule was violated
- A link to the relevant Community Standards section (F14)
- A link to the Moderation Appeal process (F52) if the action is appealable
- If the violation involved potential self-harm language — a **crisis resource link** (see F92)

---

### F90 — Skeleton Loaders & Loading State Standards

**Priority: Should Have**

The Non-Functional Requirements specify ≤2.5s LCP and ≤4.0s TTI, but do not mandate how the UI behaves during loading. Without skeleton screens, the app feels frozen or broken — especially on slow connections — which is disproportionately harmful for users with cognitive disabilities who struggle to tolerate ambiguity in UI state.

---

#### Standard Loading Patterns

| View | Loading Pattern |
|---|---|
| Discover page (group cards) | Skeleton cards — 6 grey placeholder cards with shimmer animation; respects `prefers-reduced-motion` (static grey, no shimmer) |
| Activity feed / Following feed | Skeleton rows — avatar circle + two lines of text per item |
| Group page (tabs) | Tab content skeleton; header data loads instantly from lightweight endpoint |
| Chat messages | Bottom-anchored skeleton; last 10 messages appear first, history lazy-loads upward |
| Notification dropdown | 3 skeleton rows on first open |
| Admin queues (reports, tickets) | Table skeleton — column headers visible immediately, rows shimmer |
| Profile page | Avatar skeleton + 3 content blocks |

#### Error States

Every loading state has a corresponding **error state** with:
- A plain-language message (*"Couldn't load groups right now"*)
- A single retry button
- No stack traces, error codes, or technical language visible to the user

---

### F91 — Organizer Burnout & Delegation Signals

**Priority: Should Have**

F70 (Organizer Analytics Dashboard) shows audience and session metrics. It does not surface signals that indicate an organizer is overloaded or approaching burnout — the leading cause of group dormancy. Adding wellbeing-aware signals to the dashboard helps organizers delegate proactively rather than quietly disappear.

---

#### New Dashboard Section: "Group Health & You"

Added as a fifth section to the F70 organizer dashboard alongside Audience, Sessions, Content, and Discovery:

| Signal | Indicator | Suggested Action |
|---|---|---|
| Organizer message volume (7-day) | High / Normal / Low | — |
| Moderation actions taken (7-day) | High / Normal | "Consider adding a co-moderator" |
| Time since last session created | — | Shown in days; nudge if > 30 days |
| Co-moderator last active | Shown per co-mod | "Your co-mod [Name] hasn't been active in 14 days" |
| Member join rate (30-day) | Trending up / flat / declining | — |

**Delegation suggestions** appear as non-intrusive cards:
- *"You've handled 40 moderation actions this week alone. Adding a co-moderator can share the load — here's how."*
- *"[Co-mod name] hasn't logged in for 3 weeks. Consider promoting a more active member."*

These suggestions are opt-out (can be hidden from the dashboard permanently).

---

### F92 — Mental Health Crisis Resource Surfacing

**Priority: Must Have**

RollCall's moderation pipeline detects harmful content (hate speech, harassment) but has no protocol for messages that indicate a member may be in **personal crisis** — suicidal ideation, self-harm, or expressions of hopelessness. Without a defined response pathway, the platform becomes complicit in harm by inaction. This is a duty-of-care requirement for any platform serving teenagers (13+) and vulnerable adults.

---

#### Detection Triggers

Crisis resource surfacing is triggered in two ways:

**1. Report-Based (human-triggered):**
When a member reports another member's message using the report category **"Concerning — person may be in distress"** (new category added to all report flows), an immediate response is activated.

**2. Content-Filter-Based (automated):**
A supplementary keyword set (separate from the `bad-words` profanity filter) screens for crisis language patterns — e.g., phrases expressing hopelessness, explicit self-harm, or farewell-type statements. This filter runs only in private-context messages (DMs and group chats) where a person is more likely to express genuine distress. It does **not** block the message — it triggers a supplementary response alongside delivery.

> **Design principle:** The message is never blocked. Blocking a cry for help is worse than receiving it. The crisis response runs parallel to normal message flow.

---

#### Crisis Response Flow

```
Crisis signal detected (report OR keyword filter)
        │
        ▼
Responding user (the person who sent the message) sees:
  A gentle, non-intrusive banner below their message field:
  ┌─────────────────────────────────────────────────────┐
  │ 💙 It looks like you might be going through         │
  │ something difficult. You don't have to face it      │
  │ alone.                                              │
  │ [Find support →]  [Dismiss]                         │
  └─────────────────────────────────────────────────────┘
  "Find support" opens a resource panel (see below)

The reporting user (if report-triggered) sees:
  "Thank you for looking out for your community.
   We've surfaced support resources for that person."
        │
        ▼
Admin notification:
  Report flagged as 'crisis' in admin queue (F15) — elevated priority, same queue as sensitive reports
  Assigned to platform owner / designated crisis reviewer
```

---

#### Crisis Resource Panel

A full-screen accessible overlay (not a modal — full focus trap, keyboard navigable) showing:

| Resource | Number / Link |
|---|---|
| Crisis Text Line (US) | Text HOME to 741741 |
| 988 Suicide & Crisis Lifeline (US) | Call or text 988 |
| SAMHSA National Helpline | 1-800-662-4357 |
| International Association for Suicide Prevention | https://www.iasp.info/resources/Crisis_Centres/ |
| *"Talk to someone in your community"* | Link to trusted contacts (F41) if configured |

The panel is available to any user at any time via a **💙 Support** link in the site footer — not only as a crisis response.

---

#### Platform-Wide Disclosures

- Crisis keyword detection is disclosed in the Privacy Policy: *"RollCall may surface mental health resources when certain message patterns are detected. Messages are never blocked for this reason."*
- Admins and mods are never shown the specific keyword that triggered detection — only that a crisis flag was raised. This protects the dignity of the member.

---

#### Database Extension

```sql
ALTER TABLE reports
  ADD COLUMN is_crisis BOOLEAN DEFAULT false;

-- Extend notification_types (F38) with:
-- 'crisis_resource_shown' — for analytics opt-in users only (F68)
```

---

### F93 — Community Champion & Peer Recognition

**Priority: Could Have**

F40 (Achievement & Badge System) rewards quantifiable actions — sessions attended, posts helpful-voted, referrals made. Badges cannot capture the quieter forms of community value: the member who always welcomes newcomers, mediates a tense disagreement, or quietly helps the organizer stay organised. Peer recognition fills that gap and strengthens long-term member retention through social belonging, not point accumulation.

---

#### Peer Nomination

Once per **calendar month**, any member can nominate one other member of a shared group for a **Community Shoutout**. The nomination is brief:

```
Nominate a group member for a shoutout:
  Select member: [ dropdown of group members ]
  Why? (optional): [ free text, max 140 chars ]
  [ Submit nomination ]
```

- Nominations are visible to the whole group — posted as a special card in the group feed: *"[Nominator] wants to shout out [Nominee] — 'Always helps new members find their footing 🙏'"*
- The nominee receives a notification and an optional in-app reaction prompt for the shoutout card
- There is no ranking, no leaderboard, no winner — every shoutout is simply acknowledged

---

#### Community Champion Badge

After receiving **5 shoutouts across any groups** in a 3-month rolling window, a user earns the **Community Champion** badge (added to F40 badge definitions). This badge is distinctly social — it cannot be earned through any solitary action, only through being recognised by others.

---

#### Admin "Champion" Award

Group owners and platform admins can also issue a **Spotlight Award** — a one-off custom message pinned briefly to the group feed, designed for moments that no automated system would catch. It requires a written reason and creates a permanent entry in the user's badge/recognition shelf.

---

#### Privacy

- Shoutouts are visible within the group only (not on public profiles)
- Users can opt out of receiving shoutouts in Settings → Privacy: *"Allow group members to nominate me for shoutouts"*
- Opted-out users still appear in the nominee dropdown with a note: *"[User] has opted out of shoutouts"* — so the nominator understands without embarrassment

---

### F94 — Community Calendar, Unified View & Activity Gap Finder

**Priority: Must Have**

The existing calendar features (F6, F29, F51, F57) handle individual event creation, export, and recurrence. What they don't provide is a **calendar as a discovery surface** — a place where events are visible beyond the current group members, where someone browsing RollCall can see what is happening and request a seat, and where a logged-in user can see all their groups' schedules in one view. Without this, the platform treats every group's schedule as a private island. Making calendars public turns every event into an organic discovery moment.

---

#### Part 1 — Per-Group Calendar Tab

Every group page gains a dedicated **"Calendar"** tab alongside Feed, Events, Members, Forum, and Resources.

**Calendar Views**

Three view modes, toggled from the tab header:

| View | Layout |
|---|---|
| Month | Standard month grid; event chips on each day (up to 3 visible; "+N more" overflow) |
| Week | 7-column time-grid showing events as blocks with duration |
| List | Chronological upcoming events list; infinite scroll; collapsible past-events section |

All three views are fully keyboard-navigable and screen-reader-compatible (ARIA labels on every event chip, role="grid" on the month view).

**Event Detail Popover**

Clicking any event chip opens an inline popover (not a new page) showing:
- Event name, date, time, duration, timezone
- Description / session notes
- Location (city-level for public visitors; exact venue for confirmed members)
- RSVP counts: *"12 Going · 3 Maybe · 4 Can't Make It"*
- Action button — varies by viewer (see visibility rules below)
- "Add to Calendar" → .ics download and Google Calendar link (F29)

---

#### Part 2 — Calendar Visibility & Public Join Flow

Each group has a **Calendar Visibility** setting controlled by the owner in Group Settings → Calendar:

| Setting | Who Sees Events | What Visitors Can Do |
|---|---|---|
| **Public** | Anyone, including logged-out visitors | View event details; request to join the group (F48) or join directly if open group |
| **Members Only** (default) | Confirmed group members only | — |
| **Followers Only** | Members + users who follow the group owner | View + join request |

**Public calendar visitor experience:**

When a non-member views a public group calendar and clicks an event:
```
Event popover shows:
  ─────────────────────────────────────
  🎲  Campaign Session #14
  Saturday, May 3 · 7:00 PM – 10:00 PM ET
  📍 Online via Discord voice
  4 spots available · Skill: Intermediate

  "This is an ongoing D&D 5e campaign.
   New players welcome for this session."

  [ Request to Join Group ]   [ Learn more about the group → ]
  ─────────────────────────────────────
```

- **"Request to Join Group"** triggers the standard F8 join/request flow — the visitor lands on the group page and submits a join request. The event they clicked is pre-noted in the request: *"Interested in attending: Campaign Session #14 on May 3."*
- For **open groups**, the button reads "Join Group" and they are added immediately.
- For **invite-only groups**, the button reads "Request to Join" — owner must approve before they can attend.
- **No account required to view** a public calendar — but joining requires registration (COPPA-compliant F26 flow).

**Public calendar URL**: `rollcall.gg/groups/:slug/calendar` — shareable, indexable by search engines, included in F71 sitemap.

---

#### Part 3 — Unified Personal Calendar (`/calendar`)

A dedicated **`/calendar`** page for logged-in users shows events from **all their groups** in one view — the definitive answer to "what do I have this week across everything I belong to?"

**Group Toggle Sidebar**

On the left side of the calendar, a collapsible sidebar lists every group the user belongs to, each with:
- Group avatar, name, and activity category colour pill
- A toggle checkbox to show/hide that group's events on the calendar
- Toggle state persisted in `localStorage` (survives page refresh)
- "All Groups" master toggle

**View Modes**: Same Month / Week / List as per-group calendar, consistent UI.

**Colour Coding**: Each group is auto-assigned a distinct colour (12 colours, cycling if needed). Event chips use the group's colour so the user can instantly identify which group each event belongs to at a glance.

**"My Week" Summary Card** — pinned at the top of the List view when the current week is selected:
```
This week across your 6 groups:
  Mon  ·  Board Game Night  ·  7 PM
  Wed  ·  D&D Campaign  ·  8 PM
  Sat  ·  Chess Club  ·  2 PM
  [ Export this week → .ics ]
```

**Bulk .ics Export**: An "Export All" button generates a single `.ics` file containing all upcoming events from all toggled groups — one subscription-compatible feed the user can import into any calendar app and keep in sync.

---

#### Part 4 — Advanced Event Filtering

Filtering controls appear in both the per-group Calendar tab and the Unified Calendar, accessible via a **Filter** button (🔽) above the calendar:

| Filter | Options |
|---|---|
| Activity type | Category tags (Gaming, Sports, Tabletop, Arts, etc.) — multi-select |
| Skill / experience level | Beginner / Intermediate / Advanced / All Welcome |
| Format | Online only / In-person only / Both |
| Group | Any of the user's groups (multi-select) — Unified Calendar only |
| Date range | This week / This month / Next 30 days / Custom range |
| RSVP status | All / Going / Maybe / Pending response / Haven't RSVPed |
| Availability match | Hide events that conflict with my blocked availability (cross-references F26 availability settings) |

Active filters are shown as dismissible chips below the calendar header. A **"Clear all filters"** link resets to defaults.

---

#### Part 5 — Activity Gap Finder ("Missing Groups" Discovery)

Accessible from the `/discover` page as a new tab: **"What's Missing Near You"**.

This tool cross-references the user's interest tags and location against existing groups to surface **under-served activity types** — categories where few or no groups exist that match the user's profile. It turns an absence of results from a frustrating dead-end into an invitation to lead.

**Gap Detection Logic**

For each of the user's interest tags, the system queries:
1. How many active groups in this category exist within the user's location preference?
2. Of those, how many have open slots (not full/waitlist-only)?
3. How many sessions have been scheduled in the last 30 days in this category nearby?

A gap is flagged when:
- Fewer than **3 open groups** in a category within the user's preferred radius, **or**
- No sessions scheduled in the category in the last **30 days** nearby

**Gap Card UI**

Each gap is displayed as a card:

```
┌──────────────────────────────────────────────────────┐
│ 🎯  No Chess groups in your area                     │
│                                                      │
│ You listed Chess as an interest, but there are       │
│ only 1 group nearby — and it's full.                 │
│                                                      │
│ 🌟  Be the first to start one!                       │
│ [ Create a Chess Group ]   [ See that 1 group → ]   │
└──────────────────────────────────────────────────────┘
```

- **"Create a [Category] Group"** opens the group creation flow (F2) with the activity type pre-filled and the matching F74 template pre-selected if one exists.
- **"See that 1 group"** links to the group's public page.
- If there are zero groups in a category: badge reads *"No groups yet — be the first!"*
- If there are some groups but they're full: badge reads *"Groups exist but are full — another one is needed."*

**Sorting**: Gaps are sorted by:
1. Categories the user has rated highest interest (F26 interest ranking)
2. Categories with the most local searches in the past 7 days (trending demand signal from F68 analytics)

**"Wanted" Signal**: Users can tap **"I'd join this"** on a gap card. This:
- Adds a soft demand vote to the category in the user's area
- If 5+ users in the same area have voted "I'd join this" for the same category, any user who views the gap card sees: *"5 people near you are looking for a group like this."* — a social proof prompt for potential organizers.
- A weekly digest (F69) can notify users who voted when a matching group is created nearby.

**"Wanted" votes are anonymous to other users.** The total count is shown; individual names are not.

---

#### Part 6 — Print-Optimized Calendar View

A **🖨 Print** button appears in the top-right toolbar of both the per-group Calendar tab and the unified `/calendar` page (alongside the existing Export and Filter controls).

**Behaviour on Click**

1. If the calendar is in Month or Week view, it automatically switches to **List view** before printing (List view is the only layout that maps cleanly to paper).
2. `window.print()` is called — the browser's native Print dialog opens. Users can print to a physical printer or save as PDF using the browser's built-in "Save as PDF" destination.
3. After the print dialog closes (or is cancelled), the view returns to whichever mode the user was in before.

**Print UI — What Is Hidden (`display: none` in `@media print`)**

| Element | Reason |
|---|---|
| Top navigation bar | Not useful on paper |
| Left sidebar (group toggles) | Paper doesn't have toggles |
| Filter / Export / Print toolbar buttons | Irrelevant once printing |
| RSVP action buttons on event rows | Can't click paper |
| "Add to Calendar" inline links | Irrelevant on paper |
| Cookie / notification banners | Noise |
| Footer | Noise |

**Print CSS Specification (`@media print`)**

```css
@media print {
  /* Hide all chrome */
  nav, aside, .toolbar, .filter-bar, .rsvp-actions,
  .add-to-cal-btn, footer, .cookie-banner {
    display: none !important;
  }

  /* Force list view layout */
  .calendar-month-grid,
  .calendar-week-grid {
    display: none !important;
  }
  .calendar-list-view {
    display: block !important;
  }

  /* Reset background colours — save ink */
  body, .calendar-list-view, .event-row {
    background: #ffffff !important;
    color: #000000 !important;
  }

  /* Remove shadows and rounded corners */
  .event-row, .event-card {
    box-shadow: none !important;
    border-radius: 0 !important;
    border-bottom: 1px solid #cccccc;
    padding: 8pt 0;
  }

  /* Group colour pill — convert to a small left border */
  .group-colour-chip {
    display: none !important;
  }
  .event-row {
    border-left: 4pt solid var(--group-colour, #666);
    padding-left: 8pt;
  }

  /* Typography — legible on paper */
  .event-title   { font-size: 11pt; font-weight: bold; }
  .event-meta    { font-size: 9pt; color: #444444 !important; }
  .event-date    { font-size: 9pt; }

  /* Page break control — never cut an event row across pages */
  .event-row { page-break-inside: avoid; }

  /* Print header — injected via JS before window.print() */
  .print-header {
    display: block !important;
    font-size: 14pt;
    font-weight: bold;
    margin-bottom: 12pt;
    border-bottom: 2pt solid #000;
    padding-bottom: 6pt;
  }

  /* Pagination */
  @page {
    size: A4 portrait;
    margin: 20mm 15mm 20mm 15mm;
  }
}
```

**Print Header (injected by JavaScript)**

Before calling `window.print()`, the frontend inserts a `.print-header` `<div>` at the top of the list containing:

```
RollCall — [Page Title]
Printed: [Date printed, formatted as "Tuesday 21 April 2026"]
[Date range currently shown, e.g. "Events: May 2026" or "Next 30 days"]
[Group name — for per-group calendar only]
```

This header is `display: none` in normal screen CSS and `display: block` in `@media print`, so it never appears in the regular UI.

**Unified Calendar Print — Group Attribution**

On the unified `/calendar` print, each event row includes a **group name label** in small caps beneath the event title so the user can tell at a glance which group each session belongs to (the colour-coded chips are hidden in the print layout).

---

#### Database Extensions

```sql
-- Extend groups table
ALTER TABLE groups
  ADD COLUMN calendar_visibility ENUM('public','members_only','followers_only') DEFAULT 'members_only';

-- Unified calendar user preferences
calendar_preferences
  id              UUID PRIMARY KEY
  user_id         UUID REFERENCES users(id) UNIQUE
  hidden_groups   UUID[]          -- groups toggled off in unified view
  default_view    ENUM('month','week','list') DEFAULT 'list'
  created_at      TIMESTAMP NOT NULL

-- Activity gap demand votes
activity_gap_votes
  id              UUID PRIMARY KEY
  user_id         UUID REFERENCES users(id)
  category_tag    VARCHAR NOT NULL
  location_key    VARCHAR NOT NULL   -- city/region slug from user's location preference
  created_at      TIMESTAMP NOT NULL
  UNIQUE(user_id, category_tag, location_key)
```

---

#### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/groups/:id/calendar` | Public (if calendar_visibility = public) | Paginated events for group calendar; supports `?view=month&year=2026&month=5` |
| GET | `/api/calendar` | Auth required | Unified calendar — all the user's groups' events; supports filter params |
| GET | `/api/calendar/export.ics` | Auth required | Bulk .ics export for all toggled groups |
| PUT | `/api/calendar/preferences` | Auth required | Save group toggles and default view |
| GET | `/api/discover/gaps` | Auth required | Returns gap cards based on user interest tags + location |
| POST | `/api/discover/gaps/vote` | Auth required | Submit "I'd join this" vote for a category/location |
| DELETE | `/api/discover/gaps/vote` | Auth required | Retract a gap vote |

---

### F64 — Post Voting (Upvote / Downvote)

**Priority: Should Have**

Group forums (F61) and message boards (F5) generate a lot of content. Without any quality signal, users must read every post to find the most useful ones. An upvote/downvote system surfaces the best contributions naturally, rewards helpful members, and buries low-effort or off-topic posts — without requiring admin intervention for every piece of content.

---

#### Where Voting Applies

| Content type | Upvote / Downvote |
|---|---|
| Forum posts (F61) | ✅ |
| Forum replies (F61) | ✅ |
| Group message board posts (F5) | ✅ |
| Group chat messages (F10) | ❌ — chat is ephemeral; reactions only |
| Session recaps (F30) | ✅ |

The "Helpful" reaction in the forum (F61) that triggers badge awards remains separate and coexists with voting. Helpful = a deliberate endorsement; upvote = a lightweight quality signal. A user can upvote and mark Helpful on the same post.

---

#### Voting Rules

- **One vote per user per content item.** A user can hold at most one active vote (upvote or downvote) on any given post or reply.
- **Vote change:** Clicking the opposite arrow flips the vote (net swing of 2). Clicking the same arrow a second time retracts the vote (net swing of 1).
- **No self-voting.** The vote controls are hidden on a user's own posts; the score is still displayed.
- **Voter anonymity.** Vote counts are public. Individual voter identities are never shown to other users. Admins can view full breakdowns (upvotes and downvotes separately) for abuse investigation.
- **Minimum trust threshold.** A user must have at least one verified email and have completed onboarding before they can cast downvotes, preventing throwaway accounts from suppressing content immediately after registration.

---

#### Score Display & UI

**Net score** (upvotes − downvotes) is shown between the two arrow buttons. Display rules:

| Net score | Colour |
|---|---|
| > 0 | Vivid green |
| 0 | Neutral grey |
| < 0 | Muted red |

**Collapsed posts:** Any forum post or reply with a net score of **−5 or lower** is automatically collapsed to a single line reading *"This post has been downvoted — tap to expand."* The user can expand it at any time. This threshold is admin-configurable per group.

**Sort options (Forum tab):** The existing forum sort (F61) gains a **Top** option that ranks by net score descending, in addition to the existing **New** (chronological) and **Helpful** (most Helpful reactions) sorts. The sort preference is persisted per group per user in `localStorage`.

**Real-time updates:** Vote counts update in real time via Socket.io for all users currently viewing the post — no refresh needed. The emitted event carries only the new net score and separate upvote/downvote totals (for admins); it does not reveal individual voters.

---

#### Badge Integration (extends F40)

Two new badges are added to the Community category:

| Category | Badge | Trigger |
|---|---|---|
| Community | Rising Star | A single post reaches a net score of +10 for the first time |
| Community | Crowd Favourite | A single post reaches a net score of +25 for the first time |

These badges are awarded to the **post author**, not the voters. They appear on the author's profile badge shelf and are shareable to the group feed.

---

#### Database

```sql
post_votes
  id           UUID PRIMARY KEY
  voter_id     UUID REFERENCES users(id) ON DELETE CASCADE
  target_id    UUID NOT NULL          -- forum_post, forum_reply, or board_post UUID
  target_type  VARCHAR NOT NULL       -- 'forum_post' | 'forum_reply' | 'board_post' | 'session_recap'
  value        SMALLINT NOT NULL      -- 1 = upvote | -1 = downvote
  created_at   TIMESTAMP NOT NULL DEFAULT now()

  CONSTRAINT post_votes_one_per_user UNIQUE (voter_id, target_id, target_type)
  CONSTRAINT post_votes_valid_value  CHECK (value IN (1, -1))

-- Denormalised score columns on each content table (updated via trigger)
-- Avoids expensive COUNT aggregations on every page load
ALTER TABLE forum_posts    ADD COLUMN vote_score INTEGER DEFAULT 0;
ALTER TABLE forum_replies   ADD COLUMN vote_score INTEGER DEFAULT 0;
ALTER TABLE messages ADD COLUMN vote_score INTEGER DEFAULT 0;
ALTER TABLE session_recaps ADD COLUMN vote_score INTEGER DEFAULT 0;
```

A PostgreSQL trigger recalculates `vote_score` on every INSERT, UPDATE, or DELETE to `post_votes`, keeping the denormalised column in sync without application-layer overhead.

---

#### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/vote` | Cast or change a vote `{ targetId, targetType, value: 1 \| -1 }` |
| DELETE | `/api/vote` | Retract a vote `{ targetId, targetType }` |
| GET | `/api/vote/my?targetId=&targetType=` | Get the current user's vote on a specific item |
| GET | `/api/groups/:id/forum?sort=top` | Forum posts sorted by net score descending |
| GET | `/api/admin/votes/:targetType/:targetId` | Admin-only: full upvote/downvote breakdown |

All vote mutations emit a `vote:updated` Socket.io event to the room for the affected group so all connected clients update their displayed score in real time.

---

### F65 — Spoiler Tags & Content Reveal

**Priority: Should Have**

Communities that discuss games, books, films, TV shows, or ongoing campaigns regularly need to share plot points, endings, strategies, or outcomes that not every member has experienced yet. Without a spoiler system, members either avoid the discussion entirely (reducing engagement) or accidentally ruin the experience for others (causing friction). Spoiler tags solve this by hiding sensitive content behind an intentional user action.

---

#### Authoring Spoilers

**Syntax:** Authors wrap spoiler content in double pipes: `||hidden content here||`

This syntax is borrowed from Discord, which makes it familiar to a large portion of RollCall's gaming-community user base.

**Toolbar shortcut:** The post/reply composer includes a **Spoiler** button (eye-with-slash icon) in the formatting toolbar. Selecting text and clicking the button wraps the selection in `|| ||` automatically. On mobile, the button appears in the formatting strip above the keyboard.

**Category label (optional):** Authors can add a context hint before the content:
```
||The Last of Us Season 2|| Joel dies in episode one.
```
This renders as: **⚠️ Spoiler: The Last of Us Season 2** — with the content hidden until revealed. If no label is provided it renders as: **⚠️ Spoiler — tap to reveal.**

**Multiple spoilers per post:** Each `|| ||` block is an independent, separately revealable unit. Revealing one does not reveal others in the same post.

**Nesting:** Spoiler tags cannot be nested. A `|| ||` found inside another `|| ||` is treated as plain text.

---

#### Reveal Mechanics

| Interaction | Behaviour |
|---|---|
| **Click / Tap** | Immediately reveals the hidden content; the blur overlay is replaced by readable text |
| **Hover (desktop)** | Shows a blurred peek — the text becomes dimly legible on hover but is not fully revealed until clicked |
| **Keyboard (Tab + Enter/Space)** | Spoiler block is focusable; Enter or Space reveals it — fully accessible without a mouse |
| **"Hide again" button** | A small × icon appears after reveal; clicking it re-applies the blur so the user can re-hide the content |

The hover-peek uses `filter: blur(4px)` on hover, reduced from the default `filter: blur(8px)`, giving a deliberate preview that still requires an intentional click to read fully. This matches the user's request that content be "scrolled over" (i.e., interacted with) to reveal — it prevents accidental reveals while still hinting that content is there.

---

#### Display Rules

**In post previews (group feed, activity feed):** Any post flagged `has_spoiler = true` shows a placeholder in its feed preview card instead of the content excerpt: *"This post may contain spoilers — open to read."* The full content (with blur overlay) is only rendered inside the post detail view.

**Moderation:** Admins and co-moderators always see spoiler content unblurred, regardless of their personal interaction with the post, so they can moderate for rule violations.

**Content filtering:** The server-side content filter (F18, `bad-words`) and Cloudinary AI moderation (F42) run against the **raw unblurred text** before storage. Spoiler tags cannot be used to smuggle banned content through the filter.

**Edit behaviour:** Editing a post that contains spoiler blocks preserves the `|| ||` syntax in the composer so the author can adjust the tags without losing formatting.

---

#### Database

```sql
-- No new tables required. Spoiler markup is stored as-is in the content field.
-- has_spoiler flag added to content tables for fast preview suppression:

ALTER TABLE forum_posts    ADD COLUMN has_spoiler BOOLEAN DEFAULT false;
ALTER TABLE forum_replies   ADD COLUMN has_spoiler BOOLEAN DEFAULT false;
ALTER TABLE messages ADD COLUMN has_spoiler BOOLEAN DEFAULT false;
ALTER TABLE session_recaps ADD COLUMN has_spoiler BOOLEAN DEFAULT false;
```

The server sets `has_spoiler = true` automatically when it detects one or more `|| ||` pairs in the submitted content during CREATE or UPDATE. No client-supplied flag is trusted.

---

#### React Component

```jsx
// SpoilerBlock.jsx
// Props: content (string), label (string | null)
// Renders a blurred overlay; click/Enter/Space to reveal; × to re-hide.

export function SpoilerBlock({ content, label }) {
  const [revealed, setReveal] = useState(false);
  return revealed ? (
    <span className="spoiler-revealed">
      {content}
      <button onClick={() => setReveal(false)} aria-label="Hide spoiler">×</button>
    </span>
  ) : (
    <button
      className="spoiler-hidden"          // CSS: filter: blur(8px) → blur(4px) on hover
      onClick={() => setReveal(true)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setReveal(true)}
      aria-label={label ? `Spoiler: ${label}. Press Enter to reveal.`
                        : 'Spoiler. Press Enter to reveal.'}
    >
      <span className="spoiler-label">
        ⚠️ {label ? `Spoiler: ${label}` : 'Spoiler — tap to reveal'}
      </span>
      <span className="spoiler-content" aria-hidden="true">{content}</span>
    </button>
  );
}
```

The post renderer (used in forum, message board, and recap views) parses `|| ||` blocks before rendering and replaces each match with a `<SpoilerBlock>` component instance.

---

#### API

No dedicated spoiler endpoints are required. Spoiler content travels through the existing post CREATE and UPDATE endpoints. The server:

1. Runs the content filter against raw text (strips `|| ||` delimiters for filter evaluation)
2. Sets `has_spoiler` flag if `|| ||` pairs are detected
3. Stores content with `|| ||` markers intact
4. Returns content with markers; client renders `<SpoilerBlock>` components

---

### F50 — Group Waitlist / Queue

**Priority: Should Have**

When a group reaches capacity, interested users currently have only a passive "favorite" option that fires a notification to everyone simultaneously when a spot opens — creating a race condition. A proper waitlist gives users a guaranteed position and removes the frustration of missing out purely due to reaction speed.

**How it works**

When a group is full, the "Join" or "Request to Join" button is replaced with "Join Waitlist." The user is added to an ordered queue. When any member leaves or is removed, the first person on the waitlist receives an exclusive invite with a **48-hour acceptance window**. If they don't accept within 48 hours, the invite passes to the next person in line automatically.

**Waitlist UI**

- Group cards in Discover show a "Waitlist open — X ahead of you" indicator for groups the user has joined the waitlist for
- Waitlist position is visible on the group's public preview page: "Currently full — 3 on waitlist"
- Users can leave the waitlist at any time from the group page or their dashboard
- Group owners can see the waitlist in their group management panel and can skip over specific users or invite someone directly bypassing the queue

**Private Groups**

For private (request-to-join) groups, joining the waitlist still requires owner approval. The user is added to a pending waitlist — the owner approves them into the queue, and they move up as spots open.

**Notifications**

- Position update: "You moved up to #2 on the waitlist for [Group]"
- Invite received: "A spot opened in [Group] — you have 48 hours to accept"
- Invite expired: "Your waitlist invite for [Group] expired. You've been removed from the queue."

**Database**

```sql
group_waitlist
  id          UUID PRIMARY KEY
  group_id    UUID REFERENCES groups(id)
  user_id     UUID REFERENCES users(id)
  position    INTEGER NOT NULL
  status      ENUM('waiting','invited','accepted','declined','expired','removed') DEFAULT 'waiting'
  invited_at  TIMESTAMP
  expires_at  TIMESTAMP   -- 48h after invited_at
  created_at  TIMESTAMP NOT NULL
  UNIQUE(group_id, user_id)
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groups/:id/waitlist` | Get waitlist (owner sees full list; user sees own position) |
| POST | `/api/groups/:id/waitlist` | Join the waitlist |
| DELETE | `/api/groups/:id/waitlist` | Leave the waitlist |
| PUT | `/api/groups/:id/waitlist/:userId/invite` | Owner manually invites a specific waitlisted user |
| PUT | `/api/groups/:id/waitlist/:userId/skip` | Owner skips a user (moves them to end of queue) |
| POST | `/api/groups/:id/waitlist/accept` | Authenticated user accepts their open invite |
| DELETE | `/api/groups/:id/waitlist/decline` | Authenticated user declines their open invite |

---

### F16 — Block / Mute User

**Priority: Must Have (MVP)**

Users need personal-level control over who can interact with them, independent of admin involvement. Two distinct tools serve different needs:

**Block** — hard boundary. The blocked user cannot:
- View the blocking user's profile
- See their posts or messages
- Request to join groups they own
- Appear in their search results

**Mute** — soft boundary. The muted user's content is hidden from the muting user's feed and notifications, but the muted user is unaware of it. Useful for reducing noise without confrontation.

Both actions are accessible from any user's profile card or message via a `⋯` overflow menu. Neither action notifies the target user.

| Action | Stored in | Admin notified? | Reversible? |
|--------|-----------|-----------------|-------------|
| Block  | `user_blocks` table | No | Yes (unblock) |
| Mute   | `user_mutes` table  | No | Yes (unmute) |

> Blocking does not prevent a user from submitting a report against the person they blocked — the report flow remains fully available.

---

### F17 — Group-Level Moderation

**Priority: Must Have (MVP)**

All group moderation currently escalates to site admins, which does not scale. Group owners need a structured local moderation toolkit to handle day-to-day conduct within their specific group — independent of the platform admin team.

**Co-Moderator Role**

Group owners can promote any member to Co-Moderator. Co-Mods can:
- Issue verbal warnings (in-app notification to member)
- Mute a member in the group (24 hours)
- Remove a member from the group
- Pin or delete posts/messages
- View the group's moderation log

Co-Mods cannot ban users platform-wide — that requires escalation to admin.

**Strike System (within a group)**

| Strike | Action | Duration |
|--------|--------|----------|
| 1st | Verbal warning — DM from owner/mod | — |
| 2nd | Group mute | 24 hours |
| 3rd | Group suspension | 7 days |
| 4th | Permanent removal from group | Permanent |
| Escalate | Flagged to site admin | Admin discretion |

> Zero-tolerance violations (hate speech, slurs, harassment) bypass the strike system entirely and go directly to a platform-wide permanent ban via the admin panel.

**Moderation Log**

Every moderation action within a group is recorded in a group-level log visible to the owner and all co-mods:

```
group_mod_log
  id          UUID PRIMARY KEY
  group_id    UUID REFERENCES groups(id)
  moderator_id UUID REFERENCES users(id)
  target_id   UUID REFERENCES users(id)
  action      ENUM('warn','mute','suspend','remove','escalate')
  reason      TEXT
  duration    INTEGER  -- minutes, null for permanent
  created_at  TIMESTAMP
```

---

### F18 — Automated Content Pre-Screening

**Priority: Must Have (MVP)**

The current report system is entirely reactive — a violation must be seen and reported by another human before any action is taken. A lightweight automated pre-screening layer catches the most egregious content before it reaches other users.

**Implementation Approach**

Use the `bad-words` npm package (or a custom curated blocklist) as a server-side middleware layer on all user-generated content endpoints: messages, group descriptions, profile bios, and group names.

```
User submits content
        │
        ▼
Content passes through keyword filter (server-side)
        │
   ┌────┴────────────────┐
   │                     │
Clean                  Flagged
   │                     │
   ▼                     ▼
Stored + displayed    Severity check
                         │
              ┌──────────┴──────────┐
              │                     │
           Severe               Borderline
        (slurs / hate)        (mild profanity)
              │                     │
              ▼                     ▼
    Auto-rejected +          Held for admin
    user notified            review queue
    + admin alerted
```

**Severity Levels**

| Level | Examples | Action |
|-------|---------|--------|
| Critical | Racial slurs, targeted slurs | Auto-reject + immediate admin alert + auto-flag user account |
| High | Hate speech keywords | Auto-reject + queued for admin review |
| Medium | Heavy profanity | Warning shown to user; content posted but flagged |
| Low | Mild profanity | Allowed; no action unless reported |

**Tech Note:** The filter runs server-side in Express middleware before content reaches the database, so no flagged content is ever stored in its raw form if auto-rejected.

---

### F53 — Spam & Bot Detection

**Priority: Should Have**

The content filter (F18) catches hate speech and slurs but does nothing to detect spam behavior, ban-evading duplicate accounts, or bot-like activity patterns. As the platform grows, low-effort spam (join-and-post-a-link accounts, repeated duplicate registrations from banned users) will become a real problem. These checks run silently in the background and are invisible to legitimate users.

**Detection Signals**

| Signal | Threshold | Action |
|--------|-----------|--------|
| Group join velocity | > 5 groups joined in 10 minutes | Flag for review; soft-block further joins for 1 hour |
| Message post velocity | > 10 messages in 60 seconds across groups | Temporary 15-minute posting cooldown |
| New account group creation | Account < 24 hours old creating a group | Group held as "pending review" for 2 hours before going public |
| New account join requests | Account < 1 hour old sending 3+ join requests | Rate-limit join requests for 24 hours |
| Identical message content | Same message body posted to 3+ groups within 5 minutes | Auto-flag as potential spam; route to admin queue |
| Profile URL in bio (new account) | URL in bio within first 30 minutes of registration | Strip URL, notify user with explanation |
| Failed login velocity | > 10 failed logins from same IP in 5 minutes | IP-level lockout for 15 minutes; CAPTCHA required on next attempt |

**Ban Evasion Detection**

When a new account registers, the server runs a soft-match check against the banned users list using:
- Email address exact match and domain variants (e.g., `carlo@gmail.com` vs `carlo+spam@gmail.com`)
- Display name fuzzy match against banned display names (Fuse.js, threshold 0.85)
- Device fingerprint match (browser fingerprint collected via `FingerprintJS` on registration) against fingerprints of banned accounts

A match does not auto-ban — it flags the account as `suspected_ban_evasion` in the admin queue for human review within 24 hours. Until reviewed, the account is limited (cannot create groups, cannot message, can only browse).

**CAPTCHA**

`hCaptcha` (privacy-focused alternative to reCAPTCHA) is presented on:
- Registration
- Login after 3 consecutive failures
- Any IP-triggered lockout recovery
- Join requests from accounts less than 1 hour old

**Admin — Spam Queue**

A "Spam & Bots" sub-section in the Admin Panel (Moderation tab) shows:
- Flagged accounts with the triggering signal and timestamp
- Suspected ban evasion accounts with match score and matched banned account
- Batch actions: Clear flag (legitimate user), Suspend, or Ban

**Database**

```sql
-- Add to users table:
ALTER TABLE users ADD COLUMN spam_flag        BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN spam_flag_reason VARCHAR;
ALTER TABLE users ADD COLUMN suspected_evasion BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN device_fingerprint VARCHAR;
ALTER TABLE users ADD COLUMN post_cooldown_until TIMESTAMP;
ALTER TABLE users ADD COLUMN join_cooldown_until  TIMESTAMP;
```

**Tech Stack Addition:** `FingerprintJS` (open-source browser fingerprinting) on the registration page. `hCaptcha` npm package for CAPTCHA challenges.

---

### F19 — Role / Position Matching

**Priority: Should Have**

A D&D group doesn't just need "one more person" — they need a Cleric. A basketball team needs a Point Guard. A band needs a drummer. Generic headcount-based group capacity misses this entirely.

**Group Side — Open Roles**

Group creators can specify open roles/positions their group currently needs:

```json
{
  "open_roles": ["Healer", "Tank"],
  "role_category": "gaming"
}
```

Open roles display on the group card and page. When all roles are filled, the group can still accept general members or close applications.

**User Side — My Positions**

Users add their positions/roles to their profile per activity category:

| Category | Example Roles |
|----------|--------------|
| Video Games | Tank, Healer, DPS, Support, Flex, IGL, Entry Fragger |
| Sports | Goalkeeper, Forward, Midfielder, Point Guard, Center, Pitcher |
| Tabletop | DM/GM, Fighter, Rogue, Cleric, Wizard, Bard |
| Music | Guitar, Drums, Bass, Vocals, Keys, Producer |
| Other | Writer, Artist, Facilitator, Organizer |

**Discovery Matching**

Groups with open roles that match a user's listed positions are surfaced higher in their discovery feed with a **"You're a match for this role"** banner on the group card.

**Database Additions**

```sql
-- On groups table
open_roles   JSONB DEFAULT '[]'
role_category VARCHAR

-- New user_roles table
user_roles
  user_id   UUID REFERENCES users(id)
  category  VARCHAR
  role      VARCHAR
  PRIMARY KEY(user_id, category, role)
```

---

### F20 — Group Health & Activity Signals

**Priority: Must Have (MVP)**

Without activity signals, a user might join a group that looks great but has been completely dead for three months. This erodes trust in the platform.

**Activity States**

| State | Condition | Badge |
|-------|-----------|-------|
| 🟢 Active | Session in last 14 days | Green "Active" badge |
| 🟡 Slowing | No session in 15–30 days | Yellow "Slowing" badge |
| 🔴 Dormant | No session in 31–60 days | Red "Dormant" label |
| ⚫ Inactive | No session in 60+ days | Hidden from discovery by default |

**Owner Nudge Notifications**

- 30 days without a session: in-app + email nudge to owner — "Your group hasn't had a session in 30 days. Post one to stay visible in discovery."
- 60 days: warning — "Your group will be hidden from discovery in 7 days unless a session is posted."
- 67 days: group flagged as Inactive and removed from default search results (still accessible via direct link).

**Group Profile Additions**

- Last session date displayed on all group cards
- Session streak counter ("🔥 12-week streak")
- Total sessions completed (lifetime)
- Average attendance rate (RSVPs vs. actual attendance, calculated post-session)

---

### F21 — New Member Icebreaker Prompts

**Priority: Should Have**

Joining a group of established strangers is socially awkward — especially for newcomers or people rebuilding their social lives. A lightweight onboarding moment inside each group dramatically lowers the barrier for first interactions.

**How It Works**

When a user's membership is approved and they access the group for the first time:

1. A prompt appears at the top of the group feed: *"Welcome! Introduce yourself to the group — tell them one thing about yourself and why you joined."*
2. The user writes a short intro (max 280 characters)
3. The intro is pinned to the top of the group message board for 48 hours
4. All current group members receive a notification: *"Say hi to [Name] — they just joined the group!"*
5. After 48 hours the pin is removed but the post remains in the feed

**Group Owner Customization**

Owners can write a custom icebreaker question instead of the default, e.g.: *"What's your favorite D&D character class and why?"* or *"What's your go-to warm-up playlist?"*

This is stored as `welcome_prompt TEXT` on the `groups` table.

---

### F22 — Graduated Moderation System

**Priority: Must Have (MVP)**

The current design only has one outcome for any infraction — permanent platform ban. Real moderation requires a graduated response for lesser violations so that a single spam post doesn't carry the same consequence as a racial slur.

**Response Ladder**

| Level | Trigger | Action | Duration | Who |
|-------|---------|--------|----------|-----|
| 1 | Minor rule break | Verbal warning | — | Group mod or admin |
| 2 | Repeat minor or moderate violation | Temporary mute (group or platform) | 24 hrs – 7 days | Admin |
| 3 | Serious violation (non-zero-tolerance) | Temporary platform suspension | 7–30 days | Admin |
| 4 | Severe or repeated serious violations | Permanent ban + blacklist | Permanent | Admin |
| ZT | Zero-tolerance violation (slurs, hate speech, harassment) | **Skip all levels → Permanent ban** | Permanent | Admin |

**Database Addition**

```sql
-- Add to users table
suspension_until  TIMESTAMP  -- NULL means not suspended

-- New warnings table
user_warnings
  id          UUID PRIMARY KEY
  user_id     UUID REFERENCES users(id)
  issued_by   UUID REFERENCES users(id)
  reason      TEXT
  level       INTEGER CHECK(level BETWEEN 1 AND 4)
  expires_at  TIMESTAMP
  created_at  TIMESTAMP
```

**Login Check**

On every login attempt, the server checks `suspension_until`. If it is in the future, the user is shown a suspension screen with the reason, the expiry date, and a link to the Community Standards.

---

### F52 — Moderation Appeal Process

**Priority: Should Have**

The current moderation system leaves users with no recourse beyond "admin may optionally whitelist." For graduated actions — warnings and temporary suspensions — users who believe the action was unjust have no structured way to contest it. Without a defined appeal process, moderation feels arbitrary, erodes trust, and risks legitimate users leaving the platform. Zero-tolerance bans (hate speech, sexual abuse, etc.) remain non-appealable by policy.

**What can and cannot be appealed**

| Action | Appealable? | Notes |
|--------|------------|-------|
| Informal warning (F22 Level 1) | No | Lowest tier; no formal record |
| Formal warning (F22 Level 2) | Yes | 7-day appeal window |
| Temporary suspension (F22 Level 3) | Yes | 7-day appeal window from issue date |
| Permanent ban (zero-tolerance) | No | Policy is final; no appeal path |
| Group-level removal by owner | No | Owner's discretion within their group |

**Appeal Flow**

```
User receives a warning or suspension notification
        │
        ▼
Notification includes: "If you believe this was issued in error,
you may submit an appeal within 7 days → [Submit Appeal]"
        │
        ▼
Appeal form (/settings/appeal or linked from suspension screen):
  • Pre-filled: action type, date issued, issuing admin (anonymised as "RollCall Team")
  • Required: "Please explain why you believe this action was made in error" (min 50 chars)
  • Optional: upload supporting screenshot or context (image, max 5 MB)
  • Checkbox: "I confirm this information is accurate to the best of my knowledge"
  • [Submit Appeal]
        │
        ▼
Server actions:
  1. Appeal record created, linked to the original moderation action
  2. Admin notified of new appeal in Admin Panel → Moderation tab
  3. User receives confirmation: "Your appeal has been received.
     We will review it within 5 business days."
        │
        ▼
Admin reviews appeal (target: 5 business days):
  ┌──────────────────────────────────────────┐
  │  Uphold action     │  Overturn action    │
  │  No change         │  Warning removed    │
  │  User notified     │  Suspension lifted  │
  │  with reason       │  User notified      │
  └──────────────────────────────────────────┘
        │
        ▼
One appeal permitted per moderation action.
A second appeal for the same action is automatically rejected.
```

**User Protections During Appeal**

- A suspended user's appeal window runs from the date the suspension was issued, not the date they first see the notification (in case they were offline)
- A suspension is not automatically lifted while an appeal is pending — it remains in effect unless the admin overturns it
- The admin who originally issued the action should not be the one reviewing the appeal (separation of reviewers, enforced via UI — the original admin's name is shown and the system flags if the same admin attempts to resolve)

**Admin Panel — Appeals Queue**

A new "Appeals" sub-section appears in the Moderation tab of the Admin Panel, visible only to admins. It shows:
- Open appeals sorted by deadline (soonest first)
- The original action details, the user's appeal text, and any attached evidence
- Actions: Uphold (with required reason text) or Overturn
- Overdue appeals (past 5 business days) are highlighted in amber as a nudge

**Database**

```sql
moderation_appeals
  id                UUID PRIMARY KEY
  user_id           UUID REFERENCES users(id)
  action_type       ENUM('warning','suspension')
  warning_id        UUID REFERENCES user_warnings(id)
  suspension_until  TIMESTAMP            -- copied from users table at time of appeal
  appeal_text       TEXT NOT NULL
  evidence_url      VARCHAR
  status            ENUM('pending','upheld','overturned') DEFAULT 'pending'
  reviewed_by       UUID REFERENCES users(id)
  review_notes      TEXT
  submitted_at      TIMESTAMP NOT NULL
  resolved_at       TIMESTAMP
  deadline_at       TIMESTAMP NOT NULL   -- submitted_at + 7 days
```

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appeals` | Submit a moderation appeal |
| GET | `/api/appeals/me` | Get current user's appeal history |
| GET | `/api/admin/appeals` | List all open appeals (admin only, sorted by deadline) |
| PUT | `/api/admin/appeals/:id/uphold` | Uphold the original action (body: `{ reason }`) |
| PUT | `/api/admin/appeals/:id/overturn` | Overturn action, lift suspension or remove warning |

---

### F23 — Multilingual & Accessibility Support

**Priority: Should Have**

RollCall is for everyone — and language and ability are real barriers that the current design ignores.

**Language Support**

- Language field on user profiles: "I speak: [multi-select from list]"
- Language filter on group discovery (already partially specced — fully implement here)
- Group cards display the primary language if it is not English
- Future: UI translation via i18next (React) — ship English only for MVP, architect for i18n from day one (use `t()` wrapper functions on all strings)

**Accessibility Tags — Local Groups**

When creating a local group, owners can check accessibility tags for their usual meeting venue:

- ♿ Wheelchair accessible
- 🅿️ Free parking nearby
- 🚌 Public transit accessible
- 🔊 Hearing loop available
- 🐕 Service animals welcome
- 💡 Low sensory environment (quiet, low-light option available)

Tags are displayed on the group card and filterable in discovery.

**Neurodivergent-Friendly Groups**

Groups can self-tag as "Neurodivergent-Friendly" — indicating the group is run with extra patience, clear communication, and no pressure to socialize beyond the activity. This tag is searchable and filter-able.

**Platform-Level Accessibility**

- All interactive elements have `aria-label` attributes (already implemented in React scaffold)
- Keyboard navigation throughout (Tab, Enter, Space for all controls)
- Color contrast meets WCAG AA (4.5:1) in both dark and light themes
- Font size adjustable via browser settings (no fixed `px` font sizes — use `rem`)
- Dyslexia-friendly font toggle in user settings (switches to OpenDyslexic)

---

### F24 — Profile Trust Signals

**Priority: Must Have (MVP)**

A reputation score alone isn't enough for a new user deciding whether to join a stranger's group. Layered trust signals make profiles feel credible and transparent.

**Trust Signal Stack**

| Signal | Description | Where Displayed |
|--------|-------------|-----------------|
| ✅ Verified Email | Email confirmation completed | Profile badge |
| 📅 Member Since | Account creation date | Profile header |
| 🎯 Sessions Attended | Verified via post-session RSVP confirmation | Profile stats |
| ⭐ Reliability Score | Aggregate of post-session peer ratings | Profile + group member list |
| 💬 Response Rate | % of join requests responded to within 48h (owners) | Group owner card |
| 🏅 Tenure Badges | Auto-awarded at 3mo, 6mo, 1yr, 2yr of membership | Profile |
| 👥 Groups Completed | Count of groups where they attended 3+ sessions | Profile stats |
| ⚠️ Conduct Flag | Shown when user has 2 or more active warnings in the last 90 days | Profile header + group member card + join request panel — visible to **all logged-in users** |

**Conduct Flag — Details**

The conduct flag is a visual indicator that a user has a recent pattern of rule-breaking, giving other members and owners the information they need to make informed decisions.

- **Trigger:** `conduct_flag_count ≥ 2` (count of active, non-expired warnings in the last 90 days)
- **Display:** An amber ⚠️ icon next to the user's avatar on their profile page, group member list, and join request card
- **Tooltip (hover/tap):** *"This member has received multiple conduct warnings in the last 90 days."* — no specific violations are named; just the frequency signal
- **Auto-clears:** When `conduct_flag_count` drops below 2 (e.g. warnings expire after their set duration), the icon disappears automatically — no admin action required
- **Not shown on own profile:** Users see a private banner in their Settings → Account instead: *"You have X active conduct warnings. Conduct flags are visible to other members until your warnings expire."*
- **Trust Score impact:** Each active warning reduces the trust score by 5 points (capped at −15 for 3+ warnings)

**Database Additions**

```sql
-- Add to users table
email_verified     BOOLEAN DEFAULT false
email_verified_at  TIMESTAMP
sessions_attended  INTEGER DEFAULT 0
response_rate      DECIMAL DEFAULT 100.0  -- percentage
conduct_flag_count INTEGER DEFAULT 0      -- active warnings in last 90 days; auto-recalculated nightly
```

**Trust Score Calculation**

A composite score (0–100) displayed as a colored ring around the avatar:

```
Trust Score =
  (reliability_score / 5 × 40)    -- 40% weight: peer ratings
+ (min(sessions_attended,20)/20 × 30)  -- 30% weight: attendance history
+ (email_verified × 20)           -- 20% weight: verified email
+ (response_rate / 100 × 10)      -- 10% weight: owner responsiveness
- (min(conduct_flag_count, 3) × 5) -- conduct penalty: −5 per active warning, max −15
```

Shown as: 🟢 80–100 (Trusted) · 🟡 50–79 (Established) · 🔴 0–49 (New/Unknown)

---

### F25 — In-Person Safety Features

**Priority: Must Have (MVP)**

Local, face-to-face meetups carry safety risks that online-only platforms don't have to address. For RollCall to be genuinely inclusive and safe for groups that meet in person, these features are non-negotiable.

**Safe Meeting Guidelines (Public Page)**

A dedicated `/safety` page linked from every local group page, the footer, and the first-session event notification. Key guidance:

- First meetup should always be in a public place (coffee shop, library, park)
- Share your plans with a trusted person before attending
- Trust your instincts — you are never obligated to stay
- Report any concerns to RollCall admins immediately

**"Meet in Public First" Recommendation Badge**

Local groups with fewer than 3 completed sessions display a **"Meet in Public First"** soft banner on their group page reminding new members of the recommendation.

**Venue Accessibility & Safety Info**

Group owners can optionally tag their usual meeting location with:
- Location type: Fully Public / Semi-Public (e.g., private room in library) / Private Residence
- Groups meeting at a **Private Residence** display a yellow advisory: *"This group meets at a private location. Review our Safe Meeting Guidelines before attending."*

**Optional Safe Check-In**

Available for any in-person event. A user can:
1. Toggle "Safe Check-In" on an event RSVP
2. Set an optional trusted contact (name + email — not stored in DB after the event)
3. On the event start time, they receive a push notification with a "I'm safe ✅" button
4. If not confirmed within 2 hours of event start, their trusted contact receives an automated email: *"[Name] set up a safe check-in for a RollCall meetup today and hasn't confirmed they're safe. You may want to check in with them."*

**Verified Public Venue Tag**

Admin-grantable badge for groups that submit proof they consistently meet at a verified public location (e.g., a library, game store, community center). Increases trust score for the group and its owner.

**Silent Safety Alarm**

For users who need more than a check-in, RollCall provides a discreet silent alarm that can be triggered in under 3 seconds without drawing attention. See **F41 — Silent Safety Alarm** for the full specification, including trusted contact setup, activation methods (triple-tap logo, shake gesture), auto-escalation timer, discreet UI principles, and legal notes.

---

### F95 — Outdoor Activity Safety Prerequisites

**Priority: Must Have**

Physical and outdoor group activities carry real safety risks that digital platforms can inadvertently amplify. A person who cannot swim joining a kayaking trip, or a beginner attempting an advanced climbing route, creates liability for the organiser and danger for themselves. Without a gate, well-intentioned groups either over-rely on self-policing or add friction manually (asking every join requester about their experience). An experience-level gate enforced at join time removes that burden from organisers while protecting participants who may not self-assess accurately.

This feature applies to **outdoor and physical activity groups** — categories such as Hiking, Rock Climbing, Cycling, Water Sports, Martial Arts, and any other group type the owner designates as requiring a physical or technical skill baseline.

---

**Scope: Affected Group Categories**

The safety gate is automatically offered to group owners when the group's primary category is one of the following (extensible by admin):

| Category | Example Groups |
|---|---|
| Hiking & Trekking | Trail runs, multi-day backpacking |
| Rock Climbing & Bouldering | Indoor walls, outdoor crags |
| Water Sports | Kayaking, surfing, open-water swimming, sailing |
| Cycling | Road cycling, mountain biking, BMX |
| Martial Arts & Combat Sports | Sparring, grappling sessions |
| Winter Sports | Backcountry skiing, snowboarding, ice climbing |
| Aerial Activities | Paragliding, skydiving, trapeze |
| Equestrian | Trail riding, jumping |

Owners of groups in any other category can also manually enable the safety gate from Group Settings → Safety.

---

**Experience Level System**

RollCall uses a **four-tier experience scale** that applies uniformly across all skill-gated features (F95, F3, F94 Part 4):

| Level | Code | Definition |
|---|---|---|
| Beginner | `beginner` | Little or no prior experience; learning fundamentals |
| Intermediate | `intermediate` | Comfortable with core skills; some independent practice |
| Advanced | `advanced` | Proficient; handles complex or challenging scenarios |
| Expert | `expert` | Instructor/competitive level; extensive proven track record |

**Profile Setting**: Users set their experience level **per category** in their profile under Settings → Skills & Experience. A user may be Intermediate at Hiking and Beginner at Rock Climbing simultaneously. Experience levels are self-reported but tied to the user's public profile and visible to group owners.

---

**Group Owner Configuration**

In Group Settings → Safety, the owner specifies:

| Setting | Options | Notes |
|---|---|---|
| Minimum experience level | Beginner / Intermediate / Advanced / Expert | Default: none (gate disabled) |
| Skill gate message | Free text (up to 280 chars) | Shown to users who fail the gate. Should explain what skill is needed and why. Example: "This route includes Grade 4 rapids — paddlers must be comfortable with Class III water before joining." |
| Allow owner override | Yes / No (default Yes) | Owner can approve a user below the minimum individually |

If no minimum is set, the group behaves as any standard group and F95 does not apply.

---

**Join Flow — Gate Behaviour**

When a user clicks "Join" or "Request to Join" on a skill-gated group:

1. **System checks**: Does the user have a profile experience level set for this group's category?
2. **If level meets or exceeds minimum**: Join proceeds normally (F48 flow).
3. **If level is below minimum**: The standard join button is replaced by a **gate notice**:

```
┌──────────────────────────────────────────────────────────────┐
│  ⛔  Skill Level Requirement                                  │
│                                                              │
│  This group requires at least Intermediate experience        │
│  in Water Sports.                                            │
│                                                              │
│  Your current level: Beginner                                │
│                                                              │
│  "This route includes Grade 4 rapids — paddlers must be      │
│   comfortable with Class III water before joining."          │
│                                                              │
│  [ Update my experience level ]   [ OK, understood ]        │
└──────────────────────────────────────────────────────────────┘
```

- **"Update my experience level"** opens the user's Settings → Skills & Experience in a side drawer, so they can correct their profile if it is out of date, then reattempt joining.
- **"OK, understood"** dismisses the modal. The user is **not** added to the group and **no join request is submitted**.
- The gate notice does **not** prevent the user from viewing the group's public page or public calendar — only from joining.

4. **If user has no experience level set for the category**: A softer prompt appears:

```
┌──────────────────────────────────────────────────────────────┐
│  📋  Experience Level Required                               │
│                                                              │
│  This group requires at least Intermediate experience        │
│  in Water Sports. You haven't set your level for this        │
│  category yet.                                               │
│                                                              │
│  [ Set my experience level ]   [ Cancel ]                   │
└──────────────────────────────────────────────────────────────┘
```

Setting an experience level that meets the minimum immediately unlocks the join flow without leaving the page.

---

**Owner Override**

If "Allow owner override" is enabled (default), the group owner and co-moderators see a **manual approval option** in the join requests panel for users blocked by the gate:

```
⚠️  Carlo R. has requested to join, but their experience level
    (Beginner) is below your minimum (Intermediate).

    [ Approve anyway ]   [ Decline ]   [ Send message ]
```

Approving overrides the gate for this user only. The override is logged in group moderation history (F17). The system does not prevent overrides, but records them for accountability.

---

**Discover Page Integration**

On group cards and the group detail page, the experience minimum is surfaced next to the skill level badge:

```
🥾 Hiking · Intermediate+  ·  ⛔ Skill gate active
```

Users whose experience level is below the minimum see the group card with a **muted join button** and a tooltip: *"Your experience level doesn't meet this group's minimum. Tap to learn more."* The card is still fully visible and browsable — only the join action is blocked.

The Discover filter panel (F3) lets users filter by their own experience level to surface only groups they are eligible to join immediately.

---

**Database**

```sql
-- Extend groups table
ALTER TABLE groups
  ADD COLUMN skill_gate_enabled    BOOLEAN DEFAULT false,
  ADD COLUMN skill_gate_level      ENUM('beginner','intermediate','advanced','expert'),
  ADD COLUMN skill_gate_message    VARCHAR(280),
  ADD COLUMN skill_gate_override   BOOLEAN DEFAULT true;

-- Per-category experience levels on the user profile
user_experience_levels
  id             UUID PRIMARY KEY
  user_id        UUID REFERENCES users(id)
  category_slug  VARCHAR NOT NULL        -- matches group category taxonomy
  level          ENUM('beginner','intermediate','advanced','expert') NOT NULL
  updated_at     TIMESTAMP NOT NULL
  UNIQUE(user_id, category_slug)

-- Override log
skill_gate_overrides
  id             UUID PRIMARY KEY
  group_id       UUID REFERENCES groups(id)
  user_id        UUID REFERENCES users(id)
  overridden_by  UUID REFERENCES users(id)   -- owner or co-mod who approved
  gate_level     ENUM('beginner','intermediate','advanced','expert')
  user_level     ENUM('beginner','intermediate','advanced','expert')
  created_at     TIMESTAMP NOT NULL
```

---

**API Endpoints**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/me/experience` | Auth required | Returns all the user's per-category experience levels |
| PUT | `/api/users/me/experience/:category` | Auth required | Set or update experience level for a category |
| GET | `/api/groups/:id/skill-gate` | Public | Returns gate status, minimum level, and gate message for a group (no personal data) |
| POST | `/api/groups/:id/members` | Auth required | Standard join — server enforces gate check server-side before processing |
| POST | `/api/groups/:id/join-requests` | Auth required | Standard request flow — server enforces gate check before creating request |
| POST | `/api/groups/:id/skill-gate/override/:userId` | Owner / co-mod | Approve a below-minimum join request; logs to skill_gate_overrides |

**Important**: The gate check is enforced **server-side** on every join/request endpoint, not only in the UI. A user bypassing the frontend (e.g., via direct API call) will receive a `403 Forbidden` with body `{ "error": "skill_gate_blocked", "required": "intermediate", "current": "beginner" }`.

---

**Interaction with F48 (Join Flow) and F50 (Waitlist)**

- Gate check runs **before** the F48 join/request flow begins.
- If a user joins a waitlist (F50) and their experience level is below the minimum, they are added to a **gated waitlist** — a separate queue visible to the owner. Approval requires both an open slot and an owner override.
- Waitlist members already on the list when an owner activates the skill gate are not retroactively removed; they remain on the waitlist but are flagged in the owner panel.

---

### F96 — User Experience Feedback & NPS System

**Priority: Must Have**

RollCall is launching in a real community with real people — feedback is the primary steering mechanism during the pilot period. Without a structured way to collect it, the platform owner is flying blind. This feature creates three feedback touchpoints that fire automatically at key moments in the user journey, plus a persistent in-app feedback widget for any-time responses, and an admin dashboard view to act on what's collected.

The goal is not to gather data for data's sake — every feedback loop has a specific decision it informs: onboarding quality, session experience quality, and long-term platform satisfaction.

---

#### Touchpoint 1 — Post-Onboarding Check-in (24 hours after signup)

**Trigger**: 24 hours after `onboarding_progress.completed_at` is set (or 24 hours after account creation if onboarding was skipped).

**Delivery**: In-app notification (bell icon) + email.

**Format**: 2-question micro-survey, takes under 60 seconds.

```
Subject: "How's RollCall going so far?"

Q1 (required): "Did you find a group worth joining?"
  ● Yes — I joined or requested to join one
  ○ Not yet — I saw some but wasn't ready
  ○ Nothing matched my interests
  ○ I haven't had a chance to look yet

Q2 (optional, shown based on Q1 answer):
  If "Nothing matched" → "What are you looking for that we didn't have?"
                          [free text, 280 chars]
  If "Not yet" / "Haven't looked" → "What would help you take the next step?"
                                     [free text, 280 chars]
  If "Yes" → "Anything we could have made easier?"
              [free text, 280 chars]

[ Submit ]  [ Maybe later — remind me tomorrow ]
```

"Maybe later" re-queues the notification for 24 hours. After two skips the survey is silently dropped — no more prompts for this touchpoint.

---

#### Touchpoint 2 — Post-Session Feedback (after first attended session)

**Trigger**: 2 hours after a session the user RSVPed "Going" to has its scheduled end time.

**Delivery**: In-app notification + email. Sent only for the user's **first attended session** (subsequent sessions use the existing F9 post-session rating flow for group/host rating — this touchpoint is specifically about the RollCall platform experience).

**Format**: 3-question survey.

```
Subject: "How was your first session?"

Q1 (required): How was your experience using RollCall to coordinate the session?
  ⭐⭐⭐⭐⭐  (1–5 star tap rating — required)

Q2 (conditional — shown if Q1 ≤ 3 stars):
  "What felt off?" (free text, 280 chars)

Q3 (optional for all):
  "Is there anything RollCall could do better to support your group?"
  (free text, 280 chars)

[ Submit ]   [ Skip ]
```

Skip is always available for this touchpoint — no re-queue.

---

#### Touchpoint 3 — NPS Survey (Day 14 and Day 60)

**Trigger**: Exactly 14 days after account creation (first NPS); 60 days after account creation (second NPS, only sent if user is still active — had at least one login in the last 14 days).

**Delivery**: Email only (not in-app, to reduce notification fatigue).

**Format**: Standard NPS question + one follow-up.

```
Subject: "Quick question from the RollCall team"

Q1 (required):
  On a scale of 0–10, how likely are you to recommend RollCall
  to a friend who's looking for a hobby group?

  [  0  ][  1  ][  2  ][  3  ][  4  ][  5  ][  6  ][  7  ][  8  ][  9  ][ 10 ]
   Not at all likely                                          Extremely likely

Q2 (required — unlocks after Q1):
  Detractors (0–6): "What's the main reason for your score?"
  Passives (7–8):   "What's one thing that would make RollCall better for you?"
  Promoters (9–10): "What's the biggest reason you'd recommend us?"
  [free text, 500 chars]

[ Submit ]
```

The email contains an unsubscribe link for NPS emails specifically — users can opt out of NPS without affecting session reminders or other platform notifications.

---

#### Touchpoint 4 — Persistent In-App Feedback Widget

A small **"Share feedback"** button (💬 icon) is pinned to the bottom-right corner of every page, always accessible. It opens a lightweight drawer:

```
┌─────────────────────────────────────────────────────────┐
│  💬  Share feedback with the RollCall team              │
│                                                         │
│  What's on your mind?                                   │
│  ○ Something's broken                                   │
│  ○ I have a feature idea                                │
│  ○ Something's confusing                                │
│  ○ I just want to say something                         │
│                                                         │
│  [ Tell us more... (optional)              ]            │
│                                                         │
│  Attach a screenshot?   [ Choose file ]                 │
│                                                         │
│  [ Send feedback ]                                      │
│  "We read every submission."                            │
└─────────────────────────────────────────────────────────┘
```

- Feedback is tagged with the current page URL and user ID automatically (never shown to the user — just useful for the admin).
- Screenshot attachment is optional and capped at 5 MB.
- "We read every submission" is a promise — the admin Feedback tab (see below) ensures nothing gets lost.
- The widget does not show a loading state or success animation — it simply closes after submit with a single toast: *"Thanks — we got it."*

---

#### Admin Feedback Dashboard (F15 Extension — New Tab)

A new **"Feedback"** tab is added to the F15 Admin Control Panel, visible to all admin accounts (not restricted to platform owner).

**Tab sections:**

**Overview cards (top row):**
- Post-onboarding response rate (% who answered Touchpoint 1)
- "Nothing matched" rate (% of T1 respondents who said no groups matched)
- Average post-session rating (Touchpoint 2 star average)
- Day-14 NPS score (calculated as % Promoters − % Detractors)
- Day-60 NPS score

**Response feed (main panel):**

A chronological list of all feedback submissions with columns:
- Timestamp
- Touchpoint type (Onboarding / Session / NPS / Widget)
- User (display name, linked to profile — admins only)
- Response summary (Q1 answer for structured responses; first 120 chars for free text)
- Full response (expandable inline)
- Screenshot (thumbnail if attached — Widget type only)
- Status: **New** / **Reviewed** / **Actioned**

Admins can mark any submission as Reviewed (read) or Actioned (a change was made as a result). Actioned items can include a private admin note.

**Filter controls:** Touchpoint type · Status · Date range · Star rating (T2) · NPS score range

**Export:** CSV export of all responses, unfiltered or with active filters applied.

---

#### Database

```sql
feedback_submissions
  id               UUID PRIMARY KEY
  user_id          UUID REFERENCES users(id)
  touchpoint       ENUM('onboarding','post_session','nps_14','nps_60','widget') NOT NULL
  submitted_at     TIMESTAMP NOT NULL
  page_url         VARCHAR                           -- widget only; auto-captured
  q1_answer        VARCHAR                           -- structured answer or star rating
  q2_answer        TEXT                              -- free text follow-up
  q3_answer        TEXT                              -- post-session optional field
  nps_score        INTEGER CHECK (nps_score BETWEEN 0 AND 10)  -- NPS touchpoints only
  widget_category  ENUM('bug','idea','confusing','other')      -- widget only
  screenshot_url   VARCHAR                           -- widget only; Cloudinary URL
  status           ENUM('new','reviewed','actioned') DEFAULT 'new'
  admin_note       TEXT                              -- internal note when actioned
  reviewed_by      UUID REFERENCES users(id)         -- admin who reviewed/actioned
  reviewed_at      TIMESTAMP

feedback_nps_opt_outs
  user_id          UUID PRIMARY KEY REFERENCES users(id)
  opted_out_at     TIMESTAMP NOT NULL
```

---

#### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/feedback` | Auth required | Submit any feedback touchpoint; body: `{ touchpoint, q1_answer, q2_answer?, q3_answer?, nps_score?, widget_category?, screenshot? }` |
| GET | `/api/admin/feedback` | Admin | List all feedback submissions; supports filter params |
| PUT | `/api/admin/feedback/:id` | Admin | Update status (reviewed/actioned) and add admin note |
| GET | `/api/admin/feedback/summary` | Admin | Returns overview card metrics (response rates, NPS scores, avg star rating) |
| POST | `/api/feedback/nps/opt-out` | Auth required | Opt out of NPS email surveys |
| DELETE | `/api/feedback/nps/opt-out` | Auth required | Re-subscribe to NPS emails |

---

### F97 — Geographic Expansion Waitlist & Admin Demand Alerts

**Priority: Must Have (Pilot)**

When a non-PBC user hits the local activity gate (F48), they can join a waitlist for their county. As waitlist entries accumulate, the system tracks demand by county and automatically alerts admins when any county crosses the 20-user threshold — turning the gate from a passive message into an active expansion signal. Admins can then review demand, approve a county, and notify everyone waiting there simultaneously.

---

#### How County Is Determined

A user's county is derived from their registered `zip_code` using a **static ZIP → county lookup table** stored in the database. This is a one-time seed migration of the USPS ZIP code dataset — no geocoding API call is needed at runtime.

```sql
zip_county_lookup
  zip_code    VARCHAR(10) PRIMARY KEY
  county      VARCHAR NOT NULL       -- e.g. "Broward County"
  state       VARCHAR(2) NOT NULL    -- e.g. "FL"
  city        VARCHAR                -- primary city for the ZIP
```

This table is seeded once and never mutated by the application. A ZIP not found in the table defaults to `county = 'Unknown'` and is recorded but does not trigger threshold alerts.

---

#### Waitlist Entry

When a user clicks "Join the waitlist for [County]" in the F48 gate notice:

1. A `geo_waitlist` record is created (idempotent — duplicate clicks are ignored via `UNIQUE(user_id, county)`).
2. The county's total waitlist count is incremented in `geo_waitlist_counts` (a denormalised counter table updated via a trigger — avoids a `COUNT(*)` query on every gate page load).
3. If the new count equals exactly **20**, an admin alert is fired (see Threshold Alert below).
4. If the count is already ≥ 20 and a new user joins, no duplicate alert is sent — the admin has already been notified.
5. The user's `geo_waitlist` record is returned in the F48 gate UI so the gate notice shows the "already on waitlist" variant on their next visit.

---

#### Threshold Alert — Admin Notification at 20

When `geo_waitlist_counts.count` for a county reaches 20 for the first time:

**In-app notification** (Admin Control Panel bell + red badge):
```
🗺️  Expansion demand alert
Broward County has reached 20 waitlisted users.
[ Review waitlist → ]
```

**Email to platform owner** (sent via the same BullMQ email queue as F69):
```
Subject: 🗺️ RollCall expansion signal — Broward County

20 users in Broward County are waiting to access local groups.

View the full demand breakdown in your admin panel:
[ Open Expansion Demand tab → ]

You can approve Broward County to immediately:
  • Add all Broward ZIPs to the active region list
  • Notify all 20 waitlisted users by email
```

The threshold of 20 is a server-side configuration constant (`GEO_WAITLIST_THRESHOLD`, default 20) — adjustable without code changes.

Additional milestone alerts fire at 50 and 100 if the county has not yet been approved, using the same format. No further alerts beyond 100.

---

#### Admin Control Panel — Expansion Demand Tab (F15 Extension)

A new **"Expansion Demand"** tab is added to the F15 Admin Control Panel alongside the existing Feedback tab.

**Overview cards (top row):**
- Total counties with waitlisted users
- Counties at or above threshold (20+) — highlighted in amber
- Total waitlisted users across all counties
- Counties already approved and active

**Demand table (main panel):**

| County | State | Waitlist Count | Status | Threshold | Action |
|---|---|---|---|---|---|
| Broward County | FL | 47 | 🟠 Above threshold | ≥ 20 | [ Approve ] |
| Miami-Dade County | FL | 31 | 🟠 Above threshold | ≥ 20 | [ Approve ] |
| Orange County | FL | 8 | 🟡 Building | < 20 | — |
| Palm Beach County | FL | — | ✅ Active | — | — |

Rows sorted by waitlist count descending. Counties with zero waitlisted users are not shown. Currently active counties (PBC at pilot launch) show as ✅ Active with no action available.

**"Approve" action flow:**

Clicking Approve on a county opens a confirmation modal:

```
┌──────────────────────────────────────────────────────────────────┐
│  Approve Broward County for local group access?                  │
│                                                                  │
│  This will:                                                      │
│  ✓ Add all Broward County ZIP codes to the active region list    │
│  ✓ Send an email to all 47 waitlisted users in Broward County    │
│  ✓ Allow Broward County residents to join local groups           │
│                                                                  │
│  This action cannot be undone without a config change.           │
│                                                                  │
│  Preview notification email:                                     │
│  "RollCall is now live in Broward County! Local groups near      │
│   you are now open to join."                                     │
│                                                                  │
│  [ Confirm — Approve Broward County ]   [ Cancel ]              │
└──────────────────────────────────────────────────────────────────┘
```

On confirmation:

1. All ZIP codes for the approved county are added to `approved_regions` in the database (the server's `PILOT_ZIP_ALLOWLIST` is rebuilt from this table at runtime — no redeploy needed).
2. All users in `geo_waitlist` for that county receive an email notification (BullMQ job, same queue as F69).
3. The county's row in `geo_waitlist_counts` is marked `approved = true`.
4. The action is logged in `admin_audit_log`.

---

#### Waitlist User Notification Email

Sent to every user in `geo_waitlist` for an approved county:

```
Subject: 🎉 RollCall is now live in [County]!

Hi [Display Name],

You joined the waitlist for [County] — and we're excited
to tell you: local groups in your area are now open.

Head to RollCall and join a local group today:

  [ Find local groups near me → ]

Thanks for your patience — and for helping us know
where to go next.

— The RollCall team
```

The email links directly to Discover with a local-group filter and the user's county pre-applied as the proximity search origin.

---

#### Database

```sql
-- Waitlist entries (one per user per county)
geo_waitlist
  id          UUID PRIMARY KEY
  user_id     UUID REFERENCES users(id)
  county      VARCHAR NOT NULL
  state       VARCHAR(2) NOT NULL
  zip_code    VARCHAR(10) NOT NULL    -- user's registered ZIP at time of joining
  joined_at   TIMESTAMP NOT NULL
  notified_at TIMESTAMP               -- set when approval email is sent
  UNIQUE(user_id, county)

-- Denormalised counter — updated via trigger on geo_waitlist INSERT
geo_waitlist_counts
  county      VARCHAR PRIMARY KEY
  state       VARCHAR(2) NOT NULL
  count       INTEGER DEFAULT 0
  approved    BOOLEAN DEFAULT false
  approved_at TIMESTAMP
  approved_by UUID REFERENCES users(id)   -- admin who approved

-- Approved regions (source of truth for PILOT_ZIP_ALLOWLIST at runtime)
approved_regions
  zip_code    VARCHAR(10) PRIMARY KEY
  county      VARCHAR NOT NULL
  state       VARCHAR(2) NOT NULL
  approved_at TIMESTAMP NOT NULL
  approved_by UUID REFERENCES users(id)
```

The server builds its effective `PILOT_ZIP_ALLOWLIST` by querying `approved_regions` on startup (and caching in memory with a 5-minute TTL). Palm Beach County ZIPs are seeded into `approved_regions` as part of the initial database migration.

---

#### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/geo-waitlist` | Auth required | Join the waitlist for the user's county (derived from their zip_code); idempotent |
| GET | `/api/geo-waitlist/status` | Auth required | Returns whether the current user is on the waitlist and the count for their county |
| GET | `/api/admin/geo-waitlist` | Admin | List all counties with waitlist counts, sorted by count desc |
| POST | `/api/admin/geo-waitlist/:county/approve` | Platform owner | Approve a county; adds ZIPs to approved_regions; triggers notification emails |
| GET | `/api/admin/geo-waitlist/:county/users` | Platform owner | List all waitlisted users in a county (for review before approving) |

---

### F98 — Data Protection, Anti-Scraping & Access Control

**Priority: Must Have**

RollCall's community data — member rosters, session histories, group schedules, user profiles — is the platform's primary competitive asset. If a competitor can scrape it, they can seed their own platform with your community's structure without building anything. This feature defines the authentication wall, the anti-scraping layer, and the explicit non-exportability of contact and roster data that prevents the platform from being hollowed out by copycats or bulk harvesters.

---

#### Visibility Tiers — What Requires Login

Every meaningful piece of data on RollCall is behind an authentication wall. The distinction between logged-out and logged-in is significant; the distinction between member and non-member is also enforced.

| Content | Anonymous (logged-out) | Logged-in, non-member | Group member |
|---|---|---|---|
| Group name, category, city | ✅ Visible (SEO teaser) | ✅ Visible | ✅ Visible |
| Group description (truncated to 120 chars) | ✅ Visible (teaser only) | ✅ Full | ✅ Full |
| Full group description | ❌ Login required | ✅ Visible | ✅ Visible |
| Schedule / session dates | ❌ Login required | ✅ Visible | ✅ Visible |
| Session notes / descriptions | ❌ Login required | ✅ Visible | ✅ Visible |
| Member count (e.g. "8 members") | ✅ Visible | ✅ Visible | ✅ Visible |
| Member roster (display names) | ❌ Login required | ❌ Members only | ✅ Display names only |
| Member email addresses | ❌ Never | ❌ Never | ❌ Never (see below) |
| Group chat / message board | ❌ Login required | ❌ Members only | ✅ Visible |
| Full group calendar | ❌ Login required | ✅ (if calendar_visibility = public) | ✅ Visible |
| User profiles | ❌ Login required | ✅ Public fields only | ✅ Public fields only |
| Trust score, badges, session count | ❌ Login required | ✅ Visible | ✅ Visible |
| Linked accounts (Steam, Discord, etc.) | ❌ Login required | ✅ Visible | ✅ Visible |
| Email address (any user's) | ❌ Never | ❌ Never | ❌ Never |
| ZIP code (any user's) | ❌ Never | ❌ Never | ❌ Never |

**The rule for anonymous visitors:** Group name, category, city, a 120-character description teaser, and approximate member count. Everything else is behind a login/signup prompt. This is enough for search engines to index the group's existence and for a casual visitor to understand what the group is about — but not enough to harvest community data without an account.

---

#### Public Group Page — SEO Teaser (Logged-Out View)

The public group page at `rollcall.gg/groups/:slug` renders a minimal teaser for anonymous visitors:

```
┌──────────────────────────────────────────────────────────────────┐
│  🎲  Austin Tuesday D&D                                          │
│  Tabletop · West Palm Beach, FL · 8 members                     │
│                                                                  │
│  "An ongoing D&D 5e campaign welcoming new players. We meet      │
│   every Tuesday evening and keep a consistent schedule..."       │
│                              [truncated at 120 chars]           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Sign up to see sessions, meet the members, and join.     │  │
│  │  It's free.                                               │  │
│  │  [ Create account ]         [ Log in ]                   │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

The teaser does not include: session dates, session notes, member names, member count beyond the number shown, the full description, or any contact information. The page has valid SEO meta tags and JSON-LD structured data for crawlability (see F71 update below) but the structured data itself contains only the group name, category, and city.

---

#### Email Addresses — Never Exposed

Email addresses are strictly internal. This applies at every level:

- The `/api/users/:id` endpoint never returns `email` — not for the requesting user's own profile (they see it in `/api/users/me`), not for any other user
- Group owners and co-moderators see member **display names** in the member panel, not emails. All communication is via in-platform messaging (DMs, group messages)
- The data export (F75) includes only the requesting user's own email address in their own `profile.json`
- Admin endpoints that include email addresses are restricted to admin-role accounts and are not accessible via the public API surface
- The admin audit log records email addresses for ban/whitelist records — these endpoints require `role = 'admin'` authentication and are not exposed in the sitemap or any public documentation

---

#### Member Rosters — Non-Exportable

Member rosters (the list of who belongs to a group) are **display-name-only** and **never exportable** in bulk:

- The group member list page (`/groups/:slug/members`) is visible to logged-in group members but is explicitly excluded from the sitemap and disallowed in `robots.txt`
- The member list API (`GET /api/groups/:id/members`) returns display names, join dates, roles, and trust scores — no emails, no ZIP codes, no linked account handles beyond what the member has made public
- There is no endpoint that returns all members of a group as a bulk export (no `?format=csv` or similar)
- The F75 data export for an individual user includes `groups.json` (the groups they belong to, their role, their join date) but does NOT include the roster of other members in those groups
- Group owners cannot download a member contact list. This is an explicit design decision: if an organiser wants to contact their members outside RollCall, they must ask members to share contact info directly — the platform will never do it for them

---

#### Anti-Scraping Layer

**1. All data API endpoints require authentication**

Every `/api/*` endpoint that returns user, group, or community data returns `401 Unauthorized` for unauthenticated requests. The only public API endpoints are:

| Endpoint | Reason for public access |
|---|---|
| `POST /api/auth/register` | Registration |
| `POST /api/auth/login` | Login |
| `POST /api/auth/refresh` | Token refresh |
| `POST /api/auth/password-reset` | Password reset initiation |
| `GET /api/system/status` | Public status page (F76) |
| `GET /api/groups/:id/public-teaser` | Minimal SEO teaser data (name, category, city, truncated description) |

Every other endpoint requires a valid JWT in the `Authorization: Bearer` header. This means a scraper cannot harvest group, member, or session data via direct API calls without a registered account.

**2. Rate Limiting — Tiered by Authentication Level**

Rate limits are enforced per IP (unauthenticated) and per user ID (authenticated) via the existing rate-limiting middleware (F80 extends this):

| Request type | Limit | Window | Response on exceed |
|---|---|---|---|
| Unauthenticated (any public endpoint) | 20 requests | 1 minute | `429 Too Many Requests` |
| Authenticated — general API | 120 requests | 1 minute | `429 Too Many Requests` |
| Authenticated — member list endpoints | 10 requests | 1 hour | `429 Too Many Requests` |
| Authenticated — profile lookup (`/api/users/:id`) | 30 requests | 1 minute | `429 Too Many Requests` |
| Authenticated — search / discover | 60 requests | 1 minute | `429 Too Many Requests` |

Rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) are returned on every response. Clients that repeatedly exceed limits have their IP flagged in the F53 fraud scoring system (`+10 abuse_flag_score` per limit-exceed event within 1 hour).

**3. Bot Detection (extends F53)**

The F53 spam/bot detection system is extended with scraping-specific signals:

| Signal | Score added | Decay |
|---|---|---|
| Rate limit exceeded on data endpoints | +10 | 1 hour |
| Request cadence < 500ms between API calls (sustained ≥ 10 calls) | +15 | 2 hours |
| Missing standard browser headers (`Accept-Language`, `User-Agent` is curl/python/etc.) | +20 | 24 hours |
| FingerprintJS headless browser signal | +25 | 48 hours |
| Accessing member list endpoint > 5 times in 1 hour | +20 | 4 hours |
| IP associated with known datacenter range (ASN check) | +10 | 24 hours |

An account with a combined scraping fraud score ≥ 60 is automatically suspended pending admin review — same escalation path as F53.

**4. Honeypot Fields**

All forms (registration, group creation, join request) include a hidden field (`<input type="hidden" name="_hp" style="display:none">`) that legitimate browsers never populate. Any submission with this field populated is silently rejected (`200 OK` returned to avoid alerting the bot) and the submitting IP logged with a `+30 fraud score` event.

**5. No Bulk Data Endpoints**

There is no endpoint that returns all groups, all users, or all members in a single paginated list without a search query. All list endpoints require at least one filter parameter (category, location, or search term). This prevents bulk harvesting via sequential pagination — a scraper must make targeted queries, not sweep the entire dataset.

**6. Cloudflare Bot Fight Mode (F80 integration)**

The Cloudflare reverse proxy (F80) has Bot Fight Mode enabled. This catches and blocks the majority of known scraping tools (Scrapy, Selenium headless, common headless Chrome fingerprints) before requests reach the application server. The application-level rate limiting and fraud scoring provide a second layer for bots that Cloudflare does not catch.

**7. API Response Scrubbing**

Every API response is explicitly filtered through a field allowlist before being returned. The serialiser never uses `SELECT *` — each endpoint has a defined set of fields it returns, and any field not in that list is stripped server-side even if it exists in the database row. This prevents accidental data leakage when schema columns are added.

Example — `GET /api/groups/:id` returns:
```json
{
  "id": "...",
  "name": "...",
  "category": "...",
  "city": "...",
  "member_count": 8,
  "capacity": 10,
  "skill_level": "intermediate",
  "description": "...",
  "next_session": "...",
  "privacy": "public"
}
```

It does NOT return: `owner_email`, `zip_code`, `lat`, `lng`, `created_by_ip`, or any field not in the allowlist — even if those columns exist on the `groups` table.

---

#### F71 Update — SEO Structured Data Restricted

The JSON-LD structured data emitted on public group pages (F71) is updated to contain only:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Austin Tuesday D&D",
  "description": "An ongoing D&D 5e campaign... [120 chars max]",
  "address": { "@type": "PostalAddress", "addressLocality": "West Palm Beach", "addressRegion": "FL" },
  "url": "https://rollcall.gg/groups/austin-tuesday-dnd"
}
```

The structured data does NOT include: member count, organizer name, email, full session list, or any data beyond what appears in the anonymous teaser. The `Event` JSON-LD schema previously specced in F71 is removed — session-level structured data would expose schedule details to crawlers without requiring login.

The `robots.txt` is updated:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Disallow: /settings
Disallow: /messages
Disallow: /admin
Disallow: /groups/*/members
Disallow: /groups/*/calendar
Disallow: /groups/*/chat
Disallow: /profile/*/followers
Disallow: /profile/*/following
Disallow: /calendar
Sitemap: https://rollcall.gg/sitemap.xml
```

`/api/` is disallowed entirely — no crawler should be hitting API endpoints directly.

---

#### F75 Update — Data Export Explicit Exclusions

The F75 data export ZIP (`rollcall-export-{userId}.zip`) explicitly excludes the following, with a note in the export README:

```
NOT included in this export:
  • Other users' display names, profiles, or contact information
  • Member rosters for groups you belong to or own
  • Other members' RSVP history or session attendance
  • Group chat or message board content authored by other users
    (your own posts are included in messages.json and forum_posts.json)
  • Email addresses of any user other than yourself
  • Any data belonging to another user
```

A `README.txt` is included at the root of the ZIP explaining what the export contains, what it excludes, and why (community member privacy). This disclosure ensures GDPR Article 20 compliance — the right to portability applies to the user's own data only, not to data about other people.

---

#### Database

No new tables required. F98 is primarily enforced at the middleware, serialiser, and API-layer levels. The existing `fraud_score_events` table (F81) stores all scraping-signal events. The existing `admin_audit_log` (F82) records any admin action taken on a flagged scraping account.

---

#### API Changes Summary

| Change | Impact |
|---|---|
| All `/api/*` data endpoints require JWT | Scraping requires a registered account |
| `/api/groups/:id/members` rate-limited to 10/hour per user | Bulk roster harvesting blocked |
| `/api/groups/:id` response field allowlist enforced | No accidental field leakage |
| `/api/users/:id` never returns `email` or `zip_code` | Contact data not API-accessible |
| New `GET /api/groups/:id/public-teaser` | Replaces the full group endpoint for unauthenticated callers |
| Honeypot on all forms | Bot form submissions silently dropped |

---

### F99 — Mental Health & Crisis Resource Hub

**Priority: Must Have**

RollCall hosts real people navigating real life. A hobby platform is not a mental health service, but it occupies a social role — and users in distress sometimes surface that distress in group spaces. F92 already handles reactive crisis detection. This feature adds a **proactive, always-visible resource hub** so anyone who needs help can find it in seconds, without waiting for a keyword to trigger anything.

**Dedicated page: `/support/mental-health`**

A standalone page linked from the site footer on every page under the label **"Mental Health Resources"**. The page is publicly accessible — no login required. Content:

```
You don't have to be in crisis to reach out.
If you're struggling, these resources are free, confidential, and available now.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇺🇸  United States
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Suicide & Crisis Lifeline        988 (call or text) · 988lifeline.org
Crisis Text Line                 Text HOME to 741741
SAMHSA National Helpline         1-800-662-4357 (24/7, free, confidential)
NAMI Helpline                    1-800-950-6264 · nami.org
Trevor Project (LGBTQ+ youth)    1-866-488-7386 · Text START to 678-678
Veterans Crisis Line             988, then press 1 · Text 838255

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍  International
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IASP Crisis Centre Directory     iasp.info/resources/Crisis_Centres/
Befrienders Worldwide            befrienders.org
```

A brief, warm note from the platform:
> *"RollCall is a place to find your people — and sometimes life gets hard in between sessions. These resources are here for you, no matter what you're going through."*

**Footer link:** The text "Mental Health Resources" appears in the site footer alongside Terms of Service, Privacy Policy, and Community Standards. It is present on every page, including logged-out pages.

**Onboarding integration:** A one-line note is shown at the bottom of the F26 onboarding confirmation screen: *"Need support? Mental health resources are always available at rollcall.gg/support/mental-health."*

**F92 integration:** The F92 crisis banner already links to this page. The page replaces the inline resource list in F92 — the banner links here instead of embedding the numbers inline, keeping the UI clean while the page holds the full, up-to-date list.

**Maintenance:** Resource contact numbers and URLs are stored as editable admin content (same admin content editor as F39 Help Center) so they can be updated without a code deployment if a hotline number changes.

---

### F100 — Partner Discount Program

**Priority: Should Have**

A monthly rotating **Partner Discounts** hub giving RollCall members access to promo codes and deal links for hobby-relevant products. During the pilot, all discount entries are placeholder/demo data illustrating the feature format — real partner agreements are a separate business development effort.

**Navigation:** A **"Deals"** link in the main navigation bar, with a badge showing the count of active deals (e.g. "12 deals"). Clicking opens `/discounts`.

**`/discounts` page layout**

Header: *"This month's deals for RollCall members"* — refreshes 1st of each month.

Deal cards displayed in a responsive grid (3 columns desktop, 1 column mobile):

```
┌─────────────────────────────────────┐
│  [Brand logo]                       │
│                                     │
│  15% off all D&D sourcebooks        │
│  Expires: May 31, 2026              │
│                                     │
│  Code: [ ROLLCALL15 ] 📋 Copy       │
│                                     │
│  [ Get deal → ]                     │
└─────────────────────────────────────┘
```

**Deal categories** (each with its own filter tab):

| Tab | Example deals |
|---|---|
| 🎮 Gaming | Xbox Game Pass, PlayStation Store credit, Steam Wallet, in-game currency |
| 🎲 Tabletop | D&D sourcebooks, Hasbro titles, local game store gift cards, dice sets |
| 🎧 Accessories | Headsets, controllers, gaming chairs, webcams, mousepads |
| 👕 Apparel | Hobby-themed clothing, customisable group gear |
| 📦 Misc | Hobby subscription boxes, book club picks, art supplies, craft kits |

**Monthly email notification:** Users who opt in to the "New Deals" email (toggle in Settings → Notifications) receive an email on the 1st of each month listing that month's deals. Email uses the F69 BullMQ job queue.

**Promo code copy:** Clicking the 📋 icon copies the code to clipboard. A toast confirms: *"Code copied!"* The "Get deal" button opens the partner URL in a new tab, passing through the F62 external link warning.

**Admin management (F15 extension):** A new **"Deals"** tab in the Admin Control Panel allows the platform owner to add, edit, expire, and reorder deal cards. Fields per deal: brand name, logo upload (Cloudinary), deal description, promo code, expiry date, partner URL, category tag, active/inactive toggle.

**Database**

```sql
partner_deals
  id           UUID PRIMARY KEY
  brand_name   VARCHAR NOT NULL
  logo_url     VARCHAR              -- Cloudinary URL
  description  VARCHAR(200) NOT NULL
  promo_code   VARCHAR(50)
  partner_url  VARCHAR NOT NULL
  category     ENUM('gaming','tabletop','accessories','apparel','misc')
  expires_at   DATE
  is_active    BOOLEAN DEFAULT true
  sort_order   INTEGER DEFAULT 0
  created_at   TIMESTAMP NOT NULL
  updated_at   TIMESTAMP NOT NULL
```

**API Endpoints**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/deals` | Auth required | List all active deals; supports `?category=` filter |
| GET | `/api/admin/deals` | Admin | List all deals including inactive |
| POST | `/api/admin/deals` | Admin | Create a new deal |
| PUT | `/api/admin/deals/:id` | Admin | Update a deal |
| DELETE | `/api/admin/deals/:id` | Admin | Soft-delete (set `is_active = false`) |

---

### F101 — Browser Compatibility & Support Policy

**Priority: Must Have**

**Supported browsers — evergreen (latest 2 major versions):**

| Browser | Desktop | Mobile |
|---|---|---|
| Google Chrome | ✅ | ✅ (Android) |
| Mozilla Firefox | ✅ | ✅ |
| Apple Safari | ✅ (macOS) | ✅ (iOS) |
| Microsoft Edge | ✅ | ✅ |

**Explicitly unsupported:** Internet Explorer (all versions), Opera Mini, any browser more than 2 major versions behind current release.

**Unsupported browser warning:** A non-blocking, dismissible banner is shown once per session when a user's `User-Agent` string matches a known unsupported browser pattern:

```
⚠️  Your browser may not support all RollCall features.
    For the best experience, use Chrome, Firefox, Safari, or Edge.
    [ Dismiss ]
```

The banner does not block access. It is shown at most once per browser session (dismissed state stored in `sessionStorage`). It is never shown to supported browsers.

**Testing matrix:** Before each release, a smoke-test pass is run in the CI pipeline (Playwright, F79 testing strategy) against the latest stable version of all four supported browsers using BrowserStack or equivalent. Any layout or functionality regression in a supported browser blocks the release.

**Support policy page:** A brief "Browser Support" entry is added to the F39 Help Center under the "Getting Started" category, listing the supported browsers and linking to the download page for each.

**No new database tables required.** Detection is client-side via `navigator.userAgent` and a server-side `User-Agent` check on the initial page load.

---

### F102 — Fully Optional Notifications (Policy Enforcement)

**Priority: Must Have**

F38 specifies per-type notification controls. This feature is a **policy clarification and enforcement pass** — not a new engineering feature — ensuring the PRD is unambiguous: every notification type is opt-out, and users are given meaningful control during onboarding rather than buried in Settings.

**Mandatory (non-optional) notifications — security-critical only:**

| Notification | Why mandatory |
|---|---|
| Password reset / account recovery email | User initiated; required for security |
| Account suspension / ban notice | Legal and safety obligation |
| COPPA deletion confirmation (under-13) | Legal requirement |
| Guardian consent request (F84) | Minor account legal requirement |
| Data export ready (F75) | User-initiated GDPR request |

Every other notification type — session reminders, group alerts, badge awards, new matches, DMs, mentions, NPS surveys, deal emails — is **opt-out by default** with the exception of the onboarding-suggested defaults defined in F38.

**Onboarding surfacing:** Step 4 of the F26 onboarding flow is updated to include a one-tap **"Notification preferences"** section below the availability grid. It shows the four most impactful notification types (Session reminders, New group matches, DMs, Weekly digest) as toggles — pre-set to the F38 recommended defaults — with a link to the full F38 preferences panel for users who want more control. Users can change these at any time from Settings → Notifications.

**QA requirement:** The release checklist (F79) includes a manual verification step confirming that opting out of each notification type in F38 actually suppresses that notification. This check must pass before any release that touches the notification system.

---

### F103 — Optional Display Phone & Email in Profile

**Priority: Should Have**

Users may optionally add a **display phone number** and **display email address** to their public-facing profile. These are separate from the registered account email (used for platform logins and system emails — never shown) and from the F47 SMS verification number (used for 3FA only — never shown).

**Profile fields (both optional, no prompt or requirement):**

| Field | Visibility | Notes |
|---|---|---|
| Display email | Confirmed group members only | Not the account login email; freely editable; a separate contact address the user chooses to share |
| Display phone | Confirmed group members only | E.164 format stored; displayed as formatted local number |

**Display rules:**
- Neither field is visible to logged-out visitors, non-members, or users the account has blocked
- Neither field is included in group member list exports (non-exportable per F98)
- Neither field is returned by `/api/users/:id` to non-members — only `/api/users/me` and the member-scoped profile endpoint return them
- The F43 personal information protection system applies: if a user pastes their display email or phone into a group message (rather than their profile), the F43 soft-warning still fires

**Database**

```sql
ALTER TABLE users
  ADD COLUMN display_email   VARCHAR,   -- optional contact email; separate from account email
  ADD COLUMN display_phone   VARCHAR;   -- E.164 format; optional
```

Both columns are included in the user's own F75 data export under `profile.json`.

**API**

`GET /api/users/:id` — does **not** return `display_email` or `display_phone` for non-members.
`GET /api/groups/:id/members/:userId` — **does** return `display_email` and `display_phone` for confirmed members of the same group, when the fields are set.

---

### F104 — In-Editor Spell Check

**Priority: Should Have**

Spell-check underlining and correction suggestions on all composition fields across RollCall — forum posts, group messages, chat, DMs, group descriptions, bio, and event notes.

**Implementation — two layers:**

**Layer 1 — Native browser spell check (zero engineering effort):**
All `<textarea>` and `<input type="text">` elements have `spellcheck="true"` set as an HTML attribute. All modern browsers (Chrome, Firefox, Safari, Edge) natively underline misspelled words and offer right-click correction suggestions. This covers the majority of use cases at no cost.

**Layer 2 — Rich-text editor integration:**
The group forum (F61), group chat (F10), and DM composer (F67) use a `contenteditable` rich-text editor component. The editor is configured to pass the `spellcheck` attribute through to the DOM element so browser native spell check applies. Additionally, the editor is integrated with the [Typo.js](https://github.com/cfinke/Typo.js) dictionary for inline red-squiggle underlining in cases where browser native check is suppressed (e.g. inside Shadow DOM components).

**Behaviour:**
- Misspelled words are underlined in red
- Right-click (desktop) or long-press (mobile) opens a suggestion menu with up to 5 correction options
- Selecting a suggestion replaces the word in place
- **No autocorrect** — the system never changes a word without user action
- Language follows the user's browser locale setting; defaults to `en-US`
- Spell check can be disabled per-field via a Settings toggle ("Disable spell check") in Settings → Accessibility — useful for users who write in languages not supported by the dictionary

**No new database tables or API endpoints required.**

---

### F105 — Forum Attachments Restricted to PDF Only

**Priority: Must Have**

Any file attached to a forum post (F61), group message board post (F5), or session recap (F33) is restricted to **PDF format only**. No executable files, no Office documents, no scripts, no archives.

**Enforcement — three layers:**

**Layer 1 — Client-side file picker:**
```html
<input type="file" accept=".pdf,application/pdf">
```
The browser's file picker shows only PDF files. Users cannot select other file types through the normal UI. This is a UX convenience layer — not a security control.

**Layer 2 — Server-side MIME type validation:**
On upload, the server reads the file's actual MIME type (not the filename extension — extensions can be spoofed). Only `application/pdf` is accepted. Any other MIME type returns:
```json
HTTP 400 Bad Request
{ "error": "invalid_file_type", "message": "Only PDF files are accepted." }
```

**Layer 3 — Cloudinary upload pipeline (F42):**
The Cloudinary upload preset for forum attachments is configured to accept only `application/pdf` at the CDN level. Any upload that bypasses the application server is rejected at the storage layer.

**Display:** Accepted PDFs are shown as a download card beneath the post:
```
📄  group-rules.pdf  ·  2.4 MB   [ Download ]
```
No in-browser PDF preview is rendered (avoids PDF.js attack surface and iframe-based exploits). The file name, MIME type, and file size are shown. The download link is a signed Cloudinary URL with a 24-hour expiry.

**Limits:** Maximum 10 MB per attachment. Maximum 3 attachments per post.

**No new database tables required.** The existing `forum_attachments` table (if present) or `messages.attachments JSONB` column is updated to store `{ url, filename, size_bytes, mime_type }` — MIME type is recorded server-side at upload time and validated on retrieval.

---

### F106 — Last-Minute Cancellation Reputation Penalty

**Priority: Must Have**

When a group owner cancels a scheduled session within **24 hours of the session start time**, it is automatically classified as a **last-minute cancellation** and triggers an immediate, visible consequence to their trust profile.

**Classification trigger:**

In the F51 session cancellation flow, the server checks:
```
IF cancellation.created_at >= (event.start_time - 24 hours)
  AND event.status = 'scheduled'
  → classify as last_minute_cancellation = true
```

**Automatic consequences on classification:**

1. A `last_minute_cancellation` event is logged in a new `cancellation_events` table.
2. **Trust score penalty: −8 points** applied immediately to the owner's `trust_score`.
3. The owner's `late_cancel_count_90d` counter increments (rolling 90-day window, recalculated nightly).
4. The group's health score (F20) receives a **−10 penalty**.
5. All members who RSVPed "Going" receive an enhanced cancellation notification: *"[Owner] cancelled [Session] with less than 24 hours notice. We're sorry for the disruption."*

**Profile display — Late Cancellations counter:**

After the **first** last-minute cancellation, the owner's public profile shows:
```
🕐  1 late cancellation in the last 90 days
```
Visible to all logged-in users. Tooltip on hover: *"This organiser has cancelled sessions with less than 24 hours notice."*

**Reliability Warning badge — after 3 in 90 days:**

When `late_cancel_count_90d` reaches 3, a persistent ⚠️🕐 **Reliability Warning** badge appears:
- On the owner's profile header
- On every group card they own in Discover results
- On their member panel entry in other groups they belong to
- Tooltip: *"This organiser has cancelled sessions with less than 24 hours notice 3 times in the last 90 days."*

This badge uses the same amber visual treatment as the F24 conduct flag.

**Emergency exception:**

The F51 cancellation form includes an **"Emergency reason"** checkbox. When checked, the owner enters a brief reason (free text, 280 chars). The late-cancellation penalty is **held** (not applied immediately) and the cancellation is flagged in the admin queue. An admin reviews within 48 hours:
- If marked legitimate: no penalty applied; `late_cancel_count_90d` is not incremented; no profile display
- If not marked legitimate: penalty applies retroactively

**Auto-reset:** `late_cancel_count_90d` is recalculated nightly. It returns to zero when no last-minute cancellations exist in the rolling 90-day window. The Reliability Warning badge clears automatically on reset.

**Database**

```sql
cancellation_events
  id                    UUID PRIMARY KEY
  event_id              UUID REFERENCES events(id)
  group_id              UUID REFERENCES groups(id)
  owner_id              UUID REFERENCES users(id)
  cancelled_at          TIMESTAMP NOT NULL
  session_start_time    TIMESTAMP NOT NULL
  hours_before_session  NUMERIC GENERATED ALWAYS AS
                        (EXTRACT(EPOCH FROM (session_start_time - cancelled_at))/3600) STORED
  is_last_minute        BOOLEAN NOT NULL
  emergency_reason      TEXT
  admin_reviewed        BOOLEAN DEFAULT false
  admin_decision        ENUM('legitimate','not_legitimate')
  penalty_applied       BOOLEAN DEFAULT false

ALTER TABLE users
  ADD COLUMN late_cancel_count_90d INTEGER DEFAULT 0;  -- recalculated nightly by cron job
```

**API Endpoints**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/:id/cancellations` | Auth required | Returns the user's public late-cancel count (not the full log) |
| GET | `/api/admin/cancellations` | Admin | List all cancellation events pending emergency review |
| PUT | `/api/admin/cancellations/:id/review` | Admin | Set admin decision; apply or waive penalty |

---

### F107 — Unified Behavioural Analytics & Intelligent Tracking

**Priority: Should Have**

Extends the F68 PostHog integration from a set of discrete conversion events into a **comprehensive behavioural event stream** — capturing continuous in-session activity so the platform owner can understand not just what users do, but what they browse, ignore, search for, and spend time on.

**Additional events tracked (beyond existing F68 events):**

| Event name | Trigger | Key properties |
|---|---|---|
| `page_viewed` | Every route change | `page`, `referrer`, `session_id` |
| `group_page_browsed` | Group detail page viewed without joining | `group_id`, `category`, `time_on_page_seconds` |
| `discover_filter_applied` | Any filter change on Discover | `filter_type`, `filter_value` |
| `search_query_entered` | Search submitted | `query`, `results_count`, `result_clicked` |
| `forum_post_read` | Post scrolled into viewport for ≥ 3 seconds | `post_id`, `group_id` |
| `calendar_event_viewed` | Event detail popover opened | `event_id`, `group_id` |
| `notification_opened` | Notification tapped/clicked | `notification_type` |
| `notification_dismissed` | Notification dismissed without action | `notification_type` |
| `deal_code_copied` | Promo code copied (F100) | `deal_id`, `brand_name` |
| `deal_link_clicked` | "Get deal" link clicked (F100) | `deal_id`, `brand_name` |
| `feature_area_visited` | Tab or section entered | `area` (chat/calendar/forum/discover/etc.) |
| `session_duration` | On page leave / tab close | `duration_seconds`, `pages_visited` |

**Disclosure — Terms of Service and acceptance agreement:**

All behavioural tracking is disclosed in plain language in the **Terms of Service** (F32). The first-login acceptance agreement (currently used for Community Standards) is extended to include a dedicated section:

```
Data & Analytics

To improve your experience, RollCall records how you use
the platform — pages visited, features used, searches made,
and time spent in each area. This data is used only to
improve RollCall. It is never sold to third parties.

Analytics provider: PostHog (self-hosted)

You can opt out at any time in Settings → Privacy.
Opting out does not affect your account or features.

[ I understand and agree ]
```

Users who do not accept cannot use the platform — this is the same gate as the Community Standards agreement.

**Opt-out:** The existing `analytics_opt_out` column on the `users` table (F68) suppresses all PostHog event capture for that user. The opt-out toggle is surfaced prominently in Settings → Privacy (not buried in Settings → Account).

**Admin use of tracking data:**

The F68 admin Platform Metrics tab is extended with two new views:
- **Feature Usage heatmap** — ranked list of feature areas by visit frequency and time-on-area
- **Discovery Funnel** — group page browsed → join attempted → join completed conversion rates by category

**No new database tables required.** All events are captured by PostHog and queried from the PostHog dashboard. The `analytics_opt_out` column already exists.

---

### F108 — Scam & Social Engineering Prevention

**Priority: Must Have**

The platform's trust model — joining groups run by strangers — creates a social engineering attack surface that is distinct from the spam and bot threats covered in F53 and F81. The primary scam vector is a human actor who creates a convincing group, builds member trust over days or weeks, and then solicits off-platform payments. Secondary vectors include impersonation of real clubs or brands and account takeover of established organizer accounts. This feature adds seven interlocking defences targeting these specific patterns without degrading the experience for legitimate organizers.

---

#### Part 1 — Community Standards Extension (F14)

A new standalone **Financial Solicitation** section is added to the F14 Zero-Tolerance Community Policy, at the same enforcement tier as sexual harassment:

> Soliciting money, payment-app transfers, or cryptocurrency from members or potential members — for any stated reason — is a zero-tolerance violation. This includes asking members to pay a group fee, entry fee, equipment deposit, event ticket, or any other charge. RollCall never facilitates direct payments between users; subscription fees are paid to RollCall only. Any organizer requesting payment from members is acting outside the platform's intended scope and will be permanently banned.

**Consequence:** Immediate account suspension on report receipt, reviewed by platform owner within 24 hours, permanent ban on first substantiated offence. Routes to the existing Tab 6 sensitive-report flow in F15.

---

#### Part 2 — New Account Organizer Cool-Down

New accounts face two time-gated restrictions before they can use trust-sensitive features:

| Restriction | Threshold | Server config constant |
|---|---|---|
| Cannot create a group | Account < 7 days old | `NEW_ACCOUNT_GROUP_CREATE_DAYS = 7` |
| Cannot send DMs to members of their own groups | Account < 14 days old | `NEW_ACCOUNT_OWNER_DM_DAYS = 14` |

Both are enforced server-side. The UI shows a clear message: "New accounts need a short verification period before creating groups — you'll be able to on `<date>`." The `POST /api/groups` endpoint returns `403 { "error": "account_too_new", "eligible_at": "<ISO date>" }` for accounts below the threshold. Both constants are adjustable without a code deployment.

---

#### Part 3 — Payment Pattern Message Screening

A new screening pass runs server-side on all outgoing messages (group chat, DMs, forum posts) **in parallel** with the existing F18 content safety pipeline. It never blocks delivery — it flags silently to the admin queue and adds to the sender's fraud score (F81). Blocking is avoided to prevent false positives from legitimate casual conversation (e.g., "I'll pay for snacks at the next session").

**Trigger pattern list (case-insensitive):**

```
Payment apps:       venmo, zelle, cashapp, cash app, paypal, paypal.me,
                    chime, apple pay, google pay, bitcoin, eth, usdc,
                    crypto, wallet address

Solicitation verbs: pay me, send me, owe me, collect payment,
                    collect money, chip in, split the cost, cover the cost

Combined signal:    any payment app name appearing in the same message
                    as a dollar sign or numeric amount (e.g. "$20", "20 dollars")

Scam indicators:    "group fee", "entry fee", "membership fee",
                    "registration fee", "you've been selected", "claim your prize"
```

**On pattern match:**

- Message delivers as normal
- Admin queue entry created: category "Possible financial solicitation", includes full message text, sender profile link, account age, group name
- Fraud score +15 applied to sender account (F81)
- If accumulated fraud score crosses the auto-suspend threshold before admin reviews, the F81 lockout fires independently

---

#### Part 4 — New Report Categories

Two new report categories are added across all report surfaces (profile reports, group reports, message reports):

| Category | Routes to | Suspension on receipt |
|---|---|---|
| **Financial solicitation / scam** | F15 Tab 1 (admin queue) — group owner reports escalate to Tab 6 fast-track | Yes — group owner accounts auto-suspended pending review |
| **Impersonation** | F15 Tab 1 (admin queue) | No — standard-priority review |

"Financial solicitation / scam" covers: payment requests, fake prize or reward notifications, phishing links, and any communication designed to extract money or credentials.

"Impersonation" covers: accounts or groups falsely claiming to represent a real person, club, brand, or official organisation.

Both categories are added to the `violation_type` ENUM on the `reports` table.

---

#### Part 5 — Group Creation Payment Acknowledgment

The group creation flow (F2) gains a mandatory unchecked acknowledgment checkbox at the final confirmation step, immediately before the Create Group button:

```
☐  I understand that requesting money or payments from members —
   for any reason — is strictly prohibited and will result in a
   permanent ban. Members may never be charged directly by organizers.
```

The checkbox cannot be pre-ticked. Submitting the form without checking it returns a validation error. The acknowledgment is logged server-side:

```sql
ALTER TABLE groups
  ADD COLUMN payment_prohibition_ack     BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN payment_prohibition_acked_at TIMESTAMP;
```

`payment_prohibition_ack` is set to `true` and `payment_prohibition_acked_at` recorded at group creation. These fields are included in the F82 admin audit log on group creation events.

---

#### Part 6 — New Member Safety Notice for New-Organizer Groups

When a user visits a group for the first time and the group owner's account was created fewer than **30 days ago** (`NEW_OWNER_NOTICE_DAYS = 30`), a one-time dismissible notice appears at the top of the group page:

```
⚠️  Heads up: This group was created by a new account.
    If anyone asks you to send money or pay a fee to participate,
    please report it immediately — organizers are prohibited from
    charging members on this platform.
    [Dismiss]  [Report this group]
```

The notice is shown once per user per group. Dismissed state is tracked via a `seen_new_owner_notice BOOLEAN DEFAULT false` column on the `group_members` table (for joined members) and via `sessionStorage` for non-member visitors browsing a public group preview.

---

#### Part 7 — Verified Organizer Badge

A **Verified Organizer** badge (✅) is manually granted by platform admin to established, trusted organizers. It is distinct from Trust Score — it is a human-reviewed signal, not algorithmic.

**Eligibility criteria (guideline, not automatic):**

- Account age ≥ 6 months
- ≥ 3 completed group sessions
- No active conduct warnings or fraud score events
- No history of financial solicitation reports

**Badge display locations:** organizer's profile page, all their group cards on Discover, and next to their name in member lists and the group header.

**Admin controls:**
- Grant badge: `POST /api/admin/users/:id/verified-organizer`
- Revoke badge: `DELETE /api/admin/users/:id/verified-organizer`
- Both actions logged in F82 admin audit log

```sql
ALTER TABLE users
  ADD COLUMN verified_organizer            BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN verified_organizer_granted_at TIMESTAMP,
  ADD COLUMN verified_organizer_granted_by UUID REFERENCES users(id);
```

Phase 0 seeded organizers (see Launch Strategy) receive the badge automatically at group creation — they were personally vetted before the platform opened.

---

#### Database Changes Summary

```sql
-- Group creation acknowledgment
ALTER TABLE groups
  ADD COLUMN payment_prohibition_ack      BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN payment_prohibition_acked_at TIMESTAMP;

-- Verified Organizer badge
ALTER TABLE users
  ADD COLUMN verified_organizer            BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN verified_organizer_granted_at TIMESTAMP,
  ADD COLUMN verified_organizer_granted_by UUID REFERENCES users(id);

-- New-owner notice dismissal tracking
ALTER TABLE group_members
  ADD COLUMN seen_new_owner_notice BOOLEAN DEFAULT false;

-- Extended violation type ENUM
ALTER TYPE violation_type ADD VALUE 'financial_solicitation';
ALTER TYPE violation_type ADD VALUE 'impersonation';
```

#### Server Config Constants

```
NEW_ACCOUNT_GROUP_CREATE_DAYS         = 7
NEW_ACCOUNT_OWNER_DM_DAYS             = 14
NEW_OWNER_NOTICE_DAYS                 = 30
PAYMENT_PATTERN_FRAUD_SCORE_INCREMENT = 15
```

#### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/admin/users/:id/verified-organizer` | Platform owner | Grant Verified Organizer badge |
| `DELETE` | `/api/admin/users/:id/verified-organizer` | Platform owner | Revoke Verified Organizer badge |
| `PATCH` | `/api/group-members/:groupId/seen-new-owner-notice` | Member | Dismiss new-owner safety notice |

---

### F109 — Group Activity Icons & Game Cover Art

**Priority: Should Have**

Every group displays a recognisable visual icon wherever it appears on the platform — group cards on Discover, the group header, the calendar, Discover map pins, and chat thread lists. The icon source is determined automatically by the group's activity type, with a custom upload option available to every organizer regardless of category.

---

#### Part 1 — Icon Source Tiers

| Source | When used | Data provider |
|---|---|---|
| **Game cover art (video games)** | Organizer selects a specific video game title at group creation | IGDB (Internet Game Database) via Twitch API |
| **Game cover art (tabletop & RPG)** | Organizer selects a tabletop game, RPG system, or board game title | BoardGameGeek (BGG) XML API v2 |
| **Curated icon library** | Organizer selects a sport, fitness activity, social category, or any activity without a dedicated game database entry | Static Cloudinary-hosted SVG icons |
| **Custom upload** | Organizer uploads their own image — available as an override at any time | Cloudinary (F42 upload pipeline) |

The icon resolution hierarchy: custom upload → game cover art (IGDB or BGG) → curated library → category emoji fallback.

---

#### Part 2 — Group Creation Flow Update (F2)

The group creation flow gains an **Icon** step immediately after the activity category selection:

**Video game groups:**
- A searchable autocomplete field labelled "Search for your game" queries `GET /api/icons/search/games?q={query}` (proxied IGDB call)
- Results show game title + thumbnail in a dropdown
- On selection, the full cover art preview loads below the field
- Organizer can accept or choose "Upload my own instead"

**Tabletop, board game, and RPG groups:**
- Same flow, queries `GET /api/icons/search/tabletop?q={query}` (proxied BGG call)
- BGG returns the game's official box art thumbnail URL
- Works for D&D (5e, 2024 edition), Pathfinder, Call of Cthulhu, Gloomhaven, Wingspan, etc.

**Sports, fitness, and other activity groups:**
- Visual icon picker grid — each tile shows an SVG icon and label
- Categories: Basketball, Soccer, Baseball, Tennis, Volleyball, Golf, Cycling, Running, Yoga, Swimming, Martial Arts, Rock Climbing, Cooking, Photography, Music, Book Club, Trivia, and Other
- Organizer selects one tile; selected tile highlights in the brand colour

**Custom upload (any group type):**
- "Upload your own" link below any auto-populated icon opens the Cloudinary upload widget
- Same MIME validation as F42: image/jpeg, image/png, image/webp only; max 5 MB
- Square crop enforced (1:1 aspect ratio) via Cloudinary transformation

---

#### Part 3 — IGDB Integration

IGDB is free for registered Twitch developers. The server-side proxy prevents the client-id and access token from being exposed to the browser.

```
POST https://id.twitch.tv/oauth2/token  → access_token (client_credentials grant)
POST https://api.igdb.com/v4/games
  Body: fields name,cover.image_id; search "{query}"; limit 8;
  Headers: Client-ID: {IGDB_CLIENT_ID}, Authorization: Bearer {access_token}

Cover URL construction:
  https://images.igdb.com/igdb/image/upload/t_cover_big/{image_id}.jpg
  (t_cover_big = 264×374px  |  t_cover_small = 90×128px for thumbnails)
```

After the organizer confirms a game, the cover URL is cached in Cloudinary using `upload_preset=igdb_cover` with `fetch_format=auto` and `quality=auto` — subsequent renders never re-hit IGDB.

**New environment variables:**
```
IGDB_CLIENT_ID      — Twitch developer app client ID
IGDB_CLIENT_SECRET  — Twitch developer app client secret
```

---

#### Part 4 — BGG Integration

BoardGameGeek's API is unauthenticated and free.

```
Search:  GET https://api.geekdo.com/xmlapi2/search?query={name}&type=boardgame
  → Returns list of { id, name } matches

Fetch art: GET https://api.geekdo.com/xmlapi2/thing?id={id}&stats=0
  → Returns <image> element containing the full-resolution cover URL

Thumbnail: <thumbnail> element contains a smaller version (used in dropdown)
```

BGG XML responses are parsed server-side and returned as JSON to the frontend. BGG image URLs are also passed through Cloudinary fetch-and-cache on first use.

---

#### Part 5 — Curated Icon Library

The library is a static JSON manifest (`/api/icons/library`) listing all available icons:

```json
[
  { "key": "basketball",   "label": "Basketball",   "url": "https://res.cloudinary.com/.../basketball.svg" },
  { "key": "soccer",       "label": "Soccer",       "url": "..." },
  { "key": "dnd",          "label": "D&D / RPG",    "url": "..." },
  { "key": "book_club",    "label": "Book Club",    "url": "..." },
  ...
]
```

Icons are designed as 256×256 SVG, rendered at whatever size the UI requires. The manifest is served with a long `Cache-Control` header (7 days) since icon additions require a code deployment anyway.

---

#### Part 6 — Display Specifications

| Surface | Icon size | Shape | Fallback |
|---|---|---|---|
| Discover group card | 72 × 72 px | Rounded square (radius 12px) | Category emoji on brand-colour background |
| Group header (detail page) | 120 × 120 px | Rounded square (radius 16px) | Category emoji on brand-colour background |
| Discover map pin (Mapbox) | 36 × 36 px | Circle | Activity category colour dot |
| Calendar event row | 24 × 24 px | Circle | Category colour dot |
| Chat thread list | 32 × 32 px | Rounded square (radius 6px) | Category emoji |
| Group card in DM sidebar | 28 × 28 px | Rounded square (radius 6px) | Category emoji |

All icons are lazy-loaded with a skeleton placeholder (F90 standards). Images served via Cloudinary CDN with `f_auto,q_auto,w_{size},h_{size},c_fill` transformation for optimal weight at each render size.

---

#### Part 7 — Moderation

Group icons pass through the same Cloudinary AI moderation pipeline as profile avatars (F42). Custom-uploaded icons are held pending moderation and display the category fallback until cleared. IGDB and BGG cover art bypasses moderation (trusted sources) but is still routed through Cloudinary caching.

Admin can remove a group icon from F15 Tab 1 (group report queue). Removal resets the icon to the category fallback and notifies the organizer.

---

#### Database Changes

```sql
ALTER TABLE groups
  ADD COLUMN icon_source  VARCHAR(10)   -- 'igdb' | 'bgg' | 'library' | 'custom' | null
  ADD COLUMN icon_url     VARCHAR,      -- Cloudinary CDN URL (cached final URL)
  ADD COLUMN icon_igdb_id INTEGER,      -- IGDB game ID (for reference / re-fetch)
  ADD COLUMN icon_bgg_id  INTEGER,      -- BGG game ID (for reference / re-fetch)
  ADD COLUMN icon_lib_key VARCHAR;      -- Curated library key (e.g. 'basketball')
```

#### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/icons/search/games?q={query}` | Logged-in | Proxied IGDB game search — returns name + cover URL |
| `GET` | `/api/icons/search/tabletop?q={query}` | Logged-in | Proxied BGG search — returns name + thumbnail URL |
| `GET` | `/api/icons/library` | Public | Returns curated icon library manifest |
| `PATCH` | `/api/groups/:id/icon` | Group owner | Update group icon (source + URL) |
| `DELETE` | `/api/groups/:id/icon` | Admin | Remove icon and reset to fallback |

---

### F110 — Roll20 & Virtual Tabletop Integration

**Priority: Should Have**

Online RPG groups — D&D, Pathfinder, Call of Cthulhu, and other tabletop roleplaying games played over the internet — almost universally run their sessions on a Virtual Tabletop (VTT) platform. Roll20 is the most widely used, with over 10 million registered users and the largest library of official D&D and Pathfinder content. This feature gives online RPG groups on RollCall a direct Roll20 connection: organizers link their Roll20 campaign once, and that link surfaces everywhere members need it — the group page, session event details, reminder notifications, and discovery filters.

The spec is designed to be VTT-extensible from the start. Roll20 ships first; Foundry VTT, Fantasy Grounds, and Alchemy RPG are listed as future extensions using the same data model without schema changes.

---

#### Part 1 — Group-Level Roll20 Campaign Link

The group creation and edit flows (F2) gain a **Virtual Tabletop** field, shown only when `location_type = 'online'` and the group's activity category is RPG, tabletop, or board game:

```
Virtual Tabletop (optional)
[Platform dropdown]  [Campaign join URL]

Platform options:
  • Roll20             ← ships in v1
  • Foundry VTT        ← future
  • Fantasy Grounds    ← future
  • Alchemy RPG        ← future
  • Other (paste link) ← generic fallback
```

When **Roll20** is selected, the URL field is validated client-side against the Roll20 URL pattern:

```
Accepted formats:
  https://app.roll20.net/campaigns/join/{campaign_id}/{hash}
  https://app.roll20.net/campaigns/details/{campaign_id}
```

An invalid URL format shows an inline validation error: "That doesn't look like a Roll20 campaign link — double-check the URL from your Roll20 game settings."

The stored value is the organizer's campaign join link or public listing URL. It is treated the same as any external URL in the platform: the F62 External Link Warning is shown to members on first click.

---

#### Part 2 — Group Page Display

When a group has a Roll20 link set, the group detail page renders a **VTT panel** in the right sidebar (below the RSVP/join section):

```
┌──────────────────────────────────┐
│  🎲  Play on Roll20               │
│  Campaign link shared with        │
│  confirmed group members only.    │
│                                   │
│  [ Open Roll20 Campaign ↗ ]       │
└──────────────────────────────────┘
```

- The "Open Roll20 Campaign" button is visible **only to confirmed group members** — not to visitors, non-members, or join requesters. This prevents the campaign join link from being publicly scraped or shared beyond the group.
- Non-members see the VTT panel with the platform name but a locked state: "Join this group to access the Roll20 campaign link."
- The Roll20 logo (SVG) is displayed alongside the panel heading for instant recognition.

---

#### Part 3 — Session-Level Roll20 Links

Individual sessions (F29 / F34 recurring event templates) gain an optional **Session Roll20 link** field. This is useful when:
- The organizer runs multiple campaigns in separate Roll20 rooms
- A one-shot session uses a different Roll20 game than the standing campaign
- The organizer wants to share the direct session URL rather than the campaign listing

When a session-level Roll20 link is set it overrides the group-level link in all session-specific surfaces (session detail popover, reminder notifications, calendar). The group-level link continues to appear on the group page.

```sql
ALTER TABLE events
  ADD COLUMN vtt_platform VARCHAR(30),   -- 'roll20' | 'foundry' | 'fgu' | 'alchemy' | 'other'
  ADD COLUMN vtt_url      VARCHAR;       -- session-specific join URL (overrides group level)
```

---

#### Part 4 — Discover Filter

The F3 Discover filter panel gains a **Virtual Tabletop** toggle under the Online section:

```
Online groups
  [x] All online groups
  [ ] Roll20 games only       ← filters to groups with vtt_platform = 'roll20'
  [ ] Any VTT platform        ← filters to groups with vtt_platform IS NOT NULL
```

Group cards for Roll20-linked groups display a small 🎲 **Roll20** badge in the top-right corner of the icon (same position as the crossplay badge from F31), visible on Discover and in search results regardless of membership.

---

#### Part 5 — Session Reminder Notifications

When a session reminder fires (F38 — 24h and 2h before the session), if a Roll20 link is set for that session or its group, the reminder email and in-app notification include a direct "Join on Roll20" CTA:

**Email CTA block (below session details):**
```
Ready to play?
[ Join on Roll20 ↗ ]
This link opens your campaign directly in Roll20.
```

**In-app notification:** The session reminder toast includes a secondary action button: "Open Roll20" — tapping it fires the F62 external link warning before redirecting.

---

#### Part 6 — VTT Badge on Group Card & Map Pin

| Surface | Badge placement | Badge content |
|---|---|---|
| Discover group card | Top-right corner overlay | Roll20 logo icon (16×16 SVG) |
| Discover map pin popover | Below group name | "🎲 Roll20" text chip |
| Group header (detail page) | Below group title | "Plays on Roll20" chip with logo |
| Onboarding match card (F26) | Below match reason chips | "Roll20 campaign linked" chip |

The badge is only shown when `vtt_platform = 'roll20'` and `vtt_url IS NOT NULL`. It is intentionally visible before joining — it is a discovery signal, not sensitive data.

---

#### Part 7 — F62 External Link Warning Integration

Roll20 links follow the existing F62 external link flow. On first click of any Roll20 URL (group page, session reminder, calendar), the external link warning modal appears:

```
You're leaving RollCall
This link opens Roll20 — a third-party virtual tabletop platform.
RollCall is not responsible for content on external sites.

[ Cancel ]  [ Open Roll20 ↗ ]
```

The warning is shown once per user per domain (`app.roll20.net`). After the first confirmation, subsequent Roll20 links open directly (domain stored in `external_link_confirmations` table per F62).

---

#### Database Changes

```sql
-- Group-level VTT link
ALTER TABLE groups
  ADD COLUMN vtt_platform VARCHAR(30),   -- 'roll20' | 'foundry' | 'fgu' | 'alchemy' | 'other'
  ADD COLUMN vtt_url      VARCHAR;       -- campaign join or listing URL

-- Session-level VTT link (overrides group level)
ALTER TABLE events
  ADD COLUMN vtt_platform VARCHAR(30),
  ADD COLUMN vtt_url      VARCHAR;
```

#### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `PATCH` | `/api/groups/:id/vtt` | Group owner | Set or update group VTT platform and URL |
| `DELETE` | `/api/groups/:id/vtt` | Group owner | Remove VTT link from group |
| `GET` | `/api/groups/:id/vtt` | Confirmed member | Retrieve group VTT URL (members only) |
| `PATCH` | `/api/events/:id/vtt` | Group owner / co-mod | Set session-level VTT override |

---

### F111 — Personalized Home Dashboard

**Priority: Must Have**

Every logged-in user lands on a dynamic home page (`/home`) that is unique to them. No two users see the same content. The page assembles five data-driven sections in real time based on the user's stated interests, group memberships, RSVP history, forum participation, and behavioural signals from F107. The result is a single screen that answers the four most important daily questions a RollCall user has: *What's happening in my groups soon? What should I join next? What's new in my communities? What forum conversations am I part of?*

Non-authenticated visitors continue to see the public marketing landing page. The dashboard is the authenticated root — the first thing users see after login and after completing onboarding.

---

#### Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Good [morning/afternoon/evening], [First Name] 👋              │
├────────────────────────────┬────────────────────────────────────┤
│                            │                                    │
│   MY WEEK                  │   RECOMMENDED FOR YOU              │
│   (personal calendar       │   (interest-matched groups         │
│    strip — next 7 days)    │    not yet joined)                 │
│                            │                                    │
├────────────────────────────┴────────────────────────────────────┤
│                                                                  │
│   MY GROUPS — RECENT ACTIVITY                                    │
│   (new posts, new members, new polls in joined groups)          │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   MY FORUM THREADS                                               │
│   (threads the user has posted in with new unread replies)      │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   TRENDING IN YOUR INTERESTS                                     │
│   (new groups, high-demand activity gaps, upcoming large events) │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

The greeting rotates based on time of day (morning before noon, afternoon until 5 PM, evening after). First name is pulled from the user's display name; if the display name is a single word or full name, the first token is used.

---

#### Section 1 — My Week (Personal Calendar Strip)

A horizontal 7-day strip showing all upcoming sessions the user has RSVP'd to or is a confirmed member of (groups without explicit RSVPs still surface sessions).

**Each event tile shows:**
- Group icon (F109)
- Event title
- Day and time (e.g., "Fri 7:00 PM")
- RSVP status badge: Going / Maybe / Not Going / No response
- Roll20 badge (F110) if applicable

Days with no events show a quiet empty state: "Nothing scheduled — [Browse groups ↗]."

Tapping any event opens the full event popover from F94 Part 1 (session detail with RSVP controls and Add to Calendar). A "View full calendar →" link at the bottom of the strip opens the unified `/calendar` page (F94 Part 3).

**Data source:** Queries `events` joined to `group_members` + `event_rsvps` for the authenticated user, filtered to the next 7 days, ordered by `start_time ASC`. Cached per-user with a 2-minute TTL; invalidated on new RSVP, new event creation, or event cancellation.

---

#### Section 2 — Recommended For You

Groups the user has **not yet joined**, ranked by the F60 match scoring algorithm (interest 40%, game title 20%, location 15%, availability 15%, platform 5%, experience 5%). Minimum score of 35 required to display a card (same threshold as F26 onboarding).

**Displayed as:** A horizontal scroll row of 4–6 group cards (same card component as Discover). Each card shows:
- Group icon (F109)
- Group name, category, location
- Member count and health badge
- "Why it matched" chip (top matching signal — e.g., "You play D&D", "Near you", "Matches your schedule")
- Roll20 badge if applicable (F110)
- One-tap Join / Request / Save for Later

"See all recommendations →" opens Discover with the user's interests and location pre-applied as active filters.

**Zero-match state:** If no groups score ≥ 35 (e.g., a brand new user with sparse interests), this section shows the warm empty state from F26: "We'll find better matches as more groups are added — your saved alert is active" with a link to browse Discover manually.

---

#### Section 3 — My Groups — Recent Activity

A feed of new activity across all the user's joined groups, showing what has happened since the user's last visit. Events are ordered by recency. Each item links directly to the relevant content.

**Activity types surfaced:**

| Activity | Display |
|---|---|
| New forum post in a group | "[Group name] · New post: "[Post title]" by [Author]" |
| New member joined a group | "[Group name] · [Name] just joined — say hello 👋" |
| New poll opened | "[Group name] · New poll: "[Poll question]" — vote now" |
| New resource added | "[Group name] · New resource posted: "[Resource title]"" |
| Upcoming session (within 48h, no RSVP yet) | "[Group name] · Session in [X hours] — you haven't RSVP'd yet" |
| Session cancelled | "[Group name] · Session on [date] was cancelled" |
| Group announcement | "[Group name] · 📌 [Announcement preview]" |

Maximum 15 activity items shown. "See all activity →" links to the existing `/activity` feed (F63). Items the user has already seen (scrolled past on a previous visit) are visually de-emphasised (reduced opacity) but not hidden.

**Read state:** `home_feed_last_seen_at` column on `users` table. Items with `created_at > home_feed_last_seen_at` are treated as new and shown with an unread dot.

---

#### Section 4 — My Forum Threads

Forum threads the user has **posted to or reacted to** that have received new replies since the user's last visit. This is the primary re-engagement surface for forum participation.

**Each thread row shows:**
- Group icon (F109) + group name
- Thread title
- Number of new replies since last visit (e.g., "3 new replies")
- Preview of the most recent reply (first 80 characters, truncated)
- Time of last reply (relative: "2 hours ago")

Threads with no new activity since the last visit are not shown. Maximum 10 threads displayed. "See all forum activity →" links to a filtered view of the forum (F61) showing only threads the user has participated in.

**Zero-state:** If the user has not posted to any forums yet, this section shows: "You haven't joined any forum discussions yet. [Browse your groups' forums →]."

---

#### Section 5 — Trending in Your Interests

Discovery-oriented content surfaced from across the platform, personalised to the user's stated interest tags. This section keeps even long-tenured members who are happy with their current groups connected to what is growing in their hobby ecosystem.

**Content types:**

| Type | Trigger | Display |
|---|---|---|
| New group in a matching category | Group created in last 14 days with interest tag matching the user | "New [D&D / Basketball / etc.] group near you — [Group name]" |
| High-demand activity gap | F94 Part 5 gap detected in user's interest tag (< 3 groups or no sessions in 30 days) | "Wanted: more [Tag] groups in [City] — [X] people have said they'd join one" |
| Large upcoming event | Session with ≥ 10 RSVPs in user's interest category | "[Group name] · [X] people going to [Event title] on [Date]" |

Maximum 6 items. This section is suppressed entirely for users who have joined ≥ 10 groups (assumed power users who don't need discovery nudges on the home page).

---

#### Personalisation Signals

The dashboard draws on all existing personalisation infrastructure:

| Signal | Source | Used in sections |
|---|---|---|
| Stated interests | F26 onboarding | 2, 5 |
| Group memberships | `group_members` table | 1, 3, 4 |
| RSVP history | `event_rsvps` table | 1 |
| Forum participation | `forum_posts` + `chat_messages` | 4 |
| Match scoring algorithm | F60 signals table | 2 |
| Behavioural analytics | F107 PostHog event stream | 2, 5 |
| Follow graph | F83 `user_follows` table | 3 |
| Activity gap votes | F94 Part 5 `activity_gap_votes` | 5 |

---

#### Section Ordering & Customisation

The default section order is fixed: My Week → Recommended For You → My Groups Activity → My Forum Threads → Trending in Your Interests.

Users can **pin or collapse** any section using a ⚙️ "Customise" button in the top-right of the dashboard. Collapsed sections show only their heading with an expand chevron. Section visibility preferences are stored in a `home_dashboard_prefs` JSON column on the `users` table.

**Mandatory sections (cannot be hidden):** My Week, My Groups Activity.
**Optional sections (can be collapsed or hidden):** Recommended For You, My Forum Threads, Trending in Your Interests.

---

#### Performance & Caching

The home feed API (`GET /api/home/feed`) returns all five sections in a single response to avoid waterfall loading. Each section is independently computed server-side:

| Section | Cache TTL | Invalidated by |
|---|---|---|
| My Week | 2 minutes | New event, RSVP change, event cancellation |
| Recommended For You | 15 minutes | Interest update, new group created in matching category |
| My Groups Activity | 1 minute | Any new post, member join, poll, or announcement in joined groups |
| My Forum Threads | 1 minute | New reply to any thread the user has posted in |
| Trending in Interests | 30 minutes | New group in matching category, gap vote count change |

Skeleton loaders (F90) are shown per section during initial load. Sections that fail to load show a quiet error state ("Couldn't load this section — [Retry]") without breaking the rest of the page.

---

#### Database Changes

```sql
-- Read-state tracking for group activity feed
ALTER TABLE users
  ADD COLUMN home_feed_last_seen_at   TIMESTAMP,
  ADD COLUMN home_dashboard_prefs     JSONB DEFAULT '{}';
  -- home_dashboard_prefs schema:
  -- { "recommended_hidden": false, "forum_hidden": false, "trending_hidden": false,
  --   "recommended_collapsed": false, "forum_collapsed": false, "trending_collapsed": false }
```

#### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/home/feed` | Logged-in | Returns all five dashboard sections in one response |
| `GET` | `/api/home/week` | Logged-in | My Week section only (for pull-to-refresh) |
| `GET` | `/api/home/recommended` | Logged-in | Recommended groups section only |
| `GET` | `/api/home/activity` | Logged-in | My Groups activity feed only |
| `GET` | `/api/home/forum-threads` | Logged-in | My Forum Threads section only |
| `GET` | `/api/home/trending` | Logged-in | Trending in Your Interests only |
| `PATCH` | `/api/home/preferences` | Logged-in | Save dashboard section visibility / collapse prefs |
| `POST` | `/api/home/seen` | Logged-in | Update `home_feed_last_seen_at` (called on page visit) |

---

## User Stories

| # | As a... | I want to... | So that... |
|---|---------|--------------|-----------|
| 1 | New user | Sign up with my Google account | I can get started without creating a new password |
| 2 | User | Set my interests and availability in my profile | Groups know who I am before I even apply |
| 3 | User | Search for D&D groups in my city | I can find a game close to home |
| 4 | User | Filter groups by skill level | I don't end up in a group way above or below my experience |
| 5 | User | Request to join a private group | I can try to get into curated/competitive groups |
| 6 | User | See upcoming sessions for all my groups in one dashboard | I never miss a game night |
| 7 | Group Owner | Create a group with a set capacity and schedule | My group stays organized and the right size |
| 8 | Group Owner | Approve or deny join requests | I control who gets into my group |
| 9 | Group Owner | Post session events with RSVP | I know how many people are showing up |
| 10 | Group Owner | Remove a disruptive member | I keep the group experience positive |
| 11 | Member | Rate other members after a session | The community stays accountable and trustworthy |
| 12 | Member | Favorite a full group | I get notified when a spot opens up |
| 13 | User | Toggle my LFG status | Other group owners can see I'm actively looking |
| 14 | User | Switch between dark and light mode with one click | I can use the app comfortably in any lighting environment |
| 15 | Returning user | Have my theme preference remembered across sessions | I don't have to reset it every time I log in |
| 16 | New user | Be shown the Community Standards and agree before joining | I understand the rules before participating |
| 17 | User | Report a post or user for hate speech or slurs | I can flag violations so admins can act |
| 18 | Admin | View a dashboard of all pending reports | I can efficiently review and act on violations |
| 19 | Admin | Ban a user and add them to the blacklist with a reason | Violators are immediately removed and cannot rejoin |
| 20 | Admin | Whitelist a previously banned user after appeal review | I can restore access to users who have been cleared |
| 21 | Banned user | See a clear message explaining my ban when I try to log in | I understand why I was removed and that it is permanent |
| 22 | User | Block another user from interacting with me | I have immediate personal control without waiting for admin action |
| 23 | User | Mute a user's posts without notifying them | I can reduce noise in a group without creating conflict |
| 24 | Group Owner | Promote a trusted member to Co-Moderator | I have help managing the group without giving away full ownership |
| 25 | Co-Moderator | Issue a warning or temporary mute to a disruptive member | I can handle minor conduct issues at the group level |
| 26 | User | Have my messages checked for hate speech before they're posted | Violations are caught before others see them |
| 27 | User | List my roles and positions on my profile (e.g., Healer, Goalkeeper) | Groups can see what I bring before I even apply |
| 28 | Group Owner | Post open roles my group needs | I attract the right kind of members, not just anyone |
| 29 | User | See a "You match this role" flag on group cards | I can quickly spot groups that genuinely need someone like me |
| 30 | User | See a group's last activity date and health status | I don't join a group that hasn't met in months |
| 31 | Group Owner | Receive a nudge when my group has been inactive | I'm reminded to keep the group alive and engaged |
| 32 | New member | Be prompted to introduce myself when I join a group | My first interaction is guided so it doesn't feel awkward |
| 33 | Existing member | Be notified when a new member joins and introduces themselves | I can welcome them and make them feel included |
| 34 | Admin | Issue a temporary suspension instead of an immediate permanent ban | I have a proportional response for serious-but-not-zero-tolerance violations |
| 35 | User | Set accessibility and language filters in group discovery | I find groups that work for my needs and communication style |
| 36 | User | See a trust score and verified badge on other users' profiles | I can make informed decisions about who I join groups with |
| 37 | Local group member | Access safe meeting guidelines before attending a first in-person meetup | I know how to protect myself when meeting strangers |
| 38 | User | Enable a safe check-in for an in-person event | Someone I trust is notified if I don't confirm I'm safe |
| 39 | New user | Be guided through setting up my profile and finding a group after registration | I find value immediately instead of landing on an empty screen |
| 40 | User | See a helpful message when no groups match my search | I know what to do next instead of facing a blank results page |
| 41 | User | Save a set of search filters as an alert | I'm notified when a new matching group is created without having to check manually |
| 42 | Group Owner | Transfer ownership of my group to a trusted co-moderator | My group doesn't die if I have to step away |
| 43 | Co-Moderator | Receive automatic ownership if the owner goes inactive | The group can keep running without administrative intervention |
| 44 | Member | Add a session event to my Google Calendar with one click | I don't miss sessions because I forgot to check the app |
| 45 | Group Owner | Create a recurring weekly session template once | I don't have to manually post a new event every single week |
| 46 | Member | Confirm whether I actually attended a session after it ends | My trust score reflects my real participation, not just RSVPs |
| 47 | Member | Write a quick session recap that gets pinned to the group feed | Members who couldn't attend stay in the loop |
| 48 | Group Owner | Send email invitations to people outside the platform | I can recruit members from my existing social circles |
| 49 | Group Owner | Get a QR code for my group to post at a venue or on a flyer | People can discover and join my group in the real world |
| 50 | User | Access RollCall's Terms of Service and Privacy Policy | I understand my rights and how my data is used before signing up |
| 51 | User | Request a download of all my data or permanently delete my account | I have full control over my personal information |
| 52 | Group Owner | Add a recurring Zoom link to the group's Resource Hub | Members can always find the meeting link without asking |
| 53 | Member | Find pinned resources (house rules, reading lists, links) in one place | I don't have to scroll through the entire message board to find key info |
| 54 | Group Owner | Create a poll asking members which night works for the next session | I coordinate scheduling inside RollCall instead of in a side chat |
| 55 | Member | Vote anonymously on a poll | I can share my honest preference without social pressure |
| 56 | User | Install RollCall on my phone's home screen like a native app | I can access it quickly without opening a browser |
| 57 | User | Receive a push notification when a new session is posted | I stay informed even when I'm not actively using the app |
| 58 | Non-member | View a group's public preview page and share it without logging in | I can evaluate and recommend a group to friends before committing |
| 59 | User | Have my group link unfurl with a preview card in Discord or iMessage | Sharing the group looks professional and actually gets people to click |
| 60 | User | Search "dungeon" and find D&D groups despite not knowing the exact tag | The search is smart enough to understand what I'm looking for |
| 61 | User | See groups relevant to my schedule and location when I first open Discover | I don't have to manually configure filters every single time |
| 62 | User | Turn off email notifications for group messages while keeping in-app | I'm not flooded with emails but still see everything when I log in |
| 63 | User | Set quiet hours from 11 PM to 8 AM | I'm not woken up by push alerts when I'm asleep |
| 64 | User | Pause all notifications for a week | I can take a break without missing permanent settings |
| 65 | Group Owner | Receive a daily digest email instead of instant alerts | I can review everything in one morning read without constant interruptions |
| 66 | New user | Find answers to common questions without contacting support | I can solve my own problems quickly and get back to using the platform |
| 67 | User | Search the Help Center for a specific topic | I don't have to scroll through every category to find what I need |
| 68 | User | See a Help link when I get a ban message or moderation notice | I can understand my rights and what comes next without guessing |
| 69 | Admin | Add and update FAQ answers without a code deployment | I can keep the Help Center accurate as the platform evolves |
| 70 | User | See a badge on my profile when I reach a milestone | Others can see I'm an experienced, reliable member before I even apply to a group |
| 71 | User | Get notified the moment I earn a new badge | I feel recognized for my participation right away |
| 72 | User | Share a badge I earned to one of my group feeds | I can celebrate an achievement with the people I play with |
| 73 | Group Owner | See a "Trusted Organizer" badge on a member's profile | I know they have a track record before I promote them to co-moderator |
| 74 | Admin | Manually award a custom "Community Champion" badge to a user | I can recognize exceptional contributions that no automated trigger covers |
| 75 | User | Add up to 3 trusted contacts who will receive an alert if I need help | Someone I trust always knows I'm safe when I meet strangers in person |
| 76 | User | Trigger a silent alarm discreetly without anyone nearby noticing | I can call for help in a dangerous situation without escalating it |
| 77 | User | Have 5 seconds to cancel an accidental alarm trigger | I don't send a false alert to my contacts if I tap the logo by mistake |
| 78 | User | Receive an auto-escalation alert to my contacts if I don't check in | Help still reaches my contacts even if I can't interact with my phone after the alarm fires |
| 79 | User | Test my alarm setup before I need it | I can confirm my contacts are verified and the alert works before attending my first in-person meetup |
| 80 | User | See a nudge to set up trusted contacts when I RSVP to a local event | I'm reminded to prepare for safety before I actually need it |
| 81 | User | Join a waitlist when a group I want is full | I don't lose my chance just because I found the group a day late |
| 82 | User | See my waitlist position on the group page | I know how long I might be waiting before committing to the queue |
| 83 | User | Receive an automatic invite when a spot opens up | I get first shot at the opening based on when I joined the waitlist, not who clicks fastest |
| 84 | Group Owner | Skip a waitlisted user and move them to the end of the queue | I have flexibility to manage who joins my group without losing their place entirely |
| 85 | Group Owner | Cancel a single session with a reason without deleting the whole recurring schedule | Members are notified cleanly and the group keeps its weekly rhythm |
| 86 | Member | Receive a notification when a session is cancelled or rescheduled | I don't show up to a meeting that isn't happening |
| 87 | Member | Have my RSVP reset when a session is rescheduled so I can reconfirm | My attendance is always an accurate reflection of whether I can actually make the new time |
| 88 | User | Submit an appeal if I receive a warning or suspension I believe was unfair | I have a structured way to contest a decision rather than feeling powerless |
| 89 | Admin | Review moderation appeals before the 5-day deadline | I stay on top of outstanding appeals without them slipping through |
| 90 | User | See a CAPTCHA during registration to prove I'm human | The platform stays free of bot accounts |
| 91 | User | Edit a message I posted within 15 minutes of sending it | I can fix a typo or clarify without deleting the whole post |
| 92 | Member | See an "edited" label on a message that was changed after posting | I know when something was updated so I have full context |
| 93 | User | Rate the group and host after each session separately from rating individual members | I can give feedback on the experience itself, not just the people in it |
| 94 | User browsing groups | See a star rating on group cards showing average session quality | I can make an informed choice about which groups to join |
| 95 | User | Save a player I enjoyed gaming with to a private list | I can find them again easily without both of us having to be in the same group |
| 96 | User | Get notified when a saved player turns on their LFG status | I can reach out when someone I like playing with is available |
| 97 | User | Skip just this week's D&D session without changing the recurring schedule | I don't have to rebuild the whole template just to take a break |
| 98 | User | See a rescheduled session on the group calendar with the new date clearly marked | I always know when the next session is actually happening |
| 99 | User | Generate backup recovery codes when I set up MFA | I have a fallback if I ever lose my phone |
| 100 | User | Recover my account via SMS verification if I lose access to my email | I'm not permanently locked out just because I changed email providers |
| 101 | User | Upload a profile photo and have it automatically checked for inappropriate content | My avatar is reviewed before anyone else sees it so the community stays safe |
| 102 | User | See a default avatar using my initials if I haven't uploaded a photo | My profile looks complete even without a custom image |
| 103 | Admin | Review flagged avatar uploads in the moderation queue | I can approve or reject images that the AI flagged as borderline before they go live |
| 104 | User | See a soft warning if I try to share my phone number or home address in a message | I'm reminded of personal safety best practices without being blocked |
| 105 | At-risk user | See an additional safety nudge when I attempt to share personal information | I receive extra guidance because the platform knows I've had prior safety concerns |
| 106 | User | Report another user's profile photo, bio, or username for inappropriate content | I have a way to flag harmful profile content beyond just messages |
| 107 | Admin | See a profile automatically held for review when it reaches 3 reports in 7 days | High-confidence reports escalate without requiring me to manually catch every case |
| 108 | Group Owner | Set a meeting location for an in-person event using a real venue search | Members get an accurate, linkable location instead of a typed-out address that might have errors |
| 109 | Confirmed member | See the full venue address and an "Open in Google Maps" button for an event I've RSVP'd to | I can navigate directly to the meetup without asking for directions |
| 110 | Public visitor | See only the city and neighborhood of a local event, not the full address | My privacy is protected from people who haven't committed to attending |
| 111 | User | Filter group search results by distance from my current location | I only see groups realistically close enough for me to attend in person |
| 112 | User | Toggle between a list view and a map view when browsing local groups | I can visually understand where groups are meeting before I commit |
| 113 | User | Enable optional SMS two-factor authentication in my security settings | I get an extra layer of account protection without it being forced on me |
| 114 | User | Receive a one-time SMS code when I log in with 2FA enabled | My account is protected even if someone steals my password |
| 115 | User | Download backup codes when I enroll in 3FA | I have a way to access my account if I lose my phone |
| 116 | User | Join an open group with a single tap from the group page | I don't have to wait for approval when a group accepts anyone |
| 117 | User | See a clear confirmation before I leave a group | I don't accidentally leave a group by tapping the wrong button |
| 118 | Group Owner | Be required to transfer ownership before I can leave my own group | My group doesn't become ownerless and inactive just because I'm moving on |
| 119 | User | See a timeline of all the groups I've joined and sessions I've attended | I can look back on my activity and share my history with potential new groups |
| 120 | User | Toggle my activity history between public, members-only, and private | I control how much of my history is visible to others |
| 121 | User with visual needs | Increase the text size across the entire platform | I can comfortably read all content without squinting or zooming |
| 122 | User with photosensitivity | Enable reduced motion mode to stop animations and transitions | I can use the platform without triggering discomfort or migraine symptoms |
| 123 | Screen reader user | Enable a screen-reader-optimized layout | All interactive elements are properly labeled so my assistive technology works correctly |
| 124 | User with sensory needs | Filter group discovery to show only groups tagged as Neurodivergent-Friendly or Low Sensory | I can find communities that have explicitly stated they'll be accommodating |
| 125 | Group Owner | Tag my group with accessibility attributes (e.g., Beginner Safe, Deaf/HoH) | Members with specific needs can find my group through accessibility filters |
| 126 | New user | See a personalized "For You" feed of groups matching my interests on first login | I immediately find relevant communities without having to manually search |
| 127 | User | See a chip on each recommended group explaining why it was suggested (e.g., "Matches: D&D, Weekends") | I understand why a recommendation appeared instead of wondering if it's relevant |
| 128 | User | Tap "More Like This" on a group page to see similar groups | I can explore adjacent communities without starting a new search from scratch |
| 129 | User | See a "Trending Near You" section on the Discover page | I can spot popular local groups gaining momentum without knowing to search for them |
| 130 | Group member | Browse the Forum tab on my group page for discussions, tips, and points of interest | I have a structured space for conversations beyond the main message board |
| 131 | Group member | Post a Tip in my group's forum to help new members | My accumulated knowledge is preserved in a searchable, pinnable format |
| 132 | Group member | Mark a location as a Point of Interest in the forum | Other members can easily find and revisit recommended venues or resources |
| 133 | Group member | React to a forum reply with "Helpful" | The best advice rises to the top and contributors earn recognition |
| 134 | User | See a warning modal before leaving RollCall to visit an external link | I know I'm leaving the platform and can decide whether to continue |
| 135 | User | Type @ in a post or message and see a list of group members I can mention | I can call out a specific person without having to hope they see a general message |
| 136 | User | Receive an instant in-app notification when someone mentions me by name | I never miss a direct call-out even if I'm not actively watching that group |
| 137 | User | See my name highlighted in the original post when I arrive via a mention notification | I land in exactly the right context and can see what was said about me at a glance |
| 138 | User | Receive a real-time toast alert without refreshing the page when I get a new notification | I stay informed of urgent updates while I'm actively using the platform |
| 139 | User | See new notifications appear instantly in my bell dropdown without needing to reload | My unread count stays accurate and I can act on alerts immediately |
| 140 | User | Visit a single Activity page that shows everything happening across all my groups | I get a complete picture of my community life without checking each group separately |
| 141 | User | Filter my Activity feed to show only mentions directed at me | I can quickly find the conversations where someone needs my attention |
| 142 | User | See a dot on the Activity nav link when I have unseen group events | I know at a glance that something happened without opening the page |
| 143 | Group Owner | See when a new member joins, a poll is created, or a session is added — all in one feed | I can stay on top of my group's activity without monitoring every sub-section manually |
| 144 | User | Control whether @mention notifications reach me by email, push, or in-app only | I get mentioned frequently and want to choose the right channel for my workflow |
| 145 | User | Upvote a forum post or reply I found helpful | I can signal quality content with one tap so other members know what's worth reading |
| 146 | User | Downvote a post I think is off-topic or unhelpful | I can help the community surface good content without needing to report or flag |
| 147 | User | Change or retract my vote after I've cast it | I can correct a misclick or update my opinion if the conversation evolves |
| 148 | User | See a forum sorted by top-voted posts | I can jump straight to the best contributions in a busy thread without scrolling through everything |
| 149 | User | See a post that has been heavily downvoted collapsed with an option to expand it | I'm not forced to see low-quality content but I still have the choice to read it |
| 150 | Post author | Earn a Rising Star badge when my post reaches a net score of +10 | My best contributions are recognised and visible on my profile |
| 151 | User | Wrap text in spoiler tags when writing a forum post or message | I can share plot details or game outcomes without ruining the experience for others |
| 152 | User | See a blurred spoiler block with a label telling me what it contains | I can decide whether I want to reveal the content before I accidentally read it |
| 153 | User | Click or tap a spoiler block to reveal the hidden text | I choose exactly when I see sensitive content on my own terms |
| 154 | User | Hover over a spoiler on desktop to get a blurred peek before committing to reveal | I can judge whether it's relevant to me without fully exposing the content |
| 155 | User | Re-hide a spoiler after I've revealed it | I can keep my screen clean if I'm sharing it with someone who hasn't seen the content yet |
| 156 | User | See a placeholder instead of a spoiler excerpt in the group feed | I don't accidentally read spoilers while browsing before I've opened the full post |
| 157 | User | Send a private direct message to another member | I can have one-on-one conversations outside of group channels |
| 158 | User | Accept or decline message requests from people I'm not connected with | I control who can start a direct conversation with me |
| 159 | User | Opt in to read receipts in a DM thread so I can see when my message was seen | I know my messages were received without having to ask in the group chat |
| 160 | User | Receive a real-time notification when a new direct message arrives | I never miss an important private conversation |
| 161 | User | Opt out of product analytics tracking from my Privacy settings | I have control over how my usage data is collected and used |
| 162 | Admin | View platform-wide metrics like daily signups, retention rates, and active groups | I can monitor the overall health and growth trajectory of RollCall |
| 163 | Admin | See funnel conversion data showing where users drop off in onboarding | I can identify and address friction points in the new-user experience |
| 164 | New user | Receive a helpful welcome email series during my first week | I get clear guidance on how to get the most out of RollCall |
| 165 | User | Opt in to a weekly digest email summarising new groups and upcoming local events | I stay informed about activity without needing to check the app every day |
| 166 | User | Receive a 2-hour reminder email before a session I've RSVPed to | I never accidentally forget a scheduled game night |
| 167 | Inactive user | Receive a re-engagement email highlighting new features and groups after 14 days away | I'm reminded of the platform's value and can easily return |
| 168 | Group Owner | View how many people visited my group page over the past 7 and 30 days | I can gauge interest in my community and spot growth trends |
| 169 | Group Owner | See a breakdown of where my new members came from (search, referral, direct link, social share) | I know which discovery channels are working so I can focus my promotion efforts |
| 170 | Group Owner | Track RSVP counts and attendance rates for each of my past sessions | I can plan future session sizes and formats based on real participation data |
| 171 | Group Owner | Export my group analytics data as a CSV file | I can analyse the data in my own spreadsheets or share it with co-organizers |
| 172 | Visitor | Find RollCall group pages in search engine results when searching for hobby communities | I can discover communities through Google without already knowing about the platform |
| 173 | Group Owner | Have my group's public page and upcoming events automatically included in the sitemap | My group gets maximum organic search visibility |
| 174 | User | Share my unique referral link with friends via copy-to-clipboard or social share | I can easily invite people I know to join RollCall |
| 175 | User | Earn a Community Builder badge when a friend I referred signs up and joins a group | I'm recognised for helping grow the RollCall community |
| 176 | Referred new user | Receive a 14-day extended onboarding window with guided tips when I sign up via a friend's link | I get extra help getting started on the platform |
| 177 | Group Owner | Create a secret group that does not appear in search results, the Discover page, or on my public profile | I can run a private community that's invisible to people outside the group |
| 178 | Group Owner | Generate a time-limited invite link for my secret group with a custom expiry date | I can share access securely and revoke it automatically after a set period |
| 179 | User | Join a secret group only by following a valid, unexpired invite link | I'm added to exclusive communities through a trusted invitation without the group being discoverable |
| 180 | New Group Owner | Choose from eight pre-built group templates (e.g., TTRPG Campaign, Board Game Night, Sports Team) when creating a group | I save setup time and start with a well-structured, complete group listing |
| 181 | New Group Owner | See template-recommended fields pre-filled in the group creation form based on my chosen template | I can launch a polished, appealing group page in just a few minutes |
| 182 | User | Submit a request to permanently delete my account and all associated data | I can exercise my right to erasure under GDPR and CCPA |
| 183 | User | Download a complete ZIP export of all my data before deleting my account | I keep a personal record of my profile, posts, and activity history before I leave |
| 184 | Admin | View and process pending data deletion requests within the required 30-day window | I can fulfil right-to-erasure obligations promptly and remain legally compliant |
| 185 | User | Check the current platform status from a public status page without needing to log in | I can immediately tell whether an issue is on my end or a platform-wide problem |
| 186 | User | Subscribe to status updates by email so I'm notified when an incident is resolved | I don't have to keep refreshing the status page during an outage |
| 187 | User | See an in-app banner when the platform is experiencing degraded performance | I'm aware of issues before I encounter them unexpectedly |
| 188 | Admin | Create and update incident reports on the status page | I can communicate transparently with users during and after any outage |
| 189 | User | Submit a categorised support ticket when I have an issue that isn't answered in the Help Center | I can get help from the platform team for problems that FAQs can't solve |
| 190 | User | Receive a reference number and expected response time after submitting a support ticket | I know my issue has been received and when to expect a reply |
| 191 | Admin | View, reply to, and resolve support tickets from a dedicated queue in the Admin Panel | I can efficiently handle user issues and keep response times within SLA |
| 192 | Admin | See flagged new accounts that share IP addresses or device fingerprints with previously banned users | I can review potential ban-evaders before they cause harm |
| 193 | Admin | Clear or escalate an account link flag with a reason that is saved to the audit log | I have a documented, accountable process for reviewing suspicious accounts |
| 194 | User | Receive an email security alert when suspicious activity is detected on my account | I'm informed immediately and can take action to secure my account |
| 195 | User | Be required to re-authenticate before performing sensitive actions when my account has elevated risk signals | My account is protected with proportionate friction when something looks unusual |
| 196 | Admin | View a read-only, tamper-proof audit log of all admin actions filtered by date range, event type, or admin | I can investigate incidents, support appeals, and demonstrate compliance accountability |
| 197 | Admin | Export a filtered section of the admin audit log as a CSV for compliance or legal review | I can provide documentation to auditors without granting direct database access |
| 198 | Platform Owner | Know that admin audit log entries are never included in user data export ZIPs | Sensitive admin deliberations and reviewer identities remain confidential |
| 199 | User | Set a secret code word that silently fires my safety alarm when I type it in any chat | I can call for help in a dangerous situation without my phone ever appearing unusual to someone nearby |
| 200 | User | Choose whether my code word alarm skips the countdown or still shows the 5-second window | I can decide how instantly the alarm fires based on how I might realistically need to use it |
| 201 | User | Restrict my code word trigger to only DMs or only group chats instead of all text fields | I can prevent accidental triggers in contexts where I'm unlikely to need the alarm |
| 202 | User | Know that my secret code word is never stored in plain text and is never visible to anyone including admins | I can trust that my safety phrase cannot be exposed through a data breach or admin misuse |
| 203 | User | Configure how many taps or shakes are needed to trigger the alarm | I can tune the sensitivity to match my situation — faster in high-stress moments, safer against accidents when I'm relaxed |
| 204 | User | Set a personal PIN that must be entered to confirm "I'm Safe" | A coerced tap on the "I'm Safe" button won't clear my alarm if someone is forcing me to interact with my phone |
| 205 | User | Choose whether each trusted contact receives SMS, email, or both when my alarm fires | I can match the alert method to how each contact is most reliably reachable |
| 206 | User | Write a custom alarm message for a specific trusted contact | I can include personal context like a home address or code instructions that only that contact would understand |
| 207 | User | Send a clearly labeled test alarm to all my contacts without triggering a real event | I can make sure my contacts know what to expect and that the system is working before I ever need it |
| 208 | User | Follow another user from their profile so I can see when they join or start new groups | I can stay loosely connected with people I enjoy playing with without needing to be in the same group |
| 209 | User | See a "Following" activity tab that shows what the people I follow have been doing | I can discover new groups organically by watching where people I trust are spending their time |
| 210 | User | Require approval before anyone can follow me | I control who gets to see my group activity and public social graph |
| 211 | User | Hide my follower and following counts from my public profile | I can use the follow system privately without it becoming a social status metric |
| 212 | User | See a "People You Might Know" section when I join a new group | I can quickly follow members who share my interests without hunting through the member list |
| 213 | User | See group recommendations on my Discover page based on groups that people I follow have recently joined | I discover communities that people I trust are actively choosing, not just algorithmically matched tags |
| 214 | User | See "You browsed this group recently" chips on my For You feed when I've previously visited a group | I can easily find groups I showed interest in but didn't join yet |
| 215 | User | Opt out of browsing-history-based recommendations from my Privacy settings | I keep control over which signals are used to personalise my experience |
| 216 | Group member | Send and receive real-time chat messages with my group inside RollCall without needing an external app | I can stay connected with my community safely without being asked to hand over my phone number or join a Discord server |
| 217 | Group member | Chat in separate channels like #general and #scheduling | I can keep different types of conversation organised without everything going into one noisy feed |
| 218 | Group member | See typing indicators and online presence so conversations feel live | I know when others are actively engaged and my message won't feel like it's going into a void |
| 219 | Group member | Report a chat message for harassment, hate speech, or unsafe contact sharing | I have a fast way to flag exactly the behaviour that makes online communities unsafe |
| 220 | Group member | React to messages with emoji without needing to write a reply | I can acknowledge or respond to messages quickly in a way that keeps the chat readable |
| 221 | Group member | Reply to a specific message inline so threaded conversations stay readable | I can respond to something said 20 messages ago without everyone losing context |
| 222 | Co-moderator | Delete any message and mute a member in chat for a set duration | I can stop harassment or spam in real time without waiting for a platform admin to intervene |
| 223 | Co-moderator | Enable Slow Mode on a channel to limit how often each member can post | I can cool down heated conversations or prevent spam floods without locking the channel entirely |
| 224 | Group owner | Create, rename, and archive channels to match how my community communicates | I can structure the group's chat space to fit our needs as we grow |
| 225 | Group owner | See a pinned chat rules message at the top of every channel that links to the group rules | New members immediately understand expected conduct without me having to restate the rules every time |
| 226 | Admin | View message history for any group's chat channels as part of a safety investigation | I can act on reports with full context and evidence rather than relying on screenshots that could be fabricated |
| 227 | Parent / Guardian | Receive an email consent request when my child signs up for RollCall | I can approve their account and stay informed about where they are meeting people in person |
| 228 | Parent / Guardian | See which groups my child belongs to and which in-person events they have RSVPed to from the Guardian Portal | I have the visibility I need to keep them safe without invading their everyday conversations |
| 229 | Parent / Guardian | Revoke my consent at any time to immediately deactivate my child's account | I retain control if I become concerned about their activity on the platform |
| 230 | Minor user | Have my parent automatically notified when I RSVP to an in-person event | I know my parent is informed about my plans so I can attend with their awareness and support |
| 231 | User with ADHD or sensory sensitivities | Enable a distraction-free chat mode that hides avatars, timestamps, and animated reactions | I can follow conversations without the visual noise that causes me to lose focus or feel overwhelmed |
| 232 | User | Choose between comfortable, compact, and spacious message density across the app | I can tune the information density to match how my brain processes best on any given day |
| 233 | User with chronic illness | Add an optional accessibility note to my RSVP so the organizer knows I may need extra support at that specific session | I can attend without having to disclose my condition permanently on my public profile |
| 234 | Group owner | See a summary of accommodation requests from attending members before a session | I can prepare appropriately and acknowledge members' needs without broadcasting them to the group |
| 235 | User | Switch all non-critical notifications off with one tap while keeping safety and ban alerts active | I can have quiet time without the risk of missing something that genuinely requires my attention |
| 236 | User | Set Quiet Hours so notifications are held and delivered as a morning summary | I am not interrupted during sleep or focused time but still receive everything I missed |
| 237 | New group owner | Be guided through inviting members, posting a welcome message, and scheduling a first session right after creating my group | I start with momentum instead of staring at an empty group page wondering what to do |
| 238 | User | See skeleton placeholder cards while the Discover page loads instead of a blank screen | I know content is coming and feel confident the app is working, even on a slow connection |
| 239 | Group owner | See a "Group Health & You" section in my analytics dashboard showing my moderation workload and co-mod activity | I can spot early signs of burnout or an inactive co-mod before the group starts to suffer |
| 240 | User in distress | See a gentle prompt with crisis support resources if my messages suggest I may be struggling | I am reminded that help exists without being judged, blocked, or having my message removed |
| 241 | User | Access mental health crisis resources from the site footer at any time | Support is always findable — not hidden behind a triggering event |
| 242 | Community member | Nominate a group member for a shoutout once a month to publicly recognise how they make the group better | I can express genuine appreciation for someone in a way that badges and vote counts cannot capture |
| 243 | User | Earn the Community Champion badge after receiving 5 peer shoutouts across groups over three months | I am recognised for the kind of social contribution that no algorithm would otherwise notice |
| 244 | Group member | View my group's upcoming events in a full calendar with month, week, and list views | I can see at a glance what's coming up without scrolling through the activity feed |
| 245 | Group owner | Make my group's calendar public so anyone browsing RollCall can see upcoming events | I can attract new members by letting people discover what my group actually does, not just read a description |
| 246 | Visitor | Browse a public group's calendar before deciding whether to request to join | I can see what sessions look like — frequency, format, skill level — before committing to anything |
| 247 | Visitor | Request to join a group directly from an event on their public calendar | I can act on my interest the moment I find an event that excites me |
| 248 | User | See all my groups' events combined on a single personal calendar at `/calendar` | I have one place to manage my entire hobby schedule without switching between group pages |
| 249 | User | Toggle individual groups on and off in my unified calendar view | I can focus on just this week's D&D sessions without seeing my sports team's schedule cluttering the view |
| 250 | User | Filter events by activity type, skill level, format, and date range | I can instantly narrow a busy calendar to exactly the kind of session I want to find or attend |
| 251 | User | Export all my upcoming events from every toggled group as a single .ics file | I can subscribe to my full RollCall schedule in Google Calendar or Apple Calendar with one import |
| 252 | User | See which activity types have no available groups in my area on a "What's Missing" discovery tab | I can understand what the local community is lacking, not just what already exists |
| 253 | User | Tap "I'd join this" on a missing activity card to signal demand | My interest gets counted and I can be notified when someone starts the group I was looking for |
| 254 | User | See how many other people near me have also voted for a missing activity type | I know whether I'd be joining a community or building one from scratch |
| 255 | User | Create a group for a missing activity type with the category and template pre-filled from the gap card | The most important friction — what do I call it and how do I set it up — is removed before I even start |
| 256 | Gamer | Enable the Crossplay toggle on my group so players on different consoles can find and join us | I don't want to miss out on great players just because they use Xbox instead of PlayStation |
| 257 | Gamer | Filter the Discover page to show only crossplay-enabled groups | I can find groups that will actually let me play with my friends regardless of platform |
| 258 | Nintendo Switch player | Enter my Nintendo Switch Friend Code in my profile's linked accounts | Group owners and teammates can add me in-game without us having to share codes through a separate channel |
| 259 | Group owner | Select Nintendo Switch as a supported platform when creating my gaming group | Players searching for Switch groups can actually find mine in filtered results |
| 260 | User | See a conduct warning badge on a member's profile when they have received multiple recent warnings | I can make an informed decision about whether to invite them to my group or accept their join request |
| 261 | User | Print my group's upcoming events as a clean, ink-friendly list from the group calendar | I can put the schedule on the fridge, share it at our club meeting, or save it as a PDF without having to screenshot every event |
| 262 | User | Print all my upcoming events from my unified personal calendar as a single formatted page | I have a physical copy of my full hobby schedule for the week or month without juggling multiple apps |
| 263 | User | Add my Discord username to my profile so group members can find me for voice chat | I don't have to paste my Discord tag into every group chat — it's already there on my profile |
| 264 | User | Add my YouTube channel to my profile to share related content with my hobby groups | Members can discover my gameplay videos, tutorials, or club highlights without me spamming links in group chat |
| 265 | New user | Enter my ZIP code when creating my account so the platform can show me local groups right away | I don't have to configure any location settings or grant GPS permission just to see what's happening near me |
| 266 | User | Search for groups near a ZIP code I type in, not just my registered location | I can find groups near a friend's house, a vacation spot, or any area I plan to visit — without changing my account settings |
| 267 | Gamer | Search for online gaming groups by game title, including common abbreviations | I can type "MTGA" and find Magic: The Gathering Arena groups without having to know the exact name used in every group's description |
| 268 | Outdoor enthusiast | Set my experience level per activity category on my profile so groups can match me appropriately | I am not blocked from hiking groups I'm qualified for just because I haven't set up my profile |
| 269 | Group owner | Enable a minimum experience level requirement on my outdoor group so only qualified members can join | I don't have to screen every join request manually — beginners are gently redirected before they commit to a trip they're not ready for |
| 270 | User | Report a group that appears to be planning harmful activities, and see it immediately suspended while the platform owner reviews | I know my report isn't just disappearing into a queue — something actually happens the moment I flag a dangerous group |
| 271 | New user | Be automatically shown groups that match my interests, location, and availability the moment I finish signing up | I don't have to figure out how to use the search page — the platform just tells me where I belong |
| 272 | New user | See exactly why each suggested group was matched to me during onboarding | I trust the recommendation because I can see it's based on what I actually told the platform |
| 273 | New user | Join or request to join a suggested group in one tap during onboarding | I'm already a member before I even land on my Dashboard for the first time |
| 274 | New user | Dismiss group suggestions I'm not interested in and see the next best match instead | I don't feel stuck with a list that doesn't fit me |
| 275 | New user | Be automatically notified when a group matching my interests is created, even if none exist at signup | Signing up when the platform is new isn't a dead end — I get the benefit later without having to remember to come back and search |
| 276 | New user | Sign up from anywhere and still access online groups and all platform features | I'm not locked out or put on a waitlist just because I don't live in Palm Beach County |
| 277 | User | Receive a quick check-in from RollCall 24 hours after signing up asking how it's going | Someone noticed that I joined and actually cares whether I found what I was looking for |
| 278 | User | Be asked for a platform rating after I attend my first session | I have a natural moment to share feedback while the experience is still fresh |
| 279 | User | Receive an NPS survey at two weeks and two months to share how likely I am to recommend RollCall | My opinion of the platform over time is actually captured and acted on, not just the first impression |
| 280 | User | Submit feedback, a bug report, or an idea at any time using the persistent feedback widget | I don't have to hunt for a contact page — I can share something the moment I notice it |
| 281 | Platform owner | See a dashboard of all feedback submissions across every touchpoint, with response rates and NPS scores | I can quickly understand whether onboarding is working, whether sessions are satisfying, and what users want changed |
| 282 | Platform owner | Filter and export all user feedback to a CSV | I can share findings with collaborators or dig into patterns in a spreadsheet |
| 283 | User outside Palm Beach County | Sign up for RollCall and immediately access online groups with no restrictions | I'm not turned away just because I don't live in the launch area |
| 284 | User outside Palm Beach County | See a clear, friendly explanation on local group pages explaining why I can't join them yet | I understand the situation without feeling like I hit a wall — and I know exactly what I can do instead |
| 285 | PBC resident | Join local in-person groups knowing that attendance is limited to my area | The people showing up are actually local, making it safe and practical to meet in person |
| 286 | User outside PBC | Join a county waitlist when I hit the local group gate | My interest in local groups is captured and I know I'll be told when my area opens up |
| 287 | User outside PBC | See how many other people in my county are also on the waitlist | I know I'm not alone and that there's real demand building in my area |
| 288 | Waitlisted user | Receive an email the moment local groups open in my county | I don't have to remember to check back — the platform comes to me when it's ready |
| 289 | Platform owner | Be notified when any county reaches 20 waitlisted users | I know exactly when and where demand is strong enough to justify expanding the pilot |
| 290 | Platform owner | See a ranked table of counties by waitlist count in the admin panel | I can make an informed, data-driven decision about which region to approve next |
| 291 | Platform owner | Approve a county with one action and automatically notify all waitlisted users there | Expanding to a new region is a single button press, not a manual outreach campaign |
| 292 | Visitor | See just enough about a group to know it's worth signing up for — without being able to harvest its data | I get a meaningful preview while the community's member information stays protected |
| 293 | User | Know that my email address is never visible to other members, group owners, or anyone I haven't personally shared it with | I can participate in groups without worrying about my contact details being collected |
| 294 | Group owner | Communicate with my members through RollCall's messaging tools without ever seeing their email addresses | My group is managed on the platform where everything is accountable and logged |
| 295 | User | Know that my data export only contains my own information — not a list of every member in my groups | My export gives me portability of my own history without exposing other people's data |
| 296 | Platform owner | Have all data API endpoints require a logged-in account so scrapers cannot harvest group and member data without registering | Any competitor trying to copy our community data has to create a traceable account to do it |
| 297 | Platform owner | Have automated bot detection flag accounts that hit member list endpoints at inhuman speeds | Bulk harvesting attempts are caught and suspended before they can extract meaningful data |
| 298 | User | See a dedicated mental health resource page at any time without needing a crisis event to trigger it | I can access support proactively whenever I need it, not only in a detected emergency |
| 299 | Platform owner | Edit the mental health resource list from the admin panel without a code deployment | Crisis links stay current and accurate as resources change over time |
| 300 | User | Browse rotating partner discounts relevant to my hobby interests on a dedicated page | I save money on gear, games, and accessories through the platform I already use |
| 301 | User | Copy a partner promo code to my clipboard with one tap | I can apply the discount at checkout without manually typing the code |
| 302 | Platform owner | Add, edit, hide, and expire partner deals from the admin panel | The discounts page stays fresh and accurate with minimal ongoing maintenance |
| 303 | User on an outdated browser | See a non-blocking notice that my browser may not be fully supported | I can upgrade before I hit a broken experience rather than encountering silent failures |
| 304 | Developer | Have a documented browser support matrix with automated smoke tests | I know exactly which browsers to cover in Playwright CI and can catch regressions before they reach users |
| 305 | User | Have all non-critical notifications default to opt-out | My inbox and phone are not flooded with alerts the moment I join a group |
| 306 | User | See a clear list of the notifications I cannot turn off and why they are required | I understand the minimum necessary communications for account security and can trust that everything else is genuinely optional |
| 307 | User | Choose to display a personal email or phone number on my profile so group members can reach me | I can share my contact details with people I trust without the platform forcing it |
| 308 | User | Know that my profile display email and phone are completely separate from my account login email and SMS 2FA number | Adding contact info to my profile can never accidentally expose my login credentials or security number |
| 309 | User | Have spell check active while composing forum posts and group messages | I catch typos before I post without needing a separate writing tool |
| 310 | User | Have spell check suggestions match the language my browser is set to | The spell check is relevant to the language I am actually writing in rather than defaulting to English |
| 311 | Group member | Attach a PDF to a forum post | I can share maps, reference guides, or instructions with the group directly in the thread |
| 312 | User | Know that only PDF files are accepted as forum attachments | I am protected from accidentally downloading an executable or macro-enabled file disguised as a document |
| 313 | Group member | See a reliability warning on a profile when a user has cancelled last-minute three or more times in 90 days | I can make an informed decision before accepting them into my group or offering them a spot on the waitlist |
| 314 | Group owner | Have repeated last-minute cancellations automatically reduce a user's trust score | I do not need to manually report the same pattern every time it repeats — the system enforces accountability consistently |
| 315 | User | Submit an emergency reason when I have to cancel within 24 hours | My genuine emergency is noted for admin review rather than automatically counted against my reliability record |
| 316 | Platform owner | See which features users visit versus which features they actually use in the analytics dashboard | I can prioritise the roadmap based on real engagement rather than page-view counts alone |
| 317 | Platform owner | See the full user journey from Discover to first group join as a funnel chart | I know exactly where users are dropping off and what to fix to improve conversion |
| 318 | User | Read a plain-language explanation of what behavioural data is collected and why before I accept the terms of service | I understand what is being tracked before I agree, rather than finding out later |
| 319 | User | Opt out of behavioural analytics from my Settings | I can decline tracking without losing access to any platform feature |
| 320 | New user | Be unable to create a group until my account is at least 7 days old | I understand the platform requires a short verification period before I can host a community |
| 321 | Member | See a warning notice when a group I am joining was created by a new account | I am prompted to stay alert to any requests for money before I have built trust with that organizer |
| 322 | User | Report a message, profile, or group specifically for financial solicitation or scam behaviour | I have a precise report category that communicates the nature of the threat clearly to admin |
| 323 | User | Report a profile or group for impersonating a real person, club, or brand | I can flag identity fraud without having to wedge it into an unrelated report category |
| 324 | Group owner | Acknowledge at group creation that soliciting payments from members is permanently banned | I am clearly informed of the rule before I create the group, with no ambiguity |
| 325 | Member | Trust a ✅ Verified Organizer badge on a group owner's profile as a signal of human-reviewed legitimacy | I can distinguish long-standing vetted organizers from brand-new accounts when deciding whether to join |
| 326 | Platform owner | See all flagged financial solicitation messages in the admin queue with sender account age and group context | I have the information I need to make a fast, accurate decision before harm reaches members |
| 327 | Platform owner | Grant or revoke the Verified Organizer badge from the admin panel | I can recognise trusted community builders and pull that recognition if their conduct changes |
| 328 | User | Know that my messages are screened for payment-solicitation patterns in the background without being blocked or delayed | The platform protects the community from scams without disrupting normal conversation |
| 329 | Group owner | Search for a specific video game by name and have its official cover art automatically populate as my group's icon | My Arc Raiders, Valorant, or Elden Ring group is instantly recognisable to other players without me having to find and upload artwork manually |
| 330 | Group owner | Search for a tabletop or RPG game title and have its official box art appear as my group's icon | My D&D, Pathfinder, or Gloomhaven group displays the artwork fans already associate with that game |
| 331 | Group owner | Pick from a curated icon library when my group is for a sport or activity that doesn't have a game database entry | My basketball, yoga, or book club group has a clean professional icon even without official artwork |
| 332 | Group owner | Replace any auto-populated icon with my own uploaded image at any time | I have full control over my group's visual identity regardless of what the database returns |
| 333 | User | See a recognisable game cover or activity icon on every group card in Discover | I can instantly identify groups for games or activities I know just by scanning the page — without reading every title |
| 334 | Group owner | Paste my Roll20 campaign link into my group settings once | Every member can access the campaign directly from RollCall without me having to share the link in chat every session |
| 335 | Group member | See a "Join on Roll20" button on my group page | I can jump directly into the virtual tabletop without hunting through emails or Discord for the link |
| 336 | Group member | Receive a session reminder notification that includes a direct Roll20 link | I can open the campaign and be at the table with one tap — no friction between the reminder and the game |
| 337 | User | Filter Discover to show only Roll20-linked groups | I can find games that are already set up on Roll20 and ready to play online |
| 338 | Group owner | Add a different Roll20 link to a specific one-shot session | I can run a side campaign or one-shot in a separate Roll20 room without changing my standing group's campaign link |
| 339 | Non-member | See that a group plays on Roll20 from the group card | I know the group is set up for online play on a platform I already use before I even request to join |
| 340 | Logged-in user | Land on a personalised home page every time I log in | I immediately see what is relevant to me — my upcoming sessions, groups I should join, and what is new in my communities — without having to navigate manually |
| 341 | User | See a 7-day calendar strip of my upcoming sessions on my home page | I know exactly what I have planned this week the moment I open the app |
| 342 | User | See group recommendations on my home page based on my interests | I discover new communities I would genuinely enjoy without having to search for them |
| 343 | User | See recent activity from all my joined groups on my home page | I stay connected to what is happening in my communities without visiting each group individually |
| 344 | User | See forum threads I have posted in — with new unread replies — on my home page | I can pick up active conversations without losing track of where I left off |
| 345 | User | See trending new groups and high-demand activity gaps in my interest areas | I find out when a new D&D group or basketball group appears in my area without having to check Discover manually |
| 346 | User | Collapse or hide sections of my home dashboard I do not use | My home page shows exactly what matters to me and nothing I do not care about |

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│              React + Tailwind CSS + Vite             │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS / WebSocket
┌───────────────────────▼─────────────────────────────┐
│                  API SERVER (REST)                   │
│              Node.js + Express.js                    │
│         Auth Middleware · Rate Limiting              │
└──────┬──────────────────┬──────────────────┬────────┘
       │                  │                  │
┌──────▼──────┐  ┌────────▼───────┐  ┌──────▼──────┐
│ PostgreSQL  │  │   Socket.io    │  │  Cloudinary │
│  (Primary   │  │ (Real-time     │  │  (Image     │
│  Database)  │  │  Chat)         │  │  Uploads)   │
└─────────────┘  └────────────────┘  └─────────────┘
```

### Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Frontend | React 18 + Vite | Fast, component-based, industry standard — **this is a React application** |
| Routing | React Router v6 | Client-side SPA routing with protected admin routes |
| Styling | Tailwind CSS (`darkMode: 'class'`) | Rapid UI development, consistent design system, native dark/light mode support |
| i18n | i18next + react-i18next | Internationalization — all UI strings wrapped in `t()` for future translation |
| Content Filter | `bad-words` (npm) | Server-side keyword pre-screening for hate speech and slurs |
| Fuzzy Search | Fuse.js | Client-side typo-tolerant search with synonym mapping |
| Calendar Export | `ics` (npm) | Generates RFC-5545 compliant `.ics` files for all calendar apps |
| QR Codes | `qrcode` (npm) | Server-side QR generation for group invite links |
| PWA | Workbox | Service worker, offline caching, background sync, push notifications |
| Email | SendGrid or Resend | Transactional email (invites, alerts, session reminders, check-in) |
| SMS | Twilio | Trusted contact verification SMS + silent alarm alerts (F41) |
| Backend | Node.js + Express | JavaScript full-stack, large ecosystem |
| Database | PostgreSQL | Relational data fits group/membership model perfectly |
| ORM | Prisma | Type-safe DB queries, easy migrations |
| Authentication | JWT + bcrypt (or Clerk) | Secure, stateless auth |
| Real-time | Socket.io | WebSocket abstraction for chat |
| File Storage | Cloudinary | Avatar and banner image hosting |
| Maps | Mapbox GL JS | Interactive maps for local group discovery |
| Maps (Location) | Google Maps JavaScript API + Places Autocomplete | Venue search and location tagging for in-person events (F45) |
| Maps (Static) | Google Maps Static API | Server-rendered map thumbnails in email notifications (F45) |
| Geospatial | PostGIS (PostgreSQL extension) | Radius / proximity queries using `ST_DWithin` for nearby group search (F46) |
| Hosting (FE) | Vercel | Free tier, instant deploys from GitHub |
| Hosting (BE) | Railway or Render | Managed PostgreSQL + Node hosting, free tier |

---

## Database Schema

### Users
```sql
users
  id            UUID PRIMARY KEY
  email         VARCHAR UNIQUE NOT NULL
  password_hash VARCHAR
  display_name  VARCHAR NOT NULL
  avatar_url    VARCHAR
  bio           TEXT
  location      VARCHAR
  zip_code      VARCHAR(10)              -- US ZIP code; required at registration; NEVER returned in public API responses
  timezone      VARCHAR
  experience    ENUM('beginner','casual','intermediate','competitive')
  lfg_status        BOOLEAN DEFAULT true
  reputation        DECIMAL DEFAULT 0
  theme_preference  ENUM('dark','light') DEFAULT 'dark'
  role              ENUM('user','moderator','admin') DEFAULT 'user'
  status            ENUM('active','banned','whitelisted') DEFAULT 'active'
  standards_agreed  BOOLEAN DEFAULT false
  standards_agreed_at TIMESTAMP
  date_of_birth     DATE                   -- optional; used only for COPPA compliance review; never exposed publicly
  age_confirmed     BOOLEAN DEFAULT false  -- set true when user ticks the 13+ confirmation checkbox at registration
  -- Linked gaming/social accounts (all optional, publicly visible on profile)
  linked_steam      VARCHAR
  linked_xbox       VARCHAR
  linked_psn        VARCHAR
  linked_battlenet  VARCHAR
  linked_nintendo   VARCHAR               -- Nintendo Switch friend code e.g. SW-1234-5678-9012
  linked_discord    VARCHAR               -- Discord username e.g. username#1234 or new format username
  linked_youtube    VARCHAR               -- YouTube channel URL or handle
  -- Conduct flag (auto-managed by warning system)
  conduct_flag_count  INTEGER DEFAULT 0   -- active warnings in last 90 days; shown to all users when ≥ 2
  created_at        TIMESTAMP
  updated_at        TIMESTAMP
```

### Groups
```sql
groups
  id            UUID PRIMARY KEY
  owner_id      UUID REFERENCES users(id)
  name          VARCHAR NOT NULL
  description   TEXT
  banner_url    VARCHAR
  category      VARCHAR NOT NULL
  subcategory   VARCHAR
  location_type ENUM('local','online')
  city          VARCHAR
  platform      VARCHAR
  schedule_type ENUM('recurring','one_time')
  schedule_desc VARCHAR
  capacity      INTEGER DEFAULT 8
  privacy       ENUM('public','private','invite_only')
  skill_level   ENUM('any','beginner','casual','intermediate','competitive')
  language      VARCHAR DEFAULT 'English'
  created_at    TIMESTAMP
  updated_at    TIMESTAMP
```

### Memberships
```sql
memberships
  id         UUID PRIMARY KEY
  user_id    UUID REFERENCES users(id)
  group_id   UUID REFERENCES groups(id)
  role       ENUM('owner','co_owner','member')
  status     ENUM('pending','approved','denied','banned')
  joined_at  TIMESTAMP
  UNIQUE(user_id, group_id)
```

### Events (Sessions)
```sql
events
  id          UUID PRIMARY KEY
  group_id    UUID REFERENCES groups(id)
  title       VARCHAR
  description TEXT
  starts_at   TIMESTAMP NOT NULL
  duration    INTEGER  -- in minutes
  created_by  UUID REFERENCES users(id)
  created_at  TIMESTAMP
```

### RSVPs
```sql
rsvps
  id        UUID PRIMARY KEY
  event_id  UUID REFERENCES events(id)
  user_id   UUID REFERENCES users(id)
  status    ENUM('going','maybe','not_going')
  UNIQUE(event_id, user_id)
```

### Messages (Group Feed / Chat)
```sql
messages
  id         UUID PRIMARY KEY
  group_id   UUID REFERENCES groups(id)
  user_id    UUID REFERENCES users(id)
  content    TEXT NOT NULL
  is_pinned  BOOLEAN DEFAULT false
  created_at TIMESTAMP
```

### Reviews
```sql
reviews
  id           UUID PRIMARY KEY
  reviewer_id  UUID REFERENCES users(id)
  reviewee_id  UUID REFERENCES users(id)
  group_id     UUID REFERENCES groups(id)
  rating       INTEGER CHECK(rating BETWEEN 1 AND 5)
  note         TEXT
  is_anonymous BOOLEAN DEFAULT false  -- hides reviewer identity from reviewee; visible to admins
  created_at   TIMESTAMP
  UNIQUE(reviewer_id, reviewee_id, group_id)
```

### User Tags (Interests)
```sql
user_tags
  user_id UUID REFERENCES users(id)
  tag     VARCHAR
  PRIMARY KEY(user_id, tag)
```

### Banned Users (Blacklist)
```sql
banned_users
  id              UUID PRIMARY KEY
  user_id         UUID REFERENCES users(id) UNIQUE
  ban_reason      TEXT NOT NULL
  violation_type  ENUM('hate_speech','racial_slur','harassment','sexual_harassment','sexual_abuse','derogatory','other')
  banned_by       UUID REFERENCES users(id)  -- admin user
  banned_at       TIMESTAMP NOT NULL
  is_permanent    BOOLEAN DEFAULT true
  whitelist_override BOOLEAN DEFAULT false   -- true = cleared by admin
  cleared_by      UUID REFERENCES users(id)  -- admin who cleared
  cleared_at      TIMESTAMP
  appeal_notes    TEXT
```

### Reports
```sql
reports
  id              UUID PRIMARY KEY
  reporter_id     UUID REFERENCES users(id)
  reported_user_id UUID REFERENCES users(id)
  group_id        UUID REFERENCES groups(id)  -- optional context
  message_id      UUID REFERENCES messages(id) -- optional context
  violation_type  ENUM('hate_speech','racial_slur','harassment','sexual_harassment','sexual_abuse','derogatory','spam','other')
  description     TEXT
  status          ENUM('pending','reviewed','dismissed','action_taken') DEFAULT 'pending'
  is_sensitive    BOOLEAN DEFAULT false  -- true for sexual_harassment / sexual_abuse reports
  reviewed_by     UUID REFERENCES users(id)  -- admin; NULL for sensitive reports until owner claims
  reviewed_at     TIMESTAMP
  created_at      TIMESTAMP NOT NULL
```

### Admin Audit Log
```sql
admin_audit_log
  id             UUID PRIMARY KEY
  admin_id       UUID REFERENCES users(id)
  action         ENUM('ban','unban','whitelist','remove_whitelist','dismiss_report','warn_user','suspend','promote')
  target_user_id UUID REFERENCES users(id)
  notes          TEXT
  created_at     TIMESTAMP NOT NULL
```

### Onboarding Progress
```sql
onboarding_progress
  user_id         UUID PRIMARY KEY REFERENCES users(id)
  step_completed  INTEGER DEFAULT 0
  completed_at    TIMESTAMP
  skipped         BOOLEAN DEFAULT false
```

### Saved Searches
```sql
saved_searches
  id                UUID PRIMARY KEY
  user_id           UUID REFERENCES users(id)
  name              VARCHAR NOT NULL
  criteria          JSONB NOT NULL
  notify_frequency  ENUM('instant','daily','weekly') DEFAULT 'daily'
  last_notified_at  TIMESTAMP
  created_at        TIMESTAMP NOT NULL
```

### Ownership Transfers
```sql
ownership_transfers
  id              UUID PRIMARY KEY
  group_id        UUID REFERENCES groups(id)
  previous_owner  UUID REFERENCES users(id)
  new_owner       UUID REFERENCES users(id)
  transfer_reason ENUM('manual','inactivity','admin')
  transferred_at  TIMESTAMP NOT NULL
```

### Event Recurrence Templates
```sql
event_recurrence
  id                  UUID PRIMARY KEY
  group_id            UUID REFERENCES groups(id)
  created_by          UUID REFERENCES users(id)
  title               VARCHAR
  description         TEXT
  start_time          TIME NOT NULL
  duration            INTEGER
  recurrence_type     ENUM('weekly','biweekly','monthly','custom')
  recurrence_day      VARCHAR
  recurrence_interval INTEGER DEFAULT 1
  starts_on           DATE
  ends_on             DATE
  is_active           BOOLEAN DEFAULT true
  created_at          TIMESTAMP
```

### Session Recaps
```sql
session_recaps
  id          UUID PRIMARY KEY
  event_id    UUID REFERENCES events(id)
  user_id     UUID REFERENCES users(id)
  attended    BOOLEAN
  rating      INTEGER CHECK(rating BETWEEN 1 AND 5)
  recap_note  TEXT
  created_at  TIMESTAMP NOT NULL
  UNIQUE(event_id, user_id)
```

### Group Invites
```sql
group_invites
  id          UUID PRIMARY KEY
  group_id    UUID REFERENCES groups(id)
  created_by  UUID REFERENCES users(id)
  token       VARCHAR UNIQUE NOT NULL
  max_uses    INTEGER DEFAULT 50
  use_count   INTEGER DEFAULT 0
  expires_at  TIMESTAMP
  created_at  TIMESTAMP NOT NULL
```

### Group Resources
```sql
group_resources
  id           UUID PRIMARY KEY
  group_id     UUID REFERENCES groups(id)
  created_by   UUID REFERENCES users(id)
  title        VARCHAR NOT NULL
  url          VARCHAR
  file_url     VARCHAR
  description  TEXT
  category_tag VARCHAR
  is_pinned    BOOLEAN DEFAULT false
  created_at   TIMESTAMP NOT NULL
```

### Polls
```sql
polls
  id               UUID PRIMARY KEY
  group_id         UUID REFERENCES groups(id)
  created_by       UUID REFERENCES users(id)
  question         VARCHAR NOT NULL
  allow_multi      BOOLEAN DEFAULT false
  anonymous        BOOLEAN DEFAULT false
  hide_until_close BOOLEAN DEFAULT false
  closes_at        TIMESTAMP
  is_closed        BOOLEAN DEFAULT false
  created_at       TIMESTAMP NOT NULL

poll_options
  id       UUID PRIMARY KEY
  poll_id  UUID REFERENCES polls(id)
  text     VARCHAR NOT NULL
  position INTEGER

poll_votes
  id         UUID PRIMARY KEY
  poll_id    UUID REFERENCES polls(id)
  option_id  UUID REFERENCES poll_options(id)
  user_id    UUID REFERENCES users(id)
  created_at TIMESTAMP NOT NULL
  UNIQUE(poll_id, option_id, user_id)
```

### User Blocks
```sql
user_blocks
  id         UUID PRIMARY KEY
  blocker_id UUID REFERENCES users(id)
  blocked_id UUID REFERENCES users(id)
  created_at TIMESTAMP NOT NULL
  UNIQUE(blocker_id, blocked_id)
```

### User Mutes
```sql
user_mutes
  id        UUID PRIMARY KEY
  muter_id  UUID REFERENCES users(id)
  muted_id  UUID REFERENCES users(id)
  created_at TIMESTAMP NOT NULL
  UNIQUE(muter_id, muted_id)
```

### Group Moderation Log
```sql
group_mod_log
  id           UUID PRIMARY KEY
  group_id     UUID REFERENCES groups(id)
  moderator_id UUID REFERENCES users(id)
  target_id    UUID REFERENCES users(id)
  action       ENUM('warn','mute','suspend','remove','escalate')
  reason       TEXT
  duration     INTEGER  -- minutes, null = permanent
  created_at   TIMESTAMP NOT NULL
```

### User Warnings
```sql
user_warnings
  id         UUID PRIMARY KEY
  user_id    UUID REFERENCES users(id)
  issued_by  UUID REFERENCES users(id)
  reason     TEXT
  level      INTEGER CHECK(level BETWEEN 1 AND 4)
  expires_at TIMESTAMP
  created_at TIMESTAMP NOT NULL
```

### User Roles (Position Matching)
```sql
user_roles
  user_id  UUID REFERENCES users(id)
  category VARCHAR NOT NULL
  role     VARCHAR NOT NULL
  PRIMARY KEY(user_id, category, role)
```

### Safe Check-Ins
```sql
safe_checkins
  id              UUID PRIMARY KEY
  event_id        UUID REFERENCES events(id)
  user_id         UUID REFERENCES users(id)
  contact_email   VARCHAR   -- ephemeral, not retained after event
  contact_name    VARCHAR
  checked_in      BOOLEAN DEFAULT false
  checked_in_at   TIMESTAMP
  reminder_sent   BOOLEAN DEFAULT false
  created_at      TIMESTAMP NOT NULL
```

### Trusted Safety Contacts
```sql
trusted_contacts
  id                    UUID PRIMARY KEY
  user_id               UUID REFERENCES users(id)
  name                  VARCHAR NOT NULL
  phone                 VARCHAR NOT NULL          -- E.164 format e.g. +15551234567
  email                 VARCHAR NOT NULL
  relationship          VARCHAR                   -- optional label e.g. "Partner"
  notify_via            ENUM('sms','email','both') DEFAULT 'both'
  receive_escalation    BOOLEAN DEFAULT true      -- also receives second alert
  custom_message        TEXT                      -- optional override message body for this contact
  verified              BOOLEAN DEFAULT false     -- true after they reply YES to confirmation SMS
  verification_token    VARCHAR                   -- used to match incoming YES reply
  verified_at           TIMESTAMP
  created_at            TIMESTAMP NOT NULL
  UNIQUE(user_id, phone)                          -- no duplicate phone per user
```

### User Safety Preferences (extends users table)
```sql
ALTER TABLE users
  ADD COLUMN alarm_tap_count        INTEGER DEFAULT 3,        -- 2/3/4 taps required
  ADD COLUMN alarm_tap_window_ms    INTEGER DEFAULT 1500,     -- tap window in milliseconds
  ADD COLUMN alarm_tap_enabled      BOOLEAN DEFAULT true,
  ADD COLUMN alarm_shake_enabled    BOOLEAN DEFAULT true,
  ADD COLUMN alarm_shake_sensitivity ENUM('low','medium','high') DEFAULT 'medium',
  ADD COLUMN alarm_shake_count      INTEGER DEFAULT 3,
  ADD COLUMN alarm_keyword_enabled  BOOLEAN DEFAULT false,
  ADD COLUMN alarm_keyword_hash     VARCHAR,                  -- bcrypt hash of secret phrase; never stored in plaintext
  ADD COLUMN alarm_keyword_contexts ENUM('all','dms','groups') DEFAULT 'all',
  ADD COLUMN alarm_keyword_skip_countdown BOOLEAN DEFAULT true,
  ADD COLUMN alarm_countdown_seconds INTEGER DEFAULT 5,       -- 0/3/5/10
  ADD COLUMN alarm_escalation_minutes INTEGER DEFAULT 30,     -- 10/30/60
  ADD COLUMN alarm_safe_confirm_pin VARCHAR,                  -- optional bcrypt-hashed PIN to confirm "I'm Safe"
  ADD COLUMN alarm_location_permission ENUM('always','on_alarm','never') DEFAULT 'on_alarm';
```

### Silent Alarm Events
```sql
alarm_events
  id                UUID PRIMARY KEY
  user_id           UUID REFERENCES users(id)
  event_id          UUID REFERENCES events(id)   -- local event being attended, if any
  triggered_via     ENUM('tap','shake','keyword') -- updated to include keyword method
  trigger_context   VARCHAR                       -- 'group_chat'|'dm'|'forum'|'board' (keyword triggers only)
  status            ENUM('countdown','active','escalated','resolved','cancelled') DEFAULT 'countdown'
  latitude          DECIMAL(9,6)                  -- captured at trigger time only; NULL if no permission
  longitude         DECIMAL(9,6)
  contacts_notified INTEGER DEFAULT 0             -- count of contacts successfully reached
  timer_minutes     INTEGER DEFAULT 30            -- auto-escalation window chosen by user
  escalated_at      TIMESTAMP                     -- when second alert fired, if applicable
  resolved_at       TIMESTAMP
  location_purge_at TIMESTAMP                     -- set to 24h after resolved_at/cancelled_at
  created_at        TIMESTAMP NOT NULL
  -- Note: keyword phrase is NEVER stored in this table, not even as a hash
```

### Updates to existing tables
```sql
-- users table additions
ALTER TABLE users ADD COLUMN email_verified     BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN email_verified_at  TIMESTAMP;
ALTER TABLE users ADD COLUMN sessions_attended  INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN response_rate      DECIMAL DEFAULT 100.0;
ALTER TABLE users ADD COLUMN suspension_until   TIMESTAMP;
ALTER TABLE users ADD COLUMN trust_score        INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN spoken_languages   TEXT[];
ALTER TABLE users ADD COLUMN dyslexia_font      BOOLEAN DEFAULT false;

-- groups table additions
ALTER TABLE groups ADD COLUMN open_roles        JSONB DEFAULT '[]';
ALTER TABLE groups ADD COLUMN role_category     VARCHAR;
ALTER TABLE groups ADD COLUMN welcome_prompt    TEXT;
ALTER TABLE groups ADD COLUMN last_session_at   TIMESTAMP;
ALTER TABLE groups ADD COLUMN session_streak    INTEGER DEFAULT 0;
ALTER TABLE groups ADD COLUMN total_sessions    INTEGER DEFAULT 0;
ALTER TABLE groups ADD COLUMN health_status     ENUM('active','slowing','dormant','inactive') DEFAULT 'active';
ALTER TABLE groups ADD COLUMN venue_type        ENUM('public','semi_public','private');
ALTER TABLE groups ADD COLUMN accessibility_tags TEXT[];
ALTER TABLE groups ADD COLUMN verified_venue    BOOLEAN DEFAULT false;
```

---

## API Design

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user — requires age confirmation checkbox; returns `403` with message if user is under 13 |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/logout` | Invalidate token |
| GET | `/api/auth/me` | Get current user |

**Registration — Age Confirmation Response**

| Condition | HTTP Status | Response Body |
|-----------|------------|---------------|
| Age checkbox confirmed | 201 Created | `{ user, token }` |
| Age checkbox not submitted | 400 Bad Request | `{ error: "AGE_CONFIRMATION_REQUIRED", message: "You must confirm you meet the minimum age requirement." }` |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update own profile |
| GET | `/api/users/:id/groups` | Get user's groups |
| POST | `/api/users/:id/reviews` | Submit a review for a user |
| PUT | `/api/users/:id/preferences` | Save theme preference (`dark` or `light`) |
| POST | `/api/users/:id/block` | Block a user |
| DELETE | `/api/users/:id/block` | Unblock a user |
| POST | `/api/users/:id/mute` | Mute a user |
| DELETE | `/api/users/:id/mute` | Unmute a user |
| GET | `/api/users/:id/trust` | Get trust score breakdown |

### Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groups` | Search/list groups (with filters) |
| POST | `/api/groups` | Create a new group |
| GET | `/api/groups/:id` | Get group details |
| PUT | `/api/groups/:id` | Update group (owner only) |
| DELETE | `/api/groups/:id` | Delete group (owner only) |
| GET | `/api/groups/:id/members` | List members |
| POST | `/api/groups/:id/join` | Join or request to join |
| POST | `/api/groups/:id/approve/:userId` | Approve join request |
| DELETE | `/api/groups/:id/members/:userId` | Remove member / leave group |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groups/:id/events` | List group events |
| POST | `/api/groups/:id/events` | Create event |
| PUT | `/api/groups/:id/events/:eventId` | Update event |
| DELETE | `/api/groups/:id/events/:eventId` | Delete event |
| POST | `/api/events/:id/rsvp` | Submit RSVP |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groups/:id/messages` | Get message history |
| POST | `/api/groups/:id/messages` | Post a message (passes through content filter) |
| DELETE | `/api/messages/:id` | Delete message (owner/author) |
| PUT | `/api/messages/:id/pin` | Pin a message (owner only) |

### Group Moderation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/groups/:id/mods/:userId` | Promote member to co-moderator |
| DELETE | `/api/groups/:id/mods/:userId` | Demote co-moderator |
| POST | `/api/groups/:id/warn/:userId` | Issue a warning to a member |
| POST | `/api/groups/:id/mute/:userId` | Temporarily mute a member in group |
| POST | `/api/groups/:id/suspend/:userId` | Temporarily suspend a member from group |
| GET | `/api/groups/:id/modlog` | Fetch group moderation log |

### Onboarding
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/onboarding/status` | Get current user's onboarding step |
| PUT | `/api/onboarding/step` | Advance onboarding to next step |
| POST | `/api/onboarding/skip` | Mark onboarding as skipped |

### Saved Searches
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/searches` | List user's saved searches |
| POST | `/api/searches` | Create a saved search alert |
| PUT | `/api/searches/:id` | Update alert name or frequency |
| DELETE | `/api/searches/:id` | Delete a saved search |

### Calendar
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events/:id/ical` | Download `.ics` file for an event |
| GET | `/api/events/:id/gcal` | Get Google Calendar add URL |
| POST | `/api/groups/:id/recurrence` | Create a recurring event template |
| PUT | `/api/groups/:id/recurrence/:rid` | Update or pause a recurrence |
| DELETE | `/api/groups/:id/recurrence/:rid` | Delete recurrence template |

### Session Recaps
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events/:id/recap` | Submit attendance confirmation + session recap |
| GET | `/api/events/:id/recaps` | Get all recaps for an event (owner/mod) |

### Invitations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/groups/:id/invites` | Generate or regenerate an invite link |
| GET | `/api/groups/:id/invites` | Get current invite token + analytics |
| POST | `/api/groups/:id/invites/email` | Send email invitations (up to 10) |
| GET | `/api/groups/:id/invites/qr` | Get QR code PNG/SVG for group |
| GET | `/api/invite/:token` | Resolve invite token → group preview |

### Polls
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groups/:id/polls` | List polls in a group |
| POST | `/api/groups/:id/polls` | Create a poll |
| PUT | `/api/polls/:id/close` | Close a poll early |
| POST | `/api/polls/:id/vote` | Cast a vote |
| GET | `/api/polls/:id/results` | Get poll results |

### Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groups/:id/resources` | List group resources |
| POST | `/api/groups/:id/resources` | Add a resource |
| PUT | `/api/resources/:id` | Edit a resource |
| DELETE | `/api/resources/:id` | Delete a resource |
| PUT | `/api/resources/:id/pin` | Toggle pinned status |

### Ownership
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/groups/:id/transfer` | Transfer ownership to a member |
| GET | `/api/groups/:id/transfer/history` | View ownership transfer log |

### Legal & Compliance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/data-export` | Request personal data ZIP export |
| DELETE | `/api/users/me` | Permanently delete account + all data |
| POST | `/api/users/cookie-consent` | Store cookie consent preferences |

### Safety
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events/:id/checkin` | Register a safe check-in for an event |
| PUT | `/api/events/:id/checkin/confirm` | Confirm arrival (safe check-in) |
| GET | `/api/safety/guidelines` | Fetch safe meeting guidelines content |

### Trusted Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/safety/contacts` | List user's trusted contacts and verification status |
| POST | `/api/safety/contacts` | Add a new trusted contact (triggers verification SMS) |
| PUT | `/api/safety/contacts/:id` | Update contact details, notify_via preference, custom message, escalation opt-in |
| DELETE | `/api/safety/contacts/:id` | Remove a trusted contact |
| POST | `/api/safety/contacts/:id/reverify` | Resend verification SMS to a pending contact |

### Safety Preferences
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/safety/preferences` | Get all alarm configuration settings for the authenticated user |
| PUT | `/api/safety/preferences` | Update any combination of trigger settings, countdown, escalation timer, PIN |
| PUT | `/api/safety/preferences/keyword` | Set or change the secret keyword (body: `{ phrase }` — stored as bcrypt hash; never returned) |
| DELETE | `/api/safety/preferences/keyword` | Remove the keyword trigger (clears stored hash) |

### Silent Alarm
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/safety/alarm/trigger` | Fire silent alarm — body: `{ method, context?, skipCountdown? }` — captures GPS, queues alerts |
| DELETE | `/api/safety/alarm/cancel` | Cancel alarm during countdown window |
| PUT | `/api/safety/alarm/resolve` | Mark alarm resolved ("I'm Safe") — optionally requires PIN confirmation |
| GET | `/api/safety/alarm/status` | Get current alarm state for the authenticated user |
| POST | `/api/safety/alarm/test` | Send a clearly labelled test alert to all verified contacts — does not log a real alarm event |
| GET | `/api/safety/alarm/history` | Get user's own alarm event history (user-only) |

### Admin (additions)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/suspend/:userId` | Issue a temporary platform suspension |
| POST | `/api/admin/warn/:userId` | Issue a formal admin warning |
| PUT | `/api/admin/groups/:id/verify-venue` | Grant verified public venue badge |

---

## UI/UX Requirements

### Design Principles

- **Dual-theme UI** — Dark mode is the default (electric blue `#00D4FF` + deep navy backgrounds). A full light mode is also supported, toggled by a persistent sun/moon button in the navbar. Both themes use the same design tokens; only the token values change. See F13 for full spec.
- **Card-based layouts** — Groups displayed as visual cards for easy scanning
- **Mobile-responsive** — Full functionality on mobile browsers
- **Fast feedback** — Optimistic UI updates, skeleton loaders, toast notifications
- **Accessible theming** — All text/background combinations in both themes meet WCAG AA contrast ratio (4.5:1 minimum)

### Key Pages

| Page | Description |
|------|-------------|
| `/` Landing Page | Hero section, feature highlights, CTA to sign up |
| `/discover` | Group search with sidebar filters and map toggle |
| `/groups/:id` | Group profile, members, message board, upcoming events |
| `/groups/new` | Multi-step group creation form |
| `/profile/:id` | User profile, activity, reviews, linked accounts |
| `/dashboard` | Logged-in home: My Groups, upcoming events, suggestions |
| `/quiz` | "Find Me a Group" guided recommendation flow |
| `/help` | Searchable Help Center & FAQ |
| `/settings/notifications` | Notification preferences center |
| `/profile/:id/badges` | User badge shelf and milestone history |
| `/notifications` | Full notification history with read/unread filter and infinite scroll |
| `/activity` | Unified activity feed — all group events across every group the user belongs to |
| `/messages` | Private DM inbox — thread list and full conversation view |
| `/settings/referrals` | Personal referral link, share controls, referral history, badge reward status |
| `/groups/:id/analytics` | Organizer analytics dashboard — audience, sessions, content, and discovery metrics (available to all group owners) |
| `/status` | Public platform status page — component health, active incidents, maintenance windows, email/RSS subscription |
| `/help/contact` | Support ticket submission form — categorised by issue type; accessible without login |
| `/profile/:id/followers` | Public list of a user's followers (respects privacy settings) |
| `/profile/:id/following` | Public list of users a person follows (respects privacy settings) |
| `/guardian/:token` | Guardian Portal — read-only view of a minor's group memberships, events, and account status (no RollCall account required) |
| `/support` | Mental health and crisis resources — available in the site footer to all users at all times |
| `/calendar` | Unified personal calendar — all groups' events in one view with group toggles, colour coding, filtering, and bulk .ics export |
| `/groups/:slug/calendar` | Public-facing group calendar — shareable, SEO-indexed, with join CTA on each event card for non-members |
| `/discover/gaps` | "What's Missing Near You" — activity gap finder showing under-served categories with demand voting and group creation CTA |

---

## Non-Functional Requirements

### Performance

| Requirement | Target | Notes |
|-------------|--------|-------|
| Initial page load (LCP) | ≤ 2.5 s on 4G | Measured via Lighthouse; code-split routes with React.lazy |
| Time to Interactive | ≤ 4.0 s on mid-range mobile | Defer non-critical JS; lazy-load images |
| API response time (p95) | ≤ 300 ms | For all `/api/*` endpoints under normal load |
| Database query time (p95) | ≤ 100 ms | Enforced via Prisma query logging + explain-analyze in dev |
| Real-time message delivery | ≤ 500 ms round-trip | Socket.io with Redis adapter (Phase 6) |
| Concurrent users (MVP target) | 500 simultaneous | Tested with k6 load tests before production deploy |
| Image upload response | ≤ 3 s | Cloudinary async upload; progress indicator shown |

### Security

| Requirement | Implementation |
|-------------|---------------|
| Transport encryption | HTTPS enforced everywhere; HSTS header set; redirect HTTP → HTTPS |
| Authentication tokens | JWT with 15-minute access token + 7-day refresh token rotation |
| Password storage | bcrypt with cost factor 12 minimum |
| SQL injection prevention | Prisma ORM parameterized queries; no raw SQL string interpolation |
| XSS prevention | React escapes JSX by default; `helmet` middleware sets CSP headers |
| CSRF protection | `csrf-csrf` (double-submit cookie pattern) on all state-changing endpoints |
| Rate limiting | `express-rate-limit`: 100 req/min per IP on public routes; 20 req/min on auth routes |
| Input validation | `zod` schema validation on all API request bodies; 10 KB max payload |
| Sensitive data at rest | Passwords, tokens hashed; no private addresses stored; check-in contact data purged 24 h post-event |
| Admin route protection | `role: 'admin'` JWT claim required; server-side re-verified on every request |
| File upload restrictions | Cloudinary accepts only image MIME types; 5 MB max per upload |
| Dependency auditing | `npm audit` run on every CI push; critical vulnerabilities block merge |

### Accessibility

| Requirement | Standard / Tool |
|-------------|----------------|
| Color contrast (text) | WCAG AA — 4.5:1 minimum in both dark and light themes |
| Color contrast (UI components) | WCAG AA — 3:1 minimum for interactive elements |
| Keyboard navigation | All interactive elements reachable and operable via keyboard |
| Screen reader support | Semantic HTML + ARIA labels on all custom components |
| Focus indicators | Visible focus ring on all focusable elements (never `outline: none` without replacement) |
| Form labels | Every input has an associated `<label>` or `aria-label` |
| Motion | `prefers-reduced-motion` media query respected; animations disabled for users who opt out |
| Dyslexia-friendly font | Optional OpenDyslexic toggle (F23) available in accessibility settings |
| Audit tool | `axe-core` automated checks run in CI; manual screen reader review before each major release |

### Browser & Device Support

| Category | Minimum Support |
|----------|----------------|
| Chrome | Last 2 major versions |
| Firefox | Last 2 major versions |
| Safari | Last 2 major versions (including iOS Safari) |
| Edge | Last 2 major versions |
| Mobile | iOS 15+ Safari, Android 10+ Chrome |
| Screen size | 320 px minimum width (mobile-first responsive layout) |
| No IE support | Internet Explorer is explicitly out of scope |

### Scalability & Reliability

| Requirement | Target |
|-------------|--------|
| Uptime (MVP) | 99.5% monthly (Vercel + Railway managed infra) |
| Database connections | PgBouncer connection pooling (Railway managed); max 20 concurrent connections |
| Horizontal scaling | Stateless Express API; sessions in JWT (not server memory) — ready to scale horizontally |
| CDN | Vercel Edge Network for static assets; Cloudinary CDN for user images |
| Monitoring | Sentry error tracking (frontend + backend); Uptime Robot for endpoint health checks |
| Database backups | Daily automated backups via Railway; 7-day retention; manual backup before each deploy |

---

## MVP Scope & Timeline

### Phase 1 — Foundation (Weeks 1–2)
- Project scaffolding (Vite + React, Express, PostgreSQL + Prisma)
- User auth (register, login, JWT, protected routes)
- Guided onboarding flow (Steps 1–6, empty state design for all key pages)
- Basic user profiles with trust signals and positions
- Database schema and all migrations (including F26–F37 tables)
- Dark/light mode toggle (ThemeContext + Tailwind `darkMode: 'class'` + localStorage persistence)
- Legal pages: Terms of Service, Privacy Policy, Cookie Consent banner
- PWA manifest + service worker scaffold (Workbox)

### Phase 2 — Core Features (Weeks 3–5)
- Group creation and editing
- Group discovery page with search and filters
- Join / request-to-join flow
- Membership management (approve, deny, remove)
- Group message board (non-real-time posts)

### Phase 3 — Safety, Trust & Moderation (Weeks 6–7)
- Session/event creation with RSVP
- User dashboard (my groups + upcoming events)
- Notifications system (in-app)
- User reputation/review system
- Block/mute user (personal-level controls)
- Automated content pre-screening middleware (`bad-words` filter)
- Report system (report button on posts/profiles → admin queue)
- Admin Control Panel: user management, ban/whitelist/suspend tools, reports queue
- Group-level moderation (co-moderator role, strike system, mod log)
- Graduated moderation: warn → mute → suspend → ban
- Profile trust signals (verified badge, sessions attended, trust score ring)

### Phase 4 — Discovery, Matching & Community (Week 8)
- Role/position matching (open roles on groups, positions on profiles)
- Group health & activity signals (badges, dormant detection, owner nudges)
- New member icebreaker prompts (auto-pinned intro on join)
- Multilingual & accessibility tags (language filter, venue accessibility)
- In-person safety features (safe meeting guidelines, check-in, venue type warning)
- Safe Check-In for in-person events
- Fuzzy search + synonym map + smart defaults on Discover page
- Public group preview pages + Open Graph meta tags
- Social share button + QR code download (local groups)
- Group ownership transfer (manual + inactivity auto-transfer)

### Phase 5 — Enrichment & Engagement (Week 9)
- Calendar export (.ics + Google Calendar link) for all events
- Recurring event templates
- Post-session recap & attendance confirmation flow
- Email invitation system + invite analytics
- In-group polls (create, vote, live results)
- Group Resource Hub (pinned links, files, suggested prompts)
- Saved searches & group alerts (in-app + email digest)
- PWA push notifications (opt-in per type)
- **Help Center & FAQ** (F39) — seed content loaded via migration; admin editor live; `/help` page deployed
- **Achievement & Badge System** (F40)** — badge definitions seeded (including Helpful Player & Guide badges); automated triggers wired to session confirmation, onboarding, invite events, and forum helpful votes; badge shelf on profiles; share-to-feed flow
- **Profile Avatar Upload** (F42) — Cloudinary upload widget + 2-stage AI/admin moderation pipeline; default initials avatar
- **Personal Information Protection** (F43) — soft message warning for phone/address patterns; at-risk user nudge
- **Inappropriate Profile Reporting** (F44) — dedicated profile report modal; 3-reports-in-7-days auto-flag; `profile_content` violation type
- **Group Forum with Tips & POI** (F61) — Forum tab on all group pages; post types Discussion/Tip/POI/Announcement; threaded replies; Helpful reaction wired to badge trigger; full-text search; `forum_posts`, `forum_replies`, `forum_helpful_votes` tables
- **Post Voting** (F64) — upvote/downvote on forum posts, replies, message board posts, and session recaps; net score display; sort-by-Top; collapsed-post threshold; real-time score sync; Rising Star and Crowd Favourite badges; `post_votes` table
- **Spoiler Tags & Content Reveal** (F65) — `||text||` syntax with toolbar button; optional category label; hover-peek + click-to-reveal; keyboard accessible; re-hide control; `has_spoiler` flag; feed preview suppression; `SpoilerBlock` React component
- **External Link Warning System** (F62) — intercept modal on all outbound links; trusted domain bypass list; admin-configurable; `ExternalLink` React component

### Phase 6 — Polish, Scale & Stretch (Week 10+)
- Real-time chat (Socket.io)
- **Mentions & Real-Time Activity Alerts** (F63) — @mention detection pipeline wired to forum, message board, and chat; real-time Socket.io delivery to personal notification rooms; toast alert component with stack management and reconnect catch-up; unified `/activity` feed; bell dropdown "Mentions" tab and secondary badge; `activity_feed_events` table and six new API endpoints
- Map view for local groups (Mapbox)
- **Google Maps Location Tagging** (F45) — Places Autocomplete on event form; two-tier location privacy (public city only → full pin for confirmed members); "Open in Google Maps" deep-link
- **Proximity Search & Map View** (F46) — distance filter slider; PostGIS `ST_DWithin` radius queries; map/list toggle on Discover page; Geolocation API
- **Optional 3FA via SMS** (F47) — opt-in enrollment in Settings → Security; Twilio OTP delivery; backup codes required; lockout after 5 failed OTPs
- **Streamlined Join/Leave UX** (F48) — one-tap join for open groups; request flow for invite-only; leave confirmation; owner transfer gate
- **Interest & Activity History Tracker** (F49) — activity timeline; current interests panel; activity stats; privacy toggles
- **Dynamic Interest-Based Group Discovery** (F60) — "For You" personalized feed; match reason chips; "More Like This"; trending near you; rule-based weighted scoring
- **Enhanced Accessibility Options** (F59) — font size slider; high contrast toggle; reduced motion; screen reader mode; group accessibility tags (Neurodivergent-Friendly, Deaf/HoH, Mobility, Low Sensory, Beginner Safe, Chronic Illness Friendly)
- **Secret Groups** (F73) — `'secret'` privacy type; no search/discover/profile visibility; invite-link-only access with configurable expiry; `group_invite_links` table
- **Group Creation Templates** (F74) — 8 activity templates displayed as Step 0 card grid; pre-filled creation form fields; `created_from_template` column on groups
- **Private 1:1 Direct Messaging** (F67) — DM inbox at `/messages`; Socket.io typing indicators; message-request inbox; read receipts (opt-in for all users); available to all registered users with no thread limits; `dm_threads`/`dm_participants`/`dm_messages` tables
- "Find Me a Group" quiz
- Email notification system (SendGrid/Resend): digests, reminders, check-in alerts
- **Email Marketing Automation** (F69) — BullMQ-driven welcome series (4 emails), re-engagement series (D14/D21/D30), win-back (D60), weekly digest opt-in, 2-hour session reminders; `email_sequences`/`email_sends` tables
- i18next setup (English baseline, ready for future translation)
- Mobile responsiveness + comprehensive accessibility audit (axe-core, Lighthouse, VoiceOver, NVDA)
- Badge progress view in user Settings (see unearned badges + progress toward them)
- Admin custom badge creation and manual award flow
- Final testing, bug fixes, production deployment

### Phase 7 — Growth, Analytics & Launch Readiness (Week 12+)
- **Referral Program** (F72) — `rollcall.gg/join?ref=USERNAME` links; Community Builder + Early Supporter badge rewards; extended onboarding for referred users; IP/email fraud checks; `referrals` table; `/settings/referrals` dashboard
- **Product Analytics** (F68) — PostHog self-hosted setup; 16 tracked events (signup through referral_converted); 4 conversion funnels; feature flags for gradual rollouts; admin Platform Metrics tab; `analytics_opt_out` user column
- **Organizer Analytics Dashboard** (F70) — `/groups/:id/analytics` for all group owners; audience, session, content, and discovery metric sections; CSV export; `group_page_views` table; `join_source` column on memberships
- **SEO & Structured Data** (F71) — schema.org Event + Organization JSON-LD injection; dynamic `<title>`/`<meta description>` per page; nightly-generated `/sitemap.xml`; `robots.txt` with crawl directives
- **Data Retention & Purge Policy** (F75) — full data retention schedule enforced; right-to-erasure API with 30-day grace period; BullMQ purge job; data export ZIP (9 files: profile, posts, votes, sessions, DMs, reviews, badges, groups, deletion-log); `deletion_requests` table; GDPR/CCPA/CAN-SPAM compliance audit
- **Public Status Page** (F76) — component health page at `/status`; in-app degradation banner; admin incident management; email/RSS subscription; `/api/system/status` polling endpoint
- **Support Ticket System** (F77) — categorised ticket form at `/help/contact`; admin support queue with threaded replies; SLA targets; `support_tickets`/`support_ticket_messages` tables
- **Cross-Account Abuse Tracking** (F78) — 5-signal account-linking detector; flag → admin review → auto-ban escalation; `account_link_matches` table
- **DoS Protection & Circuit Breakers** (F80) — per-endpoint enhanced rate limits; opossum circuit breakers for all third-party integrations; Cloudflare reverse proxy with Bot Fight Mode
- **Fraud Scoring & Graduated Lockout** (F81) — 8-signal fraud score with time-decay; 5-tier graduated lockout; manual admin override; `fraud_score_events` table
- **Immutable Audit Log** (F82) — append-only `admin_audit_log`; 3-year retention; WORM secondary copy; platform-owner CSV export
- **Backup Verification Runbook** (F79) — automated daily integrity checks; monthly restore drill to staging; cross-region R2/S3 secondary backup; documented restore runbook at `docs/disaster-recovery.md`
- Production deployment; final accessibility and security audit; Lighthouse performance benchmarks documented

---

## Testing Strategy

### Philosophy

Testing in RollCall follows a **pyramid model**: many fast unit tests at the base, a moderate layer of integration tests in the middle, and a smaller set of critical-path E2E tests at the top. Every new feature requires tests at the appropriate level before it can be merged.

### Unit Tests — Vitest

**Scope:** Pure functions, utility modules, React components in isolation.

**Tools:** [Vitest](https://vitest.dev/) (Jest-compatible, native Vite integration) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

| Area | What is tested |
|------|---------------|
| `contentFilter.js` | All severity tiers (CRITICAL/HIGH/MEDIUM/CLEAN) with known test strings |
| `ThemeContext` | Toggle behavior, localStorage persistence, system-preference fallback |
| `AuthContext` | Login/logout state transitions, `isAdmin` computed value |
| Trust score calculation | Each input weight (peer rating, sessions, email, response rate) |
| Group health state logic | All four states (active/slowing/dormant/inactive) at boundary dates |
| Fuzzy search (Fuse.js config) | Synonym map resolution, typo tolerance, empty-result handling |
| Date/time utilities | Timezone-safe formatting, `.ics` file output validity |
| Form validation schemas (Zod) | Required fields, max lengths, enum values, RSVP status |

**Coverage target:** ≥ 80% line coverage on `src/utils/` and `src/context/` directories.

---

### Integration Tests — Supertest

**Scope:** Express API routes with a real PostgreSQL test database (seeded before each test run, rolled back after).

**Tools:** [Supertest](https://github.com/ladjs/supertest) + [Prisma test environment](https://www.prisma.io/docs/guides/testing) + [jest-environment-node](https://jestjs.io/docs/configuration#testenvironment-string)

| Endpoint Group | Key cases covered |
|----------------|------------------|
| `POST /api/auth/register` | Valid registration, duplicate email 409, missing fields 400, underage user 403 |
| `POST /api/auth/login` | Valid login, wrong password 401, banned user 403 with message |
| `POST /api/groups` | Owner creates group, category validation, capacity bounds |
| `POST /api/groups/:id/messages` | Clean message passes, CRITICAL content rejected 400, filter log created |
| `POST /api/reports` | Report created, duplicate report for same target/message deduplicated |
| `POST /api/admin/ban/:userId` | Admin can ban, non-admin 403, banned user cannot log in afterward |
| `GET /api/groups/:id` (unauthenticated) | Public group preview accessible; invite-only group returns 401 |
| `POST /api/events/:id/checkin` | Check-in created, confirm updates status, purge job scheduled |
| `GET /api/users/data-export` | Returns ZIP with correct tables; only own data returned |

**Environment:** Separate `TEST_DATABASE_URL` with a `_test` suffix database. Prisma migrations applied once; each test suite wraps in a transaction that rolls back.

---

### End-to-End Tests — Playwright

**Scope:** Critical user journeys through the full browser stack.

**Tools:** [Playwright](https://playwright.dev/) (Chromium + Firefox + WebKit)

| Journey | Steps covered |
|---------|--------------|
| New user onboarding | Register → 6-step onboarding flow → first group join → confetti fires |
| Group discovery | Search with filters → filter down to 1 result → join group → confirm in dashboard |
| Group creation | Owner creates group → sets open roles → new member joins → role match banner shown |
| Content violation | Member posts banned phrase → real-time filter warning → submission blocked → clean re-submit succeeds |
| Admin ban flow | Admin logs in → opens Reports tab → reviews report → bans user → banned user sees ban message on login |
| Dark/light mode | Toggle → theme persists on page refresh → theme persists after logout/login |
| Safe check-in | User RSVPs to in-person event → enables check-in → confirms arrival → status updates |
| PWA install | Service worker registered → offline page loads when network disconnected |

**Run schedule:** Full E2E suite runs on every pull request to `main`. Individual journey tests can be run locally with `npx playwright test --grep "journey name"`.

---

### Accessibility Testing

| Method | Tool | When |
|--------|------|------|
| Automated scan | `axe-core` via `@axe-core/playwright` | Every E2E test run — violations fail the test |
| Contrast audit | Lighthouse accessibility score | CI check on every deploy — target ≥ 90 |
| Keyboard navigation | Manual with Tab/Shift-Tab/Enter/Space | Before each major release |
| Screen reader | VoiceOver (macOS) + NVDA (Windows) | Before each major release |
| Reduced motion | OS preference set, site re-tested | Before each major release |

---

### QA Checklist (Pre-Release)

Before any production deployment, the following manual checks must pass:

- [ ] All unit and integration tests green in CI
- [ ] All E2E tests green in CI (Chromium + Firefox)
- [ ] Lighthouse scores: Performance ≥ 80, Accessibility ≥ 90, Best Practices ≥ 90
- [ ] `npm audit` — zero critical or high severity vulnerabilities
- [ ] Dark mode and light mode visually reviewed on mobile viewport (375 px)
- [ ] Community Standards modal appears for a fresh incognito session
- [ ] Content filter blocks a known CRITICAL test phrase
- [ ] Admin panel accessible only to admin-role accounts
- [ ] Data export ZIP downloads and contains expected tables
- [ ] .ics calendar file opens correctly in macOS Calendar and Google Calendar
- [ ] QR code scans to correct group preview URL

---

## Deployment & DevOps

### Environments

| Environment | Purpose | URL pattern |
|-------------|---------|-------------|
| Development | Local developer machine | `http://localhost:5173` (FE) · `http://localhost:3001` (BE) |
| Preview | Auto-deployed for every pull request | `https://rollcall-pr-{number}.vercel.app` |
| Staging | Pre-production smoke testing | `https://staging.rollcall.app` |
| Production | Live application | `https://rollcall.app` |

### CI/CD Pipeline — GitHub Actions

```
On every push / pull request:
  ├── lint         → ESLint + Prettier check (fails on warnings)
  ├── type-check   → tsc --noEmit (TypeScript, if adopted)
  ├── unit-test    → Vitest with coverage report
  ├── integration  → Supertest against TEST_DATABASE_URL
  ├── audit        → npm audit --audit-level=high
  └── build        → vite build (confirms no compile errors)

On merge to main:
  ├── e2e-test     → Playwright full suite on staging deploy
  ├── lighthouse   → Lighthouse CI on staging URL
  └── deploy       → Vercel (frontend) + Railway (backend) production deploy
```

All checks must pass before a pull request can be merged to `main`. No force-pushes to `main`.

### Environment Variables

**Frontend (`.env` / Vercel environment):**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_MAPBOX_TOKEN` | Mapbox GL JS public token |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for upload widget |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key (Places Autocomplete + embedded map, F45/F46) |

**Backend (`.env` / Railway environment):**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `TEST_DATABASE_URL` | Separate test database connection string |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens (256-bit random) |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens (256-bit random) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SENDGRID_API_KEY` | SendGrid (or Resend) transactional email key |
| `TWILIO_ACCOUNT_SID` | Twilio account SID for SMS (trusted contact verification + alarm alerts) |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio sending number in E.164 format |
| `MAPBOX_SECRET_TOKEN` | Mapbox server-side token (if geocoding used) |
| `GOOGLE_MAPS_API_KEY` | Server-side Google Maps Static API key for map thumbnail generation in emails (F45) |
| `COOKIE_SECRET` | CSRF double-submit cookie secret |
| `SENTRY_DSN` | Sentry error reporting DSN |
| `REDIS_URL` | Redis connection string (Phase 6 — Socket.io adapter) |
| `NODE_ENV` | `development` / `test` / `production` |

All secrets are stored in GitHub Actions encrypted secrets for CI and in Railway / Vercel encrypted environment variable dashboards for deployments. **Never commit `.env` files to the repository.**

### Monitoring & Alerting

| Tool | Purpose | Alert condition |
|------|---------|----------------|
| [Sentry](https://sentry.io) | Frontend + backend error tracking | New error spike → email + Slack alert |
| [Uptime Robot](https://uptimerobot.com) | Endpoint health checks every 5 min | `GET /api/health` returns non-200 → email alert |
| Railway metrics | CPU / memory / database connection usage | > 80% sustained for 5 min → alert |
| Vercel Analytics | Core Web Vitals (LCP, FID, CLS) monitoring | LCP > 4 s p75 → review sprint |

### Database Backup & Recovery

- **Automated daily backups** via Railway managed PostgreSQL — 7-day retention
- **Pre-deploy manual backup** triggered via Railway CLI before every production deployment
- **Recovery procedure:** restore to latest backup via Railway dashboard; target RTO < 1 hour, RPO < 24 hours
- **Migration safety:** all Prisma migrations are additive where possible; destructive migrations require a corresponding data migration script reviewed by a second developer before deploy

### Branch Strategy

```
main          ← production-ready; protected; requires passing CI + PR review
  └── staging ← pre-production integration branch
        └── feature/*, fix/*, chore/*  ← short-lived feature branches
```

Feature branches are deleted after merge. Hotfixes branch directly from `main` and are cherry-picked to `staging`.

---

## Launch Strategy — Palm Beach County Pilot

RollCall launches exclusively in **Palm Beach County, Florida** before expanding anywhere else. The goal of the pilot is to prove that the platform can reach critical density in a defined geographic market — enough active groups across enough activity types that a new user landing on Discover finds something worth joining on day one.

Palm Beach County is a strong pilot market: ~1.5 million residents across a mix of cities (West Palm Beach, Boca Raton, Delray Beach, Boynton Beach, Jupiter, Lake Worth Beach, Wellington), a large retiree and young professional population, active outdoor and fitness culture (Loxahatchee trails, beaches, cycling routes), and a substantial gaming and tabletop community anchored around local game stores.

---

### Phase 0 — Pre-Launch Seeding (Before Public Signup Opens)

The platform does not open public registration until **at least 20 real, active groups** are live across a minimum of 4 activity categories and 3 cities within Palm Beach County. "Active" means an owner has created the group, set a recurring schedule, and confirmed they will show up.

**Seeding approach:**

Identify and personally recruit 8–12 local organizers who already run hobby groups in the county — people managing board game nights, hiking meetups, cycling clubs, D&D campaigns, or gaming squads over WhatsApp, iMessage, or Facebook. The pitch is direct: "We'll move your group onto a tool built for exactly this. Your first 30 days are free, and your members won't have to download anything."

Target channels for finding these organizers: local Facebook Groups (Palm Beach Hikers, PBC Board Gamers, South Florida Cycling, etc.), r/WestPalmBeach and r/BocaRaton subreddits, and game stores (e.g. Dragon's Lair in WPB, Level Up Games in Lake Worth).

Organizers get white-glove onboarding: a live setup session via video call, their group fully configured before their members see it, and a personal contact for the first 30 days.

**Seeded group targets (pre-launch):**

| Category | Target Groups | Example Locations |
|---|---|---|
| Tabletop / Board Games | 4–5 | West Palm Beach, Boca Raton, Boynton Beach |
| Video Games (online + local LAN) | 3–4 | Jupiter, West Palm Beach, Delray Beach |
| Hiking & Outdoor | 3–4 | Loxahatchee / Wellington corridor, Jupiter |
| Sports & Fitness | 3–4 | Delray Beach, Boca Raton, Lake Worth |
| Social / Book Club / Trivia | 2–3 | West Palm Beach, Delray Beach |

---

### Phase 1 — Soft Launch (Invite-Only)

Once seeded groups are live, open registration to a **closed invite list** — initially the existing members of the seeded organizers' groups, plus anyone who signed up on a pre-launch interest list.

Goals for soft launch (weeks 1–4):
- Validate that the join flow, RSVP, and notification systems work smoothly for real groups
- Collect organizer feedback on anything that blocks their workflow
- Identify the top 2–3 activity categories generating the most organic join activity
- Hit 100 registered users before opening public signup

Public signup remains off. Word-of-mouth within the seeded groups is the only acquisition channel.

---

### Phase 2 — Public Launch

Open public registration with **no geographic restriction on who can sign up**. Anyone, anywhere can create an account and access the platform. However, a clear distinction applies to how local and online activities work during the pilot:

**The rule: online is unrestricted, local is PBC-only.**

| Activity type | Who can join |
|---|---|
| **Online groups** (location_type = 'online') | Any registered user, anywhere |
| **Local / in-person groups** (location_type = 'local') | Only users whose registered ZIP code is within Palm Beach County |

This keeps the platform genuinely open — a gamer in Denver can sign up and find an online Valorant group the same night. But a local hiking group in Boca Raton stays geographically coherent: only PBC residents can join, show up, and attend in person. The gate is enforced at join time (see **F48 — PBC Local Activity Gate**), not at registration.

Users outside PBC who browse local groups see the group detail page normally but see an informational notice on the join button explaining the current pilot restriction. They are never blocked from viewing, messaging, or otherwise engaging with the platform — only from joining local groups that require physical attendance.

What PBC-focus means in practice: the initial seeded groups, the organizer outreach, the local marketing (Reddit, Facebook Groups, game stores), and the default proximity search origin will all be centred on Palm Beach County. Users from outside PBC will see fewer local results in their area — the empty-state experience (F26) guides them to online groups or helps them create a local one.

**Acquisition channels (PBC-focused, not PBC-exclusive):**

- **Reddit**: r/WestPalmBeach, r/BocaRaton, r/Floridas — targeted posts and organic presence
- **Local Facebook Groups**: Activity-specific groups (PBC Hikers, South Florida Boardgamers, etc.) — share individual group discovery links, not generic platform links
- **Game stores and hobby shops**: QR code cards at Dragon's Lair, Level Up Games, and local game cafés pointing to the most relevant group on Discover
- **Nextdoor**: Targeted posts in neighborhoods adjacent to active groups
- **Organizer evangelism**: Each seeded organizer shares their group's public calendar link with their existing social network
- **Online groups**: Online gaming and hobby groups are global by nature — promote these to widen the addressable user base beyond PBC from day one

**Do not run paid advertising during the pilot.** Organic and referral acquisition only until the Discover page has real depth.

---

### Phase 3 — Expansion Signal

Expansion marketing focus shifts to the next region when Palm Beach County hits all three thresholds:

1. ≥ 250 registered users with at least one group join
2. ≥ 50 active groups (had at least one session in the last 30 days)
3. Weekly return rate ≥ 40% (users who visit more than once in a 7-day period)

Likely next South Florida targets: Broward County (Fort Lauderdale), Miami-Dade. The Phase 0 seeding playbook repeats in the new area — real organizers recruited, real groups live — before shifting marketing attention there. The platform itself requires no technical changes to support a new region.

---

### Monetization — Subscription Model

RollCall operates on a subscription billing model from launch. Every new account receives a **30-day free trial** with full platform access and no credit card required. After the trial, users continue on a paid plan.

**Plans:**

| Plan | Monthly | Annual (15% off) |
|---|---|---|
| Participant | $10/mo | $8.50/mo · billed $102/yr |
| Organizer | $15/mo | $12.75/mo · billed $153/yr |

**Participant plan** includes: join unlimited groups, RSVP to events, group forum and chat, direct messages, badge and rank system, discover map, partner discounts, and personalized dashboard.

**Organizer plan** adds: create and host unlimited groups, schedule sessions, organizer analytics dashboard, group image management, member join request management, waitlist management, co-moderator assignment, session templates, and Verified Organizer badge eligibility.

**Additional passive revenue from launch:** F100 Partner Discount Program affiliate commissions — every deal link passes through a partner commission; no user-facing change required and zero friction to members or organizers.

**Pricing philosophy:** RollCall is approximately 50% cheaper than Meetup ($29.99/mo), charges no per-event fees (unlike Eventbrite), and offers a purpose-built community platform for hobbyist groups — not a general-purpose social feed. The 30-day no-card trial removes friction for both organizer recruitment and member sign-up during the PBC pilot phase.

For full plan details, feature comparison, billing cycle options, and competitive positioning, see `RollCall_Pricing_Plans.md`.

---

## Feature Backlog — Promoted to Full Specs

> **All items in this section have been promoted.** B1–B9 were converted to full feature specifications F99–F107 (see Feature Requirements above). The brief descriptions below are retained for changelog traceability. No items in this backlog remain pending — they are now fully specced and scheduled for development.

---

### B1 — Mental Health & Crisis Resource Hub

**Related to:** F92 (Mental Health Crisis Resource Surfacing)  
**Complexity:** Low

F92 already surfaces crisis resources reactively when a user's post triggers the crisis keyword filter. This item extends that into a **proactive, always-visible resource hub** — a dedicated page at `/support/mental-health` and a persistent footer link accessible from every page without requiring a trigger event.

The page will include:
- National Suicide Prevention Lifeline: **988** (call or text) — [988lifeline.org](https://988lifeline.org)
- Crisis Text Line: text **HOME** to **741741**
- SAMHSA National Helpline: **1-800-662-4357** (24/7 treatment referrals)
- International Association for Suicide Prevention (IASP) directory for non-US users: [https://www.iasp.info/resources/Crisis_Centres/](https://www.iasp.info/resources/Crisis_Centres/)
- NAMI Helpline: **1-800-950-6264**
- Trevor Project (LGBTQ+ youth): **1-866-488-7386** / text **START** to **678-678**
- A brief message from the RollCall team affirming that it's okay to not be okay and encouraging users to reach out

The footer link reads "Mental Health Resources" and is present on every page. The link is included in the Community Standards page and in the onboarding flow. Resources are reviewed for accuracy before launch and updated when numbers or services change.

---

### B2 — Partner Discount Program (Games, Gear & Accessories)

**Related to:** None (new feature)  
**Complexity:** Medium

A monthly rotating **Partner Discounts** section, accessible from the main navigation and the user dashboard, offering exclusive promo codes and discount links for products relevant to the RollCall community. During the pilot phase, discount entries are placeholders (fictitious demo data) to illustrate the feature; real partner agreements are negotiated separately.

**Discount categories:**
- 🎮 Gaming platforms: Xbox Game Pass, PlayStation Store, Steam Wallet codes
- 🎲 Tabletop: D&D sourcebooks, Hasbro games, local game store gift cards
- 🕹️ Accessories: headsets, controllers, dice sets, gaming chairs
- 👕 Apparel: hobby-themed clothing, group customisable gear
- 📦 Miscellaneous: hobby subscription boxes, art supplies, book club picks

**Display format:** Card grid on `/discounts` page — each card shows the brand logo, discount description (e.g. "15% off all D&D sourcebooks"), promo code (copyable with one click), expiry date, and a "Get deal" link to the partner site.

**Monthly rotation:** Discounts refresh on the 1st of each month. Users can opt in to a "New Deals" email notification (F69 integration). Active discount count shown as a badge on the navigation link to drive return visits.

**Revenue note:** If real partner agreements are established, affiliate link tracking can be added to measure conversions. This is optional and out of scope for the initial implementation.

---

### B3 — Browser Compatibility & Support Policy

**Related to:** Non-Functional Requirements  
**Complexity:** Low

The Non-Functional Requirements section already notes browser support targets. This item formalises a **named browser support policy** displayed on the platform and updated with each major release.

Supported browsers (evergreen — latest 2 major versions):
- Google Chrome
- Mozilla Firefox
- Apple Safari (macOS and iOS)
- Microsoft Edge

Explicitly unsupported: Internet Explorer (all versions), Opera Mini, browsers older than 2 major versions behind current release.

A browser-detection check at first visit warns users running an unsupported browser: *"RollCall works best on Chrome, Firefox, Safari, or Edge. You may experience issues on your current browser."* — non-blocking, dismissible, no forced redirect.

---

### B4 — Fully Optional Notifications

**Related to:** F38 (Notification Preferences Center)  
**Complexity:** Low

F38 already gives users per-type notification controls. This item clarifies and enforces the policy that **every notification type is opt-out by default** — no notification is mandatory except account-critical security alerts (password reset, account suspension, COPPA deletion notice). This is a policy clarification and a QA pass to verify all notification types respect the preference setting, rather than a new engineering feature.

The F38 "Essential Only" preset already handles this scenario. This backlog item ensures the preset is the recommended default for new users and that the onboarding flow surfaces notification preferences during Step 4 rather than leaving them to be discovered in Settings.

---

### B5 — Optional Phone & Email Display in Profile

**Related to:** F1 (User Authentication & Profiles), F47 (Optional 3FA via SMS)  
**Complexity:** Low

Users may optionally add a **display phone number** and/or a **display email address** to their public profile, separate from their registered account email and their F47 SMS verification number. These are contact details the user chooses to share with group members — they are never automatically populated from registration data.

**Rules:**
- Both fields are entirely optional — no prompt or requirement to fill them in
- Display phone number is visible only to confirmed members of groups the user belongs to (not to the general public or logged-out visitors)
- Display email is visible only to confirmed group members
- Neither field is used for platform notifications (the registered account email handles all platform emails)
- Both fields are included in the user's own F75 data export
- Neither field is returned by any API endpoint accessible to non-members

This is distinct from the registered account email (used for login and notifications, never shown) and the F47 SMS number (used for 3FA only, never shown).

---

### B6 — In-Editor Spell Check

**Related to:** F5 (Message Board), F10 (Real-Time Chat), F61 (Group Forum), F67 (Direct Messages)  
**Complexity:** Low–Medium

A spell-check underline (red squiggle) and correction suggestion on all text input fields where users compose posts, messages, or forum replies — powered by the browser's built-in `spellcheck="true"` attribute for basic coverage, extended with a lightweight client-side library (e.g. [Typo.js](https://github.com/cfinke/Typo.js) or the browser's native spell-check API) for richer suggestions in the rich-text editor components.

**Scope:** All `<textarea>` and `<div contenteditable>` elements used for composing messages, posts, group descriptions (F2), bio fields (F1), and event descriptions (F29). The spell-check language defaults to English and follows the user's browser language setting.

**Autocorrect note:** Spell check provides suggestions but does not auto-correct without user action. Users are shown underlined words and can right-click (or long-press on mobile) to accept suggestions.

---

### B7 — Forum Attachments Restricted to PDF Only

**Related to:** F61 (Group Forum with Tips & Points of Interest)  
**Complexity:** Low

Any file attachment capability in the group forum is restricted to **PDF format only**. No executable files (`.exe`, `.bat`, `.sh`, `.js`, `.py`, `.zip`, `.dmg`, etc.), no Office documents with macro capability, no image-embedded scripts.

**Technical enforcement:**
- Client-side: file picker `accept=".pdf"` attribute restricts selection in the browser
- Server-side: MIME type validation on upload — only `application/pdf` is accepted; any other MIME type returns `400 Bad Request` regardless of file extension
- Cloudinary upload pipeline (F42) configured to reject non-PDF uploads at the CDN level
- Maximum file size: 10 MB per attachment, consistent with existing image upload limits
- PDFs are rendered as a download link with filename and file size shown — no in-browser PDF preview (avoids PDF.js attack surface)

---

### B8 — Last-Minute Cancellation Reputation Penalty

**Related to:** F51 (Session Cancellation Flow), F24 (Profile Trust Signals), F20 (Group Health & Activity Signals)  
**Complexity:** Low–Medium

When a group owner cancels a scheduled session within **24 hours of the session start time**, the cancellation is automatically classified as a **last-minute cancellation** and recorded against the owner's trust profile.

**Automatic consequences:**
- A `last_minute_cancellation` event is logged on the owner's record
- Trust score penalty: **−8 points** (more severe than a standard cancellation, which carries no automatic penalty)
- A **"Late Cancellations" counter** appears on the owner's public profile after the first occurrence, showing the total count: *"2 last-minute cancellations in the last 90 days"* — visible to all logged-in users
- After **3 last-minute cancellations within 90 days**, a ⚠️ **Reliability Warning** badge appears on the owner's profile and on all group cards they own — same visual treatment as the conduct flag (F24) but with a distinct amber 🕐 icon and tooltip: *"This organiser has cancelled sessions with less than 24 hours notice 3 times recently."*
- The group's health score (F20) is also penalised: `−10` per last-minute cancellation, consistent with the existing cancellation impact

**Exceptions (no penalty):**
- Emergency cancellations flagged by the owner with a reason — these are logged but the penalty is suspended pending admin review; if the admin marks the reason as legitimate (medical, safety, etc.), no penalty is applied
- Cancellations caused by a platform incident (recorded in F76 status log) during the same time window

**Auto-reset:** The late cancellation count resets to zero after 90 days with no new last-minute cancellations — same rolling window as the conduct flag.

---

### B9 — Unified Behavioural Analytics & Intelligent Tracking

**Related to:** F68 (Product Analytics — PostHog), F32 (Legal & Compliance)  
**Complexity:** Medium

Extend F68's PostHog integration to capture a **comprehensive behavioural event stream** covering not just key conversion events but continuous in-session activity — pages visited, features interacted with, time spent in each area, content scrolled past, search terms entered, and group pages browsed. This gives the platform intelligence about what users find valuable, what they ignore, and where they drop off.

**What is tracked (in addition to existing F68 events):**
- Page views with time-on-page
- Group detail pages browsed (not joined) — interest without action
- Discover filter combinations used
- Forum posts read vs. scrolled past
- Calendar events viewed
- Search queries and result click-through
- Notification interactions (opened / dismissed)
- Feature areas visited per session (chat, calendar, forum, discover, etc.)

**Disclosure:** All behavioural tracking is disclosed in plain language in the **Terms of Service and Privacy Policy** (F32) and in the **acceptance agreement** shown at first login. The disclosure explicitly names PostHog as the analytics provider, describes the categories of data collected, and explains how it is used (platform improvement, personalised recommendations — not sold to third parties). Users who decline the acceptance agreement cannot use the platform.

An **analytics opt-out** option is available in Settings → Privacy (already specced in F68 via `analytics_opt_out` column) — opting out stops PostHog event capture for that user while retaining their account. Opted-out users' data is excluded from all analytics reports.

---

---

## Future Roadmap

| Feature | Priority | Notes |
|---------|----------|-------|
| Discord Bot Integration | High | Sync RollCall groups with Discord servers; post session reminders and new-member alerts to a linked Discord channel |
| Native Mobile App (React Native) | High | Dedicated iOS/Android app with native push notifications, camera for avatar, and deeper OS integration |
| Verified Venue Partnerships | Medium | Local venues (game stores, community centres) can claim a RollCall Venue profile and be searchable as host locations |
| Tournament / League Mode | Medium | Bracket creation, standings, and match reporting for competitive gaming and sports groups |
| Steam / Xbox / PSN Profile Linking | Medium | Link gaming platform accounts to display gamertags and playtime on profile |
| AI-Powered Group Matching | Low | ML-based recommendations using activity history, play style, and availability |
| Video / Voice Session Rooms | Low | Embedded Jitsi or LiveKit rooms for online group sessions without leaving RollCall |
| Group Merchandise Store | Low | Partner with Printful/Printify to let group owners create branded merch for their community |

---

## Out of Scope (v1.0)

- Native mobile applications (web-first; PWA covers mobile baseline — see F35)
- In-app payment processing between users (organizers may not charge members directly; subscription billing is handled by RollCall's payment provider)
- Video or voice calling (integrations with Discord handle this better)
- Standalone content moderation AI platform or full automated text moderation (Cloudinary AI is used for image uploads only — F42; all text moderation uses the keyword filter F18 plus human review via F14, F15, F44)
- Third-party gaming platform integrations (Steam inventory, Xbox achievements, PlayStation trophies)
- Clan/guild cross-group hierarchy structures
- Marketplace or item trading between users
- **Political groups** — explicitly prohibited (not merely unsupported); blocked at creation by keyword screening and category taxonomy; existing groups of this type removed on report (F14 Prohibited Group Types, F15 Tab 7)
- **Religious/faith groups** — explicitly prohibited; same enforcement mechanism as political groups (F14 Prohibited Group Types, F15 Tab 7)
- Automated law enforcement notification — any LE referral is a manual decision made solely at the platform owner's discretion (F14 Prohibited Group Types, F15 Tab 7); the platform does not auto-report to authorities under any circumstance

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Low initial user base (cold start) | High | High | Palm Beach County pilot strategy: seed 20+ groups with real organizers before public signup opens; soft launch to existing members only; public launch only after density threshold is met |
| Toxic behavior in groups | Medium | High | Layered safety: keyword filter → report → group mod → graduated admin action → ban |
| Scope creep during development | High | High | Strict 6-phase plan; F26–F37 slotted into Phases 4–5; defer Phase 6 features if behind |
| Real-time chat complexity (Socket.io) | Medium | Medium | Use REST-based message board for MVP; add WebSockets as Phase 6 stretch goal |
| GDPR / privacy concerns (location data) | Medium | High | City-level only; safe check-in emails purged 24h post-event; full data export/delete API |
| Content filter false positives | Medium | Medium | Tiered severity; borderline content reviewed by admin before rejection |
| In-person safety incident | Low | Critical | Safety guidelines prominent; check-in feature; no private addresses stored; private venue advisory |
| Group health decay (dormant groups) | High | Medium | Owner nudges at 30d; auto-hide at 67d; clear health badges; ownership auto-transfer |
| Accessibility gaps excluding users | Medium | Medium | WCAG AA target in both themes; venue accessibility tags; dyslexia font toggle |
| New user churn (no early value) | High | High | Guided onboarding flow with group match on Step 5; confetti on first join; empty states throughout |
| Cold-start (no groups at launch) | High | High | Phase 0 seeding playbook: personally recruit 8–12 organizers in Palm Beach County; no public signup until 20 active groups live across 4 categories and 3 cities; soft-launch invite-only to existing members first |
| Outside-PBC users cannot join local groups during pilot | Low | Low | Clearly communicated gate on local group cards (not a surprise); online groups fully open; onboarding auto-match scoped to online groups for non-PBC users; gate is a single config change to lift when expanding |
| User provides false PBC ZIP to bypass local gate | Low | Low | ZIP is self-reported and trusted for MVP; the risk is low because falsifying a ZIP only gains access to in-person groups in PBC — which the user would have to physically attend anyway |
| Legal exposure (no ToS / Privacy Policy) | High | Critical | Legal pages are Phase 1 — cannot launch without them |
| Under-13 user accessing platform | Medium | High | Age confirmation checkbox at registration; admin suspension + COPPA-compliant data deletion within 72h on discovery; ToS clearly states 13+ minimum |
| Ownership abandonment (ghost groups) | Medium | Medium | 30-day auto-transfer to co-mod; 67-day auto-hide; admin force-transfer tool |
| PWA push notification opt-in fatigue | Low | Low | Opt-in is per-notification-type; prompt only shown after 2nd visit with 60s+ engagement |
| Search returning poor results | Medium | High | Fuse.js fuzzy search + synonym map + smart profile-based defaults prevent empty result sets |
| False alarm triggers (accidental) | Medium | Medium | 5-second cancellable countdown; shake sensitivity tuned to avoid pocket/bag triggers; test alarm feature lets users calibrate before they need it |
| SMS delivery failure during real emergency | Low | Critical | Alarm sends to all contacts simultaneously; email backup runs in parallel; clearly documented that 911 is the primary emergency channel |
| Trusted contact never verifies (pending state) | High | Medium | Persistent nudge in Settings → Safety; reminder before first local RSVP; alarm disabled if zero verified contacts with clear explanation |
| GPS permission not granted | Medium | Low | Alarm still fires and notifies contacts without coordinates; Settings → Safety explains the value of granting location permission |
| Legal liability (alarm replaces 911) | Low | High | Documented disclaimer in settings and ToS: alarm notifies trusted contacts only; does not contact emergency services; user assumes responsibility |
| Harmful group slipping through keyword filter | Low | Critical | Keyword filter is a first-pass heuristic only; any user can file a Harmful Group Report; auto-suspension on report receipt; platform owner reviews within 24h; LE referral at owner's discretion |
| Political/religious group created with disguised name | Medium | Low | Category taxonomy excludes the prohibited categories; keyword filter catches common patterns; community reporting is the primary backstop — any member can flag a prohibited group type |

---

*RollCall — Find Your People. Play Your Game.*
