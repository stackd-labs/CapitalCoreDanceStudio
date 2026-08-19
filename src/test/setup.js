import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'

// No test should reach the network. Added 2026-08-19 when the home page started
// fetching the Instagram feed on mount: every Home test then made a real request that
// resolved after the assertions had run, which React reported as an update outside
// act(). Left alone it would have buried a genuine warning in noise.
//
// The default never settles, on purpose. A rejection would be more obvious, but it
// resolves after the test body has finished and the resulting setState lands outside
// act(), so every unrelated test printed a React warning. Hanging leaves the component
// in its loading state, which is what a test that never mentions the network means.
// Tests that care about the response assign their own global.fetch.
const neverSettles = () => new Promise(() => {})

beforeEach(() => {
  global.fetch = vi.fn(neverSettles)
})

afterEach(() => {
  vi.restoreAllMocks()
})
