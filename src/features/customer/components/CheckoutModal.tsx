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
  User, 
  Phone, 
  UtensilsCrossed, 
  ShieldCheck
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

    // Subtle 500ms order placement processing
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

        // Fire celebratory warm South Indian palette confetti
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#B96E42', '#C9A25B', '#284B36', '#21150F', '#F2E5CC'],
        });

        // Navigate to track order screen after 1.4s
        setTimeout(() => {
          onClose();
          navigate(`/track/${order.id}`);
        }, 1400);
      }
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isSubmitting && !isSuccess ? onClose : undefined}
          className="absolute inset-0 bg-black/70 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-lg bg-[#FFF8EA] rounded-3xl shadow-2xl overflow-hidden border border-[#D6C29A] z-10"
        >
          {isSuccess ? (
            /* Order Confirmation State */
            <div className="p-8 sm:p-10 text-center space-y-4 bg-gradient-to-b from-[#FFF8EA] to-[#F2E5CC]">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                className="w-20 h-20 mx-auto rounded-full bg-[#ECDCB9] text-[#B96E42] border-2 border-[#C9A25B]/50 flex items-center justify-center shadow-lg"
              >
                <CheckCircle2 className="w-11 h-11 text-[#B96E42]" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#21150F]">
                Order Sent to Kitchen!
              </h2>

              <p className="text-xs sm:text-sm text-[#7A6961] max-w-sm mx-auto leading-relaxed font-light">
                Your order is placed for <strong className="text-[#21150F] font-semibold">Table {tableCode}</strong>. Our chefs and waitstaff have received your tickets.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECDCB9] border border-[#D6C29A] text-[#21150F] text-xs font-mono font-semibold shadow-xs">
                <span>Order Ref: {createdOrderId}</span>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#A89890]">
                <div className="w-2 h-2 rounded-full bg-[#B96E42] animate-ping" />
                <span>Redirecting to live order status...</span>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-5 bg-[#21150F] text-[#F2E5CC] flex items-center justify-between border-b border-[#C9A25B]/30 shadow-sm">
                <div>
                  <div className="flex items-center gap-1.5 text-[#C9A25B] text-xs font-semibold uppercase tracking-widest mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A25B]" />
                    <span>Confirm Dining Order</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#F2E5CC]">
                    Table {tableCode} Checkout
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#FFF8EA]/10 hover:bg-[#FFF8EA]/20 flex items-center justify-center text-[#F2E5CC] transition-colors cursor-pointer"
                  aria-label="Close checkout modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#21150F]">
                {/* Guest Details */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[#21150F] uppercase tracking-wider text-[11px] font-serif">
                    Guest Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#7A6961] mb-1">
                        Your Name (Optional)
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#A89890] absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="e.g. Aditi"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D6C29A] bg-[#F2E5CC] focus:bg-[#FFF8EA] focus:outline-hidden focus:ring-2 focus:ring-[#B96E42] transition-all text-[#21150F] placeholder-[#A89890]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#7A6961] mb-1">
                        Phone (For WhatsApp Bill)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#A89890] absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D6C29A] bg-[#F2E5CC] focus:bg-[#FFF8EA] focus:outline-hidden focus:ring-2 focus:ring-[#B96E42] transition-all text-[#21150F] placeholder-[#A89890]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#7A6961] mb-1.5">
                      Number of Guests at Table
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 6, 8].map(count => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setGuestCount(count)}
                          className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            guestCount === count
                              ? 'bg-[#21150F] text-[#F2E5CC] border-[#21150F] shadow-sm'
                              : 'bg-[#F2E5CC] text-[#7A6961] border-[#D6C29A] hover:bg-[#FFF8EA]'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-2 pt-2 border-t border-[#D6C29A]">
                  <h4 className="font-bold text-[#21150F] uppercase tracking-wider text-[11px] font-serif">
                    Payment Preference
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online_upi')}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        paymentMethod === 'online_upi'
                          ? 'border-[#B96E42] bg-[#ECDCB9] ring-1 ring-[#B96E42] shadow-xs'
                          : 'border-[#D6C29A] bg-[#FFF8EA] hover:bg-[#F2E5CC]'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-[#B96E42] text-white shrink-0 mt-0.5 shadow-xs">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#21150F] text-xs">
                          Pay Online (Instant)
                        </div>
                        <div className="text-[11px] text-[#7A6961] mt-0.5 leading-snug">
                          UPI, GPay, PhonePe, Cards
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('counter_cash')}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        paymentMethod === 'counter_cash'
                          ? 'border-[#B96E42] bg-[#ECDCB9] ring-1 ring-[#B96E42] shadow-xs'
                          : 'border-[#D6C29A] bg-[#FFF8EA] hover:bg-[#F2E5CC]'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-[#C9A25B] text-[#21150F] shrink-0 mt-0.5 shadow-xs">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#21150F] text-xs">
                          Pay at Counter / Waiter
                        </div>
                        <div className="text-[11px] text-[#7A6961] mt-0.5 leading-snug">
                          Cash, Card, or UPI at end of dining
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Table Notes */}
                <div>
                  <label className="block text-[11px] font-medium text-[#7A6961] mb-1">
                    Special Occasion or Dining Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={e => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Extra spicy, anniversary celebration, serve filter coffee last..."
                    className="w-full p-2.5 rounded-xl border border-[#D6C29A] bg-[#F2E5CC] focus:bg-[#FFF8EA] focus:outline-hidden focus:ring-2 focus:ring-[#B96E42] transition-all text-[#21150F] placeholder-[#A89890]"
                  />
                </div>

                {/* Notice */}
                <div className="p-3 rounded-2xl bg-[#ECDCB9] border border-[#C9A25B]/30 flex items-start gap-2.5 text-[#5E5048] text-[11px] leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-[#B96E42] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#21150F]">Live Kitchen Relay:</strong> Submitting will transmit your order to the kitchen display and waitstaff immediately.
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 border-t border-[#D6C29A] bg-[#F2E5CC] flex items-center justify-between gap-4 shrink-0">
                <div>
                  <span className="text-[10px] text-[#A89890] uppercase tracking-wider font-semibold block">Total Due</span>
                  <span className="text-xl font-serif font-bold text-[#21150F]">
                    {formatINR(cartTotal)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 rounded-full bg-[#B96E42] hover:bg-[#A55A33] active:scale-[0.98] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 border border-[#C9A25B]/30"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <UtensilsCrossed className="w-4 h-4 text-[#C9A25B]" />
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
