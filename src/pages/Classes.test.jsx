import { render, screen, fireEvent, within } from '@testing-library/react'
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
  const grid = screen.getByTestId('class-grid')
  expect(within(grid).getByRole('button', { name: /Tiny Ballet \/ Tumble/ })).toBeInTheDocument()
  expect(within(grid).getByRole('button', { name: /Beginner Hip Hop & Breakdancing/ })).toBeInTheDocument()
  expect(within(grid).getByRole('button', { name: /Musical Theatre/ })).toBeInTheDocument()
  expect(within(grid).getByRole('button', { name: /Tumble Tech/ })).toBeInTheDocument()
})

test('does not render Private Lessons', () => {
  renderClasses()
  expect(screen.queryByText('Private Lessons')).not.toBeInTheDocument()
})

test('renders filter bar with age and style filters', () => {
  renderClasses()
  // The Day dropdown was removed when the schedule became a week calendar — a week
  // view already shows every day.
  expect(screen.getAllByRole('combobox')).toHaveLength(2)
  expect(screen.getByRole('option', { name: 'Tiny (2–5)' })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: 'Hip Hop' })).toBeInTheDocument()
  expect(screen.queryByRole('option', { name: 'All Days' })).not.toBeInTheDocument()
})

test('style filter narrows the calendar to matching classes', () => {
  renderClasses()
  const grid = screen.getByTestId('class-grid')
  expect(within(grid).getAllByTestId('class-block')).toHaveLength(22)

  const [, styleSelect] = screen.getAllByRole('combobox')
  fireEvent.change(styleSelect, { target: { value: 'hiphop' } })

  // Only two rows carry category 'hiphop': Monday's Beginner Hip Hop and Wednesday's
  // Beginner Hip Hop & Breakdancing. Tiny Ballet / Hip Hop is category 'tiny' and
  // Beginner Ballet / Hip Hop is category 'ballet', so neither is included.
  const blocks = within(screen.getByTestId('class-grid')).getAllByTestId('class-block')
  expect(blocks).toHaveLength(2)
  for (const block of blocks) {
    expect(block.getAttribute('aria-label')).toMatch(/Hip Hop/)
  }
})

test('age filter narrows the calendar to matching classes', () => {
  renderClasses()
  const [ageSelect] = screen.getAllByRole('combobox')
  fireEvent.change(ageSelect, { target: { value: 'adult' } })
  const blocks = within(screen.getByTestId('class-grid')).getAllByTestId('class-block')
  expect(blocks).toHaveLength(3)
})

test('a filter combination with no classes shows the empty state', () => {
  renderClasses()
  const [ageSelect, styleSelect] = screen.getAllByRole('combobox')
  fireEvent.change(ageSelect, { target: { value: 'tiny' } })
  fireEvent.change(styleSelect, { target: { value: 'musical-theatre' } })
  expect(
    screen.getByText('No classes match your filters. Try adjusting your selection.')
  ).toBeInTheDocument()
})

test('renders Enroll Now CTA', () => {
  renderClasses()
  expect(screen.getByRole('link', { name: 'Enroll Now' })).toBeInTheDocument()
})
