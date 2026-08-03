import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb } from '../lib/schema'

const CLASS_PRICES = [
  { duration: '30 Min', monthly: '$65' },
  { duration: '45 Min', monthly: '$85' },
  { duration: '60 Min', monthly: '$105' },
  { duration: '75 Min', monthly: '$125' },
  { duration: '90 Min', monthly: '$150' },
]

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
  'border-brand-red',
]

export default function Tuition() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Dance Class Tuition &amp; Fees | Capital Core Dance Studio – Midlothian, VA"
        description="Transparent dance class pricing in Midlothian, VA. Monthly rates from $65 (30-min) to $150 (90-min) classes. Registration fee, sibling discounts, and recital costs explained."
        canonical="/tuition"
        jsonLd={simpleBreadcrumb('Tuition', '/tuition')}
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Tuition & Fees"
        subtitle="Class prices are based on class length and are billed monthly, unless noted as a full-semester class."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">

          {/* Semester info */}
          <div>
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">How It Works</p>
            <h2 className="text-navy-dark text-2xl font-black mb-4">Semester-based enrollment</h2>
            <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">
              Once registered, dancers are locked into their classes and prices for the semester.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-4 text-center">
                <div className="text-navy-dark font-black text-base mb-1">Fall Semester</div>
                <div className="text-[#5a6a8a] text-sm">August – December</div>
              </div>
              <div className="flex-1 bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-4 text-center">
                <div className="text-navy-dark font-black text-base mb-1">Spring Semester</div>
                <div className="text-[#5a6a8a] text-sm">January – June</div>
              </div>
            </div>
          </div>

          {/* Registration fee */}
          <div className="border border-surface-border border-l-4 border-l-[#7ab3e8] rounded-lg px-5 py-5">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Registration Fee</p>
            <h3 className="text-navy-dark text-lg font-black mb-3">Per dancer, per semester</h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 bg-white border border-surface-border rounded-lg px-4 py-3 text-center">
                <div className="text-[#3a4a6a] text-xs uppercase tracking-widest mb-1">Per Semester</div>
                <div className="text-navy-dark font-black text-2xl">$65</div>
              </div>
              <div className="flex-1 bg-white border border-surface-border rounded-lg px-4 py-3 text-center">
                <div className="text-[#3a4a6a] text-xs uppercase tracking-widest mb-1">Full Year (Both Semesters)</div>
                <div className="text-navy-dark font-black text-2xl">$120</div>
              </div>
            </div>
            <p className="text-[#5a6a8a] text-xs italic">
              Sibling discounts and family fee caps available for families with multiple dancers enrolled.
            </p>
          </div>

          {/* Class prices */}
          <div>
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Class Pricing</p>
            <h2 className="text-navy-dark text-2xl font-black mb-2">Priced by class length</h2>
            <p className="text-[#5a6a8a] text-sm mb-6">Prices are per class. Multi-class and multi-student discounts available.</p>

            <div className="flex flex-col gap-3">
              {CLASS_PRICES.map(({ duration, monthly }, i) => (
                <div
                  key={duration}
                  className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i]} rounded-lg px-5 py-4 flex flex-wrap items-center justify-between gap-3`}
                >
                  <div className="font-bold text-navy-dark text-base">{duration} Classes</div>
                  <div className="text-right">
                    <div className="text-[#5a6a8a] text-xs uppercase tracking-wide">Monthly</div>
                    <div className="text-navy-dark font-black text-lg">{monthly}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[#5a6a8a] text-xs mt-4 italic">
              Semester rates vary — reach out to us directly for full-semester pricing.
            </p>
          </div>

          {/* Discounts callout */}
          <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-5">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Discounts Available</p>
            <ul className="flex flex-col gap-2">
              {[
                'Multi-class discount for dancers enrolled in more than one class',
                'Multi-student discounts for families with multiple dancers',
                'Sibling discounts and family fee caps on registration fees',
              ].map((item) => (
                <li key={item} className="text-[#3a4a6a] text-sm flex gap-2">
                  <span className="text-brand-red mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment info */}
          <div className="border border-surface-border border-l-4 border-l-[#f4a060] rounded-lg px-5 py-5">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Payment</p>
            <h3 className="text-navy-dark text-lg font-black mb-3">How to pay</h3>
            <ul className="flex flex-col gap-2 mb-3">
              {[
                'All major credit/debit cards accepted',
                'ACH transfers and checks accepted',
                'Payments made directly through our iClassPortal website',
              ].map((item) => (
                <li key={item} className="text-[#3a4a6a] text-sm flex gap-2">
                  <span className="text-[#f4a060] mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[#5a6a8a] text-xs italic">
              Having trouble with the portal? Reach out to us and we'll help.
            </p>
          </div>

          {/* Separately priced programs note. "Specialty Classes" was removed here on
              2026-08-03: the Class Levels page uses that term for Musical Theatre and
              Pom Cheer, which are regular schedule classes on standard tuition. */}
          <div className="border border-dashed border-surface-border rounded-lg px-5 py-4 text-center">
            <p className="text-[#5a6a8a] text-sm">
              Dance Teams, Events, Clinics, and Workshops have their own pricing — view details on their individual event pages.
            </p>
          </div>

          <Link
            to="/contact"
            className="block w-full bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Questions? Contact Us
          </Link>

        </div>
      </section>

      <Footer />
    </div>
  )
}
