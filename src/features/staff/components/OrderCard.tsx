import React from 'react';
import { Order } from '../../../types';
import { formatINR, formatDateTime, formatElapsedDuration } from '../../../lib/utils';
import { DietaryBadge } from '../../../components/common/DietaryBadge';
import { StatusBadge, PaymentBadge } from '../../../components/common/StatusBadge';
import {
  Check,
  X,
  ChefHat,
  Send,
  Sparkles,
  Clock,
  Eye,
  CheckCircle2,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface OrderCardProps {
  order: Order;
  onAccept: (orderId: string) => void;
  onRejectPrompt: (order: Order) => void;
  onSendToKitchen: (orderId: string) => void;
  onMarkServed: (orderId: string) => void;
  onViewDetails: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onAccept,
  onRejectPrompt,
  onSendToKitchen,
  onMarkServed,
  onViewDetails,
}) => {
  const isNew = order.status === 'placed';
  const totalItemsCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${isNew
          ? 'bg-stone-900 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
          : 'bg-stone-900/90 border-stone-800 shadow-sm hover:border-stone-700'
        }`}
    >
      <div>
        {/* Card Header */}
        <div className="p-4 bg-stone-950/70 border-b border-stone-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Table Number Pill */}
            <div className="w-10 h-10 rounded-xl bg-[#132E22] border border-emerald-600/50 flex flex-col items-center justify-center text-emerald-300 font-bold leading-none shadow-xs">
              <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono">TBL</span>
              <span className="text-sm font-serif font-black">{order.tableNumber}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-stone-200">
                  {order.orderNumber}
                </span>
                <StatusBadge status={order.status} size="sm" />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                <Clock className="w-3 h-3 text-stone-500" />
                <span>{formatDateTime(order.createdAt)}</span>
                <span>•</span>
                <span className="text-amber-400/90 font-medium">{formatElapsedDuration(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <PaymentBadge status={order.paymentStatus} size="sm" />
        </div>

        {/* Customer & Guest Notes */}
        {(order.customerName || order.specialNotes) && (
          <div className="px-4 py-2 bg-stone-950/30 border-b border-stone-800/50 flex items-center justify-between text-[11px] text-stone-400">
            <span>Guest: <strong className="text-stone-300">{order.customerName || 'Diner'}</strong> ({order.guestCount || 2} guests)</span>
            {order.specialNotes && (
              <span className="truncate max-w-[180px] text-amber-300/80 italic flex items-center gap-1" title={order.specialNotes}>
                <MessageSquare className="w-3 h-3 shrink-0" />
                {order.specialNotes}
              </span>
            )}
          </div>
        )}

        {/* Ordered Items Preview */}
        <div className="p-4 space-y-2">
          <div className="divide-y divide-stone-800/60">
            {order.items.slice(0, 4).map(item => (
              <div key={item.id} className="py-1.5 flex items-start justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <DietaryBadge type={item.dietary} />
                  <span className="font-medium text-stone-200 truncate">
                    <strong className="text-white mr-1.5">{item.quantity}×</strong>
                    {item.name}
                  </span>
                </div>
                <span className="font-mono text-stone-400 text-[11px] shrink-0">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {order.items.length > 4 && (
            <p className="text-[11px] text-stone-500 text-center pt-1 font-medium">
              +{order.items.length - 4} more items...
            </p>
          )}

          {/* Rejection notice if rejected */}
          {order.rejectionReason && (
            <div className="mt-2 p-2 rounded-lg bg-rose-950/30 border border-rose-900/60 text-rose-300 text-[11px] flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Reason: {order.rejectionReason}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-stone-950/50 border-t border-stone-800 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-stone-500 block uppercase font-semibold">Total ({totalItemsCount} items)</span>
          <span className="text-base font-serif font-bold text-white">
            {formatINR(order.total)}
          </span>
        </div>

        {/* Dynamic Contextual Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onViewDetails(order)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            title="View Full Ticket Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {order.status === 'placed' && (
            <>
              <button
                onClick={() => onRejectPrompt(order)}
                className="px-3 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900/90 text-rose-300 border border-rose-800/80 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
              <button
                onClick={() => onAccept(order.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Accept</span>
              </button>
            </>
          )}
          {order.status === 'accepted' && !order.sentToKitchenAt && (
            <button
              onClick={() => onSendToKitchen(order.id)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <ChefHat className="w-4 h-4" />
              <span>Send to Kitchen</span>
            </button>
          )}

          {order.status === 'accepted' && order.sentToKitchenAt && (
            <div className="px-3 py-2 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-300 font-semibold text-xs flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Sent to Kitchen · Awaiting Chef</span>
            </div>
          )}

          {order.status === 'preparing' && (
            <div className="px-3 py-2 rounded-xl bg-stone-800/80 border border-stone-700 text-amber-400 font-semibold text-xs flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 animate-pulse" />
              <span>Cooking in Kitchen</span>
            </div>
          )}

          {order.status === 'ready' && (
            <button
              onClick={() => onMarkServed(order.id)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              <span>Mark Served</span>
            </button>
          )}

          {order.status === 'served' && (
            <div className="px-3 py-2 rounded-xl bg-teal-950/60 border border-teal-800 text-teal-300 font-semibold text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Served</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
