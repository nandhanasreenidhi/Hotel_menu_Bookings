import React from 'react';
import { Order, PaymentMethod, PaymentStatus } from '../../../types';
import { formatINR, formatDateTime, formatElapsedDuration } from '../../../lib/utils';
import { DietaryBadge } from '../../../components/common/DietaryBadge';
import { StatusBadge, PaymentBadge } from '../../../components/common/StatusBadge';
import { 
  X, 
  Clock, 
  User, 
  Phone, 
  Receipt, 
  CreditCard, 
  MessageSquare, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePayment: (orderId: string, status: PaymentStatus, method?: PaymentMethod) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdatePayment,
}) => {
  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl max-h-[90vh] bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center font-serif font-bold text-emerald-400 text-lg">
                T{order.tableNumber}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {order.orderNumber}
                  </h3>
                  <StatusBadge status={order.status} size="sm" />
                </div>
                <span className="text-xs text-stone-400">
                  {formatDateTime(order.createdAt)} • {formatElapsedDuration(order.createdAt)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-5 text-xs text-stone-300">
            {/* Guest & Server Info */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-semibold">Customer</span>
                <span className="font-bold text-white text-sm">{order.customerName || 'Guest'}</span>
                {order.customerPhone && (
                  <span className="text-stone-400 block mt-0.5">{order.customerPhone}</span>
                )}
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-semibold">Assigned Staff</span>
                <span className="font-bold text-white text-sm">{order.waiterName || 'Table Crew'}</span>
                <span className="text-stone-400 block mt-0.5">{order.guestCount || 2} Guests</span>
              </div>
            </div>

            {/* Special Instructions */}
            {order.specialNotes && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200">
                <span className="font-bold block text-[11px] mb-0.5">Dining Notes from Table:</span>
                <p className="italic">{order.specialNotes}</p>
              </div>
            )}

            {/* Rejection notice if any */}
            {order.rejectionReason && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300">
                <span className="font-bold block text-[11px] mb-0.5">Rejection Log:</span>
                <p>{order.rejectionReason}</p>
              </div>
            )}

            {/* Itemized List */}
            <div>
              <span className="font-bold text-stone-400 uppercase tracking-wider block mb-2 text-[11px]">
                Ordered Dishes ({order.items.reduce((s, i) => s + i.quantity, 0)})
              </span>
              <div className="divide-y divide-stone-800/80 border border-stone-800 rounded-2xl overflow-hidden bg-stone-950/40">
                {order.items.map(item => (
                  <div key={item.id} className="p-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <DietaryBadge type={item.dietary} />
                        <span className="font-bold text-white">
                          {item.quantity} × {item.name}
                        </span>
                      </div>
                      {item.spiceLevel && (
                        <span className="text-[11px] text-amber-400 capitalize block mt-0.5 ml-6">
                          {item.spiceLevel} spice
                        </span>
                      )}
                      {item.specialInstructions && (
                        <span className="text-[11px] text-stone-400 italic block mt-0.5 ml-6">
                          "{item.specialInstructions}"
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-stone-200">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-1.5 text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-stone-200">{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax</span>
                <span>{formatINR(order.tax)}</span>
              </div>
              {order.serviceCharge > 0 && (
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span>{formatINR(order.serviceCharge)}</span>
                </div>
              )}
              <div className="border-t border-stone-800 pt-2 flex justify-between items-baseline text-white font-bold text-sm">
                <span>Total Amount</span>
                <span className="font-mono text-emerald-400 text-base">{formatINR(order.total)}</span>
              </div>
            </div>

            {/* Payment Status & Quick Toggle */}
            <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">Payment State</span>
                <div className="flex items-center gap-2 mt-1">
                  <PaymentBadge status={order.paymentStatus} size="md" />
                  <span className="text-stone-400 text-[11px] capitalize">
                    via {order.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {order.paymentStatus !== 'paid' ? (
                <button
                  onClick={() => onUpdatePayment(order.id, 'paid', 'counter_cash')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Mark Paid (Settled)
                </button>
              ) : (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Settled at Counter
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
