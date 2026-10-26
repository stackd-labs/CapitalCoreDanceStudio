import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { accentForPath } from './pageAccents'

// 🔴 Added 2026-10-26. vercel.json 308'd /recital to / after the June 2026 recital was
// retired, and nothing noticed when the new /recital page shipped: the dev server never
// reads vercel.json, so the page worked locally and would have redirected in production.
// A permanent redirect also gets cached by browsers, so a miss here outlives the fix.
const config = JSON.parse(readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8'))
const sources = config.redirects.map((r) => r.source)

test('/recital itself is not redirected away from the live recital page', () => {
  expect(sources).not.toContain('/recital')
  expect(sources).not.toContain('/recital/:path*') // :path* also matches zero segments, i.e. /recital
})

test('retired /recital sub-pages (shirts, thank-you) still redirect', () => {
  expect(sources).toContain('/recital/:path+')
})

test('the SPA rewrite serves /recital from index.html', () => {
  const rewrite = new RegExp(`^${config.rewrites[0].source}$`)
  expect(rewrite.test('/recital')).toBe(true)
})

test('/recital has its own gold accent', () => {
  expect(accentForPath('/recital')).toBe('#f5c518')
})
