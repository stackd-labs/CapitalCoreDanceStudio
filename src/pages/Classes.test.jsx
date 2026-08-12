import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Classes from './Classes'
import { PROGRAMS } from '../lib/schedule'

function renderClasses() {
  return render(<MemoryRouter initialEntries={['/classes']}><Classes /></MemoryRouter>)
}

test('renders the hero headline', () => {
  renderClasses()
  expect(screen.getByRole('heading', { level: 1, name: /Find your class/i })).toBeInTheDocument()
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
  expect(within(grid).getByRole('button', { name: /Tiny Core Ballet & Tumble/ })).toBeInTheDocument()
  // Anchored by day: two rows are named Core Hip Hop & Breakdancing since the
  // 2026-08-04 merge.
  expect(within(grid).getByRole('button', { name: /Core Hip Hop & Breakdancing, Monday/ })).toBeInTheDocument()
  expect(within(grid).getByRole('button', { name: /Core Hip Hop & Breakdancing, Wednesday/ })).toBeInTheDocument()
  expect(within(grid).getByRole('button', { name: /Musical Theatre/ })).toBeInTheDocument()
  // Anchored by day: two schedule rows are named Tumble Tech since the 2026-08-03
  // merge, so an unanchored /Tumble Tech/ matches both blocks.
  expect(within(grid).getByRole('button', { name: /Tumble Tech, Tuesday/ })).toBeInTheDocument()
  expect(within(grid).getByRole('button', { name: /Tumble Tech, Thursday/ })).toBeInTheDocument()
})

test('does not render Private Lessons', () => {
  renderClasses()
  expect(screen.queryByText('Private Lessons')).not.toBeInTheDocument()
})

test('renders filter bar with program, age and style filters', () => {
  renderClasses()
  // The Day dropdown was removed when the schedule became a week calendar — a week
  // view already shows every day. Program was added 2026-08-10.
  expect(screen.getAllByRole('combobox')).toHaveLength(3)
  expect(screen.getByRole('option', { name: 'Tiny (2–5)' })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: 'Hip Hop' })).toBeInTheDocument()
  expect(screen.queryByRole('option', { name: 'All Days' })).not.toBeInTheDocument()
})

test('the program filter lists every scheduled tier with its age range', () => {
  renderClasses()
  for (const label of [
    'Tiny Core (2–5)',
    'Core (5+)',
    'Core Plus (8+)',
    'Technique (All Levels)',
    'Specialty (All Ages)',
    'Adult Core (16+)',
  ]) {
    expect(screen.getByRole('option', { name: label })).toBeInTheDocument()
  }
})

test('a tier with no classes is announced in the key but kept out of the filter', () => {
  // Core Elite exists in PROGRAMS from 2026-08-11 with no classes assigned yet.
  // Offering it as a filter option would give a dropdown entry that always lands on
  // the empty state — indistinguishable from a broken filter.
  renderClasses()
  expect(screen.queryByRole('option', { name: /Core Elite/ })).not.toBeInTheDocument()
  expect(within(screen.getByTestId('program-key')).getByText('Core Elite')).toBeInTheDocument()
})

test('the program key explains every tier, including unscheduled ones', () => {
  renderClasses()
  const key = within(screen.getByTestId('program-key'))
  for (const { label, blurb } of PROGRAMS) {
    expect(key.getByText(label), `${label} missing from the key`).toBeInTheDocument()
    expect(key.getByText(blurb), `${label} has no explanation`).toBeInTheDocument()
  }
  // The studio's 2026-08-11 ask: Core must say who it is for, not just its name.
  expect(key.getByText(/new to dance/i)).toBeInTheDocument()
  expect(key.getByText(/returning dancers/i)).toBeInTheDocument()
})

test('program filter narrows the calendar to one tier', () => {
  renderClasses()
  const [programSelect] = screen.getAllByRole('combobox')

  // Core Plus is the three 8+ classes. Lyrical & Contemporary joined them on
  // 2026-08-10, moving up from Core. Grid order is by day column, so Monday first.
  fireEvent.change(programSelect, { target: { value: 'core-plus' } })
  let blocks = within(screen.getByTestId('class-grid')).getAllByTestId('class-block')
  expect(blocks.map((b) => b.getAttribute('aria-label'))).toEqual([
    'Core Plus Acro & Lyrical, Monday 6:15 – 7:15 PM',
    'Core Plus Ballet & Contemporary, Monday 7:15 – 8:00 PM',
    'Core Plus Lyrical & Contemporary, Friday 6:15 – 7:00 PM',
  ])

  // Technique is both Tumble Tech classes — the tier that exists because the flyer
  // labelled them Core Plus but colour-coded them all-levels Technique.
  fireEvent.change(programSelect, { target: { value: 'technique' } })
  blocks = within(screen.getByTestId('class-grid')).getAllByTestId('class-block')
  expect(blocks).toHaveLength(2)
  for (const block of blocks) {
    expect(block.getAttribute('aria-label')).toMatch(/^Tumble Tech/)
  }
})

test('program and style filters compose rather than override', () => {
  renderClasses()
  const [programSelect, , styleSelect] = screen.getAllByRole('combobox')
  fireEvent.change(programSelect, { target: { value: 'core' } })
  fireEvent.change(styleSelect, { target: { value: 'hiphop' } })

  // Core ∩ hiphop drops Monday's Core Plus classes and the tiny/ballet hip hop combos,
  // leaving the two standalone Core Hip Hop & Breakdancing classes.
  const blocks = within(screen.getByTestId('class-grid')).getAllByTestId('class-block')
  expect(blocks).toHaveLength(2)
  for (const block of blocks) {
    expect(block.getAttribute('aria-label')).toMatch(/^Core Hip Hop & Breakdancing/)
  }
})

test('style filter narrows the calendar to matching classes', () => {
  renderClasses()
  const grid = screen.getByTestId('class-grid')
  expect(within(grid).getAllByTestId('class-block')).toHaveLength(22)

  const [, , styleSelect] = screen.getAllByRole('combobox')
  fireEvent.change(styleSelect, { target: { value: 'hiphop' } })

  // Only two rows carry category 'hiphop': Monday's and Wednesday's Core Hip Hop &
  // Breakdancing. Tiny Core Ballet & Hip Hop is category 'tiny' and Core Ballet &
  // Hip Hop is category 'ballet', so neither is included.
  const blocks = within(screen.getByTestId('class-grid')).getAllByTestId('class-block')
  expect(blocks).toHaveLength(2)
  for (const block of blocks) {
    expect(block.getAttribute('aria-label')).toMatch(/Hip Hop/)
  }
})

test('age filter narrows the calendar to matching classes', () => {
  renderClasses()
  const [, ageSelect] = screen.getAllByRole('combobox')
  fireEvent.change(ageSelect, { target: { value: 'adult' } })
  const blocks = within(screen.getByTestId('class-grid')).getAllByTestId('class-block')
  expect(blocks).toHaveLength(3)
})

test('a filter combination with no classes shows the empty state', () => {
  renderClasses()
  const [, ageSelect, styleSelect] = screen.getAllByRole('combobox')
  fireEvent.change(ageSelect, { target: { value: 'tiny' } })
  fireEvent.change(styleSelect, { target: { value: 'musical-theatre' } })
  // Exactly once: the card grid owns the empty state, and the week section swaps its
  // calendar for a shorter prompt rather than repeating the same sentence.
  expect(
    screen.getAllByText('No classes match your filters. Try adjusting your selection.')
  ).toHaveLength(1)
  expect(screen.getByText('Clear a filter above to see the full week.')).toBeInTheDocument()
})

test('renders the printable Fall flyer card with a download link', () => {
  renderClasses()
  const card = screen.getByTestId('fall-flyer-card')
  expect(within(card).getByRole('img', { name: /Fall 2026 full class schedule/i })).toBeInTheDocument()
  const download = within(card).getByRole('link', { name: 'Download PNG' })
  expect(download).toHaveAttribute('href', '/flyer-fall-schedule.png')
  expect(download).toHaveAttribute('download', 'capital-core-fall-2026-schedule.png')
})

test('View Flyer opens the lightbox and Close dismisses it', () => {
  renderClasses()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'View Flyer' }))
  const dialog = screen.getByRole('dialog', { name: 'Fall 2026 schedule flyer' })
  expect(within(dialog).getByRole('link', { name: 'Download Flyer' })).toBeInTheDocument()

  fireEvent.click(within(dialog).getByRole('button', { name: /Close/ }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('Escape closes the flyer lightbox', () => {
  renderClasses()
  fireEvent.click(screen.getByRole('button', { name: 'View Flyer' }))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('renders Enroll Now CTA', () => {
  renderClasses()
  expect(screen.getByRole('link', { name: 'Enroll Now' })).toBeInTheDocument()
})

test('the class card grid mirrors the calendar and both follow the filters', () => {
  renderClasses()
  expect(screen.getAllByTestId('class-card')).toHaveLength(22)

  const [programSelect] = screen.getAllByRole('combobox')
  fireEvent.change(programSelect, { target: { value: 'core-plus' } })
  expect(screen.getAllByTestId('class-card')).toHaveLength(3)
  expect(within(screen.getByTestId('class-grid')).getAllByTestId('class-block')).toHaveLength(3)
})

test('the Enroll Now action keeps its button styling when given a layout class', () => {
  // Regression: the action wrappers spread caller props after their own className, so
  // className="mt-8" replaced the whole button style and Enroll Now rendered as bare
  // text. It must carry both its own classes and the caller's.
  renderClasses()
  const enroll = screen.getByRole('link', { name: 'Enroll Now' })
  expect(enroll.className).toContain('mt-8')
  expect(enroll.className).toContain('font-bold')
  expect(enroll).toHaveStyle({ background: '#ff8c2b' })
})

test('button text on a light accent is navy, not white', () => {
  // White on #ff8c2b is ~2.3:1. The mockup draws these navy for that reason.
  renderClasses()
  expect(screen.getByRole('link', { name: 'Register now' })).toHaveStyle({ color: '#0d1b34' })
})

test('Classes uses a single solid accent wedge, not the home stripe', () => {
  renderClasses()
  expect(screen.getByTestId('hero-panel')).toBeInTheDocument()
  expect(screen.queryByTestId('accent-panel')).not.toBeInTheDocument()
})
