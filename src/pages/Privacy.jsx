import LegalPage from '../components/LegalPage'
import { simpleBreadcrumb } from '../lib/schema'
import { ACCENTS } from '../lib/pageAccents'

// Rebuilt 2026-08-11 to the studio's site mockup (accent pink). Privacy and Terms are
// the same layout in different accents, so both render the shared LegalPage shell; only
// the copy below is page-specific. Section text is unchanged from before the redesign.
const ACCENT = ACCENTS.pink

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: [
      'We collect information you provide directly when you contact us through the form on this website, ask about a class or a free trial, or request a birthday party. This typically includes your name, email address, phone number, and details about your dancer (name, age, and anything else you choose to tell us).',
      'Enrollment, tuition payments and party bookings are handled on our studio portal at studio.capitalcoredance.com, which is a separate system with its own sign-in. Information you enter there, including billing details and emergency contacts, is collected by that system rather than by this website.',
      'We may also collect basic technical information automatically when you visit our website — such as browser type, device type, and pages visited — to help us improve the site experience.',
    ],
  },
  {
    title: 'How We Use Your Information',
    body: [
      'We use the information we collect to register dancers, schedule classes and parties, process payments, send confirmations and receipts, communicate about your enrollment or upcoming events, and respond to questions you send us.',
      'We do not sell your personal information.',
    ],
  },
  {
    title: 'Third-Party Services',
    body: [
      'To run the studio and this website, we rely on a small set of trusted services that handle data on our behalf:',
    ],
    list: [
      'Resend — email delivery, which is how a message you send through this site reaches the studio',
      'Vercel — website hosting',
    ],
    after: 'Each of these services has their own privacy practices, and we share only the information needed for them to perform their function.',
  },
  {
    title: 'Cookies & Analytics',
    body: [
      'Our website may use cookies or similar technologies to keep your session active, remember preferences, and understand which pages are most useful to families. You can control cookies through your browser settings.',
      'On your first visit you will see a short notice at the bottom of the page summarizing this policy. Selecting "Got it" acknowledges that you have read this Privacy Policy and stores a small preference in your browser so the notice is not shown again. It is not a marketing or advertising consent — we do not use third-party advertising trackers on this site.',
    ],
  },
  {
    title: 'Children\'s Privacy',
    body: [
      'Capital Core Dance Studio works with dancers of all ages, including children under 13. We collect information about minor dancers only from a parent or guardian as part of enrollment or event registration. We use this information solely for studio operations and never for marketing to children directly.',
    ],
  },
  {
    title: 'Data Security',
    body: [
      'We take reasonable steps to protect the information we collect. This website does not take payments and never asks for card details: tuition, registration and party balances are all handled on the studio portal, which uses industry-standard encryption. We never store full credit card numbers on this website or its servers.',
    ],
  },
  {
    title: 'Your Choices',
    body: [
      'You can request to access, correct, or delete information we hold about you or your dancer at any time by contacting us at info@capitalcoredance.com. You may unsubscribe from non-essential email at any time using the unsubscribe link in those emails or by contacting us directly.',
    ],
  },
  {
    title: 'Updates to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. The "Last Updated" date below will reflect the most recent revision. Significant changes will be communicated where appropriate.',
    ],
  },
]

const PRIVACY_SEO = {
  title: 'Privacy Policy | Capital Core Dance Studio',
  description:
    'Privacy Policy for Capital Core Dance Studio in Midlothian, VA — how we collect, use, and protect your information.',
  canonical: '/privacy',
  jsonLd: simpleBreadcrumb('Privacy Policy', '/privacy'),
}

export default function Privacy() {
  return (
    <LegalPage
      accent={ACCENT}
      seo={PRIVACY_SEO}
      eyebrow="Updated May 2026"
      title={['Privacy', [{ text: 'policy', accent: ACCENT }]]}
      tagline="What we collect and why"
      intro="Capital Core Dance Studio values your privacy. This policy explains what information we collect when you visit our website or use our services, how we use it, and the choices you have."
      lastUpdated="May 1, 2026"
      sections={SECTIONS}
      readLabel="Read the policy"
      askLabel="Privacy questions"
    />
  )
}
