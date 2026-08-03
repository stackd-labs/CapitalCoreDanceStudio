import { render, screen, fireEvent, within } from '@testing-library/react'
import ClassCalendar, { clusterByOverlap } from './ClassCalendar'
import { SCHEDULE } from '../pages/Classes'

function renderCalendar(schedule = SCHEDULE) {
  return render(<ClassCalendar schedule={schedule} />)
}

const MONDAY = SCHEDULE.find((d) => d.day === 'Monday').classes

test('clusterByOverlap puts concurrent classes in one cluster and sequential ones apart', () => {
  const clusters = clusterByOverlap(MONDAY)
  const names = clusters.map((c) => c.map((x) => x.name))
  expect(names).toEqual([
    ['Tiny Ballet / Tumble'],
    ['Beginner Acro / Jazz', 'Beginner Contemp / Jazz'],
    ['Beginner Hip Hop', 'Acro / Lyrical'],
    ['Ballet / Contemp'],
    ['Adult Femme / Flaire'],
  ])
})

test('clusterByOverlap treats a class ending exactly when the next starts as sequential', () => {
  // Tiny ends 17:30 and Beginner Acro starts 17:30 — back to back, not overlapping.
  const clusters = clusterByOverlap([MONDAY[0], MONDAY[1]])
  expect(clusters).toHaveLength(2)
})

test('renders every class in both the grid and the mobile list', () => {
  renderCalendar()
  expect(screen.getAllByTestId('class-block')).toHaveLength(22)
  expect(screen.getAllByTestId('class-list-item')).toHaveLength(22)
})

test('block height encodes duration', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  const block = (name) =>
    within(grid).getByRole('button', { name: new RegExp(name.replace(/[/]/g, '\\/')) })

  // 30-minute class spans 2 slots, 45-minute spans 3, 60-minute spans 4.
  expect(block('Tiny Ballet / Tumble')).toHaveAttribute('data-span', '2')
  expect(block('Beginner Acro / Jazz')).toHaveAttribute('data-span', '3')
  expect(block('Acro / Lyrical')).toHaveAttribute('data-span', '4')
})

test('block start slot is measured from 5:00 PM', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  // 17:00 is slot 0; Thursday's 17:15 start is slot 1; 20:00 is slot 12.
  expect(within(grid).getByRole('button', { name: /Tiny Ballet \/ Tumble/ })).toHaveAttribute('data-start-slot', '0')
  expect(within(grid).getByRole('button', { name: /Beginner Ballet \/ Jazz/ })).toHaveAttribute('data-start-slot', '1')
  expect(within(grid).getByRole('button', { name: /Adult Femme \/ Flaire/ })).toHaveAttribute('data-start-slot', '12')
})

test('concurrent Monday classes render side by side, not stacked', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  // Scoped to ", Monday" — "Beginner Contemp / Jazz" also recurs on Tuesday's schedule,
  // so an unqualified name match is ambiguous across the whole (all-days) grid.
  const acro = within(grid).getByRole('button', { name: /Beginner Acro \/ Jazz, Monday/ })
  const contemp = within(grid).getByRole('button', { name: /Beginner Contemp \/ Jazz, Monday/ })

  expect(acro).toHaveAttribute('data-cluster-size', '2')
  expect(contemp).toHaveAttribute('data-cluster-size', '2')
  expect(acro).toHaveAttribute('data-cluster-index', '0')
  expect(contemp).toHaveAttribute('data-cluster-index', '1')
  // Same rows, different horizontal offsets — that is what "side by side" means here.
  expect(acro.getAttribute('data-start-slot')).toBe(contemp.getAttribute('data-start-slot'))
  expect(acro.style.left).not.toBe(contemp.style.left)
})

test('a class with no concurrent neighbour spans the full day column', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  const solo = within(grid).getByRole('button', { name: /Adult Femme \/ Flaire/ })
  expect(solo).toHaveAttribute('data-cluster-size', '1')
  expect(solo.style.left).toBe('0%')
  expect(solo.style.width).toBe('100%')
})

test('each block names its class, day, and time for screen readers', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  expect(
    within(grid).getByRole('button', { name: 'Tumble Tech, Tuesday 7:00 – 7:45 PM' })
  ).toBeInTheDocument()
})

test('renders all five weekday column headers', () => {
  renderCalendar()
  const grid = screen.getByTestId('class-grid')
  for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
    expect(within(grid).getByText(day)).toBeInTheDocument()
  }
})

test('renders the time gutter every half hour from 5:00 to 9:00', () => {
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
  expect(within(dialog).getByText(/Wednesday/)).toBeInTheDocument()

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
