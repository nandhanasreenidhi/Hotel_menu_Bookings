import React from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { formatINR } from '../../../lib/utils';
import { DietaryBadge } from '../../../components/common/DietaryBadge';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-stone-200"
          >
            {/* Drawer Header */}
            <div className="p-5 bg-gradient-to-r from-[#132E22] to-[#1C4432] text-white flex items-center justify-between border-b border-emerald-900 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold leading-tight">
                    Your Dining Order
                  </h2>
                  <span className="text-xs text-emerald-200">
                    Table {activeTableCode} • {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={() => clearCart()}
                    className="text-[11px] text-stone-300 hover:text-white underline underline-offset-2 px-2 py-1"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                  <div className="w-16 h-16 rounded-full bg-stone-200/70 flex items-center justify-center mb-3 text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-800">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mt-1">
                    Explore our artisanal tandoor and royal curries, then add your favorites to place your order.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-5 px-5 py-2.5 rounded-full bg-[#132E22] text-white text-xs font-semibold shadow-sm hover:bg-emerald-900 transition-colors"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={`${item.menuItem.id}_${item.selectedSpice || 'def'}`}
                    className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex gap-3 items-start"
                  >
                    {/* Item Thumbnail */}
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-100"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <DietaryBadge type={item.menuItem.dietary} />
                        <h4 className="text-sm font-bold text-stone-900 truncate">
                          {item.menuItem.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1">
                        {item.selectedSpice && (
                          <span className="capitalize text-amber-700 font-medium">
                            • {item.selectedSpice} spice
                          </span>
                        )}
                        <span>• {formatINR(item.menuItem.price)} each</span>
                      </div>

                      {item.specialInstructions && (
                        <p className="text-[11px] text-stone-600 bg-stone-50 p-1.5 rounded-lg border border-stone-200/60 mb-2 italic">
                          "{item.specialInstructions}"
                        </p>
                      )}

                      {/* Stepper & Price */}
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center rounded-xl bg-stone-100 p-0.5 border border-stone-200">
                          <button
                            onClick={() => updateCartQuantity(item.menuItem.id, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white text-stone-700 active:scale-90 transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.menuItem.id, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white text-stone-700 active:scale-90 transition-all"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-serif font-bold text-emerald-950">
                            {formatINR(item.menuItem.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.menuItem.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bill Summary & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-5 bg-white border-t border-stone-200 space-y-3 shrink-0 shadow-lg">
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">{formatINR(cartSubtotal)}</span>
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
                  <div className="border-t border-stone-200 pt-2 flex justify-between items-baseline font-bold text-base text-stone-950">
                    <span className="font-serif">To Pay</span>
                    <span className="font-serif text-lg text-emerald-900">{formatINR(cartTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#132E22] hover:bg-emerald-900 text-white font-bold text-sm tracking-wide shadow-md active:scale-[0.99] transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Proceed to Checkout</span>
                  </div>
                  <div className="flex items-center gap-1">
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
