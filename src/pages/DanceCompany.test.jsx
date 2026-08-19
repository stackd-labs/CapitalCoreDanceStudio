import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DanceCompany from './DanceCompany'
import { ACCENTS } from '../lib/pageAccents'
import { COMPANY_PRICING } from '../lib/tuition'

// The August 10–13 2026 clinic has been and gone. Its portal registration form is no
// longer a live destination, so every action on this page routes to Contact until the
// studio builds the replacement form.
const CONTACT_PATH = '/contact'

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

test('nothing still points at the retired competition-clinic form', () => {
  // The clinic form was this page's only portal destination. With the clinic over it is a
  // dead end, so no link on the page should reach the portal at all.
  renderPage()
  expect(document.querySelectorAll('a[href*="register/competition-clinic"]')).toHaveLength(0)
  expect(document.querySelectorAll('a[href*="studio.capitalcoredance.com"]')).toHaveLength(0)
})

test('the past clinic dates, times and cost are gone from the page', () => {
  // These read as an upcoming event. Leaving them up tells a family to show up on a date
  // four days in the past and to bring $80 for it.
  renderPage()
  expect(screen.queryByText('August 10–13 · Mon–Thu')).not.toBeInTheDocument()
  expect(screen.queryByText('5:30 – 7:30 PM')).not.toBeInTheDocument()
  expect(screen.queryByText('$80 per dancer')).not.toBeInTheDocument()
  expect(document.body.textContent).not.toMatch(/August 1[0-3]/)
  expect(document.body.textContent).not.toMatch(/\$80/)
})

test('the clinic-dated audition steps are gone with it', () => {
  // All three steps were the clinic: register for it, attend it, bring a parent to its
  // Wednesday session. Rewriting them generically would mean inventing an audition
  // process the studio has never published, so the section goes rather than being faked.
  renderPage()
  expect(screen.queryAllByTestId('audition-step')).toHaveLength(0)
  expect(screen.queryByRole('heading', { name: /How auditions work/i })).not.toBeInTheDocument()
})

test('states the company tuition and exactly what the fee covers', () => {
  // Added 2026-08-17. Read from COMPANY_PRICING rather than typed, so this page and
  // /tuition cannot end up quoting different figures — the defect src/lib/tuition.js was
  // created to prevent.
  renderPage()
  const block = screen.getByTestId('company-tuition')
  expect(block.textContent).toContain(`$${COMPANY_PRICING.monthly}`)
  expect(block.textContent).toMatch(/3 hours of company practice/i)
  expect(block.textContent).toMatch(/up to 3 Capital Core dance classes/i)
  // The allowance is part of the fee whether it is used or not. "Recommended only" was
  // ambiguous in the brief and the studio confirmed this reading on 2026-08-17 — without
  // it a parent could read the classes as compulsory.
  expect(block.textContent).toMatch(/recommended, not required/i)
  // And the limit has to be stated, or "up to 3" implies the fourth is free too.
  expect(block.textContent).toMatch(/additional/i)
})

test('offers families who missed the clinic a way in', () => {
  renderPage()
  expect(screen.getByRole('heading', { name: /Missed the clinic/i })).toBeInTheDocument()
  expect(screen.getByTestId('missed-clinic-cta')).toHaveAttribute('href', CONTACT_PATH)
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
    CONTACT_PATH
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
