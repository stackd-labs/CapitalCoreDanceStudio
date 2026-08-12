import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PageHeader from './PageHeader'
import { ACCENTS } from '../lib/pageAccents'

function renderHeader(props = {}, route = '/classes') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <PageHeader eyebrow="Capital Core Dance" title="Classes" {...props} />
    </MemoryRouter>
  )
}

test('renders eyebrow, title, and subtitle', () => {
  renderHeader({ subtitle: 'Year-round dance instruction.' })
  expect(screen.getByRole('heading', { level: 1, name: 'Classes' })).toBeInTheDocument()
  expect(screen.getByText('Capital Core Dance')).toBeInTheDocument()
  expect(screen.getByText('Year-round dance instruction.')).toBeInTheDocument()
})

test('omits the subtitle paragraph entirely when none is given', () => {
  renderHeader()
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(screen.queryByText(/year-round/i)).not.toBeInTheDocument()
})

test('takes its accent from the route', () => {
  const { unmount } = renderHeader({}, '/classes')
  expect(screen.getByTestId('header-eyebrow')).toHaveStyle({ color: ACCENTS.orange })
  unmount()

  renderHeader({}, '/birthdays')
  expect(screen.getByTestId('header-eyebrow')).toHaveStyle({ color: ACCENTS.pink })
})

test('the wedge and the eyebrow always carry the same accent', () => {
  // They are the only two places the accent appears, so a mismatch reads as a bug
  // rather than as a design choice.
  renderHeader({}, '/little-movers')
  expect(screen.getByTestId('header-eyebrow')).toHaveStyle({ color: ACCENTS.teal })
  expect(screen.getByTestId('header-wedge')).toHaveStyle({ background: ACCENTS.teal })
})

test('an explicit accent prop overrides the route', () => {
  renderHeader({ accent: ACCENTS.gold }, '/classes')
  expect(screen.getByTestId('header-eyebrow')).toHaveStyle({ color: ACCENTS.gold })
})

test('the wedge is decorative and hidden from screen readers', () => {
  // It carries no information a non-sighted visitor needs, and it must never be
  // announced between the eyebrow and the page title.
  renderHeader()
  expect(screen.getByTestId('header-wedge')).toHaveAttribute('aria-hidden', 'true')
})

test('the title is a single h1 so each page keeps one top-level heading', () => {
  renderHeader({ subtitle: 'Something.' })
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
})
