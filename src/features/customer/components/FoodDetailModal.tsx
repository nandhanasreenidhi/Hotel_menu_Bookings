import React, { useState } from 'react';
import { MenuItem, SpiceLevel } from '../../../types';
import { formatINR } from '../../../lib/utils';
import { DietaryBadge } from '../../../components/common/DietaryBadge';
import { X, Flame, Clock, Plus, Minus, Sparkles, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getFoodImage } from '../utils/foodImageMap';

interface FoodDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: MenuItem, options: { spice?: SpiceLevel; instructions?: string; quantity: number }) => void;
}

const FoodDetailModalInner: React.FC<{
  item: MenuItem;
  onClose: () => void;
  onAdd: (item: MenuItem, options: { spice?: SpiceLevel; instructions?: string; quantity: number }) => void;
}> = ({ item, onClose, onAdd }) => {
  // Spice is optional: starts at the dish's own level (if it has one) and can be cleared by tapping it again.
  const [spice, setSpice] = useState<SpiceLevel | undefined>(item.spiceLevel);
  const [instructions, setInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const imageUrl = getFoodImage(item);

  const handleAdd = () => {
    onAdd(item, { spice, instructions, quantity });
    onClose();
  };

  const spiceOptions: { level: SpiceLevel; label: string; iconCount: number }[] = [
    { level: 'mild', label: 'Mild', iconCount: 1 },
    { level: 'medium', label: 'Medium', iconCount: 2 },
    { level: 'spicy', label: 'Spicy', iconCount: 3 },
    { level: 'extra-spicy', label: 'Fiery', iconCount: 4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: 'spring', damping: 26, stiffness: 320 }}
      className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#FFF8EA] rounded-3xl shadow-2xl overflow-hidden border border-[#D6C29A] z-10"
    >
      {/* Header Image with High Impact Photography */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-[#ECDCB9] overflow-hidden shrink-0">
        <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer border border-white/10"
          aria-label="Close dish details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <DietaryBadge type={item.dietary} showLabel />
              {item.isChefSpecial && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C9A25B] text-[#21150F]">
                  <Sparkles className="w-3 h-3 text-[#21150F]" />
                  Chef's Special
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold leading-tight text-[#F2E5CC]">
              {item.name}
            </h2>
          </div>
          <span className="text-xl sm:text-2xl font-serif font-bold text-[#C9A25B] shrink-0">
            {formatINR(item.price)}
          </span>
        </div>
      </div>

      {/* Modal Scrollable Body */}
      <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-[#21150F]">
        {/* Description */}
        <p className="text-xs sm:text-sm text-[#7A6961] leading-relaxed font-light">
          {item.description}
        </p>

        {/* Quick Specs (hidden entirely when the dish has no prep time / calories / allergens on record) */}
        {(item.preparationTimeMinutes > 0 || !!item.calories || (item.allergens?.length ?? 0) > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-[#F2E5CC] border border-[#D6C29A] text-xs">
          {item.preparationTimeMinutes > 0 && (
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#C9A25B]" />
            <div>
              <span className="text-[#A89890] block text-[10px] uppercase tracking-wider font-semibold">Prep Time</span>
              <span className="font-semibold text-[#21150F]">{item.preparationTimeMinutes} mins</span>
            </div>
          </div>
          )}

          {item.calories && (
            <div className="flex items-center gap-2.5">
              <ChefHat className="w-4 h-4 text-[#B96E42]" />
              <div>
                <span className="text-[#A89890] block text-[10px] uppercase tracking-wider font-semibold">Energy</span>
                <span className="font-semibold text-[#21150F]">{item.calories} kcal</span>
              </div>
            </div>
          )}

          {item.allergens && item.allergens.length > 0 && (
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[#A89890] block text-[10px] uppercase tracking-wider font-semibold">Allergens</span>
              <span className="font-semibold text-[#21150F] truncate block">{item.allergens.join(', ')}</span>
            </div>
          )}
        </div>
        )}

        {/* Spice Level Selector */}
        <div>
          <label className="block text-xs font-bold text-[#21150F] uppercase tracking-wider mb-2 font-serif">
            Spice Level (optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {spiceOptions.map(opt => (
              <button
                key={opt.level}
                type="button"
                onClick={() => setSpice(spice === opt.level ? undefined : opt.level)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  spice === opt.level
                    ? 'border-[#21150F] bg-[#21150F] text-[#F2E5CC] shadow-sm'
                    : 'border-[#D6C29A] bg-[#FFF8EA] hover:bg-[#ECDCB9] text-[#7A6961]'
                }`}
              >
                <div className="flex items-center mb-1 gap-0.5">
                  {Array.from({ length: opt.iconCount }).map((_, i) => (
                    <Flame
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        spice === opt.level ? 'text-[#C9A25B] fill-[#C9A25B]' : 'text-[#A89890]'
                      }`}
                    />
                  ))}
                </div>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-xs font-bold text-[#21150F] uppercase tracking-wider mb-1.5 font-serif">
            Special Culinary Instructions (Optional)
          </label>
          <textarea
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="e.g. Extra coconut chutney, less spicy, well roasted..."
            rows={2}
            maxLength={150}
            className="w-full text-xs p-3 rounded-xl border border-[#D6C29A] bg-[#F2E5CC] focus:bg-[#FFF8EA] focus:outline-hidden focus:ring-2 focus:ring-[#B96E42] transition-all resize-none text-[#21150F] placeholder-[#A89890]"
          />
          <span className="text-[10px] text-[#A89890] text-right block mt-0.5">
            {instructions.length}/150 characters
          </span>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="p-4 sm:p-5 border-t border-[#D6C29A] bg-[#F2E5CC] flex items-center justify-between gap-4 shrink-0">
        {/* Quantity Stepper */}
        <div className="flex items-center rounded-full bg-[#FFF8EA] p-1 border border-[#D6C29A] shadow-xs">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ECDCB9] text-[#21150F] active:scale-95 transition-all cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-sm font-bold font-mono text-[#21150F]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ECDCB9] text-[#21150F] active:scale-95 transition-all cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAdd}
          disabled={!item.isAvailable}
          className={`flex-1 py-3 px-5 rounded-full font-bold text-xs sm:text-sm tracking-wide text-white transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${
            item.isAvailable
              ? 'bg-[#B96E42] hover:bg-[#A55A33] shadow-[#B96E42]/25 border border-[#C9A25B]/30'
              : 'bg-[#D6C29A] cursor-not-allowed text-[#A89890]'
          }`}
        >
          <span>Add to Order</span>
          <span>•</span>
          <span className="font-serif font-bold">
            {formatINR(item.price * quantity)}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onAdd,
}) => {
  if (!item || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Box Keyed by Item ID to auto-initialize clean state */}
        <FoodDetailModalInner
          key={item.id}
          item={item}
          onClose={onClose}
          onAdd={onAdd}
        />
      </div>
    </AnimatePresence>
  );
};
