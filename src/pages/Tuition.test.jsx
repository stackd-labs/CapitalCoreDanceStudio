import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Tuition from './Tuition'

function renderTuition() {
  return render(<MemoryRouter initialEntries={['/tuition']}><Tuition /></MemoryRouter>)
}

test('renders page title', () => {
  // The h1 became the mockup's "Tuition made clear" in the 2026-08-11 redesign; the
  // page is still Tuition in the nav and the URL.
  renderTuition()
  expect(
    screen.getByRole('heading', { level: 1, name: 'Tuition made clear' })
  ).toBeInTheDocument()
})

test('states both semester date ranges', () => {
  renderTuition()
  expect(screen.getByText('August 24 – December 18, 2026')).toBeInTheDocument()
  expect(screen.getByText('January 11 – May 21, 2027')).toBeInTheDocument()
})

test('marks both end-of-semester performance dates tentative', () => {
  renderTuition()
  // Parents plan travel around these, so the tentative qualifier must survive edits.
  const fall = screen.getByText(/Recital/).closest('div')
  const spring = screen.getByText(/^Show$/).closest('div')
  expect(fall.textContent).toContain('December 19')
  expect(fall.textContent).toContain('(tentative)')
  expect(spring.textContent).toContain('May 22')
  expect(spring.textContent).toContain('(tentative)')
})

test('lists the returning-student discount', () => {
  renderTuition()
  expect(
    screen.getByText('Returning students receive a $5–$10 discount per semester')
  ).toBeInTheDocument()
})

test('directs payment to the studio portal and not iClassPortal', () => {
  renderTuition()
  const portalLink = screen.getByRole('link', { name: 'studio portal' })
  expect(portalLink).toHaveAttribute('href', 'https://studio.capitalcoredance.com')
  expect(portalLink).toHaveAttribute('target', '_blank')
  expect(screen.queryByText(/iClassPortal/i)).not.toBeInTheDocument()
})

test('does not claim semester rates vary', () => {
  renderTuition()
  // Removed 2026-08-03 — semester rates do not vary.
  expect(screen.queryByText(/rates vary/i)).not.toBeInTheDocument()
})

test('renders the monthly class prices', () => {
  renderTuition()
  // Scoped to the price card: $65 is also the per-semester registration fee, so a
  // bare getByText('$65') matches two different things on this page.
  const card = (label) => screen.getByText(label).closest('[data-testid="price-card"]')
  expect(card('30 Min Classes').textContent).toContain('$65')
  expect(card('90 Min Classes').textContent).toContain('$150')
  expect(card('30 Min Classes').textContent).toMatch(/per month/i)
  expect(screen.getAllByTestId('price-card')).toHaveLength(5)
})

test('each price card names real classes of that length, read from the schedule', () => {
  // The examples are derived from SCHEDULE, so a class changing length can never leave
  // this page quoting the wrong price against it.
  renderTuition()
  const card = (label) => screen.getByText(label).closest('[data-testid="price-card"]')
  // Tiny Core classes are the 30-minute ones on the Fall schedule.
  expect(card('30 Min Classes').textContent).toMatch(/Tiny Core/)
  // Nothing on the Fall schedule runs 90 minutes, and the card says so rather than
  // sitting empty.
  expect(card('90 Min Classes').textContent).toMatch(/none on the Fall 2026 schedule/i)
})
