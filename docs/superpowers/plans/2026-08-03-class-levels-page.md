# Class Levels Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/class-levels` page that explains the six class levels and describes each dance style, reachable from a new dropdown under "Classes" in the top nav.

**Architecture:** One new page component (`src/pages/ClassLevels.jsx`) holding its copy in two constants at the top of the file, following the `SCHEDULE`-at-top-of-`Classes.jsx` convention already in this repo. `src/components/Navbar.jsx` gains optional `children` on nav links, rendering a desktop hover/caret dropdown and indented mobile sub-links. No changes to the Fall schedule, its filters, or `src/lib/schema.js`.

**Tech Stack:** Vite 8 · React 19 · react-router-dom 7 · Tailwind 3 · Vitest 4 + jsdom + Testing Library

**Spec:** `docs/superpowers/specs/2026-08-03-class-levels-page-design.md`

## Global Constraints

- Branch is `feat/class-levels-page`, already created off `master`. Do not push. Commit per task as the steps specify.
- Test command is `npx vitest run <file>` for a single file, `npm test -- --run` for everything. `npm test` alone starts watch mode — do not leave it running.
- Baseline before any change: `npx vitest run src/pages/Classes.test.jsx src/components/Navbar.test.jsx` → 2 files, 11 tests passing. The four existing Navbar tests and all seven Classes tests MUST still pass at the end.
- **The full suite is already red on `master`** — measured 2026-08-03: 10 files, 45 tests, **6 pre-existing failures** in `src/pages/Birthdays.test.jsx` (3), `src/pages/Camps.test.jsx` (2), and `src/pages/BirthdayForm.test.jsx` (1). These are unrelated to this feature — `Camps` is a retired route and those pages drifted from their tests. Do **not** fix them here and do not treat them as a regression. The bar for this plan is: exactly those 6 fail, nothing else, and the new + touched files are green.
- Do not modify `SCHEDULE`, `DANCE_STYLES`, `CATEGORIES`, `AGES`, or `DAYS` in `src/pages/Classes.jsx`. The schedule stays verbatim from the studio flyer.
- Do not modify `src/lib/schema.js`.
- Reuse existing Tailwind tokens only — no new colors. Available: `navy-dark` `#0d1b36`, `navy-mid` `#1e3a6e`, `brand-red` `#c0392b`, `surface-light` `#f4f6fa`, `surface-border` `#e0e6f0`, and the literal accents `#7ab3e8` (blue), `#f4a8b4` (pink), `#f4a060` (orange), `#5a6a8a` (body text), `#8a9aaa` (muted text), `#b8d4f0` (nav text).
- All draft copy in this plan is a placeholder for Chanel to replace. Copy it **verbatim** — do not improve, expand, or add claims about curriculum, instructors, placement, or outcomes.
- En dashes (`–`) in age ranges and em dashes (`—`) in prose are intentional. Preserve them exactly; do not substitute hyphens.
- The portal URL is `https://studio.capitalcoredance.com/register/classes` — the same value as `PORTAL_REGISTER_URL` in `Classes.jsx`. Redeclare it in the new page; do not extract a shared module (out of scope).

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/pages/ClassLevels.jsx` | Create | The page: `LEVELS` + `STYLES` copy constants, level card grid, style card list, CTA, SEO |
| `src/pages/ClassLevels.test.jsx` | Create | Structural tests for the page |
| `src/App.jsx` | Modify | Import + `/class-levels` route |
| `src/components/Navbar.jsx` | Modify | `children` on nav links; `NavGroup` dropdown; mobile sub-links; active state across children |
| `src/components/Navbar.test.jsx` | Modify | Add dropdown, Escape, active-state, and mobile-children tests |

---

### Task 1: Class Levels page — route and level cards

**Files:**
- Create: `src/pages/ClassLevels.jsx`
- Create: `src/pages/ClassLevels.test.jsx`
- Modify: `src/App.jsx` (import near line 4, route near line 57)

**Interfaces:**
- Consumes: `Navbar`, `PageHeader`, `Footer`, `SEO` from `../components/*`; `courseListSchema`, `simpleBreadcrumb` from `../lib/schema`
- Produces: default export `ClassLevels`; module-private constants `LEVELS` (6 items, shape `{ name, ages, blurb }`) and `ACCENT_COLORS`; DOM contract `data-testid="level-card"` on each level card. Task 2 adds `STYLES` and `data-testid="style-card"` to this same file.

- [ ] **Step 1: Write the failing test**

Create `src/pages/ClassLevels.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ClassLevels from './ClassLevels'

function renderClassLevels() {
  return render(
    <MemoryRouter initialEntries={['/class-levels']}>
      <ClassLevels />
    </MemoryRouter>
  )
}

test('renders page title', () => {
  renderClassLevels()
  expect(screen.getByRole('heading', { name: 'Class Levels' })).toBeInTheDocument()
})

test('renders all six levels with their age lines', () => {
  renderClassLevels()
  const levels = [
    ['Tiny', 'Ages 2–5'],
    ['Beginner', 'Ages 5+'],
    ['Intermediate', 'By placement'],
    ['Advanced', 'By placement'],
    ['Adult', 'Ages 16+'],
    ['Specialty', 'Ages 5+'],
  ]
  for (const [name, ages] of levels) {
    expect(screen.getAllByText(name).length).toBeGreaterThan(0)
    expect(screen.getAllByText(ages).length).toBeGreaterThan(0)
  }
  // 'By placement' is shared by Intermediate and Advanced; 'Ages 5+' by Beginner
  // and Specialty. The unique ones must appear exactly once.
  expect(screen.getAllByText('By placement')).toHaveLength(2)
  expect(screen.getAllByText('Ages 5+')).toHaveLength(2)
  expect(screen.getAllByText('Ages 2–5')).toHaveLength(1)
  expect(screen.getAllByText('Ages 16+')).toHaveLength(1)
})

test('every level card has a non-empty blurb', () => {
  renderClassLevels()
  const cards = screen.getAllByTestId('level-card')
  expect(cards).toHaveLength(6)
  for (const card of cards) {
    const blurb = card.querySelector('[data-testid="level-blurb"]')
    expect(blurb).not.toBeNull()
    expect(blurb.textContent.trim().length).toBeGreaterThan(20)
  }
})

test('links to the class schedule and the register portal', () => {
  renderClassLevels()
  expect(screen.getByRole('link', { name: 'See the Fall Schedule' })).toHaveAttribute('href', '/classes')
  expect(screen.getByRole('link', { name: 'Register for Fall →' })).toHaveAttribute(
    'href',
    'https://studio.capitalcoredance.com/register/classes'
  )
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/ClassLevels.test.jsx`
Expected: FAIL — `Failed to resolve import "./ClassLevels"`.

- [ ] **Step 3: Write the page**

Create `src/pages/ClassLevels.jsx`:

```jsx
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb } from '../lib/schema'

// Same portal registration link as the Classes page.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
]

// PLACEHOLDER COPY — generic to each level, makes no claim about our curriculum,
// instructors, or placement process. Chanel replaces these blurbs with studio copy.
const LEVELS = [
  {
    name: 'Tiny',
    ages: 'Ages 2–5',
    blurb: 'Thirty-minute classes built for the shortest attention spans — songs, shapes, and safe first tumbling. No experience needed.',
  },
  {
    name: 'Beginner',
    ages: 'Ages 5+',
    blurb: 'Where technique starts: positions, counts, and across-the-floor basics at a pace set for first-timers.',
  },
  {
    name: 'Intermediate',
    ages: 'By placement',
    blurb: 'For dancers with a season or two behind them — longer combinations, faster corrections, more demanding choreography.',
  },
  {
    name: 'Advanced',
    ages: 'By placement',
    blurb: 'Full combinations, refined technique, and performance-level choreography for dancers who train consistently.',
  },
  {
    name: 'Adult',
    ages: 'Ages 16+',
    blurb: "Evening classes for grown dancers, whether it's your first class or your return after years away.",
  },
  {
    name: 'Specialty',
    ages: 'Ages 5+',
    blurb: 'Style-specific classes beyond the studio staples — Musical Theatre, Pom, and Cheer.',
  },
]

const CLASS_LEVELS_JSON_LD = [simpleBreadcrumb('Class Levels', '/class-levels')]

export default function ClassLevels() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Dance Class Levels &amp; Styles | Capital Core Dance Studio — Midlothian, VA"
        description="Which dance class fits your dancer? Capital Core Dance Studio in Midlothian, VA offers Tiny (ages 2–5), Beginner, Intermediate, Advanced, Adult, and Specialty levels across ballet, jazz, hip hop, contemporary, tap, acro, lyrical, musical theatre, and pom/cheer."
        canonical="/class-levels"
        jsonLd={CLASS_LEVELS_JSON_LD}
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Class Levels"
        subtitle="What each level means and what every style involves — so you can find the right fit before you register."
      />

      {/* Levels */}
      <section className="bg-surface-light px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Which level?
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Six levels, ages 2 through adult
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LEVELS.map(({ name, ages, blurb }, i) => (
              <div
                key={name}
                data-testid="level-card"
                className={`bg-white border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4`}
              >
                <div className="text-navy-dark font-bold text-base">{name}</div>
                <div className="text-[#8a9aaa] text-xs font-bold uppercase tracking-wider mt-0.5">
                  {ages}
                </div>
                <p data-testid="level-blurb" className="text-[#5a6a8a] text-sm mt-2 leading-relaxed">
                  {blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-navy-dark font-black text-xl">
            Still not sure where your dancer fits?
          </p>
          <p className="text-[#5a6a8a] text-sm mt-2">
            Your first class is always free — come try one and we'll help you place them.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              to="/classes"
              className="bg-white border border-navy-dark text-navy-dark text-sm font-bold px-6 py-3 rounded-md hover:bg-surface-light transition-colors"
            >
              See the Fall Schedule
            </Link>
            <a
              href={PORTAL_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-navy-dark text-white text-sm font-bold px-6 py-3 rounded-md hover:bg-navy-mid transition-colors"
            >
              Register for Fall →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```

Only `simpleBreadcrumb` is imported here — `courseListSchema` needs the style list, so Task 2 adds it to this import line.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/ClassLevels.test.jsx`
Expected: PASS — 4 tests.

- [ ] **Step 5: Add the route**

In `src/App.jsx`, add the import beside the other page imports (after the `Classes` import on line 4):

```jsx
import ClassLevels from './pages/ClassLevels'
```

And the route immediately after the `/classes` route (line 57):

```jsx
        <Route path="/class-levels" element={<ClassLevels />} />
```

- [ ] **Step 6: Verify nothing else broke**

Run: `npx vitest run`
Expected: 11 files, 49 tests, **6 failed** — the same 6 pre-existing failures in `Birthdays.test.jsx`, `Camps.test.jsx`, and `BirthdayForm.test.jsx`, and no others. If any other test fails, that is a regression from this task.

- [ ] **Step 7: Commit**

```bash
git add src/pages/ClassLevels.jsx src/pages/ClassLevels.test.jsx src/App.jsx
git commit -m "feat: add Class Levels page with level cards at /class-levels"
```

---

### Task 2: Style cards with level badges

**Files:**
- Modify: `src/pages/ClassLevels.jsx` (add `STYLES` constant after `LEVELS`; add a styles section between the levels section and the closing CTA; wire `courseListSchema`)
- Modify: `src/pages/ClassLevels.test.jsx` (add three tests)

**Interfaces:**
- Consumes: `ACCENT_COLORS` and the page shell from Task 1; `courseListSchema(styles: string[])` from `../lib/schema`
- Produces: module-private constant `STYLES` — 11 items, shape `{ name: string, levels: string[], description: string }`; DOM contract `data-testid="style-card"` per card, with `data-testid="style-badge"` and `data-testid="style-description"` inside each

- [ ] **Step 1: Write the failing tests**

Append to `src/pages/ClassLevels.test.jsx`:

```jsx
test('renders all eleven styles', () => {
  renderClassLevels()
  const styles = [
    'Ballet',
    'Jazz',
    'Hip Hop',
    'Contemporary',
    'Tap',
    'Acro & Tumbling',
    'Lyrical',
    'Breakdancing',
    'Musical Theatre',
    'Pom & Cheer',
    'Creative Movement',
  ]
  for (const style of styles) {
    expect(screen.getAllByText(style).length).toBeGreaterThan(0)
  }
  expect(screen.getAllByTestId('style-card')).toHaveLength(11)
})

test('every style card has a non-empty description and at least one level badge', () => {
  renderClassLevels()
  for (const card of screen.getAllByTestId('style-card')) {
    const description = card.querySelector('[data-testid="style-description"]')
    expect(description).not.toBeNull()
    expect(description.textContent.trim().length).toBeGreaterThan(20)
    expect(card.querySelectorAll('[data-testid="style-badge"]').length).toBeGreaterThan(0)
  }
})

test('does not list Adult as a style', () => {
  renderClassLevels()
  // Adult is a level, not a style — it appears as a badge, never as a style card.
  const styleNames = screen
    .getAllByTestId('style-card')
    .map((card) => card.querySelector('[data-testid="style-name"]').textContent.trim())
  expect(styleNames).not.toContain('Adult')
  expect(styleNames).not.toContain('Adult Classes')
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/ClassLevels.test.jsx`
Expected: FAIL — 3 failing, `Unable to find an element by: [data-testid="style-card"]`.

- [ ] **Step 3: Add the STYLES constant**

In `src/pages/ClassLevels.jsx`, directly after the `LEVELS` array:

```jsx
// Level badges are derived from the Fall 2026 schedule in Classes.jsx.
// Intermediate and Advanced are one combined badge because the schedule does not
// distinguish them. "Adult" is a level, not a style — it appears only as a badge.
// PLACEHOLDER COPY — generic to each art form. Chanel replaces these descriptions.
const STYLES = [
  {
    name: 'Ballet',
    levels: ['Tiny', 'Beginner', 'Intermediate/Advanced'],
    description: 'The foundation under every other style: alignment, turnout, and the vocabulary dancers carry into everything else.',
  },
  {
    name: 'Jazz',
    levels: ['Beginner', 'Intermediate/Advanced'],
    description: 'Sharp, upbeat, and musical — isolations, turns, and leaps set to current music.',
  },
  {
    name: 'Hip Hop',
    levels: ['Tiny', 'Beginner', 'Intermediate/Advanced'],
    description: 'Groove, rhythm, and attitude, with age-appropriate music and choreography at every level.',
  },
  {
    name: 'Contemporary',
    levels: ['Beginner', 'Intermediate/Advanced', 'Adult'],
    description: 'Movement built on breath and weight, borrowing from ballet and modern to tell a story.',
  },
  {
    name: 'Tap',
    levels: ['Tiny', 'Beginner'],
    description: 'Rhythm you can hear. Dancers build clean sounds and timing one step at a time.',
  },
  {
    name: 'Acro & Tumbling',
    levels: ['Tiny', 'Beginner', 'Intermediate/Advanced'],
    description: 'Strength, flexibility, and controlled tricks — rolls and cartwheels through to advanced skills, spotted and progressed safely.',
  },
  {
    name: 'Lyrical',
    levels: ['Intermediate/Advanced'],
    description: 'Ballet technique with contemporary freedom, danced to the lyrics of a song.',
  },
  {
    name: 'Breakdancing',
    levels: ['Beginner'],
    description: 'Toprock, footwork, and freezes — the athletic, foundational side of hip hop.',
  },
  {
    name: 'Musical Theatre',
    levels: ['Specialty'],
    description: 'Choreography paired with character and storytelling, drawn from stage repertoire.',
  },
  {
    name: 'Pom & Cheer',
    levels: ['Specialty', 'Adult'],
    description: 'Sharp motions, jumps, and team-style routines; good preparation for school squads.',
  },
  {
    name: 'Creative Movement',
    levels: ['Tiny'],
    description: 'Preschool-paced exploration of rhythm and coordination through imagination and play.',
  },
]
```

- [ ] **Step 4: Wire the styles into the JSON-LD**

Change the schema import line to bring in `courseListSchema`:

```jsx
import { courseListSchema, simpleBreadcrumb } from '../lib/schema'
```

Then replace the `CLASS_LEVELS_JSON_LD` declaration with:

```jsx
const CLASS_LEVELS_JSON_LD = [
  courseListSchema(STYLES.map(({ name }) => name)),
  simpleBreadcrumb('Class Levels', '/class-levels'),
]
```

- [ ] **Step 5: Add the styles section**

In `src/pages/ClassLevels.jsx`, insert this section between the closing `</section>` of the levels block and the `{/* Closing CTA */}` comment:

```jsx
      {/* Styles */}
      <section className="bg-white px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Our styles
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            What each class involves
          </h2>

          <div className="flex flex-col gap-3">
            {STYLES.map(({ name, levels, description }, i) => (
              <div
                key={name}
                data-testid="style-card"
                className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4`}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <div data-testid="style-name" className="text-navy-dark font-bold text-base">
                    {name}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {levels.map((level) => (
                      <span
                        key={level}
                        data-testid="style-badge"
                        className="bg-surface-light text-[#5a6a8a] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
                <p data-testid="style-description" className="text-[#5a6a8a] text-sm mt-2 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-[#8a9aaa] text-xs mt-8 text-center">
            Not every style runs every session. See the{' '}
            <Link to="/classes" className="text-brand-red font-semibold hover:underline">
              Fall schedule
            </Link>{' '}
            for what's on the calendar now.
          </p>
        </div>
      </section>
```

Then change the closing CTA section's className from `bg-white flex-1 px-6 py-12` to `bg-surface-light flex-1 px-6 py-12` so it alternates against the white styles section above it.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/pages/ClassLevels.test.jsx`
Expected: PASS — 7 tests.

- [ ] **Step 7: Run the full suite**

Run: `npx vitest run`
Expected: 11 files, 52 tests, **6 failed** — the same 6 pre-existing failures and no others.

- [ ] **Step 8: Commit**

```bash
git add src/pages/ClassLevels.jsx src/pages/ClassLevels.test.jsx
git commit -m "feat: add style descriptions with level badges to Class Levels page"
```

---

### Task 3: Navbar dropdown under Classes

**Files:**
- Modify: `src/components/Navbar.jsx` (whole component — `NAV_LINKS`, new `NavGroup`, desktop map, mobile map, active-state helper)
- Modify: `src/components/Navbar.test.jsx` (add four tests; existing four must not change)

**Interfaces:**
- Consumes: the `/class-levels` route from Task 1
- Produces: `NAV_LINKS` entries may carry `children: [{ to, label }]`. The Classes caret button's accessible name is exactly `Classes menu`. Dropdown item labels are exactly `Class Schedule` and `Class Levels`.

- [ ] **Step 1: Write the failing tests**

Append to `src/components/Navbar.test.jsx`:

```jsx
test('caret button toggles the Classes dropdown', () => {
  renderNavbar()
  const caret = screen.getByRole('button', { name: 'Classes menu' })
  expect(caret).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('link', { name: 'Class Levels' })).not.toBeInTheDocument()

  fireEvent.click(caret)
  expect(caret).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('link', { name: 'Class Schedule' })).toHaveAttribute('href', '/classes')
  expect(screen.getByRole('link', { name: 'Class Levels' })).toHaveAttribute('href', '/class-levels')

  fireEvent.click(caret)
  expect(caret).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('link', { name: 'Class Levels' })).not.toBeInTheDocument()
})

test('Escape closes the open dropdown', () => {
  renderNavbar()
  const caret = screen.getByRole('button', { name: 'Classes menu' })
  fireEvent.click(caret)
  expect(screen.getByRole('link', { name: 'Class Levels' })).toBeInTheDocument()

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('link', { name: 'Class Levels' })).not.toBeInTheDocument()
  expect(caret).toHaveAttribute('aria-expanded', 'false')
})

test('highlights the Classes parent on /class-levels', () => {
  renderNavbar('/class-levels')
  const classesLinks = screen.getAllByRole('link', { name: 'Classes' })
  expect(classesLinks[0].className).toContain('text-[#f4a8b4]')
})

test('mobile menu includes the Classes sub-links', () => {
  renderNavbar()
  fireEvent.click(screen.getByLabelText('Toggle menu'))
  expect(screen.getAllByRole('link', { name: 'Class Schedule' })).toHaveLength(1)
  expect(screen.getAllByRole('link', { name: 'Class Levels' })).toHaveLength(1)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/Navbar.test.jsx`
Expected: FAIL — 4 failing (`Unable to find an accessible element with the role "button" and name "Classes menu"`), 4 existing passing.

- [ ] **Step 3: Rewrite the Navbar**

Replace the entire contents of `src/components/Navbar.jsx`:

```jsx
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  {
    to: '/classes',
    label: 'Classes',
    children: [
      { to: '/classes', label: 'Class Schedule' },
      { to: '/class-levels', label: 'Class Levels' },
    ],
  },
  { to: '/dance-company', label: 'Dance Company' },
  { to: '/tuition', label: 'Tuition' },
  { to: '/birthdays', label: 'Birthdays' },
]

const ACTIVE_CLASS = 'text-[#f4a8b4] border-b-2 border-[#f4a8b4] pb-0.5'
const INACTIVE_CLASS = 'text-[#b8d4f0] hover:text-white'

// A nav item with children: the parent stays a real link to its own page, and a
// caret beside it opens the submenu on hover or on click/keyboard.
function NavGroup({ link, className }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const groupRef = useRef(null)

  // Close on route change.
  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e) {
      if (groupRef.current && !groupRef.current.contains(e.target)) setOpen(false)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div
      ref={groupRef}
      className="relative flex items-center gap-1"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link to={link.to} className={`text-sm font-medium transition-colors ${className}`}>
        {link.label}
      </Link>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${link.label} menu`}
        onClick={() => setOpen((o) => !o)}
        className="text-[#b8d4f0] hover:text-white text-[9px] leading-none px-0.5"
      >
        ▼
      </button>

      {open && (
        <div className="absolute left-0 top-full pt-3 z-50">
          <div className="bg-navy-dark border border-navy-mid rounded-md py-2 min-w-[170px] shadow-lg">
            {link.children.map((child) => (
              <Link
                key={`${child.to}-${child.label}`}
                to={child.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  pathname === child.to
                    ? 'text-[#f4a8b4]'
                    : 'text-[#b8d4f0] hover:text-white hover:bg-navy-mid'
                }`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // A parent is active on its own path or on any of its children's paths.
  function isActive(link) {
    if (pathname === link.to) return true
    return (link.children || []).some((child) => pathname === child.to)
  }

  function linkClass(link) {
    return isActive(link) ? ACTIVE_CLASS : INACTIVE_CLASS
  }

  return (
    <nav className="bg-navy-dark sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 justify-self-start">
          <img src="/logo.png" alt="Capital Core Dance Studio" className="h-10 w-10 object-contain flex-shrink-0" />
          <div>
            <div className="text-white font-black text-sm tracking-widest">CAPITAL CORE</div>
            <div className="text-[#7ab3e8] text-[10px] tracking-[0.3em]">DANCE STUDIO</div>
          </div>
        </Link>

        {/* Desktop nav — centered */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-7">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <NavGroup key={link.to} link={link} className={linkClass(link)} />
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${linkClass(link)}`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right: Contact (desktop) + hamburger (mobile) */}
        <div className="flex items-center justify-end justify-self-end col-start-3">
          <Link
            to="/contact"
            className="hidden md:inline-flex bg-brand-red text-white text-sm font-bold px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Contact Us
          </Link>

          {/* Hamburger button */}
          <button
            className="md:hidden text-white text-xl leading-none"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-navy-dark border-t border-navy-mid px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <div key={link.to} className="flex flex-col gap-3">
              <Link
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium ${isActive(link) ? 'text-[#f4a8b4]' : 'text-[#b8d4f0]'}`}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="flex flex-col gap-3 pl-4 border-l border-navy-mid">
                  {link.children.map((child) => (
                    <Link
                      key={`${child.to}-${child.label}`}
                      to={child.to}
                      onClick={() => setMenuOpen(false)}
                      className={`text-sm font-medium ${pathname === child.to ? 'text-[#f4a8b4]' : 'text-[#b8d4f0]'}`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="bg-brand-red text-white text-sm font-bold px-5 py-2 rounded-md text-center"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 4: Run the Navbar tests**

Run: `npx vitest run src/components/Navbar.test.jsx`
Expected: PASS — 8 tests (4 existing unchanged + 4 new).

If `mobile menu toggle shows and hides menu` fails, the cause is a link whose accessible name is exactly `Classes` leaking into the mobile tree twice — check that the sub-links are labelled `Class Schedule` and `Class Levels`, not `Classes`.

- [ ] **Step 5: Run the full suite**

Run: `npx vitest run`
Expected: 11 files, 56 tests, **6 failed** — the same 6 pre-existing failures and no others. Every Navbar and Classes test must be green.

- [ ] **Step 6: Commit**

```bash
git add src/components/Navbar.jsx src/components/Navbar.test.jsx
git commit -m "feat: add Classes dropdown with Class Levels to the navbar"
```

---

### Task 4: Verify in the browser

**Files:** none — verification only.

**Interfaces:**
- Consumes: everything from Tasks 1–3

- [ ] **Step 1: Start the dev server**

Run in the background: `npm run dev`
Expected: Vite reports `http://localhost:5173/`. If port 5173 is taken, use the port Vite prints.

- [ ] **Step 2: Check the desktop dropdown**

Load `http://localhost:5173/classes` at desktop width (≥1024px). Hover "Classes" in the nav.
Expected: a navy panel opens under it with "Class Schedule" and "Class Levels". Clicking "Class Levels" navigates to `/class-levels` and the panel closes.

- [ ] **Step 3: Check the page renders**

On `/class-levels`, confirm: six level cards in two columns with cycling left accent colors; eleven style cards each with badges; the two CTA buttons at the bottom.
Expected: no console errors, no horizontal scroll.

- [ ] **Step 4: Check mobile width**

Resize to 390px wide. Open the hamburger.
Expected: "Class Schedule" and "Class Levels" appear indented under "Classes" with a left rule. Level cards stack to one column. Nothing overflows the viewport horizontally.

- [ ] **Step 5: Check the Escape key and outside click**

At desktop width, click the caret beside "Classes" to open the menu, press Escape.
Expected: the menu closes. Re-open it and click elsewhere on the page — it closes.

- [ ] **Step 6: Report**

Report what rendered, anything visually off, and any console errors. Do not commit — this task changes no files.

---

## Post-implementation notes

**Status: implemented and merged-ready.** Commits `b657220`, `4750253`, `78e6552`,
`fcac031`, `c2a09d1`, `6d1ccf3`, `3699644`. 18 new tests; suite sits at the same 6
pre-existing failures it had before this work.

### Needs Chanel before the page is parent-ready

1. **Real style descriptions** — replace the 11 `description` values in the `STYLES`
   constant in `src/pages/ClassLevels.jsx`. The placeholders are deliberately generic
   and make no claim about this studio's curriculum, instructors, or outcomes.
2. **Confirm the level badges** — derived from the Fall 2026 schedule, not studio
   records. Jazz and Hip Hop were corrected during review: both had claimed
   Intermediate/Advanced, but no schedule row supports either.
3. **"By placement" wording** — the page is the site's *only* assertion that a placement
   process exists; the word appears nowhere else in the repo. Same for the closing CTA's
   "we'll help you place them", which is a promise about staff behavior.
4. **"Specialty" collides with a pricing term** — `src/pages/Tuition.jsx:148` uses
   "Specialty Classes" to mean separately priced classes with their own event pages.
   Musical Theatre and Pom & Cheer are ordinary Fall schedule rows at ordinary lengths.
   Either rename the level or re-badge those two as Intermediate/Advanced (which is what
   the derivation rule would otherwise give them — they are unlabeled `Ages 5+` rows,
   exactly like Tumble and Acro / Lyrical).
5. **"Creative Movement" vs "Preschool Creative Movement"** — the rest of the site uses
   the longer name (`Classes.jsx`, `About.jsx`, FAQ, `llms.txt`). Also no Fall row
   currently offers it; the "not every style runs every session" footnote covers that.
6. **Two schedule styles have no card** — `Adult Femme / Flaire` and `Modern`.

### Deliberately deferred (recorded, not blocking)

- Full WAI-ARIA menu pattern for the dropdown (`role="menu"`, arrow keys). `aria-haspopup`
  was *removed* rather than honored, so the announcement no longer promises menu
  semantics the plain-div popup lacks. `aria-expanded` alone describes the disclosure.
- Touch at desktop width can open the caret but not collapse it by tapping again (the
  pointer branch is open-only by design). Cheap hardening: add `pointerdown` alongside
  `mousedown` on the outside-close listener.
- `ACCENT_COLORS` duplication — declared verbatim in 7 page files, 6 of them
  pre-existing. Do not extract. `PORTAL_REGISTER_URL` (3 sites, one an inline literal in
  `Home.jsx:149`) is the better future extraction, as its own commit.
- No App-level test renders `Navbar`, so the other ~30 pages that render it are only
  covered in isolation. Pre-existing gap, worth a separate chore.
- `/blog/dance-styles-parents-guide` targets nearly the same search query as this page,
  with no cross-link in either direction.
- `npx eslint .` reports 187 pre-existing errors repo-wide. The two files this branch
  owns are clean; the rest is untouched.
- `localBusinessSchema` in `src/lib/schema.js` advertises Irish dance, which is not on
  the Fall schedule. This page deliberately omits it.
- `public/sitemap.xml` is also missing `/dance-company` and `/competition-team`. Only
  `/class-levels` was added here.
