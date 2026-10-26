import React, { useLayoutEffect, useRef } from 'react';
import { Category } from '../../../types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  itemCountsByCategory?: Record<string, number>;
  isVegOnly?: boolean;
  onToggleVeg?: () => void;
}

/** Sticky category chips with the sliding terracotta indicator and the "Veg only" switch. */
export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  isVegOnly = false,
  onToggleVeg,
}) => {
  const chipsRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);

  const position = () => {
    const wrap = chipsRef.current;
    const ind = indRef.current;
    if (!wrap || !ind) return;
    const active = wrap.querySelector<HTMLElement>('.chip.on');
    if (!active) {
      ind.style.width = '0px';
      return;
    }
    ind.style.left = `${active.offsetLeft}px`;
    ind.style.width = `${active.offsetWidth}px`;
  };

  useLayoutEffect(() => {
    position();
    const wrap = chipsRef.current;
    const active = wrap?.querySelector<HTMLElement>('.chip.on');
    // Scroll the chip row only (never the page) so the active chip stays visible.
    if (wrap && active) wrap.scrollTo({ left: Math.max(0, active.offsetLeft - 20), behavior: 'smooth' });
  }, [activeCategoryId, categories]);

  useLayoutEffect(() => {
    const onResize = () => position();
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(position).catch(() => undefined);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <nav className="catnav" aria-label="Menu categories">
      <div className="wrap chips" id="chips" ref={chipsRef}>
        <span className="ind" id="ind" ref={indRef} />
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`chip${cat.id === activeCategoryId ? ' on' : ''}`}
            aria-current={cat.id === activeCategoryId ? 'true' : undefined}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
        {onToggleVeg && (
          <label className="vegt">
            <input type="checkbox" checked={isVegOnly} onChange={onToggleVeg} />
            <span>Veg only</span>
          </label>
        )}
      </div>
    </nav>
  );
};
