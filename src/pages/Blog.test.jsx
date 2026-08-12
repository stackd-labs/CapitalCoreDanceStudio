import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'
import { POSTS } from '../lib/blog'

function renderBlog() {
  return render(
    <MemoryRouter initialEntries={['/blog']}>
      <Blog />
    </MemoryRouter>
  )
}

test('renders the hero with the orange solid wedge', () => {
  renderBlog()
  expect(screen.getByRole('heading', { level: 1, name: 'From the studio' })).toBeInTheDocument()
  expect(screen.getByTestId('hero-panel')).toBeInTheDocument()
})

test('renders a card for every post, each linking to its own slug', () => {
  renderBlog()
  const cards = screen.getAllByTestId('post-card')
  expect(cards).toHaveLength(POSTS.length)
  for (const post of POSTS) {
    const card = cards.find((c) => c.getAttribute('href') === `/blog/${post.slug}`)
    expect(card, `no card links to /blog/${post.slug}`).toBeTruthy()
    expect(card).toHaveTextContent(post.title)
    expect(card).toHaveTextContent(post.category)
  }
})

test('every card carries an excerpt and a read time', () => {
  // A card with no excerpt is just a headline in a box — the excerpt is what makes the
  // grid scannable, and it is the one field easiest to drop in a layout rewrite.
  renderBlog()
  for (const card of screen.getAllByTestId('post-card')) {
    expect(card.textContent).toMatch(/\d+ min/)
  }
  for (const post of POSTS) {
    expect(screen.getByText(post.excerpt)).toBeInTheDocument()
  }
})

test('the hero "Read latest" points at the first post, not a dead anchor', () => {
  renderBlog()
  expect(screen.getByRole('link', { name: 'Read latest' })).toHaveAttribute(
    'href',
    `/blog/${POSTS[0].slug}`
  )
})

test('emits Blog list structured data covering every post', () => {
  renderBlog()
  const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')]
  const all = scripts.flatMap((s) => {
    const parsed = JSON.parse(s.textContent)
    return Array.isArray(parsed) ? parsed : [parsed]
  })
  const list = all.find((e) => JSON.stringify(e).includes('BlogPosting'))
  expect(list, 'no blog list schema emitted').toBeTruthy()
  for (const post of POSTS) {
    expect(JSON.stringify(list)).toContain(post.title)
  }
})

test('closes with the free-trial call to action', () => {
  renderBlog()
  const band = within(screen.getByTestId('cta-band'))
  expect(band.getByRole('heading', { name: /Ready to get your dancer started/i })).toBeInTheDocument()
  expect(band.getByRole('link', { name: 'Claim a Free Trial Class' })).toHaveAttribute(
    'href',
    '/contact'
  )
})
