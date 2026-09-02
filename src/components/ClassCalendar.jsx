import { useRef, useState } from 'react'
import ClassDetailPanel from './ClassDetailPanel'
import { SCHEDULE } from '../lib/schedule'

// Sunday was added on 2026-09-02 for the Academy and removed again the same day when
// the Academy came off the calendar — nothing runs at the weekend now, and a listed
// day with no classes renders as an empty column taking a sixth of the width.
//
// A day absent from this list is silently DROPPED from the grid: it is built by
// mapping DAY_ORDER, not by reading the schedule. So this has to change whenever the
// schedule gains or loses a day, and a test pins the two together.
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// DERIVED from the schedule, not hardcoded to 17:00–21:00 as it was until 2026-09-02.
// It happens to resolve back to 17:00–21:00 now that the Academy is off the calendar,
// which is the point: the hardcoded pair was silently wrong for the two hours the
// Academy's Sunday session sat outside it, and deriving means the next class outside
// the evening widens the grid instead of floating above it on a negative start slot.
//
// Every class time falls on a 15-minute boundary, which a test enforces.
//
// Computed from the full SCHEDULE rather than the filtered `schedule` prop on purpose:
// deriving it from the prop would make the grid resize every time a filter changed,
// and blocks would jump around under the cursor.
//
// Floored and ceiled to the hour so the axis still lands on labelled hour marks.
const ALL_ROWS = SCHEDULE.flatMap(({ classes }) => classes)
const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const GRID_START_MINUTES = Math.floor(Math.min(...ALL_ROWS.map((c) => toMin(c.start))) / 60) * 60
const GRID_END_MINUTES = Math.ceil(Math.max(...ALL_ROWS.map((c) => toMin(c.end))) / 60) * 60
const SLOT_MINUTES = 15
const SLOT_PX = 22
const TOTAL_SLOTS = (GRID_END_MINUTES - GRID_START_MINUTES) / SLOT_MINUTES

// One accent per dance style so a style reads the same colour across the week. Repainted
// 2026-08-11 onto the redesign's five brand accents; the eight categories share them in
// pairs, because the point is that a given style stays consistent, not that every style
// is unique. Draw only from `core` in tailwind.config.js — no new colour values here.
const CATEGORY_ACCENTS = {
  tiny: 'border-l-core-pink',
  'musical-theatre': 'border-l-core-pink',
  ballet: 'border-l-core-teal',
  'lyrical-contemp': 'border-l-core-teal',
  'jazz-acro': 'border-l-core-orange',
  hiphop: 'border-l-core-orange',
  'tumble-cheer': 'border-l-core-red',
  adult: 'border-l-core-gold',
}

const BLOCK_BASE =
  'bg-ink-panel border border-white/[0.12] border-l-4 text-white hover:bg-white/[0.06]'

function toMinutes(hhmm) {
  const [hours, minutes] = hhmm.split(':').map(Number)
  return hours * 60 + minutes
}

// Group a day's classes into clusters of mutually overlapping classes. Each cluster is
// rendered as equal-width side-by-side columns so concurrent classes never cover each
// other. A class ending exactly when the next starts is sequential, not overlapping.
// eslint-disable-next-line react-refresh/only-export-components
export function clusterByOverlap(classes) {
  const sorted = [...classes].sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
  const clusters = []
  for (const cls of sorted) {
    const current = clusters[clusters.length - 1]
    const overlaps = current?.some((c) => toMinutes(c.end) > toMinutes(cls.start))
    if (overlaps) current.push(cls)
    else clusters.push([cls])
  }
  return clusters
}

function slotsFor(cls) {
  const start = toMinutes(cls.start)
  const end = toMinutes(cls.end)
  return {
    startSlot: (start - GRID_START_MINUTES) / SLOT_MINUTES,
    span: (end - start) / SLOT_MINUTES,
  }
}

function timeLabels() {
  const labels = []
  for (let m = GRID_START_MINUTES; m <= GRID_END_MINUTES; m += 30) {
    const hour = Math.floor(m / 60)
    const minute = m % 60
    const hour12 = hour > 12 ? hour - 12 : hour
    labels.push({
      key: `${hour}:${minute}`,
      text: `${hour12}:${String(minute).padStart(2, '0')}`,
      slot: (m - GRID_START_MINUTES) / SLOT_MINUTES,
    })
  }
  return labels
}

// `accent` is forwarded to the detail panel so the page's colour reaches it without
// either component touching the router. See ClassDetailPanel for why.
export default function ClassCalendar({ schedule, accent }) {
  const [selected, setSelected] = useState(null)
  const lastTriggerRef = useRef(null)

  function openClass(cls, day, event) {
    lastTriggerRef.current = event.currentTarget
    setSelected({ ...cls, day })
  }

  function closePanel() {
    setSelected(null)
    // Return focus to the block that opened the panel; without this, closing drops
    // focus to <body> and a keyboard user restarts at the top of the document.
    lastTriggerRef.current?.focus()
  }

  // If the schedule narrows (a filter change) so the currently open class is no
  // longer in it, drop the selection now, during render, instead of letting the
  // panel unmount silently when the empty state takes over. Without this, `selected`
  // stays set even though nothing is rendering it, and the panel can silently
  // reappear if the filter is later relaxed back to include that class. This is the
  // "adjust state during render" pattern — safe here because the guard condition
  // (`selected && !stillPresent`) is false immediately after the call, so it cannot
  // loop.
  //
  // Note: unlike closePanel(), this reset does not call lastTriggerRef.current?.focus().
  // Forcibly refocusing the old trigger would steal focus away from whatever the user
  // is doing right now (e.g. the <select> they just changed to narrow the schedule),
  // which would be worse than leaving focus alone. Skipping it here is production-safe
  // only because the one caller, Classes.jsx, drives `schedule` changes from <select>
  // elements that stay mounted and keep focus themselves — nothing in that path sends
  // focus to <body>. A future caller whose control disappears when `schedule` changes
  // (unlike a persistent <select>) would need to handle focus restoration itself.
  const stillPresent = selected != null && schedule.some(
    ({ day, classes }) =>
      day === selected.day &&
      classes.some((c) => c.name === selected.name && c.start === selected.start)
  )
  if (selected && !stillPresent) {
    setSelected(null)
  }
  // `visibleSelected` must stay the *same* object reference as `selected` (not a
  // freshly recomputed lookalike) when `stillPresent` is true. It gets set once by
  // openClass() and forwarded as-is here, because ClassDetailPanel's focus-on-open
  // effect keys off this prop by Object.is. Recomputing the selected row inline
  // during render — a natural-looking "simplification" — would hand the panel a new
  // object every render and yank focus back to Close on every keystroke in the
  // filter bar above.
  const visibleSelected = stillPresent ? selected : null

  const isEmpty = schedule.length === 0
  const byDay = isEmpty
    ? []
    : DAY_ORDER.map((day) => ({
        day,
        classes: schedule.find((d) => d.day === day)?.classes || [],
      }))
  const gridHeight = TOTAL_SLOTS * SLOT_PX

  return (
    <>
      {isEmpty ? (
        <div className="border border-dashed border-white/20 px-6 py-10 text-center">
          <p className="font-body text-mist-500 text-sm">No classes match your filters. Try adjusting your selection.</p>
        </div>
      ) : (
        <>
          {/* Desktop week grid */}
          <div data-testid="class-grid" className="hidden md:block">
            <div className="flex">
              <div className="w-12 flex-shrink-0" />
              {byDay.map(({ day }) => (
                <div
                  key={day}
                  className="flex-1 text-center font-body text-white text-xs font-bold uppercase tracking-wider pb-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="flex">
              {/* Time gutter */}
              <div className="w-12 flex-shrink-0 relative" style={{ height: gridHeight }}>
                {timeLabels().map(({ key, text, slot }) => (
                  <div
                    key={key}
                    data-testid="time-label"
                    className="absolute right-2 font-body text-mist-500 text-[10px] font-semibold -translate-y-1/2"
                    style={{ top: slot * SLOT_PX }}
                  >
                    {text}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {byDay.map(({ day, classes }) => (
                <div
                  key={day}
                  className="flex-1 relative border-l border-white/10"
                  style={{ height: gridHeight }}
                >
                  {timeLabels().map(({ key, slot }) => (
                    <div
                      key={key}
                      className="absolute left-0 right-0 border-t border-white/10"
                      style={{ top: slot * SLOT_PX }}
                    />
                  ))}

                  {clusterByOverlap(classes).map((cluster) =>
                    cluster.map((cls, index) => {
                      const { startSlot, span } = slotsFor(cls)
                      const width = 100 / cluster.length
                      return (
                        <button
                          key={`${cls.name}-${cls.start}`}
                          type="button"
                          data-testid="class-block"
                          data-start-slot={startSlot}
                          data-span={span}
                          data-cluster-size={cluster.length}
                          data-cluster-index={index}
                          onClick={(e) => openClass(cls, day, e)}
                          aria-label={`${cls.name}, ${day} ${cls.time}`}
                          className={`absolute px-1.5 py-1 text-left overflow-hidden transition-colors focus:outline-none focus:ring-2 focus:ring-white ${BLOCK_BASE} ${CATEGORY_ACCENTS[cls.category] || CATEGORY_ACCENTS.adult}`}
                          style={{
                            top: startSlot * SLOT_PX + 1,
                            height: span * SLOT_PX - 2,
                            left: `${index * width}%`,
                            width: `${width}%`,
                          }}
                        >
                          <span className="block font-body text-[10px] font-bold leading-tight">{cls.name}</span>
                          <span className="block font-body text-[9px] opacity-70 leading-tight">{cls.time}</span>
                        </button>
                      )
                    })
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile day list */}
          <div data-testid="class-list" className="md:hidden flex flex-col gap-8">
            {byDay
              .filter(({ classes }) => classes.length > 0)
              .map(({ day, classes }) => (
                <div key={day}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="font-display uppercase text-white text-xl">{day}</div>
                    <div className="flex-1 h-px bg-white/15" />
                  </div>
                  <div className="flex flex-col gap-3">
                    {classes.map((cls) => (
                      <button
                        key={`${cls.name}-${cls.start}`}
                        type="button"
                        data-testid="class-list-item"
                        onClick={(e) => openClass(cls, day, e)}
                        aria-label={`${cls.name}, ${day} ${cls.time}, ${cls.ages}`}
                        className={`w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition-colors ${BLOCK_BASE} ${CATEGORY_ACCENTS[cls.category] || CATEGORY_ACCENTS.adult}`}
                      >
                        <span className="flex-1 min-w-0">
                          <span className="block font-body font-bold text-base">{cls.name}</span>
                          <span className="block font-body text-mist-500 text-sm mt-0.5">{cls.ages}</span>
                        </span>
                        <span className="font-body text-mist-200 text-sm font-medium flex-shrink-0">{cls.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      <ClassDetailPanel classInfo={visibleSelected} onClose={closePanel} accent={accent} />
    </>
  )
}
