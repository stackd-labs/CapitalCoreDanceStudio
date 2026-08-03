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

test('renders all top-level nav links', () => {
  renderNavbar()
  expect(screen.getAllByRole('link', { name: 'Home' })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Classes' })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Dance Company' })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Birthdays' })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Contact Us' })[0]).toBeInTheDocument()
  // Tuition moved under the Classes dropdown on 2026-08-03 — it is deliberately
  // NOT a top-level item any more. See the dropdown test below.
  expect(screen.queryByRole('link', { name: 'Tuition' })).not.toBeInTheDocument()
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

test('caret button toggles the Classes dropdown', () => {
  renderNavbar()
  const caret = screen.getByRole('button', { name: 'Classes menu' })
  expect(caret).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('link', { name: 'Class Levels' })).not.toBeInTheDocument()

  fireEvent.click(caret)
  expect(caret).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('link', { name: 'Class Schedule' })).toHaveAttribute('href', '/classes')
  expect(screen.getByRole('link', { name: 'Class Levels' })).toHaveAttribute('href', '/class-levels')
  expect(screen.getByRole('link', { name: 'Tuition' })).toHaveAttribute('href', '/tuition')

  fireEvent.click(caret)
  expect(caret).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('link', { name: 'Class Levels' })).not.toBeInTheDocument()
})

test('mouse click on the caret does not close a hover-opened menu', () => {
  renderNavbar()
  const caret = screen.getByRole('button', { name: 'Classes menu' })

  // Open via a keyboard-equivalent activation (detail: 0), same as hover would leave it.
  fireEvent.click(caret)
  expect(caret).toHaveAttribute('aria-expanded', 'true')

  // A real mouse click (detail >= 1) must not toggle it closed.
  fireEvent.click(caret, { detail: 1 })
  expect(caret).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('link', { name: 'Class Levels' })).toBeInTheDocument()
})

test('pointer click opens the menu when closed (touch has no hover)', () => {
  renderNavbar()
  const caret = screen.getByRole('button', { name: 'Classes menu' })
  expect(caret).toHaveAttribute('aria-expanded', 'false')

  // Touch/pen at desktop width never fires mouseenter, so a pointer click
  // (detail >= 1) on a closed menu must still open it.
  fireEvent.click(caret, { detail: 1 })
  expect(caret).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('link', { name: 'Class Levels' })).toBeInTheDocument()
})

test('Escape closes the open dropdown', () => {
  renderNavbar()
  const caret = screen.getByRole('button', { name: 'Classes menu' })
  fireEvent.click(caret)
  expect(screen.getByRole('link', { name: 'Class Levels' })).toBeInTheDocument()

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('link', { name: 'Class Levels' })).not.toBeInTheDocument()
  expect(caret).toHaveAttribute('aria-expanded', 'false')
})

test('Escape returns focus to the caret so Tab does not restart at the top of the document', () => {
  renderNavbar()
  const caret = screen.getByRole('button', { name: 'Classes menu' })
  fireEvent.click(caret)
  screen.getByRole('link', { name: 'Class Levels' }).focus()

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(document.activeElement).toBe(caret)
})

test('highlights the Classes parent on /class-levels', () => {
  renderNavbar('/class-levels')
  const classesLinks = screen.getAllByRole('link', { name: 'Classes' })
  expect(classesLinks[0].className).toContain('text-[#f4a8b4]')
})

test('highlights the Classes parent on /tuition', () => {
  // Tuition is a child of Classes now, so its own page must light up the parent —
  // otherwise a visitor on /tuition sees nothing in the nav marked as current.
  renderNavbar('/tuition')
  const classesLinks = screen.getAllByRole('link', { name: 'Classes' })
  expect(classesLinks[0].className).toContain('text-[#f4a8b4]')
})

test('mobile menu includes the Classes sub-links', () => {
  renderNavbar()
  fireEvent.click(screen.getByLabelText('Toggle menu'))
  expect(screen.getAllByRole('link', { name: 'Class Schedule' })).toHaveLength(1)
  expect(screen.getAllByRole('link', { name: 'Class Levels' })).toHaveLength(1)
  expect(screen.getAllByRole('link', { name: 'Tuition' })).toHaveLength(1)
})
