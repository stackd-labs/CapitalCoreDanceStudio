import { Link } from 'react-router-dom'
import AccentStripe from './AccentStripe'
import { useAccent } from '../lib/useAccent'
import { onAccent } from '../lib/accentContrast'

// Repeating layout pieces from the site mockups, in one file so their measurements stay
// together. Every size here is transcribed from the mockup, not chosen — change them
// against the design, not by eye.
//
// Buttons are square by design (no border radius anywhere in the mockups).

// Internal Link, external anchor, or plain button — chosen by which props are given, so
// callers never have to pick the right component for the destination.
//
// `className` is merged by the wrappers below rather than spread over: a caller passing
// className="mt-8" used to land after the wrapper's own class string and replace it
// wholesale, silently stripping every button style.
function Action({ to, href, children, className, style, ...rest }) {
  if (to) return <Link to={to} className={className} style={style} {...rest}>{children}</Link>
  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a
        href={href}
        className={className}
        style={style}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }
  return <button type="button" className={className} style={style} {...rest}>{children}</button>
}

export function PrimaryAction({ accent, children, className = '', ...rest }) {
  const color = useAccent(accent)
  return (
    <Action
      data-testid="primary-action"
      className={`inline-flex items-center font-body font-bold text-[15px] px-8 py-[17px] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-base ${className}`}
      style={{ background: color, color: onAccent(color) }}
      {...rest}
    >
      {children}
    </Action>
  )
}

export function GhostAction({ children, className = '', ...rest }) {
  return (
    <Action
      className={`inline-flex items-center font-body font-bold text-[15px] text-white border-[1.5px] border-white/50 px-[30px] py-4 transition-colors hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
      {...rest}
    >
      {children}
    </Action>
  )
}

// The small accent label above a section heading.
export function Kicker({ accent, children, className = '' }) {
  const color = useAccent(accent)
  return (
    <div
      className={`font-body font-semibold text-[11.5px] tracking-[0.3em] uppercase mb-4 ${className}`}
      style={{ color }}
    >
      {children}
    </div>
  )
}

// Page-level eyebrow: the five-accent rule plus a label, as used in every hero.
export function StripeEyebrow({ children, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AccentStripe variant="rule" />
      <span className="font-body font-semibold text-[12px] tracking-[0.3em] text-mist-200 uppercase">
        {children}
      </span>
    </div>
  )
}

export function SectionHeading({ children, className = '', testId }) {
  return (
    <h2
      data-testid={testId}
      className={`font-display uppercase text-[34px] sm:text-[44px] lg:text-[52px] leading-[0.96] m-0 text-balance ${className}`}
    >
      {children}
    </h2>
  )
}

// Full-bleed accent band with a headline and one action — the mockup's closing CTA.
export function CtaBand({ accent, headline, body, action }) {
  const color = useAccent(accent)
  return (
    <section
      data-testid="cta-band"
      className="px-6 lg:px-24 py-12 lg:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
      style={{ background: color }}
    >
      <div className="max-w-3xl">
        <h2
          className="font-display uppercase text-[32px] sm:text-[40px] lg:text-[46px] leading-[0.98] text-balance m-0"
          style={{ color: onAccent(color) }}
        >
          {headline}
        </h2>
        {body && (
          <p
            className="font-body text-[15px] leading-relaxed mt-4 opacity-80"
            style={{ color: onAccent(color) }}
          >
            {body}
          </p>
        )}
      </div>
      <div className="flex-none">{action}</div>
    </section>
  )
}

// Dark-on-navy action for use inside a CtaBand, where the field is already the accent.
export function InverseAction({ children, className = '', ...rest }) {
  return (
    <Action
      className={`inline-flex items-center bg-ink-base text-white font-body font-bold text-[15px] px-9 py-[19px] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
      {...rest}
    >
      {children}
    </Action>
  )
}

// Anton numeral over a small caps label — the mockup's stats row.
export function StatRow({ stats, accent, className = '' }) {
  const color = useAccent(accent)
  return (
    <div
      className={`grid grid-cols-3 gap-5 border-t border-white/15 pt-6 ${className}`}
      data-testid="stat-row"
    >
      {stats.map(({ value, label }) => (
        <div key={label}>
          <div className="font-display text-[40px] leading-none" style={{ color }}>
            {value}
          </div>
          <div className="font-body font-semibold text-[11px] tracking-[0.16em] text-mist-500 uppercase mt-1.5">
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
