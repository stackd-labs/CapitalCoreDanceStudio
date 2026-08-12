import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { getClassInfo } from '../lib/classInfo'
import { PROGRAMS } from '../lib/schedule'
import { ACCENTS } from '../lib/pageAccents'

// Converted to the redesign 2026-08-11. There is no mockup for this page — it is not one
// of the studio's twelve — so it follows the system the others set. It sits in the
// Classes group, so it carries the same orange as the schedule and Adult Classes: a
// parent moving between them should not see the colour change.
const ACCENT = ACCENTS.orange

// Same portal registration link as the Classes page.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

// Groups mirror the studio's program tiers in src/lib/schedule.js (PROGRAMS), adopted
// 2026-08-10 — Adult Core is absent because it has its own page. Each group names its
// tier via `program`, and the title, skill band, and intro copy are read from PROGRAMS
// so a tier is described identically here, in the schedule legend, and in the class
// detail panel. `ages` may be overridden where this page needs to be more precise than
// the tier's filter-label shorthand. Prose for each class lives in src/lib/classInfo.js;
// the keys below index into it. There is deliberately no Advanced group.
const PROGRAMS_BY_VALUE = Object.fromEntries(PROGRAMS.map((p) => [p.value, p]))

const CLASS_GROUPS = [
  {
    program: 'tiny-core',
    infoKeys: ['Tiny Core Ballet & Tumble', 'Tiny Core Ballet & Hip Hop', 'Tiny Core Ballet & Tap'],
  },
  {
    program: 'core',
    infoKeys: [
      'Core Ballet & Jazz',
      'Core Ballet & Hip Hop',
      'Core Ballet & Tap',
      'Core Ballet & Modern',
      'Core Acro & Jazz',
      'Core Contemporary & Jazz',
      'Core Hip Hop & Breakdancing',
    ],
  },
  {
    program: 'core-plus',
    // Lyrical & Contemporary moved up from Core on 2026-08-10 at the studio's request.
    infoKeys: [
      'Core Plus Acro & Lyrical',
      'Core Plus Ballet & Contemporary',
      'Core Plus Lyrical & Contemporary',
    ],
  },
  {
    // Announced 2026-08-11; the studio has not yet said which classes belong here.
    // Empty groups are filtered out below, so this section appears on the page the
    // moment the first infoKey is added and needs no other change.
    program: 'core-elite',
    infoKeys: [],
  },
  {
    program: 'technique',
    infoKeys: ['Tumble Tech'],
  },
  {
    program: 'specialty',
    // Overridden: the tier's shorthand is "All Ages" because Musical Theatre is, but
    // Pom Cheer is 5+, so the group header must not promise all ages for both.
    ages: 'Ages 5+',
    infoKeys: ['Musical Theatre', 'Pom Cheer'],
  },
]
  .filter(({ infoKeys }) => infoKeys.length > 0)
  .map(({ program, ages, infoKeys }) => {
    const tier = PROGRAMS_BY_VALUE[program]
    // "5+" and "2–5" read as ages and take the prefix; "All Levels" and "All Ages" are
    // already full phrases and must not become "Ages All Levels".
    const derivedAges = /^\d/.test(tier.ages) ? `Ages ${tier.ages}` : tier.ages
    return {
      title: tier.label,
      level: tier.level,
      ages: ages || derivedAges,
      intro: tier.blurb,
      infoKeys,
    }
  })

// Adapted from the studio's own copy, reworded 2026-08-10 for the Core vocabulary.
const IMPORTANT_INFO = [
  'Tiny Core classes are designed for dancers ages 2–5.',
  'Core and Core Plus are both beginner–novice — whether this is a dancer’s first class ever or their return after time away. Core starts at age 5, Core Plus at age 8, so older dancers starting out learn with their own age group.',
  'Core Elite is intermediate–advanced, for dancers who have built their foundation. Placement is by instructor recommendation.',
  'Adult, Tumble Tech, Pom Cheer, and Musical Theatre classes welcome dancers of all experience levels.',
  'Class placement recommendations may be made by instructors to ensure every dancer is in the class that best supports their growth.',
]

const ADULT_CLASSES_PATH = '/adult-classes'

const CLASS_LEVELS_JSON_LD = [simpleBreadcrumb('Class Levels', '/class-levels')]

function ClassCard({ name, description }) {
  return (
    <div
      data-testid="class-card"
      className="border border-white/[0.14] bg-ink-panel px-6 py-6 flex flex-col"
    >
      <div
        data-testid="class-name"
        className="font-display uppercase text-white text-[22px] leading-[1.05] mb-2.5"
      >
        {name}
      </div>
      <p
        data-testid="class-description"
        className="font-body text-[14.5px] leading-[1.6] text-mist-400 m-0"
      >
        {description}
      </p>
    </div>
  )
}

export default function ClassLevels() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Dance Class Descriptions &amp; Levels | Capital Core Dance Studio — Midlothian, VA"
        description="Which dance class fits your dancer? Full class descriptions for Capital Core Dance Studio in Midlothian, VA — Tiny Core (ages 2–5), Core (ages 5+), Core Plus (ages 8+), Technique, and Specialty classes including Musical Theatre and Pom Cheer. Adult classes (16+) have their own page."
        canonical="/class-levels"
        jsonLd={CLASS_LEVELS_JSON_LD}
      />
      <Navbar />

      <Hero
        eyebrow="Ages 2 through 17"
        title={['Class', [{ text: 'levels', accent: ACCENT }]]}
        tagline="Tiny Core · Core · Core Plus"
        body="What every class involves, and who it's for — so you can find the right fit before you register. Adult classes have their own page."
        photoSrc="/classes-hero-2.jpg"
        photoAlt="Young dancers sitting together during class at Capital Core Dance Studio"
        photoCaption="Class photo"
        clipStart={22}
        actions={
          <>
            <PrimaryAction to="/classes">See the schedule</PrimaryAction>
            <GhostAction to="/tuition">Tuition</GhostAction>
          </>
        }
      />

      {CLASS_GROUPS.map(({ title, ages, level, intro, infoKeys }, groupIndex) => (
        <section
          key={title}
          data-testid="class-group"
          className={`px-6 lg:px-24 py-16 lg:py-20 ${
            groupIndex % 2 === 0 ? 'bg-ink-deep' : 'bg-ink-base'
          }`}
        >
          <div className="max-w-[1440px] mx-auto">
            <Kicker accent={ACCENT}>{ages}</Kicker>
            <SectionHeading testId="group-title" className="text-white">
              {title}
            </SectionHeading>
            <p
              data-testid="group-level"
              className="font-body text-mist-500 text-xs font-bold uppercase tracking-[0.16em] mt-2"
            >
              {level}
            </p>
            {intro && (
              <p className="font-body text-mist-400 text-[15px] leading-relaxed mt-3 max-w-2xl">
                {intro}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px] mt-10">
              {infoKeys.map((key) => {
                const info = getClassInfo(key)
                return <ClassCard key={key} name={key} description={info?.description} />
              })}
            </div>
          </div>
        </section>
      ))}

      {/* Adults pointer — their classes live on their own page */}
      <section className="bg-ink-base px-6 lg:px-24 pb-16 lg:pb-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="border border-dashed border-white/20 px-7 py-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="text-center sm:text-left">
              <p className="font-display uppercase text-white text-[22px] leading-none mb-1.5">
                Dancing as an adult?
              </p>
              <p className="font-body text-mist-400 text-sm">
                Our 16+ evening classes have their own page — Femme Flair, Pom, and Contemporary.
              </p>
            </div>
            <Link
              to={ADULT_CLASSES_PATH}
              className="flex-shrink-0 font-body font-bold text-sm px-6 py-3 border border-white/30 text-white hover:border-white transition-colors whitespace-nowrap"
            >
              See Adult Classes →
            </Link>
          </div>
        </div>
      </section>

      {/* Important information */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Important information</Kicker>
          <SectionHeading className="text-white mb-10">Before you register</SectionHeading>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-5">
            {IMPORTANT_INFO.map((item) => (
              <li
                key={item}
                data-testid="info-bullet"
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
        headline="Still not sure where your dancer fits?"
        body="Your first class is always free — come try one and we'll help you place them."
        action={
          <div className="flex flex-col sm:flex-row gap-3">
            <InverseAction to="/classes">See the Fall Schedule</InverseAction>
            {/* Kept from the pre-redesign page: a parent who has just worked out which
                class fits should be able to register without hunting for the link. */}
            <InverseAction href={PORTAL_REGISTER_URL}>Register for Fall →</InverseAction>
          </div>
        }
      />

      <Footer />
    </div>
  )
}
