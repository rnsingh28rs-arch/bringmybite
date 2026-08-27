-- Pricing values are whole rupee amounts only.
-- Keep these CMS values as integers so the frontend displays exactly what D-Admin saves.
ALTER TABLE public.bmb_pricing
  ALTER COLUMN value TYPE integer
  USING value::numeric::integer;
