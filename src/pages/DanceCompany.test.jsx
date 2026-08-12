import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DanceCompany from './DanceCompany'
import { ACCENTS } from '../lib/pageAccents'

const REGISTER_URL = 'https://studio.capitalcoredance.com/register/competition-clinic'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/dance-company']}>
      <DanceCompany />
    </MemoryRouter>
  )
}

test('renders the hero on the shared red wedge', () => {
  renderPage()
  expect(screen.getByRole('heading', { level: 1, name: 'Dance company' })).toBeInTheDocument()
  expect(screen.getByTestId('hero-panel')).toHaveStyle({ background: ACCENTS.red })
})

test('every registration action points at the competition-clinic route', () => {
  // This page has its own portal route, separate from class registration. Sending an
  // auditioning family to /register/classes would put them in the wrong flow.
  renderPage()
  const links = [...document.querySelectorAll('a[href*="studio.capitalcoredance.com"]')]
  expect(links.length).toBeGreaterThan(0)
  for (const link of links) {
    expect(link.getAttribute('href')).toBe(REGISTER_URL)
  }
})

test('states the clinic facts families need to decide', () => {
  renderPage()
  expect(screen.getByText('August 10–13 · Mon–Thu')).toBeInTheDocument()
  expect(screen.getByText('5:30 – 7:30 PM')).toBeInTheDocument()
  expect(screen.getByText('6 and up')).toBeInTheDocument()
  expect(screen.getByText('$80 per dancer')).toBeInTheDocument()
})

test('the audition steps only restate facts published elsewhere on the page', () => {
  // Three steps, not the mockup's four: what happens after the clinic has never been
  // published, so it is omitted rather than invented. If a fourth appears, it needs a
  // real source.
  renderPage()
  const steps = screen.getAllByTestId('audition-step')
  expect(steps).toHaveLength(3)
  expect(steps[0]).toHaveTextContent('$80 per dancer')
  expect(steps[1]).toHaveTextContent('August 10–13')
  expect(steps[2]).toHaveTextContent(/Wednesday, August 12/)
})

test('credits the director and keeps the founding-clinic flyer', () => {
  renderPage()
  expect(screen.getByRole('heading', { name: 'Yul Tyler Jr.' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: /Competition Team Building Clinic/i })).toHaveAttribute(
    'src',
    '/flyer-comp-team.png'
  )
})

test('keeps the marquee, and it stays out of the accessibility tree twice over', () => {
  // The marquee duplicates its word list to loop seamlessly; the second copy is
  // aria-hidden so a screen reader hears "Train Grow Belong…" once, not twice.
  renderPage()
  const hidden = document.querySelectorAll('[aria-hidden="true"]')
  expect(hidden.length).toBeGreaterThan(0)
  expect(screen.getAllByText('Belong').length).toBeGreaterThan(0)
})

test('closes on the founding-season call to action', () => {
  renderPage()
  const closing = screen.getByRole('heading', { name: /Train\. Grow\. Belong\./i })
  expect(closing).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Become a founding member' })).toHaveAttribute(
    'href',
    REGISTER_URL
  )
})

test('carries no leftover light-theme surfaces', () => {
  // This page alternated white and navy sections before the redesign. A stray bg-white
  // here would be a blinding band in the middle of a navy site.
  renderPage()
  const white = [...document.querySelectorAll('[class*="bg-white"]')].filter(
    (el) => !/bg-white\/\[?\d/.test(el.className)
  )
  expect(white.map((el) => el.className)).toEqual([])
})
