import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { getClassInfo, photoForClass } from '../lib/classInfo'
import { SCHEDULE } from '../lib/schedule'
import { classLengthMinutes, money, monthlyPriceForMinutes } from '../lib/tuition'
import { ACCENTS } from '../lib/pageAccents'

// Added 2026-10-12. The Specialty program is Musical Theatre and Majorette. The list is
// DERIVED from the schedule (program === 'specialty'), so a class the studio adds or
// retires shows up or drops off here without touching this page. Majorette has its own
// page; Musical Theatre registers through the general class form.
const ACCENT = ACCENTS.orange
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'
const MAJORETTE_REGISTER_URL = 'https://studio.capitalcoredance.com/register/majorette'

const CLASSES = SCHEDULE.flatMap(({ day, classes }) =>
  classes.filter((c) => c.program === 'specialty').map((c) => ({ ...c, day }))
).map((row) => {
  const isMajorette = row.infoKey === 'Majorette'
  return {
    ...row,
    monthly: monthlyPriceForMinutes(classLengthMinutes(row)),
    info: getClassInfo(row.infoKey),
    photo: photoForClass(row.name),
    registerUrl: isMajorette ? MAJORETTE_REGISTER_URL : PORTAL_REGISTER_URL,
    learnMore: isMajorette ? '/majorette' : null,
  }
})

const JSON_LD = [simpleBreadcrumb('Specialty Classes', '/specialty-classes')]

export default function SpecialtyClasses() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Specialty Dance Classes in Midlothian, VA | Capital Core Dance Studio"
        description="Specialty classes at Capital Core Dance Studio in Midlothian, VA: Musical Theatre on Tuesdays and Majorette on Wednesdays. Beginner-friendly, all skill levels welcome."
        canonical="/specialty-classes"
        jsonLd={JSON_LD}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 min-w-0">

      <Hero
        eyebrow="Specialty classes"
        title={['Beyond the', [{ text: 'basics', accent: ACCENT }]]}
        tagline="Musical Theatre · Majorette"
        body="Focused classes for dancers who want to explore a specific style, from the stage to the baton. All skill levels welcome."
        photoSrc="/logo.png"
        photoAlt="Capital Core Dance Studio crest"
        photoFit="contain"
        clipStart={22}
        actions={
          <>
            <PrimaryAction href={PORTAL_REGISTER_URL}>Register →</PrimaryAction>
            <GhostAction to="/classes">See the full schedule</GhostAction>
          </>
        }
      />

      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <Kicker accent={ACCENT}>Our specialty classes</Kicker>
          <SectionHeading className="text-white mb-10">Pick your style</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[26px]">
            {CLASSES.map((c) => (
              <article
                key={c.infoKey}
                data-testid="specialty-class"
                className="flex flex-col border-t-4 bg-ink-base"
                style={{ borderColor: ACCENT }}
              >
                {c.photo && (
                  <img
                    src={c.photo.photo}
                    alt={c.photo.photoAlt}
                    loading="lazy"
                    className="w-full h-[320px] object-cover"
                    style={{ objectPosition: 'center 20%' }}
                  />
                )}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <h3 className="font-display text-white text-2xl m-0">{c.name}</h3>
                  <p className="font-body text-mist-400 text-sm m-0">
                    {c.day}s · {c.time} · {c.ages} · {c.instructor} · {money(c.monthly)}/mo
                  </p>
                  <p className="font-body text-mist-300 text-[15px] leading-relaxed m-0">{c.info?.description}</p>
                  <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-2">
                    <a
                      href={c.registerUrl}
                      className="font-body font-bold underline underline-offset-4"
                      style={{ color: ACCENT }}
                    >
                      Register →
                    </a>
                    {c.learnMore && (
                      <Link to={c.learnMore} className="font-body text-white underline underline-offset-4">
                        Learn more
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        accent={ACCENT}
        headline="Not sure which one is for you?"
        body="Reach out and we will help you find the right fit."
        action={
          <div className="flex flex-col sm:flex-row gap-3">
            <InverseAction href={PORTAL_REGISTER_URL}>Register →</InverseAction>
            <InverseAction to="/contact">Ask us a question</InverseAction>
          </div>
        }
      />

      </main>
      <Footer />
    </div>
  )
}
