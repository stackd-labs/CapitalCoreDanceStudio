import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { SCHEDULE } from '../lib/schedule'
import { CLASS_PRICES, classLengthMinutes } from '../lib/tuition'
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
  'Returning students receive a $5–$10 discount per semester',
  'Multi-class discount for dancers enrolled in more than one class',
  'Multi-student discounts for families with multiple dancers',
  'Sibling discounts and family fee caps on registration fees',
]

// The mockup's "fees at a glance" list. Label on the left, the studio's figure on the
// right — every value below appears verbatim elsewhere on this page.
const FEES = [
  { label: 'Registration — per dancer, per semester', value: '$65' },
  { label: 'Registration — full year (both semesters)', value: '$120' },
  { label: 'Returning student discount', value: '$5 – $10 per semester' },
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

      {/* Separately priced programs note. "Specialty Classes" was removed here on
          2026-08-03: the Class Levels page uses that term for Musical Theatre and
          Pom Cheer, which are regular schedule classes on standard tuition. */}
      <section className="px-6 lg:px-24 pb-16 lg:pb-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="border border-dashed border-white/20 px-6 py-5 text-center">
            <p className="font-body text-mist-400 text-sm">
              Dance Teams, Events, Clinics, and Workshops have their own pricing — view details on
              their individual event pages.
            </p>
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
