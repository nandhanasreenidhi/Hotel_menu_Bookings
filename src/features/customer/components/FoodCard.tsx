import React from 'react';
import { MenuItem } from '../../../types';
import { formatINR } from '../../../lib/utils';
import { DietaryBadge } from '../../../components/common/DietaryBadge';
import { Plus, Minus, Flame, Sparkles, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface FoodCardProps {
  item: MenuItem;
  onOpenDetails: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity?: (itemId: string, delta: number) => void;
  cartQuantity?: number;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onOpenDetails,
  onAddToCart,
  onUpdateQuantity,
  cartQuantity = 0,
}) => {
  const isAvailable = item.isAvailable;

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3 }}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden ${
        !isAvailable ? 'opacity-70 grayscale-[30%]' : ''
      }`}
    >
      <div>
        {/* Card Image Area with Zoom effect */}
        <div
          onClick={() => onOpenDetails(item)}
          className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 cursor-pointer"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Gradient overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Badges in Top Corners */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            <DietaryBadge type={item.dietary} showLabel />
            {item.isChefSpecial && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-sm">
                <Sparkles className="w-3 h-3" />
                Chef's Signature
              </span>
            )}
          </div>

          {/* Preparation Time Pill */}
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] backdrop-blur-xs font-medium">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>{item.preparationTimeMinutes}m</span>
          </div>

          {/* Sold Out Overlay if unavailable */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-stone-900/75 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
              <span className="px-3 py-1.5 rounded-lg bg-rose-600/90 text-white text-xs font-bold tracking-wider uppercase shadow-md">
                Sold Out Today
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onOpenDetails(item)}
              className="text-base font-serif font-bold text-stone-900 line-clamp-1 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              {item.name}
            </h3>
            {item.spiceLevel && item.spiceLevel !== 'mild' && (
              <span className="shrink-0 flex items-center gap-0.5 text-xs text-amber-600 font-medium" title={`Spice: ${item.spiceLevel}`}>
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              </span>
            )}
          </div>

          <p
            onClick={() => onOpenDetails(item)}
            className="mt-1.5 text-xs text-stone-600 line-clamp-2 leading-relaxed cursor-pointer"
          >
            {item.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Add Button */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between gap-3 border-t border-stone-100">
        <div>
          <span className="text-xs text-stone-400 font-light block">Price</span>
          <span className="text-lg font-serif font-bold text-emerald-950">
            {formatINR(item.price)}
          </span>
        </div>

        <div>
          {!isAvailable ? (
            <button
              disabled
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200"
            >
              Unavailable
            </button>
          ) : cartQuantity > 0 && onUpdateQuantity ? (
            <div className="flex items-center rounded-xl bg-emerald-900 text-white shadow-sm p-0.5">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-800 active:scale-95 transition-all text-white"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold">
                {cartQuantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-800 active:scale-95 transition-all text-white"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(item)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide bg-[#132E22] hover:bg-emerald-800 active:scale-95 text-white transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};
