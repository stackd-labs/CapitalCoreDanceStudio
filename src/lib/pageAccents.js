// Per-page accent colours, from the studio's "Capital Core Site" mockups (2026-08-11).
//
// Every page sits on the same navy field and is told apart by one accent. The accent
// drives the page's eyebrow, its hero stripe, its primary button, its section rules and
// its footer border — so the colour is doing navigational work, not decoration: it tells
// a visitor which part of the studio they are in, and a booking form matches the page
// that sent them there.
//
// STRIPE is the five-accent signature: the bar under the navbar, the skewed panel in
// each hero, and the small rule beside every page eyebrow. Everything below `pink` is a
// page accent only and deliberately stays out of it — five reads as a considered set, and
// the stripe is the one place the brand speaks with a fixed voice.
//
// `lavender` and `mint` were added 2026-08-13 at the studio's request: Adults moved from
// purple to a lighter purple, and Tuition from purple to a light green. They are tints of
// `purple` and `green` rather than new hues, so the set stays a family.
//
// `purple` is currently unreferenced — Adults and Tuition were its only two pages. It is
// kept because it is a brand colour the studio may want back, not because anything uses
// it. Delete it if a future page picks a different direction.
export const ACCENTS = {
  red: '#e01b22',
  orange: '#ff8c2b',
  gold: '#f5c518',
  teal: '#2ed3c8',
  pink: '#ff54a8',
  purple: '#9b3df0',
  green: '#3ad46f',
  lavender: '#c38bf6',
  mint: '#89e5a9',
}

// Order matters — this is the left-to-right sequence everywhere the stripe appears.
export const STRIPE = [ACCENTS.red, ACCENTS.orange, ACCENTS.gold, ACCENTS.teal, ACCENTS.pink]

export const DEFAULT_ACCENT = ACCENTS.red

// Longest match wins, so '/summer-classes/signup' resolves without its own entry.
//
// Some entries are DORMANT: as of 2026-08-11 the camps, summer-classes, mini-series and
// adult-summer-series routes are commented out in App.jsx, so those URLs render a blank
// page (the app has no catch-all). Their accents are kept so switching a seasonal page
// back on needs no edit here.
const ACCENT_BY_PATH = {
  '/': ACCENTS.red,

  '/dance-company': ACCENTS.red,
  '/competition-team': ACCENTS.red,

  // Schedule and Class Levels share orange — they are one journey and a parent moving
  // between them should not see the colour change.
  '/classes': ACCENTS.orange,
  '/class-levels': ACCENTS.orange,
  '/blog': ACCENTS.orange,

  // Adults was promoted out of the Classes dropdown to a top-level nav item on
  // 2026-08-11 and given its own accent. It is a separate audience, not a step in the
  // youth-classes journey, so sharing orange would have undersold it. Softened from
  // purple to lavender on 2026-08-13.
  '/adult-classes': ACCENTS.lavender,

  '/little-movers': ACCENTS.teal,
  '/terms': ACCENTS.teal,

  '/birthdays': ACCENTS.pink,
  '/birthday-booking': ACCENTS.pink,
  '/birthday-payment': ACCENTS.pink,
  '/birthday-thankyou': ACCENTS.pink,
  '/privacy': ACCENTS.pink,

  '/about': ACCENTS.gold,
  // Contact wears the full five-accent stripe hero like Home, so no single accent owns
  // the page. Red is its action colour — the mockup draws every Contact button red and
  // reserves gold for the rules above the address/phone columns.
  '/contact': ACCENTS.red,

  // Tuition moved from purple to mint on 2026-08-13. Mint rather than FAQ's green on
  // purpose: the accent is doing navigational work, so two unrelated pages answering
  // different questions should not look like the same place.
  '/tuition': ACCENTS.mint,
  '/faq': ACCENTS.green,

  // Dormant seasonal routes.
  '/camps': ACCENTS.teal,
  '/camp-registration': ACCENTS.teal,
  '/camp-payment': ACCENTS.teal,
  '/camp-thankyou': ACCENTS.teal,
  '/pay/camp': ACCENTS.teal,
  '/summer-classes': ACCENTS.gold,
  '/mini-series': ACCENTS.gold,
  '/adult-summer-series': ACCENTS.gold,
}

// Matches on path segments, never raw string prefix — '/classes' must not claim
// '/classes-archive', and '/camps' must not claim '/campsite'.
export function accentForPath(pathname = '') {
  const path = pathname.toLowerCase().replace(/\/+$/, '') || '/'
  if (path === '/') return ACCENT_BY_PATH['/']
  const match = Object.keys(ACCENT_BY_PATH)
    .filter((base) => base !== '/' && (path === base || path.startsWith(`${base}/`)))
    .sort((a, b) => b.length - a.length)[0]
  return match ? ACCENT_BY_PATH[match] : DEFAULT_ACCENT
}
