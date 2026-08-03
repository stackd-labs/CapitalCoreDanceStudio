import { CLASS_INFO, getClassInfo } from './classInfo'

test('holds an entry for all 21 distinct classes', () => {
  expect(Object.keys(CLASS_INFO)).toHaveLength(21)
})

test('every entry has a usable audience line and description', () => {
  for (const [key, info] of Object.entries(CLASS_INFO)) {
    expect(info.audience, `${key} audience`).toBeTruthy()
    expect(info.audience.length, `${key} audience too short`).toBeGreaterThan(20)
    expect(info.description, `${key} description`).toBeTruthy()
    expect(info.description.length, `${key} description too short`).toBeGreaterThan(60)
  }
})

test('marks exactly the three in-house drafted descriptions', () => {
  const drafts = Object.entries(CLASS_INFO)
    .filter(([, info]) => info.draft)
    .map(([key]) => key)
    .sort()
  expect(drafts).toEqual(['Beginner Hip Hop', 'Lyrical & Contemporary', 'Tumble'])
})

test('getClassInfo returns the entry for a known key', () => {
  expect(getClassInfo('Adult Pom').description).toContain('pom technique')
})

test('getClassInfo returns undefined for an unknown key rather than throwing', () => {
  expect(getClassInfo('Beginner Acro / Jazz')).toBeUndefined()
  expect(getClassInfo('')).toBeUndefined()
})
