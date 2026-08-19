import { Resend } from 'resend'

// Trimmed 2026-08-19 from fourteen form types to one.
//
// Every other type was posted by a page that no longer exists: the camp, summer class
// and adult summer series registrations and payments, the recital shirt, ticket, program
// and combined orders, the spirit week idea box, and the on-site birthday booking flow
// (party requests go through the studio portal now). Their email builders went with
// them, about 640 lines. Recover any of it from git history at 2165126 — but note that
// a rebuilt form should get a builder written against its own fields rather than an old
// one restored, which is why they were deleted rather than left dormant.
//
// The contact form on /contact is the only thing on the site that posts here.

const resend = new Resend(process.env.RESEND_API_KEY)

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Mirrors INTEREST_GROUPS in src/pages/Contact.jsx. The form posts the option's value,
// which is a slug, and "little-movers" in the studio's inbox reads worse than the label
// the parent actually picked. Unknown values fall through to the raw string rather than
// to "Not specified", so an option added to the form without a line here still arrives.
const INTEREST_LABELS = {
  trial: 'Free Trial',
  classes: 'Year-Round Classes',
  'class-levels': 'Class Levels & Placement',
  'little-movers': 'Little Movers (ages 0-5)',
  'adult-classes': 'Adult Classes',
  'dance-company': 'Dance Company / Competition Team',
  'summer-classes': 'Summer Classes',
  camps: 'Summer Camps',
  'adult-series': 'Adult Summer Series',
  tour: 'Studio Tour',
  tuition: 'Tuition, Fees & Discounts',
  'registration-help': 'Help With Registration or Payment',
  birthdays: 'Birthdays / Parties',
  newsletter: 'Studio News & Updates',
  employment: 'Teaching or Working at the Studio',
  partnership: 'Affiliate or Partnership',
  general: 'General Inquiry',
}

function buildContactEmail({ firstName, lastName, email, phone, interest, dancerName, dancerAge, message }) {
  const isTrial = interest === 'trial'
  const interestLabel = INTEREST_LABELS[interest] || interest
  const trialBlock = isTrial
    ? `<p><strong>Free Trial · Dancer:</strong> ${escapeHtml(dancerName) || 'Not provided'}${dancerAge ? ` (age ${escapeHtml(dancerAge)})` : ''}</p>`
    : ''
  return `
    <h2>${isTrial ? 'New Free Trial Request' : 'New Contact Form Submission'}</h2>
    <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone) || 'Not provided'}</p>
    <p><strong>Interest:</strong> ${escapeHtml(interestLabel) || 'Not specified'}</p>
    ${trialBlock}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message)}</p>
  `
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  const { formType, ...data } = req.body

  // Kept as a branch rather than flattened to a single path: when the recital and
  // summer forms are rebuilt they post here again, and an unknown formType must keep
  // returning 400 rather than quietly emailing the studio a contact form full of
  // fields it does not have.
  let subject, html
  if (formType === 'contact') {
    subject = data.interest === 'trial' ? 'New Free Trial Request' : 'New Contact Form Submission'
    html = buildContactEmail(data)
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
