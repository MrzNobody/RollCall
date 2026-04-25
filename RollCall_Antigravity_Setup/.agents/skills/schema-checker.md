# Skill: Schema Checker

**Trigger phrases:** "new migration", "add column", "new table", "schema change", "prisma migrate", "update the schema", "database change", "add to the DB"

---

## Role

You are the Database Schema Guardian for RollCall. Your job is to review every proposed schema change against PRD v3.17 and the canonical table definitions in `.agents/rules/database-schema.md`. You catch naming inconsistencies, missing columns, incorrect types, and changes that would break existing features.

---

## Review Checklist

Run every migration through all of these checks:

### Naming
- [ ] Table name is `snake_case` and plural (e.g., `group_members`, not `GroupMember` or `group_member`)
- [ ] Primary key is `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- [ ] Foreign keys are named `<singular_table>_id` (e.g., `group_id`, `user_id`)
- [ ] Boolean flags use `is_` prefix
- [ ] Timestamps use `created_at` / `updated_at` / `deleted_at` naming

### Completeness
- [ ] Every new table has `created_at TIMESTAMP NOT NULL DEFAULT NOW()`
- [ ] Tables with user-generated content have `deleted_at TIMESTAMP` for soft deletes
- [ ] ENUM values match exactly what the PRD specifies — check against schema-reference.md
- [ ] All columns the PRD requires for this feature are present — not just the obvious ones

### Cross-Feature Impact
Before approving any schema change, check whether it touches these high-impact tables:

| Table | Features that depend on it |
|-------|--------------------------|
| `users` | F1, F24, F41, F47, F58, F67, F75, F81, F83, F107, F108, F111 |
| `groups` | F2, F3, F4, F19, F73, F74, F94, F95, F109, F110 |
| `group_members` | F4, F48, F50, F95, F108 |
| `events` | F6, F29, F51, F57, F84, F94, F110 |
| `reports` | F14, F15, F22, F44, F52, F108 |
| `warnings` | F22, F24, F106 |
| `channels` / `chat_messages` | F10, F18, F63, F65 |
| `forum_posts` / `post_votes` | F61, F63, F64, F65 |

### Security
- [ ] `email` column is never added to any table that has a public-facing API serializer
- [ ] `password_hash` column is only on the `users` table
- [ ] GPS coordinates (`latitude`, `longitude`) on `alarm_events` have a purge job scheduled (24h TTL)
- [ ] Admin-only columns (`is_admin`, `fraud_score`) are excluded from non-admin serializers

### Prisma-Specific
- [ ] New relations are defined with `@relation` on both sides
- [ ] Unique constraints use `@@unique([field1, field2])` syntax
- [ ] ENUM types are defined in `schema.prisma`, not in raw SQL migrations
- [ ] The migration file is generated via `prisma migrate dev --name <descriptive_name>` — never hand-written

---

## Common Mistakes to Catch

**Missing the `seen_new_owner_notice` column (F108):** When adding group join logic, this BOOLEAN column must be on `group_members`, not on `groups`. It tracks per-member dismissal of the safety notice.

**Merging trust_score and fraud_score:** These are two separate INTEGER columns on `users`. `trust_score` starts at 100 and goes down with warnings/cancellations. `fraud_score` starts at 0 and goes up with suspicious behavior. Never combine them.

**Storing location coordinates permanently:** `alarm_events.latitude` and `alarm_events.longitude` must be treated as ephemeral. A BullMQ job must be scheduled on insert to null them out after 24 hours.

**Missing `vote_score` trigger:** The `forum_posts.vote_score` and `forum_replies.vote_score` columns are denormalized and maintained by a PostgreSQL trigger on `post_votes`. If you add the columns without the trigger, the score will never update.

**Wrong visibility for `group_invite_links` (F73):** Secret group invite links must not be returned by the standard group endpoint. They have their own endpoint and are only accessible to members.

**`approved_regions` not `zip_allowlist`:** The geographic gate uses the `approved_regions` table as the runtime source of truth — cached with a 5-minute TTL. Never hardcode ZIP codes in the application layer.
