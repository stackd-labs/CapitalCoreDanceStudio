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
  // Sentence case since the 2026-08-11 conversion, matching every other hero; still
  // "Adult Classes" in the nav and the URL.
  expect(screen.getByRole('heading', { level: 1, name: 'Adult classes' })).toBeInTheDocument()
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

test('the evening window is derived from the schedule, not typed out', () => {
  // This line read "between 7:00 and 9:00 PM" as a literal and nearly went stale when
  // Friday's Adult Contemporary was shortened. It must track the real earliest start
  // and latest end of the three adult classes.
  renderAdultClasses()
  const bullets = screen.getAllByTestId('adult-info-bullet').map((el) => el.textContent)
  const window = bullets.find((b) => /run in the evening/.test(b))
  expect(window).toBeTruthy()
  // Mon 8:00–8:45, Wed 7:30–8:15, Fri 7:00–7:45 → earliest 7:00, latest 8:45.
  expect(window).toContain('between 7:00 and 8:45 PM')
  expect(window).not.toContain('9:00')
})

test('wears its own purple, not the Classes orange', () => {
  renderAdultClasses()
  expect(screen.getByTestId('hero-panel')).toHaveStyle({ background: '#9b3df0' })
})

test('does not stack two identical register buttons in the same eyeful', () => {
  // The hero action and the reassurance strip sat a hundred pixels apart both saying
  // "Register for Fall →". The strip is now text only.
  renderAdultClasses()
  expect(screen.getAllByRole('link', { name: 'Register for Fall →' })).toHaveLength(2)
})

test('carries no leftover light-theme surfaces', () => {
  renderAdultClasses()
  const white = [...document.querySelectorAll('[class*="bg-white"]')].filter(
    (el) => !/bg-white\/\[?\d/.test(el.className)
  )
  expect(white.map((el) => el.className)).toEqual([])
})
