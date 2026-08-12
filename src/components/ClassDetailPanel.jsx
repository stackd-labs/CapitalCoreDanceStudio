import { useEffect, useRef } from 'react'
import { getClassInfo } from '../lib/classInfo'
import { PROGRAMS } from '../lib/schedule'
import { DEFAULT_ACCENT } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

// One tint per program tier. Repainted 2026-08-11 for the dark panel: the old pastel
// fills were designed against white and turn to mud on #101d38, so each tier now uses a
// low-opacity wash of a `core` accent with the accent itself as the text. The three Core
// tiers share the teal family at rising strength, since they are one progression.
const PROGRAM_STYLES = {
  'tiny-core': 'bg-core-pink/15 text-core-pink',
  core: 'bg-core-teal/15 text-core-teal',
  'core-plus': 'bg-core-teal/25 text-core-teal',
  'core-elite': 'bg-core-teal/40 text-white',
  technique: 'bg-core-orange/15 text-core-orange',
  specialty: 'bg-core-pink/15 text-core-pink',
  'adult-core': 'bg-core-gold/15 text-core-gold',
}

const PROGRAMS_BY_VALUE = Object.fromEntries(PROGRAMS.map((p) => [p.value, p]))

// Detail dialog for one class on the schedule. `classInfo` is a schedule row plus the
// day it falls on; null means nothing is selected and the panel renders nothing.
//
// `accent` is passed in rather than read from the route: this is a leaf presentational
// component, and reading the router here would force every caller — including two test
// suites that render it bare — to provide a Router just to show a colour.
export default function ClassDetailPanel({ classInfo, onClose, accent = DEFAULT_ACCENT }) {
  const headingId = 'class-detail-heading'
  const closeRef = useRef(null)
  const registerRef = useRef(null)

  // Lock background scrolling while the panel is open — without this the page
  // scrolls behind the fixed backdrop. Restore whatever the page had set on close.
  useEffect(() => {
    if (!classInfo) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [classInfo])

  useEffect(() => {
    if (!classInfo) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // Trap Tab/Shift+Tab between the two focusable elements in the dialog (Close
      // and Register) so focus can never land on the obscured page behind the
      // backdrop, which sits under an opaque overlay and would otherwise let a
      // keyboard user tab onto (and activate) a link they can't see.
      if (e.key !== 'Tab') return
      const closeEl = closeRef.current
      const registerEl = registerRef.current
      if (!closeEl || !registerEl) return
      if (e.shiftKey) {
        if (document.activeElement === closeEl) {
          e.preventDefault()
          registerEl.focus()
        }
      } else {
        if (document.activeElement === registerEl) {
          e.preventDefault()
          closeEl.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [classInfo, onClose])

  // Move focus into the dialog when it opens so keyboard users are not left behind on
  // the block they activated. Task 5 owns restoring focus outward on close.
  useEffect(() => {
    if (classInfo) closeRef.current?.focus()
  }, [classInfo])

  if (!classInfo) return null

  const { name, day, time, ages, infoKey, program } = classInfo
  const info = getClassInfo(infoKey)
  const tier = PROGRAMS_BY_VALUE[program]

  return (
    <div
      data-testid="panel-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative bg-ink-panel border border-white/15 shadow-2xl max-w-md w-full max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5">
          <p
            className="font-body text-xs font-bold tracking-[0.3em] uppercase mb-2"
            style={{ color: accent }}
          >
            {day} · {time}
          </p>
          <h2 id={headingId} className="font-display uppercase text-white text-2xl leading-none">
            {name}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {tier && (
              <span
                data-testid="program-badge"
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${PROGRAM_STYLES[program] || PROGRAM_STYLES['adult-core']}`}
              >
                {tier.label}
              </span>
            )}
            <span className="font-body text-mist-400 text-sm">{ages}</span>
          </div>
          {tier && (
            <p data-testid="program-blurb" className="font-body text-mist-500 text-xs mt-2 leading-relaxed">
              <span className="font-bold uppercase tracking-wider">{tier.level}</span>
              {' · '}
              {tier.blurb}
            </p>
          )}

          {info && (
            <p className="font-body text-mist-300 text-sm mt-4 leading-relaxed">{info.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/12 bg-ink-deep">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="font-body text-mist-500 text-sm font-semibold hover:text-white transition-colors"
          >
            Close
          </button>
          <a
            ref={registerRef}
            href={PORTAL_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm font-bold px-5 py-2.5 transition-opacity hover:opacity-90"
            style={{ background: accent, color: onAccent(accent) }}
          >
            Register for Fall →
          </a>
        </div>
      </div>
    </div>
  )
}
