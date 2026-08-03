import { useRef, useState } from 'react'
import ClassDetailPanel from './ClassDetailPanel'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// The Fall schedule runs 5:00–9:00 PM. Sixteen 15-minute slots cover it, and every
// class time in the schedule falls on a 15-minute boundary (a test enforces this).
const GRID_START_MINUTES = 17 * 60
const GRID_END_MINUTES = 21 * 60
const SLOT_MINUTES = 15
const SLOT_PX = 22
const TOTAL_SLOTS = (GRID_END_MINUTES - GRID_START_MINUTES) / SLOT_MINUTES

// One accent per dance style so a style reads the same colour across the week. Only
// the four accents already used elsewhere on the site are available, so the eight
// categories share them in pairs — the point is that a given style is consistent, not
// that every style is unique. Do not introduce new colour values here.
const CATEGORY_ACCENTS = {
  tiny: 'border-l-[#f4a8b4]',
  'musical-theatre': 'border-l-[#f4a8b4]',
  ballet: 'border-l-[#7ab3e8]',
  'lyrical-contemp': 'border-l-[#7ab3e8]',
  'jazz-acro': 'border-l-[#f4a060]',
  hiphop: 'border-l-[#f4a060]',
  'tumble-cheer': 'border-l-brand-red',
  adult: 'border-l-navy-mid',
}

const BLOCK_BASE = 'bg-white border border-surface-border border-l-4 text-navy-dark'

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

export default function ClassCalendar({ schedule }) {
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
        <div className="border border-dashed border-surface-border rounded-lg px-6 py-10 text-center">
          <p className="text-[#8a9aaa] text-sm">No classes match your filters. Try adjusting your selection.</p>
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
                  className="flex-1 text-center text-navy-dark text-xs font-black uppercase tracking-wider pb-2"
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
                    className="absolute right-2 text-[#8a9aaa] text-[10px] font-semibold -translate-y-1/2"
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
                  className="flex-1 relative border-l border-surface-border"
                  style={{ height: gridHeight }}
                >
                  {timeLabels().map(({ key, slot }) => (
                    <div
                      key={key}
                      className="absolute left-0 right-0 border-t border-surface-border"
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
                          className={`absolute rounded px-1.5 py-1 text-left overflow-hidden hover:bg-surface-light focus:outline-none focus:ring-2 focus:ring-navy-dark ${BLOCK_BASE} ${CATEGORY_ACCENTS[cls.category] || CATEGORY_ACCENTS.adult}`}
                          style={{
                            top: startSlot * SLOT_PX + 1,
                            height: span * SLOT_PX - 2,
                            left: `${index * width}%`,
                            width: `${width}%`,
                          }}
                        >
                          <span className="block text-[10px] font-bold leading-tight">{cls.name}</span>
                          <span className="block text-[9px] opacity-75 leading-tight">{cls.time}</span>
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
                    <div className="text-navy-dark font-black text-lg">{day}</div>
                    <div className="flex-1 h-px bg-surface-border" />
                  </div>
                  <div className="flex flex-col gap-3">
                    {classes.map((cls) => (
                      <button
                        key={`${cls.name}-${cls.start}`}
                        type="button"
                        data-testid="class-list-item"
                        onClick={(e) => openClass(cls, day, e)}
                        aria-label={`${cls.name}, ${day} ${cls.time}`}
                        className={`w-full rounded-lg px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-surface-light transition-colors ${BLOCK_BASE} ${CATEGORY_ACCENTS[cls.category] || CATEGORY_ACCENTS.adult}`}
                      >
                        <span className="flex-1 min-w-0">
                          <span className="block font-bold text-base">{cls.name}</span>
                          <span className="block text-[#5a6a8a] text-sm mt-0.5">{cls.ages}</span>
                        </span>
                        <span className="text-[#7ab3e8] text-sm font-medium flex-shrink-0">{cls.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      <ClassDetailPanel classInfo={visibleSelected} onClose={closePanel} />
    </>
  )
}
