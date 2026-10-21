import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { Order, OrderStatus } from '../../../types';
import { OrderCard } from '../components/OrderCard';
import { RejectReasonModal } from '../components/RejectReasonModal';
import { OrderDetailsModal } from '../components/OrderDetailsModal';
import { 
  Search, 
  ConciergeBell, 
  Filter, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw,
  Layers
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export const WaiterDashboardPage: React.FC = () => {
  const {
    orders,
    tables,
    acceptOrder,
    rejectOrder,
    startPreparingOrder,
    markOrderServed,
    updatePaymentStatus,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTableFilter, setSelectedTableFilter] = useState<string>('all');
  const [selectedOrderForReject, setSelectedOrderForReject] = useState<Order | null>(null);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);

  // Status counts for badge tabs
  const counts = useMemo(() => {
    return {
      all: orders.length,
      placed: orders.filter(o => o.status === 'placed').length,
      accepted: orders.filter(o => o.status === 'accepted').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      served: orders.filter(o => o.status === 'served').length,
      rejected: orders.filter(o => o.status === 'rejected').length,
    };
  }, [orders]);

  // Filtered & sorted orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Tab filter
      if (activeTab !== 'all' && order.status !== activeTab) {
        return false;
      }
      // Table filter
      if (selectedTableFilter !== 'all' && order.tableCode !== selectedTableFilter && order.tableNumber !== selectedTableFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = order.orderNumber.toLowerCase().includes(q);
        const matchTable = `table ${order.tableNumber}`.toLowerCase().includes(q);
        const matchCust = (order.customerName || '').toLowerCase().includes(q);
        const matchItem = order.items.some(i => i.name.toLowerCase().includes(q));
        if (!matchNumber && !matchTable && !matchCust && !matchItem) return false;
      }
      return true;
    });
  }, [orders, activeTab, selectedTableFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0C1118] text-stone-100 pb-20">
      {/* Top Operations Header */}
      <header className="bg-[#101722] border-b border-stone-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <ConciergeBell className="w-4 h-4" />
              <span>Service Operations</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
              Waiter Dispatch & Table Orders
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Review live table requests, dispatch tickets to kitchen, and manage dining service.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 md:pb-0">
            <div className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-center shrink-0">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">New Orders</span>
              <span className={`text-lg font-bold font-mono ${counts.placed > 0 ? 'text-amber-400' : 'text-stone-300'}`}>
                {counts.placed}
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-center shrink-0">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">In Cooking</span>
              <span className="text-lg font-bold font-mono text-indigo-400">
                {counts.preparing}
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-center shrink-0">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Ready to Serve</span>
              <span className={`text-lg font-bold font-mono ${counts.ready > 0 ? 'text-emerald-400 animate-pulse' : 'text-stone-300'}`}>
                {counts.ready}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Filter and Status Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'all'
                ? 'bg-stone-700 text-white shadow-xs'
                : 'bg-stone-900/80 text-stone-400 hover:bg-stone-800 hover:text-stone-200 border border-stone-800'
            }`}
          >
            All Tickets ({counts.all})
          </button>

          <button
            onClick={() => setActiveTab('placed')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              activeTab === 'placed'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-900/80 text-amber-400 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>New Orders ({counts.placed})</span>
          </button>

          <button
            onClick={() => setActiveTab('accepted')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'accepted'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            Accepted ({counts.accepted})
          </button>

          <button
            onClick={() => setActiveTab('preparing')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'preparing'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            In Kitchen ({counts.preparing})
          </button>

          <button
            onClick={() => setActiveTab('ready')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              activeTab === 'ready'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-900/80 text-emerald-400 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to Serve ({counts.ready})</span>
          </button>

          <button
            onClick={() => setActiveTab('served')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'served'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-stone-900/80 text-stone-400 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            Served ({counts.served})
          </button>

          {counts.rejected > 0 && (
            <button
              onClick={() => setActiveTab('rejected')}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'rejected'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-stone-900/80 text-rose-400 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              Rejected ({counts.rejected})
            </button>
          )}
        </div>

        {/* Search & Table Selectors */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by order #, table number, customer name, or dish..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs">
              <span className="text-stone-400">Filter Table:</span>
              <select
                value={selectedTableFilter}
                onChange={e => setSelectedTableFilter(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="all" className="bg-stone-900">All Tables</option>
                {tables.map(t => (
                  <option key={t.id} value={t.code} className="bg-stone-900">
                    Table {t.tableNumber} ({t.section})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center bg-stone-900/50 rounded-3xl border border-stone-800/80 p-8">
            <CheckCircle2 className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Orders in this View</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
              There are currently no orders matching your selected status or filter parameters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAccept={acceptOrder}
                  onRejectPrompt={setSelectedOrderForReject}
                  onSendToKitchen={startPreparingOrder}
                  onMarkServed={markOrderServed}
                  onViewDetails={setSelectedOrderForDetails}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Rejection Modal */}
      <RejectReasonModal
        order={selectedOrderForReject}
        isOpen={!!selectedOrderForReject}
        onClose={() => setSelectedOrderForReject(null)}
        onConfirmReject={rejectOrder}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrderForDetails}
        isOpen={!!selectedOrderForDetails}
        onClose={() => setSelectedOrderForDetails(null)}
        onUpdatePayment={updatePaymentStatus}
      />
    </div>
  );
};
