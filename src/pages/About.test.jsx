import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import About from './About'

function renderAbout() {
  return render(
    <MemoryRouter initialEntries={['/about']}>
      <About />
    </MemoryRouter>
  )
}

test('renders the hero with the gold solid wedge', () => {
  renderAbout()
  expect(screen.getByRole('heading', { level: 1, name: 'About us' })).toBeInTheDocument()
  expect(screen.getByTestId('hero-panel')).toBeInTheDocument()
  expect(screen.queryByTestId('accent-panel')).not.toBeInTheDocument()
})

test('does not assert a founding year the studio has not confirmed', () => {
  // The mockup's hero eyebrow reads "EST. 2025". Nobody has verified that, and a wrong
  // founding date on an About page is a factual claim, not decoration.
  renderAbout()
  expect(document.body.textContent).not.toMatch(/EST\.?\s*20\d\d/i)
})

test('carries the studio prose: story, approach, vision', () => {
  renderAbout()
  expect(screen.getByRole('heading', { name: /every dancer belongs/i })).toBeInTheDocument()
  expect(screen.getByText(/founded on the belief that dance should be a place/i)).toBeInTheDocument()
  expect(screen.getByText(/best dance education combines strong instruction/i)).toBeInTheDocument()
  expect(screen.getByText(/build confidence, friendships, discipline, and joy/i)).toBeInTheDocument()
})

test('renders the four pillars and all seven programs', () => {
  renderAbout()
  expect(screen.getAllByTestId('pillar')).toHaveLength(4)
  expect(screen.getAllByTestId('program')).toHaveLength(7)
  expect(screen.getByText('We focus on more than choreography')).toBeInTheDocument()
})

test('the staff grid is an unfilled scaffold, with no invented instructors', () => {
  // The studio has supplied no staff names, roles or bios. Four fictional people on an
  // About page would be a fabrication, so each card must stay visibly empty until real
  // entries arrive. This fails the moment someone pads it with placeholder names.
  renderAbout()
  const cards = screen.getAllByTestId('staff-card')
  expect(cards).toHaveLength(4)
  for (const card of cards) {
    expect(card).toHaveTextContent(/coming soon/i)
    expect(card.querySelector('[data-testid="photo-slot"]')).toBeTruthy()
  }
  expect(screen.getByText(/Instructor profiles are on the way/i)).toBeInTheDocument()
})

test('closes with the studio call to action', () => {
  renderAbout()
  expect(screen.getByRole('heading', { name: 'Come dance with Capital Core' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Become Part of the Family' })).toHaveAttribute(
    'href',
    '/contact'
  )
})
