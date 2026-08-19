import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import AccentStripe from '../components/AccentStripe'
import { Kicker } from '../components/blocks'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Added 2026-08-19. Until now App.jsx had no catch-all, so every unmatched URL —
// a typo, a stale bookmark, a link in an old email — rendered the app shell with
// nothing inside it: a white page returning HTTP 200. That is worse than a 404 in
// two ways. A visitor gets no explanation and no way onward, and a search engine
// reads a 200 with no content as a soft 404 and keeps the dead URL in its index
// rather than dropping it.
//
// Retired seasonal paths (/camps, /summer-classes, /mini-series,
// /adult-summer-series, /recital, /recitalshop) do NOT land here — vercel.json
// redirects them to their closest live page with a real 308 first, which is what
// actually removes them from the index. This page is for everything else.
//
// No accent of its own: accentForPath falls through to red for any unknown path,
// so the navbar, footer and this page already agree without an entry in the map.
const ACCENT = ACCENTS.red

// Where a lost visitor most plausibly meant to go. Deliberately short — a wall of
// every route is a sitemap, not a recovery. These are the five things the studio
// sells plus the page that answers questions.
const DESTINATIONS = [
  {
    to: '/classes',
    name: 'Class Schedule',
    blurb: 'The full week, every class, with times and ages.',
  },
  {
    to: '/little-movers',
    name: 'Little Movers',
    blurb: 'Movement classes for infants, toddlers and preschoolers.',
  },
  {
    to: '/adult-classes',
    name: 'Adult Classes',
    blurb: 'Evening classes for 16 and up. First class free.',
  },
  {
    to: '/dance-company',
    name: 'Dance Company',
    blurb: 'Our youth performance and competition programme.',
  },
  {
    to: '/birthdays',
    name: 'Birthdays',
    blurb: 'Private studio parties, instructor led, no cleanup.',
  },
  {
    to: '/faq',
    name: 'FAQ',
    blurb: 'Tuition, ages, what to wear, and how to start.',
  },
]

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      {/* noindex so the soft-404 problem is not simply moved to this URL. Every
          address that renders this page is one Google should forget. */}
      <SEO
        title="Page Not Found | Capital Core Dance Studio"
        description="That page is not here. Find classes, Little Movers, adult classes, the Dance Company, birthday parties and contact details for Capital Core Dance Studio in Midlothian, VA."
        noindex
      />
      <Navbar />

      {/* A compact band rather than the shared Hero: Hero is a 640px marketing panel
          with a photo well, and there is nothing to sell on this page. */}
      <header className="bg-ink-base px-6 lg:px-24 pt-16 pb-12 lg:pt-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Page not found</Kicker>
          <div
            className="font-display uppercase leading-[0.85] text-[92px] sm:text-[130px] lg:text-[160px] mb-4"
            style={{ color: ACCENT }}
            aria-hidden="true"
          >
            404
          </div>
          {/* An h1 rather than the shared SectionHeading, which renders an h2. Every
              other page gets its h1 from Hero; this page does not use Hero, and a page
              whose only headings are h2s reads to a screen reader as a fragment of
              something else. Styles match SectionHeading so it looks like the system. */}
          <h1 className="font-display uppercase text-white text-[34px] sm:text-[44px] lg:text-[52px] leading-[0.96] m-0 mb-5 text-balance">
            That page has moved or never existed
          </h1>
          <p className="font-body text-[16.5px] leading-[1.65] text-mist-300 max-w-[520px] m-0 mb-8">
            Check the address for a typo, or pick up from one of the pages below. If you
            followed a link from somewhere and it brought you here, tell us and we will fix
            it.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              data-testid="notfound-home"
              className="inline-flex font-body font-bold text-[15px] px-8 py-[17px] transition-opacity hover:opacity-90"
              style={{ background: ACCENT, color: onAccent(ACCENT) }}
            >
              Back to the studio
            </Link>
            <Link
              to="/contact"
              className="inline-flex font-body font-bold text-[15px] px-8 py-[17px] border border-white/30 text-white transition-colors hover:border-white/70"
            >
              Report a broken link
            </Link>
          </div>
          <AccentStripe className="mt-10 w-[220px] h-1" />
        </div>
      </header>

      <section className="bg-ink-deep flex-1 px-6 lg:px-24 py-14 lg:py-16">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-body text-[11px] font-semibold tracking-[0.2em] uppercase text-mist-500 mb-6">
            Where you may have been headed
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.09] border border-white/[0.12]">
            {DESTINATIONS.map(({ to, name, blurb }) => (
              <Link
                key={to}
                to={to}
                data-testid="notfound-destination"
                className="group bg-ink-panel px-7 py-7 transition-colors hover:bg-ink-base focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
              >
                <div className="font-display uppercase text-white text-[24px] leading-none mb-2.5 group-hover:opacity-90">
                  {name}
                </div>
                <div className="font-body text-[14.5px] leading-[1.55] text-mist-400">{blurb}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
