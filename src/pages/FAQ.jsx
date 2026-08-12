import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { Kicker, SectionHeading, PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'

// Rebuilt 2026-08-11 to the studio's site mockup (page 1i, accent green). The mockup
// shows every answer open in a two-column grid; with ~30 questions across seven
// categories that would be an enormous wall, so the accordion behaviour is kept and the
// mockup's presentation — two columns, hairline rule, green +, Barlow — is applied to
// it. The FAQPage JSON-LD still indexes every question regardless of open state.
const ACCENT = ACCENTS.green

const FAQS = [
  {
    category: 'Classes & Programs',
    items: [
      {
        q: 'What dance styles do you offer?',
        a: 'We offer a wide range of styles including ballet, jazz, hip hop, contemporary, tap, acro, tumbling, lyrical, musical theatre, Irish dance, and pom/cheer. We also offer preschool creative movement for our youngest dancers (ages 2–5) and adult fitness classes.',
      },
      {
        q: 'What ages do you teach?',
        a: 'We welcome dancers starting at age 2 all the way through adults. Our preschool classes (ages 2–5) focus on creative movement and basic technique, while our older programs offer progressive levels from beginner through advanced.',
      },
      {
        q: 'Do you have classes for beginners?',
        a: 'Absolutely. Most of our classes are open to beginners and we never assume prior experience. Our instructors are trained to work with all skill levels in a supportive, encouraging environment.',
      },
      {
        q: 'How long is each class?',
        a: 'Class lengths range from 30 minutes (preschool/tiny classes) to 90 minutes depending on the style, age group, and level. You can view our full schedule on the Classes page.',
      },
      {
        q: 'What is the Mini Series?',
        a: 'The Mini Series is a short-term program where each class combines two dance styles into one fun session. A low-commitment way for dancers to try something new — typically offered in spring and fall.',
      },
    ],
  },
  {
    category: 'Enrollment & Tuition',
    items: [
      {
        q: 'Is there a free trial class?',
        a: 'Yes — your first class is always free, no commitment required. Just fill out our Contact form, choose "Register for a Free Trial" from the interest dropdown, and we\'ll match your dancer with the right class within 1–2 business days.',
      },
      {
        q: 'How do I enroll my child?',
        a: 'You can enroll online through our student portal. If you have questions before signing up, feel free to reach out to us by phone at 804-234-4014 or by email at info@capitalcoredance.com.',
      },
      {
        q: 'How much do classes cost?',
        a: 'Class pricing is based on class length: 30-minute classes are $65/month, 45-minute classes are $85/month, 60-minute classes are $105/month, 75-minute classes are $125/month, and 90-minute classes are $150/month. Full-semester rates are also available.',
      },
      {
        q: 'What is the registration fee?',
        a: 'There is a $65 registration fee per dancer per semester, or $120 for the full year (both semesters). Sibling discounts and family fee caps are available for families with multiple dancers enrolled.',
      },
      {
        q: 'When are your semesters?',
        a: 'We run two semesters per year: Fall (August – December) and Spring (January – June). Once registered, dancers are locked into their classes and pricing for the semester.',
      },
      {
        q: 'Do you offer discounts?',
        a: 'Yes. We offer multi-class discounts for dancers enrolled in more than one class, multi-student discounts for families with multiple dancers, and sibling discounts on registration fees. Reach out to us for details.',
      },
      {
        q: 'How do I pay?',
        a: 'All payments are made securely through our online student portal. We accept all major credit and debit cards, ACH transfers, and checks. If you have trouble with the portal, just contact us and we\'ll help.',
      },
    ],
  },
  {
    category: 'Summer Classes',
    items: [
      {
        q: 'Do you offer summer dance classes?',
        a: 'Yes! Our 6-week summer session runs June 23 – July 30, 2026 with classes on Tuesday and Wednesday evenings. We have classes for dancers ages 2 through teen including Tiny Ballet & Tumble, Tumble Techniques, Beginner Ballet & Tap, Hip Hop, and a Tik Tok Hip Hop workshop.',
      },
      {
        q: 'How much do summer classes cost?',
        a: 'We offer three pricing options: per-class enrollment for the full 6 weeks ($120–$180 each depending on length), a Summer Flex Pass ($329 for unlimited classes all summer — best value), or single drop-ins ($25 per class per week).',
      },
      {
        q: 'How do I sign up for summer classes?',
        a: 'Sign-ups go through the Summer Class form on our website. A $50 deposit reserves your dancer\'s spot and applies toward tuition (drop-ins are paid in full at signup). You can also choose to pay tuition in full at signup if you prefer.',
      },
      {
        q: 'Can I sign up multiple dancers at once?',
        a: 'Yes — the summer class signup lets you add as many dancers as you\'d like. Each dancer picks their own classes (or Flex Pass, or drop-in) and the deposit scales accordingly ($50 per dancer for per-class and Flex Pass enrollments; drop-ins are $25 each).',
      },
      {
        q: 'My dancer is already enrolled at Capital Core — do I have to re-enter their info?',
        a: 'No! Just mark them as a "Returning Dancer" on the signup form and provide their name. We\'ll pull age, gender, and other details from our records.',
      },
    ],
  },
  {
    category: 'Summer Camps',
    items: [
      {
        q: 'Do you offer summer camps?',
        a: 'Yes! We offer 8 themed summer camp weeks for dancers ages 4–13. Camps run Monday through Friday, 9:30 AM to 3:30 PM, from June through August 2026. Each week has a different creative theme packed with dance, games, and activities.',
      },
      {
        q: 'How much do summer camps cost?',
        a: 'Full week (M–F): $205 for current dancers, $225 for non-studio campers. Half-day full week: $155 / $175. Single full day: $50 / $55. Single half day: $35 / $40. Before-care and after-care available at $15/hour.',
      },
      {
        q: 'How do I register for a summer camp?',
        a: 'Camp registration happens through the form on our Summer Camps page. A $50 deposit per camper holds the spot, and you can register multiple campers in one transaction — each camper picks their own weeks, attendance type, and before/after care.',
      },
      {
        q: 'Can my dancer do both a summer camp week and a summer class?',
        a: 'Absolutely — dancers are welcome to participate in both! However, they cannot be left at the studio between camp and their class. Families would need to pick up their dancer after camp ends and bring them back when their class begins.',
      },
    ],
  },
  {
    category: 'Adult Summer Series',
    items: [
      {
        q: 'What is the Adult Summer Series?',
        a: 'It\'s a 90-minute movement experience for women — one class that flows through three parts: Throwback Energy, Femme Flow, and Calm Confidence. Beginner friendly, no experience needed, in a supportive, judgment-free space. Move. Connect. Grow.',
      },
      {
        q: 'When and where does it meet?',
        a: 'Mondays from 6:00 to 7:30 PM, six weeks starting Monday, June 29, 2026 (June 29 and July 6, 13, 20, 27, plus August 3). All classes are at our studio in Midlothian, VA.',
      },
      {
        q: 'How do I sign up and what does it cost?',
        a: 'Registration is open online — visit the Adult Summer Series page and reserve your spot with secure payment. It\'s $25 per drop-in class, or grab the Summer Series Pass for $120 to attend all six Mondays and save $30. Spots are limited.',
      },
      {
        q: 'What\'s included in each class?',
        a: 'Every 90-minute class includes all three: 45 minutes of Throwback Energy (feel-good, high-energy dance to throwback hits), 30 minutes of Femme Flow (graceful, empowering movement that builds confidence), and 15 minutes of Calm Confidence (stretch, breathe, and reconnect to leave feeling centered).',
      },
    ],
  },
  {
    category: 'Birthday Parties',
    items: [
      {
        q: 'Do you host birthday parties?',
        a: 'Yes! Our birthday parties are a fun, active, and stress-free way to celebrate. Each party includes a private studio space, an instructor-led dance party, themed activities, music, tables and chairs, and set-up and clean-up. Parents just bring the cake and food.',
      },
      {
        q: 'How much do birthday parties cost?',
        a: 'Packages start at $199 and include up to 10 children for a 90-minute private party. Additional children can be added. A $50 non-refundable deposit is required to book, with the balance due on party day.',
      },
      {
        q: 'What themes are available for birthday parties?',
        a: 'We offer a variety of themes including Princess & Fairytale Dance, Hip Hop Dance Party, Pop Star Dance Party, Glow Dance Party, Unicorn & Rainbow Party, Preschool Wiggle & Giggle, Tea Party & Royal Celebration, Superhero Movement Party, and Dance & Craft Party. Custom themes and upgrades (like glow parties and crafts) are also available.',
      },
      {
        q: 'How do I book a birthday party?',
        a: 'You can book by completing our online booking form on the Birthday Parties page. We recommend booking in advance as availability is limited — especially on weekends.',
      },
    ],
  },
  {
    category: 'Studio Info',
    items: [
      {
        q: 'Where are you located?',
        a: 'We are located at 13110 Midlothian Turnpike, Midlothian, VA 23113. We serve the greater Midlothian, Chesterfield, and Richmond, Virginia area.',
      },
      {
        q: 'What are your studio hours?',
        a: 'Our general studio hours are Monday through Friday 3:00 PM – 8:00 PM and Saturday 9:00 AM – 2:00 PM. Specific class times vary — check the Classes page for the full schedule.',
      },
      {
        q: 'How can I contact you?',
        a: 'You can reach us by phone at 804-234-4014, by email at info@capitalcoredance.com, or by submitting the form on our Contact page. We are also active on Instagram and Facebook @capitalcoredance.',
      },
    ],
  },
]

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
        description="Answers to common questions about classes, enrollment, tuition, summer camps, birthday parties, and our annual recital at Capital Core Dance Studio in Midlothian, VA. Serving Chesterfield County and Richmond."
        canonical="/faq"
        jsonLd={[JSON_LD, simpleBreadcrumb('FAQ', '/faq')]}
      />

      <Navbar />

      <Hero
        eyebrow="For new families"
        title={['Common', [{ text: 'questions', accent: ACCENT }]]}
        tagline="Dress code · trials · recital · billing"
        body="Everything you need to know about classes, enrollment, tuition, camps, and more. If your question isn't here, just ask us."
        photoCaption="Lobby photo"
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
