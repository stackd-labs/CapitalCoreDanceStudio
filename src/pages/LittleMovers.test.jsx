import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LittleMovers from './LittleMovers'
import { FAQS } from '../lib/faqs'
import { monthlyPriceForMinutes, priceToNumber } from '../lib/tuition'

// All six classes are back on the page (2026-11-10) while Little Movers is paused, so
// families can see what the spring 2027 waitlist is for. None is bookable and there is no
// schedule: the Wednesday 10-11 AM grid and the single-class section both came off.
const CLASSES = [
  ['Baby & Me', '0–18 months'],
  ['Parent & Me Dance', '18 months–3 years'],
  ["Moovin' & Groovin'", '18 months–5 years'],
  ['Tiny Tumblers', '18 months–5 years'],
  ['Sensory Steps', '18 months–5 years'],
  ['Little Movers Free Play Lab', '18 months–5 years'],
]

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

test('renders all six classes under the hero, each with ages and a description, none badged', () => {
  renderLittleMovers()
  const cards = screen.getAllByTestId('little-movers-class')
  expect(cards).toHaveLength(CLASSES.length)
  cards.forEach((card, i) => {
    const [name, ages] = CLASSES[i]
    expect(card.textContent).toContain(name)
    expect(card.textContent).toContain(ages)
    expect(card.querySelector('p').textContent.trim().length).toBeGreaterThan(30)
    expect(card.textContent).not.toMatch(/coming soon/i)
  })
  expect(cards[2].textContent).toMatch(/Parents and caregivers participate/)
})

test('there is no schedule and no Wednesday class-times section', () => {
  // Cut 2026-11-10: nothing is bookable, so a timetable would read as bookable.
  renderLittleMovers()
  expect(screen.queryByTestId('schedule-table')).not.toBeInTheDocument()
  expect(screen.queryByTestId('schedule-list')).not.toBeInTheDocument()
  expect(document.getElementById('schedule')).toBeNull()
  expect(screen.queryByRole('heading', { name: /Wednesday mornings/ })).not.toBeInTheDocument()
  expect(screen.queryByText('Our class')).not.toBeInTheDocument()
  // The hero's "See class times" button pointed at the schedule.
  expect(screen.queryByText(/See class times/i)).not.toBeInTheDocument()
})

test('the hero and meta description say to join the waitlist for spring 2027', () => {
  renderLittleMovers()
  expect(screen.getAllByText(/Join our waitlist for spring 2027/).length).toBeGreaterThan(0)
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
  expect(description).toMatch(/Join our waitlist for spring 2027/)
  expect(description).not.toMatch(/9:30|10:30|11:30|Monday|Friday|Booking is open/)
})

test('credits the Miss Ryan partnership on the Moovin & Groovin card', () => {
  renderLittleMovers()
  const partners = screen.getAllByTestId('class-partner')
  expect(partners).toHaveLength(1)
  expect(partners[0].textContent).toBe('Our signature class, in partnership with Miss Ryan')
  expect(partners[0].closest('[data-testid="little-movers-class"]').textContent).toContain(
    "Moovin' & Groovin'"
  )
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

test('states that no class is drop-off', () => {
  // The studio settled it on 2026-08-19: a caregiver always stays. A promise a parent
  // chooses the programme on, so it is pinned.
  renderLittleMovers()
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
  expect(cards[0].textContent).toContain('$5')
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

test('the persistent call to action joins the Little Movers waitlist on the portal', () => {
  // Booking was paused 2026-11-10 and replaced by the waitlist form. To reopen, point this
  // back at /register/little-movers/book (and flip LM_BOOKING_OPEN in the portal).
  renderLittleMovers()
  const bookLinks = screen.getAllByRole('link', { name: 'Join the waitlist →' })
  expect(bookLinks).toHaveLength(2) // hero and closing band
  for (const link of bookLinks) {
    expect(link).toHaveAttribute(
      'href',
      'https://studio.capitalcoredance.com/register/little-movers-waitlist'
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
  expect(screen.getByText(/Join our waitlist for spring 2027. We will let you know the moment/)).toBeInTheDocument()
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
    expect(href).toBe('https://studio.capitalcoredance.com/register/little-movers-waitlist')
  }
})

test('the classes come first, right after the hero', () => {
  renderLittleMovers()
  const classes = document.getElementById('classes')
  const hero = screen.getByRole('heading', { level: 1 })
  expect(hero.compareDocumentPosition(classes) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  const priorSections = [...document.querySelectorAll('main section')].filter(
    (sec) => sec.compareDocumentPosition(classes) & Node.DOCUMENT_POSITION_FOLLOWING
  )
  expect(priorSections.filter((sec) => !sec.contains(hero))).toHaveLength(0)
})

test('the Miss Ryan section sits directly above pricing', () => {
  renderLittleMovers()
  const sections = [...document.querySelectorAll('main section')]
  const ryan = screen.getByTestId('meet-miss-ryan')
  const pricing = screen.getAllByTestId('pricing-card')[0].closest('section')
  expect(sections.indexOf(pricing) - sections.indexOf(ryan)).toBe(1)
})

test('introduces Miss Ryan with her photo, a short bio and her background', () => {
  renderLittleMovers()
  const section = screen.getByTestId('meet-miss-ryan')
  expect(within(section).getByRole('heading', { name: /Miss Ryan/ })).toBeInTheDocument()
  const photo = within(section).getByRole('img')
  expect(photo).toHaveAttribute('src', '/instructor-ryan.jpg')
  expect(photo.getAttribute('alt')).toMatch(/Miss Ryan/)
  expect(section.textContent).toMatch(/Moovin' & Groovin'/)
  expect(within(section).getAllByTestId('ryan-chip').map((c) => c.textContent)).toEqual([
    'Cheer', 'Hip-hop', 'Gymnastics', '10+ years with little ones',
  ])
  expect(section.textContent).not.toMatch(/—/)
})
