import { render, screen, fireEvent } from '@testing-library/react'
import ClassDetailPanel from './ClassDetailPanel'

const ROW = {
  name: 'Core Acro & Jazz',
  day: 'Monday',
  time: '5:30 – 6:15 PM',
  ages: 'Ages 5+',
  infoKey: 'Core Acro & Jazz',
  program: 'core',
}

function renderPanel(props = {}) {
  const onClose = props.onClose || (() => {})
  const utils = render(<ClassDetailPanel classInfo={ROW} onClose={onClose} {...props} />)
  return { ...utils, onClose }
}

test('renders nothing when no class is selected', () => {
  const { container } = render(<ClassDetailPanel classInfo={null} onClose={() => {}} />)
  expect(container).toBeEmptyDOMElement()
})

test('shows the class name, day, time, ages, and prose', () => {
  renderPanel()
  expect(screen.getByRole('heading', { name: 'Core Acro & Jazz' })).toBeInTheDocument()
  expect(screen.getByText(/Monday/)).toBeInTheDocument()
  expect(screen.getByText(/5:30 – 6:15 PM/)).toBeInTheDocument()
  expect(screen.getByText('Ages 5+')).toBeInTheDocument()
  expect(screen.getByText(/A high-energy class introducing dancers/)).toBeInTheDocument()
  // Audience lines were removed 2026-08-03 at the studio's request.
  expect(screen.queryByText(/Great for energetic kids/)).not.toBeInTheDocument()
})

test('is an accessible modal dialog labelled by the class name', () => {
  renderPanel()
  const dialog = screen.getByRole('dialog')
  expect(dialog).toHaveAttribute('aria-modal', 'true')
  expect(dialog).toHaveAccessibleName('Core Acro & Jazz')
})

test('registration button opens the portal in a new tab', () => {
  renderPanel()
  const register = screen.getByRole('link', { name: 'Register for Fall →' })
  expect(register).toHaveAttribute('href', 'https://studio.capitalcoredance.com/register/classes')
  expect(register).toHaveAttribute('target', '_blank')
  expect(register).toHaveAttribute('rel', 'noopener noreferrer')
})

test('Escape closes the panel', () => {
  const onClose = vi.fn()
  renderPanel({ onClose })
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('the Close button closes the panel', () => {
  const onClose = vi.fn()
  renderPanel({ onClose })
  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('clicking the backdrop closes the panel but clicking inside does not', () => {
  const onClose = vi.fn()
  renderPanel({ onClose })
  fireEvent.click(screen.getByTestId('panel-backdrop'))
  expect(onClose).toHaveBeenCalledTimes(1)

  fireEvent.click(screen.getByRole('dialog'))
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('Tab from the Register anchor wraps focus back to Close', () => {
  renderPanel()
  const register = screen.getByRole('link', { name: 'Register for Fall →' })
  const close = screen.getByRole('button', { name: 'Close' })
  register.focus()
  expect(document.activeElement).toBe(register)
  fireEvent.keyDown(document, { key: 'Tab' })
  expect(document.activeElement).toBe(close)
})

test('Shift+Tab from the Close button wraps focus to Register', () => {
  renderPanel()
  const register = screen.getByRole('link', { name: 'Register for Fall →' })
  const close = screen.getByRole('button', { name: 'Close' })
  close.focus()
  expect(document.activeElement).toBe(close)
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
  expect(document.activeElement).toBe(register)
})

test('falls back gracefully when a class has no prose entry', () => {
  render(
    <ClassDetailPanel
      classInfo={{ ...ROW, infoKey: 'Nonexistent Class' }}
      onClose={() => {}}
    />
  )
  // The name, day, and time still come from the schedule row, so the panel is useful
  // even if a future schedule row is added before its copy is written.
  expect(screen.getByRole('heading', { name: 'Core Acro & Jazz' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Register for Fall →' })).toBeInTheDocument()
})

test('shows the program tier as a badge', () => {
  renderPanel()
  expect(screen.getByTestId('program-badge')).toHaveTextContent('Core')
})

test('omits the badge for a row with no program tier', () => {
  // Guards the optional render: a schedule row added without `program` should still
  // open a usable panel rather than showing an empty badge chip.
  const { program, ...rowWithoutProgram } = ROW
  render(<ClassDetailPanel classInfo={rowWithoutProgram} onClose={() => {}} />)
  expect(screen.queryByTestId('program-badge')).not.toBeInTheDocument()
})
