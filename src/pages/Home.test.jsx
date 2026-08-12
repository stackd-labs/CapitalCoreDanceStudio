import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Home />
    </MemoryRouter>
  )
}

test('renders the hero wordmark', () => {
  renderHome()
  // Whole-name match, not two loose fragments: Hero renders each line as a block span,
  // which gives a visual break but no text break, so this also pins that the accessible
  // name reads "Every dancer has a CORE" rather than "Every dancerhas a CORE".
  expect(
    screen.getByRole('heading', { level: 1, name: /^Every dancer has a CORE$/i })
  ).toBeInTheDocument()
})

test('each letter of CORE takes a different brand accent', () => {
  // The tinted wordmark is the home page's signature. If a refactor flattens it to one
  // colour the page still renders and no other test notices.
  renderHome()
  const tinted = [...screen.getByRole('heading', { level: 1 }).querySelectorAll('span[style*="color"]')]
  const colours = new Set(tinted.map((el) => el.style.color))
  expect(tinted.map((el) => el.textContent).join('')).toBe('CORE')
  expect(colours.size).toBe(4)
})

test('renders the hero eyebrow, tagline and both actions', () => {
  renderHome()
  expect(screen.getByText(/Now enrolling · 2026 – 2027/i)).toBeInTheDocument()
  expect(screen.getByText(/Recreational · Competition · Little Movers/i)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Find a class' })).toHaveAttribute('href', '/classes')
  expect(screen.getByRole('link', { name: 'Tour the studio' })).toHaveAttribute('href', '/about')
})

test('offers the three programs from the mockup, each linking to its page', () => {
  renderHome()
  const expected = [
    ['/classes', 'Recreational'],
    ['/dance-company', 'Dance Company'],
    ['/little-movers', 'Little Movers'],
  ]
  for (const [href, name] of expected) {
    const card = [...document.querySelectorAll(`a[href="${href}"]`)].find((a) =>
      a.textContent.includes(name)
    )
    expect(card, `${href} program card is missing`).toBeTruthy()
  }
})

test('pages dropped from the home grid are still reachable from the chrome', () => {
  // The redesign replaced four section cards (Classes / Adult Classes / Birthdays /
  // Contact) with the mockup's three programme cards, so Adult Classes, Birthdays and
  // Contact lost their home-page entry point. They must not become orphans — the nav
  // and footer are now their only route in from the home page.
  renderHome()
  for (const href of ['/adult-classes', '/birthdays', '/contact']) {
    expect(
      document.querySelector(`a[href="${href}"]`),
      `${href} is unreachable from the home page`
    ).toBeTruthy()
  }
})

test('renders the studio section with its stats', () => {
  renderHome()
  expect(screen.getByRole('heading', { name: /A room that raises the floor/i })).toBeInTheDocument()
  const stats = screen.getByTestId('stat-row')
  expect(within(stats).getByText('12')).toBeInTheDocument()
  expect(within(stats).getByText('6:1')).toBeInTheDocument()
  expect(within(stats).getByText('Dancer ratio')).toBeInTheDocument()
})

test('renders the closing call to action', () => {
  renderHome()
  expect(screen.getByText('Registration is open')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Browse the schedule' })).toHaveAttribute(
    'href',
    '/classes'
  )
})

test('every unfilled photo slot announces itself as a placeholder', () => {
  // Guards the hand-off: an empty well must stay visibly and accessibly empty so the
  // page is never mistaken for finished art.
  renderHome()
  const slots = screen.getAllByTestId('photo-slot')
  expect(slots.length).toBeGreaterThan(0)
  for (const slot of slots) {
    expect(slot).toHaveAttribute('aria-label', expect.stringContaining('Placeholder:'))
    expect(slot.getAttribute('data-photo-slot')).toBeTruthy()
  }
})

test('Home uses the five-accent stripe panel, not a single solid wedge', () => {
  // Regression 2026-08-11: Hero gained a `variant` prop for the section pages and
  // defaulted it to 'solid'. Home never asked for 'stripe', so its signature panel
  // silently became a plain red slab and no test noticed. The stripe is the one thing
  // that makes this hero the home page.
  renderHome()
  expect(screen.getByTestId('accent-panel')).toBeInTheDocument()
  expect(screen.queryByTestId('hero-panel')).not.toBeInTheDocument()
})
