import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'
import { monthlyPriceForMinutes, priceToNumber } from '../lib/tuition'

// Rebuilt 2026-08-11 to the studio's site mockup (page 1c, accent teal). The mockup
// carries a hero, a row of age-tier cards and a "what a class looks like" strip; the
// studio's own content — six classes, the benefits list, the weekday-morning grid and
// the three pricing options — is kept and restyled onto the navy field.
const ACCENT = ACCENTS.teal

// Little Movers has its own portal form, live as of 2026-08-28 — NOT the /register/classes
// one the Classes and Class Levels pages use, and not /register/adult-classes either. This
// form books a single Little Movers class and carries the drop-in, passport and membership
// options priced below.
//
// The portal moved the form to the /book path on 2026-09-02; the bare
// /register/little-movers URL this used to point at is no longer the booking page.
//
// This is the PERSISTENT programme call to action and it has no end date.
const PORTAL_LITTLE_MOVERS_URL = 'https://studio.capitalcoredance.com/register/little-movers/book'

// The six Little Movers classes. Single source of truth for name, age range, and
// description — the weekly schedule below references these by name so the two can
// never disagree. Descriptions are the studio's own copy.
const CLASSES = [
  {
    name: 'Baby & Me',
    // Widened from 0–12 months 2026-08-17 so the morning hands off at 18 months: this
    // class ends where every class after it begins.
    ages: '0–18 months',
    description: 'Gentle movement, music, sensory exploration, and bonding.',
  },
  {
    name: 'Parent & Me Dance',
    ages: '18 months–3 years',
    description: 'Interactive movement classes designed for toddlers and caregivers.',
  },
  {
    name: "Moovin' & Groovin'",
    // 18 months–5 years, as for every class in the second and third slots — widened from
    // 2–5 on 2026-08-17 to meet Baby & Me at 18 months with no gap.
    ages: '18 months–5 years',
    // The partnership is credited here rather than in the schedule table, which the
    // studio asked to keep to class name and age range only.
    partner: 'Our signature class, in partnership with Ms. Ryan',
    description: 'Signature movement and music experience featuring creative dance and active learning.',
  },
  {
    name: 'Tiny Tumblers',
    ages: '18 months–5 years',
    description: 'Beginner tumbling, balance, flexibility, and coordination.',
  },
  {
    name: 'Sensory Steps',
    ages: '18 months–5 years',
    description: 'Movement-based sensory exploration with props, music, and imaginative play.',
  },
  {
    name: 'Little Movers Free Play Lab',
    ages: '18 months–5 years',
    description: 'Supervised obstacle courses, climbing, balance stations, and active play.',
  },
]

const BENEFITS = [
  'Confidence',
  'Coordination',
  'Balance',
  'Creativity',
  'Social skills',
  'Gross motor development',
  'Rhythm and musicality',
  'Independence',
]

// One class a week: Wednesday mornings, 10:00 to 11:00 AM. Cut from Monday / Wednesday /
// Friday (three 45-minute slots at 9:30, 10:30 and 11:30) on 2026-10-08, at the studio's
// request. The old grid and its staffing notes are in git history.
//
// ▶ The portal's booking wizard (LM_SCHEDULE in dancestudioportal) still generates the old
// Wednesday slots; the same change has to be made there.
const TIME_SLOTS = ['10:00 – 11:00 AM']
const DAYS = ['Wednesday']

// SCHEDULE[slotIndex][day]. The one hour covers every age, so the cell names the program
// and carries its own age range rather than looking one up from CLASSES.
const SCHEDULE = [
  { Wednesday: { name: 'Little Movers', ages: '0–5 years' } },
]

const DROP_IN_PRICE = 10

// The membership's headline, and the two figures derived from it. A Tiny Core class is 30
// minutes, so tuition.js prices it; the top-up is what the unlimited Little Movers half
// costs once that class is accounted for. Derived rather than typed because /tuition and
// /class-levels publish the same top-up and are tested against it — three pages naming
// one number by hand is how one of them goes stale.
const MEMBERSHIP_MONTHLY = 89
const TINY_CORE_MONTHLY = monthlyPriceForMinutes(30)
const MEMBERSHIP_TOP_UP = `$${MEMBERSHIP_MONTHLY - priceToNumber(TINY_CORE_MONTHLY)}`

// Three ways to join, framed by how often a family expects to come rather than by
// price. `question` is the headline a parent recognises themselves in. The per-card
// border colour was dropped in the 2026-08-11 redesign — every card now sits on the
// page's single teal accent.
//
// 🔴 NO DISCOUNTS ARE ADVERTISED (studio's call, 2026-10-08, "for now"): the sibling rates,
// the MOOVE26 code and the membership's 10% off parties and retail were all taken off this
// page. The portal's little-movers-pricing.ts and promos.ts still apply them at checkout,
// so they are on the portal punch list for the same change.
const PRICING = [
  {
    question: 'Just want to try it?',
    label: 'Drop-In',
    headline: `$${DROP_IN_PRICE}`,
    unit: 'per class',
    blurb: 'Pay as you go. Come to any single class on the booking calendar, with nothing to sign up for.',
    lines: ['Good for any Little Movers class', 'No membership or commitment'],
  },
  {
    question: 'Come when you can',
    label: 'Little Movers Passport',
    headline: '5 visits — $45',
    unit: 'or 10 visits — $85',
    blurb: 'A class pack that never locks you into a day or time — use the visits whenever your week allows.',
    lines: ['Works for any Little Movers class', '10-visit pack is $8.50 a class'],
  },
  {
    question: "We're here every week",
    label: 'Little Movers Membership',
    headline: `$${MEMBERSHIP_MONTHLY}`,
    unit: 'per month',
    badge: 'Best value',
    // The included Tiny Core class is TINY_CORE_MONTHLY on its own, which makes the
    // unlimited Little Movers class the difference on top. Both figures are DERIVED from
    // src/lib/tuition.js; Tuition.jsx and ClassLevels.jsx state the same top-up and are
    // tested against it, so this page must not hardcode its own copy.
    blurb: `Attend as many Little Movers classes as you would like, plus one Tiny Core class — which is ${TINY_CORE_MONTHLY} a month on its own, so the unlimited Little Movers class is the ${MEMBERSHIP_TOP_UP} on top.`,
    lines: [
      'Unlimited Little Movers classes',
      'One Tiny Core class included (ages 2–5, your choice of day)',
      `Already in a Tiny Core class? Just ${MEMBERSHIP_TOP_UP} more a month`,
      'Priority registration for camps',
      'One free guest pass each month',
      'Exclusive Little Movers events',
    ],
  },
]

const LITTLE_MOVERS_JSON_LD = [simpleBreadcrumb('Little Movers', '/little-movers')]

// PLACEHOLDER — the four steps come from the mockup, not the studio. They read true for
// a toddler class but need confirming before launch.
const CLASS_SHAPE = [
  { n: '01', name: 'Arrive & warm up', blurb: 'Shoes off, circle up, and a song to settle everyone in.' },
  { n: '02', name: 'Skill of the week', blurb: 'One idea at a time — a shape, a step, a way to balance.' },
  { n: '03', name: 'Dance & play', blurb: 'Props, music and free movement across the floor.' },
  { n: '04', name: 'Stickers & goodbye', blurb: 'A calm finish, a sticker, and something to show you.' },
]

// One schedule cell: class name and age range.
function ScheduleCell({ entry }) {
  if (!entry) return null
  return (
    <div data-testid="schedule-entry" className="text-left">
      <div className="font-body text-white font-bold text-sm leading-snug">{entry.name}</div>
      <div className="font-body text-mist-500 text-xs mt-0.5">{entry.ages}</div>
    </div>
  )
}

export default function LittleMovers() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Little Movers | Toddler &amp; Preschool Movement Classes in Midlothian, VA — Capital Core Dance"
        description="Little Movers at Capital Core Dance in Midlothian, VA. A movement-based enrichment program for infants, toddlers, and preschoolers combining dance, music, sensory play, tumbling, and active exploration. Wednesday mornings from 10 to 11 AM, drop-in $10 a class. Booking is open on our studio portal."
        canonical="/little-movers"
        jsonLd={LITTLE_MOVERS_JSON_LD}
      />
      <Navbar />

      <Hero
        eyebrow="Ages 0 – 5 years"
        title={['Little', [{ text: 'Movers', accent: ACCENT }]]}
        tagline="Movement. Play. Learn. Grow."
        body="A first dance experience for infants, toddlers and preschoolers — a Wednesday morning class, 10 to 11 AM, built on music, sensory play and active exploration."
        photoCaption="Toddlers in class"
        photoSrc="/little-movers-hero.jpg"
        photoAlt="Five toddlers in pastel leotards and tutus standing at the barre in a Little Movers class"
        clipStart={20}
        titleClassName="text-[42px] sm:text-[56px] lg:text-[76px] leading-[0.92]"
        actions={
          <>
            <PrimaryAction href={PORTAL_LITTLE_MOVERS_URL}>Book a class →</PrimaryAction>
            <GhostAction href="#schedule">See class times</GhostAction>
          </>
        }
      />

      {/* The Little Movers Open House ran here — one gold notice band under the hero, on
          Wednesday 2 September 2026. Removed 2026-09-02 once the morning was over, along
          with src/lib/openHouse.js and the matching strip on Home. Recoverable from git
          history if the studio runs another one. */}

      {/* The classes — the mockup's tier cards, filled with the studio's own classes. The
          heading deliberately carries no count: it said "Six ways to move" while only five
          were on the grid, and a hardcoded number goes stale every time a class moves. */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>The classes</Kicker>
          <SectionHeading className="text-white mb-10">Ways to move</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px]">
            {CLASSES.map(({ name, ages, description, partner }) => (
              <div
                key={name}
                data-testid="little-movers-class"
                className="border border-white/[0.12] px-7 pt-8 pb-[34px]"
              >
                <div className="font-display text-[38px] leading-none" style={{ color: ACCENT }}>
                  {ages}
                </div>
                <div className="flex items-start justify-between gap-3 mt-3 mb-3">
                  <div
                    data-testid="class-name"
                    className="font-display uppercase text-white text-[26px] leading-none"
                  >
                    {name}
                  </div>
                </div>
                <p className="font-body text-[14.5px] leading-[1.6] text-mist-400 mb-4 m-0">
                  {description}
                </p>
                {partner && (
                  <div
                    data-testid="class-partner"
                    className="font-body text-[12px] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: ACCENT }}
                  >
                    {partner}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What a class looks like */}
      <section className="px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading className="text-white mb-10">What a class looks like</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLASS_SHAPE.map(({ n, name, blurb }) => (
              <div
                key={n}
                data-testid="class-step"
                className="border-t-[3px] pt-[18px]"
                style={{ borderColor: ACCENT }}
              >
                <div
                  className="font-body text-[11px] font-semibold tracking-[0.2em] uppercase mb-2.5"
                  style={{ color: ACCENT }}
                >
                  {n}
                </div>
                <div className="font-body font-bold text-[18px] leading-[1.3] text-white mb-2">
                  {name}
                </div>
                <div className="font-body text-[14px] leading-[1.6] text-mist-400">{blurb}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Why it matters</Kicker>
          <SectionHeading className="text-white mb-3">
            Little Movers helps children develop
          </SectionHeading>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 mt-8">
            {BENEFITS.map((item) => (
              <li
                key={item}
                data-testid="benefit"
                className="font-body text-mist-300 text-sm flex gap-2.5"
              >
                <span className="flex-shrink-0" style={{ color: ACCENT }}>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Weekly schedule. One class a week since 2026-10-08. */}
      <section id="schedule" className="px-6 lg:px-24 py-16 lg:py-20 scroll-mt-24">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Weekly schedule</Kicker>
          <SectionHeading className="text-white mb-3">
            Wednesday mornings, 10 to 11 AM
          </SectionHeading>
          <p className="font-body text-mist-400 text-sm mb-10 max-w-2xl">
            Little Movers meets once a week, on Wednesday mornings from 10:00 to 11:00 AM. No
            Little Movers class is drop-off: a parent or caregiver is welcome to stay in the
            class or wait in the studio. Booking is open on our studio portal, which carries the
            current week&apos;s class and what is still available.
          </p>

          {/* Table at md and up */}
          <div className="hidden md:block overflow-x-auto">
            <table data-testid="schedule-table" className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left font-body text-mist-500 text-[10px] font-bold uppercase tracking-wider pb-3 pr-4 w-32">
                    Time
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      data-testid="schedule-day-header"
                      data-day={day}
                      className="text-left font-body text-white text-xs font-bold uppercase tracking-wider pb-3 px-3"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((row, i) => (
                  <tr key={TIME_SLOTS[i]} className="border-t border-white/10">
                    <th
                      scope="row"
                      className="text-left font-body text-sm font-semibold py-4 pr-4 whitespace-nowrap"
                      style={{ color: ACCENT }}
                    >
                      {TIME_SLOTS[i]}
                    </th>
                    {DAYS.map((day) => (
                      <td key={day} className="align-top py-4 px-3">
                        <ScheduleCell entry={row[day]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Day-by-day below md */}
          <div data-testid="schedule-list" className="md:hidden flex flex-col gap-8">
            {DAYS.map((day) => (
              <div key={day} data-testid="schedule-day" data-day={day}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="font-display uppercase text-white text-xl">{day}</div>
                  <div className="flex-1 h-px bg-white/15" />
                </div>
                <div className="flex flex-col gap-3">
                  {SCHEDULE.map((row, i) =>
                    row[day] ? (
                      <div
                        key={`${day}-${i}`}
                        className="border border-white/[0.12] bg-ink-panel px-4 py-3 flex items-start justify-between gap-4"
                      >
                        <ScheduleCell entry={row[day]} />
                        <div
                          className="font-body text-sm font-medium flex-shrink-0 text-right"
                          style={{ color: ACCENT }}
                        >
                          {TIME_SLOTS[i]}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Pricing</Kicker>
          <SectionHeading className="text-white mb-3">
            Flexible options for every family
          </SectionHeading>
          <p className="font-body text-mist-400 text-sm mb-10 max-w-2xl">
            Three ways to join, depending on how often you plan to come. Every option works for any
            Little Movers class you can book, and all three can be chosen when you book on the
            studio portal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[26px]">
            {PRICING.map(({ question, label, headline, unit, badge, blurb, lines }) => (
              <div
                key={label}
                data-testid="pricing-card"
                className="border border-white/[0.12] bg-ink-base px-7 py-7 flex flex-col"
              >
                <p className="font-body text-mist-300 text-sm font-semibold">{question}</p>
                <div className="flex items-center justify-between gap-3 mt-1">
                  <p
                    className="font-body text-[10px] font-bold tracking-[0.3em] uppercase"
                    style={{ color: ACCENT }}
                  >
                    {label}
                  </p>
                  {badge && (
                    <span
                      data-testid="pricing-badge"
                      className="font-body text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-1"
                      style={{ background: ACCENT, color: onAccent(ACCENT) }}
                    >
                      {badge}
                    </span>
                  )}
                </div>
                <p className="font-display uppercase text-white text-[32px] leading-none mt-3">
                  {headline}
                </p>
                <p className="font-body text-mist-500 text-xs uppercase tracking-widest mt-1.5">
                  {unit}
                </p>
                <p className="font-body text-mist-400 text-sm mt-4 leading-relaxed">{blurb}</p>
                <ul className="flex flex-col gap-2 mt-5">
                  {lines.map((line) => (
                    <li
                      key={line}
                      data-testid="pricing-line"
                      className="font-body text-mist-300 text-sm flex gap-2.5"
                    >
                      <span className="flex-shrink-0" style={{ color: ACCENT }}>
                        ✓
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="font-body text-mist-500 text-xs mt-8 text-center">
            Little Movers pricing is separate from studio class tuition. See{' '}
            <Link to="/tuition" className="font-semibold hover:underline" style={{ color: ACCENT }}>
              Tuition
            </Link>{' '}
            for our regular class rates.
          </p>
        </div>
      </section>

      <CtaBand
        accent={ACCENT}
        headline="Ready to Get Moving?"
        body="Join the Little Movers family and discover a fun, flexible way for your child to learn, explore, and grow through movement. Book a single class, a visit passport, or a monthly membership on our studio portal."
        action={<InverseAction href={PORTAL_LITTLE_MOVERS_URL}>Book a class →</InverseAction>}
      />

      <Footer />
    </div>
  )
}
