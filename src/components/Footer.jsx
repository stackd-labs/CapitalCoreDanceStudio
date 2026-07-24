import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/classes', label: 'Classes' },
  { to: '/dance-company', label: 'Dance Company' },
  { to: '/tuition', label: 'Tuition' },
  { to: '/birthdays', label: 'Birthdays' },
  { to: '/blog', label: 'Blog' },
  { to: '/faq', label: 'FAQ' },
  // Internal recital orders viewer — hidden from the public footer.
  // Re-enable by uncommenting when orders are open again. The /orders
  // route still works directly (passcode-gated); this only controls the link.
  // { to: '/orders', label: 'Admin Orders' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-dark px-6 pt-10 pb-6">
      <div className="max-w-6xl mx-auto">

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-[#2a3a5a]">

          {/* Studio info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src="/logo.png" alt="Capital Core Dance Studio" className="h-10 w-10 object-contain flex-shrink-0" />
              <div>
                <div className="text-white font-black text-sm tracking-widest">CAPITAL CORE DANCE STUDIO</div>
                <div className="text-[#7ab3e8] text-[10px] tracking-[0.3em]">MIDLOTHIAN, VIRGINIA</div>
              </div>
            </div>
            <ul className="flex flex-col gap-2 text-[#8a9aaa] text-xs">
              <li>
                <a
                  href="https://maps.google.com/?q=13110+Midlothian+Turnpike+Midlothian+VA+23113"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  13110 Midlothian Turnpike<br />Midlothian, VA 23113
                </a>
              </li>
              <li>
                <a href="tel:8042344014" className="hover:text-white transition-colors">
                  804-234-4014
                </a>
              </li>
              <li>
                <a href="mailto:info@capitalcoredance.com" className="hover:text-white transition-colors">
                  info@capitalcoredance.com
                </a>
              </li>
            </ul>
            {/* Social links */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.instagram.com/capitalcoredance"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e2f50] hover:bg-[#2a3f6a] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f4a8b4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/p/Capital-Core-Dance-Challenge-61566002721661/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e2f50] hover:bg-[#2a3f6a] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7ab3e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <div className="text-[#5a7aaa] text-xs font-bold uppercase tracking-widest mb-4">Quick Links</div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-[#8a9aaa] text-xs hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#5a7aaa] text-xs">© 2026 Capital Core Dance Studio. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link to="/privacy" className="text-[#5a7aaa] text-xs hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="text-[#5a7aaa] text-xs hover:text-white transition-colors">Terms</Link>
            <a href="https://www.instagram.com/capitalcoredance" target="_blank" rel="noreferrer" className="text-[#5a7aaa] text-xs hover:text-[#f4a8b4] transition-colors">Instagram</a>
            <a href="https://www.facebook.com/p/Capital-Core-Dance-Challenge-61566002721661/" target="_blank" rel="noreferrer" className="text-[#5a7aaa] text-xs hover:text-[#7ab3e8] transition-colors">Facebook</a>
            <p className="text-[#3a4a6a] text-xs">Managed by Hicks Virtual Solutions LLC</p>
          </div>
        </div>

      </div>
    </footer>
  )
}
