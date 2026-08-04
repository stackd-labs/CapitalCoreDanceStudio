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

test('credits Ms. Ryan on the Wednesday Moovin & Groovin only', () => {
  renderLittleMovers()
  // The flyer marks exactly one class as hers; it appears once in the table and once
  // in the mobile list.
  expect(screen.getAllByText('with Ms. Ryan')).toHaveLength(2)
})

test('states that every class is 45 minutes and drop-off', () => {
  renderLittleMovers()
  expect(screen.getByText(/Every class runs 45 minutes/)).toBeInTheDocument()
  expect(screen.getByText(/drop-off program/i)).toBeInTheDocument()
})

test('renders the three pricing options with their exact figures', () => {
  renderLittleMovers()
  const cards = screen.getAllByTestId('pricing-card')
  expect(cards).toHaveLength(3)
  const text = cards.map((c) => c.textContent).join(' ')
  expect(text).toContain('$10')
  expect(text).toContain('5 visits — $45')
  expect(text).toContain('10 visits — $85')
  expect(text).toContain('Mini Membership — $39/month')
  expect(text).toContain('Explorer Membership — $69/month')
  expect(text).toContain('Adventure Membership — $99/month')
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
