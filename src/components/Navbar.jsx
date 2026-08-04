import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  {
    to: '/classes',
    label: 'Classes',
    children: [
      { to: '/classes', label: 'Class Schedule' },
      { to: '/class-levels', label: 'Class Levels' },
      { to: '/adult-classes', label: 'Adult Classes' },
      // Tuition moved out of the top-level bar and under Classes on 2026-08-03.
      { to: '/tuition', label: 'Tuition' },
    ],
  },
  { to: '/little-movers', label: 'Little Movers' },
  { to: '/dance-company', label: 'Dance Company' },
  { to: '/birthdays', label: 'Birthdays' },
]

const ACTIVE_CLASS = 'text-[#f4a8b4] border-b-2 border-[#f4a8b4] pb-0.5'
const INACTIVE_CLASS = 'text-[#b8d4f0] hover:text-white'

// A nav item with children: the parent stays a real link to its own page, and a
// caret beside it opens the submenu on hover or on click/keyboard.
function NavGroup({ link, className }) {
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
      className="relative flex items-center gap-1"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link to={link.to} className={`text-sm font-medium transition-colors ${className}`}>
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
        className="text-[#b8d4f0] hover:text-white text-[9px] leading-none px-0.5"
      >
        ▼
      </button>

      {open && (
        <div className="absolute left-0 top-full pt-3 z-50">
          <div className="bg-navy-dark border border-navy-mid rounded-md py-2 min-w-[170px] shadow-lg">
            {link.children.map((child) => (
              <Link
                key={`${child.to}-${child.label}`}
                to={child.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  pathname === child.to
                    ? 'text-[#f4a8b4]'
                    : 'text-[#b8d4f0] hover:text-white hover:bg-navy-mid'
                }`}
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

  // A parent is active on its own path or on any of its children's paths.
  function isActive(link) {
    if (pathname === link.to) return true
    return (link.children || []).some((child) => pathname === child.to)
  }

  function linkClass(link) {
    return isActive(link) ? ACTIVE_CLASS : INACTIVE_CLASS
  }

  return (
    <nav className="bg-navy-dark sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 justify-self-start">
          <img src="/logo.png" alt="Capital Core Dance Studio" className="h-10 w-10 object-contain flex-shrink-0" />
          <div>
            <div className="text-white font-black text-sm tracking-widest">CAPITAL CORE</div>
            <div className="text-[#7ab3e8] text-[10px] tracking-[0.3em]">DANCE STUDIO</div>
          </div>
        </Link>

        {/* Desktop nav — centered */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-7">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <NavGroup key={link.to} link={link} className={linkClass(link)} />
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${linkClass(link)}`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right: Contact (desktop) + hamburger (mobile) */}
        <div className="flex items-center justify-end justify-self-end col-start-3">
          <Link
            to="/contact"
            className="hidden md:inline-flex bg-brand-red text-white text-sm font-bold px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Contact Us
          </Link>

          {/* Hamburger button */}
          <button
            className="md:hidden text-white text-xl leading-none"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-navy-dark border-t border-navy-mid px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <div key={link.to} className="flex flex-col gap-3">
              <Link
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium ${isActive(link) ? 'text-[#f4a8b4]' : 'text-[#b8d4f0]'}`}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="flex flex-col gap-3 pl-4 border-l border-navy-mid">
                  {link.children.map((child) => (
                    <Link
                      key={`${child.to}-${child.label}`}
                      to={child.to}
                      onClick={() => setMenuOpen(false)}
                      className={`text-sm font-medium ${pathname === child.to ? 'text-[#f4a8b4]' : 'text-[#b8d4f0]'}`}
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
            className="bg-brand-red text-white text-sm font-bold px-5 py-2 rounded-md text-center"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  )
}
