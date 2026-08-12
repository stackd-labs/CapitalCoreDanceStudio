import { useParams, Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import AccentStripe from '../components/AccentStripe'
import { breadcrumbSchema, blogPostingSchema, faqSchema } from '../lib/schema'
import { getPostBySlug, POSTS } from '../lib/blog'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'

// Rebuilt 2026-08-11 onto the redesign. There is no mockup for an article page — the
// studio's twelve mockups stop at the blog index — so this follows the system the
// others established rather than inventing a new one: navy field, Anton headings,
// Barlow body, and the blog section's orange.
//
// It deliberately does NOT use the shared Hero. That component is a 640px marketing
// panel with a photo well; an article wants to start reading immediately, so the header
// here is a compact band carrying the same devices at article scale.
//
// Every post used to carry its own `accent` hex from the pre-redesign palette. Those
// colours no longer exist in the system, and the blog index now badges every card in
// the section accent, so the field was removed from blog.js rather than left dangling.
const ACCENT = ACCENTS.orange

const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) return <Navigate to="/blog" replace />

  const primary = post.related[0]
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-ink-base">
      <SEO
        title={post.metaTitle}
        description={post.metaDescription}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        jsonLd={[
          blogPostingSchema({
            title: post.title,
            description: post.metaDescription,
            slug: post.slug,
            datePublished: post.date,
          }),
          faqSchema(post.faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <Navbar />

      {/* Article header — the page devices at article scale, not a marketing hero. */}
      <header className="relative overflow-hidden bg-ink-base px-6 lg:px-24 pt-14 pb-12">
        <div
          aria-hidden="true"
          data-testid="article-wedge"
          className="absolute inset-y-0 right-0 left-[72%] pointer-events-none opacity-90"
          style={{ background: ACCENT, clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0 100%)' }}
        />
        <div className="relative max-w-[1440px] mx-auto">
          <nav
            className="font-body text-xs text-mist-500 mb-6 lg:pr-[30%]"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <Link to="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-mist-300">{post.category}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-4 lg:pr-[30%]">
            <span
              className="font-body text-[10px] font-bold tracking-[0.14em] uppercase px-2 py-1"
              style={{ background: ACCENT, color: onAccent(ACCENT) }}
            >
              {post.category}
            </span>
            <span className="font-body text-[11.5px] font-semibold tracking-[0.12em] text-mist-500 uppercase">
              {formatDate(post.date)} · {post.readMinutes} min read
            </span>
          </div>

          <h1 className="font-display uppercase text-white text-[34px] sm:text-[46px] lg:text-[56px] leading-[0.95] m-0 max-w-[900px] lg:pr-[8%] text-balance">
            {post.title}
          </h1>

          <AccentStripe className="mt-8 w-[220px] h-1" />
        </div>
      </header>

      <article className="bg-ink-deep flex-1 px-6 lg:px-24 py-14 lg:py-16">
        <div className="max-w-[760px]">
          {/* Quick answer (AEO) — the plain-language summary answer engines lift. */}
          <div
            className="border-l-4 bg-white/[0.04] px-6 py-5 mb-10"
            style={{ borderColor: ACCENT }}
          >
            <p
              className="font-body text-[10px] font-bold uppercase tracking-[0.25em] mb-2"
              style={{ color: ACCENT }}
            >
              Quick answer
            </p>
            <p className="font-body text-[16px] leading-[1.7] text-mist-200 m-0">{post.tldr}</p>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-10">
            {post.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-display uppercase text-white text-[26px] sm:text-[30px] leading-[1.1] m-0 mb-4">
                  {section.heading}
                </h2>
                {section.body?.map((para, j) => (
                  <p
                    key={j}
                    className="font-body text-[17px] leading-[1.75] text-mist-300 m-0 mb-4 last:mb-0"
                  >
                    {para}
                  </p>
                ))}
                {section.list && (
                  <ul className="flex flex-col gap-2.5 mt-4">
                    {section.list.map((item, k) => (
                      <li
                        key={k}
                        className="flex gap-3 font-body text-[17px] leading-[1.75] text-mist-300"
                      >
                        <span className="flex-shrink-0 font-bold" style={{ color: ACCENT }}>
                          ›
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Primary CTA — the page this article is actually about. */}
          <div className="mt-14 border border-white/[0.14] bg-ink-base px-7 py-7">
            <p className="font-display uppercase text-white text-[26px] leading-none mb-2">
              Want the details?
            </p>
            <p className="font-body text-mist-400 text-sm mb-5">{primary.label}</p>
            <Link
              to={primary.to}
              data-testid="primary-cta"
              className="inline-flex font-body font-bold text-[15px] px-8 py-[17px] transition-opacity hover:opacity-90"
              style={{ background: ACCENT, color: onAccent(ACCENT) }}
            >
              {primary.label} →
            </Link>
          </div>

          {/* Related pages on the site */}
          {post.related.length > 0 && (
            <div className="mt-8 border-t-[3px] pt-4" style={{ borderColor: ACCENT }}>
              <p className="font-body text-[11px] font-semibold tracking-[0.2em] uppercase text-mist-500 mb-3">
                Related at Capital Core
              </p>
              <ul className="flex flex-col gap-2.5">
                {post.related.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="font-body text-[15px] font-semibold hover:underline"
                      style={{ color: ACCENT }}
                    >
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQ (AEO) */}
          {post.faqs.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display uppercase text-white text-[30px] leading-none mb-6">
                Frequently asked questions
              </h2>
              <div className="flex flex-col gap-6">
                {post.faqs.map(({ q, a }) => (
                  <div key={q} data-testid="post-faq" className="border-t border-white/[0.14] pt-5">
                    <p className="font-body font-bold text-[18px] leading-[1.35] text-white mb-2">
                      {q}
                    </p>
                    <p className="font-body text-[16px] leading-[1.7] text-mist-400 m-0">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More from the blog */}
          <div className="mt-14 pt-8 border-t border-white/[0.14]">
            <p className="font-body text-[11px] font-semibold tracking-[0.2em] uppercase text-mist-500 mb-4">
              More from the blog
            </p>
            <div className="flex flex-col">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  data-testid="related-post"
                  className="group flex items-center justify-between gap-4 border-b border-white/[0.12] py-4 transition-colors hover:bg-white/[0.03]"
                >
                  <span className="font-body text-[16px] font-semibold leading-snug text-mist-200 group-hover:text-white transition-colors">
                    {p.title}
                  </span>
                  <span className="flex-shrink-0" style={{ color: ACCENT }}>
                    →
                  </span>
                </Link>
              ))}
            </div>
            <Link
              to="/blog"
              className="inline-block mt-6 font-body text-sm font-bold hover:underline"
              style={{ color: ACCENT }}
            >
              ← Back to all articles
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
