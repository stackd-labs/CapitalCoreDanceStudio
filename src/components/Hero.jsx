import AccentStripe from './AccentStripe'
import PhotoSlot from './PhotoSlot'
import { useAccent } from '../lib/useAccent'
import { onAccent } from '../lib/accentContrast'

// The hero from the site mockups: navy field, a skewed five-accent panel filling the
// right, a photo well floated over it, and Anton display type on the left.
//
// Measurements are taken from the mockup rather than eyeballed — 640px tall, stripes
// starting at 58% and overshooting the right edge by 180px so the skew never reveals a
// corner, photo inset 84/64/84 at 400px wide, copy column 680px behind 96px of gutter.
//
// `title` accepts an array of lines. A line may be a string, or an array of
// { text, accent } chunks, which is how the home page tints each letter of "CORE".
export default function Hero({
  eyebrow,
  title,
  tagline,
  body,
  actions,
  photoCaption,
  photoSrc,
  photoAlt,
  photoObjectPosition,
  // 'contain' for the logo, which must not be cropped by the well — see PhotoSlot.
  photoFit,
  variant = 'solid',
  accent,
  // Both differ per page in the mockups — Classes cuts at 26% with an 84px title,
  // Little Movers at 20% with 76px. Defaults match the Classes page.
  clipStart = 26,
  titleClassName = 'text-[44px] sm:text-[60px] lg:text-[84px] leading-[0.9]',
}) {
  // Two panel treatments, both from the mockups:
  //   'stripe' — the five-accent skewed panel, used only on Home, where no single
  //              accent should dominate. Its eyebrow carries the stripe rule.
  //   'solid'  — one angled accent slab, used on every section page. Its eyebrow is
  //              the accent itself, with no rule.
  // The photo well sits over the panel in both. On a solid light accent the well's
  // hatch and border have to darken or they vanish, hence the two placeholder styles.
  const color = useAccent(accent)
  const onPanel = onAccent(color)
  const isStripe = variant === 'stripe'
  const isFramed = photoFit !== 'contain'

  // The spoken form of the headline: lines joined by a space, chunks concatenated.
  const plainTitle = title
    .map((line) => (typeof line === 'string' ? line : line.map((c) => c.text).join('')))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <section className="relative bg-ink-base text-white overflow-hidden min-h-[520px] lg:h-[640px] flex items-center">
      {isStripe ? (
        <AccentStripe variant="panel" />
      ) : (
        <div
          aria-hidden="true"
          data-testid="hero-panel"
          className="absolute inset-y-0 right-0 left-[58%] pointer-events-none"
          style={{ background: color, clipPath: `polygon(${clipStart}% 0, 100% 0, 100% 100%, 0 100%)` }}
        />
      )}

      {/* Photo well — over the panel, hidden below lg where the copy needs the width.
          The rule frames a photograph, which is a rectangle that needs an edge. Contained
          artwork is not: the logo has its own silhouette, and a box drawn around it just
          reads as a stray rectangle on the accent. So the frame follows the fit. */}
      <div
        className={`hidden lg:block absolute top-[84px] bottom-[84px] right-16 w-[400px] ${
          isFramed ? 'border' : ''
        }`}
        style={
          isFramed
            ? { borderColor: isStripe ? 'rgba(255,255,255,.32)' : `${onPanel}4d` }
            : undefined
        }
      >
        <PhotoSlot
          src={photoSrc}
          alt={photoAlt}
          caption={photoCaption}
          objectPosition={photoObjectPosition}
          fit={photoFit}
          className="w-full h-full"
          hatchOn={isStripe ? 'glass' : onPanel === '#0d1b34' ? 'light' : 'dark'}
        />
      </div>

      <div className="relative z-[2] w-full max-w-[1440px] mx-auto px-6 lg:pl-24 lg:pr-0">
        <div className="lg:w-[680px] py-16 lg:py-0">
          {isStripe ? (
            <div className="flex items-center gap-3 mb-[18px]">
              <AccentStripe variant="rule" />
              <span className="font-body font-semibold text-[12px] tracking-[0.3em] text-mist-200 uppercase">
                {eyebrow}
              </span>
            </div>
          ) : (
            <div
              className="font-body font-semibold text-[12px] tracking-[0.32em] uppercase mb-[18px]"
              style={{ color }}
            >
              {eyebrow}
            </div>
          )}

          {/* aria-label, not whitespace between the lines. The title is split across
              block spans (and tinted per letter on the home page), and the accessible
              name algorithm trims each node's text before joining them — so a literal
              space between spans is discarded and the name comes out "Find yourclass".
              Labelling the heading states the spoken form once and makes it independent
              of how the lines are chopped up visually. */}
          <h1
            aria-label={plainTitle}
            className={`font-display uppercase tracking-[0.01em] m-0 ${titleClassName}`}
          >
            {title.map((line, i) => (
              <span key={i} className="block">
                {typeof line === 'string'
                  ? line
                  : line.map((chunk, j) => (
                      <span key={j} style={chunk.accent ? { color: chunk.accent } : undefined}>
                        {chunk.text}
                      </span>
                    ))}
              </span>
            ))}
          </h1>

          {tagline && (
            <div className="font-body font-bold text-[15px] lg:text-[18px] tracking-[0.2em] text-mist-500 uppercase mt-[22px] mb-5">
              {tagline}
            </div>
          )}

          {body && (
            <p className="font-body text-[17px] leading-[1.6] text-mist-100 max-w-[500px] m-0 mb-8 text-pretty">
              {body}
            </p>
          )}

          {actions && <div className="flex flex-wrap gap-4">{actions}</div>}
        </div>
      </div>
    </section>
  )
}
