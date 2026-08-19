import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CookieBanner from './CookieBanner'
import { ACCENTS } from '../lib/pageAccents'

const STORAGE_KEY = 'ccd-consent'

function renderBanner(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <CookieBanner />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
})

test('shows on a first visit and names itself to assistive tech', () => {
  renderBanner()
  const dialog = screen.getByRole('dialog', { name: 'Privacy and cookie notice' })
  expect(dialog).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
})

test('stays hidden once consent has been stored', () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'accepted', at: '2026-08-19' }))
  renderBanner()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('accepting dismisses it and records the choice', () => {
  renderBanner()
  fireEvent.click(screen.getByRole('button', { name: 'Got it' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).status).toBe('accepted')
})

test('the close button accepts too, rather than leaving the notice to reappear', () => {
  // Dismissing with the X has always stored consent. Worth pinning: an X that only
  // hid the banner would put it back on the next page load, on every page.
  renderBanner()
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss privacy notice' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy()
})

test('wears the accent of the page it appears over', () => {
  // Restyled 2026-08-19 from the pre-redesign palette. It renders outside <Routes>, so
  // it is on all seventeen pages and has to belong to each of them rather than carry
  // one fixed colour. jsdom reports colours as rgb().
  const { unmount } = renderBanner('/little-movers')
  expect(screen.getByTestId('cookie-banner')).toHaveStyle({ borderTopColor: ACCENTS.teal })
  unmount()

  localStorage.clear()
  renderBanner('/careers')
  expect(screen.getByTestId('cookie-banner')).toHaveStyle({ borderTopColor: ACCENTS.blue })
})

test('carries no rounded corners, on a site that is square by design', () => {
  renderBanner()
  expect(screen.getByTestId('cookie-banner').className).not.toMatch(/rounded/)
})
