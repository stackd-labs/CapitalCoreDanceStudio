// Per-page accent colours, from the studio's "Capital Core Site" mockups (2026-08-11).
//
// Every page sits on the same navy field and is told apart by one accent. The accent
// drives the page's eyebrow, its hero stripe, its primary button, its section rules and
// its footer border — so the colour is doing navigational work, not decoration: it tells
// a visitor which part of the studio they are in, and a booking form matches the page
// that sent them there.
//
// STRIPE is the five-accent signature: the bar under the navbar, the skewed panel in
// each hero, and the small rule beside every page eyebrow. Purple and green are page
// accents only and deliberately stay out of it — five reads as a considered set, seven
// reads as a paint box.
export const ACCENTS = {
  red: '#e01b22',
  orange: '#ff8c2b',
  gold: '#f5c518',
  teal: '#2ed3c8',
  pink: '#ff54a8',
  purple: '#9b3df0',
  green: '#3ad46f',
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
  // youth-classes journey, so sharing orange would have undersold it.
  '/adult-classes': ACCENTS.purple,

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

  '/tuition': ACCENTS.purple,
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
