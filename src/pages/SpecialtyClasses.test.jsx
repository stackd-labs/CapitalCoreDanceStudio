import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SpecialtyClasses from './SpecialtyClasses'

function renderPage() {
  return render(<MemoryRouter initialEntries={['/specialty-classes']}><SpecialtyClasses /></MemoryRouter>)
}

test('lists exactly Musical Theatre and Majorette', () => {
  renderPage()
  const cards = screen.getAllByTestId('specialty-class')
  expect(cards).toHaveLength(2)
  const names = cards.map((c) => within(c).getByRole('heading', { level: 3 }).textContent).sort()
  expect(names).toEqual(['Majorette', 'Musical Theatre'])
})

test('times and instructors come from the schedule', () => {
  renderPage()
  const text = screen.getAllByTestId('specialty-class').map((c) => c.textContent).join(' | ')
  expect(text).toMatch(/Tuesdays · 6:15 – 7:00 PM/)
  expect(text).toMatch(/Wednesdays · 6:45 – 7:30 PM/)
  expect(text).toMatch(/Ms\. Milan/)
})

test('Majorette registers on its own form and links to its page; Musical Theatre uses the class form', () => {
  renderPage()
  const [mt, maj] = ['Musical Theatre', 'Majorette'].map((n) =>
    screen.getAllByTestId('specialty-class').find((c) => within(c).getByRole('heading', { level: 3 }).textContent === n)
  )
  expect(within(maj).getByRole('link', { name: /Register/ })).toHaveAttribute('href', 'https://studio.capitalcoredance.com/register/majorette')
  expect(within(maj).getByRole('link', { name: /Learn more/ })).toHaveAttribute('href', '/majorette')
  expect(within(mt).getByRole('link', { name: /Register/ })).toHaveAttribute('href', 'https://studio.capitalcoredance.com/register/classes')
})
