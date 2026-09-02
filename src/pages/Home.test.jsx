import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { SCHEDULE } from '../lib/schedule'

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
  expect(within(stats).getByText('Class styles')).toBeInTheDocument()
  expect(within(stats).getByText('Free')).toBeInTheDocument()
})

test('the class count in the stat row is counted from the schedule, not typed', () => {
  // The stat row shipped with three of the mockup's invented figures. Two of them —
  // a 6:1 dancer ratio and two studios — were claims a parent could hold the studio
  // to and nobody had confirmed either, so they came out on 2026-08-19. The one that
  // replaced the ratio is derived, which is the point: add or drop a class and the
  // home page follows without anyone remembering to edit it.
  renderHome()
  const expected = SCHEDULE.reduce((total, day) => total + day.classes.length, 0)
  const stats = screen.getByTestId('stat-row')
  expect(within(stats).getByText(String(expected))).toBeInTheDocument()
  expect(within(stats).getByText('Classes a week')).toBeInTheDocument()
})

test('no unconfirmed studio-count or dancer-ratio claim survives on the page', () => {
  renderHome()
  expect(screen.queryByText('6:1')).not.toBeInTheDocument()
  expect(screen.queryByText(/Dancer ratio/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/Two studios/i)).not.toBeInTheDocument()
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

test('points prospective staff at the careers page', () => {
  // Careers has no navbar entry, so this strip is one of only two doors to it.
  renderHome()
  const strip = screen.getByTestId('hiring-strip')
  expect(strip).toHaveAttribute('href', '/careers')
  expect(within(strip).getByText('We are hiring')).toBeInTheDocument()
  expect(within(strip).getByText(/Preschool and Irish dance instructors/)).toBeInTheDocument()
})

test('the dancewear shop link points at Nimbly and opens safely off-site', () => {
  renderHome()
  const link = screen.getByTestId('nimbly-shop-link')

  // The lid and sid parameters are what tie the shop to Capital Core. A refactor that
  // "tidies" the query string would leave a working link to the wrong storefront, which
  // is the failure this pins. Moved 2026-09-02 from /dancerclasslist to /Store, same ids.
  expect(link).toHaveAttribute(
    'href',
    'https://www.shopnimbly.com/Store?sid=001Qp00000hOQQRIA4&lid=a0eQp00000Er2A5IAJ'
  )
  // Pinned separately from the whole-URL check above, because losing one id is the
  // failure that still leaves a page that loads — it just belongs to no studio.
  expect(link.getAttribute('href')).toContain('sid=001Qp00000hOQQRIA4')
  expect(link.getAttribute('href')).toContain('lid=a0eQp00000Er2A5IAJ')
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
})

test('the shop copy does not claim the old class-list layout', () => {
  // The link landed on the studio's dress-code lists until 2026-09-02 and the copy said
  // "laid out by class" to match. It now lands on the storefront, which is organised by
  // dance style, so that phrasing would describe a page the visitor no longer arrives on.
  renderHome()
  const shop = screen.getByLabelText('Dancewear shop')
  expect(shop.textContent).not.toMatch(/laid out by class/i)
  expect(shop.textContent).toMatch(/browsable by dance style/i)
})

test('the shop section does not wear the home page accent', () => {
  // Outbound destinations are told apart by colour on this page: purple shop, blue
  // careers, red registration. If the shop drifts to Home's red it starts reading as
  // part of the registration path.
  renderHome()
  const link = screen.getByTestId('nimbly-shop-link')
  expect(link.style.background).not.toBe('rgb(224, 27, 34)')
  expect(link.style.background).toBe('rgb(155, 61, 240)')
})

test('the finished open-house strip is gone, and the rest of the page is intact', () => {
  // The 2 September 2026 event is over and the strip was removed 2026-09-02. Pinned so a
  // future paste of the old block cannot quietly put a dead free-event promise back on
  // the home page, and so the removal is shown not to have taken anything else with it.
  renderHome()
  expect(screen.queryByTestId('open-house-strip')).not.toBeInTheDocument()
  expect(screen.queryByText(/Open House/i)).not.toBeInTheDocument()
  expect(screen.getAllByTestId('home-card')).toHaveLength(6)
  expect(screen.getByTestId('hiring-strip')).toBeInTheDocument()
})
