# Interactive Class Calendar — Design

**Date:** 2026-08-03
**Project:** capitalcoredancewebsite (Vite 8 · React 19 · Tailwind 3 · Vitest 4)
**Status:** Approved, pending implementation plan

## Problem

`/classes` renders the Fall 2026 schedule as five day-grouped lists of rows. A parent
comparing two classes has to read prose and hold times in their head; nothing shows that
Acro / Lyrical runs an hour while Pom Cheer runs thirty minutes, or that two classes run
at 5:30 on Monday. Registration is a single page-level button — a parent who has decided
on one specific class gets no path from that class to signing up for it.

## Goal

Replace the day-grouped list with an interactive week calendar: classes positioned by
time of day, blocks sized by duration, concurrent classes side by side, and a tap on any
class opening its details with a route to registration.

## Decisions

| Decision | Choice | Rejected alternatives |
|---|---|---|
| Register action | Detail panel with a Register for Fall button to the portal | Deep-link straight to the portal; build `?class=` preselect in dancestudioportal |
| Mobile | Week grid ≥768px; today's day-grouped list below that | Horizontally scrollable grid everywhere; day-tabbed single-column grid |
| Filters | Keep Age Group + Dance Style; drop Day | Keep all three; dim non-matching instead of hiding |
| Class copy | Extract to a shared `classInfo` module consumed by all three pages | Duplicate descriptions into the schedule; panel without descriptions |

### Why no per-class registration link

The portal's `/register/classes` renders all 22 classes as React-controlled checkboxes
with no `id`, `name`, or `value` attribute, and no evidence of URL-parameter handling.
There is nothing for a link to target. Preselecting a class would require a change in
the `dancestudioportal` project. Out of scope here; the panel's button goes to the
portal's register page as the existing CTAs do.

## The name mismatch this surfaces

The schedule and the class copy do not agree on names. Nine of the 22 rows differ:

| Schedule row (`Classes.jsx`, flyer-verbatim) | Copy (`ClassLevels.jsx` / `AdultClasses.jsx`) |
|---|---|
| Tiny Ballet / Tumble | Tiny Ballet & Tumble |
| Beginner Acro / Jazz | Beginner Acro & Jazz |
| Beginner Contemp / Jazz | Beginner Contemporary & Jazz |
| Acro / Lyrical | Acro & Lyrical |
| Ballet / Contemp | Ballet & Contemporary |
| Adult Femme / Flaire | Adult Femme Flair |
| Tiny Ballet / Hip Hop | Tiny Ballet & Hip Hop |
| Beginner Ballet / Hip Hop, / Jazz, / Tap, / Modern | Beginner Ballet & Hip Hop, & Jazz, & Tap, & Modern |
| Lyrical / Contemp | Lyrical & Contemporary |

Matching by display name is therefore impossible. Each schedule row gains an explicit
`infoKey` naming its entry in the shared module. The flyer-verbatim `name` still renders
everywhere it renders today — `infoKey` is a lookup key, not display text.

## Architecture

| File | Status | Responsibility |
|---|---|---|
| `src/lib/classInfo.js` | Create | `CLASS_INFO` map (21 entries: key → `{ audience, description }`) and `getClassInfo(key)`. Single source of truth for class copy. |
| `src/components/ClassCalendar.jsx` | Create | Week grid (≥md) and day list (<md); owns selected-class state; renders blocks as buttons |
| `src/components/ClassDetailPanel.jsx` | Create | The detail panel: content, Escape-to-close, focus return |
| `src/pages/Classes.jsx` | Modify | Adds `start`/`end` + `infoKey` to `SCHEDULE`; drops the Day filter; renders `ClassCalendar` instead of the inline day lists |
| `src/pages/ClassLevels.jsx` | Modify | Reads descriptions from `classInfo` instead of holding its own |
| `src/pages/AdultClasses.jsx` | Modify | Same |

`Classes.jsx` keeps `SEO`, `PageHeader`, hero photos, the register banner, the filter
bar, and the footer note. The calendar is a component because the grid, the mobile list,
and the panel together are more than that page should carry.

### Copy ownership after the refactor

`classInfo.js` owns `audience`, `description`, and the `draft` flag for all 21 distinct
classes. The `draft` flag marks the three descriptions written in-house rather than by
the studio (`Beginner Hip Hop`, `Tumble`, `Lyrical & Contemporary`) and must move with
the prose it annotates, not be left behind in `ClassLevels.jsx`.

The pages own their own structure: `ClassLevels.jsx` keeps its four-group ordering, its
group age lines and intros, and its `Important Information` notes; `AdultClasses.jsx`
keeps day/time and `Good to know`. After the refactor each page's group data lists
`infoKey`s, and prose is resolved through `getClassInfo`. Both pages have tests that will
fail loudly if a lookup breaks.

## Schedule data changes

Each of the 22 rows gains three fields. `time` (display) is unchanged.

```js
{
  name: 'Beginner Acro / Jazz',        // unchanged, flyer-verbatim
  time: '5:30 – 6:15 PM',              // unchanged, display only
  start: '17:30',                       // new — 24h, for positioning
  end: '18:15',                         // new
  infoKey: 'Beginner Acro & Jazz',      // new — lookup into CLASS_INFO
  ages: 'Ages 5+ · Beginner',          // unchanged
  ageGroups: ['kids', 'teen'],         // unchanged
  category: 'jazz-acro',               // unchanged
}
```

Explicit `start`/`end` rather than parsing `time`: every row's display string omits the
meridiem except at the end (`'5:30 – 6:15 PM'`), so parsing means inferring PM. An
explicit field is unambiguous and testable, and leaves the flyer text alone.

All 22 rows fall on 15-minute boundaries, earliest 17:00, latest 21:00.

## Grid mechanics

- Window 17:00–21:00. 16 rows of 15 minutes. CSS grid, `grid-template-rows`.
- A block spans `(end - start) / 15` rows starting at `(start - 17:00) / 15 + 1`, so
  height encodes duration.
- Time gutter labels every 30 minutes (5:00, 5:30, … 9:00).
- Five day columns, Monday–Friday.
- **Overlaps:** within a day, classes are grouped into overlapping clusters and each
  cluster's members render as equal-width sub-columns. Only Monday has overlaps in Fall
  2026 — `5:30–6:15` (Beginner Acro / Jazz + Beginner Contemp / Jazz) and `6:15` where
  Beginner Hip Hop (to 7:00) sits beside Acro / Lyrical (to 7:15). The clustering is
  general, not special-cased to two.
- Block colour comes from `category` so a style keeps one colour across the week, drawn
  from the existing accents (`brand-red`, `#7ab3e8`, `#f4a8b4`, `#f4a060`).
- Empty cells render as background; no filler text.

## Interaction and accessibility

- Every block is a `<button>` with an accessible name of `"<name>, <day> <time>"`, so
  the calendar is keyboard-navigable in day order via Tab.
- Activating a block opens `ClassDetailPanel` with: name, day, time, `ages`, the
  `audience` line and description from `classInfo`, a **Register for Fall →** button to
  `https://studio.capitalcoredance.com/register/classes` (new tab), and Close.
- Escape closes the panel and returns focus to the originating block. Clicking the
  backdrop closes it. This mirrors the Navbar dropdown, where focus loss to `<body>` was
  a real defect worth not repeating.
- The panel is rendered with `role="dialog"` and `aria-modal="true"`, labelled by the
  class name heading.
- No JavaScript alerts or native dialogs.

## Filters

The sticky bar keeps Age Group and Dance Style, using the existing `AGES` and
`CATEGORIES` options and the existing `FilterSelect` component. The Day dropdown and
`selectedDay` state are removed — a week view already shows every day.

Non-matching classes are hidden. The grid keeps its full time range regardless, so rows
do not jump as filters change. When a filter combination matches nothing, the existing
empty-state message shows in place of the grid.

## Mobile (<768px)

The day-grouped list is preserved as it renders today — day heading, rule, one card per
class with name, ages, and time — with each card now a button opening the same panel.
This is the layout already verified at 390px, so mobile parents lose nothing.

The Age and Style filters apply to the mobile list exactly as they do to the grid; a day
whose classes are all filtered out drops its heading rather than showing an empty group,
which is how the page behaves today.

## Testing

**`classInfo.test.js`**
- Every `infoKey` in `SCHEDULE` resolves to an entry with a non-empty description
  (this is the permanent guard against the `/` vs `&` mismatch)
- Every `CLASS_INFO` entry is referenced by at least one schedule row — catches copy
  going stale after a schedule change
- `getClassInfo` on an unknown key returns undefined rather than throwing

**`ClassCalendar.test.jsx`**
- Renders a block for all 22 rows at desktop and in the mobile list
- Block row-span reflects duration: Acro / Lyrical (60 min) spans 4 rows, Tiny Ballet /
  Tumble (30 min) spans 2
- Monday's `5:30` pair renders as two sibling blocks in the same cluster, not one
  overlapping the other
- Age and Style filters reduce the rendered set; an empty combination shows the
  empty-state message
- Each block's accessible name includes its day and time

**`ClassDetailPanel.test.jsx`**
- Opens with the clicked class's name, time, ages, and description
- Register button points at the portal URL with `target="_blank"`
- Escape closes it and focus returns to the originating block
- Backdrop click closes it

**Existing tests**
- `Classes.test.jsx`: the `day filter shows only selected day` test is removed with the
  Day dropdown; the combobox-count assertion drops from 3 to 2. Class-name and
  Enroll-CTA assertions stay.
- `ClassLevels.test.jsx` and `AdultClasses.test.jsx` must pass unchanged after the
  `classInfo` refactor — that is the check that no copy was lost in the move.

## Out of scope

- Any change to `dancestudioportal`, including `?class=` preselect support
- The class names on the flyer-verbatim schedule; `infoKey` is additive
- Month view, week navigation, or dates — these classes recur weekly for a fixed
  semester, so a single canonical week is the whole model
- `src/lib/schema.js`
- The 2 pre-existing `Camps.test.jsx` failures

## Risks

| Risk | Mitigation |
|---|---|
| Replaces a working page; a broken grid costs registrations during Fall enrollment | Browser verification at desktop and 390px before merge, including Monday's overlaps sitting side by side; mobile list is the already-verified existing layout |
| The `classInfo` refactor touches two pages that shipped hours ago | Both have full test coverage; those suites passing unchanged is the acceptance criterion |
| `start`/`end` can drift from the `time` display string | A test asserts each row's `start`/`end` is consistent with its `time` string |
| Semester rollover means editing times in two fields per row | Both live on the same object, one line apart, with `time` first |

## Working conventions

- Branch before implementation; do not commit or push without an explicit request.
- Suite baseline: 2 pre-existing `Camps.test.jsx` failures and nothing else.
- `npx vitest run` — never bare `npm test` (watch mode).
