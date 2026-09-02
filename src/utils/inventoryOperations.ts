import { supabaseRpc } from '../cms/supabaseRest';

export const recordInventoryReceipt = (inventoryId:string, quantity:number, source='Manager Receipt') => supabaseRpc('bmb_record_inventory_movement',{p_inventory_id:inventoryId,p_quantity:quantity,p_movement_type:'RECEIPT',p_source:source});
export const recordInventoryConsumption = (inventoryId:string, quantity:number, source='Chef Cooking', referenceId?:string, notes?:string) => supabaseRpc('bmb_record_inventory_movement',{p_inventory_id:inventoryId,p_quantity:quantity,p_movement_type:'CONSUMPTION',p_source:source,p_reference_id:referenceId,p_notes:notes});
export const recordInventoryAdjustment = (inventoryId:string, newQuantity:number, source='Manager Adjustment') => supabaseRpc('bmb_record_inventory_movement',{p_inventory_id:inventoryId,p_quantity:newQuantity,p_movement_type:'ADJUSTMENT',p_source:source});

export function convertRecipeQuantity(quantity:number, fromUnit:string, toUnit:string){
 const f=fromUnit.toLowerCase(),t=toUnit.toLowerCase(); if(f===t)return quantity;
 if(f==='grams'&&t==='kg')return quantity/1000; if(f==='kg'&&t==='grams')return quantity*1000;
 if(f==='liters'&&t==='litres')return quantity; if(f==='litres'&&t==='liters')return quantity;
 return null;
}
