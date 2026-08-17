import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'
import { FAQS } from '../lib/faqs'

// Rebuilt 2026-08-11 to the studio's site mockup (page 1i, accent green). The mockup
// shows every answer open in a two-column grid; with ~30 questions across seven
// categories that would be an enormous wall, so the accordion behaviour is kept and the
// mockup's presentation — two columns, hairline rule, green +, Barlow — is applied to
// it. The FAQPage JSON-LD still indexes every question regardless of open state.
const ACCENT = ACCENTS.green

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.flatMap(({ items }) =>
    items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    }))
  ),
}

// One question. Collapsed by default — the mockup draws every answer open, but with
// this many questions that is a wall of text, so the + rotates to × and the answer
// expands. The question text itself is always in the DOM, so in-page search and the
// FAQPage JSON-LD are unaffected by the open state.
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div data-testid="faq-item" className="border-t border-white/[0.14] pt-[22px] pb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left flex gap-3.5 items-start group"
      >
        <span
          className={`font-display text-[22px] leading-none flex-none transition-transform ${
            open ? 'rotate-45' : ''
          }`}
          style={{ color: ACCENT }}
          aria-hidden="true"
        >
          +
        </span>
        <span className="font-body font-bold text-[19px] leading-[1.35] text-white group-hover:text-mist-200 transition-colors">
          {q}
        </span>
      </button>
      {open && (
        <p className="font-body text-[15px] leading-[1.65] text-mist-400 mt-2 ml-[30px] mb-0">
          {a}
        </p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="FAQ | Capital Core Dance Studio – Midlothian, VA"
        /* Was "summer camps ... and our annual recital" — the summer categories were
           retired 2026-08-17 and the recital section was removed from the site earlier, so
           both promised answers this page no longer contains. */
        description="Answers to common questions about classes, enrollment, tuition, Little Movers, adult classes, the Dance Company, and birthday parties at Capital Core Dance Studio in Midlothian, VA. Serving Chesterfield County and Richmond."
        canonical="/faq"
        jsonLd={[JSON_LD, simpleBreadcrumb('FAQ', '/faq')]}
      />

      <Navbar />

      <Hero
        eyebrow="For new families"
        title={['Common', [{ text: 'questions', accent: ACCENT }]]}
        tagline="Trials · tuition · programmes · billing"
        body="Everything you need to know about classes, enrollment, tuition, camps, and more. If your question isn't here, just ask us."
        photoCaption="Lobby photo"
        photoSrc="/logo.png"
        photoAlt="Capital Core Dance Studio crest"
        photoFit="contain"
        clipStart={22}
        actions={
          <>
            <PrimaryAction href="#answers">Browse answers</PrimaryAction>
            <GhostAction to="/contact">Ask us directly</GhostAction>
          </>
        }
      />

      <section
        id="answers"
        className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20 flex-1 scroll-mt-24"
      >
        <div className="max-w-[1440px] mx-auto flex flex-col gap-14">
          {FAQS.map(({ category, items }) => (
            <div key={category} data-testid="faq-category">
              <Kicker accent={ACCENT}>{category}</Kicker>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-11 gap-y-[26px]">
                {items.map(({ q, a }) => (
                  <FAQItem key={q} q={q} a={a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        accent={ACCENT}
        headline="Still have questions?"
        body="We're happy to help — reach out and we'll get back to you quickly."
        action={<InverseAction to="/contact">Contact Us</InverseAction>}
      />

      <Footer />
    </div>
  )
}
