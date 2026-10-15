ALTER TABLE public.bmb_inventory_movements
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);
