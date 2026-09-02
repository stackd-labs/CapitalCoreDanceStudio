// Shared Fall class schedule constant, consumed by the Classes calendar page and
// the Adult Classes page. Kept out of the page components so the constant can be
// imported anywhere without tripping react-refresh.

// ageGroups: 'tiny' (2-5), 'kids' (5-12), 'teen' (6-17), 'adult' (16+)
// category: 'tiny' | 'ballet' | 'jazz-acro' | 'hiphop' | 'lyrical-contemp' | 'tumble-cheer' | 'musical-theatre' | 'adult'
// program: one of PROGRAMS below — the studio's program tier, adopted 2026-08-10.

// The studio's program tiers, replacing the old Tiny / Beginner / Intermediate
// vocabulary on 2026-08-10. `ages` is the short form used in filter labels; the
// per-row `ages` string is what actually renders on a class. `level` is the skill
// band the tier maps to, and `blurb` is the one-line explanation shown wherever a
// tier is introduced — both added 2026-08-10 so "Core" is never presented without
// saying who it is for.
//
// The tier set is expected to be revisited: the studio has floated splitting Core by
// age (Core Kids / Core Juniors / Core Teens) once enrolment supports it. Keep this
// array the single source of truth so that stays a one-file change.
//
// Core and Core Plus deliberately share the Beginner – Novice band (changed
// 2026-08-11). They are split by AGE, not skill: Core Plus is the same open-enrollment
// beginner track for 8+, so an older dancer starting out is not placed beside
// five-year-olds. Core Elite is the intermediate–advanced track above both.
//
// A tier may legitimately have no classes yet — Core Elite was added 2026-08-11 ahead
// of the studio assigning classes to it. Consumers must derive from the schedule
// rather than assume every tier is populated: the Program filter on /classes lists
// only tiers in use, and /class-levels skips empty groups.
//
// Technique is all-levels and age-open, which is why Tumble Tech lives there rather
// than in Core Plus — the flyer labelled it "Core Plus" but colour-coded it
// "Technique (All Levels)".
export const PROGRAMS = [
  {
    value: 'tiny-core',
    label: 'Tiny Core',
    ages: '2–5',
    level: 'Preschool',
    blurb: 'Our preschool program — a first introduction to dance through music, imagination, and play.',
  },
  {
    value: 'core',
    label: 'Core',
    ages: '5+',
    level: 'Beginner – Novice',
    blurb: 'Open-enrollment recreational classes for dancers new to dance and for returning dancers rebuilding their foundation. No experience required.',
  },
  {
    value: 'core-plus',
    label: 'Core Plus',
    ages: '8+',
    level: 'Beginner – Novice',
    blurb: 'The same open-enrollment beginner track as Core, for older dancers — so a dancer starting at ten or twelve learns alongside their own age group rather than beside five-year-olds.',
  },
  {
    value: 'core-elite',
    label: 'Core Elite',
    ages: '8+',
    level: 'Intermediate – Advanced',
    blurb: 'For dancers who have built their foundation and are ready for advanced technique and choreography. Placement by instructor recommendation.',
  },
  {
    value: 'technique',
    label: 'Technique',
    ages: 'All Levels',
    level: 'All Levels',
    blurb: 'Skill-focused training open to every experience level — dancers work at their own progression.',
  },
  {
    value: 'specialty',
    label: 'Specialty',
    ages: 'All Ages',
    level: 'All Levels',
    blurb: 'Performance-focused classes. Musical Theatre is open to all ages.',
  },
  {
    value: 'adult-core',
    label: 'Adult Core',
    ages: '16+',
    level: 'All Levels',
    blurb: 'Evening classes for adults 16+, whatever your experience — first class always free.',
  },
  {
    // Added 2026-09-02. The Academy is its own programme rather than a tier of the
    // recreational track: it runs in Studio A, alongside the weekly schedule, and is
    // the only thing the studio runs on a Sunday.
    //
    // ⚠ PLACEHOLDER BLURB. Everything in it is verifiable — the days, the room, the
    // ages — but it is descriptive, not the studio's own words, and it is the one
    // line on this page written in-house. Replace it when the studio supplies copy.
    value: 'academy',
    label: 'Dance Academy',
    ages: '6–18',
    level: 'Academy',
    blurb: 'Our Studio A programme, running alongside the weekly schedule on Sunday, Monday and Thursday.',
  },
]

// Fall 2026 schedule (Aug 24 – Dec 18).
//
// ── REBUILT 2026-09-02 ────────────────────────────────────────────────────────
// The studio reworked the whole week. This file and print/class-schedule.html were
// brought into line in the same change; that sheet's header comment carries the
// day-by-day diff and the reasoning behind each move.
//
// TWO FIELDS ARE NEW, and both were previously facts the site simply could not
// express:
//
//   `instructor` — the flyer has named instructors all along and the data model had
//     nowhere to put them. Names and titles come from src/lib/instructors.js, which
//     is the spelling authority; Ms. Hannah is named on the Fall flyer but has no
//     roster entry yet, so hers is a name and nothing more.
//   `studio` — 'A' or 'B'. The studio has two rooms. Every row below is Studio B now
//     that the Academy is off the calendar, so the field looks redundant — it is not.
//     It is what the printable sheet labels its two sections from, and it is what a
//     restored Academy row would need to stop the grid reading as double-booked.
//
// 🔴 OFF THE SCHEDULE ENTIRELY, kept here as a record rather than deleted, because
// the reason matters more than the absence:
//   Tumble Tech                      was Tue 7:00 and Thu 7:15 — the only Technique
//                                    class, so that tier now has nothing in it
//   Core Plus Lyrical & Contemporary was Fri 6:15, parked
//   Adult Femme/Flair                was Mon 8:00
// Their CLASS_INFO entries stay: a class coming back should not need its
// description rewritten.
export const SCHEDULE = [
  // 🔴 THE ACADEMY IS NOT ON THIS CALENDAR, deliberately, removed 2026-09-02.
  //
  // It ran in Studio A at the same time as Studio B — Sunday 3:00–6:00, Monday and
  // Thursday 5:00–7:00 — and putting it on the grid made the grid worse for the
  // classes most people come here to read. Monday and Thursday split four ways and
  // truncated to "Capital Core Dance Acader…", and because the grid window derives
  // from the earliest class, the Sunday session dragged every weekday column down
  // past two hours of empty afternoon.
  //
  // The programme has NOT gone away. It is still on the printable schedule
  // (print/class-schedule.html renders it as its own band, which is why it costs
  // nothing there), and the Dance Academy entry in PROGRAMS still names its days on
  // /classes. ⚠ Those are now the ONLY two places on the site that say when it runs.
  //
  // To put it back: restore these three rows, add 'Sunday' to ClassCalendar's
  // DAY_ORDER, and expect the stacking and the window to come back with them.
  {
    day: 'Monday',
    classes: [
      { name: 'Tiny Core Ballet & Tumble', time: '5:00 – 5:30 PM', start: '17:00', end: '17:30', infoKey: 'Tiny Core Ballet & Tumble', program: 'tiny-core', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny', studio: 'B', instructor: 'Ms. Jillian' },
      // Both standalone hip hop classes are Hip Hop & Breakdancing and share one
      // description (merged 2026-08-04). The ballet/hip hop combos are separate.
      { name: 'Core Hip Hop & Breakdancing', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Core Hip Hop & Breakdancing', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'hiphop', studio: 'B', instructor: 'Ms. Adelle' },
      { name: 'Core Contemporary & Jazz', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Core Contemporary & Jazz', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'jazz-acro', studio: 'B', instructor: 'Ms. Adelle' },
      // Renamed from 'Core Plus Ballet & Contemporary' on 2026-09-02. The infoKey
      // deliberately does NOT follow the name: it is the same class with the same
      // description, and repointing it would have orphaned the studio's own copy.
      // ⚠ Still program 'core-plus' at 8+. The studio asked for a rename, not a
      // re-audience — but 'Tech' named the Technique tier on Tumble Tech, so the
      // name now implies a tier this class does not have. Unresolved.
      { name: 'Ballet Tech', time: '7:00 – 7:45 PM', start: '19:00', end: '19:45', infoKey: 'Core Plus Ballet & Contemporary', program: 'core-plus', ages: 'Ages 8+', ageGroups: ['kids', 'teen'], category: 'ballet', studio: 'B', instructor: 'Ms. Jillian' },
    ],
  },
  {
    day: 'Tuesday',
    classes: [
      { name: 'Tiny Core Ballet & Hip Hop', time: '5:00 – 5:30 PM', start: '17:00', end: '17:30', infoKey: 'Tiny Core Ballet & Hip Hop', program: 'tiny-core', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny', studio: 'B', instructor: 'Ms. Jillian' },
      { name: 'Core Ballet & Hip Hop', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Core Ballet & Hip Hop', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'ballet', studio: 'B', instructor: 'Ms. Jillian' },
      // Moved here from Wednesday 6:45 on 2026-09-02, taking the slot Core
      // Contemporary & Jazz had. 'All Ages' per the flyer, but ageGroups deliberately
      // stays kids/teen: adding 'adult' would surface Musical Theatre under the Adult
      // age filter, which is not what the studio means by "all ages".
      { name: 'Musical Theatre', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Musical Theatre', program: 'specialty', ages: 'All Ages', ageGroups: ['kids', 'teen'], category: 'musical-theatre', studio: 'B', instructor: 'Ms. Hannah' },
    ],
  },
  {
    day: 'Wednesday',
    classes: [
      { name: 'Tiny Core Ballet & Tap', time: '5:30 – 6:00 PM', start: '17:30', end: '18:00', infoKey: 'Tiny Core Ballet & Tap', program: 'tiny-core', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny', studio: 'B', instructor: 'Ms. Jillian' },
      // Ms. Jillian is covering while Ms. Savannah is out, which leaves Savannah with
      // no class on the schedule. Put her back here when she returns.
      { name: 'Core Hip Hop & Breakdancing', time: '6:00 – 6:45 PM', start: '18:00', end: '18:45', infoKey: 'Core Hip Hop & Breakdancing', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'hiphop', studio: 'B', instructor: 'Ms. Jillian' },
      // Moved from Thursday 6:45 and LENGTHENED 30 → 45 minutes to fill the slot
      // Musical Theatre vacated, which keeps the evening gapless into Adult Pom.
      { name: 'Pom Cheer', time: '6:45 – 7:30 PM', start: '18:45', end: '19:30', infoKey: 'Pom Cheer', program: 'specialty', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'tumble-cheer', studio: 'B', instructor: 'Ms. Kendall' },
      // Adult class names already lead with "Adult", so they are not additionally
      // prefixed with their "Adult Core" tier.
      { name: 'Adult Pom', time: '7:30 – 8:15 PM', start: '19:30', end: '20:15', infoKey: 'Adult Pom', program: 'adult-core', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult', studio: 'B', instructor: 'Ms. Kendall' },
    ],
  },
  {
    day: 'Thursday',
    classes: [
      { name: 'Core Ballet & Jazz', time: '5:15 – 6:00 PM', start: '17:15', end: '18:00', infoKey: 'Core Ballet & Jazz', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'ballet', studio: 'B', instructor: 'Ms. Kendall' },
      { name: 'Core Ballet & Tap', time: '6:00 – 6:45 PM', start: '18:00', end: '18:45', infoKey: 'Core Ballet & Tap', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'ballet', studio: 'B', instructor: 'Ms. Kendall' },
      // 🔴 BOTH ACRO CLASSES MOVED HERE FROM MONDAY AND ARE SHORTER, which REPRICES
      // them, since tuition goes by length (src/lib/tuition.js):
      //   Core Acro & Jazz          45 → 30 min   $85 → $65
      //   Core Plus Acro & Lyrical  60 → 45 min   $105 → $85
      // They inherited the slots Pom Cheer and Tumble Tech left, and the studio named
      // 7:15 as the second start — the old lengths would have collided.
      { name: 'Core Acro & Jazz', time: '6:45 – 7:15 PM', start: '18:45', end: '19:15', infoKey: 'Core Acro & Jazz', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'jazz-acro', studio: 'B', instructor: 'Ms. Kendall & Ms. Milan' },
      { name: 'Core Plus Acro & Lyrical', time: '7:15 – 8:00 PM', start: '19:15', end: '20:00', infoKey: 'Core Plus Acro & Lyrical', program: 'core-plus', ages: 'Ages 8+', ageGroups: ['kids', 'teen'], category: 'lyrical-contemp', studio: 'B', instructor: 'Mr. Yul & Ms. Milan' },
    ],
  },
  {
    day: 'Friday',
    classes: [
      { name: 'Core Ballet & Modern', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Core Ballet & Modern', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'ballet', studio: 'B', instructor: 'Mr. Yul' },
      // New 2026-09-02, in the slot Core Plus Lyrical & Contemporary left. Named to
      // the studio's own adult pattern. No CLASS_INFO entry yet — the detail panel
      // renders without a description rather than inventing one.
      { name: 'Adult Ballet/Tech', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Adult Ballet/Tech', program: 'adult-core', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult', studio: 'B', instructor: 'Mr. Yul' },
      // Shortened from 7:00 – 8:00 PM on 2026-08-10 to match the studio's Full Class
      // Schedule flyer, which ends this class at 7:45 like the other 45-minute classes.
      { name: 'Adult Contemporary', time: '7:00 – 7:45 PM', start: '19:00', end: '19:45', infoKey: 'Adult Contemporary', program: 'adult-core', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult', studio: 'B', instructor: 'Mr. Yul' },
    ],
  },
]
