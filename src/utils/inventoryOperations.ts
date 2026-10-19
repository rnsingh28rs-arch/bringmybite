import { supabaseRpc } from '../cms/supabaseRest';
import { convertRecipeQuantity } from './inventoryUnits.mjs';
export { convertRecipeQuantity, normalizeInventoryUnit } from './inventoryUnits.mjs';

export function createInventoryIdempotencyKey(prefix='inventory') {
  const token = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}:${token}`;
}

export const recordInventoryReceipt = (
  inventoryId:string,
  quantity:number,
  source='Manager Receipt',
  referenceId?:string,
  notes?:string,
  idempotencyKey=createInventoryIdempotencyKey('receipt')
) => supabaseRpc('bmb_record_inventory_movement_idempotent',{
  p_inventory_id:inventoryId,
  p_quantity:quantity,
  p_movement_type:'RECEIPT',
  p_source:source,
  p_reference_id:referenceId,
  p_notes:notes,
  p_idempotency_key:idempotencyKey
});

export const recordApprovedInventoryPurchaseReceipt = (
  indentId:string,
  inventoryId:string,
  quantity:number,
  idempotencyKey=createInventoryIdempotencyKey('purchase-receipt')
) => supabaseRpc<Record<string,any>>('bmb_receive_inventory_purchase_idempotent',{
  p_indent_id:indentId,
  p_inventory_id:inventoryId,
  p_quantity:quantity,
  p_idempotency_key:idempotencyKey
});

export const recordInventoryConsumption = (
  inventoryId:string,
  quantity:number,
  source='Chef Cooking',
  referenceId?:string,
  notes?:string,
  idempotencyKey=createInventoryIdempotencyKey('consumption')
) => supabaseRpc('bmb_record_inventory_movement_idempotent',{
  p_inventory_id:inventoryId,
  p_quantity:quantity,
  p_movement_type:'CONSUMPTION',
  p_source:source,
  p_reference_id:referenceId,
  p_notes:notes,
  p_idempotency_key:idempotencyKey
});

export const recordInventoryAdjustment = (
  inventoryId:string,
  newQuantity:number,
  source='Manager Adjustment',
  referenceId?:string,
  notes?:string,
  idempotencyKey=createInventoryIdempotencyKey('adjustment')
) => supabaseRpc('bmb_record_inventory_movement_idempotent',{
  p_inventory_id:inventoryId,
  p_quantity:newQuantity,
  p_movement_type:'ADJUSTMENT',
  p_source:source,
  p_reference_id:referenceId,
  p_notes:notes,
  p_idempotency_key:idempotencyKey
});
