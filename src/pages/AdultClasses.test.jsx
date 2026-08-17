import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdultClasses from './AdultClasses'
import { SCHEDULE } from '../lib/schedule'
import {
  ADULT_PRICING,
  CLASS_PRICES,
  classLengthMinutes,
  monthlyPriceForMinutes,
  priceToNumber,
} from '../lib/tuition'
import { ACCENTS } from '../lib/pageAccents'

// The dedicated adult form, not the general one. Pinned as its own constant because
// sending a 16+ dancer to /register/classes puts them in the youth flow — that form asks
// for a parent/guardian and tells adults to use this one instead.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/adult-classes'

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

test('wears its own lavender, not the Classes orange', () => {
  // Recoloured from purple 2026-08-13. The point of the test is unchanged: Adults is a
  // separate audience and must not borrow the youth-classes colour.
  renderAdultClasses()
  expect(screen.getByTestId('hero-panel')).toHaveStyle({ background: ACCENTS.lavender })
  expect(screen.getByTestId('hero-panel')).not.toHaveStyle({ background: ACCENTS.orange })
})

test('does not stack two identical register buttons in the same eyeful', () => {
  // The hero action and the reassurance strip sat a hundred pixels apart both saying
  // "Register for Fall →". The strip is now text only.
  renderAdultClasses()
  expect(screen.getAllByRole('link', { name: 'Register for Fall →' })).toHaveLength(2)
})

test('each class quotes the tuition rate for its own length, not a typed-in figure', () => {
  // Same defect class as the day/time above: a price copied onto this page would keep
  // rendering happily after the studio reprices a length or shortens a class. Every
  // expectation here is computed from SCHEDULE plus the shared tuition table.
  renderAdultClasses()
  const prices = screen.getAllByTestId('adult-class-price').map((el) => el.textContent)
  expect(prices).toHaveLength(3)
  ADULT_INFO_KEYS.forEach((infoKey, i) => {
    const row = SCHEDULE_ROWS_BY_INFO_KEY[infoKey]
    const minutes = classLengthMinutes(row)
    expect(prices[i], `${infoKey} length`).toContain(`${minutes} min`)
    expect(prices[i], `${infoKey} price`).toContain(monthlyPriceForMinutes(minutes))
  })
})

test('the headline price is the published rate for the length every class shares', () => {
  // The band only stands while one rate covers all three classes. If the studio ever
  // lengthens one, this test is the thing that notices the headline has to go — the
  // per-class prices above carry on being right either way.
  const lengths = new Set(
    ADULT_INFO_KEYS.map((k) => classLengthMinutes(SCHEDULE_ROWS_BY_INFO_KEY[k]))
  )
  expect(lengths.size, 'adult classes no longer share one length — drop the headline band').toBe(1)

  const [minutes] = [...lengths]
  renderAdultClasses()
  expect(screen.getByTestId('adult-headline-price')).toHaveTextContent(
    monthlyPriceForMinutes(minutes)
  )
  expect(screen.getByText(new RegExp(`Every adult class runs ${minutes} minutes`))).toBeInTheDocument()
})

test('the tuition page and the adults page cannot quote different rates', () => {
  // Both now read CLASS_PRICES. This asserts the shared table is genuinely the source
  // the page rendered from, so re-introducing a local copy on either page fails here.
  renderAdultClasses()
  const minutes = classLengthMinutes(SCHEDULE_ROWS_BY_INFO_KEY['Adult Femme Flair'])
  const fromTable = CLASS_PRICES.find((p) => p.minutes === minutes)
  expect(fromTable, `no published rate for a ${minutes}-minute class`).toBeTruthy()
  expect(screen.getByTestId('adult-headline-price')).toHaveTextContent(fromTable.monthly)
})

test('offers three ways to pay, each at the figure the tuition module holds', () => {
  renderAdultClasses()
  expect(screen.getAllByTestId('adult-price-card')).toHaveLength(3)

  const minutes = classLengthMinutes(SCHEDULE_ROWS_BY_INFO_KEY['Adult Femme Flair'])
  expect(screen.getByTestId('adult-headline-price')).toHaveTextContent(
    monthlyPriceForMinutes(minutes)
  )
  expect(screen.getByTestId('adult-pass-price')).toHaveTextContent(
    `$${ADULT_PRICING.unlimitedMonthly}`
  )
  expect(screen.getByTestId('adult-dropin-price')).toHaveTextContent(`$${ADULT_PRICING.dropIn}`)
  expect(screen.getByTestId('adult-price-badge')).toHaveTextContent('Best value')
})

test('the pass works out its own saving rather than quoting a typed one', () => {
  // The saving is the difference between the pass and paying for every adult class
  // separately. Repricing either figure must move this number, not leave a stale one on
  // the page — which a hard-coded "$90" would.
  const single = priceToNumber(monthlyPriceForMinutes(45))
  const expected = single * ADULT_INFO_KEYS.length - ADULT_PRICING.unlimitedMonthly

  renderAdultClasses()
  const pass = screen.getByTestId('adult-pass-price').closest('[data-testid="adult-price-card"]')
  expect(pass).toHaveTextContent(`$${expected} a month`)
  expect(pass).toHaveTextContent(`all ${ADULT_INFO_KEYS.length} adult classes`)
})

test('the "less than the price of two" claim appears only while it is arithmetically true', () => {
  // $165 against $85 is true today by $5. It is one repricing away from being false, and
  // a page that kept saying it would be advertising a discount the studio does not give.
  const single = priceToNumber(monthlyPriceForMinutes(45))
  const beatsTwo = ADULT_PRICING.unlimitedMonthly < single * 2

  renderAdultClasses()
  const pass = screen.getByTestId('adult-pass-price').closest('[data-testid="adult-price-card"]')
  if (beatsTwo) {
    expect(pass).toHaveTextContent('for less than the price of two')
  } else {
    expect(pass).not.toHaveTextContent('price of two')
  }
})

test('the free-trial offer is a link to Contact, not a dead sentence', () => {
  // Booking a free class goes through the studio, not the registration portal, so the
  // sentence that makes the offer has to be the way to take it up.
  renderAdultClasses()
  expect(screen.getByTestId('free-trial-link')).toHaveAttribute('href', '/contact')
  expect(screen.getByRole('link', { name: 'Book a Free Class' })).toHaveAttribute(
    'href',
    '/contact'
  )
})

test('carries no leftover light-theme surfaces', () => {
  renderAdultClasses()
  const white = [...document.querySelectorAll('[class*="bg-white"]')].filter(
    (el) => !/bg-white\/\[?\d/.test(el.className)
  )
  expect(white.map((el) => el.className)).toEqual([])
})
