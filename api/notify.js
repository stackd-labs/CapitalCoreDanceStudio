import { Resend } from 'resend'

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

function buildRecitalOrderEmail(data) {
  return `
    <h2>New Recital T-Shirt Order</h2>
    <p><strong>Contact Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Items Ordered:</strong> ${escapeHtml(data.lineItems)}</p>
    <p><strong>Total Paid:</strong> $${escapeHtml(String(data.total))}</p>
    <p><strong>Promo Code:</strong> ${escapeHtml(data.promoCode) || 'None'}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId) || 'N/A (free order)'}</p>
  `
}

function buildRecitalTicketEmail(data) {
  return `
    <h2>New Recital Ticket Order</h2>
    <p><strong>Contact Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Show:</strong> ${escapeHtml(data.show)}${data.showDate ? ` — ${escapeHtml(data.showDate)} at ${escapeHtml(data.showTime)}` : ''}</p>
    <p><strong>Adult Tickets (12 &amp; up):</strong> ${escapeHtml(String(data.adultQty))}</p>
    <p><strong>Kids Tickets (4&ndash;11, $15):</strong> ${escapeHtml(String(data.kidQty || 0))}</p>
    <p><strong>Child Tickets (3 &amp; under, free):</strong> ${escapeHtml(String(data.childQty))}</p>
    <p><strong>Subtotal:</strong> $${escapeHtml(String(data.subtotal))}</p>
    <p><strong>Discount:</strong> $${escapeHtml(String(data.discount))}</p>
    <p><strong>Total Paid:</strong> $${escapeHtml(String(data.total))}</p>
    <p><strong>Promo Code:</strong> ${escapeHtml(data.promoCode) || 'None'}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId) || 'N/A (free order)'}</p>
  `
}

function buildRecitalProgramEmail(data) {
  return `
    <h2>New Recital Program Order</h2>
    <p><strong>Contact Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Quantity:</strong> ${escapeHtml(String(data.qty))}</p>
    <p><strong>Unit Price:</strong> $${escapeHtml(String(data.unitPrice))}</p>
    <p><strong>Subtotal:</strong> $${escapeHtml(String(data.subtotal))}</p>
    <p><strong>Discount:</strong> $${escapeHtml(String(data.discount))}</p>
    <p><strong>Total Paid:</strong> $${escapeHtml(String(data.total))}</p>
    <p><strong>Promo Code:</strong> ${escapeHtml(data.promoCode) || 'None'}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId) || 'N/A (free order)'}</p>
  `
}

function buildRecitalCombinedAdminEmail(data) {
  const ticketParts = []
  if (data.adultQty > 0) ticketParts.push(`${escapeHtml(String(data.adultQty))} adult`)
  if (data.kidQty > 0) ticketParts.push(`${escapeHtml(String(data.kidQty))} kid (4–11)`)
  if (data.childQty > 0) ticketParts.push(`${escapeHtml(String(data.childQty))} child (free)`)
  const ticketLine = ticketParts.length > 0
    ? `<p><strong>Tickets:</strong> ${ticketParts.join(' + ')} for ${escapeHtml(data.showLabel || '')} (${escapeHtml(data.showDate || '')} ${escapeHtml(data.showTime || '')}) — $${escapeHtml(String(data.ticketSubtotal))}</p>`
    : ''
  const programLine = data.programQty > 0
    ? `<p><strong>Programs:</strong> ${escapeHtml(String(data.programQty))} × — $${escapeHtml(String(data.programSubtotal))}</p>`
    : ''
  const shirtLine = data.shirtLineItems
    ? `<p><strong>Shirts:</strong> ${escapeHtml(data.shirtLineItems)} — $${escapeHtml(String(data.shirtSubtotal))}</p>`
    : ''

  return `
    <h2>New Recital Order</h2>
    <p><strong>Contact:</strong> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
    <hr />
    ${ticketLine}
    ${programLine}
    ${shirtLine}
    <hr />
    <p><strong>Subtotal:</strong> $${escapeHtml(String(data.subtotal))}</p>
    <p><strong>Discount:</strong> $${escapeHtml(String(data.discount))} ${data.promoCode ? `(${escapeHtml(data.promoCode)})` : ''}</p>
    <p><strong>Total Paid:</strong> $${escapeHtml(String(data.total))}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId) || 'N/A (free order)'}</p>
  `
}

function buildRecitalCombinedCustomerEmail(data) {
  const venue = escapeHtml(data.showVenue || 'Richmond Christian School')
  const address = escapeHtml(data.showAddress || '6511 Belmont Rd, Chesterfield, VA 23832')
  const showDate = escapeHtml(data.showDate || 'Saturday, June 13, 2026')
  const showTime = escapeHtml(data.showTime || '2:00 PM')

  const items = []
  if ((data.adultQty || 0) + (data.kidQty || 0) + (data.childQty || 0) > 0) {
    const parts = []
    if (data.adultQty > 0) parts.push(`${data.adultQty} adult ticket${data.adultQty === 1 ? '' : 's'}`)
    if (data.kidQty > 0) parts.push(`${data.kidQty} kid ticket${data.kidQty === 1 ? '' : 's'} (4–11)`)
    if (data.childQty > 0) parts.push(`${data.childQty} child${data.childQty === 1 ? '' : 'ren'} (3 & under, free)`)
    items.push(`<li>🎟 <strong>${escapeHtml(parts.join(' + '))}</strong> — ${showDate} at ${showTime}</li>`)
  }
  if (data.programQty > 0) {
    items.push(`<li>📖 <strong>${escapeHtml(String(data.programQty))} show program${data.programQty === 1 ? '' : 's'}</strong> — pickup at the show</li>`)
  }
  if (data.shirtLineItems) {
    items.push(`<li>👕 <strong>T-shirts:</strong> ${escapeHtml(data.shirtLineItems)} — pickup at the studio (date TBA)</li>`)
  }

  const ticketBoxParts = []
  if (data.adultQty > 0) ticketBoxParts.push(`${escapeHtml(String(data.adultQty))} adult${data.adultQty === 1 ? '' : 's'}`)
  if (data.kidQty > 0) ticketBoxParts.push(`${escapeHtml(String(data.kidQty))} kid${data.kidQty === 1 ? '' : 's'} (4–11)`)
  if (data.childQty > 0) ticketBoxParts.push(`${escapeHtml(String(data.childQty))} child${data.childQty === 1 ? '' : 'ren'}`)
  const ticketBox = (data.adultQty || 0) + (data.kidQty || 0) + (data.childQty || 0) > 0 ? `
    <div style="margin:24px 0;border:2px solid #C9A84C;border-radius:12px;overflow:hidden;">
      <img src="https://capitalcoredance.com/ticket-banner.png" alt="A Night at the Cinema — Spring Show Ticket" style="display:block;width:100%;height:auto;" />
      <div style="background:#fdf8f0;padding:20px;">
        <p style="margin:0 0 8px 0;color:#C9A84C;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Your Ticket Confirmation</p>
        <p style="margin:0 0 4px 0;font-size:18px;font-weight:bold;color:#0B1F3A;">${escapeHtml(data.name)}</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#555;">${ticketBoxParts.join(' + ')}</p>
        <p style="margin:0;font-size:14px;color:#0B1F3A;"><strong>${showDate} · ${showTime}</strong></p>
        <p style="margin:4px 0 12px 0;font-size:13px;color:#666;">${venue} · ${address}</p>
        <p style="margin:0;padding-top:12px;border-top:1px solid #C9A84C;font-size:13px;color:#0B1F3A;font-weight:bold;">Show this email at the door for entry.</p>
        ${data.paypalOrderId ? `<p style="margin:6px 0 0 0;font-size:11px;color:#999;">Order ID: ${escapeHtml(data.paypalOrderId)}</p>` : ''}
      </div>
    </div>
  ` : ''

  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#333;">
      <div style="text-align:center;padding:24px 0;border-bottom:3px solid #C9A84C;">
        <h1 style="margin:0;color:#0B1F3A;font-size:24px;">Capital Core Dance Studio</h1>
        <p style="margin:6px 0 0 0;color:#C9A84C;font-style:italic;font-size:14px;">A Night at the Cinema · Annual Recital 2026</p>
      </div>

      <div style="padding:24px 0;">
        <h2 style="color:#0B1F3A;margin:0 0 12px 0;">Thank you, ${escapeHtml(data.name)}!</h2>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px 0;">
          Your recital order has been confirmed. Here's everything you ordered:
        </p>
        <ul style="font-size:14px;line-height:1.8;padding-left:20px;">
          ${items.join('\n')}
        </ul>

        ${ticketBox}

        <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
          <tr><td style="padding:6px 0;color:#666;">Subtotal</td><td style="padding:6px 0;text-align:right;">$${escapeHtml(String(data.subtotal))}</td></tr>
          ${data.discount > 0 ? `<tr><td style="padding:6px 0;color:#0a7c3e;">Discount${data.promoCode ? ` (${escapeHtml(data.promoCode)})` : ''}</td><td style="padding:6px 0;text-align:right;color:#0a7c3e;">−$${escapeHtml(String(data.discount))}</td></tr>` : ''}
          <tr style="border-top:2px solid #0B1F3A;"><td style="padding:10px 0 6px 0;font-weight:bold;color:#0B1F3A;">Total Paid</td><td style="padding:10px 0 6px 0;text-align:right;font-weight:bold;color:#0B1F3A;font-size:18px;">$${escapeHtml(String(data.total))}</td></tr>
        </table>

        <h3 style="color:#0B1F3A;margin:24px 0 8px 0;font-size:16px;">What's next?</h3>
        <ul style="font-size:14px;line-height:1.8;padding-left:20px;color:#555;">
          ${(data.adultQty || 0) + (data.kidQty || 0) + (data.childQty || 0) > 0 ? `<li><strong>Tickets:</strong> Show this email at the door on show day. Kids 4&ndash;11 are $15. Children 3 &amp; under are free and don't need a ticket.</li>` : ''}
          ${data.programQty > 0 ? `<li><strong>Programs:</strong> Pick up your program at the show — ${venue}.</li>` : ''}
          ${data.shirtLineItems ? `<li><strong>T-shirts:</strong> Made to order. We'll email you when they're ready for pickup at the studio.</li>` : ''}
        </ul>

        <p style="font-size:13px;color:#888;margin:24px 0 0 0;line-height:1.6;">
          Questions? Reply to this email or contact us at
          <a href="mailto:info@capitalcoredance.com" style="color:#C9A84C;">info@capitalcoredance.com</a>
          or call (804) 234-4014.
        </p>
      </div>

      <div style="text-align:center;padding:16px 0;border-top:1px solid #eee;color:#999;font-size:12px;">
        Capital Core Dance Studio · 13110 Midlothian Turnpike, Midlothian, VA 23113
      </div>
    </div>
  `
}

function renderCampersBlock(campers = []) {
  if (!campers.length) return '<li>None</li>'
  return campers.map((c, i) => {
    const head = c.isReturning === 'Yes'
      ? `<strong>${escapeHtml(c.name || `Camper ${i + 1}`)}</strong> · returning (current-dancer rate) — pull info from records`
      : `<strong>${escapeHtml(c.name || `Camper ${i + 1}`)}</strong> · new (age ${escapeHtml(String(c.age || '—'))}, DOB ${escapeHtml(c.birthdate || '—')}, ${escapeHtml(c.gender || '—')}) — non-studio rate`
    const weekLines = (c.weekItems || [])
      .map((w) => `<li>${escapeHtml(w.weekLabel)} — ${escapeHtml(w.description)} — $${escapeHtml(String(w.price))}</li>`)
      .join('')
    const careLines = (c.careItems || [])
      .map((ci) => `<li>${escapeHtml(ci.description)} — $${escapeHtml(Number(ci.price).toFixed(2))}</li>`)
      .join('')
    const before = c.beforeCare
      ? `${escapeHtml(c.beforeCare.time || '')} drop-off, days: ${(c.beforeCare.days || []).map((d) => escapeHtml(d)).join(', ') || '—'}`
      : 'None'
    const after = c.afterCare
      ? `${escapeHtml(c.afterCare.time || '')} pickup, days: ${(c.afterCare.days || []).map((d) => escapeHtml(d)).join(', ') || '—'}`
      : 'None'
    return `
      <li style="margin-bottom:12px;">
        ${head}
        <ul>${weekLines || '<li>No weeks</li>'}</ul>
        ${careLines ? `<p style="margin:4px 0 0 0;"><em>Care charges:</em></p><ul>${careLines}</ul>` : ''}
        <p style="margin:4px 0 0 0;font-size:12px;"><em>Before care:</em> ${before} · <em>After care:</em> ${after}</p>
        <p style="margin:4px 0 0 0;font-size:12px;"><em>Camper subtotal:</em> $${escapeHtml(Number(c.subtotal || 0).toFixed(2))}</p>
      </li>`
  }).join('')
}

function buildCampRegistrationEmail(data) {
  return `
    <h2>New Summer Camp Registration</h2>
    <p><strong>Parent:</strong> ${escapeHtml(data.parentName)} &lt;${escapeHtml(data.email)}&gt;</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Camper count:</strong> ${escapeHtml(String(data.camperCount || (data.campers || []).length || 1))}</p>
    <hr />
    <p><strong>Campers:</strong></p>
    <ul>${renderCampersBlock(data.campers)}</ul>
    <hr />
    <p><strong>Promo Code:</strong> ${escapeHtml(data.promoCode) || 'None'}</p>
    <p><strong>Promo Discount:</strong> $${escapeHtml(String(data.promoDiscount || 0))}</p>
    <p><strong>Gross Subtotal:</strong> $${escapeHtml(String(data.grossSubtotal || 0))}</p>
    <p><strong>Estimated Total:</strong> $${escapeHtml(String(data.estimatedTotal || 0))}</p>
    <p><strong>Deposit Due:</strong> $${escapeHtml(String(data.depositTotal || 0))}</p>
    <p><strong>Notes:</strong> ${escapeHtml(data.notes) || 'None'}</p>
  `
}

function buildCampDepositEmail(data) {
  const paidInFull = !!data.paidInFull
  const paymentLabel = paidInFull ? 'Paid in full' : 'Deposit'
  const balanceRemaining = paidInFull
    ? 0
    : Math.max(0, Number(data.estimatedTotal || 0) - Number(data.amount || 0))
  return `
    <h2>Summer Camp ${paidInFull ? 'Full Payment' : 'Deposit'} Received</h2>
    <p><strong>Parent:</strong> ${escapeHtml(data.parentName)} &lt;${escapeHtml(data.email)}&gt;</p>
    <p><strong>Camper count:</strong> ${escapeHtml(String(data.camperCount || (data.campers || []).length || 1))}</p>
    <p><strong>Payment Type:</strong> ${paymentLabel}</p>
    <p><strong>Amount Paid:</strong> $${escapeHtml(String(data.amount))}</p>
    <p><strong>Estimated Total:</strong> $${escapeHtml(String(data.estimatedTotal || 0))}</p>
    <p><strong>Balance Remaining:</strong> $${balanceRemaining.toFixed(2)}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId)}</p>
    <p><strong>Registration Record ID:</strong> ${escapeHtml(data.registrationId) || 'N/A'}</p>
    <hr />
    <p><strong>Campers:</strong></p>
    <ul>${renderCampersBlock(data.campers)}</ul>
  `
}

const SIGNUP_TYPE_LABELS = {
  classes: 'Per-class (6-week)',
  flex_pass: 'Summer Flex Pass ($329)',
  drop_in: 'Drop-in ($25)',
}

function renderDancersBlock(dancers = []) {
  if (!dancers.length) return '<li>None</li>'
  return dancers.map((d, i) => {
    const head = d.isReturning === 'Yes'
      ? `<strong>${escapeHtml(d.name || `Dancer ${i + 1}`)}</strong> · returning — pull info from records`
      : `<strong>${escapeHtml(d.name || `Dancer ${i + 1}`)}</strong> · new (age ${escapeHtml(String(d.age || '—'))}, ${escapeHtml(d.gender || '—')})`
    const type = escapeHtml(SIGNUP_TYPE_LABELS[d.signupType] || d.signupType || '—')
    const detail = (() => {
      if (d.signupType === 'classes' && Array.isArray(d.classes) && d.classes.length) {
        return `classes: ${d.classes.map((c) => escapeHtml(c)).join(', ')}`
      }
      if (d.signupType === 'drop_in') {
        return `drop-in: ${escapeHtml(d.dropInClass || '—')} · week ${escapeHtml(d.dropInWeek || '—')}`
      }
      return ''
    })()
    return `<li>${head} — ${type}${detail ? ` (${detail})` : ''} — $${escapeHtml(String(d.tuition || 0))}</li>`
  }).join('')
}

function buildSummerClassCustomerEmail(data) {
  const firstName = (data.parentName || '').split(' ')[0] || 'there'
  const isPaid = !!data.paypalOrderId
  const dancerCount = data.dancerCount || (data.dancers || []).length || 1
  const dancerNames = (data.dancers || []).map((d) => d.name || 'Dancer').join(' & ')

  const dancerCards = (data.dancers || []).map((d, i) => {
    const isReturning = d.isReturning === 'Yes'
    const typeLabel = SIGNUP_TYPE_LABELS[d.signupType] || d.signupType || '—'
    let pickRows = ''
    if (d.signupType === 'classes' && Array.isArray(d.classes) && d.classes.length) {
      pickRows = `<p style="margin:6px 0 0 0;font-size:13px;color:#3a4a6a;"><strong>Classes:</strong> ${d.classes.map((c) => escapeHtml(c)).join(', ')}</p>`
    } else if (d.signupType === 'drop_in') {
      pickRows = `<p style="margin:6px 0 0 0;font-size:13px;color:#3a4a6a;"><strong>Drop-in:</strong> ${escapeHtml(d.dropInClass || '—')} · ${escapeHtml(d.dropInWeek || '—')}</p>`
    }
    return `
      <div style="border:1px solid #f4c8d4;border-radius:10px;padding:14px 16px;margin:0 0 12px 0;background:#fff8fb;">
        <p style="margin:0;font-size:15px;color:#0B1F3A;font-weight:bold;">
          ${escapeHtml(d.name || `Dancer ${i + 1}`)}
          <span style="color:#8a9aaa;font-weight:normal;font-size:12px;"> · ${isReturning ? 'returning' : 'new'} dancer</span>
        </p>
        <p style="margin:4px 0 0 0;font-size:13px;color:#5a6a8a;">${escapeHtml(typeLabel)}</p>
        ${pickRows}
        <p style="margin:8px 0 0 0;font-size:13px;color:#0B1F3A;"><strong>Tuition:</strong> $${escapeHtml(String(d.tuition || 0))}</p>
      </div>
    `
  }).join('')

  const balanceLine = (data.balanceDue || 0) > 0
    ? `<tr><td style="padding:6px 0;color:#666;">Balance due before first class</td><td style="padding:6px 0;text-align:right;color:#666;">$${escapeHtml(String(data.balanceDue))}</td></tr>`
    : ''

  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#333;">
      <div style="text-align:center;padding:24px 0;border-bottom:3px solid #f4a8b4;">
        <h1 style="margin:0;color:#0B1F3A;font-size:24px;">Capital Core Dance Studio</h1>
        <p style="margin:6px 0 0 0;color:#f4a8b4;font-style:italic;font-size:14px;">Summer 2026 · June 23 – July 30</p>
      </div>

      <div style="padding:24px 0;">
        <h2 style="color:#0B1F3A;margin:0 0 12px 0;">Thanks for signing up, ${escapeHtml(firstName)}!</h2>
        <p style="font-size:15px;line-height:1.6;margin:0 0 18px 0;">
          ${isPaid
            ? `We've received your payment of <strong>$${escapeHtml(String(data.amountPaid || data.amountDueToday || 0))}</strong> — ${dancerCount > 1 ? `${escapeHtml(dancerNames)}'s spots are` : `${escapeHtml(dancerNames)}'s spot is`} locked in.`
            : `We've got ${dancerCount > 1 ? `${escapeHtml(dancerNames)}'s` : `${escapeHtml(dancerNames)}'s`} registration. Your $${escapeHtml(String(data.amountDueToday || 0))} payment will finalize the reservation.`}
        </p>

        <h3 style="color:#0B1F3A;margin:18px 0 8px 0;font-size:16px;">Here's what you signed up for:</h3>
        ${dancerCards}

        <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
          <tr><td style="padding:6px 0;color:#666;">Tuition total</td><td style="padding:6px 0;text-align:right;">$${escapeHtml(String(data.tuitionTotal || 0))}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">${isPaid ? 'Amount paid' : 'Amount due today'}</td><td style="padding:6px 0;text-align:right;color:#0a7c3e;font-weight:bold;">$${escapeHtml(String(isPaid ? (data.amountPaid || data.amountDueToday) : data.amountDueToday || 0))}</td></tr>
          ${balanceLine}
        </table>

        <h3 style="color:#0B1F3A;margin:24px 0 8px 0;font-size:16px;">What's next?</h3>
        <ul style="font-size:14px;line-height:1.8;padding-left:20px;color:#555;">
          ${isPaid
            ? '<li>We\'ll be in touch within 1–2 business days with what to wear and bring on the first day.</li>'
            : '<li>Complete your payment to lock in the spot. The button on the website opens a secure PayPal checkout.</li>'}
          ${(data.balanceDue || 0) > 0 ? `<li>Your remaining balance of <strong>$${escapeHtml(String(data.balanceDue))}</strong> is due before the first class (June 23).</li>` : ''}
          <li>If you haven't already, complete a waiver for each dancer before their first class.</li>
        </ul>

        <p style="font-size:13px;color:#888;margin:24px 0 0 0;line-height:1.6;">
          Need to change something? Reply to this email or contact us at
          <a href="mailto:info@capitalcoredance.com" style="color:#f4a8b4;">info@capitalcoredance.com</a>
          or call (804) 234-4014.
        </p>
      </div>

      <div style="text-align:center;padding:16px 0;border-top:1px solid #eee;color:#999;font-size:12px;">
        Capital Core Dance Studio · 13110 Midlothian Turnpike, Midlothian, VA 23113
      </div>
    </div>
  `
}

function buildSummerClassRegistrationEmail(data) {
  const itemLines = (data.items || [])
    .map((item) => `<li>${escapeHtml(item.label)} — $${escapeHtml(String(item.price))}</li>`)
    .join('')
  const promoBlock = data.promoCode
    ? `<p style="background:#fdf8ec;border:1px solid #e8d8a8;padding:8px 12px;border-radius:6px;"><strong>🎟 Promo applied:</strong> ${escapeHtml(data.promoCode)}${data.promoLabel ? ` — ${escapeHtml(data.promoLabel)}` : ''} (−$${escapeHtml(String(data.discountAmount || 0))})</p>`
    : ''
  return `
    <h2>New Summer Class Registration</h2>
    <p><strong>Parent:</strong> ${escapeHtml(data.parentName)} &lt;${escapeHtml(data.email)}&gt;</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Dancer count:</strong> ${escapeHtml(String(data.dancerCount || (data.dancers || []).length || 1))}</p>
    ${promoBlock}
    <hr />
    <p><strong>Dancers:</strong></p>
    <ul>${renderDancersBlock(data.dancers)}</ul>
    <hr />
    <p><strong>Line items:</strong></p>
    <ul>${itemLines || '<li>None</li>'}</ul>
    <p><strong>Tuition Total:</strong> $${escapeHtml(String(data.tuitionTotal || 0))}</p>
    <p><strong>Payment Choice:</strong> ${escapeHtml(data.paymentChoice)}</p>
    <p><strong>Amount Due Today:</strong> $${escapeHtml(String(data.amountDueToday || 0))}</p>
    <p><strong>Balance Due Before First Class:</strong> $${escapeHtml(String(data.balanceDue || 0))}</p>
    <p><strong>Notes:</strong> ${escapeHtml(data.notes) || 'None'}</p>
  `
}

function buildSummerClassDepositEmail(data) {
  const itemLines = (data.items || [])
    .map((item) => `<li>${escapeHtml(item.label)} — $${escapeHtml(String(item.price))}</li>`)
    .join('')
  const isFreeTrial = data.promoCode && (Number(data.amountPaid) || 0) === 0
  const heading = isFreeTrial ? 'Free Trial Confirmed' : 'Summer Class Payment Received'
  const promoBlock = data.promoCode
    ? `<p style="background:#fdf8ec;border:1px solid #e8d8a8;padding:8px 12px;border-radius:6px;"><strong>🎟 Promo applied:</strong> ${escapeHtml(data.promoCode)}${data.promoLabel ? ` — ${escapeHtml(data.promoLabel)}` : ''} (−$${escapeHtml(String(data.discountAmount || 0))})</p>`
    : ''
  return `
    <h2>${heading}</h2>
    <p><strong>Parent:</strong> ${escapeHtml(data.parentName)} &lt;${escapeHtml(data.email)}&gt;</p>
    <p><strong>Dancer count:</strong> ${escapeHtml(String(data.dancerCount || (data.dancers || []).length || 1))}</p>
    <p><strong>Payment Choice:</strong> ${escapeHtml(data.paymentChoice)}</p>
    ${promoBlock}
    <p><strong>Amount Paid:</strong> $${escapeHtml(String(data.amountPaid || 0))}</p>
    <p><strong>Tuition Total:</strong> $${escapeHtml(String(data.tuitionTotal || 0))}</p>
    <p><strong>Balance Due Before First Class:</strong> $${escapeHtml(String(data.balanceDue || 0))}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId) || (isFreeTrial ? 'N/A (free trial)' : 'N/A')}</p>
    <p><strong>Registration Record ID:</strong> ${escapeHtml(data.registrationId) || 'N/A'}</p>
    <hr />
    <p><strong>Dancers:</strong></p>
    <ul>${renderDancersBlock(data.dancers)}</ul>
    <hr />
    <p><strong>Line items:</strong></p>
    <ul>${itemLines || '<li>None</li>'}</ul>
  `
}

const PASS_LABELS = {
  full_series: 'Full Series Pass (all 6 weeks)',
  drop_in: 'Drop-in (pay per class)',
  vip: 'VIP Pass (priority + perks)',
  not_sure: 'Not sure yet — keep me in the loop',
}

const TIME_LABELS = {
  mon_5_9: 'Monday — 5 to 9 PM',
  tue_after8: 'Tuesday — after 8 PM',
  wed_after8: 'Wednesday — after 8 PM',
  thu_after8: 'Thursday — after 8 PM',
  fri_5_9: 'Friday — 5 to 9 PM',
  sun_morning: 'Sunday morning — 10 AM to 1 PM',
}

function buildAdultSeriesInterestAdminEmail(data) {
  const classList = (data.classInterest || []).map((c) => escapeHtml(c)).join(', ') || 'No preference indicated'
  const timeList = (data.preferredTimes || [])
    .map((t) => escapeHtml(TIME_LABELS[t] || t))
    .join(', ') || 'No preference indicated'
  const passLabel = data.passInterest
    ? escapeHtml(PASS_LABELS[data.passInterest] || data.passInterest)
    : 'Not specified'
  return `
    <h2>New Adult Summer Series Interest</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone) || 'Not provided'}</p>
    <p><strong>Classes interested in:</strong> ${classList}</p>
    <p><strong>Preferred day/time:</strong> ${timeList}</p>
    <p><strong>Pricing interest:</strong> ${passLabel}</p>
    <p><strong>Notes:</strong> ${escapeHtml(data.notes) || 'None'}</p>
  `
}

function buildAdultSeriesInterestCustomerEmail(data) {
  const firstName = (data.name || '').split(' ')[0] || 'friend'
  const classChips = (data.classInterest || [])
    .map((c) => `<span style="display:inline-block;border:1px solid #d9c7b8;border-radius:2px;padding:4px 10px;margin:2px 4px 2px 0;font-size:12px;color:#6b4a3e;background:#faf3eb;">${escapeHtml(c)}</span>`)
    .join('')
  const timeChips = (data.preferredTimes || [])
    .map((t) => `<span style="display:inline-block;border:1px solid #d9c7b8;border-radius:2px;padding:4px 10px;margin:2px 4px 2px 0;font-size:12px;color:#6b4a3e;background:#faf3eb;">${escapeHtml(TIME_LABELS[t] || t)}</span>`)
    .join('')
  return `
    <div style="font-family:'Cormorant Garamond', Georgia, serif;max-width:560px;margin:0 auto;color:#3d2828;background:#faf3eb;">
      <div style="text-align:center;padding:32px 24px 24px;border-bottom:1px solid #d9c7b8;">
        <p style="margin:0;color:#7a3e42;font-style:italic;font-size:13px;letter-spacing:4px;text-transform:uppercase;">Adult Summer Series</p>
        <h1 style="margin:14px 0 0;color:#3d2828;font-size:32px;font-family:'Playfair Display', Georgia, serif;font-weight:900;letter-spacing:-1px;">Move For Confidence,</h1>
        <p style="margin:6px 0 0;color:#7a3e42;font-size:38px;font-family:'Allura', cursive;font-weight:normal;line-height:1;">Connection &amp; Community</p>
      </div>

      <div style="padding:28px 28px 8px;">
        <p style="font-size:24px;font-family:'Allura', cursive;color:#7a3e42;margin:0;">You're on the list ♡</p>
        <h2 style="color:#3d2828;margin:8px 0 14px 0;font-size:20px;font-family:'Playfair Display', Georgia, serif;">Welcome, ${escapeHtml(firstName)}.</h2>
        <p style="font-size:15px;line-height:1.7;margin:0 0 18px;">
          Thank you for raising your hand for our boutique movement series. We'll send registration dates, class times, and a few early-bird perks straight to this inbox — no spam, just the good stuff.
        </p>
        ${classChips ? `
          <p style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#7a3e42;margin:18px 0 6px;font-style:italic;">You're interested in</p>
          <div style="margin-bottom:6px;">${classChips}</div>
        ` : ''}
        ${timeChips ? `
          <p style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#7a3e42;margin:18px 0 6px;font-style:italic;">Days/times that work for you</p>
          <div style="margin-bottom:6px;">${timeChips}</div>
        ` : ''}
        ${data.passInterest ? `
          <p style="font-size:14px;color:#6b4a3e;margin:14px 0 0;"><strong>Pricing preference:</strong> ${escapeHtml(PASS_LABELS[data.passInterest] || data.passInterest)}</p>
        ` : ''}
      </div>

      <div style="background:#f4ebe2;border-top:1px solid #d9c7b8;border-bottom:1px solid #d9c7b8;padding:22px 28px;margin-top:18px;">
        <p style="margin:0 0 8px;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#7a3e42;font-style:italic;">The Series</p>
        <p style="margin:0;font-size:15px;color:#3d2828;line-height:1.7;">
          Three rotating themes — <em>Calm Confidence</em>, <em>Throwback Energy</em>, and <em>Femme Flow</em> — once a week for six weeks. Beginner friendly. No experience required. Just you, the music, and a community that moves.
        </p>
      </div>

      <div style="padding:22px 28px;text-align:center;">
        <p style="font-family:'Allura', cursive;color:#7a3e42;font-size:28px;line-height:1.3;margin:0;">
          Your summer. Your movement. Your confidence.
        </p>
      </div>

      <div style="padding:16px 28px 28px;border-top:1px solid #d9c7b8;text-align:center;">
        <p style="font-size:13px;color:#9c7e6e;margin:0;">
          Questions? Reply to this email or reach us at
          <a href="mailto:info@capitalcoredance.com" style="color:#7a3e42;">info@capitalcoredance.com</a>.
        </p>
        <p style="font-size:11px;color:#9c7e6e;margin:14px 0 0;">
          Capital Core Dance Studio · 13110 Midlothian Turnpike, Midlothian, VA 23113
        </p>
      </div>
    </div>
  `
}

// Preserved for future restoration. The Spirit Week idea form was removed from
// Home.jsx in early June 2026 when Instructor Appreciation moved to June 9–12
// (no more crowd-sourced ideas needed). The `spirit_week_ideas` Supabase table
// still exists with prior submissions. To restore: add SpiritWeekIdeaForm back
// to Home.jsx, and the formType === 'spirit_week_idea' branch below is ready
// to handle the email side.
function buildSpiritWeekIdeaEmail(data) {
  return `
    <h2>New Teacher Appreciation Spirit Week Idea</h2>
    <p><strong>From:</strong> ${escapeHtml(data.submitterName) || 'Anonymous'}</p>
    <p><strong>Idea:</strong></p>
    <p>${escapeHtml(data.idea)}</p>
  `
}

// ── Adult Summer Series (paid registrations) ──────────────────
function buildAdultSeriesRegistrationEmail(data) {
  const promoBlock = data.promoCode
    ? `<p style="background:#fdf8ec;border:1px solid #e8d8a8;padding:8px 12px;border-radius:6px;"><strong>🎟 Promo applied:</strong> ${escapeHtml(data.promoCode)}${data.promoLabel ? ` — ${escapeHtml(data.promoLabel)}` : ''} (−$${escapeHtml(String(data.discountAmount || 0))})</p>`
    : ''
  return `
    <h2>New Adult Summer Series Registration</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone) || 'Not provided'}</p>
    <p><strong>Registration:</strong> ${escapeHtml(data.typeLabel || data.registrationType)}</p>
    ${data.dropInDate ? `<p><strong>Drop-in date:</strong> ${escapeHtml(data.dropInDate)}</p>` : ''}
    <p><strong>Experience:</strong> ${escapeHtml(data.experience) || 'Not specified'}</p>
    ${promoBlock}
    <p><strong>Amount Due Today:</strong> $${escapeHtml(String(data.amountDue || 0))}</p>
    <p><strong>Notes:</strong> ${escapeHtml(data.notes) || 'None'}</p>
  `
}

function buildAdultSeriesPaymentEmail(data) {
  const isFree = data.promoCode && (Number(data.amountPaid) || 0) === 0
  return `
    <h2>${isFree ? 'Adult Summer Series Spot Confirmed (free)' : 'Adult Summer Series Payment Received'}</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
    <p><strong>Registration:</strong> ${escapeHtml(data.typeLabel || data.registrationType)}</p>
    ${data.dropInDate ? `<p><strong>Drop-in date:</strong> ${escapeHtml(data.dropInDate)}</p>` : ''}
    <p><strong>Amount Paid:</strong> $${escapeHtml(String(data.amountPaid || 0))}</p>
    ${data.promoCode ? `<p><strong>Promo Code:</strong> ${escapeHtml(data.promoCode)} (−$${escapeHtml(String(data.discountAmount || 0))})</p>` : ''}
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId) || (isFree ? 'N/A (free)' : 'N/A')}</p>
    <p><strong>Registration Record ID:</strong> ${escapeHtml(data.registrationId) || 'N/A'}</p>
  `
}

function buildAdultSeriesCustomerEmail(data) {
  const firstName = (data.name || '').split(' ')[0] || 'friend'
  const isPaid = !!data.paypalOrderId || (Number(data.amountPaid) || 0) > 0
  const isPass = data.registrationType === 'pass'
  const typeLabel = escapeHtml(data.typeLabel || (isPass ? 'Summer Series Pass' : 'Drop-In'))
  const datesLine = isPass
    ? 'Mondays, June 29 – August 3, 2026 · 6:00 – 7:30 PM'
    : `${escapeHtml(data.dropInDate || '')} · 6:00 – 7:30 PM`
  return `
    <div style="font-family:'Cormorant Garamond', Georgia, serif;max-width:560px;margin:0 auto;color:#3d2828;background:#faf3eb;">
      <div style="text-align:center;padding:32px 24px 24px;border-bottom:1px solid #d9c7b8;">
        <p style="margin:0;color:#7a3e42;font-style:italic;font-size:13px;letter-spacing:4px;text-transform:uppercase;">Adult Summer Series</p>
        <h1 style="margin:14px 0 0;color:#3d2828;font-size:32px;font-family:'Playfair Display', Georgia, serif;font-weight:900;letter-spacing:-1px;">Move. Connect. Grow.</h1>
      </div>

      <div style="padding:28px 28px 8px;">
        <p style="font-size:24px;font-family:'Allura', cursive;color:#7a3e42;margin:0;">You're registered ♡</p>
        <h2 style="color:#3d2828;margin:8px 0 14px 0;font-size:20px;font-family:'Playfair Display', Georgia, serif;">Welcome, ${escapeHtml(firstName)}.</h2>
        <p style="font-size:15px;line-height:1.7;margin:0 0 18px;">
          ${isPaid
            ? `We've received your payment of <strong>$${escapeHtml(String(data.amountPaid || 0))}</strong> — your spot is locked in.`
            : 'We\'ve got your registration. We\'ll confirm your spot shortly.'}
        </p>

        <div style="background:#f4ebe2;border:1px solid #d9c7b8;border-radius:8px;padding:18px 20px;margin:0 0 8px;">
          <p style="margin:0 0 6px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#7a3e42;">Your Registration</p>
          <p style="margin:0;font-size:17px;color:#3d2828;font-weight:bold;">${typeLabel}</p>
          <p style="margin:6px 0 0;font-size:14px;color:#6b4a3e;">${datesLine}</p>
        </div>
      </div>

      <div style="background:#f4ebe2;border-top:1px solid #d9c7b8;border-bottom:1px solid #d9c7b8;padding:22px 28px;margin-top:18px;">
        <p style="margin:0 0 8px;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#7a3e42;font-style:italic;">Every Class</p>
        <p style="margin:0;font-size:15px;color:#3d2828;line-height:1.7;">
          90 minutes of movement — <em>45 min Throwback Energy</em>, <em>30 min Femme Flow</em>, and <em>15 min Calm Confidence</em>.
          Wear something comfortable you can move in. No experience needed.
        </p>
      </div>

      <div style="padding:22px 28px;text-align:center;">
        <p style="font-family:'Allura', cursive;color:#7a3e42;font-size:28px;line-height:1.3;margin:0;">
          This summer, invest in you.
        </p>
      </div>

      <div style="padding:16px 28px 28px;border-top:1px solid #d9c7b8;text-align:center;">
        <p style="font-size:13px;color:#9c7e6e;margin:0;">
          Questions? Reply to this email or reach us at
          <a href="mailto:info@capitalcoredance.com" style="color:#7a3e42;">info@capitalcoredance.com</a>.
        </p>
        <p style="font-size:11px;color:#9c7e6e;margin:14px 0 0;">
          Capital Core Dance Studio · 13110 Midlothian Turnpike, Midlothian, VA 23113
        </p>
      </div>
    </div>
  `
}

function buildBirthdayDepositEmail(data) {
  return `
    <h2>Birthday Party Deposit Received</h2>
    <p><strong>Parent:</strong> ${escapeHtml(data.parentName)} &lt;${escapeHtml(data.email)}&gt;</p>
    <p><strong>Birthday Person:</strong> ${escapeHtml(data.birthdayName) || 'N/A'}</p>
    <p><strong>Requested Date:</strong> ${escapeHtml(data.dateFirst) || 'N/A'}</p>
    <p><strong>Amount Paid:</strong> $${escapeHtml(String(data.amount))}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId)}</p>
    <p><strong>Booking Record ID:</strong> ${escapeHtml(data.bookingId) || 'N/A'}</p>
  `
}

function buildBirthdayEmail(data) {
  const juneSpecialLine = data.juneSpecial
    ? `<p style="background:#fff0f6;border:1px solid #f4c8d4;padding:8px 12px;border-radius:6px;"><strong>🎂 June Special chosen:</strong> ${escapeHtml(data.juneSpecial)}</p>`
    : ''
  return `
    <h2>New Birthday Party Booking Request</h2>
    ${juneSpecialLine}
    <p><strong>Parent Name:</strong> ${escapeHtml(data.parentName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Birthday Person:</strong> ${escapeHtml(data.birthdayName)}, turning ${escapeHtml(data.birthdayAge)}</p>
    <p><strong>Currently Enrolled:</strong> ${escapeHtml(data.enrolled)}</p>
    <p><strong>1st Choice Date:</strong> ${escapeHtml(data.dateFirst)}</p>
    <p><strong>2nd Choice Date:</strong> ${escapeHtml(data.dateSecond)}</p>
    <p><strong>Time Slot:</strong> ${escapeHtml(data.timeSlot)}</p>
    <p><strong>Estimated Guests:</strong> ${escapeHtml(data.guestCount)}</p>
    <p><strong>Theme:</strong> ${escapeHtml(data.theme)}${data.customTheme ? ` — ${escapeHtml(data.customTheme)}` : ''}</p>
    <p><strong>Upgrades:</strong> ${data.upgrades?.length ? data.upgrades.map(u => escapeHtml(u)).join(', ') : 'None'}</p>
    <p><strong>Bringing Food:</strong> ${escapeHtml(data.bringingFood)}</p>
    <p><strong>Allergies:</strong> ${escapeHtml(data.allergies) || 'None'}</p>
    <p><strong>Referral:</strong> ${escapeHtml(data.referral)}</p>
    <p><strong>Promo Code:</strong> ${escapeHtml(data.promoCode) || 'None'}</p>
    <p><strong>Notes:</strong> ${escapeHtml(data.notes) || 'None'}</p>
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

  let subject, html
  if (formType === 'contact') {
    subject = data.interest === 'trial' ? 'New Free Trial Request' : 'New Contact Form Submission'
    html = buildContactEmail(data)
  } else if (formType === 'birthday') {
    subject = 'New Birthday Party Booking Request'
    html = buildBirthdayEmail(data)
  } else if (formType === 'birthday_deposit') {
    subject = 'Birthday Party Deposit Received'
    html = buildBirthdayDepositEmail(data)
  } else if (formType === 'camp_registration') {
    subject = 'New Summer Camp Registration'
    html = buildCampRegistrationEmail(data)
  } else if (formType === 'camp_deposit') {
    subject = data.paidInFull ? 'Summer Camp Full Payment Received' : 'Summer Camp Deposit Received'
    html = buildCampDepositEmail(data)
  } else if (formType === 'summer_class_registration') {
    subject = 'New Summer Class Registration'
    html = buildSummerClassRegistrationEmail(data)
  } else if (formType === 'summer_class_deposit') {
    subject = 'Summer Class Payment Received'
    html = buildSummerClassDepositEmail(data)
  } else if (formType === 'adult_series_interest') {
    subject = 'New Adult Summer Series Interest'
    html = buildAdultSeriesInterestAdminEmail(data)
  } else if (formType === 'adult_series_registration') {
    subject = 'New Adult Summer Series Registration'
    html = buildAdultSeriesRegistrationEmail(data)
  } else if (formType === 'adult_series_payment') {
    subject = data.amountPaid > 0 ? 'Adult Summer Series Payment Received' : 'Adult Summer Series Spot Confirmed'
    html = buildAdultSeriesPaymentEmail(data)
  } else if (formType === 'spirit_week_idea') {
    subject = 'New Spirit Week Idea'
    html = buildSpiritWeekIdeaEmail(data)
  } else if (formType === 'recital_order') {
    subject = 'New Recital T-Shirt Order'
    html = buildRecitalOrderEmail(data)
  } else if (formType === 'recital_ticket') {
    subject = 'New Recital Ticket Order'
    html = buildRecitalTicketEmail(data)
  } else if (formType === 'recital_program') {
    subject = 'New Recital Program Order'
    html = buildRecitalProgramEmail(data)
  } else if (formType === 'recital_combined') {
    subject = 'New Recital Order'
    html = buildRecitalCombinedAdminEmail(data)
  } else {
    return res.status(400).json({ error: 'Unknown formType' })
  }

  try {
    // Notify admin
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject,
      html,
    })

    // Send customer confirmation for combined recital orders
    if (formType === 'recital_combined' && data.email) {
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: data.email,
          subject: 'Your Recital Order Confirmation – Capital Core Dance Studio',
          html: buildRecitalCombinedCustomerEmail(data),
        })
      } catch (custErr) {
        console.error('Customer email error (non-fatal):', custErr)
      }
    }

    // Send customer confirmation for Adult Summer Series interest signups
    if (formType === 'adult_series_interest' && data.email) {
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: data.email,
          subject: 'You\'re on the list · Adult Summer Series – Capital Core Dance Studio',
          html: buildAdultSeriesInterestCustomerEmail(data),
        })
      } catch (custErr) {
        console.error('Customer email error (non-fatal):', custErr)
      }
    }

    // Send customer confirmation for adult summer series registration and payment
    if ((formType === 'adult_series_registration' || formType === 'adult_series_payment') && data.email) {
      try {
        const subjectLine = formType === 'adult_series_payment'
          ? 'You\'re registered · Adult Summer Series – Capital Core Dance Studio'
          : 'Adult Summer Series Registration Received – Capital Core Dance Studio'
        await resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: data.email,
          subject: subjectLine,
          html: buildAdultSeriesCustomerEmail(data),
        })
      } catch (custErr) {
        console.error('Customer email error (non-fatal):', custErr)
      }
    }

    // Send customer confirmation for summer class registration and payment
    if ((formType === 'summer_class_registration' || formType === 'summer_class_deposit') && data.email) {
      try {
        const subjectLine = formType === 'summer_class_deposit'
          ? 'Payment Received · Summer Class Confirmation – Capital Core Dance Studio'
          : 'Summer Class Registration Received – Capital Core Dance Studio'
        await resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: data.email,
          subject: subjectLine,
          html: buildSummerClassCustomerEmail(data),
        })
      } catch (custErr) {
        console.error('Customer email error (non-fatal):', custErr)
      }
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
