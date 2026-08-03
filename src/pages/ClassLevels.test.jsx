import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ClassLevels from './ClassLevels'

function renderClassLevels() {
  return render(
    <MemoryRouter initialEntries={['/class-levels']}>
      <ClassLevels />
    </MemoryRouter>
  )
}

test('renders page title', () => {
  renderClassLevels()
  expect(screen.getByRole('heading', { name: 'Class Levels' })).toBeInTheDocument()
})

test('renders all six levels with their age lines', () => {
  renderClassLevels()
  const levels = [
    ['Tiny', 'Ages 2–5'],
    ['Beginner', 'Ages 5+'],
    ['Intermediate', 'By placement'],
    ['Advanced', 'By placement'],
    ['Adult', 'Ages 16+'],
    ['Specialty', 'Ages 5+'],
  ]
  for (const [name, ages] of levels) {
    expect(screen.getAllByText(name).length).toBeGreaterThan(0)
    expect(screen.getAllByText(ages).length).toBeGreaterThan(0)
  }
  // 'By placement' is shared by Intermediate and Advanced; 'Ages 5+' by Beginner
  // and Specialty. The unique ones must appear exactly once.
  expect(screen.getAllByText('By placement')).toHaveLength(2)
  expect(screen.getAllByText('Ages 5+')).toHaveLength(2)
  expect(screen.getAllByText('Ages 2–5')).toHaveLength(1)
  expect(screen.getAllByText('Ages 16+')).toHaveLength(1)
})

test('every level card has a non-empty blurb', () => {
  renderClassLevels()
  const cards = screen.getAllByTestId('level-card')
  expect(cards).toHaveLength(6)
  for (const card of cards) {
    const blurb = card.querySelector('[data-testid="level-blurb"]')
    expect(blurb).not.toBeNull()
    expect(blurb.textContent.trim().length).toBeGreaterThan(20)
  }
})

test('links to the class schedule and the register portal', () => {
  renderClassLevels()
  expect(screen.getByRole('link', { name: 'See the Fall Schedule' })).toHaveAttribute('href', '/classes')
  expect(screen.getByRole('link', { name: 'Register for Fall →' })).toHaveAttribute(
    'href',
    'https://studio.capitalcoredance.com/register/classes'
  )
})

test('renders all eleven styles', () => {
  renderClassLevels()
  const styles = [
    'Ballet',
    'Jazz',
    'Hip Hop',
    'Contemporary',
    'Tap',
    'Acro & Tumbling',
    'Lyrical',
    'Breakdancing',
    'Musical Theatre',
    'Pom & Cheer',
    'Creative Movement',
  ]
  for (const style of styles) {
    expect(screen.getAllByText(style).length).toBeGreaterThan(0)
  }
  expect(screen.getAllByTestId('style-card')).toHaveLength(11)
})

test('every style card has a non-empty description and at least one level badge', () => {
  renderClassLevels()
  for (const card of screen.getAllByTestId('style-card')) {
    const description = card.querySelector('[data-testid="style-description"]')
    expect(description).not.toBeNull()
    expect(description.textContent.trim().length).toBeGreaterThan(20)
    expect(card.querySelectorAll('[data-testid="style-badge"]').length).toBeGreaterThan(0)
  }
})

test('does not list Adult as a style', () => {
  renderClassLevels()
  // Adult is a level, not a style — it appears as a badge, never as a style card.
  const styleNames = screen
    .getAllByTestId('style-card')
    .map((card) => card.querySelector('[data-testid="style-name"]').textContent.trim())
  expect(styleNames).not.toContain('Adult')
  expect(styleNames).not.toContain('Adult Classes')
})
