import { useState } from 'react'
import PhotoSlot from './PhotoSlot'

// One instructor on the About page's staff grid.
//
// Extracted from About.jsx 2026-08-17, when the studio asked for two things that pull
// against each other: show the whole headshot (the 3:2 well was cutting heads off) and
// keep the cards from becoming a wall of faces. An uncropped square photo costs exactly
// the height the bio used to occupy, so the bio moved behind a per-card toggle and the
// card stays roughly as short as it was.
//
// State is local to the card rather than lifted to the grid. A single shared "which one
// is open" would collapse a bio the moment a visitor opened another, mid-read.
export default function StaffCard({ person, accent }) {
  const [open, setOpen] = useState(false)
  const { slug, firstName, role, specialties, bio, photo, photoAlt } = person
  const bioId = `staff-bio-${slug}`

  return (
    <div
      data-testid="staff-card"
      className="border border-white/[0.12] bg-ink-base flex flex-col"
    >
      {/* Square, to match the source headshots exactly — all six are 700x700, so
          object-cover crops nothing. overflow-hidden is load-bearing: aspect-* alone
          only sets a preferred height, and with overflow visible the in-flow <img>
          grows the box and overrides the ratio (the bug that made the old 3:2 well
          render square and silently drop its crop). */}
      <div className="aspect-square overflow-hidden">
        <PhotoSlot src={photo} alt={photoAlt} caption="Headshot" className="w-full h-full" />
      </div>

      <div className="px-6 pt-6 pb-7 flex flex-col flex-1">
        <div
          data-testid="staff-name"
          className="font-display uppercase text-white text-[26px] leading-none mb-2"
        >
          {firstName}
        </div>
        <div
          data-testid="staff-role"
          className="font-body text-[11.5px] font-semibold tracking-[0.16em] uppercase mb-1"
          style={{ color: accent }}
        >
          {role}
        </div>
        <div className="font-body text-mist-500 text-[12.5px]">{specialties}</div>

        {/* aria-label rather than relying on the glyph: the accessible name of a bare
            "+" is "+", which tells a screen reader nothing about which of six cards it
            opens. The glyph is aria-hidden so the name is not "+ Show Adelle's bio". */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={bioId}
          aria-label={`${open ? 'Hide' : 'Show'} ${firstName}'s bio`}
          className="mt-4 self-start w-8 h-8 flex items-center justify-center border border-white/25 text-white/80 text-[19px] leading-none font-body hover:bg-white/10 hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors"
          style={{ outlineColor: accent }}
        >
          <span aria-hidden="true">{open ? '×' : '+'}</span>
        </button>

        {/* The `hidden` attribute, not a conditional render: the bios are real marketing
            copy and stay in the page source for search engines, while `hidden` drops
            them from the accessibility tree when collapsed.
            Do NOT add a display utility (block/flex/grid) to this <p> — Preflight's
            [hidden]{display:none} is a single-attribute selector, so any display
            utility would win the cascade and the bio would never hide. */}
        <p
          id={bioId}
          hidden={!open}
          data-testid="staff-bio"
          className="font-body text-[14.5px] leading-[1.6] text-mist-400 m-0 mt-4"
        >
          {bio}
        </p>
      </div>
    </div>
  )
}
