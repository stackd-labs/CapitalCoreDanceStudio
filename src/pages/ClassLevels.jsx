import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { courseListSchema, simpleBreadcrumb } from '../lib/schema'

// Same portal registration link as the Classes page.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
]

// PLACEHOLDER COPY — generic to each level, makes no claim about our curriculum,
// instructors, or placement process. Chanel replaces these blurbs with studio copy.
const LEVELS = [
  {
    name: 'Tiny',
    ages: 'Ages 2–5',
    blurb: 'Thirty-minute classes built for the shortest attention spans — songs, shapes, and safe first tumbling. No experience needed.',
  },
  {
    name: 'Beginner',
    ages: 'Ages 5+',
    blurb: 'Where technique starts: positions, counts, and across-the-floor basics at a pace set for first-timers.',
  },
  {
    name: 'Intermediate',
    ages: 'By placement',
    blurb: 'For dancers with a season or two behind them — longer combinations, faster corrections, more demanding choreography.',
  },
  {
    name: 'Advanced',
    ages: 'By placement',
    blurb: 'Full combinations, refined technique, and performance-level choreography for dancers who train consistently.',
  },
  {
    name: 'Adult',
    ages: 'Ages 16+',
    blurb: "Evening classes for grown dancers, whether it's your first class or your return after years away.",
  },
  {
    name: 'Specialty',
    ages: 'Ages 5+',
    blurb: 'Style-specific classes beyond the studio staples — Musical Theatre, Pom, and Cheer.',
  },
]

// Level badges are derived from the Fall 2026 schedule in Classes.jsx.
// Intermediate and Advanced are one combined badge because the schedule does not
// distinguish them. "Adult" is a level, not a style — it appears only as a badge.
// PLACEHOLDER COPY — generic to each art form. Chanel replaces these descriptions.
const STYLES = [
  {
    name: 'Ballet',
    levels: ['Tiny', 'Beginner', 'Intermediate/Advanced'],
    description: 'The foundation under every other style: alignment, turnout, and the vocabulary dancers carry into everything else.',
  },
  {
    name: 'Jazz',
    levels: ['Beginner', 'Intermediate/Advanced'],
    description: 'Sharp, upbeat, and musical — isolations, turns, and leaps set to current music.',
  },
  {
    name: 'Hip Hop',
    levels: ['Tiny', 'Beginner', 'Intermediate/Advanced'],
    description: 'Groove, rhythm, and attitude, with age-appropriate music and choreography at every level.',
  },
  {
    name: 'Contemporary',
    levels: ['Beginner', 'Intermediate/Advanced', 'Adult'],
    description: 'Movement built on breath and weight, borrowing from ballet and modern to tell a story.',
  },
  {
    name: 'Tap',
    levels: ['Tiny', 'Beginner'],
    description: 'Rhythm you can hear. Dancers build clean sounds and timing one step at a time.',
  },
  {
    name: 'Acro & Tumbling',
    levels: ['Tiny', 'Beginner', 'Intermediate/Advanced'],
    description: 'Strength, flexibility, and controlled tricks — rolls and cartwheels through to advanced skills, spotted and progressed safely.',
  },
  {
    name: 'Lyrical',
    levels: ['Intermediate/Advanced'],
    description: 'Ballet technique with contemporary freedom, danced to the lyrics of a song.',
  },
  {
    name: 'Breakdancing',
    levels: ['Beginner'],
    description: 'Toprock, footwork, and freezes — the athletic, foundational side of hip hop.',
  },
  {
    name: 'Musical Theatre',
    levels: ['Specialty'],
    description: 'Choreography paired with character and storytelling, drawn from stage repertoire.',
  },
  {
    name: 'Pom & Cheer',
    levels: ['Specialty', 'Adult'],
    description: 'Sharp motions, jumps, and team-style routines; good preparation for school squads.',
  },
  {
    name: 'Creative Movement',
    levels: ['Tiny'],
    description: 'Preschool-paced exploration of rhythm and coordination through imagination and play.',
  },
]

const CLASS_LEVELS_JSON_LD = [
  courseListSchema(STYLES.map(({ name }) => name)),
  simpleBreadcrumb('Class Levels', '/class-levels'),
]

export default function ClassLevels() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Dance Class Levels &amp; Styles | Capital Core Dance Studio — Midlothian, VA"
        description="Which dance class fits your dancer? Capital Core Dance Studio in Midlothian, VA offers Tiny (ages 2–5), Beginner, Intermediate, Advanced, Adult, and Specialty levels across ballet, jazz, hip hop, contemporary, tap, acro, lyrical, musical theatre, and pom/cheer."
        canonical="/class-levels"
        jsonLd={CLASS_LEVELS_JSON_LD}
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Class Levels"
        subtitle="What each level means and what every style involves — so you can find the right fit before you register."
      />

      {/* Levels */}
      <section className="bg-surface-light px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Which level?
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Six levels, ages 2 through adult
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LEVELS.map(({ name, ages, blurb }, i) => (
              <div
                key={name}
                data-testid="level-card"
                className={`bg-white border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4`}
              >
                <div className="text-navy-dark font-bold text-base">{name}</div>
                <div className="text-[#8a9aaa] text-xs font-bold uppercase tracking-wider mt-0.5">
                  {ages}
                </div>
                <p data-testid="level-blurb" className="text-[#5a6a8a] text-sm mt-2 leading-relaxed">
                  {blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles */}
      <section className="bg-white px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Our styles
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            What each class involves
          </h2>

          <div className="flex flex-col gap-3">
            {STYLES.map(({ name, levels, description }, i) => (
              <div
                key={name}
                data-testid="style-card"
                className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4`}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <div data-testid="style-name" className="text-navy-dark font-bold text-base">
                    {name}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {levels.map((level) => (
                      <span
                        key={level}
                        data-testid="style-badge"
                        className="bg-surface-light text-[#5a6a8a] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
                <p data-testid="style-description" className="text-[#5a6a8a] text-sm mt-2 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-[#8a9aaa] text-xs mt-8 text-center">
            Not every style runs every session. See the{' '}
            <Link to="/classes" className="text-brand-red font-semibold hover:underline">
              Fall schedule
            </Link>{' '}
            for what's on the calendar now.
          </p>
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
