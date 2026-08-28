import { ACCENTS, STRIPE, DEFAULT_ACCENT, accentForPath } from './pageAccents'
import { onAccent, contrastRatio, ON_LIGHT } from './accentContrast'
import tailwindConfig from '../../tailwind.config.js'

// Hue and saturation of a hex, so a test can say "not neon" in the terms the eye actually
// uses. accentContrast.js deliberately only knows luminance — it answers "navy or white on
// this", which is a different question from "is this colour fluorescent".
function toHsl(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  const l = (max + min) / 2
  if (d === 0) return { h: 0, s: 0, l: l * 100 }
  const s = d / (1 - Math.abs(2 * l - 1))
  const hue =
    max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return { h: ((hue * 60) % 360 + 360) % 360, s: s * 100, l: l * 100 }
}

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

test('the birthday pink stays off neon and keeps navy text legible', () => {
  // Lightened 2026-08-28 because the birthday page read as neon. The fix was not just
  // "lighter": the glare came from 100% saturation sitting in the magenta band, so this
  // pins the two things that actually took it off — saturation under 95%, and a hue warm
  // enough to read as rose rather than magenta. A future "make it pop" tweak that pushes
  // either back is the regression.
  const { h, s } = toHsl(ACCENTS.pink)
  expect(h, 'hue should be a rose pink, not magenta').toBeGreaterThanOrEqual(335)
  expect(h).toBeLessThanOrEqual(345)
  expect(s, 'full saturation is what reads as neon').toBeLessThan(95)

  // Every button and eyebrow on /birthdays is navy on this. Lightening an accent moves it
  // away from white, so the only risk is the other direction: a darker pink flipping
  // onAccent() to white text at around 3:1.
  expect(onAccent(ACCENTS.pink)).toBe(ON_LIGHT)
  expect(contrastRatio(ACCENTS.pink, ON_LIGHT)).toBeGreaterThanOrEqual(4.5)
})

test('pink is one hex, shared by the page accent and the tailwind token', () => {
  // ACCENTS.pink drives inline styles; core.pink in tailwind.config.js drives the calendar
  // borders, the class badges and the footer icon. They are meant to be the same colour and
  // nothing enforces it, so retuning one and not the other ships two pinks. This is that
  // check — it reads the config rather than restating the hex, so it cannot go stale.
  expect(tailwindConfig.theme.extend.colors.core.pink).toBe(ACCENTS.pink)
})
