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

test('the schedule still has 18 class rows', () => {
  // 22 → 18 across 2026-09-02. Off: Tumble Tech (both nights), Core Plus Lyrical &
  // Contemporary, Adult Femme/Flair. On: Adult Ballet/Tech. The three Dance Company
  // sessions were added and then taken off the CALENDAR the same day — they still
  // run, they are just not on the grid. See the note at the top of schedule.js.
  expect(ALL_ROWS).toHaveLength(18)
})

// Classes the studio added on 2026-09-02 that it has not yet written copy for. The
// detail panel renders `{info && ...}`, so these show without a description rather
// than with an invented one — the same rule the About page follows for staff.
// Deleting a name from this list should make the test below demand real prose.
const AWAITING_COPY = ['Adult Ballet/Tech']

test('every schedule row resolves to prose via its infoKey', () => {
  for (const row of ALL_ROWS) {
    if (AWAITING_COPY.includes(row.infoKey)) continue
    const info = getClassInfo(row.infoKey)
    expect(info, `${row.day} "${row.name}" has infoKey "${row.infoKey}" with no entry`).toBeDefined()
    expect(info.description.length).toBeGreaterThan(60)
  }
})

test('the classes awaiting copy are exactly the ones we think', () => {
  // The point of the skip list is that it stays SHORT and visible. Without this, a
  // fourth class could quietly join it and ship with no description at all.
  const missing = [...new Set(ALL_ROWS.map((r) => r.infoKey))].filter((k) => !getClassInfo(k))
  expect(missing.sort()).toEqual([...AWAITING_COPY].sort())
})

test('classInfo keeps copy only for current classes and recent departures', () => {
  const used = new Set(ALL_ROWS.map((r) => r.infoKey))
  const orphans = Object.keys(CLASS_INFO).filter((key) => !used.has(key)).sort()
  // Kept deliberately, not stale: all three came off the schedule on 2026-09-02 and
  // the studio may bring them back. A class returning should not need its description
  // rewritten. Prune this list if the studio confirms one is gone for good.
  expect(orphans).toEqual(['Adult Femme Flair', 'Core Plus Lyrical & Contemporary', 'Tumble Tech'])
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

test('every class runs inside the calendar grid window', () => {
  // The window was hardcoded 17:00–21:00 here and in ClassCalendar until 2026-09-02,
  // when the Dance Company's Sunday session at 3:00 PM would have been given a NEGATIVE
  // start slot and floated above the grid. Both now derive the bounds from the
  // schedule, so this asserts the INVARIANT — every class fits, and no class ends
  // before it starts — rather than two literal hours that go stale.
  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
  }
  const gridStart = Math.floor(Math.min(...ALL_ROWS.map((r) => toMinutes(r.start))) / 60) * 60
  const gridEnd = Math.ceil(Math.max(...ALL_ROWS.map((r) => toMinutes(r.end))) / 60) * 60
  for (const row of ALL_ROWS) {
    expect(toMinutes(row.start), `${row.name} starts before the grid`).toBeGreaterThanOrEqual(gridStart)
    expect(toMinutes(row.end), `${row.name} ends after the grid`).toBeLessThanOrEqual(gridEnd)
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
    // Takes the ballet photo off the last-resort `ballet` rule, on its name alone. It
    // is a 16+ class and the ballet photograph is not of adults; flagged rather than
    // fixed, because the fix is a photograph, not a rule.
    'Adult Ballet/Tech': '/class-ballet.jpg',
    'Adult Contemporary': '/class-contemporary.jpg',
    // Its own photograph as of 2026-08-17, no longer the shared pom one: this is a 16+
    // class and the pom photo is of three teenagers. 'Pom Cheer' keeps that photo.
    'Adult Pom': '/class-adult-pom.jpg',
    // Renamed from 'Core Plus Ballet & Contemporary' on 2026-09-02, and the rename
    // MOVED ITS PHOTOGRAPH: the old name hit the contemporary rule, "Ballet Tech" hits
    // the ballet one. Exactly the silent change this test exists to surface.
    'Ballet Tech': '/class-ballet.jpg',
    'Core Acro & Jazz': '/class-acro.jpg',
    'Core Ballet & Hip Hop': '/class-hip-hop.jpg',
    'Core Ballet & Jazz': '/class-jazz.jpg',
    // The classes the last-resort `ballet` rule picks up — it sits last, so it only
    // catches ballet classes no more specific rule has already claimed.
    'Core Ballet & Modern': '/class-ballet.jpg',
    'Core Ballet & Tap': '/class-ballet.jpg',
    // Jazz, not contemporary: the studio's jazz rule names every class with "jazz" in
    // it, and reordering the rules would flip this one silently.
    'Core Contemporary & Jazz': '/class-jazz.jpg',
    'Core Hip Hop & Breakdancing': '/class-hip-hop.jpg',
    'Core Plus Acro & Lyrical': '/class-lyrical.jpg',
    'Musical Theatre': '/class-musical-theatre.jpg',
    // Unchanged, and the point of giving Adult Pom its own rule: the shared pom
    // photograph is of teenagers, which suits this class and not a 16+ one.
    'Pom Cheer': '/class-pom.jpg',
    // All three take the tiny photograph, including the hip hop and tumble ones — the
    // tiny rule matches first precisely so neither teenage photo can land on a class of
    // 2-to-5-year-olds.
    'Tiny Core Ballet & Hip Hop': '/class-tiny-ballet.jpg',
    'Tiny Core Ballet & Tap': '/class-tiny-ballet.jpg',
    'Tiny Core Ballet & Tumble': '/class-tiny-ballet.jpg',
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
  // 'adult-pom' must stay above 'pom' or Adult Pom silently reverts to the teenagers'
  // photograph, and 'ballet' must stay last or it steals Core Ballet & Jazz, Core Ballet
  // & Hip Hop, Core Plus Ballet & Contemporary and all three Tiny Core classes.
  expect(CLASS_PHOTO_RULE_IDS).toEqual([
    'acro',
    'tiny',
    'adult-pom',
    'hip-hop',
    'jazz',
    'pom',
    'femme-flair',
    'musical-theatre',
    'lyrical',
    'contemporary',
    'tumble',
    'ballet',
  ])
})

test('the broad ballet rule only claims ballet classes no other rule already covers', () => {
  // The `ballet` rule is deliberately broad (/ballet/i) and deliberately last. Stated as
  // its own test because moving it up the list would reassign six classes at once, and
  // the manifest test above would report that as six unrelated failures.
  expect(photoForClass('Core Ballet & Tap').photo).toBe('/class-ballet.jpg')
  expect(photoForClass('Core Ballet & Modern').photo).toBe('/class-ballet.jpg')
  expect(photoForClass('Core Ballet & Jazz').photo).toBe('/class-jazz.jpg')
  expect(photoForClass('Core Ballet & Hip Hop').photo).toBe('/class-hip-hop.jpg')
  expect(photoForClass('Core Plus Ballet & Contemporary').photo).toBe('/class-contemporary.jpg')
  expect(photoForClass('Tiny Core Ballet & Tap').photo).toBe('/class-tiny-ballet.jpg')
})

test('Adult Pom takes the adult photograph, Pom Cheer keeps the teenagers', () => {
  // Both match /pom/i, so this pair is decided purely by rule order.
  expect(photoForClass('Adult Pom').photo).toBe('/class-adult-pom.jpg')
  expect(photoForClass('Pom Cheer').photo).toBe('/class-pom.jpg')
})

test('every photo a rule points at is a real file under public/', () => {
  // One class per rule, in rule order.
  const named = [
    'Core Acro & Jazz',
    'Tiny Core Ballet & Tumble',
    'Adult Pom',
    'Core Ballet & Hip Hop',
    'Core Ballet & Jazz',
    'Pom Cheer',
    'Adult Femme/Flair',
    'Musical Theatre',
    'Core Plus Acro & Lyrical',
    'Adult Contemporary',
    'Tumble Tech',
    'Core Ballet & Tap',
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
