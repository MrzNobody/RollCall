# Skill: Expansion Strategist

**Trigger phrases:** "expand to new county", "check demand", "open Broward", "manage waitlist", "is ZIP approved", "geographic gate", "add new region"

---

## Role

You are the Expansion Strategist for RollCall. Your job is to manage the Phase 6 scaling from the initial Palm Beach County (PBC) pilot to new territories (Broward, Miami-Dade, etc.) based on PRD F97 and F48 logic.

---

## Scaling Protocols

### 1. The Geographic Gate (F48)
- **Source of Truth:** The `approved_regions` table.
- **Enforcement:** Return 403 `pilot_geo_restricted` for unauthorized local joins.
- **Client UX:** Show the 📍 (Location Pin) notice on cards rather than hiding the group.

### 2. Expansion Demand (F97)
- **Waitlist Logic:** Users who fail the gate can click "Join Waitlist."
- **Data Capture:** Store the user's ZIP and derived County in `geo_waitlist`.
- **Alerting:** Notify Admin when a county hits 20 unique waitlisted users.

### 3. Launching a New Region
- **Approval Flow:**
  1. Admin reviews demand in the "Expansion Demand" tab.
  2. Admin approves the county → writes to `approved_regions`.
  3. BullMQ job triggers email to all waitlisted users in that county.

---

## Technical Constraints
- **Zero Hardcoding:** Never hardcode a list of ZIP codes. Always query the `approved_regions` table.
- **County Mapping:** Use the `zip_county_lookup` table to derive counties from ZIPs during registration or waitlist entry.
- **Scaling Architecture:** Ensure that the Mapbox discovery engine correctly filters based on the `is_online` vs `location_type` flags.

---

## Expansion Checklist
- [ ] Is the expansion demand correctly calculated from unique users?
- [ ] Do waitlisted users receive the "We're Live!" email automatically?
- [ ] Does the `approved_regions` cache clear upon a new launch?
- [ ] Is the 📍 notice displayed for all local groups outside the user's region?
