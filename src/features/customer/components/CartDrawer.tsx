import React from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { formatINR } from '../../../lib/utils';
import { DietaryBadge } from '../../../components/common/DietaryBadge';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getFoodImage } from '../utils/foodImageMap';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTax,
    cartServiceCharge,
    cartTotal,
    cartCount,
    settings,
    activeTableCode,
  } = useRestaurant();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-screen max-w-md bg-[#F2E5CC] shadow-2xl flex flex-col border-l border-[#D6C29A]"
          >
            {/* Drawer Header with Deep Espresso Background */}
            <div className="p-5 bg-[#21150F] text-[#F2E5CC] flex items-center justify-between border-b border-[#C9A25B]/30 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A25B]/20 border border-[#C9A25B]/40 flex items-center justify-center text-[#C9A25B]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-bold leading-tight text-[#F2E5CC]">
                    Your Table Order
                  </h2>
                  <span className="text-xs text-[#EBD9B6]">
                    Table {activeTableCode} • {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={() => clearCart()}
                    className="text-[11px] text-[#C9A25B] hover:text-white underline underline-offset-2 px-2 py-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#FFF8EA]/10 hover:bg-[#FFF8EA]/20 flex items-center justify-center text-[#F2E5CC] transition-colors cursor-pointer"
                  aria-label="Close cart drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7A6961]">
                  <div className="w-16 h-16 rounded-full bg-[#ECDCB9] border border-[#D6C29A] flex items-center justify-center mb-3.5 text-[#C9A25B]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#21150F]">
                    Your table order is empty
                  </h3>
                  <p className="text-xs text-[#7A6961] max-w-xs mt-1 leading-relaxed">
                    Explore crisp dosas, fluffy idlis, slow-simmered curries, and tumblers of filter coffee.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 rounded-full bg-[#B96E42] hover:bg-[#A55A33] text-white text-xs font-bold tracking-wide shadow-sm transition-all cursor-pointer"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                cart.map(item => {
                  const itemImg = getFoodImage(item.menuItem);
                  return (
                    <div
                      key={`${item.menuItem.id}_${item.selectedSpice || 'def'}`}
                      className="p-3.5 rounded-2xl bg-[#FFF8EA] border border-[#D6C29A] shadow-xs flex gap-3 items-start"
                    >
                      {/* Item Thumbnail */}
                      <img
                        src={itemImg}
                        alt={item.menuItem.name}
                        className="w-16 h-16 rounded-full object-cover shrink-0 border border-[#D6C29A]"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <DietaryBadge type={item.menuItem.dietary} />
                          <h4 className="text-sm font-serif font-bold text-[#21150F] truncate">
                            {item.menuItem.name}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-[#7A6961] mb-1">
                          {item.selectedSpice && (
                            <span className="capitalize text-[#B96E42] font-semibold">
                              • {item.selectedSpice}
                            </span>
                          )}
                          <span>• {formatINR(item.menuItem.price)} each</span>
                        </div>

                        {item.specialInstructions && (
                          <p className="text-[11px] text-[#5E5048] bg-[#F2E5CC] p-1.5 rounded-lg border border-[#D6C29A] mb-2 italic">
                            "{item.specialInstructions}"
                          </p>
                        )}

                        {/* Stepper & Price */}
                        <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-[#ECDCB9]">
                          <div className="flex items-center rounded-full bg-[#F2E5CC] p-0.5 border border-[#D6C29A]">
                            <button
                              onClick={() => updateCartQuantity(item.menuItem.id, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#FFF8EA] text-[#21150F] active:scale-90 transition-all cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold font-mono text-[#21150F]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.menuItem.id, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#FFF8EA] text-[#21150F] active:scale-90 transition-all cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-serif font-bold text-[#21150F]">
                              {formatINR(item.menuItem.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.menuItem.id)}
                              className="text-[#A89890] hover:text-[#B96E42] p-1 transition-colors cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bill Summary & Proceed to Order */}
            {cart.length > 0 && (
              <div className="p-5 bg-[#FFF8EA] border-t border-[#D6C29A] space-y-3 shrink-0 shadow-lg">
                <div className="space-y-1.5 text-xs text-[#7A6961]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#21150F]">{formatINR(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({settings.gstPercentage}%)</span>
                    <span>{formatINR(cartTax)}</span>
                  </div>
                  {settings.isServiceChargeEnabled && (
                    <div className="flex justify-between">
                      <span>Service Charge ({settings.serviceChargePercentage}%)</span>
                      <span>{formatINR(cartServiceCharge)}</span>
                    </div>
                  )}
                  <div className="border-t border-[#D6C29A] pt-2 flex justify-between items-baseline font-bold text-base text-[#21150F]">
                    <span className="font-serif">Total Due</span>
                    <span className="font-serif text-lg text-[#21150F]">{formatINR(cartTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full py-3.5 px-4 rounded-full bg-[#B96E42] hover:bg-[#A55A33] text-white font-bold text-sm tracking-wide shadow-md shadow-[#B96E42]/30 active:scale-[0.99] transition-all flex items-center justify-between cursor-pointer border border-[#C9A25B]/30"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C9A25B]" />
                    <span>Proceed to Order</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-serif">
                    <span>{formatINR(cartTotal)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
