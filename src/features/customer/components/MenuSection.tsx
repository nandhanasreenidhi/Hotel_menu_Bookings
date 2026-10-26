import React from 'react';
import { Category, MenuItem } from '../../../types';
import { formatINR } from '../../../lib/utils';
import { FoodCard } from './FoodCard';
import { CATEGORY_COPY, ITEM_HINTS } from '../utils/dakshinCopy';
import { useInView } from '../hooks/useInView';

interface MenuSectionProps {
  category: Category;
  /** Position among the visible sections (drives the layout variant L1–L8 and the 0N numeral). */
  index: number;
  /** Items to show (already filtered by search / veg / chef filters). */
  items: MenuItem[];
  /** Every item in the category, unfiltered — used for the "from ₹X" price. */
  allItems: MenuItem[];
  cartQtyById: Record<string, number>;
  onOpenDetails: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem, sourceEl?: HTMLElement) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

/** Splits a heading into per-word reveal spans (same markup the design's script produced). */
export const SplitWords: React.FC<{ text: string; startIndex?: number }> = ({ text, startIndex = 0 }) => (
  <>
    {text.split(/(\s+)/).map((t, i, arr) => {
      if (!t) return null;
      if (/^\s+$/.test(t)) return <React.Fragment key={i}>{t}</React.Fragment>;
      const wordIndex = startIndex + arr.slice(0, i).filter(x => x && !/^\s+$/.test(x)).length;
      return (
        <span key={i} className="w">
          <span style={{ ['--i' as string]: wordIndex } as React.CSSProperties}>{t}</span>
        </span>
      );
    })}
  </>
);

export const MenuSection: React.FC<MenuSectionProps> = ({
  category,
  index,
  items,
  allItems,
  cartQtyById,
  onOpenDetails,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const [ref, seen] = useInView<HTMLElement>(0.12);
  const layout = index % 8; // L1..L8 cycle if an admin adds more than eight categories
  const light = layout === 2 || layout === 7;
  const copy = CATEGORY_COPY[category.id];
  const minPrice = allItems.length ? Math.min(...allItems.map(i => i.price)) : null;
  const tagline = [copy?.tagline, minPrice !== null ? `from ${formatINR(minPrice)}` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <section
      ref={ref}
      id={category.id}
      className={`sec L${layout + 1}${light ? ' lt' : ''}${seen ? ' in' : ''}`}
      data-w={copy?.word ?? category.name.split(/\s+/)[0].toUpperCase()}
    >
      <div className="wrap">
        <div className="hd">
          <b className="no">{String(index + 1).padStart(2, '0')}</b>
          <h2>
            <SplitWords text={category.name} />
          </h2>
          {tagline && <span className="tl">{tagline}</span>}
          {copy?.sticker && <span className="stk">{copy.sticker}</span>}
        </div>
        <div className="grid">
          {items.map((item, i) => (
            <FoodCard
              key={item.id}
              item={item}
              index={i}
              isWideHighlight={i === 0}
              categoryName={category.name}
              hint={ITEM_HINTS[item.id]}
              cartQuantity={cartQtyById[item.id] ?? 0}
              onOpenDetails={onOpenDetails}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
