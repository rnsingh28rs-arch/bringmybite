import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateAndDownloadZip } from '../../utils/zipExporter';
import {
  ShieldAlert,
  TrendingUp,
  DollarSign,
  Users,
  Utensils,
  CalendarCheck,
  Zap,
  Package,
  Layers,
  ChefHat,
  Briefcase,
  Download,
  CheckCircle,
  FileSpreadsheet,
  Code2,
  Smartphone,
  Globe,
  FolderArchive
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

export const AdminPanel: React.FC = () => {
  const {
    subscriptions,
    instantOrders,
    inventory,
    chefIndents,
    pricing,
    setActiveRole
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'financials' | 'subscriptions' | 'oversight' | 'export'>('overview');
  const [downloadingZip, setDownloadingZip] = useState<string | null>(null);

  const handleDownload = async (type: 'all' | 'website' | 'android' | 'ios') => {
    setDownloadingZip(type);
    try {
      await generateAndDownloadZip(type);
    } finally {
      setTimeout(() => setDownloadingZip(null), 1000);
    }
  };

  // Revenue Calculations
  const subscriptionRevenue = subscriptions.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
  const instantOrderRevenue = instantOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalRevenue = subscriptionRevenue + instantOrderRevenue;

  // Breakdown counts
  const vegSubsCount = subscriptions.filter((s) => s.packageType === 'VEG CLASSIC').length;
  const eggSubsCount = subscriptions.filter((s) => s.packageType === 'EGG DELIGHT').length;
  const nonVegSubsCount = subscriptions.filter((s) => s.packageType === 'NON-VEG CLUB').length;

  const studentCount = subscriptions.filter((s) => s.category === 'College Student').length;
  const proCount = subscriptions.filter((s) => s.category === 'Working Professional').length;
  const otherCount = subscriptions.filter((s) => s.category === 'Other').length;

  // Chart Data for Subscriptions Breakdown
  const packagePieData = [
    { name: 'Veg Classic', value: vegSubsCount, color: '#16a34a' },
    { name: 'Egg Delight', value: eggSubsCount, color: '#d97706' },
    { name: 'Non-Veg Club', value: nonVegSubsCount, color: '#dc2626' }
  ];

  const categoryBarData = [
    { category: 'College Students', count: studentCount, fill: '#124E33' },
    { category: 'Working Pros', count: proCount, fill: '#0284c7' },
    { category: 'Others', count: otherCount, fill: '#8b5cf6' }
  ];

  // Daily Meal Volume Trend (Mock projections based on real state)
  const mealVolumeData = [
    { day: 'Mon', veg: 45 + vegSubsCount, egg: 30 + eggSubsCount, nonVeg: 40 + nonVegSubsCount },
    { day: 'Tue', veg: 50 + vegSubsCount, egg: 28 + eggSubsCount, nonVeg: 35 + nonVegSubsCount },
    { day: 'Wed', veg: 48 + vegSubsCount, egg: 32 + eggSubsCount, nonVeg: 38 + nonVegSubsCount },
    { day: 'Thu', veg: 52 + vegSubsCount, egg: 29 + eggSubsCount, nonVeg: 36 + nonVegSubsCount },
    { day: 'Fri', veg: 46 + vegSubsCount, egg: 35 + eggSubsCount, nonVeg: 45 + nonVegSubsCount },
    { day: 'Sat', veg: 42 + vegSubsCount, egg: 30 + eggSubsCount, nonVeg: 42 + nonVegSubsCount },
    { day: 'Sun', veg: 38 + vegSubsCount, egg: 25 + eggSubsCount, nonVeg: 50 + nonVegSubsCount }
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Customer Name,Mobile,Category,Package,Amount Paid,Route Code,Status\n' +
      subscriptions
        .map(
          (s) =>
            `${s.id},"${s.customerName}",${s.mobileNumber},${s.category},${s.packageType},${s.amountPaid},${s.routeCode},${s.verificationStatus || 'Approved'}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BringMyBite_Subscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Master Admin Header */}
        <div className="bg-[#5C1111] text-white p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4 border-b-4 border-amber-400">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black shadow-xs">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-red-950 px-2 py-0.5 rounded text-amber-200">
                  Master Admin Dashboard (/admin)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif-title tracking-tight">
                Shree Foods Executive & Governance Console
              </h1>
              <p className="text-xs text-rose-200">
                Full Oversight of Chef Kitchen, Manager Operations, Sales Revenue & Deliveries
              </p>
            </div>
          </div>

          {/* Admin Sub Navigation */}
          <div className="flex items-center bg-red-950 p-1.5 rounded-xl border border-red-800 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveAdminTab('overview')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeAdminTab === 'overview' ? 'bg-amber-400 text-black shadow-xs' : 'text-rose-200 hover:text-white'
              }`}
            >
              Executive Overview
            </button>
            <button
              onClick={() => setActiveAdminTab('financials')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeAdminTab === 'financials' ? 'bg-amber-400 text-black shadow-xs' : 'text-rose-200 hover:text-white'
              }`}
            >
              Sales & Financials
            </button>
            <button
              onClick={() => setActiveAdminTab('subscriptions')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeAdminTab === 'subscriptions' ? 'bg-amber-400 text-black shadow-xs' : 'text-rose-200 hover:text-white'
              }`}
            >
              Customer Accounts
            </button>
            <button
              onClick={() => setActiveAdminTab('oversight')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeAdminTab === 'oversight' ? 'bg-amber-400 text-black shadow-xs' : 'text-rose-200 hover:text-white'
              }`}
            >
              Sub-Panel Oversight
            </button>
            <button
              onClick={() => setActiveAdminTab('export')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeAdminTab === 'export' ? 'bg-amber-400 text-black shadow-xs' : 'text-amber-300 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Source Code (ZIP)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {/* ========================================================================= */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Revenue */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                  Total Gross Revenue
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-black text-[#124E33]">
                    ₹{totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    +18.4% MoM
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-gray-500">
                  ₹{subscriptionRevenue.toLocaleString()} subs + ₹{instantOrderRevenue.toLocaleString()} instant
                </div>
              </div>

              {/* Active Subscriptions */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 block tracking-wider">
                  Active Subscriptions
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-black text-emerald-800">{subscriptions.length}</span>
                  <span className="text-xs font-bold text-gray-500">
                    {studentCount} Students • {proCount} Pros
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-emerald-900 font-medium">13 meals/week standard cycle</div>
              </div>

              {/* Instant Single Orders */}
              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase text-amber-700 block tracking-wider">
                  Instant Orders Processed
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-black text-amber-800">{instantOrders.length}</span>
                  <span className="text-xs font-bold text-amber-800">45-min delivery</span>
                </div>
                <div className="mt-2 text-[11px] text-amber-900 font-medium">Delivered to Gate & Receptions</div>
              </div>

              {/* Operational Kitchen Health */}
              <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase text-blue-700 block tracking-wider">
                  Kitchen Operational Score
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-black text-blue-800">99.4%</span>
                  <span className="text-xs bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold">Optimal</span>
                </div>
                <div className="mt-2 text-[11px] text-blue-900 font-medium">
                  {inventory.filter((i) => i.currentStock <= i.minThreshold).length} low stock alerts
                </div>
              </div>

            </div>

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Daily Meal Volume Trends (8 cols) */}
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                      Weekly Meal Production & Dispatch Volume
                    </h3>
                    <p className="text-[11px] text-gray-500">Daily thali outputs across Veg, Egg, and Non-Veg lines</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Veg
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Egg
                    </span>
                    <span className="flex items-center gap-1 text-rose-700 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Non-Veg
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mealVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="veg" name="Veg Classic" fill="#16a34a" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="egg" name="Egg Delight" fill="#d97706" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="nonVeg" name="Non-Veg Club" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Package Distribution Pie (4 cols) */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="pb-2 border-b border-gray-100">
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    Package Share
                  </h3>
                  <p className="text-[11px] text-gray-500">Subscription ratio</p>
                </div>

                <div className="h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={packagePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {packagePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 text-xs">
                  {packagePieData.map((item) => (
                    <div key={item.name} className="flex justify-between items-center text-gray-700">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span>{item.name}</span>
                      </span>
                      <span className="font-bold">{item.value} subs ({Math.round((item.value / (subscriptions.length || 1)) * 100)}%)</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FINANCIALS & REVENUE BREAKDOWN */}
        {/* ========================================================================= */}
        {activeAdminTab === 'financials' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-xs text-gray-500 font-bold block">Monthly Subscription Cashflow</span>
                <span className="text-2xl font-black text-[#124E33]">₹{subscriptionRevenue.toLocaleString()}</span>
                <div className="text-[11px] text-gray-500 mt-1">Direct advance monthly collections</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-xs text-gray-500 font-bold block">Instant Single Thalis Cashflow</span>
                <span className="text-2xl font-black text-amber-700">₹{instantOrderRevenue.toLocaleString()}</span>
                <div className="text-[11px] text-gray-500 mt-1">Daily on-demand gate sales</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-xs text-gray-500 font-bold block">Projected Annual Run-Rate</span>
                <span className="text-2xl font-black text-blue-700">₹{(totalRevenue * 12).toLocaleString()}</span>
                <div className="text-[11px] text-gray-500 mt-1">Based on current active fleet</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                  Recent Financial Transactions & Paid Invoices
                </h3>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Ledger CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                      <th className="p-2.5">Txn / Order ID</th>
                      <th className="p-2.5">Customer Name</th>
                      <th className="p-2.5">Item / Plan</th>
                      <th className="p-2.5">Payment Method</th>
                      <th className="p-2.5">Amount Paid</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-medium text-gray-800">
                    {subscriptions.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="p-2.5 font-bold text-gray-900">{s.transactionId}</td>
                        <td className="p-2.5">{s.customerName}</td>
                        <td className="p-2.5 font-bold text-[#124E33]">{s.packageType} ({s.duration})</td>
                        <td className="p-2.5">{s.paymentMethod}</td>
                        <td className="p-2.5 font-extrabold text-emerald-800">₹{s.amountPaid.toLocaleString()}</td>
                        <td className="p-2.5 text-gray-500">{s.paymentDate}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                            Paid & Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                    {instantOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="p-2.5 font-bold text-gray-900">{o.id}</td>
                        <td className="p-2.5">{o.customerName}</td>
                        <td className="p-2.5 font-bold text-amber-800">{o.quantity}x {o.thaliType} Thali (Instant)</td>
                        <td className="p-2.5">{o.paymentMethod} ({o.paymentStatus})</td>
                        <td className="p-2.5 font-extrabold text-emerald-800">₹{(o.totalPrice || 0).toLocaleString()}</td>
                        <td className="p-2.5 text-gray-500">{o.orderTime || 'Today'}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold">
                            {o.status}
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
        {/* TAB 3: CUSTOMER ACCOUNTS & CSV EXPORT */}
        {/* ========================================================================= */}
        {activeAdminTab === 'subscriptions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                    Master Registered Customer Directory ({subscriptions.length})
                  </h3>
                  <p className="text-[11px] text-gray-500">Student & Corporate gate addresses</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-[#124E33] hover:bg-[#0A2A1B] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#F2C94C]" />
                  <span>Export Customer Database CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                      <th className="p-2.5">Cust ID</th>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Phone / WhatsApp</th>
                      <th className="p-2.5">Category & Entity</th>
                      <th className="p-2.5">Package</th>
                      <th className="p-2.5">Lunch Gate Point</th>
                      <th className="p-2.5">Route</th>
                      <th className="p-2.5">Amount</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-medium text-gray-800">
                    {subscriptions.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="p-2.5 font-bold text-[#124E33]">{s.id}</td>
                        <td className="p-2.5 font-bold text-gray-900">{s.customerName}</td>
                        <td className="p-2.5 text-gray-600">{s.mobileNumber}</td>
                        <td className="p-2.5">
                          <div className="font-semibold text-gray-800">{s.category}</div>
                          <div className="text-[10px] text-gray-500">{s.collegeName || s.companyName}</div>
                        </td>
                        <td className="p-2.5 font-bold text-[#124E33]">{s.packageType}</td>
                        <td className="p-2.5 text-gray-700">{s.lunchDeliveryPoint || 'Campus Gate'}</td>
                        <td className="p-2.5 font-black text-amber-800">{s.routeCode}</td>
                        <td className="p-2.5 font-extrabold text-emerald-800">₹{s.amountPaid.toLocaleString()}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                            {s.verificationStatus || 'Approved'}
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
        {/* TAB 4: SUB-PANEL OVERSIGHT (CHEF & MANAGER DIRECT ACCESS) */}
        {/* ========================================================================= */}
        {activeAdminTab === 'oversight' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Manager Control Oversight Card */}
              <div className="bg-white p-6 rounded-2xl border-2 border-blue-300 shadow-md space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 font-serif-title">
                      Manager Operations & Inventory Console
                    </h3>
                    <p className="text-xs text-gray-500">Stock thresholds, live pricing, order routing</p>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-1.5 text-gray-700">
                  <div className="flex justify-between">
                    <span>Total Tracked SKUs:</span>
                    <strong className="text-blue-900">{inventory.length} items</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Chef Indents:</span>
                    <strong className="text-amber-800">{chefIndents.filter((i) => i.status === 'Pending Approval').length} requests</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Veg Classic Price:</span>
                    <strong className="text-emerald-800">₹{pricing.vegMonthly}/mo</strong>
                  </div>
                </div>

                <button
                  onClick={() => setActiveRole('manager')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Open Manager Panel Directly →
                </button>
              </div>

              {/* Chef Kitchen Oversight Card */}
              <div className="bg-white p-6 rounded-2xl border-2 border-amber-300 shadow-md space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C88A24] text-black flex items-center justify-center font-bold">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 font-serif-title">
                      Chef Kitchen & Cooking Console
                    </h3>
                    <p className="text-xs text-gray-500">Live batch cooking, alerts, ingredient indents</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs space-y-1.5 text-gray-700">
                  <div className="flex justify-between">
                    <span>Daily Thalis in Production:</span>
                    <strong className="text-amber-900">{subscriptions.length + instantOrders.length} thalis</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Stock Alerts:</span>
                    <strong className="text-red-700">{inventory.filter((i) => i.currentStock <= i.minThreshold).length} critical items</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Kitchen Cleanliness Standard:</span>
                    <strong className="text-emerald-800">FSSAI Certified 100%</strong>
                  </div>
                </div>

                <button
                  onClick={() => setActiveRole('chef')}
                  className="w-full py-2.5 bg-[#C88A24] hover:bg-[#A97116] text-black font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Open Chef Kitchen Panel Directly →
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BIFURCATED CODE SOURCE EXPORT */}
        {/* ========================================================================= */}
        {activeAdminTab === 'export' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header Alert Box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-serif-title">
                    Bifurcated Source Code Packages & Deployment Bundles
                  </h3>
                  <p className="text-xs text-gray-500">
                    Download clean, separate source packages for Web, Android, iOS, or the complete All-In-One ZIP archive.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>All packages include:</span>
                </p>
                <p className="text-emerald-800">
                  • <strong>Official Axis Bank Payment Configuration:</strong> Account 922020048876624, IFSC UTIB0000624, UPI 9004848984@axisbank (100% Prepaid)<br />
                  • <strong>Staff Auth Module:</strong> Admin (PIN 9922), Manager (PIN 5544), Chef (PIN 1122)<br />
                  • <strong>Ready for Production Deployment:</strong> Vercel/Netlify for Web, Android Studio for APK/AAB, Xcode for iOS.
                </p>
              </div>
            </div>

            {/* 4 Download Options Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* 1. Website Code */}
              <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-emerald-100 text-[#124E33]">
                      <Globe className="w-6 h-6" />
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      React + Vite + Tailwind
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">1. Website Code (Separated)</h4>
                  <p className="text-xs text-gray-600">
                    Pure web frontend with customer portal, staff dashboards (Admin, Manager, Chef), and prepaid Axis Bank UPI integration.
                  </p>
                  <div className="text-[11px] font-mono text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    File: website_code.zip (Contains: website/ + README.md + package.json + PAYMENT_CONFIG.json)
                  </div>
                </div>

                <button
                  onClick={() => handleDownload('website')}
                  disabled={downloadingZip === 'website'}
                  className="w-full py-2.5 bg-[#124E33] hover:bg-[#0C3822] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#F2C94C]" />
                  <span>{downloadingZip === 'website' ? 'Preparing ZIP...' : 'Download Website Code (ZIP)'}</span>
                </button>
              </div>

              {/* 2. Android Application Code */}
              <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
                      <Smartphone className="w-6 h-6" />
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
                      Android Studio / APK
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">2. Android Application Code (Separated)</h4>
                  <p className="text-xs text-gray-600">
                    Native Android project with Capacitor bridge, AndroidManifest.xml, MainActivity.java, and Gradle build config.
                  </p>
                  <div className="text-[11px] font-mono text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    File: application_android.zip (Contains: application/android/ + capacitor.config.json + Manifest)
                  </div>
                </div>

                <button
                  onClick={() => handleDownload('android')}
                  disabled={downloadingZip === 'android'}
                  className="w-full py-2.5 bg-[#C88A24] hover:bg-[#A97116] text-black text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadingZip === 'android' ? 'Preparing ZIP...' : 'Download Android App Code (ZIP)'}</span>
                </button>
              </div>

              {/* 3. iOS Application Code */}
              <div className="bg-white p-5 rounded-2xl border-2 border-blue-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
                      <Smartphone className="w-6 h-6" />
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
                      Xcode / Swift / iOS
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">3. iOS Application Code (Separated)</h4>
                  <p className="text-xs text-gray-600">
                    Native iOS workspace with Podfile, AppDelegate.swift, Info.plist, and location permissions for gate drop.
                  </p>
                  <div className="text-[11px] font-mono text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    File: application_ios.zip (Contains: application/ios/ + AppDelegate.swift + Info.plist)
                  </div>
                </div>

                <button
                  onClick={() => handleDownload('ios')}
                  disabled={downloadingZip === 'ios'}
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadingZip === 'ios' ? 'Preparing ZIP...' : 'Download iOS App Code (ZIP)'}</span>
                </button>
              </div>

              {/* 4. Complete All-In-One Archive */}
              <div className="bg-[#0A2A1B] text-white p-5 rounded-2xl border-2 border-amber-400 shadow-md flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-amber-400 text-black">
                      <FolderArchive className="w-6 h-6" />
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-400 text-black rounded">
                      Complete Master Bundle
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#F2C94C]">4. Master All-In-One Codebase (Bifurcated Folders)</h4>
                  <p className="text-xs text-emerald-200">
                    Includes clean bifurcated subdirectories: <code className="bg-black/40 px-1 py-0.5 rounded text-white">website/</code>, <code className="bg-black/40 px-1 py-0.5 rounded text-white">application/android/</code>, and <code className="bg-black/40 px-1 py-0.5 rounded text-white">application/ios/</code>.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-300 bg-black/30 p-2 rounded-lg border border-emerald-800">
                    File: bring_my_bite_all_complete.zip
                  </div>
                </div>

                <button
                  onClick={() => handleDownload('all')}
                  disabled={downloadingZip === 'all'}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadingZip === 'all' ? 'Creating Master ZIP...' : 'Download Complete All-In-One ZIP (Master)'}</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
