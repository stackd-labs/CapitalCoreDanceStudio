import { useLocation } from 'react-router-dom'
import { accentForPath } from '../lib/pageAccents'

// The shared page header band, restyled 2026-08-11 to carry the Dance Company hero's
// look across the whole site: a flat navy field, one angled colour wedge cutting in
// from the right, and an Anton display title. Every page shares the geometry; the
// accent colour is what tells them apart.
//
// The accent is looked up from the route in src/lib/pageAccents.js rather than passed
// by each page, so all twenty callers stay unchanged and no page can drift out of its
// section's colour. Pass `accent` to override for a one-off.
//
// NOTE: reading the route means this component must render inside a Router. Every page
// already does, and every page test wraps in MemoryRouter — but a bare
// `render(<PageHeader />)` in a new test will throw. Wrap it, or pass `accent`
// explicitly and it still needs the Router for the hook, so: wrap it.
//
// The wedge is decorative and never sits behind text: it is aria-hidden, and the
// content column is width-capped so the title and subtitle stop short of it even at
// 320px. Its geometry is tuned for this band's short aspect ratio — reusing the taller
// hero's polygon here would read as a much steeper cut.
export default function PageHeader({ eyebrow, title, subtitle, accent }) {
  const { pathname } = useLocation()
  const color = accent || accentForPath(pathname)

  return (
    <div className="relative overflow-hidden bg-navy-dark py-16 px-6">
      <div
        aria-hidden="true"
        data-testid="header-wedge"
        className="absolute inset-y-0 right-0 w-2/5 sm:w-1/2 pointer-events-none"
        style={{
          background: color,
          clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 12% 100%)',
          opacity: 0.92,
        }}
      />
      {/* The right padding, not a max-width, is what keeps text off the wedge. The wedge
          is positioned against the full-bleed section while this column is centred and
          capped at max-w-6xl, so a fixed max-width drifts into the wedge at some widths
          and leaves a gulf at others — a long title like "Frequently Asked Questions"
          landed white-on-pale-blue that way. A percentage of this column tracks the
          wedge's own percentage geometry at every width instead. */}
      <div className="relative max-w-6xl mx-auto pr-[40%] sm:pr-[46%]">
        <p
          data-testid="header-eyebrow"
          className="text-xs font-bold tracking-[0.4em] uppercase mb-3"
          style={{ color }}
        >
          {eyebrow}
        </p>
        <h1 className="font-display uppercase text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tight text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#b8d4f0] text-sm md:text-base leading-relaxed mt-4">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
