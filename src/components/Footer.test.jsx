import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from './Footer'

// Footer uses <Link>, so it must render inside a Router.
function renderFooter() {
  return render(<MemoryRouter><Footer /></MemoryRouter>)
}

test('renders studio name', () => {
  renderFooter()
  expect(screen.getByText('CAPITAL CORE DANCE STUDIO')).toBeInTheDocument()
})

test('states where the studio is, and links it to a map', () => {
  // Replaced the old "MIDLOTHIAN, VIRGINIA" strapline on 2026-08-11: the redesigned
  // footer carries the full street address instead, which is the more useful fact and
  // is what the map link points at.
  renderFooter()
  const address = screen.getByRole('link', { name: /13110 Midlothian Turnpike/ })
  expect(address).toHaveAttribute('href', expect.stringContaining('maps.google.com'))
  expect(address).toHaveTextContent(/Midlothian, VA 23113/)
})

test('keeps the phone, email and social accounts reachable', () => {
  renderFooter()
  expect(screen.getByRole('link', { name: '804-234-4014' })).toHaveAttribute('href', 'tel:8042344014')
  expect(screen.getByRole('link', { name: 'info@capitalcoredance.com' }))
    .toHaveAttribute('href', 'mailto:info@capitalcoredance.com')
  expect(screen.getByRole('link', { name: 'Instagram' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Facebook' })).toBeInTheDocument()
})

test('keeps Privacy and Terms reachable from every page', () => {
  renderFooter()
  expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy')
  expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms')
})

test('renders copyright', () => {
  renderFooter()
  expect(screen.getByText(/© 2026 Capital Core Dance Studio/)).toBeInTheDocument()
})

test('Careers is reachable from the footer, which is the only place it is linked', () => {
  // The page is deliberately absent from the navbar, so this link and the home page's
  // hiring strip are the entire way in. Losing it would strand the page.
  renderFooter()
  expect(screen.getByRole('link', { name: 'Careers' })).toHaveAttribute('href', '/careers')
})

test('the portal sign-in is in the footer of every page and opens off-site safely', () => {
  // Added 2026-09-02. This is the only route into the portal from the site chrome, so a
  // returning family that cannot find it has no way to sign in from the marketing site.
  //
  // The BARE ORIGIN, not /login: the portal redirects its root to the login page, so this
  // survives that path being renamed. A test that pinned /login would go green while
  // sending families to a 404 the day the portal reorganises its routes.
  renderFooter()
  const portal = screen.getByTestId('portal-link')
  expect(portal).toHaveAttribute('href', 'https://studio.capitalcoredance.com')
  expect(portal).toHaveAttribute('target', '_blank')
  expect(portal).toHaveAttribute('rel', expect.stringContaining('noopener'))
  expect(portal).toHaveTextContent(/Enter our portal/i)
})

test('the portal button says what is behind it', () => {
  // "Portal" alone does not tell a parent what they are signing in to, and the portal is
  // a separate system with its own sign-in — see the Privacy page, which says so.
  renderFooter()
  expect(screen.getByText(/Sign in to enroll, pay tuition and book classes/i)).toBeInTheDocument()
})

test('the portal button is orange, and the SAME orange on every page', () => {
  // Solid orange at the studio's request 2026-09-02, to make it stand out.
  //
  // 🔴 A FIXED orange, not accentForPath. The footer recolours per route, so the failure
  // this pins is someone "tidying" the hardcoded colour into the surrounding `accent`
  // variable — which reads like an improvement and would repaint the portal button on
  // every page, for a destination that is the same system wherever it is clicked from.
  // Rendering at two routes with different accents is the only way to catch that.
  const atRed = render(
    <MemoryRouter initialEntries={['/']}><Footer /></MemoryRouter>
  )
  const onHome = screen.getByTestId('portal-link').style.background
  atRed.unmount()

  render(
    <MemoryRouter initialEntries={['/little-movers']}><Footer /></MemoryRouter>
  )
  const onLittleMovers = screen.getByTestId('portal-link').style.background

  expect(onHome).toBe('rgb(255, 140, 43)') // ACCENTS.orange
  expect(onLittleMovers).toBe(onHome)
})

test('the portal button puts navy on the orange, not white', () => {
  // White on #ff8c2b is 2.32:1 and unreadable; navy is 7.39:1. The colour is derived by
  // onAccent() rather than typed, so this also guards a future retune of the orange —
  // the pink was tuned in place once already.
  renderFooter()
  expect(screen.getByTestId('portal-link').style.color).toBe('rgb(13, 27, 52)')
})
