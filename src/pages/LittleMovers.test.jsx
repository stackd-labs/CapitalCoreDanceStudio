import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LittleMovers from './LittleMovers'

const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

// The six classes and their age ranges, from the studio's Little Movers flyer.
const CLASSES = [
  ['Baby & Me', '0–12 months'],
  ['Parent & Me Dance', '18 months–3 years'],
  ["Moovin' & Groovin'", '2–5 years'],
  ['Tiny Tumblers', '2–5 years'],
  ['Sensory Steps', '2–5 years'],
  ['Little Movers Free Play Lab', '1–5 years'],
]

// The weekly schedule exactly as the flyer lays it out: three 45-minute morning slots.
const SLOTS = ['9:30 – 10:15 AM', '10:15 – 11:00 AM', '11:00 – 11:45 AM']
const EXPECTED = {
  Monday: ['Baby & Me', "Moovin' & Groovin'", 'Tiny Tumblers'],
  Tuesday: ['Sensory Steps', 'Little Movers Free Play Lab', 'Parent & Me Dance'],
  Wednesday: ["Moovin' & Groovin'", 'Tiny Tumblers', 'Baby & Me'],
  Thursday: ['Little Movers Free Play Lab', 'Parent & Me Dance', 'Sensory Steps'],
  Friday: ['Tiny Tumblers', 'Baby & Me', "Moovin' & Groovin'"],
}

function renderLittleMovers() {
  return render(
    <MemoryRouter initialEntries={['/little-movers']}>
      <LittleMovers />
    </MemoryRouter>
  )
}

test('renders page title and tagline', () => {
  renderLittleMovers()
  expect(screen.getByRole('heading', { name: 'Little Movers' })).toBeInTheDocument()
  expect(screen.getByText(/Movement\. Play\. Learn\. Grow\./)).toBeInTheDocument()
})

test('renders all eight benefits', () => {
  renderLittleMovers()
  // Each <li> holds a ✓ glyph alongside the label, matching the checklist pattern
  // used on the Birthdays page, so strip it before comparing.
  const benefits = screen
    .getAllByTestId('benefit')
    .map((el) => el.textContent.replace('✓', '').trim())
  expect(benefits).toEqual([
    'Confidence',
    'Coordination',
    'Balance',
    'Creativity',
    'Social skills',
    'Gross motor development',
    'Rhythm and musicality',
    'Independence',
  ])
})

test('renders all six classes with their age ranges and descriptions', () => {
  renderLittleMovers()
  const cards = screen.getAllByTestId('little-movers-class')
  expect(cards).toHaveLength(6)
  cards.forEach((card, i) => {
    const [name, ages] = CLASSES[i]
    expect(card.textContent).toContain(name)
    expect(card.textContent).toContain(ages)
    // Every class must carry a description, not just a name and an age.
    expect(card.querySelector('p').textContent.trim().length).toBeGreaterThan(30)
  })
})

test('schedule table lists every day, slot, and class in the right cell', () => {
  renderLittleMovers()
  const table = screen.getByTestId('schedule-table')
  const rows = within(table).getAllByRole('row')
  // One header row plus three time-slot rows.
  expect(rows).toHaveLength(4)

  for (const day of Object.keys(EXPECTED)) {
    expect(within(table).getByText(day)).toBeInTheDocument()
  }
  for (const slot of SLOTS) {
    expect(within(table).getByText(slot)).toBeInTheDocument()
  }

  // Walk each slot row and check the class in each day's column, in order.
  SLOTS.forEach((slot, slotIndex) => {
    const cells = within(rows[slotIndex + 1]).getAllByRole('cell')
    expect(cells).toHaveLength(5)
    Object.keys(EXPECTED).forEach((day, dayIndex) => {
      expect(cells[dayIndex].textContent, `${day} ${slot}`).toContain(EXPECTED[day][slotIndex])
    })
  })
})

test('the mobile list carries the same fifteen slots', () => {
  renderLittleMovers()
  const list = screen.getByTestId('schedule-list')
  expect(within(list).getAllByTestId('schedule-entry')).toHaveLength(15)
  for (const day of Object.keys(EXPECTED)) {
    expect(within(list).getByText(day)).toBeInTheDocument()
  }
})

test('does not name an instructor in the schedule', () => {
  renderLittleMovers()
  // The "with Ms. Ryan" credit was removed from the view on 2026-08-03 at the
  // studio's request; the schedule shows class name and age range only.
  expect(screen.queryByText(/Ms\. Ryan/)).not.toBeInTheDocument()
})

test('states that every class is 45 minutes and drop-off', () => {
  renderLittleMovers()
  expect(screen.getByText(/Every class runs 45 minutes/)).toBeInTheDocument()
  expect(screen.getByText(/drop-off program/i)).toBeInTheDocument()
})

test('renders the three ways to join, each framed by how often a family comes', () => {
  renderLittleMovers()
  const cards = screen.getAllByTestId('pricing-card')
  expect(cards).toHaveLength(3)

  // Drop-in
  expect(cards[0].textContent).toContain('Just want to try it?')
  expect(cards[0].textContent).toContain('Drop-In')
  expect(cards[0].textContent).toContain('$10')
  expect(cards[0].textContent).toContain('per class')

  // Passport
  expect(cards[1].textContent).toContain('Come when you can')
  expect(cards[1].textContent).toContain('Little Movers Passport')
  expect(cards[1].textContent).toContain('5 visits — $45')
  expect(cards[1].textContent).toContain('10 visits — $85')

  // Membership
  expect(cards[2].textContent).toContain("We're here every week")
  expect(cards[2].textContent).toContain('Little Movers Membership')
  expect(cards[2].textContent).toContain('$89')
  expect(cards[2].textContent).toContain('per month')
})

test('only the membership carries the best-value badge', () => {
  renderLittleMovers()
  const badges = screen.getAllByTestId('pricing-badge')
  expect(badges).toHaveLength(1)
  expect(badges[0].textContent).toBe('Best value')
  expect(badges[0].closest('[data-testid="pricing-card"]').textContent).toContain(
    'Little Movers Membership'
  )
})

test('membership lists unlimited classes and all five perks', () => {
  renderLittleMovers()
  const membership = screen.getAllByTestId('pricing-card')[2]
  const lines = [...membership.querySelectorAll('[data-testid="pricing-line"]')].map((el) =>
    el.textContent.replace('✓', '').trim()
  )
  expect(lines).toEqual([
    'Unlimited Little Movers classes',
    'Priority registration for camps',
    'One free guest pass each month',
    '10% off birthday parties',
    '10% off retail',
    'Exclusive Little Movers events',
  ])
})

test('no longer advertises the retired three-tier membership prices', () => {
  renderLittleMovers()
  // Replaced by the single $89 unlimited membership on 2026-08-03.
  for (const retired of ['$39', '$69', '$99', 'Mini Membership', 'Explorer Membership', 'Adventure Membership']) {
    expect(screen.queryByText(new RegExp(retired.replace('$', '\\$')))).not.toBeInTheDocument()
  }
})

test('every pricing card explains what the option actually is', () => {
  renderLittleMovers()
  for (const card of screen.getAllByTestId('pricing-card')) {
    const label = card.querySelector('p:nth-of-type(1)').textContent
    // The blurb sits between the unit line and the checklist; a price alone is not
    // enough for a parent to tell these three apart.
    const paragraphs = [...card.querySelectorAll('p')].map((p) => p.textContent.trim())
    const hasBlurb = paragraphs.some((t) => t.length > 60)
    expect(hasBlurb, `${label} has no explanatory blurb`).toBe(true)
  }
})

test('both register CTAs point at the studio portal in a new tab', () => {
  renderLittleMovers()
  const links = screen.getAllByRole('link', { name: 'Register Today →' })
  expect(links).toHaveLength(2)
  for (const link of links) {
    expect(link).toHaveAttribute('href', PORTAL_REGISTER_URL)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
})

test('closing call to action reads as the studio wrote it', () => {
  renderLittleMovers()
  expect(screen.getByRole('heading', { name: 'Ready to Get Moving?' })).toBeInTheDocument()
  expect(screen.getByText(/Join the Little Movers family/)).toBeInTheDocument()
})
