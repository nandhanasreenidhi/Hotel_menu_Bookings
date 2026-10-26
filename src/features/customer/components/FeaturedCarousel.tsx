import React, { useEffect, useState } from 'react';
import { MenuItem, CartItem } from '../../../types';
import { formatINR } from '../../../lib/utils';
import { getFoodImageProps } from '../utils/foodImageMap';
import { useInView } from '../hooks/useInView';

interface FeaturedCarouselProps {
  featuredItems: MenuItem[];
  onAddToCart: (item: MenuItem, sourceEl?: HTMLElement) => void;
  onOpenDetails: (item: MenuItem) => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

/** "Chef's Favourites" — tap a tile to add the dish straight to the order. */
export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ featuredItems, onAddToCart, cart }) => {
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, [seen]);

  const items = featuredItems.filter(i => i.isAvailable).slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="spec" id="favs">
      <div className="wrap">
        <h2>Chef’s Favourites</h2>
        <div className="sub">The dishes the kitchen would order itself</div>
        <div ref={ref} className={`sp${seen ? ' in' : ''}${done ? ' done' : ''}`}>
          {items.map(item => {
            const qty = cart.filter(ci => ci.menuItem.id === item.id).reduce((n, ci) => n + ci.quantity, 0);
            const img = getFoodImageProps(item);
            const add = (el: HTMLElement) => onAddToCart(item, el);
            return (
              <div
                key={item.id}
                className="it"
                role="button"
                tabIndex={0}
                aria-label={`Add ${item.name} to order`}
                onClick={e => add(e.currentTarget)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    add(e.currentTarget);
                  }
                }}
              >
                <div className="t">
                  <img src={img.src} srcSet={img.srcSet} sizes="84px" alt="" loading="lazy" decoding="async" />
                </div>
                <div>
                  <h3>{item.name}</h3>
                  <small>
                    {formatINR(item.price)} · tap to add
                    {qty > 0 && <span className="inord"> · {qty} in order</span>}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
