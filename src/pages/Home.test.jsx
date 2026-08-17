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

test('offers all six link blocks, each linking to its page', () => {
  // Three programme cards from the mockup, plus Birthdays / Adult Classes / Contact added
  // 2026-08-17 — six blocks fill two clean rows of the three-column grid.
  renderHome()
  const expected = [
    ['/classes', 'Recreational'],
    ['/dance-company', 'Dance Company'],
    ['/little-movers', 'Little Movers'],
    ['/birthdays', 'Birthdays'],
    ['/adult-classes', 'Adult Classes'],
    ['/contact', 'Contact Us'],
  ]
  expect(screen.getAllByTestId('home-card')).toHaveLength(expected.length)
  for (const [href, name] of expected) {
    const card = [...document.querySelectorAll(`a[href="${href}"]`)].find((a) =>
      a.textContent.includes(name)
    )
    expect(card, `${href} link block is missing`).toBeTruthy()
  }
})

test('every home link block carries real art, never a placeholder well', () => {
  // The grid sits high on the landing page; a hatched placeholder here is the first thing
  // a visitor sees. Each block must resolve to an <img>.
  renderHome()
  for (const card of screen.getAllByTestId('home-card')) {
    expect(card.querySelector('[data-testid="photo-slot"]'), card.textContent.slice(0, 40)).toBeNull()
    expect(card.querySelector('img')).toBeTruthy()
  }
})

test('Adult Classes, Birthdays and Contact are reachable from the home page', () => {
  // These three lost their home-page entry point in the 2026-08-11 redesign, which cut
  // four section cards down to three programme cards, and were reachable only through the
  // nav and footer until they were restored to the grid on 2026-08-17. Kept as its own
  // test because the requirement is that they are reachable at all, not that they sit in
  // any particular place.
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
  //
  // Home's art is now complete — the last empty well (the studio section) was filled
  // 2026-08-17 — so zero slots is the expected state and this asserts nothing today.
  // It is kept rather than deleted because it still catches the regression it was
  // written for: a new well added without art, or one that loses its placeholder
  // labelling. Hence queryAll, not getAll, which throws on an empty match.
  renderHome()
  const slots = screen.queryAllByTestId('photo-slot')
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

test('the hero free-trial offer links to Contact', () => {
  // Matches the Adult Classes page: a free class is arranged through the studio, so the
  // one claim on the hero a visitor can act on has to be actionable.
  renderHome()
  const link = screen.getByTestId('free-trial-link')
  expect(link).toHaveAttribute('href', '/contact')
  expect(link).toHaveTextContent('Your first class is always free')
})
