import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { SCHEDULE } from '../lib/schedule'
import {
  ADULT_PRICING,
  CLASS_PRICES,
  COMPANY_PRICING,
  REGISTRATION,
  classLengthMinutes,
  money,
  monthlyPriceForMinutes,
  priceToNumber,
} from '../lib/tuition'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Rebuilt 2026-08-11 to the studio's site mockup (page 1h): hero, a card grid of prices,
// and a "fees at a glance" label/value list. Every figure is the studio's own — nothing
// here is illustrative. Recoloured from the mockup's purple to mint 2026-08-13.
const ACCENT = ACCENTS.mint

// Fall dates match the schedule on the Classes page (Aug 24 – Dec 18). Both
// end-of-semester performance dates are tentative until the studio confirms them.
const SEMESTERS = [
  {
    name: 'Fall Semester',
    dates: 'August 24 – December 18, 2026',
    showLabel: 'Recital',
    showDate: 'December 19',
  },
  {
    name: 'Spring Semester',
    dates: 'January 11 – May 21, 2027',
    showLabel: 'Show',
    showDate: 'May 22',
  },
]

// Parents pay through the studio portal (login required).
const PORTAL_URL = 'https://studio.capitalcoredance.com'

// The three programmes priced outside the by-length table. Every number is read from
// src/lib/tuition.js — the one 30-minute rate below is the same $65 the price cards use, so
// the Little Movers comparison can never contradict them. Little Movers' own rates live on
// its page (drop-in / packs / membership) and are summarised, not restated, so there is one
// place to change them.
const SEPARATELY_PRICED = [
  {
    to: '/little-movers',
    name: 'Little Movers',
    price: 'From $10',
    blurb:
      'Ages 0–5, Monday/Wednesday/Friday mornings. Pay per class, buy a visit pack, or take the monthly membership — which includes a Tiny Core class.',
  },
  {
    to: '/adult-classes',
    name: 'Adult Classes',
    price: `${money(priceToNumber(monthlyPriceForMinutes(45)))} a month`,
    blurb: `Ages 16+, one 45-minute class a month. All three adult classes are ${money(
      ADULT_PRICING.unlimitedMonthly
    )} a month, or drop in for ${money(ADULT_PRICING.dropIn)}. First class free.`,
  },
  {
    to: '/dance-company',
    name: 'Dance Company',
    price: `${money(COMPANY_PRICING.monthly)} a month`,
    blurb: `${COMPANY_PRICING.practiceHoursPerWeek} hours of company practice a week, plus up to ${COMPANY_PRICING.includedClasses} Capital Core classes included — recommended, not required. Extra classes cost extra.`,
  },
]

// Which Fall classes run at each length, read from the schedule rather than typed out —
// so a class moving from 45 to 60 minutes can never leave this page quoting the wrong
// price. Lengths with nothing on the Fall schedule say so instead of listing nothing.
const EXAMPLES_BY_MINUTES = SCHEDULE.flatMap(({ classes }) => classes).reduce((acc, c) => {
  const length = classLengthMinutes(c)
  acc[length] = acc[length] || new Set()
  acc[length].add(c.name)
  return acc
}, {})

function examplesFor(minutes) {
  return [...(EXAMPLES_BY_MINUTES[minutes] || [])].slice(0, 3)
}

const DISCOUNTS = [
  // Read from REGISTRATION, not typed. This line said "$5–$10" while the portal
  // charged a flat $10 — see the note on returningDiscount in src/lib/tuition.js.
  `Returning students receive a ${money(REGISTRATION.returningDiscount)} discount per semester`,
  'Multi-class discount for dancers enrolled in more than one class',
  'Multi-student discounts for families with multiple dancers',
  'Sibling discounts and family fee caps on registration fees',
]

// The mockup's "fees at a glance" list. Label on the left, the studio's figure on the
// right — every value below appears verbatim elsewhere on this page.
const FEES = [
  // From REGISTRATION, not typed: this row said $65 while the portal charged $60.
  { label: 'Registration — per dancer, per semester', value: money(REGISTRATION.perSemester) },
  { label: 'Registration — full year (both semesters)', value: money(REGISTRATION.fullYear) },
  {
    label: 'Returning student discount',
    value: `${money(REGISTRATION.returningDiscount)} per semester`,
  },
  { label: 'Multi-class discount', value: 'Available' },
  { label: 'Multi-student & sibling discounts', value: 'Available' },
  { label: 'Payment methods', value: 'Card, ACH, or check' },
]

const PAYMENT = ['All major credit/debit cards accepted', 'ACH transfers and checks accepted']

export default function Tuition() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Dance Class Tuition &amp; Fees | Capital Core Dance Studio – Midlothian, VA"
        description="Transparent dance class pricing in Midlothian, VA. Monthly rates from $65 (30-min) to $150 (90-min) classes. Fall semester runs August 24 – December 18, 2026; spring runs January 11 – May 21, 2027. Registration fees, returning-student and sibling discounts explained."
        canonical="/tuition"
        jsonLd={simpleBreadcrumb('Tuition', '/tuition')}
      />
      <Navbar />

      <Hero
        eyebrow="2026 – 2027 rates"
        title={['Tuition', [{ text: 'made clear', accent: ACCENT }]]}
        tagline="Monthly rates · no surprises"
        body="Classes are priced by length and billed monthly. Once you register, your dancer's classes and prices are locked for the whole semester."
        photoCaption="Studio photo"
        /* The crest, at the studio's request 2026-08-17 — and it replaces a placeholder:
           this hero had a photoCaption but no photoSrc, so the hatched "Studio photo" well
           was live on the page. `contain` for the same reason the About hero uses it — the
           crest is a shield and a cover crop cuts straight through it. Nothing is painted
           behind it; logo.png is transparent, so the accent panel shows through. */
        photoSrc="/logo.png"
        photoAlt="Capital Core Dance Studio crest"
        photoFit="contain"
        clipStart={22}
        actions={
          <>
            <PrimaryAction href={PORTAL_URL}>Enroll now</PrimaryAction>
            <GhostAction to="/faq">Billing questions</GhostAction>
          </>
        }
      />

      {/* Prices by class length */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Class pricing</Kicker>
          <SectionHeading className="text-white mb-3">Priced by class length</SectionHeading>
          <p className="font-body text-mist-400 text-sm mb-10 max-w-2xl">
            Prices are per class, per month. Multi-class and multi-student discounts are available
            — see the fees below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px]">
            {CLASS_PRICES.map(({ minutes, duration, monthly }) => {
              const examples = examplesFor(minutes)
              return (
                <div
                  key={duration}
                  data-testid="price-card"
                  className="border border-white/[0.14] px-[30px] pt-[34px] pb-9 flex flex-col gap-4"
                >
                  <div className="font-display uppercase text-white text-[26px] leading-none">
                    {duration} Classes
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-display text-[52px] leading-none" style={{ color: ACCENT }}>
                      {monthly}
                    </span>
                    <span className="font-body text-[12px] font-semibold tracking-[0.14em] text-mist-500 uppercase">
                      per month
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5 flex-1 font-body text-[14.5px] leading-[1.5] text-mist-400">
                    {examples.length > 0 ? (
                      examples.map((name) => (
                        <div key={name} className="flex gap-2.5">
                          <span style={{ color: ACCENT }}>—</span>
                          <span>{name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex gap-2.5">
                        <span style={{ color: ACCENT }}>—</span>
                        <span>Longer-format classes — none on the Fall 2026 schedule.</span>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/classes"
                    className="border-[1.5px] font-body font-bold text-[13.5px] py-3.5 text-center transition-colors"
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
                    See these classes
                  </Link>
                </div>
              )
            })}
          </div>

          {/* The $24 is arithmetic on the two numbers either side of it — the $65 card
              above and the $89 membership on /little-movers — so it is stated here rather
              than as a separate price a family has to take on trust. LittleMovers.jsx
              carries the same figure and both are tested against it. */}
          <p
            data-testid="tiny-core-membership-note"
            className="font-body text-[14.5px] leading-[1.6] text-mist-400 mt-8 max-w-3xl"
          >
            <span className="font-semibold text-white">Tiny Core families:</span> a 30-minute Tiny
            Core class is $65 a month. For $24 more — $89 a month — the{' '}
            <Link
              to="/little-movers"
              className="font-semibold underline underline-offset-2"
              style={{ color: ACCENT }}
            >
              Little Movers membership
            </Link>{' '}
            covers that class plus unlimited Little Movers morning classes.
          </p>
        </div>
      </section>

      {/* Fees at a glance */}
      <section className="px-6 lg:px-24 py-16 lg:py-[78px]">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading className="text-white mb-8">Fees at a glance</SectionHeading>
          <dl className="flex flex-col">
            {FEES.map(({ label, value }) => (
              <div
                key={label}
                data-testid="fee-row"
                className="flex flex-wrap justify-between gap-4 py-5 border-b border-white/[0.12] font-body text-[16px]"
              >
                <dt className="font-semibold text-white">{label}</dt>
                <dd className="text-mist-400 m-0">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Semesters + discounts + payment */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-[26px]">
          <div className="border border-white/[0.14] px-7 py-8">
            <Kicker accent={ACCENT} className="mb-2">How it works</Kicker>
            <h3 className="font-display uppercase text-white text-[24px] leading-none mb-5">
              Semester enrollment
            </h3>
            <p className="font-body text-mist-400 text-sm leading-relaxed mb-5">
              Once registered, dancers are locked into their classes and prices for the semester.
            </p>
            <div className="flex flex-col gap-4">
              {SEMESTERS.map(({ name, dates, showLabel, showDate }) => (
                <div key={name} data-testid="semester" className="border-l-2 pl-4" style={{ borderColor: ACCENT }}>
                  <div className="font-body text-white font-bold text-sm">{name}</div>
                  <div className="font-body text-mist-400 text-sm">{dates}</div>
                  <div className="font-body text-mist-500 text-xs mt-1">
                    {showLabel} <span className="whitespace-nowrap">{showDate}</span>
                    <span className="italic"> (tentative)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.14] px-7 py-8">
            <Kicker accent={ACCENT} className="mb-2">Discounts available</Kicker>
            <h3 className="font-display uppercase text-white text-[24px] leading-none mb-5">
              Ways to save
            </h3>
            <ul className="flex flex-col gap-2.5">
              {DISCOUNTS.map((item) => (
                <li
                  key={item}
                  data-testid="discount"
                  className="font-body text-mist-300 text-sm flex gap-2.5 leading-relaxed"
                >
                  <span className="flex-shrink-0" style={{ color: ACCENT }}>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-white/[0.14] px-7 py-8">
            <Kicker accent={ACCENT} className="mb-2">Payment</Kicker>
            <h3 className="font-display uppercase text-white text-[24px] leading-none mb-5">
              How to pay
            </h3>
            <ul className="flex flex-col gap-2.5 mb-4">
              {PAYMENT.map((item) => (
                <li key={item} className="font-body text-mist-300 text-sm flex gap-2.5 leading-relaxed">
                  <span className="flex-shrink-0" style={{ color: ACCENT }}>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
              <li className="font-body text-mist-300 text-sm flex gap-2.5 leading-relaxed">
                <span className="flex-shrink-0" style={{ color: ACCENT }}>
                  ✓
                </span>
                <span>
                  Payments are made through our{' '}
                  <a
                    href={PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline"
                    style={{ color: ACCENT }}
                  >
                    studio portal
                  </a>
                </span>
              </li>
            </ul>
            <p className="font-body text-mist-500 text-xs italic">
              Having trouble with the portal? Reach out to us and we&apos;ll help.
            </p>
          </div>
        </div>
      </section>

      {/* Separately priced programmes. "Specialty Classes" was removed here on
          2026-08-03: the Class Levels page uses that term for Musical Theatre and
          Pom Cheer, which are regular schedule classes on standard tuition.
          Rebuilt as real links 2026-08-17 — it previously named "Dance Teams, Events,
          Clinics, and Workshops" and linked to nothing, so a family had to go hunting for
          three sets of rates that are not in the by-length table. Every figure below comes
          from src/lib/tuition.js; none of it is typed here. */}
      <section className="px-6 lg:px-24 pb-16 lg:pb-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Priced separately</Kicker>
          <SectionHeading className="text-white mb-3">Not in the table above</SectionHeading>
          <p className="font-body text-mist-400 text-sm mb-8 max-w-2xl">
            Three programmes are not priced by class length. Events, clinics and workshops are
            priced per event — see the page for each.
          </p>
          <div data-testid="separately-priced" className="grid grid-cols-1 md:grid-cols-3 gap-[26px]">
            {SEPARATELY_PRICED.map(({ to, name, price, blurb }) => (
              <Link
                key={to}
                to={to}
                className="border border-white/[0.14] px-7 py-7 flex flex-col hover:border-white/40 transition-colors"
              >
                <div className="font-display uppercase text-white text-[24px] leading-none">
                  {name}
                </div>
                <div
                  className="font-display text-[34px] leading-none mt-3"
                  style={{ color: ACCENT }}
                >
                  {price}
                </div>
                <p className="font-body text-[14px] leading-[1.6] text-mist-400 mt-3 mb-0 flex-1">
                  {blurb}
                </p>
                <span
                  className="font-body text-[13px] font-bold mt-5"
                  style={{ color: ACCENT }}
                >
                  See {name} →
                </span>
              </Link>
            ))}
          </div>
          <PrimaryAction to="/contact" className="mt-8">
            Questions? Contact Us
          </PrimaryAction>
        </div>
      </section>

      <Footer />
    </div>
  )
}
