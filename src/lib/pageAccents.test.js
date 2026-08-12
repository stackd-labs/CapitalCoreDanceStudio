import { ACCENTS, STRIPE, DEFAULT_ACCENT, accentForPath } from './pageAccents'

test('each section resolves to the accent its mockup specifies', () => {
  expect(accentForPath('/')).toBe(ACCENTS.red)
  expect(accentForPath('/dance-company')).toBe(ACCENTS.red)
  expect(accentForPath('/classes')).toBe(ACCENTS.orange)
  expect(accentForPath('/little-movers')).toBe(ACCENTS.teal)
  expect(accentForPath('/birthdays')).toBe(ACCENTS.pink)
  expect(accentForPath('/about')).toBe(ACCENTS.gold)
  expect(accentForPath('/tuition')).toBe(ACCENTS.purple)
  expect(accentForPath('/faq')).toBe(ACCENTS.green)
  expect(accentForPath('/adult-classes')).toBe(ACCENTS.purple)
})

test('schedule and levels share one colour; Adults has its own', () => {
  // Schedule and Class Levels are a single journey and must not change colour between
  // them. Adults was promoted to a top-level nav item on 2026-08-11 and given purple —
  // it is a separate audience, not a step in the youth-classes journey.
  for (const path of ['/classes', '/class-levels']) {
    expect(accentForPath(path), path).toBe(ACCENTS.orange)
  }
  expect(accentForPath('/adult-classes')).toBe(ACCENTS.purple)
})

test('a sub-page keeps the accent of the page that sent the visitor there', () => {
  expect(accentForPath('/birthday-booking')).toBe(ACCENTS.pink)
  expect(accentForPath('/blog/some-post-slug')).toBe(ACCENTS.orange)
  expect(accentForPath('/pay/camp/abc-123')).toBe(ACCENTS.teal)
  expect(accentForPath('/adult-summer-series/thankyou')).toBe(ACCENTS.gold)
})

test('matches whole path segments, not raw string prefixes', () => {
  // '/classes' must not claim '/classes-archive' — that would silently colour an
  // unrelated future page and be near-impossible to spot.
  expect(accentForPath('/classes-archive')).toBe(DEFAULT_ACCENT)
  expect(accentForPath('/campsite')).toBe(DEFAULT_ACCENT)
  expect(accentForPath('/about-us')).toBe(DEFAULT_ACCENT)
})

test('the root path does not swallow every other route', () => {
  // '/' is a prefix of everything, so it needs its own exact-match branch. Without it
  // the longest-match sort would still work, but a bug here would paint the whole site
  // red — worth pinning.
  expect(accentForPath('/')).toBe(ACCENTS.red)
  expect(accentForPath('')).toBe(ACCENTS.red)
  expect(accentForPath('/faq')).toBe(ACCENTS.green)
})

test('tolerates trailing slashes and casing', () => {
  expect(accentForPath('/birthdays/')).toBe(ACCENTS.pink)
  expect(accentForPath('/Birthdays')).toBe(ACCENTS.pink)
  expect(accentForPath('/nothing-here')).toBe(DEFAULT_ACCENT)
})

test('the signature stripe is the five brand accents, in order', () => {
  // Purple and green are page accents only. Letting them into the stripe would make it
  // read as a paint box rather than a brand mark.
  expect(STRIPE).toEqual([ACCENTS.red, ACCENTS.orange, ACCENTS.gold, ACCENTS.teal, ACCENTS.pink])
  expect(STRIPE).not.toContain(ACCENTS.purple)
  expect(STRIPE).not.toContain(ACCENTS.green)
})

test('every accent is a valid hex and the set is exactly seven', () => {
  const values = Object.values(ACCENTS)
  expect(new Set(values).size).toBe(7)
  for (const hex of values) {
    expect(hex, `${hex} is not a 6-digit hex`).toMatch(/^#[0-9a-f]{6}$/)
  }
})
