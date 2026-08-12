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
