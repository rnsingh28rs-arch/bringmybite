import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PackageType } from '../../types';
import {
  ChefHat,
  Flame,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  Package,
  Plus,
  Clock,
  ArrowRight,
  TrendingUp,
  Utensils,
  Sparkles
} from 'lucide-react';

export const ChefPanel: React.FC = () => {
  const {
    inventory,
    subscriptions,
    instantOrders,
    chefIndents,
    addChefIndent,
    vegMenu,
    eggMenu,
    nonVegMenu,
    updateInstantOrderStatus
  } = useApp();

  const [activeSubPanel, setActiveSubPanel] = useState<'cooking_alerts' | 'ingredient_indent'>('cooking_alerts');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedMealType, setSelectedMealType] = useState<'lunch' | 'dinner'>('lunch');

  // Indent Form State
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [urgency, setUrgency] = useState<'Urgent' | 'Regular' | 'Low Stock'>('Urgent');
  const [notes, setNotes] = useState('');
  const [indentSuccessMsg, setIndentSuccessMsg] = useState('');

  // Calculations for Today's Cooking
  const activeSubsCount = subscriptions.filter((s) => s.status === 'Active').length;
  const vegSubs = subscriptions.filter((s) => s.packageType === 'VEG CLASSIC' && s.status === 'Active').length;
  const eggSubs = subscriptions.filter((s) => s.packageType === 'EGG DELIGHT' && s.status === 'Active').length;
  const nonVegSubs = subscriptions.filter((s) => s.packageType === 'NON-VEG CLUB' && s.status === 'Active').length;

  const todayInstantVeg = instantOrders.filter((o) => o.thaliType === 'veg').reduce((a, b) => a + b.quantity, 0);
  const todayInstantEgg = instantOrders.filter((o) => o.thaliType === 'egg').reduce((a, b) => a + b.quantity, 0);
  const todayInstantNonVeg = instantOrders.filter((o) => o.thaliType === 'non-veg').reduce((a, b) => a + b.quantity, 0);

  const totalVegToCook = vegSubs + todayInstantVeg;
  const totalEggToCook = eggSubs + todayInstantEgg;
  const totalNonVegToCook = nonVegSubs + todayInstantNonVeg;
  const grandTotalThalis = totalVegToCook + totalEggToCook + totalNonVegToCook;

  // Inventory Low Stock Alerts
  const lowStockItems = inventory.filter((item) => item.quantity <= item.reorderThreshold);

  // Menu items for selected day
  const currentVegSchedule = vegMenu.find((m) => m.day === selectedDay);
  const currentEggSchedule = eggMenu.find((m) => m.day === selectedDay);
  const currentNonVegSchedule = nonVegMenu.find((m) => m.day === selectedDay);

  const handleCreateIndent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientName.trim() || !quantity) return;

    addChefIndent({
      ingredientName,
      quantity: Number(quantity),
      unit,
      urgency,
      notes: notes || undefined,
      status: 'Pending'
    });

    setIngredientName('');
    setQuantity('');
    setNotes('');
    setIndentSuccessMsg('Indent submitted to Kitchen Manager successfully!');
    setTimeout(() => setIndentSuccessMsg(''), 4000);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Chef Panel Top Header */}
        <div className="bg-[#124E33] text-white p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4 border-b-4 border-[#C88A24]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#C88A24] text-black flex items-center justify-center font-black shadow-xs">
              <ChefHat className="w-7 h-7 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-800 px-2 py-0.5 rounded text-emerald-200">
                  Kitchen Operational Hub
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif-title tracking-tight">
                Chef Kitchen Operations & Indents
              </h1>
              <p className="text-xs text-emerald-200">
                Central Cloud Kitchen • Shree Foods • Live Batch Counter
              </p>
            </div>
          </div>

          {/* Sub-Panel Switcher Buttons (2 Sub-Panels Requested) */}
          <div className="flex items-center bg-[#0C3822] p-1.5 rounded-xl border border-emerald-800 gap-1.5">
            <button
              onClick={() => setActiveSubPanel('cooking_alerts')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubPanel === 'cooking_alerts'
                  ? 'bg-[#C88A24] text-black shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Sub-Panel 1: Cooking & Alerts</span>
            </button>

            <button
              onClick={() => setActiveSubPanel('ingredient_indent')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubPanel === 'ingredient_indent'
                  ? 'bg-[#C88A24] text-black shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Sub-Panel 2: Indent Ingredients</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-PANEL 1: COOKING ALERTS, FULL MENU & PRODUCTION REQUIREMENTS */}
        {/* ========================================================================= */}
        {activeSubPanel === 'cooking_alerts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Stat Cards: What to cook & Order counts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-gray-500 block">Total Meals to Prep Today</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-black text-[#124E33]">{grandTotalThalis}</span>
                  <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {activeSubsCount} Subs + {todayInstantVeg + todayInstantEgg + todayInstantNonVeg} Instant
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-gray-500">Includes both College & Office Gate dispatches.</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">🥗 Veg Classic Trays</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-black text-emerald-700">{totalVegToCook}</span>
                  <span className="text-xs text-gray-500 font-semibold">{vegSubs} subs | {todayInstantVeg} instant</span>
                </div>
                <div className="mt-2 text-[11px] text-emerald-900 font-medium">100% Pure Veg 5CP Partition</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-amber-800 block">🥚 Egg Delight Trays</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-black text-amber-700">{totalEggToCook}</span>
                  <span className="text-xs text-gray-500 font-semibold">{eggSubs} subs | {todayInstantEgg} instant</span>
                </div>
                <div className="mt-2 text-[11px] text-amber-900 font-medium">{totalEggToCook * 2} Boiled Eggs to Prep</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-rose-800 block">🍗 Non-Veg Club Trays</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-black text-rose-700">{totalNonVegToCook}</span>
                  <span className="text-xs text-gray-500 font-semibold">{nonVegSubs} subs | {todayInstantNonVeg} instant</span>
                </div>
                <div className="mt-2 text-[11px] text-rose-900 font-medium">Chicken Curry (3 pcs per thali)</div>
              </div>

            </div>

            {/* Critical Low Ingredient Stock Alerts */}
            {lowStockItems.length > 0 && (
              <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                    <h3 className="font-bold text-sm text-amber-900 uppercase tracking-wide">
                      Chef Kitchen Alert: Low Stock Ingredients ({lowStockItems.length} items)
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSubPanel('ingredient_indent')}
                    className="text-xs font-bold bg-[#C88A24] text-black px-3 py-1 rounded-lg hover:bg-[#A97116]"
                  >
                    Create Indent →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-amber-200 text-xs shadow-2xs">
                      <div className="flex items-center justify-between font-bold text-gray-900">
                        <span>{item.name}</span>
                        <span className="text-red-600 font-black">{item.quantity} {item.unit}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 flex justify-between">
                        <span>Min Threshold:</span>
                        <span>{item.reorderThreshold} {item.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day & Meal Selector + Full Menu Recipe Guide */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#124E33]" />
                  <h3 className="font-bold text-base text-gray-900 font-serif-title">
                    Recipe & Kitchen Preparation Schedule
                  </h3>
                </div>

                {/* Day selector buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedDay === day
                          ? 'bg-[#124E33] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Package Preparation Columns for the selected day */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Veg Classic Prep */}
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200">
                    <span className="font-bold text-xs text-[#124E33] uppercase">🥗 Veg Classic ({totalVegToCook} thalis)</span>
                    <span className="text-[10px] bg-emerald-700 text-white font-bold px-1.5 py-0.5 rounded">Pure Veg</span>
                  </div>
                  
                  {currentVegSchedule && (
                    <div className="text-xs space-y-1.5 text-gray-800">
                      <div><strong className="text-emerald-950">Dal Tadka:</strong> {currentVegSchedule.lunch.dal}</div>
                      <div><strong className="text-emerald-950">Dry Sabji:</strong> {currentVegSchedule.lunch.dryVeg}</div>
                      <div><strong className="text-emerald-950">Main Gravy:</strong> {currentVegSchedule.lunch.gravyOrNonVeg}</div>
                      <div><strong className="text-emerald-950">Rice:</strong> {currentVegSchedule.lunch.rice}</div>
                      <div><strong className="text-emerald-950">Foil Pack:</strong> {currentVegSchedule.lunch.foilPacked}</div>
                      <div><strong className="text-emerald-950">Plate Extras:</strong> {currentVegSchedule.lunch.extras}</div>
                    </div>
                  )}
                </div>

                {/* 2. Egg Delight Prep */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-200">
                    <span className="font-bold text-xs text-[#A4670E] uppercase">🥚 Egg Delight ({totalEggToCook} thalis)</span>
                    <span className="text-[10px] bg-amber-700 text-white font-bold px-1.5 py-0.5 rounded">High Protein</span>
                  </div>
                  
                  {currentEggSchedule && (
                    <div className="text-xs space-y-1.5 text-gray-800">
                      <div><strong className="text-amber-950">Dal:</strong> {currentEggSchedule.lunch.dal}</div>
                      <div><strong className="text-amber-950">Dry Sabji:</strong> {currentEggSchedule.lunch.dryVeg}</div>
                      <div><strong className="text-amber-950">Egg Dish:</strong> {currentEggSchedule.lunch.gravyOrNonVeg}</div>
                      <div><strong className="text-amber-950">Rice:</strong> {currentEggSchedule.lunch.rice}</div>
                      <div><strong className="text-amber-950">Foil Pack:</strong> {currentEggSchedule.lunch.foilPacked}</div>
                      <div><strong className="text-amber-950">Plate Extras:</strong> {currentEggSchedule.lunch.extras}</div>
                    </div>
                  )}
                </div>

                {/* 3. Non-Veg Club Prep */}
                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-rose-200">
                    <span className="font-bold text-xs text-[#7A1C1C] uppercase">🍗 Non-Veg Club ({totalNonVegToCook} thalis)</span>
                    <span className="text-[10px] bg-rose-800 text-white font-bold px-1.5 py-0.5 rounded">Poultry</span>
                  </div>
                  
                  {currentNonVegSchedule && (
                    <div className="text-xs space-y-1.5 text-gray-800">
                      <div><strong className="text-rose-950">Dal:</strong> {currentNonVegSchedule.lunch.dal}</div>
                      <div><strong className="text-rose-950">Dry Sabji:</strong> {currentNonVegSchedule.lunch.dryVeg}</div>
                      <div><strong className="text-rose-950">Poultry Gravy:</strong> {currentNonVegSchedule.lunch.gravyOrNonVeg}</div>
                      <div><strong className="text-rose-950">Rice:</strong> {currentNonVegSchedule.lunch.rice}</div>
                      <div><strong className="text-rose-950">Foil Pack:</strong> {currentNonVegSchedule.lunch.foilPacked}</div>
                      <div><strong className="text-rose-950">Plate Extras:</strong> {currentNonVegSchedule.lunch.extras}</div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Instant Orders Kitchen Dispatch Queue */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#124E33]" />
                  <span>Instant Orders Live Kitchen Queue</span>
                </h3>
                <span className="text-xs text-gray-500 font-semibold">{instantOrders.length} Orders Logged</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                      <th className="p-2.5">Order ID</th>
                      <th className="p-2.5">Customer & Contact</th>
                      <th className="p-2.5">Thali Type & Qty</th>
                      <th className="p-2.5">Gate Delivery Point</th>
                      <th className="p-2.5">Slot</th>
                      <th className="p-2.5">Kitchen Status</th>
                      <th className="p-2.5 text-right">Update Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-medium text-gray-800">
                    {instantOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50">
                        <td className="p-2.5 font-bold text-[#124E33]">{ord.id}</td>
                        <td className="p-2.5">
                          <div className="font-bold text-gray-900">{ord.customerName}</div>
                          <div className="text-[11px] text-gray-500">{ord.mobileNumber}</div>
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            ord.thaliType === 'veg' ? 'bg-emerald-100 text-emerald-800' : ord.thaliType === 'egg' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {ord.quantity}x {ord.thaliType.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2.5 text-gray-700 max-w-xs truncate">{ord.deliveryPoint}</td>
                        <td className="p-2.5 font-bold">{ord.slot}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'Dispatched'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'Ready'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-right space-x-1">
                          {ord.status === 'Cooking' && (
                            <button
                              onClick={() => updateInstantOrderStatus(ord.id, 'Ready')}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold"
                            >
                              Mark Ready
                            </button>
                          )}
                          {ord.status === 'Ready' && (
                            <button
                              onClick={() => updateInstantOrderStatus(ord.id, 'Dispatched')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold"
                            >
                              Dispatch to Gate
                            </button>
                          )}
                          {ord.status === 'Dispatched' && (
                            <button
                              onClick={() => updateInstantOrderStatus(ord.id, 'Delivered')}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold"
                            >
                              Delivered
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-PANEL 2: CHEF INGREDIENT INDENT REQUESTS (ONLY INGREDIENT INPUT) */}
        {/* ========================================================================= */}
        {activeSubPanel === 'ingredient_indent' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Chef Restriction Notice Banner */}
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-emerald-700 shrink-0" />
                <span><strong>Chef Operational Mode:</strong> Enter the specific ingredients, quantities, and urgency needed for upcoming meal cycles. Approval & purchase is handled by the Manager.</span>
              </div>
              <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded font-bold">
                Chef Indent Access
              </span>
            </div>

            {indentSuccessMsg && (
              <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{indentSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Indent Submission Form (5 cols) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Plus className="w-4 h-4 text-[#124E33]" />
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    New Ingredient Indent
                  </h3>
                </div>

                <form onSubmit={handleCreateIndent} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Ingredient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fresh Poultry Chicken / Farm Eggs / Basmati Rice"
                      value={ingredientName}
                      onChange={(e) => setIngredientName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#124E33]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Quantity Needed <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        required
                        placeholder="e.g. 15"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#124E33]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Unit</label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                      >
                        <option value="kg">kg (Kilograms)</option>
                        <option value="pcs">pcs (Pieces / Eggs)</option>
                        <option value="litres">litres (Oil / Milk)</option>
                        <option value="packets">packets (Papad / Masala)</option>
                        <option value="bunches">bunches (Coriander / Greens)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Priority / Urgency</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['Urgent', 'Regular', 'Low Stock'] as const).map((urg) => (
                        <button
                          key={urg}
                          type="button"
                          onClick={() => setUrgency(urg)}
                          className={`p-2 rounded-lg text-[11px] font-bold border transition-all ${
                            urgency === urg
                              ? urg === 'Urgent'
                                ? 'bg-red-600 text-white border-red-600'
                                : 'bg-[#124E33] text-white border-[#124E33]'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {urg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Kitchen Preparation Note</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. For tomorrow's Non-Veg feast & Chicken Curry batch."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#124E33] hover:bg-[#0A2A1B] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-[#F2C94C]" />
                    <span>Submit Indent to Kitchen Manager</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Active & Historical Indents List (7 cols) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-[#124E33]" />
                    <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                      Chef Indent Tracking Log
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">{chefIndents.length} Logged</span>
                </div>

                <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                  {chefIndents.map((indent) => (
                    <div
                      key={indent.id}
                      className="p-3.5 rounded-xl border border-gray-200 bg-[#FAF7F2] flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{indent.ingredientName}</span>
                          <span className="font-black text-[#124E33]">
                            ({indent.quantity} {indent.unit})
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            indent.urgency === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {indent.urgency}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                          <span>Logged: {indent.requestedAt}</span>
                          {indent.notes && <span>• Note: {indent.notes}</span>}
                        </div>
                      </div>

                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          indent.status === 'Approved' || indent.status === 'Purchased'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {indent.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
