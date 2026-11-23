import { Resend } from 'resend'
import { computeOrder } from '../src/lib/recitalTickets.js'

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


/* Spam screening, added 2026-10-01 after bot submissions started reaching the studio
 * inbox (and, through copyToPortal, the portal's intake bell).
 *
 * Three cheap checks, no third party:
 *  - HONEYPOT. Contact.jsx renders a hidden `ccd_ref` field. Humans never see it, form
 *    bots fill every field. Deliberately NOT named company/email/address/website:
 *    Chrome autofill fills those from a saved profile even when hidden, which silently
 *    blocked real customers on Bounce FX.
 *  - TIMING. The page sends how long the form was open. Under MIN_FILL_MS is a script.
 *    A missing value counts too: that is something posting straight at this endpoint.
 *  - CONTENT. Real-looking email, names without links, length caps, and no
 *    link-stuffed message.
 *
 * Spam gets a 200 {ok:true} and is dropped, so a bot sees success and learns nothing.
 * Only an over-length field gets a real 400, since a human could plausibly hit it.
 * Every drop is logged with its reason, so a false positive shows up in Vercel logs.
 *
 * Next step if this is not enough: Cloudflare Turnstile (free, mostly invisible).
 */
const MIN_FILL_MS = 3000
const MAX_LEN = { firstName: 80, lastName: 80, email: 200, phone: 40, dancerName: 120, dancerAge: 20, message: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LINK_RE = /https?:\/\/|www\.|\[url|<a\s/gi

export function spamReason(data) {
  if (String(data.ccd_ref ?? '').trim() !== '') return 'honeypot'
  const elapsed = Number(data.elapsedMs)
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return 'too-fast'
  if (!EMAIL_RE.test(String(data.email ?? '').trim())) return 'bad-email'
  if (!String(data.firstName ?? '').trim() || !String(data.message ?? '').trim()) return 'missing-fields'
  for (const f of ['firstName', 'lastName', 'dancerName']) {
    if ((String(data[f] ?? '').match(LINK_RE) || []).length) return `link-in-${f}`
  }
  if ((String(data.message ?? '').match(LINK_RE) || []).length > 2) return 'link-stuffed'
  return null
}

function overLength(data) {
  return Object.entries(MAX_LEN).find(([f, max]) => String(data[f] ?? '').length > max)?.[0] ?? null
}


/* ── Holiday Remix 2026 recital tickets ─────────────────────────────────────────────
 * Paid with PayPal in the browser; this endpoint is the record. There is no database,
 * so the studio email IS the order. Same rules as the contact form: spam gets a fake
 * 200, and the money path never throws away an order.
 *
 * The total is recomputed here from the quantities. The PayPal order is then fetched
 * from PayPal and checked (COMPLETED, same amount). A mismatch or a missing
 * PAYPAL_CLIENT_SECRET does NOT drop the order, because the buyer has already paid:
 * it is emailed to the studio flagged UNVERIFIED so a person looks at it. */
const PAYPAL_API = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com'

const USED_PAYPAL_ORDERS = new Set()

async function verifyPaypal(orderId, expectedTotal) {
  const secret = process.env.PAYPAL_CLIENT_SECRET
  const clientId = process.env.VITE_PAYPAL_CLIENT_ID
  if (!secret || !clientId) return { ok: false, note: 'PAYPAL_CLIENT_SECRET not set, payment not checked' }
  try {
    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64')
    const tr = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials',
    })
    if (!tr.ok) return { ok: false, note: `PayPal auth failed (${tr.status})` }
    const { access_token } = await tr.json()
    const or = await fetch(`${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    if (!or.ok) return { ok: false, note: `PayPal order lookup failed (${or.status})` }
    const order = await or.json()
    if (order.status !== 'COMPLETED') return { ok: false, note: `PayPal status is ${order.status}` }
    const pu = order?.purchase_units?.[0]
    // Judge the money that was actually captured, not the amount the browser asked for.
    const cap = pu?.payments?.captures?.[0]
    if (!cap || cap.status !== 'COMPLETED') return { ok: false, note: `PayPal capture status is ${cap?.status ?? 'missing'}` }
    if (cap.amount?.currency_code !== 'USD') return { ok: false, note: `wrong currency ${cap.amount?.currency_code}` }
    const paid = Number(cap.amount?.value)
    if (Math.abs(paid - expectedTotal) > 0.005) return { ok: false, note: `PayPal charged $${paid}, expected $${expectedTotal}` }
    // Set PAYPAL_MERCHANT_ID to also confirm the money went to the studio's account.
    const merchant = process.env.PAYPAL_MERCHANT_ID
    if (merchant && pu?.payee?.merchant_id !== merchant) return { ok: false, note: 'payment went to a different PayPal account' }
    // Best effort per server instance: there is no store, so a replayed ID on a cold
    // instance is not caught. The studio email carries the order ID for a human check.
    if (USED_PAYPAL_ORDERS.has(orderId)) return { ok: false, note: 'DUPLICATE: this PayPal order ID was already used' }
    USED_PAYPAL_ORDERS.add(orderId)
    return { ok: true, note: 'PayPal confirmed the payment' }
  } catch (err) {
    return { ok: false, note: `PayPal check error: ${err?.message ?? err}` }
  }
}

const TICKET_MAX_LEN = { name: 120, email: 200, promoCode: 40, paypalOrderId: 64 }

export function ticketSpamReason(data) {
  if (String(data.ccd_ref ?? '').trim() !== '') return 'honeypot'
  const elapsed = Number(data.elapsedMs)
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return 'too-fast'
  if (!EMAIL_RE.test(String(data.email ?? '').trim())) return 'bad-email'
  if (!String(data.name ?? '').trim()) return 'missing-name'
  if ((String(data.name ?? '').match(LINK_RE) || []).length) return 'link-in-name'
  return null
}

const money = (n) => `$${Number(n).toFixed(2)}`

function ticketLines(o) {
  return [
    o.adult ? `Adult × ${o.adult}` : null,
    o.kid ? `Ages 4 to 11 × ${o.kid}` : null,
    o.child ? `3 and under (free) × ${o.child}` : null,
  ].filter(Boolean)
}

const SHOW = 'Holiday Remix 2026 · Saturday, December 19, 2026 at 2:00 PM · Powhatan Middle School, 4135 Old Buckingham Rd, Powhatan, VA 23139'

function buildTicketStudioEmail(d, o, check) {
  const flag = o.total > 0
    ? (check.ok ? '' : `<p style="color:#b00020"><strong>CHECK THIS PAYMENT:</strong> ${escapeHtml(check.note)}</p>`)
    : ''
  return `
    <h2>New Recital Ticket Order</h2>
    ${flag}
    <p><strong>Name:</strong> ${escapeHtml(d.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(d.email)}</p>
    <p><strong>Tickets:</strong> ${ticketLines(o).map(escapeHtml).join('; ')} (${o.ticketCount} total)</p>
    ${o.promo ? `<p><strong>Promo:</strong> ${escapeHtml(o.promo.code)} (−${money(o.discount)})</p>` : ''}
    <p><strong>Total:</strong> ${money(o.total)}${o.total > 0 ? ` · PayPal order ${escapeHtml(d.paypalOrderId)} · ${escapeHtml(check.note)}` : ' (free tickets, no payment)'}</p>
    <p>${escapeHtml(SHOW)}</p>
  `
}

function buildTicketBuyerEmail(d, o) {
  return `
    <h2>Your Holiday Remix 2026 tickets</h2>
    <p>Hi ${escapeHtml(d.name)}, thank you! Here is your confirmation.</p>
    <p><strong>${escapeHtml(ticketLines(o).join('; '))}</strong></p>
    <p><strong>Total paid:</strong> ${money(o.total)}</p>
    <p>${escapeHtml(SHOW)}</p>
    <p>Tickets are general admission. Please keep this email and show it at the door. Children 3 and under are free.</p>
    <p>Questions? Reply to this email or write info@capitalcoredance.com.</p>
    <p>Capital Core Dance Studio</p>
  `
}

/* Copy the submission into the studio portal.
 *
 * WHY THIS EXISTS. The portal used to learn about website forms from a Supabase
 * DB webhook on this site's own database. That database is gone (the project
 * was deleted when the site was trimmed off Supabase on 2026-08-19), so the
 * table the webhook watched no longer exists and nothing has reached the portal
 * since roughly 2026-07-19. Seven weeks of enquiries lived only in the studio
 * inbox, including a free-trial request for a four year old that was found six
 * days late. This posts the same shape the webhook used to, straight to the
 * portal.
 *
 * 🔴 FAIL-SOFT, AND ALWAYS AFTER THE EMAIL. The email is the path that must not
 * break: it is what the studio actually reads, and it kept working through the
 * entire outage precisely because it never depended on the portal. If the
 * portal is unreachable, misconfigured or slow, the visitor still gets a 200
 * and the studio still gets its mail. Never await this before the send, and
 * never let it throw.
 *
 * `silent: true` tells the portal we already emailed, so it records the
 * submission and rings its in-app bell without sending a second alert. */
function uuidv4Fallback() {
  const b = new Uint8Array(16)
  for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = [...b].map(x => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`
}

async function copyToPortal(data) {
  const secret = process.env.SITE_INTAKE_SECRET
  const base = process.env.PORTAL_INTAKE_URL || 'https://studio.capitalcoredance.com'
  if (!secret) {
    console.warn('[notify] SITE_INTAKE_SECRET not set, submission not copied to the portal')
    return
  }
  /* 🔴 MUST BE A UUID. site_intake.source_row_id is a uuid column, so a
     readable fallback id like `web-<timestamp>` is rejected outright with a
     500 and the submission is lost. Caught by an end-to-end post against
     production before this shipped. randomUUID exists on every Node the site
     deploys to; the fallback is only for an exotic runtime and must still
     produce a valid v4. */
  const record = {
    id: (globalThis.crypto?.randomUUID?.() ?? uuidv4Fallback()),
    created_at: new Date().toISOString(),
    first_name: data.firstName ?? null,
    last_name: data.lastName ?? null,
    email: data.email ?? null,
    phone: data.phone ?? null,
    // The slug, not the label: the portal matches payload.interest === 'trial'
    // to decide what shows in its Trials list. Sending "Free Trial" there would
    // put every trial request back in the general pile.
    interest: data.interest ?? null,
    dancer_name: data.dancerName ?? null,
    dancer_age: data.dancerAge ?? null,
    message: data.message ?? null,
  }
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 8000)
    const r = await fetch(`${base}/api/intake/from-site`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-intake-secret': secret },
      body: JSON.stringify({ type: 'INSERT', table: 'contact_submissions', silent: true, record }),
      signal: ctrl.signal,
    })
    clearTimeout(t)
    if (!r.ok) console.error(`[notify] portal copy failed: ${r.status} ${await r.text().catch(() => '')}`)
  } catch (err) {
    console.error('[notify] portal copy failed:', err?.message ?? err)
  }
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
    const tooLong = overLength(data)
    if (tooLong) return res.status(400).json({ error: `${tooLong} is too long` })
    const reason = spamReason(data)
    if (reason) {
      console.warn(`[notify] dropped as spam: ${reason}`)
      return res.status(200).json({ ok: true })
    }
    subject = data.interest === 'trial' ? 'New Free Trial Request' : 'New Contact Form Submission'
    html = buildContactEmail(data)
  } else if (formType === 'recital_tickets') {
    const tooLong = Object.entries(TICKET_MAX_LEN).find(([f, max]) => String(data[f] ?? '').length > max)?.[0]
    if (tooLong) return res.status(400).json({ error: `${tooLong} is too long` })
    const reason = ticketSpamReason(data)
    if (reason) {
      console.warn(`[notify] ticket order dropped as spam: ${reason}`)
      return res.status(200).json({ ok: true })
    }
    const o = computeOrder(data)
    if (o.ticketCount < 1) return res.status(400).json({ error: 'No tickets selected' })
    if (o.total > 0 && !String(data.paypalOrderId ?? '').trim()) return res.status(400).json({ error: 'Missing payment' })
    const check = o.total > 0 ? await verifyPaypal(String(data.paypalOrderId), o.total) : { ok: true, note: 'free order' }
    subject = check.ok ? 'New Recital Ticket Order' : 'New Recital Ticket Order (CHECK PAYMENT)'
    html = buildTicketStudioEmail(data, o, check)
    try {
      await resend.emails.send({ from: process.env.FROM_EMAIL, to: process.env.ADMIN_EMAIL, subject, html })
    } catch (err) {
      console.error('Resend error:', err)
      return res.status(500).json({ error: 'Failed to send email' })
    }
    // The buyer's receipt is best effort: the studio already has the order.
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: String(data.email).trim(),
        replyTo: process.env.ADMIN_EMAIL,
        subject: 'Your Holiday Remix 2026 tickets',
        html: buildTicketBuyerEmail(data, o),
      })
    } catch (err) {
      console.error('Buyer receipt failed:', err)
    }
    return res.status(200).json({ ok: true, total: o.total })
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
    // Only after the mail is away. A portal failure must not turn a delivered
    // enquiry into a 500 the visitor sees as "please try again".
    await copyToPortal(data)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
