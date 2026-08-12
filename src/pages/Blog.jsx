import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Hero from '../components/Hero'
import PhotoSlot from '../components/PhotoSlot'
import { PrimaryAction, GhostAction, CtaBand, InverseAction } from '../components/blocks'
import { simpleBreadcrumb, blogListSchema } from '../lib/schema'
import { POSTS } from '../lib/blog'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Rebuilt 2026-08-11 to the studio's site mockup (page 1j, accent orange): hero plus a
// three-up card grid. Posts, categories, dates and excerpts all come from
// src/lib/blog.js unchanged.
//
// The mockup badges every card in the page accent, so the per-post `accent` hex in
// blog.js is no longer used here. It is still used by BlogPost.jsx, which has not been
// converted yet and still carries the pre-redesign palette.
const ACCENT = ACCENTS.orange

const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export default function Blog() {
  const latest = POSTS[0]

  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title="Dance Studio Blog — Classes, Camps & Events | Capital Core Dance Studio"
        description="News, guides, and tips on dance classes, summer camps, the annual recital, birthday parties, and studio events at Capital Core Dance Studio in Midlothian, VA. Serving Chesterfield County and Richmond."
        canonical="/blog"
        jsonLd={[blogListSchema(POSTS), simpleBreadcrumb('Blog', '/blog')]}
      />

      <Navbar />

      <Hero
        eyebrow="Studio journal"
        title={['From the', [{ text: 'studio', accent: ACCENT }]]}
        tagline="News · guides · dancer spotlights"
        body="Camp and class guides, enrollment help, and what's coming up at the studio — written for families deciding what fits their dancer."
        photoCaption="Featured image"
        clipStart={22}
        actions={
          <>
            <PrimaryAction to={`/blog/${latest.slug}`}>Read latest</PrimaryAction>
            <GhostAction to="/contact">Subscribe</GhostAction>
          </>
        }
      />

      <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20 flex-1">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px]">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              data-testid="post-card"
              className="group border border-white/[0.12] flex flex-col transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ACCENT
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = ''
              }}
            >
              <div className="h-[200px]">
                <PhotoSlot caption={`${post.category} · photo`} className="w-full h-full" />
              </div>
              <div className="px-6 pt-6 pb-7 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className="font-body text-[10px] font-bold tracking-[0.14em] uppercase px-2 py-1"
                    style={{ background: ACCENT, color: onAccent(ACCENT) }}
                  >
                    {post.category}
                  </span>
                  <span className="font-body text-[11.5px] font-semibold tracking-[0.12em] text-mist-500 uppercase">
                    {formatDate(post.date)} · {post.readMinutes} min
                  </span>
                </div>
                <h2 className="font-display uppercase text-white text-[26px] leading-[1.05] m-0">
                  {post.title}
                </h2>
                <p className="font-body text-[14px] leading-[1.6] text-mist-400 m-0 flex-1">
                  {post.excerpt}
                </p>
                <span
                  className="font-body text-[13px] font-bold group-hover:underline"
                  style={{ color: ACCENT }}
                >
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand
        accent={ACCENT}
        headline="Ready to get your dancer started?"
        body="Your first class is always free — no commitment required."
        action={<InverseAction to="/contact">Claim a Free Trial Class</InverseAction>}
      />

      <Footer />
    </div>
  )
}
