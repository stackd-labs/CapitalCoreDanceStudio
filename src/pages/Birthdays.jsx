import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import {
  Kicker,
  SectionHeading,
  PrimaryAction,
  GhostAction,
  CtaBand,
  InverseAction,
} from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Rebuilt 2026-08-11 to the studio's site mockup (page 1d, accent pink): hero, a
// three-card package grid, and a numbered "how it works" row. The studio's own content
// — what's included, the nine themes, party details, booking terms and both printable
// flyers — is kept and restyled onto the navy field.
const ACCENT = ACCENTS.pink

// Party requests are handled on the studio portal as of 2026-08-03. The old on-site
// form (/birthday-booking → /birthday-payment → /birthday-thankyou) is retired; see
// the commented-out block in App.jsx.
const PORTAL_PARTY_REQUEST_URL = 'https://studio.capitalcoredance.com/party-request'

const INCLUDED = [
  'Private studio space',
  'Party host (dance instructor)',
  'Dance party & movement games',
  'Themed activity or craft',
  'Music & sound system',
  'Tables & chairs',
  'Set-up & clean-up',
]

const PARTY_DETAILS = [
  '90-minute private party',
  'Up to 10 children included',
  'Ages 2–17',
  'Additional children may be added',
  'Available weekends (limited weekday availability)',
]

const BOOKING = [
  '$50 non-refundable deposit required',
  'Remaining balance due on party day',
  'Limited availability — advance booking encouraged!',
]

const THEMES = [
  'Princess & Fairytale Dance',
  'Hip Hop Dance Party',
  'Pop Star Dance Party',
  'Glow Dance Party',
  'Unicorn & Rainbow Party',
  'Preschool Wiggle & Giggle',
  'Tea Party & Royal Celebration',
  'Superhero Movement Party',
  'Dance & Craft Party',
]

// The mockup's three package cards. The studio sells one party plus two upgrades rather
// than three tiers, so the grid carries that truthfully instead of inventing tiers —
// prices are the studio's own, from birthday-flyer-pricing.png.
const PACKAGES = [
  {
    name: 'Standard Party',
    price: '$199',
    unit: '90 minutes · up to 10 children',
    items: INCLUDED,
  },
  {
    name: 'Extra Guests',
    price: '$15',
    unit: 'per additional child',
    items: [
      'Add guests beyond the first 10',
      'Everyone joins every party activity',
      'Adults are not counted',
    ],
  },
  {
    name: 'Extended Time',
    price: '$30',
    unit: 'per extra 15 minutes',
    items: [
      'More dancing, games and cake time',
      'Added when you request your date',
      'Subject to studio availability',
    ],
  },
]

// Derived from the studio's own booking copy rather than invented: request on the
// portal, confirmation within 1–2 business days, balance on the day.
const HOW_IT_WORKS = [
  {
    n: '01',
    name: 'Request a date',
    blurb: 'Send your preferred date and theme through the studio portal. Takes a couple of minutes.',
  },
  {
    n: '02',
    name: "We'll confirm",
    blurb:
      "We check the studio calendar and confirm your date and details within 1–2 business days. A $50 deposit holds it.",
  },
  {
    n: '03',
    name: 'Show up and celebrate',
    blurb:
      'We run the class, the games and the music, and handle set-up and clean-up. You bring the cake.',
  },
]

const FLYERS = [
  {
    src: '/birthday-flyer-overview.png',
    alt: 'Birthday Parties at Capital Core Dance Studio',
    filename: 'birthday-parties-flyer.png',
  },
  {
    src: '/birthday-flyer-pricing.png',
    alt: 'Birthday Party Pricing at Capital Core Dance Studio',
    filename: 'birthday-party-pricing.png',
  },
]

const BIRTHDAYS_JSON_LD = [simpleBreadcrumb('Birthdays', '/birthdays')]

function CheckList({ items, testId }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li
          key={item}
          data-testid={testId}
          className="font-body text-mist-300 text-sm flex gap-2.5 leading-relaxed"
        >
          <span className="flex-shrink-0" style={{ color: ACCENT }}>
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function Birthdays() {
  const [activeFlyer, setActiveFlyer] = useState(null)

  useEffect(() => {
    if (!activeFlyer) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setActiveFlyer(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeFlyer])

  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Kids Dance Birthday Parties in Midlothian, VA | Capital Core Dance Studio"
        description="Throw a stress-free, instructor-led dance birthday party at Capital Core Dance Studio in Midlothian, VA. Packages start at $199, include up to 10 kids, custom themes available. Serving Midlothian, Chesterfield County, and Richmond."
        canonical="/birthdays"
        jsonLd={BIRTHDAYS_JSON_LD}
      />
      <Navbar />

      <Hero
        eyebrow="90 minutes · up to 10 children"
        title={['Dance', [{ text: 'parties', accent: ACCENT }]]}
        body="We run the class, the games and the music — you bring the cake. Ninety minutes of private studio time, hosted by one of our instructors."
        photoSrc="/birthday-hero.jpg"
        photoAlt="Children dancing at a birthday party at Capital Core Dance Studio"
        photoCaption="Party photo"
        clipStart={18}
        titleClassName="text-[44px] sm:text-[58px] lg:text-[80px] leading-[0.9]"
        actions={
          <>
            <PrimaryAction href={PORTAL_PARTY_REQUEST_URL}>Request Your Party →</PrimaryAction>
            <GhostAction href="#packages">See packages</GhostAction>
          </>
        }
      />

      {/* Packages */}
      <section id="packages" className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20 scroll-mt-24">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Packages</Kicker>
          <SectionHeading className="text-white mb-3">Starting at $199</SectionHeading>
          <p className="font-body text-mist-400 text-sm mb-10 max-w-2xl">
            One party package with two optional upgrades. Optional extras such as a glow party,
            crafts, and custom themes can be added when you request your date.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[26px]">
            {PACKAGES.map(({ name, price, unit, items }) => (
              <div
                key={name}
                data-testid="package-card"
                className="border border-white/[0.14] px-[30px] pt-[34px] pb-9 flex flex-col gap-4"
              >
                <div className="font-display uppercase text-white text-[28px] leading-none">
                  {name}
                </div>
                <div>
                  <div className="font-display text-[44px] leading-none" style={{ color: ACCENT }}>
                    {price}
                  </div>
                  <div className="font-body text-mist-500 text-xs uppercase tracking-[0.14em] mt-2">
                    {unit}
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 flex-1">
                  {items.map((item) => (
                    <div key={item} className="flex gap-2.5 font-body text-[14.5px] leading-[1.5] text-mist-400">
                      <span style={{ color: ACCENT }}>—</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={PORTAL_PARTY_REQUEST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-[1.5px] font-body font-bold text-[13.5px] py-3.5 text-center transition-colors hover:text-ink-base"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = ACCENT
                    e.currentTarget.style.color = onAccent(ACCENT)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = ACCENT
                  }}
                >
                  Request this package
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 lg:px-24 py-16 lg:py-[78px]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-9">
          {HOW_IT_WORKS.map(({ n, name, blurb }) => (
            <div key={n} data-testid="party-step" className="flex gap-[18px] items-start">
              <div
                className="font-display text-[52px] leading-[0.8] flex-none"
                /* 8c is the .55 alpha the mockup draws these step numerals at. Derived from
                   ACCENT rather than the literal rgba(255,84,168,.55) it used to be: that
                   was a hand-copied duplicate of the pink hex, and it survived the
                   2026-08-28 lightening unchanged, leaving one stale numeral column on an
                   otherwise retuned page. */
                style={{ color: `${ACCENT}8c` }}
              >
                {n}
              </div>
              <div>
                <div className="font-body font-bold text-[18px] leading-[1.3] text-white mb-2">
                  {name}
                </div>
                <div className="font-body text-[14.5px] leading-[1.6] text-mist-400">{blurb}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What's included · Themes · Details */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-[26px]">
          <div className="border border-white/[0.14] px-7 py-8">
            <Kicker accent={ACCENT} className="mb-2">Package</Kicker>
            <h3 className="font-display uppercase text-white text-[24px] leading-none mb-5">
              What&apos;s Included
            </h3>
            <CheckList items={INCLUDED} testId="included-item" />
          </div>

          <div className="border border-white/[0.14] px-7 py-8">
            <Kicker accent={ACCENT} className="mb-2">Choose one</Kicker>
            <h3 className="font-display uppercase text-white text-[24px] leading-none mb-5">
              Exciting Themes
            </h3>
            <ul className="flex flex-col gap-2.5">
              {THEMES.map((theme) => (
                <li
                  key={theme}
                  data-testid="theme"
                  className="font-body text-mist-300 text-sm flex gap-2.5 leading-relaxed"
                >
                  <span className="flex-shrink-0" style={{ color: ACCENT }}>
                    ★
                  </span>
                  {theme}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-white/[0.14] px-7 py-8">
            <Kicker accent={ACCENT} className="mb-2">The basics</Kicker>
            <h3 className="font-display uppercase text-white text-[24px] leading-none mb-5">
              Party Details
            </h3>
            <CheckList items={PARTY_DETAILS} testId="detail-item" />
            <p className="font-body text-mist-500 text-xs mt-5 italic leading-relaxed">
              Studio Family Bonus: Enrolled dancers receive priority booking and a special
              thank-you upgrade.
            </p>
          </div>
        </div>
      </section>

      {/* Booking + flyers */}
      <section className="px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[70px] items-start">
          <div>
            <Kicker accent={ACCENT}>Booking</Kicker>
            <SectionHeading className="text-white mb-6">Booking information</SectionHeading>
            <CheckList items={BOOKING} testId="booking-item" />
            <PrimaryAction href={PORTAL_PARTY_REQUEST_URL} className="mt-8">
              Start Your Party Request →
            </PrimaryAction>
            <p className="font-body text-mist-500 text-xs mt-4 max-w-md leading-relaxed">
              Requests are handled on our studio portal — we&apos;ll confirm your date and details
              within 1–2 business days.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FLYERS.map((flyer) => (
              <button
                key={flyer.src}
                onClick={() => setActiveFlyer(flyer)}
                className="border border-white/20 overflow-hidden group relative text-left cursor-zoom-in"
              >
                <img src={flyer.src} alt={flyer.alt} className="w-full h-auto block" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span
                    className="opacity-0 group-hover:opacity-100 transition-opacity font-body text-xs font-bold px-3 py-1.5"
                    style={{ background: ACCENT, color: onAccent(ACCENT) }}
                  >
                    Click to expand
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        accent={ACCENT}
        headline="Let's throw a party"
        body="Tell us your date and theme and we'll take it from there."
        action={
          <InverseAction href={PORTAL_PARTY_REQUEST_URL}>Request a date →</InverseAction>
        }
      />

      <Footer />

      {/* Flyer lightbox */}
      {activeFlyer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeFlyer.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 overflow-y-auto"
          onClick={() => setActiveFlyer(null)}
        >
          <div
            className="relative bg-ink-panel border border-white/15 shadow-2xl max-w-lg w-full overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={activeFlyer.src} alt={activeFlyer.alt} className="w-full h-auto block" />
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/[0.12]">
              <a
                href={activeFlyer.src}
                download={activeFlyer.filename}
                className="font-body text-sm font-bold px-5 py-2.5 transition-opacity hover:opacity-90"
                style={{ background: ACCENT, color: onAccent(ACCENT) }}
              >
                Download Flyer
              </a>
              <button
                onClick={() => setActiveFlyer(null)}
                className="font-body text-mist-500 text-sm hover:text-white transition-colors"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
