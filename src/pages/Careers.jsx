import { useState } from 'react'
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
  CtaBand,
  InverseAction,
} from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'

// Built 2026-08-18 from the studio's site mockup (page 1m, "Careers · accent blue").
// Four things here deliberately diverge from that mockup:
//
//  1. NO APPLICATION FORM. The mockup draws a six-field form with a resume attach. The
//     real application form is coming from the studio portal's forms module, so every
//     action on this page points at /contact instead. When that form exists it replaces
//     the "How to apply" panel below, and nothing else on the page has to move.
//  2. TWO ROLES, NOT FIVE. The mockup invents five openings to show the layout. Only the
//     two the studio is actually hiring for are listed: a careers page advertising roles
//     that do not exist costs real applicant trust.
//  3. AFFILIATES AND PARTNERS. Two sections the mockup has no equivalent for, added at
//     the studio's request. They sit after the roles because they answer a different
//     question: not "can I work here" but "can we work together".
//  4. FOOTER ONLY. This page is deliberately absent from the navbar. It is reached from
//     the footer's Studio column and from the hiring strip on the home page. The navbar
//     is a parent's map of the studio, and a careers link there would spend a slot that
//     Classes and Little Movers need more.
const ACCENT = ACCENTS.blue

const APPLY_PATH = '/contact?interest=employment'
const PARTNER_PATH = '/contact?interest=partnership'

// The open roles.
//
// Each role's full posting lives here and is revealed by the row's own disclosure toggle,
// rather than living on a /careers/<role> page of its own. Two reasons: a job board post
// is read top to bottom in one sitting, so a route change buys nothing; and with two
// openings, a detail route would be three files and a router entry to maintain for a page
// that changes when the season does.
//
// `intro` is the pitch. Each `sections` entry is either a list (`items`) or prose
// (`body`), or both, plus an optional `note` set in italics under it. `facts` is the
// job-board footer every posting ends with.
const ROLES = [
  {
    slug: 'preschool-instructor',
    title: 'Preschool Instructor',
    tag: 'Part time',
    styles: 'Creative movement · Infants to preschool',
    // Must match the grid on the Little Movers page: Monday, Wednesday and Friday,
    // three 45-minute classes at 9:30, 10:30 and 11:30. This said "weekday mornings,
    // about 9:00 AM to 12:00 PM", which asked candidates to be free on two mornings
    // the programme does not run.
    schedule: 'Mon, Wed & Fri mornings, 9:30 AM to 12:15 PM',
    pay: '$15 to $25 / hour',
    intro: [
      'Capital Core Dance Studio is hiring an energetic, dependable and nurturing Preschool Movement and Enrichment Instructor to join our new Little Movers early childhood program.',
      'Little Movers is designed for infants, toddlers and preschoolers, and combines dance, music, sensory exploration, tumbling, active play and age-appropriate movement experiences.',
      'This is a great opportunity for someone who loves working with young children and wants to be part of building a fun, welcoming morning program for local families.',
    ],
    sections: [
      {
        heading: "What you'll do",
        items: [
          'Lead and assist with Little Movers classes for infants, toddlers and preschool-aged children.',
          'Facilitate dance, creative movement, sensory play, tumbling, music and gross-motor activities.',
          'Set up and supervise obstacle courses and active-play stations.',
          'Create a safe, positive, organized and engaging environment.',
          'Welcome and communicate professionally with parents and caregivers.',
          'Assist with classroom setup, cleanup, attendance and transitions.',
          'Follow established class plans and program procedures.',
          'Participate in training for specialty programming offered through our program partners.',
          'Collaborate with other Little Movers instructors and studio leadership.',
          'Help us continue developing a program families are excited to return to each week.',
        ],
      },
      {
        heading: 'Classes may include',
        items: [
          'Baby & Me',
          "Moovin' & Groovin'",
          'Tiny Tumblers',
          'Sensory Steps',
          'Little Movers Free Play Lab',
          'Parent & Me Dance, once it returns to the schedule',
        ],
        // Parent & Me Dance came off the published grid on 2026-08-17 when Tuesday and
        // Thursday were withdrawn, so it currently runs on no day. The Little Movers
        // page badges it "Coming soon"; this list had no such qualifier, which offered
        // an applicant a class nobody can be assigned to. Moved to the end and marked.
      },
      {
        heading: "We're looking for someone who",
        items: [
          'Genuinely enjoys working with infants, toddlers and preschoolers.',
          'Is energetic, patient, warm and dependable.',
          'Is comfortable being active and on the floor with young children.',
          'Can confidently lead a small group.',
          'Enjoys music, dance, movement, sensory activities and creative play.',
          'Communicates well with parents and coworkers.',
          'Is comfortable learning an established curriculum.',
          'Can maintain appropriate boundaries and safety standards when working with young children.',
          'Is interested in helping a new program grow.',
        ],
      },
      {
        heading: 'Preferred experience',
        body: ['Experience in one or more of the following is strongly preferred:'],
        items: [
          'Early childhood education',
          'Preschool or childcare',
          'Dance',
          'Gymnastics or tumbling',
          "Children's fitness",
          'Music and movement',
          'Recreation',
          'Special education or adaptive programming',
          'Youth programming',
        ],
        note: 'Formal dance training is not required for every Little Movers position. We are especially interested in candidates who are excellent with young children and can confidently facilitate movement-based activities.',
      },
      {
        heading: 'Schedule',
        // "currently takes place" was wrong twice over: the days were wrong, and the
        // programme has not started — the Little Movers page carries a coming-soon
        // banner and is not open for registration. Corrected 2026-08-19.
        body: [
          'Part-time mornings. Little Movers is planned for Monday, Wednesday and Friday mornings, in three 45-minute classes at 9:30, 10:30 and 11:30. Start dates are still being confirmed, so the first weeks will be built with whoever takes the role.',
          'Applicants do not need to be available all three mornings. Please include your Monday, Wednesday and Friday morning availability when applying.',
        ],
      },
      {
        heading: 'Compensation',
        body: [
          '$15.00 to $25.00 per hour, based on experience and responsibilities.',
          'Training is provided for applicable program-specific classes.',
        ],
      },
      {
        heading: 'To apply',
        body: ['Send your resume along with a brief introduction telling us:'],
        items: [
          'Your experience working with young children.',
          'Your Monday, Wednesday and Friday morning availability.',
          'Any experience with dance, movement, tumbling, sensory play, early childhood education or similar programming.',
          "Why you're interested in joining the Little Movers team.",
        ],
      },
    ],
    facts: [
      'Job type: Part-time',
      'Schedule: Monday, Wednesday and Friday mornings',
      'Location: In person, Midlothian, VA',
    ],
    closing:
      'We are looking for team members who want to help create an environment where little ones can build confidence, explore movement, and have fun while learning.',
  },
  {
    slug: 'irish-dance-instructor',
    title: 'Irish Dance Instructor',
    tag: 'Part time',
    styles: 'Irish dance',
    schedule: 'Days and times set with the studio',
    pay: 'From $30 / hour',
    // Rewritten 2026-08-19 at the studio's request: "keep it very simple, we need an
    // instructor for classes and recitals, keep the pay, remove any fluff that makes
    // promises."
    //
    // What came out, and why it should stay out unless the studio puts it back: the
    // pitch about the instructor shaping the levels, curriculum and class times; an
    // invented class list with an age-6 floor; feiseanna and competition preparation,
    // and the question about taking the programme competitive; TCRG/ADCRG
    // certification; extra pay for choreography and performance direction; and the
    // claim that Irish dance had been on the studio's list since it opened. Every one
    // of those was drafted from a one-line brief and none had been agreed.
    //
    // What is left is the job: teach the classes, prepare dancers for the recital, and
    // the parts of the Preschool Instructor posting that apply to any instructor here.
    intro: [
      'Capital Core Dance Studio is hiring an Irish dance instructor to teach Irish dance classes and prepare dancers for our recitals.',
      'Irish dance is new to our schedule, so class days and times will be set together once we know your availability.',
    ],
    sections: [
      {
        heading: "What you'll do",
        items: [
          'Teach Irish dance classes.',
          'Prepare and rehearse dancers for studio recitals and performances.',
          'Create a safe, positive, organized and engaging environment.',
          'Welcome and communicate professionally with parents and caregivers.',
          'Assist with class setup, cleanup, attendance and transitions.',
          'Follow studio procedures.',
        ],
      },
      {
        heading: "We're looking for someone who",
        items: [
          'Has training and experience in Irish dance.',
          'Enjoys teaching children and is comfortable starting dancers from the beginning.',
          'Is energetic, patient, warm and dependable.',
          'Communicates well with parents and coworkers.',
          'Can maintain appropriate boundaries and safety standards when working with children.',
        ],
      },
      {
        heading: 'Schedule',
        body: [
          'Part-time. Class days and times are set with the studio. Please include your availability when applying.',
        ],
      },
      {
        heading: 'Compensation',
        body: ['Starting at $30.00 per hour, based on experience.'],
      },
      {
        heading: 'To apply',
        body: ['Send your resume or dance background along with a brief introduction telling us:'],
        items: [
          'Your Irish dance training and experience.',
          'Any teaching experience, and the ages you are comfortable teaching.',
          'Your availability.',
        ],
      },
    ],
    facts: ['Job type: Part-time', 'Schedule: Set with the studio', 'Location: In person, Midlothian, VA'],
    closing:
      'We are looking for an instructor who will help our dancers build strong technique and enjoy every class.',
  },
]

// PLACEHOLDER COPY, from the mockup's `perks` list. Plausible for this studio but not
// confirmed by the studio, so treat every line as a draft until it is.
const PERKS = [
  {
    name: 'Schedules that fit',
    blurb: 'Teaching hours are built around your other work, not the other way round.',
  },
  {
    name: 'Paid planning time',
    blurb: 'Choreography and prep are part of the job, not unpaid homework.',
  },
  {
    name: 'Mentorship',
    blurb: 'New faculty are paired with an experienced teacher for their first season.',
  },
  {
    name: 'Classes for your family',
    blurb: 'Staff and their dancers take class here at no cost.',
  },
]

// The two ways to work with the studio without joining the faculty. Both are written
// from the studio's side of the relationship on purpose: nothing here promises a portal,
// a payout schedule or a referral rate, because none of that is built yet and a careers
// page is the wrong place to commit to terms.
const PARTNERSHIPS = [
  {
    name: 'Studio Affiliate',
    who: 'For independent instructors and small programs',
    blurb:
      'Teach your own style under the Capital Core roof. You bring the class and the dancers; the studio brings the space, the schedule, and the families already walking through the door. Registration, payments and the season calendar run through the studio, so your time goes into teaching.',
    points: [
      'Studio space on a set weekly slot',
      'Your class listed on the schedule alongside ours',
      'Registration and payment handled by the studio',
      'A written agreement before anyone dances',
    ],
    cta: 'Ask about affiliating',
  },
  {
    name: 'Community Partner',
    who: 'For schools, businesses and organizations',
    blurb:
      'Bring dance to your people, or bring your people to dance. The studio performs at community events, runs workshops off site, and works with local businesses on cross promotion and sponsorship. If you have an audience and an idea, there is usually a version of it we can build together.',
    points: [
      'Performances at community and holiday events',
      'Workshops and residencies at your location',
      'Cross promotion with local businesses',
      'Season and event sponsorship',
    ],
    cta: 'Start a conversation',
  },
]

const HIRE_STEPS = [
  {
    n: '01',
    name: 'Reach out',
    blurb: 'Send a note through the contact page with your background and availability.',
  },
  {
    n: '02',
    name: 'Phone chat',
    blurb: 'Twenty minutes on what you teach, who you teach, and what hours suit you.',
  },
  {
    n: '03',
    name: 'Teach a class',
    blurb: 'A paid sample class with a real group of dancers, so you can feel the room.',
  },
  {
    n: '04',
    name: 'Offer',
    blurb: 'Schedule, rate and start date confirmed in writing before your first week.',
  },
]

// PLACEHOLDER, from the mockup's `careerCols`. The Questions column carries the studio's
// real phone and email; the other two are drafts the studio should confirm, especially
// the background check line, which is a policy statement and not ours to write.
const APPLY_COLUMNS = [
  {
    heading: 'What to send',
    items: [
      'Resume or teaching history',
      'A teaching reel or link, if you have one',
      'Two references',
    ],
  },
  {
    heading: 'Requirements',
    items: [
      'Background check before your first class',
      'CPR certification preferred',
      'Dependable weekly availability',
    ],
  },
  {
    heading: 'Questions',
    items: ['info@capitalcoredance.com', '804-234-4014', 'Ask for the studio director'],
  },
]

function RoleFact({ label, value }) {
  return (
    <div>
      <div className="font-body font-semibold text-[10.5px] tracking-[0.18em] uppercase text-mist-500 mb-1.5">
        {label}
      </div>
      <div className="font-body text-[15px] leading-[1.45] text-mist-100">{value}</div>
    </div>
  )
}

// One posting, collapsed to its summary line until opened.
//
// The panel is conditionally rendered rather than hidden with the `hidden` attribute:
// Preflight's `[hidden]{display:none}` is a single-attribute selector, so any display
// utility on the same element outranks it and the "hidden" panel stays on screen. That
// trap has bitten this repo before.
function RoleCard({ role }) {
  const [open, setOpen] = useState(false)
  const panelId = `role-panel-${role.slug}`

  return (
    <div data-testid="role-row" className="border border-white/[0.14]">
      <button
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full text-left px-6 py-6 lg:px-[30px] lg:py-[26px] grid grid-cols-1 lg:grid-cols-[1.5fr_0.9fr_0.8fr_auto] gap-5 lg:gap-7 items-start lg:items-center transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            {/* Navy on the accent, per onAccent()'s rule: white on this blue is 3.4:1. */}
            <span
              className="font-body font-bold text-[10px] tracking-[0.14em] uppercase px-2 py-1"
              style={{ background: ACCENT, color: '#0d1b34' }}
            >
              {role.tag}
            </span>
            <span className="font-body font-semibold text-[11.5px] tracking-[0.12em] uppercase text-mist-500">
              {role.styles}
            </span>
          </div>
          <div className="font-display uppercase text-[24px] lg:text-[27px] leading-none text-white">
            {role.title}
          </div>
        </div>
        <RoleFact label="Schedule" value={role.schedule} />
        <RoleFact label="Pay" value={role.pay} />
        {/* The state is carried by aria-expanded, so the glyph is decoration. It is sized
            and centred rather than left to the font, or the minus sits off-centre. */}
        <span
          aria-hidden="true"
          className="flex items-center justify-center w-9 h-9 border font-body text-[20px] leading-none"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div id={panelId} className="px-6 pb-8 lg:px-[30px] lg:pb-10 border-t border-white/[0.14]">
          <div className="max-w-[760px] pt-7">
            {role.intro.map((para) => (
              <p key={para} className="font-body text-[15.5px] leading-[1.7] text-mist-300 m-0 mb-4">
                {para}
              </p>
            ))}

            {role.sections.map((section) => (
              <div key={section.heading} className="mt-8">
                <h4
                  className="font-body font-bold text-[11.5px] tracking-[0.2em] uppercase mb-3.5"
                  style={{ color: ACCENT }}
                >
                  {section.heading}
                </h4>
                {section.body?.map((para) => (
                  <p
                    key={para}
                    className="font-body text-[15.5px] leading-[1.7] text-mist-300 m-0 mb-3"
                  >
                    {para}
                  </p>
                ))}
                {section.items && (
                  <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="font-bold mt-0.5 flex-shrink-0" style={{ color: ACCENT }}>
                          &#9656;
                        </span>
                        <span className="font-body text-[15px] leading-[1.6] text-mist-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.note && (
                  <p className="font-body italic text-[14.5px] leading-[1.65] text-mist-400 m-0 mt-3.5">
                    {section.note}
                  </p>
                )}
              </div>
            ))}

            <ul className="flex flex-wrap gap-x-7 gap-y-2 m-0 mt-8 p-0 list-none border-t border-white/15 pt-5">
              {role.facts.map((fact) => (
                <li
                  key={fact}
                  className="font-body font-semibold text-[11.5px] tracking-[0.12em] uppercase text-mist-500"
                >
                  {fact}
                </li>
              ))}
            </ul>

            <p className="font-body text-[15.5px] leading-[1.7] text-mist-300 m-0 mt-6">
              {role.closing}
            </p>

            <div className="mt-7">
              <PrimaryAction to={APPLY_PATH}>Apply for this role</PrimaryAction>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Careers at Capital Core Dance Studio | Teaching Jobs in Midlothian, VA"
        description="Capital Core Dance Studio in Midlothian, VA is hiring a preschool movement instructor for the Little Movers program and an Irish dance instructor. We also work with studio affiliates and community partners. Get in touch to apply."
        canonical="/careers"
        jsonLd={simpleBreadcrumb('Careers', '/careers')}
      />
      <Navbar />

      <Hero
        eyebrow="Hiring for 2026 – 2027"
        title={['Teach', [{ text: 'with us', accent: ACCENT }]]}
        tagline="Faculty · affiliates · partners"
        body="We are looking for teachers who want a room of their own and a studio behind them. Two openings for the coming season, plus room for affiliates and partners who want to build something with us."
        photoCaption="Team photo"
        /* The crest rather than a photograph, matching About, Contact, FAQ and Tuition.
           `contain` so the well cannot crop through the shield, and nothing is painted
           behind it: the blue panel shows through the transparent PNG. */
        photoSrc="/logo.png"
        photoAlt="Capital Core Dance Studio crest"
        photoFit="contain"
        clipStart={22}
        actions={
          <>
            <PrimaryAction href="#open-roles">See open roles</PrimaryAction>
            <GhostAction to={APPLY_PATH}>Send a general application</GhostAction>
          </>
        }
      />

      <main className="flex-1">
        {/* Open roles */}
        <section id="open-roles" className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20 scroll-mt-24">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
              <SectionHeading className="text-white" testId="open-roles-heading">
                Open roles
              </SectionHeading>
              <span className="font-body font-semibold text-[12px] tracking-[0.16em] uppercase text-mist-500">
                Updated August 2026
              </span>
            </div>
            <p className="font-body text-[15px] leading-relaxed text-mist-500 m-0 mb-9">
              Open a role to read the full posting.
            </p>

            <div className="flex flex-col gap-4">
              {ROLES.map((role) => (
                <RoleCard key={role.slug} role={role} />
              ))}
            </div>

            <p className="font-body text-[15px] leading-relaxed text-mist-400 mt-7 m-0">
              Teach something we have not listed? We keep general applications on file and read
              every one.{' '}
              <Link to={APPLY_PATH} className="font-bold hover:underline" style={{ color: ACCENT }}>
                Tell us what you teach &rarr;
              </Link>
            </p>
          </div>
        </section>

        {/* Why here */}
        <section className="bg-ink-base px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-center">
            <div>
              <Kicker>Why here</Kicker>
              <SectionHeading className="text-white mb-5">
                {/* The explicit space matters: without it the accessible name reads
                    "Built forteachers". Same trap as Home's section heading. */}
                Built for{' '}
                <br />
                teachers
              </SectionHeading>
              {/* PLACEHOLDER: mockup filler, pending the studio's own words. */}
              <p className="font-body text-[16px] leading-[1.7] text-mist-300 max-w-[460px] m-0 mb-7">
                Small classes, two studios, and a faculty who actually talk to each other.
                Schedules are built around the lives of the people teaching them, and nobody here
                is handed a class list and left to it.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px] border-t border-white/15 pt-[26px]">
                {PERKS.map((perk) => (
                  <div
                    key={perk.name}
                    className="border-l-[3px] pl-3.5"
                    style={{ borderColor: ACCENT }}
                  >
                    <div className="font-body font-bold text-[16px] leading-[1.3] text-white mb-1.5">
                      {perk.name}
                    </div>
                    <div className="font-body text-[14px] leading-[1.6] text-mist-400">
                      {perk.blurb}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* overflow-hidden is required next to the fixed height, or the in-flow image
                grows the well past it. See the design-system notes on aspect wells. */}
            <div className="h-[320px] lg:h-[420px] border border-white/[0.12] overflow-hidden">
              <PhotoSlot
                src="/careers-faculty.jpg"
                alt="Six Capital Core Dance Studio instructors in black studio wear standing together in the Midlothian studio"
                caption="Faculty group photo"
                objectPosition="center 30%"
                className="w-full h-full"
              />
            </div>
          </div>
        </section>

        {/* Affiliates and partners */}
        <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto">
            <div className="max-w-[720px] mb-10">
              <Kicker>Work with us</Kicker>
              <SectionHeading className="text-white mb-5">Affiliates and partners</SectionHeading>
              <p className="font-body text-[16px] leading-[1.7] text-mist-300 m-0">
                Not every good fit is a job. If you run your own program, or your organization
                wants dance in front of its people, there is a way in that is not the payroll.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {PARTNERSHIPS.map((partner) => (
                <div
                  key={partner.name}
                  data-testid="partner-card"
                  className="bg-ink-panel border-t-[3px] px-7 py-8 lg:px-9 lg:py-10 flex flex-col"
                  style={{ borderColor: ACCENT }}
                >
                  <div className="font-body font-semibold text-[11px] tracking-[0.2em] uppercase text-mist-500 mb-3">
                    {partner.who}
                  </div>
                  <h3 className="font-display uppercase text-[30px] lg:text-[34px] leading-none text-white m-0 mb-4">
                    {partner.name}
                  </h3>
                  <p className="font-body text-[15px] leading-[1.7] text-mist-300 m-0 mb-6">
                    {partner.blurb}
                  </p>
                  <ul className="flex flex-col gap-3 m-0 p-0 list-none mb-8">
                    {partner.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 border-b border-white/[0.12] pb-3"
                      >
                        <span className="font-bold mt-0.5 flex-shrink-0" style={{ color: ACCENT }}>
                          &#9656;
                        </span>
                        <span className="font-body text-[15px] leading-[1.5] text-mist-300">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <PrimaryAction to={PARTNER_PATH}>{partner.cta}</PrimaryAction>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How hiring works */}
        <section className="bg-ink-base px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto">
            <SectionHeading className="text-white mb-10">How hiring works</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HIRE_STEPS.map((step) => (
                <div key={step.n} className="border-t-[3px] pt-[18px]" style={{ borderColor: ACCENT }}>
                  <div
                    className="font-body font-semibold text-[11px] tracking-[0.2em] uppercase mb-2.5"
                    style={{ color: ACCENT }}
                  >
                    {step.n}
                  </div>
                  <div className="font-body font-bold text-[18px] leading-[1.3] text-white mb-2">
                    {step.name}
                  </div>
                  <div className="font-body text-[14px] leading-[1.6] text-mist-400">
                    {step.blurb}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to apply. This is where the mockup put its application form. The form
            itself is coming from the studio portal, so this panel points at the contact
            page and says plainly what to include, which is what the form would have asked
            for anyway. Swap the panel for the embedded form when it lands. */}
        <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16">
            <div>
              <SectionHeading className="text-white mb-4">How to apply</SectionHeading>
              <p className="font-body text-[15.5px] leading-[1.65] text-mist-400 max-w-[520px] m-0 mb-7">
                There is no application form to fill in yet. Send a message through the contact
                page, choose the studio work option, and tell us what you teach and when you are
                free. We read every one and reply within 1 to 2 business days.
              </p>
              <div className="flex flex-wrap gap-4">
                <PrimaryAction to={APPLY_PATH}>Apply through the contact page</PrimaryAction>
                <GhostAction href="mailto:info@capitalcoredance.com">Email the studio</GhostAction>
              </div>
              <p className="font-body text-[14px] leading-relaxed text-mist-500 mt-6 m-0">
                Attach a resume or a link to a teaching reel if you have one. If your file will
                not attach, say so in the message and we will reply with somewhere to send it.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {APPLY_COLUMNS.map((col) => (
                <div key={col.heading} className="border-t-[3px] pt-4" style={{ borderColor: ACCENT }}>
                  <h3 className="font-display uppercase text-[24px] leading-none text-white m-0 mb-3">
                    {col.heading}
                  </h3>
                  <ul className="flex flex-col gap-2 m-0 p-0 list-none font-body text-[15px] leading-[1.5] text-mist-400">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <CtaBand
        headline="Come teach a class"
        body="Tell us what you teach and we will find the hour that fits."
        action={<InverseAction to={APPLY_PATH}>Get in touch</InverseAction>}
      />

      <Footer />
    </div>
  )
}
