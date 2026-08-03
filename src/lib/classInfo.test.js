import { CLASS_INFO, getClassInfo } from './classInfo'
import { SCHEDULE } from './schedule'

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

const ALL_ROWS = SCHEDULE.flatMap(({ day, classes }) =>
  classes.map((c) => ({ ...c, day }))
)

test('the schedule still has 22 class rows', () => {
  expect(ALL_ROWS).toHaveLength(22)
})

test('every schedule row resolves to prose via its infoKey', () => {
  for (const row of ALL_ROWS) {
    const info = getClassInfo(row.infoKey)
    expect(info, `${row.day} "${row.name}" has infoKey "${row.infoKey}" with no entry`).toBeDefined()
    expect(info.description.length).toBeGreaterThan(60)
  }
})

test('every classInfo entry is used by at least one schedule row', () => {
  const used = new Set(ALL_ROWS.map((r) => r.infoKey))
  const orphans = Object.keys(CLASS_INFO).filter((key) => !used.has(key))
  expect(orphans, 'copy exists for classes no longer on the schedule').toEqual([])
})

test('every row has 24-hour start and end on 15-minute boundaries', () => {
  for (const row of ALL_ROWS) {
    expect(row.start, `${row.name} start`).toMatch(/^\d{2}:\d{2}$/)
    expect(row.end, `${row.name} end`).toMatch(/^\d{2}:\d{2}$/)
    const [, startMin] = row.start.split(':').map(Number)
    const [, endMin] = row.end.split(':').map(Number)
    expect(startMin % 15, `${row.name} start not on a 15-min boundary`).toBe(0)
    expect(endMin % 15, `${row.name} end not on a 15-min boundary`).toBe(0)
  }
})

test('start and end agree with the flyer-verbatim time string', () => {
  // Guards the one real drift risk: editing `time` for a new semester and forgetting
  // `start`/`end`, which would leave the calendar positioning classes at the old hour.
  const to12h = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    const hour12 = h > 12 ? h - 12 : h
    return `${hour12}:${String(m).padStart(2, '0')}`
  }
  for (const row of ALL_ROWS) {
    expect(row.time, `${row.name} time vs start`).toContain(to12h(row.start))
    expect(row.time, `${row.name} time vs end`).toContain(to12h(row.end))
  }
})

test('every class runs inside the 5:00 PM to 9:00 PM grid window', () => {
  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
  }
  for (const row of ALL_ROWS) {
    expect(toMinutes(row.start), `${row.name} starts before 17:00`).toBeGreaterThanOrEqual(17 * 60)
    expect(toMinutes(row.end), `${row.name} ends after 21:00`).toBeLessThanOrEqual(21 * 60)
    expect(toMinutes(row.end), `${row.name} ends before it starts`).toBeGreaterThan(toMinutes(row.start))
  }
})
