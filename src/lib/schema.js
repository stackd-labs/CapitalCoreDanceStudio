// Shared JSON-LD schema helpers for SEO + AI-search structured data.
// Schema.org reference: https://schema.org/

// Must match SITE_URL in src/components/SEO.jsx — see the note there for why this is
// the www host and not the bare domain.
const SITE_URL = 'https://www.capitalcoredance.com'
const PHONE = '+1-804-234-4014'
const EMAIL = 'info@capitalcoredance.com'

// Address used everywhere
const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: '13110 Midlothian Turnpike',
  addressLocality: 'Midlothian',
  addressRegion: 'VA',
  postalCode: '23113',
  addressCountry: 'US',
}

const GEO = {
  '@type': 'GeoCoordinates',
  latitude: 37.50376329673492,
  longitude: -77.64043756100419,
}

const SOCIAL = [
  'https://www.instagram.com/capitalcoredance',
  'https://www.facebook.com/p/Capital-Core-Dance-Challenge-61566002721661/',
]

// SETTLED by the studio 2026-08-19: the published closing time is 8:00 PM.
//
// This deliberately does not match the last class of the week. Monday's Adult
// Femme/Flair runs to 8:45 PM and Wednesday's Adult Pom to 8:15 PM, so a dancer can be
// in the room after the posted hours. That is the studio's call — these are front-desk
// hours, not the last time the lights go off — and the Classes page is where a family
// reads the actual class times. It was briefly changed to 21:00 during the 2026-08-19
// audit and put back.
//
// The same hours appear in src/lib/faqs.js and public/llms.txt. All three move together.
//
// Saturday is kept: nothing on the fall class schedule runs then, but the Birthdays
// page sells weekend parties, so the door is open even though no class meets.
const HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '15:00',
    closes: '20:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: 'Saturday',
    opens: '09:00',
    closes: '14:00',
  },
]

const AREA_SERVED = [
  { '@type': 'City', name: 'Midlothian', '@id': 'https://en.wikipedia.org/wiki/Midlothian,_Virginia' },
  { '@type': 'City', name: 'Richmond' },
  { '@type': 'City', name: 'Chesterfield' },
  { '@type': 'AdministrativeArea', name: 'Chesterfield County' },
]

// ── Reusable: organization / business ─────────────────────────
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'DanceSchool',
  '@id': `${SITE_URL}/#dance-school`,
  name: 'Capital Core Dance Studio',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: PHONE,
  email: EMAIL,
  address: ADDRESS,
  geo: GEO,
  openingHoursSpecification: HOURS,
  priceRange: '$$',
  // Rewritten 2026-08-19. This object is the JSON-LD on the home page, so it is the
  // studio describing itself to Google. It had been advertising summer camps and an
  // annual recital, both retired, and Irish dance, which is not on the schedule —
  // the FAQ dropped Irish for that reason and the careers page is still hiring
  // someone to start it. The styles below match the fall schedule and the answer in
  // src/lib/faqs.js. Keep the three in step.
  description:
    'Capital Core Dance Studio offers year-round dance classes, Little Movers movement classes for babies and preschoolers, adult evening classes, a youth performance and competition company, and birthday parties in Midlothian, VA. Styles include ballet, jazz, hip hop, contemporary, tap, acro, tumbling, lyrical, modern, breakdancing, musical theatre, and pom/cheer.',
  areaServed: AREA_SERVED,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Capital Core Dance Studio Programs',
    // Four of the six offers here pointed at routes retired in July, so the home
    // page handed Google a catalogue of dead URLs while omitting the three
    // programmes actually being sold. Replaced 2026-08-19. Every URL below must be
    // a live route in App.jsx — check before adding one back.
    itemListElement: [
      { '@type': 'Offer', name: 'Year-Round Dance Classes', url: `${SITE_URL}/classes` },
      { '@type': 'Offer', name: 'Little Movers (Babies to Age 5)', url: `${SITE_URL}/little-movers` },
      { '@type': 'Offer', name: 'Adult Dance Classes', url: `${SITE_URL}/adult-classes` },
      { '@type': 'Offer', name: 'Capital Core Dance Company', url: `${SITE_URL}/dance-company` },
      { '@type': 'Offer', name: 'Birthday Party Packages', url: `${SITE_URL}/birthdays` },
    ],
  },
  sameAs: SOCIAL,
}

// ── Breadcrumbs ───────────────────────────────────────────────
// items: [{ name: 'Home', path: '/' }, { name: 'Classes', path: '/classes' }]
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

// ── Event (recital) ───────────────────────────────────────────
export function eventSchema({
  name,
  description,
  startDate,
  endDate,
  performer,
  offerUrl,
  offerPrice,
  offerName,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TheaterEvent',
    name,
    description,
    startDate,
    endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Richmond Christian School',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '6511 Belmont Rd',
        addressLocality: 'Chesterfield',
        addressRegion: 'VA',
        postalCode: '23832',
        addressCountry: 'US',
      },
    },
    image: `${SITE_URL}/ticket-banner.png`,
    organizer: {
      '@type': 'Organization',
      name: 'Capital Core Dance Studio',
      url: SITE_URL,
    },
    performer: performer || {
      '@type': 'PerformingGroup',
      name: 'Capital Core Dance Studio Dancers',
    },
    offers: offerUrl
      ? {
          '@type': 'Offer',
          name: offerName || 'General Admission',
          price: offerPrice,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: offerUrl,
        }
      : undefined,
  }
}

// ── Course (classes) ──────────────────────────────────────────
// styles: array of strings (e.g. 'Ballet', 'Hip Hop', etc.)
export function courseListSchema(styles) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Dance Classes at Capital Core Dance Studio',
    itemListElement: styles.map((style, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: `${style} — Capital Core Dance Studio`,
        description: `${style} dance classes for kids, teens, and adults in Midlothian, VA. Beginner through advanced levels.`,
        provider: {
          '@type': 'DanceSchool',
          name: 'Capital Core Dance Studio',
          url: SITE_URL,
          sameAs: SITE_URL,
        },
        url: `${SITE_URL}/classes`,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'in-person',
          location: {
            '@type': 'Place',
            name: 'Capital Core Dance Studio',
            address: ADDRESS,
          },
        },
      },
    })),
  }
}

// ── Product (recital shirts/tickets) ──────────────────────────
export function productSchema({ name, description, image, price, priceCurrency = 'USD', availability = 'https://schema.org/InStock', url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image ? `${SITE_URL}${image}` : `${SITE_URL}/og-image.jpg`,
    brand: {
      '@type': 'Brand',
      name: 'Capital Core Dance Studio',
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability,
      url: url ? `${SITE_URL}${url}` : SITE_URL,
    },
  }
}

// Convenience: build a "Home > X" breadcrumb
export function simpleBreadcrumb(currentName, currentPath) {
  return breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: currentName, path: currentPath },
  ])
}

// ── FAQ (answer-engine optimization) ──────────────────────────
// faqs: [{ q, a }]
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

// ── Blog post (article) ───────────────────────────────────────
export function blogPostingSchema({ title, description, slug, datePublished, dateModified, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: image ? `${SITE_URL}${image}` : `${SITE_URL}/og-image.jpg`,
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: 'en-US',
    url: `${SITE_URL}/blog/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
    author: {
      '@type': 'Organization',
      name: 'Capital Core Dance Studio',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Capital Core Dance Studio',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
  }
}

// ── Blog index (list of posts) ────────────────────────────────
// posts: [{ slug, title, description }]
export function blogListSchema(posts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Capital Core Dance Studio Blog',
    description:
      'News, guides, and tips on dance classes, summer camps, the annual recital, birthday parties, and studio events in Midlothian, VA.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Capital Core Dance Studio',
      url: SITE_URL,
    },
    blogPost: posts.map(({ slug, title, description }) => ({
      '@type': 'BlogPosting',
      headline: title,
      description,
      url: `${SITE_URL}/blog/${slug}`,
    })),
  }
}
