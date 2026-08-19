import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import NotFound from './NotFound'

function renderNotFound(path = '/a-page-that-never-existed') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <NotFound />
      </MemoryRouter>
    </HelmetProvider>
  )
}

test('says plainly that the page is not here', () => {
  // Before 2026-08-19 an unmatched URL rendered the app shell and nothing else: a
  // blank white page with a 200 status. This is what replaced it.
  renderNotFound()
  expect(
    screen.getByRole('heading', { level: 1, name: /That page has moved or never existed/i })
  ).toBeInTheDocument()
})

test('offers a way back and a way to report the broken link', () => {
  renderNotFound()
  expect(screen.getByTestId('notfound-home')).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: 'Report a broken link' })).toHaveAttribute(
    'href',
    '/contact'
  )
})

test('lists the programmes a lost visitor was most likely looking for', () => {
  renderNotFound()
  const links = screen.getAllByTestId('notfound-destination')
  expect(links).toHaveLength(6)
  const hrefs = links.map((link) => link.getAttribute('href'))
  expect(hrefs).toEqual([
    '/classes',
    '/little-movers',
    '/adult-classes',
    '/dance-company',
    '/birthdays',
    '/faq',
  ])
})

test('is noindex, so the soft 404 is not simply moved to a new URL', () => {
  // The whole point of the page. Every address that renders it is one Google should
  // forget rather than keep in the index as a live result.
  renderNotFound()
  const robots = document.head.querySelector('meta[name="robots"]')
  expect(robots).toHaveAttribute('content', 'noindex, nofollow')
})
