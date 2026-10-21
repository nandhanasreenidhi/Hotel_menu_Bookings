import React from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { formatINR, formatDateTime } from '../../../lib/utils';
import { StatusBadge, PaymentBadge } from '../../../components/common/StatusBadge';
import { 
  TrendingUp, 
  ShoppingBag, 
  UtensilsCrossed, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  Grid3X3, 
  ConciergeBell,
  ChefHat,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOverviewPage: React.FC = () => {
  const { orders, menuItems, tables, settings } = useRestaurant();

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalOrdersCount = orders.length;
  const occupiedTablesCount = tables.filter(t => t.status === 'occupied').length;
  const activeOrdersCount = orders.filter(
    o => o.status === 'placed' || o.status === 'accepted' || o.status === 'preparing' || o.status === 'ready'
  ).length;

  const topMenuItems = menuItems.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Executive Performance Dashboard</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Restaurant Operations Overview
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Live telemetry and dining throughput for {settings.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/menu"
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
            <span>Manage Menu</span>
          </Link>
          <Link
            to="/staff/orders"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <ConciergeBell className="w-3.5 h-3.5" />
            <span>Waiter Dispatch</span>
          </Link>
        </div>
      </div>

      {/* Demo Notice Alert */}
      <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-3 text-xs text-stone-400">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <div>
          <strong className="text-stone-200">Phase 1 Demo Analytics:</strong> Financial totals and customer metrics reflect your currently active mock and session-placed orders.
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Today's Gross Sales</span>
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-serif font-bold text-white">
            {formatINR(totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.2% vs previous service</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Total Orders Placed</span>
            <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/60">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {totalOrdersCount}
          </div>
          <div className="text-[11px] text-stone-400">
            {activeOrdersCount} currently in active dining flow
          </div>
        </div>

        {/* Active Dining Tables */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Table Occupancy</span>
            <span className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/60">
              <Grid3X3 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {occupiedTablesCount} <span className="text-sm font-normal text-stone-500">/ {tables.length}</span>
          </div>
          <div className="text-[11px] text-amber-400">
            {Math.round((occupiedTablesCount / (tables.length || 1)) * 100)}% dining room capacity
          </div>
        </div>

        {/* Kitchen Speed */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Avg Kitchen Prep Speed</span>
            <span className="p-1.5 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/60">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {settings.estimatedPrepTimeMinutes} <span className="text-sm font-normal text-stone-500">mins</span>
          </div>
          <div className="text-[11px] text-teal-400">
            Optimal turnaround benchmark
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-stone-900/90 border border-stone-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Live Order Stream</span>
            </h2>
            <Link
              to="/admin/payments"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              View Full History →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-stone-400 bg-stone-950/60">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-xl">Order #</th>
                  <th className="py-2.5 px-3">Table</th>
                  <th className="py-2.5 px-3">Diner</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3 text-right rounded-r-xl">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {orders.slice(0, 5).map(ord => (
                  <tr key={ord.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-mono font-semibold">
                        T-{ord.tableNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-300">
                      {ord.customerName || 'Guest'}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={ord.status} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <PaymentBadge status={ord.paymentStatus} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right font-serif font-bold text-white">
                      {formatINR(ord.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Culinary Creations (1 Col) */}
        <div className="rounded-2xl bg-stone-900/90 border border-stone-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              <span>Trending Menu Dishes</span>
            </h2>
          </div>

          <div className="space-y-3">
            {topMenuItems.map((item, index) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-stone-800 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                    #{index + 1}
                  </span>
                  <div className="truncate">
                    <h4 className="font-bold text-xs text-white truncate">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-stone-400">
                      {formatINR(item.price)} • {item.isAvailable ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-emerald-400 shrink-0">
                  Popular
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/admin/menu"
              className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-center text-xs font-semibold text-stone-200 block transition-colors"
            >
              Adjust Item Availability & Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
