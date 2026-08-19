import { Helmet } from 'react-helmet-async'

// The www host, not the bare domain. Production 308s capitalcoredance.com to
// www.capitalcoredance.com, so a canonical on the bare domain pointed every page at
// a URL that immediately redirects to the one the reader is already on. Corrected
// 2026-08-19. If the domain config is ever flipped to serve the bare domain, change
// this and the matching constant in src/lib/schema.js together.
const SITE_URL = 'https://www.capitalcoredance.com'
const DEFAULT_OG_IMAGE = '/og-image.jpg'

export default function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  jsonLd,
}) {
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL
  const imageUrl = `${SITE_URL}${ogImage}`
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []
  const robots = noindex ? 'noindex, nofollow' : 'index, follow'

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Capital Core Dance Studio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD structured data */}
      {ldArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  )
}
