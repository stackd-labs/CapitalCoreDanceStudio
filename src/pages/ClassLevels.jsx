import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb } from '../lib/schema'

// Same portal registration link as the Classes page.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
]

// Class descriptions are the studio's own copy (supplied 2026-08-03), transcribed
// verbatim. Three classes on the Fall schedule had no studio copy and are drafted
// in-house pending review — each is marked `draft: true` below:
//   Beginner Hip Hop (Mon 6:15), Tumble (Thu 7:15), Lyrical & Contemporary (Fri 6:15).
// Every `audience` line is also drafted in-house, derived only from the studio's own
// description and the age ranges on the Fall schedule.
// Group order and titles follow the studio's copy — note there is deliberately no
// Advanced group, and "Adult Femme Flair" uses the studio's spelling (the printed
// flyer reads "Adult Femme / Flaire").
const CLASS_GROUPS = [
  {
    title: 'Tiny Dancers',
    ages: 'Ages 2–5',
    intro: null,
    classes: [
      {
        name: 'Tiny Ballet & Tumble',
        audience: 'Perfect for first-time dancers who love to move and climb.',
        description: 'Perfect for little ones just beginning their dance journey! Dancers explore basic ballet movements, balance, coordination, and beginner tumbling skills through music, imagination, and creative play. This class builds confidence while developing important motor skills in a fun, encouraging environment.',
      },
      {
        name: 'Tiny Ballet & Hip Hop',
        audience: 'Great for high-energy little ones who love music and games.',
        description: 'A fun introduction to both ballet and hip hop! Young dancers build rhythm, coordination, confidence, and creativity while learning age-appropriate movement through upbeat music, games, and imaginative activities.',
      },
      {
        name: 'Tiny Ballet & Tap',
        audience: 'Perfect for little dancers who love making noise with their feet.',
        description: 'Introduce your little dancer to the grace of ballet and the excitement of tap! This class develops rhythm, musicality, balance, listening skills, and confidence while making learning fun.',
      },
    ],
  },
  {
    title: 'Beginner Program',
    ages: 'Ages 5+',
    intro: 'No previous dance experience required!',
    classes: [
      {
        name: 'Beginner Ballet & Jazz',
        audience: 'Ideal for a first-time dancer who wants a strong foundation.',
        description: 'A wonderful introduction to dance! Students build a strong ballet foundation while learning energetic jazz technique that improves flexibility, coordination, confidence, and performance quality.',
      },
      {
        name: 'Beginner Ballet & Hip Hop',
        audience: 'Great for dancers who want structure and fun in one class.',
        description: 'The perfect combination of structure and fun! Dancers learn ballet technique while exploring the exciting energy of hip hop, helping them become well-rounded performers.',
      },
      {
        name: 'Beginner Ballet & Tap',
        audience: 'Perfect for beginners drawn to rhythm and timing.',
        description: 'Students develop ballet fundamentals while learning rhythm, timing, and musicality through tap dancing. A great class for dancers beginning their dance education.',
      },
      {
        name: 'Beginner Ballet & Modern',
        audience: 'Ideal for expressive dancers who like to create.',
        description: 'Explore both classical ballet and creative modern dance. Students learn proper technique while developing body awareness, expression, flexibility, and artistry.',
      },
      {
        name: 'Beginner Acro & Jazz',
        audience: 'Great for energetic kids who love to flip and tumble.',
        description: 'A high-energy class introducing dancers to basic acrobatics alongside exciting jazz movement. Students build strength, flexibility, coordination, balance, and confidence.',
      },
      {
        name: 'Beginner Contemporary & Jazz',
        audience: 'Perfect for dancers who want to move and tell a story.',
        description: 'Learn expressive movement while building strong jazz fundamentals. Dancers improve flexibility, musicality, creativity, and performance skills in this engaging combo class.',
      },
      {
        name: 'Beginner Hip Hop & Breakdancing',
        audience: 'Great for energetic dancers who want to freestyle.',
        description: 'A favorite for energetic dancers! Students learn hip hop grooves, beginner breakdancing foundations, freestyle skills, musicality, and coordination in an encouraging atmosphere.',
      },
      {
        name: 'Beginner Hip Hop',
        draft: true,
        audience: "Perfect for a first-time dancer who loves to move to today's music.",
        description: 'An upbeat introduction to hip hop! Dancers learn grooves, rhythm, and beginner choreography while building coordination, musicality, and confidence in a supportive class.',
      },
    ],
  },
  {
    title: 'Intermediate & Technique Classes',
    ages: 'Ages 5+',
    intro: 'Perfect for dancers ready to continue developing their skills.',
    classes: [
      {
        name: 'Acro & Lyrical',
        audience: 'Ideal for dancers with tumbling experience who love to perform.',
        description: 'This class combines acrobatic skills with expressive lyrical dance. Students focus on flexibility, strength, control, artistry, and emotional storytelling through movement.',
      },
      {
        name: 'Ballet & Contemporary',
        audience: 'Ideal for dancers focused on serious technique.',
        description: 'A technique-focused class blending classical ballet with contemporary dance. Dancers develop alignment, flexibility, artistry, turns, extensions, and musicality.',
      },
      {
        name: 'Tumble Tech',
        audience: 'Great for any dancer working toward a new tumbling skill — all levels welcome.',
        description: 'Designed for dancers wanting to improve tumbling technique. Students work on rolls, cartwheels, walkovers, handstands, flexibility, strength, and proper progressions at their own level.',
      },
      {
        name: 'Tumble',
        draft: true,
        audience: 'Great for dancers building tumbling confidence at their own pace.',
        description: 'A tumbling class for dancers building skills at their own pace. Students work on rolls, cartwheels, handstands, flexibility, and strength with proper spotting and progressions.',
      },
      {
        name: 'Lyrical & Contemporary',
        draft: true,
        audience: 'Ideal for dancers who connect to music and emotion.',
        description: 'Expressive movement set to the music that inspires it. Dancers develop control, flexibility, artistry, and storytelling while strengthening lyrical and contemporary technique.',
      },
    ],
  },
  {
    title: 'Specialty Classes',
    ages: 'Ages 5+',
    intro: null,
    classes: [
      {
        name: 'Musical Theatre',
        audience: 'Perfect for the dancer who loves to sing, act, and perform — all levels welcome.',
        description: 'Love to perform? This Broadway-inspired class combines dance, acting, and storytelling while helping students build confidence, stage presence, and performance skills.',
      },
      {
        name: 'Pom Cheer',
        audience: 'Great for dancers who love team routines and performing.',
        description: 'Learn pom technique, cheer motions, jumps, and exciting dance combinations while developing teamwork, confidence, and performance quality.',
      },
    ],
  },
  // The Adult Program group moved to its own page on 2026-08-03 — see
  // src/pages/AdultClasses.jsx. Its three classes and their descriptions live there
  // now, so this page covers ages 2–17 only. Don't re-add them here; the copy would
  // then have to be kept in sync in two files.
]

// Studio's own copy, verbatim.
const IMPORTANT_INFO = [
  'Tiny Classes are designed for dancers ages 2–5.',
  'Beginner Classes are designed for dancers ages 5 and older with little or no dance experience.',
  'Adult, Tumble Tech, Pom Cheer, and Musical Theatre classes are beginner-friendly and welcome dancers of all experience levels.',
  'Class placement recommendations may be made by instructors to ensure every dancer is in the class that best supports their growth.',
]

const ADULT_CLASSES_PATH = '/adult-classes'

const CLASS_LEVELS_JSON_LD = [simpleBreadcrumb('Class Levels', '/class-levels')]

function ClassCard({ name, audience, description, accent }) {
  return (
    <div
      data-testid="class-card"
      className={`border border-surface-border border-l-4 ${accent} rounded-lg px-5 py-4`}
    >
      <div data-testid="class-name" className="text-navy-dark font-bold text-base">
        {name}
      </div>
      <p data-testid="class-audience" className="text-brand-red text-xs font-semibold mt-1">
        {audience}
      </p>
      <p data-testid="class-description" className="text-[#5a6a8a] text-sm mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export default function ClassLevels() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Dance Class Descriptions &amp; Levels | Capital Core Dance Studio — Midlothian, VA"
        description="Which dance class fits your dancer? Full class descriptions for Capital Core Dance Studio in Midlothian, VA — Tiny Dancers (ages 2–5), the Beginner Program (ages 5+), Intermediate &amp; Technique classes, and Specialty classes including Musical Theatre and Pom Cheer. Adult classes (16+) have their own page."
        canonical="/class-levels"
        jsonLd={CLASS_LEVELS_JSON_LD}
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Class Levels"
        subtitle="What every class involves and who it's built for — so you can find the right fit before you register."
      />

      {CLASS_GROUPS.map(({ title, ages, intro, classes }, groupIndex) => (
        <section
          key={title}
          data-testid="class-group"
          className={`px-6 py-12 ${groupIndex % 2 === 0 ? 'bg-surface-light' : 'bg-white'}`}
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
              {ages}
            </p>
            <h2 data-testid="group-title" className="text-navy-dark text-2xl font-black">
              {title}
            </h2>
            {intro && <p className="text-[#5a6a8a] text-sm mt-2">{intro}</p>}

            <div className="flex flex-col gap-3 mt-8">
              {classes.map(({ name, audience, description }, i) => (
                <ClassCard
                  key={name}
                  name={name}
                  audience={audience}
                  description={description}
                  accent={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Adults pointer — their classes live on their own page */}
      <section className="bg-white px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="border border-dashed border-surface-border rounded-lg px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-navy-dark font-bold text-base">Dancing as an adult?</p>
              <p className="text-[#5a6a8a] text-sm mt-0.5">
                Our 16+ evening classes have their own page — Femme Flair, Pom, and Contemporary.
              </p>
            </div>
            <Link
              to={ADULT_CLASSES_PATH}
              className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
            >
              See Adult Classes →
            </Link>
          </div>
        </div>
      </section>

      {/* Important information */}
      <section className="bg-navy-dark px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#f4a8b4] text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Important information
          </p>
          <h2 className="text-white text-2xl font-black mb-6">Before you register</h2>
          <ul className="flex flex-col gap-3">
            {IMPORTANT_INFO.map((item) => (
              <li
                key={item}
                data-testid="info-bullet"
                className="text-[#b8d4f0] text-sm leading-relaxed pl-4 border-l-2 border-navy-mid"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-surface-light flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-navy-dark font-black text-xl">
            Still not sure where your dancer fits?
          </p>
          <p className="text-[#5a6a8a] text-sm mt-2">
            Your first class is always free — come try one and we'll help you place them.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              to="/classes"
              className="bg-white border border-navy-dark text-navy-dark text-sm font-bold px-6 py-3 rounded-md hover:bg-surface-light transition-colors"
            >
              See the Fall Schedule
            </Link>
            <a
              href={PORTAL_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-navy-dark text-white text-sm font-bold px-6 py-3 rounded-md hover:bg-navy-mid transition-colors"
            >
              Register for Fall →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
