import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LittleMovers from './LittleMovers'
import { FAQS } from '../lib/faqs'
import { monthlyPriceForMinutes, priceToNumber } from '../lib/tuition'

// ONE class for now (2026-10-12): Moovin' & Groovin', ages 0–5, parents participate. The
// other five (Baby & Me, Parent & Me Dance, Tiny Tumblers, Sensory Steps, Free Play Lab) are
// off the page and must not creep back without the studio saying so.
const CLASSES = [["Moovin' & Groovin'", '0–5 years']]
const REMOVED = ['Baby & Me', 'Parent & Me', 'Tiny Tumblers', 'Sensory Steps', 'Free Play Lab']

// ONE class a week since 2026-10-08: Wednesday 10:00 to 11:00 AM. It was Monday / Wednesday
// / Friday in three 45-minute slots (9:30, 10:30, 11:30) until the studio cut it back.
const SLOT = '10:00 – 11:00 AM'
const DAYS_SHOWN = ['Wednesday']
const DAYS_GONE = ['Monday', 'Tuesday', 'Thursday', 'Friday']

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

test('the classes heading does not hardcode a count that can go stale', () => {
  renderLittleMovers()
  expect(screen.queryByText(/Six ways to move/i)).not.toBeInTheDocument()
})

test('renders only Moovin & Groovin, ages 0-5 with parents participating, none badged', () => {
  renderLittleMovers()
  const cards = screen.getAllByTestId('little-movers-class')
  expect(cards).toHaveLength(1)
  expect(cards[0].textContent).toMatch(/Parents and caregivers participate/)
  for (const gone of REMOVED) expect(document.body.textContent, gone).not.toContain(gone)
  cards.forEach((card, i) => {
    const [name, ages] = CLASSES[i]
    expect(card.textContent).toContain(name)
    expect(card.textContent).toContain(ages)
    // Every class must carry a description, not just a name and an age.
    expect(card.querySelector('p').textContent.trim().length).toBeGreaterThan(30)
    // The old "Coming soon" badge went with the Monday / Friday staffing note.
    expect(card.textContent).not.toMatch(/coming soon/i)
  })
})

test('the schedule is one Wednesday class, 10 to 11 AM', () => {
  renderLittleMovers()
  const table = screen.getByTestId('schedule-table')
  // One header row plus one time-slot row.
  const rows = within(table).getAllByRole('row')
  expect(rows).toHaveLength(2)

  expect(within(table).getByText(SLOT)).toBeInTheDocument()
  const headers = screen.getAllByTestId('schedule-day-header')
  expect(headers.map((h) => h.dataset.day)).toEqual(DAYS_SHOWN)
  expect(within(rows[1]).getAllByRole('cell')).toHaveLength(1)
  expect(within(table).getByTestId('schedule-entry').textContent).toMatch(/Moovin/)
  expect(within(table).getByTestId('schedule-entry').textContent).toContain('0–5 years')

  // The mobile list carries the same single slot.
  const list = screen.getByTestId('schedule-list')
  expect(within(list).getAllByTestId('schedule-entry')).toHaveLength(1)
  expect(within(list).getByText('Wednesday')).toBeInTheDocument()
  expect(within(list).getByText(SLOT)).toBeInTheDocument()
})

test('Monday, Tuesday, Thursday and Friday are off the schedule and nothing says "not booking yet"', () => {
  renderLittleMovers()
  const table = screen.getByTestId('schedule-table')
  const list = screen.getByTestId('schedule-list')
  for (const day of DAYS_GONE) {
    expect(within(table).queryByText(day), `${day} in the table`).not.toBeInTheDocument()
    expect(within(list).queryByText(day), `${day} in the mobile list`).not.toBeInTheDocument()
  }
  expect(screen.queryByTestId('day-not-bookable')).not.toBeInTheDocument()
  expect(screen.queryByTestId('staffing-note')).not.toBeInTheDocument()
  expect(screen.queryByText(/staffing up/i)).not.toBeInTheDocument()
})

test('the page says the class is Wednesday 10 to 11 AM', () => {
  renderLittleMovers()
  expect(screen.getByRole('heading', { name: /Wednesday mornings, 10 to 11 AM/ })).toBeInTheDocument()
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
  expect(description).toMatch(/Wednesday mornings from 10 to 11 AM/)
  expect(description).not.toMatch(/9:30|10:30|11:30|Monday|Friday/)
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

test('the membership is greyed out, unpriced, and points to the studio', () => {
  // Paused 2026-10-12: visible but not bookable, so no price and no perks are advertised.
  renderLittleMovers()
  const membership = screen.getAllByTestId('pricing-card')[2]
  expect(membership).toHaveAttribute('aria-disabled', 'true')
  expect(membership.className).toMatch(/opacity-50/)
  expect(membership.textContent).toMatch(/contact the studio/i)
  expect(membership.textContent).not.toMatch(/$89|$24|Tiny Core|Best value/)
})

test('states the class length range and that no class is drop-off', () => {
  // The studio settled it on 2026-08-19 — a caregiver always stays. This is a promise a
  // parent chooses the programme on, so it is pinned. The "45 minutes" claim went with the
  // three-slot grid: the class is now one hour.
  renderLittleMovers()
  expect(screen.getByText(/once a week, on Wednesday mornings from 10:00 to 11:00 AM/)).toBeInTheDocument()
  expect(screen.getByText(/No\s+Little Movers\s+class is drop-off/i)).toBeInTheDocument()
  expect(screen.getByText(/stay in the\s+class or wait in the studio/i)).toBeInTheDocument()
})

test('renders the three ways to join, each framed by how often a family comes', () => {
  renderLittleMovers()
  const cards = screen.getAllByTestId('pricing-card')
  expect(cards).toHaveLength(3)

  // Drop-in: one flat price per class, no sibling rate.
  expect(cards[0].textContent).toContain('Just want to try it?')
  expect(cards[0].textContent).toContain('Drop-In')
  expect(cards[0].textContent).toContain('$10')
  expect(cards[0].textContent).toContain('per class')
  expect(cards[0].textContent).not.toMatch(/first child|additional (child|sibling)/i)

  // Passport
  expect(cards[1].textContent).toContain('Come when you can')
  expect(cards[1].textContent).toContain('Little Movers Passport')
  expect(cards[1].textContent).toContain('5 visits — $40')
  expect(cards[1].textContent).toContain('10 visits — $80')

  // Membership: paused, greyed out, no price.
  expect(cards[2].textContent).toContain("We're here every week")
  expect(cards[2].textContent).toContain('Little Movers Membership')
  expect(cards[2].textContent).toMatch(/contact the studio/i)
})

test('🔴 no discount is advertised anywhere on the page: no sibling rates, no promo code', () => {
  // The studio's call, 2026-10-08, "for now": sibling rates, the MOOVE26 code and the
  // membership's 10% off parties / retail all came off the site. The PORTAL still applies
  // them at checkout; that is on the portal punch list. Nothing here may bring them back
  // by accident.
  renderLittleMovers()
  expect(screen.queryByTestId('promo-note')).not.toBeInTheDocument()
  expect(screen.queryByTestId('pricing-promo')).not.toBeInTheDocument()
  expect(screen.queryByTestId('pricing-sibling')).not.toBeInTheDocument()
  const text = document.body.textContent
  expect(text).not.toMatch(/MOOVE26/)
  expect(text).not.toMatch(/sibling/i)
  expect(text).not.toMatch(/\d+% off/i)
  expect(text).not.toMatch(/additional (child|member)/i)

  const pricingFaq = FAQS.flatMap((c) => c.items).find((f) =>
    /how much does little movers cost/i.test(f.q)
  )
  expect(pricingFaq, 'the Little Movers pricing FAQ must exist to be checked').toBeTruthy()
  expect(pricingFaq.a).not.toMatch(/MOOVE26|sibling|additional child|% off/i)
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

test('the finished open house is gone from the page and its meta description', () => {
  // The 2 September 2026 event is over and the whole block came out 2026-09-02.
  renderLittleMovers()
  expect(screen.queryByTestId('open-house')).not.toBeInTheDocument()
  expect(screen.queryByText(/Open House/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/Save my spot/)).not.toBeInTheDocument()

  const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
  expect(description).toBeTruthy()
  expect(description).not.toMatch(/open house/i)
  expect(description).not.toMatch(/September 2/)
})

test('the persistent call to action books a Little Movers class on the portal', () => {
  // The portal moved this form to the /book path on 2026-09-02. The bare
  // /register/little-movers URL is no longer the booking page, so the exact path is
  // pinned rather than a /register/little-movers prefix match.
  renderLittleMovers()
  const bookLinks = screen.getAllByRole('link', { name: 'Book a class →' })
  expect(bookLinks).toHaveLength(2) // hero and closing band
  for (const link of bookLinks) {
    expect(link).toHaveAttribute(
      'href',
      'https://studio.capitalcoredance.com/register/little-movers/book'
    )
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
})

test('no copy still claims registration is closed', () => {
  renderLittleMovers()
  expect(screen.queryByText(/Registration isn't open yet/)).not.toBeInTheDocument()
  expect(screen.queryByText(/start dates are coming soon/)).not.toBeInTheDocument()
  expect(screen.queryByText(/registration opens soon/)).not.toBeInTheDocument()
  expect(screen.queryByText(/More details coming soon/)).not.toBeInTheDocument()
})

test('closing call to action reads as the studio wrote it', () => {
  renderLittleMovers()
  expect(screen.getByRole('heading', { name: 'Ready to Get Moving?' })).toBeInTheDocument()
  expect(screen.getByText(/Join the Little Movers family/)).toBeInTheDocument()
})

test('uses the teal solid wedge, and reaches only the Little Movers booking form', () => {
  // Every portal link on this page must be a Little Movers destination. The general
  // /register/classes form has no Little Movers class to select.
  //
  // Scoped past the footer: the shared footer has a portal sign-in button that renders on
  // every page, with its own coverage in Footer.test.jsx.
  renderLittleMovers()
  expect(screen.getByTestId('hero-panel')).toBeInTheDocument()
  const portalHrefs = [
    ...document.querySelectorAll('a[href*="studio.capitalcoredance.com"]'),
  ]
    .filter((a) => !a.closest('footer'))
    .map((a) => a.getAttribute('href'))
  expect(portalHrefs.length).toBeGreaterThan(0)
  for (const href of portalHrefs) {
    expect(href).toBe('https://studio.capitalcoredance.com/register/little-movers/book')
  }
})

test('the schedule time column is a row header, not a data cell', () => {
  // Regression: it was briefly a <td>, which drops the row-header semantics screen
  // readers use to announce which time slot a class sits in.
  renderLittleMovers()
  const table = screen.getByTestId('schedule-table')
  const rowHeaders = within(table).getAllByRole('rowheader')
  expect(rowHeaders.map((th) => th.textContent)).toEqual([SLOT])
})

test('the schedule comes first, right after the hero and before the class card', () => {
  renderLittleMovers()
  const schedule = document.getElementById('schedule')
  const card = screen.getByTestId('little-movers-class')
  expect(schedule.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  const hero = screen.getByRole('heading', { level: 1 })
  expect(hero.compareDocumentPosition(schedule) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  const priorSections = [...document.querySelectorAll('main section')].filter(
    (sec) => sec.compareDocumentPosition(schedule) & Node.DOCUMENT_POSITION_FOLLOWING
  )
  expect(priorSections.filter((sec) => !sec.contains(hero))).toHaveLength(0)
})
