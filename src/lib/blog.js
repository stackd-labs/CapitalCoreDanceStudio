// Blog content for Capital Core Dance Studio.
// SEO + AEO (answer-engine) optimized: every post leads with a plain-language
// "quick answer" (tldr), uses question-style headings, ships FAQ structured
// data, and links to the studio page(s) it references.
//
// Each post: { slug, category, date (ISO), readMinutes, title,
//   metaTitle, metaDescription, excerpt, tldr, related[], sections[], faqs[] }
// related[0] is rendered as the primary CTA button; all are shown as links.
//
// `accent` was removed 2026-08-11: it held a hex from the pre-redesign palette, and
// both the blog index and the article page now use the blog section's own accent.

export const POSTS = [
  {
    slug: 'summer-dance-camps-2026-themed-weeks',
    category: 'Summer Camps',
    date: '2026-05-20',
    readMinutes: 5,
    title: 'Summer Dance Camps 2026: All 8 Themed Weeks Explained',
    metaTitle:
      'Summer Dance Camps 2026 in Midlothian, VA — All 8 Themed Weeks | Capital Core Dance Studio',
    metaDescription:
      'A week-by-week guide to Capital Core Dance Studio’s 8 themed summer dance camps for kids ages 4–13 in Midlothian, VA. Dates, themes, pricing, and how to register for summer 2026.',
    excerpt:
      'From Rainbow Remix to Princess and Heroes, here is every one of our eight themed summer camp weeks for 2026 — with dates, who they’re for, and how to register.',
    tldr:
      'Capital Core Dance Studio runs 8 themed summer dance camp weeks for kids ages 4–13, Monday–Friday from 9:30 AM to 3:30 PM, June 15 through August 7, 2026. Each week has its own creative theme, and you can register for one week or several.',
    related: [
      { to: '/camps', label: 'See All 8 Camp Weeks & Register' },
      { to: '/summer-classes', label: 'Prefer evening classes? Summer Classes' },
    ],
    sections: [
      {
        heading: 'What are the 2026 summer camp dates and times?',
        body: [
          'Our summer camps run Monday through Friday, 9:30 AM to 3:30 PM, from mid-June through early August 2026. Before-care and after-care are available at $15 per hour, per day, for families who need an earlier drop-off or later pickup.',
          'Camps are designed for dancers ages 4 to 13, and no prior dance experience is required. Each day blends dance instruction with themed crafts, games, and music so campers stay engaged from morning to afternoon.',
        ],
      },
      {
        heading: 'The 8 themed weeks at a glance',
        body: ['Each week is built around its own theme, so dancers can attend several weeks without repeating the experience:'],
        list: [
          'Week 1 (June 15–19) — Rainbow Remix: self-expression through vibrant styles, crafts, and joyful music.',
          'Week 2 (June 22–26) — Glow Dance Party: neon crafts, upbeat choreography, and a glowing studio celebration.',
          'Week 3 (June 29–July 3) — Pop Stars and Performers: spotlight routines that build confidence and stage presence.',
          'Week 4 (July 6–10) — Around the World: music, movement, and cultural rhythms from across the globe.',
          'Week 5 (July 13–17) — Beach Bash Boogie: sunny, feel-good routines and beach-themed crafts.',
          'Week 6 (July 20–24) — Movie Magic: choreography inspired by favorite movie soundtracks.',
          'Week 7 (July 27–31) — Dance & Dream Spirit Week: affirmations, goal-setting, and confidence-building.',
          'Week 8 (August 3–7) — Princess and Heroes: character movement, imaginative play, and story-driven dance.',
        ],
      },
      {
        heading: 'How much do the camps cost?',
        body: [
          'A full week (Monday–Friday) is $205 for current Capital Core dancers and $225 for non-studio campers. Half-day full weeks are $155/$175, single full days are $50/$55, and single half days are $35/$40.',
          'You can mix and match weeks, full days, and half-days during registration, and families enrolled in Fall 2025 / Spring 2026 classes get the current-dancer rate. CertifiKid deals can save $40–$60 per week.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What ages are the summer dance camps for?',
        a: 'Summer camps are for dancers ages 4 to 13. Activities are grouped so younger and older campers are both challenged and supported.',
      },
      {
        q: 'Do campers need dance experience?',
        a: 'No. Camps welcome first-time dancers and experienced students alike — every week is built to be beginner-friendly.',
      },
      {
        q: 'Can my child attend more than one week?',
        a: 'Yes. Because each of the 8 weeks has a different theme, many campers attend multiple weeks. You can register for any combination of weeks during signup.',
      },
      {
        q: 'Is before- and after-care available?',
        a: 'Yes. Before-care and after-care are offered at $15 per hour, per day, for families who need a drop-off before 9:30 AM or pickup after 3:30 PM.',
      },
    ],
  },

  {
    slug: 'summer-dance-classes-2026-guide',
    category: 'Summer Classes',
    date: '2026-05-18',
    readMinutes: 5,
    title: 'Your Guide to Summer Dance Classes 2026 (Ages 2 to Teen)',
    metaTitle:
      'Summer Dance Classes 2026 in Midlothian, VA — Schedule & Pricing | Capital Core Dance Studio',
    metaDescription:
      'Everything about Capital Core Dance Studio’s 6-week summer dance classes, June 23–July 30, 2026, on Tuesday and Wednesday evenings. Class list for ages 2 to teen, three pricing options including the Flex Pass, and how to sign up.',
    excerpt:
      'Our 6-week summer session keeps dancers moving all summer. Here’s the class lineup, three flexible pricing options, and how the deposit works.',
    tldr:
      'Capital Core’s summer dance classes run for 6 weeks, June 23 to July 30, 2026, on Tuesday and Wednesday evenings. There are classes for ages 2 through teen, and you can pay per class, buy a Summer Flex Pass ($329 unlimited), or drop in ($25/class).',
    related: [
      { to: '/summer-classes', label: 'View Classes & Sign Up' },
      { to: '/camps', label: 'Looking for daytime camps instead?' },
    ],
    sections: [
      {
        heading: 'When do summer classes run?',
        body: [
          'The summer session is 6 weeks long, running June 23 through July 30, 2026, with classes held on Tuesday and Wednesday evenings. It’s a great way for current dancers to keep their skills sharp and for new dancers to try the studio in a low-pressure setting.',
        ],
      },
      {
        heading: 'What classes are offered?',
        body: ['The lineup spans our youngest movers through teens:'],
        list: [
          'Tiny Ballet & Tumble (our littlest dancers, ages 2+)',
          'Tumble Techniques',
          'Beginner Ballet & Tap',
          'Hip Hop',
          'A Tik Tok Hip Hop workshop',
        ],
      },
      {
        heading: 'How does pricing and signup work?',
        body: [
          'There are three ways to pay: per-class enrollment for the full 6 weeks ($120–$140 each depending on length), a Summer Flex Pass ($329 for unlimited classes all summer — the best value for busy families), or single drop-ins at $25 per class per week.',
          'A $50 deposit reserves your dancer’s spot for per-class and Flex Pass enrollments and applies toward tuition; drop-ins are paid in full at signup. If your dancer already attends Capital Core, just mark them as a Returning Dancer and we’ll pull their details from our records.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How long is the summer dance session?',
        a: 'It is a 6-week session running June 23 through July 30, 2026, with classes on Tuesday and Wednesday evenings.',
      },
      {
        q: 'What is the Summer Flex Pass?',
        a: 'The Flex Pass is $329 for unlimited summer classes across all six weeks — the best value if your dancer wants to attend several classes per week.',
      },
      {
        q: 'Can I sign up more than one dancer?',
        a: 'Yes. The signup form lets you add as many dancers as you like. Each picks their own classes (or Flex Pass, or drop-in), and the deposit scales accordingly.',
      },
      {
        q: 'Do I have to re-enter info for a returning dancer?',
        a: 'No. Mark the dancer as a Returning Dancer and give their name — we already have their age and other details on file.',
      },
    ],
  },

  {
    slug: 'adult-summer-series-movement-for-women',
    category: 'Adult Classes',
    date: '2026-05-16',
    readMinutes: 4,
    title: 'The Adult Summer Series: Movement Classes for Women',
    metaTitle:
      'Adult Summer Series — Movement Classes for Women in Midlothian, VA | Capital Core Dance Studio',
    metaDescription:
      'Capital Core Dance Studio’s Adult Summer Series is a 90-minute Monday-night movement experience for women in Midlothian, VA — every class blends Throwback Energy, Femme Flow, and Calm Confidence. Six weeks from June 29. $25 drop-in or $120 pass. Registration open.',
    excerpt:
      'A 90-minute movement experience made for women — no experience needed. Here’s what every class includes, when it meets, and how to register.',
    tldr:
      'The Adult Summer Series is a beginner-friendly, 90-minute movement experience for women at Capital Core Dance Studio in Midlothian, VA. Every Monday class (6:00–7:30 PM, six weeks from June 29, 2026) blends 45 minutes of Throwback Energy, 30 minutes of Femme Flow, and 15 minutes of Calm Confidence. It’s $25 per drop-in or $120 for the Summer Series Pass (all six classes). Registration is open.',
    related: [
      { to: '/adult-summer-series', label: 'Register for the Series' },
      { to: '/contact', label: 'Questions? Contact the Studio' },
    ],
    sections: [
      {
        heading: 'Who is the Adult Summer Series for?',
        body: [
          'This is a women-only movement experience designed for adults of any experience level — absolutely no dance background required. It runs Mondays from 6:00 to 7:30 PM for six weeks, starting June 29, 2026, in a supportive, judgment-free space at our Midlothian studio.',
          'Whether you danced years ago or have never set foot in a studio, every 90-minute class is built to feel welcoming, low-pressure, and genuinely fun.',
        ],
      },
      {
        heading: 'What’s in every 90-minute class?',
        body: ['Each class flows through three parts, so you get a little of everything every week:'],
        list: [
          'Throwback Energy (45 min) — feel-good, high-energy dance to your favorite throwback hits.',
          'Femme Flow (30 min) — graceful, empowering movement that builds confidence and helps you feel strong.',
          'Calm Confidence (15 min) — stretch, breathe, and reconnect to leave feeling centered and refreshed.',
        ],
      },
      {
        heading: 'How do I sign up, and what does it cost?',
        body: [
          'Registration is open. It’s $25 per drop-in class, or you can grab the Summer Series Pass for $120 to attend all six Mondays and save $30.',
          'Head to the Adult Summer Series page, choose a drop-in or the full pass, and reserve your spot with secure online payment. Spots are limited.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do I need dance experience to join?',
        a: 'No. The Adult Summer Series is beginner-friendly and welcomes women with no dance background at all.',
      },
      {
        q: 'What’s included in each class?',
        a: 'Every 90-minute class blends all three parts: 45 minutes of Throwback Energy (dance to throwback hits), 30 minutes of Femme Flow (graceful, confidence-building movement), and 15 minutes of Calm Confidence (stretch, breathe, and reconnect).',
      },
      {
        q: 'When does it meet?',
        a: 'Mondays from 6:00 to 7:30 PM, six weeks starting June 29, 2026, at our Midlothian studio.',
      },
      {
        q: 'How do I reserve a spot, and what does it cost?',
        a: 'Register online on the Adult Summer Series page. It’s $25 per drop-in or $120 for the Summer Series Pass (all six classes — save $30). Spots are limited.',
      },
    ],
  },

  {
    slug: 'dance-birthday-party-guide-midlothian',
    category: 'Birthday Parties',
    date: '2026-05-12',
    readMinutes: 5,
    title: 'How to Throw the Perfect Dance Birthday Party in Midlothian',
    metaTitle:
      'Kids Dance Birthday Parties in Midlothian, VA — Themes & Pricing | Capital Core Dance Studio',
    metaDescription:
      'Plan a stress-free dance birthday party at Capital Core Dance Studio in Midlothian, VA. Packages start at $199 for up to 10 kids, with themes from Princess to Hip Hop. See what’s included and how to book.',
    excerpt:
      'A private studio, an instructor-led dance party, and zero cleanup for you. Here’s how our birthday parties work, the themes available, and how to lock in a date.',
    tldr:
      'Capital Core Dance Studio hosts private kids’ dance birthday parties in Midlothian, VA. Packages start at $199 for up to 10 children for a 90-minute party and include the space, an instructor-led dance party, themed activities, music, tables and chairs, and setup/cleanup. A $50 deposit books your date.',
    related: [
      { to: '/birthdays', label: 'See Party Packages & Book' },
      { to: '/contact', label: 'Ask About a Custom Theme' },
    ],
    sections: [
      {
        heading: 'What’s included in a dance birthday party?',
        body: [
          'Each party includes a private studio space, an instructor-led dance party, themed activities, music, tables and chairs, and full setup and cleanup. Parents simply bring the cake and food — we handle the rest, so you can actually enjoy the celebration.',
          'The standard package covers up to 10 children for a 90-minute private party, and additional children can be added.',
        ],
      },
      {
        heading: 'What themes can we choose from?',
        body: ['Pick a theme that fits the birthday star:'],
        list: [
          'Princess & Fairytale Dance',
          'Hip Hop Dance Party',
          'Pop Star Dance Party',
          'Glow Dance Party',
          'Unicorn & Rainbow Party',
          'Preschool Wiggle & Giggle',
          'Tea Party & Royal Celebration',
          'Superhero Movement Party',
          'Dance & Craft Party',
        ],
      },
      {
        heading: 'How much does it cost and how do I book?',
        body: [
          'Packages start at $199 for up to 10 children for a 90-minute party. A $50 non-refundable deposit is required to book, with the balance due on party day. Custom themes and upgrades — like glow parties and crafts — are also available.',
          'Book using the online booking form on the Birthday Parties page. Weekend dates fill quickly, so reserve early to get your preferred slot.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does a dance birthday party cost?',
        a: 'Packages start at $199 and include up to 10 children for a 90-minute private party. Additional children can be added, and a $50 non-refundable deposit books the date.',
      },
      {
        q: 'What’s included in the package?',
        a: 'A private studio, an instructor-led dance party, themed activities, music, tables and chairs, and setup and cleanup. Parents just bring the cake and food.',
      },
      {
        q: 'Can we request a custom theme?',
        a: 'Yes. In addition to our standard themes, custom themes and upgrades like glow parties and crafts are available — just ask when you book.',
      },
      {
        q: 'How far in advance should we book?',
        a: 'As early as possible. Availability is limited, especially on weekends, so booking ahead gives you the best choice of dates.',
      },
    ],
  },

  {
    slug: 'free-trial-dance-class-first-time',
    category: 'Getting Started',
    date: '2026-05-08',
    readMinutes: 4,
    title: 'Trying Dance for the First Time? Start With a Free Trial Class',
    metaTitle:
      'Free Trial Dance Class in Midlothian, VA — How It Works | Capital Core Dance Studio',
    metaDescription:
      'New to dance? Capital Core Dance Studio offers a free first class with no commitment for dancers of all ages in Midlothian, VA. Here’s how to claim your free trial and what to expect.',
    excerpt:
      'Not sure if dance is the right fit? Your first class is always free. Here’s how the trial works and how we match your dancer to the right class.',
    tldr:
      'Capital Core Dance Studio offers a free first class with no commitment for new dancers of any age. To claim it, fill out the Contact form and choose “Register for a Free Trial” — the studio matches your dancer to a class within 1–2 business days.',
    related: [
      { to: '/contact', label: 'Claim Your Free Trial Class' },
      { to: '/classes', label: 'Browse Class Styles First' },
    ],
    sections: [
      {
        heading: 'Is the first class really free?',
        body: [
          'Yes — your first class is always free, with no commitment required. It’s the easiest, lowest-pressure way to see whether a style and the studio are the right fit before you enroll.',
          'We welcome dancers from age 2 through adults, and most of our classes are open to beginners. Our instructors never assume prior experience, so a free trial is a comfortable place to start.',
        ],
      },
      {
        heading: 'How do I claim my free trial?',
        body: [
          'Fill out the Contact form on our website and choose “Register for a Free Trial” from the interest dropdown. We’ll match your dancer with the right class for their age and level and follow up within 1–2 business days.',
          'Not sure which style to try? Browse the Classes page first — from ballet and tap to hip hop and acro — then mention your interest in the form.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How do I sign up for a free trial class?',
        a: 'Submit the Contact form and select “Register for a Free Trial” from the interest dropdown. The studio will match your dancer with a class within 1–2 business days.',
      },
      {
        q: 'What ages can take a free trial?',
        a: 'Dancers from age 2 through adults are welcome. Most classes are open to beginners with no prior experience required.',
      },
      {
        q: 'Is there any commitment with the trial?',
        a: 'No. The first class is free with no obligation to enroll afterward.',
      },
    ],
  },

  {
    slug: 'what-is-the-mini-series',
    category: 'Classes',
    date: '2026-05-06',
    readMinutes: 3,
    title: 'What Is the Mini Series? Two Dance Styles in One Class',
    metaTitle:
      'The Mini Series — Two Dance Styles, One Class | Capital Core Dance Studio',
    metaDescription:
      'Capital Core Dance Studio’s Mini Series is a short-term, low-commitment program that combines two dance styles into one fun session. A great way to try something new in Midlothian, VA.',
    excerpt:
      'The Mini Series packs two dance styles into a single session — a low-commitment way to explore something new. Here’s how it works.',
    tldr:
      'The Mini Series is a short-term Capital Core Dance Studio program where each class combines two dance styles into one fun session. It’s a low-commitment way for dancers to try something new and is typically offered in spring and fall.',
    related: [
      { to: '/mini-series', label: 'Explore the Mini Series' },
      { to: '/classes', label: 'See All Year-Round Classes' },
    ],
    sections: [
      {
        heading: 'How does the Mini Series work?',
        body: [
          'The Mini Series is a short-term program where each class blends two dance styles into a single session — think the energy of one style paired with the technique of another. It’s designed to be a low-commitment way for dancers to sample something new without signing up for a full semester.',
          'Because it’s short-run, it’s perfect for dancers who are curious about a style they haven’t tried, or for newcomers who want a taste of studio life before committing to year-round classes.',
        ],
      },
      {
        heading: 'When is it offered?',
        body: [
          'The Mini Series is typically offered in spring and fall. If you’re weighing it against our regular programming, the Classes page lists every year-round style we teach, from ballet and jazz to hip hop, tap, acro, and more.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the Mini Series?',
        a: 'It is a short-term program where each class combines two dance styles into one fun session — a low-commitment way to try something new.',
      },
      {
        q: 'When is the Mini Series offered?',
        a: 'It is typically offered in spring and fall.',
      },
      {
        q: 'Is the Mini Series good for beginners?',
        a: 'Yes. Its short, low-commitment format makes it an easy entry point for newcomers and for dancers curious about a new style.',
      },
    ],
  },

  {
    slug: 'dance-styles-parents-guide',
    category: 'Classes',
    date: '2026-05-04',
    readMinutes: 6,
    title: 'A Parent’s Guide to Dance Class Styles at Capital Core',
    metaTitle:
      'Dance Styles for Kids in Midlothian, VA — A Parent’s Guide | Capital Core Dance Studio',
    metaDescription:
      'Ballet, jazz, hip hop, tap, acro, contemporary, and more — a parent’s guide to the dance styles taught at Capital Core Dance Studio in Midlothian, VA, and how to choose the right class for your child.',
    excerpt:
      'Ballet or hip hop? Tap or acro? Here’s a plain-English guide to the styles we teach and how to pick the right starting point for your dancer.',
    tldr:
      'Capital Core Dance Studio teaches ballet, jazz, hip hop, contemporary, tap, acro, tumbling, lyrical, musical theatre, Irish dance, and pom/cheer, plus preschool creative movement (ages 2–5) and adult classes. New dancers can start with almost any style — most classes are open to beginners.',
    related: [
      { to: '/classes', label: 'Browse Classes & Schedule' },
      { to: '/faq', label: 'More Questions? Read the FAQ' },
    ],
    sections: [
      {
        heading: 'What dance styles does Capital Core teach?',
        body: [
          'We offer a wide range of styles for dancers of every age and level: ballet, jazz, hip hop, contemporary, tap, acro, tumbling, lyrical, musical theatre, Irish dance, and pom/cheer. Our youngest dancers (ages 2–5) start with preschool creative movement, and we also offer adult fitness classes.',
        ],
      },
      {
        heading: 'How do I choose the right style for my child?',
        body: [
          'There’s no wrong first step. Ballet builds the foundation of technique, posture, and discipline that supports every other style. Hip hop and jazz are high-energy and great for kids who love music and movement. Tap is rhythmic and playful, while acro and tumbling blend dance with gymnastics-style skills.',
          'For very young children, preschool creative movement focuses on coordination, listening, and fun rather than formal technique. Most classes are open to beginners, and our instructors are trained to support all skill levels — so it’s fine to just pick the style your child is most excited about.',
        ],
      },
      {
        heading: 'How long are classes and what ages do you teach?',
        body: [
          'We teach dancers from age 2 through adults. Class lengths range from 30 minutes for preschool and tiny classes up to 90 minutes for older, more advanced levels, depending on the style and age group.',
          'The full weekly schedule is on the Classes page. If you’re still deciding, remember your first class is always free — a no-pressure way to find the right fit.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What dance styles do you offer?',
        a: 'Ballet, jazz, hip hop, contemporary, tap, acro, tumbling, lyrical, musical theatre, Irish dance, and pom/cheer, plus preschool creative movement for ages 2–5 and adult classes.',
      },
      {
        q: 'What is the best first dance style for a young child?',
        a: 'For ages 2–5, preschool creative movement is ideal. For older beginners, ballet builds foundational technique, while hip hop and jazz are great high-energy starting points. Most classes are open to beginners.',
      },
      {
        q: 'What ages do you teach?',
        a: 'We welcome dancers from age 2 through adults, with progressive levels from beginner to advanced.',
      },
      {
        q: 'How long is each class?',
        a: 'Class lengths range from 30 minutes for preschool/tiny classes up to 90 minutes, depending on the style, age group, and level.',
      },
    ],
  },

  {
    slug: 'dance-tuition-fees-discounts-2026',
    category: 'Enrollment',
    date: '2026-05-02',
    readMinutes: 5,
    title: 'Understanding Dance Tuition, Fees & Discounts for 2026',
    metaTitle:
      'Dance Class Tuition & Fees 2026 in Midlothian, VA | Capital Core Dance Studio',
    metaDescription:
      'A clear breakdown of Capital Core Dance Studio’s 2026 tuition by class length, registration fees, semesters, and the discounts available for multiple classes and siblings in Midlothian, VA.',
    excerpt:
      'How much does dance cost per month? Here’s a transparent breakdown of tuition by class length, registration fees, and the discounts that can lower your total.',
    tldr:
      // Registration corrected $65 -> $60 on 2026-08-17 to match the portal form. The
      // leading $65 is the 30-minute class rate and is unchanged — do not "fix" both.
      'At Capital Core Dance Studio, monthly tuition is based on class length: $65 (30 min), $85 (45 min), $105 (60 min), $125 (75 min), and $150 (90 min). Registration is $60 per dancer per semester or $120 for the full year, and multi-class, multi-student, and sibling discounts are available.',
    related: [
      { to: '/tuition', label: 'View Full Tuition Details' },
      { to: '/faq', label: 'Enrollment FAQ' },
    ],
    sections: [
      {
        heading: 'How much does tuition cost?',
        body: ['Monthly tuition is based on the length of the class:'],
        list: [
          '30-minute class — $65/month',
          '45-minute class — $85/month',
          '60-minute class — $105/month',
          '75-minute class — $125/month',
          '90-minute class — $150/month',
        ],
      },
      {
        heading: 'What about registration fees and semesters?',
        body: [
          'There’s a $60 registration fee per dancer per semester, or $120 for the full year covering both semesters. We run two semesters annually: Fall (August–December) and Spring (January–May). Once registered, dancers are locked into their classes and pricing for the semester.',
          'Full-semester tuition rates are also available if you’d prefer to pay by semester rather than monthly.',
        ],
      },
      {
        heading: 'What discounts can lower my cost?',
        body: [
          'Several discounts can bring your total down: multi-class discounts for dancers enrolled in more than one class, multi-student discounts for families with multiple dancers, and sibling discounts on registration fees, including family fee caps.',
          'All payments run through our online student portal, which accepts major credit and debit cards, ACH transfers, and checks. Reach out if you’d like help estimating your family’s total.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much do dance classes cost per month?',
        a: 'Tuition is based on class length: $65 (30 min), $85 (45 min), $105 (60 min), $125 (75 min), and $150 (90 min) per month. Full-semester rates are also available.',
      },
      {
        q: 'What is the registration fee?',
        a: 'It is $60 per dancer per semester, or $120 for the full year covering both semesters. Returning dancers get a discount, and sibling discounts and family fee caps apply for families with multiple dancers.',
      },
      {
        q: 'When are the semesters?',
        a: 'There are two semesters per year: Fall (August–December) and Spring (January–June).',
      },
      {
        q: 'What discounts are available?',
        a: 'Multi-class discounts, multi-student discounts for families with several dancers, and sibling discounts on registration fees.',
      },
    ],
  },
]

export function getPostBySlug(slug) {
  return POSTS.find((p) => p.slug === slug)
}
