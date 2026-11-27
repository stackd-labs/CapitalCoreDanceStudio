import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { eventSchema, simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Added 2026-10-26: the Holiday Remix 2026 recital. The June 2026 recital pages were
// deleted on 2026-08-19 and this is a new page, not a restoration. It sits on the same
// blocks as every other section page and wears gold.
//
// Deliberately NOT on this page: recital fees. Those ($ per routine) are for enrolled
// families and go out by email and the portal, so they stay off the public site.
// Tickets are SOLD in the studio portal, not here: the prices are shown below and the
// button sends the buyer to the portal's /recital-tickets page, which takes the PayPal
// payment and attaches the order to their portal account when their email matches one.
const ACCENT = ACCENTS.gold
const TICKETS_URL = 'https://studio.capitalcoredance.com/recital-tickets'

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

// "What to expect" became "Get involved" (Chanel 2026-11-27): volunteers, guest performers, vendors.
const GET_INVOLVED = [
  { key: 'volunteers', label: 'Volunteers', text: 'We would love your help behind the scenes and throughout recital weekend.', link: 'volunteer' },
  { key: 'guests', label: 'Guests', text: 'We are looking for guests to join our show! If you would like to be part of Holiday Remix 2026, let us know.', link: 'contact' },
  { key: 'vendors', label: 'Vendors', text: 'Have a business you want to promote, or items you would like to sell at the recital? Let us know and we will be in touch.', link: 'contact' },
]

// Recital weekend details, matching the "Everything You Need to Know" email to families
// (Chanel 2026-11-27). Fees and balances stay off this public page on purpose.
const OPENING_ROUTINE_URL = 'https://studio.capitalcoredance.com/register/opening-routine'
const VOLUNTEER_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfgwuYcj4eoHVu3PBFjyHb2itTamObqNI5f-IRha1dEPAbYgA/viewform?usp=header'

const WEEKEND = [
  ['Dress rehearsal', 'Friday, December 18, 6:00 to 8:30 PM at Powhatan Middle School. Dancers arrive by 6:15 PM.'],
  ['Show day', 'Saturday, December 19. Dancers arrive between 12:30 and 1:00 PM and go to the dancer check-in table. The show starts at 2:00 PM.'],
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
            Tickets on sale now! Seating is open seating, so sit wherever you like. Tickets are
            bought securely through the studio portal, and your confirmation arrives by email.
          </p>
          <div className="mt-8 mb-10">
            <PrimaryAction accent={ACCENT} href={TICKETS_URL} data-testid="recital-buy-tickets">
              Buy tickets now
            </PrimaryAction>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {TICKETS.map((t) => (
              <div
                key={t.label}
                data-testid="recital-ticket"
                className="border border-white/[0.12] px-[26px] pt-[26px] pb-[30px] border-t-[3px]"
                style={{ borderTopColor: ACCENT }}
              >
                <div className="font-display uppercase text-[56px] leading-none" style={{ color: ACCENT }}>
                  {t.price}
                </div>
                <div className="font-display uppercase text-white text-[24px] leading-none mt-4 mb-2">{t.label}</div>
                <div className="font-body text-[14.5px] leading-[1.55] text-mist-400">{t.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20" aria-label="What to expect">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div data-testid="recital-get-involved">
            <Kicker accent={ACCENT}>Get involved</Kicker>
            <SectionHeading className="text-white mb-6">Volunteers, guests and vendors</SectionHeading>
            <dl className="flex flex-col gap-5 m-0">
              {GET_INVOLVED.map((g) => (
                <div key={g.key} className="pl-5 border-l-2" style={{ borderColor: ACCENT }}>
                  <dt className="font-body text-xs font-bold tracking-[0.2em] uppercase text-mist-400">{g.label}</dt>
                  <dd className="font-body text-mist-300 text-[17px] leading-relaxed m-0">
                    {g.text}{' '}
                    {g.link === 'volunteer' ? (
                      <a href={VOLUNTEER_URL} target="_blank" rel="noopener noreferrer" className="underline text-white">Sign up to volunteer</a>
                    ) : (
                      <a href="/contact" className="underline text-white">Contact us</a>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div data-testid="recital-weekend">
            <Kicker accent={ACCENT}>Recital weekend</Kicker>
            <SectionHeading className="text-white mb-6">Rehearsal and show day</SectionHeading>
            <dl className="flex flex-col gap-5 m-0">
              {WEEKEND.map(([label, value]) => (
                <div key={label} className="pl-5 border-l-2" style={{ borderColor: ACCENT }}>
                  <dt className="font-body text-xs font-bold tracking-[0.2em] uppercase text-mist-400">{label}</dt>
                  <dd className="font-body text-white text-[17px] leading-relaxed m-0">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto mt-16 flex flex-col gap-10">
          {/* Opening routine, full width and the headline of this block (Chanel 2026-11-27). */}
          <div
            className="border border-white/[0.12] border-t-[3px] px-[26px] lg:px-12 pt-[30px] lg:pt-12 pb-[34px] lg:pb-12 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,520px)] gap-8 lg:gap-16 items-center"
            style={{ borderTopColor: ACCENT, background: 'rgba(255,255,255,0.03)' }}
            data-testid="recital-opening-routine"
          >
            <div>
              <Kicker accent={ACCENT}>Super practice · Sunday, December 6</Kicker>
              <h2 className="font-display uppercase leading-[0.95] text-[48px] sm:text-[64px] lg:text-[80px] m-0">
                <span className="text-white">Opening </span>
                <span style={{ color: ACCENT }}>Routine</span>
              </h2>
            </div>
            <div>
              <p className="font-body text-mist-300 text-[17px] leading-relaxed mb-5">
                If we get enough interest, we would love to put together an Opening Routine to kick off
                the show! We will hold one super practice to learn it.
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7 m-0">
                {[['When', 'Sunday, December 6'], ['Time', '10:00 AM to 12:00 PM'], ['Who', 'Dancers 6 and up, no cost']].map(([label, value]) => (
                  <div key={label} className="pl-4 border-l-2" style={{ borderColor: ACCENT }}>
                    <dt className="font-body text-xs font-bold tracking-[0.2em] uppercase text-mist-400">{label}</dt>
                    <dd className="font-body text-white text-[16px] leading-snug m-0">{value}</dd>
                  </div>
                ))}
              </dl>
              <PrimaryAction accent={ACCENT} href={OPENING_ROUTINE_URL} data-testid="recital-opening-signup">
                Sign up for the opening routine
              </PrimaryAction>
            </div>
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
