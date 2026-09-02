import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Classes from './Classes'
import { PROGRAMS, SCHEDULE } from '../lib/schedule'

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
  // Anchored by day: several class names recur across days, so an unanchored match is
  // ambiguous. Tumble Tech held this spot until it came off both its nights on
  // 2026-09-02; the Academy is the new class that runs on more than one day.
  expect(within(grid).getByRole('button', { name: /Capital Core Dance Academy, Sunday/ })).toBeInTheDocument()
  expect(within(grid).getByRole('button', { name: /Capital Core Dance Academy, Thursday/ })).toBeInTheDocument()
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
    // Technique dropped out on 2026-09-02: Tumble Tech was its only class and came
    // off both nights, so the tier has nothing to filter to. Dance Academy took its
    // place in the list.
    'Specialty (All Ages)',
    'Adult Core (16+)',
    'Dance Academy (6–18)',
  ]) {
    expect(screen.getByRole('option', { name: label })).toBeInTheDocument()
  }
})

test('a tier with no classes is announced in the key but kept out of the filter', () => {
  // Offering an empty tier as a filter option gives a dropdown entry that always
  // lands on the empty state — indistinguishable from a broken filter.
  //
  // TWO tiers are empty now. Core Elite has been since it was added on 2026-08-11.
  // Technique joined it on 2026-09-02 when Tumble Tech, its only class, came off both
  // its nights — the same rule, reached a different way, which is why this asserts
  // the behaviour for both rather than naming one.
  renderClasses()
  const key = within(screen.getByTestId('program-key'))
  for (const label of ['Core Elite', 'Technique']) {
    expect(screen.queryByRole('option', { name: new RegExp(label) }), `${label} is offered as a filter`).not.toBeInTheDocument()
    expect(key.getByText(label), `${label} missing from the key`).toBeInTheDocument()
  }
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

  // Core Plus is down to two after the 2026-09-02 rework: Lyrical & Contemporary was
  // parked, Ballet & Contemporary was renamed Ballet Tech, and Acro & Lyrical moved
  // from Monday to Thursday. Grid order is by day column, so Monday first.
  fireEvent.change(programSelect, { target: { value: 'core-plus' } })
  let blocks = within(screen.getByTestId('class-grid')).getAllByTestId('class-block')
  expect(blocks.map((b) => b.getAttribute('aria-label'))).toEqual([
    'Ballet Tech, Monday 7:00 – 7:45 PM',
    'Core Plus Acro & Lyrical, Thursday 7:15 – 8:00 PM',
  ])

  // The Academy replaces Technique here: Technique is no longer offered as a filter
  // at all, so selecting it is not a case a visitor can reach.
  fireEvent.change(programSelect, { target: { value: 'academy' } })
  blocks = within(screen.getByTestId('class-grid')).getAllByTestId('class-block')
  expect(blocks).toHaveLength(3)
  for (const block of blocks) {
    expect(block.getAttribute('aria-label')).toMatch(/^Capital Core Dance Academy/)
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
  expect(within(grid).getAllByTestId('class-block')).toHaveLength(21)

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
  // Exactly once, and it belongs to whichever section comes first — the week calendar
  // since the 2026-08-13 reorder. Saying it twice on one page reads as a bug.
  expect(
    screen.getAllByText('No classes match your filters. Try adjusting your selection.')
  ).toHaveLength(1)
  // The card section drops out entirely rather than rendering an empty titled block
  // under a message that has already explained the emptiness.
  expect(screen.queryByTestId('class-cards')).not.toBeInTheDocument()
  expect(screen.queryByText('What each class is')).not.toBeInTheDocument()
})

test('the week calendar comes before the class cards', () => {
  // The whole point of the 2026-08-13 reorder: the calendar answers "what is on, and
  // when" in one screen, and the cards are the detail layer underneath it. A future edit
  // that reinstates the old order would undo that silently, since both still render.
  renderClasses()
  const calendar = screen.getByTestId('class-grid')
  const cards = screen.getByTestId('class-cards')
  // DOCUMENT_POSITION_FOLLOWING === 4: `cards` comes after `calendar` in document order.
  expect(calendar.compareDocumentPosition(cards) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

test('renders the printable Fall schedule card with a download link', () => {
  // Swapped from the studio's old flyer PNG to a generated one on 2026-09-02. The old
  // image showed the pre-rework week and Core-era naming, so the page was offering a
  // download that contradicted the calendar directly above it.
  renderClasses()
  const card = screen.getByTestId('fall-flyer-card')
  expect(within(card).getByRole('img', { name: /Fall 2026 class schedule/i })).toBeInTheDocument()
  const download = within(card).getByRole('link', { name: 'Download PNG' })
  expect(download).toHaveAttribute('href', '/fall-2026-schedule.png')
  expect(download).toHaveAttribute('download', 'capital-core-fall-2026-schedule.png')
})

test('the printable schedule is the generated one, not the retired flyer', () => {
  // /flyer-fall-schedule.png is still in public/ and still stale. Nothing should point
  // at it: it is kept only so an old link does not 404, and it must never come back as
  // the page's own image.
  renderClasses()
  const srcs = [...document.querySelectorAll('img, a')].map(
    (el) => el.getAttribute('src') || el.getAttribute('href') || ''
  )
  expect(srcs.some((s) => s.includes('flyer-fall-schedule'))).toBe(false)
  expect(srcs.some((s) => s.includes('fall-2026-schedule.png'))).toBe(true)
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
  expect(screen.getAllByTestId('class-card')).toHaveLength(21)

  const [programSelect] = screen.getAllByRole('combobox')
  // Core Plus is two classes after the 2026-09-02 rework, not three. The number matters
  // less than the two counts AGREEING — a card grid and a calendar showing different
  // sets under the same filter is the defect this test exists for — so it is derived
  // once and asserted against both.
  fireEvent.change(programSelect, { target: { value: 'core-plus' } })
  const corePlusCount = SCHEDULE.flatMap(({ classes }) =>
    classes.filter((c) => c.program === 'core-plus')
  ).length
  expect(corePlusCount).toBe(2)
  expect(screen.getAllByTestId('class-card')).toHaveLength(corePlusCount)
  expect(within(screen.getByTestId('class-grid')).getAllByTestId('class-block')).toHaveLength(corePlusCount)
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
