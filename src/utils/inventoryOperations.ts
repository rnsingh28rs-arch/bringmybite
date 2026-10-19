import { supabaseRpc } from '../cms/supabaseRest';
import { convertRecipeQuantity } from './inventoryUnits.mjs';
export { convertRecipeQuantity } from './inventoryUnits.mjs';

export const recordInventoryReceipt = (
  inventoryId:string,
  quantity:number,
  source='Manager Receipt',
  referenceId?:string,
  notes?:string
) => supabaseRpc('bmb_record_inventory_movement',{
  p_inventory_id:inventoryId,
  p_quantity:quantity,
  p_movement_type:'RECEIPT',
  p_source:source,
  p_reference_id:referenceId,
  p_notes:notes
});

export const recordApprovedInventoryPurchaseReceipt = (
  indentId:string,
  inventoryId:string,
  quantity:number
) => supabaseRpc<Record<string,any>>('bmb_receive_inventory_purchase',{
  p_indent_id:indentId,
  p_inventory_id:inventoryId,
  p_quantity:quantity
});

export const recordInventoryConsumption = (
  inventoryId:string,
  quantity:number,
  source='Chef Cooking',
  referenceId?:string,
  notes?:string
) => supabaseRpc('bmb_record_inventory_movement',{
  p_inventory_id:inventoryId,
  p_quantity:quantity,
  p_movement_type:'CONSUMPTION',
  p_source:source,
  p_reference_id:referenceId,
  p_notes:notes
});

export const recordInventoryAdjustment = (
  inventoryId:string,
  newQuantity:number,
  source='Manager Adjustment'
) => supabaseRpc('bmb_record_inventory_movement',{
  p_inventory_id:inventoryId,
  p_quantity:newQuantity,
  p_movement_type:'ADJUSTMENT',
  p_source:source
});

