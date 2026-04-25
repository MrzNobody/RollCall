# Skill: Test Writer

**Trigger phrases:** "write tests", "generate tests", "add tests for", "test coverage", "unit test", "integration test", "e2e test", "playwright test", "vitest"

---

## Role

You are the Test Writer for RollCall. Your job is to generate tests derived directly from the PRD user stories and acceptance criteria. Tests are not optional — every feature requires coverage at the appropriate level before it can be merged.

---

## Testing Pyramid

```
E2E (Playwright)        — critical user paths only; slow but high confidence
Integration (Supertest) — API routes with real test DB; catches contract bugs
Unit (Vitest)           — pure functions, utils, React components in isolation
```

Always start with the level closest to the code being written, then add higher levels for critical paths.

---

## Test File Locations

```
tests/
├── unit/
│   ├── utils/           # contentFilter, trustScore, dateUtils, fuzzySearch
│   ├── components/      # React component tests (React Testing Library)
│   └── context/         # ThemeContext, AuthContext
├── integration/
│   ├── auth.test.ts
│   ├── groups.test.ts
│   ├── events.test.ts
│   ├── chat.test.ts
│   └── admin.test.ts
└── e2e/
    ├── signup.spec.ts
    ├── onboarding.spec.ts
    ├── join-group.spec.ts
    ├── rsvp.spec.ts
    └── safety-alarm.spec.ts
```

---

## Unit Test Template (Vitest)

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { functionUnderTest } from '../../../src/utils/moduleName'

describe('functionUnderTest', () => {
  describe('when [condition]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      const input = ...
      // Act
      const result = functionUnderTest(input)
      // Assert
      expect(result).toEqual(...)
    })
  })

  describe('edge cases', () => {
    it('should handle empty input', () => { ... })
    it('should handle null/undefined', () => { ... })
    it('should handle maximum values', () => { ... })
  })
})
```

**Priority unit test targets (always include these):**
- `contentFilter.ts`: Test all severity tiers (CRITICAL/HIGH/MEDIUM/CLEAN) with known strings
- `trustScore.ts`: Test each input weight; test penalty caps (max −15 for warnings)
- `groupHealthState.ts`: Test all four states at exact boundary dates (14, 30, 60 days)
- `fuzzySearch.ts`: Test synonym map resolution; test typo tolerance; test empty results
- `geoGate.ts`: Test PBC ZIP allowed; test non-PBC ZIP rejected; test zip from approved_regions cache

---

## Integration Test Template (Supertest)

```typescript
import request from 'supertest'
import { app } from '../../src/app'
import { prisma } from '../../src/db'
import { createTestUser, createTestGroup, getAuthToken } from '../helpers'

describe('POST /api/groups/:id/join', () => {
  let token: string
  let groupId: string

  beforeEach(async () => {
    // Each test gets a fresh transaction that rolls back after
    await prisma.$executeRaw`BEGIN`
    const user = await createTestUser({ zip_code: '33401' }) // PBC zip
    token = await getAuthToken(user)
    const group = await createTestGroup({ location_type: 'local' })
    groupId = group.id
  })

  afterEach(async () => {
    await prisma.$executeRaw`ROLLBACK`
  })

  it('allows a PBC user to join a local group', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/join`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('active') // open group
  })

  it('returns pilot_geo_restricted for non-PBC ZIP on local group', async () => {
    const outsideUser = await createTestUser({ zip_code: '10001' }) // New York
    const outsideToken = await getAuthToken(outsideUser)
    const res = await request(app)
      .post(`/api/groups/${groupId}/join`)
      .set('Authorization', `Bearer ${outsideToken}`)
    expect(res.status).toBe(403)
    expect(res.body.code).toBe('pilot_geo_restricted')
  })

  it('returns account_cool_down for accounts under 7 days', async () => {
    const newUser = await createTestUser({ created_at: new Date() })
    const newToken = await getAuthToken(newUser)
    const ownedGroup = await createTestGroup({ owner_id: newUser.id })
    // Try to create a group (not join — this tests F108 group creation cool-down)
    const res = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${newToken}`)
      .send({ name: 'Test', category: 'Gaming', location_type: 'online' })
    expect(res.status).toBe(403)
    expect(res.body.code).toBe('account_cool_down')
  })
})
```

**Required integration test cases for every API endpoint:**
1. Happy path — valid input, expected success response
2. Unauthenticated — no JWT returns 401
3. Forbidden — wrong role returns 403
4. Validation — missing required fields returns 400
5. Not found — invalid ID returns 404
6. Feature-specific edge cases (see below)

---

## Feature-Specific Test Requirements

### F18 Content Screening
```typescript
// Must test all severity tiers
it('blocks CRITICAL content', ...) // sexual content, threats
it('warns on HIGH content', ...)   // profanity
it('logs MEDIUM content', ...)     // mild language
it('passes CLEAN content', ...)    // normal text
it('screens before Socket.io broadcast', ...) // message never reaches room if CRITICAL
```

### F48 Geographic Gate
```typescript
it('allows PBC ZIP on local group join')
it('blocks non-PBC ZIP on local group join with pilot_geo_restricted')
it('allows non-PBC ZIP on online group join')
it('creates geo_waitlist entry when non-PBC user requests waitlist')
it('allows creating a local group regardless of ZIP')
```

### F41 Safety Alarm
```typescript
it('triggers alarm and notifies trusted contacts')
it('purges GPS coordinates after 24 hours')
it('does not expose alarm state to other users')
it('test alarm sends [TEST] prefix to contacts')
it('dismissing alarm within countdown window cancels notification')
```

### F67 Direct Messages
```typescript
it('allows all registered users to send DMs with no thread limit')
it('blocks new account owner from DMing group members within 14 days')
it('respects minor DM restrictions (F84)')
it('does not return email in DM participant data')
```

### F98 Data Visibility
```typescript
it('unauthenticated request returns only public teaser')
it('authenticated non-member gets group info but not member roster')
it('confirmed member gets full member roster (display_name only, no email)')
it('email is never present in any response body')
it('honeypot field triggers silent reject and fraud score increment')
```

---

## E2E Test Template (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test.describe('User signup and onboarding', () => {
  test('new user completes onboarding and sees matched groups', async ({ page }) => {
    await page.goto('/register')
    await page.fill('[name=displayName]', 'Test User')
    await page.fill('[name=email]', 'test@example.com')
    await page.fill('[name=password]', 'TestPass123!')
    await page.check('[data-testid=age-confirmation]')
    await page.click('[type=submit]')

    // Should redirect to onboarding
    await expect(page).toHaveURL('/onboarding')

    // Complete all 6 steps
    // Step 1: interests
    await page.click('[data-interest="Video Games"]')
    await page.click('[data-testid=next]')
    // ... complete remaining steps ...

    // Step 5: should show matched groups
    await expect(page.locator('[data-testid=match-card]')).toHaveCount({ min: 1 })
  })
})
```

**Required E2E flows:**
1. `signup.spec.ts` — register, verify age checkbox, confirm redirect to onboarding
2. `onboarding.spec.ts` — complete all 6 steps, verify matched groups appear in Step 5
3. `join-group.spec.ts` — discover a group, join it, verify dashboard updates
4. `rsvp.spec.ts` — find an event, RSVP Going, verify it appears in My Week on dashboard
5. `safety-alarm.spec.ts` — configure trusted contact, trigger test alarm, verify [TEST] notification sent

---

## Test Data Helpers

Always use these factory functions — never hardcode test data:

```typescript
// tests/helpers/index.ts
export const createTestUser = (overrides = {}) => prisma.user.create({
  data: {
    display_name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password_hash: await bcrypt.hash('TestPass123!', 10),
    zip_code: '33401', // West Palm Beach — PBC by default
    city: 'West Palm Beach',
    ...overrides
  }
})

export const createTestGroup = (overrides = {}) => prisma.group.create({
  data: {
    name: 'Test Group',
    slug: `test-group-${Date.now()}`,
    category: 'Video Games',
    location_type: 'local',
    ...overrides
  }
})

export const getAuthToken = async (user) => {
  const res = await request(app).post('/api/auth/login').send({
    email: user.email, password: 'TestPass123!'
  })
  return res.body.data.token
}
```
