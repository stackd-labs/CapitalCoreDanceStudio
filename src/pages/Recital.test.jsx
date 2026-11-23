import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Recital from './Recital'

function renderPage() {
  return render(<MemoryRouter initialEntries={['/recital']}><Recital /></MemoryRouter>)
}

test('renders the heading and the flyer', () => {
  renderPage()
  expect(screen.getByRole('heading', { level: 1, name: /Holiday Remix 2026/i })).toBeInTheDocument()
  expect(screen.getByTestId('recital-flyer')).toHaveAttribute('src', '/holiday-remix-2026.jpg')
})

test('shows the date, time and venue', () => {
  renderPage()
  const facts = screen.getAllByTestId('recital-fact').map((f) => f.textContent).join(' | ')
  expect(facts).toMatch(/Saturday, December 19, 2026/)
  expect(facts).toMatch(/2:00 PM/)
  expect(facts).toMatch(/Powhatan Middle School, 4135 Old Buckingham Rd, Powhatan, VA 23139/)
})

test('lists the three ticket tiers: $25 adult, $15 ages 4 to 11, free 3 and under', () => {
  renderPage()
  const tiers = screen.getAllByTestId('recital-ticket').map((t) => t.textContent).join(' | ')
  expect(tiers).toMatch(/\$25.*Adult/)
  expect(tiers).toMatch(/\$15.*Ages 4 to 11/)
  expect(tiers).toMatch(/Free.*3 and under/)
})

test('sells tickets: steppers, total and a name/email form', () => {
  renderPage()
  expect(screen.getByRole('heading', { name: /Get your tickets/i })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /Add one Adult ticket/i }))
  fireEvent.click(screen.getByRole('button', { name: /Add one Adult ticket/i }))
  fireEvent.click(screen.getByRole('button', { name: /Add one Ages 4 to 11 ticket/i }))
  expect(screen.getByTestId('ticket-total').textContent).toMatch(/\$65\.00/)
  expect(screen.getByLabelText(/Your name/i)).toBeInTheDocument()
})

test('promo code takes 20% off adult tickets', () => {
  renderPage()
  fireEvent.click(screen.getByRole('button', { name: /Add one Adult ticket/i }))
  fireEvent.change(screen.getByLabelText(/Promo code/i), { target: { value: 'volunteer' } })
  fireEvent.click(screen.getByRole('button', { name: /Apply/i }))
  expect(screen.getByTestId('ticket-total').textContent).toMatch(/\$20\.00/)
})

test('keeps the recital fees off the public page', () => {
  renderPage()
  const text = document.body.textContent
  expect(text).not.toMatch(/\$100|\$85|\$65/)
  expect(text).not.toMatch(/recital fee/i)
})

test('directions link goes to a map for the venue', () => {
  renderPage()
  const href = screen.getByTestId('recital-map-link').getAttribute('href')
  expect(href).toMatch(/^https:\/\/www\.google\.com\/maps\/search\//)
  expect(decodeURIComponent(href)).toMatch(/Powhatan Middle School/)
})
