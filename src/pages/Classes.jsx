import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import ClassCalendar from '../components/ClassCalendar'
import { courseListSchema, simpleBreadcrumb } from '../lib/schema'
import { SCHEDULE } from '../lib/schedule'

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
