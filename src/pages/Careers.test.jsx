import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Careers from './Careers'

function renderCareers() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/careers']}>
        <Careers />
      </MemoryRouter>
    </HelmetProvider>
  )
}

// The disclosure toggle for one role, found by its accessible name rather than by
// position: the button's name is built from the whole summary row, so a substring match
// on the title is what stays stable when the schedule or pay line changes.
function toggleFor(title) {
  return screen.getByRole('button', { name: new RegExp(title, 'i') })
}

test('leads with the hiring headline', () => {
  renderCareers()
  expect(screen.getByRole('heading', { level: 1, name: 'Teach with us' })).toBeInTheDocument()
})

test('lists the two roles the studio is actually hiring for', () => {
  // The mockup shipped five invented openings. Only real ones belong on a live careers
  // page, so this pins the count as well as the titles: an extra row here means somebody
  // pasted the mockup's filler back in.
  renderCareers()
  const rows = screen.getAllByTestId('role-row')
  expect(rows).toHaveLength(2)
  expect(within(rows[0]).getByText('Preschool Instructor')).toBeInTheDocument()
  expect(within(rows[1]).getByText('Irish Dance Instructor')).toBeInTheDocument()
})

test('shows the pay band on the summary row, before anything is expanded', () => {
  // The two numbers applicants screen on. If a posting is ever edited without its summary
  // line, this catches the drift.
  renderCareers()
  expect(screen.getByText('$15 to $25 / hour')).toBeInTheDocument()
  expect(screen.getByText('From $30 / hour')).toBeInTheDocument()
})

test('postings start collapsed', () => {
  renderCareers()
  for (const title of ['Preschool Instructor', 'Irish Dance Instructor']) {
    expect(toggleFor(title)).toHaveAttribute('aria-expanded', 'false')
  }
  expect(screen.queryByText(/Little Movers is designed for infants/)).not.toBeInTheDocument()
})

test('expanding a posting reveals its full description and an apply button', () => {
  renderCareers()
  const toggle = toggleFor('Preschool Instructor')
  fireEvent.click(toggle)

  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByText(/Little Movers is designed for infants/)).toBeInTheDocument()
  expect(screen.getByText('Sensory Steps')).toBeInTheDocument()
  expect(screen.getByText(/\$15\.00 to \$25\.00 per hour/)).toBeInTheDocument()

  const apply = screen.getByRole('link', { name: 'Apply for this role' })
  expect(apply).toHaveAttribute('href', '/contact?interest=employment')
})

test('the Irish dance posting states its starting rate and that the schedule is open', () => {
  renderCareers()
  fireEvent.click(toggleFor('Irish Dance Instructor'))
  expect(screen.getByText(/Starting at \$30\.00 per hour/)).toBeInTheDocument()
  expect(screen.getByText(/class times will be built around your availability/)).toBeInTheDocument()
})

test('a posting collapses again on a second click', () => {
  // Both postings are long. Without this the section becomes unnavigable once opened.
  renderCareers()
  const toggle = toggleFor('Irish Dance Instructor')
  fireEvent.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  fireEvent.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('link', { name: 'Apply for this role' })).not.toBeInTheDocument()
})

test('the toggle points at the panel it controls', () => {
  renderCareers()
  const toggle = toggleFor('Preschool Instructor')
  fireEvent.click(toggle)
  const panelId = toggle.getAttribute('aria-controls')
  expect(document.getElementById(panelId)).toBeInTheDocument()
})

test('carries no form fields at all', () => {
  // The whole point of the "How to apply" panel: the real form comes from the studio
  // portal later. A stray input here would collect applications nothing is listening for.
  renderCareers()
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /submit|send application/i })).not.toBeInTheDocument()
})

test('offers both ways to work with the studio without being hired', () => {
  renderCareers()
  const cards = screen.getAllByTestId('partner-card')
  expect(cards).toHaveLength(2)
  expect(within(cards[0]).getByRole('heading', { name: 'Studio Affiliate' })).toBeInTheDocument()
  expect(within(cards[1]).getByRole('heading', { name: 'Community Partner' })).toBeInTheDocument()
  for (const card of cards) {
    expect(within(card).getByTestId('primary-action')).toHaveAttribute(
      'href',
      '/contact?interest=partnership'
    )
  }
})

test('the hero CTA jumps to the open roles section', () => {
  renderCareers()
  expect(screen.getByRole('link', { name: 'See open roles' })).toHaveAttribute('href', '#open-roles')
  expect(screen.getByTestId('open-roles-heading')).toBeInTheDocument()
})

test('wears the studio crest in the hero, like the other crest pages', () => {
  renderCareers()
  const crest = screen.getByAltText(/Capital Core Dance Studio crest/i)
  expect(crest).toHaveAttribute('src', '/logo.png')
  expect(crest).toHaveClass('object-contain')
})

test('shows the faculty photograph rather than an empty well', () => {
  renderCareers()
  expect(screen.getByAltText(/instructors in black studio wear/i)).toHaveAttribute(
    'src',
    '/careers-faculty.jpg'
  )
})

test('keeps a direct email route for anyone who would rather not use the form page', () => {
  renderCareers()
  expect(screen.getByRole('link', { name: 'Email the studio' })).toHaveAttribute(
    'href',
    'mailto:info@capitalcoredance.com'
  )
})

test('walks an applicant through the four hiring steps', () => {
  renderCareers()
  for (const step of ['Reach out', 'Phone chat', 'Teach a class', 'Offer']) {
    expect(screen.getByText(step)).toBeInTheDocument()
  }
})
