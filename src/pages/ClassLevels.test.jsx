import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ClassLevels from './ClassLevels'
import { PROGRAMS } from '../lib/schedule'

function renderClassLevels() {
  return render(
    <MemoryRouter initialEntries={['/class-levels']}>
      <ClassLevels />
    </MemoryRouter>
  )
}

// Every distinct class on the Fall 2026 schedule in Classes.jsx, grouped as the
// studio grouped them. If a class is added to the schedule, it belongs here too.
const GROUPS = [
  {
    title: 'Tiny Core',
    classes: [
      'Tiny Core Ballet & Tumble',
      'Tiny Core Ballet & Hip Hop',
      'Tiny Core Ballet & Tap',
    ],
  },
  {
    title: 'Core',
    classes: [
      'Core Ballet & Jazz',
      'Core Ballet & Hip Hop',
      'Core Ballet & Tap',
      'Core Ballet & Modern',
      'Core Acro & Jazz',
      'Core Contemporary & Jazz',
      'Core Hip Hop & Breakdancing',
    ],
  },
  {
    title: 'Core Plus',
    classes: [
      'Core Plus Acro & Lyrical',
      'Core Plus Ballet & Contemporary',
      'Core Plus Lyrical & Contemporary',
    ],
  },
  {
    title: 'Technique',
    classes: ['Tumble Tech'],
  },
  {
    title: 'Specialty',
    classes: ['Musical Theatre', 'Pom Cheer'],
  },
  // The Adult Core group lives on its own page since 2026-08-03 — its coverage is in
  // AdultClasses.test.jsx. This page is ages 2–17 only.
]

const ALL_CLASSES = GROUPS.flatMap((g) => g.classes)

test('renders page title', () => {
  renderClassLevels()
  // Sentence case since the 2026-08-11 conversion, matching every other hero; the page
  // is still "Class Levels" in the nav and the URL.
  expect(screen.getByRole('heading', { level: 1, name: 'Class levels' })).toBeInTheDocument()
})

test('renders all five youth program tiers with their age lines', () => {
  renderClassLevels()
  const titles = screen.getAllByTestId('group-title').map((el) => el.textContent.trim())
  expect(titles).toEqual(GROUPS.map((g) => g.title))
  // Core and Specialty both read 'Ages 5+'; the rest are distinct.
  expect(screen.getAllByText('Ages 5+')).toHaveLength(2)
  expect(screen.getAllByText('Ages 2–5')).toHaveLength(1)
  expect(screen.getAllByText('Ages 8+')).toHaveLength(1)
  // The Technique eyebrow. Regression guard: deriving this from the tier's filter
  // shorthand once produced the nonsense "Ages All Levels".
  const eyebrows = screen
    .getAllByTestId('class-group')
    .map((s) => s.querySelector('p').textContent.trim())
  expect(eyebrows).toContain('All Levels')
  expect(eyebrows).not.toContain('Ages All Levels')
})

test('each tier states its skill band and who it is for', () => {
  // The studio's ask on 2026-08-10: "Core" alone does not tell a parent whether the
  // class suits a brand-new dancer or one coming back after a few years off.
  renderClassLevels()
  const bandFor = (title) =>
    screen
      .getAllByTestId('class-group')
      .find((s) => s.querySelector('[data-testid="group-title"]').textContent.trim() === title)

  const core = bandFor('Core')
  expect(core.querySelector('[data-testid="group-level"]')).toHaveTextContent('Beginner – Novice')
  expect(core).toHaveTextContent(/new to dance/i)
  expect(core).toHaveTextContent(/returning dancers/i)

  // Core Plus carries the SAME band as Core since 2026-08-11 — the two are split by
  // age, not skill. A future edit that quietly makes Core Plus intermediate again
  // would re-strand older beginners, which is the whole reason the tier exists.
  const corePlus = bandFor('Core Plus')
  expect(corePlus.querySelector('[data-testid="group-level"]')).toHaveTextContent(
    'Beginner – Novice'
  )
  expect(corePlus).toHaveTextContent(/older dancers/i)
})

test('Core Elite is defined but not shown until it has classes', () => {
  // Added to PROGRAMS on 2026-08-11 ahead of the studio assigning classes. An empty
  // section would read as a broken page, so the group is filtered out — but the tier
  // must still exist in the data so the Program Key on /classes can announce it.
  renderClassLevels()
  const titles = screen.getAllByTestId('group-title').map((el) => el.textContent.trim())
  expect(titles).not.toContain('Core Elite')
  expect(PROGRAMS.map((p) => p.value)).toContain('core-elite')

  // The Important Information notes still describe it, so a parent reading the page
  // learns the tier exists even though no class carries it yet.
  const bullets = screen.getAllByTestId('info-bullet').map((el) => el.textContent)
  expect(bullets.join(' ')).toMatch(/Core Elite/)
})

test('Core Plus is presented as 8+, not 5+', () => {
  // The 2026-08-10 flyer raised these two classes from 5+ to 8+. Getting this wrong
  // would tell a parent of a six-year-old they can enrol in a class they cannot.
  renderClassLevels()
  const coreplus = screen
    .getAllByTestId('class-group')
    .find((section) => section.querySelector('[data-testid="group-title"]').textContent.trim() === 'Core Plus')
  expect(coreplus).toHaveTextContent('Ages 8+')
  expect(coreplus).not.toHaveTextContent('Ages 5+')
})

test('renders every youth class on the Fall schedule, in group order', () => {
  renderClassLevels()
  const names = screen.getAllByTestId('class-name').map((el) => el.textContent.trim())
  expect(names).toEqual(ALL_CLASSES)
  // 16: 'Tumble' merged into 'Tumble Tech' (2026-08-03) and 'Beginner Hip Hop' into
  // what is now 'Core Hip Hop & Breakdancing' (2026-08-04).
  expect(names).toHaveLength(16)
})

test('adult classes live on their own page, not duplicated here', () => {
  renderClassLevels()
  const names = screen.getAllByTestId('class-name').map((el) => el.textContent.trim())
  // Duplicating these would mean maintaining the studio's copy in two files.
  for (const adult of ['Adult Femme Flair', 'Adult Pom', 'Adult Contemporary']) {
    expect(names).not.toContain(adult)
  }
  expect(screen.getByRole('link', { name: 'See Adult Classes →' })).toHaveAttribute(
    'href',
    '/adult-classes'
  )
})

test('distinguishes classes whose names are prefixes of others', () => {
  renderClassLevels()
  const names = screen.getAllByTestId('class-name').map((el) => el.textContent.trim())
  // Hip Hop & Breakdancing covers both standalone hip hop classes since the 2026-08-04
  // merge, so it appears once here even though two schedule rows point at it, and the old
  // standalone hip hop entry must not come back. The ballet combos are untouched.
  expect(names.filter((n) => n === 'Core Hip Hop & Breakdancing')).toHaveLength(1)
  expect(names).not.toContain('Core Hip Hop')
  expect(names).toContain('Core Ballet & Hip Hop')
  // Tumble Tech covers both tumbling classes since the 2026-08-03 merge, so it must
  // appear exactly once here even though two schedule rows point at it, and the old
  // standalone 'Tumble' must not come back.
  expect(names.filter((n) => n === 'Tumble Tech')).toHaveLength(1)
  expect(names).not.toContain('Tumble')
})

test('every class card has a description and no audience line', () => {
  renderClassLevels()
  const cards = screen.getAllByTestId('class-card')
  expect(cards).toHaveLength(16)
  for (const card of cards) {
    const name = card.querySelector('[data-testid="class-name"]').textContent.trim()
    const description = card.querySelector('[data-testid="class-description"]')
    expect(description, `${name} is missing a description`).not.toBeNull()
    expect(description.textContent.trim().length, `${name} description too short`).toBeGreaterThan(60)
    // "Who is this class for?" lines were removed 2026-08-03 at the studio's request.
    expect(
      card.querySelector('[data-testid="class-audience"]'),
      `${name} still renders an audience line`
    ).toBeNull()
  }
})

test('renders the studio Important Information notes', () => {
  renderClassLevels()
  const bullets = screen.getAllByTestId('info-bullet').map((el) => el.textContent.trim())
  expect(bullets).toHaveLength(5)
  expect(bullets[0]).toBe('Tiny Core classes are designed for dancers ages 2–5.')
  expect(bullets[4]).toBe(
    'Class placement recommendations may be made by instructors to ensure every dancer is in the class that best supports their growth.'
  )
})

test('does not present a level the studio does not offer', () => {
  renderClassLevels()
  // The studio's copy has no Advanced group — the page must not invent one.
  expect(screen.queryByText('Advanced')).not.toBeInTheDocument()
  expect(screen.getAllByTestId('group-title')).toHaveLength(5)
})

test('links to the class schedule and the register portal', () => {
  renderClassLevels()
  expect(screen.getByRole('link', { name: 'See the Fall Schedule' })).toHaveAttribute('href', '/classes')
  expect(screen.getByRole('link', { name: 'Register for Fall →' })).toHaveAttribute(
    'href',
    'https://studio.capitalcoredance.com/register/classes'
  )
})

test('Beginner and Intermediate survive only as skill bands, never as program or class names', () => {
  // Subtle but load-bearing distinction from 2026-08-10. The studio retired
  // Tiny/Beginner/Intermediate as the *names* of programs and classes, replacing them
  // with the Core tiers — but then reintroduced "Beginner – Novice" and
  // "Intermediate – Advanced" as the *skill band* each tier maps to. So the words are
  // expected in the level line and nowhere structural.
  renderClassLevels()

  const titles = screen.getAllByTestId('group-title').map((el) => el.textContent.trim())
  const names = screen.getAllByTestId('class-name').map((el) => el.textContent.trim())
  for (const text of [...titles, ...names]) {
    expect(text, `"${text}" still uses retired vocabulary`).not.toMatch(/beginner|intermediate/i)
  }

  // Every class name now leads with its tier.
  for (const name of names) {
    expect(name).toMatch(/^(Tiny Core|Core Plus|Core|Tumble Tech|Musical Theatre|Pom Cheer)/)
  }

  // And the band is present where it belongs. 'Intermediate – Advanced' belongs to
  // Core Elite, which has no classes yet, so it is deliberately absent from this page.
  const levels = screen.getAllByTestId('group-level').map((el) => el.textContent.trim())
  expect(levels).toContain('Beginner – Novice')
})

test('sits in the Classes group orange, not a colour of its own', () => {
  // Schedule, Class Levels and Adult Classes are one journey. A parent moving between
  // them must not see the accent change, or the colour stops meaning "where you are".
  renderClassLevels()
  expect(screen.getByTestId('hero-panel')).toHaveStyle({ background: '#ff8c2b' })
})

test('keeps both closing actions, including the register link', () => {
  // The pre-redesign page offered the schedule and the portal side by side. Dropping
  // the portal would strand a parent who has just decided which class fits.
  renderClassLevels()
  const band = within(screen.getByTestId('cta-band'))
  expect(band.getByRole('link', { name: 'See the Fall Schedule' })).toHaveAttribute('href', '/classes')
  expect(band.getByRole('link', { name: 'Register for Fall →' })).toHaveAttribute(
    'href',
    'https://studio.capitalcoredance.com/register/classes'
  )
})

test('carries no leftover light-theme surfaces', () => {
  renderClassLevels()
  const white = [...document.querySelectorAll('[class*="bg-white"]')].filter(
    (el) => !/bg-white\/\[?\d/.test(el.className)
  )
  expect(white.map((el) => el.className)).toEqual([])
})
