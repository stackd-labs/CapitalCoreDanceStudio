import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { getClassInfo } from '../lib/classInfo'
import { SCHEDULE } from '../lib/schedule'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Converted to the redesign 2026-08-11. No mockup covers this page, so it follows the
// system. Promoted the same day from the Classes dropdown to a top-level nav item, and
// given purple rather than the Classes orange — adults are a separate audience, not a
// step in the youth-classes journey.
const ACCENT = ACCENTS.purple

// Same portal registration link as the Classes and Class Levels pages.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

// Display order for the three adult classes. Day and time are derived from SCHEDULE
// below (matched on infoKey) rather than duplicated here, so this page can never
// drift out of sync with the Fall schedule. Prose lives in src/lib/classInfo.js,
// keyed by the names below.
const ADULT_INFO_KEYS = ['Adult Femme Flair', 'Adult Pom', 'Adult Contemporary']

const SCHEDULE_ROWS_BY_INFO_KEY = SCHEDULE.flatMap(({ day, classes }) =>
  classes.map((c) => ({ ...c, day }))
).reduce((acc, row) => {
  acc[row.infoKey] = row
  return acc
}, {})

const ADULT_CLASSES = ADULT_INFO_KEYS.map((infoKey) => {
  const row = SCHEDULE_ROWS_BY_INFO_KEY[infoKey]
  return { infoKey, day: row.day, time: row.time, start: row.start, end: row.end }
})

// The evening window, computed from the three classes rather than typed out. This line
// used to read "between 7:00 and 9:00 PM" as a literal and nearly went stale when
// Friday's Adult Contemporary was shortened on 2026-08-10 — deriving it means it cannot.
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const to12h = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')}`
}
const EVENING_WINDOW = (() => {
  const starts = ADULT_CLASSES.map((c) => c.start).sort((a, b) => toMinutes(a) - toMinutes(b))
  const ends = ADULT_CLASSES.map((c) => c.end).sort((a, b) => toMinutes(b) - toMinutes(a))
  return `${to12h(starts[0])} and ${to12h(ends[0])} PM`
})()

// Studio's own copy, carried over from the Class Levels Important Information notes.
const GOOD_TO_KNOW = [
  'Adult classes are for dancers ages 16 and up.',
  'Every adult class is beginner-friendly and welcomes dancers of all experience levels.',
  'No dance experience necessary.',
  `All three classes run in the evening, between ${EVENING_WINDOW}.`,
]

const ADULT_CLASSES_JSON_LD = [simpleBreadcrumb('Adult Classes', '/adult-classes')]

export default function AdultClasses() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Adult Dance Classes in Midlothian, VA | Capital Core Dance Studio"
        description="Evening dance classes for adults 16+ in Midlothian, VA — Femme Flair on Mondays, Pom on Wednesdays, and Contemporary on Fridays. Beginner-friendly, no experience necessary, first class always free."
        canonical="/adult-classes"
        jsonLd={ADULT_CLASSES_JSON_LD}
      />
      <Navbar />

      <Hero
        eyebrow="Ages 16 and up"
        title={['Adult', [{ text: 'classes', accent: ACCENT }]]}
        tagline="Evenings · all levels welcome"
        body="Whether it's your first class ever or your return after years away. Three evening classes a week, and the first one is always free."
        photoSrc="/card-adult-dance.jpg"
        photoAlt="Adults dancing in an evening class at Capital Core Dance Studio in Midlothian, VA"
        photoObjectPosition="center 30%"
        photoCaption="Adult class photo"
        clipStart={22}
        actions={
          <>
            <PrimaryAction href={PORTAL_REGISTER_URL}>Register for Fall →</PrimaryAction>
            <GhostAction to="/contact">Ask us a question</GhostAction>
          </>
        }
      />

      {/* Reassurance strip. Deliberately has no button: the hero's Register action sits
          directly above it, and two identical calls to action a hundred pixels apart
          read as a mistake rather than as emphasis. */}
      <section className="px-6 lg:px-24 py-5" style={{ background: ACCENT }}>
        <div
          className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-1 text-center sm:text-left"
          style={{ color: onAccent(ACCENT) }}
        >
          <p className="font-body font-bold text-lg leading-snug m-0">No experience necessary.</p>
          <p className="font-body text-sm opacity-80 m-0">
            Every adult class is beginner-friendly — and your first class is always free.
          </p>
        </div>
      </section>

      {/* The three classes */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Ages 16+</Kicker>
          <SectionHeading className="text-white mb-10">Get back to the beat</SectionHeading>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[26px]">
            {ADULT_CLASSES.map(({ infoKey, day, time }) => {
              const info = getClassInfo(infoKey)
              return (
                <div
                  key={infoKey}
                  data-testid="adult-class-card"
                  className="border border-white/[0.14] bg-ink-base px-7 py-7 flex flex-col"
                >
                  <div
                    data-testid="adult-class-when"
                    className="font-body text-[11.5px] font-semibold tracking-[0.14em] uppercase mb-3"
                    style={{ color: ACCENT }}
                  >
                    {day}
                    {' · '}
                    <span className="whitespace-nowrap">{time}</span>
                  </div>
                  <div
                    data-testid="adult-class-name"
                    className="font-display uppercase text-white text-[26px] leading-none mb-3"
                  >
                    {infoKey}
                  </div>
                  <p
                    data-testid="adult-class-description"
                    className="font-body text-[14.5px] leading-[1.6] text-mist-400 m-0"
                  >
                    {info?.description}
                  </p>
                </div>
              )
            })}
          </div>

          <p className="font-body text-mist-500 text-xs mt-8 text-center">
            Days and times are from the Fall 2026 schedule. See the{' '}
            <Link to="/classes" className="font-semibold hover:underline" style={{ color: ACCENT }}>
              full schedule
            </Link>{' '}
            for everything on the calendar, or{' '}
            <Link to="/tuition" className="font-semibold hover:underline" style={{ color: ACCENT }}>
              Tuition
            </Link>{' '}
            for monthly pricing.
          </p>
        </div>
      </section>

      {/* Good to know */}
      <section className="px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Good to know</Kicker>
          <SectionHeading className="text-white mb-10">Before your first class</SectionHeading>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-5">
            {GOOD_TO_KNOW.map((item) => (
              <li
                key={item}
                data-testid="adult-info-bullet"
                className="font-body text-mist-300 text-[15px] leading-relaxed pl-5 border-l-2"
                style={{ borderColor: ACCENT }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        accent={ACCENT}
        headline="Come try one on us."
        body="Your first class is always free — no commitment, no experience required."
        action={
          <div className="flex flex-col sm:flex-row gap-3">
            <InverseAction href={PORTAL_REGISTER_URL}>Register for Fall →</InverseAction>
            <InverseAction to="/contact">Ask Us a Question</InverseAction>
          </div>
        }
      />

      <Footer />
    </div>
  )
}
