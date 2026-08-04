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

// Every distinct class on the Fall 2026 schedule in Classes.jsx, grouped as the
// studio grouped them. If a class is added to the schedule, it belongs here too.
const GROUPS = [
  {
    title: 'Tiny Dancers',
    classes: ['Tiny Ballet & Tumble', 'Tiny Ballet & Hip Hop', 'Tiny Ballet & Tap'],
  },
  {
    title: 'Beginner Program',
    classes: [
      'Beginner Ballet & Jazz',
      'Beginner Ballet & Hip Hop',
      'Beginner Ballet & Tap',
      'Beginner Ballet & Modern',
      'Beginner Acro & Jazz',
      'Beginner Contemporary & Jazz',
      'Beginner Hip Hop & Breakdancing',
    ],
  },
  {
    title: 'Intermediate & Technique Classes',
    classes: ['Acro & Lyrical', 'Ballet & Contemporary', 'Lyrical & Contemporary'],
  },
  {
    title: 'Specialty Classes',
    classes: ['Musical Theatre', 'Pom Cheer', 'Tumble Tech'],
  },
  // The Adult Program group moved to its own page on 2026-08-03 — its coverage lives
  // in AdultClasses.test.jsx. This page is ages 2–17 only.
]

const ALL_CLASSES = GROUPS.flatMap((g) => g.classes)

test('renders page title', () => {
  renderClassLevels()
  expect(screen.getByRole('heading', { name: 'Class Levels' })).toBeInTheDocument()
})

test('renders all four youth class groups with their age lines', () => {
  renderClassLevels()
  const titles = screen.getAllByTestId('group-title').map((el) => el.textContent.trim())
  expect(titles).toEqual(GROUPS.map((g) => g.title))
  // 'Ages 5+' is shared by three groups; Tiny's range appears once.
  expect(screen.getAllByText('Ages 5+')).toHaveLength(3)
  expect(screen.getAllByText('Ages 2–5')).toHaveLength(1)
})

test('renders every youth class on the Fall schedule, in group order', () => {
  renderClassLevels()
  const names = screen.getAllByTestId('class-name').map((el) => el.textContent.trim())
  expect(names).toEqual(ALL_CLASSES)
  // 16: 'Tumble' merged into 'Tumble Tech' (2026-08-03) and 'Beginner Hip Hop' into
  // 'Beginner Hip Hop & Breakdancing' (2026-08-04).
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
  // standalone 'Beginner Hip Hop' must not come back. The ballet combos are untouched.
  expect(names.filter((n) => n === 'Beginner Hip Hop & Breakdancing')).toHaveLength(1)
  expect(names).not.toContain('Beginner Hip Hop')
  expect(names).toContain('Beginner Ballet & Hip Hop')
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
  expect(bullets).toHaveLength(4)
  expect(bullets[0]).toBe('Tiny Classes are designed for dancers ages 2–5.')
  expect(bullets[3]).toBe(
    'Class placement recommendations may be made by instructors to ensure every dancer is in the class that best supports their growth.'
  )
})

test('does not present a level the studio does not offer', () => {
  renderClassLevels()
  // The studio's copy has no Advanced group — the page must not invent one.
  expect(screen.queryByText('Advanced')).not.toBeInTheDocument()
  expect(screen.getAllByTestId('group-title')).toHaveLength(4)
})

test('links to the class schedule and the register portal', () => {
  renderClassLevels()
  expect(screen.getByRole('link', { name: 'See the Fall Schedule' })).toHaveAttribute('href', '/classes')
  expect(screen.getByRole('link', { name: 'Register for Fall →' })).toHaveAttribute(
    'href',
    'https://studio.capitalcoredance.com/register/classes'
  )
})
