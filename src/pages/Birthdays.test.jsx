import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Birthdays from './Birthdays'

const PORTAL_PARTY_REQUEST_URL = 'https://studio.capitalcoredance.com/party-request'

function renderBirthdays() {
  return render(<MemoryRouter initialEntries={['/birthdays']}><Birthdays /></MemoryRouter>)
}

test('renders page title', () => {
  renderBirthdays()
  expect(screen.getByRole('heading', { name: 'Birthday Parties' })).toBeInTheDocument()
})

test('renders the package, themes, and details cards', () => {
  renderBirthdays()
  expect(screen.getByRole('heading', { name: "What's Included" })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Exciting Themes' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Party Details' })).toBeInTheDocument()
  expect(screen.getByText('Starting at $199')).toBeInTheDocument()
})

test('both party CTAs point to the studio portal party request form', () => {
  renderBirthdays()
  const banner = screen.getByRole('link', { name: 'Request Your Party →' })
  const footer = screen.getByRole('link', { name: 'Start Your Party Request →' })
  for (const cta of [banner, footer]) {
    expect(cta).toHaveAttribute('href', PORTAL_PARTY_REQUEST_URL)
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
  }
})

test('does not link to the retired on-site booking flow', () => {
  renderBirthdays()
  // The /birthday-booking route no longer exists — a link to it would 404 the visitor
  // mid-booking, so nothing on this page may point at it.
  const hrefs = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'))
  expect(hrefs.some((h) => h.includes('/birthday-booking'))).toBe(false)
  expect(hrefs.some((h) => h.includes('/birthday-payment'))).toBe(false)
})

test('states the deposit and booking terms', () => {
  renderBirthdays()
  expect(screen.getByText('$50 non-refundable deposit required')).toBeInTheDocument()
  expect(screen.getByText('Remaining balance due on party day')).toBeInTheDocument()
})
