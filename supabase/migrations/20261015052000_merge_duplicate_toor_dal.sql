-- Merge the legacy case-only Toor Dal duplicate without changing recorded stock.
-- If already merged, this is a no-op. If either row has movement history or a non-zero duplicate,
-- stop rather than silently changing the stock ledger.
DO $block$
DECLARE
  v_keep public.bmb_inventory;
  v_drop public.bmb_inventory;
  v_count integer;
  v_movements integer;
BEGIN
  SELECT count(*) INTO v_count
  FROM public.bmb_inventory
  WHERE lower(regexp_replace(trim(name), E'\\s+', ' ', 'g'))='toor dal'
    AND lower(trim(unit))='kg';

  IF v_count = 1 THEN
    RETURN;
  END IF;

  IF v_count <> 2 THEN
    RAISE EXCEPTION 'Expected one or two Toor Dal kg rows; found %',v_count;
  END IF;

  SELECT * INTO v_keep FROM public.bmb_inventory
  WHERE lower(regexp_replace(trim(name), E'\\s+', ' ', 'g'))='toor dal'
    AND lower(trim(unit))='kg' AND current_stock>0
  ORDER BY current_stock DESC LIMIT 1 FOR UPDATE;

  SELECT * INTO v_drop FROM public.bmb_inventory
  WHERE lower(regexp_replace(trim(name), E'\\s+', ' ', 'g'))='toor dal'
    AND lower(trim(unit))='kg' AND current_stock=0
  ORDER BY id LIMIT 1 FOR UPDATE;

  IF v_keep.id IS NULL OR v_drop.id IS NULL THEN
    RAISE EXCEPTION 'Duplicate rows do not match the expected one-stocked/one-empty shape';
  END IF;

  SELECT count(*) INTO v_movements FROM public.bmb_inventory_movements
  WHERE inventory_id IN (v_keep.id,v_drop.id);
  IF v_movements>0 THEN
    RAISE EXCEPTION 'Movement history exists; do not merge automatically';
  END IF;

  DELETE FROM public.bmb_inventory WHERE id=v_drop.id;

  UPDATE public.bmb_inventory
  SET name='Toor Dal',
      cost_per_unit=CASE WHEN COALESCE(cost_per_unit,0)<=0 THEN COALESCE(v_drop.cost_per_unit,0) ELSE cost_per_unit END,
      last_restocked=COALESCE(last_restocked,v_drop.last_restocked),
      status=CASE WHEN current_stock<=0 THEN 'Critical' WHEN current_stock<=COALESCE(min_threshold,0) THEN 'Low Stock' ELSE 'In Stock' END,
      updated_at=now()
  WHERE id=v_keep.id;
END;
$block$;
