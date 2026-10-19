import { supabaseRpc, supabaseSelect } from '../cms/supabaseRest';
import { convertRecipeQuantity, normalizeInventoryUnit } from './inventoryUnits.mjs';
export { convertRecipeQuantity, normalizeInventoryUnit };

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


export interface InventoryGrnDetails {
  grnNumber:string;
  supplierName:string;
  supplierContact:string;
  supplierAddress:string;
  supplierGstin:string;
  invoiceNumber:string;
  invoiceDate:string;
  receivedDate:string;
  receivedBy:string;
  storeName:string;
  notes:string;
  quantity:number;
  unitCost:number;
  taxRate:number;
  idempotencyKey:string;
}

const normalizeIngredientName=(value:string)=>String(value||'').normalize('NFKC').trim().replace(/\\s+/g,' ').toLowerCase();

export async function recordApprovedInventoryPurchaseWithGrn(
  indent:any,
  inventory:any[],
  details:InventoryGrnDetails
) {
  const matches=(rows:any[])=>rows.find(item=>
    normalizeIngredientName(item.name)===normalizeIngredientName(indent.itemName)
    && normalizeInventoryUnit(item.unit)===normalizeInventoryUnit(indent.unit)
  );
  let matched=matches(inventory);
  if(!matched) {
    const fresh=await supabaseSelect<any>('bmb_inventory','select=id,name,unit,current_stock&order=name.asc');
    matched=matches(fresh);
  }
  let inventoryId=matched?.id;
  if(!inventoryId) {
    inventoryId=`INV-${Date.now()}`;
    await supabaseRpc('bmb_create_inventory_item_with_opening_balance',{
      p_id:inventoryId,
      p_name:String(indent.itemName).trim(),
      p_category:/rice|atta|dal|flour|grain|pulse/i.test(indent.itemName)?'Grains & Pulses':/oil|masala|spice|salt|sugar/i.test(indent.itemName)?'Spices & Oils':/chicken|egg|paneer|milk|poultry/i.test(indent.itemName)?'Dairy & Poultry':'Fresh Vegetables',
      p_opening_quantity:0,
      p_unit:indent.unit,
      p_min_threshold:0,
      p_cost_per_unit:details.unitCost,
      p_supplier:details.supplierName,
      p_last_restocked:null
    });
  }
  const result=await supabaseRpc<Record<string,any>>('bmb_receive_inventory_purchase_with_grn',{
    p_indent_id:indent.id,
    p_inventory_id:inventoryId,
    p_quantity:details.quantity,
    p_idempotency_key:details.idempotencyKey,
    p_grn_number:details.grnNumber,
    p_supplier_name:details.supplierName,
    p_supplier_contact:details.supplierContact,
    p_supplier_address:details.supplierAddress,
    p_supplier_gstin:details.supplierGstin,
    p_invoice_number:details.invoiceNumber,
    p_invoice_date:details.invoiceDate||null,
    p_received_date:details.receivedDate,
    p_received_by:details.receivedBy,
    p_store_name:details.storeName,
    p_notes:details.notes,
    p_unit_cost:details.unitCost,
    p_tax_rate:details.taxRate
  });
  return Array.isArray(result)?result[0]:result;
}
