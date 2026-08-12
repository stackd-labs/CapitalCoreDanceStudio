import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FAQ from './FAQ'

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

test('renders all seven categories and all thirty-two questions', () => {
  renderFAQ()
  expect(screen.getAllByTestId('faq-category')).toHaveLength(7)
  expect(screen.getAllByTestId('faq-item')).toHaveLength(32)
  for (const category of [
    'Classes & Programs',
    'Enrollment & Tuition',
    'Summer Classes',
    'Summer Camps',
    'Adult Summer Series',
    'Birthday Parties',
    'Studio Info',
  ]) {
    expect(screen.getByText(category)).toBeInTheDocument()
  }
})

test('answers start collapsed and open on click', () => {
  // The mockup draws every answer open. With 32 questions that is a wall, so this keeps
  // the accordion — which means the toggle has to actually work.
  renderFAQ()
  const question = screen.getByRole('button', { name: /What dance styles do you offer/i })
  expect(question).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByText(/ballet, jazz, hip hop, contemporary, tap, acro/i)).not.toBeInTheDocument()

  fireEvent.click(question)
  expect(question).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByText(/ballet, jazz, hip hop, contemporary, tap, acro/i)).toBeInTheDocument()

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
  expect(faqPage.mainEntity).toHaveLength(32)
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
