import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { vi, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Contact from './Contact'

// No Supabase mock: this form is email-only as of 2026-08-03 and must not import the
// Supabase client at all. The test below asserts that.

afterEach(() => {
  vi.restoreAllMocks()
  delete global.fetch
})

function renderContact() {
  return render(<MemoryRouter initialEntries={['/contact']}><Contact /></MemoryRouter>)
}

test('renders page title', () => {
  renderContact()
  // The h1 became the mockup's "Come say hello" in the 2026-08-11 redesign; the page
  // is still Contact Us in the nav, the footer and the URL.
  expect(screen.getByRole('heading', { level: 1, name: 'Come say hello' })).toBeInTheDocument()
})

test('renders first and last name fields', () => {
  renderContact()
  expect(screen.getByPlaceholderText('First name')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument()
})

test('renders email field', () => {
  renderContact()
  expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
})

test('renders phone field', () => {
  renderContact()
  expect(screen.getByPlaceholderText('(000) 000-0000')).toBeInTheDocument()
})

test('renders interest dropdown', () => {
  renderContact()
  expect(screen.getByRole('combobox')).toBeInTheDocument()
})

test('renders message textarea', () => {
  renderContact()
  expect(screen.getByPlaceholderText('How can we help?')).toBeInTheDocument()
})

test('renders submit button', () => {
  renderContact()
  expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument()
})

function fillAndSubmit() {
  fireEvent.change(screen.getByPlaceholderText('First name'), { target: { value: 'Jane' } })
  fireEvent.change(screen.getByPlaceholderText('Last name'), { target: { value: 'Doe' } })
  fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByPlaceholderText('(000) 000-0000'), { target: { value: '8045551234' } })
  fireEvent.change(screen.getByPlaceholderText('How can we help?'), { target: { value: 'Hello' } })
  fireEvent.click(screen.getByRole('button', { name: 'Send Message' }))
}

test('calls /api/notify with contact formType and every field the studio needs', async () => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: true }))

  renderContact()
  fillAndSubmit()

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/notify', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('"formType":"contact"'),
    }))
  })

  // The email is now the only record of the submission, so it has to carry the
  // details a Supabase row used to hold.
  const body = JSON.parse(global.fetch.mock.calls[0][1].body)
  expect(body).toMatchObject({
    formType: 'contact',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phone: '8045551234',
    message: 'Hello',
  })
})

test('does not write to Supabase', async () => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: true }))

  renderContact()
  fillAndSubmit()

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
  // Exactly one network call, to the email endpoint. If a database write is ever added
  // back, this count changes and the intent of the 2026-08-03 change is flagged.
  expect(global.fetch.mock.calls.map((c) => c[0])).toEqual(['/api/notify'])
})

test('confirms to the visitor only when the email actually sent', async () => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: true }))

  renderContact()
  fillAndSubmit()

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'Message sent!' })).toBeInTheDocument()
  })
})

test('shows the error and the direct email address when sending fails', async () => {
  // A 500 from the endpoint must not read as success — with no database row behind it,
  // a false confirmation means the enquiry is lost with nobody aware.
  global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500 }))

  renderContact()
  fillAndSubmit()

  await waitFor(() => {
    expect(
      screen.getByText(
        'Something went wrong. Please try again or email us directly at info@capitalcoredance.com.'
      )
    ).toBeInTheDocument()
  })
  expect(screen.queryByRole('heading', { name: 'Message sent!' })).not.toBeInTheDocument()
})

test('shows the error when the request itself throws', async () => {
  global.fetch = vi.fn(() => Promise.reject(new Error('offline')))

  renderContact()
  fillAndSubmit()

  await waitFor(() => {
    expect(
      screen.getByText(
        'Something went wrong. Please try again or email us directly at info@capitalcoredance.com.'
      )
    ).toBeInTheDocument()
  })
  expect(screen.queryByRole('heading', { name: 'Message sent!' })).not.toBeInTheDocument()
})

test('wears the five-accent stripe hero, with HELLO tinted a letter at a time', () => {
  // Contact is one of only two pages the mockup marks "all five accents" — the other
  // being Home. A single solid wedge here would be the wrong page.
  renderContact()
  expect(screen.getByTestId('accent-panel')).toBeInTheDocument()
  expect(screen.queryByTestId('hero-panel')).not.toBeInTheDocument()

  const tinted = [
    ...screen.getByRole('heading', { level: 1 }).querySelectorAll('span[style*="color"]'),
  ]
  expect(tinted.map((el) => el.textContent).join('')).toBe('hello')
  expect(new Set(tinted.map((el) => el.style.color)).size).toBe(5)
})

test('the ?interest=trial deep link preselects the trial and reveals the dancer fields', () => {
  // The free-trial links across the site point here. The redesign rewrote this whole
  // form, so the deep link needed pinning.
  render(
    <MemoryRouter initialEntries={['/contact?interest=trial']}>
      <Contact />
    </MemoryRouter>
  )
  expect(screen.getByLabelText(/interested in/i)).toHaveValue('trial')
  expect(screen.getByText(/set up your free trial/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Dancer.s Name/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/^Age$/i)).toBeInTheDocument()
})

test('lists the studio address, phone and email as real links', () => {
  // Scoped to the details column — the footer carries the same three links on every
  // page, so an unscoped query matches twice.
  renderContact()
  const details = within(screen.getByTestId('studio-details'))
  expect(details.getByRole('link', { name: /13110 Midlothian Turnpike/ })).toHaveAttribute(
    'href',
    expect.stringContaining('maps.google.com')
  )
  expect(details.getByRole('link', { name: '804-234-4014' })).toHaveAttribute('href', 'tel:8042344014')
  expect(details.getByRole('link', { name: 'info@capitalcoredance.com' })).toHaveAttribute(
    'href',
    'mailto:info@capitalcoredance.com'
  )
})
