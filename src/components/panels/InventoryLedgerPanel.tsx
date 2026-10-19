import React,{useEffect,useState} from 'react';
import {RefreshCw,History,ReceiptText,AlertTriangle} from 'lucide-react';
import {supabaseSelect} from '../../cms/supabaseRest';
import {useApp} from '../../context/AppContext';

const money=(value:number)=>`₹${Number(value||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const dateLabel=(value:string)=>value?new Date(value).toLocaleString('en-IN'):'—';

export const InventoryLedgerPanel:React.FC=()=>{
  const {inventory}=useApp();
  const [movements,setMovements]=useState<any[]>([]);
  const [receipts,setReceipts]=useState<any[]>([]);
  const [batches,setBatches]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState('');
  const load=async()=>{
    setLoading(true);setMessage('');
    try{
      const [movementRows,receiptRows,batchRows]=await Promise.all([
        supabaseSelect<any>('bmb_inventory_movements','select=*&order=created_at.desc&limit=100'),
        supabaseSelect<any>('bmb_inventory_receipts','select=*&order=created_at.desc&limit=100'),
        supabaseSelect<any>('bmb_inventory_consumption_batches','select=*&order=created_at.desc&limit=100')
      ]);
      setMovements(movementRows);setReceipts(receiptRows);setBatches(batchRows);
    }catch(e){setMessage(e instanceof Error?e.message:'Inventory history could not be loaded. Check staff access and refresh.');}
    finally{setLoading(false);}
  };
  useEffect(()=>{void load()},[]);
  return <div className="space-y-5">
    <div className="bg-white rounded-2xl border p-5 flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-black text-sm uppercase flex items-center gap-2"><History className="w-4 h-4"/> Inventory Movement Ledger</h2><p className="text-xs text-gray-500 mt-1">Latest 100 movements and 100 saved GRNs. Signed delta shows the stock change; balance after shows the resulting balance.</p></div>
      <button onClick={()=>void load()} disabled={loading} className="px-3 py-2 bg-gray-100 rounded-xl text-xs font-bold disabled:opacity-50"><RefreshCw className="inline w-3.5 h-3.5"/> {loading?'Loading…':'Refresh History'}</button>
    </div>
    {message&&<div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 font-bold"><AlertTriangle className="inline w-4 h-4 mr-1"/>{message}</div>}
    <div className="bg-white rounded-2xl border overflow-x-auto">
      <div className="p-4 border-b"><h3 className="font-black uppercase text-xs flex items-center gap-2"><History className="w-4 h-4"/> Stock Movements ({movements.length})</h3></div>
      <table className="w-full text-left text-xs"><thead><tr className="bg-gray-100"><th className="p-2">Date</th><th className="p-2">Ingredient</th><th className="p-2">Type / Source</th><th className="p-2">Quantity</th><th className="p-2">Stock Δ</th><th className="p-2">Balance After</th><th className="p-2">Reference / Notes</th></tr></thead><tbody>
        {movements.map(m=><tr key={m.id} className="border-b align-top"><td className="p-2 whitespace-nowrap">{dateLabel(m.created_at)}</td><td className="p-2 font-bold">{m.ingredient_name||m.inventory_id}<div className="text-[10px] text-gray-500">{m.unit}</div></td><td className="p-2"><b>{m.movement_type}</b><div className="text-[10px] text-gray-500">{m.source}</div></td><td className="p-2">{m.quantity} {m.unit}</td><td className="p-2 font-black">{m.quantity_delta==null?'—':`${Number(m.quantity_delta)>0?'+':''}${m.quantity_delta} ${m.unit}`}</td><td className="p-2 font-black">{m.balance_after==null?'Legacy / unavailable':`${m.balance_after} ${m.unit}`}</td><td className="p-2"><div>{m.reference_id||'—'}</div><div className="text-[10px] text-gray-500">{m.notes||''}</div></td></tr>)}
        {!loading&&movements.length===0&&<tr><td colSpan={7} className="p-5 text-center text-gray-500">No movement entries recorded yet. Current stock balances should be reconciled before inventing historical movements.</td></tr>}
      </tbody></table>
    </div>
    <div className="bg-white rounded-2xl border overflow-x-auto">
      <div className="p-4 border-b"><h3 className="font-black uppercase text-xs flex items-center gap-2"><ReceiptText className="w-4 h-4"/> Goods Received Notes ({receipts.length})</h3></div>
      <table className="w-full text-left text-xs"><thead><tr className="bg-gray-100"><th className="p-2">GRN / Date</th><th className="p-2">Ingredient</th><th className="p-2">Supplier / Invoice</th><th className="p-2">Received</th><th className="p-2">Unit Cost</th><th className="p-2">Tax</th><th className="p-2">Total</th></tr></thead><tbody>
        {receipts.map(r=><tr key={r.receipt_id} className="border-b align-top"><td className="p-2"><b>{r.grn_number}</b><div className="text-[10px] text-gray-500">{dateLabel(r.created_at)}</div></td><td className="p-2 font-bold">{inventory.find(i=>i.id===r.inventory_id)?.name||r.inventory_id}<div className="text-[10px] text-gray-500">Indent: {r.indent_id}</div></td><td className="p-2">{r.supplier_name}<div className="text-[10px] text-gray-500">Invoice: {r.invoice_number||'—'}</div></td><td className="p-2">{r.quantity} {r.unit}<div className="text-[10px] text-gray-500">Received by: {r.received_by}</div></td><td className="p-2">{money(r.unit_cost)} / {r.unit}</td><td className="p-2">{r.tax_rate}%<div className="text-[10px] text-gray-500">{money(r.tax_amount)}</div></td><td className="p-2 font-black">{money(r.total_amount)}</td></tr>)}
        {!loading&&receipts.length===0&&<tr><td colSpan={7} className="p-5 text-center text-gray-500">No GRNs saved yet.</td></tr>}
      </tbody></table>
    </div>
    <div className="bg-white rounded-2xl border overflow-x-auto">
      <div className="p-4 border-b"><h3 className="font-black uppercase text-xs flex items-center gap-2"><History className="w-4 h-4"/> Cooking Batches ({batches.length})</h3></div>
      <table className="w-full text-left text-xs"><thead><tr className="bg-gray-100"><th className="p-2">Batch ID / Date</th><th className="p-2">Package</th><th className="p-2">Meal / Day</th><th className="p-2">Actual Trays</th><th className="p-2">Ingredient Lines</th></tr></thead><tbody>
        {batches.map(b=><tr key={b.batch_id} className="border-b align-top"><td className="p-2"><b>{b.batch_id}</b><div className="text-[10px] text-gray-500">{dateLabel(b.created_at)}</div></td><td className="p-2">{b.package_type}</td><td className="p-2">{b.meal}<div className="text-[10px] text-gray-500">{b.service_day}</div></td><td className="p-2 font-black">{b.tray_count}</td><td className="p-2">{Array.isArray(b.items)?b.items.length:0}</td></tr>)}
        {!loading&&batches.length===0&&<tr><td colSpan={5} className="p-5 text-center text-gray-500">No cooking batches recorded yet.</td></tr>}
      </tbody></table>
    </div>
  </div>;
};
