import { OPEN_HOUSE, OPEN_HOUSE_ENDS_AT, isOpenHouseUpcoming } from './openHouse'

// The whole point of this module is that the promotion takes itself down without a
// deploy, so the cutoff is the thing worth pinning. Every case injects `now` rather than
// touching the system clock — these must still pass in December.

test('the cutoff is the end of the event, in Eastern time', () => {
  // 11:00 AM EDT on 2 September 2026 is 15:00 UTC. Stated as an absolute instant on
  // purpose: a local-midnight rule would have left the banner up for another three hours
  // on the west coast, advertising an event that had already finished.
  expect(OPEN_HOUSE_ENDS_AT.toISOString()).toBe('2026-09-02T15:00:00.000Z')
})

test('the promotion is on before the event and gone the moment it ends', () => {
  expect(isOpenHouseUpcoming(new Date('2026-08-28T12:00:00-04:00'))).toBe(true)
  // The morning of, an hour before the doors open.
  expect(isOpenHouseUpcoming(new Date('2026-09-02T09:00:00-04:00'))).toBe(true)
  // Fifteen minutes in. A parent reading this is still 45 minutes from the end, and the
  // studio would rather they walked in late than saw nothing.
  expect(isOpenHouseUpcoming(new Date('2026-09-02T10:15:00-04:00'))).toBe(true)
  // The instant it finishes, and after.
  expect(isOpenHouseUpcoming(new Date('2026-09-02T11:00:00-04:00'))).toBe(false)
  expect(isOpenHouseUpcoming(new Date('2026-09-03T09:00:00-04:00'))).toBe(false)
})

test('the cutoff is the same real-world instant in every timezone', () => {
  // Same moment, three ways of writing it. A visitor in Seattle and one in Midlothian
  // stop seeing the banner together.
  expect(isOpenHouseUpcoming(new Date('2026-09-02T08:00:00-07:00'))).toBe(false)
  expect(isOpenHouseUpcoming(new Date('2026-09-02T15:00:00Z'))).toBe(false)
  expect(isOpenHouseUpcoming(new Date('2026-09-02T07:59:00-07:00'))).toBe(true)
})

test('the event detail matches the studio flyer', () => {
  expect(OPEN_HOUSE.date).toBe('Wednesday, September 2')
  expect(OPEN_HOUSE.time).toBe('10:00 – 11:00 AM')
  expect(OPEN_HOUSE.formUrl).toBe(
    'https://studio.capitalcoredance.com/register/little-movers-open-house'
  )
  expect(OPEN_HOUSE.runOfShow.map((s) => s.what)).toEqual([
    "Welcome & Moovin' & Groovin' with Miss Ryan",
    'Tiny Tumble',
    'Sensory Play',
    'Free Play',
  ])
})

test('the form is the free-event form, never the paid class booking form', () => {
  // These two URLs differ by a suffix. Losing it would ask a parent for a payment method
  // for an event the page has just promised costs nothing.
  expect(OPEN_HOUSE.formUrl).toMatch(/\/register\/little-movers-open-house$/)
  expect(OPEN_HOUSE.formUrl).not.toMatch(/\/register\/little-movers$/)
})
