import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Rebuilt 2026-08-11 to the studio's site mockup (page 1c, accent teal). The mockup
// carries a hero, a row of age-tier cards and a "what a class looks like" strip; the
// studio's own content — six classes, the benefits list, the weekday-morning grid and
// the three pricing options — is kept and restyled onto the navy field.
const ACCENT = ACCENTS.teal

// The coming-soon banner alone breaks the page accent, at the studio's request
// (2026-08-13). Gold reads as a notice rather than as more of the page, which is the
// point of the strip — it is a temporary status, not part of the Little Movers identity.
// It goes when registration opens, and takes this constant with it.
const NOTICE_ACCENT = ACCENTS.gold

// Little Movers is not open for registration yet, so every call to action points at
// the contact page rather than the studio portal — the portal has no Little Movers
// classes to select. When registration opens, swap these back to
// https://studio.capitalcoredance.com/register/classes and drop the coming-soon
// banner and badge below.

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

const CLASSES_BY_NAME = CLASSES.reduce((acc, c) => {
  acc[c.name] = c
  return acc
}, {})

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

// Every class runs 45 minutes, in three morning slots. Values are class names that
// index into CLASSES above.
//
// Regapped 2026-08-17 at the studio's request: 45 minutes of class with 15 minutes
// between, first bell 9:30. The flyer's original grid (9:30 / 10:15 / 11:00) ran them back
// to back, which left no changeover time. The third slot is the only one that crosses
// noon, hence its two explicit meridiems — the other two share a single trailing AM.
const TIME_SLOTS = ['9:30 – 10:15 AM', '10:30 – 11:15 AM', '11:30 AM – 12:15 PM']
// Monday / Wednesday / Friday only, as of 2026-08-17. Every day opens the same way —
// Baby & Me then Moovin' & Groovin' — and the last slot is what makes a day worth
// choosing: Tiny Tumblers Monday, Sensory Steps Wednesday, Free Play Lab Friday.
const DAYS = ['Monday', 'Wednesday', 'Friday']

// SCHEDULE[slotIndex][day] — one class per day per slot, 9 in all.
const SCHEDULE = [
  {
    Monday: { name: 'Baby & Me' },
    Wednesday: { name: 'Baby & Me' },
    Friday: { name: 'Baby & Me' },
  },
  {
    Monday: { name: "Moovin' & Groovin'" },
    Wednesday: { name: "Moovin' & Groovin'" },
    Friday: { name: "Moovin' & Groovin'" },
  },
  {
    Monday: { name: 'Tiny Tumblers' },
    Wednesday: { name: 'Sensory Steps' },
    Friday: { name: 'Little Movers Free Play Lab' },
  },
]

// DORMANT — Tuesday and Thursday were taken off the published schedule 2026-08-17 and
// their line-ups are parked here rather than deleted, so the studio can switch the two
// days back on without rebuilding the grid: merge these into DAYS and SCHEDULE above.
// Nothing renders from this; it is a record, and it lints clean because no-unused-vars
// here exempts SCREAMING_CASE names.
//
// NOTE: 'Parent & Me Dance' appeared ONLY on Tuesday and Thursday, so it is currently on
// no published day even though it is still one of the six classes listed on the page.
// Which classes actually appear on the published grid. Derived from SCHEDULE rather than
// listed by hand so it cannot fall out of step: take a class off a day and its card is
// badged "Coming soon" automatically, put it back and the badge goes. This is what keeps
// the classes section honest — six are described, and today only five can be attended.
const SCHEDULED_CLASS_NAMES = new Set(
  SCHEDULE.flatMap((slot) => Object.values(slot).map(({ name }) => name))
)

const DORMANT_DAYS = ['Tuesday', 'Thursday']
const DORMANT_SCHEDULE = [
  { Tuesday: { name: 'Sensory Steps' }, Thursday: { name: 'Little Movers Free Play Lab' } },
  { Tuesday: { name: 'Little Movers Free Play Lab' }, Thursday: { name: 'Parent & Me Dance' } },
  { Tuesday: { name: 'Parent & Me Dance' }, Thursday: { name: 'Sensory Steps' } },
]

// Three ways to join, framed by how often a family expects to come rather than by
// price. `question` is the headline a parent recognises themselves in. The per-card
// border colour was dropped in the 2026-08-11 redesign — every card now sits on the
// page's single teal accent.
const PRICING = [
  {
    question: 'Just want to try it?',
    label: 'Drop-In',
    headline: '$10',
    // The $10 covers one child; each additional child in the same family is $3, added
    // 2026-08-17. Stated in the unit as well as the bullet so the headline price can never
    // be read as a per-family total.
    unit: 'first child, per class',
    blurb: 'Pay as you go. Come to any single class, any morning, with nothing to sign up for.',
    lines: [
      '$3 for each additional child',
      'Good for any Little Movers class',
      'No membership or commitment',
    ],
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
    headline: '$89',
    unit: 'per month',
    badge: 'Best value',
    blurb: 'Attend as many Little Movers classes as you would like. Worth it from about nine classes a month, and a bargain for families coming three mornings a week.',
    // The Tiny Core class and the top-up were added 2026-08-17. The $24 is derived, not a
    // new price: a Tiny Core class is 30 minutes, which src/lib/tuition.js prices at $65 a
    // month, and $89 − $65 = $24. If either number moves, this line has to move with it —
    // Tuition.jsx and ClassLevels.jsx state the same $24 and are tested against it.
    lines: [
      'Unlimited Little Movers classes',
      'One Tiny Core class included (ages 2–5, your choice of day)',
      'Already in a Tiny Core class? Just $24 more a month',
      'Priority registration for camps',
      'One free guest pass each month',
      '10% off birthday parties',
      '10% off retail',
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
  const info = CLASSES_BY_NAME[entry.name]
  return (
    <div data-testid="schedule-entry" className="text-left">
      <div className="font-body text-white font-bold text-sm leading-snug">{entry.name}</div>
      <div className="font-body text-mist-500 text-xs mt-0.5">{info?.ages}</div>
    </div>
  )
}

export default function LittleMovers() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Little Movers | Toddler &amp; Preschool Movement Classes in Midlothian, VA — Capital Core Dance"
        description="Coming soon — Little Movers at Capital Core Dance in Midlothian, VA. A movement-based enrichment program for infants, toddlers, and preschoolers combining dance, music, sensory play, tumbling, and active exploration. Monday, Wednesday and Friday mornings, 45-minute classes, drop-in $10 for the first child and $3 for each additional child. Contact us to be notified when registration opens."
        canonical="/little-movers"
        jsonLd={LITTLE_MOVERS_JSON_LD}
      />
      <Navbar />

      <Hero
        eyebrow="Ages 0 – 5 years"
        title={['Little', [{ text: 'Movers', accent: ACCENT }]]}
        tagline="Movement. Play. Learn. Grow."
        body="A first dance experience for infants, toddlers and preschoolers — 45-minute morning classes on Mondays, Wednesdays and Fridays, built on music, sensory play and active exploration."
        photoCaption="Toddlers in class"
        photoSrc="/little-movers-hero.jpg"
        photoAlt="Five toddlers in pastel leotards and tutus standing at the barre in a Little Movers class"
        clipStart={20}
        titleClassName="text-[42px] sm:text-[56px] lg:text-[76px] leading-[0.92]"
        actions={
          <>
            <PrimaryAction to="/contact">Get notified</PrimaryAction>
            <GhostAction href="#schedule">See class times</GhostAction>
          </>
        }
      />

      {/* Coming-soon notice. Registration is not open, so every action points at contact
          rather than the studio portal — the portal has no Little Movers classes yet. */}
      <section
        data-testid="coming-soon-banner"
        className="px-6 lg:px-24 py-5"
        style={{ background: NOTICE_ACCENT }}
      >
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left" style={{ color: onAccent(NOTICE_ACCENT) }}>
            <p className="font-body font-bold text-lg leading-snug">
              Coming soon — a brand new program for our littlest movers.
            </p>
            <p className="font-body text-sm opacity-80 mt-0.5">
              Registration isn&apos;t open yet. Get in touch and we&apos;ll let you know the moment it is.
            </p>
          </div>
          <Link
            to="/contact"
            className="flex-shrink-0 bg-ink-base text-white font-body text-sm font-bold px-6 py-3 whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            Contact Us →
          </Link>
        </div>
      </section>

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
                  {/* Gold, matching the page's coming-soon banner rather than the teal
                      accent — the same reason that banner breaks the accent: it reads as a
                      status, not as part of the Little Movers identity. */}
                  {!SCHEDULED_CLASS_NAMES.has(name) && (
                    <span
                      data-testid="class-coming-soon"
                      className="font-body text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-1 flex-shrink-0"
                      style={{ background: NOTICE_ACCENT, color: onAccent(NOTICE_ACCENT) }}
                    >
                      Coming soon
                    </span>
                  )}
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

      {/* Weekly schedule */}
      <section id="schedule" className="px-6 lg:px-24 py-16 lg:py-20 scroll-mt-24">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Weekly schedule</Kicker>
          <SectionHeading className="text-white mb-3">
            Monday, Wednesday &amp; Friday mornings
          </SectionHeading>
          <p className="font-body text-mist-400 text-sm mb-10 max-w-2xl">
            Every class runs 45 minutes, with 15 minutes between classes. No Little Movers
            class is drop-off: a parent or caregiver is welcome to stay in the class or wait
            in the studio. This is our planned weekly schedule, and start dates are coming
            soon.
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
              <div key={day}>
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
            class on the schedule. Pricing is set — registration opens soon.
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
        body="Join the Little Movers family and discover a fun, flexible way for your child to learn, explore, and grow through movement. More details coming soon — reach out and we'll keep you posted."
        action={<InverseAction to="/contact">Get in Touch →</InverseAction>}
      />

      <Footer />
    </div>
  )
}
