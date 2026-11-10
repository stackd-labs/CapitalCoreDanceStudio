import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, CtaBand, InverseAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent, textAccent } from '../lib/accentContrast'

// Rebuilt 2026-08-11 to the studio's site mockup (page 1c, accent teal). The mockup
// carries a hero, a row of age-tier cards and a "what a class looks like" strip; the
// studio's own content — six classes, the benefits list, the weekday-morning grid and
// the three pricing options — is kept and restyled onto the navy field.
const ACCENT = ACCENTS.teal

// Little Movers has its own portal form, live as of 2026-08-28 — NOT the /register/classes
// one the Classes and Class Levels pages use, and not /register/adult-classes either. This
// form books a single Little Movers class and carries the drop-in, passport and membership
// options priced below.
//
// The portal moved the form to the /book path on 2026-09-02; the bare
// /register/little-movers URL this used to point at is no longer the booking page.
//
// This is the PERSISTENT programme call to action and it has no end date.
//
// 🔴 BOOKING PAUSED 2026-11-10 (the studio's call: Ms. Ryan is out). The page stays up for
// information, every Book button became "Join the waitlist", and the portal form is the
// open-house-style lead form below. The portal also refuses little_movers bookings
// server-side (LM_BOOKING_OPEN in dancestudioportal's lib/little-movers-status.ts), so
// reopening takes BOTH: flip that flag and point WAITLIST_URL back at /register/little-movers/book.
const WAITLIST_URL = 'https://studio.capitalcoredance.com/register/little-movers-waitlist'

// All six classes again (2026-11-10), back on the page while Little Movers is paused so
// families can see what the waitlist is for. Copy and ages restored from git history
// (before the 2026-10-12 cut to one class); Moovin' & Groovin' keeps its current wording.
// None of these are bookable: see WAITLIST_URL above.
const CLASSES = [
  {
    name: 'Baby & Me',
    ages: '0–18 months',
    description: 'Gentle movement, music, sensory exploration, and bonding.',
  },
  {
    name: 'Parent & Me Dance',
    ages: '18 months–3 years',
    description: 'Interactive movement classes designed for toddlers and caregivers.',
  },
  {
    name: "Moovin' & Groovin'",
    ages: '18 months–5 years',
    // The partnership is credited on the card, not in a schedule.
    partner: 'Our signature class, in partnership with Miss Ryan',
    description:
      'Parents and caregivers participate alongside their little one in a signature movement and music experience featuring creative dance and active learning.',
  },
  {
    name: 'Tiny Tumblers',
    ages: '18 months–5 years',
    description: 'Beginner tumbling, balance, flexibility, and coordination.',
  },
  {
    name: 'Sensory Steps',
    ages: '18 months–5 years',
    description: 'Movement-based sensory exploration with props, music, and imaginative play.',
  },
  {
    name: 'Little Movers Free Play Lab',
    ages: '18 months–5 years',
    description: 'Supervised obstacle courses, climbing, balance stations, and active play.',
  },
]

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

const DROP_IN_PRICE = 5

// Three ways to join, framed by how often a family expects to come rather than by
// price. `question` is the headline a parent recognises themselves in. The per-card
// border colour was dropped in the 2026-08-11 redesign — every card now sits on the
// page's single teal accent.
//
// 🔴 NO DISCOUNTS ARE ADVERTISED (studio's call, 2026-10-08, "for now"): the sibling rates,
// the MOOVE26 code and the membership's 10% off parties and retail were all taken off this
// page. The portal's little-movers-pricing.ts and promos.ts still apply them at checkout,
// so they are on the portal punch list for the same change.
const PRICING = [
  {
    question: 'Just want to try it?',
    label: 'Drop-In',
    headline: `$${DROP_IN_PRICE}`,
    unit: 'per class',
    blurb: 'Pay as you go. Come to any single class on the booking calendar, with nothing to sign up for.',
    lines: ['Good for any Little Movers class', 'No membership or commitment'],
  },
  {
    question: 'Come when you can',
    label: 'Little Movers Passport',
    headline: '5 visits — $40',
    unit: 'or 10 visits — $80',
    blurb: 'A class pack that never locks you into a day or time — use the visits whenever your week allows.',
    lines: ['Works for any Little Movers class', '5 visits for the price of 4', '10 visits for the price of 8 ($8 a class)'],
  },
  {
    question: "We're here every week",
    label: 'Little Movers Membership',
    // Paused 2026-10-12: still visible, greyed out, no price. Contact the studio.
    // The $89 price and perks are in git history (before 2026-10-12) for when it comes back.
    disabled: true,
    headline: 'Contact the studio',
    unit: 'monthly membership',
    blurb: 'Monthly memberships are not available to book online right now. Contact the studio to ask about joining.',
    lines: [],
  },
]

// The teacher behind Moovin' & Groovin', added 2026-10-14 from her own bio. Third person on
// purpose: these are her facts in the studio's voice, not words put in her mouth.
const RYAN_NAVY = '#0d1b34' // the page's own navy (bg-ink-base)
const RYAN_YELLOW = '#f5c518'
const MISS_RYAN = {
  photo: '/instructor-ryan.jpg',
  photoAlt: "Miss Ryan, founder of Moovin' & Groovin' and Little Movers teacher, smiling in a bright pink sweatshirt",
  chips: ['Cheer', 'Hip-hop', 'Gymnastics', '10+ years with little ones'],
  bio: [
    "Meet Miss Ryan, the creator of Moovin' & Groovin' and the reason a room full of toddlers ends up dancing like nobody is watching. She built the class around one big idea: movement should be fun, so every little body gets the freedom to wiggle, try new things, and celebrate everything it can do.",
    "Her bag of tricks comes from cheer, hip-hop and gymnastics, plus more than ten years of professional childcare, so she knows exactly how to keep tiny dancers giggling and growing. Away from the studio you will find her running, hiking, making something new, or leading ministry groups in her community.",
  ],
  closer: "She cannot wait to meet your family. Come get moving!",
}

const LITTLE_MOVERS_JSON_LD = [simpleBreadcrumb('Little Movers', '/little-movers')]

// PLACEHOLDER — the four steps come from the mockup, not the studio. They read true for
// a toddler class but need confirming before launch.
const CLASS_SHAPE = [
  { n: '01', name: 'Arrive & warm up', blurb: 'Shoes off, circle up, and a song to settle everyone in.' },
  { n: '02', name: 'Skill of the week', blurb: 'One idea at a time — a shape, a step, a way to balance.' },
  { n: '03', name: 'Dance & play', blurb: 'Props, music and free movement across the floor.' },
  { n: '04', name: 'Stickers & goodbye', blurb: 'A calm finish, a sticker, and something to show you.' },
]

export default function LittleMovers() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Little Movers | Toddler &amp; Preschool Movement Classes in Midlothian, VA — Capital Core Dance"
        description="Little Movers at Capital Core Dance in Midlothian, VA. A movement-based enrichment program for infants, toddlers, and preschoolers combining dance, music, sensory play, tumbling, and active exploration. Join our waitlist for spring 2027 to be the first to know when classes return."
        canonical="/little-movers"
        jsonLd={LITTLE_MOVERS_JSON_LD}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 min-w-0">

      <Hero
        eyebrow="Ages 0 – 5 years"
        title={['Little', [{ text: 'Movers', accent: ACCENT }]]}
        tagline="Movement. Play. Learn. Grow."
        body="Join our waitlist for spring 2027. Little Movers is a first dance experience for infants, toddlers and preschoolers, built on music, sensory play and active exploration."
        photoCaption="Toddlers in class"
        photoSrc="/little-movers-hero.jpg"
        photoAlt="Five toddlers in pastel leotards and tutus standing at the barre in a Little Movers class"
        clipStart={20}
        titleClassName="text-[42px] sm:text-[56px] lg:text-[76px] leading-[0.92]"
        actions={
          <>
            <PrimaryAction href={WAITLIST_URL}>Join the waitlist →</PrimaryAction>
          </>
        }
      />

      {/* The classes, straight under the hero (2026-11-10): all six, none bookable. The
          heading carries no count, because a hardcoded number goes stale when a class moves. */}
      <section id="classes" className="px-6 lg:px-24 py-16 lg:py-20 scroll-mt-24">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>The classes</Kicker>
          <SectionHeading className="text-white mb-3">Our classes</SectionHeading>
          <p className="font-body text-mist-400 text-sm mb-10 max-w-2xl">
            Join our waitlist for spring 2027. These are the classes we plan to offer when Little
            Movers returns. No Little Movers class is drop-off: a parent or caregiver is welcome to
            stay in the class or wait in the studio.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px]">
            {CLASSES.map(({ name, ages, description, partner }) => (
              <div
                key={name}
                data-testid="little-movers-class"
                className="border border-white/[0.12] px-7 pt-8 pb-[34px]"
              >
                <div className="font-display text-[34px] leading-none" style={{ color: textAccent(ACCENT) }}>
                  {ages}
                </div>
                <div className="flex items-start justify-between gap-3 mt-3 mb-3">
                  <div
                    data-testid="class-name"
                    className="font-display uppercase text-white text-[26px] leading-none"
                  >
                    {name}
                  </div>
                </div>
                <p className="font-body text-[14.5px] leading-[1.6] text-mist-400 mb-4 m-0">
                  {description}
                </p>
                {partner && (
                  <div
                    data-testid="class-partner"
                    className="font-body text-[12px] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: textAccent(ACCENT) }}
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
                  style={{ color: textAccent(ACCENT) }}
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
                <span className="flex-shrink-0" style={{ color: textAccent(ACCENT) }}>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Meet the teacher. A cyan band on the otherwise navy page, so she stands out: navy
          type and navy accents on the page's teal, with the yellow sticker kept. Square photo with an
          offset block (the site has no rounded corners by design); the chips are her real
          background from her bio. */}
      <section
        data-testid="meet-miss-ryan"
        className="px-6 lg:px-24 py-16 lg:py-20"
        style={{ background: ACCENT, color: RYAN_NAVY }}
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-12 lg:gap-16 items-center">
          <div className="relative mx-auto w-full max-w-[420px]">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-4 translate-y-4"
              style={{ background: RYAN_NAVY }}
            />
            <img
              src={MISS_RYAN.photo}
              alt={MISS_RYAN.photoAlt}
              width="700"
              height="700"
              loading="lazy"
              className="relative block w-full h-auto aspect-square object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute -top-4 -right-3 sm:-right-5 rotate-6 px-3.5 py-2 font-display uppercase text-[15px] leading-none"
              style={{ background: RYAN_YELLOW, color: RYAN_NAVY }}
            >
              Let&apos;s get moovin&apos;!
            </div>
          </div>

          <div>
            <div
              className="font-body font-semibold text-[11.5px] tracking-[0.3em] uppercase mb-4 inline-block pb-1.5 border-b-[3px]"
              style={{ borderColor: RYAN_YELLOW }}
            >
              Meet your teacher
            </div>
            <SectionHeading className="mb-6">Hi, it&apos;s Miss Ryan!</SectionHeading>
            {MISS_RYAN.bio.map((p) => (
              <p key={p.slice(0, 24)} className="font-body text-[15.5px] leading-[1.7] mb-4 max-w-xl" style={{ color: RYAN_NAVY }}>
                {p}
              </p>
            ))}
            <ul className="flex flex-wrap gap-2.5 mt-6 mb-6 list-none p-0">
              {MISS_RYAN.chips.map((chip) => (
                <li
                  key={chip}
                  data-testid="ryan-chip"
                  className="font-body text-[12px] font-bold uppercase tracking-[0.12em] px-3.5 py-2 border-2"
                  style={{ borderColor: RYAN_NAVY, color: RYAN_NAVY }}
                >
                  {chip}
                </li>
              ))}
            </ul>
            <p className="font-display uppercase text-[22px] leading-tight m-0">{MISS_RYAN.closer}</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Pricing</Kicker>
          <SectionHeading className="text-white mb-3">
            Flexible options for every family
          </SectionHeading>
          <p className="font-body text-mist-400 text-sm mb-10 max-w-2xl">
            Classes are paused, so nothing is bookable right now. These are the options we plan to
            offer when Little Movers returns. Monthly memberships are paused as well.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[26px]">
            {PRICING.map(({ question, label, headline, unit, badge, blurb, lines, disabled }) => (
              <div
                key={label}
                data-testid="pricing-card"
                aria-disabled={disabled || undefined}
                className={`border border-white/[0.12] bg-ink-base px-7 py-7 flex flex-col${disabled ? ' opacity-50' : ''}`}
              >
                <p className="font-body text-mist-300 text-sm font-semibold">{question}</p>
                <div className="flex items-center justify-between gap-3 mt-1">
                  <p
                    className="font-body text-[10px] font-bold tracking-[0.3em] uppercase"
                    style={{ color: textAccent(ACCENT) }}
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
                      <span className="flex-shrink-0" style={{ color: textAccent(ACCENT) }}>
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
            <Link to="/tuition" className="font-semibold hover:underline" style={{ color: textAccent(ACCENT) }}>
              Tuition
            </Link>{' '}
            for our regular class rates.
          </p>
        </div>
      </section>

      <CtaBand
        accent={ACCENT}
        headline="Ready to Get Moving?"
        body="Join our waitlist for spring 2027. We will let you know the moment Little Movers classes are back."
        action={<InverseAction href={WAITLIST_URL}>Join the waitlist →</InverseAction>}
      />

      </main>
      <Footer />
    </div>
  )
}
