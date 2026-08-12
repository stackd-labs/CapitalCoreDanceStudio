-- ─────────────────────────────────────────────────────────────────────────
-- Site → Portal intake webhooks (run in the WEBSITE Supabase project)
-- Project: ftoevxwdtznxzioljahd  (the public website's Supabase)
--
-- Purpose: POST every new public-form row to the dance studio portal's
-- intake receiver (POST /api/intake/from-site), so ALL submissions —
-- not just one table — show up in the portal's /intake inbox.
--
-- The portal already maps these 7 tables to intake form types; the only
-- gap is that the Supabase Database Webhook must exist on each table.
--
-- ── BEFORE RUNNING ────────────────────────────────────────────────────────
--  1. In the dashboard (Database → Webhooks), DELETE the single webhook you
--     added last week, so this block becomes the one source of truth and you
--     don't get duplicate intake rows on whichever table it covered.
--  2. Fill the two placeholders below:
--       • portal_url     — confirm the portal's production domain
--       • intake_secret  — the SITE_INTAKE_SECRET value from the PORTAL's
--                          Vercel env (server-only; paste it here, not to me)
--  3. Run this whole block in the WEBSITE project's SQL editor.
--
-- Re-runnable: drops and recreates the trigger on each table each time.
-- Requires the pg_net / supabase_functions extension (already enabled if you
-- created any webhook last week).
-- ─────────────────────────────────────────────────────────────────────────

do $$
declare
  portal_url    text := 'https://studio.capitalcoredance.com/api/intake/from-site';
  intake_secret text := '<<PASTE_SITE_INTAKE_SECRET_HERE>>';
  headers_json  text := json_build_object(
                          'Content-Type', 'application/json',
                          'x-intake-secret', intake_secret
                        )::text;
  tbl   text;
  tables text[] := array[
    'contact_submissions',
    'birthday_bookings',
    'camp_registrations',
    'summer_class_registrations',
    'recital_orders',
    'recital_shirt_orders',
    'adult_series_interest'
  ];
begin
  if intake_secret = '<<PASTE_SITE_INTAKE_SECRET_HERE>>' then
    raise exception 'Set intake_secret to the portal''s SITE_INTAKE_SECRET before running.';
  end if;

  foreach tbl in array tables loop
    execute format('drop trigger if exists zz_intake_webhook on public.%I;', tbl);
    execute format(
      'create trigger zz_intake_webhook after insert on public.%I '
      || 'for each row execute function supabase_functions.http_request(%L, %L, %L, %L, %L);',
      tbl,
      portal_url,
      'POST',
      headers_json,
      '{}',
      '5000'
    );
    raise notice 'intake webhook installed on public.%', tbl;
  end loop;
end $$;
