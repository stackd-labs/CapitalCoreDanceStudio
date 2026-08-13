import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { CLASS_INFO, CLASS_PHOTO_RULE_IDS, getClassInfo, photoForClass } from './classInfo'
import { SCHEDULE } from './schedule'

test('holds an entry for all 21 distinct classes', () => {
  // 19: 'Tumble' merged into 'Tumble Tech' (2026-08-03) and 'Beginner Hip Hop' merged
  // into 'Beginner Hip Hop & Breakdancing' (2026-08-04).
  expect(Object.keys(CLASS_INFO)).toHaveLength(19)
})

test('every entry has a usable description', () => {
  for (const [key, info] of Object.entries(CLASS_INFO)) {
    expect(info.description, `${key} description`).toBeTruthy()
    expect(info.description.length, `${key} description too short`).toBeGreaterThan(60)
  }
})

test('carries no audience lines', () => {
  // The "who is this class for?" lines were removed on 2026-08-03 at the studio's
  // request. This guards against them being reintroduced by a copy-paste.
  for (const [key, info] of Object.entries(CLASS_INFO)) {
    expect(info, `${key} still has an audience line`).not.toHaveProperty('audience')
  }
})

test('marks exactly the in-house drafted descriptions', () => {
  const drafts = Object.entries(CLASS_INFO)
    .filter(([, info]) => info.draft)
    .map(([key]) => key)
    .sort()
  // One left: merging 'Tumble' into 'Tumble Tech' and the standalone hip hop entry
  // into 'Core Hip Hop & Breakdancing' each dropped an in-house draft, because the
  // studio's own text for the surviving class already covered both.
  expect(drafts).toEqual(['Core Plus Lyrical & Contemporary'])
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

test('the studio photo rules resolve to exactly this assignment across the Fall schedule', () => {
  // The rules are deliberately broad ("all hip hop classes", "any class with jazz in the
  // name"), so what they actually produce is worth pinning rather than trusting. If a
  // rule is edited or a class is renamed, this shows precisely which classes changed
  // photograph — including any that silently gained one.
  const names = [...new Set(SCHEDULE.flatMap(({ classes }) => classes.map((c) => c.name)))].sort()
  const assignment = Object.fromEntries(names.map((n) => [n, photoForClass(n)?.photo ?? null]))

  expect(assignment).toEqual({
    'Adult Contemporary': '/class-contemporary.jpg',
    'Adult Femme/Flair': null,
    'Adult Pom': '/class-pom.jpg',
    'Core Acro & Jazz': '/class-acro.jpg',
    'Core Ballet & Hip Hop': '/class-hip-hop.jpg',
    'Core Ballet & Jazz': '/class-jazz.jpg',
    'Core Ballet & Modern': null,
    'Core Ballet & Tap': null,
    // Jazz, not contemporary: the studio's jazz rule names every class with "jazz" in
    // it, and reordering the rules would flip this one silently.
    'Core Contemporary & Jazz': '/class-jazz.jpg',
    'Core Hip Hop & Breakdancing': '/class-hip-hop.jpg',
    'Core Plus Acro & Lyrical': '/class-lyrical.jpg',
    'Core Plus Ballet & Contemporary': '/class-contemporary.jpg',
    // Lyrical, not contemporary: it takes the style its own name leads with.
    'Core Plus Lyrical & Contemporary': '/class-lyrical.jpg',
    'Musical Theatre': null,
    'Pom Cheer': '/class-pom.jpg',
    // All three take the tiny photograph, including the hip hop and tumble ones — the
    // tiny rule matches first precisely so neither teenage photo can land on a class of
    // 2-to-5-year-olds.
    'Tiny Core Ballet & Hip Hop': '/class-tiny-ballet.jpg',
    'Tiny Core Ballet & Tap': '/class-tiny-ballet.jpg',
    'Tiny Core Ballet & Tumble': '/class-tiny-ballet.jpg',
    'Tumble Tech': '/class-tumble.jpg',
  })
})

test('overlapping classes go to the more specific rule, not the broad one', () => {
  // Stated as its own test because these are the judgement calls in the rule order, and
  // a reordering of CLASS_PHOTO_RULES would quietly reverse every one of them.
  expect(photoForClass('Core Acro & Jazz').photo).toBe('/class-acro.jpg')
  expect(photoForClass('Core Plus Lyrical & Contemporary').photo).toBe('/class-lyrical.jpg')
  expect(photoForClass('Core Contemporary & Jazz').photo).toBe('/class-jazz.jpg')
  // The two that matter most: these dancers are 2–5, and both the hip hop and the tumble
  // photographs are of teenagers. Move 'tiny' down this list and either class silently
  // ages up by a decade.
  expect(photoForClass('Tiny Core Ballet & Hip Hop').photo).toBe('/class-tiny-ballet.jpg')
  expect(photoForClass('Tiny Core Ballet & Tumble').photo).toBe('/class-tiny-ballet.jpg')
  expect(CLASS_PHOTO_RULE_IDS).toEqual([
    'acro',
    'tiny',
    'hip-hop',
    'jazz',
    'pom',
    'lyrical',
    'contemporary',
    'tumble',
  ])
})

test('every photo a rule points at is a real file under public/', () => {
  const named = [
    'Core Acro & Jazz',
    'Core Ballet & Hip Hop',
    'Core Ballet & Jazz',
    'Tiny Core Ballet & Tumble',
    'Pom Cheer',
    'Core Plus Acro & Lyrical',
    'Adult Contemporary',
    'Tumble Tech',
  ]
  // One class per rule, so no rule can ship pointing at a file that is not there.
  expect(new Set(named.map((n) => photoForClass(n).photo)).size).toBe(CLASS_PHOTO_RULE_IDS.length)
  for (const name of named) {
    const art = photoForClass(name)
    expect(art.photo, `${name} photo path`).toMatch(/^\/class-[a-z-]+\.jpg$/)
    expect(existsSync(join(process.cwd(), 'public', art.photo)), `${art.photo} missing`).toBe(true)
    expect(art.photoAlt.length, `${name} alt text`).toBeGreaterThan(20)
  }
})
