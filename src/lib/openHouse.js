// The Little Movers Open House, Wednesday 2 September 2026.
//
// Event detail is stated once here rather than in the two pages that render it, so the
// date cannot be right on /little-movers and wrong on the home page.
//
// SELF-EXPIRING, and that is the point of this file. Both call sites are wrapped in
// isOpenHouseUpcoming(), so the moment the event ends they render nothing at all. No
// deploy is needed to take the promotion down and there is no dated banner left up to go
// stale. The check runs in the visitor's browser on every render, so a tab left open
// across the event drops the banner on its next navigation.
//
// The cutoff is an ABSOLUTE instant, not a local calendar day: 11:00 AM EDT is 15:00 UTC,
// so the banner turns off at the same real-world moment for a parent in Midlothian and
// one in Seattle. A local-midnight boundary would have left it up for another three hours
// on the west coast, advertising an event that had already finished.
//
// Uses the event's END, not its start: a parent reading the page at 10:15 on the day is
// still forty-five minutes from the doors closing, and the studio would rather they walked
// in late than saw nothing.
//
// AFTER THE EVENT: this file and its two call sites can be deleted outright. Nothing else
// imports it. Until then it costs one date comparison per render.
export const OPEN_HOUSE_ENDS_AT = new Date('2026-09-02T11:00:00-04:00')

// True while the open house is still worth promoting. `now` is injectable so the tests can
// stand either side of the cutoff without touching the system clock.
export function isOpenHouseUpcoming(now = new Date()) {
  return now.getTime() < OPEN_HOUSE_ENDS_AT.getTime()
}

// Straight from the studio's flyer. `formUrl` is the portal's public interest form: it
// needs no login and takes no payment, which is why the copy below can promise both.
export const OPEN_HOUSE = {
  formUrl: 'https://studio.capitalcoredance.com/register/little-movers-open-house',
  date: 'Wednesday, September 2',
  time: '10:00 – 11:00 AM',
  // The flyer's own words for the session, kept verbatim. "Miss Ryan" here rather than the
  // "Ms. Ryan" the Little Movers class list uses, because this is the flyer's spelling and
  // the studio has not picked one.
  headline: "Moovin' & Groovin' with Miss Ryan",
  runOfShow: [
    { time: '10:00 – 10:30', what: "Welcome & Moovin' & Groovin' with Miss Ryan" },
    { time: '10:30 – 10:40', what: 'Tiny Tumble' },
    { time: '10:40 – 10:50', what: 'Sensory Play' },
    { time: '10:50 – 11:00', what: 'Free Play' },
  ],
  whileYoureThere: [
    'Meet our team',
    'Tour the studio',
    'Try fun activities',
    'Ask us anything',
  ],
}
