import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import PhotoSlot from '../components/PhotoSlot'
import ClassCalendar from '../components/ClassCalendar'
import { Kicker, SectionHeading, PrimaryAction, GhostAction } from '../components/blocks'
import { courseListSchema, simpleBreadcrumb } from '../lib/schema'
import { SCHEDULE, PROGRAMS } from '../lib/schedule'
import { getClassInfo, photoForClass } from '../lib/classInfo'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Rebuilt 2026-08-11 to the studio's site mockup (page 1b, accent orange). The mockup
// shows a hero, a filter bar and a card grid; the studio asked to keep the interactive
// week calendar as well, so the cards are the browsable entry point and the calendar
// below is the full week — the one view a card grid genuinely cannot give you, since it
// is the only place you can compare times across days.
const ACCENT = ACCENTS.orange

// Portal-hosted Fall class registration (public). Charges the registration fee
// ($60 new dancer / $50 returning); monthly tuition is billed separately.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

// The printable schedule. Replaced the studio's old flyer PNG on 2026-09-02 — that
// image was STALE: it showed the pre-rework week, the old class naming, and 5+ ages for
// classes that are now Core Plus 8+, so the page was offering a download that
// contradicted the calendar directly above it.
//
// 🔴 GENERATED, NOT DRAWN. `bash print/build.sh` renders it from
// print/class-schedule.html with ?only=schedule, which is the same file as the two-page
// staff sheet — so this image cannot disagree with that sheet about what runs on
// Tuesday. It is REGENERATED, never edited: any change belongs in the HTML.
//
// Schedule only, deliberately. The full sheet's tuition, registration and adult rates
// are all stated on this page already, and the instructor page is for staff.
const FALL_FLYER = {
  src: '/fall-2026-schedule.png',
  alt: 'Capital Core Dance Studio Fall 2026 class schedule: Monday to Friday evening classes in Studio B with day, time, class, age range and instructor, plus the Capital Core Dance Company in Studio A on Sunday, Monday and Thursday',
  filename: 'capital-core-fall-2026-schedule.png',
  pdf: '/fall-2026-schedule.pdf',
}

const DANCE_STYLES = [
  'Ballet',
  'Jazz',
  'Hip Hop',
  'Contemporary',
  'Tap',
  'Acro & Tumbling',
  'Lyrical',
  'Musical Theatre',
  'Breakdancing',
  'Pom & Cheer',
  'Preschool Creative Movement',
  'Adult Classes',
]

const CLASSES_JSON_LD = [
  courseListSchema(DANCE_STYLES),
  simpleBreadcrumb('Classes', '/classes'),
]

const PROGRAM_OPTIONS = [
  { value: 'All', label: 'All Programs' },
  ...PROGRAMS.filter(({ value }) =>
    SCHEDULE.some(({ classes }) => classes.some((c) => c.program === value))
  ).map(({ value, label, ages }) => ({ value, label: `${label} (${ages})` })),
]

const AGES = [
  { value: 'All', label: 'All Ages' },
  { value: 'tiny', label: 'Tiny (2–5)' },
  { value: 'kids', label: 'Kids (5–12)' },
  { value: 'teen', label: 'Teen (6–17)' },
  { value: 'adult', label: 'Adult (16+)' },
]

const CATEGORIES = [
  { value: 'All', label: 'All Styles' },
  { value: 'tiny', label: 'Tiny Classes' },
  { value: 'ballet', label: 'Ballet' },
  { value: 'jazz-acro', label: 'Jazz & Acro' },
  { value: 'hiphop', label: 'Hip Hop' },
  { value: 'lyrical-contemp', label: 'Lyrical & Contemp' },
  { value: 'tumble-cheer', label: 'Tumble & Cheer' },
  { value: 'musical-theatre', label: 'Musical Theatre' },
  { value: 'adult', label: 'Adult Classes' },
]

const PROGRAM_LABELS = Object.fromEntries(PROGRAMS.map((p) => [p.value, p.label]))

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label className="font-body text-mist-500 text-[11px] font-semibold uppercase tracking-[0.2em]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-ink-panel border border-white/25 text-white font-body text-sm font-medium px-4 py-2.5 pr-9 appearance-none cursor-pointer hover:border-white/60 focus:outline-none focus:border-white transition-colors"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238fa5c6' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-ink-panel text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// One class as a card — the mockup's grid item, filled from SCHEDULE + classInfo.
function ClassCard({ cls }) {
  const info = getClassInfo(cls.infoKey)
  // Matched on the schedule display name, by the studio's own rules — see
  // CLASS_PHOTO_RULES in src/lib/classInfo.js. Classes no rule covers keep the empty
  // captioned well, so the gap stays visible rather than being filled with something
  // generic.
  const art = photoForClass(cls.name)
  return (
    <div
      data-testid="class-card"
      className="border border-white/[0.12] bg-ink-deep flex flex-col"
    >
      <div className="h-[170px]">
        <PhotoSlot
          src={art?.photo}
          alt={art?.photoAlt}
          caption={`${cls.name} · photo`}
          className="w-full h-full"
        />
      </div>
      <div className="px-6 pt-6 pb-[26px] flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className="font-body text-[10px] font-bold tracking-[0.14em] uppercase px-2 py-1"
            style={{ background: ACCENT, color: onAccent(ACCENT) }}
          >
            {PROGRAM_LABELS[cls.program]}
          </span>
          <span className="font-body text-[11.5px] font-semibold tracking-[0.12em] text-mist-500 uppercase">
            {cls.ages}
          </span>
        </div>
        <div className="font-display uppercase text-white text-[26px] leading-none">{cls.name}</div>
        <div className="font-body text-[14px] leading-[1.55] text-mist-400 flex-1">
          {info?.description}
        </div>
        <div className="border-t border-white/[0.12] pt-3.5 flex items-center justify-between font-body text-[13px] font-semibold">
          <span className="text-mist-200">
            {cls.day} · {cls.time}
          </span>
          <a
            href={PORTAL_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: ACCENT }}
            className="hover:underline"
          >
            Register →
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Classes() {
  const [selectedProgram, setSelectedProgram] = useState('All')
  const [selectedAge, setSelectedAge] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [flyerOpen, setFlyerOpen] = useState(false)

  useEffect(() => {
    if (!flyerOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setFlyerOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [flyerOpen])

  const matches = (c) =>
    (selectedProgram === 'All' || c.program === selectedProgram) &&
    (selectedAge === 'All' || c.ageGroups.includes(selectedAge)) &&
    (selectedCategory === 'All' || c.category === selectedCategory)

  const filteredSchedule = SCHEDULE.map(({ day, classes }) => ({
    day,
    classes: classes.filter(matches),
  })).filter(({ classes }) => classes.length > 0)

  // The card grid is the same filtered set, flattened and carrying its day.
  const filteredCards = filteredSchedule.flatMap(({ day, classes }) =>
    classes.map((c) => ({ ...c, day }))
  )

  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Fall 2026 Dance Classes in Midlothian, VA | Ballet, Hip Hop, Jazz &amp; More – Capital Core Dance Studio"
        description="Fall 2026 dance classes (Aug 24 – Dec 18) for ages 2 through adult at Capital Core Dance Studio in Midlothian, VA. Ballet, jazz, hip hop, contemporary, tap, acro, lyrical, musical theatre, tumble, and pom/cheer. First class is always free."
        canonical="/classes"
        jsonLd={CLASSES_JSON_LD}
      />
      <Navbar />

      <Hero
        eyebrow="2026 – 2027 Season"
        title={['Find your', [{ text: 'class', accent: ACCENT }]]}
        tagline="Ages 2 through adult · all levels"
        body="Twenty-two classes a week across five evenings, from a first plié at two years old to adult contemporary. Your first class is always free."
        photoSrc="/classes-hero-1.jpg"
        photoAlt="Young dancers in class at Capital Core Dance Studio in Midlothian, VA"
        photoObjectPosition="center 25%"
        photoCaption="Class photo"
        actions={
          <>
            <PrimaryAction href={PORTAL_REGISTER_URL}>Register now</PrimaryAction>
            <GhostAction href="#schedule">See the schedule</GhostAction>
          </>
        }
      />

      {/* Filter bar */}
      <div className="bg-ink-base border-b border-white/[0.12] px-6 lg:px-24 py-8 lg:py-11 sticky top-[81px] z-40">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-end gap-5">
          <span className="font-body text-[11px] font-semibold tracking-[0.2em] text-mist-500 uppercase sm:pb-3">
            Filter
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <FilterSelect label="Program" options={PROGRAM_OPTIONS} value={selectedProgram} onChange={setSelectedProgram} />
            <FilterSelect label="Age Group" options={AGES} value={selectedAge} onChange={setSelectedAge} />
            <FilterSelect label="Dance Style" options={CATEGORIES} value={selectedCategory} onChange={setSelectedCategory} />
          </div>
        </div>
      </div>

      {/* The full week. Moved above the card grid on 2026-08-13: the calendar answers
          "what is on, and when" for all twenty-two classes inside one screen, where the
          cards take roughly ten screens to say the same thing. It also puts the sticky
          filter bar's effect directly under the filter bar — change Age Group and the
          week visibly redraws, instead of the result being four thousand pixels away.
          The cards keep their place below as the browsing layer, which is what the
          photography is for. */}
      <section id="schedule" className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20 scroll-mt-24">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Fall 2026 · August 24 – December 18</Kicker>
          <SectionHeading className="text-white mb-10">The full week</SectionHeading>

          {/* Whichever section comes first owns the empty state, so it moved up here with
              the calendar. Saying it twice on one page reads as a bug. */}
          {filteredSchedule.length > 0 ? (
            <ClassCalendar schedule={filteredSchedule} accent={ACCENT} />
          ) : (
            <div className="border border-dashed border-white/20 px-6 py-10 text-center">
              <p className="font-body text-mist-500 text-sm">
                No classes match your filters. Try adjusting your selection.
              </p>
            </div>
          )}

          <p className="font-body text-mist-500 text-xs mt-8 text-center">
            Core classes start at age 5+, and Core Plus at age 8+. Classes are subject to change
            based on interest and registrations.{' '}
            See{' '}
            <Link to="/tuition" className="font-semibold hover:underline" style={{ color: ACCENT }}>
              Tuition
            </Link>{' '}
            for monthly pricing.
          </p>

          {/* Program key */}
          <div data-testid="program-key" className="mt-10 border border-white/[0.12] px-6 py-7">
            <Kicker accent={ACCENT} className="mb-5">Program Key</Kicker>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {PROGRAMS.map(({ value, label, ages, level, blurb }) => (
                <div key={value}>
                  <dt className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-body text-white font-bold text-sm">{label}</span>
                    <span className="font-body text-mist-500 text-xs">({ages})</span>
                    <span
                      className="font-body text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: ACCENT }}
                    >
                      {level}
                    </span>
                  </dt>
                  <dd className="font-body text-mist-400 text-xs mt-1 leading-relaxed">{blurb}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Printable flyer */}
          <div
            data-testid="fall-flyer-card"
            className="mt-8 border border-white/[0.12] bg-ink-panel px-6 py-6 flex flex-col sm:flex-row items-center gap-6"
          >
            <button
              onClick={() => setFlyerOpen(true)}
              className="flex-shrink-0 w-full sm:w-56 border border-white/20 group relative cursor-zoom-in"
            >
              <img src={FALL_FLYER.src} alt={FALL_FLYER.alt} className="w-full h-auto block" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors" />
            </button>
            <div className="text-center sm:text-left">
              <Kicker accent={ACCENT} className="mb-2">Printable Fall Schedule</Kicker>
              <h3 className="font-display uppercase text-white text-2xl leading-none mb-2">
                Save the whole schedule on one page
              </h3>
              <p className="font-body text-mist-400 text-sm leading-relaxed mb-4">
                Every Fall 2026 class with its program level, ages, and instructor — handy for the
                fridge or sharing with another dance family.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <button
                  onClick={() => setFlyerOpen(true)}
                  className="font-body font-bold text-sm px-6 py-3 transition-opacity hover:opacity-90"
                  style={{ background: ACCENT, color: onAccent(ACCENT) }}
                >
                  View Flyer
                </button>
                <a
                  href={FALL_FLYER.src}
                  download={FALL_FLYER.filename}
                  className="font-body text-sm font-semibold hover:underline"
                  style={{ color: ACCENT }}
                >
                  Download PNG
                </a>
              </div>
            </div>
          </div>

          <PrimaryAction accent={ACCENT} href={PORTAL_REGISTER_URL} className="mt-8">
            Enroll Now
          </PrimaryAction>
        </div>
      </section>

      {/* Class cards. Below the calendar since 2026-08-13, which means they are no longer
          the first thing on the page and can no longer be an unlabelled grid — a heading
          says what they are, rather than leaving them to read as loose results under the
          week. The section renders nothing at all when the filters match nothing: the
          calendar above has already said so, and an empty titled section under it would
          look broken. */}
      {filteredCards.length > 0 && (
        <section className="bg-ink-base px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto">
            <Kicker accent={ACCENT}>Every class in detail</Kicker>
            <SectionHeading className="text-white mb-3">What each class is</SectionHeading>
            <p className="font-body text-mist-400 text-sm mb-10 max-w-2xl">
              What your dancer actually does in the room, and who each class is for.
            </p>
            <div
              data-testid="class-cards"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px]"
            >
              {filteredCards.map((c) => (
                <ClassCard key={`${c.day}-${c.name}-${c.start}`} cls={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Flyer lightbox */}
      {flyerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fall 2026 schedule flyer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 overflow-y-auto"
          onClick={() => setFlyerOpen(false)}
        >
          <div
            className="relative bg-ink-panel border border-white/15 shadow-2xl max-w-5xl w-full overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={FALL_FLYER.src} alt={FALL_FLYER.alt} className="w-full h-auto block" />
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/[0.12]">
              <a
                href={FALL_FLYER.src}
                download={FALL_FLYER.filename}
                className="font-body text-sm font-bold px-5 py-2.5 transition-opacity hover:opacity-90"
                style={{ background: ACCENT, color: onAccent(ACCENT) }}
              >
                Download Flyer
              </a>
              <button
                onClick={() => setFlyerOpen(false)}
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
