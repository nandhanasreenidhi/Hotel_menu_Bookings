import React, { useState } from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { PaymentMethod } from '../../../types';
import { formatINR } from '../../../lib/utils';
import { 
  X, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  User,
  Phone,
  Users,
  UtensilsCrossed
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableCode: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, tableCode }) => {
  const { cart, cartTotal, createOrder } = useRestaurant();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online_upi');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    // Simulate subtle 600ms order placement processing
    setTimeout(() => {
      const order = createOrder({
        tableCode,
        customerName: customerName.trim() || 'Guest Diner',
        customerPhone: customerPhone.trim(),
        guestCount,
        paymentMethod,
        specialNotes: specialNotes.trim(),
      });

      setIsSubmitting(false);

      if (order) {
        setCreatedOrderId(order.id);
        setIsSuccess(true);

        // Fire celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#132E22', '#C5A880', '#10B981', '#F59E0B'],
        });

        // Navigate to track order screen after 1.4s
        setTimeout(() => {
          onClose();
          navigate(`/track/${order.id}`);
        }, 1400);
      }
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isSubmitting && !isSuccess ? onClose : undefined}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 z-10"
        >
          {isSuccess ? (
            /* Success State */
            <div className="p-8 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="w-18 h-18 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Order Sent to Kitchen!
              </h2>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                Your order is confirmed for <strong className="text-stone-900">Table {tableCode}</strong>. Our staff and chefs have received your tickets.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 text-xs font-mono">
                Order ID: {createdOrderId}
              </div>
              <p className="text-[11px] text-stone-400">
                Redirecting you to live order tracking...
              </p>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-[#132E22] to-[#1C4432] text-white flex items-center justify-between border-b border-emerald-900">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Confirm Dining Order</span>
                  </div>
                  <h3 className="text-base font-serif font-bold">
                    Table {tableCode} Checkout
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-800">
                {/* Guest Details */}
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                    Guest Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Your Name (Optional)
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="e.g. Arjun"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Phone (For WhatsApp Receipt)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Number of Guests at Table
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 6, 8].map(count => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setGuestCount(count)}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            guestCount === count
                              ? 'bg-emerald-950 text-white border-emerald-950'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <h4 className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                    Payment Preference
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online_upi')}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        paymentMethod === 'online_upi'
                          ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-emerald-700 text-white shrink-0 mt-0.5">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 text-xs">
                          Pay Online (Instant)
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                          UPI, GPay, PhonePe, Cards (Simulated Phase 1)
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('counter_cash')}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        paymentMethod === 'counter_cash'
                          ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-amber-600 text-white shrink-0 mt-0.5">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 text-xs">
                          Pay at Counter / Waiter
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                          Pay with Cash, Card, or UPI when dining concludes
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Table Notes */}
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Special Occasion or Dining Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={e => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Birthday celebration, please serve water first"
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                {/* Demo Disclaimer */}
                <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-2.5 text-amber-900 text-[11px] leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Phase 1 Demo Notice:</strong> No real payment gateway is hooked up yet. Submitting will immediately dispatch your order tickets to the Waiter Dashboard and Kitchen Display in real-time.
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-4 shrink-0">
                <div>
                  <span className="text-[11px] text-stone-500 block">Total Due</span>
                  <span className="text-xl font-serif font-bold text-emerald-950">
                    {formatINR(cartTotal)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 rounded-2xl bg-[#132E22] hover:bg-emerald-900 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <UtensilsCrossed className="w-4 h-4 text-amber-300" />
                      <span>Place Dine-in Order</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
