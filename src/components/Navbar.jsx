import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/classes', label: 'Classes' },
  { to: '/dance-company', label: 'Dance Company' },
  { to: '/tuition', label: 'Tuition' },
  { to: '/birthdays', label: 'Birthdays' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function linkClass(to) {
    return pathname === to
      ? 'text-[#f4a8b4] border-b-2 border-[#f4a8b4] pb-0.5'
      : 'text-[#b8d4f0] hover:text-white'
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
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={`text-sm font-medium transition-colors ${linkClass(to)}`}>
              {label}
            </Link>
          ))}
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
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${pathname === to ? 'text-[#f4a8b4]' : 'text-[#b8d4f0]'}`}
            >
              {label}
            </Link>
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
