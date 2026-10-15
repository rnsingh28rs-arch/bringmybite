-- Fix mutable search_path warnings on non-security-definer subscription and trigger functions.
ALTER FUNCTION public.bmb_set_updated_at() SET search_path TO public, pg_temp;
ALTER FUNCTION public.bmb_generate_subscription_receipt_number() SET search_path TO public, pg_temp;
ALTER FUNCTION public.bmb_subscription_receipt_fields() SET search_path TO public, pg_temp;
ALTER FUNCTION public.bmb_extend_subscription(text, integer, text, text, text) SET search_path TO public, pg_temp;
ALTER FUNCTION public.bmb_approve_subscription(text, text, text) SET search_path TO public, pg_temp;
ALTER FUNCTION public.bmb_normalize_subscription_plan_rate() SET search_path TO public, pg_temp;
