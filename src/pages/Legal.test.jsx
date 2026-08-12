import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Privacy from './Privacy'
import Terms from './Terms'
import { ACCENTS } from '../lib/pageAccents'

// Privacy and Terms share one shell (components/LegalPage.jsx), so they are tested
// together — anything asserted for both is really an assertion about the shell.
function renderPage(Page, route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Page />
    </MemoryRouter>
  )
}

const PAGES = [
  { name: 'Privacy', Page: Privacy, route: '/privacy', heading: 'Privacy policy', accent: ACCENTS.pink, sections: 8 },
  { name: 'Terms', Page: Terms, route: '/terms', heading: 'Terms & policies', accent: ACCENTS.teal, sections: 13 },
]

test.each(PAGES)('$name renders its hero in its own accent', ({ Page, route, heading, accent }) => {
  renderPage(Page, route)
  expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  expect(screen.getByTestId('hero-panel')).toHaveStyle({ background: accent })
})

test.each(PAGES)('$name renders every section with a heading', ({ Page, route, sections }) => {
  renderPage(Page, route)
  expect(screen.getAllByTestId('legal-section')).toHaveLength(sections)
  for (const section of screen.getAllByTestId('legal-section')) {
    expect(within(section).getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(section.textContent.length).toBeGreaterThan(80)
  }
})

test.each(PAGES)('$name contents list links to every section, and each target exists', ({
  Page,
  route,
  sections,
}) => {
  // A table of contents whose anchors point at nothing is worse than none at all — it
  // looks navigable and silently does nothing.
  renderPage(Page, route)
  const links = within(screen.getByTestId('legal-toc')).getAllByRole('link')
  expect(links).toHaveLength(sections)
  for (const link of links) {
    const id = link.getAttribute('href').slice(1)
    expect(id, `"${link.textContent}" has an empty anchor`).toBeTruthy()
    expect(document.getElementById(id), `no section with id "${id}"`).toBeTruthy()
  }
})

test.each(PAGES)('$name keeps a route to a human and the studio details', ({ Page, route }) => {
  renderPage(Page, route)
  expect(screen.getByRole('heading', { name: 'Questions?' })).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'info@capitalcoredance.com' }).length).toBeGreaterThan(0)
  expect(screen.getByText(/13110 Midlothian Turnpike, Midlothian, VA 23113/)).toBeInTheDocument()
})

test('Privacy still states the specifics families care about', () => {
  renderPage(Privacy, '/privacy')
  expect(screen.getByText(/We do not sell your personal information/i)).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /Children.s Privacy/i })).toBeInTheDocument()
})

test('Terms still states enrollment, refunds and liability', () => {
  renderPage(Terms, '/terms')
  for (const heading of ['Refund Policy', 'Liability & Waiver', 'Photo & Media Release']) {
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  }
})
