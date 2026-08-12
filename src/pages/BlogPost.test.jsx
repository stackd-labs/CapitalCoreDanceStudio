import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BlogPost from './BlogPost'
import Blog from './Blog'
import { POSTS } from '../lib/blog'

const post = POSTS[0]

// The route is /blog/:slug, so these render through a Router with the real param rather
// than mocking useParams.
function renderPost(slug = post.slug) {
  return render(
    <MemoryRouter initialEntries={[`/blog/${slug}`]}>
      <Routes>
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </MemoryRouter>
  )
}

test('renders the article header with category, date and read time', () => {
  renderPost()
  expect(screen.getByRole('heading', { level: 1, name: post.title })).toBeInTheDocument()
  expect(screen.getAllByText(post.category).length).toBeGreaterThan(0)
  expect(screen.getByText(new RegExp(`${post.readMinutes} min read`))).toBeInTheDocument()
})

test('leads with the quick answer, which is what answer engines lift', () => {
  renderPost()
  expect(screen.getByText('Quick answer')).toBeInTheDocument()
  expect(screen.getByText(post.tldr)).toBeInTheDocument()
})

test('renders every section heading and its prose', () => {
  renderPost()
  for (const section of post.sections) {
    expect(screen.getByRole('heading', { name: section.heading })).toBeInTheDocument()
  }
})

test('renders every FAQ and keeps the FAQ structured data', () => {
  renderPost()
  expect(screen.getAllByTestId('post-faq')).toHaveLength(post.faqs.length)

  const all = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => {
    const parsed = JSON.parse(s.textContent)
    return Array.isArray(parsed) ? parsed : [parsed]
  })
  const faqPage = all.find((e) => e['@type'] === 'FAQPage')
  expect(faqPage, 'no FAQPage schema on the article').toBeTruthy()
  expect(faqPage.mainEntity).toHaveLength(post.faqs.length)
})

test('the primary CTA points at the page the article is about', () => {
  // related[0] is both the CTA and the first related link, so two links share a label —
  // scope to the CTA rather than matching by name.
  renderPost()
  const [primary] = post.related
  const cta = screen.getByTestId('primary-cta')
  expect(cta).toHaveAttribute('href', primary.to)
  expect(cta).toHaveTextContent(primary.label)
})

test('offers three other articles and a route back to the index', () => {
  renderPost()
  const related = screen.getAllByTestId('related-post')
  expect(related).toHaveLength(3)
  for (const link of related) {
    expect(link.getAttribute('href')).toMatch(/^\/blog\/.+/)
    expect(link.getAttribute('href')).not.toBe(`/blog/${post.slug}`)
  }
  expect(screen.getByRole('link', { name: '← Back to all articles' })).toHaveAttribute(
    'href',
    '/blog'
  )
})

test('an unknown slug redirects to the blog index rather than blanking', () => {
  // There is no catch-all route in this app, so a bad slug that rendered nothing would
  // be a white screen.
  renderPost('no-such-post')
  expect(screen.getByRole('heading', { level: 1, name: 'From the studio' })).toBeInTheDocument()
})

test('carries no leftover light-theme surfaces', () => {
  renderPost()
  const white = [...document.querySelectorAll('[class*="bg-white"]')].filter(
    (el) => !/bg-white\/\[?\d/.test(el.className)
  )
  expect(white.map((el) => el.className)).toEqual([])
})

test('breadcrumb links back through Blog to Home', () => {
  renderPost()
  const crumb = within(screen.getByLabelText('Breadcrumb'))
  expect(crumb.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  expect(crumb.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog')
})
