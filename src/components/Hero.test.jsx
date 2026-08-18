import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from './Hero'
import { ACCENTS } from '../lib/pageAccents'

// Mobile hero layout, added 2026-08-17.
//
// The bug: the accent wedge was `left-[58%]` with no responsive prefix, so it claimed the
// right 42% of the screen at every width. Measured at 390px it started at x=218 while the
// copy column ran to x=351 — 133px of overlap, 41% of the headline — and because the
// tinted word is the same colour as the wedge, "MADE CLEAR" was green on green, "COMPANY"
// red on red and "MOVERS" teal on teal. The wedge exists to sit behind the photo well,
// which is itself `hidden lg:block`, so on a phone it was doing no work and still ruining
// the headline.
//
// These assert CLASS NAMES rather than computed visibility, deliberately: jsdom applies no
// media queries, so `hidden lg:block` never resolves and both breakpoints are always in the
// DOM at once — the same limitation the navbar tests work around. The real proof is a
// 390px-wide iframe in a browser; this suite pins the contract so a refactor cannot quietly
// drop it.

function renderHero(props = {}) {
  return render(
    <MemoryRouter initialEntries={['/tuition']}>
      <Hero
        eyebrow="2026 – 2027 rates"
        title={['Tuition', [{ text: 'made clear', accent: ACCENTS.green }]]}
        accent={ACCENTS.green}
        {...props}
      />
    </MemoryRouter>
  )
}

test('the desktop accent wedge is hidden below the lg breakpoint', () => {
  // Without this the wedge covers 41% of the headline on a phone.
  renderHero()
  const wedge = screen.getByTestId('hero-panel')
  expect(wedge.className).toMatch(/\bhidden\b/)
  expect(wedge.className).toMatch(/lg:block/)
})

test('the mobile band carries the page accent and is hidden from lg up', () => {
  renderHero()
  const band = screen.getByTestId('hero-mobile-band')
  expect(band.className).toMatch(/lg:hidden/)
  expect(band).toHaveStyle({ background: ACCENTS.green })
})

test('the mobile band shows the hero art, which desktop-only markup never did on a phone', () => {
  renderHero({ photoSrc: '/logo.png', photoAlt: 'Capital Core Dance Studio crest', photoFit: 'contain' })
  const band = screen.getByTestId('hero-mobile-band')
  const img = band.querySelector('img')
  expect(img).toHaveAttribute('src', '/logo.png')
  expect(img.className).toMatch(/object-contain/)
})

test('the mobile band never renders a placeholder well when a page has no art', () => {
  // A hatched placeholder is the one thing that must not appear here: this band is the
  // first thing above the fold on a phone.
  renderHero({ photoCaption: 'Studio photo' })
  const band = screen.getByTestId('hero-mobile-band')
  expect(band.querySelector('[data-testid="photo-slot"]')).toBeNull()
  expect(band.querySelector('img')).toBeNull()
})

test('the mobile art is hidden from screen readers so the hero image is announced once', () => {
  // Desktop and mobile each render their own <img> and both sit in the DOM at once, so
  // without this a screen reader hears the same alt text twice on every page.
  renderHero({ photoSrc: '/logo.png', photoAlt: 'Capital Core Dance Studio crest' })
  const band = screen.getByTestId('hero-mobile-band')
  expect(band.querySelector('[aria-hidden="true"]')).toBeTruthy()
  expect(screen.getAllByRole('img', { name: /Capital Core Dance Studio crest/i })).toHaveLength(1)
})

test("Home's striped hero gets a striped mobile band, not a single accent", () => {
  // Home is the only stripe hero: no single accent may dominate it, on any screen.
  renderHero({ variant: 'stripe' })
  const band = screen.getByTestId('hero-mobile-band')
  expect(band.querySelector('[data-testid="accent-band"]')).toBeTruthy()
  // And its desktop panel is wrapped so it can be hidden without fighting the `flex` on
  // AccentStripe's own class list.
  expect(screen.getByTestId('accent-panel').parentElement.className).toMatch(/lg:block/)
})
