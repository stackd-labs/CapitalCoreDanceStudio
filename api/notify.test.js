// @vitest-environment node
import { vi, describe, it, expect, beforeEach } from 'vitest'

const mockSend = vi.fn()
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: mockSend } }
  }),
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

  it('returns 400 for missing or invalid body', async () => {
    const req = { method: 'POST', body: null }
    const res = makeRes()
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
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

  it('rejects the form types whose pages were retired, rather than emailing on them', async () => {
    // Fourteen form types were trimmed to one on 2026-08-19 when the camp, summer,
    // recital and birthday-booking pages were deleted. Nothing posts these any more,
    // and a rebuilt form should get its own builder rather than reviving an old one —
    // so each has to 400 rather than fall through to the contact email.
    const retired = [
      'birthday',
      'birthday_deposit',
      'camp_registration',
      'camp_deposit',
      'summer_class_registration',
      'summer_class_deposit',
      'adult_series_interest',
      'adult_series_registration',
      'adult_series_payment',
      'spirit_week_idea',
      'recital_order',
      'recital_ticket',
      'recital_program',
      'recital_combined',
    ]
    for (const formType of retired) {
      mockSend.mockClear()
      const res = makeRes()
      await handler({ method: 'POST', body: { formType } }, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(mockSend).not.toHaveBeenCalled()
    }
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
