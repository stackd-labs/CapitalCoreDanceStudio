import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import PhotoSlot from '../components/PhotoSlot'
import {
  Kicker,
  SectionHeading,
  PrimaryAction,
  GhostAction,
  InverseAction,
  CtaBand,
  StatRow,
} from '../components/blocks'
import { localBusinessSchema } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'

// Rebuilt 2026-08-11 to the studio's "Capital Core Site" mockup (page 1a, accent red).
//
// Structure and measurements follow the mockup exactly. Copy and photography are the
// remaining gap: strings marked PLACEHOLDER below are the mockup's own filler and need
// the studio's words, and every PhotoSlot without a `src` renders a captioned empty well
// until real art is supplied.

// The wordmark line — each letter of CORE takes one brand accent, in stripe order.
const CORE_LETTERS = [
  { text: 'C', accent: ACCENTS.red },
  { text: 'O', accent: ACCENTS.orange },
  { text: 'R', accent: ACCENTS.gold },
  { text: 'E', accent: ACCENTS.teal },
]

const PROGRAMS = [
  {
    to: '/classes',
    name: 'Recreational',
    blurb:
      'Ballet, jazz, hip hop, tap, contemporary, acro and tumble for ages 2 through adult. Fall registration is open.',
    photoCaption: 'Rec class · photo',
    photoSrc: '/card-classes.jpg',
    photoAlt: 'Kids dance class at Capital Core Dance Studio in Midlothian, VA',
  },
  {
    to: '/dance-company',
    name: 'Dance Company',
    blurb:
      'Our youth performance and competition program. Founding season 2026/2027, beginner-friendly, ages 6 and up.',
    // No src: the only Dance Company art in the repo is the audition-clinic flyer, and
    // a poster in a photo well reads as a mistake. Awaiting a team photograph.
    photoCaption: 'Company team · photo',
  },
  {
    to: '/little-movers',
    name: 'Little Movers',
    blurb:
      'A movement-based enrichment program for infants, toddlers and preschoolers, with a caregiver alongside.',
    // No src — same reason; the Little Movers asset is a "coming soon" graphic.
    photoCaption: 'Toddler class · photo',
  },
]

// PLACEHOLDER — the mockup ships three invented figures. Confirm with the studio before
// these go live; a wrong dancer-to-teacher ratio is a claim, not decoration.
const STATS = [
  { value: '12', label: 'Class styles' },
  { value: '6:1', label: 'Dancer ratio' },
  { value: '2', label: 'Studios' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Capital Core Dance Studio | Dance Classes in Midlothian, VA"
        description="Capital Core Dance Studio offers ballet, hip hop, jazz, contemporary, and tap classes for kids and adults in Midlothian, VA. Year-round programs, Fall 2026 classes, birthday parties, and an annual recital. Serving Chesterfield County and Richmond."
        canonical="/"
        jsonLd={localBusinessSchema}
      />
      <Navbar />

      <Hero
        /* The five-accent stripe panel belongs to Home alone — every other page uses a
           single solid accent wedge. Hero defaults to 'solid', so this must be explicit;
           omitting it once already turned this hero into a plain red slab. */
        variant="stripe"
        eyebrow="Now enrolling · 2026 – 2027"
        title={['Every dancer', ['has a ', ...CORE_LETTERS].map((c) => (typeof c === 'string' ? { text: c } : c))]}
        tagline="Recreational · Competition · Little Movers"
        /* PLACEHOLDER — mockup filler, needs the studio's own intro. */
        body="Classes for every age from two through adult, taught by a faculty who know every dancer by name. Your first class is always free — come see the room before you commit."
        photoCaption="Hero photo · full studio"
        actions={
          <>
            <PrimaryAction to="/classes">Find a class</PrimaryAction>
            <GhostAction to="/about">Tour the studio</GhostAction>
          </>
        }
      />

      {/* Programs */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-7">
          {PROGRAMS.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="flex flex-col border border-white/[0.12] hover:border-white/40 transition-colors group"
            >
              <div className="h-[190px] overflow-hidden">
                <PhotoSlot
                  src={p.photoSrc}
                  alt={p.photoAlt}
                  caption={p.photoCaption}
                  className="w-full h-full"
                />
              </div>
              <div className="px-[26px] pt-[26px] pb-[30px]">
                <div className="font-display uppercase text-white text-[27px] leading-none mb-2.5">
                  {p.name}
                </div>
                <div className="font-body text-[14.5px] leading-[1.55] text-mist-400">{p.blurb}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* The studio */}
      <section className="bg-ink-base px-6 lg:px-24 py-16 lg:py-[86px]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[70px] items-center">
          <div className="h-[300px] lg:h-[400px] border border-white/[0.12]">
            <PhotoSlot caption="Studio interior · wide" className="w-full h-full" />
          </div>
          <div>
            <Kicker>The studio</Kicker>
            <SectionHeading className="text-white mb-5">
              {/* The explicit space matters: without it the <br/> makes the accessible
                  name "A room thatraises the floor", which is what a screen reader
                  announces even though the page looks right. */}
              A room that{' '}
              <br />
              raises the floor
            </SectionHeading>
            {/* PLACEHOLDER — mockup filler. */}
            <p className="font-body text-[16.5px] leading-[1.65] text-mist-300 max-w-[460px] m-0 mb-7">
              Two studios on Midlothian Turnpike, small classes, and a faculty who teach every
              level from a first plié to competition choreography. Come by for a tour or take a
              free trial class.
            </p>
            <StatRow stats={STATS} />
          </div>
        </div>
      </section>

      <CtaBand
        headline="Registration is open"
        action={<InverseAction to="/classes">Browse the schedule</InverseAction>}
      />

      <Footer />
    </div>
  )
}
