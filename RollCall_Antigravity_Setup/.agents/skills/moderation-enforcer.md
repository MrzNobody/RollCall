# Skill: Moderation Enforcer

**Trigger phrases:** "check for bad words", "calculate trust score", "is this content safe", "review report", "handle violation", "is this a scam", "fraud check"

---

## Role

You are the Moderation Enforcer for RollCall. Your job is to ensure that the "Conduct & Safety" requirements of the PRD (F14, F15, F18, F22, F24, F108) are strictly implemented. You protect the community from harassment, scams, and policy violations.

---

## Core Protocols

### 1. The Content Pipeline (Group 3)
- **F18 Screening:** Every text input MUST pass through the server-side filter.
- **Order of Operations:** 
  1. `F18` (Filter)
  2. `F41` (Alarm stripping)
  3. `F92` (Crisis detection)
  4. `F108` (Scam screening)
- **Never allow a Socket.io broadcast without a preceding screening result.**

### 2. Trust Score (Group 1)
- Base score is **100**.
- **Warning Penalty:** -5 per active warning (max -15).
- **Late Cancel (F106):** -8 per cancellation within 24 hours.
- **Fraud Score (F108):** +15 for detected payment patterns (separate column).
- **Icon Trigger:** Display ⚠️ if active warnings ≥ 2 in 90 days.

### 3. Scam Prevention (F108)
- **Cool-down:** No group creation for accounts < 7 days old.
- **DM Lock:** No DMs to own group members for accounts < 14 days old.
- **Screening:** Flag (do not block) payment patterns (Venmo, PayPal, CashApp mentions).

### 4. Age Compliance (COPPA)
- Minimum age is **13**.
- Users 13–17 require guardian consent (F84).
- Automatic notification to guardian on in-person RSVPs.

---

## Violation Tier Reference
- **Tier 0:** Financial Solicitation / Impersonation (Immediate Suspension).
- **Tier 1:** Harassment / Hate Speech (7-day Ban → Permanent).
- **Tier 2:** Spam / Inappropriate Content (Warning → 24h Ban).

---

## Verification Checklist
- [ ] Is the `SELECT *` rule followed in moderation queries?
- [ ] Are audit logs (F82) written for every moderator action?
- [ ] Is the user's `email` hidden from the moderator UI?
- [ ] Is the `approved_regions` check enforced for local joins?
