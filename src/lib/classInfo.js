// Single source of truth for class prose. Consumed by the Classes calendar, the
// Class Levels page, and the Adult Classes page.
//
// Keys are the studio's copy names. The Fall schedule in Classes.jsx uses
// flyer-verbatim names that differ ("Beginner Acro / Jazz" vs "Beginner Acro &
// Jazz"), so each schedule row carries an explicit `infoKey` pointing here rather
// than being matched on its display name.
//
// `draft: true` marks a description written in-house because the studio's copy did
// not cover that class. Those three await studio review.
export const CLASS_INFO = {
  'Tiny Ballet & Tumble': {
    audience: 'Perfect for first-time dancers who love to move and climb.',
    description: 'Perfect for little ones just beginning their dance journey! Dancers explore basic ballet movements, balance, coordination, and beginner tumbling skills through music, imagination, and creative play. This class builds confidence while developing important motor skills in a fun, encouraging environment.',
  },
  'Tiny Ballet & Hip Hop': {
    audience: 'Great for high-energy little ones who love music and games.',
    description: 'A fun introduction to both ballet and hip hop! Young dancers build rhythm, coordination, confidence, and creativity while learning age-appropriate movement through upbeat music, games, and imaginative activities.',
  },
  'Tiny Ballet & Tap': {
    audience: 'Perfect for little dancers who love making noise with their feet.',
    description: 'Introduce your little dancer to the grace of ballet and the excitement of tap! This class develops rhythm, musicality, balance, listening skills, and confidence while making learning fun.',
  },
  'Beginner Ballet & Jazz': {
    audience: 'Ideal for a first-time dancer who wants a strong foundation.',
    description: 'A wonderful introduction to dance! Students build a strong ballet foundation while learning energetic jazz technique that improves flexibility, coordination, confidence, and performance quality.',
  },
  'Beginner Ballet & Hip Hop': {
    audience: 'Great for dancers who want structure and fun in one class.',
    description: 'The perfect combination of structure and fun! Dancers learn ballet technique while exploring the exciting energy of hip hop, helping them become well-rounded performers.',
  },
  'Beginner Ballet & Tap': {
    audience: 'Perfect for beginners drawn to rhythm and timing.',
    description: 'Students develop ballet fundamentals while learning rhythm, timing, and musicality through tap dancing. A great class for dancers beginning their dance education.',
  },
  'Beginner Ballet & Modern': {
    audience: 'Ideal for expressive dancers who like to create.',
    description: 'Explore both classical ballet and creative modern dance. Students learn proper technique while developing body awareness, expression, flexibility, and artistry.',
  },
  'Beginner Acro & Jazz': {
    audience: 'Great for energetic kids who love to flip and tumble.',
    description: 'A high-energy class introducing dancers to basic acrobatics alongside exciting jazz movement. Students build strength, flexibility, coordination, balance, and confidence.',
  },
  'Beginner Contemporary & Jazz': {
    audience: 'Perfect for dancers who want to move and tell a story.',
    description: 'Learn expressive movement while building strong jazz fundamentals. Dancers improve flexibility, musicality, creativity, and performance skills in this engaging combo class.',
  },
  'Beginner Hip Hop & Breakdancing': {
    audience: 'Great for energetic dancers who want to freestyle.',
    description: 'A favorite for energetic dancers! Students learn hip hop grooves, beginner breakdancing foundations, freestyle skills, musicality, and coordination in an encouraging atmosphere.',
  },
  'Beginner Hip Hop': {
    draft: true,
    audience: "Perfect for a first-time dancer who loves to move to today's music.",
    description: 'An upbeat introduction to hip hop! Dancers learn grooves, rhythm, and beginner choreography while building coordination, musicality, and confidence in a supportive class.',
  },
  'Acro & Lyrical': {
    audience: 'Ideal for dancers with tumbling experience who love to perform.',
    description: 'This class combines acrobatic skills with expressive lyrical dance. Students focus on flexibility, strength, control, artistry, and emotional storytelling through movement.',
  },
  'Ballet & Contemporary': {
    audience: 'Ideal for dancers focused on serious technique.',
    description: 'A technique-focused class blending classical ballet with contemporary dance. Dancers develop alignment, flexibility, artistry, turns, extensions, and musicality.',
  },
  'Tumble Tech': {
    audience: 'Great for any dancer working toward a new tumbling skill — all levels welcome.',
    description: 'Designed for dancers wanting to improve tumbling technique. Students work on rolls, cartwheels, walkovers, handstands, flexibility, strength, and proper progressions at their own level.',
  },
  'Tumble': {
    draft: true,
    audience: 'Great for dancers building tumbling confidence at their own pace.',
    description: 'A tumbling class for dancers building skills at their own pace. Students work on rolls, cartwheels, handstands, flexibility, and strength with proper spotting and progressions.',
  },
  'Lyrical & Contemporary': {
    draft: true,
    audience: 'Ideal for dancers who connect to music and emotion.',
    description: 'Expressive movement set to the music that inspires it. Dancers develop control, flexibility, artistry, and storytelling while strengthening lyrical and contemporary technique.',
  },
  'Musical Theatre': {
    audience: 'Perfect for the dancer who loves to sing, act, and perform — all levels welcome.',
    description: 'Love to perform? This Broadway-inspired class combines dance, acting, and storytelling while helping students build confidence, stage presence, and performance skills.',
  },
  'Pom Cheer': {
    audience: 'Great for dancers who love team routines and performing.',
    description: 'Learn pom technique, cheer motions, jumps, and exciting dance combinations while developing teamwork, confidence, and performance quality.',
  },
  'Adult Femme Flair': {
    audience: 'Perfect for adults returning to dance or starting fresh.',
    description: "An empowering dance class focused on confidence, musicality, and expressive choreography. Whether you're returning to dance or trying something new, you'll leave feeling stronger and more confident.",
  },
  'Adult Pom': {
    audience: "Great for adults who want a workout that doesn't feel like one.",
    description: "A fun, upbeat class featuring pom technique, jazz-inspired movement, and energetic choreography. It's a great workout while learning exciting routines.",
  },
  'Adult Contemporary': {
    audience: 'Ideal for adults who want to move expressively in a welcoming room.',
    description: 'Explore movement, creativity, and expression through contemporary dance. Improve flexibility, balance, strength, and artistry in a supportive, welcoming environment.',
  },
}

export function getClassInfo(key) {
  return CLASS_INFO[key]
}
