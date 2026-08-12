# Resend Admin Email Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fire an admin email notification to `capitalcoredance@gmail.com` via Resend every time a form is submitted on the Capital Core Dance Studio website.

**Architecture:** A single Vercel serverless function at `api/notify.js` handles all form types. After a successful Supabase insert, the frontend POSTs `{ formType, ...formData }` to `/api/notify`. The function builds a per-form HTML email and sends it via Resend. Email failure is silent to the user — Supabase is the source of truth.

**Tech Stack:** Resend SDK (`resend`), Vercel Serverless Functions, Vitest + @testing-library/react

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `api/notify.js` | Create | Serverless function — receives POST, builds email, calls Resend |
| `api/notify.test.js` | Create | Unit tests for notify handler logic |
| `src/pages/Contact.jsx` | Modify | POST to `/api/notify` after successful Supabase insert |
| `src/pages/BirthdayForm.jsx` | Modify | POST to `/api/notify` after successful Supabase insert |
| `vercel.json` | Modify | Exclude `/api/*` from SPA rewrite |

---

## Task 1: Install Resend and add env vars

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `.env`

- [ ] **Step 1: Install the resend package**

```bash
cd C:/Users/hicks/capitalcoredancewebsite && npm install resend
```

Expected: `resend` appears in `package.json` dependencies.

- [ ] **Step 2: Add missing env vars to .env**

Open `.env` and add these two lines (update `RESEND_API_KEY` if you haven't already replaced the exposed key):

```
ADMIN_EMAIL=capitalcoredance@gmail.com
FROM_EMAIL=onboarding@resend.dev
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/hicks/capitalcoredancewebsite
git add package.json package-lock.json
git commit -m "feat: install resend package"
```

---

## Task 2: Update vercel.json to exclude /api/* from SPA rewrite

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Write failing test** (manual verification — no automated test for vercel.json)

Note: This is a config change. Verify correctness in Step 2 by inspection.

- [ ] **Step 2: Update vercel.json**

Replace the entire contents of `vercel.json` with:

```json
{
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }]
}
```

This regex excludes any path starting with `api/` from being rewritten to `index.html`, allowing Vercel to route those requests to the serverless functions in the `api/` directory.

- [ ] **Step 3: Commit**

```bash
cd C:/Users/hicks/capitalcoredancewebsite
git add vercel.json
git commit -m "fix: exclude /api/* from SPA rewrite"
```

---

## Task 3: Create api/notify.js with tests

**Files:**
- Create: `api/notify.js`
- Create: `api/notify.test.js`

- [ ] **Step 1: Write the failing tests**

Create `api/notify.test.js`:

```js
// @vitest-environment node
import { vi, describe, it, expect, beforeEach } from 'vitest'

const mockSend = vi.fn()
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}))

const { default: handler } = await import('./notify.js')

function makeRes() {
  const res = { status: vi.fn(), json: vi.fn() }
  res.status.mockReturnValue(res)
  res.json.mockReturnValue(res)
  return res
}

beforeEach(() => {
  mockSend.mockReset()
  process.env.RESEND_API_KEY = 'test-key'
  process.env.ADMIN_EMAIL = 'admin@example.com'
  process.env.FROM_EMAIL = 'from@example.com'
})

describe('notify handler', () => {
  it('returns 405 for non-POST requests', async () => {
    const req = { method: 'GET', body: {} }
    const res = makeRes()
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(405)
  })

  it('returns 400 for unknown formType', async () => {
    const req = { method: 'POST', body: { formType: 'unknown' } }
    const res = makeRes()
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('sends contact email with correct subject', async () => {
    mockSend.mockResolvedValue({ id: 'email-123' })
    const req = {
      method: 'POST',
      body: {
        formType: 'contact',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '(804) 555-0000',
        interest: 'classes',
        message: 'Hello there',
      },
    }
    const res = makeRes()
    await handler(req, res)
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'New Contact Form Submission',
      to: 'admin@example.com',
      from: 'from@example.com',
    }))
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('includes contact form fields in email body', async () => {
    mockSend.mockResolvedValue({ id: 'email-123' })
    const req = {
      method: 'POST',
      body: {
        formType: 'contact',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '',
        interest: 'classes',
        message: 'Hello there',
      },
    }
    const res = makeRes()
    await handler(req, res)
    const { html } = mockSend.mock.calls[0][0]
    expect(html).toContain('Jane')
    expect(html).toContain('Doe')
    expect(html).toContain('jane@example.com')
    expect(html).toContain('Hello there')
  })

  it('sends birthday email with correct subject', async () => {
    mockSend.mockResolvedValue({ id: 'email-456' })
    const req = {
      method: 'POST',
      body: {
        formType: 'birthday',
        parentName: 'Sarah Smith',
        email: 'sarah@example.com',
        phone: '(804) 555-1111',
        birthdayName: 'Emma',
        birthdayAge: '7',
        enrolled: 'Yes',
        dateFirst: '2026-05-10',
        dateSecond: '2026-05-17',
        timeSlot: 'Saturday 9:00 – 10:30 AM',
        guestCount: '12',
        theme: 'Princess & Fairytale Dance',
        customTheme: '',
        upgrades: ['Glow Dance Party – $40'],
        bringingFood: 'Yes',
        allergies: 'None',
        referral: 'Social Media',
        promoCode: '',
        notes: '',
      },
    }
    const res = makeRes()
    await handler(req, res)
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'New Birthday Party Booking Request',
      to: 'admin@example.com',
    }))
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('returns 500 and logs error when Resend throws', async () => {
    mockSend.mockRejectedValue(new Error('Resend API down'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const req = {
      method: 'POST',
      body: {
        formType: 'contact',
        firstName: 'Jane', lastName: 'Doe',
        email: 'jane@example.com', phone: '',
        interest: '', message: 'Hi',
      },
    }
    const res = makeRes()
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd C:/Users/hicks/capitalcoredancewebsite && npx vitest run api/notify.test.js
```

Expected: FAIL — `Cannot find module './notify.js'`

- [ ] **Step 3: Create api/notify.js**

Create `api/notify.js`:

```js
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function buildContactEmail({ firstName, lastName, email, phone, interest, message }) {
  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <p><strong>Interest:</strong> ${interest || 'Not specified'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `
}

function buildBirthdayEmail(data) {
  return `
    <h2>New Birthday Party Booking Request</h2>
    <p><strong>Parent Name:</strong> ${data.parentName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Birthday Person:</strong> ${data.birthdayName}, turning ${data.birthdayAge}</p>
    <p><strong>Currently Enrolled:</strong> ${data.enrolled}</p>
    <p><strong>1st Choice Date:</strong> ${data.dateFirst}</p>
    <p><strong>2nd Choice Date:</strong> ${data.dateSecond}</p>
    <p><strong>Time Slot:</strong> ${data.timeSlot}</p>
    <p><strong>Estimated Guests:</strong> ${data.guestCount}</p>
    <p><strong>Theme:</strong> ${data.theme}${data.customTheme ? ` — ${data.customTheme}` : ''}</p>
    <p><strong>Upgrades:</strong> ${data.upgrades?.length ? data.upgrades.join(', ') : 'None'}</p>
    <p><strong>Bringing Food:</strong> ${data.bringingFood}</p>
    <p><strong>Allergies:</strong> ${data.allergies || 'None'}</p>
    <p><strong>Referral:</strong> ${data.referral}</p>
    <p><strong>Promo Code:</strong> ${data.promoCode || 'None'}</p>
    <p><strong>Notes:</strong> ${data.notes || 'None'}</p>
  `
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { formType, ...data } = req.body

  let subject, html
  if (formType === 'contact') {
    subject = 'New Contact Form Submission'
    html = buildContactEmail(data)
  } else if (formType === 'birthday') {
    subject = 'New Birthday Party Booking Request'
    html = buildBirthdayEmail(data)
  } else {
    return res.status(400).json({ error: 'Unknown formType' })
  }

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject,
      html,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd C:/Users/hicks/capitalcoredancewebsite && npx vitest run api/notify.test.js
```

Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/hicks/capitalcoredancewebsite
git add api/notify.js api/notify.test.js
git commit -m "feat: add /api/notify serverless function for admin email notifications"
```

---

## Task 4: Update Contact.jsx to call /api/notify

**Files:**
- Modify: `src/pages/Contact.jsx`
- Modify: `src/pages/Contact.test.jsx`

- [ ] **Step 1: Write the failing test**

Add this test to the bottom of `src/pages/Contact.test.jsx`. Also add the supabase mock at the top of the file (after the existing imports):

At the top of `src/pages/Contact.test.jsx`, add after the existing imports:

```js
import { fireEvent, waitFor } from '@testing-library/react'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}))
```

At the bottom of `src/pages/Contact.test.jsx`, add:

```js
test('calls /api/notify with contact formType after successful submission', async () => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: true }))

  renderContact()

  fireEvent.change(screen.getByPlaceholderText('First name'), { target: { value: 'Jane' } })
  fireEvent.change(screen.getByPlaceholderText('Last name'), { target: { value: 'Doe' } })
  fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByPlaceholderText('How can we help?'), { target: { value: 'Hello' } })
  fireEvent.click(screen.getByRole('button', { name: 'Send Message' }))

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/notify', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('"formType":"contact"'),
    }))
  })
})
```

- [ ] **Step 2: Run the new test to verify it fails**

```bash
cd C:/Users/hicks/capitalcoredancewebsite && npx vitest run src/pages/Contact.test.jsx
```

Expected: New test FAILS — fetch not called. Existing tests pass.

- [ ] **Step 3: Update Contact.jsx — add notify call after successful insert**

In `src/pages/Contact.jsx`, find the `else` branch of the insert result (currently `setStatus('success')` and `setForm(INITIAL_FORM)`) and replace it with:

```js
  } else {
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'contact',
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        interest: form.interest,
        message: form.message,
      }),
    }).catch(() => {})
    setStatus('success')
    setForm(INITIAL_FORM)
  }
```

- [ ] **Step 4: Run all Contact tests to verify they pass**

```bash
cd C:/Users/hicks/capitalcoredancewebsite && npx vitest run src/pages/Contact.test.jsx
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/hicks/capitalcoredancewebsite
git add src/pages/Contact.jsx src/pages/Contact.test.jsx
git commit -m "feat: fire admin email notification on contact form submission"
```

---

## Task 5: Update BirthdayForm.jsx to call /api/notify

**Files:**
- Modify: `src/pages/BirthdayForm.jsx`
- Create: `src/pages/BirthdayForm.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/BirthdayForm.test.jsx`:

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import BirthdayForm from './BirthdayForm'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

function renderForm() {
  return render(<MemoryRouter><BirthdayForm /></MemoryRouter>)
}

test('renders page heading', () => {
  renderForm()
  expect(screen.getByRole('heading', { name: 'Birthday Party Request' })).toBeInTheDocument()
})

test('calls /api/notify with birthday formType after successful submission', async () => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: true }))

  renderForm()

  // Fill required fields
  fireEvent.change(screen.getByPlaceholderText('Full name'), { target: { value: 'Sarah Smith' } })
  fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'sarah@example.com' } })
  fireEvent.change(screen.getByPlaceholderText('(000) 000-0000'), { target: { value: '8045550000' } })
  fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Emma' } })
  fireEvent.change(screen.getByPlaceholderText('e.g. 7'), { target: { value: '7' } })
  fireEvent.change(screen.getByPlaceholderText('e.g. 12'), { target: { value: '10' } })
  fireEvent.change(screen.getByPlaceholderText('List any allergies, or write \'None\''), { target: { value: 'None' } })

  // Radio buttons
  fireEvent.click(screen.getAllByRole('radio', { name: 'Yes' })[0]) // enrolled
  fireEvent.click(screen.getAllByRole('radio', { name: 'Yes' })[1]) // bringingFood

  // Date inputs
  const dateInputs = screen.getAllByDisplayValue('')
  fireEvent.change(screen.getByLabelText('First Choice Party Date'), { target: { value: '2026-05-10' } })
  fireEvent.change(screen.getByLabelText('Second Choice Party Date'), { target: { value: '2026-05-17' } })

  // Time slot and theme (first radio in each group)
  const timeSlotRadios = screen.getAllByRole('radio').filter(r => r.name === 'timeSlot')
  fireEvent.click(timeSlotRadios[0])
  const themeRadios = screen.getAllByRole('radio').filter(r => r.name === 'theme')
  fireEvent.click(themeRadios[0])
  const referralRadios = screen.getAllByRole('radio').filter(r => r.name === 'referral')
  fireEvent.click(referralRadios[0])

  // Policy checkboxes
  fireEvent.click(screen.getByLabelText(/non-refundable deposit/))
  fireEvent.click(screen.getByLabelText(/remaining balance/))
  fireEvent.click(screen.getByLabelText(/not confirmed until the deposit/))
  fireEvent.click(screen.getByLabelText(/waiver/))

  fireEvent.click(screen.getByRole('button', { name: 'Submit Booking Request' }))

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/notify', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('"formType":"birthday"'),
    }))
  })
})
```

- [ ] **Step 2: Run the new test to verify it fails**

```bash
cd C:/Users/hicks/capitalcoredancewebsite && npx vitest run src/pages/BirthdayForm.test.jsx
```

Expected: Second test FAILS — fetch not called. First test passes.

- [ ] **Step 3: Update BirthdayForm.jsx — add notify call after successful insert**

In `src/pages/BirthdayForm.jsx`, find the `else` branch of the insert result (currently `navigate('/birthday-payment')`) and replace it with:

```js
  } else {
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'birthday',
        parentName: form.parentName,
        email: form.email,
        phone: form.phone,
        birthdayName: form.birthdayName,
        birthdayAge: form.birthdayAge,
        enrolled: form.enrolled,
        dateFirst: form.dateFirst,
        dateSecond: form.dateSecond,
        timeSlot: form.timeSlot,
        guestCount: form.guestCount,
        theme: form.theme,
        customTheme: form.customTheme,
        upgrades: form.upgrades,
        bringingFood: form.bringingFood,
        allergies: form.allergies,
        referral: form.referral,
        promoCode: form.promoCode,
        notes: form.notes,
      }),
    }).catch(() => {})
    navigate('/birthday-payment')
  }
```

- [ ] **Step 4: Run all BirthdayForm tests to verify they pass**

```bash
cd C:/Users/hicks/capitalcoredancewebsite && npx vitest run src/pages/BirthdayForm.test.jsx
```

Expected: Both tests PASS.

- [ ] **Step 5: Run full test suite to verify nothing is broken**

```bash
cd C:/Users/hicks/capitalcoredancewebsite && npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
cd C:/Users/hicks/capitalcoredancewebsite
git add src/pages/BirthdayForm.jsx src/pages/BirthdayForm.test.jsx
git commit -m "feat: fire admin email notification on birthday party booking submission"
```

---

## Deploying

After all tasks are complete, push to your deployment branch. Then in the Vercel dashboard, add these environment variables under **Settings → Environment Variables**:

- `RESEND_API_KEY` — your Resend API key
- `ADMIN_EMAIL` — `capitalcoredance@gmail.com`
- `FROM_EMAIL` — `onboarding@resend.dev` (swap for a verified domain when ready)

Vercel will automatically detect the `api/` directory and deploy `notify.js` as a serverless function.

## Adding Future Forms

For any new form:
1. After the Supabase insert succeeds, add a `fetch('/api/notify', ...)` call with a new `formType` value
2. In `api/notify.js`, add a new `else if (formType === 'yourNewType')` branch with a `buildYourNewEmail()` function
3. Add a test to `api/notify.test.js` for the new `formType`
