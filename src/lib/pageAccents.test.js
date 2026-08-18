import { ACCENTS, STRIPE, DEFAULT_ACCENT, accentForPath } from './pageAccents'
import { onAccent, contrastRatio, ON_LIGHT } from './accentContrast'

test('each section resolves to the accent its mockup specifies', () => {
  expect(accentForPath('/')).toBe(ACCENTS.red)
  expect(accentForPath('/dance-company')).toBe(ACCENTS.red)
  expect(accentForPath('/classes')).toBe(ACCENTS.orange)
  expect(accentForPath('/little-movers')).toBe(ACCENTS.teal)
  expect(accentForPath('/birthdays')).toBe(ACCENTS.pink)
  expect(accentForPath('/about')).toBe(ACCENTS.gold)
  expect(accentForPath('/tuition')).toBe(ACCENTS.mint)
  expect(accentForPath('/faq')).toBe(ACCENTS.green)
  expect(accentForPath('/adult-classes')).toBe(ACCENTS.lavender)
  expect(accentForPath('/careers')).toBe(ACCENTS.blue)
})

test('schedule and levels share one colour; Adults has its own', () => {
  // Schedule and Class Levels are a single journey and must not change colour between
  // them. Adults was promoted to a top-level nav item on 2026-08-11 and given its own
  // accent — it is a separate audience, not a step in the youth-classes journey.
  for (const path of ['/classes', '/class-levels']) {
    expect(accentForPath(path), path).toBe(ACCENTS.orange)
  }
  expect(accentForPath('/adult-classes')).toBe(ACCENTS.lavender)
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
  // Purple, green and their two tints are page accents only. Letting any of them into
  // the stripe would make it read as a paint box rather than a brand mark — and the
  // palette grew on 2026-08-13, which is exactly when that could slip.
  expect(STRIPE).toEqual([ACCENTS.red, ACCENTS.orange, ACCENTS.gold, ACCENTS.teal, ACCENTS.pink])
  for (const pageOnly of ['purple', 'green', 'lavender', 'mint', 'blue']) {
    expect(STRIPE, `${pageOnly} must stay out of the stripe`).not.toContain(ACCENTS[pageOnly])
  }
})

test('every accent is a valid hex and no two are the same colour', () => {
  const values = Object.values(ACCENTS)
  expect(values).toHaveLength(10)
  expect(new Set(values).size).toBe(10)
  for (const hex of values) {
    expect(hex, `${hex} is not a 6-digit hex`).toMatch(/^#[0-9a-f]{6}$/)
  }
})

test('no two pages share an accent unless they are one journey', () => {
  // Colour is doing navigational work here, so an accidental collision tells a visitor
  // two unrelated pages are the same place. Schedule and Class Levels are the single
  // deliberate exception — they are one journey and must not change colour between them.
  const pages = ['/', '/dance-company', '/classes', '/class-levels', '/adult-classes',
                 '/little-movers', '/birthdays', '/about', '/tuition', '/faq', '/careers']
  const byAccent = {}
  for (const path of pages) {
    const accent = accentForPath(path)
    byAccent[accent] = [...(byAccent[accent] || []), path]
  }
  const shared = Object.values(byAccent).filter((paths) => paths.length > 1)
  expect(shared).toEqual([
    ['/', '/dance-company'],
    ['/classes', '/class-levels'],
  ])
})

test('the two new tints are light enough to take navy text, like their neighbours', () => {
  // onAccent() derives button and eyebrow text from luminance, so a tint that landed too
  // dark would silently flip to white text and break the family. Both must read as the
  // light half of the palette.
  for (const tint of ['lavender', 'mint']) {
    expect(onAccent(ACCENTS[tint]), `${tint} text colour`).toBe(ON_LIGHT)
  }
  expect(onAccent(ACCENTS.purple), 'purple is the dark original').toBe('#ffffff')
})

test('Careers blue takes navy text, not the white its mockup draws', () => {
  // White on #3d8bf0 is 3.4:1, under the 4.5:1 a 15px button needs, so onAccent() must
  // pick navy. The mockup draws white here; the code diverges on purpose, the same way
  // it already does for orange and pink. Pinned because a future tweak to the blue could
  // silently cross the threshold.
  expect(onAccent(ACCENTS.blue)).toBe(ON_LIGHT)
  expect(contrastRatio(ACCENTS.blue, ON_LIGHT)).toBeGreaterThanOrEqual(4.5)
})
