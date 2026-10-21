import React, { useState } from 'react';
import { MenuItem, SpiceLevel } from '../../../types';
import { formatINR } from '../../../lib/utils';
import { DietaryBadge } from '../../../components/common/DietaryBadge';
import { X, Flame, Clock, Plus, Minus, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FoodDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: MenuItem, options: { spice?: SpiceLevel; instructions?: string; quantity: number }) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onAdd,
}) => {
  if (!item || !isOpen) return null;

  const [spice, setSpice] = useState<SpiceLevel>(item.spiceLevel || 'medium');
  const [instructions, setInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 z-10"
        >
          {/* Header Image */}
          <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <DietaryBadge type={item.dietary} showLabel />
                  {item.isChefSpecial && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500 text-stone-950">
                      <Sparkles className="w-3 h-3" />
                      Chef's Special
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold leading-tight">
                  {item.name}
                </h2>
              </div>
              <span className="text-xl sm:text-2xl font-serif font-bold text-amber-300 shrink-0">
                {formatINR(item.price)}
              </span>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-stone-800">
            {/* Description */}
            <p className="text-sm text-stone-600 leading-relaxed">
              {item.description}
            </p>

            {/* Quick Specs (Prep time, Calories, Allergens) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="text-stone-400 block text-[10px]">Prep Time</span>
                  <span className="font-semibold text-stone-800">{item.preparationTimeMinutes} mins</span>
                </div>
              </div>

              {item.calories && (
                <div>
                  <span className="text-stone-400 block text-[10px]">Energy</span>
                  <span className="font-semibold text-stone-800">{item.calories} kcal</span>
                </div>
              )}

              {item.allergens && item.allergens.length > 0 && (
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-stone-400 block text-[10px]">Allergens</span>
                  <span className="font-semibold text-stone-800">{item.allergens.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Spice Level Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Choose Spice Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {spiceOptions.map(opt => (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setSpice(opt.level)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      spice === opt.level
                        ? 'border-emerald-800 bg-emerald-950 text-white shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {Array.from({ length: opt.iconCount }).map((_, i) => (
                        <Flame
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            spice === opt.level ? 'text-amber-400 fill-amber-400' : 'text-stone-400'
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
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Special Cooking Instructions (Optional)
              </label>
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Less oil, extra coriander, allergy precautions..."
                rows={2}
                maxLength={150}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700 transition-all resize-none"
              />
              <span className="text-[10px] text-stone-400 text-right block mt-0.5">
                {instructions.length}/150 characters
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-stone-100 bg-white flex items-center justify-between gap-4 shrink-0">
            {/* Quantity Stepper */}
            <div className="flex items-center rounded-2xl bg-stone-100 p-1 border border-stone-200">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white text-stone-700 active:scale-95 transition-all"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white text-stone-700 active:scale-95 transition-all"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              disabled={!item.isAvailable}
              className={`flex-1 py-3 px-5 rounded-2xl font-bold text-sm tracking-wide text-white transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${
                item.isAvailable
                  ? 'bg-[#132E22] hover:bg-emerald-900 shadow-emerald-950/20'
                  : 'bg-stone-300 cursor-not-allowed text-stone-500'
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
      </div>
    </AnimatePresence>
  );
};
