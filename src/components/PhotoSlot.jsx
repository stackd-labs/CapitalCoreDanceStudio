// A photo well from the site mockups. Until a real image is supplied it renders the
// mockup's diagonal-hatch placeholder with its caption; pass `src` and it becomes the
// photograph, same box, same crop.
//
// Keeping the placeholder in the component (rather than dropping in a stock photo) is
// deliberate: an empty slot stays visibly empty, so nobody ships a page thinking the art
// is done. `caption` is what the studio needs to supply for that slot.
// `hatchOn` picks the placeholder's contrast: 'dark' for a navy field (white hatch),
// 'light' for a light accent panel (dark hatch) — a white hatch on orange is invisible.
// `fit` is 'cover' for photographs — the well is a crop and the subject should fill it.
// 'contain' is for artwork that must not be cropped, i.e. the logo: it fills the well
// edge to edge and keeps its proportions, rather than having its shield sliced by a
// 400×472 box it was never drawn for. Nothing is painted behind it — the logo is a
// transparent PNG, so the hero's accent panel shows through and the crest reads as part
// of the page rather than as a picture sitting on top of it.
export default function PhotoSlot({
  src,
  alt,
  caption,
  className = '',
  style,
  objectPosition,
  fit = 'cover',
  hatchOn = 'dark',
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || ''}
        className={`block w-full h-full ${
          fit === 'contain' ? 'object-contain' : 'object-cover'
        } ${className}`}
        style={{ objectPosition, ...style }}
      />
    )
  }

  // 'glass' is the home hero's well: translucent, so the five-accent stripes stay
  // visible through it rather than being punched out by an opaque box.
  const HATCH = {
    dark: {
      background:
        'repeating-linear-gradient(135deg,rgba(255,255,255,.07) 0 8px,rgba(255,255,255,0) 8px 16px),#101d38',
      text: 'text-white/40',
    },
    light: {
      background:
        'repeating-linear-gradient(135deg,rgba(13,27,52,.14) 0 8px,rgba(13,27,52,0) 8px 16px)',
      text: 'text-ink-base/75',
    },
    glass: {
      background:
        'repeating-linear-gradient(135deg,rgba(255,255,255,.16) 0 8px,rgba(255,255,255,0) 8px 16px),rgba(0,0,0,.14)',
      text: 'text-white/85',
    },
  }
  const hatch = HATCH[hatchOn] || HATCH.dark
  return (
    <div
      data-testid="photo-slot"
      data-photo-slot={caption}
      role="img"
      aria-label={`Placeholder: ${caption}`}
      className={`flex items-center justify-center text-center px-4 font-mono text-[10.5px] tracking-[0.14em] uppercase ${hatch.text} ${className}`}
      style={{ background: hatch.background, ...style }}
    >
      {caption}
    </div>
  )
}
