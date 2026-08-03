# Class Levels Page — Design

**Date:** 2026-08-03
**Project:** capitalcoredancewebsite (Vite · React 19 · Tailwind)
**Status:** Approved, pending implementation plan

## Problem

The Classes page (`src/pages/Classes.jsx`) shows the Fall 2026 schedule as day-grouped
rows with Day / Age Group / Dance Style filters. Nothing on the site explains what a
level means or what a style involves. A parent deciding between "Beginner Acro / Jazz"
and "Acro / Lyrical" has no way to tell which suits their dancer.

## Goal

A dedicated `/class-levels` page that explains the six levels and describes each dance
style, reachable from a new dropdown under "Classes" in the top nav.

## Decisions

| Decision | Choice | Rejected alternatives |
|---|---|---|
| Placement | Its own page at `/class-levels` | Section on the Classes page; expandable per-row descriptions |
| Nav | Dropdown under "Classes" | Flat top-level nav item; footer-only link |
| Description unit | The dance styles, grouped/badged by level | All 22 schedule rows; two-layer level + style copy |
| Styles spanning levels | One description per style, badged with the levels it's offered at | One level per style; repeat the style under each level |
| Schedule data | Untouched — stays verbatim from the studio flyer | Relabel unlabeled rows as Int/Adv |
| Copy | Claude drafts generic placeholders; Chanel replaces with real copy | Ship visible "coming soon" placeholders; wait for copy before building |

## Scope

### In scope

1. New page `src/pages/ClassLevels.jsx`
2. New route `/class-levels` in `src/App.jsx`
3. Dropdown support in `src/components/Navbar.jsx` (desktop + mobile)
4. Tests: new `src/pages/ClassLevels.test.jsx`, additions to `src/components/Navbar.test.jsx`

### Out of scope

- The Fall schedule data, class labels, and filters in `Classes.jsx` — unchanged
- `courseListSchema` in `src/lib/schema.js` — left as-is; the new page passes style
  names only and accepts its generated boilerplate descriptions
- `localBusinessSchema` advertises Irish dance, which is not on the Fall schedule.
  Noted, not changed.
- Footer links — unchanged

## Navigation

`NAV_LINKS` gains an optional `children` array:

```js
{ to: '/classes', label: 'Classes', children: [
    { to: '/classes', label: 'Class Schedule' },
    { to: '/class-levels', label: 'Class Levels' },
  ] }
```

**Desktop.** "Classes" stays a real `<Link>` to `/classes`. A caret button sits beside
it with `aria-haspopup="true"` and `aria-expanded`. The menu opens on hover over the
group or when the caret is activated by keyboard/click, and closes on Escape, outside
click, or route change. Keeping the parent as a link preserves direct access to the
schedule and keeps three existing `Navbar.test.jsx` assertions valid. Tradeoff
accepted: the caret is a smaller keyboard target than the full label would be.

**Mobile.** The hamburger list renders the two children as indented links beneath
"Classes". No toggle — both are always visible when the menu is open.

**Active state.** `linkClass` currently compares `pathname === to`. The Classes parent
must highlight on both `/classes` and `/class-levels`; each child highlights on its own
exact path.

## Page structure

Follows the existing page skeleton: `SEO` → `Navbar` → `PageHeader` → sections →
`Footer`. Copy lives in `LEVELS` and `STYLES` constants at the top of
`ClassLevels.jsx`, matching the `SCHEDULE`-at-top-of-`Classes.jsx` convention. All copy
edits happen in one place in one file.

1. **PageHeader** — eyebrow "Capital Core Dance", title "Class Levels", subtitle
   pointing dancers to the right fit.
2. **Level cards** — `bg-surface-light` section, 2-column grid collapsing to 1 on
   mobile. Six cards: level name (brand-red uppercase eyebrow), age line, blurb.
3. **Style list** — white section, one card per style: name, level badges, description.
4. **Closing CTA** — "first class is always free", a link to `/classes` for the
   schedule, and the portal register link (`PORTAL_REGISTER_URL`, same constant value
   as `Classes.jsx`).

### Visual language

Reuses what the Classes page already establishes — no new visual vocabulary:

- Cards: white, `border border-surface-border`, `border-l-4` cycling the four existing
  accents (`border-brand-red`, `border-[#7ab3e8]`, `border-[#f4a8b4]`, `border-[#f4a060]`)
- Level/style names: `text-navy-dark font-bold`
- Eyebrows: `text-brand-red text-xs font-bold tracking-[0.3em] uppercase`
- Body and meta text: `text-[#5a6a8a]`, muted `text-[#8a9aaa]`
- Badges: small pill, `bg-surface-light text-[#5a6a8a]`

## Content

### Levels (6)

| Level | Age line | Draft blurb |
|---|---|---|
| Tiny | Ages 2–5 | Thirty-minute classes built for the shortest attention spans — songs, shapes, and safe first tumbling. No experience needed. |
| Beginner | Ages 5+ | Where technique starts: positions, counts, and across-the-floor basics at a pace set for first-timers. |
| Intermediate | By placement | For dancers with a season or two behind them — longer combinations, faster corrections, more demanding choreography. |
| Advanced | By placement | Full combinations, refined technique, and performance-level choreography for dancers who train consistently. |
| Adult | Ages 16+ | Evening classes for grown dancers, whether it's your first class or your return after years away. |
| Specialty | Ages 5+ | Style-specific classes beyond the studio staples — Musical Theatre, Pom, and Cheer. |

### Styles (11)

"Adult Classes" is dropped from the 12-item `DANCE_STYLES` list used on the Classes
page: Adult is a level, not a style, and appears as a badge on Contemporary and
Pom & Cheer instead.

| Style | Level badges | Draft description |
|---|---|---|
| Ballet | Tiny · Beginner · Int/Adv | The foundation under every other style: alignment, turnout, and the vocabulary dancers carry into everything else. |
| Jazz | Beginner · Int/Adv | Sharp, upbeat, and musical — isolations, turns, and leaps set to current music. |
| Hip Hop | Tiny · Beginner · Int/Adv | Groove, rhythm, and attitude, with age-appropriate music and choreography at every level. |
| Contemporary | Beginner · Int/Adv · Adult | Movement built on breath and weight, borrowing from ballet and modern to tell a story. |
| Tap | Tiny · Beginner | Rhythm you can hear. Dancers build clean sounds and timing one step at a time. |
| Acro & Tumbling | Tiny · Beginner · Int/Adv | Strength, flexibility, and controlled tricks — rolls and cartwheels through to advanced skills, spotted and progressed safely. |
| Lyrical | Int/Adv | Ballet technique with contemporary freedom, danced to the lyrics of a song. |
| Breakdancing | Beginner | Toprock, footwork, and freezes — the athletic, foundational side of hip hop. |
| Musical Theatre | Specialty | Choreography paired with character and storytelling, drawn from stage repertoire. |
| Pom & Cheer | Specialty · Adult | Sharp motions, jumps, and team-style routines; good preparation for school squads. |
| Creative Movement | Tiny | Preschool-paced exploration of rhythm and coordination through imagination and play. |

### Badge vocabulary

Badges are drawn from a fixed set: `Tiny`, `Beginner`, `Intermediate/Advanced`,
`Adult`, `Specialty` — abbreviated `Int/Adv` in the style table above for width only;
the rendered badge reads "Intermediate/Advanced".
Intermediate and Advanced are deliberately one combined badge —
the Fall schedule does not distinguish them, so splitting them would require inventing
a level for each unlabeled row. The six level cards above still describe Intermediate
and Advanced separately, since the distinction is real even where the schedule is
silent on it.

### Copy constraints

All draft copy is generic to each art form. It makes no claim about Capital Core's
curriculum, instructors, placement process, or outcomes. Level badges were derived
from the Fall 2026 schedule in `Classes.jsx` and are checkable against the studio
flyer.

**Replacement is expected.** Chanel supplies the real per-style descriptions after
seeing the page live; the swap is an edit to the `STYLES` constant.

## SEO

```js
const CLASS_LEVELS_JSON_LD = [
  courseListSchema(STYLE_NAMES),
  simpleBreadcrumb('Class Levels', '/class-levels'),
]
```

`SEO` props: title naming levels and styles for Midlothian VA, description summarising
the six levels, `canonical="/class-levels"`.

## Testing

**`src/pages/ClassLevels.test.jsx`** (new)

- Renders the page heading "Class Levels"
- Renders all six level names with their age lines
- Renders all eleven style names
- Every style renders a non-empty description and at least one level badge
- Renders the link to `/classes` and the portal register CTA

**`src/components/Navbar.test.jsx`** (additions)

- Caret button exposes `aria-expanded` and reveals "Class Schedule" and "Class Levels"
- Escape closes the open menu
- `/class-levels` highlights the Classes parent
- Mobile menu includes the nested children
- The four existing tests continue to pass unchanged

Framework is already in place: Vitest + jsdom + Testing Library, `npm test`.

## Risks

| Risk | Mitigation |
|---|---|
| Dropdown is the first submenu in this Navbar — hover/focus/Escape/outside-click state is fiddly and the component is shared by every page | Keep state local to the Classes group; close on route change; cover with tests; verify in the browser at desktop and mobile widths |
| Level badges could contradict what the studio actually teaches | Derived from the Fall schedule and flagged for Chanel to confirm |
| Placeholder copy could reach parents if the page ships before real copy lands | Copy is generic and non-committal by design; the swap is one constant in one file |

## Working conventions

- Repo is on `master`. Per project convention, branch before implementation and do not
  commit or push without an explicit request.
- Restart the dev server after any build.
