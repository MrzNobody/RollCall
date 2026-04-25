# RollCall — Database Schema Reference

> Always-active. Use this as the definitive table and column reference.
> All changes to the schema must go through `prisma migrate dev` — never hand-edit migrations.

---

## Schema Conventions (Non-Negotiable)

- Primary keys: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- Timestamps: `created_at TIMESTAMP NOT NULL DEFAULT NOW()` on every table
- Foreign keys: always named `<singular_table>_id` (e.g., `user_id`, `group_id`)
- Soft deletes: `deleted_at TIMESTAMP` (null = not deleted) — never hard DELETE user content
- Boolean flags: `is_` prefix for state (e.g., `is_active`, `is_sensitive`)
- ENUM types live in `prisma/schema.prisma` — extend them there, not in raw SQL

---

## Core Tables

### users
```
id                          UUID PK
email                       VARCHAR UNIQUE NOT NULL          -- NEVER returned in public API
password_hash               VARCHAR                          -- null if OAuth-only
display_name                VARCHAR NOT NULL
bio                         TEXT
avatar_url                  VARCHAR
date_of_birth               DATE                             -- optional; never publicly displayed
zip_code                    VARCHAR(10)                      -- required; never public
city                        VARCHAR
timezone                    VARCHAR
trust_score                 INTEGER DEFAULT 100
fraud_score                 INTEGER DEFAULT 0               -- F81; separate from trust_score
conduct_flag_count          INTEGER DEFAULT 0               -- F24; flags ≥2 = ⚠️ icon
verified_organizer          BOOLEAN DEFAULT false           -- F108; admin-granted only
verified_badge              BOOLEAN DEFAULT false           -- email verified
lfg_status                  ENUM('active','not_looking')
linked_steam                VARCHAR
linked_xbox                 VARCHAR
linked_psn                  VARCHAR
linked_battlenet            VARCHAR
linked_nintendo             VARCHAR                         -- friend code (F3.4)
linked_discord              VARCHAR                         -- (F3.4)
linked_youtube              VARCHAR                         -- (F3.4)
is_admin                    BOOLEAN DEFAULT false
is_suspended                BOOLEAN DEFAULT false
suspended_until             TIMESTAMP
onboarding_complete         BOOLEAN DEFAULT false
home_feed_last_seen_at      TIMESTAMP                       -- F111
home_dashboard_prefs        JSONB                           -- F111; section visibility prefs
analytics_opt_out           BOOLEAN DEFAULT false           -- F68/F107
display_email               BOOLEAN DEFAULT false           -- F103; show email to group members
display_phone               BOOLEAN DEFAULT false           -- F103
phone_number                VARCHAR                         -- F47 3FA; never public
phone_verified              BOOLEAN DEFAULT false
mfa_enabled                 BOOLEAN DEFAULT false
alarm_tap_count             INTEGER DEFAULT 3               -- F41 configurable
alarm_tap_window            FLOAT DEFAULT 1.5               -- F41 seconds
alarm_shake_sensitivity     ENUM('low','medium','high') DEFAULT 'medium'   -- F41
alarm_countdown_seconds     INTEGER DEFAULT 5              -- F41
created_at                  TIMESTAMP NOT NULL
updated_at                  TIMESTAMP
deleted_at                  TIMESTAMP                       -- soft delete / right-to-erasure
```

### groups
```
id                          UUID PK
slug                        VARCHAR UNIQUE NOT NULL
name                        VARCHAR NOT NULL
description                 TEXT
category                    VARCHAR NOT NULL                -- top-level category
subcategory                 VARCHAR
location_type               ENUM('online','local','hybrid') NOT NULL
city                        VARCHAR
zip_code                    VARCHAR(10)
privacy                     ENUM('public','invite_only','secret') DEFAULT 'public'  -- F73
capacity                    INTEGER
owner_id                    UUID FK → users(id)
is_active                   BOOLEAN DEFAULT true
group_health_score          INTEGER DEFAULT 100            -- F19; one column, multiple writers
crossplay_enabled           BOOLEAN DEFAULT false          -- F3.4
calendar_visibility         ENUM('public','members_only','followers_only') DEFAULT 'public'  -- F94
skill_gate_enabled          BOOLEAN DEFAULT false          -- F95
skill_gate_level            ENUM('beginner','intermediate','advanced','expert')
skill_gate_message          TEXT
payment_prohibition_ack     BOOLEAN DEFAULT false          -- F108
payment_prohibition_ack_at  TIMESTAMP                      -- F108
vtt_platform                VARCHAR                        -- F110; e.g. 'roll20', 'foundry'
vtt_url                     VARCHAR                        -- F110; validated URL
icon_source                 ENUM('igdb','bgg','library','custom')   -- F109
icon_url                    VARCHAR                        -- F109; Cloudinary CDN URL
icon_igdb_id                VARCHAR                        -- F109
icon_bgg_id                 VARCHAR                        -- F109
icon_lib_key                VARCHAR                        -- F109; SVG library key
created_from_template       VARCHAR                        -- F74; template key
accessibility_statement     TEXT                           -- F86
created_at                  TIMESTAMP NOT NULL
updated_at                  TIMESTAMP
```

### group_members
```
id                          UUID PK
group_id                    UUID FK → groups(id)
user_id                     UUID FK → users(id)
role                        ENUM('owner','co_moderator','member')
join_source                 VARCHAR                        -- F70 analytics
status                      ENUM('active','pending','removed','banned')
seen_new_owner_notice       BOOLEAN DEFAULT false          -- F108 safety notice
joined_at                   TIMESTAMP NOT NULL
UNIQUE(group_id, user_id)
```

### events (sessions)
```
id                          UUID PK
group_id                    UUID FK → groups(id)
title                       VARCHAR NOT NULL
description                 TEXT
start_at                    TIMESTAMP NOT NULL
end_at                      TIMESTAMP
location_label              VARCHAR                        -- public city only (F45 tier 1)
location_lat                DECIMAL                        -- members only (F45 tier 2)
location_lng                DECIMAL                        -- members only (F45 tier 2)
location_place_id           VARCHAR                        -- Google Maps place ID
max_attendees               INTEGER
is_recurring                BOOLEAN DEFAULT false
recurring_rule              VARCHAR                        -- iCal RRULE string
vtt_platform                VARCHAR                        -- F110 per-session override
vtt_url                     VARCHAR                        -- F110 per-session override
created_by                  UUID FK → users(id)
created_at                  TIMESTAMP NOT NULL
```

### event_exceptions (F51, F57)
```
id                          UUID PK
event_id                    UUID FK → events(id)
original_date               TIMESTAMP NOT NULL
action                      ENUM('skip','reschedule','modify')
new_start_at                TIMESTAMP
new_end_at                  TIMESTAMP
reason                      TEXT
created_at                  TIMESTAMP NOT NULL
```

### rsvps
```
id                          UUID PK
event_id                    UUID FK → events(id)
user_id                     UUID FK → users(id)
status                      ENUM('going','maybe','not_going')
accessibility_note          TEXT                           -- F86; visible to owner/mods only; purged 24h post-event
created_at                  TIMESTAMP NOT NULL
updated_at                  TIMESTAMP
UNIQUE(event_id, user_id)
```

---

## Chat & Messaging Tables

### channels (F10)
```
id                          UUID PK
group_id                    UUID FK → groups(id)
name                        VARCHAR NOT NULL               -- e.g. 'general', 'scheduling'
type                        ENUM('standard','announcement','archived')
position                    INTEGER                        -- display order
created_at                  TIMESTAMP NOT NULL
```

### chat_messages (F10)
```
id                          UUID PK
channel_id                  UUID FK → channels(id)
user_id                     UUID FK → users(id)
content                     TEXT NOT NULL
has_spoiler                 BOOLEAN DEFAULT false          -- F65
is_pinned                   BOOLEAN DEFAULT false
is_deleted                  BOOLEAN DEFAULT false
deleted_by_user_id          UUID FK → users(id)
edit_count                  INTEGER DEFAULT 0
edited_at                   TIMESTAMP
created_at                  TIMESTAMP NOT NULL
```

### dm_threads, dm_participants, dm_messages (F67)
```
dm_threads:      id, created_at
dm_participants: id, thread_id FK, user_id FK, last_read_at, UNIQUE(thread_id, user_id)
dm_messages:     id, thread_id FK, sender_id FK, content, is_read, read_at, is_deleted, deleted_by_user_id, created_at
```

---

## Forum Tables (F61, F64, F65)

### forum_posts
```
id                          UUID PK
group_id                    UUID FK → groups(id)
author_id                   UUID FK → users(id)
post_type                   ENUM('discussion','tip','poi','announcement')
title                       VARCHAR NOT NULL
content                     TEXT NOT NULL
has_spoiler                 BOOLEAN DEFAULT false          -- F65
vote_score                  INTEGER DEFAULT 0              -- F64; maintained by trigger on post_votes
is_pinned                   BOOLEAN DEFAULT false
is_deleted                  BOOLEAN DEFAULT false
created_at                  TIMESTAMP NOT NULL
updated_at                  TIMESTAMP
```

### post_votes (F64)
```
id                          UUID PK
post_id                     UUID FK → forum_posts(id)
user_id                     UUID FK → users(id)
vote                        SMALLINT NOT NULL              -- 1 = upvote, -1 = downvote
created_at                  TIMESTAMP NOT NULL
UNIQUE(post_id, user_id)
```

---

## Safety & Moderation Tables

### reports
```
id                          UUID PK
reporter_id                 UUID FK → users(id)
target_type                 ENUM('user','group','post','message','profile')
target_id                   UUID NOT NULL
violation_type              ENUM('harassment','spam','inappropriate_content','sexual_harassment','sexual_abuse','financial_solicitation','impersonation','prohibited_group_type','harmful_group_planning','other')
description                 TEXT
is_sensitive                BOOLEAN DEFAULT false          -- routes to Tab 6
is_harmful_group            BOOLEAN DEFAULT false          -- routes to Tab 7
status                      ENUM('pending','reviewed','actioned','dismissed')
resolved_by                 UUID FK → users(id)
resolved_at                 TIMESTAMP
created_at                  TIMESTAMP NOT NULL
```

### warnings (F22)
```
id                          UUID PK
user_id                     UUID FK → users(id)
issued_by                   UUID FK → users(id)
reason                      TEXT
expires_at                  TIMESTAMP NOT NULL             -- 90-day rolling window
is_active                   BOOLEAN DEFAULT true
trust_score_delta           INTEGER DEFAULT -5            -- written at issuance
created_at                  TIMESTAMP NOT NULL
```

### banned_users (F15, F22)
```
id                          UUID PK
user_id                     UUID FK → users(id)
banned_by                   UUID FK → users(id)
reason                      TEXT
violation_type              ENUM(same as reports.violation_type)
is_permanent                BOOLEAN DEFAULT false
expires_at                  TIMESTAMP
created_at                  TIMESTAMP NOT NULL
```

### trusted_contacts (F41)
```
id                          UUID PK
user_id                     UUID FK → users(id)
name                        VARCHAR NOT NULL
phone_number                VARCHAR NOT NULL               -- verified via Twilio
notify_via                  ENUM('sms','email','both') DEFAULT 'sms'
receive_escalation          BOOLEAN DEFAULT true
custom_message              TEXT
created_at                  TIMESTAMP NOT NULL
```

### alarm_events (F41)
```
id                          UUID PK
user_id                     UUID FK → users(id)
triggered_via               ENUM('tap','shake','keyword')
trigger_context             VARCHAR                        -- 'group_chat','dm','all'
latitude                    DECIMAL                        -- purged after 24 hours
longitude                   DECIMAL                        -- purged after 24 hours
contacts_notified           INTEGER
resolved_at                 TIMESTAMP
created_at                  TIMESTAMP NOT NULL
```

---

## Key Supporting Tables

### fraud_score_events (F81)
```
id, user_id FK, signal VARCHAR, delta INTEGER, score_after INTEGER, decay_date TIMESTAMP, created_at
```

### admin_audit_log (F82)
```
id, admin_id FK, action VARCHAR, target_type VARCHAR, target_id UUID, metadata JSONB, created_at
-- Append-only: no UPDATE or DELETE permissions granted on this table
```

### geo_waitlist (F97)
```
id, user_id FK, county VARCHAR NOT NULL, zip_code VARCHAR, created_at
UNIQUE(user_id, county)
```

### approved_regions (F97)
```
id, zip_code VARCHAR UNIQUE, county VARCHAR, approved_at TIMESTAMP, approved_by UUID FK
```

### cancellation_events (F106)
```
id, event_id FK, user_id FK, cancelled_at TIMESTAMP, hours_before_session DECIMAL GENERATED, is_late_cancel BOOLEAN, trust_score_delta INTEGER, created_at
```

### deletion_requests (F75)
```
id, user_id FK, requested_at TIMESTAMP, grace_period_ends TIMESTAMP, status ENUM('pending','processing','completed','cancelled'), completed_at TIMESTAMP
```

### feedback_submissions (F96)
```
id, user_id FK, feedback_type ENUM('post_onboarding','post_session','nps','widget'), rating INTEGER, nps_score INTEGER, category VARCHAR, content TEXT, status ENUM('new','reviewed','actioned'), created_at
```

### referrals (F72)
```
id, referrer_id FK, referred_user_id FK, ref_code VARCHAR, converted_at TIMESTAMP, reward_issued BOOLEAN DEFAULT false, created_at
```

### activity_gap_votes (F94)
```
id, user_id FK, interest_tag VARCHAR NOT NULL, voted_at TIMESTAMP, UNIQUE(user_id, interest_tag)
```
