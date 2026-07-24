# Fall 2026 switchover — capitalcoredancewebsite

**Date:** 2026-07-23
**Goal:** Retire all summer programming from the public site, stand up the Fall 2026 class schedule, and route every registration CTA to the portal instead of the inline forms.

## Decisions (confirmed with owner)
1. Fall schedule content comes from the **flyer** (`public/flyer-fall-schedule.png`), not the portal's `class-pricing.ts`. Portal/flyer discrepancies (Wed Breakdancing split, Thu Tumble vs Adult Pom) noted for a **separate** portal reconciliation — out of scope here.
2. **Birthdays untouched** (no portal birthday form exists).
3. Home flyer strip: drop the 3 summer flyers, replace with the single **Fall schedule flyer** linking to `/classes`.
4. Removal method: **comment out routes/imports + keep page files** (same pattern the Recital pages used). Restorable next summer.
5. All registration CTAs point to **`https://studio.capitalcoredance.com/register/classes`** (portal Fall class registration; public; charges the $60 new / $50 returning reg fee).

## Scope of changes

### Navbar (`src/components/Navbar.jsx`)
`NAV_LINKS` → Home · **Classes** (`/classes`) · Tuition · Birthdays. Remove Summer Classes, Summer Camps, Adults. (Contact stays as the right-side button.)

### Footer (`src/components/Footer.jsx`)
Remove Summer Classes, Summer Camps, Adult Summer Series links. Keep **Classes** (`/classes`), relabel "Our Classes" → "Classes".

### Routing (`src/App.jsx`)
Comment out (imports + `<Route>`s), preserving files, for: `/summer-classes` + signup/payment/thankyou; `/camps` + camp-registration/payment/pay/thankyou; `/adult-summer-series` + signup/payment/thankyou; `/mini-series`. Follow the existing Recital comment block style.

### Fall classes page (`src/pages/Classes.jsx`)
- Replace `SCHEDULE` with the Fall 2026 grid (Mon–Fri, verbatim from flyer). Ages: Tiny = "Ages 2–5"; other beginner = "Ages 5+"; adult = "Ages 16+".
- Eyebrow "Spring 2026 Schedule" → **"Fall 2026 · August 24 – December 18"**.
- Remove the orange **Mini Series** banner + its `Link`.
- **Remove the per-class price column** (flyer has no prices; portal takes reg fee only). Add a line under the grid: monthly tuition on the Tuition page.
- Add flyer footer note: "Beginner classes start at age 5+. Classes are subject to change based on interest and registrations."
- Filter `CATEGORIES`: drop Irish; keep Tiny/Ballet/Jazz & Acro/Hip Hop/Tumble & Cheer/Musical Theatre/Adult.
- "Enroll Now" button → external portal link (`target="_blank" rel="noopener noreferrer"`).
- SEO: keep canonical `/classes`; update title/description to year-round + Fall 2026 (drop summer-camp phrasing).

### Home (`src/pages/Home.jsx`)
- Hero CTA "Explore Summer Classes" → **"View Fall Classes"** → `/classes`.
- Program cards: replace the 3 summer cards (Summer Classes, Camps, Adult Summer Series) with a single **Fall Classes** card → `/classes`. Keep Birthdays.
- Flyer strip: replace 3 summer flyers with the one **Fall** flyer (`/flyer-fall-schedule.png`) → `/classes`.
- "Register for a Trial" → portal `/register/classes`.
- Update summer-specific body/meta copy to year-round/Fall.

## Out of scope
Portal `class-pricing.ts` reconciliation; birthday flow; deleting summer page files; deploy (owner deploys separately).

## Verification
- `npm run dev` renders `/` and `/classes` with no console errors; existing Vitest suite (`npm test`) stays green.
- Nav/footer show no summer links; summer routes 404 in-app (unreachable) but files remain.
- Every "Enroll/Register" CTA opens the portal in a new tab.
