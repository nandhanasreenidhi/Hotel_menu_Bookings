import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRestaurant } from '../../../context/RestaurantContext';
import { formatINR, formatDateTime, formatElapsedDuration } from '../../../lib/utils';
import { DietaryBadge } from '../../../components/common/DietaryBadge';
import { StatusBadge, PaymentBadge } from '../../../components/common/StatusBadge';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Bell, 
  ArrowLeft, 
  Receipt, 
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const OrderTrackPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, settings } = useRestaurant();
  const [callWaiterNotified, setCallWaiterNotified] = useState(false);

  const order = getOrderById(orderId || '');

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8DCCF] text-center shadow-lg">
          <AlertCircle className="w-12 h-12 text-[#B95D3F] mx-auto mb-3" />
          <h2 className="text-xl font-serif font-bold text-[#21140F]">Order Ticket Not Found</h2>
          <p className="text-xs text-[#7A6961] mt-2 leading-relaxed">
            We couldn't locate order reference <code className="bg-[#FAF4E9] px-1.5 py-0.5 rounded text-[#21140F] font-mono">{orderId}</code>. Please check your order ticket or return to the menu.
          </p>
          <Link
            to="/menu/T-04"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B95D3F] hover:bg-[#A64B36] text-white text-xs font-bold transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'placed', label: 'Order Received', desc: 'Sent to waitstaff for review' },
    { key: 'accepted', label: 'Waiter Confirmed', desc: 'Approved & queued for kitchen' },
    { key: 'preparing', label: 'In Kitchen', desc: 'Chefs are crafting your dishes' },
    { key: 'ready', label: 'Ready to Serve', desc: 'Plated hot & ready for table' },
    { key: 'served', label: 'Delivered', desc: 'Delivered to your table. Enjoy!' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'placed': return 0;
      case 'accepted': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'served': return 4;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isRejected = order.status === 'rejected';

  const handleCallWaiter = () => {
    setCallWaiterNotified(true);
    setTimeout(() => setCallWaiterNotified(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24 text-[#21140F]">
      {/* Top Bar with Deep Espresso */}
      <div className="bg-[#21140F] text-[#FFF7EB] px-4 py-4 border-b border-[#C69B56]/30 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            to={`/menu/${order.tableCode}`}
            className="inline-flex items-center gap-1.5 text-xs text-[#C69B56] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Add More Dishes</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[#C69B56]">
            <Sparkles className="w-3.5 h-3.5 text-[#C69B56]" />
            <span>LIVE ORDER TRACKER</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8DCCF] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-[#21140F] bg-[#FAF4E9] border border-[#E8DCCF] px-2.5 py-0.5 rounded-md">
                {order.orderNumber}
              </span>
              <StatusBadge status={order.status} />
              <PaymentBadge status={order.paymentStatus} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#21140F]">
              Table {order.tableNumber} Dining Ticket
            </h1>
            <p className="text-xs text-[#7A6961] mt-1 font-light">
              Placed at {formatDateTime(order.createdAt)} ({formatElapsedDuration(order.createdAt)})
            </p>
          </div>

          <button
            onClick={handleCallWaiter}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-[#FAF6F0] hover:bg-[#FAF4E9] text-[#21140F] text-xs font-semibold flex items-center justify-center gap-2 border border-[#E8DCCF] transition-all cursor-pointer shadow-2xs"
          >
            <Bell className="w-4 h-4 text-[#B95D3F]" />
            <span>Call Waiter to Table</span>
          </button>
        </div>

        {/* Waiter Alert Notification */}
        {callWaiterNotified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-[#FAF4E9] border border-[#C69B56]/50 text-[#21140F] text-xs flex items-center gap-2.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-[#B95D3F] shrink-0" />
            <span>
              Table staff notified! A waiter is coming over to <strong>Table {order.tableNumber}</strong>.
            </span>
          </motion.div>
        )}

        {/* Rejection Notice if rejected */}
        {isRejected && (
          <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2 text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              Order Could Not Be Accepted
            </h3>
            <p className="text-xs text-rose-700 leading-relaxed">
              Reason provided by staff: <em>"{order.rejectionReason || 'Item unavailable in kitchen'}"</em>
            </p>
            <p className="text-xs text-rose-600">
              Please check with your server or select an alternative dish from the menu.
            </p>
          </div>
        )}

        {/* Live Timeline Tracker */}
        {!isRejected && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DCCF] shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#FAF4E9]">
              <h2 className="text-base font-serif font-bold text-[#21140F] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C69B56]" />
                Live Preparation Status
              </h2>
              <span className="text-xs font-semibold text-[#21140F] bg-[#FAF4E9] px-3 py-1 rounded-full border border-[#E8DCCF]">
                Est. ~{settings.estimatedPrepTimeMinutes} mins
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DCCF]">
              {steps.map((st, idx) => {
                const isPassed = currentStep > idx;
                const isCurrent = currentStep === idx;

                return (
                  <div key={st.key} className="relative flex items-start gap-4">
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-[#B95D3F] text-white shadow-xs'
                          : isCurrent
                          ? 'bg-[#C69B56] text-[#21140F] ring-4 ring-[#FAF4E9] shadow-sm animate-pulse'
                          : 'bg-[#FAF6F0] text-[#A89890] border border-[#E8DCCF]'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          isCurrent
                            ? 'text-[#21140F]'
                            : isPassed
                            ? 'text-[#21140F]'
                            : 'text-[#A89890]'
                        }`}
                      >
                        {st.label}
                      </h4>
                      <p className="text-xs text-[#7A6961] mt-0.5 font-light">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Items & Bill Details */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8DCCF] shadow-sm space-y-4">
          <h3 className="text-base font-serif font-bold text-[#21140F] flex items-center gap-2 border-b border-[#FAF4E9] pb-3">
            <Receipt className="w-4 h-4 text-[#C69B56]" />
            Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
          </h3>

          <div className="divide-y divide-[#FAF4E9]">
            {order.items.map(item => (
              <div key={item.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <DietaryBadge type={item.dietary} />
                    <span className="font-bold text-[#21140F]">
                      {item.quantity} × {item.name}
                    </span>
                  </div>
                  {item.spiceLevel && (
                    <span className="text-[11px] text-[#B95D3F] capitalize block mt-0.5 ml-6">
                      {item.spiceLevel} spice
                    </span>
                  )}
                  {item.specialInstructions && (
                    <span className="text-[11px] text-[#7A6961] italic block mt-0.5 ml-6">
                      "{item.specialInstructions}"
                    </span>
                  )}
                </div>

                <span className="font-serif font-bold text-[#21140F] shrink-0">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-[#E8DCCF] pt-3.5 space-y-1.5 text-xs text-[#7A6961]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#21140F]">{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & GST</span>
              <span>{formatINR(order.tax)}</span>
            </div>
            {order.serviceCharge > 0 && (
              <div className="flex justify-between">
                <span>Service Charge</span>
                <span>{formatINR(order.serviceCharge)}</span>
              </div>
            )}
            <div className="border-t border-[#E8DCCF] pt-2.5 flex justify-between items-baseline font-bold text-base text-[#21140F]">
              <span className="font-serif">Total Bill</span>
              <span className="font-serif text-lg text-[#21140F]">{formatINR(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
