import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AccentStripe from './AccentStripe'
import { accentForPath } from '../lib/pageAccents'

// Restyled 2026-08-11 to the studio's site mockups. The interaction logic — hover/click
// submenu, outside-click and Escape handling, the mobile sheet — is unchanged from the
// version before it; only the presentation moved. Read the comments on NavGroup's
// onClick before touching it, they record a real bug.
//
// The nav doubles as the site's colour key: every item always carries its own section's
// accent as an underline, so the bar reads as a legend and a visitor learns the mapping
// without being told. The active item is marked by white text, not by the underline —
// colour alone is never the only signal.
const NAV_LINKS = [
  { to: '/', label: 'Home' },
  // Added 2026-08-11: the mockups carry About in the top-level bar.
  { to: '/about', label: 'About' },
  {
    to: '/classes',
    label: 'Classes',
    children: [
      { to: '/classes', label: 'Class Schedule' },
      { to: '/class-levels', label: 'Class Levels' },
      // Tuition moved out of the top-level bar and under Classes on 2026-08-03.
      { to: '/tuition', label: 'Tuition' },
    ],
  },
  { to: '/little-movers', label: 'Little Movers' },
  { to: '/birthdays', label: 'Birthdays' },
  // Promoted out of the Classes dropdown to the top bar on 2026-08-11. Labelled
  // "Adults" rather than "Adult Classes" — the bar is the one place where every extra
  // word costs horizontal room, and the section reads unambiguously without it.
  { to: '/adult-classes', label: 'Adults' },
  { to: '/dance-company', label: 'Dance Company' },
]

function NavGroup({ link, active, accent }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const groupRef = useRef(null)
  const caretRef = useRef(null)

  // Close on route change. Adjusting state during render (rather than in an
  // effect) is React's recommended pattern for resetting state when an input
  // changes, and avoids the cascading re-render that set-state-in-effect warns about.
  const [lastPathname, setLastPathname] = useState(pathname)
  if (lastPathname !== pathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e) {
      if (groupRef.current && !groupRef.current.contains(e.target)) setOpen(false)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        caretRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div
      ref={groupRef}
      className="relative flex items-end gap-1"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={link.to}
        aria-current={active ? 'page' : undefined}
        className={`font-body font-semibold text-[13.5px] pb-1.5 border-b-[3px] transition-colors ${
          active ? 'text-white' : 'text-mist-200 hover:text-white'
        }`}
        style={{ borderColor: accent }}
      >
        {link.label}
      </Link>
      <button
        ref={caretRef}
        type="button"
        aria-expanded={open}
        aria-label={`${link.label} menu`}
        // detail === 0 means keyboard activation (Enter/Space on a focused button):
        // toggle, so keyboard users can close what they opened.
        // detail >= 1 is a real pointer click. Never close on those — hover has
        // usually already opened the menu, so toggling would close it the instant
        // the user clicks (the bug this replaced). Opening is still required for
        // touch/pen at desktop width, where mouseenter never fires at all.
        onClick={(e) => {
          if (e.detail === 0) setOpen((o) => !o)
          else setOpen(true)
        }}
        className="text-mist-200 hover:text-white text-[9px] leading-none px-0.5 pb-2"
      >
        ▼
      </button>

      {open && (
        <div className="absolute left-0 top-full pt-3 z-50">
          <div className="bg-ink-deep border border-white/15 py-2 min-w-[180px] shadow-xl">
            {link.children.map((child) => (
              <Link
                key={`${child.to}-${child.label}`}
                to={child.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 font-body text-sm font-medium whitespace-nowrap border-l-[3px] transition-colors ${
                  pathname === child.to
                    ? 'text-white'
                    : 'text-mist-200 border-transparent hover:text-white hover:bg-white/5'
                }`}
                style={pathname === child.to ? { borderColor: accent } : undefined}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const pageAccent = accentForPath(pathname)

  // A parent is active on its own path or on any of its children's paths.
  function isActive(link) {
    if (pathname === link.to) return true
    return (link.children || []).some((child) => pathname === child.to)
  }

  return (
    <nav className="bg-ink-base sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-11 h-[76px] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 justify-self-start">
          <img
            src="/logo.png"
            alt="Capital Core Dance Studio"
            className="h-11 w-11 object-contain flex-shrink-0"
          />
          <div className="leading-none">
            <div className="text-white font-body font-bold text-[15px] tracking-[0.14em]">
              CAPITAL CORE
            </div>
            <div className="text-mist-600 font-body font-semibold text-[9.5px] tracking-[0.3em] mt-1">
              DANCE STUDIO
            </div>
          </div>
        </Link>

        {/* Desktop nav — centered */}
        <div data-testid="desktop-nav" className="hidden lg:flex items-end justify-center gap-7">
          {NAV_LINKS.map((link) => {
            const accent = accentForPath(link.to)
            const active = isActive(link)
            return link.children ? (
              <NavGroup key={link.to} link={link} active={active} accent={accent} />
            ) : (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                className={`font-body font-semibold text-[13.5px] pb-1.5 border-b-[3px] transition-colors ${
                  active ? 'text-white' : 'text-mist-200 hover:text-white'
                }`}
                style={{ borderColor: accent }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center justify-end justify-self-end col-start-3">
          <Link
            to="/contact"
            className="hidden lg:inline-flex font-body font-bold text-[13.5px] text-white px-[22px] py-3 transition-opacity hover:opacity-90"
            style={{ background: pageAccent }}
          >
            Contact Us
          </Link>

          <button
            className="lg:hidden text-white text-xl leading-none"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {menuOpen && (
        <div
          data-testid="mobile-menu"
          className="lg:hidden bg-ink-deep border-t border-white/10 px-6 py-5 flex flex-col gap-4"
        >
          {NAV_LINKS.map((link) => (
            <div key={link.to} className="flex flex-col gap-3">
              <Link
                to={link.to}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link) ? 'page' : undefined}
                className={`font-body font-semibold text-sm pl-3 border-l-[3px] ${
                  isActive(link) ? 'text-white' : 'text-mist-200'
                }`}
                style={{ borderColor: accentForPath(link.to) }}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="flex flex-col gap-3 pl-6">
                  {link.children.map((child) => (
                    <Link
                      key={`${child.to}-${child.label}`}
                      to={child.to}
                      onClick={() => setMenuOpen(false)}
                      className={`font-body text-sm font-medium ${
                        pathname === child.to ? 'text-white' : 'text-mist-400'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="font-body font-bold text-sm text-white px-5 py-3 text-center mt-1"
            style={{ background: pageAccent }}
          >
            Contact Us
          </Link>
        </div>
      )}

      <AccentStripe />
    </nav>
  )
}
