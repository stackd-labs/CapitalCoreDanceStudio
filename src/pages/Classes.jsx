import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import ClassCalendar from '../components/ClassCalendar'
import { courseListSchema, simpleBreadcrumb } from '../lib/schema'

// Portal-hosted Fall class registration (public). Charges the registration fee
// ($60 new dancer / $50 returning); monthly tuition is billed separately.
const PORTAL_REGISTER_URL = 'https://studio.capitalcoredance.com/register/classes'

const DANCE_STYLES = [
  'Ballet',
  'Jazz',
  'Hip Hop',
  'Contemporary',
  'Tap',
  'Acro & Tumbling',
  'Lyrical',
  'Musical Theatre',
  'Breakdancing',
  'Pom & Cheer',
  'Preschool Creative Movement',
  'Adult Classes',
]

const CLASSES_JSON_LD = [
  courseListSchema(DANCE_STYLES),
  simpleBreadcrumb('Classes', '/classes'),
]

// ageGroups: 'tiny' (2-5), 'kids' (5-12), 'teen' (6-17), 'adult' (16+)
// category: 'tiny' | 'ballet' | 'jazz-acro' | 'hiphop' | 'lyrical-contemp' | 'tumble-cheer' | 'musical-theatre' | 'adult'
// Fall 2026 schedule — verbatim from the studio flyer (Aug 24 – Dec 18).
// eslint-disable-next-line react-refresh/only-export-components
export const SCHEDULE = [
  {
    day: 'Monday',
    classes: [
      { name: 'Tiny Ballet / Tumble', time: '5:00 – 5:30 PM', start: '17:00', end: '17:30', infoKey: 'Tiny Ballet & Tumble', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Beginner Acro / Jazz', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Acro & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Beginner Contemp / Jazz', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Contemporary & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Beginner Hip Hop', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Beginner Hip Hop', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'hiphop' },
      { name: 'Acro / Lyrical', time: '6:15 – 7:15 PM', start: '18:15', end: '19:15', infoKey: 'Acro & Lyrical', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'lyrical-contemp' },
      { name: 'Ballet / Contemp', time: '7:15 – 8:00 PM', start: '19:15', end: '20:00', infoKey: 'Ballet & Contemporary', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Adult Femme / Flaire', time: '8:00 – 9:00 PM', start: '20:00', end: '21:00', infoKey: 'Adult Femme Flair', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
  {
    day: 'Tuesday',
    classes: [
      { name: 'Tiny Ballet / Hip Hop', time: '5:00 – 5:30 PM', start: '17:00', end: '17:30', infoKey: 'Tiny Ballet & Hip Hop', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Beginner Ballet / Hip Hop', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Ballet & Hip Hop', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Beginner Contemp / Jazz', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Beginner Contemporary & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Tumble Tech', time: '7:00 – 7:45 PM', start: '19:00', end: '19:45', infoKey: 'Tumble Tech', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
    ],
  },
  {
    day: 'Wednesday',
    classes: [
      { name: 'Tiny Ballet / Tap', time: '5:30 – 6:00 PM', start: '17:30', end: '18:00', infoKey: 'Tiny Ballet & Tap', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Beginner Hip Hop & Breakdancing', time: '6:00 – 6:45 PM', start: '18:00', end: '18:45', infoKey: 'Beginner Hip Hop & Breakdancing', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'hiphop' },
      { name: 'Musical Theatre', time: '6:45 – 7:30 PM', start: '18:45', end: '19:30', infoKey: 'Musical Theatre', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'musical-theatre' },
      { name: 'Adult Pom', time: '7:30 – 8:15 PM', start: '19:30', end: '20:15', infoKey: 'Adult Pom', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
  {
    day: 'Thursday',
    classes: [
      { name: 'Beginner Ballet / Jazz', time: '5:15 – 6:00 PM', start: '17:15', end: '18:00', infoKey: 'Beginner Ballet & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Beginner Ballet / Tap', time: '6:00 – 6:45 PM', start: '18:00', end: '18:45', infoKey: 'Beginner Ballet & Tap', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Pom Cheer', time: '6:45 – 7:15 PM', start: '18:45', end: '19:15', infoKey: 'Pom Cheer', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
      { name: 'Tumble', time: '7:15 – 8:00 PM', start: '19:15', end: '20:00', infoKey: 'Tumble', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
    ],
  },
  {
    day: 'Friday',
    classes: [
      { name: 'Beginner Ballet / Modern', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Ballet & Modern', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Lyrical / Contemp', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Lyrical & Contemporary', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'lyrical-contemp' },
      { name: 'Adult Contemporary', time: '7:00 – 8:00 PM', start: '19:00', end: '20:00', infoKey: 'Adult Contemporary', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
]

const AGES = [
  { value: 'All', label: 'All Ages' },
  { value: 'tiny', label: 'Tiny (2–5)' },
  { value: 'kids', label: 'Kids (5–12)' },
  { value: 'teen', label: 'Teen (6–17)' },
  { value: 'adult', label: 'Adult (16+)' },
]

const CATEGORIES = [
  { value: 'All', label: 'All Styles' },
  { value: 'tiny', label: 'Tiny Classes' },
  { value: 'ballet', label: 'Ballet' },
  { value: 'jazz-acro', label: 'Jazz & Acro' },
  { value: 'hiphop', label: 'Hip Hop' },
  { value: 'lyrical-contemp', label: 'Lyrical & Contemp' },
  { value: 'tumble-cheer', label: 'Tumble & Cheer' },
  { value: 'musical-theatre', label: 'Musical Theatre' },
  { value: 'adult', label: 'Adult Classes' },
]

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-[#8a9aaa] text-[10px] font-bold uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-surface-border text-navy-dark text-sm font-medium rounded-md px-3 py-2 pr-8 appearance-none cursor-pointer hover:border-navy-mid focus:outline-none focus:border-navy-dark transition-colors"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235a6a8a' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
      >
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value
          const display = typeof opt === 'string' ? opt : opt.label
          return <option key={val} value={val}>{display}</option>
        })}
      </select>
    </div>
  )
}

export default function Classes() {
  const [selectedAge, setSelectedAge] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredSchedule = SCHEDULE
    .map(({ day, classes }) => ({
      day,
      classes: classes.filter((c) => {
        const ageMatch = selectedAge === 'All' || c.ageGroups.includes(selectedAge)
        const catMatch = selectedCategory === 'All' || c.category === selectedCategory
        return ageMatch && catMatch
      }),
    }))
    .filter(({ classes }) => classes.length > 0)

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Fall 2026 Dance Classes in Midlothian, VA | Ballet, Hip Hop, Jazz &amp; More – Capital Core Dance Studio"
        description="Fall 2026 dance classes (Aug 24 – Dec 18) for ages 2 through adult at Capital Core Dance Studio in Midlothian, VA. Ballet, jazz, hip hop, contemporary, tap, acro, lyrical, musical theatre, tumble, and pom/cheer. First class is always free."
        canonical="/classes"
        jsonLd={CLASSES_JSON_LD}
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Classes"
        subtitle="Year-round dance instruction for all ages and skill levels in a supportive, energetic environment."
      />

      {/* Hero Photos */}
      <div className="grid grid-cols-2 w-full overflow-hidden" style={{ maxHeight: '210px' }}>
        <div className="relative" style={{ maxHeight: '210px' }}>
          <img
            src="/classes-hero-1.jpg"
            alt="Young ballet dancers in tutus during class at Capital Core Dance Studio in Midlothian, VA"
            className="w-full h-full object-cover"
            style={{ maxHeight: '210px', objectPosition: 'center 25%' }}
          />
        </div>
        <div className="relative" style={{ maxHeight: '210px' }}>
          <img
            src="/classes-hero-2.jpg"
            alt="Kids ballet class sitting in a circle at Capital Core Dance Studio"
            className="w-full h-full object-cover"
            style={{ maxHeight: '210px', objectPosition: 'center 25%' }}
          />
        </div>
      </div>

      {/* Register banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#FFA76B' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">Fall registration is open.</p>
            <p className="text-navy-dark/70 text-sm mt-0.5">Reserve your dancer's spot on our student portal — first class is always free.</p>
          </div>
          <a
            href={PORTAL_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
          >
            Register for Fall →
          </a>
        </div>
      </section>

      {/* Filter bar */}
      <div className="bg-surface-light border-b border-surface-border px-6 py-4 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FilterSelect label="Age Group" options={AGES} value={selectedAge} onChange={setSelectedAge} />
            <FilterSelect label="Dance Style" options={CATEGORIES} value={selectedCategory} onChange={setSelectedCategory} />
          </div>
        </div>
      </div>

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Fall 2026 · August 24 – December 18
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Find the right class for your dancer
          </h2>

          <ClassCalendar schedule={filteredSchedule} />

          <p className="text-[#8a9aaa] text-xs mt-8 text-center">
            Beginner classes start at age 5+. Classes are subject to change based on interest and registrations.{' '}
            See <Link to="/tuition" className="text-brand-red font-semibold hover:underline">Tuition</Link> for monthly pricing.
          </p>

          <a
            href={PORTAL_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full bg-navy-dark text-white text-center font-bold py-3 rounded-md hover:bg-navy-mid transition-colors"
          >
            Enroll Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
