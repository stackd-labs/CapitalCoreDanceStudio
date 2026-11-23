import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { eventSchema, simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'
import RecitalTicketCheckout from '../components/RecitalTicketCheckout'

// Added 2026-10-26: the Holiday Remix 2026 recital. The June 2026 recital pages were
// deleted on 2026-08-19 and this is a new page, not a restoration. It sits on the same
// blocks as every other section page and wears gold.
//
// Deliberately NOT on this page: recital fees. Those ($ per routine) are for enrolled
// families and go out by email and the portal, so they stay off the public site. Tickets
// are shown but not sold yet; they go on sale 20 November, and a buy button is added then.
const ACCENT = ACCENTS.gold

const VENUE = {
  name: 'Powhatan Middle School',
  street: '4135 Old Buckingham Rd',
  city: 'Powhatan',
  region: 'VA',
  postalCode: '23139',
}
const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${VENUE.name}, ${VENUE.street}, ${VENUE.city}, ${VENUE.region} ${VENUE.postalCode}`,
)}`

const FACTS = [
  ['Date', 'Saturday, December 19, 2026'],
  ['Time', '2:00 PM'],
  ['Where', `${VENUE.name}, ${VENUE.street}, ${VENUE.city}, ${VENUE.region} ${VENUE.postalCode}`],
]

// Same tiers as the June 2026 recital. Confirmed with the studio 2026-10-26.
const TICKETS = [
  { price: '$25', label: 'Adult', note: 'General admission' },
  { price: '$15', label: 'Ages 4 to 11', note: 'Kids ticket' },
  { price: 'Free', label: '3 and under', note: 'No ticket cost' },
]

const EXPECT = [
  'Every class performs, so every dancer has a place in the show.',
  'Some classes perform two routines, and there is an optional opening routine.',
  'Competition team families get their routine instructions from the team managers.',
  'Picture Day will offer group and individual photos, with photo packages to purchase. The date is still to come.',
]

const RECITAL_JSON_LD = [
  simpleBreadcrumb('Recital', '/recital'),
  eventSchema({
    name: 'Holiday Remix 2026 Recital',
    description:
      'Capital Core Dance Studio presents Holiday Remix 2026, a celebration of joy, music, art and dance.',
    startDate: '2026-12-19T14:00:00-05:00',
    location: {
      name: VENUE.name,
      streetAddress: VENUE.street,
      addressLocality: VENUE.city,
      addressRegion: VENUE.region,
      postalCode: VENUE.postalCode,
    },
    image: 'https://www.capitalcoredance.com/holiday-remix-2026.jpg',
  }),
]

export default function Recital() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Holiday Remix 2026 Recital | Capital Core Dance Studio"
        description="Holiday Remix 2026, the Capital Core Dance Studio recital. Saturday, December 19 at 2 PM at Powhatan Middle School. Adult tickets $25, ages 4 to 11 $15, children 3 and under free. Tickets on sale now."
        canonical="/recital"
        jsonLd={RECITAL_JSON_LD}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 min-w-0">

      <Hero
        eyebrow="Saturday · December 19 · 2 PM"
        title={['Holiday', [{ text: 'Remix', accent: ACCENT }, { text: ' 2026' }]]}
        tagline="A celebration of joy, music, art & dance"
        body="The Capital Core Dance Studio recital. Join us at Powhatan Middle School to watch our dancers take the stage."
        // A portrait collage (2026-11-10): the recital flyer dissolving into dancers on
        // stage, from the flyer and a stage photograph from the Leveless project. The
        // desktop well is a 400-wide portrait box this fits exactly; the low object
        // position keeps the dancers in the short mobile band.
        photoSrc="/holiday-remix-2026-hero.jpg"
        photoAlt="Holiday Remix 2026 recital flyer, Capital Core Dance Studio, fading into dancers performing on stage under colored spotlights."
        photoObjectPosition="center 88%"
        clipStart={22}
        accent={ACCENT}
        actions={
          <>
            <PrimaryAction accent={ACCENT} href="#tickets">Get tickets</PrimaryAction>
            <GhostAction to="/contact">Ask us a question</GhostAction>
          </>
        }
      />

      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20" aria-label="Show details">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-10 lg:gap-16 items-start">
          <img
            data-testid="recital-flyer"
            src="/holiday-remix-2026.jpg"
            alt="Holiday Remix 2026 recital flyer: Capital Core Dance Studio. A celebration of joy, music, art and dance. December 19th, 2026."
            width="1145"
            height="1374"
            loading="lazy"
            className="w-full max-w-[420px] mx-auto lg:mx-0 h-auto border border-white/[0.12]"
          />
          <div>
            <Kicker accent={ACCENT}>The show</Kicker>
            <SectionHeading className="text-white mb-6">A celebration of joy, music, art &amp; dance</SectionHeading>
            <p className="font-body text-mist-300 text-[17px] leading-relaxed mb-8 max-w-[60ch]">
              Our Holiday Remix 2026 recital is the studio&apos;s big stage moment of the
              season. Bring the family, find your seats, and cheer on every dancer.
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {FACTS.map(([label, value]) => (
                <div
                  key={label}
                  data-testid="recital-fact"
                  className="pl-5 border-l-2"
                  style={{ borderColor: ACCENT }}
                >
                  <dt className="font-body text-xs font-bold tracking-[0.2em] uppercase text-mist-400">{label}</dt>
                  <dd className="font-body text-white text-lg m-0">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <PrimaryAction accent={ACCENT} href={MAP_URL} data-testid="recital-map-link">
                Get directions
              </PrimaryAction>
            </div>
          </div>
        </div>
      </section>

      <section id="tickets" className="bg-ink-base px-6 lg:px-24 py-16 lg:py-20 scroll-mt-24" aria-label="Tickets">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Tickets</Kicker>
          <SectionHeading className="text-white mb-5">Get your tickets</SectionHeading>
          <p className="font-body text-mist-300 text-[17px] leading-relaxed max-w-[60ch]">
            Tickets on sale now! Seating is open seating, so sit wherever you like. Choose your
            tickets, pay securely with PayPal, and your confirmation arrives by email. Show it at
            the door.
          </p>
          <RecitalTicketCheckout />
        </div>
      </section>

      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20" aria-label="What to expect">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <Kicker accent={ACCENT}>What to expect</Kicker>
            <SectionHeading className="text-white mb-6">On the stage</SectionHeading>
            <ul className="list-none m-0 p-0 flex flex-col gap-4">
              {EXPECT.map((line) => (
                <li
                  key={line}
                  className="font-body text-mist-300 text-[17px] leading-relaxed pl-5 border-l-2"
                  style={{ borderColor: ACCENT }}
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Kicker accent={ACCENT}>Coming soon</Kicker>
            <SectionHeading className="text-white mb-6">More details on the way</SectionHeading>
            <p className="font-body text-mist-300 text-[17px] leading-relaxed max-w-[60ch]">
              Over the next few weeks we will share costume information, Picture Day, rehearsal
              details, show order, and recital weekend logistics. This page will be
              updated as each piece is confirmed.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        accent={ACCENT}
        headline="Questions about the recital?"
        body="Reach out and we will get back to you."
        action={
          <div className="flex flex-col sm:flex-row gap-3" style={{ color: onAccent(ACCENT) }}>
            <InverseAction to="/contact">Contact us</InverseAction>
          </div>
        }
      />

      </main>
      <Footer />
    </div>
  )
}
