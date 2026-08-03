import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb } from '../lib/schema'
import { getClassInfo } from '../lib/classInfo'
import { SCHEDULE } from '../lib/schedule'

// Same portal registration link as the Classes and Class Levels pages.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
]

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
  return { infoKey, day: row.day, time: row.time }
})

// Studio's own copy, carried over from the Class Levels Important Information notes.
const GOOD_TO_KNOW = [
  'Adult classes are for dancers ages 16 and up.',
  'Every adult class is beginner-friendly and welcomes dancers of all experience levels.',
  'No dance experience necessary.',
  'All three classes run in the evening, between 7:00 and 9:00 PM.',
]

const ADULT_CLASSES_JSON_LD = [simpleBreadcrumb('Adult Classes', '/adult-classes')]

export default function AdultClasses() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Adult Dance Classes in Midlothian, VA | Capital Core Dance Studio"
        description="Evening dance classes for adults 16+ in Midlothian, VA — Femme Flair on Mondays, Pom on Wednesdays, and Contemporary on Fridays. Beginner-friendly, no experience necessary, first class always free."
        canonical="/adult-classes"
        jsonLd={ADULT_CLASSES_JSON_LD}
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Adult Classes"
        subtitle="Evening classes for grown dancers — whether it's your first class ever or your return after years away."
      />

      {/* Hero photo */}
      <div className="w-full overflow-hidden" style={{ maxHeight: '210px' }}>
        <img
          src="/card-adult-dance.jpg"
          alt="Adults dancing in an evening class at Capital Core Dance Studio in Midlothian, VA"
          className="w-full h-full object-cover"
          style={{ maxHeight: '210px', objectPosition: 'center 30%' }}
        />
      </div>

      {/* Welcome banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#f4a8b4' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">No experience necessary.</p>
            <p className="text-navy-dark/70 text-sm mt-0.5">
              Every adult class is beginner-friendly — and your first class is always free.
            </p>
          </div>
          <a
            href={PORTAL_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
          >
            Register for Fall →
          </a>
        </div>
      </section>

      {/* Classes */}
      <section className="bg-white px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Ages 16+
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Get back to the beat
          </h2>

          <div className="flex flex-col gap-3">
            {ADULT_CLASSES.map(({ infoKey, day, time }, i) => {
              const info = getClassInfo(infoKey)
              return (
                <div
                  key={infoKey}
                  data-testid="adult-class-card"
                  className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <div data-testid="adult-class-name" className="text-navy-dark font-bold text-base">
                      {infoKey}
                    </div>
                    <div data-testid="adult-class-when" className="text-[#7ab3e8] text-sm font-medium">
                      <span className="text-[#8a9aaa] text-xs font-bold uppercase tracking-wider">{day}</span>
                      {' · '}
                      <span className="whitespace-nowrap">{time}</span>
                    </div>
                  </div>
                  <p data-testid="adult-class-description" className="text-[#5a6a8a] text-sm mt-2 leading-relaxed">
                    {info?.description}
                  </p>
                </div>
              )
            })}
          </div>

          <p className="text-[#8a9aaa] text-xs mt-8 text-center">
            Days and times are from the Fall 2026 schedule. See the{' '}
            <Link to="/classes" className="text-brand-red font-semibold hover:underline">
              full schedule
            </Link>{' '}
            for everything on the calendar, or{' '}
            <Link to="/tuition" className="text-brand-red font-semibold hover:underline">
              Tuition
            </Link>{' '}
            for monthly pricing.
          </p>
        </div>
      </section>

      {/* Good to know */}
      <section className="bg-navy-dark px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#f4a8b4] text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Good to know
          </p>
          <h2 className="text-white text-2xl font-black mb-6">Before your first class</h2>
          <ul className="flex flex-col gap-3">
            {GOOD_TO_KNOW.map((item) => (
              <li
                key={item}
                data-testid="adult-info-bullet"
                className="text-[#b8d4f0] text-sm leading-relaxed pl-4 border-l-2 border-navy-mid"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-surface-light flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-navy-dark font-black text-xl">Come try one on us.</p>
          <p className="text-[#5a6a8a] text-sm mt-2">
            Your first class is always free — no commitment, no experience required.
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
              className="bg-navy-dark text-white text-sm font-bold px-6 py-3 rounded-md hover:bg-navy-mid transition-colors"
            >
              Register for Fall →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
