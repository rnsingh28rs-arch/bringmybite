import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PackageType } from '../../types';
import {
  Briefcase,
  Sliders,
  DollarSign,
  Package,
  Layers,
  Edit3,
  CheckCircle,
  Plus,
  RefreshCw,
  TrendingUp,
  Truck,
  GraduationCap,
  Home,
  Check,
  AlertCircle
} from 'lucide-react';

export const ManagerPanel: React.FC = () => {
  const {
    pricing,
    updatePricing,
    inventory,
    updateInventoryQuantity,
    addInventoryItem,
    subscriptions,
    instantOrders,
    chefIndents,
    updateChefIndentStatus,
    vegMenu,
    eggMenu,
    nonVegMenu,
    updateMenuItem
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'pricing_menu' | 'orders_dispatch' | 'chef_indents'>('inventory');

  // Pricing Edit State
  const [vegPrice, setVegPrice] = useState(pricing.vegMonthly);
  const [eggPrice, setEggPrice] = useState(pricing.eggMonthly);
  const [nonVegPrice, setNonVegPrice] = useState(pricing.nonVegMonthly);
  const [vegThali, setVegThali] = useState(pricing.vegThaliInstant);
  const [eggThali, setEggThali] = useState(pricing.eggThaliInstant);
  const [nonVegThali, setNonVegThali] = useState(pricing.nonVegThaliInstant);
  const [pricingSuccess, setPricingSuccess] = useState(false);

  // New Inventory Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'Grains' | 'Dairy' | 'Poultry' | 'Spices' | 'Vegetables' | 'Packaging'>('Grains');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('kg');
  const [newItemThreshold, setNewItemThreshold] = useState('');

  // Menu Edit State
  const [editPackage, setEditPackage] = useState<PackageType>('VEG CLASSIC');
  const [editDay, setEditDay] = useState('Monday');
  const [editMeal, setEditMeal] = useState<'lunch' | 'dinner'>('lunch');
  const [editDal, setEditDal] = useState('');
  const [editDryVeg, setEditDryVeg] = useState('');
  const [editGravy, setEditGravy] = useState('');
  const [editRice, setEditRice] = useState('');
  const [editFoil, setEditFoil] = useState('');
  const [editExtras, setEditExtras] = useState('');
  const [menuEditMsg, setMenuEditMsg] = useState('');

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricing({
      vegMonthly: Number(vegPrice),
      eggMonthly: Number(eggPrice),
      nonVegMonthly: Number(nonVegPrice),
      vegThaliInstant: Number(vegThali),
      eggThaliInstant: Number(eggThali),
      nonVegThaliInstant: Number(nonVegThali)
    });
    setPricingSuccess(true);
    setTimeout(() => setPricingSuccess(false), 3000);
  };

  const handleAddNewInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemQty) return;
    addInventoryItem({
      name: newItemName,
      category: newItemCategory,
      quantity: Number(newItemQty),
      unit: newItemUnit,
      reorderThreshold: Number(newItemThreshold) || 10
    });
    setNewItemName('');
    setNewItemQty('');
    setNewItemThreshold('');
  };

  const handleSaveMenuSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    updateMenuItem(editPackage, editDay, editMeal, {
      dal: editDal,
      dryVeg: editDryVeg,
      gravyOrNonVeg: editGravy,
      rice: editRice,
      foilPacked: editFoil,
      extras: editExtras
    });
    setMenuEditMsg('Menu item updated across all platforms!');
    setTimeout(() => setMenuEditMsg(''), 3000);
  };

  // Load current menu item into form when tab/day/meal changes
  const handleLoadCurrentMenuItem = () => {
    const list = editPackage === 'VEG CLASSIC' ? vegMenu : editPackage === 'EGG DELIGHT' ? eggMenu : nonVegMenu;
    const schedule = list.find((s) => s.day === editDay);
    if (schedule) {
      const mealData = editMeal === 'lunch' ? schedule.lunch : schedule.dinner;
      if (mealData) {
        setEditDal(mealData.dal);
        setEditDryVeg(mealData.dryVeg);
        setEditGravy(mealData.gravyOrNonVeg);
        setEditRice(mealData.rice);
        setEditFoil(mealData.foilPacked);
        setEditExtras(mealData.extras);
      }
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Manager Header */}
        <div className="bg-[#0C3822] text-white p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4 border-b-4 border-blue-500">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-900 px-2 py-0.5 rounded text-blue-200">
                  Kitchen Operations & Inventory Manager
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif-title tracking-tight">
                Manager Operations & Stock Control
              </h1>
              <p className="text-xs text-emerald-200">
                Menu Pricing • Inventory Management • Order Routing • Chef Indent Approvals
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-[#082416] p-1.5 rounded-xl border border-emerald-800 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-xs' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>1. Inventory Stock</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing_menu')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'pricing_menu' ? 'bg-blue-600 text-white shadow-xs' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>2. Pricing & Menu</span>
            </button>

            <button
              onClick={() => setActiveTab('orders_dispatch')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'orders_dispatch' ? 'bg-blue-600 text-white shadow-xs' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>3. Order Routing</span>
            </button>

            <button
              onClick={() => setActiveTab('chef_indents')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'chef_indents' ? 'bg-blue-600 text-white shadow-xs' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>4. Chef Indents</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: INVENTORY STOCK ANALYSIS & UPDATES */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Inventory Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-gray-500 block">Total Tracked Items</span>
                <span className="text-3xl font-black text-gray-900">{inventory.length}</span>
                <div className="text-[11px] text-gray-500 mt-1">Grains, Poultry, Dairy, Packaging</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-amber-800 block">Low Stock Warnings</span>
                <span className="text-3xl font-black text-amber-700">
                  {inventory.filter((i) => i.quantity <= i.reorderThreshold).length}
                </span>
                <div className="text-[11px] text-amber-900 mt-1">Requires immediate vendor restock</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">Healthy Stock Items</span>
                <span className="text-3xl font-black text-emerald-700">
                  {inventory.filter((i) => i.quantity > i.reorderThreshold).length}
                </span>
                <div className="text-[11px] text-emerald-900 mt-1">Adequate for next 3+ days</div>
              </div>
            </div>

            {/* Main Inventory Management Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Inventory Table (8 cols) */}
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    Live Central Inventory Stock
                  </h3>
                  <span className="text-xs text-gray-500 font-semibold">{inventory.length} SKUs Listed</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                        <th className="p-2.5">Item Name</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Current Stock</th>
                        <th className="p-2.5">Threshold</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 text-right">Quick Stock Adjustment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium text-gray-800">
                      {inventory.map((item) => {
                        const isLow = item.quantity <= item.reorderThreshold;
                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-2.5 font-bold text-gray-900">{item.name}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px]">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-2.5 font-black text-[#124E33]">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="p-2.5 text-gray-500">{item.reorderThreshold} {item.unit}</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isLow ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {isLow ? 'LOW STOCK' : 'IN STOCK'}
                              </span>
                            </td>
                            <td className="p-2.5 text-right space-x-1">
                              <button
                                onClick={() => updateInventoryQuantity(item.id, -5)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-bold text-[10px]"
                                title="Consume 5 units"
                              >
                                -5
                              </button>
                              <button
                                onClick={() => updateInventoryQuantity(item.id, 5)}
                                className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold text-[10px]"
                                title="Add 5 units"
                              >
                                +5
                              </button>
                              <button
                                onClick={() => updateInventoryQuantity(item.id, 25)}
                                className="px-2 py-1 bg-[#124E33] hover:bg-[#0A2A1B] text-white rounded font-bold text-[10px]"
                                title="Restock +25 units"
                              >
                                +25 Restock
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add New SKU Form (4 cols) */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    Add New Inventory SKU
                  </h3>
                </div>

                <form onSubmit={handleAddNewInventory} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Item Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasuri Methi / Paneer"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Category</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                    >
                      <option value="Grains">Grains & Flour</option>
                      <option value="Dairy">Dairy (Paneer, Milk)</option>
                      <option value="Poultry">Poultry & Eggs</option>
                      <option value="Vegetables">Fresh Vegetables</option>
                      <option value="Spices">Spices & Oils</option>
                      <option value="Packaging">Packaging Trays & Foils</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Initial Qty *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 50"
                        value={newItemQty}
                        onChange={(e) => setNewItemQty(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Unit</label>
                      <select
                        value={newItemUnit}
                        onChange={(e) => setNewItemUnit(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                      >
                        <option value="kg">kg</option>
                        <option value="pcs">pcs</option>
                        <option value="litres">litres</option>
                        <option value="packets">packets</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Reorder Alert Threshold</label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      value={newItemThreshold}
                      onChange={(e) => setNewItemThreshold(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register SKU into Inventory</span>
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRICING & WEEKLY MENU EDITING */}
        {/* ========================================================================= */}
        {activeTab === 'pricing_menu' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Live Pricing Updater Form */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    Live Package & Instant Thali Price Controller
                  </h3>
                </div>
                {pricingSuccess && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 animate-in zoom-in-95">
                    ✓ Pricing updated live on website & app!
                  </span>
                )}
              </div>

              <form onSubmit={handleSavePricing} className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-gray-700 mb-2">1. Monthly Subscription Packages (13 Meals/Week)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-emerald-800 mb-1">Veg Classic Monthly (₹)</label>
                      <input
                        type="number"
                        value={vegPrice}
                        onChange={(e) => setVegPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-amber-800 mb-1">Egg Delight Monthly (₹)</label>
                      <input
                        type="number"
                        value={eggPrice}
                        onChange={(e) => setEggPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-rose-800 mb-1">Non-Veg Club Monthly (₹)</label>
                      <input
                        type="number"
                        value={nonVegPrice}
                        onChange={(e) => setNonVegPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-700 mb-2">2. Single Instant Thali Prices (Gate Delivery)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-emerald-800 mb-1">Veg Thali Instant (₹)</label>
                      <input
                        type="number"
                        value={vegThali}
                        onChange={(e) => setVegThali(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-amber-800 mb-1">Egg Thali Instant (₹)</label>
                      <input
                        type="number"
                        value={eggThali}
                        onChange={(e) => setEggThali(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-rose-800 mb-1">Non-Veg Thali Instant (₹)</label>
                      <input
                        type="number"
                        value={nonVegThali}
                        onChange={(e) => setNonVegThali(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#124E33] hover:bg-[#0A2A1B] text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Save & Apply Pricing Across All Panels
                </button>
              </form>
            </div>

            {/* Weekly Rotational Menu Editor */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    Weekly Rotational Menu Editor
                  </h3>
                </div>
                {menuEditMsg && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 animate-in zoom-in-95">
                    ✓ {menuEditMsg}
                  </span>
                )}
              </div>

              {/* Selector Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Select Package</label>
                  <select
                    value={editPackage}
                    onChange={(e) => setEditPackage(e.target.value as PackageType)}
                    className="w-full p-2 border border-gray-300 rounded-lg font-bold"
                  >
                    <option value="VEG CLASSIC">Veg Classic</option>
                    <option value="EGG DELIGHT">Egg Delight</option>
                    <option value="NON-VEG CLUB">Non-Veg Club</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Select Day</label>
                  <select
                    value={editDay}
                    onChange={(e) => setEditDay(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg font-bold"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Meal Slot</label>
                  <select
                    value={editMeal}
                    onChange={(e) => setEditMeal(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-lg font-bold"
                  >
                    <option value="lunch">☀️ Lunch</option>
                    <option value="dinner">🌙 Dinner</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleLoadCurrentMenuItem}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                >
                  Load Current Values for {editPackage} ({editDay} - {editMeal})
                </button>
              </div>

              {/* Menu Edit Form */}
              <form onSubmit={handleSaveMenuSchedule} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Dal (Tadka / Masoor / Makhani)</label>
                    <input
                      type="text"
                      placeholder="e.g. Dal Makhani / Dal Tadka"
                      value={editDal}
                      onChange={(e) => setEditDal(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Dry Sabji</label>
                    <input
                      type="text"
                      placeholder="e.g. Aloo Gobhi / Bhindi Masala"
                      value={editDryVeg}
                      onChange={(e) => setEditDryVeg(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Main Gravy / Non-Veg</label>
                    <input
                      type="text"
                      placeholder="e.g. Kadhi Pakoda / Egg Curry (2 pcs) / Chicken Curry (3 pcs)"
                      value={editGravy}
                      onChange={(e) => setEditGravy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none font-bold text-[#124E33]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Rice Variety</label>
                    <input
                      type="text"
                      placeholder="e.g. Jeera Basmati Rice / Steamed Rice"
                      value={editRice}
                      onChange={(e) => setEditRice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Foil Packed Item</label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Warm Roti + 1 Papad in foil"
                      value={editFoil}
                      onChange={(e) => setEditFoil(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Plate Extras</label>
                    <input
                      type="text"
                      placeholder="e.g. Fresh Salad & Mango Pickle"
                      value={editExtras}
                      onChange={(e) => setEditExtras(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Save Schedule Changes
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ORDER ROUTING & GATE DISPATCHES */}
        {/* ========================================================================= */}
        {activeTab === 'orders_dispatch' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Subscriptions Dispatch List */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#124E33]" />
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    Active Monthly Subscriptions & Gate Delivery Points ({subscriptions.length})
                  </h3>
                </div>
                <span className="text-xs text-gray-500 font-semibold">13 Meals/Week Cycle</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                      <th className="p-2.5">Cust ID</th>
                      <th className="p-2.5">Customer Name & Phone</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Package</th>
                      <th className="p-2.5">Lunch Gate Destination</th>
                      <th className="p-2.5">Dinner Destination</th>
                      <th className="p-2.5">Route Code</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-medium text-gray-800">
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="p-2.5 font-bold text-[#124E33]">{sub.id}</td>
                        <td className="p-2.5">
                          <div className="font-bold text-gray-900">{sub.customerName}</div>
                          <div className="text-[11px] text-gray-500">{sub.mobileNumber}</div>
                        </td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-bold">
                            {sub.category}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.packageType === 'VEG CLASSIC' ? 'bg-emerald-100 text-emerald-800' : sub.packageType === 'EGG DELIGHT' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sub.packageType}
                          </span>
                        </td>
                        <td className="p-2.5 text-gray-800 max-w-xs">
                          <strong>{sub.collegeName || sub.companyName}</strong> ({sub.lunchDeliveryPoint})
                        </td>
                        <td className="p-2.5 text-gray-600 max-w-xs truncate">
                          {sub.houseFlatNo}, {sub.buildingSociety}, {sub.streetArea}
                        </td>
                        <td className="p-2.5 font-extrabold text-amber-800">{sub.routeCode}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                            {sub.status}
                          </span>
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
        {/* TAB 4: CHEF INDENT APPROVALS */}
        {/* ========================================================================= */}
        {activeTab === 'chef_indents' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    Chef Kitchen Indent Approvals & Purchasing ({chefIndents.length})
                  </h3>
                </div>
                <span className="text-xs text-gray-500 font-semibold">Kitchen Procurement Pipeline</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                      <th className="p-2.5">Indent ID</th>
                      <th className="p-2.5">Ingredient Name</th>
                      <th className="p-2.5">Quantity</th>
                      <th className="p-2.5">Priority</th>
                      <th className="p-2.5">Chef Note</th>
                      <th className="p-2.5">Requested At</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-medium text-gray-800">
                    {chefIndents.map((indent) => (
                      <tr key={indent.id} className="hover:bg-gray-50">
                        <td className="p-2.5 font-bold text-blue-700">{indent.id}</td>
                        <td className="p-2.5 font-bold text-gray-900">{indent.ingredientName}</td>
                        <td className="p-2.5 font-black text-[#124E33]">
                          {indent.quantity} {indent.unit}
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            indent.urgency === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {indent.urgency}
                          </span>
                        </td>
                        <td className="p-2.5 text-gray-600">{indent.notes || '—'}</td>
                        <td className="p-2.5 text-gray-500">{indent.requestedAt}</td>
                        <td className="p-2.5">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                            indent.status === 'Purchased'
                              ? 'bg-emerald-100 text-emerald-800'
                              : indent.status === 'Approved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {indent.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-right space-x-1.5">
                          {indent.status === 'Pending' && (
                            <button
                              onClick={() => updateChefIndentStatus(indent.id, 'Approved')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold"
                            >
                              Approve
                            </button>
                          )}
                          {(indent.status === 'Pending' || indent.status === 'Approved') && (
                            <button
                              onClick={() => updateChefIndentStatus(indent.id, 'Purchased')}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold"
                            >
                              Mark Purchased (+Stock)
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

      </div>
    </div>
  );
};
