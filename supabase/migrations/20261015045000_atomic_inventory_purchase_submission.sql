-- Atomically submit approved chef indents for Admin payment approval.
CREATE OR REPLACE FUNCTION public.bmb_submit_inventory_purchase_request(
  p_request_id text,
  p_indent_ids text[]
)
RETURNS TABLE (request_id text, total_amount numeric, line_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_username text;
  v_indent public.bmb_chef_indents;
  v_count integer := 0;
  v_unique_count integer := 0;
  v_updated_count integer;
  v_line_total numeric;
  v_total numeric := 0;
BEGIN
  SELECT a.username INTO v_username
  FROM public.bmb_admin_users a
  WHERE a.user_id = auth.uid()::text
    AND a.active = true
    AND a.role_id IN ('manager','admin','ceo-director')
  LIMIT 1;

  IF v_username IS NULL THEN
    RAISE EXCEPTION 'Only an active Manager, Admin or D-Admin can submit purchase requests';
  END IF;

  IF p_request_id IS NULL OR trim(p_request_id) = '' THEN
    RAISE EXCEPTION 'Purchase request ID is required';
  END IF;

  IF p_indent_ids IS NULL OR cardinality(p_indent_ids) = 0 THEN
    RAISE EXCEPTION 'Select at least one approved stock request';
  END IF;

  SELECT count(DISTINCT x) INTO v_unique_count
  FROM unnest(p_indent_ids) AS x;

  IF v_unique_count <> cardinality(p_indent_ids) THEN
    RAISE EXCEPTION 'Duplicate stock request IDs were submitted';
  END IF;

  FOR v_indent IN
    SELECT i.*
    FROM public.bmb_chef_indents i
    WHERE i.id = ANY(p_indent_ids)
    ORDER BY i.id
    FOR UPDATE
  LOOP
    IF v_indent.status <> 'Approved' THEN
      RAISE EXCEPTION 'Stock request % must have Manager approval before payment submission', v_indent.id;
    END IF;

    IF v_indent.payment_status IN ('Pending Admin Approval','Approved')
       OR v_indent.payment_request_id IS NOT NULL THEN
      RAISE EXCEPTION 'Stock request % is already linked to a payment request', v_indent.id;
    END IF;

    IF v_indent.purchase_price IS NULL OR v_indent.purchase_price <= 0 THEN
      RAISE EXCEPTION 'Enter a valid purchase price for % before submitting', v_indent.item_name;
    END IF;

    IF v_indent.quantity_needed IS NULL OR v_indent.quantity_needed <= 0 THEN
      RAISE EXCEPTION 'Requested quantity must be greater than zero for %', v_indent.item_name;
    END IF;

    v_line_total := round(v_indent.quantity_needed * v_indent.purchase_price, 2);
    IF v_line_total <= 0 THEN
      RAISE EXCEPTION 'Purchase total must be greater than zero for %', v_indent.item_name;
    END IF;

    v_total := v_total + v_line_total;
    v_count := v_count + 1;
  END LOOP;

  IF v_count <> cardinality(p_indent_ids) THEN
    RAISE EXCEPTION 'One or more selected stock requests could not be found';
  END IF;

  INSERT INTO public.bmb_inventory_purchase_requests(
    id,total_amount,status,requested_by,requested_at,created_at,updated_at
  ) VALUES (
    p_request_id,round(v_total,2),'Pending Admin Approval',v_username,now(),now(),now()
  );

  INSERT INTO public.bmb_inventory_purchase_request_lines(
    request_id,indent_id,item_name,quantity,unit,purchase_price,line_total
  )
  SELECT p_request_id,i.id,i.item_name,i.quantity_needed,i.unit,i.purchase_price,
         round(i.quantity_needed*i.purchase_price,2)
  FROM public.bmb_chef_indents i
  WHERE i.id = ANY(p_indent_ids);

  UPDATE public.bmb_chef_indents
  SET payment_request_id = p_request_id,
      payment_status = 'Pending Admin Approval',
      updated_at = now()
  WHERE id = ANY(p_indent_ids);

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  IF v_updated_count <> v_count THEN
    RAISE EXCEPTION 'Not all stock requests were linked to the payment request';
  END IF;

  RETURN QUERY SELECT p_request_id,round(v_total,2),v_count;
END;
$function$;

REVOKE ALL ON FUNCTION public.bmb_submit_inventory_purchase_request(text,text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bmb_submit_inventory_purchase_request(text,text[]) TO authenticated;
