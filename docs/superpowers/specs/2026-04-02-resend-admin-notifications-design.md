# Resend Admin Email Notifications — Design Spec
_Date: 2026-04-02_

## Overview

Add admin email notifications via Resend to all forms on the Capital Core Dance Studio website. When any form is submitted successfully, the studio admin receives an email with the submission details. Supabase remains the source of truth; email is best-effort and non-blocking.

## Architecture

One Vercel serverless function (`api/notify.js`) handles all form notifications. After a successful Supabase insert, the frontend POSTs form data + a `formType` identifier to `/api/notify`. The function builds a per-form email and sends it via Resend.

## Data Flow

1. User submits form
2. Frontend inserts to Supabase (existing behavior, unchanged)
3. On successful insert, frontend POSTs `{ formType, ...formData }` to `/api/notify`
4. Serverless function selects email template by `formType`, calls Resend
5. Admin receives notification email at `capitalcoredance@gmail.com`
6. If Resend fails: error is logged server-side, user sees success (data is safe in Supabase)

## Files

| File | Change |
|---|---|
| `api/notify.js` | New — Vercel serverless function, handles all form types |
| `src/pages/Contact.jsx` | Add notify call after successful Supabase insert |
| `src/pages/BirthdayForm.jsx` | Add notify call after successful Supabase insert |
| `vercel.json` | Exclude `/api/*` from SPA rewrite |

## Environment Variables

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | From Resend dashboard (regenerate — old key exposed) |
| `ADMIN_EMAIL` | `capitalcoredance@gmail.com` |
| `FROM_EMAIL` | `onboarding@resend.dev` (dev) → verified domain for production |

## Serverless Function Design (`api/notify.js`)

- Accepts POST only; returns 405 for other methods
- Reads `formType` from body to select email content
- Supported `formType` values: `contact`, `birthday`
- Builds plain HTML email summarizing all submitted fields
- Returns `200` on success, `500` on Resend error
- Never throws to the client — frontend treats any non-200 as silent failure

## Email Content

**Contact form** — Subject: `New Contact Form Submission`
Body: name, email, phone, interest, message

**Birthday form** — Subject: `New Birthday Party Booking Request`
Body: parent name, email, phone, birthday person name/age, date choices, time slot, guest count, theme, upgrades, food/allergies, referral, notes

## Future Forms

Any new form follows the same pattern: Supabase insert → POST to `/api/notify` with a new `formType`. Add a new case to `notify.js` with the email template. No other changes needed.

## Out of Scope

- Confirmation emails to submitters
- Email templates with HTML styling/branding
- Resend domain verification (manual step by client)
- Error surfacing to end users for email failures
