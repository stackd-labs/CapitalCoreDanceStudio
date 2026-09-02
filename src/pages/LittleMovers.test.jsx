import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LittleMovers from './LittleMovers'
import { ACCENTS } from '../lib/pageAccents'
import { FAQS } from '../lib/faqs'
import { monthlyPriceForMinutes, priceToNumber } from '../lib/tuition'

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

test('a class that cannot actually be booked is badged Coming soon', () => {
  // Parent & Me Dance ran only on Tuesday and Thursday, so when those days went dormant
  // (2026-08-17) it was left listed among the classes but bookable on no day — a parent
  // could read about it and never find when it meets.
  //
  // Widened 2026-09-02: the badge now means "not bookable", not "not on the grid". Monday
  // and Friday are published but unstaffed, and the portal offers Wednesdays only, so
  // Tiny Tumblers (Monday) and the Free Play Lab (Friday) are in the same position Parent
  // & Me Dance is — described on the page, impossible to book. The badge is derived from
  // SCHEDULE filtered by BOOKABLE_DAYS rather than hand-set, so adding a staffed day
  // clears the right badges on its own.
  renderLittleMovers()
  const cardFor = (name) =>
    [...screen.getAllByTestId('little-movers-class')].find((c) =>
      c.querySelector('[data-testid="class-name"]').textContent.includes(name)
    )

  for (const name of ['Parent & Me Dance', 'Tiny Tumblers', 'Little Movers Free Play Lab']) {
    const card = cardFor(name)
    expect(
      card.querySelector('[data-testid="class-coming-soon"]'),
      `${name} cannot be booked and must be badged`
    ).toBeInTheDocument()
    expect(card.textContent).toMatch(/coming soon/i)
  }

  // The Wednesday line-up must NOT be badged, or the badge means nothing.
  for (const name of ['Baby & Me', "Moovin' & Groovin'", 'Sensory Steps']) {
    expect(
      cardFor(name).querySelector('[data-testid="class-coming-soon"]'),
      `${name} runs on a bookable day and must not be badged`
    ).toBeNull()
  }
})

test('🔴 OPENING A DAY IS A TWO-REPO CHANGE — read this before editing BOOKABLE_DAYS', () => {
  // This test exists to be tripped. It has no assertion the test above does not already
  // make; its job is to force whoever opens Monday or Friday to read the instruction,
  // because a comment in LittleMovers.jsx did not survive being the only place it was
  // written down.
  //
  // ▶ TO OPEN A STAFFED DAY, both of these ship together:
  //
  //   1. THIS REPO — add the day to BOOKABLE_DAYS in src/pages/LittleMovers.jsx.
  //      Controls what the page CLAIMS. Alone, it advertises a day the wizard rejects.
  //
  //   2. THE PORTAL — dancestudioportal, drop `comingSoon` from that day's slots in
  //      src/lib/little-movers-pricing.ts (LM_SCHEDULE), and check the generate_series
  //      bounds in supabase/.../little_movers_classes.sql actually create sessions for
  //      it. Controls what the wizard ACCEPTS. Alone, the day is bookable but this page
  //      still greys it out and says "Not booking yet".
  //
  // Then revisit: the membership pitch and the drop-in copy both soften as days open,
  // and the Wednesday-only line in the schedule note stops being true.
  //
  // The portal is the source of truth for money and availability. This page only ever
  // describes it — see the SIBLING comment for the same rule applied to pricing.
  renderLittleMovers()
  const bookable = screen
    .getAllByTestId('schedule-day-header')
    .filter((h) => h.dataset.bookable === 'yes')
    .map((h) => h.dataset.day)
  expect(bookable).toEqual(['Wednesday'])
})

test('only Wednesday is offered as bookable on the schedule grid', () => {
  // 🔴 The mismatch this closes: the portal's booking wizard generates sessions for
  // Wednesdays only, so a parent who read "Monday 11:30 Tiny Tumblers" here, clicked Book
  // and found no Monday was sent to a dead end by this page.
  //
  // Monday and Friday still SHOW — a family should see the shape of the programme, and
  // hiding them would make the page look like a one-day programme it is not. They are
  // dimmed and labelled instead, which is exactly what the portal does.
  renderLittleMovers()

  const headers = screen.getAllByTestId('schedule-day-header')
  expect(headers.map((h) => h.dataset.day)).toEqual(['Monday', 'Wednesday', 'Friday'])
  expect(
    Object.fromEntries(headers.map((h) => [h.dataset.day, h.dataset.bookable]))
  ).toEqual({ Monday: 'no', Wednesday: 'yes', Friday: 'no' })

  // Every unstaffed day carries the label, in the table header and the mobile heading.
  expect(screen.getAllByTestId('day-not-bookable').length).toBeGreaterThanOrEqual(2)

  // Wednesday's three cells are the only ones marked bookable. Nine cells per breakpoint,
  // rendered twice (table + mobile list), so three of nine are bookable in each.
  const entries = screen.getAllByTestId('schedule-entry')
  const bookable = entries.filter((e) => e.dataset.bookable === 'yes')
  expect(entries.length).toBeGreaterThan(0)
  expect(bookable.length * 3).toBe(entries.length)
})

test('the page says out loud which mornings can be booked', () => {
  // Two dimmed columns with no explanation read as a rendering fault, or as cancelled
  // classes. The note has to name the open day and promise the others.
  renderLittleMovers()
  const note = screen.getByTestId('staffing-note')
  expect(note.textContent).toMatch(/Wednesday mornings are open for booking/i)
  expect(note.textContent).toMatch(/Monday and Friday/i)
  expect(note.textContent).toMatch(/not\s+bookable yet/i)
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
  //
  // Both figures are derived from tuition.js by the page, so this asserts the ARITHMETIC
  // rather than two literals: change the 30-minute price there and this test follows it
  // instead of going red for the wrong reason.
  renderLittleMovers()
  const membership = screen.getAllByTestId('pricing-card')[2]
  const tinyCore = priceToNumber(monthlyPriceForMinutes(30))
  expect(membership.textContent).toContain('$89')
  expect(membership.textContent).toMatch(/One Tiny Core class/i)
  expect(membership.textContent).toContain('2–5')
  expect(membership.textContent).toContain(`$${tinyCore}`) // the Tiny Core price itself
  expect(membership.textContent).toContain(`$${89 - tinyCore}`) // the top-up
})

test('the membership does not quote a break-even a family cannot reach', () => {
  // 🔴 It said "worth it from about nine classes a month" — true against the $10 drop-in,
  // but a child takes ONE age-appropriate slot a morning, and with only Wednesday
  // bookable that is about four classes a month. A break-even nobody can reach, printed
  // next to a "Best value" badge, is the kind of claim a parent does the maths on.
  //
  // The pitch leads with the included Tiny Core class instead, which is true at one
  // bookable morning and only gets better as days open — so it needs no revisiting when
  // Monday and Friday land. This test stops the old framing coming back with them.
  renderLittleMovers()
  const membership = screen.getAllByTestId('pricing-card')[2]
  expect(membership.textContent).not.toMatch(/nine classes/i)
  expect(membership.textContent).not.toMatch(/three mornings a week/i)
})

test('the page states that sibling rates and promo codes stack', () => {
  // Confirmed against the portal 2026-09-02: recomputeLittleMoversAmountDue calls
  // applyPromo(payload, passportTotal(payload)), so the sibling rate builds the subtotal
  // and the code comes off that total. Two 5-visit passes are $45 + $40.50 = $85.50, and
  // MOOVE26 takes it to $59.85.
  //
  // Left unsaid, this is a question a parent asks at the desk and a member of staff has
  // to guess at. Saying it is also the only way a family knows to use both.
  renderLittleMovers()
  const note = screen.getByTestId('promo-note')
  expect(note.textContent).toMatch(/sibling rate applies first/i)
  expect(note.textContent).toMatch(/discounted total/i)
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

test('states the class length and that no class is drop-off', () => {
  // The page used to call the whole programme drop-off, which its own class list
  // contradicts: Baby & Me is 0–18 months and Parent & Me Dance is built for toddlers
  // and caregivers. The studio settled it on 2026-08-19 — a caregiver always stays.
  // This is a promise a parent chooses the programme on, so it is pinned.
  renderLittleMovers()
  expect(screen.getByText(/Every class runs 45 minutes/)).toBeInTheDocument()
  expect(screen.getByText(/No Little Movers\s+class is drop-off/i)).toBeInTheDocument()
  expect(screen.getByText(/stay in the class or wait\s+in the studio/i)).toBeInTheDocument()
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
  // The sibling rate: $10 covers the first child, each additional $5. Added 2026-08-17 at
  // $3 and raised to $5 on 2026-09-02.
  expect(cards[0].textContent).toContain('first child')
  expect(cards[0].textContent).toContain('$5')
  expect(cards[0].textContent).not.toContain('$3') // the superseded rate
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

test('every pricing option states its own sibling rate', () => {
  // The studio 2026-09-02. Each product discounts a sibling differently, so the rate sits
  // on the card next to the price it modifies rather than as one blanket line a parent has
  // to apply themselves. All three cards carry one — unlike the promo, which the drop-in
  // deliberately lacks.
  renderLittleMovers()
  const cards = screen.getAllByTestId('pricing-card')
  const siblingOn = (card) => card.querySelector('[data-testid="pricing-sibling"]')?.textContent

  expect(siblingOn(cards[0])).toMatch(/\$5 for each additional child/i)
  expect(siblingOn(cards[1])).toMatch(/10% off each additional child's pass/i)
  expect(siblingOn(cards[2])).toMatch(/each additional member is \$10 less than the one before/i)
})

test('the Passport sibling rate is a PERCENTAGE, matching what the portal charges', () => {
  // 🔴 Reconciled against the portal 2026-09-02. This page briefly said "$10 off each
  // additional child's pass"; the portal's SIBLING_PASSPORT_DISCOUNT_PCT is 10, a
  // PERCENTAGE. On a $45 pass that is $40.50 against $35 — the site was advertising
  // $5.50 under what a parent gets charged, which is the wrong direction to be wrong in.
  //
  // The portal is the source of truth because it is what takes the money. Pinned as a
  // percentage so a future edit cannot quietly reintroduce the dollar reading, which is
  // the more natural way to write it given the other two rates are dollars.
  renderLittleMovers()
  const passport = screen.getAllByTestId('pricing-card')[1]
  const sibling = passport.querySelector('[data-testid="pricing-sibling"]').textContent
  expect(sibling).toMatch(/10%/)
  expect(sibling).not.toMatch(/\$10/)
})

test('the membership sibling rate steps down rather than being flat', () => {
  // 🔴 Also reconciled against the portal. Its membershipEstimate() is
  // `MEMBERSHIP_FROM - i * MEMBERSHIP_SIBLING_DISCOUNT`, so the quote is $89 / $79 / $69,
  // not $79 for every sibling. "$10 off each additional member" reads as the flat version
  // and over-quotes a three-child family by $10.
  renderLittleMovers()
  const membership = screen.getAllByTestId('pricing-card')[2]
  const sibling = membership.querySelector('[data-testid="pricing-sibling"]').textContent
  expect(sibling).toMatch(/less than the one before/i)
})

test('every sibling rate applies to each child after the first, not just the second', () => {
  // The studio 2026-09-02: "first kid is full and every kid after is just $10 off". A
  // three-child family gets the rate twice. "Second child" wording would cap it at one.
  renderLittleMovers()
  for (const card of screen.getAllByTestId('pricing-card')) {
    const sibling = card.querySelector('[data-testid="pricing-sibling"]')
    expect(sibling.textContent).toMatch(/each additional/i)
    expect(sibling.textContent).not.toMatch(/\bsecond\b/i)
  }
})

test('a sibling rate is teal and a promo is gold, because one is permanent', () => {
  // The page has meant gold = temporary status since 2026-08-13 (the coming-soon banner,
  // then the open house, now the promo and the unstaffed days). A sibling rate is standing
  // pricing, so it wears the Little Movers teal. Putting it in gold would tell a parent it
  // expires. Pinned because "make the two footer lines match" is an obvious tidy-up.
  renderLittleMovers()
  const passport = screen.getAllByTestId('pricing-card')[1]
  const sibling = passport.querySelector('[data-testid="pricing-sibling"]')
  const promo = passport.querySelector('[data-testid="pricing-promo"]')
  expect(sibling).toHaveStyle({ color: ACCENTS.teal })
  expect(promo).toHaveStyle({ color: ACCENTS.gold })
})

test('MOOVE26 is offered on the Passport and the membership, never on the drop-in', () => {
  // 🔴 The portal's promos.ts scopes the code to ['little_movers_passport',
  // 'little_movers_membership'] and REJECTS it for a drop-in. Advertising it on the $10
  // drop-in card would send a parent to the wizard to be told no.
  renderLittleMovers()
  const cards = screen.getAllByTestId('pricing-card')

  expect(
    cards[0].querySelector('[data-testid="pricing-promo"]'),
    'the drop-in card must not offer the code'
  ).toBeNull()
  expect(cards[0].textContent).not.toContain('MOOVE26')

  for (const card of [cards[1], cards[2]]) {
    expect(card.querySelector('[data-testid="pricing-promo"]')).toBeInTheDocument()
    expect(card.textContent).toContain('MOOVE26')
  }

  // The discounted figures are derived from the base prices, so a base price moving
  // cannot leave a stale "was $45, now $31.50" pair on the page. Pinned against the
  // arithmetic, not against a hardcoded string in the component.
  expect(cards[1].textContent).toContain('$31.50') // 45 less 30%
  expect(cards[1].textContent).toContain('$59.50') // 85 less 30%
  expect(cards[2].textContent).toContain('$62.30') // 89 less 30%
})

test('the membership promo promises an invoice adjustment, not a checkout discount', () => {
  // 🔴 The portal lists little_movers_membership in requiresApprovalFor: it does not bill
  // memberships, so nothing computes the discount and applyPromo refuses to move money.
  // The studio honours it by hand. "30% off at checkout" would be a promise the portal
  // cannot keep, and the parent would go looking for a lower number that never appears.
  renderLittleMovers()
  const membership = screen.getAllByTestId('pricing-card')[2]
  const promo = membership.querySelector('[data-testid="pricing-promo"]')
  expect(promo.textContent).toMatch(/first month/i)
  expect(promo.textContent).toMatch(/first invoice/i)
  expect(promo.textContent).not.toMatch(/at checkout/i)
})

test('the promo code is spelled exactly MOOVE26 everywhere it appears', () => {
  // 🔴 A parent types this into the portal by hand. One wrong character and the form
  // rejects it and they pay full price — the portal matches the code exactly, and a
  // near-miss discounts nothing rather than failing loudly. MOOSE26 for MOOVE26 is the
  // slip that actually happened while writing this up.
  //
  // The page interpolates PROMO.code so it cannot drift internally, but the FAQ answer
  // hardcodes the string, so that copy is pinned here too.
  renderLittleMovers()
  const shown = [
    ...screen.getAllByTestId('pricing-promo'),
    screen.getByTestId('promo-note'),
  ].map((el) => el.textContent)

  for (const text of shown) {
    expect(text).toMatch(/\bMOOVE26\b/)
    expect(text).not.toMatch(/MOOSE/i)
  }

  const pricingFaq = FAQS.flatMap((c) => c.items).find((f) =>
    /how much does little movers cost/i.test(f.q)
  )
  expect(pricingFaq, 'the Little Movers pricing FAQ must exist to be checked').toBeTruthy()
  expect(pricingFaq.a).toMatch(/\bMOOVE26\b/)
  expect(pricingFaq.a).not.toMatch(/MOOSE/i)
})

test('the pricing section names the code once and excludes the drop-in in words', () => {
  renderLittleMovers()
  const note = screen.getByTestId('promo-note')
  expect(note.textContent).toContain('MOOVE26')
  expect(note.textContent).toMatch(/30%/)
  expect(note.textContent).toMatch(/Passport/)
  expect(note.textContent).toMatch(/does not apply to single drop-in/i)
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

test('the finished open house is gone from the page and its meta description', () => {
  // The 2 September 2026 event is over and the whole block came out 2026-09-02, along
  // with src/lib/openHouse.js. The meta description named the event too and was NOT
  // date-gated, so it would have advertised a finished free morning in search results
  // long after the block itself had gone. Both are pinned.
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
  // Registration opened 2026-08-28. Before that every action on this page pointed at
  // /contact because the portal had no Little Movers classes to select; it now has its
  // own form, which is NOT the /register/classes one the rest of the site uses.
  //
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
  // These four lines all said "coming soon" while the page had no way to register. A
  // Book a class button next to any of them tells a parent two opposite things.
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
  // /register/classes form is built around enrolling a school-age dancer for the season
  // and has no Little Movers class to select, so landing a toddler's parent there is a
  // dead end — which is exactly the kind of thing a later copy-paste could reintroduce.
  //
  // Narrowed 2026-09-02: the open-house form was the second allowed destination and is
  // gone, and the booking form moved to /book.
  //
  // Scoped past the footer the same day, when the shared footer gained a portal sign-in
  // button that renders on every page. That is chrome pointing at the portal ROOT, not
  // this page offering a booking destination, and it has its own coverage in
  // Footer.test.jsx. Without the filter this test would force the footer to link at the
  // Little Movers form on every page of the site.
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
  expect(rowHeaders.map((th) => th.textContent)).toEqual(SLOTS)
})
