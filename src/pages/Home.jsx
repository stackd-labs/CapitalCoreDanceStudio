import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import InstagramBanner from '../components/InstagramBanner'
import SEO from '../components/SEO'
import { localBusinessSchema } from '../lib/schema'

const SECTION_CARDS = [
  {
    to: '/classes',
    title: 'Classes',
    subtitle: 'Fall 2026 · Aug 24 – Dec 18',
    photo: '/card-classes.jpg',
    imageAlt: 'Kids dance classes at Capital Core Dance Studio in Midlothian, VA',
    description:
      'Year-round ballet, hip hop, jazz, tap, contemporary, acro, tumble, and adult classes for ages 2 through adult. Fall registration is open.',
    linkLabel: 'View Fall Classes',
  },
  {
    to: '/birthdays',
    title: 'Birthdays',
    subtitle: 'Party packages',
    photo: '/card-birthdays.jpg',
    imageAlt: 'Kids dance birthday party at Capital Core Dance Studio in Midlothian',
    description:
      'Celebrate in style at the studio! Custom dance party packages for kids of all ages. Unforgettable memories guaranteed.',
    linkLabel: 'View Packages',
  },
  {
    to: '/contact',
    title: 'Contact Us',
    subtitle: 'Get in touch',
    photo: '/card-contact.png',
    imageAlt: 'Contact Capital Core Dance Studio in Midlothian, VA',
    description:
      "Questions? Ready to enroll? Reach out and we'll get back to you quickly. We'd love to have your dancer join our family.",
    linkLabel: 'Contact Us',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Capital Core Dance Studio | Dance Classes in Midlothian, VA"
        description="Capital Core Dance Studio offers ballet, hip hop, jazz, contemporary, and tap classes for kids and adults in Midlothian, VA. Year-round programs, Fall 2026 classes, birthday parties, and an annual recital. Serving Chesterfield County and Richmond."
        canonical="/"
        jsonLd={localBusinessSchema}
      />
      <Navbar />

      <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1b36] via-[#1a1040] to-[#5a1020] py-24 px-6 text-center">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-red opacity-[0.08] rounded-full" />
        <div className="absolute -bottom-20 -left-16 w-80 h-80 bg-[#7ab3e8] opacity-[0.06] rounded-full" />
        <div className="absolute top-8 left-16 w-2 h-2 bg-[#f4a8b4] opacity-60 rounded-full" />
        <div className="absolute bottom-12 right-20 w-1.5 h-1.5 bg-[#f4d0b8] opacity-60 rounded-full" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-[#f4a8b4] text-xs font-semibold tracking-[0.4em] uppercase mb-3">
            Midlothian, Virginia
          </p>
          <h1 className="text-white text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4">
            MOVE WITH<br />
            <span className="text-[#f4a8b4]">PURPOSE</span>
          </h1>
          <p className="text-[#b8d4f0] text-base md:text-lg mb-10 leading-relaxed">
            Fall dance classes and birthday parties for dancers of all ages and skill levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/classes"
              className="bg-brand-red text-white font-bold px-8 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              View Fall Classes
            </Link>
            <Link
              to="/birthdays"
              className="border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-md hover:border-white/60 transition-colors"
            >
              Plan a Party
            </Link>
          </div>
        </div>
      </section>

      {/* Flyers */}
      {/*
        The Recital Shop tile that used to lead this grid was removed after the
        June 2026 recital wrapped.
      */}
      <section className="py-10 px-6" style={{ backgroundColor: '#ede0fa' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              to: '/classes',
              img: '/flyer-fall-classes.png',
              alt: 'Check out our Fall classes — classes for every age, skills for every stage — Capital Core Dance Studio Midlothian VA',
              imgClass: 'object-cover',
              title: 'Fall Classes',
              subtitle: 'Aug 24 – Dec 18 · registration open',
              accent: 'text-[#c0392b]',
            },
            {
              to: '/birthdays',
              img: '/flyer-birthday-parties.png',
              alt: 'Kids dance birthday party packages starting at $199 — Capital Core Dance Studio',
              imgClass: 'object-cover',
              title: 'Birthday Parties',
              subtitle: 'Private packages from $199',
              accent: 'text-[#c0392b]',
            },
            {
              to: '/dance-company',
              img: '/flyer-comp-team.png',
              alt: 'Capital Core Dance Company — founding season auditions August 10 to 13, ages 6+, $80 per dancer, led by director Yul Tyler — Capital Core Dance Studio',
              imgClass: 'object-cover',
              title: 'Dance Company',
              subtitle: 'Founding season auditions · Aug 10–13',
              accent: 'text-[#c0392b]',
            },
          ].map(({ to, img, alt, imgClass, imgStyle, title, subtitle, accent }) => (
            <Link key={to} to={to} className="group flex flex-col">
              <img
                src={img}
                alt={alt}
                className={`w-full aspect-square ${imgClass} rounded-xl shadow-md group-hover:shadow-lg transition-shadow`}
                style={imgStyle}
              />
              <div className="text-center mt-3 px-1">
                <p className={`font-black text-sm tracking-wide uppercase leading-tight ${accent}`}>
                  {title}
                </p>
                <p className="text-navy-dark/70 text-xs mt-1 leading-snug">{subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* First class free banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#daf0f7' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">Your first class is always FREE.</p>
            <p className="text-[#3a6a8a] text-sm mt-0.5">Come try us out — code <span className="font-bold tracking-wider">TRYITFREE</span> covers your trial.</p>
          </div>
          <a
            href="https://studio.capitalcoredance.com/register/classes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
          >
            Register for a Trial →
          </a>
        </div>
      </section>

      {/* Section intro */}
      <section className="bg-white py-12 px-6 text-center">
        <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
          What We Offer
        </p>
        <h2 className="text-navy-dark text-3xl font-black">Everything your dancer needs</h2>
        <p className="text-[#5a6a8a] text-sm mt-2">
          From weekly dance classes to unforgettable birthday parties
        </p>
      </section>

      {/* Section cards */}
      <section className="bg-surface-light px-6 pb-16 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTION_CARDS.map(({ to, title, subtitle, photo, imageAlt, description, linkLabel }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-xl overflow-hidden border border-surface-border hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={photo}
                  alt={imageAlt || title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 text-center">
                  <div className="text-white text-lg font-black tracking-wide drop-shadow">{title}</div>
                  <div className="text-white/80 text-xs mt-0.5 drop-shadow">{subtitle}</div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">{description}</p>
                <span className="text-brand-red text-xs font-bold group-hover:underline">
                  {linkLabel} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </main>

      <InstagramBanner />
      <Footer />
    </div>
  )
}
