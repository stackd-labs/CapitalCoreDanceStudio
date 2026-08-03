import { useState } from 'react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb } from '../lib/schema'

// Party requests are handled on the studio portal as of 2026-08-03. The old on-site
// form (/birthday-booking → /birthday-payment → /birthday-thankyou) is retired; see
// the commented-out block in App.jsx.
const PORTAL_PARTY_REQUEST_URL = 'https://studio.capitalcoredance.com/party-request'

const INCLUDED = [
  'Private studio space',
  'Party host (dance instructor)',
  'Dance party & movement games',
  'Themed activity or craft',
  'Music & sound system',
  'Tables & chairs',
  'Set-up & clean-up',
]

const THEMES = [
  'Princess & Fairytale Dance',
  'Hip Hop Dance Party',
  'Pop Star Dance Party',
  'Glow Dance Party',
  'Unicorn & Rainbow Party',
  'Preschool Wiggle & Giggle',
  'Tea Party & Royal Celebration',
  'Superhero Movement Party',
  'Dance & Craft Party',
]

const FLYERS = [
  { src: '/birthday-flyer-overview.png', alt: 'Birthday Parties at Capital Core Dance Studio', filename: 'birthday-parties-flyer.png' },
  { src: '/birthday-flyer-pricing.png', alt: 'Birthday Party Pricing at Capital Core Dance Studio', filename: 'birthday-party-pricing.png' },
]

export default function Birthdays() {
  const [activeFlyer, setActiveFlyer] = useState(null)

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Kids Dance Birthday Parties in Midlothian, VA | Capital Core Dance Studio"
        description="Throw a stress-free, instructor-led dance birthday party at Capital Core Dance Studio in Midlothian, VA. Packages start at $199, include up to 10 kids, custom themes available. Serving Midlothian, Chesterfield County, and Richmond."
        canonical="/birthdays"
        jsonLd={simpleBreadcrumb('Birthday Parties', '/birthdays')}
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Birthday Parties"
        subtitle="A fun, active, and stress-free way to celebrate your child's special day — hosted by our experienced staff in a private studio setting."
      />

      {/* Hero Photos */}
      <div className="grid grid-cols-2 w-full overflow-hidden" style={{ maxHeight: '210px' }}>
        <div className="relative" style={{ maxHeight: '210px' }}>
          <img
            src="/birthday-hero.jpg"
            alt="Birthday party decorations at Capital Core Dance Studio in Midlothian, VA"
            className="w-full h-full object-cover object-center"
            style={{ maxHeight: '210px' }}
          />
        </div>
        <div className="relative" style={{ maxHeight: '210px' }}>
          <img
            src="/birthday-party-kids.jpg"
            alt="Kids dancing at a birthday party at Capital Core Dance Studio"
            className="w-full h-full object-cover object-center"
            style={{ maxHeight: '210px' }}
          />
        </div>
      </div>

      {/* Booking Banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#f4a8b4' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">Ready to book your party?</p>
            <p className="text-navy-dark/70 text-sm mt-0.5">Get started in minutes — no phone tag required.</p>
          </div>
          <a
            href={PORTAL_PARTY_REQUEST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
          >
            Request Your Party →
          </a>
        </div>
      </section>

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Intro */}
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-8">
            By popular demand, our birthday parties combine dancing, games, themed activities, and imagination-filled fun — all hosted by our experienced staff in a private studio setting.
          </p>

          {/* Flyers side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {FLYERS.map((flyer) => (
              <button
                key={flyer.src}
                onClick={() => setActiveFlyer(flyer)}
                className="rounded-xl overflow-hidden shadow-lg border border-surface-border group relative text-left cursor-zoom-in"
              >
                <img src={flyer.src} alt={flyer.alt} className="w-full h-auto block" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-navy-dark text-xs font-bold px-3 py-1.5 rounded-full shadow">
                    Click to expand
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            {/* What's Included */}
            <div className="border border-surface-border border-l-4 border-l-[#f4a8b4] rounded-lg px-5 py-5">
              <p className="text-[#c0506e] text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Package</p>
              <h3 className="font-black text-[#c0506e] text-base mb-3">What's Included</h3>
              <ul className="flex flex-col gap-1.5">
                {INCLUDED.map((item) => (
                  <li key={item} className="text-[#3a4a6a] text-sm flex gap-2">
                    <span className="text-[#f4a8b4] mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#8a9aaa] text-xs mt-4 italic">
                Parents provide food, cake, and drinks — we handle the rest!
              </p>
            </div>

            {/* Themes */}
            <div className="border border-surface-border border-l-4 border-l-[#f4a060] rounded-lg px-5 py-5">
              <p className="text-[#c47830] text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Pick Your Vibe</p>
              <h3 className="font-black text-[#c47830] text-base mb-3">Exciting Themes</h3>
              <ul className="flex flex-col gap-1.5">
                {THEMES.map((theme) => (
                  <li key={theme} className="text-[#3a4a6a] text-sm flex gap-2">
                    <span className="text-[#f4a060] mt-0.5 flex-shrink-0">✓</span>
                    {theme}
                  </li>
                ))}
              </ul>
              <p className="text-[#8a9aaa] text-xs mt-4 italic">
                Optional upgrades: glow party, crafts, and custom themes
              </p>
            </div>

            {/* Party Details */}
            <div className="border border-surface-border border-l-4 border-l-brand-red rounded-lg px-5 py-5">
              <p className="text-brand-red text-[10px] font-bold tracking-[0.3em] uppercase mb-1">The Basics</p>
              <h3 className="font-black text-brand-red text-base mb-3">Party Details</h3>
              <ul className="flex flex-col gap-1.5">
                {[
                  '90-minute private party',
                  'Up to 10 children included',
                  'Ages 2–17',
                  'Additional children may be added',
                  'Available weekends (limited weekday availability)',
                ].map((item) => (
                  <li key={item} className="text-[#3a4a6a] text-sm flex gap-2">
                    <span className="text-brand-red mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#8a9aaa] text-xs mt-4 italic">
                Studio Family Bonus: Enrolled dancers receive priority booking and a special thank-you upgrade.
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-5 py-5 mb-6 text-center">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Packages</p>
            <p className="text-navy-dark text-3xl font-black">Starting at $199</p>
          </div>

          {/* Booking */}
          <div className="border border-surface-border rounded-lg px-5 py-5 mb-8">
            <h3 className="font-black text-navy-dark text-base mb-3">Booking Information</h3>
            <ul className="flex flex-col gap-1.5">
              {[
                '$50 non-refundable deposit required',
                'Remaining balance due on party day',
                'Limited availability — advance booking encouraged!',
              ].map((item) => (
                <li key={item} className="text-[#3a4a6a] text-sm flex gap-2">
                  <span className="text-[#7ab3e8] mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={PORTAL_PARTY_REQUEST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Start Your Party Request →
          </a>
          <p className="text-[#8a9aaa] text-xs mt-3 text-center">
            Requests are handled on our studio portal — we'll confirm your date and details within 1–2 business days.
          </p>
        </div>
      </section>

      <Footer />

      {/* Flyer lightbox */}
      {activeFlyer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6"
          onClick={() => setActiveFlyer(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={activeFlyer.src} alt={activeFlyer.alt} className="w-full h-auto block" />
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-surface-border">
              <a
                href={activeFlyer.src}
                download={activeFlyer.filename}
                className="bg-brand-red text-white text-sm font-bold px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Download Flyer
              </a>
              <button
                onClick={() => setActiveFlyer(null)}
                className="text-[#8a9aaa] text-sm hover:text-navy-dark transition-colors"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
