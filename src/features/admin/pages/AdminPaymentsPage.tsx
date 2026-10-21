import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { Order, PaymentStatus, PaymentMethod } from '../../../types';
import { formatINR, formatDateTime } from '../../../lib/utils';
import { StatusBadge, PaymentBadge } from '../../../components/common/StatusBadge';
import { OrderDetailsModal } from '../../staff/components/OrderDetailsModal';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Receipt, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Calendar
} from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const { orders, updatePaymentStatus } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      if (statusFilter !== 'all' && ord.paymentStatus !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ord.orderNumber.toLowerCase().includes(q) ||
          `table ${ord.tableNumber}`.toLowerCase().includes(q) ||
          (ord.customerName || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const totalCollected = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const totalPending = orders
    .filter(o => o.paymentStatus === 'pending')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Orders, Invoices & Payment Ledger
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Track customer payments, settle bills at the host desk, and inspect transaction logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs">
            <span className="text-[10px] text-emerald-400 block font-semibold uppercase">Settled (Paid)</span>
            <span className="text-base font-serif font-bold text-white">{formatINR(totalCollected)}</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-amber-950/60 border border-amber-800 text-xs">
            <span className="text-[10px] text-amber-400 block font-semibold uppercase">Pending at Counter</span>
            <span className="text-base font-serif font-bold text-white">{formatINR(totalPending)}</span>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-2.5 text-xs text-stone-400">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <div>
          <strong>Phase 1 Mock Ledger:</strong> Online payments and counter settlements are mock transactions for operational testing. Real Razorpay/Stripe integration will connect in Phase 2.
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-stone-700 text-white'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            All Transactions ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'paid'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            Paid / Settled
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            Pending
          </button>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search order reference, table, diner..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-stone-900/90 border border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-stone-400 bg-stone-950/80 border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Table</th>
                <th className="py-3 px-4">Diner</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4">Dining Status</th>
                <th className="py-3 px-4">Payment State</th>
                <th className="py-3 px-4 text-right">Bill Total</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredOrders.map(ord => (
                <tr key={ord.id} className="hover:bg-stone-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-white block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {formatDateTime(ord.createdAt)}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-200 font-mono font-semibold">
                      T-{ord.tableNumber}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-stone-300">
                    {ord.customerName || 'Guest'}
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-stone-200 block capitalize font-medium">
                      {ord.paymentMethod.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      REF-{ord.id.substring(4, 12).toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={ord.status} size="sm" />
                  </td>

                  <td className="py-3 px-4">
                    <PaymentBadge status={ord.paymentStatus} size="sm" />
                  </td>

                  <td className="py-3 px-4 text-right font-serif font-bold text-white text-sm">
                    {formatINR(ord.total)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs flex items-center gap-1"
                        title="View Receipt"
                      >
                        <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Receipt</span>
                      </button>

                      {ord.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => updatePaymentStatus(ord.id, 'paid', 'counter_cash')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                          title="Settle bill"
                        >
                          Settle
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Receipt Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdatePayment={updatePaymentStatus}
      />
    </div>
  );
};
