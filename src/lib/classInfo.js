// Single source of truth for class prose. Consumed by the Classes calendar, the
// Class Levels page, and the Adult Classes page.
//
// Keys are the studio's copy names, renamed to the Core program vocabulary on
// 2026-08-10 ("Beginner Acro & Jazz" → "Core Acro & Jazz"). Most now match their
// schedule display name exactly, but the adult classes still differ ("Adult
// Femme/Flair" vs "Adult Femme Flair"), so each schedule row keeps an explicit
// `infoKey` pointing here rather than being matched on its display name.
//
// `draft: true` marks a description written in-house because the studio's copy did
// not cover that class. Those three await studio review.
export const CLASS_INFO = {
  'Tiny Core Ballet & Tumble': {
    description: 'Perfect for little ones just beginning their dance journey! Dancers explore basic ballet movements, balance, coordination, and beginner tumbling skills through music, imagination, and creative play. This class builds confidence while developing important motor skills in a fun, encouraging environment.',
  },
  'Tiny Core Ballet & Hip Hop': {
    description: 'A fun introduction to both ballet and hip hop! Young dancers build rhythm, coordination, confidence, and creativity while learning age-appropriate movement through upbeat music, games, and imaginative activities.',
  },
  'Tiny Core Ballet & Tap': {
    description: 'Introduce your little dancer to the grace of ballet and the excitement of tap! This class develops rhythm, musicality, balance, listening skills, and confidence while making learning fun.',
  },
  'Core Ballet & Jazz': {
    description: 'A wonderful introduction to dance! Students build a strong ballet foundation while learning energetic jazz technique that improves flexibility, coordination, confidence, and performance quality.',
  },
  'Core Ballet & Hip Hop': {
    description: 'The perfect combination of structure and fun! Dancers learn ballet technique while exploring the exciting energy of hip hop, helping them become well-rounded performers.',
  },
  'Core Ballet & Tap': {
    description: 'Students develop ballet fundamentals while learning rhythm, timing, and musicality through tap dancing. A great class for dancers beginning their dance education.',
  },
  'Core Ballet & Modern': {
    description: 'Explore both classical ballet and creative modern dance. Students learn proper technique while developing body awareness, expression, flexibility, and artistry.',
  },
  'Core Acro & Jazz': {
    description: 'A high-energy class introducing dancers to basic acrobatics alongside exciting jazz movement. Students build strength, flexibility, coordination, balance, and confidence.',
  },
  'Core Contemporary & Jazz': {
    description: 'Learn expressive movement while building strong jazz fundamentals. Dancers improve flexibility, musicality, creativity, and performance skills in this engaging combo class.',
  },
  // Covers both standalone hip hop classes (Mon 6:15 and Wed 6:00). The separate
  // 'Beginner Hip Hop' entry was merged in here on 2026-08-04: it was an in-house
  // draft, and the studio's own text below covers both classes.
  'Core Hip Hop & Breakdancing': {
    description: 'A favorite for energetic dancers! Students learn hip hop grooves, beginner breakdancing foundations, freestyle skills, musicality, and coordination in an encouraging atmosphere.',
  },
  'Core Plus Acro & Lyrical': {
    description: 'This class combines acrobatic skills with expressive lyrical dance. Students focus on flexibility, strength, control, artistry, and emotional storytelling through movement.',
  },
  'Core Plus Ballet & Contemporary': {
    description: 'A technique-focused class blending classical ballet with contemporary dance. Dancers develop alignment, flexibility, artistry, turns, extensions, and musicality.',
  },
  // Covers both tumbling classes (Tue 7:00 and Thu 7:15). The separate 'Tumble' entry
  // was merged in here on 2026-08-03: it was an in-house draft, and the studio's own
  // text below already covers everything it said, so nothing drafted remains for this
  // class.
  'Tumble Tech': {
    description: 'Designed for dancers wanting to improve tumbling technique. Students work on rolls, cartwheels, walkovers, handstands, flexibility, strength, and proper progressions at their own level.',
  },
  'Core Plus Lyrical & Contemporary': {
    draft: true,
    description: 'Expressive movement set to the music that inspires it. Dancers develop control, flexibility, artistry, and storytelling while strengthening lyrical and contemporary technique.',
  },
  'Musical Theatre': {
    description: 'Love to perform? This Broadway-inspired class combines dance, acting, and storytelling while helping students build confidence, stage presence, and performance skills.',
  },
  'Pom Cheer': {
    description: 'Learn pom technique, cheer motions, jumps, and exciting dance combinations while developing teamwork, confidence, and performance quality.',
  },
  'Adult Femme Flair': {
    description: "An empowering dance class focused on confidence, musicality, and expressive choreography. Whether you're returning to dance or trying something new, you'll leave feeling stronger and more confident.",
  },
  'Adult Pom': {
    description: "A fun, upbeat class featuring pom technique, jazz-inspired movement, and energetic choreography. It's a great workout while learning exciting routines.",
  },
  'Adult Contemporary': {
    description: 'Explore movement, creativity, and expression through contemporary dance. Improve flexibility, balance, strength, and artistry in a supportive, welcoming environment.',
  },
}

export function getClassInfo(key) {
  return CLASS_INFO[key]
}

// Class photography, supplied by the studio 2026-08-13. The studio asked for these by
// rule rather than class by class — "all hip hop classes", "any class with jazz in the
// name" — so the rules are what is written down. A new hip hop class added to the
// schedule next term is covered without anyone remembering to come back here.
//
// Rules are tried in order and the FIRST match wins, which is what resolves every overlap
// in the current schedule:
//
//   Core Acro & Jazz          — acro and jazz both claim it; the studio named this class
//                               specifically for the acro photo, so the named rule leads.
//   Tiny Core Ballet & Hip Hop — tiny and hip hop both claim it; the hip hop photograph
//                               is of a teenager and these dancers are 2–5, so tiny leads.
//   Tiny Core Ballet & Tumble  — same again, against the tumble photo. `tiny` sitting
//                               second in this list is the whole reason both hold.
//   Core Plus Lyrical & Contemporary — lyrical and contemporary both claim it; it takes
//                               the style its own name leads with.
//   Core Contemporary & Jazz   — jazz and contemporary both claim it. Jazz leads because
//                               the studio gave jazz an explicit naming rule ("any class
//                               with jazz in the name") and has not asked to narrow it.
//                               Move `contemporary` above `jazz` to flip just this one.
//
// The tiny photograph arrived a message later than the rest and now fills all three Tiny
// Core classes. A rule with `photo: null` is still a legitimate state — it claims a class
// away from the broader rules below while its art is outstanding, which is exactly what
// kept the teenage hip hop photo off a class of 2-to-5-year-olds in the meantime.
const CLASS_PHOTO_RULES = [
  {
    id: 'acro',
    match: (name) => name === 'Core Acro & Jazz',
    photo: '/class-acro.jpg',
    photoAlt: 'A dancer holding an inverted acro split in the studio at Capital Core Dance',
  },
  {
    id: 'tiny',
    match: (name) => /^Tiny Core/.test(name),
    photo: '/class-tiny-ballet.jpg',
    photoAlt: 'A young dancer in a pink leotard holding her arms in fifth position at Capital Core Dance',
  },
  {
    // Above `pom`, which would otherwise catch this class and give a 16+ evening class a
    // photograph of three teenagers. 'Pom Cheer' still takes that one.
    id: 'adult-pom',
    match: (name) => /^Adult Pom/.test(name),
    photo: '/class-adult-pom.jpg',
    photoAlt: 'An adult dancer with both arms raised holding red pom poms in the studio at Capital Core Dance',
  },
  {
    id: 'hip-hop',
    match: (name) => /hip hop/i.test(name),
    photo: '/class-hip-hop.jpg',
    photoAlt: 'A dancer mid-freeze in a hip hop class at Capital Core Dance',
  },
  {
    id: 'jazz',
    match: (name) => /jazz/i.test(name),
    photo: '/class-jazz.jpg',
    photoAlt: 'A dancer in a jazz line with one arm extended at Capital Core Dance',
  },
  {
    id: 'pom',
    match: (name) => /pom/i.test(name),
    photo: '/class-pom.jpg',
    photoAlt: 'Three dancers posed with pom poms raised at Capital Core Dance',
  },
  {
    id: 'femme-flair',
    match: (name) => /femme|flair/i.test(name),
    photo: '/class-femme-flair.jpg',
    photoAlt: 'An adult dancer in an expressive pose with one arm raised in the studio at Capital Core Dance',
  },
  {
    id: 'musical-theatre',
    match: (name) => /musical theatre/i.test(name),
    photo: '/class-musical-theatre.jpg',
    photoAlt: 'Young dancers in period costume performing on stage with arms outstretched at a Capital Core Dance recital',
  },
  {
    // Above `contemporary` so 'Core Plus Lyrical & Contemporary' — the one class both
    // claim — takes the style its name leads with.
    id: 'lyrical',
    match: (name) => /lyrical/i.test(name),
    photo: '/class-lyrical.jpg',
    photoAlt: 'A dancer in a lyrical pose with a flowing skirt at Capital Core Dance',
  },
  {
    id: 'contemporary',
    match: (name) => /contemporary/i.test(name),
    photo: '/class-contemporary.jpg',
    photoAlt: 'A dancer kneeling in a contemporary extension at Capital Core Dance',
  },
  {
    // Below `tiny`, which is what keeps this photograph of a teenager off Tiny Core
    // Ballet & Tumble — a class of two-to-five-year-olds.
    id: 'tumble',
    match: (name) => /tumbl/i.test(name),
    photo: '/class-tumble.jpg',
    photoAlt: 'A dancer holding a handstand with one leg extended at Capital Core Dance',
  },
  {
    // LAST, and that placement is the whole rule. Nine of the schedule's classes have
    // "ballet" in the name but only two of them are ballet-first — the rest pair it with
    // a style that has its own photograph (jazz, hip hop, contemporary) or belong to Tiny
    // Core. Sitting at the bottom, this catches exactly the leftovers: Core Ballet & Tap
    // and Core Ballet & Modern today, plus any future ballet class no narrower rule
    // claims. Move it up and it silently repossesses six classes.
    id: 'ballet',
    match: (name) => /ballet/i.test(name),
    photo: '/class-ballet.jpg',
    photoAlt: 'A young ballet dancer in a burgundy leotard with one arm raised in the studio at Capital Core Dance',
  },
]

// The photo for a class, by its schedule display name (not its infoKey — the rules the
// studio gave are about what a class is called on the schedule). Returns null when no
// rule matches or the matched rule is still waiting on its image.
export function photoForClass(name = '') {
  const rule = CLASS_PHOTO_RULES.find((r) => r.match(name))
  return rule?.photo ? { photo: rule.photo, photoAlt: rule.photoAlt } : null
}

// Exported for the test that pins what the rules currently resolve to across the whole
// Fall schedule — the rules are deliberately broad, so the assignment they produce is
// worth having visible rather than inferred.
export const CLASS_PHOTO_RULE_IDS = CLASS_PHOTO_RULES.map((r) => r.id)
