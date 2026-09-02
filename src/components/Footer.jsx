import { Link, useLocation } from 'react-router-dom'
import { accentForPath } from '../lib/pageAccents'

// Restyled 2026-08-11 to the studio's site mockups: four columns on the deep navy, a
// heavy top border in the page's accent, Barlow throughout. Every address, link and
// social account is unchanged from the previous footer — only the arrangement moved.
//
// The mockup's three link columns are filled with the studio's real sections rather
// than the generic placeholders it shipped with.
const LINK_COLUMNS = [
  {
    heading: 'Classes',
    links: [
      { to: '/classes', label: 'Class Schedule' },
      { to: '/class-levels', label: 'Class Levels' },
      { to: '/adult-classes', label: 'Adult Classes' },
      { to: '/little-movers', label: 'Little Movers' },
      { to: '/tuition', label: 'Tuition' },
    ],
  },
  {
    heading: 'Studio',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/dance-company', label: 'Dance Company' },
      { to: '/birthdays', label: 'Birthdays' },
      { to: '/blog', label: 'Blog' },
      // Careers lives here and nowhere else in the chrome: the navbar is a parent's map
      // of the studio, and the people looking for this page are looking for the footer.
      { to: '/careers', label: 'Careers' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: 'Contact Us' },
      { to: '/privacy', label: 'Privacy' },
      { to: '/terms', label: 'Terms' },
    ],
  },
]

const INSTAGRAM = 'https://www.instagram.com/capitalcoredance'
const FACEBOOK = 'https://www.facebook.com/p/Capital-Core-Dance-Challenge-61566002721661/'

// The studio portal, added to the footer 2026-09-02 at the studio's request. Deliberately
// the BARE ORIGIN rather than /login: the portal 308s the root to its login page, so this
// keeps working if that path is ever renamed. Verified 2026-09-02.
//
// This is the only way into the portal from the site chrome — the navbar is a prospective
// parent's map of the studio, and a returning family looking to sign in looks at the
// footer, the same argument that puts Careers here and nowhere else.
const PORTAL_URL = 'https://studio.capitalcoredance.com'

export default function Footer() {
  const { pathname } = useLocation()
  const accent = accentForPath(pathname)

  return (
    <footer
      className="bg-ink-deep font-body px-6 lg:px-24 pt-16 pb-10 border-t-4"
      style={{ borderColor: accent }}
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] gap-10">
        <div>
          <div className="text-white font-bold text-[15px] tracking-[0.14em] mb-3">
            CAPITAL CORE DANCE STUDIO
          </div>
          <address className="not-italic text-mist-500 text-sm leading-[1.7]">
            <a
              href="https://maps.google.com/?q=13110+Midlothian+Turnpike+Midlothian+VA+23113"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              13110 Midlothian Turnpike
              <br />
              Midlothian, VA 23113
            </a>
            <br />
            <a href="tel:8042344014" className="hover:text-white transition-colors">
              804-234-4014
            </a>
            <br />
            <a href="mailto:info@capitalcoredance.com" className="hover:text-white transition-colors">
              info@capitalcoredance.com
            </a>
          </address>

          <div className="flex gap-3 mt-5">
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center w-9 h-9 border border-white/20 hover:border-white/60 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-core-pink">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href={FACEBOOK}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex items-center justify-center w-9 h-9 border border-white/20 hover:border-white/60 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-core-teal">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>

          {/* Portal sign-in. Borrows the social icons' border idiom rather than a solid
              accent fill on purpose: the footer's accent changes with the page, and a
              solid button would recolour itself on every route, which is wrong for a
              destination that is the same system wherever you click it from. It also
              keeps it from outranking the page's own registration call to action.

              The caption is there because "portal" alone does not tell a parent what is
              behind it, and the portal is a separate sign-in from anything on this site. */}
          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="portal-link"
            className="group inline-flex items-center gap-2 mt-6 border border-white/20 hover:border-white/60 px-5 py-3 text-white text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Enter our portal
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              &rarr;
            </span>
          </a>
          <p className="text-mist-500 text-xs leading-[1.6] mt-2.5 max-w-[260px]">
            Sign in to enroll, pay tuition and book classes.
          </p>
        </div>

        {LINK_COLUMNS.map(({ heading, links }) => (
          <div key={heading}>
            <div
              className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: accent }}
            >
              {heading}
            </div>
            <ul className="flex flex-col gap-[9px]">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-mist-400 text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-[1440px] mx-auto mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-mist-500 text-xs">
          © 2026 Capital Core Dance Studio. All rights reserved.
        </p>
        <p className="text-mist-500/60 text-xs">Managed by Hicks Virtual Solutions LLC</p>
      </div>
    </footer>
  )
}
