import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb } from '../lib/schema'

// Same portal registration link as the Classes, Class Levels, and Adult Classes pages.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
]

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
// price. `question` is the headline a parent recognises themselves in; `accent` is the
// card's left border, drawn from the site's existing four accents.
const PRICING = [
  {
    question: 'Just want to try it?',
    label: 'Drop-In',
    headline: '$10',
    unit: 'per class',
    blurb: 'Pay as you go. Come to any single class, any morning, with nothing to sign up for.',
    lines: ['Good for any Little Movers class', 'No membership or commitment'],
    accent: 'border-l-[#7ab3e8]',
  },
  {
    question: 'Come when you can',
    label: 'Little Movers Passport',
    headline: '5 visits — $45',
    unit: 'or 10 visits — $85',
    blurb: 'A class pack that never locks you into a day or time — use the visits whenever your week allows.',
    lines: ['Works for any Little Movers class', '10-visit pack is $8.50 a class'],
    accent: 'border-l-[#f4a8b4]',
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
    accent: 'border-l-brand-red',
  },
]

const LITTLE_MOVERS_JSON_LD = [simpleBreadcrumb('Little Movers', '/little-movers')]

// One schedule cell: class name and age range.
function ScheduleCell({ entry }) {
  if (!entry) return null
  const info = CLASSES_BY_NAME[entry.name]
  return (
    <div data-testid="schedule-entry" className="text-left">
      <div className="text-navy-dark font-bold text-sm leading-snug">{entry.name}</div>
      <div className="text-[#8a9aaa] text-xs mt-0.5">{info?.ages}</div>
    </div>
  )
}

export default function LittleMovers() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Little Movers | Toddler &amp; Preschool Movement Classes in Midlothian, VA — Capital Core Dance"
        description="Little Movers at Capital Core Dance in Midlothian, VA — a movement-based enrichment program for infants, toddlers, and preschoolers combining dance, music, sensory play, tumbling, and active exploration. Weekday mornings, 45-minute classes, drop-in $10."
        canonical="/little-movers"
        jsonLd={LITTLE_MOVERS_JSON_LD}
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Little Movers"
        subtitle="Movement. Play. Learn. Grow. — a movement-based enrichment program for infants, toddlers, and preschoolers."
      />

      {/* Drop-in banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#f4a8b4' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">
              Choose one class or stay for the whole morning.
            </p>
            <p className="text-navy-dark/70 text-sm mt-0.5">
              Drop in to any class for just $10 — no membership required.
            </p>
          </div>
          <a
            href={PORTAL_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
          >
            Register Today →
          </a>
        </div>
      </section>

      {/* Intro + benefits */}
      <section className="bg-white px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-8">
            A movement-based enrichment program for infants, toddlers, and preschoolers that
            combines dance, music, sensory play, tumbling, and active exploration in a fun,
            engaging environment.
          </p>

          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Why Little Movers?
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-2">
            What your child builds here
          </h2>
          <p className="text-[#5a6a8a] text-sm mb-6">Little Movers helps children develop:</p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {BENEFITS.map((item) => (
              <li key={item} data-testid="benefit" className="text-[#3a4a6a] text-sm flex gap-2">
                <span className="text-[#f4a8b4] mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Classes */}
      <section className="bg-surface-light px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Classes
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">Six ways to move</h2>

          <div className="flex flex-col gap-3">
            {CLASSES.map(({ name, ages, description }, i) => (
              <div
                key={name}
                data-testid="little-movers-class"
                className={`bg-white border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div data-testid="class-name" className="text-navy-dark font-bold text-base">
                    {name}
                  </div>
                  <div className="text-[#8a9aaa] text-xs font-bold uppercase tracking-wider">
                    {ages}
                  </div>
                </div>
                <p className="text-[#5a6a8a] text-sm mt-2 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly schedule */}
      <section className="bg-white px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Weekly schedule
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-2">
            Monday – Friday mornings
          </h2>
          <p className="text-[#5a6a8a] text-sm mb-8">
            Every class runs 45 minutes. Little Movers is a drop-off program.
          </p>

          {/* Table at md and up */}
          <div className="hidden md:block overflow-x-auto">
            <table data-testid="schedule-table" className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[#8a9aaa] text-[10px] font-bold uppercase tracking-wider pb-3 pr-4 w-32">
                    Time
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      className="text-left text-navy-dark text-xs font-black uppercase tracking-wider pb-3 px-3"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((slot, i) => (
                  <tr key={TIME_SLOTS[i]} className="border-t border-surface-border align-top">
                    <th
                      scope="row"
                      className="text-left text-[#7ab3e8] text-sm font-semibold py-4 pr-4 whitespace-nowrap"
                    >
                      {TIME_SLOTS[i]}
                    </th>
                    {DAYS.map((day) => (
                      <td key={day} className="py-4 px-3">
                        <ScheduleCell entry={slot[day]} />
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
                  <div className="text-navy-dark font-black text-lg">{day}</div>
                  <div className="flex-1 h-px bg-surface-border" />
                </div>
                <div className="flex flex-col gap-3">
                  {SCHEDULE.map((slot, i) => (
                    <div
                      key={`${day}-${TIME_SLOTS[i]}`}
                      className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4 flex items-start justify-between gap-4`}
                    >
                      <ScheduleCell entry={slot[day]} />
                      <div className="text-[#7ab3e8] text-sm font-medium flex-shrink-0 text-right">
                        {TIME_SLOTS[i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-surface-light px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Pricing
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-2">
            Flexible options for every family
          </h2>
          <p className="text-[#5a6a8a] text-sm mb-8">
            Three ways to join, depending on how often you plan to come. Every option works
            for any class on the schedule.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRICING.map(({ question, label, headline, unit, badge, blurb, lines, accent }) => (
              <div
                key={label}
                data-testid="pricing-card"
                className={`bg-white border border-surface-border border-l-4 ${accent} rounded-lg px-5 py-5 flex flex-col`}
              >
                <p className="text-navy-dark text-sm font-bold">{question}</p>
                <div className="flex items-center gap-2 mt-3">
                  <p className="text-brand-red text-[10px] font-bold tracking-[0.3em] uppercase">
                    {label}
                  </p>
                  {badge && (
                    <span
                      data-testid="pricing-badge"
                      className="bg-brand-red text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
                    >
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-navy-dark text-2xl font-black leading-tight mt-1">{headline}</p>
                <p className="text-[#8a9aaa] text-xs uppercase tracking-widest mt-1">{unit}</p>
                <p className="text-[#5a6a8a] text-sm mt-3 leading-relaxed">{blurb}</p>
                <ul className="flex flex-col gap-1.5 mt-4">
                  {lines.map((line) => (
                    <li key={line} data-testid="pricing-line" className="text-[#3a4a6a] text-sm flex gap-2">
                      <span className="text-[#7ab3e8] mt-0.5 flex-shrink-0">✓</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-[#8a9aaa] text-xs mt-6 text-center">
            Use your passport or membership for any Little Movers class. See{' '}
            <Link to="/tuition" className="text-brand-red font-semibold hover:underline">
              Tuition
            </Link>{' '}
            for our year-round dance class pricing.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-navy-dark flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#f4a8b4] text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Let's move, play & grow together
          </p>
          <h2 className="text-white text-2xl font-black">Ready to Get Moving?</h2>
          <p className="text-[#b8d4f0] text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Join the Little Movers family and discover a fun, flexible way for your child to
            learn, explore, and grow through movement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              to="/contact"
              className="bg-white border border-navy-dark text-navy-dark text-sm font-bold px-6 py-3 rounded-md hover:bg-surface-light transition-colors"
            >
              Ask Us a Question
            </Link>
            <a
              href={PORTAL_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-red text-white text-sm font-bold px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Register Today →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
