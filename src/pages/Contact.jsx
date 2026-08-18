import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import AccentStripe from '../components/AccentStripe'
import { PrimaryAction, GhostAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import PrivacyNotice from '../components/PrivacyNotice'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Rebuilt 2026-08-11 to the studio's site mockup (page 1g). Contact is one of two pages
// that wear the full five-accent stripe hero rather than a single wedge — the mockup
// labels it "all five accents" — with "HELLO" tinted a letter at a time.
//
// The form's behaviour is unchanged from before the redesign: same field ids, same
// /api/notify call, same awaited-and-checked response, same trial deep link. Only the
// presentation moved. Read the comment on handleSubmit before touching it.
const ACCENT = ACCENTS.red
const RULE = ACCENTS.gold // the mockup's colour for the info-column rules

const HELLO = [
  { text: 'h', accent: ACCENTS.red },
  { text: 'e', accent: ACCENTS.orange },
  { text: 'l', accent: ACCENTS.gold },
  { text: 'l', accent: ACCENTS.teal },
  { text: 'o', accent: ACCENTS.pink },
]

const MAP_URL = 'https://maps.google.com/?q=13110+Midlothian+Turnpike+Midlothian+VA+23113'

// Every reason a visitor writes in, mapped to what the site actually offers today. It is
// grouped because a flat list of fourteen is a wall; the groups are the site's own shape
// (programs, then enrolling, then everything else), so a parent finds their line by
// scanning three headings rather than fourteen options.
//
// The value, not the label, is what reaches the studio's inbox, so this list is also the
// vocabulary api/notify.js labels a submission with — add an option here and add its
// label there. Values double as ?interest= deep-link targets.
//
// 'trial' is load-bearing three ways: the banner above the form, the dancer name/age
// fields below, and the "New Free Trial Request" subject line in api/notify.js. Renaming
// it silently breaks all three.
//
// The three summer entries stay listed year-round at the studio's request (2026-08-18),
// even though their pages are commented out of App.jsx while summer registration is
// closed. A dropdown option is a topic, not a link, and families ask about next summer
// long before the pages come back — so nothing here depends on those routes being live.
const INTEREST_GROUPS = [
  {
    label: 'Classes & programs',
    options: [
      { value: 'trial', label: 'Register for a Free Trial' },
      { value: 'classes', label: 'Year-Round Classes' },
      { value: 'class-levels', label: 'Class Levels & Placement' },
      { value: 'little-movers', label: 'Little Movers (ages 0–5)' },
      { value: 'adult-classes', label: 'Adult Classes' },
      { value: 'dance-company', label: 'Dance Company / Competition Team' },
      { value: 'summer-classes', label: 'Summer Classes' },
      { value: 'camps', label: 'Summer Camps' },
      { value: 'adult-series', label: 'Adult Summer Series' },
    ],
  },
  {
    label: 'Visiting & enrolling',
    options: [
      { value: 'tour', label: 'Schedule a Studio Tour' },
      { value: 'tuition', label: 'Tuition, Fees & Discounts' },
      { value: 'registration-help', label: 'Help With Registration or Payment' },
    ],
  },
  {
    label: 'Events & everything else',
    options: [
      { value: 'birthdays', label: 'Birthdays / Parties' },
      { value: 'newsletter', label: 'Studio News & Updates' },
      { value: 'employment', label: 'Teaching or Working at the Studio' },
      { value: 'partnership', label: 'Affiliate or Partnership' },
      { value: 'general', label: 'General Inquiry' },
    ],
  },
]

const INTEREST_VALUES = new Set(
  INTEREST_GROUPS.flatMap((group) => group.options.map((option) => option.value))
)

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  interest: '',
  dancerName: '',
  dancerAge: '',
  message: '',
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [trialFromLink, setTrialFromLink] = useState(false)

  // Pre-select the interest when arriving from a /contact?interest=<value> link. Any value
  // in INTEREST_GROUPS works, so a page can send a visitor here with their topic already
  // chosen; an unrecognised value is ignored rather than selecting a blank option. Only
  // the trial opens the extra banner and the dancer fields.
  useEffect(() => {
    const interest = searchParams.get('interest')
    if (!interest || !INTEREST_VALUES.has(interest)) return
    setForm((prev) => ({ ...prev, interest }))
    if (interest === 'trial') setTrialFromLink(true)
  }, [searchParams])

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    // This form is email-only as of 2026-08-03 — it no longer writes to Supabase, so
    // the Resend email IS the record of the submission. That means the request must be
    // awaited and its result checked: the old fire-and-forget `.catch(() => {})` was
    // safe when the database held the data, but here a swallowed failure would show
    // the visitor "message sent" while nothing reached the studio.
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'contact',
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          interest: form.interest,
          dancerName: form.dancerName,
          dancerAge: form.dancerAge,
          message: form.message,
        }),
      })

      if (!response.ok) throw new Error(`notify responded ${response.status}`)

      setStatus('success')
      setForm(INITIAL_FORM)
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again or email us directly at info@capitalcoredance.com.')
    }
  }

  const labelClass =
    'font-body text-[11px] font-semibold tracking-[0.16em] uppercase text-mist-500'
  const inputClass =
    'h-[46px] border border-white/20 bg-white/[0.04] px-4 font-body text-sm text-white placeholder:text-mist-500/70 focus:outline-none focus:border-white focus:bg-white/[0.08] transition-colors'

  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Contact Capital Core Dance Studio | Midlothian, VA Dance Classes"
        description="Get in touch with Capital Core Dance Studio at 13110 Midlothian Turnpike, Midlothian, VA. Call (804) 234-4014, email info@capitalcoredance.com, or send us a message. Free trial classes available."
        canonical="/contact"
        jsonLd={simpleBreadcrumb('Contact', '/contact')}
      />
      <Navbar />

      <Hero
        variant="stripe"
        eyebrow="We answer within a day"
        title={['Come say', HELLO]}
        tagline="Tours · trials · registration help"
        body="Questions about enrollment, schedules, or parties? Send a message and we'll get back to you within 1–2 business days — or just call the studio."
        photoCaption="Map or lobby photo"
        photoSrc="/logo.png"
        photoAlt="Capital Core Dance Studio crest"
        photoFit="contain"
        actions={
          <>
            <PrimaryAction accent={ACCENT} href="#message">
              Send a message
            </PrimaryAction>
            <GhostAction href="tel:8042344014">Call the studio</GhostAction>
          </>
        }
      />

      <section id="message" className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20 flex-1 scroll-mt-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-16">
          {/* Form */}
          <div>
            <h2 className="font-display uppercase text-white text-[32px] lg:text-[38px] leading-none m-0 mb-7">
              Send a message
            </h2>

            {trialFromLink && status !== 'success' && (
              <div
                className="mb-7 border-l-4 bg-white/[0.04] px-5 py-4"
                style={{ borderColor: ACCENTS.teal }}
              >
                <p className="font-body text-white font-bold text-base leading-snug">
                  Let&apos;s set up your free trial!
                </p>
                <p className="font-body text-mist-400 text-sm mt-1 leading-relaxed">
                  Fill out the form below — include your dancer&apos;s name and age and we&apos;ll
                  match them with the right class and follow up within 1–2 business days.
                </p>
              </div>
            )}

            {status === 'success' ? (
              <div className="py-14">
                <div className="font-display text-[64px] leading-none" style={{ color: ACCENTS.teal }}>
                  ✓
                </div>
                <h3 className="font-display uppercase text-white text-3xl leading-none mt-4 mb-3">
                  Message sent!
                </h3>
                <p className="font-body text-mist-400 text-sm mb-6">
                  Thanks for reaching out. We&apos;ll get back to you within 1–2 business days.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="font-body text-sm font-bold hover:underline"
                  style={{ color: ACCENT }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="flex flex-col" aria-label="Contact us" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass} htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass} htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass} htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass} htmlFor="phone">
                      Phone <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="(000) 000-0000"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-[18px]">
                  <label className={labelClass} htmlFor="interest">
                    I&apos;m interested in...
                  </label>
                  <select
                    id="interest"
                    value={form.interest}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {/* bg-ink-panel on every option and group: the select is a translucent
                        white pane, but the open dropdown is painted by the OS and would
                        otherwise fall back to near-white text on near-white. */}
                    <option value="" className="bg-ink-panel">Select an option</option>
                    {INTEREST_GROUPS.map((group) => (
                      <optgroup key={group.label} label={group.label} className="bg-ink-panel">
                        {group.options.map((option) => (
                          <option key={option.value} value={option.value} className="bg-ink-panel">
                            {option.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Dancer details — show when registering for trial */}
                {form.interest === 'trial' && (
                  <div
                    className="mt-[18px] border-l-4 bg-white/[0.04] px-5 py-5 flex flex-col gap-4"
                    style={{ borderColor: ACCENTS.teal }}
                  >
                    <p className="font-body text-white text-[11px] font-bold tracking-[0.3em] uppercase">
                      Free Trial Details
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
                      <div className="flex flex-col gap-2">
                        <label className={labelClass} htmlFor="dancerName">
                          Dancer&apos;s Name
                        </label>
                        <input
                          id="dancerName"
                          type="text"
                          placeholder="Dancer's name"
                          value={form.dancerName}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className={labelClass} htmlFor="dancerAge">
                          Age
                        </label>
                        <input
                          id="dancerAge"
                          type="text"
                          placeholder="e.g. 7"
                          value={form.dancerAge}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <p className="font-body text-mist-500 text-xs italic leading-relaxed">
                      Tell us about your dancer in the message below — preferred class style, any
                      prior experience, scheduling preferences. We&apos;ll pair them with the best
                      fit.
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-[18px]">
                  <label className={labelClass} htmlFor="message">
                    How can we help?
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="How can we help?"
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="h-[130px] border border-white/20 bg-white/[0.04] px-4 py-3 font-body text-sm text-white placeholder:text-mist-500/70 focus:outline-none focus:border-white focus:bg-white/[0.08] transition-colors resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="font-body text-sm mt-4" style={{ color: ACCENT }} role="alert">
                    {errorMsg}
                  </p>
                )}

                <AccentStripe className="mt-[26px] w-[220px] h-1" />

                <div className="mt-5">
                  <PrivacyNotice />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="self-start mt-[22px] font-body font-bold text-[15px] px-[34px] py-[17px] transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: ACCENT, color: onAccent(ACCENT) }}
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Studio details */}
          <div data-testid="studio-details" className="flex flex-col gap-[34px]">
            <div className="border-t-[3px] pt-4" style={{ borderColor: RULE }}>
              <h3 className="font-display uppercase text-white text-2xl leading-none mb-3">Visit</h3>
              <div className="flex flex-col gap-[7px] font-body text-[15px] leading-[1.5] text-mist-400">
                <a href={MAP_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  13110 Midlothian Turnpike
                  <br />
                  Midlothian, VA 23113
                </a>
                <span className="text-mist-500 text-sm">Free parking at the door.</span>
              </div>
            </div>

            <div className="border-t-[3px] pt-4" style={{ borderColor: RULE }}>
              <h3 className="font-display uppercase text-white text-2xl leading-none mb-3">
                Call or email
              </h3>
              <div className="flex flex-col gap-[7px] font-body text-[15px] leading-[1.5] text-mist-400">
                <a href="tel:8042344014" className="hover:text-white transition-colors">
                  804-234-4014
                </a>
                <a
                  href="mailto:info@capitalcoredance.com"
                  className="hover:text-white transition-colors"
                >
                  info@capitalcoredance.com
                </a>
                <span className="text-mist-500 text-sm">We reply within 1–2 business days.</span>
              </div>
            </div>

            <div className="border-t-[3px] pt-4" style={{ borderColor: RULE }}>
              <h3 className="font-display uppercase text-white text-2xl leading-none mb-3">Follow</h3>
              <div className="flex flex-col gap-[7px] font-body text-[15px] leading-[1.5] text-mist-400">
                <a
                  href="https://www.instagram.com/capitalcoredance"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/p/Capital-Core-Dance-Challenge-61566002721661/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
                <span className="text-mist-500 text-sm">
                  Class photos, schedule changes and studio news.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
