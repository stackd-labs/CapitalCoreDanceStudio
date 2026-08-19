import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { accentForPath } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Restyled 2026-08-19 onto the redesign. This was the last component still wearing the
// pre-redesign system — rounded corners in four sizes, brand-red, navy-dark, and a
// hard-coded pale blue for the body copy — and because it renders outside <Routes> in
// App.jsx it is the one unconverted component a visitor could meet on all seventeen
// pages. Behaviour is unchanged: the same storage key, the same accept-on-dismiss, the
// same pointer-events wrapper.
//
// It takes the page's own accent like the navbar and footer do, so the notice reads as
// part of the page it appears over rather than as a red slab on every one of them.
const STORAGE_KEY = 'ccd-consent'

export default function CookieBanner() {
  // Read once during initialisation rather than from an effect: an effect that calls
  // setState fires a second render before the first has painted, which is what makes
  // the banner flash in on every page load. Storage being unreadable (private mode,
  // blocked cookies) counts as no consent, so the notice shows.
  const [visible, setVisible] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY)
    } catch {
      return true
    }
  })
  const { pathname } = useLocation()
  const accent = accentForPath(pathname)

  function accept() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ status: 'accepted', at: new Date().toISOString() })
      )
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    // Outer wrapper has pointer-events-none so empty space around the banner
    // never intercepts clicks on the form/submit buttons underneath.
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Privacy and cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
    >
      {/* Square, and a heavy top border in the page accent: the same two devices the
          footer uses, so this reads as the bottom of the page rather than an overlay
          borrowed from somewhere else. */}
      <div
        data-testid="cookie-banner"
        className="relative max-w-2xl mx-auto bg-ink-deep text-white border border-white/[0.14] border-t-[3px] shadow-2xl pointer-events-auto px-5 py-4 pr-10 sm:px-6 sm:py-[18px] sm:pr-11"
        style={{ borderTopColor: accent }}
      >
        {/* Close (X) — top-right */}
        <button
          type="button"
          onClick={accept}
          aria-label="Dismiss privacy notice"
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-mist-500 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          ×
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
          <p className="font-body text-mist-400 text-[13px] leading-[1.55] flex-1 m-0">
            We use cookies and store the info you submit through our contact form to run
            the studio. We don&apos;t sell your data. See our{' '}
            <Link
              to="/privacy"
              className="font-semibold underline underline-offset-2 text-white hover:opacity-80 transition-opacity"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={accept}
            className="w-full sm:w-auto font-body text-[13px] font-bold px-6 py-2.5 transition-opacity hover:opacity-90 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep"
            style={{ background: accent, color: onAccent(accent) }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
