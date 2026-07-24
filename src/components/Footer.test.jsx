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

test('renders location placeholder', () => {
  renderFooter()
  expect(screen.getByText(/Midlothian, Virginia/i)).toBeInTheDocument()
})

test('renders copyright', () => {
  renderFooter()
  expect(screen.getByText(/© 2026 Capital Core Dance Studio/)).toBeInTheDocument()
})
