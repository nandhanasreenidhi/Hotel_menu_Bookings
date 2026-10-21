import React, { useState } from 'react';
import { Order } from '../../../types';
import { X, AlertCircle, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RejectReasonModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (orderId: string, reason: string) => void;
}

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirmReject,
}) => {
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen || !order) return null;

  const cannedReasons = [
    'Key ingredient is 86’d / out of stock in kitchen',
    'Kitchen at maximum capacity; extended delay',
    'Customer requested cancellation at table',
    'Special dietary modification cannot be accommodated',
    'Table requested bill / vacated',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A rejection reason is strictly required for staff transparency.');
      return;
    }
    onConfirmReject(order.id, reason.trim());
    setReason('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl shadow-2xl p-6 z-10 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-800">
                <Ban className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Reject Order {order.orderNumber}
                </h3>
                <span className="text-xs text-stone-400">
                  Table {order.tableNumber} • {order.items.length} items
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            Please provide a concise reason. This explanation will be logged and communicated to the customer on their live tracking ticket.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quick Canned Suggestions */}
            <div>
              <span className="text-[11px] font-semibold text-stone-400 block mb-1.5 uppercase tracking-wide">
                Quick Preset Reasons
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {cannedReasons.map((cr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setReason(cr);
                      setError('');
                    }}
                    className={`w-full text-left text-[11px] p-2 rounded-xl border transition-all ${
                      reason === cr
                        ? 'border-rose-500 bg-rose-950/50 text-rose-200'
                        : 'border-stone-800 bg-stone-800/60 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {cr}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Reason Textarea */}
            <div>
              <label className="text-[11px] font-semibold text-stone-400 block mb-1 uppercase tracking-wide">
                Custom Explanation
              </label>
              <textarea
                value={reason}
                onChange={e => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                rows={2}
                placeholder="Type specific explanation here..."
                className="w-full text-xs p-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-hidden focus:border-rose-500 transition-colors resize-none"
              />
              {error && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md active:scale-95 transition-all"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
