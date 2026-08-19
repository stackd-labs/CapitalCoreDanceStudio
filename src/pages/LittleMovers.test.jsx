import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LittleMovers from './LittleMovers'
import { ACCENTS } from '../lib/pageAccents'

// The six classes and their age ranges. Widened 2026-08-17 at the studio's request so the
// morning hands off cleanly at 18 months: Baby & Me runs 0–18 months, and every class after
// it takes 18 months–5 years. Parent & Me Dance keeps the flyer's 18 months–3 years — it is
// currently dormant (Tuesday/Thursday only) and the studio did not revise it.
const CLASSES = [
  ['Baby & Me', '0–18 months'],
  ['Parent & Me Dance', '18 months–3 years'],
  ["Moovin' & Groovin'", '18 months–5 years'],
  ['Tiny Tumblers', '18 months–5 years'],
  ['Sensory Steps', '18 months–5 years'],
  ['Little Movers Free Play Lab', '18 months–5 years'],
]

// Three 45-minute morning slots with a 15-minute gap between them, first bell 9:30 AM —
// the studio's revision of 2026-08-17. The flyer's original grid ran them back to back
// (9:30 / 10:15 / 11:00), which left no room to clear one class out and settle the next in.
const SLOTS = ['9:30 – 10:15 AM', '10:30 – 11:15 AM', '11:30 AM – 12:15 PM']

// Parses either label form: '9:30 – 10:15 AM' (one shared meridiem) or
// '11:30 AM – 12:15 PM' (one each, because that slot crosses noon).
function parseSlot(label) {
  const [left, right] = label.split('–').map((s) => s.trim())
  const meridiemOf = (s) => s.match(/(AM|PM)/i)?.[1]?.toUpperCase()
  const toMinutes = (part, fallback) => {
    const [, h, m, mer] = part.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i)
    const meridiem = (mer || fallback).toUpperCase()
    return ((Number(h) % 12) + (meridiem === 'PM' ? 12 : 0)) * 60 + Number(m)
  }
  return {
    start: toMinutes(left, meridiemOf(left) || meridiemOf(right)),
    end: toMinutes(right, meridiemOf(right) || meridiemOf(left)),
  }
}
// Monday/Wednesday/Friday only as of 2026-08-17 — Tuesday and Thursday came off the
// public schedule (their line-ups are kept dormant in the page source). All three days
// open the same way and differ only in the last slot.
const EXPECTED = {
  Monday: ['Baby & Me', "Moovin' & Groovin'", 'Tiny Tumblers'],
  Wednesday: ['Baby & Me', "Moovin' & Groovin'", 'Sensory Steps'],
  Friday: ['Baby & Me', "Moovin' & Groovin'", 'Little Movers Free Play Lab'],
}
const DORMANT_DAYS = ['Tuesday', 'Thursday']

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

test('a class that is not on the published schedule is badged Coming soon', () => {
  // Parent & Me Dance ran only on Tuesday and Thursday, so when those days went dormant
  // (2026-08-17) it was left listed among the classes but bookable on no day — a parent
  // could read about it and never find when it meets. The badge is derived from SCHEDULE
  // rather than hand-set, so it appears and disappears on its own as days change.
  renderLittleMovers()
  const cardFor = (name) =>
    [...screen.getAllByTestId('little-movers-class')].find((c) =>
      c.querySelector('[data-testid="class-name"]').textContent.includes(name)
    )
  const unscheduled = cardFor('Parent & Me Dance')
  expect(unscheduled.querySelector('[data-testid="class-coming-soon"]')).toBeInTheDocument()
  expect(unscheduled.textContent).toMatch(/coming soon/i)

  // Everything on the grid must NOT be badged, or the badge means nothing.
  for (const name of ['Baby & Me', "Moovin' & Groovin'", 'Tiny Tumblers', 'Sensory Steps']) {
    expect(
      cardFor(name).querySelector('[data-testid="class-coming-soon"]'),
      `${name} is on the schedule and must not be badged`
    ).toBeNull()
  }
})

test('the classes heading does not hardcode a count that can go stale', () => {
  // It read "Six ways to move" while only five classes were actually scheduled.
  renderLittleMovers()
  expect(screen.queryByText(/Six ways to move/i)).not.toBeInTheDocument()
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
    expect(cells).toHaveLength(3)
    Object.keys(EXPECTED).forEach((day, dayIndex) => {
      expect(cells[dayIndex].textContent, `${day} ${slot}`).toContain(EXPECTED[day][slotIndex])
    })
  })
})

test('the mobile list carries the same nine slots', () => {
  renderLittleMovers()
  const list = screen.getByTestId('schedule-list')
  expect(within(list).getAllByTestId('schedule-entry')).toHaveLength(9)
  for (const day of Object.keys(EXPECTED)) {
    expect(within(list).getByText(day)).toBeInTheDocument()
  }
})

test('Tuesday and Thursday are off the published schedule', () => {
  // Kept in the page source but dormant, so they can be switched back on without
  // rebuilding the grid. Nothing a parent reads may still offer them.
  renderLittleMovers()
  const table = screen.getByTestId('schedule-table')
  const list = screen.getByTestId('schedule-list')
  for (const day of DORMANT_DAYS) {
    expect(within(table).queryByText(day), `${day} in the table`).not.toBeInTheDocument()
    expect(within(list).queryByText(day), `${day} in the mobile list`).not.toBeInTheDocument()
  }
})

test('all three days share an opening line-up and differ only in the last slot', () => {
  // This is the shape the studio asked for: one predictable morning pattern, with the
  // third class as the reason to pick a particular day.
  const days = Object.keys(EXPECTED)
  for (const slotIndex of [0, 1]) {
    const atSlot = new Set(days.map((d) => EXPECTED[d][slotIndex]))
    expect(atSlot.size, `slot ${slotIndex} should be identical across days`).toBe(1)
  }
  const lastSlot = days.map((d) => EXPECTED[d][2])
  expect(new Set(lastSlot).size, 'each day needs its own last class').toBe(days.length)
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

test('the membership includes a Tiny Core class and shows the top-up from $65', () => {
  // Added 2026-08-17. The $24 is not a new price — it is $89 minus the $65 a Tiny Core
  // class already costs, so a family reading either page reaches the same number.
  renderLittleMovers()
  const membership = screen.getAllByTestId('pricing-card')[2]
  expect(membership.textContent).toContain('$89')
  expect(membership.textContent).toMatch(/One Tiny Core class/i)
  expect(membership.textContent).toContain('2–5')
  expect(membership.textContent).toContain('$24')
})

test('every slot is 45 minutes, gapped by 15, starting at 9:30', () => {
  // Asserts the shape of the schedule rather than three literal strings, so a future edit
  // that mistypes one time is caught as a broken pattern instead of passing whatever it
  // says. This is the invariant the studio asked for on 2026-08-17.
  const slots = SLOTS.map(parseSlot)
  expect(slots[0].start).toBe(9 * 60 + 30)
  for (const { start, end } of slots) {
    expect(end - start).toBe(45)
  }
  for (let i = 1; i < slots.length; i += 1) {
    expect(slots[i].start - slots[i - 1].end).toBe(15)
  }
})

test('states the class length and who stays for the caregiver classes', () => {
  // The page used to call the whole programme drop-off, which its own class list
  // contradicts: Baby & Me is 0–18 months and Parent & Me Dance is built for toddlers
  // and caregivers. The blanket claim came out on 2026-08-19. If it comes back, this
  // fails.
  renderLittleMovers()
  expect(screen.getByText(/Every class runs 45 minutes/)).toBeInTheDocument()
  expect(screen.getByText(/taken together with a caregiver/i)).toBeInTheDocument()
  expect(screen.queryByText(/drop-off program/i)).not.toBeInTheDocument()
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
  // The sibling rate, added 2026-08-17: $10 covers the first child, each additional $3.
  expect(cards[0].textContent).toContain('first child')
  expect(cards[0].textContent).toContain('$3')
  expect(cards[0].textContent).toMatch(/additional (child|sibling)/i)

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

test('membership lists unlimited classes, the Tiny Core inclusion, and all five perks', () => {
  // The Tiny Core class and the $24 top-up were inserted directly after the unlimited
  // line on 2026-08-17 — deliberately above the perks, because they are what the money
  // buys rather than an extra that comes with it.
  renderLittleMovers()
  const membership = screen.getAllByTestId('pricing-card')[2]
  const lines = [...membership.querySelectorAll('[data-testid="pricing-line"]')].map((el) =>
    el.textContent.replace('✓', '').trim()
  )
  expect(lines).toEqual([
    'Unlimited Little Movers classes',
    'One Tiny Core class included (ages 2–5, your choice of day)',
    'Already in a Tiny Core class? Just $24 more a month',
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
