-- Keep customer order tracking available while rejecting malformed lookup inputs.
-- The function remains SECURITY DEFINER because customers do not have direct SELECT
-- access to order records; returned rows are constrained by order ID and phone suffix.
CREATE OR REPLACE FUNCTION public.bmb_get_order_status(p_order_id text, p_phone text)
RETURNS TABLE(id text, payment_status text, status text, details text, updated_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH supplied AS (
    SELECT
      NULLIF(trim(coalesce(p_order_id, '')), '') AS order_id,
      regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g') AS phone_digits
  )
  SELECT
    o.id,
    o.payment_status,
    o.status,
    o.details,
    o.updated_at
  FROM public.bmb_orders AS o
  CROSS JOIN supplied AS s
  WHERE s.order_id IS NOT NULL
    AND length(s.phone_digits) >= 10
    AND o.id = s.order_id
    AND length(regexp_replace(coalesce(o.phone, ''), '[^0-9]', '', 'g')) >= 10
    AND right(regexp_replace(coalesce(o.phone, ''), '[^0-9]', '', 'g'), 10)
        = right(s.phone_digits, 10)
  LIMIT 1;
$function$;

REVOKE ALL ON FUNCTION public.bmb_get_order_status(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bmb_get_order_status(text, text) TO anon, authenticated;
