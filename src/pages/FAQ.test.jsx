import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FAQ from './FAQ'
import { FAQS } from '../lib/faqs'
import { REGISTRATION } from '../lib/tuition'

const CATEGORIES = FAQS.map(({ category }) => category)
const QUESTION_COUNT = FAQS.reduce((n, { items }) => n + items.length, 0)

function renderFAQ() {
  return render(
    <MemoryRouter initialEntries={['/faq']}>
      <FAQ />
    </MemoryRouter>
  )
}

test('renders the hero with the green solid wedge', () => {
  renderFAQ()
  expect(screen.getByRole('heading', { level: 1, name: 'Common questions' })).toBeInTheDocument()
  expect(screen.getByTestId('hero-panel')).toBeInTheDocument()
})

test('renders every category and every question in the source', () => {
  // Derived from FAQS, not hardcoded: the counts were "seven categories and thirty-two
  // questions" and any content edit failed on the number instead of on a fact.
  renderFAQ()
  expect(screen.getAllByTestId('faq-category')).toHaveLength(CATEGORIES.length)
  expect(screen.getAllByTestId('faq-item')).toHaveLength(QUESTION_COUNT)
  // Scoped to the category blocks, not the whole page: "Little Movers" is also a navbar
  // and footer link, so an unscoped getByText finds three of it.
  const rendered = screen.getAllByTestId('faq-category').map((el) => el.textContent)
  for (const category of CATEGORIES) {
    expect(
      rendered.some((text) => text.includes(category)),
      `${category} is not rendered as a category`
    ).toBe(true)
  }
})

test('covers each current programme with its own category', () => {
  // These are what the studio actually sells today. Named explicitly so a future edit
  // cannot quietly drop one.
  expect(CATEGORIES).toEqual(
    expect.arrayContaining([
      'Classes & Programs',
      'Enrollment & Tuition',
      'Little Movers',
      'Adult Classes',
      'Dance Company',
      'Birthday Parties',
      'Studio Info',
    ])
  )
})

test('no longer answers questions about the finished summer programmes', () => {
  // Retired 2026-08-17. All fourteen questions quoted 2026 dates and prices for sessions
  // that ended in July, which on an FAQ page reads as current fact.
  renderFAQ()
  for (const retired of ['Summer Classes', 'Summer Camps', 'Adult Summer Series']) {
    expect(screen.queryByText(retired), `${retired} is back on the FAQ`).not.toBeInTheDocument()
  }
  const page = document.body.textContent
  expect(page).not.toMatch(/Summer Flex Pass/i)
  expect(page).not.toMatch(/Tik Tok Hip Hop/i)
  expect(page).not.toMatch(/June 2[39]/)
})

test('does not tell a parent Little Movers registration is closed', () => {
  // 🔴 It did, until 2026-09-02: "Not yet — the schedule above is planned and start dates
  // are still to be confirmed." Booking opened 2026-08-28. So the one question a parent
  // ready to book actually clicks was turning them away, while the Little Movers page
  // carried a Book a class button the whole time.
  //
  // Nothing pinned any FAQ answer's substance before this, which is how it survived four
  // sessions of work on the surrounding pages.
  const answer = FAQS.flatMap(({ items }) => items).find(({ q }) =>
    /register for little movers/i.test(q)
  ).a
  expect(answer).not.toMatch(/^Not yet/i)
  expect(answer).not.toMatch(/to be confirmed/i)
  expect(answer).not.toMatch(/as soon as registration opens/i)
  expect(answer).toMatch(/^Yes/i)
  // The bookable day and the path the wizard actually lives at.
  expect(answer).toMatch(/Wednesday/)
  expect(answer).toContain('register/little-movers/book')
})

test('the Little Movers answers agree on which mornings can be booked', () => {
  // Three answers in this category touch the schedule. They are edited at different times
  // by different people, and a parent reads them one after the other — so the one that
  // names bookable days and the one that answers "can I register" must not drift apart.
  const lm = FAQS.find(({ category }) => /little movers/i.test(category)).items
  const meets = lm.find(({ q }) => /when do little movers/i.test(q)).a
  const register = lm.find(({ q }) => /register for little movers/i.test(q)).a

  for (const answer of [meets, register]) {
    expect(answer).toMatch(/Wednesday/)
    expect(answer).toMatch(/Monday and Friday/)
  }
})

test('the enrollment and payment answers name the portal address', () => {
  // "our student portal" with no address is unactionable on a phone, and the portal is a
  // separate system with its own sign-in. Added 2026-09-02 with the footer button.
  const answers = FAQS.flatMap(({ items }) => items)
  for (const q of [/how do i enroll/i, /how do i pay/i]) {
    expect(answers.find((a) => q.test(a.q)).a).toContain('studio.capitalcoredance.com')
  }
})

test('quotes the same registration fee the portal charges', () => {
  const answer = FAQS.flatMap(({ items }) => items).find(({ q }) =>
    /registration fee/i.test(q)
  ).a
  expect(answer).toContain(`$${REGISTRATION.perSemester}`)
  expect(answer).not.toMatch(/\$65/)
})

test('states no class length the Fall schedule does not actually run', () => {
  // The rate card publishes 75- and 90-minute prices, but no Fall class is longer than 60
  // minutes, and this page used to promise "up to 90 minutes".
  renderFAQ()
  const lengthAnswer = FAQS.flatMap(({ items }) => items).find(({ q }) =>
    /How long is each class/i.test(q)
  ).a
  expect(lengthAnswer).not.toMatch(/90 minutes/)
  expect(lengthAnswer).toMatch(/30, 45 or 60 minutes/)
})

test('answers start collapsed and open on click', () => {
  // The mockup draws every answer open. With 32 questions that is a wall, so this keeps
  // the accordion — which means the toggle has to actually work.
  renderFAQ()
  const question = screen.getByRole('button', { name: /What dance styles do you offer/i })
  expect(question).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByText(/ballet, tap, jazz, hip hop, contemporary/i)).not.toBeInTheDocument()

  fireEvent.click(question)
  expect(question).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByText(/ballet, tap, jazz, hip hop, contemporary/i)).toBeInTheDocument()

  fireEvent.click(question)
  expect(question).toHaveAttribute('aria-expanded', 'false')
})

test('every question is in the DOM even while collapsed, so search and SEO still see it', () => {
  // Collapsing hides answers, not questions. If a refactor ever unmounts the question
  // text too, in-page search stops finding anything on this page.
  renderFAQ()
  const items = screen.getAllByTestId('faq-item')
  for (const item of items) {
    expect(within(item).getByRole('button').textContent.trim().length).toBeGreaterThan(5)
  }
})

test('the FAQPage JSON-LD indexes every question regardless of open state', () => {
  renderFAQ()
  const script = document.querySelector('script[type="application/ld+json"]')
  expect(script, 'no JSON-LD emitted').toBeTruthy()
  const parsed = JSON.parse(script.textContent)
  const faqPage = (Array.isArray(parsed) ? parsed : [parsed]).find(
    (entry) => entry['@type'] === 'FAQPage'
  )
  expect(faqPage.mainEntity).toHaveLength(QUESTION_COUNT)
  expect(faqPage.mainEntity[0]).toMatchObject({ '@type': 'Question' })
  expect(faqPage.mainEntity[0].acceptedAnswer.text.length).toBeGreaterThan(20)
})

test('closes with a route to a human', () => {
  // Scoped to the band — the footer carries its own "Contact Us" link on every page.
  renderFAQ()
  const band = within(screen.getByTestId('cta-band'))
  expect(band.getByRole('heading', { name: 'Still have questions?' })).toBeInTheDocument()
  expect(band.getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', '/contact')
})
