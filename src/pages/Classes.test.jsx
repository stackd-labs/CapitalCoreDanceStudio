import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Classes from './Classes'

function renderClasses() {
  return render(<MemoryRouter initialEntries={['/classes']}><Classes /></MemoryRouter>)
}

test('renders page title', () => {
  renderClasses()
  expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument()
})

test('renders day group headers by default', () => {
  renderClasses()
  // Days appear in both filter buttons and section headers — check at least one exists
  expect(screen.getAllByText('Monday').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Tuesday').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Wednesday').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Thursday').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Friday').length).toBeGreaterThan(0)
})

test('renders real class names', () => {
  renderClasses()
  expect(screen.getAllByText('Tiny Ballet / Tumble').length).toBeGreaterThan(0)
  expect(screen.getByText('Beginner Hip Hop & Breakdancing')).toBeInTheDocument()
  // Musical Theatre appears as both a filter option and class name
  expect(screen.getAllByText('Musical Theatre').length).toBeGreaterThan(0)
  expect(screen.getByText('Tumble Tech')).toBeInTheDocument()
})

test('does not render Private Lessons', () => {
  renderClasses()
  expect(screen.queryByText('Private Lessons')).not.toBeInTheDocument()
})

test('renders filter bar with day, age, and style filters', () => {
  renderClasses()
  // Day, Age Group, and Dance Style are <select> dropdowns
  expect(screen.getAllByRole('combobox')).toHaveLength(3)
  expect(screen.getByRole('option', { name: 'Tiny (2–5)' })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: 'Hip Hop' })).toBeInTheDocument()
})

test('day filter shows only selected day', () => {
  renderClasses()
  const [daySelect] = screen.getAllByRole('combobox')
  fireEvent.change(daySelect, { target: { value: 'Wednesday' } })
  expect(screen.getByText('Wednesday', { selector: 'div' })).toBeInTheDocument()
  expect(screen.queryByText('Monday', { selector: 'div' })).not.toBeInTheDocument()
})

test('renders Enroll Now CTA', () => {
  renderClasses()
  expect(screen.getByRole('link', { name: 'Enroll Now' })).toBeInTheDocument()
})
