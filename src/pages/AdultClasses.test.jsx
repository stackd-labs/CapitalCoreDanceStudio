import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdultClasses from './AdultClasses'
import { SCHEDULE } from '../lib/schedule'

const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

// Day and time are derived from SCHEDULE (the single source of truth), not
// hard-coded here — a hard-coded copy is exactly the defect this page's day/time
// used to have: SCHEDULE could change and this fixture would keep passing against
// its own stale numbers. Deriving both from the same source means the two can no
// longer disagree.
const SCHEDULE_ROWS_BY_INFO_KEY = SCHEDULE.flatMap(({ day, classes }) =>
  classes.map((c) => ({ ...c, day }))
).reduce((acc, row) => {
  acc[row.infoKey] = row
  return acc
}, {})

const ADULT_INFO_KEYS = ['Adult Femme Flair', 'Adult Pom', 'Adult Contemporary']

const CLASSES = ADULT_INFO_KEYS.map((infoKey) => {
  const row = SCHEDULE_ROWS_BY_INFO_KEY[infoKey]
  return { name: infoKey, day: row.day, time: row.time }
})

function renderAdultClasses() {
  return render(
    <MemoryRouter initialEntries={['/adult-classes']}>
      <AdultClasses />
    </MemoryRouter>
  )
}

test('renders page title', () => {
  renderAdultClasses()
  expect(screen.getByRole('heading', { name: 'Adult Classes' })).toBeInTheDocument()
})

test('renders all three adult classes in schedule order', () => {
  renderAdultClasses()
  const names = screen.getAllByTestId('adult-class-name').map((el) => el.textContent.trim())
  expect(names).toEqual(CLASSES.map((c) => c.name))
})

test('each class shows its day and time from the Fall schedule', () => {
  renderAdultClasses()
  const cards = screen.getAllByTestId('adult-class-card')
  expect(cards).toHaveLength(3)
  cards.forEach((card, i) => {
    const when = card.querySelector('[data-testid="adult-class-when"]').textContent
    expect(when).toContain(CLASSES[i].day)
    expect(when).toContain(CLASSES[i].time)
  })
})

test('each rendered day/time matches the SCHEDULE row with that infoKey', () => {
  // Independent of the CLASSES fixture above: reads SCHEDULE directly by infoKey so
  // this still catches drift even if the fixture itself were ever hard-coded again.
  renderAdultClasses()
  const whens = screen.getAllByTestId('adult-class-when').map((el) => el.textContent)
  ADULT_INFO_KEYS.forEach((infoKey, i) => {
    const row = SCHEDULE_ROWS_BY_INFO_KEY[infoKey]
    expect(whens[i], `${infoKey} when`).toContain(row.day)
    expect(whens[i], `${infoKey} when`).toContain(row.time)
  })
})

test('every class has a non-empty description', () => {
  renderAdultClasses()
  for (const card of screen.getAllByTestId('adult-class-card')) {
    const name = card.querySelector('[data-testid="adult-class-name"]').textContent.trim()
    const description = card.querySelector('[data-testid="adult-class-description"]')
    expect(description, `${name} is missing a description`).not.toBeNull()
    expect(description.textContent.trim().length).toBeGreaterThan(60)
  }
})

test('states the 16+ age requirement and that no experience is needed', () => {
  renderAdultClasses()
  const bullets = screen.getAllByTestId('adult-info-bullet').map((el) => el.textContent.trim())
  expect(bullets).toContain('Adult classes are for dancers ages 16 and up.')
  expect(bullets).toContain('No dance experience necessary.')
})

test('links to the register portal, the schedule, and tuition', () => {
  renderAdultClasses()
  const registerLinks = screen.getAllByRole('link', { name: 'Register for Fall →' })
  expect(registerLinks).toHaveLength(2)
  for (const link of registerLinks) {
    expect(link).toHaveAttribute('href', PORTAL_REGISTER_URL)
    expect(link).toHaveAttribute('target', '_blank')
  }
  expect(screen.getByRole('link', { name: 'full schedule' })).toHaveAttribute('href', '/classes')
  // The Footer also carries a Tuition link, so there are two on the page by design.
  const tuitionLinks = screen.getAllByRole('link', { name: 'Tuition' })
  expect(tuitionLinks.length).toBeGreaterThan(0)
  for (const link of tuitionLinks) {
    expect(link).toHaveAttribute('href', '/tuition')
  }
})
