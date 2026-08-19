import { render as rtlRender, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import InstagramFeed from './InstagramFeed'

// Kicker reads the page accent through useAccent, which needs a router above it. The
// component is always mounted inside the app's BrowserRouter, so this mirrors that
// rather than working around it.
const render = (ui) => rtlRender(<MemoryRouter initialEntries={['/']}>{ui}</MemoryRouter>)

// A trimmed Behold payload with the fields the component actually reads.
const payload = {
  username: 'capitalcoredance',
  showBranding: true,
  posts: [
    {
      id: '1',
      permalink: 'https://www.instagram.com/p/one/',
      mediaType: 'IMAGE',
      prunedCaption: 'Reintroducing Ms. Savannah',
      mediaUrl: 'https://behold.pictures/one-full.jpg',
      sizes: { medium: { mediaUrl: 'https://behold.pictures/one-640.jpg' } },
    },
    {
      id: '2',
      permalink: 'https://www.instagram.com/p/two/',
      mediaType: 'IMAGE',
      prunedCaption: '',
      mediaUrl: 'https://behold.pictures/two-full.jpg',
      sizes: {},
    },
  ],
}

function mockFeed(response) {
  global.fetch = vi.fn(() => Promise.resolve(response))
}

afterEach(() => {
  vi.restoreAllMocks()
})

test('renders a tile per post, each linking to the post itself', async () => {
  mockFeed({ ok: true, json: () => Promise.resolve(payload) })
  render(<InstagramFeed />)

  await waitFor(() => expect(screen.getByTestId('instagram-grid')).toBeInTheDocument())
  const tiles = screen.getAllByTestId('instagram-post')
  expect(tiles).toHaveLength(2)
  expect(tiles[0]).toHaveAttribute('href', 'https://www.instagram.com/p/one/')
  expect(tiles[0]).toHaveAttribute('target', '_blank')
  expect(tiles[0]).toHaveAttribute('rel', 'noreferrer')
})

test('prefers the 640px rendition and falls back to the full image', async () => {
  // A tile is about 260px on a desktop and doubles on a retina screen, so `small`
  // (400px) visibly softens. Second post has no sizes block at all.
  mockFeed({ ok: true, json: () => Promise.resolve(payload) })
  render(<InstagramFeed />)

  await waitFor(() => expect(screen.getByTestId('instagram-grid')).toBeInTheDocument())
  const images = screen.getAllByTestId('instagram-post').map((a) => a.querySelector('img'))
  expect(images[0]).toHaveAttribute('src', 'https://behold.pictures/one-640.jpg')
  expect(images[1]).toHaveAttribute('src', 'https://behold.pictures/two-full.jpg')
})

test('uses the caption as the alt text, and names the account when there is none', async () => {
  mockFeed({ ok: true, json: () => Promise.resolve(payload) })
  render(<InstagramFeed />)

  await waitFor(() => expect(screen.getByTestId('instagram-grid')).toBeInTheDocument())
  expect(screen.getByAltText('Reintroducing Ms. Savannah')).toBeInTheDocument()
  expect(screen.getByAltText('Instagram post from @capitalcoredance')).toBeInTheDocument()
})

test('credits Behold while the feed asks for it', async () => {
  // showBranding is the free plan's attribution requirement. Removing the credit while
  // that flag is true breaks their terms, so it is pinned rather than left to memory.
  mockFeed({ ok: true, json: () => Promise.resolve(payload) })
  render(<InstagramFeed />)

  await waitFor(() => expect(screen.getByTestId('instagram-grid')).toBeInTheDocument())
  expect(screen.getByRole('link', { name: 'Behold' })).toHaveAttribute('href', 'https://behold.so')
})

test('drops the credit when the feed stops asking for it', async () => {
  mockFeed({ ok: true, json: () => Promise.resolve({ ...payload, showBranding: false }) })
  render(<InstagramFeed />)

  await waitFor(() => expect(screen.getByTestId('instagram-grid')).toBeInTheDocument())
  expect(screen.queryByRole('link', { name: 'Behold' })).not.toBeInTheDocument()
})

test('falls back to a follow block when the feed cannot be reached', async () => {
  // Instagram being down is not the visitor's problem. The section still has to do its
  // job, which is send someone to the profile.
  vi.spyOn(console, 'error').mockImplementation(() => {})
  mockFeed({ ok: false, status: 503, json: () => Promise.resolve({}) })
  render(<InstagramFeed />)

  await waitFor(() => expect(screen.getByTestId('instagram-fallback')).toBeInTheDocument())
  expect(screen.queryByTestId('instagram-grid')).not.toBeInTheDocument()
  expect(screen.queryByText(/error|unavailable|failed/i)).not.toBeInTheDocument()
})

test('falls back rather than showing an empty row when the feed returns nothing', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  mockFeed({ ok: true, json: () => Promise.resolve({ ...payload, posts: [] }) })
  render(<InstagramFeed />)

  await waitFor(() => expect(screen.getByTestId('instagram-fallback')).toBeInTheDocument())
})

test('always offers the profile link, whatever the feed does', async () => {
  mockFeed({ ok: true, json: () => Promise.resolve(payload) })
  render(<InstagramFeed />)
  // The header link is there before the feed answers, which is the point of asserting
  // it. Settling the fetch afterwards keeps the state update inside the test rather
  // than landing after it, which React reports as an update outside act().
  expect(screen.getByTestId('instagram-follow')).toHaveAttribute(
    'href',
    'https://www.instagram.com/capitalcoredance'
  )
  await waitFor(() => expect(screen.getByTestId('instagram-grid')).toBeInTheDocument())
})

test('holds the row height while loading so the page below does not jump', async () => {
  mockFeed({ ok: true, json: () => Promise.resolve(payload) })
  render(<InstagramFeed />)
  expect(screen.getByTestId('instagram-skeleton')).toBeInTheDocument()
  await waitFor(() => expect(screen.queryByTestId('instagram-skeleton')).not.toBeInTheDocument())
})
