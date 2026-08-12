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
]

// Fall 2026 schedule — names follow the studio's "Full Class Schedule" flyer
// (Aug 24 – Dec 18), which prefixes each class with its program tier.
export const SCHEDULE = [
  {
    day: 'Monday',
    classes: [
      { name: 'Tiny Core Ballet & Tumble', time: '5:00 – 5:30 PM', start: '17:00', end: '17:30', infoKey: 'Tiny Core Ballet & Tumble', program: 'tiny-core', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Core Acro & Jazz', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Core Acro & Jazz', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Core Contemporary & Jazz', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Core Contemporary & Jazz', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      // Both standalone hip hop classes are Hip Hop & Breakdancing and share one
      // description (merged 2026-08-04). The ballet/hip hop combos are separate.
      { name: 'Core Hip Hop & Breakdancing', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Core Hip Hop & Breakdancing', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'hiphop' },
      { name: 'Core Plus Acro & Lyrical', time: '6:15 – 7:15 PM', start: '18:15', end: '19:15', infoKey: 'Core Plus Acro & Lyrical', program: 'core-plus', ages: 'Ages 8+', ageGroups: ['kids', 'teen'], category: 'lyrical-contemp' },
      { name: 'Core Plus Ballet & Contemporary', time: '7:15 – 8:00 PM', start: '19:15', end: '20:00', infoKey: 'Core Plus Ballet & Contemporary', program: 'core-plus', ages: 'Ages 8+', ageGroups: ['kids', 'teen'], category: 'ballet' },
      // Adult class names already lead with "Adult", so they are not additionally
      // prefixed with their "Adult Core" tier.
      { name: 'Adult Femme/Flair', time: '8:00 – 8:45 PM', start: '20:00', end: '20:45', infoKey: 'Adult Femme Flair', program: 'adult-core', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
  {
    day: 'Tuesday',
    classes: [
      { name: 'Tiny Core Ballet & Hip Hop', time: '5:00 – 5:30 PM', start: '17:00', end: '17:30', infoKey: 'Tiny Core Ballet & Hip Hop', program: 'tiny-core', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Core Ballet & Hip Hop', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Core Ballet & Hip Hop', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Core Contemporary & Jazz', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Core Contemporary & Jazz', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Tumble Tech', time: '7:00 – 7:45 PM', start: '19:00', end: '19:45', infoKey: 'Tumble Tech', program: 'technique', ages: 'All Levels', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
    ],
  },
  {
    day: 'Wednesday',
    classes: [
      { name: 'Tiny Core Ballet & Tap', time: '5:30 – 6:00 PM', start: '17:30', end: '18:00', infoKey: 'Tiny Core Ballet & Tap', program: 'tiny-core', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Core Hip Hop & Breakdancing', time: '6:00 – 6:45 PM', start: '18:00', end: '18:45', infoKey: 'Core Hip Hop & Breakdancing', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'hiphop' },
      // 'All Ages' per the flyer, but ageGroups deliberately stays kids/teen: adding
      // 'adult' here would surface Musical Theatre under the Adult age filter and on
      // an adults-only view, which is not what the studio means by "all ages".
      { name: 'Musical Theatre', time: '6:45 – 7:30 PM', start: '18:45', end: '19:30', infoKey: 'Musical Theatre', program: 'specialty', ages: 'All Ages', ageGroups: ['kids', 'teen'], category: 'musical-theatre' },
      { name: 'Adult Pom', time: '7:30 – 8:15 PM', start: '19:30', end: '20:15', infoKey: 'Adult Pom', program: 'adult-core', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
  {
    day: 'Thursday',
    classes: [
      { name: 'Core Ballet & Jazz', time: '5:15 – 6:00 PM', start: '17:15', end: '18:00', infoKey: 'Core Ballet & Jazz', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Core Ballet & Tap', time: '6:00 – 6:45 PM', start: '18:00', end: '18:45', infoKey: 'Core Ballet & Tap', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Pom Cheer', time: '6:45 – 7:15 PM', start: '18:45', end: '19:15', infoKey: 'Pom Cheer', program: 'specialty', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
      // Both tumbling classes carry the same name and share one description
      // (merged 2026-08-03) — an intentional divergence from the older printed flyer,
      // which read 'Tumble' here.
      { name: 'Tumble Tech', time: '7:15 – 8:00 PM', start: '19:15', end: '20:00', infoKey: 'Tumble Tech', program: 'technique', ages: 'All Levels', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
    ],
  },
  {
    day: 'Friday',
    classes: [
      { name: 'Core Ballet & Modern', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Core Ballet & Modern', program: 'core', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'ballet' },
      // Moved Core → Core Plus on 2026-08-10 at the studio's request. Ages follow the
      // tier (5+ → 8+), which diverges from the printed flyer's 5+ for this one class.
      { name: 'Core Plus Lyrical & Contemporary', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Core Plus Lyrical & Contemporary', program: 'core-plus', ages: 'Ages 8+', ageGroups: ['kids', 'teen'], category: 'lyrical-contemp' },
      // Shortened from 7:00 – 8:00 PM on 2026-08-10 to match the studio's Full Class
      // Schedule flyer, which ends this class at 7:45 like the other 45-minute classes.
      { name: 'Adult Contemporary', time: '7:00 – 7:45 PM', start: '19:00', end: '19:45', infoKey: 'Adult Contemporary', program: 'adult-core', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
]
