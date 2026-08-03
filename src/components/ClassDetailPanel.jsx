import { useEffect, useRef } from 'react'
import { getClassInfo } from '../lib/classInfo'

const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

// Detail dialog for one class on the schedule. `classInfo` is a schedule row plus the
// day it falls on; null means nothing is selected and the panel renders nothing.
export default function ClassDetailPanel({ classInfo, onClose }) {
  const headingId = 'class-detail-heading'
  const closeRef = useRef(null)

  useEffect(() => {
    if (!classInfo) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
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

  const { name, day, time, ages, infoKey } = classInfo
  const info = getClassInfo(infoKey)

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
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            {day} · {time}
          </p>
          <h2 id={headingId} className="text-navy-dark text-xl font-black">
            {name}
          </h2>
          <p className="text-[#5a6a8a] text-sm mt-1">{ages}</p>

          {info && (
            <>
              <p className="text-brand-red text-xs font-semibold mt-4">{info.audience}</p>
              <p className="text-[#5a6a8a] text-sm mt-2 leading-relaxed">{info.description}</p>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-surface-border bg-surface-light">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="text-[#8a9aaa] text-sm font-semibold hover:text-navy-dark transition-colors"
          >
            Close
          </button>
          <a
            href={PORTAL_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-navy-dark text-white text-sm font-bold px-5 py-2 rounded-md hover:bg-navy-mid transition-colors"
          >
            Register for Fall →
          </a>
        </div>
      </div>
    </div>
  )
}
