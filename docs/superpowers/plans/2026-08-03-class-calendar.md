# Interactive Class Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the day-grouped list on `/classes` with an interactive week calendar — classes positioned by time, sized by duration, concurrent classes side by side — where tapping a class opens its details and a route to registration.

**Architecture:** Class prose moves out of the two page files into a shared `src/lib/classInfo.js` keyed by an explicit `infoKey`, because the flyer-verbatim schedule names (`Beginner Acro / Jazz`) do not match the studio's copy names (`Beginner Acro & Jazz`). Schedule rows gain `start`/`end` 24-hour fields for positioning. A new `ClassCalendar` component renders an absolutely-positioned week grid at `md` and up and the existing day-grouped list below that; both open a shared `ClassDetailPanel`.

**Tech Stack:** Vite 8 · React 19 · react-router-dom 7 · Tailwind 3 · Vitest 4 + jsdom + Testing Library

**Spec:** `docs/superpowers/specs/2026-08-03-class-calendar-design.md`

## Global Constraints

- Branch before starting; do not push. Commit per task as the steps specify.
- Test one file with `npx vitest run <path>`. **Never** bare `npm test` — it is watch mode.
- **Suite baseline: exactly 2 pre-existing failures**, both in `src/pages/Camps.test.jsx` (`renders page title`, `renders camp listing cards`). Not yours to fix; any third failure is a regression.
- Lint what you touch: `npx eslint <files>`. Repo-wide there are ~187 pre-existing errors — ignore those, but the files you touch must be clean. Note every `*.test.jsx` reports `'test' is not defined` / `'expect' is not defined` (`no-undef`) because the eslint config declares only browser globals; that is pre-existing and expected in test files.
- **The `name` field on every schedule row is flyer-verbatim and must not change.** `infoKey` is additive.
- Copy strings, en dashes (`–`), em dashes (`—`), and apostrophes are exact. Do not reword, do not substitute hyphens. Where a string contains an apostrophe, use double-quoted JS strings as the existing code does.
- Reuse existing Tailwind tokens only: `navy-dark`, `navy-mid`, `brand-red`, `surface-light`, `surface-border`, and the literal accents `#7ab3e8`, `#f4a8b4`, `#f4a060`, `#5a6a8a`, `#8a9aaa`, `#b8d4f0`, `#3a4a6a`.
- Portal registration URL, exact: `https://studio.capitalcoredance.com/register/classes`
- Do not modify `src/lib/schema.js`.
- **jsdom renders both the grid and the mobile list** (Tailwind's `hidden`/`md:` classes are not applied), so a bare `getByText('Tumble Tech')` finds two nodes. Always scope queries to `data-testid="class-grid"` or `data-testid="class-list"`.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/lib/classInfo.js` | Create | `CLASS_INFO` (21 entries) + `getClassInfo(key)`. Sole owner of class prose. |
| `src/lib/classInfo.test.js` | Create | Module shape + the bidirectional schedule↔copy invariants |
| `src/components/ClassDetailPanel.jsx` | Create | Detail dialog: content, Escape close, focus return, backdrop |
| `src/components/ClassDetailPanel.test.jsx` | Create | Panel behaviour |
| `src/components/ClassCalendar.jsx` | Create | Week grid + mobile day list + overlap clustering; owns selection |
| `src/components/ClassCalendar.test.jsx` | Create | Positioning, clustering, filtering, accessible names |
| `src/pages/Classes.jsx` | Modify | `SCHEDULE` gains `start`/`end`/`infoKey`; Day filter removed; renders `ClassCalendar` |
| `src/pages/Classes.test.jsx` | Modify | Filter-count assertion updated; day-filter test removed; scoped queries |
| `src/pages/ClassLevels.jsx` | Modify | Reads prose from `classInfo` |
| `src/pages/AdultClasses.jsx` | Modify | Reads prose from `classInfo` |

---

### Task 1: Shared classInfo module

**Files:**
- Create: `src/lib/classInfo.js`
- Create: `src/lib/classInfo.test.js`

**Interfaces:**
- Produces: named exports `CLASS_INFO` (plain object, 21 keys) and `getClassInfo(key: string) => { audience: string, description: string, draft?: boolean } | undefined`. Later tasks look up prose exclusively through `getClassInfo`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/classInfo.test.js`:

```js
import { CLASS_INFO, getClassInfo } from './classInfo'

test('holds an entry for all 21 distinct classes', () => {
  expect(Object.keys(CLASS_INFO)).toHaveLength(21)
})

test('every entry has a usable audience line and description', () => {
  for (const [key, info] of Object.entries(CLASS_INFO)) {
    expect(info.audience, `${key} audience`).toBeTruthy()
    expect(info.audience.length, `${key} audience too short`).toBeGreaterThan(20)
    expect(info.description, `${key} description`).toBeTruthy()
    expect(info.description.length, `${key} description too short`).toBeGreaterThan(60)
  }
})

test('marks exactly the three in-house drafted descriptions', () => {
  const drafts = Object.entries(CLASS_INFO)
    .filter(([, info]) => info.draft)
    .map(([key]) => key)
    .sort()
  expect(drafts).toEqual(['Beginner Hip Hop', 'Lyrical & Contemporary', 'Tumble'])
})

test('getClassInfo returns the entry for a known key', () => {
  expect(getClassInfo('Adult Pom').description).toContain('pom technique')
})

test('getClassInfo returns undefined for an unknown key rather than throwing', () => {
  expect(getClassInfo('Beginner Acro / Jazz')).toBeUndefined()
  expect(getClassInfo('')).toBeUndefined()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/classInfo.test.js`
Expected: FAIL — `Failed to resolve import "./classInfo"`.

- [ ] **Step 3: Write the module**

Create `src/lib/classInfo.js`. Descriptions are the studio's own copy (supplied 2026-08-03) except the three marked `draft`, which are in-house pending review. All `audience` lines are in-house.

```js
// Single source of truth for class prose. Consumed by the Classes calendar, the
// Class Levels page, and the Adult Classes page.
//
// Keys are the studio's copy names. The Fall schedule in Classes.jsx uses
// flyer-verbatim names that differ ("Beginner Acro / Jazz" vs "Beginner Acro &
// Jazz"), so each schedule row carries an explicit `infoKey` pointing here rather
// than being matched on its display name.
//
// `draft: true` marks a description written in-house because the studio's copy did
// not cover that class. Those three await studio review.
export const CLASS_INFO = {
  'Tiny Ballet & Tumble': {
    audience: 'Perfect for first-time dancers who love to move and climb.',
    description: 'Perfect for little ones just beginning their dance journey! Dancers explore basic ballet movements, balance, coordination, and beginner tumbling skills through music, imagination, and creative play. This class builds confidence while developing important motor skills in a fun, encouraging environment.',
  },
  'Tiny Ballet & Hip Hop': {
    audience: 'Great for high-energy little ones who love music and games.',
    description: 'A fun introduction to both ballet and hip hop! Young dancers build rhythm, coordination, confidence, and creativity while learning age-appropriate movement through upbeat music, games, and imaginative activities.',
  },
  'Tiny Ballet & Tap': {
    audience: 'Perfect for little dancers who love making noise with their feet.',
    description: 'Introduce your little dancer to the grace of ballet and the excitement of tap! This class develops rhythm, musicality, balance, listening skills, and confidence while making learning fun.',
  },
  'Beginner Ballet & Jazz': {
    audience: 'Ideal for a first-time dancer who wants a strong foundation.',
    description: 'A wonderful introduction to dance! Students build a strong ballet foundation while learning energetic jazz technique that improves flexibility, coordination, confidence, and performance quality.',
  },
  'Beginner Ballet & Hip Hop': {
    audience: 'Great for dancers who want structure and fun in one class.',
    description: 'The perfect combination of structure and fun! Dancers learn ballet technique while exploring the exciting energy of hip hop, helping them become well-rounded performers.',
  },
  'Beginner Ballet & Tap': {
    audience: 'Perfect for beginners drawn to rhythm and timing.',
    description: 'Students develop ballet fundamentals while learning rhythm, timing, and musicality through tap dancing. A great class for dancers beginning their dance education.',
  },
  'Beginner Ballet & Modern': {
    audience: 'Ideal for expressive dancers who like to create.',
    description: 'Explore both classical ballet and creative modern dance. Students learn proper technique while developing body awareness, expression, flexibility, and artistry.',
  },
  'Beginner Acro & Jazz': {
    audience: 'Great for energetic kids who love to flip and tumble.',
    description: 'A high-energy class introducing dancers to basic acrobatics alongside exciting jazz movement. Students build strength, flexibility, coordination, balance, and confidence.',
  },
  'Beginner Contemporary & Jazz': {
    audience: 'Perfect for dancers who want to move and tell a story.',
    description: 'Learn expressive movement while building strong jazz fundamentals. Dancers improve flexibility, musicality, creativity, and performance skills in this engaging combo class.',
  },
  'Beginner Hip Hop & Breakdancing': {
    audience: 'Great for energetic dancers who want to freestyle.',
    description: 'A favorite for energetic dancers! Students learn hip hop grooves, beginner breakdancing foundations, freestyle skills, musicality, and coordination in an encouraging atmosphere.',
  },
  'Beginner Hip Hop': {
    draft: true,
    audience: "Perfect for a first-time dancer who loves to move to today's music.",
    description: 'An upbeat introduction to hip hop! Dancers learn grooves, rhythm, and beginner choreography while building coordination, musicality, and confidence in a supportive class.',
  },
  'Acro & Lyrical': {
    audience: 'Ideal for dancers with tumbling experience who love to perform.',
    description: 'This class combines acrobatic skills with expressive lyrical dance. Students focus on flexibility, strength, control, artistry, and emotional storytelling through movement.',
  },
  'Ballet & Contemporary': {
    audience: 'Ideal for dancers focused on serious technique.',
    description: 'A technique-focused class blending classical ballet with contemporary dance. Dancers develop alignment, flexibility, artistry, turns, extensions, and musicality.',
  },
  'Tumble Tech': {
    audience: 'Great for any dancer working toward a new tumbling skill — all levels welcome.',
    description: 'Designed for dancers wanting to improve tumbling technique. Students work on rolls, cartwheels, walkovers, handstands, flexibility, strength, and proper progressions at their own level.',
  },
  'Tumble': {
    draft: true,
    audience: 'Great for dancers building tumbling confidence at their own pace.',
    description: 'A tumbling class for dancers building skills at their own pace. Students work on rolls, cartwheels, handstands, flexibility, and strength with proper spotting and progressions.',
  },
  'Lyrical & Contemporary': {
    draft: true,
    audience: 'Ideal for dancers who connect to music and emotion.',
    description: 'Expressive movement set to the music that inspires it. Dancers develop control, flexibility, artistry, and storytelling while strengthening lyrical and contemporary technique.',
  },
  'Musical Theatre': {
    audience: 'Perfect for the dancer who loves to sing, act, and perform — all levels welcome.',
    description: 'Love to perform? This Broadway-inspired class combines dance, acting, and storytelling while helping students build confidence, stage presence, and performance skills.',
  },
  'Pom Cheer': {
    audience: 'Great for dancers who love team routines and performing.',
    description: 'Learn pom technique, cheer motions, jumps, and exciting dance combinations while developing teamwork, confidence, and performance quality.',
  },
  'Adult Femme Flair': {
    audience: 'Perfect for adults returning to dance or starting fresh.',
    description: "An empowering dance class focused on confidence, musicality, and expressive choreography. Whether you're returning to dance or trying something new, you'll leave feeling stronger and more confident.",
  },
  'Adult Pom': {
    audience: "Great for adults who want a workout that doesn't feel like one.",
    description: "A fun, upbeat class featuring pom technique, jazz-inspired movement, and energetic choreography. It's a great workout while learning exciting routines.",
  },
  'Adult Contemporary': {
    audience: 'Ideal for adults who want to move expressively in a welcoming room.',
    description: 'Explore movement, creativity, and expression through contemporary dance. Improve flexibility, balance, strength, and artistry in a supportive, welcoming environment.',
  },
}

export function getClassInfo(key) {
  return CLASS_INFO[key]
}
```

Note `getClassInfo('')` must be undefined — an empty string is not a key here, so the plain lookup already satisfies it. Do not add an `Object.prototype` guard; `CLASS_INFO` has no inherited string keys that collide with class names.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/classInfo.test.js`
Expected: PASS — 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/classInfo.js src/lib/classInfo.test.js
git commit -m "feat: add shared classInfo module as the single source of class prose"
```

---

### Task 2: Schedule rows gain start, end, and infoKey

**Files:**
- Modify: `src/pages/Classes.jsx` (the `SCHEDULE` constant only)
- Modify: `src/lib/classInfo.test.js` (add the bidirectional invariants)

**Interfaces:**
- Consumes: `CLASS_INFO`, `getClassInfo` from Task 1
- Produces: `SCHEDULE` is exported from `src/pages/Classes.jsx` as a named export (it is currently module-private) so tests and `ClassCalendar` can consume it. Each of its 22 class objects now has `start` and `end` as `'HH:MM'` 24-hour strings and `infoKey` matching a `CLASS_INFO` key. `name`, `time`, `ages`, `ageGroups`, `category` are unchanged.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/classInfo.test.js`:

```js
import { SCHEDULE } from '../pages/Classes'

const ALL_ROWS = SCHEDULE.flatMap(({ day, classes }) =>
  classes.map((c) => ({ ...c, day }))
)

test('the schedule still has 22 class rows', () => {
  expect(ALL_ROWS).toHaveLength(22)
})

test('every schedule row resolves to prose via its infoKey', () => {
  for (const row of ALL_ROWS) {
    const info = getClassInfo(row.infoKey)
    expect(info, `${row.day} "${row.name}" has infoKey "${row.infoKey}" with no entry`).toBeDefined()
    expect(info.description.length).toBeGreaterThan(60)
  }
})

test('every classInfo entry is used by at least one schedule row', () => {
  const used = new Set(ALL_ROWS.map((r) => r.infoKey))
  const orphans = Object.keys(CLASS_INFO).filter((key) => !used.has(key))
  expect(orphans, 'copy exists for classes no longer on the schedule').toEqual([])
})

test('every row has 24-hour start and end on 15-minute boundaries', () => {
  for (const row of ALL_ROWS) {
    expect(row.start, `${row.name} start`).toMatch(/^\d{2}:\d{2}$/)
    expect(row.end, `${row.name} end`).toMatch(/^\d{2}:\d{2}$/)
    const [, startMin] = row.start.split(':').map(Number)
    const [, endMin] = row.end.split(':').map(Number)
    expect(startMin % 15, `${row.name} start not on a 15-min boundary`).toBe(0)
    expect(endMin % 15, `${row.name} end not on a 15-min boundary`).toBe(0)
  }
})

test('start and end agree with the flyer-verbatim time string', () => {
  // Guards the one real drift risk: editing `time` for a new semester and forgetting
  // `start`/`end`, which would leave the calendar positioning classes at the old hour.
  const to12h = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    const hour12 = h > 12 ? h - 12 : h
    return `${hour12}:${String(m).padStart(2, '0')}`
  }
  for (const row of ALL_ROWS) {
    expect(row.time, `${row.name} time vs start`).toContain(to12h(row.start))
    expect(row.time, `${row.name} time vs end`).toContain(to12h(row.end))
  }
})

test('every class runs inside the 5:00 PM to 9:00 PM grid window', () => {
  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
  }
  for (const row of ALL_ROWS) {
    expect(toMinutes(row.start), `${row.name} starts before 17:00`).toBeGreaterThanOrEqual(17 * 60)
    expect(toMinutes(row.end), `${row.name} ends after 21:00`).toBeLessThanOrEqual(21 * 60)
    expect(toMinutes(row.end), `${row.name} ends before it starts`).toBeGreaterThan(toMinutes(row.start))
  }
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/classInfo.test.js`
Expected: FAIL — `SCHEDULE` is not exported, so `ALL_ROWS` throws on `SCHEDULE.flatMap`.

- [ ] **Step 3: Export SCHEDULE and add the three fields**

In `src/pages/Classes.jsx`, change `const SCHEDULE = [` to `export const SCHEDULE = [` and replace the five day blocks with the following. Every `name`, `time`, `ages`, `ageGroups`, and `category` value is unchanged — only `start`, `end`, and `infoKey` are added.

```jsx
export const SCHEDULE = [
  {
    day: 'Monday',
    classes: [
      { name: 'Tiny Ballet / Tumble', time: '5:00 – 5:30 PM', start: '17:00', end: '17:30', infoKey: 'Tiny Ballet & Tumble', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Beginner Acro / Jazz', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Acro & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Beginner Contemp / Jazz', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Contemporary & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Beginner Hip Hop', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Beginner Hip Hop', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'hiphop' },
      { name: 'Acro / Lyrical', time: '6:15 – 7:15 PM', start: '18:15', end: '19:15', infoKey: 'Acro & Lyrical', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'lyrical-contemp' },
      { name: 'Ballet / Contemp', time: '7:15 – 8:00 PM', start: '19:15', end: '20:00', infoKey: 'Ballet & Contemporary', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Adult Femme / Flaire', time: '8:00 – 9:00 PM', start: '20:00', end: '21:00', infoKey: 'Adult Femme Flair', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
  {
    day: 'Tuesday',
    classes: [
      { name: 'Tiny Ballet / Hip Hop', time: '5:00 – 5:30 PM', start: '17:00', end: '17:30', infoKey: 'Tiny Ballet & Hip Hop', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Beginner Ballet / Hip Hop', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Ballet & Hip Hop', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Beginner Contemp / Jazz', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Beginner Contemporary & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Tumble Tech', time: '7:00 – 7:45 PM', start: '19:00', end: '19:45', infoKey: 'Tumble Tech', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
    ],
  },
  {
    day: 'Wednesday',
    classes: [
      { name: 'Tiny Ballet / Tap', time: '5:30 – 6:00 PM', start: '17:30', end: '18:00', infoKey: 'Tiny Ballet & Tap', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Beginner Hip Hop & Breakdancing', time: '6:00 – 6:45 PM', start: '18:00', end: '18:45', infoKey: 'Beginner Hip Hop & Breakdancing', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'hiphop' },
      { name: 'Musical Theatre', time: '6:45 – 7:30 PM', start: '18:45', end: '19:30', infoKey: 'Musical Theatre', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'musical-theatre' },
      { name: 'Adult Pom', time: '7:30 – 8:15 PM', start: '19:30', end: '20:15', infoKey: 'Adult Pom', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
  {
    day: 'Thursday',
    classes: [
      { name: 'Beginner Ballet / Jazz', time: '5:15 – 6:00 PM', start: '17:15', end: '18:00', infoKey: 'Beginner Ballet & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Beginner Ballet / Tap', time: '6:00 – 6:45 PM', start: '18:00', end: '18:45', infoKey: 'Beginner Ballet & Tap', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Pom Cheer', time: '6:45 – 7:15 PM', start: '18:45', end: '19:15', infoKey: 'Pom Cheer', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
      { name: 'Tumble', time: '7:15 – 8:00 PM', start: '19:15', end: '20:00', infoKey: 'Tumble', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
    ],
  },
  {
    day: 'Friday',
    classes: [
      { name: 'Beginner Ballet / Modern', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Ballet & Modern', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Lyrical / Contemp', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Lyrical & Contemporary', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'lyrical-contemp' },
      { name: 'Adult Contemporary', time: '7:00 – 8:00 PM', start: '19:00', end: '20:00', infoKey: 'Adult Contemporary', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
]
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/classInfo.test.js`
Expected: PASS — 11 tests.

- [ ] **Step 5: Confirm the page still renders**

Run: `npx vitest run src/pages/Classes.test.jsx`
Expected: PASS — 7 tests, unchanged. The page still renders its day lists; only data was added.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Classes.jsx src/lib/classInfo.test.js
git commit -m "feat: add start, end, and infoKey to schedule rows"
```

---

### Task 3: Point the two class pages at classInfo

**Files:**
- Modify: `src/pages/ClassLevels.jsx` (the `CLASS_GROUPS` constant and the card render)
- Modify: `src/pages/AdultClasses.jsx` (the `ADULT_CLASSES` constant and the card render)

**Interfaces:**
- Consumes: `getClassInfo(key)` from Task 1
- Produces: no new exports. After this task no class description or audience line exists anywhere except `src/lib/classInfo.js`.

**Acceptance criterion:** `ClassLevels.test.jsx` (9 tests) and `AdultClasses.test.jsx` (6 tests) must pass **unmodified**. They assert the rendered prose, so passing means no copy was lost or altered in the move. If you feel the urge to edit either test file, stop and report instead.

- [ ] **Step 1: Confirm the guard tests pass before you start**

Run: `npx vitest run src/pages/ClassLevels.test.jsx src/pages/AdultClasses.test.jsx`
Expected: PASS — 15 tests. This is your before-picture.

- [ ] **Step 2: Rewrite the ClassLevels group data**

In `src/pages/ClassLevels.jsx`, add the import:

```jsx
import { getClassInfo } from '../lib/classInfo'
```

Replace the whole `CLASS_GROUPS` constant with the name-only version below. The group titles, `ages`, and `intro` strings are unchanged; only the per-class prose is removed in favour of `infoKey` lookups.

```jsx
// Group structure and ordering follow the studio's copy. Prose for each class lives
// in src/lib/classInfo.js — the keys below index into it. There is deliberately no
// Advanced group, and the Adult Program moved to src/pages/AdultClasses.jsx.
const CLASS_GROUPS = [
  {
    title: 'Tiny Dancers',
    ages: 'Ages 2–5',
    intro: null,
    infoKeys: ['Tiny Ballet & Tumble', 'Tiny Ballet & Hip Hop', 'Tiny Ballet & Tap'],
  },
  {
    title: 'Beginner Program',
    ages: 'Ages 5+',
    intro: 'No previous dance experience required!',
    infoKeys: [
      'Beginner Ballet & Jazz',
      'Beginner Ballet & Hip Hop',
      'Beginner Ballet & Tap',
      'Beginner Ballet & Modern',
      'Beginner Acro & Jazz',
      'Beginner Contemporary & Jazz',
      'Beginner Hip Hop & Breakdancing',
      'Beginner Hip Hop',
    ],
  },
  {
    title: 'Intermediate & Technique Classes',
    ages: 'Ages 5+',
    intro: 'Perfect for dancers ready to continue developing their skills.',
    infoKeys: ['Acro & Lyrical', 'Ballet & Contemporary', 'Tumble Tech', 'Tumble', 'Lyrical & Contemporary'],
  },
  {
    title: 'Specialty Classes',
    ages: 'Ages 5+',
    intro: null,
    infoKeys: ['Musical Theatre', 'Pom Cheer'],
  },
]
```

- [ ] **Step 3: Render from the lookup**

In the same file, replace the inner `classes.map(...)` block with an `infoKeys.map(...)` that resolves prose. The surrounding `<section>`, eyebrow, `<h2 data-testid="group-title">`, and `intro` markup are unchanged, as is `ClassCard`'s own markup.

```jsx
            <div className="flex flex-col gap-3 mt-8">
              {infoKeys.map((key, i) => {
                const info = getClassInfo(key)
                return (
                  <ClassCard
                    key={key}
                    name={key}
                    audience={info.audience}
                    description={info.description}
                    accent={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                  />
                )
              })}
            </div>
```

Also change the destructure on the group map from `({ title, ages, intro, classes }, groupIndex)` to `({ title, ages, intro, infoKeys }, groupIndex)`.

- [ ] **Step 4: Verify ClassLevels is unchanged in behaviour**

Run: `npx vitest run src/pages/ClassLevels.test.jsx`
Expected: PASS — 9 tests, test file untouched.

- [ ] **Step 5: Rewrite the AdultClasses data**

In `src/pages/AdultClasses.jsx`, add the import:

```jsx
import { getClassInfo } from '../lib/classInfo'
```

Replace `ADULT_CLASSES` with the schedule-only version. Day and time still live here because they are not class prose.

```jsx
// Day and time mirror the Fall 2026 adult rows in Classes.jsx — update both together
// each semester. Prose lives in src/lib/classInfo.js, keyed by the names below.
const ADULT_CLASSES = [
  { infoKey: 'Adult Femme Flair', day: 'Monday', time: '8:00 – 9:00 PM' },
  { infoKey: 'Adult Pom', day: 'Wednesday', time: '7:30 – 8:15 PM' },
  { infoKey: 'Adult Contemporary', day: 'Friday', time: '7:00 – 8:00 PM' },
]
```

Then change the map over `ADULT_CLASSES` so it resolves prose. The card markup itself — every `data-testid` and class string — is unchanged:

```jsx
            {ADULT_CLASSES.map(({ infoKey, day, time }, i) => {
              const info = getClassInfo(infoKey)
              return (
                <div
                  key={infoKey}
                  data-testid="adult-class-card"
                  className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <div data-testid="adult-class-name" className="text-navy-dark font-bold text-base">
                      {infoKey}
                    </div>
                    <div data-testid="adult-class-when" className="text-[#7ab3e8] text-sm font-medium">
                      <span className="text-[#8a9aaa] text-xs font-bold uppercase tracking-wider">{day}</span>
                      {' · '}
                      <span className="whitespace-nowrap">{time}</span>
                    </div>
                  </div>
                  <p className="text-brand-red text-xs font-semibold mt-1">{info.audience}</p>
                  <p data-testid="adult-class-description" className="text-[#5a6a8a] text-sm mt-2 leading-relaxed">
                    {info.description}
                  </p>
                </div>
              )
            })}
```

- [ ] **Step 6: Verify both pages and lint**

Run: `npx vitest run src/pages/ClassLevels.test.jsx src/pages/AdultClasses.test.jsx`
Expected: PASS — 15 tests, both test files untouched.

Run: `npx eslint src/pages/ClassLevels.jsx src/pages/AdultClasses.jsx src/lib/classInfo.js`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/pages/ClassLevels.jsx src/pages/AdultClasses.jsx
git commit -m "refactor: read class prose from classInfo on both class pages"
```

---

### Task 4: Class detail panel

**Files:**
- Create: `src/components/ClassDetailPanel.jsx`
- Create: `src/components/ClassDetailPanel.test.jsx`

**Interfaces:**
- Consumes: `getClassInfo(key)` from Task 1
- Produces: default export `ClassDetailPanel({ classInfo, onClose })` where `classInfo` is `{ name, day, time, ages, infoKey }` (a schedule row plus its day) or `null`. Renders nothing when `null`. Calls `onClose()` on Escape, backdrop click, and the Close button. Task 5 renders it and owns the state.

- [ ] **Step 1: Write the failing test**

Create `src/components/ClassDetailPanel.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import ClassDetailPanel from './ClassDetailPanel'

const ROW = {
  name: 'Beginner Acro / Jazz',
  day: 'Monday',
  time: '5:30 – 6:15 PM',
  ages: 'Ages 5+ · Beginner',
  infoKey: 'Beginner Acro & Jazz',
}

function renderPanel(props = {}) {
  const onClose = props.onClose || (() => {})
  const utils = render(<ClassDetailPanel classInfo={ROW} onClose={onClose} {...props} />)
  return { ...utils, onClose }
}

test('renders nothing when no class is selected', () => {
  const { container } = render(<ClassDetailPanel classInfo={null} onClose={() => {}} />)
  expect(container).toBeEmptyDOMElement()
})

test('shows the class name, day, time, ages, and prose', () => {
  renderPanel()
  expect(screen.getByRole('heading', { name: 'Beginner Acro / Jazz' })).toBeInTheDocument()
  expect(screen.getByText(/Monday/)).toBeInTheDocument()
  expect(screen.getByText(/5:30 – 6:15 PM/)).toBeInTheDocument()
  expect(screen.getByText('Ages 5+ · Beginner')).toBeInTheDocument()
  expect(screen.getByText('Great for energetic kids who love to flip and tumble.')).toBeInTheDocument()
  expect(screen.getByText(/A high-energy class introducing dancers/)).toBeInTheDocument()
})

test('is an accessible modal dialog labelled by the class name', () => {
  renderPanel()
  const dialog = screen.getByRole('dialog')
  expect(dialog).toHaveAttribute('aria-modal', 'true')
  expect(dialog).toHaveAccessibleName('Beginner Acro / Jazz')
})

test('registration button opens the portal in a new tab', () => {
  renderPanel()
  const register = screen.getByRole('link', { name: 'Register for Fall →' })
  expect(register).toHaveAttribute('href', 'https://studio.capitalcoredance.com/register/classes')
  expect(register).toHaveAttribute('target', '_blank')
  expect(register).toHaveAttribute('rel', 'noopener noreferrer')
})

test('Escape closes the panel', () => {
  const onClose = vi.fn()
  renderPanel({ onClose })
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('the Close button closes the panel', () => {
  const onClose = vi.fn()
  renderPanel({ onClose })
  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('clicking the backdrop closes the panel but clicking inside does not', () => {
  const onClose = vi.fn()
  renderPanel({ onClose })
  fireEvent.click(screen.getByTestId('panel-backdrop'))
  expect(onClose).toHaveBeenCalledTimes(1)

  fireEvent.click(screen.getByRole('dialog'))
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('falls back gracefully when a class has no prose entry', () => {
  render(
    <ClassDetailPanel
      classInfo={{ ...ROW, infoKey: 'Nonexistent Class' }}
      onClose={() => {}}
    />
  )
  // The name, day, and time still come from the schedule row, so the panel is useful
  // even if a future schedule row is added before its copy is written.
  expect(screen.getByRole('heading', { name: 'Beginner Acro / Jazz' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Register for Fall →' })).toBeInTheDocument()
})
```

`vi` is available as a Vitest global (`globals: true` in `vite.config.js`) — no import needed.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ClassDetailPanel.test.jsx`
Expected: FAIL — `Failed to resolve import "./ClassDetailPanel"`.

- [ ] **Step 3: Write the component**

Create `src/components/ClassDetailPanel.jsx`:

```jsx
import { useEffect, useRef } from 'react'
import { getClassInfo } from '../lib/classInfo'

const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

// Detail dialog for one class on the schedule. `classInfo` is a schedule row plus the
// day it falls on; null means nothing is selected and the panel renders nothing.
export default function ClassDetailPanel({ classInfo, onClose }) {
  const headingId = 'class-detail-heading'
  const closeRef = useRef(null)

  useEffect(() => {
    if (!classInfo) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [classInfo, onClose])

  // Move focus into the dialog when it opens so keyboard users are not left behind on
  // the block they activated.
  useEffect(() => {
    if (classInfo) closeRef.current?.focus()
  }, [classInfo])

  if (!classInfo) return null

  const { name, day, time, ages, infoKey } = classInfo
  const info = getClassInfo(infoKey)

  return (
    <div
      data-testid="panel-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            {day} · {time}
          </p>
          <h2 id={headingId} className="text-navy-dark text-xl font-black">
            {name}
          </h2>
          <p className="text-[#5a6a8a] text-sm mt-1">{ages}</p>

          {info && (
            <>
              <p className="text-brand-red text-xs font-semibold mt-4">{info.audience}</p>
              <p className="text-[#5a6a8a] text-sm mt-2 leading-relaxed">{info.description}</p>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-surface-border bg-surface-light">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="text-[#8a9aaa] text-sm font-semibold hover:text-navy-dark transition-colors"
          >
            Close
          </button>
          <a
            href={PORTAL_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-navy-dark text-white text-sm font-bold px-5 py-2 rounded-md hover:bg-navy-mid transition-colors"
          >
            Register for Fall →
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ClassDetailPanel.test.jsx`
Expected: PASS — 8 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/ClassDetailPanel.jsx src/components/ClassDetailPanel.test.jsx
git commit -m "feat: add class detail panel with escape and backdrop close"
```

---

### Task 5: Week calendar component

**Files:**
- Create: `src/components/ClassCalendar.jsx`
- Create: `src/components/ClassCalendar.test.jsx`

**Interfaces:**
- Consumes: `ClassDetailPanel` from Task 4; `SCHEDULE` shape from Task 2 (`{ day, classes: [{ name, time, start, end, infoKey, ages, ageGroups, category }] }`)
- Produces: default export `ClassCalendar({ schedule })` where `schedule` is an already-filtered array in `SCHEDULE`'s shape. The component does no filtering itself — the page filters and passes the result. Also exports `clusterByOverlap(classes)` for direct testing.

Layout contract, relied on by the tests:
- Grid container `data-testid="class-grid"`, mobile list container `data-testid="class-list"`
- Each grid block: `data-testid="class-block"`, plus `data-start-slot`, `data-span`, `data-cluster-size`, `data-cluster-index`
- Each list card: `data-testid="class-list-item"`
- 16 slots of 15 minutes from 17:00; slot height 22px

- [ ] **Step 1: Write the failing test**

Create `src/components/ClassCalendar.test.jsx`:

```jsx
import { render, screen, fireEvent, within } from '@testing-library/react'
import ClassCalendar, { clusterByOverlap } from './ClassCalendar'
import { SCHEDULE } from '../pages/Classes'

function renderCalendar(schedule = SCHEDULE) {
  return render(<ClassCalendar schedule={schedule} />)
}

const MONDAY = SCHEDULE.find((d) => d.day === 'Monday').classes

test('clusterByOverlap puts concurrent classes in one cluster and sequential ones apart', () => {
  const clusters = clusterByOverlap(MONDAY)
  const names = clusters.map((c) => c.map((x) => x.name))
  expect(names).toEqual([
    ['Tiny Ballet / Tumble'],
    ['Beginner Acro / Jazz', 'Beginner Contemp / Jazz'],
    ['Beginner Hip Hop', 'Acro / Lyrical'],
    ['Ballet / Contemp'],
    ['Adult Femme / Flaire'],
  ])
})

test('clusterByOverlap treats a class ending exactly when the next starts as sequential', () => {
  // Tiny ends 17:30 and Beginner Acro starts 17:30 — back to back, not overlapping.
  const clusters = clusterByOverlap([MONDAY[0], MONDAY[1]])
  expect(clusters).toHaveLength(2)
})

test('renders every class in both the grid and the mobile list', () => {
  renderCalendar()
  expect(screen.getAllByTestId('class-block')).toHaveLength(22)
  expect(screen.getAllByTestId('class-list-item')).toHaveLength(22)
})

test('block height encodes duration', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  const block = (name) =>
    within(grid).getByRole('button', { name: new RegExp(name.replace(/[/]/g, '\\/')) })

  // 30-minute class spans 2 slots, 45-minute spans 3, 60-minute spans 4.
  expect(block('Tiny Ballet / Tumble')).toHaveAttribute('data-span', '2')
  expect(block('Beginner Acro / Jazz')).toHaveAttribute('data-span', '3')
  expect(block('Acro / Lyrical')).toHaveAttribute('data-span', '4')
})

test('block start slot is measured from 5:00 PM', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  // 17:00 is slot 0; Thursday's 17:15 start is slot 1; 20:00 is slot 12.
  expect(within(grid).getByRole('button', { name: /Tiny Ballet \/ Tumble/ })).toHaveAttribute('data-start-slot', '0')
  expect(within(grid).getByRole('button', { name: /Beginner Ballet \/ Jazz/ })).toHaveAttribute('data-start-slot', '1')
  expect(within(grid).getByRole('button', { name: /Adult Femme \/ Flaire/ })).toHaveAttribute('data-start-slot', '12')
})

test('concurrent Monday classes render side by side, not stacked', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  const acro = within(grid).getByRole('button', { name: /Beginner Acro \/ Jazz/ })
  const contemp = within(grid).getByRole('button', { name: /Beginner Contemp \/ Jazz/ })

  expect(acro).toHaveAttribute('data-cluster-size', '2')
  expect(contemp).toHaveAttribute('data-cluster-size', '2')
  expect(acro).toHaveAttribute('data-cluster-index', '0')
  expect(contemp).toHaveAttribute('data-cluster-index', '1')
  // Same rows, different horizontal offsets — that is what "side by side" means here.
  expect(acro.getAttribute('data-start-slot')).toBe(contemp.getAttribute('data-start-slot'))
  expect(acro.style.left).not.toBe(contemp.style.left)
})

test('a class with no concurrent neighbour spans the full day column', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  const solo = within(grid).getByRole('button', { name: /Adult Femme \/ Flaire/ })
  expect(solo).toHaveAttribute('data-cluster-size', '1')
  expect(solo.style.left).toBe('0%')
  expect(solo.style.width).toBe('100%')
})

test('each block names its class, day, and time for screen readers', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  expect(
    within(grid).getByRole('button', { name: 'Tumble Tech, Tuesday 7:00 – 7:45 PM' })
  ).toBeInTheDocument()
})

test('renders all five weekday column headers', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
    expect(within(grid).getByText(day)).toBeInTheDocument()
  }
})

test('renders the time gutter every half hour from 5:00 to 9:00', () => {
  renderCalendar()
  const labels = screen.getAllByTestId('time-label').map((el) => el.textContent.trim())
  expect(labels).toEqual([
    '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00',
  ])
})

test('clicking a block opens its detail panel; Escape closes it and restores focus', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  const block = within(grid).getByRole('button', { name: /Musical Theatre/ })

  fireEvent.click(block)
  const dialog = screen.getByRole('dialog')
  expect(within(dialog).getByRole('heading', { name: 'Musical Theatre' })).toBeInTheDocument()
  expect(within(dialog).getByText(/Wednesday/)).toBeInTheDocument()

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(document.activeElement).toBe(block)
})

test('clicking a mobile list card opens the same panel', () => {
  renderCalendar()
  const list = screen.getByTestId('class-list')
  fireEvent.click(within(list).getByRole('button', { name: /Adult Pom/ }))
  expect(screen.getByRole('heading', { name: 'Adult Pom' })).toBeInTheDocument()
})

test('renders only what it is given', () => {
  const oneDay = [SCHEDULE.find((d) => d.day === 'Friday')]
  renderCalendar(oneDay)
  expect(screen.getAllByTestId('class-block')).toHaveLength(3)
})

test('shows an empty state when handed nothing', () => {
  renderCalendar([])
  expect(screen.getByText('No classes match your filters. Try adjusting your selection.')).toBeInTheDocument()
  expect(screen.queryByTestId('class-grid')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ClassCalendar.test.jsx`
Expected: FAIL — `Failed to resolve import "./ClassCalendar"`.

- [ ] **Step 3: Write the component**

Create `src/components/ClassCalendar.jsx`:

```jsx
import { useRef, useState } from 'react'
import ClassDetailPanel from './ClassDetailPanel'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// The Fall schedule runs 5:00–9:00 PM. Sixteen 15-minute slots cover it, and every
// class time in the schedule falls on a 15-minute boundary (a test enforces this).
const GRID_START_MINUTES = 17 * 60
const GRID_END_MINUTES = 21 * 60
const SLOT_MINUTES = 15
const SLOT_PX = 22
const TOTAL_SLOTS = (GRID_END_MINUTES - GRID_START_MINUTES) / SLOT_MINUTES

// One accent per dance style so a style reads the same colour across the week. Only
// the four accents already used elsewhere on the site are available, so the eight
// categories share them in pairs — the point is that a given style is consistent, not
// that every style is unique. Do not introduce new colour values here.
const CATEGORY_ACCENTS = {
  tiny: 'border-l-[#f4a8b4]',
  'musical-theatre': 'border-l-[#f4a8b4]',
  ballet: 'border-l-[#7ab3e8]',
  'lyrical-contemp': 'border-l-[#7ab3e8]',
  'jazz-acro': 'border-l-[#f4a060]',
  hiphop: 'border-l-[#f4a060]',
  'tumble-cheer': 'border-l-brand-red',
  adult: 'border-l-navy-mid',
}

const BLOCK_BASE = 'bg-white border border-surface-border border-l-4 text-navy-dark'

function toMinutes(hhmm) {
  const [hours, minutes] = hhmm.split(':').map(Number)
  return hours * 60 + minutes
}

// Group a day's classes into clusters of mutually overlapping classes. Each cluster is
// rendered as equal-width side-by-side columns so concurrent classes never cover each
// other. A class ending exactly when the next starts is sequential, not overlapping.
export function clusterByOverlap(classes) {
  const sorted = [...classes].sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
  const clusters = []
  for (const cls of sorted) {
    const current = clusters[clusters.length - 1]
    const overlaps = current?.some((c) => toMinutes(c.end) > toMinutes(cls.start))
    if (overlaps) current.push(cls)
    else clusters.push([cls])
  }
  return clusters
}

function slotsFor(cls) {
  const start = toMinutes(cls.start)
  const end = toMinutes(cls.end)
  return {
    startSlot: (start - GRID_START_MINUTES) / SLOT_MINUTES,
    span: (end - start) / SLOT_MINUTES,
  }
}

function timeLabels() {
  const labels = []
  for (let m = GRID_START_MINUTES; m <= GRID_END_MINUTES; m += 30) {
    const hour = Math.floor(m / 60)
    const minute = m % 60
    const hour12 = hour > 12 ? hour - 12 : hour
    labels.push({
      key: `${hour}:${minute}`,
      text: `${hour12}:${String(minute).padStart(2, '0')}`,
      slot: (m - GRID_START_MINUTES) / SLOT_MINUTES,
    })
  }
  return labels
}

export default function ClassCalendar({ schedule }) {
  const [selected, setSelected] = useState(null)
  const lastTriggerRef = useRef(null)

  function openClass(cls, day, event) {
    lastTriggerRef.current = event.currentTarget
    setSelected({ ...cls, day })
  }

  function closePanel() {
    setSelected(null)
    // Return focus to the block that opened the panel; without this, closing drops
    // focus to <body> and a keyboard user restarts at the top of the document.
    lastTriggerRef.current?.focus()
  }

  if (schedule.length === 0) {
    return (
      <div className="border border-dashed border-surface-border rounded-lg px-6 py-10 text-center">
        <p className="text-[#8a9aaa] text-sm">No classes match your filters. Try adjusting your selection.</p>
      </div>
    )
  }

  const byDay = DAY_ORDER.map((day) => ({
    day,
    classes: schedule.find((d) => d.day === day)?.classes || [],
  }))
  const gridHeight = TOTAL_SLOTS * SLOT_PX

  return (
    <>
      {/* Desktop week grid */}
      <div data-testid="class-grid" className="hidden md:block">
        <div className="flex">
          <div className="w-12 flex-shrink-0" />
          {byDay.map(({ day }) => (
            <div
              key={day}
              className="flex-1 text-center text-navy-dark text-xs font-black uppercase tracking-wider pb-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Time gutter */}
          <div className="w-12 flex-shrink-0 relative" style={{ height: gridHeight }}>
            {timeLabels().map(({ key, text, slot }) => (
              <div
                key={key}
                data-testid="time-label"
                className="absolute right-2 text-[#8a9aaa] text-[10px] font-semibold -translate-y-1/2"
                style={{ top: slot * SLOT_PX }}
              >
                {text}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {byDay.map(({ day, classes }) => (
            <div
              key={day}
              className="flex-1 relative border-l border-surface-border"
              style={{ height: gridHeight }}
            >
              {timeLabels().map(({ key, slot }) => (
                <div
                  key={key}
                  className="absolute left-0 right-0 border-t border-surface-border"
                  style={{ top: slot * SLOT_PX }}
                />
              ))}

              {clusterByOverlap(classes).map((cluster) =>
                cluster.map((cls, index) => {
                  const { startSlot, span } = slotsFor(cls)
                  const width = 100 / cluster.length
                  return (
                    <button
                      key={`${cls.name}-${cls.start}`}
                      type="button"
                      data-testid="class-block"
                      data-start-slot={startSlot}
                      data-span={span}
                      data-cluster-size={cluster.length}
                      data-cluster-index={index}
                      onClick={(e) => openClass(cls, day, e)}
                      aria-label={`${cls.name}, ${day} ${cls.time}`}
                      className={`absolute rounded px-1.5 py-1 text-left overflow-hidden hover:bg-surface-light focus:outline-none focus:ring-2 focus:ring-navy-dark ${BLOCK_BASE} ${CATEGORY_ACCENTS[cls.category] || CATEGORY_ACCENTS.adult}`}
                      style={{
                        top: startSlot * SLOT_PX + 1,
                        height: span * SLOT_PX - 2,
                        left: `${index * width}%`,
                        width: `${width}%`,
                      }}
                    >
                      <span className="block text-[10px] font-bold leading-tight">{cls.name}</span>
                      <span className="block text-[9px] opacity-75 leading-tight">{cls.time}</span>
                    </button>
                  )
                })
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile day list */}
      <div data-testid="class-list" className="md:hidden flex flex-col gap-8">
        {byDay
          .filter(({ classes }) => classes.length > 0)
          .map(({ day, classes }) => (
            <div key={day}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-navy-dark font-black text-lg">{day}</div>
                <div className="flex-1 h-px bg-surface-border" />
              </div>
              <div className="flex flex-col gap-3">
                {classes.map((cls) => (
                  <button
                    key={`${cls.name}-${cls.start}`}
                    type="button"
                    data-testid="class-list-item"
                    onClick={(e) => openClass(cls, day, e)}
                    aria-label={`${cls.name}, ${day} ${cls.time}`}
                    className={`w-full rounded-lg px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-surface-light transition-colors ${BLOCK_BASE} ${CATEGORY_ACCENTS[cls.category] || CATEGORY_ACCENTS.adult}`}
                  >
                    <span className="flex-1 min-w-0">
                      <span className="block font-bold text-base">{cls.name}</span>
                      <span className="block text-[#5a6a8a] text-sm mt-0.5">{cls.ages}</span>
                    </span>
                    <span className="text-[#7ab3e8] text-sm font-medium flex-shrink-0">{cls.time}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>

      <ClassDetailPanel classInfo={selected} onClose={closePanel} />
    </>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ClassCalendar.test.jsx`
Expected: PASS — 14 tests.

If `clicking a block opens its detail panel; Escape closes it and restores focus` fails on the focus assertion, the cause is `ClassDetailPanel` focusing its Close button on open (Task 4, by design) and `closePanel` not restoring afterwards — verify `lastTriggerRef.current?.focus()` runs after `setSelected(null)`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ClassCalendar.jsx src/components/ClassCalendar.test.jsx
git commit -m "feat: add week calendar with overlap clustering and mobile list"
```

---

### Task 6: Wire the calendar into the Classes page

**Files:**
- Modify: `src/pages/Classes.jsx` (imports, state, filter bar, schedule section)
- Modify: `src/pages/Classes.test.jsx` (filter assertions; remove the day-filter test)

**Interfaces:**
- Consumes: `ClassCalendar` from Task 5; `SCHEDULE` as already exported in Task 2
- Produces: no new exports. `selectedDay` state, the `DAYS` constant, and the Day `FilterSelect` are gone.

- [ ] **Step 1: Update the page tests**

In `src/pages/Classes.test.jsx`, replace the filter-bar test and delete the day-filter test. The other five tests stay, except that class-name lookups must be scoped — the grid and the mobile list both render in jsdom, so each class name appears twice.

Replace:

```jsx
test('renders filter bar with day, age, and style filters', () => {
  renderClasses()
  // Day, Age Group, and Dance Style are <select> dropdowns
  expect(screen.getAllByRole('combobox')).toHaveLength(3)
  expect(screen.getByRole('option', { name: 'Tiny (2–5)' })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: 'Hip Hop' })).toBeInTheDocument()
})

test('day filter shows only selected day', () => {
  renderClasses()
  const [daySelect] = screen.getAllByRole('combobox')
  fireEvent.change(daySelect, { target: { value: 'Wednesday' } })
  expect(screen.getByText('Wednesday', { selector: 'div' })).toBeInTheDocument()
  expect(screen.queryByText('Monday', { selector: 'div' })).not.toBeInTheDocument()
})
```

with:

```jsx
test('renders filter bar with age and style filters', () => {
  renderClasses()
  // The Day dropdown was removed when the schedule became a week calendar — a week
  // view already shows every day.
  expect(screen.getAllByRole('combobox')).toHaveLength(2)
  expect(screen.getByRole('option', { name: 'Tiny (2–5)' })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: 'Hip Hop' })).toBeInTheDocument()
  expect(screen.queryByRole('option', { name: 'All Days' })).not.toBeInTheDocument()
})

test('style filter narrows the calendar to matching classes', () => {
  renderClasses()
  const grid = screen.getByTestId('class-grid')
  expect(within(grid).getAllByTestId('class-block')).toHaveLength(22)

  const [, styleSelect] = screen.getAllByRole('combobox')
  fireEvent.change(styleSelect, { target: { value: 'hiphop' } })

  // Only two rows carry category 'hiphop': Monday's Beginner Hip Hop and Wednesday's
  // Beginner Hip Hop & Breakdancing. Tiny Ballet / Hip Hop is category 'tiny' and
  // Beginner Ballet / Hip Hop is category 'ballet', so neither is included.
  const blocks = within(screen.getByTestId('class-grid')).getAllByTestId('class-block')
  expect(blocks).toHaveLength(2)
  for (const block of blocks) {
    expect(block.getAttribute('aria-label')).toMatch(/Hip Hop/)
  }
})

test('age filter narrows the calendar to matching classes', () => {
  renderClasses()
  const [ageSelect] = screen.getAllByRole('combobox')
  fireEvent.change(ageSelect, { target: { value: 'adult' } })
  const blocks = within(screen.getByTestId('class-grid')).getAllByTestId('class-block')
  expect(blocks).toHaveLength(3)
})

test('a filter combination with no classes shows the empty state', () => {
  renderClasses()
  const [ageSelect, styleSelect] = screen.getAllByRole('combobox')
  fireEvent.change(ageSelect, { target: { value: 'tiny' } })
  fireEvent.change(styleSelect, { target: { value: 'musical-theatre' } })
  expect(
    screen.getByText('No classes match your filters. Try adjusting your selection.')
  ).toBeInTheDocument()
})
```

Update the import at the top of the file to add `within`:

```jsx
import { render, screen, fireEvent, within } from '@testing-library/react'
```

And scope the existing class-name test, which otherwise finds each name twice:

```jsx
test('renders real class names', () => {
  renderClasses()
  const grid = screen.getByTestId('class-grid')
  expect(within(grid).getByRole('button', { name: /Tiny Ballet \/ Tumble/ })).toBeInTheDocument()
  expect(within(grid).getByRole('button', { name: /Beginner Hip Hop & Breakdancing/ })).toBeInTheDocument()
  expect(within(grid).getByRole('button', { name: /Musical Theatre/ })).toBeInTheDocument()
  expect(within(grid).getByRole('button', { name: /Tumble Tech/ })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/Classes.test.jsx`
Expected: FAIL — 3 comboboxes still render and there is no `class-grid` testid yet.

- [ ] **Step 3: Rewire the page**

In `src/pages/Classes.jsx`:

Add the import beside the other component imports:

```jsx
import ClassCalendar from '../components/ClassCalendar'
```

Delete the `DAYS` constant (`const DAYS = ['All', 'Monday', ...]`) and the `ACCENT_COLORS` constant — neither is used once the day lists are gone. Keep `AGES`, `CATEGORIES`, `FilterSelect`, `DANCE_STYLES`, `CLASSES_JSON_LD`, and `PORTAL_REGISTER_URL`.

Replace the component body's state and filtering:

```jsx
export default function Classes() {
  const [selectedAge, setSelectedAge] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredSchedule = SCHEDULE
    .map(({ day, classes }) => ({
      day,
      classes: classes.filter((c) => {
        const ageMatch = selectedAge === 'All' || c.ageGroups.includes(selectedAge)
        const catMatch = selectedCategory === 'All' || c.category === selectedCategory
        return ageMatch && catMatch
      }),
    }))
    .filter(({ classes }) => classes.length > 0)
```

Delete the `hasResults` line — `ClassCalendar` owns the empty state now.

In the filter bar, drop the Day select and make the grid two columns:

```jsx
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FilterSelect label="Age Group" options={AGES} value={selectedAge} onChange={setSelectedAge} />
            <FilterSelect label="Dance Style" options={CATEGORIES} value={selectedCategory} onChange={setSelectedCategory} />
          </div>
```

Replace everything from `{!hasResults ? (` through its closing `)}` — the whole conditional with the day-group lists inside it — with:

```jsx
          <ClassCalendar schedule={filteredSchedule} />
```

Leave the `<p>` footer note, the `Enroll Now` link, `SEO`, `PageHeader`, hero photos, and register banner exactly as they are.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/pages/Classes.test.jsx`
Expected: PASS — 8 tests.

- [ ] **Step 5: Run the full suite and lint**

Run: `npx vitest run`
Expected: exactly 2 failures, both in `src/pages/Camps.test.jsx`. Everything else green.

Run: `npx eslint src/pages/Classes.jsx src/components/ClassCalendar.jsx src/components/ClassDetailPanel.jsx src/lib/classInfo.js`
Expected: no output.

- [ ] **Step 6: Confirm the production build**

Run: `npm run build`
Expected: `✓ built in …` with no errors. The 500 kB chunk-size warning is pre-existing.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Classes.jsx src/pages/Classes.test.jsx
git commit -m "feat: render the class schedule as an interactive week calendar"
```

---

### Task 7: Verify in the browser

**Files:** none — verification only.

- [ ] **Step 1: Start the dev server**

Run in the background: `npm run dev`
Expected: Vite serves `http://localhost:5173/`. If the port is taken, use the one printed.

- [ ] **Step 2: Check the grid at desktop width**

Load `http://localhost:5173/classes` at ≥1024px wide.
Expected: five day columns, a time gutter reading 5:00 through 9:00, blocks whose heights differ visibly by duration — Acro / Lyrical (60 min) roughly twice the height of Tiny Ballet / Tumble (30 min). No console errors.

- [ ] **Step 3: Confirm Monday's overlaps sit side by side**

Look at Monday 5:30 and Monday 6:15.
Expected: Beginner Acro / Jazz and Beginner Contemp / Jazz each occupy half the Monday column at 5:30, neither hidden behind the other. At 6:15, Beginner Hip Hop and Acro / Lyrical likewise share the width, with Acro / Lyrical extending 15 minutes lower. **If either pair renders stacked or one is invisible, stop and report — that is the core feature failing.**

- [ ] **Step 4: Open a class and register**

Click Musical Theatre.
Expected: the panel shows Wednesday · 6:45 – 7:30 PM, Ages 5+, its audience line and description, Close, and Register for Fall →. Press Escape: it closes and focus visibly returns to the Musical Theatre block. Re-open and click the backdrop: it closes.

- [ ] **Step 5: Check the filters**

Set Dance Style to Hip Hop.
Expected: only the three hip hop classes remain; the grid keeps its full 5:00–9:00 height rather than collapsing. Set Age Group to Tiny (2–5) with Musical Theatre style selected: the empty-state message appears.

- [ ] **Step 6: Check mobile at 390px**

Note `resize_window` does not change the rendered viewport in this environment; mount the page in a 390px-wide iframe instead.
Expected: no grid, the day-grouped list, cards tappable and opening the same panel, no horizontal page scroll.

- [ ] **Step 7: Report**

Report what rendered, the overlap result specifically, and any console errors. Do not commit — this task changes no files.

---

## Post-implementation notes

- The three in-house drafted descriptions (`Beginner Hip Hop`, `Tumble`,
  `Lyrical & Contemporary`) and all 21 audience lines still await studio review. They now
  live in one place: `src/lib/classInfo.js`.
- Per-class registration links remain impossible until `dancestudioportal` accepts a
  class parameter on `/register/classes`. The panel's button goes to the generic form.
- Each semester, three things move together per class: `time`, `start`/`end`, and the
  day/time duplicated in `AdultClasses.jsx`. The `start`/`end`-vs-`time` test catches two
  of the three; the adult page has its own test for the third.

---

## Outcome (2026-08-03)

**Shipped.** Commits `55c2510`, `dd578e6`, `53629ad`, `c1b3014`, `106e129`, `c66c78d`,
`743c818`, `258c282`, `3b80669`. Suite went 88 → 117 passing, with the same 2 pre-existing
`Camps.test.jsx` failures throughout.

Deviations from this plan, all deliberate:

- **`SCHEDULE` lives in `src/lib/schedule.js`, not exported from the page.** The plan had it
  exported from `Classes.jsx` with a `react-refresh` eslint-disable. The repo's own documented
  precedent (`src/lib/adultSeries.js:1-3`) says constants belong in `lib/` for exactly this
  reason, so the final review had it hoisted.
- **Adult day/time is derived from `SCHEDULE`**, not hand-copied into `AdultClasses.jsx`. The
  plan's duplicate would have drifted silently: a correct schedule-only edit left every test
  green while `/adult-classes` advertised the old time.
- **Block colours** map the eight categories onto the four existing accents rather than the
  eight tinted palettes an earlier draft of this plan invented.
- **The Monday-overlap test is anchored to `, Monday`.** As written here it was ambiguous —
  `Beginner Contemp / Jazz` runs on both Monday and Tuesday, so the query matched two blocks.

### Needs Chanel — three Claude-drafted lines

1. **`Acro & Lyrical`: "Ideal for dancers with tumbling experience who love to perform."**
   This narrows eligibility in a way the schedule does not — that row is plain `Ages 5+` with
   no prerequisite, and the studio's own note says placement is instructor-*recommended*, not
   gated. Could cost a registration. Needs sign-off or removal.
2. **`Tumble`: "with proper spotting and progressions."** An operational/safety claim rather
   than a description. Drop the clause if the studio can't stand behind that wording.
3. All 21 `audience` lines open with "Perfect for" / "Great for" / "Ideal for". Worth varying.

Plus the three `draft: true` descriptions (`Beginner Hip Hop`, `Tumble`,
`Lyrical & Contemporary`) still await studio copy. All of the above live in
`src/lib/classInfo.js`.

### Rolling to a new semester

Per class, these must move together — `time`, `start`, `end` in `src/lib/schedule.js`. A
test asserts `time` contains the 12-hour rendering of both `start` and `end` and bounds them
to 17:00–21:00 on 15-minute boundaries, so a partial edit fails loudly. Adult day/time is now
derived, so it can't drift.

Unguarded, check by hand: the flyer comment and `Fall 2026` / date strings in the SEO title,
description, and visible eyebrow on `Classes.jsx`; `AdultClasses.jsx`'s "between 7:00 and
9:00 PM" line; and `GRID_START_MINUTES`/`GRID_END_MINUTES` in `ClassCalendar.jsx` — a class
outside 17:00–21:00 fails the test but needs the constants widened, not the data changed.

### Deferred, with reasons

- **Dialog page-inertness.** The Tab cycle between Close and Register is in place, but the
  background is not `inert`/`aria-hidden` because the dialog is a same-tree sibling rather
  than portaled. Closing that needs a `createPortal` restructure. Residual gap is
  assistive-tech browse mode only, and it predates this work.
- No `role="grid"`/header association on the time grid. Every block's accessible name carries
  its own day and full time range, so nothing is lost versus the old list; a visually-hidden
  per-day heading plus a `ul`/`li` wrapper is the cheap future win.
- `getClassInfo` still returns `undefined` for an unknown key; call sites now use optional
  chaining, so a bad key costs a paragraph rather than the page.
- `headingId` is a fixed string (one dialog at a time, so no collision possible today).
- No day-column overflow guard — a class past 21:00 would render below the column edge. The
  test bounds it; the consequence is cosmetic.
