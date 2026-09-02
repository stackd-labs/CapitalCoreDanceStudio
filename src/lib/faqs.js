// The /faq page's questions and answers.
//
// Lives in lib/ rather than in FAQ.jsx because the test derives its category and question
// counts from this array, and exporting a constant alongside a component trips
// react-refresh/only-export-components — the same reason `useAccent` sits in
// lib/useAccent.js rather than in components/blocks.jsx.
//
// Every answer is drawn from the page that owns the fact (LittleMovers.jsx,
// AdultClasses.jsx, DanceCompany.jsx, Tuition.jsx, src/lib/tuition.js) rather than written
// fresh, so a price or a date has one home and cannot end up with two versions.

import { REGISTRATION } from './tuition'


// Exported so the test can derive the category and question counts instead of hardcoding
// them. They were hardcoded as "seven categories and thirty-two questions", which meant
// every content change here failed the suite on a number rather than on a fact.
export const FAQS = [
  {
    category: 'Classes & Programs',
    items: [
      {
        q: 'What dance styles do you offer?',
        // Rewritten from the Fall schedule, which is what a visitor can actually book. The
        // old answer also listed Irish dance; there is no Irish class on the Fall schedule,
        // so it was dropped here. src/lib/blog.js, src/lib/schema.js and public/llms.txt
        // still claimed it until 2026-08-19 and now match this answer, so the site says
        // one thing. The careers page is hiring an Irish instructor and says plainly that
        // the class is not on the schedule yet; when it lands, add it to
        // src/lib/schedule.js first and let the rest follow from there.
        a: 'On the Fall schedule: ballet, tap, jazz, hip hop, contemporary, lyrical, modern, acro, tumbling, breakdancing, musical theatre and pom/cheer — mostly taught as two-style combination classes. On top of that we run Little Movers for ages 0–5, adult evening classes for 16 and up, and the Dance Company for our competition dancers.',
      },
      {
        q: 'What ages do you teach?',
        // Was "starting at age 2", which stopped being true when Little Movers opened with
        // Baby & Me at 0–18 months.
        a: 'From babies through adults. Little Movers starts at birth — Baby & Me is 0–18 months — Tiny Core classes are for ages 2–5, Core starts at 5, Core Plus at 8, and our adult evening classes are 16 and up.',
      },
      {
        q: 'Do you have classes for beginners?',
        a: 'Absolutely. Most of our classes are open to beginners and we never assume prior experience. Our instructors are trained to work with all skill levels in a supportive, encouraging environment.',
      },
      {
        q: 'How long is each class?',
        // Was "30 minutes to 90 minutes". The rate card publishes 75- and 90-minute prices,
        // but nothing on the Fall schedule actually runs that long — it is 4 classes at 30
        // minutes, 17 at 45 and 1 at 60 — so quoting 90 here promised a class we do not
        // currently teach. Re-check against the schedule when a term changes.
        a: 'This Fall, classes run 30, 45 or 60 minutes — most are 45. Tiny Core classes for ages 2–5 are the 30-minute ones. Every class shows its exact time on the Classes page.',
      },
      {
        q: 'What is the Mini Series?',
        a: 'The Mini Series is a short-term program where each class combines two dance styles into one fun session. A low-commitment way for dancers to try something new — typically offered in spring and fall.',
      },
    ],
  },
  {
    category: 'Enrollment & Tuition',
    items: [
      {
        q: 'Is there a free trial class?',
        a: 'Yes — your first class is always free, no commitment required. Just fill out our Contact form, choose "Register for a Free Trial" from the interest dropdown, and we\'ll match your dancer with the right class within 1–2 business days.',
      },
      {
        q: 'How do I enroll my child?',
        a: 'You can enroll online through our student portal. If you have questions before signing up, feel free to reach out to us by phone at 804-234-4014 or by email at info@capitalcoredance.com.',
      },
      {
        q: 'How much do classes cost?',
        a: 'Class pricing is based on class length: 30-minute classes are $65/month, 45-minute classes are $85/month, 60-minute classes are $105/month, 75-minute classes are $125/month, and 90-minute classes are $150/month. Full-semester rates are also available.',
      },
      {
        q: 'What is the registration fee?',
        // Interpolated from REGISTRATION, not typed: this answer said $65 while the portal
        // charged $60.
        a: `There is a $${REGISTRATION.perSemester} registration fee per dancer per semester, or $${REGISTRATION.fullYear} for the full year (both semesters). Returning dancers get a discount, and sibling discounts and family fee caps are available for families with multiple dancers enrolled.`,
      },
      {
        q: 'When are your semesters?',
        // Spring was given as "January – June"; the Tuition page publishes it as ending
        // 21 May 2027.
        a: 'Two semesters a year. Fall 2026 runs August 24 to December 18, and Spring 2027 runs January 11 to May 21. Once registered, dancers are locked into their classes and pricing for the semester.',
      },
      {
        q: 'Do you offer discounts?',
        a: 'Yes. We offer multi-class discounts for dancers enrolled in more than one class, multi-student discounts for families with multiple dancers, and sibling discounts on registration fees. Reach out to us for details.',
      },
      {
        q: 'How do I pay?',
        a: 'All payments are made securely through our online student portal. We accept all major credit and debit cards, ACH transfers, and checks. If you have trouble with the portal, just contact us and we\'ll help.',
      },
    ],
  },
  // Little Movers / Adult Classes / Dance Company replaced the Summer Classes, Summer
  // Camps and Adult Summer Series categories on 2026-08-17. Those fourteen questions all
  // described programmes that finished in July and quoted their 2026 dates and prices as
  // current — an FAQ is the one page on a site a visitor trusts for plain fact. Recover
  // them from git when summer 2027 is scheduled; the camp and adult-series booking forms
  // are dormant in the portal for the same reason.
  //
  // Every answer below is drawn from the page that owns the fact (LittleMovers.jsx,
  // AdultClasses.jsx, DanceCompany.jsx, src/lib/tuition.js) rather than written fresh, so
  // there is no second version of a price to go stale.
  {
    category: 'Little Movers',
    items: [
      {
        q: 'What is Little Movers?',
        // This answer used to end "It is a drop-off programme", which the programme's
        // own class list contradicted: Baby & Me is 0–18 months and describes bonding,
        // and Parent & Me Dance is built for toddlers and caregivers. The studio
        // settled it on 2026-08-19 — NO Little Movers class is drop-off, and a
        // caregiver may stay in the room or wait in the studio. The Little Movers page
        // says the same thing above its schedule grid.
        a: 'Little Movers is our movement-based enrichment programme for infants, toddlers and preschoolers — dance, music, sensory play, tumbling and active exploration. Baby & Me runs 0–18 months, and every class after it takes 18 months to 5 years. No class is drop-off: a parent or caregiver stays with you, either in the class or in the studio.',
      },
      {
        q: 'When do Little Movers classes meet?',
        a: 'Monday, Wednesday and Friday mornings, in three 45-minute classes with 15 minutes between them: 9:30, 10:30 and 11:30. Every day opens with Baby & Me and Moovin\' & Groovin\'; the last class of the morning changes by day — Tiny Tumblers on Monday, Sensory Steps on Wednesday, and the Free Play Lab on Friday. Wednesday is the morning you can book right now: Monday and Friday are staffing up and will open once they have an instructor.',
      },
      {
        q: 'How much does Little Movers cost?',
        a: 'Little Movers is priced separately from studio class tuition. Drop in for $10 for your first child and $5 for each additional child, buy a Passport of 5 visits for $45 or 10 for $85, or take the monthly membership at $89 — which includes unlimited Little Movers classes plus one Tiny Core class for ages 2–5. Bringing more than one child? The first child pays full price and every child after that comes off by a flat amount: an additional drop-in is $5, an additional Passport is $10 off, and an additional membership is $10 off a month. Code MOOVE26 takes 30% off a Passport ($31.50 for 5 visits, $59.50 for 10) and 30% off your first month of membership, which we apply to your first invoice. It does not apply to single drop-in classes.',
      },
      {
        q: 'Can I register for Little Movers yet?',
        a: 'Not yet — the schedule above is planned and start dates are still to be confirmed. Get in touch through our Contact page and we will let you know as soon as registration opens.',
      },
    ],
  },
  {
    category: 'Adult Classes',
    items: [
      {
        q: 'Do you offer classes for adults?',
        a: 'Yes — evening classes for dancers 16 and up, and they are genuinely beginner-friendly. No dance experience is necessary, and your first class is always free.',
      },
      {
        q: 'Which adult classes do you run?',
        a: 'Three, each 45 minutes: Femme Flair on Mondays, Pom on Wednesdays, and Contemporary on Fridays. You can take one, two, or all three.',
      },
      {
        q: 'How much do adult classes cost?',
        a: 'A single 45-minute class is $85 a month, the same as any other 45-minute class at the studio. All three adult classes together are $165 a month, or you can drop in to a single class for $25.',
      },
      {
        q: 'How do I register for an adult class?',
        a: 'Adult dancers have their own registration form, separate from the one parents use for children — it does not ask for a parent or guardian. You will find it linked from the Adult Classes page.',
      },
    ],
  },
  {
    category: 'Dance Company',
    items: [
      {
        q: 'What is the Capital Core Dance Company?',
        a: 'It is our youth performance and competition programme, in its founding 2026/2027 season, for dancers aged 6 and up. It is deliberately beginner-friendly — no competition experience is needed — and is led by competition team director Mr. Yul Tyler Jr.',
      },
      {
        q: 'How much is Dance Company tuition?',
        a: 'One flat fee of $150 a month. That covers 3 hours of company practice each week plus up to 3 Capital Core dance classes, which are recommended rather than required — the allowance is part of the fee whether your dancer uses it or not. Any class beyond those three is charged as an additional fee at the normal monthly rate for its length.',
      },
      {
        q: 'Can my dancer still join the company this season?',
        a: 'The founding-season Team Building Clinic has finished, but get in touch through our Contact page — tell us your dancer is interested in the company and we will come back to you about joining.',
      },
    ],
  },
  {
    category: 'Birthday Parties',
    items: [
      {
        q: 'Do you host birthday parties?',
        a: 'Yes! Our birthday parties are a fun, active, and stress-free way to celebrate. Each party includes a private studio space, an instructor-led dance party, themed activities, music, tables and chairs, and set-up and clean-up. Parents just bring the cake and food.',
      },
      {
        q: 'How much do birthday parties cost?',
        a: 'Packages start at $199 and include up to 10 children for a 90-minute private party. Additional children can be added. A $50 non-refundable deposit is required to book, with the balance due on party day.',
      },
      {
        q: 'What themes are available for birthday parties?',
        a: 'We offer a variety of themes including Princess & Fairytale Dance, Hip Hop Dance Party, Pop Star Dance Party, Glow Dance Party, Unicorn & Rainbow Party, Preschool Wiggle & Giggle, Tea Party & Royal Celebration, Superhero Movement Party, and Dance & Craft Party. Custom themes and upgrades (like glow parties and crafts) are also available.',
      },
      {
        q: 'How do I book a birthday party?',
        a: 'You can book by completing our online booking form on the Birthday Parties page. We recommend booking in advance as availability is limited — especially on weekends.',
      },
    ],
  },
  {
    category: 'Studio Info',
    items: [
      {
        q: 'Where are you located?',
        a: 'We are located at 13110 Midlothian Turnpike, Midlothian, VA 23113. We serve the greater Midlothian, Chesterfield, and Richmond, Virginia area.',
      },
      {
        q: 'What are your studio hours?',
        // 8:00 PM is the studio's own figure, settled 2026-08-19. It is front-desk
        // hours, not the last class: Monday runs to 8:45 PM. The answer points at the
        // Classes page for that reason. See the note in src/lib/schema.js.
        a: 'Our general studio hours are Monday through Friday 3:00 PM – 8:00 PM and Saturday 9:00 AM – 2:00 PM. Some evening classes run a little later — check the Classes page for exact class times.',
      },
      {
        q: 'How can I contact you?',
        a: 'You can reach us by phone at 804-234-4014, by email at info@capitalcoredance.com, or by submitting the form on our Contact page. We are also active on Instagram and Facebook @capitalcoredance.',
      },
    ],
  },
]
