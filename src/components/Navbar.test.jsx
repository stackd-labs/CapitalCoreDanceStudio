import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { ACCENTS, accentForPath } from '../lib/pageAccents'

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
  // The active item is marked with aria-current plus white text, not by its accent
  // underline — every item carries an underline, so colour alone cannot mark 'current'.
  const classesLinks = screen.getAllByRole('link', { name: 'Classes' })
  expect(classesLinks[0]).toHaveAttribute('aria-current', 'page')
  expect(classesLinks[0].className).toContain('text-white')
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
  // Adults left this dropdown for the top bar on 2026-08-11 — it must not be in both.
  expect(screen.queryByRole('link', { name: 'Adult Classes' })).not.toBeInTheDocument()

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
  // The active item is marked with aria-current plus white text, not by its accent
  // underline — every item carries an underline, so colour alone cannot mark 'current'.
  const classesLinks = screen.getAllByRole('link', { name: 'Classes' })
  expect(classesLinks[0]).toHaveAttribute('aria-current', 'page')
  expect(classesLinks[0].className).toContain('text-white')
})

test('Adults is its own top-level item, no longer under Classes', () => {
  // Promoted out of the dropdown on 2026-08-11. On /adult-classes it is Adults that
  // reads as current — Classes must not, or the bar points at the wrong section.
  renderNavbar('/adult-classes')
  const adults = screen.getAllByRole('link', { name: 'Adults' })[0]
  expect(adults).toHaveAttribute('href', '/adult-classes')
  expect(adults).toHaveAttribute('aria-current', 'page')
  expect(adults.className).toContain('text-white')

  const classes = screen.getAllByRole('link', { name: 'Classes' })[0]
  expect(classes).not.toHaveAttribute('aria-current')
})

test('Adults carries its own accent in the bar, not the Classes orange', () => {
  // Read from ACCENTS rather than a literal: the underline is meant to be whatever the
  // Adults page wears, and hard-coding the hex meant a recolour (purple → lavender,
  // 2026-08-13) failed here as a "wrong colour" rather than reading as intended.
  renderNavbar('/adult-classes')
  const adults = screen.getAllByRole('link', { name: 'Adults' })[0]
  expect(adults).toHaveStyle({ borderColor: accentForPath('/adult-classes') })
  expect(adults).not.toHaveStyle({ borderColor: ACCENTS.orange })
})

test('highlights the Classes parent on /tuition', () => {
  // Tuition is a child of Classes now, so its own page must light up the parent —
  // otherwise a visitor on /tuition sees nothing in the nav marked as current.
  renderNavbar('/tuition')
  // The active item is marked with aria-current plus white text, not by its accent
  // underline — every item carries an underline, so colour alone cannot mark 'current'.
  const classesLinks = screen.getAllByRole('link', { name: 'Classes' })
  expect(classesLinks[0]).toHaveAttribute('aria-current', 'page')
  expect(classesLinks[0].className).toContain('text-white')
})

test('mobile menu includes the Classes sub-links and Adults at top level', () => {
  // Scoped to the sheet: jsdom renders the desktop bar too — Tailwind's `hidden lg:flex`
  // is never applied — so an unscoped query finds every top-level item twice.
  renderNavbar()
  fireEvent.click(screen.getByLabelText('Toggle menu'))
  const sheet = within(screen.getByTestId('mobile-menu'))
  expect(sheet.getByRole('link', { name: 'Class Schedule' })).toHaveAttribute('href', '/classes')
  expect(sheet.getByRole('link', { name: 'Class Levels' })).toHaveAttribute('href', '/class-levels')
  expect(sheet.getByRole('link', { name: 'Tuition' })).toHaveAttribute('href', '/tuition')
  // Adults sits beside Classes in the sheet now, not inside it.
  expect(sheet.getByRole('link', { name: 'Adults' })).toHaveAttribute('href', '/adult-classes')
  expect(sheet.queryByRole('link', { name: 'Adult Classes' })).not.toBeInTheDocument()
})

test('the top-level bar is in the studio\u2019s chosen order', () => {
  // Order is a deliberate choice, not an accident of how NAV_LINKS grew: Home, About,
  // then the programmes by audience — youth classes, the youngest, parties, adults,
  // and the competitive company last. Nothing else pins it, so a reorder from adding
  // an item would otherwise go unnoticed.
  renderNavbar()
  const bar = screen.getByTestId('desktop-nav')
  const labels = [...bar.children].map((el) => el.textContent.replace('▼', '').trim())
  expect(labels).toEqual([
    'Home',
    'About',
    'Classes',
    'Little Movers',
    'Birthdays',
    'Adults',
    'Dance Company',
  ])
})

test('the mobile sheet follows the same order as the bar', () => {
  renderNavbar()
  fireEvent.click(screen.getByLabelText('Toggle menu'))
  const sheet = screen.getByTestId('mobile-menu')
  // Top-level entries only — each is the first link inside its own group wrapper.
  const labels = [...sheet.children]
    .map((group) => group.querySelector('a')?.textContent.trim())
    .filter(Boolean)
  expect(labels.slice(0, 7)).toEqual([
    'Home',
    'About',
    'Classes',
    'Little Movers',
    'Birthdays',
    'Adults',
    'Dance Company',
  ])
})
