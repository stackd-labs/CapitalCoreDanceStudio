import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Majorette from './Majorette'

function renderPage() {
  return render(<MemoryRouter initialEntries={['/majorette']}><Majorette /></MemoryRouter>)
}

test('renders the heading and the flyer', () => {
  renderPage()
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Majorette/i)
  expect(screen.getByTestId('majorette-flyer')).toHaveAttribute('src', '/class-majorette.jpg')
})

test('facts come from the schedule: Wednesday 6:45, Ms. Milan, ages 6 to 17, $85', () => {
  renderPage()
  const facts = screen.getAllByTestId('majorette-fact').map((f) => f.textContent).join(' | ')
  expect(facts).toMatch(/Wednesdays?, 6:45 – 7:30 PM/)
  expect(facts).toMatch(/Ms\. Milan/)
  expect(facts).toMatch(/6–17/)
  expect(facts).toMatch(/\$85/)
})

test('registers through the portal Majorette form', () => {
  renderPage()
  const links = screen.getAllByRole('link', { name: /Register/ })
  expect(links.length).toBeGreaterThan(0)
  for (const a of links) {
    expect(a).toHaveAttribute('href', 'https://studio.capitalcoredance.com/register/majorette')
  }
})

test('does not mention a registration fee', () => {
  renderPage()
  expect(document.body.textContent).not.toMatch(/registration fee|no fee/i)
})
