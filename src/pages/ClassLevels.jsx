import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb } from '../lib/schema'
import { getClassInfo } from '../lib/classInfo'

// Same portal registration link as the Classes page.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
]

// Group structure and ordering follow the studio's copy. Prose for each class lives
// in src/lib/classInfo.js — the keys below index into it. There is deliberately no
// Advanced group, and the Adult Program moved to src/pages/AdultClasses.jsx.
const CLASS_GROUPS = [
  {
    title: 'Tiny Dancers',
    ages: 'Ages 2–5',
    intro: null,
    infoKeys: ['Tiny Ballet & Tumble', 'Tiny Ballet & Hip Hop', 'Tiny Ballet & Tap'],
  },
  {
    title: 'Beginner Program',
    ages: 'Ages 5+',
    intro: 'No previous dance experience required!',
    infoKeys: [
      'Beginner Ballet & Jazz',
      'Beginner Ballet & Hip Hop',
      'Beginner Ballet & Tap',
      'Beginner Ballet & Modern',
      'Beginner Acro & Jazz',
      'Beginner Contemporary & Jazz',
      'Beginner Hip Hop & Breakdancing',
      'Beginner Hip Hop',
    ],
  },
  {
    title: 'Intermediate & Technique Classes',
    ages: 'Ages 5+',
    intro: 'Perfect for dancers ready to continue developing their skills.',
    infoKeys: ['Acro & Lyrical', 'Ballet & Contemporary', 'Tumble Tech', 'Tumble', 'Lyrical & Contemporary'],
  },
  {
    title: 'Specialty Classes',
    ages: 'Ages 5+',
    intro: null,
    infoKeys: ['Musical Theatre', 'Pom Cheer'],
  },
]

// Studio's own copy, verbatim.
const IMPORTANT_INFO = [
  'Tiny Classes are designed for dancers ages 2–5.',
  'Beginner Classes are designed for dancers ages 5 and older with little or no dance experience.',
  'Adult, Tumble Tech, Pom Cheer, and Musical Theatre classes are beginner-friendly and welcome dancers of all experience levels.',
  'Class placement recommendations may be made by instructors to ensure every dancer is in the class that best supports their growth.',
]

const ADULT_CLASSES_PATH = '/adult-classes'

const CLASS_LEVELS_JSON_LD = [simpleBreadcrumb('Class Levels', '/class-levels')]

function ClassCard({ name, audience, description, accent }) {
  return (
    <div
      data-testid="class-card"
      className={`border border-surface-border border-l-4 ${accent} rounded-lg px-5 py-4`}
    >
      <div data-testid="class-name" className="text-navy-dark font-bold text-base">
        {name}
      </div>
      <p data-testid="class-audience" className="text-brand-red text-xs font-semibold mt-1">
        {audience}
      </p>
      <p data-testid="class-description" className="text-[#5a6a8a] text-sm mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export default function ClassLevels() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Dance Class Descriptions &amp; Levels | Capital Core Dance Studio — Midlothian, VA"
        description="Which dance class fits your dancer? Full class descriptions for Capital Core Dance Studio in Midlothian, VA — Tiny Dancers (ages 2–5), the Beginner Program (ages 5+), Intermediate &amp; Technique classes, and Specialty classes including Musical Theatre and Pom Cheer. Adult classes (16+) have their own page."
        canonical="/class-levels"
        jsonLd={CLASS_LEVELS_JSON_LD}
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Class Levels"
        subtitle="What every class involves and who it's built for — so you can find the right fit before you register."
      />

      {CLASS_GROUPS.map(({ title, ages, intro, infoKeys }, groupIndex) => (
        <section
          key={title}
          data-testid="class-group"
          className={`px-6 py-12 ${groupIndex % 2 === 0 ? 'bg-surface-light' : 'bg-white'}`}
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
              {ages}
            </p>
            <h2 data-testid="group-title" className="text-navy-dark text-2xl font-black">
              {title}
            </h2>
            {intro && <p className="text-[#5a6a8a] text-sm mt-2">{intro}</p>}

            <div className="flex flex-col gap-3 mt-8">
              {infoKeys.map((key, i) => {
                const info = getClassInfo(key)
                return (
                  <ClassCard
                    key={key}
                    name={key}
                    audience={info?.audience}
                    description={info?.description}
                    accent={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                  />
                )
              })}
            </div>
          </div>
        </section>
      ))}

      {/* Adults pointer — their classes live on their own page */}
      <section className="bg-white px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="border border-dashed border-surface-border rounded-lg px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-navy-dark font-bold text-base">Dancing as an adult?</p>
              <p className="text-[#5a6a8a] text-sm mt-0.5">
                Our 16+ evening classes have their own page — Femme Flair, Pom, and Contemporary.
              </p>
            </div>
            <Link
              to={ADULT_CLASSES_PATH}
              className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
            >
              See Adult Classes →
            </Link>
          </div>
        </div>
      </section>

      {/* Important information */}
      <section className="bg-navy-dark px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#f4a8b4] text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Important information
          </p>
          <h2 className="text-white text-2xl font-black mb-6">Before you register</h2>
          <ul className="flex flex-col gap-3">
            {IMPORTANT_INFO.map((item) => (
              <li
                key={item}
                data-testid="info-bullet"
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
          <p className="text-navy-dark font-black text-xl">
            Still not sure where your dancer fits?
          </p>
          <p className="text-[#5a6a8a] text-sm mt-2">
            Your first class is always free — come try one and we'll help you place them.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              to="/classes"
              className="bg-white border border-navy-dark text-navy-dark text-sm font-bold px-6 py-3 rounded-md hover:bg-surface-light transition-colors"
            >
              See the Fall Schedule
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
