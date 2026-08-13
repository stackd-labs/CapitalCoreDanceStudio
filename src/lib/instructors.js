// The Capital Core teaching staff, transcribed 2026-08-13 from the studio's own "Meet
// the Instructor" flyers. Every fact here comes off a flyer — nothing is inferred,
// embellished, or filled in from elsewhere. These are real people, so where a flyer is
// silent (Ms. Savannah's surname, Ms. Milan's and Ms. Kendall's and Ms. Adelle's) this
// file is silent too rather than guessing.
//
// `firstName` is what the About page shows, at the studio's request 2026-08-13 — a grid
// of six titled full names read as a formal directory rather than as the people your
// dancer sees each week. `name` is kept because it is what the flyer says and what the
// alt text and any future press use needs; only the display was shortened.
//
// The Fall flyer names nine instructors — Chanel, Milan, Adelle, Savannah, Jillian, Aro,
// Hannah, Kendall, Yul. Six have flyers so far; Chanel, Aro and Hannah are still to
// come, which is why the About page still says the roster is growing.
const ROSTER = [
  {
    slug: 'yul',
    firstName: 'Yul',
    name: 'Mr. Yul Tyler Jr.',
    role: 'Instructor & Competition Director',
    specialties: 'Lyrical · Contemporary',
    photo: '/instructor-yul.jpg',
    photoAlt: 'Portrait of Mr. Yul Tyler Jr., instructor and competition director at Capital Core Dance',
    bio: 'With over 10 years of dance training, Mr. Yul specializes in lyrical and contemporary while bringing experience across a variety of styles. A nationally awarded dancer and choreographer, he has earned multiple national and regional honors, including creating the highest-scoring routine of an entire competition weekend. His passion is helping dancers build strong technique, confidence, and artistry while creating performances they will never forget.',
  },
  {
    slug: 'kendall',
    firstName: 'Kendall',
    name: 'Ms. Kendall',
    role: 'Instructor',
    specialties: 'Pom/Cheer · Ballet · Tap',
    photo: '/instructor-kendall.jpg',
    photoAlt: 'Portrait of Ms. Kendall, instructor at Capital Core Dance',
    bio: 'Ms. Kendall has been with Capital Core since our founding season, specializing in Pom/Cheer, Ballet, and Tap. She is a professional dancer with Stavna Ballet, a nonprofit professional ballet company based in Richmond, VA, and continues to perform while teaching. Her classes are known for strong technique, clean performance, and high energy. Beyond the studio she works in a daycare setting, and has a natural gift for meeting children of all ages where they are.',
  },
  {
    slug: 'adelle',
    firstName: 'Adelle',
    name: 'Ms. Adelle',
    role: 'Instructor',
    specialties: 'Dance & Choreography',
    photo: '/instructor-adelle.jpg',
    photoAlt: 'Portrait of Ms. Adelle, instructor at Capital Core Dance',
    bio: 'Adelle is a graduate of Virginia Commonwealth University, where she earned a degree in African American History with a minor in Dance and Choreography. After graduating she became a member of the Latin Ballet professional company, touring to Spain, Mexico, and around the USA with celebrated international artists and musicians. She brings over 20 years of teaching experience across Williamsburg, Richmond, and Chesterfield, including Mary Baldwin University and Henrico School of the Arts. Adelle believes everyone can learn, and that it is our job as teachers to adapt and inspire.',
  },
  {
    slug: 'jillian',
    firstName: 'Jillian',
    name: 'Ms. Jillian',
    role: 'Instructor',
    specialties: 'Ballet · Contemporary',
    photo: '/instructor-jillian.jpg',
    photoAlt: 'Portrait of Ms. Jillian Epstein, instructor at Capital Core Dance',
    bio: 'Jillian Epstein is originally from Maryland, where she trained in a variety of styles before joining the Pre-Professional Division at the Ballet Conservatory of Asheville. There she trained under Nadia Iozzo and Gavin Larsen and was featured in A Midsummer Night’s Dream and Giselle. She graduated from the College of Charleston as a member of the Honors College with a B.A. in Dance and History, performing as a soloist in the Odalisque Pas de Trois, and has danced with Robert Ivey Ballet and Unbound Ballet Project.',
  },
  {
    slug: 'milan',
    firstName: 'Milan',
    name: 'Ms. Milan',
    role: 'Instructor',
    specialties: 'Cheer · Tumbling · Dance',
    photo: '/instructor-milan.jpg',
    photoAlt: 'Portrait of Ms. Milan, instructor at Capital Core Dance',
    bio: 'Ms. Milan has a strong background in cheerleading, tumbling, and dance, with years of training, performance, and leadership experience. She cheered for East End Youth Cheer, the Chamberlayne Packers, Salem Church Middle School, and Manchester High School, and tumbled with the Richmond Twisters. She also danced for Twisted Energy, a highly competitive majorette team. She is passionate about helping dancers grow in confidence and reach their full potential — on and off the floor.',
  },
  {
    slug: 'savannah',
    firstName: 'Savannah',
    name: 'Ms. Savannah',
    role: 'Instructor',
    specialties: 'Hip Hop · Flow arts',
    photo: '/instructor-savannah.jpg',
    photoAlt: 'Portrait of Ms. Savannah, instructor at Capital Core Dance',
    bio: 'Ms. Savannah specializes in Hip Hop and flow-inspired dancing — hula hoop included — that is fun, creative, and full of energy. She joined us this summer and wowed the audience at our Spring Recital with a hoop routine, and has been working hard with our Hip Hop dancers and adult classes since. She brings a bubbly, positive personality to every class, creating an environment where dancers feel confident, inspired, and ready to grow.',
  },
]

// Ordered by first name. The studio asked for alphabetical rather than by seniority so
// the grid reads like a class list — no ranking implied by who appears first. Sorting the
// export rather than hand-ordering the literal above means a seventh instructor lands in
// the right place without anyone remembering to insert them there.
export const INSTRUCTORS = [...ROSTER].sort((a, b) => a.firstName.localeCompare(b.firstName))
