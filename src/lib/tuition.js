// Monthly class prices, the studio's own figures. Lifted out of the Tuition page on
// 2026-08-13 when the Adult Classes page started quoting a price too: two pages naming
// the same rate is exactly how one of them goes stale, so neither types it.
//
// Classes are priced by length, not by style — a 45-minute adult class and a 45-minute
// Core class cost the same. That is why this table is keyed on minutes and why any page
// that knows a class's start and end time can work out its price without being told.
export const CLASS_PRICES = [
  { minutes: 30, duration: '30 Min', monthly: '$65' },
  { minutes: 45, duration: '45 Min', monthly: '$85' },
  { minutes: 60, duration: '60 Min', monthly: '$105' },
  { minutes: 75, duration: '75 Min', monthly: '$125' },
  { minutes: 90, duration: '90 Min', monthly: '$150' },
]

// Minutes between a schedule row's 24-hour 'HH:MM' start and end.
export function classLengthMinutes({ start, end }) {
  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
  }
  return toMinutes(end) - toMinutes(start)
}

// The published monthly rate for a class of this length, or null if the studio has not
// priced that length. Null rather than a guess: a page with no price is a gap the studio
// can fill, a page with an interpolated price is a number nobody agreed to charge.
export function monthlyPriceForMinutes(minutes) {
  return CLASS_PRICES.find((p) => p.minutes === minutes)?.monthly ?? null
}

// Adult-only offers, the studio's own figures (2026-08-13). These sit outside the table
// above because they are not priced by length: the pass covers every adult class whatever
// each one runs, and the drop-in is charged per visit rather than per month. Numbers, not
// display strings, because the page does arithmetic with them — see the pass copy on the
// Adult Classes page, which works out its own saving rather than quoting a typed one.
export const ADULT_PRICING = {
  unlimitedMonthly: 165,
  dropIn: 25,
}

// Registration, per dancer. Corrected from $65 to $60 on 2026-08-17: the portal's own
// class-registration form charges $60 for one semester (with $10 off for returning
// dancers) while the website had been publishing $65, so a family read one number and was
// charged another. Single-sourced here so the two cannot drift apart again — the figure
// was typed in four separate places when this was found.
//
// The portal is the system that takes the money, so it is the source of truth. If the
// studio raises the fee, change it in the portal first and then here.
export const REGISTRATION = {
  perSemester: 60,
  fullYear: 120,
  // NEEDS THE STUDIO'S CONFIRMATION. The Tuition page published this as a range of
  // "$5 to $10 per semester" while two other places recorded a flat $10: the note
  // above about the portal form, and the registration comment in Classes.jsx
  // ($60 new dancer, $50 returning). Set to 10 on 2026-08-19 so the site states one
  // figure, and kept here rather than typed on the page so it cannot drift again.
  returningDiscount: 10,
}

// Dance Company, the studio's own figures (2026-08-17). Outside the by-length table for
// the same reason as the adult offers: it is a flat monthly programme fee, not a class
// rate. It buys rehearsal time plus an allowance of studio classes, so no start/end time
// can derive it. Both /dance-company and /tuition read these — neither types the number,
// which is the whole point of this file.
//
// `includedClasses` are recommended, NOT required (studio, 2026-08-17): the allowance is
// part of the fee whether the dancer uses it or not. Anything beyond the allowance is
// charged at the normal by-length rate above.
export const COMPANY_PRICING = {
  monthly: 150,
  practiceHoursPerWeek: 3,
  includedClasses: 3,
}

// '$85' → 85. The by-length table stores display strings because that is what every page
// renders; anything comparing two prices needs the number behind one.
export function priceToNumber(price) {
  return Number(String(price).replace(/[^0-9.]/g, ''))
}

export const money = (n) => `$${n}`
