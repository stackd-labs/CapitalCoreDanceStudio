// Which text colour to put on top of an accent.
//
// The palette mixes dark accents (red, purple) with light ones (orange, gold, teal,
// green, pink). White on #ff8c2b is about 2.3:1 — unreadable — which is why the mockup
// draws "Register now" in navy on the orange hero button but white on the red one.
// Deriving it from luminance rather than hard-coding per accent means a new accent can
// never quietly ship an unreadable button.
export const ON_LIGHT = '#0d1b34'
export const ON_DARK = '#ffffff'

function channel(v) {
  const c = v / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

// WCAG relative luminance, 0 (black) to 1 (white).
export function luminance(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// Picks whichever of navy/white contrasts better against the accent.
export function onAccent(hex) {
  return contrastRatio(hex, ON_LIGHT) >= contrastRatio(hex, ON_DARK) ? ON_LIGHT : ON_DARK
}
