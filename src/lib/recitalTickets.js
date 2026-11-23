// Holiday Remix 2026 recital ticket pricing. Shared by the checkout on /recital and by
// api/notify.js, which recomputes the total from the quantities so a tampered browser
// can never change what the studio believes was owed. Prices confirmed 2026-10-26.
export const TICKET_PRICES = { adult: 25, kid: 15, child: 0 }
export const MAX_PER_TYPE = 20

// Volunteer families: 20% off adult tickets, up to 6 (same rule as the June recital).
export const PROMO_CODES = {
  VOLUNTEER: { label: 'Volunteer: 20% off adult tickets (up to 6)', rate: 0.2, maxQty: 6 },
}

export function validatePromo(code) {
  const upper = String(code ?? '').trim().toUpperCase()
  return PROMO_CODES[upper] ? { code: upper, ...PROMO_CODES[upper] } : null
}

const cents = (n) => Math.round(n * 100)

export function clampQty(n) {
  const v = Math.floor(Number(n))
  return Number.isFinite(v) ? Math.min(MAX_PER_TYPE, Math.max(0, v)) : 0
}

export function computeOrder({ adultQty = 0, kidQty = 0, childQty = 0, promoCode = '' }) {
  const adult = clampQty(adultQty)
  const kid = clampQty(kidQty)
  const child = clampQty(childQty)
  const promo = validatePromo(promoCode)
  const subtotal = adult * TICKET_PRICES.adult + kid * TICKET_PRICES.kid
  const discountedQty = promo ? Math.min(adult, promo.maxQty) : 0
  const discountCents = promo ? Math.round(cents(discountedQty * TICKET_PRICES.adult) * promo.rate) : 0
  const total = (cents(subtotal) - discountCents) / 100
  return { adult, kid, child, promo, subtotal, discount: discountCents / 100, total, ticketCount: adult + kid + child }
}
