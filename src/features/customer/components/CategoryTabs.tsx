import React, { useRef } from 'react';
import { Category } from '../../../types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  itemCountsByCategory: Record<string, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  itemCountsByCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-[41px] z-30 bg-[#FAF8F5]/95 backdrop-blur-md py-3 border-b border-stone-200/80 shadow-xs">
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto px-4 max-w-4xl mx-auto scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map(cat => {
          const isActive = cat.id === activeCategoryId;
          const count = cat.id === 'cat-all' 
            ? Object.values(itemCountsByCategory).reduce((a, b) => a + b, 0)
            : itemCountsByCategory[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                isActive
                  ? 'bg-[#132E22] text-[#FAF8F5] shadow-md shadow-emerald-950/20 scale-[1.02]'
                  : 'bg-white text-stone-600 border border-stone-200/90 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-emerald-800 text-emerald-100'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
