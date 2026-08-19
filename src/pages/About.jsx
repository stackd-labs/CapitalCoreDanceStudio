import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import StaffCard from '../components/StaffCard'
import { INSTRUCTORS } from '../lib/instructors'
import {
  Kicker,
  SectionHeading,
  PrimaryAction,
  GhostAction,
  CtaBand,
  InverseAction,
} from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'

// Rebuilt 2026-08-11 to the studio's site mockup (page 1e, accent gold): hero, a
// two-column story block, and a four-up staff grid. All prose below is the studio's
// own, carried over unchanged — only the staff section is new, and it is a scaffold.
const ACCENT = ACCENTS.gold

const PILLARS = [
  {
    eyebrow: 'Whole Dancer',
    label: 'We focus on more than choreography',
    body: 'Our goal is not just to teach choreography. We develop coordination, musicality, athleticism, confidence, and creativity in every dancer.',
  },
  {
    eyebrow: 'Studio Culture',
    label: 'We create a positive environment',
    body: 'Every dancer deserves to feel welcome and supported. Our studio culture is built on encouragement, respect, and teamwork.',
  },
  {
    eyebrow: 'Growth',
    label: 'We offer many ways to grow',
    body: 'From technique classes and performances to camps, workshops, and community events — dancers have many ways to develop and express themselves.',
  },
  {
    eyebrow: 'Community',
    label: 'We build a strong community',
    body: 'Capital Core Dance is more than a studio — it is a place where dancers and families connect, celebrate milestones, and grow together.',
  },
]

// Updated 2026-08-19. This list still advertised summer camps, retired in July, and
// omitted Little Movers and the Dance Company — the two programmes the studio is
// actively building, and the only two with their own top-level navbar entries.
const PROGRAMS = [
  'Little Movers for Babies, Toddlers and Preschoolers',
  'Preschool Creative Movement',
  'Ballet, Jazz, Tap, and Hip Hop',
  'Acro and Tumbling',
  'Musical Theatre and Performance Classes',
  'The Capital Core Dance Company',
  'Adult Dance and Fitness Classes',
  'Birthday Parties and Special Events',
]

// The staff scaffold was replaced with real people on 2026-08-13, when the studio
// supplied six "Meet the Instructor" flyers. Names, roles and bios live in
// src/lib/instructors.js — see that file for what is and is not on a flyer. Three of the
// nine instructors the Fall flyer names have no profile yet, hence the note under the
// heading: the section says the roster is incomplete rather than implying it is the
// whole faculty.

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="About Us | Capital Core Dance Studio – Midlothian, VA"
        description="Capital Core Dance Studio is a family-focused dance school in Midlothian, VA, building confident, skilled dancers through ballet, jazz, hip hop, tap, and more. Serving Chesterfield County and the Richmond area."
        canonical="/about"
        jsonLd={simpleBreadcrumb('About', '/about')}
      />
      <Navbar />

      <Hero
        // The mockup reads "EST. 2025"; the studio has not confirmed a founding year, so
        // this states where they are instead of asserting a date that may be wrong.
        eyebrow="Midlothian, Virginia"
        title={['About', [{ text: 'us', accent: ACCENT }]]}
        tagline="Family first, always"
        body="Where confidence, creativity, and community take center stage — a studio built on the belief that every dancer belongs."
        photoCaption="Team photo"
        /* The crest rather than a photograph, at the studio's request 2026-08-13. It is
           `contain` so the well cannot crop through the shield, and nothing is painted
           behind it — the accent panel shows through the transparent PNG. */
        photoSrc="/logo.png"
        photoAlt="Capital Core Dance Studio crest"
        photoFit="contain"
        clipStart={24}
        actions={
          <>
            <PrimaryAction href="#staff">Meet the staff</PrimaryAction>
            <GhostAction to="/contact">Tour the studio</GhostAction>
          </>
        }
      />

      {/* Our story */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-[84px]">
        {/* The prose now takes the larger share. The old 1fr/1.05fr gave the right-hand
            column the edge, which suited a 380px photograph but makes a three-word quote
            float in dead space. */}
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <Kicker accent={ACCENT}>Our story</Kicker>
            <SectionHeading className="text-white mb-5">
              Built on a belief that {''}
              <br />
              every dancer belongs
            </SectionHeading>
            <p className="font-body text-[16px] leading-[1.7] text-mist-300 m-0 mb-4">
              Capital Core Dance was founded on the belief that dance should be a place where every
              student feels confident, supported, and inspired to grow.
            </p>
            <p className="font-body text-[16px] leading-[1.7] text-mist-300 m-0">
              Dance is more than movement — it is discipline, creativity, resilience, and
              self-expression. We focus on helping dancers develop strong technique while also
              building confidence, character, and a lifelong love of movement. Whether a dancer is
              stepping into their very first class or continuing to build their skills, our
              programs are designed to support growth at every level.
            </p>
          </div>
          {/* Replaced the "Founders portrait" well 2026-08-17. The studio never supplied a
              founders photograph, and a hatched placeholder that has shipped for six days
              reads as a broken page rather than as a reserved slot.
              The line is the hero's tagline, deliberately, rather than copy written for
              this space: everything on this page is the studio's own words and a pull-quote
              is not the place to start inventing some. It could not be drawn from the
              paragraphs beside it either — a pull-quote that repeats the body text it sits
              next to, or this section's own heading, is noise. */}
          <figure
            data-testid="story-pullquote"
            className="border-l-[3px] pl-7 lg:pl-10 py-1 m-0"
            style={{ borderColor: ACCENT }}
          >
            {/* The {' '} is load-bearing, as on the headings above: JSX trims the
                whitespace at a line end, so without it the <br/> yields the text content
                "Family first,always" — which looks correct on screen and is exactly what a
                screen reader announces. */}
            <blockquote className="font-display uppercase text-white text-[38px] lg:text-[52px] leading-[0.95] m-0">
              Family first,{' '}
              <br />
              always
            </blockquote>
            <figcaption className="font-body text-[11.5px] font-semibold tracking-[0.16em] uppercase text-mist-500 mt-6">
              The belief the studio was built on
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Our approach */}
      <section className="px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <Kicker accent={ACCENT}>Our approach</Kicker>
            <SectionHeading className="text-white mb-5">
              Strong instruction. {''}
              <br />
              Supportive environment.
            </SectionHeading>
            <p className="font-body text-[16px] leading-[1.7] text-mist-300 m-0 mb-4">
              At Capital Core Dance, we believe that the best dance education combines strong
              instruction with a supportive environment. Our classes are designed to challenge
              dancers while also encouraging creativity, teamwork, and confidence.
            </p>
            <p className="font-body text-[16px] leading-[1.7] text-mist-300 m-0">
              We celebrate progress, effort, and individuality — helping each dancer discover their
              unique strengths. Our studio is a place where dancers are encouraged to try new
              things, build friendships, and take pride in their accomplishments both inside and
              outside the studio.
            </p>
          </div>
          <div>
            <Kicker accent={ACCENT}>Our vision</Kicker>
            <SectionHeading className="text-white mb-5">
              More than technique
            </SectionHeading>
            <p className="font-body text-[16px] leading-[1.7] text-mist-300 m-0 mb-4">
              We believe a dance studio should be a place where dancers build more than technique —
              it should be a place where they build confidence, friendships, discipline, and joy.
            </p>
            <p className="font-body text-[16px] leading-[1.7] text-mist-300 m-0">
              Capital Core Dance is committed to creating a space where dancers feel proud of their
              progress, excited to perform, and supported every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>What makes us different</Kicker>
          <SectionHeading className="text-white mb-10">Four things we stand by</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map(({ eyebrow, label, body }) => (
              <div
                key={label}
                data-testid="pillar"
                className="border-t-[3px] pt-[18px]"
                style={{ borderColor: ACCENT }}
              >
                <div
                  className="font-body text-[11px] font-semibold tracking-[0.2em] uppercase mb-2.5"
                  style={{ color: ACCENT }}
                >
                  {eyebrow}
                </div>
                <div className="font-body font-bold text-[18px] leading-[1.3] text-white mb-2">
                  {label}
                </div>
                <p className="font-body text-[14px] leading-[1.6] text-mist-400 m-0">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Programs</Kicker>
          <SectionHeading className="text-white mb-3">
            For every stage of the journey
          </SectionHeading>
          <p className="font-body text-mist-400 text-sm mb-8 max-w-2xl">
            Our goal is to create a welcoming environment where dancers can begin their journey and
            continue growing for years to come.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-3">
            {PROGRAMS.map((p) => (
              <li
                key={p}
                data-testid="program"
                className="font-body text-mist-300 text-[15px] flex gap-2.5 leading-relaxed"
              >
                <span className="flex-shrink-0" style={{ color: ACCENT }}>
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The staff */}
      <section id="staff" className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-[84px] scroll-mt-24">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeading className="text-white mb-3">The staff</SectionHeading>
          <p className="font-body text-mist-400 text-sm mb-10 max-w-2xl">
            The people your dancer will actually see every week. More profiles are on the way —
            this is not yet the whole faculty.
          </p>
          {/* Four across, at the studio's request 2026-08-17. Three columns put each
              headshot on a ~436px card, which made the faces the loudest thing on the
              page; four takes the photo to ~330px square, a 43% cut in area. It stops at
              four rather than five because five leaves the sixth instructor alone on a
              row of five empties, and because the roster is still growing — six of nine
              have flyers, so 4+2 fills in rather than getting more lopsided. */}
          {/* items-start so an expanded bio grows only its own card. The grid default
              (stretch) made every card in the row as tall as the open one, which left the
              other three with a block of empty navy under the specialties. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[26px] items-start">
            {INSTRUCTORS.map((person) => (
              <StaffCard key={person.slug} person={person} accent={ACCENT} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        accent={ACCENT}
        headline="Come dance with Capital Core"
        body="Come dance with purpose. Come dance with passion. Come dance with Capital Core."
        action={<InverseAction to="/contact">Become Part of the Family</InverseAction>}
      />

      <Footer />
    </div>
  )
}
