import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Birthdays from './Birthdays'

const PORTAL_PARTY_REQUEST_URL = 'https://studio.capitalcoredance.com/party-request'

function renderBirthdays() {
  return render(<MemoryRouter initialEntries={['/birthdays']}><Birthdays /></MemoryRouter>)
}

test('renders page title', () => {
  renderBirthdays()
  // The h1 became the mockup's "Dance parties" in the 2026-08-11 redesign. The page is
  // still Birthday Parties in the nav, the SEO title and the URL.
  expect(screen.getByRole('heading', { level: 1, name: 'Dance parties' })).toBeInTheDocument()
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
  expect(
    screen.getByText('$50 non-refundable deposit secures your date once we confirm it')
  ).toBeInTheDocument()
  expect(screen.getByText('Remaining balance due on party day')).toBeInTheDocument()
})

test('says birthday parties are spring 2027 requests only, with no 2026 dates', () => {
  renderBirthdays()
  const notice = screen.getByTestId('spring-notice')
  expect(notice).toHaveTextContent('January 2027')
  expect(notice).toHaveTextContent("aren't booking any dates in 2026")
  expect(notice).toHaveTextContent('Sundays at 11:00 AM or 5:00 PM')
  // The weekend/weekday wording described the fall session; it must not come back.
  expect(document.body).not.toHaveTextContent('Available weekends')
})

test('renders the three packages with the studio\u2019s real prices', () => {
  // One party plus two upgrades — not three invented tiers. The prices come from
  // birthday-flyer-pricing.png, so a wrong figure here contradicts the flyer on the
  // same page.
  renderBirthdays()
  const cards = screen.getAllByTestId('package-card')
  expect(cards).toHaveLength(3)
  expect(cards[0]).toHaveTextContent('Standard Party')
  expect(cards[0]).toHaveTextContent('$199')
  expect(cards[1]).toHaveTextContent('$15')
  expect(cards[2]).toHaveTextContent('$30')
})

test('every party action reaches the portal party-request page', () => {
  renderBirthdays()
  const actions = [...document.querySelectorAll('a[href]')].filter((a) =>
    /Request|party/i.test(a.textContent)
  )
  expect(actions.length).toBeGreaterThan(0)
  for (const a of actions) {
    expect(a.getAttribute('href')).toBe('https://studio.capitalcoredance.com/party-request')
  }
})

test('button text on pink is navy, which the mockup gets wrong', () => {
  // The mockup draws white on the pink. That was 2.96:1 on the original #ff54a8 and is
  // 2.47:1 on the lightened #f77ea8 — further below AA, not closer, because lightening an
  // accent moves it away from white and towards navy. Navy on it is 6.95:1.
  renderBirthdays()
  expect(screen.getByRole('link', { name: 'Request Your Party →' })).toHaveStyle({
    color: '#0d1b34',
  })
})
