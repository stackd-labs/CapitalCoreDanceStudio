import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LittleMovers from './LittleMovers'
import { ACCENTS } from '../lib/pageAccents'

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

test('credits the Ms. Ryan partnership on the class card, not in the schedule', () => {
  renderLittleMovers()
  // The studio asked for the schedule table to carry class name and age range only,
  // so the partnership is credited once, on the Moovin' & Groovin' card.
  const partners = screen.getAllByTestId('class-partner')
  expect(partners).toHaveLength(1)
  expect(partners[0].textContent).toBe('Our signature class, in partnership with Ms. Ryan')
  expect(partners[0].closest('[data-testid="little-movers-class"]').textContent).toContain(
    "Moovin' & Groovin'"
  )

  // Nothing in either schedule view names an instructor.
  for (const testid of ['schedule-table', 'schedule-list']) {
    expect(within(screen.getByTestId(testid)).queryByText(/Ms\. Ryan/)).not.toBeInTheDocument()
  }
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

test('the coming-soon banner is gold, deliberately off the page accent', () => {
  // Requested by the studio 2026-08-13. The banner is a temporary status, not part of
  // the Little Movers identity, so it does not wear the page's teal — which is also
  // what stops a future "make everything the accent" tidy-up from reverting it.
  renderLittleMovers()
  const banner = screen.getByTestId('coming-soon-banner')
  expect(banner).toHaveStyle({ background: ACCENTS.gold })
  expect(banner).not.toHaveStyle({ background: ACCENTS.teal })
  expect(banner).toHaveTextContent(/Coming soon — a brand new program/)
})

test('says coming soon rather than inviting registration', () => {
  renderLittleMovers()
  // Registration is not open yet, so the page must say so in the banner, the header,
  // and near the schedule and pricing.
  expect(screen.getByText(/Coming soon — a brand new program/)).toBeInTheDocument()
  expect(screen.getByText(/Registration isn't open yet/)).toBeInTheDocument()
  expect(screen.getByText(/start dates are coming soon/)).toBeInTheDocument()
  expect(screen.getByText(/registration opens soon/)).toBeInTheDocument()
})

test('every call to action goes to Contact, not the registration portal', () => {
  renderLittleMovers()
  // The portal has no Little Movers classes to select, so sending a parent there
  // would be a dead end. Guard against the portal link being restored early.
  const links = [...document.querySelectorAll('a[href]')]
  const portalLinks = links.filter((a) => a.getAttribute('href').includes('studio.capitalcoredance.com'))
  expect(portalLinks).toHaveLength(0)

  expect(screen.getByRole('link', { name: 'Contact Us →' })).toHaveAttribute('href', '/contact')
  expect(screen.getByRole('link', { name: 'Get in Touch →' })).toHaveAttribute('href', '/contact')
  expect(screen.queryByRole('link', { name: /Register Today/ })).not.toBeInTheDocument()
})

test('closing call to action reads as the studio wrote it', () => {
  renderLittleMovers()
  expect(screen.getByRole('heading', { name: 'Ready to Get Moving?' })).toBeInTheDocument()
  expect(screen.getByText(/Join the Little Movers family/)).toBeInTheDocument()
})

test('uses the teal solid wedge, and every action still avoids the registration portal', () => {
  // Little Movers is not open for registration, so no link may reach the studio portal.
  // The redesign rewired every action, which is exactly when this could slip.
  renderLittleMovers()
  expect(screen.getByTestId('hero-panel')).toBeInTheDocument()
  const portalLinks = [...document.querySelectorAll('a[href*="studio.capitalcoredance.com"]')]
  expect(portalLinks.map((a) => a.textContent)).toEqual([])
})

test('the schedule time column is a row header, not a data cell', () => {
  // Regression: it was briefly a <td>, which drops the row-header semantics screen
  // readers use to announce which time slot a class sits in.
  renderLittleMovers()
  const table = screen.getByTestId('schedule-table')
  const rowHeaders = within(table).getAllByRole('rowheader')
  expect(rowHeaders.map((th) => th.textContent)).toEqual(SLOTS)
})
