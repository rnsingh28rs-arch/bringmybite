import React, { useMemo, useState } from 'react';
import { Calculator, X, RotateCcw } from 'lucide-react';

export const CalculatorWidget: React.FC = () => {
  const [open,setOpen]=useState(false);
  const [expr,setExpr]=useState('');
  const [gst,setGst]=useState(18);
  const [gstEnabled,setGstEnabled]=useState(false);
  const result = useMemo(()=>{
    if(!expr.trim()) return '';
    try {
      if(!/^[0-9+\-*/().%\s]+$/.test(expr)) return 'Invalid';
      // Calculator is intentionally restricted to arithmetic characters only.
      const value = Function(`"use strict"; return (${expr})`)();
      return Number.isFinite(value) ? String(value) : 'Invalid';
    } catch { return 'Invalid'; }
  },[expr]);
  const numeric=Number(result);
  const gstAmount=gstEnabled && Number.isFinite(numeric) ? numeric*gst/100 : 0;
  const total=gstEnabled && Number.isFinite(numeric) ? numeric+gstAmount : numeric;
  return <>
    <button onClick={()=>setOpen(true)} className="fixed bottom-5 right-5 z-[90] w-12 h-12 rounded-full bg-[#124E33] text-white shadow-xl flex items-center justify-center hover:bg-[#0A2A1B]" title="Calculator"><Calculator className="w-5 h-5"/></button>
    {open && <div className="fixed inset-0 z-[120] bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={()=>setOpen(false)}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-5" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between"><h3 className="font-black text-[#124E33] flex items-center gap-2"><Calculator className="w-5 h-5"/> Business Calculator</h3><button onClick={()=>setOpen(false)}><X/></button></div>
        <input className="w-full mt-4 rounded-xl border border-gray-200 p-3 text-right text-xl font-black" value={expr} onChange={e=>setExpr(e.target.value)} placeholder="e.g. 20*80+5%"/>
        <div className="grid grid-cols-4 gap-2 mt-3">{['7','8','9','/','4','5','6','*','1','2','3','-','0','.','%','+'].map(k=><button key={k} onClick={()=>setExpr(x=>x+k)} className="rounded-xl bg-gray-100 py-3 font-bold hover:bg-gray-200">{k}</button>)}</div>
        <div className="flex gap-2 mt-3"><button onClick={()=>setExpr('')} className="flex-1 rounded-xl bg-gray-100 py-2 font-bold flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4"/>Clear</button><button onClick={()=>setExpr(result)} className="flex-1 rounded-xl bg-[#124E33] text-white py-2 font-bold">Use Result</button></div>
        <div className="mt-4 rounded-xl bg-emerald-50 p-3"><div className="text-xs text-gray-500">Result</div><div className="text-2xl font-black text-[#124E33]">{result || '0'}</div></div>
        <label className="flex items-center gap-2 mt-4 text-sm font-bold"><input type="checkbox" checked={gstEnabled} onChange={e=>setGstEnabled(e.target.checked)}/> Add GST</label>
        {gstEnabled && <div className="grid grid-cols-2 gap-2 mt-2"><label className="text-xs font-bold">GST %<input type="number" className="w-full rounded-xl border p-2 mt-1" value={gst} onChange={e=>setGst(Number(e.target.value))}/></label><div className="text-xs font-bold">GST Amount<div className="mt-1 rounded-xl bg-gray-50 p-2">₹{gstAmount.toFixed(2)}</div></div><div className="col-span-2 text-sm font-black">Grand Total: ₹{Number.isFinite(total)?total.toFixed(2):'0.00'}</div></div>}
      </div>
    </div>}
  </>;
};
