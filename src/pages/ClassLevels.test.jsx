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
      'Beginner Hip Hop',
    ],
  },
  {
    title: 'Intermediate & Technique Classes',
    classes: ['Acro & Lyrical', 'Ballet & Contemporary', 'Tumble Tech', 'Tumble', 'Lyrical & Contemporary'],
  },
  {
    title: 'Specialty Classes',
    classes: ['Musical Theatre', 'Pom Cheer'],
  },
  {
    title: 'Adult Program',
    classes: ['Adult Femme Flair', 'Adult Pom', 'Adult Contemporary'],
  },
]

const ALL_CLASSES = GROUPS.flatMap((g) => g.classes)

test('renders page title', () => {
  renderClassLevels()
  expect(screen.getByRole('heading', { name: 'Class Levels' })).toBeInTheDocument()
})

test('renders all five class groups with their age lines', () => {
  renderClassLevels()
  const titles = screen.getAllByTestId('group-title').map((el) => el.textContent.trim())
  expect(titles).toEqual(GROUPS.map((g) => g.title))
  // 'Ages 5+' is shared by three groups; the other two ages appear once each.
  expect(screen.getAllByText('Ages 5+')).toHaveLength(3)
  expect(screen.getAllByText('Ages 2–5')).toHaveLength(1)
  expect(screen.getAllByText('Ages 16+')).toHaveLength(1)
})

test('renders every class on the Fall schedule, in group order', () => {
  renderClassLevels()
  const names = screen.getAllByTestId('class-name').map((el) => el.textContent.trim())
  expect(names).toEqual(ALL_CLASSES)
  expect(names).toHaveLength(21)
})

test('distinguishes classes whose names are prefixes of others', () => {
  renderClassLevels()
  const names = screen.getAllByTestId('class-name').map((el) => el.textContent.trim())
  // These pairs are separate rows on the schedule and must not be collapsed.
  expect(names.filter((n) => n === 'Beginner Hip Hop')).toHaveLength(1)
  expect(names.filter((n) => n === 'Beginner Hip Hop & Breakdancing')).toHaveLength(1)
  expect(names.filter((n) => n === 'Tumble')).toHaveLength(1)
  expect(names.filter((n) => n === 'Tumble Tech')).toHaveLength(1)
})

test('every class card has an audience line and a description', () => {
  renderClassLevels()
  const cards = screen.getAllByTestId('class-card')
  expect(cards).toHaveLength(21)
  for (const card of cards) {
    const name = card.querySelector('[data-testid="class-name"]').textContent.trim()
    const audience = card.querySelector('[data-testid="class-audience"]')
    const description = card.querySelector('[data-testid="class-description"]')
    expect(audience, `${name} is missing an audience line`).not.toBeNull()
    expect(audience.textContent.trim().length, `${name} audience too short`).toBeGreaterThan(20)
    expect(description, `${name} is missing a description`).not.toBeNull()
    expect(description.textContent.trim().length, `${name} description too short`).toBeGreaterThan(60)
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
