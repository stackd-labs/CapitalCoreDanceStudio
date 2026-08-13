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
    ages: '0–12 months',
    description: 'Gentle movement, music, sensory exploration, and bonding.',
  },
  {
    name: 'Parent & Me Dance',
    ages: '18 months–3 years',
    description: 'Interactive movement classes designed for toddlers and caregivers.',
  },
  {
    name: "Moovin' & Groovin'",
    ages: '2–5 years',
    // The partnership is credited here rather than in the schedule table, which the
    // studio asked to keep to class name and age range only.
    partner: 'Our signature class, in partnership with Ms. Ryan',
    description: 'Signature movement and music experience featuring creative dance and active learning.',
  },
  {
    name: 'Tiny Tumblers',
    ages: '2–5 years',
    description: 'Beginner tumbling, balance, flexibility, and coordination.',
  },
  {
    name: 'Sensory Steps',
    ages: '2–5 years',
    description: 'Movement-based sensory exploration with props, music, and imaginative play.',
  },
  {
    name: 'Little Movers Free Play Lab',
    ages: '1–5 years',
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
const TIME_SLOTS = ['9:30 – 10:15 AM', '10:15 – 11:00 AM', '11:00 – 11:45 AM']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// SCHEDULE[slotIndex][day] — one class per day per slot, 15 slots in all.
const SCHEDULE = [
  {
    Monday: { name: 'Baby & Me' },
    Tuesday: { name: 'Sensory Steps' },
    Wednesday: { name: "Moovin' & Groovin'" },
    Thursday: { name: 'Little Movers Free Play Lab' },
    Friday: { name: 'Tiny Tumblers' },
  },
  {
    Monday: { name: "Moovin' & Groovin'" },
    Tuesday: { name: 'Little Movers Free Play Lab' },
    Wednesday: { name: 'Tiny Tumblers' },
    Thursday: { name: 'Parent & Me Dance' },
    Friday: { name: 'Baby & Me' },
  },
  {
    Monday: { name: 'Tiny Tumblers' },
    Tuesday: { name: 'Parent & Me Dance' },
    Wednesday: { name: 'Baby & Me' },
    Thursday: { name: 'Sensory Steps' },
    Friday: { name: "Moovin' & Groovin'" },
  },
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
    unit: 'per class',
    blurb: 'Pay as you go. Come to any single class, any morning, with nothing to sign up for.',
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
    headline: '$89',
    unit: 'per month',
    badge: 'Best value',
    blurb: 'Attend as many Little Movers classes as you would like. Worth it from about nine classes a month, and a bargain for families coming three mornings a week.',
    lines: [
      'Unlimited Little Movers classes',
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
        description="Coming soon — Little Movers at Capital Core Dance in Midlothian, VA. A movement-based enrichment program for infants, toddlers, and preschoolers combining dance, music, sensory play, tumbling, and active exploration. Weekday mornings, 45-minute classes, drop-in $10. Contact us to be notified when registration opens."
        canonical="/little-movers"
        jsonLd={LITTLE_MOVERS_JSON_LD}
      />
      <Navbar />

      <Hero
        eyebrow="Ages 0 – 5 years"
        title={['Little', [{ text: 'Movers', accent: ACCENT }]]}
        tagline="Movement. Play. Learn. Grow."
        body="A first dance experience for infants, toddlers and preschoolers — 45-minute weekday-morning classes built on music, sensory play and active exploration."
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

      {/* Six classes — the mockup's tier cards, filled with the studio's own classes */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>The classes</Kicker>
          <SectionHeading className="text-white mb-10">Six ways to move</SectionHeading>
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
                <div
                  data-testid="class-name"
                  className="font-display uppercase text-white text-[26px] leading-none mt-3 mb-3"
                >
                  {name}
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
          <SectionHeading className="text-white mb-3">Monday – Friday mornings</SectionHeading>
          <p className="font-body text-mist-400 text-sm mb-10 max-w-2xl">
            Every class runs 45 minutes. Little Movers is a drop-off program. This is our planned
            weekly schedule — start dates are coming soon.
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
