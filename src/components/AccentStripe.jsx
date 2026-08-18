import { STRIPE } from '../lib/pageAccents'

// The five-accent signature bar. It appears at three scales: full-bleed under the
// navbar (`variant="bar"`), a short rule beside a page eyebrow (`variant="rule"`), and
// a skewed panel filling the right of a hero (`variant="panel"`).
//
// Purely decorative in all three — it is aria-hidden everywhere, and never the only
// thing carrying a piece of information.
export default function AccentStripe({ variant = 'bar', className = '' }) {
  if (variant === 'panel') {
    return (
      <div
        aria-hidden="true"
        data-testid="accent-panel"
        // Skewed off-axis and pushed past the right edge so the slant is the only part
        // that reads — the same device as the mockup's hero.
        className={`absolute inset-y-0 left-[58%] -right-32 flex skew-x-[-15deg] origin-top-left pointer-events-none ${className}`}
      >
        {[...STRIPE].reverse().map((c) => (
          <div key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>
    )
  }

  // The five accents as a horizontal band filling its parent, added 2026-08-17 for the
  // stacked mobile hero. It takes its height from the parent rather than setting one, so
  // Hero owns the band's size — and unlike `bar` it has no `h-[5px]` of its own to fight.
  if (variant === 'band') {
    return (
      <div
        aria-hidden="true"
        data-testid="accent-band"
        className={`flex h-full w-full ${className}`}
      >
        {STRIPE.map((c) => (
          <div key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>
    )
  }

  if (variant === 'rule') {
    return (
      <span
        aria-hidden="true"
        data-testid="accent-rule"
        className={`inline-flex h-[5px] w-16 flex-none ${className}`}
      >
        {STRIPE.map((c) => (
          <span key={c} className="flex-1" style={{ background: c }} />
        ))}
      </span>
    )
  }

  return (
    <div aria-hidden="true" data-testid="accent-bar" className={`flex h-[5px] ${className}`}>
      {STRIPE.map((c) => (
        <div key={c} className="flex-1" style={{ background: c }} />
      ))}
    </div>
  )
}
