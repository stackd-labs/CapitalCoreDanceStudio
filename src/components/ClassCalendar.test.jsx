import { render, screen, fireEvent, within } from '@testing-library/react'
import ClassCalendar, { clusterByOverlap } from './ClassCalendar'
import { SCHEDULE } from '../lib/schedule'

function renderCalendar(schedule = SCHEDULE) {
  return render(<ClassCalendar schedule={schedule} />)
}

const MONDAY = SCHEDULE.find((d) => d.day === 'Monday').classes

test('clusterByOverlap puts concurrent classes in one cluster and sequential ones apart', () => {
  const clusters = clusterByOverlap(MONDAY)
  const names = clusters.map((c) => c.map((x) => x.name))
  // Every Monday class is now sequential — one cluster each. That is the whole point
  // of taking the Dance Company off the calendar: it was the only thing overlapping, and
  // with it gone the day stacks in a single readable column.
  expect(names).toEqual([
    ['Tiny Core Ballet & Tumble'],
    ['Core Hip Hop & Breakdancing'],
    ['Core Contemporary & Jazz'],
    ['Ballet Tech'],
  ])
})

test('clusterByOverlap treats a class ending exactly when the next starts as sequential', () => {
  // Picked by NAME rather than by index: MONDAY[0] is now the Dance Company, which overlaps
  // everything before 19:00, so the old positional fixture stopped expressing
  // "back to back". Tiny ends 17:30 and Hip Hop starts 17:30 — touching, not
  // overlapping.
  const tiny = MONDAY.find((c) => c.name === 'Tiny Core Ballet & Tumble')
  const hiphop = MONDAY.find((c) => c.name === 'Core Hip Hop & Breakdancing')
  const clusters = clusterByOverlap([tiny, hiphop])
  expect(clusters).toHaveLength(2)
})

test('renders every class in both the grid and the mobile list', () => {
  renderCalendar()
  expect(screen.getAllByTestId('class-block')).toHaveLength(18)
  expect(screen.getAllByTestId('class-list-item')).toHaveLength(18)
})

test('block height encodes duration', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  const block = (name) =>
    within(grid).getByRole('button', { name: new RegExp(name.replace(/[/]/g, '\\/')) })

  // 30-minute class spans 2 slots, 45-minute spans 3, 60-minute spans 4.
  expect(block('Tiny Core Ballet & Tumble')).toHaveAttribute('data-span', '2')
  expect(block('Core Ballet & Modern')).toHaveAttribute('data-span', '3')
  // 60 minutes is the longest block on the calendar now the Dance Company is off it.
  expect(block('Core Plus Acro & Lyrical')).toHaveAttribute('data-span', '3')
})

test('block start slot is measured from the start of the derived window', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  // Back to a 17:00 start now the Dance Company's 3:00 PM Sunday session is off the
  // calendar. The bounds are still DERIVED — they simply resolve to the evening
  // again — so 17:00 is slot 0, Thursday's 17:15 is slot 1, and 19:30 is slot 10.
  expect(within(grid).getByRole('button', { name: /Tiny Core Ballet & Tumble/ })).toHaveAttribute('data-start-slot', '0')
  expect(within(grid).getByRole('button', { name: /Core Ballet & Jazz, Thursday/ })).toHaveAttribute('data-start-slot', '1')
  expect(within(grid).getByRole('button', { name: /Adult Pom/ })).toHaveAttribute('data-start-slot', '10')
})

test('nothing on the calendar overlaps, so every block spans its full column', () => {
  // The side-by-side machinery is still there and still tested by clusterByOverlap
  // above — but as of 2026-09-02 no two classes on the calendar actually run at the
  // same time. The Dance Company was the only overlap and it is off the grid. This asserts
  // the CONSEQUENCE the studio asked for: every day stacks in one clean column.
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  for (const block of within(grid).getAllByTestId('class-block')) {
    expect(block, block.getAttribute('aria-label')).toHaveAttribute('data-cluster-size', '1')
    expect(block.style.width).toBe('100%')
  }
})

test('a class with no concurrent neighbour spans the full day column', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  // Ballet Tech starts exactly as the Dance Company ends, so nothing overlaps it. Adult
  // Femme/Flair held this role until it came off the schedule.
  const solo = within(grid).getByRole('button', { name: /Ballet Tech, Monday/ })
  expect(solo).toHaveAttribute('data-cluster-size', '1')
  expect(solo.style.left).toBe('0%')
  expect(solo.style.width).toBe('100%')
})

test('each block names its class, day, and time for screen readers', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  expect(
    within(grid).getByRole('button', { name: 'Musical Theatre, Tuesday 6:15 – 7:00 PM' })
  ).toBeInTheDocument()
})

test('a mobile list item names its class, day, time, and ages for screen readers', () => {
  // aria-label short-circuits name-from-contents, so the visible ages text
  // ("All Levels") must be repeated explicitly in the label or a screen-reader user
  // never hears it, even though a sighted user sees it.
  renderCalendar()
  const list = screen.getByTestId('class-list')
  expect(
    within(list).getByRole('button', {
      name: 'Musical Theatre, Tuesday 6:15 – 7:00 PM, All Ages',
    })
  ).toBeInTheDocument()
})

test('renders a column header for exactly the days the schedule runs', () => {
  // DERIVED from the schedule rather than listed, because the failure runs both ways:
  // a day missing from ClassCalendar's DAY_ORDER is silently dropped from the grid,
  // and a day left in it after its last class goes renders an empty column. Sunday
  // did both within one day on 2026-09-02 — added with the Dance Company, removed with it.
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  const days = SCHEDULE.filter(({ classes }) => classes.length > 0).map(({ day }) => day)
  expect(days).not.toContain('Sunday')
  for (const day of days) {
    expect(within(grid).getByText(day)).toBeInTheDocument()
  }
})

test('renders the time gutter every half hour across the derived window', () => {
  // Back to 5:00–9:00 now the Dance Company's 3:00 PM Sunday session is off the calendar.
  // The bounds are still derived; they resolve to the evening again, and the two
  // hours of empty afternoon the Dance Company dragged in have gone with it.
  renderCalendar()
  const labels = screen.getAllByTestId('time-label').map((el) => el.textContent.trim())
  expect(labels).toEqual([
    '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00',
  ])
})

test('clicking a block opens its detail panel; Escape closes it and restores focus', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  const block = within(grid).getByRole('button', { name: /Musical Theatre/ })

  fireEvent.click(block)
  const dialog = screen.getByRole('dialog')
  expect(within(dialog).getByRole('heading', { name: 'Musical Theatre' })).toBeInTheDocument()
  expect(within(dialog).getByText(/Tuesday/)).toBeInTheDocument()

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(document.activeElement).toBe(block)
})

test('clicking a mobile list card opens the same panel', () => {
  renderCalendar()
  const list = screen.getByTestId('class-list')
  fireEvent.click(within(list).getByRole('button', { name: /Adult Pom/ }))
  expect(screen.getByRole('heading', { name: 'Adult Pom' })).toBeInTheDocument()
})

test('renders only what it is given', () => {
  const oneDay = [SCHEDULE.find((d) => d.day === 'Friday')]
  renderCalendar(oneDay)
  expect(screen.getAllByTestId('class-block')).toHaveLength(3)
})

test('shows an empty state when handed nothing', () => {
  renderCalendar([])
  expect(screen.getByText('No classes match your filters. Try adjusting your selection.')).toBeInTheDocument()
  expect(screen.queryByTestId('class-grid')).not.toBeInTheDocument()
})

test('does not resurrect a closed panel when the filter is later relaxed back to include the previously selected class', () => {
  // Regression test for the Task 5 review finding: narrowing the schedule to zero
  // must not merely hide the open panel — it must clear the selection. A test that
  // only checks "no dialog right after narrowing to empty" cannot tell that apart
  // from the pre-fix bug, because React unmounts the whole subtree (panel included)
  // the moment the component's root JSX flips from a fragment of grid+list+panel to
  // a bare empty-state <div> — regardless of what `selected` still holds. The real
  // bug only shows up one step later, when the filter relaxes back: with the bug,
  // `selected` is still the stale class, so it reappears with no click. This test
  // exercises that full round trip.
  const { rerender } = renderCalendar()
  const grid = screen.getByTestId('class-grid')
  fireEvent.click(within(grid).getByRole('button', { name: /Musical Theatre/ }))
  expect(screen.getByRole('dialog')).toBeInTheDocument()

  // Narrow to empty — Musical Theatre is filtered out.
  rerender(<ClassCalendar schedule={[]} />)
  expect(screen.getByText('No classes match your filters. Try adjusting your selection.')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  // Relax the filter back to a schedule that again contains Musical Theatre (Wednesday).
  // The panel must stay closed — reopening it requires a click, not a filter change.
  const wednesday = SCHEDULE.find((d) => d.day === 'Wednesday')
  rerender(<ClassCalendar schedule={[wednesday]} />)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
