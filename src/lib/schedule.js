// Shared Fall class schedule constant, consumed by the Classes calendar page and
// the Adult Classes page. Kept out of the page components so the constant can be
// imported anywhere without tripping react-refresh.

// ageGroups: 'tiny' (2-5), 'kids' (5-12), 'teen' (6-17), 'adult' (16+)
// category: 'tiny' | 'ballet' | 'jazz-acro' | 'hiphop' | 'lyrical-contemp' | 'tumble-cheer' | 'musical-theatre' | 'adult'
// Fall 2026 schedule — verbatim from the studio flyer (Aug 24 – Dec 18).
export const SCHEDULE = [
  {
    day: 'Monday',
    classes: [
      { name: 'Tiny Ballet / Tumble', time: '5:00 – 5:30 PM', start: '17:00', end: '17:30', infoKey: 'Tiny Ballet & Tumble', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Beginner Acro / Jazz', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Acro & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Beginner Contemp / Jazz', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Contemporary & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Beginner Hip Hop', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Beginner Hip Hop', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'hiphop' },
      { name: 'Acro / Lyrical', time: '6:15 – 7:15 PM', start: '18:15', end: '19:15', infoKey: 'Acro & Lyrical', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'lyrical-contemp' },
      { name: 'Ballet / Contemp', time: '7:15 – 8:00 PM', start: '19:15', end: '20:00', infoKey: 'Ballet & Contemporary', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Adult Femme / Flaire', time: '8:00 – 9:00 PM', start: '20:00', end: '21:00', infoKey: 'Adult Femme Flair', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
  {
    day: 'Tuesday',
    classes: [
      { name: 'Tiny Ballet / Hip Hop', time: '5:00 – 5:30 PM', start: '17:00', end: '17:30', infoKey: 'Tiny Ballet & Hip Hop', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Beginner Ballet / Hip Hop', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Ballet & Hip Hop', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Beginner Contemp / Jazz', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Beginner Contemporary & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Tumble Tech', time: '7:00 – 7:45 PM', start: '19:00', end: '19:45', infoKey: 'Tumble Tech', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
    ],
  },
  {
    day: 'Wednesday',
    classes: [
      { name: 'Tiny Ballet / Tap', time: '5:30 – 6:00 PM', start: '17:30', end: '18:00', infoKey: 'Tiny Ballet & Tap', ages: 'Ages 2–5', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Beginner Hip Hop & Breakdancing', time: '6:00 – 6:45 PM', start: '18:00', end: '18:45', infoKey: 'Beginner Hip Hop & Breakdancing', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'hiphop' },
      { name: 'Musical Theatre', time: '6:45 – 7:30 PM', start: '18:45', end: '19:30', infoKey: 'Musical Theatre', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'musical-theatre' },
      { name: 'Adult Pom', time: '7:30 – 8:15 PM', start: '19:30', end: '20:15', infoKey: 'Adult Pom', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
  {
    day: 'Thursday',
    classes: [
      { name: 'Beginner Ballet / Jazz', time: '5:15 – 6:00 PM', start: '17:15', end: '18:00', infoKey: 'Beginner Ballet & Jazz', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Beginner Ballet / Tap', time: '6:00 – 6:45 PM', start: '18:00', end: '18:45', infoKey: 'Beginner Ballet & Tap', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Pom Cheer', time: '6:45 – 7:15 PM', start: '18:45', end: '19:15', infoKey: 'Pom Cheer', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
      { name: 'Tumble', time: '7:15 – 8:00 PM', start: '19:15', end: '20:00', infoKey: 'Tumble', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
    ],
  },
  {
    day: 'Friday',
    classes: [
      { name: 'Beginner Ballet / Modern', time: '5:30 – 6:15 PM', start: '17:30', end: '18:15', infoKey: 'Beginner Ballet & Modern', ages: 'Ages 5+ · Beginner', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Lyrical / Contemp', time: '6:15 – 7:00 PM', start: '18:15', end: '19:00', infoKey: 'Lyrical & Contemporary', ages: 'Ages 5+', ageGroups: ['kids', 'teen'], category: 'lyrical-contemp' },
      { name: 'Adult Contemporary', time: '7:00 – 8:00 PM', start: '19:00', end: '20:00', infoKey: 'Adult Contemporary', ages: 'Ages 16+ · Adult', ageGroups: ['adult'], category: 'adult' },
    ],
  },
]
