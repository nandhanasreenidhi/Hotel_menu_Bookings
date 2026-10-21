import React, { useState } from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { formatINR } from '../../../lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  PieChart, 
  Clock, 
  Download,
  AlertCircle
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { orders, menuItems, settings } = useRestaurant();
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  const totalGross = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalGross / totalOrders : 0;

  // Category distribution
  const categoryStats = [
    { name: 'Signature Curries', percentage: 38, amount: totalGross * 0.38, color: 'bg-emerald-500' },
    { name: 'Dum Biryanis', percentage: 28, amount: totalGross * 0.28, color: 'bg-amber-500' },
    { name: 'Starters & Tandoor', percentage: 20, amount: totalGross * 0.20, color: 'bg-indigo-500' },
    { name: 'Artisan Breads', percentage: 8, amount: totalGross * 0.08, color: 'bg-teal-500' },
    { name: 'Desserts & Beverages', percentage: 6, amount: totalGross * 0.06, color: 'bg-rose-500' },
  ];

  // Hourly volume simulation
  const hourlyData = [
    { hour: '12 PM', orders: 4, height: 'h-16' },
    { hour: '1 PM', orders: 9, height: 'h-32' },
    { hour: '2 PM', orders: 12, height: 'h-40' },
    { hour: '3 PM', orders: 5, height: 'h-20' },
    { hour: '4 PM', orders: 2, height: 'h-10' },
    { hour: '5 PM', orders: 3, height: 'h-12' },
    { hour: '6 PM', orders: 6, height: 'h-24' },
    { hour: '7 PM', orders: 11, height: 'h-36' },
    { hour: '8 PM', orders: 16, height: 'h-48' },
    { hour: '9 PM', orders: 18, height: 'h-52' },
    { hour: '10 PM', orders: 10, height: 'h-32' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Sales & Dining Analytics
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Revenue trends, popular dining hours, and culinary category performance.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800 text-xs">
          <button
            onClick={() => setPeriod('today')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              period === 'today' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              period === 'week' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              period === 'month' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Demo Alert */}
      <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-2.5 text-xs text-stone-400">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          Sample reports aggregated from the active session. Production charts will query aggregate views in Supabase PostgreSQL.
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400">Selected Period Gross</span>
          <div className="text-2xl font-serif font-bold text-white">{formatINR(totalGross)}</div>
          <span className="text-[11px] text-emerald-400 font-medium">+18.5% YoY Growth</span>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400">Average Order / Ticket Size</span>
          <div className="text-2xl font-serif font-bold text-white">{formatINR(avgOrderValue)}</div>
          <span className="text-[11px] text-stone-400">Across dine-in tables</span>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400">Total Covers (Guests Served)</span>
          <div className="text-2xl font-mono font-bold text-white">42 Guests</div>
          <span className="text-[11px] text-amber-400">Terrace Garden is top section</span>
        </div>
      </div>

      {/* Hourly Dining Bar Chart */}
      <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Peak Dining Volume by Hour</span>
            </h2>
            <span className="text-xs text-stone-400">
              Orders dispatched per service slot (Lunch 12–3 PM & Dinner 7–10 PM)
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-800 text-stone-300">
            Peak: 9:00 PM (Dinner Rush)
          </span>
        </div>

        {/* Visual Bar Graph */}
        <div className="pt-6 pb-2 flex items-end justify-between gap-2 h-64 border-b border-stone-800 px-2">
          {hourlyData.map((slot, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono font-bold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                {slot.orders}
              </span>
              <div
                className={`w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-emerald-900 to-emerald-500 group-hover:to-amber-400 transition-all ${slot.height}`}
              />
              <span className="text-[10px] text-stone-500 font-mono mt-1">
                {slot.hour}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown & Dish Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Contribution */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <span>Category Revenue Contribution</span>
          </h3>

          <div className="space-y-3">
            {categoryStats.map(cat => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-300 font-medium">{cat.name}</span>
                  <span className="text-stone-400 font-mono">{cat.percentage}% ({formatINR(cat.amount)})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Culinary Dishes */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Top Revenue Generating Dishes</span>
          </h3>

          <div className="divide-y divide-stone-800/80">
            {menuItems.slice(0, 5).map(dish => (
              <div key={dish.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-stone-200">{dish.name}</h4>
                    <span className="text-[10px] text-stone-400">{formatINR(dish.price)} per portion</span>
                  </div>
                </div>

                <span className="font-mono text-emerald-400 font-semibold">
                  {formatINR(dish.price * 8)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
