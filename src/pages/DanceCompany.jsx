import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { PrimaryAction, GhostAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'
import { COMPANY_PRICING } from '../lib/tuition'

// Capital Core Dance Company — the studio's youth performance & competition
// program. Bold navy / white / red identity: powerful, high-energy, "we belong"
// — distinct from the warm kid-facing pages. Founding season 2026/2027.

const RED = '#e01515'

// The founding-season Team Building Clinic ran August 10–13 2026 and its portal
// registration form (/register/competition-clinic) is no longer a live destination, so
// every action here goes to Contact — an interim, at the studio's request 2026-08-17,
// until they build a dedicated "join the company" form. Swap this one constant when it
// exists; nothing else on the page hardcodes a destination.
const JOIN_PATH = '/contact'

const MARQUEE = ['Train', 'Grow', 'Belong', 'Shine', 'Perform', 'Rise']

const VISION = [
  'Confident performers', 'Strong technicians', 'Positive teammates',
  'Respectful leaders', 'Creative artists', 'Lifelong learners',
]

const EVERY_DANCER = [
  'Exploring competition for the first time',
  'Looking to build confidence',
  'Ready to take their training to the next level',
  'Hoping to make new friends',
  'Dreaming of performing more often',
]

const EXPERIENCES = [
  'Regional Competitions', 'Community Performances', 'Holiday Events',
  'Studio Showcases', 'Team Building', 'Leadership Opportunities',
  'Master Classes', 'Guest Choreographers', 'Conventions', 'Team Celebrations',
]

const VALUES = [
  { name: 'Excellence', body: 'Pursue your personal best. We celebrate growth and progress as much as the podium.' },
  { name: 'Character', body: 'Respect, kindness, integrity, and accountability are at the heart of the program.' },
  { name: 'Community', body: 'Strong friendships and positive relationships build stronger performers.' },
  { name: 'Family', body: 'Parents are part of the team. Every family feels welcome, supported, and valued.' },
  { name: 'Growth', body: "Every dancer's journey is unique. We celebrate improvement, not just achievement." },
]

const TRAINING = [
  'Ballet Technique', 'Jazz Technique', 'Contemporary', 'Lyrical',
  'Leaps & Turns', 'Choreography', 'Performance Quality', 'Musicality',
  'Strength & Conditioning', 'Flexibility', 'Teamwork & Leadership',
]

const WHY = [
  'Beginner-friendly environment', 'Positive coaching and mentorship',
  'Family-focused culture', 'Professional instruction',
  'Perform throughout the year', 'Training in multiple styles',
  'Leadership and confidence-building', 'Age-appropriate training',
  'Inclusive, encouraging atmosphere', 'Lasting friendships and memories',
]

// The CLINIC facts table (dates / time / ages / cost) and the AUDITION_STEPS list were
// removed 2026-08-17 along with the clinic itself. Both were entirely clinic-specific —
// the steps were "register for it", "attend it August 10–13", "bring a parent to its
// Wednesday session" — and past dates presented as upcoming are worse than no dates at
// all. They were deleted rather than reworded generically because the studio has never
// published what happens after auditions, and inventing a process is the one thing this
// page must not do. Both are recoverable from git history if the clinic runs again.

// What the monthly fee covers, at the studio's direction 2026-08-17. Counts come from
// COMPANY_PRICING so the prose and the price cannot disagree.
//
// The "recommended, not required" wording is load-bearing: the studio's brief said
// "(recommended only)", which reads either as *which* classes are allowed or as whether
// taking them is compulsory. They confirmed the latter — the allowance is part of the fee
// whether the dancer uses it or not. Do not shorten it back to "recommended".
const COMPANY_INCLUDES = [
  {
    headline: `${COMPANY_PRICING.practiceHoursPerWeek} hours of company practice a week`,
    detail: 'Rehearsal and choreography with the company, every week of the season.',
  },
  {
    headline: `Up to ${COMPANY_PRICING.includedClasses} Capital Core dance classes`,
    detail:
      'Included in the monthly fee — recommended, not required. Take them to build technique alongside company work, or stick to rehearsals.',
  },
  {
    headline: 'Extra classes at the standard rate',
    detail: `Anything beyond the ${COMPANY_PRICING.includedClasses} included classes is charged as an additional fee, at the normal monthly rate for that class length.`,
  },
]

function Kicker({ children }) {
  return (
    <p className="text-xs font-bold tracking-[0.4em] uppercase mb-4" style={{ color: RED }}>{children}</p>
  )
}

// Heading block used on the left of the side-by-side sections.
function Heading({ kicker, title }) {
  return (
    <div>
      <Kicker>{kicker}</Kicker>
      <h2 className="font-display uppercase text-4xl sm:text-5xl leading-[0.92] text-balance text-white">
        {title}
      </h2>
    </div>
  )
}

function Marquee() {
  const half = Array.from({ length: 4 }, () => MARQUEE).flat()
  return (
    <div className="bg-ink-base overflow-hidden border-y-4 py-3.5" style={{ borderColor: RED }}>
      <div className="cc-marquee-track">
        {[0, 1].map((g) => (
          <div key={g} className="flex items-center" aria-hidden={g === 1 ? 'true' : undefined}>
            {half.map((w, i) => (
              <span key={`${g}-${i}`} className="flex items-center gap-8 px-8 font-display uppercase text-2xl text-white">
                {w}<span style={{ color: RED }}>★</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DanceCompany() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Capital Core Dance Company | Competition &amp; Performance Team – Midlothian, VA"
        /* The August 10–13 clinic was named here until 2026-08-17. A search result
           advertising a finished event is the same defect as the on-page dates. */
        description="The Capital Core Dance Company is the youth performance and competition program at Capital Core Dance Studio in Midlothian, VA. Bold, beginner-friendly, family-first, ages 6+. Join our founding 2026/2027 season, led by director Yul Tyler Jr."
        canonical="/dance-company"
        jsonLd={[simpleBreadcrumb('Dance Company', '/dance-company')]}
      />
      <Navbar />

      <Hero
        eyebrow="Founding Season · 2026 – 2027"
        title={['Dance', [{ text: 'company', accent: RED }]]}
        tagline="Where passion meets purpose"
        body="Become a founding member of the Capital Core Dance Company — relentless training, fearless performances, and a family-first culture where every dancer is built to shine."
        photoCaption="Company on stage"
        photoSrc="/dance-company-hero.jpg"
        photoAlt="Capital Core Dance Company dancers in navy costumes performing on stage under theatre lights"
        clipStart={22}
        actions={
          <>
            <PrimaryAction to={JOIN_PATH}>Join the company</PrimaryAction>
            <GhostAction href="#founding-clinic">Missed the clinic?</GhostAction>
          </>
        }
      />

      <Marquee />

      <main className="flex-1">
        {/* ── Intro (white · split) ───────────────────────────────────── */}
        <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
            <Heading kicker="The Company" title="A youth performance company" />
            <div>
              <p className="text-mist-300 text-base leading-relaxed mb-4">
                The Capital Core Dance Company is the performance and competition program at Capital Core Dance
                Studio. Built for dancers ages 6+, we develop strong technical foundations, confidence,
                artistry, and lifelong friendships.
              </p>
              <p className="text-mist-300 text-base leading-relaxed mb-5">
                First-time competitor or seasoned veteran — this program pushes every dancer to their full
                potential through elite instruction, real performance opportunities, and a team that has your back.
              </p>
              <p className="font-display uppercase text-xl sm:text-2xl leading-tight" style={{ color: RED }}>
                Every great dancer starts with a willingness to learn.
              </p>
            </div>
          </div>
        </section>

        {/* ── Vision (navy · split) ───────────────────────────────────── */}
        <section className="bg-ink-base px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
            <div>
              <Heading kicker="Our Vision" title="Success is more than trophies" />
              <p className="text-mist-400 text-base mt-5">We build dancers who are:</p>
            </div>
            <ul className="grid grid-cols-1 gap-y-4">
              {VISION.map((v) => (
                <li key={v} className="flex items-center gap-4 border-b border-white/15 pb-3">
                  <span className="font-display text-xl" style={{ color: RED }}>/</span>
                  <span className="font-display uppercase text-xl sm:text-2xl text-white">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Every dancer (white · split) ────────────────────────────── */}
        <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
            <div>
              <Heading kicker="A Place for Every Dancer" title="Beginners welcome. Always." />
              <p className="text-mist-300 text-base leading-relaxed mt-5">
                We welcome dancers of every level — beginner-friendly, with room for experienced dancers to keep
                pushing.
              </p>
              <p className="font-display uppercase text-2xl mt-6" style={{ color: RED }}>
                There is a place for them here.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {EVERY_DANCER.map((e) => (
                <li key={e} className="flex items-start gap-3 text-mist-300 border-b border-white/[0.12] pb-3">
                  <span className="font-bold mt-0.5 flex-shrink-0" style={{ color: RED }}>▸</span>
                  <span className="text-base">{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── More than competitions (navy · split) ───────────────────── */}
        <section className="bg-ink-base px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
            <Heading kicker="More Than Competitions" title="A full season of moments" />
            <div className="flex flex-wrap gap-3">
              {EXPERIENCES.map((x) => (
                <span key={x} className="font-display uppercase text-sm tracking-wide px-4 py-2 border-2 border-white/25 rounded-sm text-white cursor-default"
                      style={{ transition: 'all .15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = RED; e.currentTarget.style.borderColor = RED }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}>
                  {x}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values (white · header + grid) ──────────────────────────── */}
        <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <Heading kicker="Our Values" title="Built on five" />
              <p className="text-mist-500 text-sm max-w-xs">Everything we do — on and off the stage — starts here.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VALUES.map((v) => (
                <div key={v.name} className="bg-ink-panel border border-white/[0.14] text-white p-6 transition-transform hover:-translate-y-1">
                  <div className="h-1.5 w-12 mb-5" style={{ background: RED }} />
                  <h3 className="font-display uppercase text-2xl mb-3">{v.name}</h3>
                  <p className="text-mist-400 text-sm leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Director (navy · split) ─────────────────────────────────── */}
        <section className="relative overflow-hidden bg-ink-base px-6 lg:px-24 py-16 lg:py-20">
          <div className="absolute inset-y-0 left-0 w-2" style={{ background: RED }} />
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <Kicker>Led By</Kicker>
              <h2 className="font-display uppercase text-5xl sm:text-6xl leading-[0.9] text-white">Yul Tyler Jr.</h2>
              <p className="font-bold text-sm tracking-[0.2em] uppercase mt-4" style={{ color: RED }}>
                Nationally Award-Winning Competition Team Director
              </p>
            </div>
            <div>
              <p className="text-mist-300 text-base leading-relaxed mb-4">
                With over <span className="text-white font-bold">10 years of dance training</span>, Yul
                specializes in lyrical and contemporary with experience across many styles. He has earned
                national titles, multiple regional honors, and choreographed one of the highest-scoring routines
                of an entire competition weekend.
              </p>
              <p className="text-mist-300 text-base leading-relaxed">
                His mission: develop technique, confidence, and artistry — and build performances that leave a
                lasting impression.
              </p>
            </div>
          </div>
        </section>

        {/* ── Training (white · split) ────────────────────────────────── */}
        <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
            <Heading kicker="Training Focus" title="What we train" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {TRAINING.map((t) => (
                <li key={t} className="flex items-center gap-3 border-b border-white/[0.12] pb-2">
                  <span className="font-display" style={{ color: RED }}>/</span>
                  <span className="font-display uppercase text-lg text-white">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Why families (navy · split) ─────────────────────────────── */}
        <section className="bg-ink-base px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
            <Heading kicker="Why Families Choose Us" title="Culture first, always" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {WHY.map((w) => (
                <li key={w} className="flex items-start gap-3">
                  <span className="font-bold mt-0.5 flex-shrink-0" style={{ color: RED }}>✔</span>
                  <span className="text-mist-200 text-base">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Company tuition (navy · split) ──────────────────────────── */}
        <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
          <div
            data-testid="company-tuition"
            className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start"
          >
            <div>
              <Kicker>Company Tuition</Kicker>
              <h2 className="font-display uppercase text-4xl sm:text-5xl leading-[0.92] text-balance text-white">
                ${COMPANY_PRICING.monthly}
                <span className="text-mist-400 text-3xl sm:text-4xl"> a month</span>
              </h2>
              <p className="text-mist-300 text-base leading-relaxed mt-4">
                One flat monthly fee for the whole programme — rehearsal time and studio classes
                together, billed like any other tuition.
              </p>
            </div>
            <ul className="flex flex-col gap-3.5">
              {COMPANY_INCLUDES.map(({ headline, detail }) => (
                <li key={headline} className="border-b border-white/[0.12] pb-3.5">
                  <div className="flex items-start gap-3">
                    <span className="font-bold mt-0.5 flex-shrink-0" style={{ color: RED }}>
                      ✔
                    </span>
                    <div>
                      <div className="font-display uppercase text-white text-lg leading-tight">
                        {headline}
                      </div>
                      <div className="font-body text-mist-400 text-sm leading-relaxed mt-1">
                        {detail}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Missed the clinic (split · flyer kept) ──────────────────── */}
        {/* Flipped from bg-ink-deep to bg-ink-base when the tuition section was inserted
            above it, so the page keeps alternating bands rather than running two
            near-identical navies together. */}
        <section id="founding-clinic" className="bg-ink-base px-6 lg:px-24 py-16 lg:py-20 scroll-mt-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <img
              src="/flyer-comp-team.png"
              alt="Competition Team Building Clinic — founding season auditions August 10 to 13, ages 6+, $80 per dancer, led by director Yul Tyler — Capital Core Dance Studio"
              className="w-full shadow-2xl border border-white/20"
            />
            <div>
              <Kicker>Founding Season</Kicker>
              <h2 className="font-display uppercase text-4xl sm:text-5xl leading-[0.95] mb-4 text-balance text-white">
                Missed the clinic?
              </h2>
              {/* Deliberately promises no second clinic, no waitlist and no placement
                  decision — none of that has been published. It says the only thing that
                  is true: get in touch and the studio picks it up from there. */}
              <p className="text-mist-300 text-base leading-relaxed mb-8">
                The founding-season Team Building Clinic has wrapped. If your dancer still wants to
                be part of the Capital Core Dance Company, send us a message and we will get back to
                you about joining. No competition experience needed — beginners are welcome.
              </p>
              {/* A router Link, not an <a>: /contact is an internal route and a plain
                  anchor would trigger a full page reload out of the SPA. */}
              <Link
                to={JOIN_PATH}
                data-testid="missed-clinic-cta"
                className="block w-full text-white text-center font-bold py-3.5 rounded-sm transition-transform hover:-translate-y-0.5"
                style={{ background: RED }}
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>

        {/* ── Closing (navy + red) ────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-ink-base text-white text-center px-6 py-24">
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 120%, ${RED}, transparent 55%)`, opacity: 0.35 }} />
          <div className="relative max-w-2xl mx-auto">
            <Kicker>Join Our Founding Season</Kicker>
            <h2 className="font-display uppercase text-5xl sm:text-7xl leading-[0.85] mb-6">
              Train. Grow. <span style={{ color: RED }}>Belong.</span>
            </h2>
            <p className="text-mist-300 text-base leading-relaxed mb-10">
              If your dancer is ready to grow, perform, and be part of a team that values excellence,
              confidence, and character — we'd love to welcome you to the Capital Core Dance Company.
            </p>
            <Link to={JOIN_PATH} className="inline-block text-white font-bold px-10 py-4 rounded-sm text-lg transition-transform hover:-translate-y-0.5" style={{ background: RED }}>
              Become a founding member
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
