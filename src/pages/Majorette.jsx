import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { getClassInfo } from '../lib/classInfo'
import { SCHEDULE } from '../lib/schedule'
import { classLengthMinutes, money, monthlyPriceForMinutes } from '../lib/tuition'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Added 2026-10-12 for the new Wednesday Majorette class, which replaced Pom Cheer in the
// 6:45 slot. Day, time, ages and instructor are read from SCHEDULE and the price from the
// shared tuition rules, so this page cannot drift from the schedule.
const ACCENT = ACCENTS.red

// The portal's dedicated Majorette form (one class, ages 6-17).
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/majorette'

const ROW = SCHEDULE.flatMap(({ day, classes }) => classes.map((c) => ({ ...c, day }))).find(
  (c) => c.infoKey === 'Majorette'
)
const MONTHLY = monthlyPriceForMinutes(classLengthMinutes(ROW))
const INFO = getClassInfo('Majorette')

const FACTS = [
  ['When', `${ROW.day}s, ${ROW.time}`],
  ['Instructor', ROW.instructor],
  ['Ages', ROW.ages.replace('Ages ', '')],
  ['Tuition', `${money(MONTHLY)} a month`],
]

const MAJORETTE_JSON_LD = [simpleBreadcrumb('Majorette', '/majorette')]

export default function Majorette() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Majorette Class in Midlothian, VA | Capital Core Dance Studio"
        description={`Majorette class for ages 6 to 17 in Midlothian, VA. Wednesdays ${ROW.time} with ${ROW.instructor}. Baton, technique, style and performance. All skill levels welcome.`}
        canonical="/majorette"
        jsonLd={MAJORETTE_JSON_LD}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 min-w-0">

      <Hero
        eyebrow="Ages 6 to 17"
        title={['Majorette', [{ text: 'class', accent: ACCENT }]]}
        tagline="Step · Stand · Spin · Perform · Belong"
        body="Learn majorette moves in a class built on technique, style, performance and teamwork. All skill levels welcome."
        photoSrc="/logo.png"
        photoAlt="Capital Core Dance Studio crest"
        photoFit="contain"
        clipStart={22}
        actions={
          <>
            <PrimaryAction href={PORTAL_REGISTER_URL}>Register →</PrimaryAction>
            <GhostAction to="/contact">Ask us a question</GhostAction>
          </>
        }
      />

      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-10 lg:gap-16 items-start">
          <img
            data-testid="majorette-flyer"
            src="/class-majorette.jpg"
            alt="Capital Core Majorette Class flyer: a majorette in a red, white and blue sequin costume holding a baton overhead. Wednesdays 6:45 to 7:30 PM with Miss Milan, ages 6 and up, all skill levels welcome."
            width="900"
            height="1350"
            loading="lazy"
            className="w-full max-w-[420px] mx-auto lg:mx-0 h-auto"
          />
          <div>
            <Kicker accent={ACCENT}>About the class</Kicker>
            <SectionHeading className="text-white mb-6">Discipline today. Brighter tomorrow.</SectionHeading>
            <p data-testid="majorette-blurb" className="font-body text-mist-300 text-[17px] leading-relaxed mb-8 max-w-[60ch]">
              {INFO.description} No experience needed, just bring your energy. Dancers learn the
              foundations in a supportive room, then build toward routines they are proud to perform.
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {FACTS.map(([label, value]) => (
                <div key={label} data-testid="majorette-fact" className="pl-5 border-l-2" style={{ borderColor: ACCENT }}>
                  <dt className="font-body text-xs font-bold tracking-[0.2em] uppercase text-mist-400">{label}</dt>
                  <dd className="font-body text-white text-lg m-0">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <CtaBand
        accent={ACCENT}
        headline="Ready to spin?"
        body="Register online in a few minutes, or reach out with any questions."
        action={
          <div className="flex flex-col sm:flex-row gap-3" style={{ color: onAccent(ACCENT) }}>
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
