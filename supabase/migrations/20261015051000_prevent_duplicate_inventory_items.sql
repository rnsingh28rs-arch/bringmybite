CREATE OR REPLACE FUNCTION public.bmb_prevent_duplicate_inventory_item()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.bmb_inventory i
    WHERE lower(regexp_replace(trim(i.name), E'\\s+', ' ', 'g'))
          = lower(regexp_replace(trim(NEW.name), E'\\s+', ' ', 'g'))
      AND lower(trim(i.unit)) = lower(trim(NEW.unit))
      AND (TG_OP='INSERT' OR i.id IS DISTINCT FROM NEW.id)
  ) THEN
    RAISE EXCEPTION 'An inventory item with this ingredient name and unit already exists. Use the existing item instead.';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS bmb_prevent_duplicate_inventory_item ON public.bmb_inventory;
CREATE TRIGGER bmb_prevent_duplicate_inventory_item
BEFORE INSERT OR UPDATE OF name, unit ON public.bmb_inventory
FOR EACH ROW EXECUTE FUNCTION public.bmb_prevent_duplicate_inventory_item();

REVOKE ALL ON FUNCTION public.bmb_prevent_duplicate_inventory_item() FROM PUBLIC, anon, authenticated;
