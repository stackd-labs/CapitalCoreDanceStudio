import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { getClassInfo } from '../lib/classInfo'
import { SCHEDULE } from '../lib/schedule'
import {
  ADULT_PRICING,
  classLengthMinutes,
  money,
  monthlyPriceForMinutes,
  priceToNumber,
} from '../lib/tuition'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Converted to the redesign 2026-08-11. No mockup covers this page, so it follows the
// system. Promoted the same day from the Classes dropdown to a top-level nav item, and
// given its own accent rather than the Classes orange — adults are a separate audience,
// not a step in the youth-classes journey. Softened from purple to lavender 2026-08-13.
const ACCENT = ACCENTS.lavender

// The portal's dedicated adult form, NOT the /register/classes one the Classes and Class
// Levels pages use — repointed 2026-08-17, when the studio confirmed the adult form is
// live. The general form is built around a parent registering dancers: it asks for a
// parent/guardian first and its own copy tells adult dancers to use this form instead.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/adult-classes'

// Display order for the three adult classes. Day and time are derived from SCHEDULE
// below (matched on infoKey) rather than duplicated here, so this page can never
// drift out of sync with the Fall schedule. Prose lives in src/lib/classInfo.js,
// keyed by the names below.
// DERIVED from the schedule, not listed by hand. This was a hardcoded array of three
// infoKeys until 2026-09-02, and the moment the studio took Adult Femme/Flair off the
// Monday schedule this page crashed outright — the key had no row, and
// classLengthMinutes(undefined) threw before the page could render. A page that lists
// the adult classes should read which classes are adult, the same way the rest of this
// file derives length and price rather than quoting them.
//
// Picks up Adult Ballet/Tech automatically, and drops anything the studio retires.
const ADULT_INFO_KEYS = SCHEDULE.flatMap(({ classes }) =>
  classes.filter((c) => c.program === 'adult-core').map((c) => c.infoKey)
)

const SCHEDULE_ROWS_BY_INFO_KEY = SCHEDULE.flatMap(({ day, classes }) =>
  classes.map((c) => ({ ...c, day }))
).reduce((acc, row) => {
  acc[row.infoKey] = row
  return acc
}, {})

// Length and price are derived, never typed. Tuition is charged by class length, so a
// class's own start and end times already determine what it costs — quoting a figure
// here instead would mean the studio shortening a class silently changed its price on
// the Tuition page and not on this one.
const ADULT_CLASSES = ADULT_INFO_KEYS.map((infoKey) => {
  const row = SCHEDULE_ROWS_BY_INFO_KEY[infoKey]
  const minutes = classLengthMinutes(row)
  return {
    infoKey,
    day: row.day,
    time: row.time,
    start: row.start,
    end: row.end,
    minutes,
    monthly: monthlyPriceForMinutes(minutes),
  }
})

// All three adult classes run 45 minutes as of Fall 2026, which is the only reason one
// headline price can stand for the whole page. If the studio ever lengthens one, this
// falls to null and the price band below disappears — the per-class prices on the cards
// carry on being right, and nothing on the page claims a rate that no longer covers
// every class.
const UNIFORM = (() => {
  const prices = new Set(ADULT_CLASSES.map((c) => c.monthly))
  const lengths = new Set(ADULT_CLASSES.map((c) => c.minutes))
  if (prices.size !== 1 || lengths.size !== 1 || !ADULT_CLASSES[0].monthly) return null
  return { monthly: ADULT_CLASSES[0].monthly, minutes: ADULT_CLASSES[0].minutes }
})()

// The three ways to pay, 2026-08-13. Only the single-class rate is derived from class
// length; the pass and the drop-in are flat adult-only offers held in src/lib/tuition.js.
//
// Every comparison the pass makes about itself is arithmetic on those two figures, never
// a typed claim. "Less than the price of two" is true today at $165 against $85 — but it
// is one repricing away from being false, and a page that keeps saying it would be
// advertising a discount the studio no longer gives. So the phrase renders only while
// `beatsTwo` holds, and the saving is subtracted rather than written down.
const PASS = (() => {
  if (!UNIFORM) return null
  const single = priceToNumber(UNIFORM.monthly)
  const count = ADULT_CLASSES.length
  const { unlimitedMonthly } = ADULT_PRICING
  return {
    monthly: unlimitedMonthly,
    single,
    count,
    separately: single * count,
    savings: single * count - unlimitedMonthly,
    beatsTwo: unlimitedMonthly < single * 2,
  }
})()

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
        // ⚠ This sentence names the classes by hand while the page derives them. It
        // said "Femme Flair on Mondays, Pom on Wednesdays, and Contemporary on Fridays"
        // until 2026-09-02, after Femme Flair had come off the schedule entirely — a
        // meta description advertising a class that no longer runs. Re-check it
        // whenever the adult line-up changes.
        description="Evening dance classes for adults 16+ in Midlothian, VA — Pom on Wednesdays, Ballet/Tech and Contemporary on Fridays. $85 a month for one 45-minute class, $165 a month for all three, or $25 to drop in. Beginner-friendly, no experience necessary, first class always free."
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

      {/* Reassurance strip. Still no button — the hero's Register action sits directly
          above it, and two identical calls to action a hundred pixels apart read as a
          mistake. The free-trial offer became a link to Contact on 2026-08-13: booking a
          free class is not something the portal can do, so the only way to take the
          studio up on it is to ask, and the sentence that makes the offer should say so. */}
      <section className="px-6 lg:px-24 py-5" style={{ background: ACCENT }}>
        <div
          className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-1 text-center sm:text-left"
          style={{ color: onAccent(ACCENT) }}
        >
          <p className="font-body font-bold text-lg leading-snug m-0">No experience necessary.</p>
          <p className="font-body text-sm opacity-80 m-0">
            Every adult class is beginner-friendly — and{' '}
            <Link
              to="/contact"
              data-testid="free-trial-link"
              className="font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: onAccent(ACCENT) }}
            >
              your first class is always free
            </Link>
            .
          </p>
        </div>
      </section>

      {/* The three classes */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Ages 16+</Kicker>
          <SectionHeading className="text-white mb-10">Get back to the beat</SectionHeading>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[26px]">
            {ADULT_CLASSES.map(({ infoKey, day, time, minutes, monthly }) => {
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
                  {monthly && (
                    // mt-auto, not a fixed margin: the three descriptions are different
                    // lengths, and the price rules should line up across the row rather
                    // than float wherever each card's prose happens to end.
                    <div
                      data-testid="adult-class-price"
                      className="font-body text-[13px] text-mist-500 mt-auto pt-5 border-t border-white/[0.12]"
                    >
                      {minutes} min
                      {' · '}
                      <span className="text-white font-bold">{monthly}</span> a month
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <p className="font-body text-mist-500 text-xs mt-8 text-center">
            Days, times and prices are from the Fall 2026 schedule. See the{' '}
            <Link to="/classes" className="font-semibold hover:underline" style={{ color: ACCENT }}>
              full schedule
            </Link>{' '}
            for everything on the calendar, or{' '}
            <Link to="/tuition" className="font-semibold hover:underline" style={{ color: ACCENT }}>
              Tuition
            </Link>{' '}
            for registration fees and family discounts.
          </p>
        </div>
      </section>

      {/* Pricing. Three ways to pay as of 2026-08-13. The whole block hangs off UNIFORM
          because every figure here is stated against the single-class rate — with no one
          rate covering all three classes, the pass has nothing to be "less than". */}
      {UNIFORM && PASS && (
        <section className="bg-ink-base px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto">
            <Kicker accent={ACCENT}>Pricing</Kicker>
            <SectionHeading className="text-white mb-3">Three ways to dance</SectionHeading>
            <p className="font-body text-mist-400 text-sm mb-10 max-w-2xl">
              Every adult class runs {UNIFORM.minutes} minutes, so a single class costs the same
              whichever one you pick. Monthly rates are locked for the semester once you register.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[26px]">
              {/* One class */}
              <div
                data-testid="adult-price-card"
                className="border border-white/[0.14] bg-ink-deep px-7 py-8 flex flex-col"
              >
                <div className="font-body font-semibold text-[11px] tracking-[0.16em] uppercase text-mist-500 mb-4">
                  One class
                </div>
                <div
                  data-testid="adult-headline-price"
                  className="font-display text-[56px] leading-none"
                  style={{ color: ACCENT }}
                >
                  {UNIFORM.monthly}
                </div>
                <div className="font-body text-mist-500 text-[12.5px] mt-2 mb-5">a month</div>
                <p className="font-body text-[14.5px] leading-[1.6] text-mist-400 m-0 mt-auto">
                  Any single adult class, once a week for the semester.
                </p>
              </div>

              {/* Every class — the pass */}
              <div
                data-testid="adult-price-card"
                className="border-2 bg-ink-deep px-7 py-8 flex flex-col"
                style={{ borderColor: ACCENT }}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="font-body font-semibold text-[11px] tracking-[0.16em] uppercase text-mist-500">
                    Every class
                  </span>
                  <span
                    data-testid="adult-price-badge"
                    className="font-body text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-1"
                    style={{ background: ACCENT, color: onAccent(ACCENT) }}
                  >
                    Best value
                  </span>
                </div>
                <div
                  data-testid="adult-pass-price"
                  className="font-display text-[56px] leading-none"
                  style={{ color: ACCENT }}
                >
                  {money(PASS.monthly)}
                </div>
                <div className="font-body text-mist-500 text-[12.5px] mt-2 mb-5">a month</div>
                <p className="font-body text-[14.5px] leading-[1.6] text-mist-400 m-0 mt-auto">
                  Take all {PASS.count} adult classes every week
                  {PASS.beatsTwo ? ' for less than the price of two' : ''} — that&apos;s{' '}
                  <span className="text-white font-bold">{money(PASS.savings)} a month</span> off
                  paying for them separately.
                </p>
              </div>

              {/* Drop-in */}
              <div
                data-testid="adult-price-card"
                className="border border-white/[0.14] bg-ink-deep px-7 py-8 flex flex-col"
              >
                <div className="font-body font-semibold text-[11px] tracking-[0.16em] uppercase text-mist-500 mb-4">
                  Drop-in
                </div>
                <div
                  data-testid="adult-dropin-price"
                  className="font-display text-[56px] leading-none"
                  style={{ color: ACCENT }}
                >
                  {money(ADULT_PRICING.dropIn)}
                </div>
                <div className="font-body text-mist-500 text-[12.5px] mt-2 mb-5">per class</div>
                <p className="font-body text-[14.5px] leading-[1.6] text-mist-400 m-0 mt-auto">
                  Pay as you go when a month of classes doesn&apos;t suit your schedule.
                </p>
              </div>
            </div>

            <p className="font-body text-mist-500 text-xs mt-8">
              Your first class is always free —{' '}
              <Link
                to="/contact"
                className="font-semibold hover:underline"
                style={{ color: ACCENT }}
              >
                get in touch to try one
              </Link>{' '}
              before you pay anything.
            </p>
          </div>
        </section>
      )}

      {/* Good to know. Flipped to the deep field on 2026-08-13 when the pricing band was
          added above it: the page alternates deep/base down its length, and inserting a
          section without flipping this one left two base-coloured blocks touching. */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
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
            {/* Renamed from "Ask Us a Question" 2026-08-13. The band's headline offers a
                free class, so the action beside it should be the way to take that offer
                up, not a generic enquiry. Same destination, honest label. */}
            <InverseAction to="/contact">Book a Free Class</InverseAction>
          </div>
        }
      />

      <Footer />
    </div>
  )
}
