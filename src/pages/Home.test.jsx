import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

function renderHome() {
  return render(<MemoryRouter><Home /></MemoryRouter>)
}

test('renders hero headline', () => {
  renderHome()
  expect(screen.getByText('MOVE WITH')).toBeInTheDocument()
  expect(screen.getByText('PURPOSE')).toBeInTheDocument()
})

test('renders hero subtext', () => {
  renderHome()
  expect(screen.getByText(/Fall dance classes and birthday parties/)).toBeInTheDocument()
})

test('renders section card titles', () => {
  renderHome()
  expect(screen.getAllByRole('link', { name: /Classes/ })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: /Birthdays/ })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: /Contact Us/ })[0]).toBeInTheDocument()
})

test('renders What We Offer section heading', () => {
  renderHome()
  expect(screen.getByText('Get ready to groove at the Core')).toBeInTheDocument()
})

test('offers all four programs, adult classes included', () => {
  renderHome()
  // The grid is md:grid-cols-2, so four cards fill it evenly.
  const expected = [
    ['/classes', 'View Fall Classes'],
    ['/adult-classes', 'View Adult Classes'],
    ['/birthdays', 'View Packages'],
    ['/contact', 'Contact Us'],
  ]
  for (const [href, label] of expected) {
    const link = [...document.querySelectorAll(`a[href="${href}"]`)].find((a) =>
      a.textContent.includes(label)
    )
    expect(link, `${href} card is missing`).toBeTruthy()
  }
})

test('the adult classes card links to the adult page with its own photo', () => {
  renderHome()
  const card = [...document.querySelectorAll('a[href="/adult-classes"]')].find((a) =>
    a.textContent.includes('View Adult Classes')
  )
  expect(card.querySelector('img')).toHaveAttribute('src', '/card-adult-dance.jpg')
  expect(card.textContent).toContain('Ages 16+')
})
