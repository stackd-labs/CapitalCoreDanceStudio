import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb } from '../lib/schema'
import PrivacyNotice from '../components/PrivacyNotice'

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

  // Pre-select "trial" interest when arriving from a /contact?interest=trial link.
  useEffect(() => {
    if (searchParams.get('interest') === 'trial') {
      setForm((prev) => ({ ...prev, interest: 'trial' }))
      setTrialFromLink(true)
    }
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

  const inputClass = 'border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8]'

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Contact Capital Core Dance Studio | Midlothian, VA Dance Classes"
        description="Get in touch with Capital Core Dance Studio at 13110 Midlothian Turnpike, Midlothian, VA. Call (804) 234-4014, email info@capitalcoredance.com, or send us a message. Free trial classes available."
        canonical="/contact"
        jsonLd={simpleBreadcrumb('Contact', '/contact')}
      />
      <Navbar />
      <PageHeader
        eyebrow="We'd love to hear from you"
        title="Contact Us"
        subtitle="Questions about enrollment, schedules, or parties? Reach out and we'll get back to you soon."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-xl mx-auto">

          {trialFromLink && status !== 'success' && (
            <div className="mb-6 bg-[#daf0f7] border border-[#7ab3e8] rounded-lg px-5 py-4 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🩰</span>
              <div>
                <p className="text-navy-dark font-black text-base leading-snug">
                  Let's set up your free trial!
                </p>
                <p className="text-[#3a4a6a] text-sm mt-1 leading-relaxed">
                  Fill out the form below — include your dancer's name and age and we'll match them with the right class and follow up within 1–2 business days.
                </p>
              </div>
            </div>
          )}

          {status === 'success' ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-navy-dark font-black text-2xl mb-2">Message sent!</h2>
              <p className="text-[#5a6a8a] text-sm mb-6">
                Thanks for reaching out. We'll get back to you within 1–2 business days.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-brand-red text-sm font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-5" aria-label="Contact us" onSubmit={handleSubmit}>
              {/* Name row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-navy-dark text-sm font-semibold" htmlFor="firstName">
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
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-navy-dark text-sm font-semibold" htmlFor="lastName">
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
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-navy-dark text-sm font-semibold" htmlFor="email">
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

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-navy-dark text-sm font-semibold" htmlFor="phone">
                  Phone <span className="text-[#8a9aaa] font-normal">(optional)</span>
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

              {/* Interest */}
              <div className="flex flex-col gap-1.5">
                <label className="text-navy-dark text-sm font-semibold" htmlFor="interest">
                  I'm interested in...
                </label>
                <select
                  id="interest"
                  value={form.interest}
                  onChange={handleChange}
                  className={`${inputClass} text-[#3a4a6a]`}
                >
                  <option value="">Select an option</option>
                  <option value="trial">Register for a Free Trial</option>
                  <option value="classes">Year-Round Classes</option>
                  <option value="summer-classes">Summer Classes</option>
                  <option value="camps">Summer Camps</option>
                  <option value="adult-series">Adult Summer Series</option>
                  <option value="birthdays">Birthdays / Parties</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              {/* Dancer details — show when registering for trial */}
              {form.interest === 'trial' && (
                <div className="bg-[#daf0f7]/40 border border-[#c8ddf4] rounded-lg px-4 py-4 flex flex-col gap-4">
                  <p className="text-navy-dark text-xs font-bold tracking-[0.3em] uppercase">Free Trial Details</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-navy-dark text-sm font-semibold" htmlFor="dancerName">
                        Dancer's Name
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
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-navy-dark text-sm font-semibold" htmlFor="dancerAge">
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
                  <p className="text-[#5a6a8a] text-xs italic">
                    Tell us about your dancer in the message below — preferred class style, any prior experience, scheduling preferences. We'll pair them with the best fit.
                  </p>
                </div>
              )}

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-navy-dark text-sm font-semibold" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="How can we help?"
                  required
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {status === 'error' && (
                <p className="text-brand-red text-sm">{errorMsg}</p>
              )}

              <PrivacyNotice />

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-brand-red text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}

        </div>
      </section>

      <Footer />
    </div>
  )
}
