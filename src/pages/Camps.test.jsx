import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Camps from './Camps'

// The /camps route is retired from App.jsx until summer programming returns, but the
// page file is preserved — so these tests are kept working rather than deleted, and the
// page is already covered on the day the route is restored.
//
// They previously asserted "Camps", "Summer Intensive", "Holiday Camp", and "Spring
// Break Camp", none of which the page has had since it was rebuilt around eight themed
// weeks. That is why they were failing; the page itself was fine.

const THEMES = [
  'Rainbow Remix',
  'Glow Dance Party',
  'Pop Stars and Performers',
  'Around The World',
  'Beach Bash Boogie',
  'Movie Magic Dance Camp',
  'Dance & Dream Spirit Week',
  'Princess and Heroes',
]

function renderCamps() {
  return render(<MemoryRouter initialEntries={['/camps']}><Camps /></MemoryRouter>)
}

test('renders page title', () => {
  renderCamps()
  expect(screen.getByRole('heading', { name: 'Summer Camps 2026' })).toBeInTheDocument()
})

test('renders all eight themed weeks with their week labels', () => {
  renderCamps()
  for (const theme of THEMES) {
    expect(screen.getByText(theme), `${theme} is missing`).toBeInTheDocument()
  }
  for (let week = 1; week <= THEMES.length; week += 1) {
    expect(screen.getByText(`Week ${week}`)).toBeInTheDocument()
  }
})

test('every week shows its dates and a description', () => {
  renderCamps()
  for (const theme of THEMES) {
    const card = screen.getByText(theme).closest('div.border')
    expect(card, `${theme} card`).not.toBeNull()
    // Date ranges use an en dash, e.g. "June 15 – June 19".
    expect(card.textContent, `${theme} dates`).toMatch(/\w+ \d+ – \w+ \d+/)
    expect(card.querySelector('p').textContent.trim().length).toBeGreaterThan(60)
  }
})

test('renders Register CTA pointing at camp registration', () => {
  renderCamps()
  expect(screen.getByRole('link', { name: 'Register Now' })).toHaveAttribute(
    'href',
    '/camp-registration'
  )
})
