import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import PhotoSlot from '../components/PhotoSlot'
import InstagramFeed from '../components/InstagramFeed'
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
import { SCHEDULE } from '../lib/schedule'
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

// The landing grid. Renamed from PROGRAMS on 2026-08-17 when Birthdays, Adult Classes and
// Contact Us were added: Contact is not a programme, and calling the array PROGRAMS would
// have made the next reader wonder why it was in there. Six entries fill two clean rows of
// the three-column grid.
//
// Every entry needs real art — see the test that forbids a placeholder well here. This
// grid is the first thing on the page after the hero.
const HOME_CARDS = [
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
    photoCaption: 'Company team · photo',
    // A 16:9 crop of the same stage photograph the Dance Company hero uses, cut to the
    // card shape (the hero's is a portrait well) so the dancers' faces survive the
    // card's much wider box.
    photoSrc: '/card-dance-company.jpg',
    photoAlt: 'Capital Core Dance Company dancers performing on stage in navy costumes',
  },
  {
    to: '/little-movers',
    name: 'Little Movers',
    blurb:
      'A movement-based enrichment program for infants, toddlers and preschoolers, with a caregiver alongside.',
    photoCaption: 'Toddler class · photo',
    // 16:9 crop of the Little Movers hero photograph, cut to the card shape for the
    // same reason as the Dance Company card above.
    photoSrc: '/card-little-movers.jpg',
    photoAlt: 'Toddlers in pastel leotards and tutus at the barre in a Little Movers class',
  },
  {
    to: '/birthdays',
    name: 'Birthdays',
    blurb:
      'A private studio, an instructor-led dance party, and no cleanup. From $199 for 90 minutes and up to 10 children.',
    photoCaption: 'Birthday party · photo',
    photoSrc: '/card-birthdays.jpg',
    photoAlt: 'Children celebrating at a dance birthday party at Capital Core Dance Studio',
  },
  {
    to: '/adult-classes',
    name: 'Adult Classes',
    blurb:
      'Evening classes for dancers 16 and up — Femme Flair, Pom and Contemporary. Beginner-friendly, and your first class is free.',
    photoCaption: 'Adult class · photo',
    photoSrc: '/card-adult-dance.jpg',
    photoAlt: 'Adult dancers in an evening class at Capital Core Dance Studio',
  },
  {
    to: '/contact',
    name: 'Contact Us',
    blurb:
      'Questions about a class, a studio tour, or booking a free trial — tell us what you need and we will get back to you.',
    photoCaption: 'Studio crest',
    // The crest rather than a photograph, and `contain` rather than `cover`, for the same
    // reason the About hero does it: this block is not a class, and there is no
    // "contact us" photograph to use. /logo.png is the transparent PNG — card-contact.png
    // is the same crest on an opaque white square, which would punch a white hole in a row
    // of navy cards and be cropped through the shield by a 2.3:1 well.
    photoSrc: '/logo.png',
    photoFit: 'contain',
    photoAlt: 'Capital Core Dance Studio crest',
  },
]

// Two of the mockup's three invented figures came out on 2026-08-19. "6:1 dancer
// ratio" and "2 studios" appeared nowhere else on the site and nobody had confirmed
// them, and a ratio is a promise a parent can hold the studio to. The class count is
// counted from the schedule rather than typed, so it cannot go stale when a class is
// added or dropped; the style count matches the list in the FAQ answer, which is
// itself taken from the schedule. Give us real figures and they can go back in.
const CLASS_COUNT = SCHEDULE.reduce((total, day) => total + day.classes.length, 0)

const STATS = [
  { value: String(CLASS_COUNT), label: 'Classes a week' },
  { value: '12', label: 'Class styles' },
  { value: 'Free', label: 'First class' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Capital Core Dance Studio | Dance Classes in Midlothian, VA"
        /* The annual recital came out of this on 2026-08-19. It was removed from the
           site after the June 2026 show and taken out of the FAQ on purpose; this
           string and the one on Blog.jsx were the two places still promising it.
           Little Movers and the Dance Company take its place — they are what the
           studio is actually selling. */
        description="Capital Core Dance Studio offers ballet, hip hop, jazz, contemporary, and tap classes for babies through adults in Midlothian, VA. Year-round programs, Fall 2026 classes, Little Movers, adult evening classes, the Dance Company, and birthday parties. Serving Chesterfield County and Richmond."
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
        /* PLACEHOLDER — mockup filler, needs the studio's own intro. The free-trial
           offer is a link to Contact as of 2026-08-13: it is the one claim here a visitor
           can act on, and booking a free class goes through the studio rather than the
           registration portal. */
        body={
          <>
            {/* "from two through adult" stopped being true when Little Movers opened
                with a class for 0 to 18 months. The FAQ was updated at the time and
                this was not, which left the whole under-two programme invisible in
                the studio's headline claim. */}
            Classes for every age from babies through adults, taught by a faculty who know
            every dancer by name.{' '}
            <Link
              to="/contact"
              data-testid="free-trial-link"
              className="font-semibold underline underline-offset-2 text-white hover:opacity-80 transition-opacity"
            >
              Your first class is always free
            </Link>{' '}
            — come see the room before you commit.
          </>
        }
        photoCaption="Hero photo · full studio"
        photoSrc="/home-hero-collage.jpg"
        photoAlt="A collage of Capital Core dancers — toddlers at the barre, hip hop, acro, ballet, and the company on stage"
        actions={
          <>
            <PrimaryAction to="/classes">Find a class</PrimaryAction>
            <GhostAction to="/about">Tour the studio</GhostAction>
          </>
        }
      />

      {/* Link blocks — programmes plus Birthdays / Adult Classes / Contact */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-7">
          {HOME_CARDS.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              data-testid="home-card"
              className="flex flex-col border border-white/[0.12] hover:border-white/40 transition-colors group"
            >
              <div className="h-[190px] overflow-hidden">
                <PhotoSlot
                  src={p.photoSrc}
                  alt={p.photoAlt}
                  caption={p.photoCaption}
                  fit={p.photoFit}
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
            {/* A group portrait shot in the room rather than an empty wide shot: the
                section's claim is about the room's effect on dancers, and the barre,
                window and studio banner still read behind them. The well is wider than
                the photograph (1.65:1 against 1.25:1), so object-cover crops top and
                bottom — the 35% vertical position keeps the faces clear of the top edge
                at both the 400px desktop and 300px mobile heights. */}
            <PhotoSlot
              src="/home-studio-dancers.jpg"
              alt="Five Capital Core dancers in leotards standing together at the barre in the Midlothian studio"
              caption="Studio interior · wide"
              objectPosition="center 35%"
              className="w-full h-full"
            />
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
            {/* PLACEHOLDER — mockup filler, still needs the studio's own words. The
                opening claim used to be "Two studios on Midlothian Turnpike", which is
                the same unconfirmed figure that was in the stat row above; it came out
                on 2026-08-19. Everything left here is true of the studio. */}
            <p className="font-body text-[16.5px] leading-[1.65] text-mist-300 max-w-[460px] m-0 mb-7">
              A room on Midlothian Turnpike, small classes, and a faculty who teach every
              level from a first plié to competition choreography. Come by for a tour or take a
              free trial class.
            </p>
            <StatRow stats={STATS} />
          </div>
        </div>
      </section>

      {/* The studio's Instagram, read live from Behold. Sits here rather than in the
          footer because it is the freshest thing on the page: the photographs above are
          months old by design and this row is whatever happened in class last week. */}
      <InstagramFeed />

      {/* Hiring strip. Deliberately slim and in the Careers accent rather than Home's
          red: it points off this page, and it must not compete with the registration
          band directly below it. Careers has no navbar entry, so this and the footer
          link are the only two ways in. */}
      <Link
        to="/careers"
        data-testid="hiring-strip"
        className="group block bg-ink-deep border-t-[3px] px-6 lg:px-24 py-7 lg:py-8 transition-colors hover:bg-ink-panel focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
        style={{ borderColor: ACCENTS.blue }}
      >
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div
              className="font-body font-semibold text-[11px] tracking-[0.3em] uppercase mb-2"
              style={{ color: ACCENTS.blue }}
            >
              We are hiring
            </div>
            <p className="font-body text-[16.5px] leading-[1.5] text-white m-0">
              Preschool and Irish dance instructors for the 2026 – 2027 season, plus studio
              affiliates and community partners.
            </p>
          </div>
          <span
            className="font-body font-bold text-[15px] whitespace-nowrap group-hover:underline"
            style={{ color: ACCENTS.blue }}
          >
            See open roles &rarr;
          </span>
        </div>
      </Link>

      <CtaBand
        headline="Registration is open"
        action={<InverseAction to="/classes">Browse the schedule</InverseAction>}
      />

      <Footer />
    </div>
  )
}
