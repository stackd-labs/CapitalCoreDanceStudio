import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function renderNavbar(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  )
}

test('renders logo text', () => {
  renderNavbar()
  expect(screen.getByText('CAPITAL CORE')).toBeInTheDocument()
  expect(screen.getByText('DANCE STUDIO')).toBeInTheDocument()
})

test('renders all nav links', () => {
  renderNavbar()
  expect(screen.getAllByRole('link', { name: 'Home' })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Classes' })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Tuition' })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Birthdays' })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Contact Us' })[0]).toBeInTheDocument()
})

test('highlights active link on /classes', () => {
  renderNavbar('/classes')
  const classesLinks = screen.getAllByRole('link', { name: 'Classes' })
  expect(classesLinks[0].className).toContain('text-[#f4a8b4]')
})

test('mobile menu toggle shows and hides menu', () => {
  renderNavbar()
  const toggleBtn = screen.getByLabelText('Toggle menu')
  // Mobile menu links are duplicated in DOM when open
  expect(screen.getAllByRole('link', { name: 'Classes' })).toHaveLength(1)
  fireEvent.click(toggleBtn)
  expect(screen.getAllByRole('link', { name: 'Classes' })).toHaveLength(2)
  fireEvent.click(toggleBtn)
  expect(screen.getAllByRole('link', { name: 'Classes' })).toHaveLength(1)
})
