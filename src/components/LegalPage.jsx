import Navbar from './Navbar'
import Footer from './Footer'
import SEO from './SEO'
import Hero from './Hero'
import { PrimaryAction, GhostAction } from './blocks'
import { onAccent } from '../lib/accentContrast'

// The shared shell for Privacy and Terms, from the studio's site mockups (pages 1k and
// 1l). Both are the identical layout in different accents — a hero, a 260px table of
// contents pinned to the left, and Anton-headed sections at a readable measure — so
// they share one component rather than two near-copies that drift apart.
//
// Section ids are slugged from their titles so the contents list can deep-link, and so
// a heading can be linked to from elsewhere (e.g. a refund question in the FAQ).
const slug = (title) =>
  title
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export default function LegalPage({
  accent,
  seo,
  eyebrow,
  title,
  tagline,
  intro,
  lastUpdated,
  sections,
  readLabel,
  askLabel,
}) {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO {...seo} />
      <Navbar />

      <Hero
        accent={accent}
        eyebrow={eyebrow}
        title={title}
        tagline={tagline}
        body={intro}
        photoCaption="Optional image"
        /* Privacy and Terms both render through here, so the crest lands on both from one
           place, each over its own accent. */
        photoSrc="/logo.png"
        photoAlt="Capital Core Dance Studio crest"
        photoFit="contain"
        clipStart={22}
        actions={
          <>
            <PrimaryAction accent={accent} href="#sections">
              {readLabel}
            </PrimaryAction>
            <GhostAction to="/contact">{askLabel}</GhostAction>
          </>
        }
      />

      <section
        id="sections"
        className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20 flex-1 scroll-mt-24"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
          {/* Contents */}
          <nav
            aria-label="On this page"
            data-testid="legal-toc"
            className="border-t-[3px] pt-[18px] lg:sticky lg:top-28 lg:self-start"
            style={{ borderColor: accent }}
          >
            <div className="font-body text-[11px] font-semibold tracking-[0.2em] uppercase text-mist-500 mb-4">
              On this page
            </div>
            <ul className="flex flex-col gap-3">
              {sections.map(({ title: heading }) => (
                <li key={heading}>
                  <a
                    href={`#${slug(heading)}`}
                    className="font-body text-[14.5px] font-semibold text-mist-200 hover:text-white transition-colors"
                  >
                    {heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Body */}
          <div className="max-w-[760px]">
            <p className="font-body text-mist-500 text-xs italic mb-6">
              Last Updated: {lastUpdated}
            </p>

            <div className="flex flex-col gap-[34px]">
              {sections.map(({ title: heading, body, list, after }) => (
                <section key={heading} id={slug(heading)} data-testid="legal-section" className="scroll-mt-28">
                  <h2 className="font-display uppercase text-white text-[28px] leading-[1.05] m-0 mb-3">
                    {heading}
                  </h2>
                  <div className="flex flex-col gap-3.5">
                    {body.map((p, i) => (
                      <p key={i} className="font-body text-[16px] leading-[1.75] text-mist-300 m-0">
                        {p}
                      </p>
                    ))}
                    {list && (
                      <ul className="flex flex-col gap-2 pl-1">
                        {list.map((item, i) => (
                          <li
                            key={i}
                            className="font-body text-[16px] leading-[1.75] text-mist-300 flex gap-3"
                          >
                            <span className="flex-shrink-0" style={{ color: accent }} aria-hidden="true">
                              —
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {after && (
                      <p className="font-body text-[16px] leading-[1.75] text-mist-300 m-0">{after}</p>
                    )}
                  </div>
                </section>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-12 border border-white/[0.14] px-7 py-7">
              <h2 className="font-display uppercase text-white text-[24px] leading-none mb-3">
                Questions?
              </h2>
              <p className="font-body text-mist-400 text-sm leading-relaxed mb-5">
                Reach out anytime — we&apos;re happy to walk you through any of this or update your
                information on request.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/contact"
                  className="font-body font-bold text-sm px-6 py-3 text-center transition-opacity hover:opacity-90"
                  style={{ background: accent, color: onAccent(accent) }}
                >
                  Contact Us
                </a>
                <a
                  href="mailto:info@capitalcoredance.com"
                  className="font-body font-bold text-sm px-6 py-3 text-center border border-white/25 text-white hover:border-white transition-colors"
                >
                  info@capitalcoredance.com
                </a>
              </div>
            </div>

            <p className="font-body text-mist-500 text-xs mt-8">
              Capital Core Dance Studio · 13110 Midlothian Turnpike, Midlothian, VA 23113 · (804)
              234-4014
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
