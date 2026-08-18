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
