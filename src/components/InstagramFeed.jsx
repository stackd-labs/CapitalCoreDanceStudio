import { useEffect, useState } from 'react'
import { Kicker } from './blocks'
import { ACCENTS } from '../lib/pageAccents'

// Restored 2026-08-19 at the studio's request, rebuilt rather than recovered.
//
// The old InstagramBanner loaded Behold's <behold-widget> web component from
// w.behold.so. That works, but it drops a third-party script into every page load and
// renders their layout, which is a white rounded grid on a navy site that has neither.
// This reads the same feed from Behold's JSON endpoint and draws it in the studio's own
// system: square tiles, navy field, pink accent.
//
// The feed is public and read-only, so the id is safe in the bundle. Set
// VITE_BEHOLD_FEED_ID in .env and in the Vercel project environment. Without it the
// section still renders, as a plain follow-us block, rather than disappearing.
//
// Behold's free plan asks for attribution, which is the `showBranding` flag in the
// payload. The credit below is rendered when the feed says so. Do not remove it while
// that flag is true.
const FEED_ID = import.meta.env.VITE_BEHOLD_FEED_ID
const FEED_URL = FEED_ID ? `https://feeds.behold.so/${FEED_ID}` : null
const PROFILE_URL = 'https://www.instagram.com/capitalcoredance'
const HANDLE = '@capitalcoredance'

// Instagram's own hue would be a sixth colour on a page with a fixed palette. Pink is
// the accent the footer already uses for its Instagram icon.
const ACCENT = ACCENTS.pink

// Five is what the studio's Behold plan returns, and five reads as a clean row against
// the six-card grid above. More would wrap into a ragged second row.
const MAX_POSTS = 5

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

// Behold ships four renditions per post. `medium` is the 640px square, which is the
// right weight for a tile that is at most ~260px on a 1440px screen and still sharp on
// a retina display; `small` visibly softens there.
function tileImage(post) {
  return post.sizes?.medium?.mediaUrl || post.sizes?.small?.mediaUrl || post.mediaUrl
}

// The caption doubles as the tile's accessible name, so it has to describe the picture
// rather than repeat "Instagram post". Behold's prunedCaption drops the hashtag block.
function tileAlt(post) {
  const caption = (post.prunedCaption || post.caption || '').replace(/\s+/g, ' ').trim()
  if (!caption) return `Instagram post from ${HANDLE}`
  return caption.length > 140 ? `${caption.slice(0, 137)}...` : caption
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState([])
  const [branding, setBranding] = useState(false)
  // 'loading' until the first response. A failed fetch is not an error state a visitor
  // needs to see: the section falls back to the follow button, which is the thing we
  // wanted them to do anyway.
  const [state, setState] = useState(FEED_URL ? 'loading' : 'unavailable')

  useEffect(() => {
    if (!FEED_URL) return
    const controller = new AbortController()

    fetch(FEED_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`behold responded ${response.status}`)
        return response.json()
      })
      .then((data) => {
        const list = (data.posts || []).filter((p) => p.mediaType !== 'VIDEO' || p.sizes)
        if (!list.length) throw new Error('behold returned no posts')
        setPosts(list.slice(0, MAX_POSTS))
        setBranding(Boolean(data.showBranding))
        setState('ready')
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        console.error('Instagram feed unavailable:', error)
        setState('unavailable')
      })

    return () => controller.abort()
  }, [])

  return (
    <section className="bg-ink-deep px-6 lg:px-24 py-16 lg:py-20" aria-labelledby="instagram-heading">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-9">
          <div>
            <Kicker accent={ACCENT}>From the studio</Kicker>
            <h2
              id="instagram-heading"
              className="font-display uppercase text-white text-[34px] sm:text-[42px] leading-[0.96] m-0 mb-2"
            >
              {HANDLE}
            </h2>
            <p className="font-body text-mist-400 text-[15.5px] m-0">
              Classes, rehearsals and the moments in between.
            </p>
          </div>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            data-testid="instagram-follow"
            className="inline-flex items-center gap-2.5 font-body font-bold text-[15px] px-7 py-[15px] self-start sm:self-auto whitespace-nowrap transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep"
            style={{ background: ACCENT, color: '#0d1b34' }}
          >
            <InstagramIcon className="w-[18px] h-[18px]" />
            Follow us
          </a>
        </div>

        {state === 'loading' && (
          // Placeholder tiles rather than a spinner: the row is a fixed shape, so
          // holding its height stops the hiring strip below from jumping up and back.
          <div
            data-testid="instagram-skeleton"
            aria-hidden="true"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {Array.from({ length: MAX_POSTS }, (_, i) => (
              <div key={i} className="aspect-square bg-ink-panel border border-white/[0.09]" />
            ))}
          </div>
        )}

        {state === 'ready' && (
          <>
            <ul
              data-testid="instagram-grid"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 list-none m-0 p-0"
            >
              {posts.map((post) => (
                <li key={post.id}>
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="instagram-post"
                    className="group block relative aspect-square overflow-hidden border border-white/[0.12] hover:border-white/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <img
                      src={tileImage(post)}
                      alt={tileAlt(post)}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to top, rgba(13,27,52,0.85), rgba(13,27,52,0))' }}
                    />
                  </a>
                </li>
              ))}
            </ul>
            {branding && (
              <p className="font-body text-[11px] tracking-[0.12em] uppercase text-mist-500/70 mt-5 m-0">
                Instagram feed by{' '}
                <a
                  href="https://behold.so"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-mist-400 transition-colors underline underline-offset-2"
                >
                  Behold
                </a>
              </p>
            )}
          </>
        )}

        {state === 'unavailable' && (
          // No error message. Instagram being unreachable is not the visitor's problem,
          // and a broken-feed notice on the home page looks worse than no feed at all.
          <div
            data-testid="instagram-fallback"
            className="border border-white/[0.12] bg-ink-panel px-7 py-9 text-center"
          >
            <p className="font-body text-mist-300 text-[16px] leading-[1.6] m-0 mb-5 max-w-[420px] mx-auto">
              See what the studio has been up to this week over on Instagram.
            </p>
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 font-body font-bold text-[15px] px-7 py-[15px] transition-opacity hover:opacity-90"
              style={{ background: ACCENT, color: '#0d1b34' }}
            >
              <InstagramIcon className="w-[18px] h-[18px]" />
              {HANDLE}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
