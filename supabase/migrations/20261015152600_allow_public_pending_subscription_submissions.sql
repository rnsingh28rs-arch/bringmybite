-- Allow customers to submit a new pending subscription without granting read access
-- to other customers' personal or payment information.
REVOKE ALL ON TABLE public.bmb_subscriptions FROM anon;
GRANT INSERT ON TABLE public.bmb_subscriptions TO anon;

DROP POLICY IF EXISTS bmb_public_submit_pending_subscription ON public.bmb_subscriptions;
CREATE POLICY bmb_public_submit_pending_subscription
ON public.bmb_subscriptions
FOR INSERT
TO anon
WITH CHECK (
  verification_status = 'Pending'
  AND active = true
  AND length(trim(coalesce(customer_name, ''))) BETWEEN 1 AND 120
  AND length(trim(coalesce(mobile_number, ''))) BETWEEN 10 AND 20
  AND length(trim(coalesce(whatsapp_number, ''))) BETWEEN 10 AND 20
  AND package_type IN ('VEG CLASSIC', 'EGG DELIGHT', 'NON-VEG CLUB')
  AND (
    (package_type = 'VEG CLASSIC' AND package_code = 'VC')
    OR (package_type = 'EGG DELIGHT' AND package_code = 'ED')
    OR (package_type = 'NON-VEG CLUB' AND package_code = 'NVC')
  )
  AND meal_preference IN ('Lunch Only', 'Dinner Only', 'Lunch + Dinner')
  AND (meal_preference <> 'Lunch Only' OR package_type = 'VEG CLASSIC')
  AND duration IN ('1 Month', '3 Months', '6 Months')
  AND monthly_price > 0
  AND amount_paid > 0
  AND length(trim(coalesce(transaction_id, ''))) BETWEEN 1 AND 128
  AND route_code ~ '^ROUTE-[0-9]{3}$'
  AND expiry_date >= start_date
  AND complimentary_sweets_earned_weeks = 0
  AND cardinality(bi_monthly_bonus_claimed) = 0
  AND reminder_sent_3_days = false
  AND renewed_count = 0
  AND executive_name IS NULL
  AND length(coalesce(custom_fields::text, '{}')) <= 8192
);
