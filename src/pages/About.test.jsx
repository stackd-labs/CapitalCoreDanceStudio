import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import About from './About'
import { INSTRUCTORS } from '../lib/instructors'

function renderAbout() {
  return render(
    <MemoryRouter initialEntries={['/about']}>
      <About />
    </MemoryRouter>
  )
}

test('renders the hero with the gold solid wedge', () => {
  renderAbout()
  expect(screen.getByRole('heading', { level: 1, name: 'About us' })).toBeInTheDocument()
  expect(screen.getByTestId('hero-panel')).toBeInTheDocument()
  expect(screen.queryByTestId('accent-panel')).not.toBeInTheDocument()
})

test('does not assert a founding year the studio has not confirmed', () => {
  // The mockup's hero eyebrow reads "EST. 2025". Nobody has verified that, and a wrong
  // founding date on an About page is a factual claim, not decoration.
  renderAbout()
  expect(document.body.textContent).not.toMatch(/EST\.?\s*20\d\d/i)
})

test('carries the studio prose: story, approach, vision', () => {
  renderAbout()
  expect(screen.getByRole('heading', { name: /every dancer belongs/i })).toBeInTheDocument()
  expect(screen.getByText(/founded on the belief that dance should be a place/i)).toBeInTheDocument()
  expect(screen.getByText(/best dance education combines strong instruction/i)).toBeInTheDocument()
  expect(screen.getByText(/build confidence, friendships, discipline, and joy/i)).toBeInTheDocument()
})

test('renders the four pillars and all seven programs', () => {
  renderAbout()
  expect(screen.getAllByTestId('pillar')).toHaveLength(4)
  expect(screen.getAllByTestId('program')).toHaveLength(7)
  expect(screen.getByText('We focus on more than choreography')).toBeInTheDocument()
})

test('the staff grid renders one card per real instructor, none of them empty', () => {
  // Replaces the scaffold assertion on 2026-08-13, when the studio supplied six
  // instructor flyers. The rule it enforced has not changed — nobody on this page may be
  // invented — it is just enforced from the other direction now: every card must carry a
  // real name, role and bio from src/lib/instructors.js, and a real headshot rather than
  // the hatched placeholder.
  renderAbout()
  const cards = screen.getAllByTestId('staff-card')
  expect(cards).toHaveLength(INSTRUCTORS.length)
  cards.forEach((card, i) => {
    const person = INSTRUCTORS[i]
    expect(card.querySelector('[data-testid="staff-name"]').textContent.trim()).toBe(
      person.firstName
    )
    expect(card.querySelector('[data-testid="staff-role"]').textContent.trim()).toBe(person.role)
    expect(card.querySelector('[data-testid="staff-bio"]').textContent.trim()).toBe(person.bio)
    // A real <img>, not the placeholder well.
    expect(card.querySelector('[data-testid="photo-slot"]'), `${person.name} headshot`).toBeNull()
    expect(card.querySelector('img')).toHaveAttribute('src', person.photo)
  })
})

test('every instructor entry is complete enough to publish', () => {
  // A half-filled entry renders as a card with a hole in it. Guard the data, not the
  // markup: this catches a new instructor being added with, say, no bio.
  for (const person of INSTRUCTORS) {
    for (const field of [
      'slug',
      'firstName',
      'name',
      'role',
      'specialties',
      'bio',
      'photo',
      'photoAlt',
    ]) {
      expect(person[field], `${person.slug || 'unnamed'} is missing ${field}`).toBeTruthy()
    }
    expect(person.photo, `${person.slug} photo path`).toBe(`/instructor-${person.slug}.jpg`)
    expect(person.bio.length, `${person.slug} bio is too thin to publish`).toBeGreaterThan(120)
  }
})

test('the staff section does not imply it is the whole faculty', () => {
  // Six of the nine instructors on the Fall flyer have profiles. A grid presented as
  // "our instructors" full stop would quietly write off three real colleagues.
  renderAbout()
  expect(screen.getByText(/not yet the whole faculty/i)).toBeInTheDocument()
})

test('closes with the studio call to action', () => {
  renderAbout()
  expect(screen.getByRole('heading', { name: 'Come dance with Capital Core' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Become Part of the Family' })).toHaveAttribute(
    'href',
    '/contact'
  )
})

test('the staff grid is ordered by first name, and shows only first names', () => {
  // Alphabetical rather than by seniority, so nothing in the order reads as a ranking.
  // The export is sorted rather than the literal hand-ordered, which is what makes a
  // seventh instructor land in the right place on their own.
  const shown = screen.queryAllByTestId('staff-name')
  expect(shown).toHaveLength(0) // nothing rendered yet — guards against a stale render

  renderAbout()
  const names = screen.getAllByTestId('staff-name').map((el) => el.textContent.trim())
  expect(names).toEqual(['Adelle', 'Jillian', 'Kendall', 'Milan', 'Savannah', 'Yul'])
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  // No titles and no surnames on the card, even though the roster still records them.
  for (const name of names) {
    expect(name, `${name} should be a bare first name`).not.toMatch(/^(Mr|Ms|Mrs)\.?\s/i)
    expect(name.split(/\s+/), `${name} should be one word`).toHaveLength(1)
  }
  expect(INSTRUCTORS.find((p) => p.firstName === 'Yul').name).toBe('Mr. Yul Tyler Jr.')
})
