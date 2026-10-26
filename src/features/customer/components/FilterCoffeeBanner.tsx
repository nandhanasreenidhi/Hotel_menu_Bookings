import React from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { formatINR } from '../../../lib/utils';
import { getFoodImageProps } from '../utils/foodImageMap';
import { useInView } from '../hooks/useInView';

interface FilterCoffeeBannerProps {
  onAddSpecialBeverage?: () => void;
}

/** "Poured high, frothed twice." — the filter coffee feature block. Adds the menu's Filter Coffee to the cart. */
export const FilterCoffeeBanner: React.FC<FilterCoffeeBannerProps> = ({ onAddSpecialBeverage }) => {
  const { menuItems, addToCart, cart } = useRestaurant();
  const [ref, seen] = useInView<HTMLElement>(0.2);

  // Find the coffee item in the existing menu. If the menu has none, the block is hidden
  // (it never advertises an unrelated dish).
  const coffeeItem = menuItems.find(
    i => i.name.toLowerCase().includes('coffee') || i.name.toLowerCase().includes('kaapi')
  );
  if (!coffeeItem) return null;

  const cartQty = cart.filter(ci => ci.menuItem.id === coffeeItem.id).reduce((n, ci) => n + ci.quantity, 0);
  const img = getFoodImageProps(coffeeItem);

  const handleAdd = () => {
    if (!coffeeItem.isAvailable) return;
    addToCart(coffeeItem);
    onAddSpecialBeverage?.();
  };

  return (
    <section ref={ref} className={`wrap cof${seen ? ' in' : ''}`}>
      <div className="art">
        <img src={img.src} srcSet={img.srcSet} sizes="(max-width: 980px) 92vw, 540px" alt="Filter coffee in a brass tumbler and davara" loading="lazy" />
      </div>
      <div>
        <div className="eyebrow">The filter coffee moment</div>
        <h2>Poured high, frothed twice.</h2>
        <p>
          Dark-roast chicory decoction, hot full-cream milk, a brass tumbler and a davara. We pull it between two
          vessels until it sings — the way the morning is meant to begin.
        </p>
        <div className="ctas">
          <button type="button" className="btn p" onClick={handleAdd} disabled={!coffeeItem.isAvailable}>
            {coffeeItem.isAvailable ? `Add ${coffeeItem.name} · ${formatINR(coffeeItem.price)}` : `${coffeeItem.name} · sold out today`}
          </button>
          {cartQty > 0 && <span className="qn">{cartQty} in your order</span>}
        </div>
      </div>
    </section>
  );
};
