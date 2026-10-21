import React, { useState } from 'react';
import { Order } from '../../../types';
import { getElapsedMinutes, formatDateTime } from '../../../lib/utils';
import { DietaryBadge } from '../../../components/common/DietaryBadge';
import { 
  Clock, 
  Flame, 
  Check, 
  ChefHat, 
  Sparkles, 
  AlertTriangle,
  CheckSquare,
  Square
} from 'lucide-react';
import { motion } from 'motion/react';

interface KitchenTicketProps {
  order: Order;
  onStartPreparing: (orderId: string) => void;
  onMarkReady: (orderId: string) => void;
}

export const KitchenTicket: React.FC<KitchenTicketProps> = ({
  order,
  onStartPreparing,
  onMarkReady,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItemChecked = (itemId: string) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const elapsedMins = getElapsedMinutes(order.acceptedAt || order.createdAt);
  const isOverdue = elapsedMins >= 20;
  const isWarning = elapsedMins >= 14 && elapsedMins < 20;

  const isPreparing = order.status === 'preparing';
  const isReady = order.status === 'ready';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-md ${
        isReady
          ? 'bg-emerald-950/30 border-emerald-700/80'
          : isOverdue
          ? 'bg-rose-950/30 border-rose-600/80 shadow-rose-950/40 ring-1 ring-rose-600/50'
          : isPreparing
          ? 'bg-amber-950/20 border-amber-600/80 ring-1 ring-amber-500/30'
          : 'bg-stone-900 border-stone-800'
      }`}
    >
      <div>
        {/* Ticket Header */}
        <div
          className={`p-3.5 border-b flex items-center justify-between gap-2 ${
            isReady
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : isOverdue
              ? 'bg-rose-950/80 border-rose-800 text-rose-200'
              : isPreparing
              ? 'bg-amber-950/60 border-amber-800 text-amber-200'
              : 'bg-stone-950 border-stone-800 text-stone-200'
          }`}
        >
          {/* Table Number */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-black/60 font-serif font-black text-lg text-white tracking-wider border border-white/10">
              T-{order.tableNumber}
            </span>
            <div>
              <span className="font-mono text-xs font-bold block text-white">
                {order.orderNumber}
              </span>
              <span className="text-[10px] opacity-75">
                {formatDateTime(order.acceptedAt || order.createdAt)}
              </span>
            </div>
          </div>

          {/* Elapsed Timer Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
              isOverdue
                ? 'bg-rose-600 text-white animate-pulse'
                : isWarning
                ? 'bg-amber-500 text-stone-950 font-black'
                : 'bg-stone-800 text-stone-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{elapsedMins}m</span>
            {isOverdue && <span className="text-[10px] uppercase tracking-wider font-sans">DELAY</span>}
          </div>
        </div>

        {/* Customer Dining Notes if any */}
        {order.specialNotes && (
          <div className="px-3.5 py-1.5 bg-black/30 border-b border-stone-800 text-[11px] text-amber-300 italic flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{order.specialNotes}</span>
          </div>
        )}

        {/* Kitchen Dishes Checklist */}
        <div className="p-3.5 space-y-2">
          {order.items.map(item => {
            const isDone = checkedItems[item.id];

            return (
              <div
                key={item.id}
                onClick={() => toggleItemChecked(item.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                  isDone
                    ? 'bg-stone-950/40 border-stone-800/50 opacity-40 line-through'
                    : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="mt-0.5 text-stone-400">
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-stone-800 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {item.quantity}×
                    </span>
                    <span className="font-bold text-sm text-white truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1 ml-8 text-[11px]">
                    <DietaryBadge type={item.dietary} />
                    {item.spiceLevel && (
                      <span className="text-amber-400 capitalize font-medium flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {item.spiceLevel}
                      </span>
                    )}
                  </div>

                  {item.specialInstructions && (
                    <div className="mt-1 ml-8 p-1.5 rounded-lg bg-amber-950/40 border border-amber-900/60 text-amber-200 text-[11px] font-semibold">
                      INSTRUCTION: {item.specialInstructions}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between gap-2">
        <span className="text-[11px] text-stone-400 font-medium">
          {order.items.reduce((s, i) => s + i.quantity, 0)} total portions
        </span>

        {order.status === 'accepted' && (
          <button
            onClick={() => onStartPreparing(order.id)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <ChefHat className="w-4 h-4" />
            <span>Start Cooking</span>
          </button>
        )}

        {order.status === 'preparing' && (
          <button
            onClick={() => onMarkReady(order.id)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all animate-pulse"
          >
            <Sparkles className="w-4 h-4" />
            <span>Plated & Ready</span>
          </button>
        )}

        {order.status === 'ready' && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold text-xs flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Ready for Waiter</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
