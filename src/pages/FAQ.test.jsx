import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FAQ from './FAQ'
import { FAQS } from '../lib/faqs'

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
